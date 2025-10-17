import { NextRequest, NextResponse } from 'next/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { logger } from '@/lib/logger';
import { DataforseoLabsGoogleRelatedKeywordsLiveRequestInfo } from 'dataforseo-client';

export async function GET(request: NextRequest) {
  try {
    // Test DataForSEO connection and API
    const testRequest = new DataforseoLabsGoogleRelatedKeywordsLiveRequestInfo();
    testRequest.keyword = 'seo test';
    testRequest.location_name = 'Germany';
    testRequest.language_name = 'German';
    testRequest.limit = 1;
    testRequest.depth = 1;
    testRequest.include_seed_keyword = false;

    logger.info('Testing DataForSEO API connection...');
    
    const result = await dataForSeoClient.labs.googleRelatedKeywordsLive([testRequest]);
    
    // Verify response structure
    const verification = {
      connection: 'OK',
      apiEndpoint: 'googleRelatedKeywordsLive',
      responseStructure: {
        hasTasks: !!result?.tasks,
        tasksCount: result?.tasks?.length || 0,
        hasResults: !!result?.tasks?.[0]?.result,
        hasItems: !!result?.tasks?.[0]?.result?.[0]?.items,
        itemsCount: result?.tasks?.[0]?.result?.[0]?.items?.length || 0
      },
      dataStructure: null as any,
      timestamp: new Date().toISOString()
    };

    // Check first item structure if available
    const firstItem = result?.tasks?.[0]?.result?.[0]?.items?.[0];
    if (firstItem) {
      verification.dataStructure = {
        hasKeywordData: !!firstItem.keyword_data,
        hasKeywordInfo: !!firstItem.keyword_data?.keyword_info,
        hasSearchVolume: typeof firstItem.keyword_data?.keyword_info?.search_volume === 'number',
        hasCompetition: !!firstItem.keyword_data?.keyword_info?.competition_level,
        hasCpc: typeof firstItem.keyword_data?.keyword_info?.cpc === 'number',
        hasRelatedKeywords: Array.isArray(firstItem.related_keywords),
        keyword: firstItem.keyword_data?.keyword || firstItem.keyword
      };
    }

    return NextResponse.json({
      success: true,
      message: 'DataForSEO API verification completed',
      verification,
      sampleData: firstItem ? {
        keyword: firstItem.keyword_data?.keyword || firstItem.keyword,
        searchVolume: firstItem.keyword_data?.keyword_info?.search_volume,
        competition: firstItem.keyword_data?.keyword_info?.competition_level,
        cpc: firstItem.keyword_data?.keyword_info?.cpc,
        relatedKeywordsCount: firstItem.related_keywords?.length || 0
      } : null
    });

  } catch (error) {
    logger.error('DataForSEO verification failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'DataForSEO API verification failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
