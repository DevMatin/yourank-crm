# 🚀 YouRank CRM - API Integration Guide

## 📋 Übersicht

Dieses Dokument beschreibt die vollständige Architektur und Integration neuer APIs in das YouRank CRM System, basierend auf der Analyse der Google Ads Search Volume Implementierung.

## 🏗️ Frontend-Architektur

### Komponenten-Struktur
```
app/(dashboard)/keywords/[api-name]/
├── page.tsx (Hauptkomponente)
├── Interface Definitionen
├── State Management
├── API Integration
├── UI Components
└── Data Visualization
```

### Kern-Funktionalitäten
- ✅ **Keyword-Eingabe** (Textarea, ein Keyword pro Zeile)
- ✅ **Parameter-Konfiguration** (Location, Language, Date Range)
- ✅ **API-Aufruf** mit Loading States
- ✅ **Ergebnis-Darstellung** (Cards + Table View)
- ✅ **Suchhistorie** mit Expand/Collapse
- ✅ **CSV-Export** Funktionalität
- ✅ **Metriken-Übersicht** (Durchschnittswerte)
- ✅ **Error Handling** mit Alert-Komponenten

## 🔧 API-Integration Checkliste

### 1. Frontend-Seite erstellen

```typescript
// Struktur-Template für neue API-Seite
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Target,
  Download,
  History,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Table,
  Globe
} from 'lucide-react';
import { RelatedKeywordsTable } from '@/components/keywords/related-keywords-table';
import { KeywordMetricsCard } from '@/components/keywords/keyword-metrics-card';

interface [API_NAME]Keyword {
  keyword: string;
  // API-spezifische Felder
  search_volume?: number;
  competition?: string;
  cpc?: number;
  // ... weitere Felder
  keyword_info?: {
    se_type: string;
    last_updated_time: string;
    // ... weitere Metadaten
  };
}

export default function [API_NAME]Page() {
  // State Management
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('Germany');
  const [language, setLanguage] = useState('German');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  // ... weitere Parameter
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<[API_NAME]Keyword[]>([]);
  const [error, setError] = useState('');
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  
  // History Management
  const [searchHistory, setSearchHistory] = useState<Array<{
    keywords: string[];
    location: string;
    language: string;
    timestamp: string;
    resultsCount: number;
    results: [API_NAME]Keyword[];
    analysisId: string;
  }>>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=[api_type]&limit=10');
        if (response.ok) {
          const data = await response.json();
          const historyData = data.analyses?.map((analysis: any) => ({
            keywords: analysis.input?.keywords || analysis.parameters?.keywords || [],
            location: analysis.input?.location || analysis.parameters?.location || 'Deutschland',
            language: analysis.input?.language || analysis.parameters?.language || 'Deutsch',
            timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
            resultsCount: analysis.result?.length || 0,
            results: analysis.result || [],
            analysisId: analysis.id
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
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const keywordsArray = keywords.split('\n').filter(k => k.trim());
      
      const response = await fetch('/api/keywords/[api-endpoint]', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: keywordsArray,
          location,
          language,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
          // ... weitere API-spezifische Parameter
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Abrufen der Daten');
      }

      setResults(data.data || []);
      setAnalysisId(data.analysisId || null);
      
      // Refresh search history
      const historyResponse = await fetch('/api/analysis/history?type=[api_type]&limit=10');
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        const updatedHistory = historyData.analyses?.map((analysis: any) => ({
          keywords: analysis.input?.keywords || analysis.parameters?.keywords || [],
          location: analysis.input?.location || analysis.parameters?.location || 'Deutschland',
          language: analysis.input?.language || analysis.parameters?.language || 'Deutsch',
          timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
          resultsCount: analysis.result?.length || 0,
          results: analysis.result || [],
          analysisId: analysis.id
        })) || [];
        setSearchHistory(updatedHistory);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) return;
    
    const headers = ['Keyword', 'Search Volume', 'Competition', 'CPC'];
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        `"${result.keyword}"`,
        result.search_volume || 0,
        `"${result.competition || 'N/A'}"`,
        result.cpc || 0
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `[api-name]-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadHistoryResult = (historyItem: any) => {
    setResults(historyItem.results);
    setKeywords(historyItem.keywords.join('\n'));
    setLocation(historyItem.location);
    setLanguage(historyItem.language);
    setAnalysisId(historyItem.analysisId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-green-600" />
          <h1 className="text-3xl font-bold">[API Name]</h1>
        </div>
        {results.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            >
              {viewMode === 'cards' ? <Table className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {viewMode === 'cards' ? 'Tabellenansicht' : 'Kartenansicht'}
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV Export
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground">
        [API Beschreibung]
      </p>

      <Card>
        <CardHeader>
          <CardTitle>[API Name] Analyse</CardTitle>
          <CardDescription>
            [Detaillierte Beschreibung der API-Funktionalität]
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (ein Keyword pro Zeile)</Label>
              <textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="seo tools&#10;keyword research&#10;search volume"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Standort</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Germany"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Sprache</Label>
                <Input
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="German"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Von Datum (optional)</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">Bis Datum (optional)</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            {/* API-spezifische Parameter hier einfügen */}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Keywords...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Keywords analysieren
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search History */}
      {!loadingHistory && searchHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Suchhistorie</span>
            </CardTitle>
            <CardDescription>
              Deine letzten Keyword-Analysen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searchHistory.map((historyItem, index) => (
                <div key={historyItem.analysisId} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {historyItem.keywords.length} Keywords
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {historyItem.location}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {historyItem.language}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {historyItem.timestamp}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {historyItem.resultsCount} Ergebnisse gefunden
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadHistoryResult(historyItem)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Anzeigen
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedHistory(expandedHistory === index ? null : index)}
                      >
                        {expandedHistory === index ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {expandedHistory === index && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {historyItem.results.slice(0, 6).map((result, idx) => (
                          <div key={idx} className="text-xs bg-muted p-2 rounded">
                            <div className="font-medium">{result.keyword}</div>
                            <div className="text-muted-foreground">
                              Volumen: {result.search_volume?.toLocaleString() || 'N/A'} | 
                              CPC: ${result.cpc?.toFixed(2) || 'N/A'}
                            </div>
                          </div>
                        ))}
                        {historyItem.results.length > 6 && (
                          <div className="text-xs text-muted-foreground p-2">
                            +{historyItem.results.length - 6} weitere...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Keyword Ergebnisse ({results.length} gefunden)</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                <Globe className="h-4 w-4 mr-1" />
                {location}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {language}
              </Badge>
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KeywordMetricsCard
              title="Durchschnittliches Suchvolumen"
              value={Math.round(results.reduce((sum, r) => sum + (r.search_volume || 0), 0) / results.length).toLocaleString()}
              icon={Search}
            />
            <KeywordMetricsCard
              title="Durchschnittlicher CPC"
              value={`$${((results.reduce((sum, r) => sum + (r.cpc || 0), 0) / results.length)).toFixed(2)}`}
              icon={DollarSign}
            />
            <KeywordMetricsCard
              title="Durchschnittliche Competition"
              value={Math.round(results.reduce((sum, r) => sum + (r.competition_index || 0), 0) / results.length)}
              icon={Target}
            />
            <KeywordMetricsCard
              title="Keywords mit hohem Volumen"
              value={results.filter(r => (r.search_volume || 0) > 1000).length.toString()}
              icon={TrendingUp}
            />
          </div>
          
          {viewMode === 'cards' ? (
            <div className="grid gap-4">
              {results.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{result.keyword}</CardTitle>
                      <div className="flex space-x-2">
                        <Badge variant="secondary">
                          {result.search_volume?.toLocaleString()} Suchvolumen
                        </Badge>
                        <Badge variant="outline">
                          Competition: {result.competition || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Suchvolumen</div>
                        <div className="text-lg font-semibold">
                          {result.search_volume?.toLocaleString() || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Competition</div>
                        <div className="text-lg font-semibold">
                          {result.competition || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">CPC</div>
                        <div className="text-lg font-semibold">
                          {result.cpc ? `$${result.cpc.toFixed(2)}` : 'N/A'}
                        </div>
                      </div>
                      {/* Weitere API-spezifische Felder hier */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <RelatedKeywordsTable 
              data={results.map(result => ({
                keyword: result.keyword,
                search_volume: result.search_volume || 0,
                competition: result.competition_index || 0,
                cpc: result.cpc || 0,
                trend: 0,
                related_keywords: []
              }))}
            />
          )}
        </div>
      )}
    </div>
  );
}
```

### 2. Backend API Route erstellen

```typescript
// /app/api/keywords/[api-name]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataForSeoClient } from '@/lib/dataforseo/client';
import { checkUserCredits, deductCredits, saveAnalysis, updateAnalysis } from '@/lib/utils/analysis';
import { logger } from '@/lib/logger';
import { [DataForSEORequestClass] } from 'dataforseo-client';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      keywords, 
      location = 'Germany', 
      language = 'German', 
      date_from, 
      date_to,
      // ... weitere API-spezifische Parameter
    } = body;

    // Validate input
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'Keywords array is required' },
        { status: 400 }
      );
    }

    // API-spezifische Validierung hier

    // Check credits
    const requiredCredits = keywords.length * [CREDITS_PER_KEYWORD];
    await checkUserCredits(user.id, requiredCredits);

    // Save analysis record
    const analysisRecord = await saveAnalysis(
      { keywords, location, language, date_from, date_to },
      '[api_type]',
      user.id,
      undefined,
      requiredCredits
    );

    try {
      // Create DataForSEO request
      const request = new [DataForSEORequestClass]();
      request.keywords = keywords.map(k => k.trim());
      request.location_name = location;
      request.language_name = language;
      // ... weitere Parameter setzen
      if (date_from) request.date_from = date_from;
      if (date_to) request.date_to = date_to;

      logger.info('Sending [API Name] request to DataForSEO:', {
        keywords: request.keywords,
        location,
        language,
        // ... weitere Parameter
      });

      // Call DataForSEO API with retry logic
      let result;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          result = await dataForSeoClient.[apiMethod]([request]);
          break; // Success, exit retry loop
        } catch (retryError) {
          retryCount++;
          logger.warn(`DataForSEO API attempt ${retryCount} failed:`, retryError);
          if (retryCount >= maxRetries) {
            throw retryError; // Re-throw the last error
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      logger.info('DataForSEO API Response:', JSON.stringify(result, null, 2));

      // Check if we have valid results
      if (!result?.tasks?.[0]?.result?.[0]?.items || result.tasks[0].result[0].items.length === 0) {
        logger.info('No [API Name] data found in DataForSEO response');
        await updateAnalysis(analysisRecord.id, {
          status: 'completed',
          result: []
        });
        
        return NextResponse.json({
          success: true,
          data: [],
          analysisId: analysisRecord.id,
          creditsUsed: 0,
          message: 'No [API Name] data found for these keywords',
          source: 'DataForSEO API'
        });
      }
      
      // Verify DataForSEO data structure
      const taskResult = result.tasks[0].result[0];
      if (!taskResult || !taskResult.items || taskResult.items.length === 0) {
        throw new Error('Invalid DataForSEO data structure - no items found');
      }
      
      logger.info('✅ DataForSEO data verified - contains valid [API Name] structure');

      // Process results
      const processedResults = result.tasks[0].result[0].items.map((item: any) => {
        logger.info('Processing [API Name] item:', JSON.stringify(item, null, 2));
        
        return {
          keyword: item.keyword || 'Unknown',
          // API-spezifische Felder verarbeiten
          search_volume: item.search_volume || 0,
          competition: item.competition || 'UNKNOWN',
          cpc: item.cpc || 0,
          // ... weitere Felder
          keyword_info: {
            se_type: item.se_type || '[api_type]',
            last_updated_time: item.last_updated_time || new Date().toISOString(),
            // ... weitere Metadaten
          }
        };
      });

      // Debug logging
      logger.info('Processed [API Name] Results:', JSON.stringify(processedResults, null, 2));
      logger.info('Results count:', processedResults.length);

      // Update analysis with results
      await updateAnalysis(analysisRecord.id, {
        status: 'completed',
        result: processedResults
      });

      // Deduct credits
      await deductCredits(user.id, requiredCredits);

      return NextResponse.json({
        success: true,
        data: processedResults,
        analysisId: analysisRecord.id,
        creditsUsed: requiredCredits,
        source: 'DataForSEO API',
        apiEndpoint: '[apiMethod]',
        timestamp: new Date().toISOString(),
        dataForSeoTaskId: result.tasks[0].id
      });

    } catch (apiError) {
      logger.error('DataForSEO [API Name] API Error:', apiError);
      
      // Update analysis with error
      await updateAnalysis(analysisRecord.id, {
        status: 'failed',
        result: { error: 'API call failed' }
      });

      // Enhanced error handling
      let errorMessage = 'Fehler beim Abrufen der [API Name] Daten. Bitte versuche es erneut.';
      
      if (apiError instanceof Error) {
        if (apiError.message.includes('ECONNRESET') || 
            apiError.message.includes('aborted') || 
            apiError.message.includes('network')) {
          errorMessage = 'Verbindungsfehler zur DataForSEO API. Bitte versuche es in ein paar Sekunden erneut.';
        } else if (apiError.message.includes('Invalid DataForSEO data structure')) {
          errorMessage = 'Ungültige Datenstruktur von DataForSEO. Bitte kontaktiere den Support.';
        } else {
          errorMessage = `API-Fehler: ${apiError.message}`;
        }
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          success: false 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.error('[API Name] API Error:', error);
    
    if (error instanceof Error && error.message.includes('Insufficient credits')) {
      return NextResponse.json(
        { error: error.message },
        { status: 402 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
}
```

## 📊 Parameter-Konfiguration

### Standard-Parameter (alle APIs)
```typescript
- keywords: string[] (required)
- location: string (default: 'Germany')
- language: string (default: 'German')
- date_from: string (optional)
- date_to: string (optional)
```

### API-spezifische Parameter

#### Google Ads Search Volume
```typescript
- search_partners: boolean (default: false)
- include_adult_keywords: boolean (default: false)
- sort_by: string (default: 'relevance')
```

#### Bing Search Volume
```typescript
- device: string (default: 'all')
- search_partners: boolean (default: false)
- sort_by: string (default: 'relevance')
```

#### Google Trends Explore
```typescript
- type: string (default: 'web')
- category_code: number (default: 0)
- time_range: string (optional)
- item_types: string[] (optional)
```

#### Site APIs (Google Ads/Bing Keywords for Site)
```typescript
- target: string (required - URL/Domain)
- target_type: string (default: 'page')
- keywords_negative: string[] (default: [])
- limit: number (default: 100)
```

## 🛡️ Validierung

### Parameter-Limits
- **Google Trends:** Max 5 Keywords, max 1 für topics/queries
- **Bing/Google Ads:** Max 1000 Keywords
- **Clickstream:** Max 1000 Keywords, min 3 Zeichen
- **Google Ads:** Max 80 Zeichen, max 10 Wörter pro Keyword
- **Bing:** Max 100 Zeichen pro Keyword

### URL/Domain-Validierung
```typescript
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidDomain = (domain: string) => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
};
```

## 🎯 Integration-Checkliste

### Backend (API Route)
- [ ] Route-Datei erstellen: `/app/api/keywords/[api-name]/route.ts`
- [ ] Parameter-Validierung implementieren
- [ ] DataForSEO Client-Integration
- [ ] Error Handling mit Retry-Logic
- [ ] Credits-System Integration
- [ ] Analysis-Record Speicherung

### Frontend (Page)
- [ ] Page-Datei erstellen: `/app/(dashboard)/keywords/[api-name]/page.tsx`
- [ ] Interface für API-spezifische Daten definieren
- [ ] State Management implementieren
- [ ] Form-Handling mit Validierung
- [ ] API-Integration mit Error Handling
- [ ] Ergebnis-Darstellung (Cards + Table)
- [ ] History Management
- [ ] Export-Funktionalität
- [ ] Loading States & UI-Feedback

### Konfiguration
- [ ] `config/modules.config.ts` aktualisieren
- [ ] Tool-Definition mit Credits und Endpoint
- [ ] Status auf 'active' setzen

### Testing
- [ ] TypeScript-Kompilierung prüfen
- [ ] Linter-Fehler beheben
- [ ] API-Endpoint testen
- [ ] Frontend-Funktionalität testen
- [ ] Error-Scenarios testen

## 🚀 Empfohlene Reihenfolge

1. **Backend API Route** erstellen und testen
2. **Frontend Page** basierend auf Template erstellen
3. **API-spezifische Parameter** hinzufügen
4. **Datenstruktur** anpassen
5. **UI-Komponenten** für spezielle Felder erweitern
6. **Konfiguration** aktualisieren
7. **Testing** und Validierung
8. **Dokumentation** aktualisieren

## 📝 Bestehende APIs (100% funktionsfähig)

1. **related** - Related Keywords ✅
2. **suggestions** - Keyword Suggestions ✅
3. **ideas** - Keyword Ideas ✅
4. **difficulty** - Keyword Difficulty ✅
5. **overview** - Keyword Overview ✅
6. **google-ads-search-volume** - Google Ads Search Volume ✅
7. **google-trends-explore** - Google Trends Explore ✅
8. **bing-search-volume** - Bing Search Volume ✅
9. **google-ads-keywords-for-site** - Google Ads Keywords for Site ✅
10. **bing-keywords-for-site** - Bing Keywords for Site ✅
11. **clickstream-global-search-volume** - Clickstream Global Search Volume ✅

## 🔧 Wichtige Integration-Punkte

### History Management
```typescript
// Suchhistorie laden
useEffect(() => {
  const loadSearchHistory = async () => {
    const response = await fetch(`/api/analysis/history?type=[api_type]&limit=10`);
    // ... History Processing
  };
  loadSearchHistory();
}, []);

// History nach API-Call aktualisieren
const historyResponse = await fetch(`/api/analysis/history?type=[api_type]&limit=10`);
```

### Error Handling
```typescript
// API-spezifische Error Messages
if (!response.ok) {
  throw new Error(data.error || 'Fehler beim Abrufen der Daten');
}

// Frontend Error Display
{error && (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

### Loading States
```typescript
// Button Loading State
<Button type="submit" disabled={loading} className="w-full">
  {loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Analysiere Keywords...
    </>
  ) : (
    <>
      <Search className="mr-2 h-4 w-4" />
      Keywords analysieren
    </>
  )}
</Button>
```

### Export-Funktionalität
```typescript
const exportToCSV = () => {
  if (results.length === 0) return;
  
  const headers = ['Keyword', 'Search Volume', 'Competition', 'CPC'];
  const csvContent = [
    headers.join(','),
    ...results.map(result => [
      `"${result.keyword}"`,
      result.search_volume || 0,
      `"${result.competition || 'N/A'}"`,
      result.cpc || 0
    ].join(','))
  ].join('\n');
  
  // ... CSV Download Logic
};
```

Diese Struktur gewährleistet eine konsistente und skalierbare Integration neuer APIs in das bestehende YouRank CRM System!
