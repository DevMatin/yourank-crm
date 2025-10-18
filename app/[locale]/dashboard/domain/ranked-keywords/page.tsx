'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Download,
  Loader2,
  Hash,
  TrendingUp,
  Globe,
  Eye,
  BarChart3
} from 'lucide-react';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';

interface RankedKeyword {
  keyword: string;
  position: number;
  search_volume: number;
  cpc: number;
  url: string;
  traffic_share: number;
  keyword_difficulty: number;
  serp_features: string[];
  last_updated: string;
}

interface RankedKeywordsData {
  domain: string;
  total_keywords: number;
  total_traffic: number;
  avg_position: number;
  keywords: RankedKeyword[];
  position_distribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  traffic_distribution: Array<{
    range: string;
    keywords: number;
    traffic: number;
  }>;
}

export default function RankedKeywordsPage() {
  const [domain, setDomain] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [limit, setLimit] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<RankedKeywordsData | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/domain/ranked-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domain.trim(),
          location,
          language,
          limit
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Analyse');
      }

      setResults(data.data);
      setAnalysisId(data.analysisId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const exportResults = (format: 'csv' | 'json') => {
    if (!results) return;

    const data = results.keywords.map(keyword => ({
      keyword: keyword.keyword,
      position: keyword.position,
      search_volume: keyword.search_volume,
      cpc: keyword.cpc,
      url: keyword.url,
      traffic_share: keyword.traffic_share,
      keyword_difficulty: keyword.keyword_difficulty,
      serp_features: keyword.serp_features.join(', ')
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
      a.download = `ranked-keywords-${domain}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ranked-keywords-${domain}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const normalizeDomain = (domain: string): string => {
    return domain
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'bg-green-100 text-green-800';
    if (position <= 10) return 'bg-yellow-100 text-yellow-800';
    if (position <= 20) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getPositionText = (position: number) => {
    if (position <= 3) return 'Top 3';
    if (position <= 10) return 'Top 10';
    if (position <= 20) return 'Top 20';
    return 'Top 100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ranked Keywords</h1>
        <p className="text-muted-foreground">
          Keywords für die die Domain in den SERPs rankt
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Ranked Keywords Analyse
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
                <Label htmlFor="domain">Domain *</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Geben Sie die Domain ohne http:// oder www. ein
                </p>
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
                <Label htmlFor="limit">Anzahl Keywords</Label>
                <Input
                  id="limit"
                  type="number"
                  min="10"
                  max="1000"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value) || 100)}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="submit" 
                disabled={loading || !domain.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analysiere Keywords...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Keywords analysieren
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Ranked Keywords</h2>
              <p className="text-muted-foreground">
                {results.total_keywords} Keywords für {normalizeDomain(results.domain)}
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

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KeywordMetricsCard
              title="Total Keywords"
              value={results.total_keywords.toLocaleString()}
              icon={Hash}
              description="Keywords in Top 100"
            />
            <KeywordMetricsCard
              title="Total Traffic"
              value={results.total_traffic.toLocaleString()}
              icon={Eye}
              description="Geschätzter monatlicher Traffic"
            />
            <KeywordMetricsCard
              title="Durchschnittliche Position"
              value={results.avg_position.toFixed(1)}
              icon={Target}
              description="Ø Position aller Keywords"
            />
            <KeywordMetricsCard
              title="Top 10 Keywords"
              value={results.keywords.filter(k => k.position <= 10).length}
              icon={BarChart3}
              description="Keywords in Top 10"
            />
          </div>

          {/* Position Distribution */}
          {results.position_distribution && results.position_distribution.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Position-Verteilung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.position_distribution.map((dist, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="font-medium">{dist.range}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{dist.count} Keywords</div>
                        <div className="text-sm text-muted-foreground">{dist.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Keywords Table */}
          <Card>
            <CardHeader>
              <CardTitle>Ranked Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Keyword</th>
                      <th className="text-center p-2">Position</th>
                      <th className="text-right p-2">Suchvolumen</th>
                      <th className="text-right p-2">CPC</th>
                      <th className="text-center p-2">Traffic Share</th>
                      <th className="text-center p-2">Schwierigkeit</th>
                      <th className="text-left p-2">URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.keywords.slice(0, 50).map((keyword, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{keyword.keyword}</span>
                          </div>
                        </td>
                        <td className="text-center p-2">
                          <Badge 
                            variant="secondary" 
                            className={getPositionColor(keyword.position)}
                          >
                            {keyword.position}
                          </Badge>
                        </td>
                        <td className="text-right p-2">{keyword.search_volume.toLocaleString()}</td>
                        <td className="text-right p-2">${keyword.cpc.toFixed(2)}</td>
                        <td className="text-center p-2">
                          <Badge variant="outline">{keyword.traffic_share}%</Badge>
                        </td>
                        <td className="text-center p-2">
                          <Badge 
                            variant={keyword.keyword_difficulty < 30 ? "default" : keyword.keyword_difficulty < 70 ? "secondary" : "destructive"}
                          >
                            {keyword.keyword_difficulty}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <a 
                            href={keyword.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm truncate max-w-[200px] block"
                          >
                            {keyword.url}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {results.keywords.length > 50 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Zeige 50 von {results.keywords.length} Keywords
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
