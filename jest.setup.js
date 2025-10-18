import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClientComponentClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      insert: jest.fn(),
      update: jest.fn(),
    })),
  })),
}))

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    dataValidation: jest.fn(),
    apiDebug: jest.fn(),
  },
}))

// Mock DataForSEO client
jest.mock('@/lib/dataforseo/client', () => ({
  dataForSeoClient: {
    labs: {
      googleRelatedKeywordsLive: jest.fn(),
      googleBulkKeywordDifficultyLive: jest.fn(),
    },
    keywords: {
      googleAdsSearchVolumeLive: jest.fn(),
      googleTrendsExploreLive: jest.fn(),
      dataforseoTrendsDemographyLive: jest.fn(),
    },
  },
}))

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})
