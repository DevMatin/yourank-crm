'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  Globe, 
  Download,
  Loader2,
  Hash
} from 'lucide-react';
import { RelatedKeywordsTable } from '@/components/keywords/related-keywords-table';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';

interface KeywordSuggestion {
  keyword: string;
  search_volume: number;
  competition: number;
  cpc: number;
  trend: number;
  monthly_searches: Array<{
    year: number;
    month: number;
    search_volume: number;
  }>;
}

export default function KeywordSuggestionsPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<KeywordSuggestion[]>([]);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/keywords/suggestions', {
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
      monthly_searches: item.monthly_searches.length
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
      a.download = `keyword-suggestions-${keyword}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-suggestions-${keyword}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keyword Suggestions</h1>
        <p className="text-muted-foreground">
          Automatische Keyword-Vorschläge basierend auf deinem Input
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Keyword-Vorschläge
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
                    Vorschläge generieren
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
              <h2 className="text-2xl font-bold">Keyword-Vorschläge</h2>
              <p className="text-muted-foreground">
                {results.length} Vorschläge für "{keyword}" gefunden
              </p>
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
          <Card>
            <CardHeader>
              <CardTitle>Keyword-Vorschläge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Keyword</th>
                      <th className="text-right p-2">Suchvolumen</th>
                      <th className="text-center p-2">Konkurrenz</th>
                      <th className="text-right p-2">CPC</th>
                      <th className="text-center p-2">Trend</th>
                      <th className="text-center p-2">Monatliche Daten</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.keyword}</span>
                          </div>
                        </td>
                        <td className="text-right p-2">
                          {item.search_volume.toLocaleString()}
                        </td>
                        <td className="text-center p-2">
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
                        </td>
                        <td className="text-right p-2">
                          ${item.cpc.toFixed(2)}
                        </td>
                        <td className="text-center p-2">
                          <div className="flex items-center justify-center gap-1">
                            {item.trend > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : item.trend < 0 ? (
                              <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                            ) : (
                              <div className="h-4 w-4 bg-gray-400 rounded-full" />
                            )}
                            <span className="text-sm">
                              {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center p-2">
                          <Badge variant="outline">
                            {item.monthly_searches.length} Monate
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
