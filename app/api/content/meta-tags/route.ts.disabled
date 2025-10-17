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
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL ist erforderlich' }, { status: 400 });
    }

    // Credits prüfen (1 Credit für Meta Tags)
    const hasCredits = await checkUserCredits(user.id, 1);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Nicht genügend Credits verfügbar' }, { status: 402 });
    }

    // Analysis-Eintrag erstellen
    const analysisId = await saveAnalysis({
      user_id: user.id,
      type: 'meta_tags',
      input: { url },
      status: 'processing'
    });

    try {
      // DataForSEO Content API aufrufen
      const response = await dataForSeoClient.contentAnalysis.metaTagsLive([
        {
          url,
          include_html: true,
          include_links: true
        }
      ]);

      if (!response || !response.results || response.results.length === 0) {
        throw new Error('Keine Meta Tags Daten erhalten');
      }

      const result = response.results[0];
      
      // Ergebnisse verarbeiten
      const processedResult = {
        url: result.url || url,
        title: {
          text: result.title?.text || '',
          length: result.title?.text?.length || 0,
          is_optimal: (result.title?.text?.length || 0) >= 30 && (result.title?.text?.length || 0) <= 60,
          issues: []
        },
        meta_description: {
          text: result.meta_description?.text || '',
          length: result.meta_description?.text?.length || 0,
          is_optimal: (result.meta_description?.text?.length || 0) >= 120 && (result.meta_description?.text?.length || 0) <= 160,
          issues: []
        },
        h1_tags: result.h1_tags?.map((h1: any) => ({
          text: h1.text || '',
          length: h1.text?.length || 0
        })) || [],
        h2_tags: result.h2_tags?.map((h2: any) => ({
          text: h2.text || '',
          length: h2.text?.length || 0
        })) || [],
        images: result.images?.map((img: any) => ({
          src: img.src || '',
          alt: img.alt || '',
          has_alt: !!(img.alt && img.alt.trim())
        })) || [],
        links: {
          internal: result.links?.internal || 0,
          external: result.links?.external || 0,
          nofollow: result.links?.nofollow || 0
        },
        issues: []
      };

      // Issues generieren
      const issues: any[] = [];

      // Title Issues
      if (!processedResult.title.text) {
        issues.push({
          type: 'title',
          severity: 'error',
          message: 'Title Tag fehlt',
          element: 'title'
        });
      } else if (processedResult.title.length < 30) {
        issues.push({
          type: 'title',
          severity: 'warning',
          message: 'Title zu kurz (unter 30 Zeichen)',
          element: 'title'
        });
      } else if (processedResult.title.length > 60) {
        issues.push({
          type: 'title',
          severity: 'warning',
          message: 'Title zu lang (über 60 Zeichen)',
          element: 'title'
        });
      }

      // Meta Description Issues
      if (!processedResult.meta_description.text) {
        issues.push({
          type: 'meta_description',
          severity: 'error',
          message: 'Meta Description fehlt',
          element: 'meta[name="description"]'
        });
      } else if (processedResult.meta_description.length < 120) {
        issues.push({
          type: 'meta_description',
          severity: 'warning',
          message: 'Meta Description zu kurz (unter 120 Zeichen)',
          element: 'meta[name="description"]'
        });
      } else if (processedResult.meta_description.length > 160) {
        issues.push({
          type: 'meta_description',
          severity: 'warning',
          message: 'Meta Description zu lang (über 160 Zeichen)',
          element: 'meta[name="description"]'
        });
      }

      // H1 Issues
      if (processedResult.h1_tags.length === 0) {
        issues.push({
          type: 'h1',
          severity: 'error',
          message: 'H1 Tag fehlt',
          element: 'h1'
        });
      } else if (processedResult.h1_tags.length > 1) {
        issues.push({
          type: 'h1',
          severity: 'warning',
          message: 'Mehrere H1 Tags gefunden',
          element: 'h1'
        });
      }

      // Image Issues
      const imagesWithoutAlt = processedResult.images.filter(img => !img.has_alt);
      if (imagesWithoutAlt.length > 0) {
        issues.push({
          type: 'images',
          severity: 'warning',
          message: `${imagesWithoutAlt.length} Bilder ohne Alt-Text`,
          element: 'img'
        });
      }

      processedResult.issues = issues;

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
        error: 'Fehler bei der Meta Tags Analyse',
        details: error instanceof Error ? error.message : 'Unbekannter Fehler'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Meta Tags API Error:', error);
    return NextResponse.json({ 
      error: 'Interner Serverfehler',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    }, { status: 500 });
  }
}
