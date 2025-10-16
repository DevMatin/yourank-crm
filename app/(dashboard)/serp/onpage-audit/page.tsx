'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download,
  Loader2,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';
import { TaskProgress } from '@/components/analysis/task-progress';

interface OnPageIssue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  url: string;
  element: string;
  recommendation: string;
}

interface OnPageAudit {
  domain: string;
  total_pages: number;
  crawled_pages: number;
  issues_found: number;
  issues: OnPageIssue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
  pagespeed: {
    desktop_score: number;
    mobile_score: number;
    desktop_metrics: {
      first_contentful_paint: number;
      largest_contentful_paint: number;
      cumulative_layout_shift: number;
      first_input_delay: number;
    };
    mobile_metrics: {
      first_contentful_paint: number;
      largest_contentful_paint: number;
      cumulative_layout_shift: number;
      first_input_delay: number;
    };
  };
  audit_time: string;
}

export default function OnPageAuditPage() {
  const [domain, setDomain] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<OnPageAudit | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [showTaskProgress, setShowTaskProgress] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);
    setShowTaskProgress(false);

    try {
      const response = await fetch('/api/serp/onpage-audit', {
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

      // Check if this is a task-based analysis
      if (data.taskId) {
        setTaskId(data.taskId);
        setAnalysisId(data.analysisId);
        setShowTaskProgress(true);
      } else {
        setResults(data.data);
        setAnalysisId(data.analysisId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = (result: any) => {
    setResults(result);
    setShowTaskProgress(false);
  };

  const handleTaskError = (error: string) => {
    setError(error);
    setShowTaskProgress(false);
  };

  const exportResults = (format: 'csv' | 'json') => {
    if (!results) return;

    const data = results.issues.map(issue => ({
      type: issue.type,
      severity: issue.severity,
      title: issue.title,
      description: issue.description,
      url: issue.url,
      element: issue.element,
      recommendation: issue.recommendation
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `onpage-audit-${domain}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `onpage-audit-${domain}-${new Date().toISOString().split('T')[0]}.json`;
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">On-Page SEO Audit</h1>
        <p className="text-muted-foreground">
          Technische SEO-Analyse von Webseiten
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            On-Page SEO Audit
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
                    Starte Audit...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    SEO Audit starten
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Task Progress */}
      {showTaskProgress && taskId && (
        <TaskProgress
          taskId={taskId}
          analysisId={analysisId!}
          onComplete={handleTaskComplete}
          onError={handleTaskError}
          maxDuration={600} // 10 minutes
        />
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">SEO Audit Ergebnisse</h2>
              <p className="text-muted-foreground">
                Analyse für {normalizeDomain(results.domain)}
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
              title="Gecrawlte Seiten"
              value={results.crawled_pages.toLocaleString()}
              icon={Globe}
              description={`von ${results.total_pages} Seiten`}
            />
            <KeywordMetricsCard
              title="Gefundene Probleme"
              value={results.issues_found}
              icon={AlertTriangle}
              description="Insgesamt"
            />
            <KeywordMetricsCard
              title="Desktop Score"
              value={results.pagespeed.desktop_score}
              icon={CheckCircle}
              description="PageSpeed Insights"
            />
            <KeywordMetricsCard
              title="Mobile Score"
              value={results.pagespeed.mobile_score}
              icon={CheckCircle}
              description="PageSpeed Insights"
            />
          </div>

          {/* Issues Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Probleme Übersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold text-red-600">{results.summary.errors}</div>
                    <div className="text-sm text-muted-foreground">Fehler</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{results.summary.warnings}</div>
                    <div className="text-sm text-muted-foreground">Warnungen</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Info className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{results.summary.info}</div>
                    <div className="text-sm text-muted-foreground">Informationen</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PageSpeed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Desktop Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Desktop Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">First Contentful Paint</span>
                  <span className="text-sm">{results.pagespeed.desktop_metrics.first_contentful_paint}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Largest Contentful Paint</span>
                  <span className="text-sm">{results.pagespeed.desktop_metrics.largest_contentful_paint}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cumulative Layout Shift</span>
                  <span className="text-sm">{results.pagespeed.desktop_metrics.cumulative_layout_shift}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">First Input Delay</span>
                  <span className="text-sm">{results.pagespeed.desktop_metrics.first_input_delay}ms</span>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Mobile Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">First Contentful Paint</span>
                  <span className="text-sm">{results.pagespeed.mobile_metrics.first_contentful_paint}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Largest Contentful Paint</span>
                  <span className="text-sm">{results.pagespeed.mobile_metrics.largest_contentful_paint}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cumulative Layout Shift</span>
                  <span className="text-sm">{results.pagespeed.mobile_metrics.cumulative_layout_shift}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">First Input Delay</span>
                  <span className="text-sm">{results.pagespeed.mobile_metrics.first_input_delay}ms</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Issues List */}
          <Card>
            <CardHeader>
              <CardTitle>Gefundene Probleme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.issues.map((issue, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                        <div className="text-sm">
                          <span className="text-muted-foreground">URL: </span>
                          <a 
                            href={issue.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {issue.url}
                          </a>
                        </div>
                        {issue.element && (
                          <div className="text-sm mt-1">
                            <span className="text-muted-foreground">Element: </span>
                            <code className="bg-muted px-1 rounded">{issue.element}</code>
                          </div>
                        )}
                        {issue.recommendation && (
                          <div className="mt-3 p-3 bg-muted/50 rounded">
                            <span className="text-sm font-medium">Empfehlung: </span>
                            <span className="text-sm">{issue.recommendation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
