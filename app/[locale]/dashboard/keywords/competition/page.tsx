'use client';

import { useState, useEffect } from 'react';
import { useKeywordsPageTranslations } from '@/lib/hooks/use-keywords-translations';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  Search, 
  Download,
  Loader2,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Globe,
  TrendingUp
} from 'lucide-react';
import { DifficultyScoreCard } from '@/components/keywords/difficulty-score-card';
import { CompetitorsTable } from '@/components/keywords/competitors-table';
import { KeywordCompetitionResult } from '@/types/analysis';

interface CompetitionHistory {
  keyword: string;
  location: string;
  language: string;
  timestamp: string;
  analysisId: string;
  results: KeywordCompetitionResult;
}

export default function CompetitionPage() {
  const { t, tCommon, pageTitle, searchPlaceholder, analyzeButton, locationLabel, languageLabel, loadingText, creditsText, resultsText } = useKeywordsPageTranslations('competition');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<KeywordCompetitionResult | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<CompetitionHistory[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=keywords_competition&limit=10');
        if (response.ok) {
          const data = await response.json();
          
          const historyData = data.analyses?.map((analysis: any) => ({
            keyword: analysis.input?.keyword || 'Unbekanntes Keyword',
            location: analysis.input?.location || 'Deutschland',
            language: analysis.input?.language || 'Deutsch',
            timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
            analysisId: analysis.id,
            results: analysis.result?.competition || {}
          })) || [];
          
          setSearchHistory(historyData);
        }
      } catch (error) {
        console.error('Failed to load search history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadSearchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/keywords/competition', {
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
      
      console.log('Competition API Response:', data);

      if (!response.ok) {
        const errorMessage = data.isConnectionError 
          ? 'Verbindungsfehler zur DataForSEO API. Bitte versuche es in ein paar Sekunden erneut.'
          : data.error || 'Fehler bei der Analyse';
        throw new Error(errorMessage);
      }

      setResults(data.data);
      setAnalysisId(data.analysisId);
      
      // Add to search history
      const newSearchEntry = {
        keyword: keyword.trim(),
        location,
        language,
        timestamp: new Date().toLocaleString('de-DE'),
        analysisId: data.analysisId || '',
        results: data.data || {}
      };
      
      setSearchHistory(prev => [newSearchEntry, ...prev.slice(0, 9)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const exportResults = (format: 'csv' | 'json') => {
    if (!results) return;

    const exportData = {
      keyword: results.keyword,
      difficulty: results.difficulty?.tasks?.[0]?.result?.[0]?.items?.[0]?.keyword_difficulty || 0,
      competitors: results.competitors,
      totalCompetitors: results.totalCompetitors,
      averageDifficulty: results.averageDifficulty,
      timestamp: new Date().toISOString()
    };

    if (format === 'csv') {
      const csvContent = [
        'Domain,Authority,Position,Traffic,Visibility,Keywords',
        ...results.competitors.map(comp => [
          `"${comp.domain}"`,
          comp.domain_authority,
          comp.organic_position,
          comp.traffic_estimate,
          comp.visibility,
          comp.keywords_count
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-competition-${keyword}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-competition-${keyword}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getDifficultyFromResults = () => {
    if (!results?.difficulty) return 0;
    return results.difficulty.tasks?.[0]?.result?.[0]?.items?.[0]?.keyword_difficulty || 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Form */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
              boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
            }}
          >
            <Target className="h-5 w-5" style={{ color: '#34A7AD' }} />
          </div>
          <h3 className="text-foreground">{pageTitle}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyword" className="text-foreground">Keyword *</Label>
              <Input
                id="keyword"
                type="text"
                placeholder={searchPlaceholder}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground">{locationLabel}</Label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex h-10 w-full rounded-xl border px-3 py-2 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'var(--glass-card-border)'
                }}
              >
                <option value="Germany">Deutschland</option>
                <option value="United States">USA</option>
                <option value="United Kingdom">Großbritannien</option>
                <option value="France">Frankreich</option>
                <option value="Spain">Spanien</option>
                <option value="Italy">Italien</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language" className="text-foreground">{languageLabel}</Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="flex h-10 w-full rounded-xl border px-3 py-2 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'var(--glass-card-border)'
                }}
              >
                <option value="German">Deutsch</option>
                <option value="English">Englisch</option>
                <option value="French">Französisch</option>
                <option value="Spanish">Spanisch</option>
                <option value="Italian">Italienisch</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading || !keyword.trim()}
              className="flex-1 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {loadingText}
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  {analyzeButton} (2 {creditsText})
                </>
              )}
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Results */}
      {loading ? (
        <div className="space-y-6">
          <DifficultyScoreCard difficulty={0} keyword={keyword} loading={true} />
          <CompetitorsTable data={[]} loading={true} />
        </div>
      ) : results ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{resultsText}</h2>
              <p className="text-muted-foreground">
                {t('analysis')} für "{results.keyword}"
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md text-xs border" style={{ backgroundColor: 'rgba(52,167,173,0.1)', borderColor: 'rgba(52,167,173,0.2)', color: '#34A7AD' }}>
                  📊 DataForSEO API
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs border" style={{ backgroundColor: 'rgba(52,167,173,0.1)', borderColor: 'rgba(52,167,173,0.2)', color: '#34A7AD' }}>
                  🎯 Competition Bundle
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs border" style={{ backgroundColor: 'rgba(52,167,173,0.1)', borderColor: 'rgba(52,167,173,0.2)', color: '#34A7AD' }}>
                  💰 2 Credits
                </span>
              </div>
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

          {/* Difficulty Score */}
          <DifficultyScoreCard 
            difficulty={getDifficultyFromResults()} 
            keyword={results.keyword} 
          />

          {/* Competitors Table */}
          <CompetitorsTable 
            data={results.competitors} 
            onExport={exportResults}
          />
        </div>
      ) : null}

      {/* Search History */}
      {loadingHistory ? (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
                boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
              }}
            >
              <History className="h-5 w-5" style={{ color: '#34A7AD' }} />
            </div>
            <h3 className="text-foreground">Vorherige Analysen</h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Lade Analysehistorie...</span>
          </div>
        </GlassCard>
      ) : searchHistory.length > 0 ? (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
                boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
              }}
            >
              <History className="h-5 w-5" style={{ color: '#34A7AD' }} />
            </div>
            <h3 className="text-foreground">Vorherige Analysen</h3>
          </div>
            <div className="space-y-2">
              {searchHistory.map((search, index) => (
                <div key={index} className="border rounded-lg">
                  <div className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                       onClick={() => {
                         setKeyword(search.keyword);
                         setLocation(search.location);
                         setLanguage(search.language);
                       }}>
                    <div className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{search.keyword}</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{search.location}</span>
                          <span>•</span>
                          <span>{search.language}</span>
                          <span>•</span>
                          <span>Competition Analyse</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {search.timestamp}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedHistory(expandedHistory === index ? null : index);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {expandedHistory === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  {expandedHistory === index && (
                    <div className="border-t p-4 bg-muted/20">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Competition für "{search.keyword}"</h3>
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
                        
                        {/* Show basic metrics from history */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {Math.round(search.results.difficulty?.tasks?.[0]?.result?.[0]?.items?.[0]?.keyword_difficulty || 0)}
                            </div>
                            <div className="text-sm text-muted-foreground">Difficulty Score</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {search.results.totalCompetitors || 0}
                            </div>
                            <div className="text-sm text-muted-foreground">Competitors</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {Math.round(search.results.averageDifficulty || 0)}
                            </div>
                            <div className="text-sm text-muted-foreground">Avg. Authority</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-6">
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Keine Competition-Analysen vorhanden</h3>
            <p className="text-muted-foreground mb-4">
              Führe deine erste Competition-Analyse durch, um hier Ergebnisse zu sehen.
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
