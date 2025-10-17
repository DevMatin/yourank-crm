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
    const { text, language, include_emotions, include_keywords } = body;

    if (!text || text.length < 10) {
      return NextResponse.json({ error: 'Text muss mindestens 10 Zeichen lang sein' }, { status: 400 });
    }

    // Credits prüfen (1 Credit für Content Sentiment)
    const hasCredits = await checkUserCredits(user.id, 1);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'content_sentiment',
      input: {
        text: text.substring(0, 1000), // Limit für Performance
        language: language || 'de',
        include_emotions: include_emotions !== false,
        include_keywords: include_keywords !== false
      },
      status: 'processing'
    });

    try {
      // DataForSEO Content API aufrufen
      const response = await dataForSeoClient.contentAnalysis.sentimentAnalysisLive([
        {
          text: text.substring(0, 1000), // Limit für API
          language_code: language || 'de',
          include_emotions: include_emotions !== false,
          include_keywords: include_keywords !== false
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine Sentiment Daten erhalten');
      }

      const result = response.results[0];
      
      // Ergebnisse verarbeiten
      const processedResult = {
        sentiment: result.sentiment || 'neutral',
        confidence: result.confidence || 0,
        emotions: {
          joy: result.emotions?.joy || 0,
          sadness: result.emotions?.sadness || 0,
          anger: result.emotions?.anger || 0,
          fear: result.emotions?.fear || 0,
          surprise: result.emotions?.surprise || 0,
          disgust: result.emotions?.disgust || 0
        },
        keywords: result.keywords?.map((kw: any) => ({
          word: kw.word || '',
          sentiment: kw.sentiment || 'neutral',
          importance: kw.importance || 0
        })) || [],
        summary: result.summary || 'Keine Zusammenfassung verfügbar'
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
        error: 'Fehler bei der Sentiment Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Content Sentiment API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}
