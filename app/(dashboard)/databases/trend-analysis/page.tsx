'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Search, BarChart3, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TrendDataPoint {
  date: string;
  value: number;
  change: number;
  change_percentage: number;
}

interface TrendAnalysisResult {
  keyword: string;
  domain: string;
  metric: string;
  date_range: {
    start: string;
    end: string;
  };
  trend_direction: 'up' | 'down' | 'stable';
  trend_strength: 'strong' | 'moderate' | 'weak';
  trend_confidence: number;
  data_points: TrendDataPoint[];
  insights: Array<{
    type: 'peak' | 'valley' | 'seasonal' | 'anomaly';
    date: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  predictions: Array<{
    date: string;
    predicted_value: number;
    confidence: number;
  }>;
  summary: {
    total_change: number;
    avg_change: number;
    volatility: number;
    seasonality_score: number;
  };
}

export default function TrendAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TrendAnalysisResult | null>(null);
  const [formData, setFormData] = useState({
    keyword: '',
    domain: '',
    metric: 'position',
    date_from: '',
    date_to: '',
    location_code: '2840',
    language_code: 'de'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/databases/trend-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Trend Analysis');
      }

      const data = await response.json();
      setResults(data.result);
      
      toast.success('Trend Analysis erfolgreich abgeschlossen!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler bei der Analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!results?.data_points.length) return;
    
    const csvContent = [
      ['Date', 'Value', 'Change', 'Change %'],
      ...results.data_points.map(point => [
        point.date,
        point.value,
        point.change,
        point.change_percentage
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trend-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendBadgeVariant = (direction: string) => {
    switch (direction) {
      case 'up': return 'default' as const;
      case 'down': return 'destructive' as const;
      case 'stable': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'peak': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'valley': return <BarChart3 className="h-4 w-4 text-red-500" />;
      case 'seasonal': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'anomaly': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trend Analysis</h1>
        <p className="text-muted-foreground">
          Erkenne Trends und Entwicklungen über Zeit
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  placeholder="z.B. SEO Tools, Digital Marketing"
                  value={formData.keyword}
                  onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  placeholder="z.B. example.com"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metric">Metrik</Label>
                <Select 
                  value={formData.metric} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, metric: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="position">Position</SelectItem>
                    <SelectItem value="search_volume">Search Volume</SelectItem>
                    <SelectItem value="cpc">CPC</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_from">Von Datum</Label>
                <Input
                  id="date_from"
                  type="date"
                  value={formData.date_from}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_from: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_to">Bis Datum</Label>
                <Input
                  id="date_to"
                  type="date"
                  value={formData.date_to}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_to: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location_code">Standort</Label>
                <Select 
                  value={formData.location_code} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, location_code: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2840">Deutschland</SelectItem>
                    <SelectItem value="2826">Österreich</SelectItem>
                    <SelectItem value="276">Schweiz</SelectItem>
                    <SelectItem value="840">USA</SelectItem>
                    <SelectItem value="826">UK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Trends...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trend Analysis starten
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trend Richtung</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getTrendBadgeVariant(results.trend_direction)} className={getTrendColor(results.trend_direction)}>
                        {results.trend_direction === 'up' ? 'Aufwärts' : 
                         results.trend_direction === 'down' ? 'Abwärts' : 'Stabil'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trend Stärke</p>
                    <p className="text-2xl font-bold">{results.trend_strength}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                    <p className="text-2xl font-bold">{Math.round(results.trend_confidence * 100)}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Saisonalität</p>
                    <p className="text-2xl font-bold">{Math.round(results.summary.seasonality_score * 100)}%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trend Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{insight.description}</h3>
                          <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                            {insight.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(insight.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vorhersagen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.predictions.map((prediction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{new Date(prediction.date).toLocaleDateString()}</h3>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {Math.round(prediction.confidence * 100)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{prediction.predicted_value.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">{results.metric}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Trend-Daten ({results.data_points.length})
                </CardTitle>
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  CSV Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.data_points.map((point, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{new Date(point.date).toLocaleDateString()}</h3>
                        <Badge variant="secondary">
                          {point.value.toFixed(1)}
                        </Badge>
                        <span className={`text-sm font-medium ${point.change > 0 ? 'text-green-600' : point.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {point.change > 0 ? '+' : ''}{point.change.toFixed(1)} ({point.change_percentage > 0 ? '+' : ''}{point.change_percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
