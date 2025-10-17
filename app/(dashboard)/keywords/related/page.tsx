'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Hash, 
  Search, 
  TrendingUp, 
  Globe, 
  Download,
  Loader2,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RelatedKeywordsTable } from '@/components/keywords/related-keywords-table';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';

interface RelatedKeyword {
  keyword: string;
  search_volume: number;
  competition: number;
  cpc: number;
  trend: number;
  related_keywords: string[];
}

export default function RelatedKeywordsPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<RelatedKeyword[]>([]);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{
    keyword: string;
    location: string;
    language: string;
    timestamp: string;
    resultsCount: number;
    results: RelatedKeyword[];
    analysisId: string;
  }>>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=keywords_related&limit=10');
        if (response.ok) {
          const data = await response.json();
          console.log('Analysis history data:', data);
          console.log('Analyses:', data.analyses);
          
          const historyData = data.analyses?.map((analysis: any) => {
            console.log('Processing analysis:', analysis);
            console.log('Parameters:', analysis.parameters);
            
            return {
              keyword: analysis.input?.keyword || analysis.parameters?.keyword || analysis.parameters?.query || 'Unbekanntes Keyword',
              location: analysis.input?.location || analysis.parameters?.location || 'Deutschland',
              language: analysis.input?.language || analysis.parameters?.language || 'Deutsch',
              timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
              resultsCount: analysis.result?.length || 0,
              results: analysis.result || [],
              analysisId: analysis.id
            };
          }) || [];
          
          console.log('Processed history data:', historyData);
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
      const response = await fetch('/api/keywords/related', {
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
      
      // Debug logging
      console.log('API Response:', data);
      console.log('Response status:', response.status);
      console.log('Data.data:', data.data);
      console.log('Data.data length:', data.data?.length);
      console.log('Data source:', data.source);
      console.log('DataForSEO Task ID:', data.dataForSeoTaskId);
      console.log('API Endpoint:', data.apiEndpoint);

      if (!response.ok) {
        const errorMessage = data.isConnectionError 
          ? 'Verbindungsfehler zur DataForSEO API. Bitte versuche es in ein paar Sekunden erneut.'
          : data.error || 'Fehler bei der Analyse';
        throw new Error(errorMessage);
      }

      setResults(data.data || []);
      setAnalysisId(data.analysisId);
      
      // Add to search history with results
      const newSearchEntry = {
        keyword: keyword.trim(),
        location,
        language,
        timestamp: new Date().toLocaleString('de-DE'),
        resultsCount: data.data?.length || 0,
        results: data.data || [],
        analysisId: data.analysisId || ''
      };
      
      setSearchHistory(prev => [newSearchEntry, ...prev.slice(0, 9)]); // Keep last 10 searches
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const exportResults = (format: 'csv' | 'json') => {
    if (results.length === 0) return;

    const data = results.map(item => ({
      keyword: item.keyword,
      search_volume: item.search_volume,
      competition: item.competition,
      cpc: item.cpc,
      trend: item.trend,
      related_keywords: item.related_keywords.join(', ')
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
      a.download = `related-keywords-${keyword}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `related-keywords-${keyword}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Related Keywords</h1>
        <p className="text-muted-foreground">
          Finde verwandte Keywords zu deinem Suchbegriff
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Keyword-Analyse
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
                <Label htmlFor="limit">Anzahl Ergebnisse</Label>
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
                    Analysiere...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analysieren
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
              <h2 className="text-2xl font-bold">Ergebnisse</h2>
              <p className="text-muted-foreground">
                {results.length} verwandte Keywords gefunden
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  📊 DataForSEO API
                </Badge>
                <Badge variant="outline" className="text-xs">
                  🔗 googleRelatedKeywordsLive
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

          {/* Results Table */}
          <RelatedKeywordsTable data={results} />
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
              <span>Lade Suchhistorie...</span>
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
          <CardContent>
            <div className="space-y-2">
              {searchHistory.map((search, index) => (
                <div key={index} className="border rounded-lg">
                  <div className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                       onClick={() => {
                         setKeyword(search.keyword);
                         setLocation(search.location);
                         setLanguage(search.language);
                       }}>
                    <div className="flex items-center gap-3">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{search.keyword}</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{search.location}</span>
                          <span>•</span>
                          <span>{search.language}</span>
                          <span>•</span>
                          <span>{search.resultsCount} Ergebnisse</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {search.timestamp}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedHistory(expandedHistory === index ? null : index);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {expandedHistory === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  {expandedHistory === index && (
                    <div className="border-t p-4 bg-muted/20">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Ergebnisse für "{search.keyword}"</h3>
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
                            value={Math.round(search.results.reduce((sum, r) => sum + r.search_volume, 0) / search.results.length).toLocaleString()}
                            icon={TrendingUp}
                          />
                          <KeywordMetricsCard
                            title="Durchschnittliche Konkurrenz"
                            value={`${Math.round(search.results.reduce((sum, r) => sum + r.competition, 0) / search.results.length * 100)}%`}
                            icon={Hash}
                          />
                          <KeywordMetricsCard
                            title="Durchschnittlicher CPC"
                            value={`$${(search.results.reduce((sum, r) => sum + r.cpc, 0) / search.results.length).toFixed(2)}`}
                            icon={Globe}
                          />
                          <KeywordMetricsCard
                            title="Positive Trends"
                            value={`${search.results.filter(r => r.trend > 0).length}/${search.results.length}`}
                            icon={TrendingUp}
                          />
                        </div>

                        {/* Results Table */}
                        <RelatedKeywordsTable data={search.results} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Noch keine vorherigen Suchen vorhanden.</p>
              <p className="text-sm">Führe deine erste Keyword-Analyse durch, um hier Ergebnisse zu sehen.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
