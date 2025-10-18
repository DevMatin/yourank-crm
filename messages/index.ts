// Type definitions for translation keys
export type TranslationKeys = {
  common: {
    dashboard: string;
    keywords: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    refresh: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    open: string;
    yes: string;
    no: string;
    ok: string;
    credits: string;
    aiAssistant: string;
    profile: string;
    settings: string;
    logout: string;
    login: string;
    signup: string;
    language: string;
    theme: string;
    notifications: string;
    messages: string;
  };
  navigation: {
    keywords: string;
    overview: string;
    research: string;
    competition: string;
    performance: string;
    trends: string;
    audience: string;
    legacyTools: string;
    legacyToolsHide: string;
    legacyToolsLabel: string;
    deprecated: string;
    new: string;
    beta: string;
    soon: string;
    dev: string;
    backlinks: string;
    serp: string;
    onpage: string;
    content: string;
    domain: string;
    business: string;
    merchant: string;
    labs: string;
    databases: string;
    appdata: string;
    debugTools: string;
    apiDebugLogs: string;
  };
  keywords: {
    overview: {
      title: string;
      subtitle: string;
      searchPlaceholder: string;
      analyze: string;
      location: string;
      language: string;
      selectApis: string;
      searchVolume: string;
      difficulty: string;
      trends: string;
      demographics: string;
      relatedKeywords: string;
      noResults: string;
      errorOccurred: string;
      tryAgain: string;
      history: string;
      lastSearches: string;
      clearHistory: string;
      exportResults: string;
      shareResults: string;
    };
    research: {
      title: string;
      subtitle: string;
    };
    competition: {
      title: string;
      subtitle: string;
    };
    performance: {
      title: string;
      subtitle: string;
    };
    trends: {
      title: string;
      subtitle: string;
    };
    audience: {
      title: string;
      subtitle: string;
    };
  };
  auth: {
    login: string;
    signup: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    rememberMe: string;
    noAccount: string;
    hasAccount: string;
    signInWith: string;
    signUpWith: string;
    termsAndConditions: string;
    privacyPolicy: string;
    agreeToTerms: string;
  };
  api: {
    errors: {
      keywordRequired: string;
      locationRequired: string;
      languageRequired: string;
      invalidKeyword: string;
      invalidLocation: string;
      invalidLanguage: string;
      insufficientCredits: string;
      apiError: string;
      networkError: string;
      serverError: string;
      timeout: string;
      rateLimit: string;
      unauthorized: string;
      forbidden: string;
      notFound: string;
      validationError: string;
    };
    success: {
      analysisStarted: string;
      analysisCompleted: string;
      dataSaved: string;
      settingsUpdated: string;
      exportCompleted: string;
    };
  };
  metadata: {
    title: string;
    description: string;
    keywords: string;
  };
  language: {
    de: string;
    en: string;
    es: string;
    fr: string;
    switchLanguage: string;
    currentLanguage: string;
  };
};

// Export all message files
export { default as de } from './de.json';
export { default as en } from './en.json';
export { default as es } from './es.json';
export { default as fr } from './fr.json';
