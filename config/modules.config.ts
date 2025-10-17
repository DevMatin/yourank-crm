export interface Tool {
  id: string;
  name: string;
  description: string;
  credits: number;
  endpoint: string;
  status: 'active' | 'coming_soon' | 'beta';
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePath: string;
  color: string;
  tools: Tool[];
}

export const modules: Module[] = [
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "serp",
  //   name: "SERP Analysis",
  //   description: "Suchergebnisanalyse und SERP-Features",
  //   icon: "Search",
  //   basePath: "/serp",
  //   color: "blue",
  //   tools: [
  //     {
  //       id: "ai-overview",
  //       name: "AI Overview Analysis",
  //       description: "Analysiere AI Overview Ergebnisse in den SERPs",
  //       credits: 2,
  //       endpoint: "/v3/serp/google/organic/live/advanced",
  //       status: "active"
  //     },
  //     {
  //       id: "people-also-ask",
  //       name: "People Also Ask",
  //       description: "Extrahiere PAA-Fragen und Antworten",
  //       credits: 1,
  //       endpoint: "/v3/serp/google/organic/live/advanced",
  //       status: "active"
  //     },
  //     {
  //       id: "onpage-audit",
  //       name: "On-Page SEO Audit",
  //       description: "Technische SEO-Analyse von Webseiten",
  //       credits: 3,
  //       endpoint: "/v3/on_page/task_post",
  //       status: "active"
  //     }
  //   ]
  // },
  {
    id: "keywords",
    name: "Keywords Data",
    description: "Keyword-Recherche und Difficulty-Analyse",
    icon: "Hash",
    basePath: "/keywords",
    color: "green",
    tools: [
      {
        id: "related",
        name: "Related Keywords",
        description: "Finde verwandte Keywords zu deinem Suchbegriff",
        credits: 1,
        endpoint: "/v3/keywords_data/related_keywords/live",
        status: "active"
      },
      {
        id: "suggestions",
        name: "Keyword Suggestions",
        description: "Automatische Keyword-Vorschläge",
        credits: 1,
        endpoint: "/v3/keywords_data/google_ads/search_volume/live",
        status: "active"
      },
      {
        id: "ideas",
        name: "Keyword Ideas",
        description: "Kreative Keyword-Ideen generieren",
        credits: 1,
        endpoint: "/v3/keywords_data/google_ads/keywords_for_keywords/live",
        status: "active"
      },
      {
        id: "difficulty",
        name: "Keyword Difficulty",
        description: "Bewerte die Schwierigkeit von Keywords",
        credits: 1,
        endpoint: "/v3/keywords_data/google_ads/keyword_difficulty/live",
        status: "active"
      },
      {
        id: "overview",
        name: "Keyword Overview",
        description: "Umfassende Keyword-Analyse",
        credits: 2,
        endpoint: "/v3/keywords_data/google_ads/search_volume/live",
        status: "active"
      },
      {
        id: "google-ads-search-volume",
        name: "Google Ads Search Volume",
        description: "Präzise Google Ads Suchvolumen-Daten",
        credits: 2,
        endpoint: "/v3/keywords_data/google_ads/search_volume/live",
        status: "active"
      },
      {
        id: "google-trends-explore",
        name: "Google Trends Explore",
        description: "Trend-Analysen und Suchvolumen-Trends",
        credits: 3,
        endpoint: "/v3/keywords_data/google_trends/explore/live",
        status: "active"
      },
      {
        id: "bing-search-volume",
        name: "Bing Search Volume",
        description: "Bing-spezifische Suchvolumen-Daten",
        credits: 1,
        endpoint: "/v3/keywords_data/bing/search_volume/live",
        status: "active"
      },
      {
        id: "google-ads-keywords-for-site",
        name: "Google Ads Keywords for Site",
        description: "Keywords die für eine Website relevant sind",
        credits: 5,
        endpoint: "/v3/keywords_data/google_ads/keywords_for_site/live",
        status: "active"
      },
      {
        id: "bing-keywords-for-site",
        name: "Bing Keywords for Site",
        description: "Bing Keywords für eine bestimmte Website",
        credits: 3,
        endpoint: "/v3/keywords_data/bing/keywords_for_site/live",
        status: "active"
      },
      {
        id: "clickstream-global-search-volume",
        name: "Clickstream Global Search Volume",
        description: "Erweiterte Clickstream Suchvolumen-Daten",
        credits: 2,
        endpoint: "/v3/keywords_data/clickstream_data/global_search_volume/live",
        status: "active"
      },
      {
        id: "google-ads-keywords-for-keywords",
        name: "Google Ads Keywords for Keywords",
        description: "Keyword-Ideen basierend auf Google Ads Daten",
        credits: 2,
        endpoint: "/v3/keywords_data/google_ads/keywords_for_keywords/live",
        status: "active"
      },
      {
        id: "bing-keywords-for-keywords",
        name: "Bing Keywords for Keywords",
        description: "Bing-spezifische Keyword-Vorschläge",
        credits: 1,
        endpoint: "/v3/keywords_data/bing/keywords_for_keywords/live",
        status: "active"
      },
      {
        id: "google-ads-ad-traffic",
        name: "Google Ads Ad Traffic",
        description: "Traffic-Schätzungen für Keywords basierend auf Geboten",
        credits: 3,
        endpoint: "/v3/keywords_data/google_ads/ad_traffic_by_keywords/live",
        status: "active"
      },
      {
        id: "bing-keyword-performance",
        name: "Bing Keyword Performance",
        description: "Performance-Metriken für Bing Keywords",
        credits: 2,
        endpoint: "/v3/keywords_data/bing/keyword_performance/live",
        status: "active"
      },
      {
        id: "bing-search-volume-history",
        name: "Bing Search Volume History",
        description: "Historische Suchvolumen-Daten für Bing",
        credits: 2,
        endpoint: "/v3/keywords_data/bing/search_volume_history/live",
        status: "active"
      },
      {
        id: "clickstream-dataforseo-search-volume",
        name: "Clickstream DataForSEO Search Volume",
        description: "DataForSEO-eigene Suchvolumen-Berechnung",
        credits: 2,
        endpoint: "/v3/keywords_data/clickstream_data/dataforseo_search_volume/live",
        status: "active"
      },
      {
        id: "clickstream-bulk-search-volume",
        name: "Clickstream Bulk Search Volume",
        description: "Bulk-Verarbeitung von Clickstream Daten",
        credits: 1,
        endpoint: "/v3/keywords_data/clickstream_data/bulk_search_volume/live",
        status: "active"
      },
      {
        id: "dataforseo-trends-demography",
        name: "DataForSEO Trends Demography",
        description: "Demografische Trend-Analyse",
        credits: 3,
        endpoint: "/v3/keywords_data/dataforseo_trends/demography/live",
        status: "active"
      },
      {
        id: "dataforseo-trends-merged-data",
        name: "DataForSEO Trends Merged Data",
        description: "Kombinierte Trend-Daten",
        credits: 3,
        endpoint: "/v3/keywords_data/dataforseo_trends/merged_data/live",
        status: "active"
      },
      {
        id: "dataforseo-trends-subregion-interests",
        name: "DataForSEO Trends Subregion Interests",
        description: "Regionale Interessen-Trends",
        credits: 3,
        endpoint: "/v3/keywords_data/dataforseo_trends/subregion_interests/live",
        status: "active"
      },
      {
        id: "bing-audience-estimation",
        name: "Bing Audience Estimation",
        description: "LinkedIn Ads Audience Targeting",
        credits: 5,
        endpoint: "/v3/keywords_data/bing/audience_estimation/live",
        status: "active"
      }
    ]
  },
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "domain",
  //   name: "Domain Analytics",
  //   description: "Domainrank, Sichtbarkeit und Traffic-Analyse",
  //   icon: "Globe",
  //   basePath: "/domain",
  //   color: "purple",
  //   tools: [
  //     {
  //       id: "overview",
  //       name: "Domain Overview",
  //       description: "Umfassende Domain-Analyse",
  //       credits: 3,
  //       endpoint: "/v3/domain_analytics/overview/live",
  //       status: "active"
  //     },
  //     {
  //       id: "traffic",
  //       name: "Traffic Analytics",
  //       description: "Detaillierte Traffic-Analyse",
  //       credits: 2,
  //       endpoint: "/v3/domain_analytics/traffic_analytics/live",
  //       status: "active"
  //     },
  //     {
  //       id: "ranked-keywords",
  //       name: "Ranked Keywords",
  //       description: "Keywords für die die Domain rankt",
  //       credits: 2,
  //       endpoint: "/v3/domain_analytics/ranked_keywords/live",
  //       status: "active"
  //     }
  //   ]
  //   },
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "labs",
  //   name: "Labs API",
  //   description: "Keyword-Gap, Competitors und Tracking",
  //   icon: "FlaskConical",
  //   basePath: "/labs",
  //   color: "orange",
  //   tools: [
  //     {
  //       id: "keyword-gap",
  //       name: "Keyword Gap",
  //       description: "Finde Keyword-Lücken zu Konkurrenten",
  //       credits: 3,
  //       endpoint: "/v3/dataforseo_labs/google/keyword_ideas/live",
  //       status: "active"
  //     },
  //     {
  //       id: "ranked-keywords",
  //       name: "Ranked Keywords",
  //       description: "Keywords für die eine Domain rankt",
  //       credits: 2,
  //       endpoint: "/v3/dataforseo_labs/google/ranked_keywords/live",
  //       status: "active"
  //     },
  //     {
  //       id: "competitors",
  //       name: "Competitors",
  //       description: "Finde direkte Konkurrenten",
  //       credits: 2,
  //       endpoint: "/v3/dataforseo_labs/google/competitors_domain/live",
  //       status: "active"
  //     }
  //   ]
  //   },
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "backlinks",
  //   name: "Backlinks API",
  //   description: "Linkprofile und Off-Page Metriken",
  //   icon: "Link",
  //   basePath: "/backlinks",
  //   color: "red",
  //   tools: [
  //     {
  //       id: "overview",
  //       name: "Backlink Overview",
  //       description: "Übersicht über das Linkprofil",
  //       credits: 2,
  //       endpoint: "/v3/backlinks/summary/live",
  //       status: "active"
  //     },
  //     {
  //       id: "anchors",
  //       name: "Anchor Text",
  //       description: "Analyse der Anchor-Texte",
  //       credits: 1,
  //       endpoint: "/v3/backlinks/anchor_text/live",
  //       status: "active"
  //     },
  //     {
  //       id: "referring-domains",
  //       name: "Referring Domains",
  //       description: "Verweisende Domains analysieren",
  //       credits: 2,
  //       endpoint: "/v3/backlinks/referring_domains/live",
  //       status: "active"
  //     }
  //   ]
  //   },
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "onpage",
  //   name: "OnPage API",
  //   description: "Technische SEO-Audits und Broken Links",
  //   icon: "FileText",
  //   basePath: "/onpage",
  //   color: "teal",
  //   tools: [
  //     {
  //       id: "audit",
  //       name: "On-Page Audit",
  //       description: "Vollständiger technischer SEO-Audit",
  //       credits: 3,
  //       endpoint: "/v3/on_page/task_post",
  //       status: "active"
  //     },
  //     {
  //       id: "broken-links",
  //       name: "Broken Links",
  //       description: "Finde defekte Links auf der Website",
  //       credits: 2,
  //       endpoint: "/v3/on_page/broken_links/live",
  //       status: "active"
  //     },
  //     {
  //       id: "pagespeed",
  //       name: "Page Speed",
  //       description: "Analyse der Ladezeiten",
  //       credits: 1,
  //       endpoint: "/v3/on_page/pagespeed/live",
  //       status: "active"
  //     }
  //   ]
  //   },
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "content",
  //   name: "Content API",
  //   description: "Textanalyse, Sentiment und AI Content",
  //   icon: "PenTool",
  //   basePath: "/content",
  //   color: "pink",
  //   tools: [
  //     {
  //       id: "sentiment",
  //       name: "Sentiment Analysis",
  //       description: "Analysiere die Stimmung von Texten",
  //       credits: 1,
  //       endpoint: "/v3/content_analysis/sentiment_analysis/live",
  //       status: "active"
  //     },
  //     {
  //       id: "meta-tags",
  //       name: "Meta Tags",
  //       description: "Analysiere Meta-Tags und Title-Tags",
  //       credits: 1,
  //       endpoint: "/v3/on_page/meta_tags/live",
  //       status: "active"
  //     },
  //     {
  //       id: "content-generation",
  //       name: "AI Content Generation",
  //       description: "Generiere Content mit AI",
  //       credits: 2,
  //       endpoint: "/v3/content_analysis/generate/live",
  //       status: "beta"
  //     }
  //   ]
  //   },
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "merchant",
  //   name: "Merchant API",
  //   description: "Google Shopping und Seller Data",
  //   icon: "ShoppingCart",
  //   basePath: "/merchant",
  //   color: "yellow",
  //   tools: [
  //     {
  //       id: "google-shopping",
  //       name: "Google Shopping",
  //       description: "Analysiere Google Shopping Ergebnisse",
  //       credits: 2,
  //       endpoint: "/v3/merchant/google/shopping/live",
  //       status: "active"
  //     },
  //     {
  //       id: "seller-data",
  //       name: "Seller Data",
  //       description: "Detaillierte Verkäufer-Informationen",
  //       credits: 1,
  //       endpoint: "/v3/merchant/google/sellers/live",
  //       status: "active"
  //     }
  //   ]
  //   },
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "appdata",
  //   name: "App Data API",
  //   description: "App Store und Play Store Analysen",
  //   icon: "Smartphone",
  //   basePath: "/appdata",
  //   color: "indigo",
  //   tools: [
  //     {
  //       id: "app-store",
  //       name: "App Store",
  //       description: "Analysiere App Store Rankings",
  //       credits: 2,
  //       endpoint: "/v3/app_data/apple/app_list/live",
  //       status: "active"
  //     },
  //     {
  //       id: "play-store",
  //       name: "Play Store",
  //       description: "Analysiere Google Play Store",
  //       credits: 2,
  //       endpoint: "/v3/app_data/google/app_list/live",
  //       status: "active"
  //     }
  //   ]
  //   },
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "business",
  //   name: "Business API",
  //   description: "Local Finder und Google Business Data",
  //   icon: "Building2",
  //   basePath: "/business",
  //   color: "cyan",
  //   tools: [
  //     {
  //       id: "local-finder",
  //       name: "Local Finder",
  //       description: "Finde lokale Geschäfte und Services",
  //       credits: 2,
  //       endpoint: "/v3/business_data/google/locations/live",
  //       status: "active"
  //     },
  //     {
  //       id: "business-info",
  //       name: "Business Info",
  //       description: "Detaillierte Geschäftsinformationen",
  //       credits: 1,
  //       endpoint: "/v3/business_data/google/business_info/live",
  //       status: "active"
  //     }
  //   ]
  //   },
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "databases",
  //   name: "Databases Layer",
  //   description: "Historische Datenspeicherung und Suche",
  //   icon: "Database",
  //   basePath: "/databases",
  //   color: "gray",
  //   tools: [
  //     {
  //       id: "serp-history",
  //       name: "SERP History",
  //       description: "Historische SERP-Daten durchsuchen",
  //       credits: 1,
  //       endpoint: "/v3/serp/google/organic/task_get/advanced",
  //       status: "active"
  //     },
  //     {
  //       id: "keyword-history",
  //       name: "Keyword History",
  //       description: "Historische Keyword-Daten",
  //       credits: 1,
  //       endpoint: "/v3/keywords_data/google_ads/search_volume/task_get",
  //       status: "active"
  //     }
  //   ]
  //   },
  // Temporär deaktiviert - Build-Probleme
  // {
  //   id: "ai",
  //   name: "AI Optimization",
  //   description: "GPT-basierte AI-Analysen und Empfehlungen",
  //   icon: "Brain",
  //   basePath: "/ai",
  //   color: "emerald",
  //   tools: [
  //     {
  //       id: "keyword-insights",
  //       name: "Keyword Insights",
  //       description: "AI-generierte Keyword-Insights",
  //       credits: 2,
  //       endpoint: "/v3/ai/generate/keyword_insights",
  //       status: "beta"
  //     },
  //     {
  //       id: "content-optimization",
  //       name: "Content Optimization",
  //       description: "AI-basierte Content-Optimierung",
  //       credits: 3,
  //       endpoint: "/v3/ai/generate/content_optimization",
  //       status: "beta"
  //     },
  //     {
  //       id: "seo-recommendations",
  //       name: "SEO Recommendations",
  //       description: "Personalisierte SEO-Empfehlungen",
  //       credits: 2,
  //       endpoint: "/v3/ai/generate/seo_recommendations",
  //       status: "beta"
  //     }
  //   ]
  // }
];

export const getModuleById = (id: string): Module | undefined => {
  return modules.find(module => module.id === id);
};

export const getToolById = (moduleId: string, toolId: string): Tool | undefined => {
  const moduleData = getModuleById(moduleId);
  return moduleData?.tools.find(tool => tool.id === toolId);
};

export const getAllTools = (): Tool[] => {
  return modules.flatMap(module => module.tools);
};
