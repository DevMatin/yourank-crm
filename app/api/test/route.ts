import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';

export async function POST(_request: NextRequest) {
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

    // Check if user has enough credits
    const requiredCredits = 1;
    await checkUserCredits(user.id, requiredCredits);

    // Test DataForSEO connection
    const testPayload = [{
      keyword: 'seo tools',
      location_name: 'Germany',
      language_name: 'German',
      limit: 5
    }];

    const result = await dataForSeoClient.fetchDataForSeo(
      '/v3/keywords_data/related_keywords/live',
      testPayload
    );

    // Deduct credits
    await deductCredits(user.id, requiredCredits);

    return NextResponse.json({
      success: true,
      message: 'DataForSEO connection successful',
      data: result,
      creditsUsed: requiredCredits
    });

  } catch (error) {
    logger.error('Test API Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'yourank.ai API Test Endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
