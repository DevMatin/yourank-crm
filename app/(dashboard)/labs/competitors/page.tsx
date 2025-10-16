'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Globe, TrendingUp, ExternalLink, Target } from 'lucide-react';
import { toast } from 'sonner';

interface Competitor {
  domain: string;
  common_keywords: number;
  keyword_gaps: number;
  avg_position: number;
  traffic_estimate: number;
  domain_rating: number;
  backlinks: number;
  referring_domains: number;
  organic_keywords: number;
  paid_keywords: number;
}

export default function CompetitorsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Competitor[]>([]);
  const [formData, setFormData] = useState({
    domain: '',
    location_code: '2840',
    language_code: 'de',
    limit: 20,
    include_subdomains: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/labs/competitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Competitors Analyse');
      }

      const data = await response.json();
      setResults(data.results || []);
      
      toast.success(`${data.results?.length || 0} Konkurrenten gefunden!`);
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
      ['Domain', 'Common Keywords', 'Keyword Gaps', 'Avg Position', 'Traffic Estimate', 'Domain Rating', 'Backlinks', 'Referring Domains', 'Organic Keywords', 'Paid Keywords'],
      ...results.map(result => [
        result.domain,
        result.common_keywords,
        result.keyword_gaps,
        result.avg_position,
        result.traffic_estimate,
        result.domain_rating,
        result.backlinks,
        result.referring_domains,
        result.organic_keywords,
        result.paid_keywords
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'competitors-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCompetitionLevel = (commonKeywords: number) => {
    if (commonKeywords > 1000) return { level: 'Hoch', variant: 'destructive' as const };
    if (commonKeywords > 500) return { level: 'Mittel', variant: 'default' as const };
    return { level: 'Niedrig', variant: 'secondary' as const };
  };

  const getTrafficLevel = (traffic: number) => {
    if (traffic > 100000) return 'Sehr hoch';
    if (traffic > 10000) return 'Hoch';
    if (traffic > 1000) return 'Mittel';
    return 'Niedrig';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Competitors Analysis</h1>
        <p className="text-muted-foreground">
          Finde direkte Konkurrenten und analysiere ihre Stärken
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="limit">Anzahl Konkurrenten</Label>
                <Select 
                  value={formData.limit.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, limit: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
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
                  Analysiere Konkurrenten...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Competitors Analyse starten
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Konkurrenten ({results.length})
              </CardTitle>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                CSV Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((competitor, index) => {
                const competitionLevel = getCompetitionLevel(competitor.common_keywords);
                const trafficLevel = getTrafficLevel(competitor.traffic_estimate);
                
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-lg">{competitor.domain}</h3>
                        <Badge variant={competitionLevel.variant}>
                          {competitionLevel.level} Competition
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">DR {competitor.domain_rating}</div>
                        <div className="text-xs text-muted-foreground">Domain Rating</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Target className="h-3 w-3" />
                          Common Keywords
                        </div>
                        <div className="font-medium">{competitor.common_keywords.toLocaleString()}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          Traffic Estimate
                        </div>
                        <div className="font-medium">{competitor.traffic_estimate.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{trafficLevel}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          Avg Position
                        </div>
                        <div className="font-medium">{competitor.avg_position.toFixed(1)}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <ExternalLink className="h-3 w-3" />
                          Backlinks
                        </div>
                        <div className="font-medium">{competitor.backlinks.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t">
                      <div>
                        <div className="text-muted-foreground">Keyword Gaps</div>
                        <div className="font-medium">{competitor.keyword_gaps}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Referring Domains</div>
                        <div className="font-medium">{competitor.referring_domains.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Organic Keywords</div>
                        <div className="font-medium">{competitor.organic_keywords.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Paid Keywords</div>
                        <div className="font-medium">{competitor.paid_keywords.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
