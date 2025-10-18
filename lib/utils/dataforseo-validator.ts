import { logger } from '@/lib/logger';

// ============================================================================
// DataForSEO Response Validator
// Validiert API-Responses und stellt sicher, dass alle erwarteten Felder vorhanden sind
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: any;
}

export interface SearchVolumeResponse {
  version: string;
  status_code: number;
  status_message: string;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    result: Array<{
      keyword_info?: {
        search_volume?: number;
        cpc?: number;
        competition_level?: string;
        search_volume_trend?: {
          yearly?: number;
        };
      };
      items?: Array<{
        keyword_info?: {
          search_volume?: number;
          cpc?: number;
          competition_level?: string;
          search_volume_trend?: {
            yearly?: number;
          };
        };
      }>;
    }>;
  }>;
}

export interface DifficultyResponse {
  version: string;
  status_code: number;
  status_message: string;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    result: Array<{
      keyword_difficulty?: number;
      items?: Array<{
        keyword_difficulty?: number;
      }>;
    }>;
  }>;
}

export interface TrendsResponse {
  version: string;
  status_code: number;
  status_message: string;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    result: Array<{
      items?: Array<{
        items?: Array<{
          date_from?: string;
          date_to?: string;
          date?: string;
          values?: number[];
        }>;
      }>;
    }>;
  }>;
}

export interface DemographicsResponse {
  version: string;
  status_code: number;
  status_message: string;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    result: Array<{
      items?: Array<{
        demography?: {
          age?: Array<{
            values?: Array<{
              type?: string;
              value?: number;
            }>;
          }>;
        };
      }>;
    }>;
  }>;
}

export interface RelatedKeywordsResponse {
  version: string;
  status_code: number;
  status_message: string;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    result: Array<{
      items?: Array<{
        keyword_data?: {
          keyword?: string;
          keyword_info?: {
            search_volume?: number;
            competition_level?: string;
            cpc?: number;
            search_volume_trend?: {
              yearly?: number;
            };
          };
        };
        keyword?: string;
        related_keywords?: any[];
      }>;
    }>;
  }>;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isSearchVolumeResponse(data: any): data is SearchVolumeResponse {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.version === 'string' &&
    typeof data.status_code === 'number' &&
    Array.isArray(data.tasks) &&
    data.tasks.length > 0 &&
    Array.isArray(data.tasks[0].result) &&
    data.tasks[0].result.length > 0
  );
}

export function isDifficultyResponse(data: any): data is DifficultyResponse {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.version === 'string' &&
    typeof data.status_code === 'number' &&
    Array.isArray(data.tasks) &&
    data.tasks.length > 0 &&
    Array.isArray(data.tasks[0].result) &&
    data.tasks[0].result.length > 0
  );
}

export function isTrendsResponse(data: any): data is TrendsResponse {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.version === 'string' &&
    typeof data.status_code === 'number' &&
    Array.isArray(data.tasks) &&
    data.tasks.length > 0 &&
    Array.isArray(data.tasks[0].result) &&
    data.tasks[0].result.length > 0
  );
}

export function isDemographicsResponse(data: any): data is DemographicsResponse {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.version === 'string' &&
    typeof data.status_code === 'number' &&
    Array.isArray(data.tasks) &&
    data.tasks.length > 0 &&
    Array.isArray(data.tasks[0].result) &&
    data.tasks[0].result.length > 0
  );
}

export function isRelatedKeywordsResponse(data: any): data is RelatedKeywordsResponse {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.version === 'string' &&
    typeof data.status_code === 'number' &&
    Array.isArray(data.tasks) &&
    data.tasks.length > 0 &&
    Array.isArray(data.tasks[0].result) &&
    data.tasks[0].result.length > 0
  );
}

// ============================================================================
// Validator Functions
// ============================================================================

export function validateSearchVolumeResponse(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isSearchVolumeResponse(data)) {
    errors.push('Invalid Search Volume response structure');
    return { isValid: false, errors, warnings };
  }

  if (data.status_code !== 20000) {
    errors.push(`Search Volume API error: ${data.status_message} (${data.status_code})`);
    return { isValid: false, errors, warnings };
  }

  const result = data.tasks[0].result[0];
  
  // Check for search volume data - CORRECTED STRUCTURE
  let hasSearchVolume = false;
  let hasCpc = false;
  let hasTrend = false;

  // CORRECT: Search Volume API has direct fields in result[0]
  if ((result as any).search_volume !== undefined) {
    hasSearchVolume = true;
    hasCpc = (result as any).cpc !== undefined;
    hasTrend = (result as any).monthly_searches && (result as any).monthly_searches.length > 0;
  }

  if (!hasSearchVolume) {
    warnings.push('Search volume data not found in response');
  }
  if (!hasCpc) {
    warnings.push('CPC data not found in response');
  }
  if (!hasTrend) {
    warnings.push('Search volume trend data not found in response');
  }

  logger.dataValidation('Search Volume Response Validated', {
    hasSearchVolume,
    hasCpc,
    hasTrend,
    warnings: warnings.length,
    errors: errors.length,
    resultStructure: Object.keys(result),
    actualData: {
      search_volume: (result as any).search_volume,
      cpc: (result as any).cpc,
      monthly_searches_count: (result as any).monthly_searches?.length || 0
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: result
  };
}

export function validateDifficultyResponse(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isDifficultyResponse(data)) {
    errors.push('Invalid Difficulty response structure');
    return { isValid: false, errors, warnings };
  }

  if (data.status_code !== 20000) {
    errors.push(`Difficulty API error: ${data.status_message} (${data.status_code})`);
    return { isValid: false, errors, warnings };
  }

  const result = data.tasks[0].result[0];
  
  // Check for difficulty data
  if (result.keyword_difficulty === undefined && 
      result.items?.[0]?.keyword_difficulty === undefined) {
    warnings.push('Keyword difficulty data not found in response');
  }

  logger.dataValidation('Difficulty Response Validated', {
    hasDifficulty: !!(result.keyword_difficulty !== undefined || result.items?.[0]?.keyword_difficulty !== undefined),
    warnings: warnings.length,
    errors: errors.length
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: result
  };
}

export function validateTrendsResponse(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isTrendsResponse(data)) {
    errors.push('Invalid Trends response structure');
    return { isValid: false, errors, warnings };
  }

  if (data.status_code !== 20000) {
    errors.push(`Trends API error: ${data.status_message} (${data.status_code})`);
    return { isValid: false, errors, warnings };
  }

  const result = data.tasks[0].result[0];
  
  // Check for trend data - CORRECTED STRUCTURE
  let hasItems = false;
  let itemsCount = 0;
  let hasValues = false;

  // CORRECT: Trends API has items[0].data array
  if ((result as any).items?.[0]?.data) {
    hasItems = true;
    itemsCount = (result as any).items[0].data.length;
    hasValues = (result as any).items[0].data.some((item: any) => 
      item.values && Array.isArray(item.values) && item.values.length > 0
    );
  }

  if (!hasItems) {
    warnings.push('Trend data not found in response');
  }
  if (!hasValues) {
    warnings.push('Trend values not found in response items');
  }

  logger.dataValidation('Trends Response Validated', {
    hasItems,
    itemsCount,
    hasValues,
    warnings: warnings.length,
    errors: errors.length,
    resultStructure: Object.keys(result),
    actualData: {
      items_count: (result as any).items?.length || 0,
      data_count: (result as any).items?.[0]?.data?.length || 0,
      first_data_item: (result as any).items?.[0]?.data?.[0] ? {
        date_from: (result as any).items[0].data[0].date_from,
        values: (result as any).items[0].data[0].values
      } : null
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: result
  };
}

export function validateDemographicsResponse(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isDemographicsResponse(data)) {
    errors.push('Invalid Demographics response structure');
    return { isValid: false, errors, warnings };
  }

  if (data.status_code !== 20000) {
    errors.push(`Demographics API error: ${data.status_message} (${data.status_code})`);
    return { isValid: false, errors, warnings };
  }

  const result = data.tasks[0].result[0];
  
  // Check for demographics data
  if (!result.items?.[0]?.demography?.age?.[0]?.values) {
    warnings.push('Demographics age data not found in response');
  }

  // Check if demographics have values
  const hasValues = result.items?.[0]?.demography?.age?.[0]?.values?.some((item: any) => 
    item.type && typeof item.value === 'number'
  );

  if (!hasValues) {
    warnings.push('Demographics values not found in response');
  }

  logger.dataValidation('Demographics Response Validated', {
    hasDemographics: !!(result.items?.[0]?.demography?.age?.[0]?.values),
    valuesCount: result.items?.[0]?.demography?.age?.[0]?.values?.length || 0,
    hasValues,
    warnings: warnings.length,
    errors: errors.length,
    resultStructure: Object.keys(result),
    actualData: {
      items_count: result.items?.length || 0,
      age_values: result.items?.[0]?.demography?.age?.[0]?.values ? result.items[0].demography.age[0].values.map((v: any) => ({
        type: v.type,
        value: v.value
      })) : null,
      total_value: result.items?.[0]?.demography?.age?.[0]?.values ? result.items[0].demography.age[0].values.reduce((sum: number, item: any) => sum + item.value, 0) : 0
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: result
  };
}

export function validateRelatedKeywordsResponse(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRelatedKeywordsResponse(data)) {
    errors.push('Invalid Related Keywords response structure');
    return { isValid: false, errors, warnings };
  }

  if (data.status_code !== 20000) {
    errors.push(`Related Keywords API error: ${data.status_message} (${data.status_code})`);
    return { isValid: false, errors, warnings };
  }

  const result = data.tasks[0].result[0];
  
  // Check for related keywords data
  if (!result.items || result.items.length === 0) {
    warnings.push('Related keywords data not found in response');
  }

  // Check if items have keyword data
  const hasKeywordData = result.items?.some((item: any) => 
    item.keyword_data?.keyword || item.keyword
  );

  if (!hasKeywordData) {
    warnings.push('Keyword data not found in related keywords items');
  }

  logger.dataValidation('Related Keywords Response Validated', {
    hasItems: !!(result.items),
    itemsCount: result.items?.length || 0,
    hasKeywordData,
    warnings: warnings.length,
    errors: errors.length
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: result
  };
}

// ============================================================================
// Combined Overview Validator
// ============================================================================

export interface OverviewValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  apiStatus: {
    searchVolume: ValidationResult;
    difficulty: ValidationResult;
    trends: ValidationResult;
    demographics: ValidationResult;
    relatedKeywords: ValidationResult;
  };
}

export function validateOverviewData(overview: any): OverviewValidationResult {
  const apiStatus = {
    searchVolume: validateSearchVolumeResponse(overview.searchVolume),
    difficulty: validateDifficultyResponse(overview.difficulty),
    trends: validateTrendsResponse(overview.trends),
    demographics: validateDemographicsResponse(overview.demographics),
    relatedKeywords: validateRelatedKeywordsResponse(overview.related)
  };

  const allErrors = Object.values(apiStatus).flatMap(status => status.errors);
  const allWarnings = Object.values(apiStatus).flatMap(status => status.warnings);

  const isValid = allErrors.length === 0;

  logger.dataValidation('Overview Data Validation Complete', {
    isValid,
    totalErrors: allErrors.length,
    totalWarnings: allWarnings.length,
    apiSuccessCount: Object.values(apiStatus).filter(status => status.isValid).length,
    apiTotalCount: Object.keys(apiStatus).length
  });

  return {
    isValid,
    errors: allErrors,
    warnings: allWarnings,
    apiStatus
  };
}

// ============================================================================
// Debug Helper Functions
// ============================================================================

export function debugDataStructure(data: any, apiName: string) {
  logger.debug(`Debugging ${apiName} Data Structure`, {
    apiName,
    hasData: !!data,
    dataType: typeof data,
    keys: data ? Object.keys(data) : [],
    tasksCount: data?.tasks?.length || 0,
    firstTaskKeys: data?.tasks?.[0] ? Object.keys(data.tasks[0]) : [],
    firstResultKeys: data?.tasks?.[0]?.result?.[0] ? Object.keys(data.tasks[0].result[0]) : [],
    sampleData: data?.tasks?.[0]?.result?.[0] ? {
      keyword_info: data.tasks[0].result[0].keyword_info,
      items: data.tasks[0].result[0].items,
      search_volume: data.tasks[0].result[0].search_volume,
      cpc: data.tasks[0].result[0].cpc
    } : null
  });
}

export function extractSearchVolumeData(result: any): {
  searchVolume: number | null;
  cpc: number | null;
  trend: number | null;
} {
  let searchVolume = null;
  let cpc = null;
  let trend = null;

  // CORRECT: Search Volume API has direct fields in result
  if (result.search_volume !== undefined) {
    searchVolume = result.search_volume;
    cpc = result.cpc;
    // Calculate trend from monthly_searches (last vs first)
    if (result.monthly_searches && result.monthly_searches.length >= 2) {
      const first = result.monthly_searches[0].search_volume;
      const last = result.monthly_searches[result.monthly_searches.length - 1].search_volume;
      trend = Math.round(((last - first) / first) * 100);
    }
  }

  return { searchVolume, cpc, trend };
}

export function extractDifficultyData(result: any): {
  difficulty: number | null;
} {
  let difficulty = null;

  if (result.keyword_difficulty !== undefined) {
    difficulty = result.keyword_difficulty;
  } else if (result.items?.[0]?.keyword_difficulty !== undefined) {
    difficulty = result.items[0].keyword_difficulty;
  }

  return { difficulty };
}

export function extractTrendData(result: any): Array<{
  month: string;
  volume: number;
  trend: number;
}> {
  if (!result) return [];

  // CORRECT: Trends API has items[0].data array
  let trendItems: any[] = [];

  if (result.items?.[0]?.data) {
    trendItems = result.items[0].data;
  }

  if (!trendItems || trendItems.length === 0) {
    return [];
  }

  return trendItems.map((item: any, index: number) => {
    let dateStr = '';
    if (item.date_from) {
      dateStr = new Date(item.date_from).toLocaleDateString('de-DE', { month: 'short' });
    } else if (item.date) {
      dateStr = new Date(item.date).toLocaleDateString('de-DE', { month: 'short' });
    } else {
      const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
      dateStr = months[index % 12];
    }

    return {
      month: dateStr,
      volume: item.values?.[0] || item.value || 0,
      trend: item.values?.[0] || item.value || 0
    };
  });
}

export function extractDemographicsData(result: any): Array<{
  age_group: string;
  percentage: number;
}> {
  if (!result.items?.[0]?.demography?.age?.[0]?.values) {
    return [];
  }

  const ageData = result.items[0].demography.age[0].values;
  
  // Calculate total for normalization (DataForSEO gives relative values 0-100)
  const total = ageData.reduce((sum: number, item: any) => sum + item.value, 0);
  
  return ageData.map((group: any) => ({
    age_group: group.type || 'Unknown',
    percentage: total > 0 ? Math.round((group.value / total) * 100) : 0
  }));
}

export function extractRelatedKeywordsData(result: any): Array<{
  keyword: string;
  search_volume: number;
  competition: number;
  cpc: number;
  trend: number;
  related_keywords: any[];
}> {
  if (!result.items) {
    return [];
  }

  return result.items.map((item: any) => ({
    keyword: item.keyword_data?.keyword || item.keyword || 'Unknown',
    search_volume: item.keyword_data?.keyword_info?.search_volume || 0,
    competition: item.keyword_data?.keyword_info?.competition_level === 'HIGH' ? 0.8 : 
                item.keyword_data?.keyword_info?.competition_level === 'MEDIUM' ? 0.5 : 0.2,
    cpc: item.keyword_data?.keyword_info?.cpc || 0,
    trend: item.keyword_data?.keyword_info?.search_volume_trend?.yearly || 0,
    related_keywords: item.related_keywords || []
  }));
}
