export interface DataForSeoRequest {
  keyword?: string;
  domain?: string;
  location_name?: string;
  language_name?: string;
  device?: 'desktop' | 'mobile';
  depth?: number;
  limit?: number;
  [key: string]: any;
}

export interface DataForSeoResponse {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: DataForSeoTask[];
}

export interface DataForSeoTask {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  result_count: number;
  path: string[];
  data: any;
  result: DataForSeoResult[] | null;
}

export interface DataForSeoResult {
  keyword?: string;
  location_code?: number;
  language_code?: string;
  check_url?: string;
  datetime?: string;
  items_count?: number;
  items?: any[];
  [key: string]: any;
}

export interface DataForSeoError {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: DataForSeoTask[];
}

// Specific response types for different endpoints
export interface KeywordRelatedResponse extends DataForSeoResponse {
  tasks: Array<DataForSeoTask & {
    result: Array<{
      keyword: string;
      location_code: number;
      language_code: string;
      items: Array<{
        keyword: string;
        search_volume: number;
        competition: number;
        cpc: number;
        related_keyword: string;
      }>;
    }>;
  }>;
}

export interface SerpResponse extends DataForSeoResponse {
  tasks: Array<DataForSeoTask & {
    result: Array<{
      keyword: string;
      location_code: number;
      language_code: string;
      check_url: string;
      datetime: string;
      items: Array<{
        type: string;
        rank_group: number;
        rank_absolute: number;
        position: string;
        xpath: string;
        title?: string;
        url?: string;
        breadcrumb?: string;
        website_name?: string;
        is_featured_snippet?: boolean;
        is_paid?: boolean;
        is_malicious?: boolean;
        domain?: string;
        main_domain?: string;
        relative_url?: string;
        etv?: number;
        impressions_etv?: number;
        estimated_paid_traffic_cost?: number;
        clickstream_etv?: number;
        description?: string;
        pre_snippet?: string;
        extended_snippet?: string;
        table?: any;
        faq?: any;
        people_also_ask?: any;
        related_searches?: any;
        shop?: any;
        images?: any;
        videos?: any;
        news?: any;
        featured_snippet?: any;
        top_stories?: any;
        knowledge_graph?: any;
        local_pack?: any;
        related_questions?: any;
        [key: string]: any;
      }>;
    }>;
  }>;
}

export interface DomainOverviewResponse extends DataForSeoResponse {
  tasks: Array<DataForSeoTask & {
    result: Array<{
      domain: string;
      location_code: number;
      language_code: string;
      total_count: number;
      items_count: number;
      items: Array<{
        se_type: string;
        check_url: string;
        datetime: string;
        items_count: number;
        items: Array<{
          type: string;
          rank_group: number;
          rank_absolute: number;
          position: string;
          xpath: string;
          domain: string;
          title: string;
          url: string;
          breadcrumb: string;
          website_name: string;
          is_featured_snippet: boolean;
          is_paid: boolean;
          is_malicious: boolean;
          description: string;
          pre_snippet: string;
          extended_snippet: string;
          table: any;
          faq: any;
          people_also_ask: any;
          related_searches: any;
          shop: any;
          images: any;
          videos: any;
          news: any;
          featured_snippet: any;
          top_stories: any;
          knowledge_graph: any;
          local_pack: any;
          related_questions: any;
        }>;
      }>;
    }>;
  }>;
}
