'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link, Search, AlertTriangle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface BrokenLink {
  url: string;
  status_code: number;
  response_time: number;
  content_type: string;
  content_length: number;
  redirect_url: string;
  error_message: string;
  first_seen: string;
  last_seen: string;
}

export default function BrokenLinksPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BrokenLink[]>([]);
  const [formData, setFormData] = useState({
    target: '',
    limit: 100,
    status_codes: '4xx,5xx',
    include_internal: true,
    include_external: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/onpage/broken-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Broken Links Analyse');
      }

      const data = await response.json();
      setResults(data.results || []);
      
      toast.success(`${data.results?.length || 0} defekte Links gefunden!`);
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
      ['URL', 'Status Code', 'Response Time', 'Content Type', 'Content Length', 'Redirect URL', 'Error Message', 'First Seen', 'Last Seen'],
      ...results.map(link => [
        link.url,
        link.status_code,
        link.response_time,
        link.content_type,
        link.content_length,
        link.redirect_url,
        link.error_message,
        link.first_seen,
        link.last_seen
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'broken-links-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 500) return 'text-red-600';
    if (statusCode >= 400) return 'text-orange-600';
    if (statusCode >= 300) return 'text-blue-600';
    return 'text-green-600';
  };

  const getStatusBadgeVariant = (statusCode: number) => {
    if (statusCode >= 500) return 'destructive' as const;
    if (statusCode >= 400) return 'default' as const;
    if (statusCode >= 300) return 'secondary' as const;
    return 'outline' as const;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Broken Links</h1>
        <p className="text-muted-foreground">
          Finde defekte Links auf deiner Website
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
                <Label htmlFor="limit">Max. Links</Label>
                <Select 
                  value={formData.limit.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, limit: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 Links</SelectItem>
                    <SelectItem value="100">100 Links</SelectItem>
                    <SelectItem value="200">200 Links</SelectItem>
                    <SelectItem value="500">500 Links</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status_codes">Status Codes</Label>
                <Select 
                  value={formData.status_codes} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status_codes: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4xx,5xx">4xx & 5xx (Empfohlen)</SelectItem>
                    <SelectItem value="4xx">Nur 4xx</SelectItem>
                    <SelectItem value="5xx">Nur 5xx</SelectItem>
                    <SelectItem value="all">Alle Codes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="include_internal">Interne Links</Label>
                <Select 
                  value={formData.include_internal.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, include_internal: value === 'true' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Einbeziehen</SelectItem>
                    <SelectItem value="false">Ignorieren</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="include_external">Externe Links</Label>
                <Select 
                  value={formData.include_external.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, include_external: value === 'true' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Einbeziehen</SelectItem>
                    <SelectItem value="false">Ignorieren</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Links...
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Broken Links Analyse starten
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
                <AlertTriangle className="h-5 w-5" />
                Defekte Links ({results.length})
              </CardTitle>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                CSV Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((link, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium truncate max-w-md">{link.url}</h3>
                      <Badge variant={getStatusBadgeVariant(link.status_code)} className={getStatusColor(link.status_code)}>
                        {link.status_code}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {link.response_time}ms
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <div className="font-medium">Content Type</div>
                      <div>{link.content_type || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="font-medium">Content Length</div>
                      <div>{link.content_length ? `${link.content_length} bytes` : 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="font-medium">First Seen</div>
                      <div>{new Date(link.first_seen).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="font-medium">Last Seen</div>
                      <div>{new Date(link.last_seen).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {link.redirect_url && (
                    <div className="mt-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ExternalLink className="h-3 w-3" />
                        Redirects to: {link.redirect_url}
                      </div>
                    </div>
                  )}

                  {link.error_message && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-800">
                      <strong>Error:</strong> {link.error_message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
