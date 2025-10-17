import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { KeywordsDataClickstreamDataBulkSearchVolumeLiveRequestInfo } from 'dataforseo-client';

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
    const { 
      keywords, 
      location_name = 'Germany',
      location_code
    } = body;

    // Validate input
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'Keywords array is required' },
        { status: 400 }
      );
    }

    // Validate Clickstream Bulk Search Volume limits
    if (keywords.length > 1000) {
      return NextResponse.json(
        { error: 'Maximum 1000 keywords allowed for Clickstream Bulk Search Volume' },
        { status: 400 }
      );
    }

    // Validate keyword length (min 3 characters)
    const invalidKeywords = keywords.filter(k => {
      const trimmed = k.trim();
      return trimmed.length < 3;
    });
    if (invalidKeywords.length > 0) {
      return NextResponse.json(
        { error: 'Keywords must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Validate location (either location_name or location_code required)
    if (!location_name && !location_code) {
      return NextResponse.json(
        { error: 'Either location_name or location_code is required' },
        { status: 400 }
      );
    }

    // Check credits (1 credit per keyword)
    const requiredCredits = keywords.length * 1;
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keywords, location_name, location_code },
      'clickstream_bulk_search_volume',
      user.id,
      undefined,
      requiredCredits
    );

    try {
      // Create DataForSEO request
      const request = new KeywordsDataClickstreamDataBulkSearchVolumeLiveRequestInfo();
      request.keywords = keywords.map(k => k.trim());
      if (location_name) {
        request.location_name = location_name;
      }
      if (location_code) {
        request.location_code = location_code;
      }

      logger.info('Sending Clickstream Bulk Search Volume request to DataForSEO:', {
        keywords: request.keywords,
        location_name: request.location_name,
        location_code: request.location_code
      });

      // Call DataForSEO API with retry logic
      let result;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          result = await dataForSeoClient.keywords.clickstreamDataBulkSearchVolumeLive([request]);
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
        logger.info('No Clickstream Bulk Search Volume data found in DataForSEO response');
        await updateAnalysis(analysisRecord.id, {
          status: 'completed',
          result: []
        });
        
        return NextResponse.json({
          success: true,
          data: [],
          analysisId: analysisRecord.id,
          creditsUsed: 0,
          message: 'No Clickstream Bulk Search Volume data found for these keywords',
          source: 'DataForSEO API'
        });
      }
      
      // Verify DataForSEO data structure
      const taskResult = result.tasks[0].result[0];
      if (!taskResult || !taskResult.items || taskResult.items.length === 0) {
        throw new Error('Invalid DataForSEO data structure - no items found');
      }
      
      logger.info('✅ DataForSEO data verified - contains valid Clickstream Bulk Search Volume structure');

      // Process results
      const processedResults = result.tasks[0].result[0].items.map((item: any) => {
        logger.info('Processing Clickstream Bulk Search Volume item:', JSON.stringify(item, null, 2));
        
        return {
          keyword: item.keyword || 'Unknown',
          search_volume: item.search_volume || 0,
          competition_index: item.competition_index || 0,
          competition: item.competition || 'UNKNOWN',
          cpc: item.cpc || 0,
          monthly_searches: item.monthly_searches || [],
          keyword_info: {
            se_type: item.se_type || 'clickstream_bulk_search_volume',
            last_updated_time: item.last_updated_time || new Date().toISOString(),
            competition_level: item.competition || 'UNKNOWN',
            cpc: item.cpc || 0,
            search_volume: item.search_volume || 0,
            monthly_searches: item.monthly_searches || []
          }
        };
      });

      // Debug logging
      logger.info('Processed Clickstream Bulk Search Volume Results:', JSON.stringify(processedResults, null, 2));
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
        apiEndpoint: 'clickstreamDataBulkSearchVolumeLive',
        timestamp: new Date().toISOString(),
        dataForSeoTaskId: result.tasks[0].id
      });

    } catch (apiError) {
      logger.error('DataForSEO Clickstream Bulk Search Volume API Error:', apiError);
      
      // Update analysis with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: 'API call failed' }
      });

      // Enhanced error handling
      let errorMessage = 'Fehler beim Abrufen der Clickstream Bulk Search Volume Daten. Bitte versuche es erneut.';
      
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
    logger.error('Clickstream Bulk Search Volume API Error:', error);
    
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
