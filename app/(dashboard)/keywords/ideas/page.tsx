'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Globe, 
  Download,
  Loader2,
  Hash,
  Lightbulb,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';

interface KeywordIdea {
  keyword: string;
  search_volume: number;
  competition: number;
  cpc: number;
  trend: number;
  keyword_info: {
    se_type: string;
    last_updated_time: string;
    competition_level: number;
    cpc: number;
    search_volume: number;
    categories: string[];
    monthly_searches: Array<{
      year: number;
      month: number;
      search_volume: number;
    }>;
  };
}

export default function KeywordIdeasPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<KeywordIdea[]>([]);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{
    keyword: string;
    location: string;
    language: string;
    timestamp: string;
    resultsCount: number;
    results: KeywordIdea[];
    analysisId: string;
  }>>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=keywords_ideas&limit=10');
        if (response.ok) {
          const data = await response.json();
          const historyData = data.analyses?.map((analysis: any) => ({
            keyword: analysis.input?.keyword || analysis.parameters?.keyword || 'Unbekanntes Keyword',
            location: analysis.input?.location || analysis.parameters?.location || 'Deutschland',
            language: analysis.input?.language || analysis.parameters?.language || 'Deutsch',
            timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
            resultsCount: analysis.result?.length || 0,
            results: analysis.result || [],
            analysisId: analysis.id
          })) || [];
          setSearchHistory(historyData);
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
    setResults([]);

    try {
      const response = await fetch('/api/keywords/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          location,
          language,
          limit
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Analyse');
      }

      setResults(data.data || []);
      setAnalysisId(data.analysisId);

      // Add to search history
      if (data.data && data.data.length > 0) {
        const newHistoryItem = {
          keyword: keyword.trim(),
          location,
          language,
          timestamp: new Date().toLocaleString('de-DE'),
          resultsCount: data.data.length,
          results: data.data,
          analysisId: data.analysisId
        };
        setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryResults = (historyItem: any) => {
    setKeyword(historyItem.keyword);
    setLocation(historyItem.location);
    setLanguage(historyItem.language);
    setResults(historyItem.results);
    setAnalysisId(historyItem.analysisId);
    setExpandedHistory(null);
  };

  const exportResults = (format: 'csv' | 'json') => {
    if (results.length === 0) return;

    const data = results.map(item => ({
      keyword: item.keyword,
      search_volume: item.search_volume,
      competition: item.competition,
      cpc: item.cpc,
      trend: item.trend,
      categories: item.keyword_info?.categories?.join(', ') || ''
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-ideas-${keyword}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-ideas-${keyword}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keyword Ideas</h1>
        <p className="text-muted-foreground">
          Kreative Keyword-Ideen für deine Content-Strategie
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
            <Lightbulb className="h-5 w-5" style={{ color: '#34A7AD' }} />
          </div>
          <h3 className="text-foreground">Keyword-Ideen Generator</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="limit" className="text-foreground">Anzahl Ideen</Label>
              <Input
                id="limit"
                type="number"
                min="1"
                max="100"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading || !keyword.trim()}
              className="flex-1 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generiere Ideen...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Ideen generieren
                </>
              )}
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Keyword-Ideen</h2>
              <p className="text-muted-foreground">
                {results.length} kreative Ideen für "{keyword}" gefunden
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md text-xs border" style={{ backgroundColor: 'rgba(52,167,173,0.1)', borderColor: 'rgba(52,167,173,0.2)', color: '#34A7AD' }}>
                  📊 DataForSEO API
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs border" style={{ backgroundColor: 'rgba(52,167,173,0.1)', borderColor: 'rgba(52,167,173,0.2)', color: '#34A7AD' }}>
                  💡 googleKeywordIdeasLive
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportResults('csv')}>
                <Download className="h-4 w-4 mr-2" />
                CSV Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportResults('json')}>
                <Download className="h-4 w-4 mr-2" />
                JSON Export
              </Button>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KeywordMetricsCard
              title="Durchschnittliches Suchvolumen"
              value={Math.round(results.reduce((sum, r) => sum + r.search_volume, 0) / results.length).toLocaleString()}
              icon={TrendingUp}
            />
            <KeywordMetricsCard
              title="Durchschnittliche Konkurrenz"
              value={`${Math.round(results.reduce((sum, r) => sum + r.competition, 0) / results.length * 100)}%`}
              icon={Hash}
            />
            <KeywordMetricsCard
              title="Durchschnittlicher CPC"
              value={`$${(results.reduce((sum, r) => sum + r.cpc, 0) / results.length).toFixed(2)}`}
              icon={Globe}
            />
            <KeywordMetricsCard
              title="Positive Trends"
              value={`${results.filter(r => r.trend > 0).length}/${results.length}`}
              icon={TrendingUp}
            />
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item, index) => (
              <GlassCard key={index} className="p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" style={{ color: '#34A7AD' }} />
                    <h4 className="text-base font-medium text-foreground">{item.keyword}</h4>
                  </div>
                  <span 
                    className="px-2 py-0.5 rounded-md text-xs font-medium"
                    style={
                      item.competition < 0.3 
                        ? { backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981' }
                        : item.competition < 0.7 
                        ? { backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B' }
                        : { backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444' }
                    }
                  >
                    {item.competition < 0.3 ? 'Niedrig' : item.competition < 0.7 ? 'Mittel' : 'Hoch'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Suchvolumen:</span>
                      <div className="font-medium text-foreground">{item.search_volume.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CPC:</span>
                      <div className="font-medium text-foreground">${item.cpc.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Trend:</span>
                    <div className="flex items-center gap-1">
                      {item.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 dark:text-green-400" />
                      ) : item.trend < 0 ? (
                        <TrendingUp className="h-3 w-3 text-red-500 dark:text-red-400 rotate-180" />
                      ) : (
                        <div className="h-3 w-3 bg-muted rounded-full" />
                      )}
                      <span className={`text-sm font-medium ${
                        item.trend > 0 ? 'text-green-600 dark:text-green-400' :
                        item.trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                      }`}>
                        {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  {item.keyword_info?.categories && item.keyword_info.categories.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Kategorien:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.keyword_info.categories.slice(0, 3).map((category, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-0.5 rounded-md text-xs border"
                            style={{
                              backgroundColor: 'rgba(52,167,173,0.1)',
                              borderColor: 'rgba(52,167,173,0.2)',
                              color: '#34A7AD'
                            }}
                          >
                            {category}
                          </span>
                        ))}
                        {item.keyword_info.categories.length > 3 && (
                          <span 
                            className="px-2 py-0.5 rounded-md text-xs border"
                            style={{
                              backgroundColor: 'rgba(52,167,173,0.1)',
                              borderColor: 'rgba(52,167,173,0.2)',
                              color: '#34A7AD'
                            }}
                          >
                            +{item.keyword_info.categories.length - 3} mehr
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

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
            <h3 className="text-foreground">Vorherige Suchen</h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Lade Suchhistorie...</span>
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
            <h3 className="text-foreground">Vorherige Suchen</h3>
          </div>
          
          <div className="space-y-4">
            {searchHistory.map((item, index) => (
              <div key={item.analysisId} className="border rounded-xl p-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4" style={{ color: '#34A7AD' }} />
                      <span className="font-medium text-foreground">{item.keyword}</span>
                      <span 
                        className="px-2 py-0.5 rounded-md text-xs border"
                        style={{
                          backgroundColor: 'rgba(52,167,173,0.1)',
                          borderColor: 'rgba(52,167,173,0.2)',
                          color: '#34A7AD'
                        }}
                      >
                        {item.location}
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded-md text-xs border"
                        style={{
                          backgroundColor: 'rgba(52,167,173,0.1)',
                          borderColor: 'rgba(52,167,173,0.2)',
                          color: '#34A7AD'
                        }}
                      >
                        {item.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.timestamp}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.resultsCount} Ideen
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadHistoryResults(item)}
                      className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Anzeigen
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedHistory(expandedHistory === index ? null : index)}
                      className="hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
                    >
                      {expandedHistory === index ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {expandedHistory === index && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <KeywordMetricsCard
                        title="Durchschnittliches Suchvolumen"
                        value={Math.round(item.results.reduce((sum, r) => sum + r.search_volume, 0) / item.results.length).toLocaleString()}
                        icon={TrendingUp}
                      />
                      <KeywordMetricsCard
                        title="Durchschnittliche Konkurrenz"
                        value={`${Math.round(item.results.reduce((sum, r) => sum + r.competition, 0) / item.results.length * 100)}%`}
                        icon={Hash}
                      />
                      <KeywordMetricsCard
                        title="Durchschnittlicher CPC"
                        value={`$${(item.results.reduce((sum, r) => sum + r.cpc, 0) / item.results.length).toFixed(2)}`}
                        icon={Globe}
                      />
                      <KeywordMetricsCard
                        title="Positive Trends"
                        value={`${item.results.filter(r => r.trend > 0).length}/${item.results.length}`}
                        icon={TrendingUp}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {item.results.slice(0, 6).map((result, idx) => (
                        <GlassCard key={idx} className="p-4 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Hash className="h-4 w-4" style={{ color: '#34A7AD' }} />
                              <h4 className="text-base font-medium text-foreground">{result.keyword}</h4>
                            </div>
                            <span 
                              className="px-2 py-0.5 rounded-md text-xs font-medium"
                              style={
                                result.competition < 0.3 
                                  ? { backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981' }
                                  : result.competition < 0.7 
                                  ? { backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B' }
                                  : { backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444' }
                              }
                            >
                              {result.competition < 0.3 ? 'Niedrig' : result.competition < 0.7 ? 'Mittel' : 'Hoch'}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Suchvolumen:</span>
                                <div className="font-medium text-foreground">{result.search_volume.toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">CPC:</span>
                                <div className="font-medium text-foreground">${result.cpc.toFixed(2)}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Trend:</span>
                              <div className="flex items-center gap-1">
                                {result.trend > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-green-500 dark:text-green-400" />
                                ) : result.trend < 0 ? (
                                  <TrendingUp className="h-3 w-3 text-red-500 dark:text-red-400 rotate-180" />
                                ) : (
                                  <div className="h-3 w-3 bg-muted rounded-full" />
                                )}
                                <span className={`text-sm font-medium ${
                                  result.trend > 0 ? 'text-green-600 dark:text-green-400' :
                                  result.trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                                }`}>
                                  {result.trend > 0 ? '+' : ''}{result.trend.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
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
            <h3 className="text-foreground">Vorherige Suchen</h3>
          </div>
          
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Noch keine vorherigen Suchen vorhanden.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Führe deine erste Keyword-Ideen-Suche durch, um hier Ergebnisse zu sehen.
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
