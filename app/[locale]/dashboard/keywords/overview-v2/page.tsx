'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Search, 
  Download,
  Loader2,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Hash,
  Target,
  Users,
  Link2
} from 'lucide-react';
import { OverviewBasicsCard } from '@/components/keywords/overview-basics-card';
import { TrendChart } from '@/components/keywords/trend-chart';
import { DemographicsChart } from '@/components/keywords/demographics-chart';
import { OverviewLoadingSkeleton } from '@/components/keywords/loading-skeleton';
import { RelatedKeywordsTable } from '@/components/keywords/related-keywords-table';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';
import { CombinedKeywordOverview, LoadingStates } from '@/types/analysis';
import { 
  validateOverviewData, 
  extractSearchVolumeData, 
  extractDifficultyData, 
  extractTrendData, 
  extractDemographicsData, 
  extractRelatedKeywordsData,
  debugDataStructure
} from '@/lib/utils/dataforseo-validator';
import { logger } from '@/lib/logger';

interface OverviewHistory {
  keyword: string;
  location: string;
  language: string;
  timestamp: string;
  analysisId: string;
  results: CombinedKeywordOverview;
}

export default function OverviewPage() {
  const t = useTranslations('keywords.overview');
  const tCommon = useTranslations('common');
  const tApi = useTranslations('api');
  
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<CombinedKeywordOverview | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [selectedApis, setSelectedApis] = useState<string[]>([
    'searchVolume',
    'difficulty', 
    'trends',
    'demographics',
    'relatedKeywords'
  ]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    basics: false,
    related: false,
    trends: false,
    demographics: false,
    research: false
  });
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownOpen || languageDropdownOpen) {
        setLocationDropdownOpen(false);
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [locationDropdownOpen, languageDropdownOpen]);

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=keywords_overview&limit=10');
        if (response.ok) {
          const data = await response.json();
          
          const historyData = data.analyses?.map((analysis: any) => ({
            keyword: analysis.input?.keyword || t('noResults'),
            location: analysis.input?.location || 'Deutschland',
            language: analysis.input?.language || 'Deutsch',
            timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
            analysisId: analysis.id,
            results: analysis.result?.overview || {}
          })) || [];
          
          setSearchHistory(historyData);
          
          logger.debug('History data loaded', {
            count: historyData.length,
            hasData: historyData.length > 0
          });
        }
      } catch (error) {
        logger.error('Failed to load search history', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadSearchHistory();
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);
    
    // Set loading states for all sections
    setLoadingStates({
      basics: true,
      related: true,
      trends: true,
      demographics: true,
      research: false
    });

    try {
      const response = await fetch('/api/keywords/overview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          location,
          language,
          selectedApis
        }),
      });

      const data = await response.json();
      
      logger.info('Overview API Response received', {
        partialResults: data.partialResults,
        creditsUsed: data.creditsUsed,
        analysisId: data.analysisId
      });

      if (!response.ok) {
        const errorMessage = data.isConnectionError 
          ? 'Verbindungsfehler zur DataForSEO API. Bitte versuche es in ein paar Sekunden erneut.'
          : data.error || 'Fehler bei der Analyse';
        throw new Error(errorMessage);
      }

      setResults(data.data);
      setAnalysisId(data.analysisId);
      
      // Validate the received data
      const validation = validateOverviewData(data.data);
      
      // Debug: Log actual data structures for troubleshooting
      debugDataStructure(data.data.searchVolume, 'Search Volume');
      debugDataStructure(data.data.trends, 'Trends');
      
      logger.info('Overview Data Validation Results', {
        isValid: validation.isValid,
        totalErrors: validation.errors.length,
        totalWarnings: validation.warnings.length,
        apiStatus: {
          searchVolume: validation.apiStatus.searchVolume.isValid,
          difficulty: validation.apiStatus.difficulty.isValid,
          trends: validation.apiStatus.trends.isValid,
          demographics: validation.apiStatus.demographics.isValid,
          relatedKeywords: validation.apiStatus.relatedKeywords.isValid
        }
      });
      
      // Log warnings and errors
      if (validation.warnings.length > 0) {
        logger.warn('Overview Data Warnings', validation.warnings);
      }
      
      if (validation.errors.length > 0) {
        logger.error('Overview Data Errors', validation.errors);
      }
      
      // Clear loading states
      setLoadingStates({
        basics: false,
        related: false,
        trends: false,
        demographics: false,
        research: false
      });
      
      // Add to search history
      const newSearchEntry = {
        keyword: keyword.trim(),
        location,
        language,
        timestamp: new Date().toLocaleString('de-DE'),
        analysisId: data.analysisId || '',
        results: data.data || {}
      };
      
      setSearchHistory(prev => [newSearchEntry, ...prev.slice(0, 9)]);
    } catch (err) {
      logger.error('Overview API Error', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString()
      });
      
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
      setLoadingStates({
        basics: false,
        related: false,
        trends: false,
        demographics: false,
        research: false
      });
    } finally {
      setLoading(false);
    }
  };

  const exportResults = (format: 'csv' | 'json') => {
    if (!results) return;

    const exportData = {
      keyword: results.keyword,
      searchVolume: results.searchVolume?.tasks?.[0]?.result?.[0]?.items?.[0]?.keyword_info?.search_volume || 0,
      cpc: results.searchVolume?.tasks?.[0]?.result?.[0]?.items?.[0]?.keyword_info?.cpc || 0,
      difficulty: results.difficulty?.tasks?.[0]?.result?.[0]?.items?.[0]?.keyword_difficulty || 0,
      relatedKeywords: results.related?.tasks?.[0]?.result?.[0]?.items?.slice(0, 10) || [],
      trends: results.trends || null,
      demographics: results.demographics || null
    };

    if (format === 'csv') {
      const csvContent = [
        'Metric,Value',
        `Keyword,"${exportData.keyword}"`,
        `Search Volume,${exportData.searchVolume}`,
        `CPC,${exportData.cpc}`,
        `Difficulty,${exportData.difficulty}`,
        `Related Keywords,"${exportData.relatedKeywords.map((k: any) => k.keyword_data?.keyword || k.keyword).join(', ')}"`
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-overview-${keyword}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-overview-${keyword}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Extract data for components using validator
  const getBasicsData = () => {
    if (!results) return null;
    
    logger.debug('getBasicsData - extracting data from results', { keyword: results.keyword });
    
    // Validate and extract search volume data
    const volumeResult = results.searchVolume?.tasks?.[0]?.result?.[0];
    const difficultyResult = results.difficulty?.tasks?.[0]?.result?.[0];
    
    const { searchVolume, cpc, trend } = extractSearchVolumeData(volumeResult);
    const { difficulty } = extractDifficultyData(difficultyResult);
    
    logger.debug('getBasicsData - extracted values', { 
      searchVolume, 
      cpc, 
      difficulty, 
      trend,
      hasVolumeData: !!volumeResult,
      hasDifficultyData: !!difficultyResult
    });
    
    return {
      keyword: results.keyword,
      searchVolume: searchVolume ?? undefined,
      cpc: cpc ?? undefined,
      difficulty: difficulty ?? undefined,
      trend: trend ?? undefined
    };
  };

  const getRelatedData = () => {
    if (!results?.related) return [];
    
    const result = results.related.tasks?.[0]?.result?.[0];
    const relatedData = extractRelatedKeywordsData(result);
    
    logger.debug('getRelatedData - extracted related keywords', { 
      count: relatedData.length,
      hasResult: !!result
    });
    
    return relatedData;
  };

  const getTrendData = () => {
    logger.debug('getTrendData - extracting trend data', { 
      hasTrends: !!results?.trends,
      keyword: results?.keyword 
    });
    
    if (!results?.trends) {
      logger.debug('getTrendData - No trends data available');
      return [];
    }
    
    const result = results.trends.tasks?.[0]?.result?.[0];
    const trendData = extractTrendData(result);
    
    logger.debug('getTrendData - extracted trend data', { 
      dataPoints: trendData.length,
      hasResult: !!result,
      sampleData: trendData.slice(0, 3) // Log first 3 items for debugging
    });
    
    return trendData;
  };

  const getDemographicsData = () => {
    logger.debug('getDemographicsData - extracting demographics data', { 
      hasDemographics: !!results?.demographics,
      keyword: results?.keyword 
    });
    
    if (!results?.demographics) {
      logger.debug('getDemographicsData - No demographics data available');
      return [];
    }
    
    const result = results.demographics.tasks?.[0]?.result?.[0];
    const demographicsData = extractDemographicsData(result);
    
    logger.debug('getDemographicsData - extracted demographics data', { 
      ageGroups: demographicsData.length,
      hasResult: !!result,
      sampleData: demographicsData.slice(0, 3) // Log first 3 items for debugging
    });
    
    return demographicsData;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Combined Form & API Selection */}
      <div 
        className="rounded-3xl border overflow-hidden"
        style={{
          background: 'var(--glass-card-bg)',
          borderColor: 'var(--glass-card-border)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--glass-card-shadow)'
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
                boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
              }}
            >
              <BarChart3 className="h-5 w-5" style={{ color: '#34A7AD' }} />
            </div>
            <h3 className="text-foreground">{t('keywordAnalysis')}</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Keyword Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyword" className="text-sm font-medium text-foreground block">
                  Keyword *
                </Label>
                <input
                  id="keyword"
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border bg-background/50 text-foreground text-sm outline-none transition-all focus:border-[#34A7AD] focus:ring-2 focus:ring-[#34A7AD]/20 placeholder:text-muted-foreground"
                  style={{
                    borderColor: 'var(--glass-card-border)'
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-foreground block">
                  {t('location')}
                </Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                    className="w-full px-4 py-3 pr-8 rounded-xl border bg-background/50 text-foreground text-sm outline-none transition-all focus:border-[#34A7AD] focus:ring-2 focus:ring-[#34A7AD]/20 text-left"
                    style={{
                      borderColor: 'var(--glass-card-border)'
                    }}
                  >
                    {location === 'Germany' ? 'Deutschland' : 
                     location === 'United States' ? 'USA' : 
                     location === 'United Kingdom' ? 'Großbritannien' : 
                     location === 'France' ? 'Frankreich' : 
                     location === 'Spain' ? 'Spanien' : 
                     location === 'Italy' ? 'Italien' : location}
                  </button>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  {locationDropdownOpen && (
                    <div 
                      className="absolute z-50 w-full mt-1 rounded-xl border overflow-hidden max-h-40 overflow-y-auto"
                      style={{
                        background: 'var(--glass-card-bg)',
                        borderColor: 'var(--glass-card-border)',
                        backdropFilter: 'blur(16px)',
                        boxShadow: 'var(--glass-card-shadow)'
                      }}
                    >
                      {[
                        { value: 'Germany', label: 'Deutschland' },
                        { value: 'United States', label: 'USA' },
                        { value: 'United Kingdom', label: 'Großbritannien' },
                        { value: 'France', label: 'Frankreich' },
                        { value: 'Spain', label: 'Spanien' },
                        { value: 'Italy', label: 'Italien' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setLocation(option.value);
                            setLocationDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-white/10 ${
                            location === option.value ? 'bg-[#34A7AD]/10 text-[#34A7AD]' : 'text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium text-foreground block">
                  {t('language')}
                </Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                    className="w-full px-4 py-3 pr-8 rounded-xl border bg-background/50 text-foreground text-sm outline-none transition-all focus:border-[#34A7AD] focus:ring-2 focus:ring-[#34A7AD]/20 text-left"
                    style={{
                      borderColor: 'var(--glass-card-border)'
                    }}
                  >
                    {language === 'German' ? 'Deutsch' : 
                     language === 'English' ? 'Englisch' : 
                     language === 'French' ? 'Französisch' : 
                     language === 'Spanish' ? 'Spanisch' : 
                     language === 'Italian' ? 'Italienisch' : language}
                  </button>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  {languageDropdownOpen && (
                    <div 
                      className="absolute z-50 w-full mt-1 rounded-xl border overflow-hidden max-h-40 overflow-y-auto"
                      style={{
                        background: 'var(--glass-card-bg)',
                        borderColor: 'var(--glass-card-border)',
                        backdropFilter: 'blur(16px)',
                        boxShadow: 'var(--glass-card-shadow)'
                      }}
                    >
                      {[
                        { value: 'German', label: 'Deutsch' },
                        { value: 'English', label: 'Englisch' },
                        { value: 'French', label: 'Französisch' },
                        { value: 'Spanish', label: 'Spanisch' },
                        { value: 'Italian', label: 'Italienisch' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setLanguage(option.value);
                            setLanguageDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-white/10 ${
                            language === option.value ? 'bg-[#34A7AD]/10 text-[#34A7AD]' : 'text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground block">
                  {t('action')}
                </Label>
                <button
                  type="submit" 
                  disabled={loading || !keyword.trim()}
                  className="w-full px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm font-medium"
                  style={{
                    background: keyword.trim() && !loading
                      ? 'linear-gradient(145deg, #34A7AD, #5ED2D9)'
                      : 'rgba(156, 163, 175, 0.3)',
                    boxShadow: keyword.trim() && !loading
                      ? '0 4px 16px rgba(52,167,173,0.4)'
                      : 'none'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-white">{tCommon('loading')}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white">
                        {keyword.trim() ? t('analyze') : t('search')}
                      </span>
                      <span className="text-white text-xs opacity-80">
                        ({(() => {
                          const count = selectedApis.length;
                          if (count >= 5) return '3 Credits';
                          if (count >= 4) return '3 Credits';
                          if (count >= 3) return '2 Credits';
                          if (count >= 2) return '2 Credits';
                          if (count === 1) return '1 Credit';
                          return '0 Credits';
                        })()})
                      </span>
                      <Search className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* API Selection Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t('dataSources')} ({selectedApis.length} von 5 {t('activeSources')})
                </p>
                {selectedApis.length === 5 ? (
                  <button
                    onClick={() => setSelectedApis([])}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('deactivateAll')}
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedApis(['searchVolume', 'difficulty', 'trends', 'demographics', 'relatedKeywords'])}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('activateAll')}
                  </button>
                )}
              </div>

              {/* API Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { id: 'searchVolume', name: 'Search Volume', description: t('apiDescriptions.searchVolume'), icon: TrendingUp, color: '#34A7AD' },
                  { id: 'difficulty', name: 'Keyword Difficulty', description: t('apiDescriptions.difficulty'), icon: Target, color: '#9333EA' },
                  { id: 'trends', name: 'Google Trends', description: t('apiDescriptions.trends'), icon: BarChart3, color: '#F59E0B' },
                  { id: 'demographics', name: 'Demographics', description: t('apiDescriptions.demographics'), icon: Users, color: '#EC4899' },
                  { id: 'relatedKeywords', name: 'Related Keywords', description: t('apiDescriptions.relatedKeywords'), icon: Link2, color: '#10B981' }
                ].map((api) => {
                  const isActive = selectedApis.includes(api.id);
                  return (
                    <button
                      key={api.id}
                      onClick={() => {
                        if (selectedApis.includes(api.id)) {
                          setSelectedApis(selectedApis.filter(apiId => apiId !== api.id));
                        } else {
                          setSelectedApis([...selectedApis, api.id]);
                        }
                      }}
                      className={`flex items-start gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                        isActive ? 'ring-1 hover:ring-2' : 'hover:bg-white/5'
                      }`}
                      style={{
                        background: isActive 
                          ? `linear-gradient(145deg, ${api.color}10, ${api.color}05)` 
                          : 'var(--glass-card-bg)',
                        borderColor: isActive ? api.color : 'var(--glass-card-border)',
                        opacity: isActive ? 1 : 0.5
                      } as React.CSSProperties}
                    >
                      {/* Icon */}
                      <div 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isActive ? 'scale-100' : 'scale-95'
                        }`}
                        style={{
                          background: isActive ? api.color : 'rgba(156, 163, 175, 0.3)',
                          boxShadow: isActive ? `0 2px 12px ${api.color}40` : 'none'
                        }}
                      >
                        <api.icon className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5 text-left">
                        <div className="text-xs text-foreground mb-1 font-medium">
                          {api.name}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {api.description}
                        </p>
                      </div>

                      {/* Checkbox */}
                      <div 
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isActive ? 'scale-110' : 'scale-100'
                        }`}
                        style={{
                          borderColor: isActive ? api.color : 'rgba(156, 163, 175, 0.5)',
                          background: isActive ? api.color : 'transparent'
                        }}
                      >
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Empty State */}
              {selectedApis.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">
                    {t('selectDataSource')}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <OverviewLoadingSkeleton />
      ) : results ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t('results')}</h2>
              <p className="text-muted-foreground">
                {t('comprehensiveAnalysis')} "{results.keyword}"
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  📊 {t('dataforseoApi')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  🔗 {t('combinedOverview')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  💰 {t('creditsBundle')}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportResults('csv')} className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                CSV {tCommon('export')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportResults('json')} className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                JSON {tCommon('export')}
              </Button>
            </div>
          </div>

          {/* Keyword Basics - Only show if searchVolume or difficulty is selected */}
          {(selectedApis.includes('searchVolume') || selectedApis.includes('difficulty')) && (
            <OverviewBasicsCard data={getBasicsData()} loading={loadingStates.basics} />
          )}

          {/* Related Keywords - Only show if relatedKeywords is selected */}
          {selectedApis.includes('relatedKeywords') && (
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
                    boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
                  }}
                >
                  <Hash className="h-5 w-5" style={{ color: '#34A7AD' }} />
                </div>
                <h3 className="text-foreground">{t('topRelatedKeywords')}</h3>
                <Badge variant="outline" className="text-xs">
                  {getRelatedData().length} Keywords
                </Badge>
              </div>
              
              {loadingStates.related ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 bg-white/20 dark:bg-white/10 animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : (
                <RelatedKeywordsTable data={getRelatedData()} />
              )}
            </GlassCard>
          )}

          {/* Charts Row - Only show if trends or demographics is selected */}
          {((selectedApis.includes('trends') || selectedApis.includes('demographics')) && 
            (selectedApis.includes('trends') && selectedApis.includes('demographics'))) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trend Chart */}
              {selectedApis.includes('trends') && (
                <TrendChart 
                  data={getTrendData()} 
                  loading={loadingStates.trends}
                  keyword={results.keyword}
                />
              )}
              
              {/* Demographics Chart */}
              {selectedApis.includes('demographics') && (
                <DemographicsChart 
                  data={getDemographicsData()} 
                  loading={loadingStates.demographics}
                  keyword={results.keyword}
                  type="age"
                />
              )}
            </div>
          )}

          {/* Single Chart Layout */}
          {((selectedApis.includes('trends') || selectedApis.includes('demographics')) && 
            !(selectedApis.includes('trends') && selectedApis.includes('demographics'))) && (
            <div className="grid grid-cols-1 gap-6">
              {/* Trend Chart */}
              {selectedApis.includes('trends') && (
                <TrendChart 
                  data={getTrendData()} 
                  loading={loadingStates.trends}
                  keyword={results.keyword}
                />
              )}
              
              {/* Demographics Chart */}
              {selectedApis.includes('demographics') && (
                <DemographicsChart 
                  data={getDemographicsData()} 
                  loading={loadingStates.demographics}
                  keyword={results.keyword}
                  type="age"
                />
              )}
            </div>
          )}

          {/* Debug Panel - Development Only */}
          {/* <DataDebugPanel data={results} loading={loading} /> */}
        </div>
      ) : null}

      {/* Search History */}
      {loadingHistory ? (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
                boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
              }}
            >
              <History className="h-5 w-5" style={{ color: '#34A7AD' }} />
            </div>
            <h3 className="text-foreground">{t('previousAnalyses')}</h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">{t('loadingAnalysisHistory')}</span>
          </div>
        </GlassCard>
      ) : searchHistory.length > 0 ? (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
                boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
              }}
            >
              <History className="h-5 w-5" style={{ color: '#34A7AD' }} />
            </div>
            <h3 className="text-foreground">{t('previousAnalyses')}</h3>
          </div>
          
          <div className="space-y-2">
            {searchHistory.map((search, index) => (
              <div key={index} className="border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between p-3 hover:bg-white/20 dark:hover:bg-white/10 cursor-pointer transition-all duration-200"
                     onClick={() => {
                       setExpandedHistory(expandedHistory === index ? null : index);
                     }}>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium text-foreground">{search.keyword}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{search.location}</span>
                        <span>•</span>
                        <span>{search.language}</span>
                        <span>•</span>
                        <span>Overview Analyse</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {search.timestamp}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                      {expandedHistory === index ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>
                
                {expandedHistory === index && (
                  <div className="border-t p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">{t('comprehensiveAnalysis')} "{search.keyword}"</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => exportResults('csv')} className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                            <Download className="h-4 w-4 mr-2" />
                            CSV {tCommon('export')}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => exportResults('json')} className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                            <Download className="h-4 w-4 mr-2" />
                            JSON {tCommon('export')}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Show basic metrics from history */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <KeywordMetricsCard
                          title={t('searchVolume')}
                          value={(() => {
                            const volumeResult = search.results.searchVolume?.tasks?.[0]?.result?.[0];
                            let searchVolume = null;
                            
                            if (volumeResult?.keyword_info?.search_volume) {
                              searchVolume = volumeResult.keyword_info.search_volume;
                            } else if (volumeResult?.search_volume) {
                              searchVolume = volumeResult.search_volume;
                            } else if (volumeResult?.items?.[0]?.keyword_info?.search_volume) {
                              searchVolume = volumeResult.items[0].keyword_info.search_volume;
                            } else if (volumeResult?.items?.[0]?.search_volume) {
                              searchVolume = volumeResult.items[0].search_volume;
                            }
                            
                            return searchVolume ? searchVolume.toLocaleString() : 'N/A';
                          })()}
                          icon={TrendingUp}
                        />
                        <KeywordMetricsCard
                          title="CPC"
                          value={(() => {
                            const volumeResult = search.results.searchVolume?.tasks?.[0]?.result?.[0];
                            let cpc = null;
                            
                            if (volumeResult?.keyword_info?.cpc) {
                              cpc = volumeResult.keyword_info.cpc;
                            } else if (volumeResult?.cpc) {
                              cpc = volumeResult.cpc;
                            } else if (volumeResult?.items?.[0]?.keyword_info?.cpc) {
                              cpc = volumeResult.items[0].keyword_info.cpc;
                            } else if (volumeResult?.items?.[0]?.cpc) {
                              cpc = volumeResult.items[0].cpc;
                            }
                            
                            return cpc ? `$${cpc.toFixed(2)}` : 'N/A';
                          })()}
                          icon={BarChart3}
                        />
                        <KeywordMetricsCard
                          title={t('difficulty')}
                          value={(() => {
                            const difficultyResult = search.results.difficulty?.tasks?.[0]?.result?.[0];
                            let difficulty = null;
                            
                            if (difficultyResult?.keyword_difficulty !== undefined) {
                              difficulty = difficultyResult.keyword_difficulty;
                            } else if (difficultyResult?.items?.[0]?.keyword_difficulty !== undefined) {
                              difficulty = difficultyResult.items[0].keyword_difficulty;
                            }
                            
                            return difficulty !== undefined ? `${Math.round(difficulty)}%` : 'N/A';
                          })()}
                          icon={Hash}
                        />
                        <KeywordMetricsCard
                          title={t('relatedKeywords')}
                          value={`${search.results.related?.tasks?.[0]?.result?.[0]?.items?.length || 0}`}
                          icon={Hash}
                        />
                      </div>

                      {/* Related Keywords Table */}
                      <GlassCard className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
                              boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
                            }}
                          >
                            <Hash className="h-5 w-5" style={{ color: '#34A7AD' }} />
                          </div>
                          <h3 className="text-foreground">{t('topRelatedKeywords')}</h3>
                        </div>
                        
                        <RelatedKeywordsTable data={(() => {
                          if (!search.results?.related) return [];
                          
                          return search.results.related.tasks?.[0]?.result?.[0]?.items?.map((item: any) => ({
                            keyword: item.keyword_data?.keyword || item.keyword || 'Unknown',
                            search_volume: item.keyword_data?.keyword_info?.search_volume || 0,
                            competition: item.keyword_data?.keyword_info?.competition_level === 'HIGH' ? 0.8 : 
                                        item.keyword_data?.keyword_info?.competition_level === 'MEDIUM' ? 0.5 : 0.2,
                            cpc: item.keyword_data?.keyword_info?.cpc || 0,
                            trend: item.keyword_data?.keyword_info?.search_volume_trend?.yearly || 0,
                            related_keywords: item.related_keywords || []
                          })) || [];
                        })()} />
                      </GlassCard>

                      {/* Charts Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Trend Chart */}
                        <TrendChart 
                          data={(() => {
                            // Extract real trend data from history using validator
                            const trendsData = search.results.trends?.tasks?.[0]?.result?.[0];
                            return extractTrendData(trendsData);
                          })()} 
                          loading={false}
                          keyword={search.keyword}
                        />

                        {/* Demographics Chart */}
                        <DemographicsChart 
                          data={(() => {
                            // Extract real demographics data from history using validator
                            const demographicsData = search.results.demographics?.tasks?.[0]?.result?.[0];
                            return extractDemographicsData(demographicsData);
                          })()} 
                          loading={false}
                          keyword={search.keyword}
                          type="age"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
                boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
              }}
            >
              <History className="h-5 w-5" style={{ color: '#34A7AD' }} />
            </div>
            <h3 className="text-foreground">{t('previousAnalyses')}</h3>
          </div>
          
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('noPreviousAnalyses')}</p>
            <p className="text-sm">{t('startFirstAnalysis')}</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
