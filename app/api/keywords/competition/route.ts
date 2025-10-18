import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { 
  DataforseoLabsGoogleBulkKeywordDifficultyLiveRequestInfo,
  DataforseoLabsGoogleCompetitorsDomainLiveRequestInfo
} from 'dataforseo-client';
import { KeywordCompetitionResult } from '@/types/analysis';

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
      'keywords_competition',
      user.id,
      undefined,
      bundleCredits,
      'competition'
    );

    try {
      // Sequentielles Laden mit Promise.allSettled für bessere Performance
      const results = await Promise.allSettled([
        // 1. Keyword Difficulty
        (async () => {
          const difficultyRequest = new DataforseoLabsGoogleBulkKeywordDifficultyLiveRequestInfo();
          difficultyRequest.keywords = [keyword.trim()];
          difficultyRequest.location_name = location;
          difficultyRequest.language_name = language;
          
          return await dataForSeoClient.labs.googleBulkKeywordDifficultyLive([difficultyRequest]);
        })(),
        
        // 2. Competitors Domain (Top 10 aus SERP)
        (async () => {
          const competitorsRequest = new DataforseoLabsGoogleCompetitorsDomainLiveRequestInfo();
          competitorsRequest.keyword = keyword.trim();
          competitorsRequest.location_name = location;
          competitorsRequest.language_name = language;
          competitorsRequest.limit = 10;
          
          return await dataForSeoClient.labs.googleCompetitorsDomainLive([competitorsRequest]);
        })()
      ]);

      // Error-Handling pro Sektion
      const difficultyData = results[0].status === 'fulfilled' ? results[0].value : null;
      const competitorsData = results[1].status === 'fulfilled' ? results[1].value : null;

      // Process difficulty data
      let difficulty = 0;
      if (difficultyData?.tasks?.[0]?.result?.[0]?.items?.[0]) {
        difficulty = difficultyData.tasks[0].result[0].items[0].keyword_difficulty || 0;
      }

      // Process competitors data
      let competitors: any[] = [];
      let totalCompetitors = 0;
      let averageDifficulty = 0;

      if (competitorsData?.tasks?.[0]?.result?.[0]?.items) {
        competitors = competitorsData.tasks[0].result[0].items.map((item: any) => ({
          domain: item.domain || 'Unknown',
          domain_authority: item.domain_authority || 0,
          organic_position: item.organic_position || 0,
          traffic_estimate: item.traffic_estimate || 0,
          visibility: item.visibility || 0,
          keywords_count: item.keywords_count || 0
        }));
        
        totalCompetitors = competitors.length;
        
        // Calculate average difficulty from competitors
        if (competitors.length > 0) {
          const totalAuthority = competitors.reduce((sum, comp) => sum + comp.domain_authority, 0);
          averageDifficulty = totalAuthority / competitors.length;
        }
      }

      const competitionResult: KeywordCompetitionResult = {
        keyword: keyword.trim(),
        difficulty: difficultyData,
        competitors,
        totalCompetitors,
        averageDifficulty,
        apiEndpoint: '/v3/dataforseo_labs/google/competitors_domain/live',
        creditsUsed: bundleCredits
      };

      // Logging für Debugging
      logger.info('Competition API Results:', {
        keyword: competitionResult.keyword,
        difficultySuccess: results[0].status === 'fulfilled',
        competitorsSuccess: results[1].status === 'fulfilled',
        difficulty: difficulty,
        competitorsCount: totalCompetitors,
        averageDifficulty: averageDifficulty
      });

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: {
          competition: competitionResult,
          timestamp: new Date().toISOString(),
          source: 'DataForSEO API (Competition Bundle)'
        }
      });

      // Deduct credits
      await deductCredits(user.id, bundleCredits);

      return NextResponse.json({
        success: true,
        data: competitionResult,
        analysisId: analysisRecord.id,
        creditsUsed: bundleCredits,
        source: 'DataForSEO API (Competition Bundle)',
        timestamp: new Date().toISOString(),
        partialResults: {
          difficulty: results[0].status === 'fulfilled',
          competitors: results[1].status === 'fulfilled'
        }
      });

    } catch (apiError) {
      logger.error('Competition API Error:', apiError);
      
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
            : 'Failed to fetch competition data. Please try again.',
          success: false,
          details: apiError instanceof Error ? apiError.message : 'Unknown error',
          isConnectionError
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Competition API Error:', error);
    
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
