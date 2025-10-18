import {
  validateSearchVolumeResponse,
  validateDifficultyResponse,
  validateTrendsResponse,
  validateDemographicsResponse,
  validateRelatedKeywordsResponse,
  validateOverviewData,
  extractSearchVolumeData,
  extractDifficultyData,
  extractTrendData,
  extractDemographicsData,
  extractRelatedKeywordsData,
  isSearchVolumeResponse,
  isDifficultyResponse,
  isTrendsResponse,
  isDemographicsResponse,
  isRelatedKeywordsResponse
} from '@/lib/utils/dataforseo-validator';
import {
  mockSearchVolumeResponse,
  mockDifficultyResponse,
  mockTrendsResponse,
  mockDemographicsResponse,
  mockRelatedKeywordsResponse,
  mockOverviewData,
  mockErrorResponse,
  mockEmptyResponse
} from './mocks/dataforseo-responses';

describe('DataForSEO Validator', () => {
  describe('Type Guards', () => {
    test('isSearchVolumeResponse should validate correct structure', () => {
      expect(isSearchVolumeResponse(mockSearchVolumeResponse)).toBe(true);
      expect(isSearchVolumeResponse(null)).toBe(false);
      expect(isSearchVolumeResponse({})).toBe(false);
      expect(isSearchVolumeResponse({ version: 'test' })).toBe(false);
    });

    test('isDifficultyResponse should validate correct structure', () => {
      expect(isDifficultyResponse(mockDifficultyResponse)).toBe(true);
      expect(isDifficultyResponse(null)).toBe(false);
      expect(isDifficultyResponse({})).toBe(false);
    });

    test('isTrendsResponse should validate correct structure', () => {
      expect(isTrendsResponse(mockTrendsResponse)).toBe(true);
      expect(isTrendsResponse(null)).toBe(false);
      expect(isTrendsResponse({})).toBe(false);
    });

    test('isDemographicsResponse should validate correct structure', () => {
      expect(isDemographicsResponse(mockDemographicsResponse)).toBe(true);
      expect(isDemographicsResponse(null)).toBe(false);
      expect(isDemographicsResponse({})).toBe(false);
    });

    test('isRelatedKeywordsResponse should validate correct structure', () => {
      expect(isRelatedKeywordsResponse(mockRelatedKeywordsResponse)).toBe(true);
      expect(isRelatedKeywordsResponse(null)).toBe(false);
      expect(isRelatedKeywordsResponse({})).toBe(false);
    });
  });

  describe('Response Validators', () => {
    test('validateSearchVolumeResponse should validate successful response', () => {
      const result = validateSearchVolumeResponse(mockSearchVolumeResponse);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
      expect(result.data).toBeDefined();
    });

    test('validateSearchVolumeResponse should handle error response', () => {
      const result = validateSearchVolumeResponse(mockErrorResponse);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Search Volume API error');
    });

    test('validateSearchVolumeResponse should warn about missing data', () => {
      const emptyResponse = {
        ...mockSearchVolumeResponse,
        tasks: [{
          ...mockSearchVolumeResponse.tasks[0],
          result: [{}] // Empty result
        }]
      };
      
      const result = validateSearchVolumeResponse(emptyResponse);
      
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Search volume data not found');
    });

    test('validateDifficultyResponse should validate successful response', () => {
      const result = validateDifficultyResponse(mockDifficultyResponse);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toBeDefined();
    });

    test('validateTrendsResponse should validate successful response', () => {
      const result = validateTrendsResponse(mockTrendsResponse);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toBeDefined();
    });

    test('validateDemographicsResponse should validate successful response', () => {
      const result = validateDemographicsResponse(mockDemographicsResponse);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toBeDefined();
    });

    test('validateRelatedKeywordsResponse should validate successful response', () => {
      const result = validateRelatedKeywordsResponse(mockRelatedKeywordsResponse);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toBeDefined();
    });
  });

  describe('Data Extraction', () => {
    test('extractSearchVolumeData should extract correct values', () => {
      const result = extractSearchVolumeData(mockSearchVolumeResponse.tasks[0].result[0]);
      
      expect(result.searchVolume).toBe(12000);
      expect(result.cpc).toBe(1.50);
      expect(result.trend).toBe(15.5);
    });

    test('extractSearchVolumeData should handle missing data', () => {
      const result = extractSearchVolumeData({});
      
      expect(result.searchVolume).toBeNull();
      expect(result.cpc).toBeNull();
      expect(result.trend).toBeNull();
    });

    test('extractDifficultyData should extract correct values', () => {
      const result = extractDifficultyData(mockDifficultyResponse.tasks[0].result[0]);
      
      expect(result.difficulty).toBe(65.5);
    });

    test('extractTrendData should extract correct values', () => {
      const result = extractTrendData(mockTrendsResponse.tasks[0].result[0]);
      
      expect(result).toHaveLength(12);
      expect(result[0]).toEqual({
        month: 'Jan',
        volume: 85,
        trend: 85
      });
      expect(result[11]).toEqual({
        month: 'Dez',
        volume: 86,
        trend: 86
      });
    });

    test('extractTrendData should handle missing data', () => {
      const result = extractTrendData({});
      
      expect(result).toHaveLength(0);
    });

    test('extractDemographicsData should extract correct values', () => {
      const result = extractDemographicsData(mockDemographicsResponse.tasks[0].result[0]);
      
      expect(result).toHaveLength(6);
      expect(result[0]).toEqual({
        age_group: '18-24',
        percentage: 11
      });
      expect(result[2]).toEqual({
        age_group: '35-44',
        percentage: 50
      });
    });

    test('extractDemographicsData should handle missing data', () => {
      const result = extractDemographicsData({});
      
      expect(result).toHaveLength(0);
    });

    test('extractRelatedKeywordsData should extract correct values', () => {
      const result = extractRelatedKeywordsData(mockRelatedKeywordsResponse.tasks[0].result[0]);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        keyword: 'test keyword variations',
        search_volume: 8500,
        competition: 0.5, // MEDIUM
        cpc: 1.25,
        trend: 8.5,
        related_keywords: ['related 1', 'related 2']
      });
      expect(result[1]).toEqual({
        keyword: 'test keyword alternatives',
        search_volume: 6200,
        competition: 0.2, // LOW
        cpc: 0.95,
        trend: 12.3,
        related_keywords: ['related 3', 'related 4']
      });
      expect(result[2]).toEqual({
        keyword: 'test keyword synonyms',
        search_volume: 4200,
        competition: 0.8, // HIGH
        cpc: 0.75,
        trend: -5.2,
        related_keywords: ['related 5', 'related 6']
      });
    });

    test('extractRelatedKeywordsData should handle missing data', () => {
      const result = extractRelatedKeywordsData({});
      
      expect(result).toHaveLength(0);
    });
  });

  describe('Overview Validation', () => {
    test('validateOverviewData should validate complete overview', () => {
      const result = validateOverviewData(mockOverviewData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.apiStatus.searchVolume.isValid).toBe(true);
      expect(result.apiStatus.difficulty.isValid).toBe(true);
      expect(result.apiStatus.trends.isValid).toBe(true);
      expect(result.apiStatus.demographics.isValid).toBe(true);
      expect(result.apiStatus.relatedKeywords.isValid).toBe(true);
    });

    test('validateOverviewData should handle partial failures', () => {
      const partialOverview = {
        ...mockOverviewData,
        searchVolume: mockErrorResponse,
        difficulty: mockEmptyResponse
      };
      
      const result = validateOverviewData(partialOverview);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.apiStatus.searchVolume.isValid).toBe(false);
      expect(result.apiStatus.difficulty.isValid).toBe(true);
    });

    test('validateOverviewData should handle completely invalid data', () => {
      const invalidOverview = {
        keyword: 'test',
        searchVolume: null,
        difficulty: null,
        trends: null,
        related: null,
        demographics: null
      };
      
      const result = validateOverviewData(invalidOverview);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.apiStatus.searchVolume.isValid).toBe(false);
      expect(result.apiStatus.difficulty.isValid).toBe(false);
      expect(result.apiStatus.trends.isValid).toBe(false);
      expect(result.apiStatus.demographics.isValid).toBe(false);
      expect(result.apiStatus.relatedKeywords.isValid).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('should handle null and undefined inputs gracefully', () => {
      expect(validateSearchVolumeResponse(null).isValid).toBe(false);
      expect(validateSearchVolumeResponse(undefined).isValid).toBe(false);
      expect(extractSearchVolumeData(null)).toEqual({
        searchVolume: null,
        cpc: null,
        trend: null
      });
      expect(extractTrendData(null)).toEqual([]);
    });

    test('should handle malformed data structures', () => {
      const malformedData = {
        version: "0.1.20251018",
        status_code: 20000,
        tasks: [] // Empty tasks array
      };
      
      const result = validateSearchVolumeResponse(malformedData);
      expect(result.isValid).toBe(false);
    });

    test('should handle missing nested properties', () => {
      const incompleteData = {
        version: "0.1.20251018",
        status_code: 20000,
        tasks: [{
          result: [{
            // Missing keyword_info
          }]
        }]
      };
      
      const result = validateSearchVolumeResponse(incompleteData);
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});
