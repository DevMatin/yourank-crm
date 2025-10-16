'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tag, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface MetaTagResult {
  url: string;
  title: {
    text: string;
    length: number;
    is_optimal: boolean;
    issues: string[];
  };
  meta_description: {
    text: string;
    length: number;
    is_optimal: boolean;
    issues: string[];
  };
  h1_tags: Array<{
    text: string;
    length: number;
  }>;
  h2_tags: Array<{
    text: string;
    length: number;
  }>;
  images: Array<{
    src: string;
    alt: string;
    has_alt: boolean;
  }>;
  links: {
    internal: number;
    external: number;
    nofollow: number;
  };
  issues: Array<{
    type: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    element: string;
  }>;
}

export default function MetaTagsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MetaTagResult | null>(null);
  const [formData, setFormData] = useState({
    url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/content/meta-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Meta Tags Analyse');
      }

      const data = await response.json();
      setResults(data.result);
      
      toast.success('Meta Tags Analyse erfolgreich abgeschlossen!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler bei der Analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Tag className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'error': return 'destructive' as const;
      case 'warning': return 'default' as const;
      case 'info': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meta Tags Analysis</h1>
        <p className="text-muted-foreground">
          Analysiere Meta-Tags und HTML-Struktur
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Meta Tags...
                </>
              ) : (
                <>
                  <Tag className="mr-2 h-4 w-4" />
                  Meta Tags Analyse starten
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
                    <p className="text-sm font-medium text-muted-foreground">Title</p>
                    <div className="flex items-center gap-2 mt-1">
                      {results.title.is_optimal ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <p className="text-sm font-medium">
                        {results.title.length} Zeichen
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
                    <p className="text-sm font-medium text-muted-foreground">Meta Description</p>
                    <div className="flex items-center gap-2 mt-1">
                      {results.meta_description.is_optimal ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <p className="text-sm font-medium">
                        {results.meta_description.length} Zeichen
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
                    <p className="text-sm font-medium text-muted-foreground">H1 Tags</p>
                    <p className="text-2xl font-bold">{results.h1_tags.length}</p>
                  </div>
                  <Tag className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issues</p>
                    <p className="text-2xl font-bold">{results.issues.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Title & Meta Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">Title</h3>
                      <Badge variant={results.title.is_optimal ? 'default' : 'destructive'}>
                        {results.title.is_optimal ? 'Optimal' : 'Nicht optimal'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      "{results.title.text}"
                    </p>
                    {results.title.issues.length > 0 && (
                      <div className="space-y-1">
                        {results.title.issues.map((issue, index) => (
                          <div key={index} className="text-xs text-red-600">
                            • {issue}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">Meta Description</h3>
                      <Badge variant={results.meta_description.is_optimal ? 'default' : 'destructive'}>
                        {results.meta_description.is_optimal ? 'Optimal' : 'Nicht optimal'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      "{results.meta_description.text}"
                    </p>
                    {results.meta_description.issues.length > 0 && (
                      <div className="space-y-1">
                        {results.meta_description.issues.map((issue, index) => (
                          <div key={index} className="text-xs text-red-600">
                            • {issue}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HTML-Struktur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">H1 Tags ({results.h1_tags.length})</h3>
                    <div className="space-y-1">
                      {results.h1_tags.map((h1, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          "{h1.text}" ({h1.length} Zeichen)
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">H2 Tags ({results.h2_tags.length})</h3>
                    <div className="space-y-1">
                      {results.h2_tags.slice(0, 5).map((h2, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                          "{h2.text}" ({h2.length} Zeichen)
                        </div>
                      ))}
                      {results.h2_tags.length > 5 && (
                        <div className="text-xs text-muted-foreground">
                          ... und {results.h2_tags.length - 5} weitere
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Links</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-medium">{results.links.internal}</div>
                        <div className="text-xs text-muted-foreground">Intern</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium">{results.links.external}</div>
                        <div className="text-xs text-muted-foreground">Extern</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="font-medium">{results.links.nofollow}</div>
                        <div className="text-xs text-muted-foreground">NoFollow</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {results.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Gefundene Issues ({results.issues.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{issue.message}</h3>
                          <Badge variant={getSeverityBadgeVariant(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline">
                            {issue.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Element: {issue.element}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
