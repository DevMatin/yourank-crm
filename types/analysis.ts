import { Json } from './database';

export interface AnalysisInput {
  keyword?: string;
  domain?: string;
  location?: string;
  language?: string;
  device?: 'desktop' | 'mobile';
  depth?: number;
  limit?: number;
  [key: string]: any;
}

export interface AnalysisResult {
  success: boolean;
  data?: Json;
  error?: string;
  task_id?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface AnalysisRecord {
  id: string;
  project_id: string | null;
  user_id: string;
  type: string;
  input: AnalysisInput;
  task_id: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result: AnalysisResult | null;
  credits_used: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  domain: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
  created_at: string;
  updated_at: string;
}

export interface RankTracking {
  id: string;
  project_id: string;
  keyword: string;
  position: number | null;
  volume: number | null;
  trend: Json | null;
  checked_at: string;
  created_at: string;
}

export type AnalysisType = 
  | 'keywords_related'
  | 'keywords_suggestions'
  | 'keywords_ideas'
  | 'keywords_difficulty'
  | 'keywords_overview'
  | 'serp_ai_overview'
  | 'serp_people_also_ask'
  | 'serp_onpage_audit'
  | 'domain_overview'
  | 'domain_traffic'
  | 'domain_ranked_keywords'
  | 'labs_keyword_gap'
  | 'labs_ranked_keywords'
  | 'labs_competitors'
  | 'backlinks_overview'
  | 'backlinks_anchors'
  | 'backlinks_referring_domains'
  | 'onpage_audit'
  | 'onpage_broken_links'
  | 'onpage_pagespeed'
  | 'content_sentiment'
  | 'content_meta_tags'
  | 'content_generation'
  | 'merchant_google_shopping'
  | 'merchant_seller_data'
  | 'appdata_app_store'
  | 'appdata_play_store'
  | 'business_local_finder'
  | 'business_info'
  | 'databases_serp_history'
  | 'databases_keyword_history'
  | 'ai_keyword_insights'
  | 'ai_content_optimization'
  | 'ai_seo_recommendations';
