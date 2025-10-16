import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';

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
    const requiredCredits = 1;
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keyword, location, language },
      'keywords_difficulty',
      user.id,
      null,
      requiredCredits
    );

    try {
      // Create DataForSEO request
      const request = new KeywordsDataGoogleAdsKeywordDifficultyLiveRequestInfo();
      request.keywords = [keyword.trim()];
      request.location_name = location;
      request.language_name = language;

      // Call DataForSEO API
      const result = await dataForSeoClient.keywords.googleAdsKeywordDifficultyLive([request]);

      // Process results
      const processedResults = result.tasks?.[0]?.result?.[0]?.items?.map((item: any) => ({
        keyword: item.keyword,
        difficulty: item.keyword_difficulty || 0,
        search_volume: item.search_volume || 0,
        competition: item.competition || 0,
        cpc: item.cpc || 0,
        trend: item.trend || 0,
        difficulty_info: {
          se_type: item.se_type || 'google',
          last_updated_time: item.last_updated_time || new Date().toISOString(),
          competition_level: item.competition_level || 0,
          cpc: item.cpc || 0,
          search_volume: item.search_volume || 0,
          monthly_searches: item.monthly_searches || []
        }
      })) || [];

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
        creditsUsed: requiredCredits
      });

    } catch (apiError) {
      logger.error('DataForSEO API Error:', apiError);
      
      // Update analysis with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: 'API call failed' }
      });

      return NextResponse.json(
        { 
          error: 'Failed to analyze keyword difficulty. Please try again.',
          success: false 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Keyword Difficulty API Error:', error);
    
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
