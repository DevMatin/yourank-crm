'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Star, Clock, Phone, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface LocalFinderResult {
  keyword: string;
  location: string;
  total_count: number;
  businesses: Array<{
    name: string;
    address: string;
    phone: string;
    website: string;
    rating: number;
    reviews_count: number;
    category: string;
    hours: string;
    photos_count: number;
    verified: boolean;
    cid: string;
  }>;
}

export default function LocalFinderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LocalFinderResult | null>(null);
  const [formData, setFormData] = useState({
    keyword: '',
    location: '',
    location_code: '2840',
    language_code: 'de',
    limit: 20
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/business/local-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Local Finder Analyse');
      }

      const data = await response.json();
      setResults(data.result);
      
      toast.success(`${data.result?.total_count || 0} lokale Geschäfte gefunden!`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler bei der Analyse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Local Finder</h1>
        <p className="text-muted-foreground">
          Analysiere lokale Suchergebnisse und Google My Business
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Suchbegriff</Label>
                <Input
                  id="keyword"
                  placeholder="z.B. Restaurant, Friseur, Arzt"
                  value={formData.keyword}
                  onChange={(e) => setFormData(prev => ({ ...prev, keyword: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Ort</Label>
                <Input
                  id="location"
                  placeholder="z.B. Berlin, München, Hamburg"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location_code">Land</Label>
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit">Anzahl Ergebnisse</Label>
                <Select 
                  value={formData.limit.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, limit: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Suche lokale Geschäfte...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Local Finder Analyse starten
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Lokale Geschäfte ({results.total_count})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.businesses.map((business, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-lg">{business.name}</h3>
                        {business.verified && (
                          <Badge variant="default">Verifiziert</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {business.rating} ({business.reviews_count} Bewertungen)
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {business.address}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {business.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {business.phone}
                          </span>
                        )}
                        {business.website && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Website
                          </span>
                        )}
                        {business.hours && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {business.hours}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="secondary">{business.category}</Badge>
                      {business.photos_count > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {business.photos_count} Fotos
                        </div>
                      )}
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
