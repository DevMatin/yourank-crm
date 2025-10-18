// Template für Keywords-Seiten Übersetzung
// Diese Funktion kann für alle Keywords-Seiten verwendet werden

import { useTranslations } from 'next-intl';

export function useKeywordsPageTranslations(pageName: keyof typeof keywordsPages) {
  const t = useTranslations(`keywords.${pageName}`);
  const tCommon = useTranslations('common');
  
  return {
    t,
    tCommon,
    // Standard-Übersetzungen für alle Keywords-Seiten
    pageTitle: t('title'),
    pageSubtitle: t('subtitle'),
    searchPlaceholder: t('searchPlaceholder'),
    analyzeButton: t('analyze'),
    locationLabel: t('location'),
    languageLabel: t('language'),
    loadingText: tCommon('loading'),
    creditsText: tCommon('credits'),
    resultsText: tCommon('results'),
    errorText: tCommon('error'),
    successText: tCommon('success'),
    exportText: tCommon('export'),
    historyText: t('history'),
    noResultsText: t('noResults'),
    tryAgainText: t('tryAgain')
  };
}

// Typen für die Keywords-Seiten
const keywordsPages = {
  overview: 'overview',
  research: 'research',
  competition: 'competition',
  performance: 'performance',
  trends: 'trends',
  audience: 'audience',
  ideas: 'ideas',
  related: 'related',
  suggestions: 'suggestions',
  difficulty: 'difficulty',
  // Bing Tools
  'bing-search-volume': 'bing',
  'bing-audience-estimation': 'bing',
  'bing-keyword-performance': 'bing',
  'bing-keywords-for-keywords': 'bing',
  'bing-keywords-for-site': 'bing',
  'bing-search-volume-history': 'bing',
  // Google Ads Tools
  'google-ads-ad-traffic': 'googleAds',
  'google-ads-keywords-for-keywords': 'googleAds',
  'google-ads-keywords-for-site': 'googleAds',
  'google-ads-search-volume': 'googleAds',
  // Clickstream Tools
  'clickstream-bulk-search-volume': 'clickstream',
  'clickstream-dataforseo-search-volume': 'clickstream',
  'clickstream-global-search-volume': 'clickstream',
  // DataForSEO Trends Tools
  'dataforseo-trends-demography': 'dataforseoTrends',
  'dataforseo-trends-merged-data': 'dataforseoTrends',
  'dataforseo-trends-subregion-interests': 'dataforseoTrends',
  // Google Trends Tools
  'google-trends-explore': 'googleTrends'
} as const;

export type KeywordsPageName = keyof typeof keywordsPages;
