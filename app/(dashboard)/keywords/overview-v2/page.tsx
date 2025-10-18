'use client';

import { useState, useEffect } from 'react';
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
  Hash
} from 'lucide-react';
import { OverviewBasicsCard } from '@/components/keywords/overview-basics-card';
import { TrendChart } from '@/components/keywords/trend-chart';
import { DemographicsChart } from '@/components/keywords/demographics-chart';
import { OverviewLoadingSkeleton } from '@/components/keywords/loading-skeleton';
import { RelatedKeywordsTable } from '@/components/keywords/related-keywords-table';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';
import { CombinedKeywordOverview, LoadingStates } from '@/types/analysis';

interface OverviewHistory {
  keyword: string;
  location: string;
  language: string;
  timestamp: string;
  analysisId: string;
  results: CombinedKeywordOverview;
}

export default function OverviewPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<CombinedKeywordOverview | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<OverviewHistory[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    basics: false,
    related: false,
    trends: false,
    demographics: false,
    research: false
  });

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=keywords_overview&limit=10');
        if (response.ok) {
          const data = await response.json();
          
          const historyData = data.analyses?.map((analysis: any) => ({
            keyword: analysis.input?.keyword || 'Unbekanntes Keyword',
            location: analysis.input?.location || 'Deutschland',
            language: analysis.input?.language || 'Deutsch',
            timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
            analysisId: analysis.id,
            results: analysis.result?.overview || {}
          })) || [];
          
          setSearchHistory(historyData);
          
          // Debug: Log history data structure
          console.log('History data structure:', historyData);
          if (historyData.length > 0) {
            console.log('First history item results:', historyData[0].results);
          }
        }
      } catch (error) {
        console.error('Failed to load search history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadSearchHistory();
  }, []);

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
          language
        }),
      });

      const data = await response.json();
      
      console.log('🔍 Overview API Response:', data);
      console.log('📊 Partial Results Status:', data.partialResults);
      console.log('💰 Credits Used:', data.creditsUsed);
      console.log('🆔 Analysis ID:', data.analysisId);

      if (!response.ok) {
        const errorMessage = data.isConnectionError 
          ? 'Verbindungsfehler zur DataForSEO API. Bitte versuche es in ein paar Sekunden erneut.'
          : data.error || 'Fehler bei der Analyse';
        throw new Error(errorMessage);
      }

      setResults(data.data);
      setAnalysisId(data.analysisId);
      
      // Debug: Log detailed results structure
      console.log('📈 Detailed Results Structure:');
      console.log('  🔗 Related Keywords:', data.data?.related);
      console.log('  📊 Search Volume:', data.data?.searchVolume);
      console.log('  🎯 Difficulty:', data.data?.difficulty);
      console.log('  📈 Trends:', data.data?.trends);
      console.log('  👥 Demographics:', data.data?.demographics);
      
      // Debug: Check which APIs succeeded/failed
      console.log('✅ API Success Status:');
      console.log('  Related Keywords:', data.partialResults?.related ? '✅ SUCCESS' : '❌ FAILED');
      console.log('  Search Volume:', data.partialResults?.volume ? '✅ SUCCESS' : '❌ FAILED');
      console.log('  Difficulty:', data.partialResults?.difficulty ? '✅ SUCCESS' : '❌ FAILED');
      console.log('  Trends:', data.partialResults?.trends ? '✅ SUCCESS' : '❌ FAILED');
      console.log('  Demographics:', data.partialResults?.demographics ? '✅ SUCCESS' : '❌ FAILED');
      
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
      console.error('❌ Overview API Error:', err);
      console.error('❌ Error Details:', {
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

  // Extract data for components
  const getBasicsData = () => {
    if (!results) return null;
    
    console.log('getBasicsData - results:', results);
    
    // Extract search volume and CPC from the correct structure
    const volumeResult = results.searchVolume?.tasks?.[0]?.result?.[0];
    const difficultyResult = results.difficulty?.tasks?.[0]?.result?.[0];
    
    console.log('getBasicsData - volumeResult:', volumeResult);
    console.log('getBasicsData - difficultyResult:', difficultyResult);
    console.log('getBasicsData - volumeResult.items:', volumeResult?.items);
    console.log('getBasicsData - difficultyResult.items:', difficultyResult?.items);
    console.log('getBasicsData - volumeResult.keyword_info:', volumeResult?.keyword_info);
    
    // Extract search volume and CPC - check different possible structures
    let searchVolume = null;
    let cpc = null;
    
    // Try different paths for search volume data
    if (volumeResult?.keyword_info?.search_volume) {
      searchVolume = volumeResult.keyword_info.search_volume;
      cpc = volumeResult.keyword_info.cpc;
    } else if (volumeResult?.search_volume) {
      searchVolume = volumeResult.search_volume;
      cpc = volumeResult.cpc;
    } else if (volumeResult?.items?.[0]?.keyword_info?.search_volume) {
      searchVolume = volumeResult.items[0].keyword_info.search_volume;
      cpc = volumeResult.items[0].keyword_info.cpc;
    } else if (volumeResult?.items) {
      // Check if data is in items array
      const item = volumeResult.items[0];
      if (item?.keyword_info?.search_volume) {
        searchVolume = item.keyword_info.search_volume;
        cpc = item.keyword_info.cpc;
      } else if (item?.search_volume) {
        searchVolume = item.search_volume;
        cpc = item.cpc;
      }
    }
    
    // Extract difficulty - check different possible structures
    let difficulty = null;
    if (difficultyResult?.keyword_difficulty !== undefined) {
      difficulty = difficultyResult.keyword_difficulty;
    } else if (difficultyResult?.items?.[0]?.keyword_difficulty !== undefined) {
      difficulty = difficultyResult.items[0].keyword_difficulty;
    } else if (difficultyResult?.items) {
      // Check if data is in items array
      const item = difficultyResult.items[0];
      if (item?.keyword_difficulty !== undefined) {
        difficulty = item.keyword_difficulty;
      }
    }
    
    console.log('Final extracted values:', { searchVolume, cpc, difficulty });
    
    // Extract trend data - check different possible structures
    let trend = null;
    if (volumeResult?.keyword_info?.search_volume_trend?.yearly !== undefined) {
      trend = volumeResult.keyword_info.search_volume_trend.yearly;
    } else if (volumeResult?.search_volume_trend?.yearly !== undefined) {
      trend = volumeResult.search_volume_trend.yearly;
    } else if (volumeResult?.items?.[0]?.keyword_info?.search_volume_trend?.yearly !== undefined) {
      trend = volumeResult.items[0].keyword_info.search_volume_trend.yearly;
    } else if (volumeResult?.items?.[0]?.search_volume_trend?.yearly !== undefined) {
      trend = volumeResult.items[0].search_volume_trend.yearly;
    }
    
    console.log('Final extracted values:', { searchVolume, cpc, difficulty, trend });
    
    return {
      keyword: results.keyword,
      searchVolume,
      cpc,
      difficulty,
      trend
    };
  };

  const getRelatedData = () => {
    if (!results?.related) return [];
    
    return results.related.tasks?.[0]?.result?.[0]?.items?.map((item: any) => ({
      keyword: item.keyword_data?.keyword || item.keyword || 'Unknown',
      search_volume: item.keyword_data?.keyword_info?.search_volume || 0,
      competition: item.keyword_data?.keyword_info?.competition_level === 'HIGH' ? 0.8 : 
                  item.keyword_data?.keyword_info?.competition_level === 'MEDIUM' ? 0.5 : 0.2,
      cpc: item.keyword_data?.keyword_info?.cpc || 0,
      trend: item.keyword_data?.keyword_info?.search_volume_trend?.yearly || 0,
      related_keywords: item.related_keywords || []
    })) || [];
  };

  const getTrendData = () => {
    console.log('getTrendData called with results:', results);
    console.log('getTrendData - results.trends:', results?.trends);
    
    if (!results?.trends) {
      console.log('getTrendData - No trends data, returning empty array');
      return [];
    }
    
    // Extract real trend data from Google Trends API
    const trendsData = results.trends?.tasks?.[0]?.result?.[0];
    
    console.log('getTrendData - Full trends data:', results.trends);
    console.log('getTrendData - trendsData:', trendsData);
    console.log('getTrendData - trendsData.items:', trendsData?.items);
    console.log('getTrendData - trendsData.items[0]:', trendsData?.items?.[0]);
    console.log('getTrendData - trendsData.items[0].items:', trendsData?.items?.[0]?.items);
    
    if (trendsData?.items?.[0]?.items?.[0]) {
      console.log('getTrendData - First item:', trendsData.items[0].items[0]);
    }
    
      // Check different possible structures
      if (trendsData?.items?.[0]?.items) {
        return trendsData.items[0].items.map((item: any, index: number) => {
          console.log(`Trend item ${index}:`, item);
          console.log(`Trend item ${index} values:`, item.values);
          
          let dateStr = '';
          if (item.date_from) {
            dateStr = new Date(item.date_from).toLocaleDateString('de-DE', { month: 'short' });
          } else if (item.date) {
            dateStr = new Date(item.date).toLocaleDateString('de-DE', { month: 'short' });
          } else {
            // Fallback to month names if no date
            const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
            dateStr = months[index % 12];
          }
          
          const result = {
            month: dateStr,
            volume: item.values?.[0] || 0,
            trend: item.values?.[0] || 0
          };
          
          console.log(`Trend result ${index}:`, result);
          return result;
        });
      } else if (trendsData?.items) {
        // Alternative structure - data might be directly in items
        return trendsData.items.map((item: any, index: number) => {
          console.log(`Trend item ${index}:`, item);
          console.log(`Trend item ${index} values:`, item.values);
          
          let dateStr = '';
          if (item.date_from) {
            dateStr = new Date(item.date_from).toLocaleDateString('de-DE', { month: 'short' });
          } else if (item.date) {
            dateStr = new Date(item.date).toLocaleDateString('de-DE', { month: 'short' });
          } else {
            // Fallback to month names if no date
            const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
            dateStr = months[index % 12];
          }
          
          const result = {
            month: dateStr,
            volume: item.values?.[0] || 0,
            trend: item.values?.[0] || 0
          };
          
          console.log(`Trend result ${index}:`, result);
          return result;
        });
      }
    
    // Fallback to empty array if no trend data
    return [];
  };

  const getDemographicsData = () => {
    if (!results?.demographics) return [];
    
    // Extract real demographics data from DataForSEO API
    const demographicsData = results.demographics?.tasks?.[0]?.result?.[0];
    
    if (demographicsData?.items?.[0]?.demography?.age?.[0]?.values) {
      return demographicsData.items[0].demography.age[0].values.map((group: any) => ({
        age_group: group.type || 'Unknown',
        percentage: group.value || 0
      }));
    }
    
    // Fallback to empty array if no demographics data
    return [];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keyword Overview</h1>
        <p className="text-muted-foreground">
          All-in-One Keyword Zusammenfassung mit allen wichtigen Metriken
        </p>
      </div>

      {/* Form */}
      <GlassCard className="p-6">
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
          <h3 className="text-foreground">Keyword-Analyse</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyword" className="text-foreground">Keyword *</Label>
              <Input
                id="keyword"
                type="text"
                placeholder="z.B. seo tools"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground">Standort</Label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex h-10 w-full rounded-xl border px-3 py-2 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'var(--glass-card-border)'
                }}
              >
                <option value="Germany">Deutschland</option>
                <option value="United States">USA</option>
                <option value="United Kingdom">Großbritannien</option>
                <option value="France">Frankreich</option>
                <option value="Spain">Spanien</option>
                <option value="Italy">Italien</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language" className="text-foreground">Sprache</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex h-10 w-full rounded-xl border px-3 py-2 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'var(--glass-card-border)'
                }}
              >
                <option value="German">Deutsch</option>
                <option value="English">Englisch</option>
                <option value="French">Französisch</option>
                <option value="Spanish">Spanisch</option>
                <option value="Italian">Italienisch</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading || !keyword.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analysieren (3 Credits)
                </>
              )}
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Results */}
      {loading ? (
        <OverviewLoadingSkeleton />
      ) : results ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Ergebnisse</h2>
              <p className="text-muted-foreground">
                Umfassende Analyse für "{results.keyword}"
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  📊 DataForSEO API
                </Badge>
                <Badge variant="outline" className="text-xs">
                  🔗 Combined Overview
                </Badge>
                <Badge variant="outline" className="text-xs">
                  💰 3 Credits (Bundle)
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportResults('csv')} className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                CSV Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportResults('json')} className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                JSON Export
              </Button>
            </div>
          </div>

          {/* Keyword Basics */}
          <OverviewBasicsCard data={getBasicsData()} loading={loadingStates.basics} />

          {/* Related Keywords */}
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
              <h3 className="text-foreground">Top Related Keywords</h3>
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

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <TrendChart 
              data={(() => {
                console.log('TrendChart - Calling getTrendData()');
                const trendData = getTrendData();
                console.log('TrendChart - getTrendData() returned:', trendData);
                return trendData;
              })()} 
              loading={loadingStates.trends}
              keyword={results.keyword}
            />

            {/* Demographics Chart */}
            <DemographicsChart 
              data={getDemographicsData()} 
              loading={loadingStates.demographics}
              keyword={results.keyword}
              type="age"
            />
          </div>
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
            <h3 className="text-foreground">Vorherige Analysen</h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Lade Analysehistorie...</span>
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
            <h3 className="text-foreground">Vorherige Analysen</h3>
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
                        <h3 className="text-lg font-semibold text-foreground">Overview für "{search.keyword}"</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => exportResults('csv')} className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                            <Download className="h-4 w-4 mr-2" />
                            CSV Export
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => exportResults('json')} className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                            <Download className="h-4 w-4 mr-2" />
                            JSON Export
                          </Button>
                        </div>
                      </div>
                      
                      {/* Show basic metrics from history */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <KeywordMetricsCard
                          title="Suchvolumen"
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
                          title="Schwierigkeit"
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
                          title="Related Keywords"
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
                          <h3 className="text-foreground">Top Related Keywords</h3>
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
                            // Extract real trend data from history
                            console.log('History trends data:', search.results.trends);
                            const trendsData = search.results.trends?.tasks?.[0]?.result?.[0];
                            console.log('History trendsData:', trendsData);
                            if (trendsData?.items?.[0]?.items?.[0]) {
                              console.log('History - First item:', trendsData.items[0].items[0]);
                              console.log('History - First item values:', trendsData.items[0].items[0].values);
                              console.log('History - First item date_from:', trendsData.items[0].items[0].date_from);
                              console.log('History - First item date_to:', trendsData.items[0].items[0].date_to);
                            }
                            
                            // Check different possible structures for history trends
                            if (trendsData?.items?.[0]?.items) {
                              return trendsData.items[0].items.map((item: any, index: number) => {
                                let dateStr = '';
                                if (item.date_from) {
                                  dateStr = new Date(item.date_from).toLocaleDateString('de-DE', { month: 'short' });
                                } else if (item.date) {
                                  dateStr = new Date(item.date).toLocaleDateString('de-DE', { month: 'short' });
                                } else {
                                  // Fallback to month names if no date
                                  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
                                  dateStr = months[index % 12];
                                }
                                
                                return {
                                  month: dateStr,
                                  volume: item.values?.[0] || 0,
                                  trend: item.values?.[0] || 0
                                };
                              });
                            } else if (trendsData?.items) {
                              // Alternative structure - data might be directly in items
                              return trendsData.items.map((item: any, index: number) => {
                                let dateStr = '';
                                if (item.date_from) {
                                  dateStr = new Date(item.date_from).toLocaleDateString('de-DE', { month: 'short' });
                                } else if (item.date) {
                                  dateStr = new Date(item.date).toLocaleDateString('de-DE', { month: 'short' });
                                } else {
                                  // Fallback to month names if no date
                                  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
                                  dateStr = months[index % 12];
                                }
                                
                                return {
                                  month: dateStr,
                                  volume: item.values?.[0] || 0,
                                  trend: item.values?.[0] || 0
                                };
                              });
                            }
                            
                            console.log('No trend data found in history');
                            return [];
                          })()} 
                          loading={false}
                          keyword={search.keyword}
                        />

                        {/* Demographics Chart */}
                        <DemographicsChart 
                          data={(() => {
                            // Extract real demographics data from history
                            console.log('History demographics data:', search.results.demographics);
                            const demographicsData = search.results.demographics?.tasks?.[0]?.result?.[0];
                            console.log('History demographicsData:', demographicsData);
                            
                            if (demographicsData?.items?.[0]?.demography?.age?.[0]?.values) {
                              const demoItems = demographicsData.items[0].demography.age[0].values.map((group: any) => ({
                                age_group: group.type || 'Unknown',
                                percentage: group.value || 0
                              }));
                              console.log('History demographics items:', demoItems);
                              return demoItems;
                            }
                            
                            console.log('No demographics data found in history');
                            return [];
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
            <h3 className="text-foreground">Vorherige Analysen</h3>
          </div>
          
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Noch keine vorherigen Overview-Analysen vorhanden.</p>
            <p className="text-sm">Führe deine erste Keyword-Overview durch, um hier Ergebnisse zu sehen.</p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
