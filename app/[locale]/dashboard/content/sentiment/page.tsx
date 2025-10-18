'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Heart, Search, TrendingUp, Smile, Frown, Meh } from 'lucide-react';
import { toast } from 'sonner';

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  keywords: Array<{
    word: string;
    sentiment: string;
    importance: number;
  }>;
  summary: string;
}

export default function ContentSentimentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SentimentResult | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    language: 'de',
    include_emotions: true,
    include_keywords: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/content/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Sentiment Analyse');
      }

      const data = await response.json();
      setResults(data.result);
      
      toast.success('Sentiment Analyse erfolgreich abgeschlossen!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler bei der Analyse');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="h-5 w-5 text-green-500" />;
      case 'negative': return <Frown className="h-5 w-5 text-red-500" />;
      case 'neutral': return <Meh className="h-5 w-5 text-gray-500" />;
      default: return <Heart className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'default' as const;
      case 'negative': return 'destructive' as const;
      case 'neutral': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Sentiment Analysis</h1>
        <p className="text-muted-foreground">
          Analysiere Stimmung und Emotionen in Texten
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Text zur Analyse</Label>
              <Textarea
                id="text"
                placeholder="Geben Sie hier den Text ein, den Sie analysieren möchten..."
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                required
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {formData.text.length} Zeichen
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Sprache</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">Englisch</SelectItem>
                    <SelectItem value="fr">Französisch</SelectItem>
                    <SelectItem value="es">Spanisch</SelectItem>
                    <SelectItem value="it">Italienisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="include_emotions">Emotionen</Label>
                <Select 
                  value={formData.include_emotions.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, include_emotions: value === 'true' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Einbeziehen</SelectItem>
                    <SelectItem value="false">Ignorieren</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="include_keywords">Keywords</Label>
                <Select 
                  value={formData.include_keywords.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, include_keywords: value === 'true' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Einbeziehen</SelectItem>
                    <SelectItem value="false">Ignorieren</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading || formData.text.length < 10} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Sentiment...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Sentiment Analyse starten
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sentiment</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getSentimentIcon(results.sentiment)}
                      <p className={`text-lg font-bold ${getSentimentColor(results.sentiment)}`}>
                        {results.sentiment === 'positive' ? 'Positiv' : 
                         results.sentiment === 'negative' ? 'Negativ' : 'Neutral'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                    <p className="text-2xl font-bold">{Math.round(results.confidence * 100)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stärkste Emotion</p>
                    <p className="text-lg font-bold">
                      {Object.entries(results.emotions).reduce((a, b) => 
                        results.emotions[a[0] as keyof typeof results.emotions] > results.emotions[b[0] as keyof typeof results.emotions] ? a : b
                      )[0]}
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Keywords</p>
                    <p className="text-2xl font-bold">{results.keywords.length}</p>
                  </div>
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Detaillierte Analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Zusammenfassung</h3>
                  <p className="text-sm text-muted-foreground">{results.summary}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Emotionen</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(results.emotions).map(([emotion, score]) => (
                      <div key={emotion} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="capitalize">{emotion}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{Math.round(score * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {results.keywords.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Wichtige Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.keywords.slice(0, 20).map((keyword, index) => (
                        <Badge 
                          key={index} 
                          variant={keyword.sentiment === 'positive' ? 'default' : 
                                  keyword.sentiment === 'negative' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {keyword.word} ({Math.round(keyword.importance * 100)}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
