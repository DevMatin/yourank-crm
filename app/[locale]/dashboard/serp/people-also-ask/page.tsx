'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Download,
  Loader2,
  Search,
  Globe,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PaaQuestion {
  question: string;
  answer: string;
  source: {
    title: string;
    url: string;
    domain: string;
  };
  related_questions: string[];
}

interface PaaResult {
  keyword: string;
  location: string;
  language: string;
  total_questions: number;
  questions: PaaQuestion[];
  organic_results: Array<{
    position: number;
    title: string;
    url: string;
    domain: string;
    description: string;
  }>;
  search_time: string;
}

export default function PeopleAlsoAskPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [device, setDevice] = useState('desktop');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<PaaResult | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/serp/people-also-ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          location,
          language,
          device
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Analyse');
      }

      setResults(data.data);
      setAnalysisId(data.analysisId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (index: number) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(index)) {
      newOpenQuestions.delete(index);
    } else {
      newOpenQuestions.add(index);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const exportResults = (format: 'csv' | 'json') => {
    if (!results) return;

    const data = results.questions.map((question, index) => ({
      question: question.question,
      answer: question.answer,
      source_title: question.source.title,
      source_url: question.source.url,
      source_domain: question.source.domain,
      related_questions: question.related_questions.join('; ')
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
      a.download = `people-also-ask-${keyword}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `people-also-ask-${keyword}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">People Also Ask</h1>
        <p className="text-muted-foreground">
          Extrahiere PAA-Fragen und Antworten aus den SERPs
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            People Also Ask Analyse
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
                <Label htmlFor="keyword">Keyword *</Label>
                <Input
                  id="keyword"
                  type="text"
                  placeholder="z.B. seo tools"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  required
                />
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="device">Gerät</Label>
                <select
                  id="device"
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="submit" 
                disabled={loading || !keyword.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analysiere PAA...
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    PAA analysieren
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">People Also Ask</h2>
              <p className="text-muted-foreground">
                {results.total_questions} Fragen für "{results.keyword}" in {results.location}
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
              title="Total Questions"
              value={results.total_questions}
              icon={HelpCircle}
              description="Gefundene PAA-Fragen"
            />
            <KeywordMetricsCard
              title="Organic Results"
              value={results.organic_results.length}
              icon={Search}
              description="Organische Ergebnisse"
            />
            <KeywordMetricsCard
              title="Questions with Answers"
              value={results.questions.filter(q => q.answer).length}
              icon={Globe}
              description="Fragen mit Antworten"
            />
            <KeywordMetricsCard
              title="Related Questions"
              value={results.questions.reduce((sum, q) => sum + q.related_questions.length, 0)}
              icon={HelpCircle}
              description="Verwandte Fragen"
            />
          </div>

          {/* PAA Questions */}
          <Card>
            <CardHeader>
              <CardTitle>People Also Ask Fragen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.questions.map((question, index) => (
                  <Collapsible
                    key={index}
                    open={openQuestions.has(index)}
                    onOpenChange={() => toggleQuestion(index)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          {openQuestions.has(index) ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                          <h3 className="font-medium text-left">{question.question}</h3>
                        </div>
                        <Badge variant="outline">
                          {question.related_questions.length} verwandte
                        </Badge>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <div className="space-y-4 mt-4">
                        {/* Answer */}
                        {question.answer && (
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Antwort:</h4>
                            <p className="text-sm text-muted-foreground">{question.answer}</p>
                          </div>
                        )}
                        
                        {/* Source */}
                        {question.source && (
                          <div className="flex items-center gap-2 p-3 border rounded">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <a 
                                href={question.source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium"
                              >
                                {question.source.title}
                              </a>
                              <p className="text-sm text-muted-foreground">{question.source.domain}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Related Questions */}
                        {question.related_questions && question.related_questions.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Verwandte Fragen:</h4>
                            <div className="space-y-2">
                              {question.related_questions.map((related, idx) => (
                                <div key={idx} className="p-2 bg-muted/30 rounded text-sm">
                                  {related}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Organic Results */}
          {results.organic_results && results.organic_results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Organische Ergebnisse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.organic_results.slice(0, 10).map((result, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <Badge variant="secondary" className="text-sm">
                          #{result.position}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            {result.title}
                          </a>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{result.domain}</p>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Suchinformationen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Suchzeit:</span>
                  <div className="font-medium">{new Date(results.search_time).toLocaleString('de-DE')}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Standort:</span>
                  <div className="font-medium">{results.location}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Sprache:</span>
                  <div className="font-medium">{results.language}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
