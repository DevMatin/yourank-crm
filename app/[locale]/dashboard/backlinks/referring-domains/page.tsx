'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Search, Globe, TrendingUp, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface ReferringDomain {
  domain: string;
  domain_rating: number;
  backlinks_count: number;
  referring_pages_count: number;
  first_seen: string;
  last_seen: string;
  spam_score: number;
  toxic_score: number;
  country: string;
  language: string;
}

export default function ReferringDomainsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ReferringDomain[]>([]);
  const [formData, setFormData] = useState({
    target: '',
    limit: 100,
    spam_score: 30,
    toxic_score: 30
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/backlinks/referring-domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Referring Domains Analyse');
      }

      const data = await response.json();
      setResults(data.results || []);
      
      toast.success(`${data.results?.length || 0} Referring Domains gefunden!`);
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
      ['Domain', 'Domain Rating', 'Backlinks Count', 'Referring Pages', 'First Seen', 'Last Seen', 'Spam Score', 'Toxic Score', 'Country', 'Language'],
      ...results.map(result => [
        result.domain,
        result.domain_rating,
        result.backlinks_count,
        result.referring_pages_count,
        result.first_seen,
        result.last_seen,
        result.spam_score,
        result.toxic_score,
        result.country,
        result.language
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'referring-domains-analysis.csv';
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
        <h1 className="text-3xl font-bold">Referring Domains</h1>
        <p className="text-muted-foreground">
          Domains die auf deine Seite verlinken
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
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
                <Label htmlFor="limit">Anzahl Domains</Label>
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
                <Label htmlFor="spam_score">Max Spam Score</Label>
                <Select 
                  value={formData.spam_score.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, spam_score: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10% (Sehr streng)</SelectItem>
                    <SelectItem value="30">30% (Empfohlen)</SelectItem>
                    <SelectItem value="50">50% (Moderat)</SelectItem>
                    <SelectItem value="100">100% (Alle)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toxic_score">Max Toxic Score</Label>
                <Select 
                  value={formData.toxic_score.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, toxic_score: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10% (Sehr streng)</SelectItem>
                    <SelectItem value="30">30% (Empfohlen)</SelectItem>
                    <SelectItem value="50">50% (Moderat)</SelectItem>
                    <SelectItem value="100">100% (Alle)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Referring Domains...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Referring Domains Analyse starten
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
                Referring Domains ({results.length})
              </CardTitle>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                CSV Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((domain, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-lg">{domain.domain}</h3>
                      <Badge variant="secondary" className={getRatingColor(domain.domain_rating)}>
                        DR {domain.domain_rating}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getSpamToxicColor(domain.spam_score)}>
                        Spam: {domain.spam_score}%
                      </Badge>
                      <Badge variant="outline" className={getSpamToxicColor(domain.toxic_score)}>
                        Toxic: {domain.toxic_score}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ExternalLink className="h-3 w-3" />
                        Backlinks
                      </div>
                      <div className="font-medium">{domain.backlinks_count.toLocaleString()}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        Referring Pages
                      </div>
                      <div className="font-medium">{domain.referring_pages_count.toLocaleString()}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Shield className="h-3 w-3" />
                        Country
                      </div>
                      <div className="font-medium">{domain.country}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        Language
                      </div>
                      <div className="font-medium">{domain.language}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3 pt-3 border-t">
                    <span>
                      First seen: {new Date(domain.first_seen).toLocaleDateString()}
                    </span>
                    <span>
                      Last seen: {new Date(domain.last_seen).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
