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
    const { domain, location = 'Germany', language = 'German' } = body;

    // Validate input
    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    // Normalize domain
    const normalizedDomain = domain
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    // Check credits
    const requiredCredits = 3;
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { domain: normalizedDomain, location, language },
      'domain_overview',
      user.id,
      null,
      requiredCredits
    );

    try {
      // Create DataForSEO request
      const request = new DomainAnalyticsOverviewLiveRequestInfo();
      request.target = normalizedDomain;
      request.location_name = location;
      request.language_name = language;

      // Call DataForSEO API
      const result = await dataForSeoClient.domain.overviewLive([request]);

      // Process results
      const taskResult = result.tasks?.[0]?.result?.[0];
      
      if (!taskResult) {
        throw new Error('No results returned from DataForSEO');
      }

      const processedResult = {
        domain: normalizedDomain,
        domain_rank: taskResult.domain_rank || 0,
        organic_traffic: taskResult.organic_traffic || 0,
        organic_cost: taskResult.organic_cost || 0,
        organic_count: taskResult.organic_count || 0,
        keywords_count: taskResult.keywords_count || 0,
        traffic_sources: taskResult.traffic_sources || [],
        organic_keywords: taskResult.organic_keywords || [],
        competitors: taskResult.competitors || []
      };

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: processedResult
      });

      // Deduct credits
      await deductCredits(user.id, requiredCredits);

      return NextResponse.json({
        success: true,
        data: processedResult,
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
          error: 'Failed to fetch domain overview. Please try again.',
          success: false 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Domain Overview API Error:', error);
    
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
