import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { KeywordsDataGoogleAdsAdTrafficByKeywordsLiveRequestInfo } from 'dataforseo-client';

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
      bid,
      match,
      location = 'Germany', 
      language = 'German', 
      search_partners = false
    } = body;

    // Validate input
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'Keywords array is required' },
        { status: 400 }
      );
    }

    // Validate required parameters
    if (!bid || bid <= 0) {
      return NextResponse.json(
        { error: 'Bid parameter is required and must be greater than 0' },
        { status: 400 }
      );
    }

    if (!match || !['exact', 'broad', 'phrase'].includes(match)) {
      return NextResponse.json(
        { error: 'Match parameter is required and must be one of: exact, broad, phrase' },
        { status: 400 }
      );
    }

    // Validate Google Ads Ad Traffic limits
    if (keywords.length > 1000) {
      return NextResponse.json(
        { error: 'Maximum 1000 keywords allowed for Google Ads Ad Traffic' },
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

    // Check credits (3 credits per keyword)
    const requiredCredits = keywords.length * 3;
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keywords, bid, match, location, language, search_partners },
      'google_ads_ad_traffic',
      user.id,
      undefined,
      requiredCredits
    );

    try {
      // Create DataForSEO request
      const request = new KeywordsDataGoogleAdsAdTrafficByKeywordsLiveRequestInfo();
      request.keywords = keywords.map(k => k.trim());
      request.bid = bid;
      request.match = match;
      request.location_name = location;
      request.language_name = language;
      request.search_partners = search_partners;

      logger.info('Sending Google Ads Ad Traffic request to DataForSEO:', {
        keywords: request.keywords,
        bid,
        match,
        location,
        language,
        search_partners
      });

      // Call DataForSEO API with retry logic
      let result;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          result = await dataForSeoClient.keywords.googleAdsAdTrafficByKeywordsLive([request]);
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
        logger.info('No Google Ads Ad Traffic data found in DataForSEO response');
        await updateAnalysis(analysisRecord.id, {
          status: 'completed',
          result: []
        });
        
        return NextResponse.json({
          success: true,
          data: [],
          analysisId: analysisRecord.id,
          creditsUsed: 0,
          message: 'No Google Ads Ad Traffic data found for these keywords',
          source: 'DataForSEO API'
        });
      }
      
      // Verify DataForSEO data structure
      const taskResult = result.tasks[0].result[0];
      if (!taskResult || !taskResult.items || taskResult.items.length === 0) {
        throw new Error('Invalid DataForSEO data structure - no items found');
      }
      
      logger.info('✅ DataForSEO data verified - contains valid Google Ads Ad Traffic structure');

      // Process results
      const processedResults = result.tasks[0].result[0].items.map((item: any) => {
        logger.info('Processing Google Ads Ad Traffic item:', JSON.stringify(item, null, 2));
        
        return {
          keyword: item.keyword || 'Unknown',
          search_volume: item.search_volume || 0,
          competition_index: item.competition_index || 0,
          competition: item.competition || 'UNKNOWN',
          cpc: item.cpc || 0,
          ad_position: item.ad_position || 0,
          ad_position_absolute: item.ad_position_absolute || 0,
          cost: item.cost || 0,
          clicks: item.clicks || 0,
          impressions: item.impressions || 0,
          ctr: item.ctr || 0,
          keyword_info: {
            se_type: item.se_type || 'google_ads_ad_traffic',
            last_updated_time: item.last_updated_time || new Date().toISOString(),
            competition_level: item.competition || 'UNKNOWN',
            cpc: item.cpc || 0,
            search_volume: item.search_volume || 0,
            bid: bid,
            match_type: match
          }
        };
      });

      // Debug logging
      logger.info('Processed Google Ads Ad Traffic Results:', JSON.stringify(processedResults, null, 2));
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
        apiEndpoint: 'googleAdsAdTrafficByKeywordsLive',
        timestamp: new Date().toISOString(),
        dataForSeoTaskId: result.tasks[0].id
      });

    } catch (apiError) {
      logger.error('DataForSEO Google Ads Ad Traffic API Error:', apiError);
      
      // Update analysis with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: 'API call failed' }
      });

      // Enhanced error handling
      let errorMessage = 'Fehler beim Abrufen der Google Ads Ad Traffic Daten. Bitte versuche es erneut.';
      
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
    logger.error('Google Ads Ad Traffic API Error:', error);
    
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
