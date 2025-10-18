'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { TaskProgress } from '@/components/analysis/task-progress';

interface OnPageIssue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  url: string;
  line: number;
  column: number;
  description: string;
  recommendation: string;
}

interface OnPageResult {
  total_pages: number;
  crawled_pages: number;
  issues_count: number;
  errors: number;
  warnings: number;
  infos: number;
  issues: OnPageIssue[];
  summary: {
    title_issues: number;
    meta_description_issues: number;
    heading_issues: number;
    image_issues: number;
    internal_link_issues: number;
    external_link_issues: number;
    technical_issues: number;
  };
}

export default function OnPageAuditPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<OnPageResult | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    target: '',
    max_crawl_pages: 100,
    crawl_delay: 1,
    enable_javascript: false,
    enable_redirects: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/onpage/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der OnPage Audit Analyse');
      }

      const data = await response.json();
      
      if (data.task_id) {
        // Task-basierte Analyse gestartet
        setTaskId(data.task_id);
        setAnalysisId(data.analysis_id);
        toast.success('OnPage Audit gestartet! Die Analyse läuft im Hintergrund...');
      } else if (data.result) {
        // Sofortige Ergebnisse
        setResults(data.result);
        toast.success('OnPage Audit erfolgreich abgeschlossen!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler bei der Analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskComplete = (result: any) => {
    setResults(result);
    setTaskId(null);
    toast.success('OnPage Audit erfolgreich abgeschlossen!');
  };

  const exportToCSV = () => {
    if (!results?.issues.length) return;
    
    const csvContent = [
      ['Type', 'Severity', 'Message', 'URL', 'Line', 'Column', 'Description', 'Recommendation'],
      ...results.issues.map(issue => [
        issue.type,
        issue.severity,
        issue.message,
        issue.url,
        issue.line,
        issue.column,
        issue.description,
        issue.recommendation
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'onpage-audit-issues.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
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
        <h1 className="text-3xl font-bold">OnPage SEO Audit</h1>
        <p className="text-muted-foreground">
          Vollständige technische SEO-Analyse einer Website
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
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
                <Label htmlFor="max_crawl_pages">Max. Seiten</Label>
                <Select 
                  value={formData.max_crawl_pages.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, max_crawl_pages: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 Seiten</SelectItem>
                    <SelectItem value="100">100 Seiten</SelectItem>
                    <SelectItem value="200">200 Seiten</SelectItem>
                    <SelectItem value="500">500 Seiten</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crawl_delay">Crawl Delay (Sek.)</Label>
                <Select 
                  value={formData.crawl_delay.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, crawl_delay: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Sekunde</SelectItem>
                    <SelectItem value="2">2 Sekunden</SelectItem>
                    <SelectItem value="5">5 Sekunden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enable_javascript">JavaScript</Label>
                <Select 
                  value={formData.enable_javascript.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, enable_javascript: value === 'true' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Deaktiviert</SelectItem>
                    <SelectItem value="true">Aktiviert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enable_redirects">Redirects</Label>
                <Select 
                  value={formData.enable_redirects.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, enable_redirects: value === 'true' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktiviert</SelectItem>
                    <SelectItem value="false">Deaktiviert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Starte OnPage Audit...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  OnPage SEO Audit starten
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {taskId && (
        <TaskProgress 
          taskId={taskId}
          analysisId={analysisId || ''}
          onComplete={handleTaskComplete}
        />
      )}

      {results && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Crawled Pages</p>
                    <p className="text-2xl font-bold">{results.crawled_pages}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                    <p className="text-2xl font-bold">{results.issues_count}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Errors</p>
                    <p className="text-2xl font-bold text-red-600">{results.errors}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-600">{results.warnings}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  SEO Issues ({results.issues.length})
                </CardTitle>
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  CSV Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.issues.map((issue, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{issue.message}</h3>
                          <Badge variant={getSeverityBadgeVariant(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline">
                            {issue.type}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <span className="truncate max-w-md">{issue.url}</span>
                            {issue.line > 0 && (
                              <span>• Line {issue.line}</span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm mb-2">{issue.description}</p>
                        
                        {issue.recommendation && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 mb-1">Empfehlung:</p>
                            <p className="text-sm text-blue-800">{issue.recommendation}</p>
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
