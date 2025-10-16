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
    const { target, limit, spam_score, toxic_score } = body;

    if (!target) {
      return NextResponse.json({ error: 'Target Domain/URL ist erforderlich' }, { status: 400 });
    }

    // Credits prüfen (2 Credits für Referring Domains)
    const hasCredits = await checkUserCredits(user.id, 2);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'referring_domains',
      input: {
        target,
        limit: parseInt(limit),
        spam_score: parseInt(spam_score),
        toxic_score: parseInt(toxic_score)
      },
      status: 'processing'
    });

    try {
      // DataForSEO Backlinks API aufrufen
      const response = await dataForSeoClient.backlinks.referringDomainsLive([
        {
          target,
          limit: parseInt(limit),
          spam_score: parseInt(spam_score),
          toxic_score: parseInt(toxic_score),
          include_subdomains: true
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine Referring Domains Daten erhalten');
      }

      const result = response.results[0];
      
      // Ergebnisse verarbeiten
      const processedResults = result.items?.map((item: any) => ({
        domain: item.domain || '',
        domain_rating: item.domain_rating || 0,
        backlinks_count: item.backlinks_count || 0,
        referring_pages_count: item.referring_pages_count || 0,
        first_seen: item.first_seen || '',
        last_seen: item.last_seen || '',
        spam_score: item.spam_score || 0,
        toxic_score: item.toxic_score || 0,
        country: item.country || '',
        language: item.language || ''
      })).filter((item: any) => item.domain) || [];

      // Nach Domain Rating sortieren (höchste zuerst)
      processedResults.sort((a: any, b: any) => b.domain_rating - a.domain_rating);

      // Credits abziehen
      await deductCredits(user.id, 2);

      // Analysis updaten
      await updateAnalysis(analysisId, {
        status: 'completed',
        result: {
          total_domains: processedResults.length,
          target,
          high_quality_domains: processedResults.filter((d: any) => d.domain_rating >= 50).length,
          results: processedResults.slice(0, parseInt(limit))
        }
      });

      return NextResponse.json({
        success: true,
        analysis_id: analysisId,
        results: processedResults.slice(0, parseInt(limit)),
        total_domains: processedResults.length,
        high_quality_domains: processedResults.filter((d: any) => d.domain_rating >= 50).length
      });

    } catch (error) {
      console.error('DataForSEO API Error:', error);
      
      // Analysis als fehlgeschlagen markieren
      await updateAnalysis(analysisId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      });

      return NextResponse.json({ 
        error: 'Fehler bei der Referring Domains Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Referring Domains API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}
