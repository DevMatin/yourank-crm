import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { dataForSeoClient } from '@/lib/dataforseo/client';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { target, limit, anchor_type } = body;

    if (!target) {
      return NextResponse.json({ error: 'Target Domain/URL ist erforderlich' }, { status: 400 });
    }

    // Credits prüfen (1 Credit für Anchor Text)
    const hasCredits = await checkUserCredits(user.id, 1);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'anchor_text',
      input: {
        target,
        limit: parseInt(limit),
        anchor_type: anchor_type || 'all'
      },
      status: 'processing'
    });

    try {
      // DataForSEO Backlinks API aufrufen
      const response = await dataForSeoClient.backlinks.anchorTextLive([
        {
          target,
          limit: parseInt(limit),
          anchor_type: anchor_type || 'all'
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine Anchor Text Daten erhalten');
      }

      const result = response.results[0];
      
      // Ergebnisse verarbeiten
      const processedResults = result.items?.map((item: any) => ({
        anchor: item.anchor || '',
        count: item.count || 0,
        percentage: item.percentage || 0,
        domains_count: item.domains_count || 0,
        first_seen: item.first_seen || '',
        last_seen: item.last_seen || '',
        anchor_type: item.anchor_type || 'unknown'
      })).filter((item: any) => item.anchor) || [];

      // Nach Count sortieren (häufigste zuerst)
      processedResults.sort((a: any, b: any) => b.count - a.count);

      // Credits abziehen
      await deductCredits(user.id, 1);

      // Analysis updaten
      await updateAnalysis(analysisId, {
        status: 'completed',
        result: {
          total_anchors: processedResults.length,
          target,
          results: processedResults.slice(0, parseInt(limit))
        }
      });

      return NextResponse.json({
        success: true,
        analysis_id: analysisId,
        results: processedResults.slice(0, parseInt(limit)),
        total_anchors: processedResults.length
      });

    } catch (error) {
      console.error('DataForSEO API Error:', error);
      
      // Analysis als fehlgeschlagen markieren
      await updateAnalysis(analysisId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      });

      return NextResponse.json({ 
        error: 'Fehler bei der Anchor Text Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Anchor Text API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}
