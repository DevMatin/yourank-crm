import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { KeywordsDataGoogleTrendsExploreLiveRequestInfo } from 'dataforseo-client';

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
    const { keywords, location = 'Germany', language = 'German', date_from, date_to, time_range, item_types, type = 'web', category_code = 0 } = body;

    // Validate input
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'Keywords array is required' },
        { status: 400 }
      );
    }

    // Validate Google Trends limits
    if (keywords.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 keywords allowed for Google Trends' },
        { status: 400 }
      );
    }

    // Validate item_types restrictions
    if (item_types && (item_types.includes('google_trends_topics_list') || item_types.includes('google_trends_queries_list')) && keywords.length > 1) {
      return NextResponse.json(
        { error: 'Only 1 keyword allowed for topics/queries list' },
        { status: 400 }
      );
    }

    // Check credits
    const requiredCredits = keywords.length * 3; // 3 credits per keyword for trends
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keywords, location, language, date_from, date_to, time_range, item_types, type, category_code },
      'google_trends_explore',
      user.id,
      undefined,
      requiredCredits
    );

    try {
      // Create DataForSEO request
      const request = new KeywordsDataGoogleTrendsExploreLiveRequestInfo();
      request.keywords = keywords.map(k => k.trim());
      request.location_name = location;
      request.language_name = language;
      request.type = type;
      request.category_code = category_code;
      if (date_from) request.date_from = date_from;
      if (date_to) request.date_to = date_to;
      if (time_range) request.time_range = time_range;
      if (item_types) request.item_types = item_types;

      logger.info('Sending Google Trends Explore request to DataForSEO:', {
        keywords: request.keywords,
        location,
        language,
        type,
        category_code,
        date_from,
        date_to,
        time_range,
        item_types
      });

      // Call DataForSEO API with retry logic
      let result;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          result = await dataForSeoClient.keywords.googleTrendsExploreLive([request]);
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
        logger.info('No Google Trends data found in DataForSEO response');
        await updateAnalysis(analysisRecord.id, {
          status: 'completed',
          result: []
        });
        
        return NextResponse.json({
          success: true,
          data: [],
          analysisId: analysisRecord.id,
          creditsUsed: 0,
          message: 'No Google Trends data found for these keywords',
          source: 'DataForSEO API'
        });
      }
      
      // Verify DataForSEO data structure
      const taskResult = result.tasks[0].result[0];
      if (!taskResult || !taskResult.items || taskResult.items.length === 0) {
        throw new Error('Invalid DataForSEO data structure - no items found');
      }
      
      logger.info('✅ DataForSEO data verified - contains valid Google Trends structure');

      // Process results
      const processedResults = result.tasks[0].result[0].items.map((item: any) => {
        logger.info('Processing Google Trends item:', JSON.stringify(item, null, 2));
        
        return {
          keyword: item.keyword || 'Unknown',
          type: item.type || 'web',
          location_name: item.location_name || location,
          language_name: item.language_name || language,
          date_from: item.date_from || date_from,
          date_to: item.date_to || date_to,
          google_trends_graph: item.google_trends_graph || null,
          google_trends_map: item.google_trends_map || null,
          google_trends_topics_list: item.google_trends_topics_list || [],
          google_trends_queries_list: item.google_trends_queries_list || [],
          trend_info: {
            se_type: 'google_trends',
            last_updated_time: new Date().toISOString(),
            keyword: item.keyword || 'Unknown',
            type: item.type || 'web',
            location: item.location_name || location,
            language: item.language_name || language
          }
        };
      });

      // Debug logging
      logger.info('Processed Google Trends Results:', JSON.stringify(processedResults, null, 2));
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
        apiEndpoint: 'googleTrendsExploreLive',
        timestamp: new Date().toISOString(),
        dataForSeoTaskId: result.tasks[0].id
      });

    } catch (apiError) {
      logger.error('DataForSEO Google Trends API Error:', apiError);
      
      // Update analysis with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: 'API call failed' }
      });

      // Enhanced error handling
      let errorMessage = 'Fehler beim Abrufen der Google Trends Daten. Bitte versuche es erneut.';
      
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
    logger.error('Google Trends Explore API Error:', error);
    
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
