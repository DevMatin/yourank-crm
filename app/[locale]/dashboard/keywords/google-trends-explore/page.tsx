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
  TrendingUp, 
  Calendar, 
  BarChart3,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Globe,
  Download
} from 'lucide-react';

export default function GoogleTrendsExplorePage() {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [itemTypes, setItemTypes] = useState(['google_trends_graph']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{
    keywords: string[];
    location: string;
    language: string;
    timeRange: string;
    itemTypes: string[];
    timestamp: string;
    resultsCount: number;
    results: any[];
    analysisId: string;
  }>>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=google_trends_explore&limit=10');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.analyses) {
            const historyData = data.analyses.map((analysis: any) => ({
              keywords: Array.isArray(analysis.input?.keywords) ? analysis.input.keywords : [],
              location: analysis.input?.location || 'Deutschland',
              language: analysis.input?.language || 'Deutsch',
              timeRange: analysis.input?.time_range || '',
              itemTypes: Array.isArray(analysis.input?.item_types) ? analysis.input.item_types : ['google_trends_graph'],
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
      
      const response = await fetch('/api/keywords/google-trends-explore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: keywordsArray,
          location,
          language,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
          time_range: timeRange || undefined,
          item_types: itemTypes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Abrufen der Daten');
      }

      setResults(data.data || []);
      setAnalysisId(data.analysisId || null);
      
      // Refresh search history
      const historyResponse = await fetch('/api/analysis/history?type=google_trends_explore&limit=10');
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (historyData.success && historyData.analyses) {
          const updatedHistory = historyData.analyses.map((analysis: any) => ({
            keywords: Array.isArray(analysis.input?.keywords) ? analysis.input.keywords : [],
            location: analysis.input?.location || 'Deutschland',
            language: analysis.input?.language || 'Deutsch',
            timeRange: analysis.input?.time_range || '',
            itemTypes: Array.isArray(analysis.input?.item_types) ? analysis.input.item_types : ['google_trends_graph'],
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

  const timeRangeOptions = [
    { value: 'past_hour', label: 'Letzte Stunde' },
    { value: 'past_4_hours', label: 'Letzte 4 Stunden' },
    { value: 'past_day', label: 'Letzter Tag' },
    { value: 'past_7_days', label: 'Letzte 7 Tage' },
    { value: 'past_30_days', label: 'Letzte 30 Tage' },
    { value: 'past_90_days', label: 'Letzte 90 Tage' },
    { value: 'past_12_months', label: 'Letzte 12 Monate' },
    { value: 'past_5_years', label: 'Letzte 5 Jahre' },
  ];

  const itemTypeOptions = [
    { value: 'google_trends_graph', label: 'Trends Graph' },
    { value: 'google_trends_map', label: 'Trends Map' },
    { value: 'google_trends_topics_list', label: 'Topics List' },
    { value: 'google_trends_queries_list', label: 'Queries List' },
  ];

  const exportToCSV = () => {
    if (results.length === 0) return;
    
    const headers = ['Keyword', 'Type', 'Location', 'Language', 'Date From', 'Date To'];
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        `"${result.keyword}"`,
        `"${result.type || 'web'}"`,
        `"${result.location_name || location}"`,
        `"${result.language_name || language}"`,
        `"${result.date_from || ''}"`,
        `"${result.date_to || ''}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `google-trends-explore-${new Date().toISOString().split('T')[0]}.csv`);
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
    setTimeRange(historyItem.timeRange || '');
    setItemTypes(Array.isArray(historyItem.itemTypes) ? historyItem.itemTypes : ['google_trends_graph']);
    setAnalysisId(historyItem.analysisId || null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Google Trends Explore</h1>
        </div>
        {results.length > 0 && (
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV Export
          </Button>
        )}
      </div>
      
      <p className="text-muted-foreground">
        Analysiere Google Trends Daten und erhalte detaillierte Einblicke in Suchvolumen-Trends, geografische Verteilung und verwandte Themen.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Google Trends Analyse</CardTitle>
          <CardDescription>
            Erkunde Trends, geografische Verteilung und verwandte Suchanfragen für deine Keywords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="timeRange">Zeitraum (optional)</Label>
              <select
                id="timeRange"
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="">Kein vordefinierter Zeitraum</option>
                {timeRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Item Typen</Label>
              <div className="grid grid-cols-2 gap-2">
                {itemTypeOptions.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={itemTypes.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setItemTypes([...itemTypes, option.value]);
                        } else {
                          setItemTypes(itemTypes.filter(t => t !== option.value));
                        }
                      }}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (max. 5, ein Keyword pro Zeile)</Label>
              <textarea
                id="keywords"
                className="w-full min-h-[120px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="seo tools&#10;keyword research&#10;digital marketing"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Trends...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Google Trends analysieren
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
              Deine letzten Google Trends-Analysen
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
                        {historyItem.timeRange && (
                          <Badge variant="secondary" className="text-xs">
                            {timeRangeOptions.find(opt => opt.value === historyItem.timeRange)?.label || historyItem.timeRange}
                          </Badge>
                        )}
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
                              Typ: {result.type || 'web'} | 
                              Standort: {result.location_name || 'N/A'}
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
                <p className="text-sm">Führe deine erste Google Trends-Analyse durch, um hier Ergebnisse zu sehen.</p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Trends Ergebnisse ({results.length} Keywords)</h2>
          
          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{result.keyword}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge variant="secondary">
                        {result.type || 'web'}
                      </Badge>
                      <Badge variant="outline">
                        {result.location_name || location}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium text-muted-foreground mb-2">Basis-Informationen</div>
                      <div className="space-y-1 text-sm">
                        <div><strong>Typ:</strong> {result.type || 'web'}</div>
                        <div><strong>Standort:</strong> {result.location_name || location}</div>
                        <div><strong>Sprache:</strong> {result.language_name || language}</div>
                        <div><strong>Zeitraum:</strong> {result.date_from} - {result.date_to}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-muted-foreground mb-2">Verfügbare Daten</div>
                      <div className="space-y-1 text-sm">
                        <div><strong>Trends Graph:</strong> {result.google_trends_graph ? '✅' : '❌'}</div>
                        <div><strong>Trends Map:</strong> {result.google_trends_map ? '✅' : '❌'}</div>
                        <div><strong>Topics List:</strong> {result.google_trends_topics_list?.length || 0} Einträge</div>
                        <div><strong>Queries List:</strong> {result.google_trends_queries_list?.length || 0} Einträge</div>
                      </div>
                    </div>
                  </div>

                  {result.google_trends_topics_list && result.google_trends_topics_list.length > 0 && (
                    <div className="mt-4">
                      <div className="font-medium text-muted-foreground mb-2">Verwandte Themen</div>
                      <div className="flex flex-wrap gap-2">
                        {result.google_trends_topics_list.slice(0, 10).map((topic: any, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {topic.title || topic.topic_title || 'Unbekannt'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.google_trends_queries_list && result.google_trends_queries_list.length > 0 && (
                    <div className="mt-4">
                      <div className="font-medium text-muted-foreground mb-2">Verwandte Suchanfragen</div>
                      <div className="flex flex-wrap gap-2">
                        {result.google_trends_queries_list.slice(0, 10).map((query: any, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {query.query || 'Unbekannt'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
