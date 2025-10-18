'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Download,
  Loader2,
  Search,
  Globe,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';

interface AiOverviewResult {
  keyword: string;
  location: string;
  language: string;
  ai_overview: {
    title: string;
    content: string;
    sources: Array<{
      title: string;
      url: string;
      domain: string;
    }>;
  };
  organic_results: Array<{
    position: number;
    title: string;
    url: string;
    domain: string;
    description: string;
    featured_snippet?: boolean;
  }>;
  serp_features: Array<{
    type: string;
    title: string;
    content: string;
  }>;
  total_results: number;
  search_time: string;
}

export default function AiOverviewPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [device, setDevice] = useState('desktop');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<AiOverviewResult | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/serp/ai-overview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          location,
          language,
          device
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
      keyword: results.keyword,
      location: results.location,
      language: results.language,
      ai_overview: results.ai_overview,
      organic_results: results.organic_results,
      serp_features: results.serp_features,
      total_results: results.total_results,
      search_time: results.search_time
    };

    if (format === 'csv') {
      const csvContent = [
        'Keyword,Location,Language,Total Results,Search Time',
        `"${results.keyword}","${results.location}","${results.language}",${results.total_results},"${results.search_time}"`
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-overview-${keyword}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-overview-${keyword}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Overview Analysis</h1>
        <p className="text-muted-foreground">
          Analysiere AI Overview Ergebnisse in den SERPs
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Overview Analyse
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
                <Label htmlFor="device">Gerät</Label>
                <select
                  id="device"
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                </select>
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
                    Analysiere AI Overview...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    AI Overview analysieren
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
              <h2 className="text-2xl font-bold">AI Overview Analyse</h2>
              <p className="text-muted-foreground">
                Ergebnisse für "{results.keyword}" in {results.location}
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
              title="Total Results"
              value={results.total_results.toLocaleString()}
              icon={Search}
              description="Gefundene Ergebnisse"
            />
            <KeywordMetricsCard
              title="Organic Results"
              value={results.organic_results.length}
              icon={Globe}
              description="Organische Ergebnisse"
            />
            <KeywordMetricsCard
              title="SERP Features"
              value={results.serp_features.length}
              icon={Brain}
              description="SERP-Features gefunden"
            />
            <KeywordMetricsCard
              title="AI Overview"
              value={results.ai_overview ? 'Verfügbar' : 'Nicht verfügbar'}
              icon={Brain}
              description="AI Overview Status"
            />
          </div>

          {/* AI Overview */}
          {results.ai_overview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{results.ai_overview.title}</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {results.ai_overview.content}
                    </p>
                  </div>
                </div>
                
                {results.ai_overview.sources && results.ai_overview.sources.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Quellen:</h4>
                    <div className="space-y-2">
                      {results.ai_overview.sources.map((source, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-medium"
                            >
                              {source.title}
                            </a>
                            <p className="text-sm text-muted-foreground">{source.domain}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Organic Results */}
          {results.organic_results && results.organic_results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Organische Ergebnisse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.organic_results.slice(0, 10).map((result, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <Badge variant="secondary" className="text-sm">
                          #{result.position}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            {result.title}
                          </a>
                          {result.featured_snippet && (
                            <Badge variant="default" className="text-xs">
                              Featured Snippet
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{result.domain}</p>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SERP Features */}
          {results.serp_features && results.serp_features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>SERP Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.serp_features.map((feature, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{feature.type}</Badge>
                        <h4 className="font-medium">{feature.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Suchinformationen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Suchzeit:</span>
                  <div className="font-medium">{new Date(results.search_time).toLocaleString('de-DE')}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Standort:</span>
                  <div className="font-medium">{results.location}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Sprache:</span>
                  <div className="font-medium">{results.language}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
