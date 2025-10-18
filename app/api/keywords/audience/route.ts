import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { 
  KeywordsDataDataforseoTrendsDemographyLiveRequestInfo,
  KeywordsDataBingAudienceEstimationLiveRequestInfo
} from 'dataforseo-client';
import { KeywordAudienceResult } from '@/types/analysis';

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

    // Bundle-Preis: 2 Credits für beide APIs
    const bundleCredits = 2;
    await checkUserCredits(user.id, bundleCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keyword, location, language },
      'keywords_audience',
      user.id,
      undefined,
      bundleCredits,
      'audience'
    );

    try {
      // Sequentielles Laden mit Promise.allSettled für bessere Performance
      const results = await Promise.allSettled([
        // 1. DataForSEO Trends Demography
        (async () => {
          const demographyRequest = new KeywordsDataDataforseoTrendsDemographyLiveRequestInfo();
          demographyRequest.keyword = keyword.trim();
          demographyRequest.location_name = location;
          demographyRequest.language_name = language;
          
          return await dataForSeoClient.keywords.dataforseoTrendsDemographyLive([demographyRequest]);
        })(),
        
        // 2. Bing Audience Estimation
        (async () => {
          const audienceRequest = new KeywordsDataBingAudienceEstimationLiveRequestInfo();
          audienceRequest.keyword = keyword.trim();
          audienceRequest.location_name = location;
          audienceRequest.language_name = language;
          
          return await dataForSeoClient.keywords.bingAudienceEstimationLive([audienceRequest]);
        })()
      ]);

      // Error-Handling pro Sektion
      const demographyData = results[0].status === 'fulfilled' ? results[0].value : null;
      const audienceData = results[1].status === 'fulfilled' ? results[1].value : null;

      // Process demography data
      let topAgeGroups: any[] = [];
      let deviceDistribution: any = {};
      
      if (demographyData?.tasks?.[0]?.result?.[0]?.items?.[0]) {
        const item = demographyData.tasks[0].result[0].items[0];
        topAgeGroups = item.age_groups || [];
        deviceDistribution = item.device_distribution || {};
      }

      // Process audience data
      let topProfessions: any[] = [];
      let targetingRecommendations: string[] = [];
      
      if (audienceData?.tasks?.[0]?.result?.[0]?.items?.[0]) {
        const item = audienceData.tasks[0].result[0].items[0];
        topProfessions = item.professions || [];
        
        // Generate targeting recommendations based on data
        if (topAgeGroups.length > 0) {
          const topAgeGroup = topAgeGroups[0];
          targetingRecommendations.push(`Primary Age Group: ${topAgeGroup.age_group}`);
        }
        
        if (topProfessions.length > 0) {
          const topProfession = topProfessions[0];
          targetingRecommendations.push(`Top Profession: ${topProfession.profession}`);
        }
        
        if (deviceDistribution.mobile > deviceDistribution.desktop) {
          targetingRecommendations.push('Mobile-First Audience');
        } else {
          targetingRecommendations.push('Desktop-Focused Audience');
        }
      }

      const audienceResult: KeywordAudienceResult = {
        keyword: keyword.trim(),
        demographics: demographyData,
        bingAudience: audienceData,
        topAgeGroups,
        topProfessions,
        deviceDistribution,
        targetingRecommendations,
        apiEndpoint: '/v3/keywords_data/dataforseo_trends/demography/live',
        creditsUsed: bundleCredits
      };

      // Logging für Debugging
      logger.info('Audience API Results:', {
        keyword: audienceResult.keyword,
        demographySuccess: results[0].status === 'fulfilled',
        audienceSuccess: results[1].status === 'fulfilled',
        ageGroupsCount: topAgeGroups.length,
        professionsCount: topProfessions.length,
        recommendationsCount: targetingRecommendations.length
      });

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: {
          audience: audienceResult,
          timestamp: new Date().toISOString(),
          source: 'DataForSEO API (Audience Bundle)'
        }
      });

      // Deduct credits
      await deductCredits(user.id, bundleCredits);

      return NextResponse.json({
        success: true,
        data: audienceResult,
        analysisId: analysisRecord.id,
        creditsUsed: bundleCredits,
        source: 'DataForSEO API (Audience Bundle)',
        timestamp: new Date().toISOString(),
        partialResults: {
          demography: results[0].status === 'fulfilled',
          audience: results[1].status === 'fulfilled'
        }
      });

    } catch (apiError) {
      logger.error('Audience API Error:', apiError);
      
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
            : 'Failed to fetch audience data. Please try again.',
          success: false,
          details: apiError instanceof Error ? apiError.message : 'Unknown error',
          isConnectionError
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Audience API Error:', error);
    
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
