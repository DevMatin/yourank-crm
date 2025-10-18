'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, Search, Globe, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface KeywordGapResult {
  keyword: string;
  search_volume: number;
  competition: number;
  cpc: number;
  difficulty: number;
  gap_score: number;
}

export default function KeywordGapPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<KeywordGapResult[]>([]);
  const [formData, setFormData] = useState({
    target_domain: '',
    competitor_domains: '',
    location_code: '2840',
    language_code: 'de',
    limit: 100
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/labs/keyword-gap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Keyword Gap Analyse');
      }

      const data = await response.json();
      setResults(data.results || []);
      
      toast.success(`${data.results?.length || 0} Keyword-Lücken gefunden!`);
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
      ['Keyword', 'Search Volume', 'Competition', 'CPC', 'Difficulty', 'Gap Score'],
      ...results.map(result => [
        result.keyword,
        result.search_volume,
        result.competition,
        result.cpc,
        result.difficulty,
        result.gap_score
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-gap-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keyword Gap Analysis</h1>
        <p className="text-muted-foreground">
          Finde Keywords, für die Konkurrenten ranken, aber du nicht
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_domain">Deine Domain</Label>
                <Input
                  id="target_domain"
                  placeholder="example.com"
                  value={formData.target_domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_domain: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="competitor_domains">Konkurrenten-Domains</Label>
                <Input
                  id="competitor_domains"
                  placeholder="competitor1.com, competitor2.com"
                  value={formData.competitor_domains}
                  onChange={(e) => setFormData(prev => ({ ...prev, competitor_domains: e.target.value }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Mehrere Domains durch Komma getrennt
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location_code">Standort</Label>
                <Select 
                  value={formData.location_code} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, location_code: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2840">Deutschland</SelectItem>
                    <SelectItem value="2826">Österreich</SelectItem>
                    <SelectItem value="276">Schweiz</SelectItem>
                    <SelectItem value="840">USA</SelectItem>
                    <SelectItem value="826">UK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language_code">Sprache</Label>
                <Select 
                  value={formData.language_code} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language_code: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">Englisch</SelectItem>
                    <SelectItem value="fr">Französisch</SelectItem>
                    <SelectItem value="es">Spanisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit">Anzahl Keywords</Label>
                <Select 
                  value={formData.limit.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, limit: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Keyword-Lücken...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Keyword Gap Analyse starten
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
                <TrendingUp className="h-5 w-5" />
                Keyword-Lücken ({results.length})
              </CardTitle>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                CSV Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{result.keyword}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {result.search_volume.toLocaleString()} Volumen
                      </span>
                      <Badge variant="secondary">
                        {result.competition}% Competition
                      </Badge>
                      <span>€{result.cpc} CPC</span>
                      <Badge variant={result.difficulty > 70 ? 'destructive' : result.difficulty > 40 ? 'default' : 'secondary'}>
                        {result.difficulty}% Difficulty
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-lg font-bold">
                      {result.gap_score}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Gap Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
