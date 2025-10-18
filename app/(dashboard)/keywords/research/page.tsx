'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Loader2,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Globe,
  Hash,
  Download
} from 'lucide-react';
import { ResearchTabs } from '@/components/keywords/research-tabs';
import { ResearchTable } from '@/components/keywords/research-table';
import { KeywordResearchResult } from '@/types/analysis';

interface ResearchHistory {
  keyword: string;
  source: string;
  location: string;
  language: string;
  timestamp: string;
  analysisId: string;
  results: KeywordResearchResult;
}

export default function ResearchPage() {
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState('related');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<KeywordResearchResult | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<ResearchHistory[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=keywords_research&limit=10');
        if (response.ok) {
          const data = await response.json();
          
          const historyData = data.analyses?.map((analysis: any) => ({
            keyword: analysis.input?.keyword || 'Unbekanntes Keyword',
            source: analysis.input?.source || 'related',
            location: analysis.input?.location || 'Deutschland',
            language: analysis.input?.language || 'Deutsch',
            timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
            analysisId: analysis.id,
            results: analysis.result || {}
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
      const response = await fetch('/api/keywords/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          source: activeTab,
          location,
          language,
          domain: activeTab === 'for-site' ? domain.trim() : undefined,
          limit
        }),
      });

      const data = await response.json();
      
      console.log('Research API Response:', data);

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
        source: activeTab,
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
      source: results.source,
      keyword: keyword.trim(),
      totalResults: results.totalResults,
      data: results.data,
      timestamp: new Date().toISOString()
    };

    if (format === 'csv') {
      const headers = ['Keyword', 'Search Volume', 'Competition', 'CPC', 'Trend'];
      const csvContent = [
        headers.join(','),
        ...results.data.map(item => [
          `"${item.keyword}"`,
          item.search_volume,
          item.competition,
          item.cpc,
          item.trend
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-research-${activeTab}-${keyword}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-research-${activeTab}-${keyword}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getCreditsForTab = (tabId: string) => {
    const creditsMap = {
      'related': 1,
      'suggestions': 1,
      'ideas': 1,
      'for-site': 5,
      'for-keywords': 2
    };
    return creditsMap[tabId as keyof typeof creditsMap] || 1;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keyword Research</h1>
        <p className="text-muted-foreground">
          Keyword-Ideen und Vorschläge für deine Content-Strategie
        </p>
      </div>

      {/* Research Tabs */}
      <ResearchTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        loading={loading}
      />

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
            <Search className="h-5 w-5" style={{ color: '#34A7AD' }} />
          </div>
          <h3 className="text-foreground">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analysis</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyword" className="text-foreground">Keyword *</Label>
              <Input
                id="keyword"
                type="text"
                placeholder="z.B. seo tools"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
              />
            </div>
            
            {activeTab === 'for-site' && (
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-foreground">Domain *</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="z.B. example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required={activeTab === 'for-site'}
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground">Standort</Label>
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
              <Label htmlFor="language" className="text-foreground">Sprache</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="limit" className="text-foreground">Anzahl Ergebnisse</Label>
              <Input
                id="limit"
                type="number"
                min="1"
                max="100"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading || !keyword.trim() || (activeTab === 'for-site' && !domain.trim())}
              className="flex-1 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analysiere...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analysieren ({getCreditsForTab(activeTab)} Credits)
                </>
              )}
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Ergebnisse</h2>
              <p className="text-muted-foreground">
                {results.totalResults} Keywords gefunden für "{keyword}"
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md text-xs border" style={{ backgroundColor: 'rgba(52,167,173,0.1)', borderColor: 'rgba(52,167,173,0.2)', color: '#34A7AD' }}>
                  📊 DataForSEO API
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs border" style={{ backgroundColor: 'rgba(52,167,173,0.1)', borderColor: 'rgba(52,167,173,0.2)', color: '#34A7AD' }}>
                  🔗 {results.apiEndpoint}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs border" style={{ backgroundColor: 'rgba(52,167,173,0.1)', borderColor: 'rgba(52,167,173,0.2)', color: '#34A7AD' }}>
                  💰 {results.creditsUsed} Credits
                </span>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <ResearchTable 
            data={results.data} 
            loading={loading}
            source={results.source}
            onExport={exportResults}
          />
        </div>
      )}

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
            <h3 className="text-foreground">Vorherige Recherchen</h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Lade Recherchehistorie...</span>
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
            <h3 className="text-foreground">Vorherige Recherchen</h3>
          </div>
            <div className="space-y-2">
              {searchHistory.map((search, index) => (
                <div key={index} className="border rounded-lg">
                  <div className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                       onClick={() => {
                         setKeyword(search.keyword);
                         setActiveTab(search.source);
                         setLocation(search.location);
                         setLanguage(search.language);
                         if (search.source === 'for-site') {
                           setDomain(search.keyword); // Use keyword as domain for for-site
                         }
                       }}>
                    <div className="flex items-center gap-3">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{search.keyword}</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{search.location}</span>
                          <span>•</span>
                          <span>{search.language}</span>
                          <span>•</span>
                          <span>{search.source}</span>
                          <span>•</span>
                          <span>{search.results.totalResults} Ergebnisse</span>
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
                          <h3 className="text-lg font-semibold">{search.source} für "{search.keyword}"</h3>
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
                        
                        {/* Show sample results from history */}
                        <ResearchTable 
                          data={search.results.data.slice(0, 5)} 
                          source={search.results.source}
                        />
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
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Keine Research-Analysen vorhanden</h3>
            <p className="text-muted-foreground mb-4">
              Führe deine erste Research-Analyse durch, um hier Ergebnisse zu sehen.
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
