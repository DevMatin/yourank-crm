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
    const { keyword, location_code, language_code, limit } = body;

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword ist erforderlich' }, { status: 400 });
    }

    // Credits prüfen (2 Credits für Google Shopping)
    const hasCredits = await checkUserCredits(user.id, 2);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'google_shopping',
      input: {
        keyword,
        location_code: parseInt(location_code),
        language_code,
        limit: parseInt(limit)
      },
      status: 'processing'
    });

    try {
      // DataForSEO Merchant API aufrufen
      const response = await dataForSeoClient.merchant.googleShoppingLive([
        {
          keyword,
          location_code: parseInt(location_code),
          language_code,
          limit: parseInt(limit)
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine Google Shopping Daten erhalten');
      }

      const result = response.results[0];
      
      // Ergebnisse verarbeiten
      const processedResult = {
        keyword,
        total_count: result.total_count || 0,
        items: result.items?.map((item: any) => ({
          title: item.title || '',
          price: item.price || '',
          currency: item.currency || 'EUR',
          seller: item.seller || '',
          rating: item.rating || 0,
          reviews_count: item.reviews_count || 0,
          image_url: item.image_url || '',
          product_url: item.product_url || ''
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
        error: 'Fehler bei der Google Shopping Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Google Shopping API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}