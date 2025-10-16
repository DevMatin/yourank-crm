import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cancelTask } from '@/lib/utils/task-handler';
import { updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';

export async function POST(
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

    // Get analysis record to verify ownership
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

    // Check if task can be cancelled (only if still processing)
    if (analysis.status !== 'processing') {
      return NextResponse.json(
        { error: 'Task cannot be cancelled in current state' },
        { status: 400 }
      );
    }

    // Attempt to cancel the task
    const cancelled = await cancelTask(taskId, '/v3/on_page/task_get'); // Default endpoint

    if (cancelled) {
      // Update analysis status to cancelled
      await updateAnalysis(analysis.id, {
        status: 'failed',
        result: { error: 'Task was cancelled by user' }
      });

      return NextResponse.json({
        success: true,
        message: 'Task cancelled successfully'
      });
    } else {
      // Task cancellation not supported or failed
      return NextResponse.json(
        { error: 'Task cancellation is not supported for this analysis type' },
        { status: 400 }
      );
    }

  } catch (error) {
    logger.error('Task Cancel API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
