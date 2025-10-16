import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase/server';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { fetchDataForSeo } from '@/lib/dataforseo/client';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { app_name, country, language } = body;

    if (!app_name) {
      return NextResponse.json({ error: 'App-Name ist erforderlich' }, { status: 400 });
    }

    // Credits prüfen (2 Credits für App Store)
    const hasCredits = await checkUserCredits(user.id, 2);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisRecord = await saveAnalysis(
      {
        app_name,
        country: country || 'de',
        language: language || 'de'
      },
      'appdata_app_store',
      user.id,
      undefined,
      2
    );

    try {
      // DataForSEO AppData API aufrufen
      const response = await fetchDataForSeo('/v3/app_data/app_store/task_post', [
        {
          app_name,
          country: country || 'de',
          language: language || 'de'
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine App Store Daten erhalten');
      }

      const result = response.results[0];
      
      // Ergebnisse verarbeiten
      const processedResult = {
        app_name: result.app_name || app_name,
        app_id: result.app_id || '',
        category: result.category || '',
        rating: result.rating || 0,
        reviews_count: result.reviews_count || 0,
        downloads: result.downloads || '',
        price: result.price || '',
        developer: result.developer || '',
        version: result.version || '',
        last_updated: result.last_updated || '',
        size: result.size || '',
        age_rating: result.age_rating || '',
        screenshots: result.screenshots || [],
        description: result.description || '',
        keywords: result.keywords || [],
        ranking: {
          category_rank: result.ranking?.category_rank || 0,
          overall_rank: result.ranking?.overall_rank || 0
        }
      };

      // Credits abziehen
      await deductCredits(user.id, 2);

      // Analysis updaten
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: processedResult
      });

      return NextResponse.json({
        success: true,
        analysis_id: analysisRecord.id,
        result: processedResult
      });

    } catch (error) {
      console.error('DataForSEO API Error:', error);
      
      // Analysis als fehlgeschlagen markieren
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: error instanceof Error ? error.message : 'Unbekannter Fehler' }
      });

      return NextResponse.json({ 
        error: 'Fehler bei der App Store Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('App Store API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}
