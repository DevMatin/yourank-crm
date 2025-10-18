import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { validateOverviewData } from '@/lib/utils/dataforseo-validator';
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
    const { keyword, location = 'Germany', language = 'German', selectedApis = ['searchVolume', 'difficulty', 'trends', 'demographics', 'relatedKeywords'] } = body;

    // Validate input
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    // Calculate credits based on selected APIs (Bundle-Preise)
    const calculateCredits = (apis: string[]) => {
      const count = apis.length;
      if (count >= 5) return 3;
      if (count >= 4) return 3;
      if (count >= 3) return 2;
      if (count >= 2) return 2;
      if (count === 1) return 1;
      return 0;
    };
    
    const requiredCredits = calculateCredits(selectedApis);
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keyword, location, language },
      'keywords_overview',
      user.id,
      undefined,
      requiredCredits,
      'overview'
    );

    try {
      logger.info('🚀 Starting Overview Analysis:', {
        keyword: keyword.trim(),
        location,
        language,
        selectedApis,
        requiredCredits,
        userId: user.id,
        timestamp: new Date().toISOString()
      });

      // Conditional API calls based on selectedApis
      const apiCalls: Promise<any>[] = [];
      
      if (selectedApis.includes('relatedKeywords')) {
        apiCalls.push((async () => {
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
          return { type: 'relatedKeywords', data: result };
        })());
      }
      
      if (selectedApis.includes('searchVolume')) {
        apiCalls.push((async () => {
          logger.info('📊 Starting Search Volume API call');
          const volumeRequest = new KeywordsDataGoogleAdsSearchVolumeLiveRequestInfo();
          volumeRequest.keywords = [keyword.trim()];
          volumeRequest.location_name = location;
          volumeRequest.language_name = language;
          
          const result = await dataForSeoClient.keywords.googleAdsSearchVolumeLive([volumeRequest]);
          logger.info('✅ Search Volume API completed successfully');
          return { type: 'searchVolume', data: result };
        })());
      }
      
      if (selectedApis.includes('difficulty')) {
        apiCalls.push((async () => {
          logger.info('🎯 Starting Keyword Difficulty API call');
          const difficultyRequest = new DataforseoLabsGoogleBulkKeywordDifficultyLiveRequestInfo();
          difficultyRequest.keywords = [keyword.trim()];
          difficultyRequest.location_name = location;
          difficultyRequest.language_name = language;
          
          const result = await dataForSeoClient.labs.googleBulkKeywordDifficultyLive([difficultyRequest]);
          logger.info('✅ Keyword Difficulty API completed successfully');
          return { type: 'difficulty', data: result };
        })());
      }
      
      if (selectedApis.includes('trends')) {
        apiCalls.push((async () => {
          logger.info('📈 Starting Google Trends API call');
          const trendsRequest = new KeywordsDataGoogleTrendsExploreLiveRequestInfo();
          trendsRequest.keywords = [keyword.trim()];
          trendsRequest.location_name = location;
          trendsRequest.language_name = language;
          trendsRequest.date_from = '2023-01-01';
          trendsRequest.date_to = new Date().toISOString().split('T')[0];
          
          const result = await dataForSeoClient.keywords.googleTrendsExploreLive([trendsRequest]);
          logger.info('✅ Google Trends API completed successfully');
          return { type: 'trends', data: result };
        })());
      }
      
      if (selectedApis.includes('demographics')) {
        apiCalls.push((async () => {
          logger.info('👥 Starting Demographics API call');
          const demographicsRequest = new KeywordsDataDataforseoTrendsDemographyLiveRequestInfo();
          demographicsRequest.keywords = [keyword.trim()];
          demographicsRequest.location_name = location;
          
          const result = await dataForSeoClient.keywords.dataforseoTrendsDemographyLive([demographicsRequest]);
          logger.info('✅ Demographics API completed successfully');
          return { type: 'demographics', data: result };
        })());
      }

      const results = await Promise.allSettled(apiCalls);

      // Log results with improved formatting
      const apiNames = ['Related Keywords', 'Search Volume', 'Keyword Difficulty', 'Google Trends', 'Demographics'];
      results.forEach((result, index) => {
        const apiName = apiNames[index] || `API ${index + 1}`;
        
        if (result.status === 'fulfilled') {
          logger.apiStatus(apiName, 'SUCCESS', {
            responseSize: JSON.stringify(result.value).length,
            hasData: !!result.value,
            timestamp: new Date().toISOString()
          });
          logger.apiDebug(`${apiName} - Response Data`, result.value);
        } else {
          logger.apiStatus(apiName, 'FAILED', {
            error: result.reason,
            timestamp: new Date().toISOString()
          });
          logger.apiDebug(`${apiName} - Error Details`, {
            error: result.reason,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Build overview object with conditional data
      const overview: CombinedKeywordOverview = {
        keyword: keyword.trim(),
        related: null,
        searchVolume: null,
        difficulty: null,
        trends: null,
        demographics: null
      };

      // Process results and assign to overview
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { type, data } = result.value;
          switch (type) {
            case 'relatedKeywords':
              overview.related = data;
              break;
            case 'searchVolume':
              overview.searchVolume = data;
              break;
            case 'difficulty':
              overview.difficulty = data;
              break;
            case 'trends':
              overview.trends = data;
              break;
            case 'demographics':
              overview.demographics = data;
              break;
          }
        }
      });

      // Validate the overview data before saving
      const validation = validateOverviewData(overview);
      
      logger.info('Overview Data Validation in API', {
        isValid: validation.isValid,
        totalErrors: validation.errors.length,
        totalWarnings: validation.warnings.length,
        apiStatus: {
          searchVolume: validation.apiStatus.searchVolume.isValid,
          difficulty: validation.apiStatus.difficulty.isValid,
          trends: validation.apiStatus.trends.isValid,
          demographics: validation.apiStatus.demographics.isValid,
          relatedKeywords: validation.apiStatus.relatedKeywords.isValid
        }
      });
      
      // Log warnings and errors
      if (validation.warnings.length > 0) {
        logger.warn('Overview Data Warnings in API', validation.warnings);
      }
      
      if (validation.errors.length > 0) {
        logger.error('Overview Data Errors in API', validation.errors);
      }

      // Calculate credit breakdown
      const creditBreakdown: CreditBreakdown = {
        total: requiredCredits,
        related: selectedApis.includes('relatedKeywords') ? 1 : 0,
        volume: selectedApis.includes('searchVolume') ? 1 : 0,
        difficulty: selectedApis.includes('difficulty') ? 1 : 0,
        trends: selectedApis.includes('trends') ? 1 : 0,
        demographics: selectedApis.includes('demographics') ? 1 : 0,
        bundle_discount: 0
      };

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: {
          overview,
          creditBreakdown,
          timestamp: new Date().toISOString(),
          source: 'DataForSEO API (Combined)',
          validation: validation,
          selectedApis
        }
      });

      // Deduct credits
      await deductCredits(user.id, requiredCredits);

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      logger.info('🎉 Overview Analysis Completed:', {
        keyword: keyword.trim(),
        successCount,
        totalApis: selectedApis.length,
        creditsUsed: requiredCredits,
        analysisId: analysisRecord.id
      });

      const response = {
        success: true,
        data: overview,
        analysisId: analysisRecord.id,
        creditsUsed: requiredCredits,
        creditBreakdown,
        validation: {
          isValid: validation.isValid,
          errors: validation.errors,
          warnings: validation.warnings,
          apiStatus: validation.apiStatus
        },
        selectedApis
      };

      return NextResponse.json(response);

    } catch (error) {
      logger.error('Overview Analysis Failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        keyword: keyword.trim(),
        userId: user.id,
        timestamp: new Date().toISOString()
      });

      // Update analysis record with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed'
      });

      return NextResponse.json(
        { 
          error: 'Analysis failed', 
          details: error instanceof Error ? error.message : 'Unknown error',
          analysisId: analysisRecord.id
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Overview API Route Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getApiDescription(api: string): string {
  const descriptions: Record<string, string> = {
    'searchVolume': 'Search Volume & CPC Data',
    'difficulty': 'Keyword Difficulty Score',
    'trends': 'Google Trends Analysis',
    'demographics': 'User Demographics',
    'relatedKeywords': 'Related Keywords Research'
  };
  return descriptions[api] || api;
}