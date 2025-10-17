import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { DataforseoLabsGoogleKeywordSuggestionsLiveRequestInfo } from 'dataforseo-client';

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
    const { keyword, location = 'Germany', language = 'German', limit = 10 } = body;

    // Validate input
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    // Check credits
    const requiredCredits = 1;
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keyword, location, language, limit },
      'keywords_suggestions',
      user.id,
      undefined,
      requiredCredits
    );

    try {
      // Create DataForSEO request for keyword suggestions
      const request = new DataforseoLabsGoogleKeywordSuggestionsLiveRequestInfo();
      request.keyword = keyword.trim();
      request.location_name = location;
      request.language_name = language;
      request.limit = limit;
      request.include_seed_keyword = false;

      logger.info('Sending request to DataForSEO:', {
        keyword: request.keyword,
        location: request.location_name,
        language: request.language_name,
        limit: request.limit
      });

      // Call DataForSEO Labs API for keyword suggestions
      let result;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          result = await dataForSeoClient.labs.googleKeywordSuggestionsLive([request]);
          break; // Success, exit retry loop
        } catch (retryError) {
          retryCount++;
          logger.warn(`DataForSEO API attempt ${retryCount} failed:`, retryError);
          
          if (retryCount >= maxRetries) {
            throw retryError; // Re-throw the last error
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      // Debug logging
      logger.info('DataForSEO API Response:', JSON.stringify(result, null, 2));
      logger.info('Tasks count:', result?.tasks?.length);
      logger.info('First task result:', result?.tasks?.[0]?.result);
      logger.info('First task items count:', result?.tasks?.[0]?.result?.[0]?.items?.length);
      
      // Verify DataForSEO source
      if (!result?.tasks?.[0]?.result) {
        throw new Error('Invalid DataForSEO response structure');
      }
      
      const taskResult = result.tasks[0].result[0];
      if (!taskResult?.items || taskResult.items.length === 0) {
        logger.warn('No items in DataForSEO response');
        return NextResponse.json({
          success: true,
          data: [],
          analysisId: analysisRecord.id,
          creditsUsed: 0,
          message: 'No keyword suggestions found for this term',
          source: 'DataForSEO API'
        });
      }
      
      // Verify DataForSEO data structure
      const firstItem = taskResult.items[0];
      if (!firstItem.keyword_info) {
        throw new Error('Invalid DataForSEO data structure - missing keyword_info');
      }
      
      logger.info('✅ DataForSEO data verified - contains valid keyword_info structure');

      // Process results
      const processedResults = taskResult.items.map((item: any) => {
        logger.info('Processing item:', JSON.stringify(item, null, 2));
        
        return {
          keyword: item.keyword || 'Unknown',
          search_volume: item.keyword_info?.search_volume || 0,
          competition: item.keyword_info?.competition_level === 'HIGH' ? 0.8 :
                      item.keyword_info?.competition_level === 'MEDIUM' ? 0.5 : 0.2,
          cpc: item.keyword_info?.cpc || 0,
          trend: item.keyword_info?.search_volume_trend?.yearly || 0,
          monthly_searches: item.keyword_info?.monthly_searches || []
        };
      });

      // Debug logging
      logger.info('Processed Results:', JSON.stringify(processedResults, null, 2));
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
        apiEndpoint: 'googleKeywordSuggestionsLive',
        timestamp: new Date().toISOString(),
        dataForSeoTaskId: result.tasks?.[0]?.id
      });

    } catch (apiError) {
      logger.error('DataForSEO API Error:', apiError);
      
      // Update analysis with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: 'API call failed' }
      });

      // Check if it's a connection error
      const isConnectionError = apiError instanceof Error && 
        (apiError.message.includes('ECONNRESET') || 
         apiError.message.includes('aborted') ||
         apiError.message.includes('network'));

      return NextResponse.json(
        { 
          error: isConnectionError 
            ? 'Verbindungsfehler zur DataForSEO API. Bitte versuche es erneut.'
            : 'Failed to fetch keyword suggestions. Please try again.',
          success: false,
          details: apiError instanceof Error ? apiError.message : 'Unknown error',
          isConnectionError
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Keyword Suggestions API Error:', error);
    
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
