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
    const { seller_name } = body;

    if (!seller_name) {
      return NextResponse.json({ error: 'Verkäufer-Name ist erforderlich' }, { status: 400 });
    }

    // Credits prüfen (1 Credit für Seller Data)
    const hasCredits = await checkUserCredits(user.id, 1);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'seller_data',
      input: { seller_name },
      status: 'processing'
    });

    try {
      // DataForSEO Merchant API aufrufen
      const response = await dataForSeoClient.merchant.sellerDataLive([
        {
          seller_name
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine Seller Data erhalten');
      }

      const result = response.results[0];
      
      // Ergebnisse verarbeiten
      const processedResult = {
        seller_name: result.seller_name || seller_name,
        seller_rating: result.seller_rating || 0,
        total_reviews: result.total_reviews || 0,
        total_products: result.total_products || 0,
        seller_url: result.seller_url || '',
        seller_type: result.seller_type || 'Unknown',
        verified: result.verified || false,
        location: result.location || '',
        join_date: result.join_date || '',
        performance_metrics: {
          response_rate: result.performance_metrics?.response_rate || 0,
          shipping_time: result.performance_metrics?.shipping_time || 0,
          return_rate: result.performance_metrics?.return_rate || 0
        }
      };

      // Credits abziehen
      await deductCredits(user.id, 1);

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
        error: 'Fehler bei der Seller Data Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Seller Data API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}
