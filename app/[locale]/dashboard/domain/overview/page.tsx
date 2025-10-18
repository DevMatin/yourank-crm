'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  TrendingUp, 
  Download,
  Loader2,
  BarChart3,
  Target,
  Eye,
  Calendar
} from 'lucide-react';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DomainOverview {
  domain: string;
  domain_rank: number;
  organic_traffic: number;
  organic_cost: number;
  organic_count: number;
  keywords_count: number;
  traffic_sources: Array<{
    source: string;
    traffic: number;
    percentage: number;
  }>;
  organic_keywords: Array<{
    keyword: string;
    position: number;
    search_volume: number;
    cpc: number;
    url: string;
  }>;
  competitors: Array<{
    domain: string;
    common_keywords: number;
    traffic_share: number;
  }>;
}

export default function DomainOverviewPage() {
  const [domain, setDomain] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<DomainOverview | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/domain/overview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domain.trim(),
          location,
          language
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

    const data = {
      domain: results.domain,
      domain_rank: results.domain_rank,
      organic_traffic: results.organic_traffic,
      organic_cost: results.organic_cost,
      organic_count: results.organic_count,
      keywords_count: results.keywords_count,
      top_keywords: results.organic_keywords.slice(0, 10).map(k => ({
        keyword: k.keyword,
        position: k.position,
        search_volume: k.search_volume,
        cpc: k.cpc,
        url: k.url
      }))
    };

    if (format === 'csv') {
      const csvContent = [
        'Domain,Rank,Organic Traffic,Organic Cost,Organic Count,Keywords Count',
        `${results.domain},${results.domain_rank},${results.organic_traffic},${results.organic_cost},${results.organic_count},${results.keywords_count}`
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `domain-overview-${domain}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `domain-overview-${domain}-${new Date().toISOString().split('T')[0]}.json`;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Domain Overview</h1>
        <p className="text-muted-foreground">
          Umfassende Domain-Analyse mit allen wichtigen Metriken
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain-Analyse
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
                disabled={loading || !domain.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analysiere Domain...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Domain analysieren
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
              <h2 className="text-2xl font-bold">Domain-Übersicht</h2>
              <p className="text-muted-foreground">
                Analyse für {normalizeDomain(results.domain)}
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
              title="Domain Rank"
              value={results.domain_rank.toLocaleString()}
              icon={BarChart3}
              description="Globaler Domain-Rank"
            />
            <KeywordMetricsCard
              title="Organic Traffic"
              value={results.organic_traffic.toLocaleString()}
              icon={Eye}
              description="Monatlicher organischer Traffic"
            />
            <KeywordMetricsCard
              title="Organic Keywords"
              value={results.keywords_count.toLocaleString()}
              icon={Target}
              description="Keywords in Top 100"
            />
            <KeywordMetricsCard
              title="Organic Cost"
              value={`$${results.organic_cost.toLocaleString()}`}
              icon={TrendingUp}
              description="Geschätzter organischer Wert"
            />
          </div>

          {/* Domain Rank Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Domain Authority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Domain Rank</span>
                  <span className="text-2xl font-bold">{results.domain_rank.toLocaleString()}</span>
                </div>
                <Progress value={Math.min((1000000 - results.domain_rank) / 10000, 100)} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Je niedriger der Rank, desto höher die Domain-Autorität
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          {results.traffic_sources && results.traffic_sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Traffic-Quellen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.traffic_sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{source.traffic.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Organic Keywords */}
          {results.organic_keywords && results.organic_keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Organic Keywords</CardTitle>
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
                        <th className="text-left p-2">URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.organic_keywords.slice(0, 10).map((keyword, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{keyword.keyword}</td>
                          <td className="text-center p-2">
                            <Badge variant="secondary">{keyword.position}</Badge>
                          </td>
                          <td className="text-right p-2">{keyword.search_volume.toLocaleString()}</td>
                          <td className="text-right p-2">${keyword.cpc.toFixed(2)}</td>
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
              </CardContent>
            </Card>
          )}

          {/* Competitors */}
          {results.competitors && results.competitors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Konkurrenten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.competitors.slice(0, 5).map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{competitor.domain}</div>
                          <div className="text-sm text-muted-foreground">
                            {competitor.common_keywords} gemeinsame Keywords
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{competitor.traffic_share}%</div>
                        <div className="text-sm text-muted-foreground">Traffic Share</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
