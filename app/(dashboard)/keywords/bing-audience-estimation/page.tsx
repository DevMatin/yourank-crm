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
  Users, 
  TrendingUp,
  DollarSign,
  Eye,
  Download,
  History,
  Clock,
  ChevronDown,
  ChevronUp,
  Globe,
  Target
} from 'lucide-react';

interface BingAudienceEstimationResult {
  estimated_audience_size: number;
  estimated_clicks: number;
  estimated_impressions: number;
  estimated_spend: number;
  cost_per_click: number;
  audience_data: {
    age: string[];
    gender: string[];
    industry: string[];
    job_function: string[];
    location: string;
    bid: number;
    daily_budget: number;
  };
  api_info: {
    se_type: string;
    last_updated_time: string;
  };
}

export default function BingAudienceEstimationPage() {
  const [location, setLocation] = useState('Germany');
  const [age, setAge] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [industry, setIndustry] = useState<string[]>([]);
  const [jobFunction, setJobFunction] = useState<string[]>([]);
  const [bid, setBid] = useState('10');
  const [dailyBudget, setDailyBudget] = useState('100');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BingAudienceEstimationResult | null>(null);
  const [error, setError] = useState('');
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<Array<{
    location: string;
    age: string[];
    gender: string[];
    industry: string[];
    jobFunction: string[];
    bid: number;
    dailyBudget: number;
    timestamp: string;
    result: BingAudienceEstimationResult;
    analysisId: string;
  }>>([]);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load search history on component mount
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const response = await fetch('/api/analysis/history?type=bing_audience_estimation&limit=10');
        if (response.ok) {
          const data = await response.json();
          const historyData = data.analyses?.map((analysis: any) => ({
            location: analysis.input?.location || analysis.parameters?.location || 'Deutschland',
            age: analysis.input?.age || analysis.parameters?.age || [],
            gender: analysis.input?.gender || analysis.parameters?.gender || [],
            industry: analysis.input?.industry || analysis.parameters?.industry || [],
            jobFunction: analysis.input?.job_function || analysis.parameters?.job_function || [],
            bid: analysis.input?.bid || analysis.parameters?.bid || 0,
            dailyBudget: analysis.input?.daily_budget || analysis.parameters?.daily_budget || 0,
            timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
            result: analysis.result || {},
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
    setResult(null);

    try {
      const response = await fetch('/api/keywords/bing-audience-estimation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          age,
          gender,
          industry,
          job_function: jobFunction,
          bid: parseFloat(bid),
          daily_budget: parseFloat(dailyBudget),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Abrufen der Daten');
      }

      setResult(data.data || null);
      setAnalysisId(data.analysisId || null);
      
      // Refresh search history
      const historyResponse = await fetch('/api/analysis/history?type=bing_audience_estimation&limit=10');
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        const updatedHistory = historyData.analyses?.map((analysis: any) => ({
          location: analysis.input?.location || analysis.parameters?.location || 'Deutschland',
          age: analysis.input?.age || analysis.parameters?.age || [],
          gender: analysis.input?.gender || analysis.parameters?.gender || [],
          industry: analysis.input?.industry || analysis.parameters?.industry || [],
          jobFunction: analysis.input?.job_function || analysis.parameters?.job_function || [],
          bid: analysis.input?.bid || analysis.parameters?.bid || 0,
          dailyBudget: analysis.input?.daily_budget || analysis.parameters?.daily_budget || 0,
          timestamp: new Date(analysis.created_at).toLocaleString('de-DE'),
          result: analysis.result || {},
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
    if (!result) return;
    
    const headers = ['Metric', 'Value'];
    const csvContent = [
      headers.join(','),
      `"Estimated Audience Size","${result.estimated_audience_size}"`,
      `"Estimated Clicks","${result.estimated_clicks}"`,
      `"Estimated Impressions","${result.estimated_impressions}"`,
      `"Estimated Spend","${result.estimated_spend}"`,
      `"Cost Per Click","${result.cost_per_click}"`
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bing-audience-estimation-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadHistoryResult = (historyItem: any) => {
    setResult(historyItem.result);
    setLocation(historyItem.location);
    setAge(historyItem.age);
    setGender(historyItem.gender);
    setIndustry(historyItem.industry);
    setJobFunction(historyItem.jobFunction);
    setBid(historyItem.bid.toString());
    setDailyBudget(historyItem.dailyBudget.toString());
    setAnalysisId(historyItem.analysisId);
  };

  const toggleArrayValue = (arr: string[], value: string, setter: (val: string[]) => void) => {
    if (arr.includes(value)) {
      setter(arr.filter(v => v !== value));
    } else {
      setter([...arr, value]);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-red-600" />
          <h1 className="text-3xl font-bold">Bing Audience Estimation</h1>
        </div>
        {result && (
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV Export
          </Button>
        )}
      </div>
      
      <p className="text-muted-foreground">
        Schätze LinkedIn Ads Targeting mit demografischen und beruflichen Filtern. 5 Credits pro Anfrage.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Ads Audience Targeting Analyse</CardTitle>
          <CardDescription>
            Erhalte Audience-Schätzungen basierend auf demografischen und beruflichen Targeting-Kriterien für LinkedIn Ads via Bing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Standort (erforderlich)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Germany"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bid">Gebot (Bid) in $ (erforderlich, max 1000)</Label>
                <Input
                  id="bid"
                  type="number"
                  min="0.01"
                  max="1000"
                  step="0.01"
                  value={bid}
                  onChange={(e) => setBid(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyBudget">Tagesbudget in $ (erforderlich, max 10000)</Label>
                <Input
                  id="dailyBudget"
                  type="number"
                  min="1"
                  max="10000"
                  step="1"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Altersgruppen (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {['18-24', '25-34', '35-44', '45-54', '55+'].map((ageGroup) => (
                  <Badge
                    key={ageGroup}
                    variant={age.includes(ageGroup) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayValue(age, ageGroup, setAge)}
                  >
                    {ageGroup}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Geschlecht (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {['male', 'female'].map((g) => (
                  <Badge
                    key={g}
                    variant={gender.includes(g) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayValue(gender, g, setGender)}
                  >
                    {g === 'male' ? 'Männlich' : 'Weiblich'}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Industrie (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Manufacturing'].map((ind) => (
                  <Badge
                    key={ind}
                    variant={industry.includes(ind) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayValue(industry, ind, setIndustry)}
                  >
                    {ind}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Berufsfunktion (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {['Engineering', 'Sales', 'Marketing', 'Operations', 'Human Resources', 'Finance'].map((job) => (
                  <Badge
                    key={job}
                    variant={jobFunction.includes(job) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayValue(jobFunction, job, setJobFunction)}
                  >
                    {job}
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Berechne Audience...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Audience schätzen
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
      {loadingHistory ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Suchhistorie</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Lade Suchhistorie...</span>
            </div>
          </CardContent>
        </Card>
      ) : searchHistory.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Suchhistorie</span>
            </CardTitle>
            <CardDescription>
              Deine letzten Audience-Schätzungen
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
                          ${historyItem.bid} Bid
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          ${historyItem.dailyBudget} Budget
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {historyItem.location}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {historyItem.timestamp}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Audience: {historyItem.result?.estimated_audience_size?.toLocaleString() || 'N/A'}
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        <div className="bg-muted p-2 rounded">
                          <div className="font-medium">Clicks</div>
                          <div>{historyItem.result?.estimated_clicks?.toLocaleString() || 'N/A'}</div>
                        </div>
                        <div className="bg-muted p-2 rounded">
                          <div className="font-medium">Impressions</div>
                          <div>{historyItem.result?.estimated_impressions?.toLocaleString() || 'N/A'}</div>
                        </div>
                        <div className="bg-muted p-2 rounded">
                          <div className="font-medium">Spend</div>
                          <div>${historyItem.result?.estimated_spend?.toFixed(2) || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Suchhistorie</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Noch keine vorherigen Suchen vorhanden.</p>
              <p className="text-sm">Führe deine erste Audience-Analyse durch, um hier Ergebnisse zu sehen.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Audience Schätzung</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                <Globe className="h-4 w-4 mr-1" />
                {location}
              </Badge>
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-600" />
                  Geschätzte Audience-Größe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {result.estimated_audience_size?.toLocaleString() || 'N/A'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  Geschätzte Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {result.estimated_clicks?.toLocaleString() || 'N/A'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-purple-600" />
                  Geschätzte Impressions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {result.estimated_impressions?.toLocaleString() || 'N/A'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-yellow-600" />
                  Geschätzter Spend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${result.estimated_spend?.toFixed(2) || 'N/A'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-orange-600" />
                  Cost Per Click
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${result.cost_per_click?.toFixed(2) || 'N/A'}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Targeting-Kriterien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-muted-foreground">Altersgruppen</div>
                  <div className="mt-1">
                    {result.audience_data?.age?.length > 0 
                      ? result.audience_data.age.join(', ') 
                      : 'Keine Einschränkung'}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Geschlecht</div>
                  <div className="mt-1">
                    {result.audience_data?.gender?.length > 0 
                      ? result.audience_data.gender.join(', ') 
                      : 'Keine Einschränkung'}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Industrien</div>
                  <div className="mt-1">
                    {result.audience_data?.industry?.length > 0 
                      ? result.audience_data.industry.join(', ') 
                      : 'Keine Einschränkung'}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Berufsfunktionen</div>
                  <div className="mt-1">
                    {result.audience_data?.job_function?.length > 0 
                      ? result.audience_data.job_function.join(', ') 
                      : 'Keine Einschränkung'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
