'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, Search, TrendingUp, Clock, Smartphone, Monitor } from 'lucide-react';
import { toast } from 'sonner';

interface PageSpeedResult {
  url: string;
  device: 'mobile' | 'desktop';
  performance_score: number;
  first_contentful_paint: number;
  largest_contentful_paint: number;
  first_input_delay: number;
  cumulative_layout_shift: number;
  speed_index: number;
  time_to_interactive: number;
  total_blocking_time: number;
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
    savings: string;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
  }>;
}

export default function PageSpeedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PageSpeedResult[]>([]);
  const [formData, setFormData] = useState({
    target: '',
    device: 'both',
    strategy: 'both'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/onpage/pagespeed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Page Speed Analyse');
      }

      const data = await response.json();
      setResults(data.results || []);
      
      toast.success('Page Speed Analyse erfolgreich abgeschlossen!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler bei der Analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!results.length) return;
    
    const csvContent = [
      ['URL', 'Device', 'Performance Score', 'FCP', 'LCP', 'FID', 'CLS', 'SI', 'TTI', 'TBT'],
      ...results.map(result => [
        result.url,
        result.device,
        result.performance_score,
        result.first_contentful_paint,
        result.largest_contentful_paint,
        result.first_input_delay,
        result.cumulative_layout_shift,
        result.speed_index,
        result.time_to_interactive,
        result.total_blocking_time
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pagespeed-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default' as const;
    if (score >= 50) return 'secondary' as const;
    return 'destructive' as const;
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Speed Analysis</h1>
        <p className="text-muted-foreground">
          Analysiere Ladezeiten und Performance-Metriken
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Website URL</Label>
                <Input
                  id="target"
                  placeholder="https://example.com"
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="device">Device</Label>
                <Select 
                  value={formData.device} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, device: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Mobile & Desktop</SelectItem>
                    <SelectItem value="mobile">Nur Mobile</SelectItem>
                    <SelectItem value="desktop">Nur Desktop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select 
                value={formData.strategy} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, strategy: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Performance & Best Practices</SelectItem>
                  <SelectItem value="performance">Nur Performance</SelectItem>
                  <SelectItem value="best_practices">Nur Best Practices</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Page Speed...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Page Speed Analyse starten
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {result.device === 'mobile' ? (
                        <Smartphone className="h-5 w-5" />
                      ) : (
                        <Monitor className="h-5 w-5" />
                      )}
                      {result.device === 'mobile' ? 'Mobile' : 'Desktop'}
                    </CardTitle>
                    <Badge variant={getScoreBadgeVariant(result.performance_score)} className={getScoreColor(result.performance_score)}>
                      {result.performance_score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          First Contentful Paint
                        </div>
                        <div className="font-medium">{formatTime(result.first_contentful_paint)}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          Largest Contentful Paint
                        </div>
                        <div className="font-medium">{formatTime(result.largest_contentful_paint)}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Zap className="h-3 w-3" />
                          First Input Delay
                        </div>
                        <div className="font-medium">{formatTime(result.first_input_delay)}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          Cumulative Layout Shift
                        </div>
                        <div className="font-medium">{result.cumulative_layout_shift.toFixed(3)}</div>
                      </div>
                    </div>

                    {result.opportunities.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Optimierungsmöglichkeiten</h4>
                        <div className="space-y-2">
                          {result.opportunities.slice(0, 3).map((opp, idx) => (
                            <div key={idx} className="p-2 bg-yellow-50 rounded text-sm">
                              <div className="font-medium">{opp.title}</div>
                              <div className="text-muted-foreground">{opp.description}</div>
                              {opp.savings && (
                                <div className="text-green-600 font-medium">Potential: {opp.savings}</div>
                              )}
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Detaillierte Metriken
                </CardTitle>
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  CSV Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{result.url}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {result.device === 'mobile' ? 'Mobile' : 'Desktop'}
                        </Badge>
                        <Badge variant={getScoreBadgeVariant(result.performance_score)} className={getScoreColor(result.performance_score)}>
                          Score: {result.performance_score}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Speed Index</div>
                        <div className="font-medium">{formatTime(result.speed_index)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Time to Interactive</div>
                        <div className="font-medium">{formatTime(result.time_to_interactive)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Total Blocking Time</div>
                        <div className="font-medium">{formatTime(result.total_blocking_time)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Cumulative Layout Shift</div>
                        <div className="font-medium">{result.cumulative_layout_shift.toFixed(3)}</div>
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
