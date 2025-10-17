import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { DataforseoLabsGoogleKeywordOverviewLiveRequestInfo } from 'dataforseo-client';

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
    const { keyword, location = 'Germany', language = 'German' } = body;

    // Validate input
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    // Check credits
    const requiredCredits = 2;
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keyword, location, language },
      'keywords_overview',
      user.id,
      undefined,
      requiredCredits
    );

    try {
      // Create DataForSEO request
      const request = new DataforseoLabsGoogleKeywordOverviewLiveRequestInfo();
      request.keywords = [keyword.trim()]; // Use keywords array, not keyword
      request.location_name = location;
      request.language_name = language;

      logger.info('Sending request to DataForSEO:', {
        keyword: keyword.trim(),
        location,
        language
      });

      // Call DataForSEO API with retry logic
      let result;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          result = await dataForSeoClient.labs.googleKeywordOverviewLive([request]);
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
        logger.info('No keyword overview data found in DataForSEO response');
        await updateAnalysis(analysisRecord.id, {
          status: 'completed',
          result: []
        });
        
        return NextResponse.json({
          success: true,
          data: [],
          analysisId: analysisRecord.id,
          creditsUsed: 0,
          message: 'No keyword overview data found for this term',
          source: 'DataForSEO API'
        });
      }
      
      // Verify DataForSEO data structure
      const taskResult = result.tasks[0].result[0];
      if (!taskResult || !taskResult.items || taskResult.items.length === 0) {
        throw new Error('Invalid DataForSEO data structure - no items found');
      }
      const firstItem = taskResult.items[0];
      if (!firstItem.keyword_info) {
        throw new Error('Invalid DataForSEO data structure - missing keyword_info');
      }
      
      logger.info('✅ DataForSEO data verified - contains valid keyword_info structure');

      // Process results
      const processedResults = result.tasks[0].result[0].items.map((item: any) => {
        logger.info('Processing item:', JSON.stringify(item, null, 2));
        
        return {
          keyword: item.keyword || 'Unknown',
          search_volume: item.keyword_info?.search_volume || 0,
          competition: item.keyword_info?.competition_level === 'HIGH' ? 0.8 :
                      item.keyword_info?.competition_level === 'MEDIUM' ? 0.5 : 0.2,
          cpc: item.keyword_info?.cpc || 0,
          trend: item.keyword_info?.search_volume_trend?.yearly || 0,
          keyword_info: {
            se_type: item.keyword_info?.se_type || 'google',
            last_updated_time: item.keyword_info?.last_updated_time || new Date().toISOString(),
            competition_level: item.keyword_info?.competition_level || 'LOW',
            cpc: item.keyword_info?.cpc || 0,
            search_volume: item.keyword_info?.search_volume || 0,
            monthly_searches: item.keyword_info?.monthly_searches || [],
            keyword_properties: {
              se_type: item.keyword_info?.se_type || 'google',
              core_keyword: item.keyword_properties?.core_keyword || keyword,
              synonym_keywords: item.keyword_properties?.synonym_keywords || [],
              related_keywords: item.keyword_properties?.related_keywords || [],
              ngram_keywords: item.keyword_properties?.ngram_keywords || []
            }
          }
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
        apiEndpoint: 'googleKeywordOverviewLive',
        timestamp: new Date().toISOString(),
        dataForSeoTaskId: result.tasks[0].id
      });

    } catch (apiError) {
      logger.error('DataForSEO API Error:', apiError);
      
      // Update analysis with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: 'API call failed' }
      });

      // Enhanced error handling
      let errorMessage = 'Fehler beim Abrufen der Keyword-Übersicht. Bitte versuche es erneut.';
      
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
    logger.error('Keyword Overview API Error:', error);
    
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
