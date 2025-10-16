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
    const { target, device, strategy } = body;

    if (!target) {
      return NextResponse.json({ error: 'Target URL ist erforderlich' }, { status: 400 });
    }

    // Credits prüfen (1 Credit für Page Speed)
    const hasCredits = await checkUserCredits(user.id, 1);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'pagespeed',
      input: {
        target,
        device: device || 'both',
        strategy: strategy || 'both'
      },
      status: 'processing'
    });

    try {
      const results: any[] = [];
      
      // Je nach Device-Einstellung analysieren
      const devices = device === 'both' ? ['mobile', 'desktop'] : [device];
      
      for (const deviceType of devices) {
        // DataForSEO OnPage API aufrufen
        const response = await dataForSeoClient.onpage.pagespeedLive([
          {
            target,
            device: deviceType,
            strategy: strategy || 'both'
          }
        ]);

        if (response && response.results && response.results.length > 0) {
          const result = response.results[0];
          
          // Ergebnisse verarbeiten
          const processedResult = {
            url: result.url || target,
            device: deviceType,
            performance_score: result.performance_score || 0,
            first_contentful_paint: result.first_contentful_paint || 0,
            largest_contentful_paint: result.largest_contentful_paint || 0,
            first_input_delay: result.first_input_delay || 0,
            cumulative_layout_shift: result.cumulative_layout_shift || 0,
            speed_index: result.speed_index || 0,
            time_to_interactive: result.time_to_interactive || 0,
            total_blocking_time: result.total_blocking_time || 0,
            opportunities: result.opportunities?.map((opp: any) => ({
              id: opp.id || '',
              title: opp.title || '',
              description: opp.description || '',
              score: opp.score || 0,
              savings: opp.savings || ''
            })) || [],
            diagnostics: result.diagnostics?.map((diag: any) => ({
              id: diag.id || '',
              title: diag.title || '',
              description: diag.description || '',
              score: diag.score || 0
            })) || []
          };

          results.push(processedResult);
        }
      }

      if (results.length === 0) {
        throw new Error('Keine Page Speed Daten erhalten');
      }

      // Credits abziehen
      await deductCredits(user.id, 1);

      // Analysis updaten
      await updateAnalysis(analysisId, {
        status: 'completed',
        result: {
          total_analyses: results.length,
          target,
          average_score: results.reduce((sum, r) => sum + r.performance_score, 0) / results.length,
          results
        }
      });

      return NextResponse.json({
        success: true,
        analysis_id: analysisId,
        results,
        total_analyses: results.length,
        average_score: results.reduce((sum, r) => sum + r.performance_score, 0) / results.length
      });

    } catch (error) {
      console.error('DataForSEO API Error:', error);
      
      // Analysis als fehlgeschlagen markieren
      await updateAnalysis(analysisId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      });

      return NextResponse.json({ 
        error: 'Fehler bei der Page Speed Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Page Speed API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}
