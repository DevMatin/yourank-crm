'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Download,
  Loader2,
  Hash,
  Target,
  Calendar,
  Eye,
  History,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface KeywordOverview {
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
    monthly_searches: Array<{
      year: number;
      month: number;
      search_volume: number;
    }>;
    keyword_properties: {
      se_type: string;
      core_keyword: string;
      synonym_keywords: string[];
      related_keywords: string[];
      ngram_keywords: string[];
    };
  };
}

export default function KeywordOverviewPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<KeywordOverview[]>([]);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{
    keyword: string;
    location: string;
    language: string;
    timestamp: string;
    resultsCount: number;
    results: KeywordOverview[];
    analysisId: string;
  }>>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=keywords_overview&limit=10');
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

  const getCompetitionLevel = (competition: number) => {
    if (competition < 0.3) return { level: 'Niedrig', color: 'bg-green-500', description: 'Gute Chancen zu ranken' };
    if (competition < 0.7) return { level: 'Mittel', color: 'bg-yellow-500', description: 'Moderate Konkurrenz' };
    return { level: 'Hoch', color: 'bg-red-500', description: 'Starke Konkurrenz' };
  };

  const prepareChartData = (monthlySearches: Array<{year: number, month: number, search_volume: number}>) => {
    return monthlySearches
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .map(item => ({
        date: `${item.month}/${item.year}`,
        volume: item.search_volume
      }));
  };

  const exportResults = (format: 'csv' | 'json') => {
    if (results.length === 0) return;

    const data = results.map(item => ({
      keyword: item.keyword,
      search_volume: item.search_volume,
      competition: item.competition,
      cpc: item.cpc,
      trend: item.trend,
      competition_level: getCompetitionLevel(item.competition).level,
      last_updated: item.keyword_info.last_updated_time,
      related_keywords: item.keyword_info.keyword_properties?.related_keywords?.join(', ') || '',
      synonym_keywords: item.keyword_info.keyword_properties?.synonym_keywords?.join(', ') || ''
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
      a.download = `keyword-overview-${keyword}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-overview-${keyword}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keyword Overview</h1>
        <p className="text-muted-foreground">
          Umfassende Keyword-Analyse mit allen wichtigen Metriken
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Keyword-Übersicht erstellen
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
            
            <div className="flex gap-3">
              <Button 
                type="submit" 
                disabled={loading || !keyword.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Erstelle Übersicht...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Übersicht erstellen
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
              <h2 className="text-2xl font-bold">Keyword-Übersicht</h2>
              <p className="text-muted-foreground">
                Umfassende Analyse für "{keyword}"
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  📊 DataForSEO API
                </Badge>
                <Badge variant="outline" className="text-xs">
                  📈 googleKeywordOverviewLive
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

          {/* Overview Cards */}
          {results.map((item, index) => {
            const competitionInfo = getCompetitionLevel(item.competition);
            const chartData = prepareChartData(item.keyword_info?.monthly_searches || []);
            
            return (
              <div key={index} className="space-y-6">
                {/* Main Keyword Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Hash className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl">{item.keyword}</CardTitle>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${competitionInfo.color} text-white`}
                      >
                        {competitionInfo.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <KeywordMetricsCard
                        title="Suchvolumen"
                        value={item.search_volume.toLocaleString()}
                        icon={Eye}
                        description="Monatliche Suchanfragen"
                      />
                      <KeywordMetricsCard
                        title="Konkurrenz"
                        value={`${Math.round(item.competition * 100)}%`}
                        icon={Target}
                        description={competitionInfo.description}
                      />
                      <KeywordMetricsCard
                        title="CPC"
                        value={`$${item.cpc.toFixed(2)}`}
                        icon={Globe}
                        description="Kosten pro Klick"
                      />
                      <KeywordMetricsCard
                        title="Trend"
                        value={`${item.trend > 0 ? '+' : ''}${item.trend.toFixed(1)}%`}
                        icon={TrendingUp}
                        description="Suchvolumen-Trend"
                      />
                    </div>

                    {/* Competition Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Konkurrenz-Level</span>
                        <span className="text-sm text-muted-foreground">{competitionInfo.description}</span>
                      </div>
                      <Progress value={item.competition * 100} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Search Volume Chart */}
                {chartData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Monatliches Suchvolumen
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '6px',
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="volume" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Related Keywords */}
                {item.keyword_info?.keyword_properties && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Related Keywords */}
                    {item.keyword_info.keyword_properties.related_keywords && 
                     item.keyword_info.keyword_properties.related_keywords.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Verwandte Keywords</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {item.keyword_info.keyword_properties.related_keywords.map((related, idx) => (
                              <Badge key={idx} variant="outline">
                                {related}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Synonym Keywords */}
                    {item.keyword_info.keyword_properties.synonym_keywords && 
                     item.keyword_info.keyword_properties.synonym_keywords.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Synonyme Keywords</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {item.keyword_info.keyword_properties.synonym_keywords.map((synonym, idx) => (
                              <Badge key={idx} variant="secondary">
                                {synonym}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Additional Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Zusätzliche Informationen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Suchmaschine:</span>
                        <div className="font-medium">{item.keyword_info.se_type}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Letzte Aktualisierung:</span>
                        <div className="font-medium">
                          {new Date(item.keyword_info.last_updated_time).toLocaleDateString('de-DE')}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Core Keyword:</span>
                        <div className="font-medium">{item.keyword_info.keyword_properties?.core_keyword || item.keyword}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">N-Gram Keywords:</span>
                        <div className="font-medium">
                          {item.keyword_info.keyword_properties?.ngram_keywords?.length || 0} gefunden
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
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
                        {item.resultsCount} Übersichten
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
                    {item.results.map((result, idx) => {
                      const competitionInfo = getCompetitionLevel(result.competition);
                      const chartData = prepareChartData(result.keyword_info?.monthly_searches || []);
                      
                      return (
                        <div key={idx} className="space-y-4">
                          {/* Main Keyword Info */}
                          <Card>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Hash className="h-5 w-5 text-primary" />
                                  <CardTitle className="text-lg">{result.keyword}</CardTitle>
                                </div>
                                <Badge 
                                  variant="secondary" 
                                  className={`${competitionInfo.color} text-white`}
                                >
                                  {competitionInfo.level}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Key Metrics */}
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <KeywordMetricsCard
                                  title="Suchvolumen"
                                  value={result.search_volume.toLocaleString()}
                                  icon={Eye}
                                  description="Monatliche Suchanfragen"
                                />
                                <KeywordMetricsCard
                                  title="Konkurrenz"
                                  value={`${Math.round(result.competition * 100)}%`}
                                  icon={Target}
                                  description={competitionInfo.description}
                                />
                                <KeywordMetricsCard
                                  title="CPC"
                                  value={`$${result.cpc.toFixed(2)}`}
                                  icon={Globe}
                                  description="Kosten pro Klick"
                                />
                                <KeywordMetricsCard
                                  title="Trend"
                                  value={`${result.trend > 0 ? '+' : ''}${result.trend.toFixed(1)}%`}
                                  icon={TrendingUp}
                                  description="Suchvolumen-Trend"
                                />
                              </div>

                              {/* Competition Progress */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Konkurrenz-Level</span>
                                  <span className="text-sm text-muted-foreground">{competitionInfo.description}</span>
                                </div>
                                <Progress value={result.competition * 100} className="h-3" />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Monthly Search Volume Chart */}
                          {chartData.length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Calendar className="h-5 w-5" />
                                  Monatliches Suchvolumen
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                  <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                      dataKey="date" 
                                      tick={{ fontSize: 10 }}
                                    />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip 
                                      contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '6px',
                                      }}
                                    />
                                    <Line 
                                      type="monotone" 
                                      dataKey="volume" 
                                      stroke="hsl(var(--primary))" 
                                      strokeWidth={2}
                                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      );
                    })}
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
                Führe deine erste Keyword-Übersicht-Analyse durch, um hier Ergebnisse zu sehen.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
