'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, 
  Search, 
  Download,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Table,
  Globe,
  Map
} from 'lucide-react';

interface DataforseoTrendsSubregionInterestsKeyword {
  keyword: string;
  subregion_data: any[];
  interests_map: any[];
  regional_interests: any;
  keyword_info: {
    se_type: string;
    last_updated_time: string;
    type: string;
    location: string;
  };
}

export default function DataforseoTrendsSubregionInterestsPage() {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('Germany');
  const [type, setType] = useState('web');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DataforseoTrendsSubregionInterestsKeyword[]>([]);
  const [error, setError] = useState('');
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{
    keywords: string[];
    location: string;
    type: string;
    dateFrom: string;
    dateTo: string;
    timestamp: string;
    resultsCount: number;
    results: DataforseoTrendsSubregionInterestsKeyword[];
    analysisId: string;
  }>>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=dataforseo_trends_subregion_interests&limit=10');
        if (response.ok) {
          const data = await response.json();
          const historyData = data.analyses?.map((analysis: any) => ({
            keywords: analysis.input?.keywords || analysis.parameters?.keywords || [],
            location: analysis.input?.location || analysis.parameters?.location || 'Deutschland',
            type: analysis.input?.type || analysis.parameters?.type || 'web',
            dateFrom: analysis.input?.date_from || analysis.parameters?.date_from || '',
            dateTo: analysis.input?.date_to || analysis.parameters?.date_to || '',
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
      
      if (keywordsArray.length > 5) {
        throw new Error('Maximal 5 Keywords erlaubt für DataForSEO Trends Subregion Interests');
      }
      
      const response = await fetch('/api/keywords/dataforseo-trends-subregion-interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: keywordsArray,
          location,
          type,
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
      const historyResponse = await fetch('/api/analysis/history?type=dataforseo_trends_subregion_interests&limit=10');
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        const updatedHistory = historyData.analyses?.map((analysis: any) => ({
          keywords: analysis.input?.keywords || analysis.parameters?.keywords || [],
          location: analysis.input?.location || analysis.parameters?.location || 'Deutschland',
          type: analysis.input?.type || analysis.parameters?.type || 'web',
          dateFrom: analysis.input?.date_from || analysis.parameters?.date_from || '',
          dateTo: analysis.input?.date_to || analysis.parameters?.date_to || '',
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
    
    const headers = ['Keyword', 'Subregion Data', 'Interests Map', 'Regional Interests'];
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        `"${result.keyword}"`,
        `"${JSON.stringify(result.subregion_data)}"`,
        `"${JSON.stringify(result.interests_map)}"`,
        `"${JSON.stringify(result.regional_interests)}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dataforseo-trends-subregion-interests-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadHistoryResult = (historyItem: any) => {
    setResults(historyItem.results);
    setKeywords(historyItem.keywords.join('\n'));
    setLocation(historyItem.location);
    setType(historyItem.type);
    setDateFrom(historyItem.dateFrom);
    setDateTo(historyItem.dateTo);
    setAnalysisId(historyItem.analysisId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Map className="h-6 w-6 text-indigo-600" />
          <h1 className="text-3xl font-bold">DataForSEO Trends Subregion Interests</h1>
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
        Analysiere regionale Interessen-Trends auf Subregion-Ebene für geografisch detaillierte Keyword-Insights. Maximal 5 Keywords pro Anfrage.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>DataForSEO Trends Subregion Interests Analyse</CardTitle>
          <CardDescription>
            Erhalte detaillierte regionale Interessen-Trends auf Subregion-Ebene für geografisch zielgerichtete Keyword-Strategien.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (ein Keyword pro Zeile, max 5 Keywords)</Label>
              <textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="seo tools&#10;keyword research"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <p className="text-xs text-muted-foreground">
                ⚠️ Maximal 5 Keywords erlaubt für DataForSEO Trends Subregion Interests
              </p>
            </div>

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
                <Label htmlFor="type">Typ</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Typ auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
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
                          {historyItem.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {historyItem.location}
                        </Badge>
                        {historyItem.dateFrom && (
                          <Badge variant="secondary" className="text-xs">
                            {historyItem.dateFrom} - {historyItem.dateTo}
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
                              Subregions: {result.subregion_data?.length || 0} | 
                              Interests: {result.interests_map?.length || 0}
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
            <h2 className="text-2xl font-semibold">Subregion Interests Ergebnisse ({results.length} gefunden)</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                <Globe className="h-4 w-4 mr-1" />
                {location}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {type}
              </Badge>
            </div>
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
                          {result.subregion_data?.length || 0} Subregionen
                        </Badge>
                        <Badge variant="outline">
                          {result.interests_map?.length || 0} Interessen
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.subregion_data && result.subregion_data.length > 0 && (
                        <div>
                          <div className="font-medium text-muted-foreground mb-2">Subregionen-Daten</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            {result.subregion_data.slice(0, 9).map((subregion: any, idx: number) => (
                              <div key={idx} className="bg-muted p-2 rounded">
                                <div className="font-medium">{subregion.region || 'N/A'}</div>
                                <div>{subregion.interest || 0}%</div>
                              </div>
                            ))}
                          </div>
                          {result.subregion_data.length > 9 && (
                            <div className="text-xs text-muted-foreground mt-2">
                              +{result.subregion_data.length - 9} weitere Subregionen...
                            </div>
                          )}
                        </div>
                      )}
                      
                      {result.interests_map && result.interests_map.length > 0 && (
                        <div>
                          <div className="font-medium text-muted-foreground mb-2">Interessen-Karte</div>
                          <div className="text-sm text-muted-foreground">
                            {JSON.stringify(result.interests_map, null, 2)}
                          </div>
                        </div>
                      )}
                      
                      {result.regional_interests && Object.keys(result.regional_interests).length > 0 && (
                        <div>
                          <div className="font-medium text-muted-foreground mb-2">Regionale Interessen</div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            {Object.entries(result.regional_interests).map(([key, value]: [string, any], idx: number) => (
                              <div key={idx} className="bg-muted p-2 rounded">
                                <div className="font-medium">{key}</div>
                                <div>{typeof value === 'object' ? JSON.stringify(value) : value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{result.keyword}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Subregionen:</strong> {result.subregion_data?.length || 0}</div>
                      <div><strong>Interessen:</strong> {result.interests_map?.length || 0}</div>
                      <div><strong>Regionale Daten:</strong> {Object.keys(result.regional_interests || {}).length}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
