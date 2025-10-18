import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { 
  KeywordsDataClickstreamDataGlobalSearchVolumeLiveRequestInfo,
  KeywordsDataGoogleAdsAdTrafficByKeywordsLiveRequestInfo
} from 'dataforseo-client';
import { KeywordPerformanceResult } from '@/types/analysis';

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
    const { keyword, location = 'Germany', language = 'German', bid } = body;

    // Validate input
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    // Bundle-Preis: 2 Credits für beide APIs
    const bundleCredits = 2;
    await checkUserCredits(user.id, bundleCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keyword, location, language, bid },
      'keywords_performance',
      user.id,
      undefined,
      bundleCredits,
      'performance'
    );

    try {
      // Sequentielles Laden mit Promise.allSettled für bessere Performance
      const results = await Promise.allSettled([
        // 1. Clickstream Global Search Volume (Organic Traffic)
        (async () => {
          const clickstreamRequest = new KeywordsDataClickstreamDataGlobalSearchVolumeLiveRequestInfo();
          clickstreamRequest.keywords = [keyword.trim()];
          clickstreamRequest.location_name = location;
          clickstreamRequest.language_name = language;
          
          return await dataForSeoClient.keywords.clickstreamDataGlobalSearchVolumeLive([clickstreamRequest]);
        })(),
        
        // 2. Google Ads Ad Traffic (Paid Traffic Potential)
        (async () => {
          const adTrafficRequest = new KeywordsDataGoogleAdsAdTrafficByKeywordsLiveRequestInfo();
          adTrafficRequest.keywords = [keyword.trim()];
          adTrafficRequest.location_name = location;
          adTrafficRequest.language_name = language;
          if (bid) {
            adTrafficRequest.bid = bid;
          }
          
          return await dataForSeoClient.keywords.googleAdsAdTrafficByKeywordsLive([adTrafficRequest]);
        })()
      ]);

      // Error-Handling pro Sektion
      const clickstreamData = results[0].status === 'fulfilled' ? results[0].value : null;
      const adTrafficData = results[1].status === 'fulfilled' ? results[1].value : null;

      // Process clickstream data (Organic Traffic)
      let organicTraffic = 0;
      let organicCtr = 0;
      let organicImpressions = 0;
      
      if (clickstreamData?.tasks?.[0]?.result?.[0]?.items?.[0]) {
        const item = clickstreamData.tasks[0].result[0].items[0];
        organicTraffic = item.search_volume || 0;
        organicCtr = item.ctr || 0;
        organicImpressions = item.impressions || 0;
      }

      // Process ad traffic data (Paid Traffic)
      let paidTraffic = 0;
      let paidCtr = 0;
      let paidImpressions = 0;
      let estimatedClicks = 0;
      let estimatedCost = 0;
      let cpc = 0;
      
      if (adTrafficData?.tasks?.[0]?.result?.[0]?.items?.[0]) {
        const item = adTrafficData.tasks[0].result[0].items[0];
        paidTraffic = item.search_volume || 0;
        paidCtr = item.ctr || 0;
        paidImpressions = item.impressions || 0;
        estimatedClicks = item.clicks || 0;
        estimatedCost = item.cost || 0;
        cpc = item.cpc || 0;
      }

      const performanceResult: KeywordPerformanceResult = {
        keyword: keyword.trim(),
        clickstream: clickstreamData,
        adTraffic: adTrafficData,
        organicTraffic,
        paidTraffic,
        ctr: Math.max(organicCtr, paidCtr),
        estimatedClicks,
        estimatedCost,
        apiEndpoint: '/v3/keywords_data/google_ads/ad_traffic_by_keywords/live',
        creditsUsed: bundleCredits
      };

      // Logging für Debugging
      logger.info('Performance API Results:', {
        keyword: performanceResult.keyword,
        clickstreamSuccess: results[0].status === 'fulfilled',
        adTrafficSuccess: results[1].status === 'fulfilled',
        organicTraffic,
        paidTraffic,
        estimatedClicks,
        estimatedCost
      });

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: {
          performance: performanceResult,
          timestamp: new Date().toISOString(),
          source: 'DataForSEO API (Performance Bundle)'
        }
      });

      // Deduct credits
      await deductCredits(user.id, bundleCredits);

      return NextResponse.json({
        success: true,
        data: performanceResult,
        analysisId: analysisRecord.id,
        creditsUsed: bundleCredits,
        source: 'DataForSEO API (Performance Bundle)',
        timestamp: new Date().toISOString(),
        partialResults: {
          clickstream: results[0].status === 'fulfilled',
          adTraffic: results[1].status === 'fulfilled'
        }
      });

    } catch (apiError) {
      logger.error('Performance API Error:', apiError);
      
      // Update analysis with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: 'API call failed', details: apiError instanceof Error ? apiError.message : 'Unknown error' }
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
            : 'Failed to fetch performance data. Please try again.',
          success: false,
          details: apiError instanceof Error ? apiError.message : 'Unknown error',
          isConnectionError
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Performance API Error:', error);
    
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
