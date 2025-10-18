import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { 
  KeywordsDataDataforseoTrendsMergedDataLiveRequestInfo,
  KeywordsDataDataforseoTrendsSubregionInterestsLiveRequestInfo
} from 'dataforseo-client';
import { KeywordTrendsResult } from '@/types/analysis';

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
    const { keyword, location = 'Germany', language = 'German', date_from, date_to } = body;

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
      { keyword, location, language, date_from, date_to },
      'keywords_trends',
      user.id,
      undefined,
      bundleCredits,
      'trends'
    );

    try {
      // Sequentielles Laden mit Promise.allSettled für bessere Performance
      const results = await Promise.allSettled([
        // 1. DataForSEO Trends Merged Data (Historical Volume)
        (async () => {
          const trendsRequest = new KeywordsDataDataforseoTrendsMergedDataLiveRequestInfo();
          trendsRequest.keyword = keyword.trim();
          trendsRequest.location_name = location;
          trendsRequest.language_name = language;
          trendsRequest.date_from = date_from || '2023-01-01';
          trendsRequest.date_to = date_to || new Date().toISOString().split('T')[0];
          
          return await dataForSeoClient.keywords.dataforseoTrendsMergedDataLive([trendsRequest]);
        })(),
        
        // 2. DataForSEO Trends Subregion Interests
        (async () => {
          const subregionRequest = new KeywordsDataDataforseoTrendsSubregionInterestsLiveRequestInfo();
          subregionRequest.keyword = keyword.trim();
          subregionRequest.location_name = location;
          subregionRequest.language_name = language;
          
          return await dataForSeoClient.keywords.dataforseoTrendsSubregionInterestsLive([subregionRequest]);
        })()
      ]);

      // Error-Handling pro Sektion
      const trendsData = results[0].status === 'fulfilled' ? results[0].value : null;
      const subregionData = results[1].status === 'fulfilled' ? results[1].value : null;

      // Process trends data (Historical Volume)
      let historicalData: any[] = [];
      let trendDirection: 'up' | 'down' | 'stable' = 'stable';
      let peakMonth = '';
      
      if (trendsData?.tasks?.[0]?.result?.[0]?.items?.[0]) {
        const item = trendsData.tasks[0].result[0].items[0];
        historicalData = item.monthly_searches || [];
        
        // Calculate trend direction
        if (historicalData.length >= 2) {
          const firstValue = historicalData[0].search_volume || 0;
          const lastValue = historicalData[historicalData.length - 1].search_volume || 0;
          const change = ((lastValue - firstValue) / firstValue) * 100;
          
          if (change > 10) trendDirection = 'up';
          else if (change < -10) trendDirection = 'down';
          else trendDirection = 'stable';
        }
        
        // Find peak month
        if (historicalData.length > 0) {
          const peak = historicalData.reduce((max, item) => 
            (item.search_volume || 0) > (max.search_volume || 0) ? item : max
          );
          peakMonth = peak.month || '';
        }
      }

      // Process subregion data
      let subregions: any[] = [];
      
      if (subregionData?.tasks?.[0]?.result?.[0]?.items?.[0]) {
        const item = subregionData.tasks[0].result[0].items[0];
        subregions = item.subregion_interests || [];
      }

      const trendsResult: KeywordTrendsResult = {
        keyword: keyword.trim(),
        historicalData,
        subregions,
        seasonalPatterns: trendsData?.tasks?.[0]?.result?.[0]?.items?.[0]?.seasonal_patterns || null,
        trendDirection,
        peakMonth,
        apiEndpoint: '/v3/keywords_data/dataforseo_trends/merged_data/live',
        creditsUsed: bundleCredits
      };

      // Logging für Debugging
      logger.info('Trends API Results:', {
        keyword: trendsResult.keyword,
        trendsSuccess: results[0].status === 'fulfilled',
        subregionSuccess: results[1].status === 'fulfilled',
        historicalDataPoints: historicalData.length,
        subregionsCount: subregions.length,
        trendDirection,
        peakMonth
      });

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: {
          trends: trendsResult,
          timestamp: new Date().toISOString(),
          source: 'DataForSEO API (Trends Bundle)'
        }
      });

      // Deduct credits
      await deductCredits(user.id, bundleCredits);

      return NextResponse.json({
        success: true,
        data: trendsResult,
        analysisId: analysisRecord.id,
        creditsUsed: bundleCredits,
        source: 'DataForSEO API (Trends Bundle)',
        timestamp: new Date().toISOString(),
        partialResults: {
          trends: results[0].status === 'fulfilled',
          subregions: results[1].status === 'fulfilled'
        }
      });

    } catch (apiError) {
      logger.error('Trends API Error:', apiError);
      
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
            : 'Failed to fetch trends data. Please try again.',
          success: false,
          details: apiError instanceof Error ? apiError.message : 'Unknown error',
          isConnectionError
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Trends API Error:', error);
    
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
