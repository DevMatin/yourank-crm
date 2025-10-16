'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link, Search, Globe, TrendingUp, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface BacklinkOverview {
  total_backlinks: number;
  referring_domains: number;
  referring_ips: number;
  referring_main_domains: number;
  broken_backlinks: number;
  lost_backlinks: number;
  new_backlinks: number;
  domain_rating: number;
  url_rating: number;
  spam_score: number;
  toxic_score: number;
  top_backlinks: Array<{
    url_from: string;
    url_to: string;
    anchor: string;
    domain_rating: number;
    url_rating: number;
    link_type: string;
    first_seen: string;
  }>;
}

export default function BacklinksOverviewPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BacklinkOverview | null>(null);
  const [formData, setFormData] = useState({
    target: '',
    limit: 100,
    backlinks_status_type: 'all',
    include_subdomains: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/backlinks/overview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Backlinks Overview Analyse');
      }

      const data = await response.json();
      setResults(data.result);
      
      toast.success('Backlinks Overview erfolgreich analysiert!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler bei der Analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!results?.top_backlinks.length) return;
    
    const csvContent = [
      ['URL From', 'URL To', 'Anchor', 'Domain Rating', 'URL Rating', 'Link Type', 'First Seen'],
      ...results.top_backlinks.map(backlink => [
        backlink.url_from,
        backlink.url_to,
        backlink.anchor,
        backlink.domain_rating,
        backlink.url_rating,
        backlink.link_type,
        backlink.first_seen
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backlinks-overview.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 70) return 'text-green-600';
    if (rating >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSpamToxicColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Backlinks Overview</h1>
        <p className="text-muted-foreground">
          Gesamtübersicht aller Backlinks einer Domain
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Domain oder URL</Label>
                <Input
                  id="target"
                  placeholder="example.com oder https://example.com/page"
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="limit">Anzahl Top Backlinks</Label>
                <Select 
                  value={formData.limit.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, limit: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backlinks_status_type">Backlink Status</Label>
                <Select 
                  value={formData.backlinks_status_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, backlinks_status_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="lost">Verloren</SelectItem>
                    <SelectItem value="broken">Broken</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="include_subdomains">Subdomains einbeziehen</Label>
                <Select 
                  value={formData.include_subdomains.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, include_subdomains: value === 'true' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Nein</SelectItem>
                    <SelectItem value="true">Ja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Backlinks...
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Backlinks Overview Analyse starten
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
                    <p className="text-sm font-medium text-muted-foreground">Total Backlinks</p>
                    <p className="text-2xl font-bold">{results.total_backlinks.toLocaleString()}</p>
                  </div>
                  <Link className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Referring Domains</p>
                    <p className="text-2xl font-bold">{results.referring_domains.toLocaleString()}</p>
                  </div>
                  <Globe className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Domain Rating</p>
                    <p className={`text-2xl font-bold ${getRatingColor(results.domain_rating)}`}>
                      {results.domain_rating}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Spam Score</p>
                    <p className={`text-2xl font-bold ${getSpamToxicColor(results.spam_score)}`}>
                      {results.spam_score}%
                    </p>
                  </div>
                  <ExternalLink className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Backlinks ({results.top_backlinks.length})
                </CardTitle>
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  CSV Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.top_backlinks.map((backlink, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{backlink.url_from}</h3>
                        <Badge variant="secondary">
                          DR {backlink.domain_rating}
                        </Badge>
                        <Badge variant="outline">
                          UR {backlink.url_rating}
                        </Badge>
                      </div>
                      <Badge variant="outline">
                        {backlink.link_type}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate max-w-md">{backlink.url_to}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">Anchor: "{backlink.anchor}"</span>
                      <span className="text-muted-foreground">
                        First seen: {new Date(backlink.first_seen).toLocaleDateString()}
                      </span>
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
