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
    const { keyword, location, location_code, language_code, limit } = body;

    if (!keyword || !location) {
      return NextResponse.json({ error: 'Suchbegriff und Ort sind erforderlich' }, { status: 400 });
    }

    // Credits prüfen (2 Credits für Local Finder)
    const hasCredits = await checkUserCredits(user.id, 2);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'local_finder',
      input: {
        keyword,
        location,
        location_code: parseInt(location_code),
        language_code,
        limit: parseInt(limit)
      },
      status: 'processing'
    });

    try {
      // DataForSEO Business API aufrufen
      const response = await dataForSeoClient.businessData.googleLocalFinderLive([
        {
          keyword,
          location,
          location_code: parseInt(location_code),
          language_code,
          limit: parseInt(limit)
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine Local Finder Daten erhalten');
      }

      const result = response.results[0];
      
      // Ergebnisse verarbeiten
      const processedResult = {
        keyword,
        location,
        total_count: result.total_count || 0,
        businesses: result.items?.map((item: any) => ({
          name: item.name || '',
          address: item.address || '',
          phone: item.phone || '',
          website: item.website || '',
          rating: item.rating || 0,
          reviews_count: item.reviews_count || 0,
          category: item.category || '',
          hours: item.hours || '',
          photos_count: item.photos_count || 0,
          verified: item.verified || false,
          cid: item.cid || ''
        })) || []
      };

      // Credits abziehen
      await deductCredits(user.id, 2);

      // Analysis updaten
      await updateAnalysis(analysisId, {
        status: 'completed',
        result: processedResult
      });

      return NextResponse.json({
        success: true,
        analysis_id: analysisId,
        result: processedResult
      });

    } catch (error) {
      console.error('DataForSEO API Error:', error);
      
      // Analysis als fehlgeschlagen markieren
      await updateAnalysis(analysisId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      });

      return NextResponse.json({ 
        error: 'Fehler bei der Local Finder Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Local Finder API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}
