import { 
  SerpApi, 
  KeywordsDataApi, 
  DomainAnalyticsApi,
  DataforseoLabsApi,
  BacklinksApi,
  OnPageApi,
  ContentAnalysisApi,
  ContentGenerationApi,
  MerchantApi,
  AppDataApi,
  BusinessDataApi,
  AiOptimizationApi,
  AppendixApi
} from 'dataforseo-client';
import { logger } from '@/lib/logger';

const DATAFORSEO_BASE_URL = 'https://api.dataforseo.com';

/**
 * Creates an authenticated fetch function for DataForSEO API
 * Supports both API Key and Login/Password authentication
 */
function createAuthenticatedFetch(username?: string, password?: string) {
  return (url: RequestInfo, init?: RequestInit): Promise<Response> => {
    // Use API key if available, otherwise use login:password
    const apiKey = process.env.DATAFORSEO_API_KEY;
    let authHeader: string;
    
    if (apiKey) {
      authHeader = `Basic ${apiKey}`;
    } else {
      const login = username || process.env.DATAFORSEO_LOGIN || '';
      const pass = password || process.env.DATAFORSEO_PASSWORD || '';
      
      if (!login || !pass) {
        throw new Error('DataForSEO credentials not configured. Please set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD or DATAFORSEO_API_KEY');
      }
      
      const credentials = Buffer.from(`${login}:${pass}`).toString('base64');
      authHeader = `Basic ${credentials}`;
    }

    const newInit: RequestInit = {
      ...init,
      headers: {
        ...init?.headers,
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    };

    return fetch(url, newInit);
  };
}

/**
 * DataForSEO Client Wrapper
 * Provides pre-configured API instances with authentication
 */
export class DataForSeoClient {
  private authFetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
  
  // API Instances
  public readonly serp: SerpApi;
  public readonly keywords: KeywordsDataApi;
  public readonly domain: DomainAnalyticsApi;
  public readonly labs: DataforseoLabsApi;
  public readonly backlinks: BacklinksApi;
  public readonly onpage: OnPageApi;
  public readonly content: ContentAnalysisApi;
  public readonly generation: ContentGenerationApi;
  public readonly merchant: MerchantApi;
  public readonly app: AppDataApi;
  public readonly business: BusinessDataApi;
  public readonly ai: AiOptimizationApi;
  public readonly appendix: AppendixApi;

  constructor(username?: string, password?: string) {
    this.authFetch = createAuthenticatedFetch(username, password);
    
    // Initialize all API instances with authentication
    this.serp = new SerpApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.keywords = new KeywordsDataApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.domain = new DomainAnalyticsApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.labs = new DataforseoLabsApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.backlinks = new BacklinksApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.onpage = new OnPageApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.content = new ContentAnalysisApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.generation = new ContentGenerationApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.merchant = new MerchantApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.app = new AppDataApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.business = new BusinessDataApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.ai = new AiOptimizationApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
    this.appendix = new AppendixApi(DATAFORSEO_BASE_URL, { fetch: this.authFetch });
  }

  /**
   * Test connection to DataForSEO API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Use a simple endpoint to test connection
      const response = await this.authFetch(`${DATAFORSEO_BASE_URL}/v3/appendix/user_data`);
      return response.ok;
    } catch (error) {
      logger.error('DataForSEO connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const dataForSeoClient = new DataForSeoClient();

// Export individual API classes for direct usage
export {
  SerpApi,
  KeywordsDataApi,
  DomainAnalyticsApi,
  DataforseoLabsApi,
  BacklinksApi,
  OnPageApi,
  ContentAnalysisApi,
  ContentGenerationApi,
  MerchantApi,
  AppDataApi,
  BusinessDataApi,
  AiOptimizationApi,
  AppendixApi
};

// Legacy compatibility - keep the old interface for existing code
export async function fetchDataForSeo(endpoint: string, payload: any[]): Promise<any> {
  logger.warn('fetchDataForSeo is deprecated. Please use the new API instances directly.');
  
  // Create a new client instance for legacy compatibility
  const client = new DataForSeoClient();
  const response = await (client as any).authFetch(
    `${DATAFORSEO_BASE_URL}${endpoint}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`DataForSEO API Error: ${errorData.status_message} (${errorData.status_code})`);
  }

  return await response.json();
}