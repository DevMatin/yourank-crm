'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Search, 
  BarChart3, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet,
  Download,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Table,
  TrendingUp
} from 'lucide-react';
import { RelatedKeywordsTable } from '@/components/keywords/related-keywords-table';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';

interface ClickstreamKeyword {
  keyword: string;
  search_volume: number;
  competition: string;
  cpc: number;
  monthly_searches: any[];
  keyword_info: {
    se_type: string;
    last_updated_time: string;
    competition_level: string;
    cpc: number;
    search_volume: number;
    monthly_searches: any[];
    device: string;
  };
}

export default function ClickstreamGlobalSearchVolumePage() {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [device, setDevice] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ClickstreamKeyword[]>([]);
  const [error, setError] = useState('');
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{
    keywords: string[];
    location: string;
    language: string;
    device: string;
    timestamp: string;
    resultsCount: number;
    results: ClickstreamKeyword[];
    analysisId: string;
  }>>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=clickstream_global_search_volume&limit=10');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.analyses) {
            const historyData = data.analyses.map((analysis: any) => ({
              keywords: Array.isArray(analysis.input?.keywords) ? analysis.input.keywords : [],
              location: analysis.input?.location || 'Deutschland',
              language: analysis.input?.language || 'Deutsch',
              device: analysis.input?.device || 'all',
              timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
              resultsCount: Array.isArray(analysis.result) ? analysis.result.length : 0,
              results: Array.isArray(analysis.result) ? analysis.result : [],
              analysisId: analysis.id
            }));
            setSearchHistory(historyData);
          } else {
            console.warn('No search history data received:', data);
            setSearchHistory([]);
          }
        } else {
          console.error('Failed to fetch search history:', response.status, response.statusText);
          setSearchHistory([]);
        }
      } catch (error) {
        console.error('Failed to load search history:', error);
        setSearchHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadSearchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const keywordsArray = keywords.split('\n').filter(k => k.trim());
      
      const response = await fetch('/api/keywords/clickstream-global-search-volume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: keywordsArray,
          location,
          language,
          device,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Abrufen der Daten');
      }

      setResults(data.data || []);
      setAnalysisId(data.analysisId || null);
      
      // Refresh search history
      const historyResponse = await fetch('/api/analysis/history?type=clickstream_global_search_volume&limit=10');
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (historyData.success && historyData.analyses) {
          const updatedHistory = historyData.analyses.map((analysis: any) => ({
            keywords: Array.isArray(analysis.input?.keywords) ? analysis.input.keywords : [],
            location: analysis.input?.location || 'Deutschland',
            language: analysis.input?.language || 'Deutsch',
            device: analysis.input?.device || 'all',
            timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
            resultsCount: Array.isArray(analysis.result) ? analysis.result.length : 0,
            results: Array.isArray(analysis.result) ? analysis.result : [],
            analysisId: analysis.id
          }));
          setSearchHistory(updatedHistory);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) return;
    
    const headers = ['Keyword', 'Search Volume', 'Competition', 'CPC'];
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        `"${result.keyword}"`,
        result.search_volume || 0,
        `"${result.competition || 'N/A'}"`,
        result.cpc || 0
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clickstream-global-search-volume-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadHistoryResult = (historyItem: any) => {
    setResults(Array.isArray(historyItem.results) ? historyItem.results : []);
    setKeywords(Array.isArray(historyItem.keywords) ? historyItem.keywords.join('\n') : '');
    setLocation(historyItem.location || 'Germany');
    setLanguage(historyItem.language || 'German');
    setDevice(historyItem.device || 'all');
    setAnalysisId(historyItem.analysisId || null);
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          <h1 className="text-3xl font-bold">Clickstream Global Search Volume</h1>
        </div>
        {results.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            >
              {viewMode === 'cards' ? <Table className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {viewMode === 'cards' ? 'Tabellenansicht' : 'Kartenansicht'}
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV Export
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground">
        Analysiere das globale Suchvolumen basierend auf Clickstream-Daten mit detaillierten Metriken und Trends.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Clickstream Global Search Volume Analyse</CardTitle>
          <CardDescription>
            Erhalte umfassende Suchvolumen-Daten basierend auf globalen Clickstream-Analysen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (ein Keyword pro Zeile)</Label>
              <textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="seo tools&#10;keyword research&#10;search volume"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Standort</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Germany"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Sprache</Label>
                <Input
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="German"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device">Gerät</Label>
                <Input
                  id="device"
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  placeholder="all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Von Datum (optional)</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">Bis Datum (optional)</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Keywords...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Keywords analysieren
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search History */}
      {!loadingHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Suchhistorie</span>
            </CardTitle>
            <CardDescription>
              Deine letzten Clickstream-Analysen
            </CardDescription>
          </CardHeader>
          {searchHistory.length > 0 ? (
          <CardContent>
            <div className="space-y-2">
              {searchHistory.map((historyItem, index) => (
                <div key={historyItem.analysisId} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {historyItem.keywords.length} Keywords
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {historyItem.location}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {historyItem.language}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getDeviceIcon(historyItem.device)}
                          <span className="ml-1">{historyItem.device}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {historyItem.timestamp}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {historyItem.resultsCount} Ergebnisse gefunden
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadHistoryResult(historyItem)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Anzeigen
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedHistory(expandedHistory === index ? null : index)}
                      >
                        {expandedHistory === index ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {expandedHistory === index && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {historyItem.results.slice(0, 6).map((result, idx) => (
                          <div key={idx} className="text-xs bg-muted p-2 rounded">
                            <div className="font-medium">{result.keyword || 'Unbekanntes Keyword'}</div>
                            <div className="text-muted-foreground">
                              Volumen: {result.search_volume?.toLocaleString() || 'N/A'} | 
                              CPC: ${result.cpc?.toFixed(2) || 'N/A'}
                            </div>
                          </div>
                        ))}
                        {historyItem.results.length > 6 && (
                          <div className="text-xs text-muted-foreground p-2">
                            +{historyItem.results.length - 6} weitere...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          ) : (
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Noch keine Suchhistorie vorhanden</p>
                <p className="text-sm">Führe deine erste Clickstream-Analyse durch, um hier Ergebnisse zu sehen.</p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Clickstream Ergebnisse ({results.length} gefunden)</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {getDeviceIcon(device)}
                <span className="ml-1">{device}</span>
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Globe className="h-4 w-4 mr-1" />
                {location}
              </Badge>
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KeywordMetricsCard
              title="Durchschnittliches Suchvolumen"
              value={Math.round(results.reduce((sum, r) => sum + (r.search_volume || 0), 0) / results.length).toLocaleString()}
              icon={Search}
            />
            <KeywordMetricsCard
              title="Durchschnittlicher CPC"
              value={`$${((results.reduce((sum, r) => sum + (r.cpc || 0), 0) / results.length)).toFixed(2)}`}
              icon={TrendingUp}
            />
            <KeywordMetricsCard
              title="Keywords mit hohem Volumen"
              value={results.filter(r => (r.search_volume || 0) > 1000).length.toString()}
              icon={BarChart3}
            />
            <KeywordMetricsCard
              title="Gerät"
              value={device}
              icon={Globe}
            />
          </div>
          
          {viewMode === 'cards' ? (
            <div className="grid gap-4">
              {results.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{result.keyword}</CardTitle>
                      <div className="flex space-x-2">
                        <Badge variant="secondary">
                          {result.search_volume?.toLocaleString()} Suchvolumen
                        </Badge>
                        <Badge variant="outline">
                          Competition: {result.competition || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Suchvolumen</div>
                        <div className="text-lg font-semibold">
                          {result.search_volume?.toLocaleString() || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Competition</div>
                        <div className="text-lg font-semibold">
                          {result.competition || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">CPC</div>
                        <div className="text-lg font-semibold">
                          {result.cpc ? `$${result.cpc.toFixed(2)}` : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    {result.monthly_searches && result.monthly_searches.length > 0 && (
                      <div className="mt-4">
                        <div className="font-medium text-muted-foreground mb-2">Monatliche Suchen</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {result.monthly_searches.slice(0, 12).map((month: any, idx: number) => (
                            <div key={idx} className="bg-muted p-2 rounded">
                              <div className="font-medium">{month.month || 'N/A'}</div>
                              <div>{month.search_volume || 0}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <RelatedKeywordsTable 
              data={results.map(result => ({
                keyword: result.keyword,
                search_volume: result.search_volume || 0,
                competition: 0, // Clickstream doesn't have competition index like Google
                cpc: result.cpc || 0,
                trend: 0,
                related_keywords: []
              }))}
            />
          )}
        </div>
      )}
    </div>
  );
}