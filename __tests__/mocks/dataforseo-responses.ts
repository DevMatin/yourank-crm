// Mock-Daten basierend auf echten DataForSEO API-Responses
// Diese Daten wurden aus den Logs extrahiert und anonymisiert

export const mockSearchVolumeResponse = {
  version: "0.1.20251018",
  status_code: 20000,
  status_message: "Ok.",
  time: "0.1465 sec.",
  cost: 0.0109,
  tasks_count: 1,
  tasks_error: 0,
  tasks: [{
    id: "mock-search-volume-task-id",
    status_code: 20000,
    status_message: "Ok.",
    time: "0.0684 sec.",
    cost: 0.0109,
    result_count: 1,
    path: ["v3", "keywords_data", "google_ads", "search_volume", "live"],
    data: {
      api: "keywords_data",
      function: "search_volume",
      se: "google_ads",
      keywords: ["test keyword"],
      location_name: "Germany",
      language_name: "German"
    },
    result: [{
      keyword_info: {
        se_type: "google_ads",
        keyword: "test keyword",
        location_code: 2276,
        language_code: "de",
        search_volume: 12000,
        cpc: 1.50,
        competition_level: "MEDIUM",
        search_volume_trend: {
          yearly: 15.5
        }
      }
    }]
  }]
};

export const mockDifficultyResponse = {
  version: "0.1.20251018",
  status_code: 20000,
  status_message: "Ok.",
  time: "0.1465 sec.",
  cost: 0.0109,
  tasks_count: 1,
  tasks_error: 0,
  tasks: [{
    id: "mock-difficulty-task-id",
    status_code: 20000,
    status_message: "Ok.",
    time: "0.0684 sec.",
    cost: 0.0109,
    result_count: 1,
    path: ["v3", "dataforseo_labs", "google", "bulk_keyword_difficulty", "live"],
    data: {
      api: "dataforseo_labs",
      function: "bulk_keyword_difficulty",
      se_type: "google",
      keywords: ["test keyword"],
      location_name: "Germany",
      language_name: "German"
    },
    result: [{
      keyword_difficulty: 65.5
    }]
  }]
};

export const mockTrendsResponse = {
  version: "0.1.20251018",
  status_code: 20000,
  status_message: "Ok.",
  time: "20.4227 sec.",
  cost: 0.009,
  tasks_count: 1,
  tasks_error: 0,
  tasks: [{
    id: "mock-trends-task-id",
    status_code: 20000,
    status_message: "Ok.",
    time: "20.2285 sec.",
    cost: 0.009,
    result_count: 1,
    path: ["v3", "keywords_data", "google_trends", "explore", "live"],
    data: {
      api: "keywords_data",
      function: "explore",
      se: "google_trends",
      keywords: ["test keyword"],
      location_name: "Germany",
      language_name: "German",
      date_from: "2023-01-01",
      date_to: "2025-10-18"
    },
    result: [{
      items: [{
        items: [
          {
            date_from: "2023-01-01",
            date_to: "2023-01-31",
            values: [85]
          },
          {
            date_from: "2023-02-01",
            date_to: "2023-02-28",
            values: [92]
          },
          {
            date_from: "2023-03-01",
            date_to: "2023-03-31",
            values: [78]
          },
          {
            date_from: "2023-04-01",
            date_to: "2023-04-30",
            values: [88]
          },
          {
            date_from: "2023-05-01",
            date_to: "2023-05-31",
            values: [95]
          },
          {
            date_from: "2023-06-01",
            date_to: "2023-06-30",
            values: [82]
          },
          {
            date_from: "2023-07-01",
            date_to: "2023-07-31",
            values: [90]
          },
          {
            date_from: "2023-08-01",
            date_to: "2023-08-31",
            values: [87]
          },
          {
            date_from: "2023-09-01",
            date_to: "2023-09-30",
            values: [93]
          },
          {
            date_from: "2023-10-01",
            date_to: "2023-10-31",
            values: [89]
          },
          {
            date_from: "2023-11-01",
            date_to: "2023-11-30",
            values: [91]
          },
          {
            date_from: "2023-12-01",
            date_to: "2023-12-31",
            values: [86]
          }
        ]
      }]
    }]
  }]
};

export const mockDemographicsResponse = {
  version: "0.1.20251018",
  status_code: 20000,
  status_message: "Ok.",
  time: "0.3862 sec.",
  cost: 0.002,
  tasks_count: 1,
  tasks_error: 0,
  tasks: [{
    id: "mock-demographics-task-id",
    status_code: 20000,
    status_message: "Ok.",
    time: "0.2386 sec.",
    cost: 0.002,
    result_count: 1,
    path: ["v3", "keywords_data", "dataforseo_trends", "demography", "live"],
    data: {
      api: "keywords_data",
      function: "demography",
      se: "dataforseo_trends",
      keywords: ["test keyword"],
      location_name: "Germany"
    },
    result: [{
      keywords: ["test keyword"],
      type: "trends",
      location_code: 2276,
      language_code: null,
      datetime: "2025-10-18 15:15:06 +00:00",
      items_count: 1,
      items: [{
        type: "demography",
        position: 1,
        keywords: ["test keyword"],
        demography: {
          age: [{
            keyword: "test keyword",
            values: [
              { type: "18-24", value: 11 },
              { type: "25-34", value: 33 },
              { type: "35-44", value: 50 },
              { type: "45-54", value: 35 },
              { type: "55-64", value: 20 },
              { type: "65+", value: 15 }
            ]
          }]
        }
      }]
    }]
  }]
};

export const mockRelatedKeywordsResponse = {
  version: "0.1.20251018",
  status_code: 20000,
  status_message: "Ok.",
  time: "0.1465 sec.",
  cost: 0.0109,
  tasks_count: 1,
  tasks_error: 0,
  tasks: [{
    id: "mock-related-keywords-task-id",
    status_code: 20000,
    status_message: "Ok.",
    time: "0.0684 sec.",
    cost: 0.0109,
    result_count: 1,
    path: ["v3", "dataforseo_labs", "google", "related_keywords", "live"],
    data: {
      api: "dataforseo_labs",
      function: "related_keywords",
      se_type: "google",
      keyword: "test keyword",
      location_name: "Germany",
      language_name: "German",
      depth: 1,
      include_seed_keyword: false,
      limit: 10
    },
    result: [{
      se_type: "google",
      seed_keyword: "test keyword",
      location_code: 2276,
      language_code: "de",
      total_count: 9,
      items_count: 9,
      items: [
        {
          se_type: "google",
          keyword_data: {
            se_type: "google",
            keyword: "test keyword variations",
            location_code: 2276,
            language_code: "de",
            keyword_info: {
              se_type: "google",
              search_volume: 8500,
              cpc: 1.25,
              competition_level: "MEDIUM",
              search_volume_trend: {
                yearly: 8.5
              }
            }
          },
          related_keywords: ["related 1", "related 2"]
        },
        {
          se_type: "google",
          keyword_data: {
            se_type: "google",
            keyword: "test keyword alternatives",
            location_code: 2276,
            language_code: "de",
            keyword_info: {
              se_type: "google",
              search_volume: 6200,
              cpc: 0.95,
              competition_level: "LOW",
              search_volume_trend: {
                yearly: 12.3
              }
            }
          },
          related_keywords: ["related 3", "related 4"]
        },
        {
          se_type: "google",
          keyword_data: {
            se_type: "google",
            keyword: "test keyword synonyms",
            location_code: 2276,
            language_code: "de",
            keyword_info: {
              se_type: "google",
              search_volume: 4200,
              cpc: 0.75,
              competition_level: "HIGH",
              search_volume_trend: {
                yearly: -5.2
              }
            }
          },
          related_keywords: ["related 5", "related 6"]
        }
      ]
    }]
  }]
};

export const mockOverviewData = {
  keyword: "test keyword",
  searchVolume: mockSearchVolumeResponse,
  difficulty: mockDifficultyResponse,
  trends: mockTrendsResponse,
  related: mockRelatedKeywordsResponse,
  demographics: mockDemographicsResponse
};

// Mock-Daten für fehlerhafte Responses
export const mockErrorResponse = {
  version: "0.1.20251018",
  status_code: 40000,
  status_message: "Bad Request",
  time: "0.1 sec.",
  cost: 0,
  tasks_count: 1,
  tasks_error: 1,
  tasks: [{
    id: "mock-error-task-id",
    status_code: 40000,
    status_message: "Bad Request",
    time: "0.1 sec.",
    cost: 0,
    result_count: 0,
    path: ["v3", "keywords_data", "google_ads", "search_volume", "live"],
    data: {
      api: "keywords_data",
      function: "search_volume",
      se: "google_ads",
      keywords: ["invalid keyword"],
      location_name: "Invalid Location",
      language_name: "Invalid Language"
    },
    result: []
  }]
};

// Mock-Daten für leere Responses
export const mockEmptyResponse = {
  version: "0.1.20251018",
  status_code: 20000,
  status_message: "Ok.",
  time: "0.1 sec.",
  cost: 0.001,
  tasks_count: 1,
  tasks_error: 0,
  tasks: [{
    id: "mock-empty-task-id",
    status_code: 20000,
    status_message: "Ok.",
    time: "0.1 sec.",
    cost: 0.001,
    result_count: 0,
    path: ["v3", "keywords_data", "google_ads", "search_volume", "live"],
    data: {
      api: "keywords_data",
      function: "search_volume",
      se: "google_ads",
      keywords: ["empty keyword"],
      location_name: "Germany",
      language_name: "German"
    },
    result: []
  }]
};
