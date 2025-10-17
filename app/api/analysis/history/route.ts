import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'keywords_related';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Fetch analysis history from database
    const { data: analyses, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', type)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Debug logging
    console.log('Fetched analyses:', analyses);

    if (error) {
      logger.error('Failed to fetch analysis history:', error);
      return NextResponse.json(
        { error: 'Failed to fetch analysis history' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analyses: analyses || []
    });

  } catch (error) {
    logger.error('Analysis History API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}
