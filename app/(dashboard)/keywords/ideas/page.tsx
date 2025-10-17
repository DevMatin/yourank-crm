'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Keyword-Ideen Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Keyword *</Label>
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
                <Label htmlFor="location">Standort</Label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <Label htmlFor="language">Sprache</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="German">Deutsch</option>
                  <option value="English">Englisch</option>
                  <option value="French">Französisch</option>
                  <option value="Spanish">Spanisch</option>
                  <option value="Italian">Italienisch</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="limit">Anzahl Ideen</Label>
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
                className="flex-1"
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
        </CardContent>
      </Card>

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
                <Badge variant="outline" className="text-xs">
                  📊 DataForSEO API
                </Badge>
                <Badge variant="outline" className="text-xs">
                  💡 googleKeywordIdeasLive
                </Badge>
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
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-primary" />
                      <CardTitle className="text-base">{item.keyword}</CardTitle>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={
                        item.competition < 0.3 
                          ? 'bg-green-100 text-green-800' 
                          : item.competition < 0.7 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {item.competition < 0.3 ? 'Niedrig' : item.competition < 0.7 ? 'Mittel' : 'Hoch'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Suchvolumen:</span>
                      <div className="font-medium">{item.search_volume.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CPC:</span>
                      <div className="font-medium">${item.cpc.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Trend:</span>
                    <div className="flex items-center gap-1">
                      {item.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : item.trend < 0 ? (
                        <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                      ) : (
                        <div className="h-3 w-3 bg-gray-400 rounded-full" />
                      )}
                      <span className="text-sm font-medium">
                        {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  {item.keyword_info?.categories && item.keyword_info.categories.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Kategorien:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.keyword_info.categories.slice(0, 3).map((category, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {item.keyword_info.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.keyword_info.categories.length - 3} mehr
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search History */}
      {loadingHistory ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Vorherige Suchen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Lade Suchhistorie...</span>
            </div>
          </CardContent>
        </Card>
      ) : searchHistory.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Vorherige Suchen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchHistory.map((item, index) => (
              <div key={item.analysisId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4 text-primary" />
                      <span className="font-medium">{item.keyword}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.location}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.language}
                      </Badge>
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
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Anzeigen
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedHistory(expandedHistory === index ? null : index)}
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
                  <div className="mt-4 pt-4 border-t">
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
                        <Card key={idx} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base">{result.keyword}</CardTitle>
                              </div>
                              <Badge 
                                variant="secondary" 
                                className={
                                  result.competition < 0.3 
                                    ? 'bg-green-100 text-green-800' 
                                    : result.competition < 0.7 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {result.competition < 0.3 ? 'Niedrig' : result.competition < 0.7 ? 'Mittel' : 'Hoch'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Suchvolumen:</span>
                                <div className="font-medium">{result.search_volume.toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">CPC:</span>
                                <div className="font-medium">${result.cpc.toFixed(2)}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Trend:</span>
                              <div className="flex items-center gap-1">
                                {result.trend > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-green-600" />
                                ) : result.trend < 0 ? (
                                  <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                                ) : (
                                  <div className="h-3 w-3 bg-gray-400 rounded-full" />
                                )}
                                <span className="text-sm font-medium">
                                  {result.trend > 0 ? '+' : ''}{result.trend.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Vorherige Suchen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Noch keine vorherigen Suchen vorhanden.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Führe deine erste Keyword-Ideen-Suche durch, um hier Ergebnisse zu sehen.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
