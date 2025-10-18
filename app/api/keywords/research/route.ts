import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { 
  DataforseoLabsGoogleRelatedKeywordsLiveRequestInfo,
  DataforseoLabsGoogleKeywordSuggestionsLiveRequestInfo,
  DataforseoLabsGoogleKeywordIdeasLiveRequestInfo,
  KeywordsDataGoogleAdsKeywordsForSiteLiveRequestInfo,
  KeywordsDataBingKeywordsForSiteLiveRequestInfo,
  KeywordsDataGoogleAdsKeywordsForKeywordsLiveRequestInfo,
  KeywordsDataBingKeywordsForKeywordsLiveRequestInfo
} from 'dataforseo-client';
import { KeywordResearchResult } from '@/types/analysis';

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
    const { 
      keyword, 
      source, 
      location = 'Germany', 
      language = 'German',
      domain,
      limit = 10 
    } = body;

    // Validate input
    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    if (!source || !['related', 'suggestions', 'ideas', 'for-site', 'for-keywords'].includes(source)) {
      return NextResponse.json(
        { error: 'Valid source is required (related, suggestions, ideas, for-site, for-keywords)' },
        { status: 400 }
      );
    }

    // Check credits based on source
    const creditsMap = {
      'related': 1,
      'suggestions': 1,
      'ideas': 1,
      'for-site': 5, // Google Ads Keywords for Site
      'for-keywords': 2 // Google Ads Keywords for Keywords
    };
    
    const requiredCredits = creditsMap[source as keyof typeof creditsMap];
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keyword, source, location, language, domain, limit },
      'keywords_research',
      user.id,
      undefined,
      requiredCredits,
      'research'
    );

    try {
      let result: any;
      let apiEndpoint = '';

      // Switch between different research tools
      switch (source) {
        case 'related':
          const relatedRequest = new DataforseoLabsGoogleRelatedKeywordsLiveRequestInfo();
          relatedRequest.keyword = keyword.trim();
          relatedRequest.location_name = location;
          relatedRequest.language_name = language;
          relatedRequest.limit = limit;
          relatedRequest.depth = 1;
          relatedRequest.include_seed_keyword = false;
          
          result = await dataForSeoClient.labs.googleRelatedKeywordsLive([relatedRequest]);
          apiEndpoint = '/v3/dataforseo_labs/google/related_keywords/live';
          break;

        case 'suggestions':
          const suggestionsRequest = new DataforseoLabsGoogleKeywordSuggestionsLiveRequestInfo();
          suggestionsRequest.keyword = keyword.trim();
          suggestionsRequest.location_name = location;
          suggestionsRequest.language_name = language;
          suggestionsRequest.limit = limit;
          
          result = await dataForSeoClient.labs.googleKeywordSuggestionsLive([suggestionsRequest]);
          apiEndpoint = '/v3/dataforseo_labs/google/keyword_suggestions/live';
          break;

        case 'ideas':
          const ideasRequest = new DataforseoLabsGoogleKeywordIdeasLiveRequestInfo();
          ideasRequest.keyword = keyword.trim();
          ideasRequest.location_name = location;
          ideasRequest.language_name = language;
          ideasRequest.limit = limit;
          
          result = await dataForSeoClient.labs.googleKeywordIdeasLive([ideasRequest]);
          apiEndpoint = '/v3/dataforseo_labs/google/keyword_ideas/live';
          break;

        case 'for-site':
          if (!domain) {
            throw new Error('Domain is required for for-site analysis');
          }
          
          const forSiteRequest = new KeywordsDataGoogleAdsKeywordsForSiteLiveRequestInfo();
          forSiteRequest.target = domain.trim();
          forSiteRequest.location_name = location;
          forSiteRequest.language_name = language;
          forSiteRequest.limit = limit;
          
          result = await dataForSeoClient.keywords.googleAdsKeywordsForSiteLive([forSiteRequest]);
          apiEndpoint = '/v3/keywords_data/google_ads/keywords_for_site/live';
          break;

        case 'for-keywords':
          const forKeywordsRequest = new KeywordsDataGoogleAdsKeywordsForKeywordsLiveRequestInfo();
          forKeywordsRequest.keywords = [keyword.trim()];
          forKeywordsRequest.location_name = location;
          forKeywordsRequest.language_name = language;
          forKeywordsRequest.limit = limit;
          
          result = await dataForSeoClient.keywords.googleAdsKeywordsForKeywordsLive([forKeywordsRequest]);
          apiEndpoint = '/v3/keywords_data/google_ads/keywords_for_keywords/live';
          break;

        default:
          throw new Error('Invalid source');
      }

      // Process results based on source
      let processedData: any[] = [];
      let totalResults = 0;

      if (result?.tasks?.[0]?.result?.[0]?.items) {
        processedData = result.tasks[0].result[0].items.map((item: any) => {
          switch (source) {
            case 'related':
              return {
                keyword: item.keyword_data?.keyword || item.keyword || 'Unknown',
                search_volume: item.keyword_data?.keyword_info?.search_volume || 0,
                competition: item.keyword_data?.keyword_info?.competition_level === 'HIGH' ? 0.8 : 
                            item.keyword_data?.keyword_info?.competition_level === 'MEDIUM' ? 0.5 : 0.2,
                cpc: item.keyword_data?.keyword_info?.cpc || 0,
                trend: item.keyword_data?.keyword_info?.search_volume_trend?.yearly || 0,
                related_keywords: item.related_keywords || []
              };
            
            case 'suggestions':
            case 'ideas':
              return {
                keyword: item.keyword || 'Unknown',
                search_volume: item.keyword_info?.search_volume || 0,
                competition: item.keyword_info?.competition_level === 'HIGH' ? 0.8 : 
                            item.keyword_info?.competition_level === 'MEDIUM' ? 0.5 : 0.2,
                cpc: item.keyword_info?.cpc || 0,
                trend: item.keyword_info?.search_volume_trend?.yearly || 0
              };
            
            case 'for-site':
            case 'for-keywords':
              return {
                keyword: item.keyword || 'Unknown',
                search_volume: item.keyword_info?.search_volume || 0,
                competition: item.keyword_info?.competition_level === 'HIGH' ? 0.8 : 
                            item.keyword_info?.competition_level === 'MEDIUM' ? 0.5 : 0.2,
                cpc: item.keyword_info?.cpc || 0,
                trend: item.keyword_info?.search_volume_trend?.yearly || 0,
                low_top_of_page_bid: item.low_top_of_page_bid || 0,
                high_top_of_page_bid: item.high_top_of_page_bid || 0
              };
            
            default:
              return item;
          }
        });
        
        totalResults = processedData.length;
      }

      const researchResult: KeywordResearchResult = {
        source: source as any,
        data: processedData,
        totalResults,
        apiEndpoint,
        creditsUsed: requiredCredits
      };

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: researchResult
      });

      // Deduct credits
      await deductCredits(user.id, requiredCredits);

      return NextResponse.json({
        success: true,
        data: researchResult,
        analysisId: analysisRecord.id,
        creditsUsed: requiredCredits,
        source: 'DataForSEO API',
        apiEndpoint,
        timestamp: new Date().toISOString(),
        dataForSeoTaskId: result.tasks?.[0]?.id
      });

    } catch (apiError) {
      logger.error('Research API Error:', apiError);
      
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
            : 'Failed to fetch research data. Please try again.',
          success: false,
          details: apiError instanceof Error ? apiError.message : 'Unknown error',
          isConnectionError
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('Research API Error:', error);
    
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
