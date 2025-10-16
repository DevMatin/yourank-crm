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
  TrendingUp, 
  Globe, 
  Download,
  Loader2,
  Hash,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';

interface KeywordDifficulty {
  keyword: string;
  difficulty: number;
  search_volume: number;
  competition: number;
  cpc: number;
  trend: number;
  difficulty_info: {
    se_type: string;
    last_updated_time: string;
    competition_level: number;
    cpc: number;
    search_volume: number;
    monthly_searches: Array<{
      year: number;
      month: number;
      search_volume: number;
    }>;
  };
}

export default function KeywordDifficultyPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<KeywordDifficulty[]>([]);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/keywords/difficulty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          location,
          language
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler bei der Analyse');
      }

      setResults(data.data || []);
      setAnalysisId(data.analysisId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyLevel = (difficulty: number) => {
    if (difficulty < 20) return { level: 'Sehr einfach', color: 'bg-green-500', icon: CheckCircle };
    if (difficulty < 40) return { level: 'Einfach', color: 'bg-green-400', icon: CheckCircle };
    if (difficulty < 60) return { level: 'Mittel', color: 'bg-yellow-500', icon: Target };
    if (difficulty < 80) return { level: 'Schwer', color: 'bg-orange-500', icon: AlertTriangle };
    return { level: 'Sehr schwer', color: 'bg-red-500', icon: AlertTriangle };
  };

  const getDifficultyAdvice = (difficulty: number, searchVolume: number) => {
    if (difficulty < 20) {
      return 'Perfekt für den Einstieg! Diese Keywords sind leicht zu ranken und bieten gute Chancen.';
    } else if (difficulty < 40) {
      return 'Gute Balance zwischen Schwierigkeit und Potenzial. Mit der richtigen Strategie erreichbar.';
    } else if (difficulty < 60) {
      return 'Mittlere Schwierigkeit. Erfordert qualitativ hochwertigen Content und eine solide SEO-Strategie.';
    } else if (difficulty < 80) {
      return 'Schwierig zu ranken. Benötigt starke Domain-Autorität und umfassende SEO-Maßnahmen.';
    } else {
      return 'Sehr schwierig. Nur für etablierte Websites mit hoher Autorität empfehlenswert.';
    }
  };

  const exportResults = (format: 'csv' | 'json') => {
    if (results.length === 0) return;

    const data = results.map(item => ({
      keyword: item.keyword,
      difficulty: item.difficulty,
      search_volume: item.search_volume,
      competition: item.competition,
      cpc: item.cpc,
      trend: item.trend,
      difficulty_level: getDifficultyLevel(item.difficulty).level
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
      a.download = `keyword-difficulty-${keyword}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-difficulty-${keyword}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keyword Difficulty</h1>
        <p className="text-muted-foreground">
          Bewerte die Schwierigkeit von Keywords für deine Domain
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Keyword-Schwierigkeit analysieren
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
                disabled={loading || !keyword.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analysiere Schwierigkeit...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Schwierigkeit bewerten
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Schwierigkeits-Analyse</h2>
              <p className="text-muted-foreground">
                Schwierigkeitsbewertung für "{keyword}"
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

          {/* Difficulty Overview */}
          {results.map((item, index) => {
            const difficultyInfo = getDifficultyLevel(item.difficulty);
            const Icon = difficultyInfo.icon;
            
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Hash className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{item.keyword}</CardTitle>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${difficultyInfo.color} text-white`}
                    >
                      {difficultyInfo.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Difficulty Score */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Schwierigkeits-Score</span>
                      <span className="text-2xl font-bold">{item.difficulty}/100</span>
                    </div>
                    <Progress value={item.difficulty} className="h-3" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      <span>{getDifficultyAdvice(item.difficulty, item.search_volume)}</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <KeywordMetricsCard
                      title="Suchvolumen"
                      value={item.search_volume.toLocaleString()}
                      icon={TrendingUp}
                      description="Monatliche Suchanfragen"
                    />
                    <KeywordMetricsCard
                      title="Konkurrenz"
                      value={`${Math.round(item.competition * 100)}%`}
                      icon={Target}
                      description="Wettbewerbsintensität"
                    />
                    <KeywordMetricsCard
                      title="CPC"
                      value={`$${item.cpc.toFixed(2)}`}
                      icon={Globe}
                      description="Kosten pro Klick"
                    />
                    <KeywordMetricsCard
                      title="Trend"
                      value={`${item.trend > 0 ? '+' : ''}${item.trend.toFixed(1)}%`}
                      icon={TrendingUp}
                      description="Suchvolumen-Trend"
                    />
                  </div>

                  {/* Monthly Search Data */}
                  {item.difficulty_info?.monthly_searches && item.difficulty_info.monthly_searches.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Monatliche Suchdaten</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {item.difficulty_info.monthly_searches.slice(-12).map((month, idx) => (
                          <div key={idx} className="text-center p-2 border rounded">
                            <div className="text-xs text-muted-foreground">
                              {month.month}/{month.year}
                            </div>
                            <div className="font-medium">
                              {month.search_volume.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
