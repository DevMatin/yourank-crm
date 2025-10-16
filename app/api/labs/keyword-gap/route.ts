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
    const { target_domain, competitor_domains, location_code, language_code, limit } = body;

    if (!target_domain || !competitor_domains) {
      return NextResponse.json({ error: 'Target domain und competitor domains sind erforderlich' }, { status: 400 });
    }

    // Credits prüfen (3 Credits für Keyword Gap)
    const hasCredits = await checkUserCredits(user.id, 3);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'keyword_gap',
      input: {
        target_domain,
        competitor_domains: competitor_domains.split(',').map((d: string) => d.trim()),
        location_code: parseInt(location_code),
        language_code,
        limit: parseInt(limit)
      },
      status: 'processing'
    });

    try {
      // DataForSEO Labs API aufrufen
      const competitorDomainsList = competitor_domains.split(',').map((d: string) => d.trim());
      
      const response = await dataForSeoClient.labs.googleKeywordIdeasLive([
        {
          target: target_domain,
          competitors: competitorDomainsList,
          location_code: parseInt(location_code),
          language_code,
          limit: parseInt(limit),
          include_serp_info: true
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine Keyword Gap Daten erhalten');
      }

      const result = response.results[0];
      
      // Keyword Gap Score berechnen
      const processedResults = result.items?.map((item: any) => ({
        keyword: item.keyword_data?.keyword || '',
        search_volume: item.keyword_data?.search_volume || 0,
        competition: item.keyword_data?.competition || 0,
        cpc: item.keyword_data?.cpc || 0,
        difficulty: item.keyword_data?.keyword_difficulty || 0,
        gap_score: calculateGapScore(item, competitorDomainsList)
      })).filter((item: any) => item.gap_score > 0) || [];

      // Nach Gap Score sortieren (höchste zuerst)
      processedResults.sort((a: any, b: any) => b.gap_score - a.gap_score);

      // Credits abziehen
      await deductCredits(user.id, 3);

      // Analysis updaten
      await updateAnalysis(analysisId, {
        status: 'completed',
        result: {
          total_keywords: processedResults.length,
          target_domain,
          competitor_domains: competitorDomainsList,
          results: processedResults.slice(0, parseInt(limit))
        }
      });

      return NextResponse.json({
        success: true,
        analysis_id: analysisId,
        results: processedResults.slice(0, parseInt(limit)),
        total_keywords: processedResults.length
      });

    } catch (error) {
      console.error('DataForSEO API Error:', error);
      
      // Analysis als fehlgeschlagen markieren
      await updateAnalysis(analysisId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      });

      return NextResponse.json({ 
        error: 'Fehler bei der Keyword Gap Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Keyword Gap API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}

function calculateGapScore(item: any, competitorDomains: string[]): number {
  // Vereinfachte Gap Score Berechnung
  // In der Realität würde man die SERP-Positionen der Konkurrenten analysieren
  
  const searchVolume = item.keyword_data?.search_volume || 0;
  const competition = item.keyword_data?.competition || 0;
  const difficulty = item.keyword_data?.keyword_difficulty || 0;
  
  // Gap Score basierend auf Volumen, niedriger Competition und niedriger Difficulty
  let gapScore = 0;
  
  if (searchVolume > 1000) gapScore += 40;
  else if (searchVolume > 500) gapScore += 30;
  else if (searchVolume > 100) gapScore += 20;
  else gapScore += 10;
  
  if (competition < 30) gapScore += 30;
  else if (competition < 50) gapScore += 20;
  else if (competition < 70) gapScore += 10;
  
  if (difficulty < 40) gapScore += 30;
  else if (difficulty < 60) gapScore += 20;
  else if (difficulty < 80) gapScore += 10;
  
  return Math.min(gapScore, 100);
}
