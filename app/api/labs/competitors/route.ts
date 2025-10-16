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
    const { domain, location_code, language_code, limit, include_subdomains } = body;

    if (!domain) {
      return NextResponse.json({ error: 'Domain ist erforderlich' }, { status: 400 });
    }

    // Credits prüfen (2 Credits für Competitors)
    const hasCredits = await checkUserCredits(user.id, 2);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'competitors',
      input: {
        domain,
        location_code: parseInt(location_code),
        language_code,
        limit: parseInt(limit),
        include_subdomains: include_subdomains || false
      },
      status: 'processing'
    });

    try {
      // DataForSEO Labs API aufrufen
      const response = await dataForSeoClient.labs.googleCompetitorsDomainLive([
        {
          target: domain,
          location_code: parseInt(location_code),
          language_code,
          limit: parseInt(limit),
          include_subdomains: include_subdomains || false
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine Competitors Daten erhalten');
      }

      const result = response.results[0];
      
      // Ergebnisse verarbeiten
      const processedResults = result.items?.map((item: any) => ({
        domain: item.domain || '',
        common_keywords: item.common_keywords || 0,
        keyword_gaps: item.keyword_gaps || 0,
        avg_position: item.avg_position || 0,
        traffic_estimate: item.traffic_estimate || 0,
        domain_rating: item.domain_rating || 0,
        backlinks: item.backlinks || 0,
        referring_domains: item.referring_domains || 0,
        organic_keywords: item.organic_keywords || 0,
        paid_keywords: item.paid_keywords || 0
      })).filter((item: any) => item.domain && item.common_keywords > 0) || [];

      // Nach Common Keywords sortieren (höchste zuerst)
      processedResults.sort((a: any, b: any) => b.common_keywords - a.common_keywords);

      // Credits abziehen
      await deductCredits(user.id, 2);

      // Analysis updaten
      await updateAnalysis(analysisId, {
        status: 'completed',
        result: {
          total_competitors: processedResults.length,
          target_domain: domain,
          top_competitor: processedResults[0]?.domain || '',
          results: processedResults.slice(0, parseInt(limit))
        }
      });

      return NextResponse.json({
        success: true,
        analysis_id: analysisId,
        results: processedResults.slice(0, parseInt(limit)),
        total_competitors: processedResults.length,
        top_competitor: processedResults[0]?.domain || ''
      });

    } catch (error) {
      console.error('DataForSEO API Error:', error);
      
      // Analysis als fehlgeschlagen markieren
      await updateAnalysis(analysisId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      });

      return NextResponse.json({ 
        error: 'Fehler bei der Competitors Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Competitors API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}
