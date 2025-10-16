'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Download,
  Loader2,
  BarChart3,
  Globe,
  Eye,
  Users,
  Calendar
} from 'lucide-react';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface TrafficAnalytics {
  domain: string;
  organic_traffic: number;
  paid_traffic: number;
  direct_traffic: number;
  referral_traffic: number;
  social_traffic: number;
  total_traffic: number;
  traffic_sources: Array<{
    source: string;
    traffic: number;
    percentage: number;
    change: number;
  }>;
  monthly_traffic: Array<{
    month: string;
    organic: number;
    paid: number;
    direct: number;
    referral: number;
    social: number;
  }>;
  top_pages: Array<{
    page: string;
    traffic: number;
    percentage: number;
    bounce_rate: number;
  }>;
  countries: Array<{
    country: string;
    traffic: number;
    percentage: number;
  }>;
}

export default function TrafficAnalyticsPage() {
  const [domain, setDomain] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<TrafficAnalytics | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/domain/traffic', {
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
      total_traffic: results.total_traffic,
      organic_traffic: results.organic_traffic,
      paid_traffic: results.paid_traffic,
      direct_traffic: results.direct_traffic,
      referral_traffic: results.referral_traffic,
      social_traffic: results.social_traffic,
      top_pages: results.top_pages.slice(0, 10),
      countries: results.countries.slice(0, 10)
    };

    if (format === 'csv') {
      const csvContent = [
        'Domain,Total Traffic,Organic,Paid,Direct,Referral,Social',
        `${results.domain},${results.total_traffic},${results.organic_traffic},${results.paid_traffic},${results.direct_traffic},${results.referral_traffic},${results.social_traffic}`
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `traffic-analytics-${domain}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `traffic-analytics-${domain}-${new Date().toISOString().split('T')[0]}.json`;
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

  const prepareTrafficChartData = () => {
    if (!results?.monthly_traffic) return [];
    
    return results.monthly_traffic.map(item => ({
      month: item.month,
      Organic: item.organic,
      Paid: item.paid,
      Direct: item.direct,
      Referral: item.referral,
      Social: item.social
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Traffic Analytics</h1>
        <p className="text-muted-foreground">
          Detaillierte Traffic-Analyse und Besucherstatistiken
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Traffic-Analyse
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
                    Analysiere Traffic...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Traffic analysieren
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
              <h2 className="text-2xl font-bold">Traffic-Analyse</h2>
              <p className="text-muted-foreground">
                Detaillierte Statistiken für {normalizeDomain(results.domain)}
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
              title="Total Traffic"
              value={results.total_traffic.toLocaleString()}
              icon={Eye}
              description="Monatlicher Gesamttraffic"
            />
            <KeywordMetricsCard
              title="Organic Traffic"
              value={results.organic_traffic.toLocaleString()}
              icon={TrendingUp}
              description="Organischer Traffic"
            />
            <KeywordMetricsCard
              title="Paid Traffic"
              value={results.paid_traffic.toLocaleString()}
              icon={BarChart3}
              description="Bezahlter Traffic"
            />
            <KeywordMetricsCard
              title="Direct Traffic"
              value={results.direct_traffic.toLocaleString()}
              icon={Globe}
              description="Direkter Traffic"
            />
          </div>

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
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="font-medium">{source.source}</span>
                        {source.change !== 0 && (
                          <Badge 
                            variant={source.change > 0 ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {source.change > 0 ? '+' : ''}{source.change}%
                          </Badge>
                        )}
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

          {/* Monthly Traffic Chart */}
          {results.monthly_traffic && results.monthly_traffic.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Monatlicher Traffic-Verlauf
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={prepareTrafficChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
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
                      dataKey="Organic" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Paid" 
                      stroke="#dc2626" 
                      strokeWidth={2}
                      dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Direct" 
                      stroke="#16a34a" 
                      strokeWidth={2}
                      dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Referral" 
                      stroke="#ca8a04" 
                      strokeWidth={2}
                      dot={{ fill: '#ca8a04', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Social" 
                      stroke="#9333ea" 
                      strokeWidth={2}
                      dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Top Pages */}
          {results.top_pages && results.top_pages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Seiten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Seite</th>
                        <th className="text-right p-2">Traffic</th>
                        <th className="text-center p-2">Anteil</th>
                        <th className="text-center p-2">Bounce Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.top_pages.slice(0, 10).map((page, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            <a 
                              href={`https://${results.domain}${page.page}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm truncate max-w-[300px] block"
                            >
                              {page.page}
                            </a>
                          </td>
                          <td className="text-right p-2">{page.traffic.toLocaleString()}</td>
                          <td className="text-center p-2">
                            <Badge variant="secondary">{page.percentage}%</Badge>
                          </td>
                          <td className="text-center p-2">
                            <Badge 
                              variant={page.bounce_rate > 70 ? "destructive" : page.bounce_rate > 50 ? "secondary" : "default"}
                            >
                              {page.bounce_rate}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Countries */}
          {results.countries && results.countries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Länder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.countries.slice(0, 10).map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{country.traffic.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{country.percentage}%</div>
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
