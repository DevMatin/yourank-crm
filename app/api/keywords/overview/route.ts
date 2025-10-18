import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { 
  DataforseoLabsGoogleRelatedKeywordsLiveRequestInfo,
  KeywordsDataGoogleAdsSearchVolumeLiveRequestInfo,
  DataforseoLabsGoogleBulkKeywordDifficultyLiveRequestInfo,
  KeywordsDataGoogleTrendsExploreLiveRequestInfo,
  KeywordsDataDataforseoTrendsDemographyLiveRequestInfo
} from 'dataforseo-client';
import { CombinedKeywordOverview, CreditBreakdown } from '@/types/analysis';

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

    // Check credits (Bundle-Preis: 3 Credits statt 5)
    const bundleCredits = 3;
    await checkUserCredits(user.id, bundleCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keyword, location, language },
      'keywords_overview',
      user.id,
      undefined,
      bundleCredits,
      'overview' // Neue Kategorie
    );

    try {
      logger.info('🚀 Starting Overview Analysis:', {
        keyword: keyword.trim(),
        location,
        language,
        userId: user.id,
        timestamp: new Date().toISOString()
      });

      // Sequentielles Laden mit Promise.allSettled für bessere Performance
      const results = await Promise.allSettled([
        // 1. Related Keywords
        (async () => {
          logger.info('🔗 Starting Related Keywords API call');
          const relatedRequest = new DataforseoLabsGoogleRelatedKeywordsLiveRequestInfo();
          relatedRequest.keyword = keyword.trim();
          relatedRequest.location_name = location;
          relatedRequest.language_name = language;
          relatedRequest.limit = 10;
          relatedRequest.depth = 1;
          relatedRequest.include_seed_keyword = false;
          
          const result = await dataForSeoClient.labs.googleRelatedKeywordsLive([relatedRequest]);
          logger.info('✅ Related Keywords API completed successfully');
          return result;
        })(),
        
        // 2. Search Volume
        (async () => {
          logger.info('📊 Starting Search Volume API call');
          const volumeRequest = new KeywordsDataGoogleAdsSearchVolumeLiveRequestInfo();
          volumeRequest.keywords = [keyword.trim()];
          volumeRequest.location_name = location;
          volumeRequest.language_name = language;
          
          const result = await dataForSeoClient.keywords.googleAdsSearchVolumeLive([volumeRequest]);
          logger.info('✅ Search Volume API completed successfully');
          return result;
        })(),
        
        // 3. Keyword Difficulty
        (async () => {
          logger.info('🎯 Starting Keyword Difficulty API call');
          const difficultyRequest = new DataforseoLabsGoogleBulkKeywordDifficultyLiveRequestInfo();
          difficultyRequest.keywords = [keyword.trim()];
          difficultyRequest.location_name = location;
          difficultyRequest.language_name = language;
          
          const result = await dataForSeoClient.labs.googleBulkKeywordDifficultyLive([difficultyRequest]);
          logger.info('✅ Keyword Difficulty API completed successfully');
          return result;
        })(),
        
        // 4. Google Trends (optional)
        (async () => {
          logger.info('📈 Starting Google Trends API call');
          const trendsRequest = new KeywordsDataGoogleTrendsExploreLiveRequestInfo();
          trendsRequest.keywords = [keyword.trim()];
          trendsRequest.location_name = location;
          trendsRequest.language_name = language;
          trendsRequest.date_from = '2023-01-01';
          trendsRequest.date_to = new Date().toISOString().split('T')[0];
          
          const result = await dataForSeoClient.keywords.googleTrendsExploreLive([trendsRequest]);
          logger.info('✅ Google Trends API completed successfully');
          return result;
        })(),
        
        // 5. Demographics (optional)
        (async () => {
          logger.info('👥 Starting Demographics API call');
          const demographicsRequest = new KeywordsDataDataforseoTrendsDemographyLiveRequestInfo();
          demographicsRequest.keywords = [keyword.trim()];
          demographicsRequest.location_name = location;
          demographicsRequest.language_name = language;
          
          const result = await dataForSeoClient.keywords.dataforseoTrendsDemographyLive([demographicsRequest]);
          logger.info('✅ Demographics API completed successfully');
          return result;
        })()
      ]);

      // Debug: Log individual API results
      logger.info('📋 Individual API Results:');
      results.forEach((result, index) => {
        const apiNames = ['Related Keywords', 'Search Volume', 'Keyword Difficulty', 'Google Trends', 'Demographics'];
        if (result.status === 'fulfilled') {
          logger.info(`  ✅ ${apiNames[index]}: SUCCESS`);
        } else {
          logger.error(`  ❌ ${apiNames[index]}: FAILED - ${result.reason}`);
        }
      });

      // Error-Handling pro Sektion
      const overview: CombinedKeywordOverview = {
        keyword: keyword.trim(),
        related: results[0].status === 'fulfilled' ? results[0].value : null,
        searchVolume: results[1].status === 'fulfilled' ? results[1].value : null,
        difficulty: results[2].status === 'fulfilled' ? results[2].value : null,
        trends: results[3].status === 'fulfilled' ? results[3].value : null,
        demographics: results[4].status === 'fulfilled' ? results[4].value : null
      };

      // Credit-Breakdown für Transparenz
      const creditBreakdown: CreditBreakdown = {
        related: 1,
        volume: 1,
        difficulty: 1,
        trends: 1,
        demographics: 1,
        bundle_discount: -3,
        total: bundleCredits
      };

      // Logging für Debugging
      logger.info('Overview API Results:', {
        keyword: overview.keyword,
        relatedSuccess: results[0].status === 'fulfilled',
        volumeSuccess: results[1].status === 'fulfilled',
        difficultySuccess: results[2].status === 'fulfilled',
        trendsSuccess: results[3].status === 'fulfilled',
        demographicsSuccess: results[4].status === 'fulfilled',
        totalResults: Object.values(overview).filter(v => v !== null).length
      });
      
      // Debug: Log actual data structure
      logger.info('Trends Data Structure:', JSON.stringify(overview.trends, null, 2));
      logger.info('Demographics Data Structure:', JSON.stringify(overview.demographics, null, 2));

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: {
          overview,
          creditBreakdown,
          timestamp: new Date().toISOString(),
          source: 'DataForSEO API (Combined)'
        }
      });

      // Deduct credits
      await deductCredits(user.id, bundleCredits);

      const response = {
        success: true,
        data: overview,
        analysisId: analysisRecord.id,
        creditsUsed: bundleCredits,
        creditBreakdown,
        source: 'DataForSEO API (Combined Overview)',
        timestamp: new Date().toISOString(),
        partialResults: {
          related: results[0].status === 'fulfilled',
          volume: results[1].status === 'fulfilled',
          difficulty: results[2].status === 'fulfilled',
          trends: results[3].status === 'fulfilled',
          demographics: results[4].status === 'fulfilled'
        }
      };

      logger.info('🎉 Overview Analysis Completed:', {
        keyword: overview.keyword,
        successCount: Object.values(response.partialResults).filter(Boolean).length,
        totalApis: 5,
        creditsUsed: bundleCredits,
        analysisId: analysisRecord.id
      });

      return NextResponse.json(response);

    } catch (apiError) {
      logger.error('Overview API Error:', apiError);
      
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
            : 'Failed to fetch overview data. Please try again.',
          success: false,
          details: apiError instanceof Error ? apiError.message : 'Unknown error',
          isConnectionError
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Overview API Error:', error);
    
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