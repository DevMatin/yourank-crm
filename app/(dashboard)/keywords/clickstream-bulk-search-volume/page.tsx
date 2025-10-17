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
  DollarSign, 
  Target,
  Download,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Table,
  Globe,
  Package
} from 'lucide-react';
import { RelatedKeywordsTable } from '@/components/keywords/related-keywords-table';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';

interface ClickstreamBulkSearchVolumeKeyword {
  keyword: string;
  search_volume: number;
  competition_index: number;
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
  };
}

export default function ClickstreamBulkSearchVolumePage() {
  const [keywords, setKeywords] = useState('');
  const [locationName, setLocationName] = useState('Germany');
  const [locationCode, setLocationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ClickstreamBulkSearchVolumeKeyword[]>([]);
  const [error, setError] = useState('');
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{
    keywords: string[];
    locationName: string;
    locationCode: string;
    timestamp: string;
    resultsCount: number;
    results: ClickstreamBulkSearchVolumeKeyword[];
    analysisId: string;
  }>>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=clickstream_bulk_search_volume&limit=10');
        if (response.ok) {
          const data = await response.json();
          const historyData = data.analyses?.map((analysis: any) => ({
            keywords: analysis.input?.keywords || analysis.parameters?.keywords || [],
            locationName: analysis.input?.location_name || analysis.parameters?.location_name || 'Deutschland',
            locationCode: analysis.input?.location_code || analysis.parameters?.location_code || '',
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
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const keywordsArray = keywords.split('\n').filter(k => k.trim());
      
      const response = await fetch('/api/keywords/clickstream-bulk-search-volume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: keywordsArray,
          location_name: locationName || undefined,
          location_code: locationCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Abrufen der Daten');
      }

      setResults(data.data || []);
      setAnalysisId(data.analysisId || null);
      
      // Refresh search history
      const historyResponse = await fetch('/api/analysis/history?type=clickstream_bulk_search_volume&limit=10');
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        const updatedHistory = historyData.analyses?.map((analysis: any) => ({
          keywords: analysis.input?.keywords || analysis.parameters?.keywords || [],
          locationName: analysis.input?.location_name || analysis.parameters?.location_name || 'Deutschland',
          locationCode: analysis.input?.location_code || analysis.parameters?.location_code || '',
          timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
          resultsCount: analysis.result?.length || 0,
          results: analysis.result || [],
          analysisId: analysis.id
        })) || [];
        setSearchHistory(updatedHistory);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) return;
    
    const headers = ['Keyword', 'Search Volume', 'Competition Index', 'Competition', 'CPC'];
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        `"${result.keyword}"`,
        result.search_volume || 0,
        result.competition_index || 0,
        `"${result.competition || 'N/A'}"`,
        result.cpc || 0
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clickstream-bulk-search-volume-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadHistoryResult = (historyItem: any) => {
    setResults(historyItem.results);
    setKeywords(historyItem.keywords.join('\n'));
    setLocationName(historyItem.locationName);
    setLocationCode(historyItem.locationCode);
    setAnalysisId(historyItem.analysisId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-orange-600" />
          <h1 className="text-3xl font-bold">Clickstream Bulk Search Volume</h1>
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
        Optimierte Bulk-Verarbeitung von Clickstream Suchvolumen-Daten für große Keyword-Mengen. Maximal 1000 Keywords pro Anfrage, mindestens 3 Zeichen pro Keyword.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Clickstream Bulk Search Volume Analyse</CardTitle>
          <CardDescription>
            Analysiere große Keyword-Mengen mit optimierter Bulk-Verarbeitung basierend auf Clickstream-Daten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (ein Keyword pro Zeile, max 1000 Keywords, min 3 Zeichen)</Label>
              <textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="seo tools&#10;keyword research&#10;search volume&#10;seo analysis&#10;keyword tracking"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationName">Standort Name</Label>
                <Input
                  id="locationName"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Germany"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationCode">Standort Code (optional)</Label>
                <Input
                  id="locationCode"
                  type="number"
                  value={locationCode}
                  onChange={(e) => setLocationCode(e.target.value)}
                  placeholder="2840"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Hinweis:</strong> Gib entweder den Standort-Namen oder den Standort-Code an. 
                Der Standort-Code hat Vorrang, falls beide angegeben werden.
              </p>
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
      {loadingHistory ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Suchhistorie</span>
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
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Suchhistorie</span>
            </CardTitle>
            <CardDescription>
              Deine letzten Keyword-Analysen
            </CardDescription>
          </CardHeader>
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
                          {historyItem.locationName}
                        </Badge>
                        {historyItem.locationCode && (
                          <Badge variant="secondary" className="text-xs">
                            Code: {historyItem.locationCode}
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
                            <div className="font-medium">{result.keyword}</div>
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
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Suchhistorie</span>
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

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Keyword Ergebnisse ({results.length} gefunden)</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                <Globe className="h-4 w-4 mr-1" />
                {locationName}
              </Badge>
              {locationCode && (
                <Badge variant="outline" className="text-sm">
                  Code: {locationCode}
                </Badge>
              )}
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
              icon={DollarSign}
            />
            <KeywordMetricsCard
              title="Durchschnittliche Competition"
              value={Math.round(results.reduce((sum, r) => sum + (r.competition_index || 0), 0) / results.length)}
              icon={Target}
            />
            <KeywordMetricsCard
              title="Keywords mit hohem Volumen"
              value={results.filter(r => (r.search_volume || 0) > 1000).length.toString()}
              icon={TrendingUp}
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Suchvolumen</div>
                        <div className="text-lg font-semibold">
                          {result.search_volume?.toLocaleString() || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Competition Index</div>
                        <div className="text-lg font-semibold">
                          {result.competition_index || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">CPC</div>
                        <div className="text-lg font-semibold">
                          {result.cpc ? `$${result.cpc.toFixed(2)}` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Competition</div>
                        <div className="text-lg font-semibold">
                          {result.competition || 'N/A'}
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
                competition: result.competition_index || 0,
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
