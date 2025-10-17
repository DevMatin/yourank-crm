import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { KeywordsDataGoogleAdsSearchVolumeLiveRequestInfo } from 'dataforseo-client';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { keywords, location = 'Germany', language = 'German', date_from, date_to, search_partners = false, include_adult_keywords = false, sort_by = 'relevance' } = body;

    // Validate input
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'Keywords array is required' },
        { status: 400 }
      );
    }

    // Validate Google Ads Search Volume limits
    if (keywords.length > 1000) {
      return NextResponse.json(
        { error: 'Maximum 1000 keywords allowed for Google Ads Search Volume' },
        { status: 400 }
      );
    }

    // Validate keyword length and word count
    const invalidKeywords = keywords.filter(k => {
      const trimmed = k.trim();
      return trimmed.length > 80 || trimmed.split(' ').length > 10;
    });
    if (invalidKeywords.length > 0) {
      return NextResponse.json(
        { error: 'Keywords must be maximum 80 characters and 10 words long' },
        { status: 400 }
      );
    }

    // Check credits (Google Ads API typically costs more)
    const requiredCredits = keywords.length * 2; // 2 credits per keyword
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keywords, location, language, date_from, date_to, search_partners, include_adult_keywords, sort_by },
      'google_ads_search_volume',
      user.id,
      undefined,
      requiredCredits
    );

    try {
      // Create DataForSEO request
      const request = new KeywordsDataGoogleAdsSearchVolumeLiveRequestInfo();
      request.keywords = keywords.map(k => k.trim());
      request.location_name = location;
      request.language_name = language;
      request.search_partners = search_partners;
      request.include_adult_keywords = include_adult_keywords;
      request.sort_by = sort_by;
      if (date_from) request.date_from = date_from;
      if (date_to) request.date_to = date_to;

      logger.info('Sending Google Ads Search Volume request to DataForSEO:', {
        keywords: request.keywords,
        location,
        language,
        search_partners,
        include_adult_keywords,
        sort_by,
        date_from,
        date_to
      });

      // Call DataForSEO API with retry logic
      let result;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          result = await dataForSeoClient.keywords.googleAdsSearchVolumeLive([request]);
          break; // Success, exit retry loop
        } catch (retryError) {
          retryCount++;
          logger.warn(`DataForSEO API attempt ${retryCount} failed:`, retryError);
          if (retryCount >= maxRetries) {
            throw retryError; // Re-throw the last error
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      logger.info('DataForSEO API Response:', JSON.stringify(result, null, 2));

      // Check if we have valid results
      if (!result?.tasks?.[0]?.result?.[0]?.items || result.tasks[0].result[0].items.length === 0) {
        logger.info('No Google Ads search volume data found in DataForSEO response');
        await updateAnalysis(analysisRecord.id, {
          status: 'completed',
          result: []
        });
        
        return NextResponse.json({
          success: true,
          data: [],
          analysisId: analysisRecord.id,
          creditsUsed: 0,
          message: 'No Google Ads search volume data found for these keywords',
          source: 'DataForSEO API'
        });
      }
      
      // Verify DataForSEO data structure
      const taskResult = result.tasks[0].result[0];
      if (!taskResult || !taskResult.items || taskResult.items.length === 0) {
        throw new Error('Invalid DataForSEO data structure - no items found');
      }
      
      logger.info('✅ DataForSEO data verified - contains valid Google Ads search volume structure');

      // Process results
      const processedResults = result.tasks[0].result[0].items.map((item: any) => {
        logger.info('Processing Google Ads item:', JSON.stringify(item, null, 2));
        
        return {
          keyword: item.keyword || 'Unknown',
          search_volume: item.search_volume || 0,
          competition_index: item.competition_index || 0,
          competition: item.competition || 'UNKNOWN',
          cpc: item.cpc || 0,
          low_top_of_page_bid: item.low_top_of_page_bid || 0,
          high_top_of_page_bid: item.high_top_of_page_bid || 0,
          monthly_searches: item.monthly_searches || [],
          keyword_info: {
            se_type: item.se_type || 'google_ads',
            last_updated_time: item.last_updated_time || new Date().toISOString(),
            competition_level: item.competition || 'UNKNOWN',
            cpc: item.cpc || 0,
            search_volume: item.search_volume || 0,
            monthly_searches: item.monthly_searches || []
          }
        };
      });

      // Debug logging
      logger.info('Processed Google Ads Results:', JSON.stringify(processedResults, null, 2));
      logger.info('Results count:', processedResults.length);

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: processedResults
      });

      // Deduct credits
      await deductCredits(user.id, requiredCredits);

      return NextResponse.json({
        success: true,
        data: processedResults,
        analysisId: analysisRecord.id,
        creditsUsed: requiredCredits,
        source: 'DataForSEO API',
        apiEndpoint: 'googleAdsSearchVolumeLive',
        timestamp: new Date().toISOString(),
        dataForSeoTaskId: result.tasks[0].id
      });

    } catch (apiError) {
      logger.error('DataForSEO Google Ads API Error:', apiError);
      
      // Update analysis with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: 'API call failed' }
      });

      // Enhanced error handling
      let errorMessage = 'Fehler beim Abrufen der Google Ads Suchvolumen-Daten. Bitte versuche es erneut.';
      
      if (apiError instanceof Error) {
        if (apiError.message.includes('ECONNRESET') || 
            apiError.message.includes('aborted') || 
            apiError.message.includes('network')) {
          errorMessage = 'Verbindungsfehler zur DataForSEO API. Bitte versuche es in ein paar Sekunden erneut.';
        } else if (apiError.message.includes('Invalid DataForSEO data structure')) {
          errorMessage = 'Ungültige Datenstruktur von DataForSEO. Bitte kontaktiere den Support.';
        } else {
          errorMessage = `API-Fehler: ${apiError.message}`;
        }
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          success: false 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Google Ads Search Volume API Error:', error);
    
    if (error instanceof Error && error.message.includes('Insufficient credits')) {
      return NextResponse.json(
        { error: error.message },
        { status: 402 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}
