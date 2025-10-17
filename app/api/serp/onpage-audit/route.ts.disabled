import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { createTask, processTaskAsync } from '@/lib/utils/task-handler';
import { logger } from '@/lib/logger';
import { OnPageTaskPostRequestInfo } from 'dataforseo-client';

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
      'serp_onpage_audit',
      user.id,
      null,
      requiredCredits
    );

    try {
      // Create DataForSEO request
      const request = new OnPageTaskPostRequestInfo();
      request.target = normalizedDomain;
      request.location_name = location;
      request.language_name = language;
      request.crawl_delay = 1;
      request.max_crawl_pages = 100;
      request.enable_browser_rendering = true;
      request.enable_javascript = true;
      request.enable_content_parsing = true;
      request.enable_browser_rendering = true;
      request.crawl_delay = 1;

      // Create task
      const taskId = await createTask('/v3/on_page/task_post', [request]);

      // Update analysis with task ID
      await updateAnalysis(analysisRecord.id, {
        status: 'pending',
        task_id: taskId
      });

      // Start async processing
      processTaskAsync(analysisRecord.id, taskId, '/v3/on_page/task_post');

      // Deduct credits immediately
      await deductCredits(user.id, requiredCredits);

      return NextResponse.json({
        success: true,
        taskId,
        analysisId: analysisRecord.id,
        creditsUsed: requiredCredits,
        message: 'On-Page audit started. Results will be available shortly.'
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
          error: 'Failed to start on-page audit. Please try again.',
          success: false 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('On-Page Audit API Error:', error);
    
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
