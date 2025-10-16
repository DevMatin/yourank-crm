import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getTaskStatus } from '@/lib/utils/task-handler';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const supabase = await createServerSupabaseClient();
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get analysis record to verify ownership and get endpoint
    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', user.id)
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Determine endpoint based on analysis type
    const endpoint = getEndpointForAnalysisType(analysis.type);
    
    // Get task status
    const taskResult = await getTaskStatus(taskId, endpoint);

    return NextResponse.json({
      status: taskResult.status,
      result: taskResult.result,
      error: taskResult.error
    });

  } catch (error) {
    logger.error('Task Status API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        status: 'failed'
      },
      { status: 500 }
    );
  }
}

function getEndpointForAnalysisType(analysisType: string): string {
  // Map analysis types to their corresponding DataForSEO endpoints
  const endpointMap: Record<string, string> = {
    'onpage_audit': '/v3/on_page/task_get',
    'serp_onpage_audit': '/v3/on_page/task_get',
    'domain_traffic': '/v3/domain_analytics/traffic_analytics/task_get',
    'backlinks_overview': '/v3/backlinks/summary/task_get',
    'labs_keyword_gap': '/v3/dataforseo_labs/google/keyword_ideas/task_get',
    'labs_competitors': '/v3/dataforseo_labs/google/competitors_domain/task_get',
  };

  return endpointMap[analysisType] || '/v3/on_page/task_get'; // Default fallback
}
