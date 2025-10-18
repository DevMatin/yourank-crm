'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Anchor, Search, Globe, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface AnchorText {
  anchor: string;
  count: number;
  percentage: number;
  domains_count: number;
  first_seen: string;
  last_seen: string;
  anchor_type: string;
}

export default function AnchorTextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnchorText[]>([]);
  const [formData, setFormData] = useState({
    target: '',
    limit: 100,
    anchor_type: 'all'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/backlinks/anchors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Anchor Text Analyse');
      }

      const data = await response.json();
      setResults(data.results || []);
      
      toast.success(`${data.results?.length || 0} Anchor-Texte gefunden!`);
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
      ['Anchor Text', 'Count', 'Percentage', 'Domains Count', 'First Seen', 'Last Seen', 'Type'],
      ...results.map(result => [
        result.anchor,
        result.count,
        result.percentage,
        result.domains_count,
        result.first_seen,
        result.last_seen,
        result.anchor_type
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anchor-text-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAnchorTypeColor = (type: string) => {
    switch (type) {
      case 'exact_match': return 'text-green-600';
      case 'partial_match': return 'text-blue-600';
      case 'branded': return 'text-purple-600';
      case 'generic': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Anchor Text Analysis</h1>
        <p className="text-muted-foreground">
          Analysiere verwendete Anchor-Texte in Backlinks
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Domain oder URL</Label>
                <Input
                  id="target"
                  placeholder="example.com oder https://example.com/page"
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="limit">Anzahl Anchor-Texte</Label>
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

            <div className="space-y-2">
              <Label htmlFor="anchor_type">Anchor-Typ</Label>
              <Select 
                value={formData.anchor_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, anchor_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="exact_match">Exact Match</SelectItem>
                  <SelectItem value="partial_match">Partial Match</SelectItem>
                  <SelectItem value="branded">Branded</SelectItem>
                  <SelectItem value="generic">Generic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Anchor-Texte...
                </>
              ) : (
                <>
                  <Anchor className="mr-2 h-4 w-4" />
                  Anchor Text Analyse starten
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
                Anchor-Texte ({results.length})
              </CardTitle>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                CSV Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((anchor, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{anchor.anchor}</h3>
                      <Badge variant="secondary">
                        {anchor.count} Links
                      </Badge>
                      <Badge variant="outline">
                        {anchor.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {anchor.domains_count} Domains
                      </span>
                      <span className={getAnchorTypeColor(anchor.anchor_type)}>
                        {anchor.anchor_type.replace('_', ' ')}
                      </span>
                      <span>
                        First: {new Date(anchor.first_seen).toLocaleDateString()}
                      </span>
                      <span>
                        Last: {new Date(anchor.last_seen).toLocaleDateString()}
                      </span>
                    </div>
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
