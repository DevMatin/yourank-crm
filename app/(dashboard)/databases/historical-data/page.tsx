'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Search, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface HistoricalDataPoint {
  date: string;
  keyword: string;
  position: number;
  search_volume: number;
  cpc: number;
  difficulty: number;
  url: string;
  serp_features: string[];
}

interface HistoricalDataResult {
  keyword: string;
  domain: string;
  date_range: {
    start: string;
    end: string;
  };
  total_data_points: number;
  data_points: HistoricalDataPoint[];
  summary: {
    avg_position: number;
    position_change: number;
    best_position: number;
    worst_position: number;
    avg_search_volume: number;
    total_impressions: number;
  };
}

export default function HistoricalDataPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<HistoricalDataResult | null>(null);
  const [formData, setFormData] = useState({
    keyword: '',
    domain: '',
    date_from: '',
    date_to: '',
    location_code: '2840',
    language_code: 'de'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/databases/historical-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Historical Data Analyse');
      }

      const data = await response.json();
      setResults(data.result);
      
      toast.success(`${data.result?.total_data_points || 0} historische Datenpunkte gefunden!`);
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
      ['Date', 'Keyword', 'Position', 'Search Volume', 'CPC', 'Difficulty', 'URL', 'SERP Features'],
      ...results.data_points.map(point => [
        point.date,
        point.keyword,
        point.position,
        point.search_volume,
        point.cpc,
        point.difficulty,
        point.url,
        point.serp_features.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historical-data-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPositionChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPositionChangeIcon = (change: number) => {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '→';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historical Data Analysis</h1>
        <p className="text-muted-foreground">
          Analysiere historische SEO-Daten und Rankings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
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
                <Label htmlFor="date_from">Von Datum</Label>
                <Input
                  id="date_from"
                  type="date"
                  value={formData.date_from}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_from: e.target.value }))}
                  required
                />
              </div>
              
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="language_code">Sprache</Label>
                <Select 
                  value={formData.language_code} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language_code: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">Englisch</SelectItem>
                    <SelectItem value="fr">Französisch</SelectItem>
                    <SelectItem value="es">Spanisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere historische Daten...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Historical Data Analyse starten
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
                    <p className="text-sm font-medium text-muted-foreground">Durchschnittliche Position</p>
                    <p className="text-2xl font-bold">{results.summary.avg_position.toFixed(1)}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Position Change</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg">{getPositionChangeIcon(results.summary.position_change)}</span>
                      <p className={`text-2xl font-bold ${getPositionChangeColor(results.summary.position_change)}`}>
                        {results.summary.position_change > 0 ? '+' : ''}{results.summary.position_change.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Beste Position</p>
                    <p className="text-2xl font-bold text-green-600">#{results.summary.best_position}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Datenpunkte</p>
                    <p className="text-2xl font-bold">{results.total_data_points}</p>
                  </div>
                  <Database className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Historische Daten ({results.data_points.length})
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
                        <h3 className="font-medium">{point.keyword}</h3>
                        <Badge variant="secondary">
                          Position {point.position}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(point.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Volumen: {point.search_volume.toLocaleString()}</span>
                        <span>CPC: €{point.cpc}</span>
                        <span>Difficulty: {point.difficulty}%</span>
                        {point.serp_features.length > 0 && (
                          <div className="flex gap-1">
                            {point.serp_features.slice(0, 3).map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
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
