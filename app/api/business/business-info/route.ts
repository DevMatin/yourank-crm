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
    const { business_name, location } = body;

    if (!business_name) {
      return NextResponse.json({ error: 'Geschäftsname ist erforderlich' }, { status: 400 });
    }

    // Credits prüfen (1 Credit für Business Info)
    const hasCredits = await checkUserCredits(user.id, 1);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'business_info',
      input: {
        business_name,
        location: location || ''
      },
      status: 'processing'
    });

    try {
      // DataForSEO Business API aufrufen
      const response = await dataForSeoClient.businessData.businessInfoLive([
        {
          business_name,
          location: location || ''
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine Business Info Daten erhalten');
      }

      const result = response.results[0];
      
      // Ergebnisse verarbeiten
      const processedResult = {
        business_name: result.business_name || business_name,
        address: result.address || '',
        phone: result.phone || '',
        website: result.website || '',
        rating: result.rating || 0,
        reviews_count: result.reviews_count || 0,
        category: result.category || '',
        hours: result.hours || '',
        description: result.description || '',
        photos_count: result.photos_count || 0,
        verified: result.verified || false,
        cid: result.cid || '',
        coordinates: {
          lat: result.coordinates?.lat || 0,
          lng: result.coordinates?.lng || 0
        },
        attributes: result.attributes || [],
        amenities: result.amenities || []
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
        error: 'Fehler bei der Business Info Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Business Info API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}
