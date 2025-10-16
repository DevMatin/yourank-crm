'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Search, Star, Phone, Globe, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface BusinessInfoResult {
  business_name: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  reviews_count: number;
  category: string;
  hours: string;
  description: string;
  photos_count: number;
  verified: boolean;
  cid: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  attributes: string[];
  amenities: string[];
}

export default function BusinessInfoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BusinessInfoResult | null>(null);
  const [formData, setFormData] = useState({
    business_name: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/business/business-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Business Info Analyse');
      }

      const data = await response.json();
      setResults(data.result);
      
      toast.success('Business Info Analyse erfolgreich abgeschlossen!');
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
        <h1 className="text-3xl font-bold">Business Info</h1>
        <p className="text-muted-foreground">
          Analysiere Geschäftsinformationen und Bewertungen
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Geschäftsname</Label>
                <Input
                  id="business_name"
                  placeholder="z.B. Restaurant ABC, Friseur XYZ"
                  value={formData.business_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Ort (optional)</Label>
                <Input
                  id="location"
                  placeholder="z.B. Berlin, München"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Geschäftsinfo...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Business Info Analyse starten
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
                    <p className="text-sm font-medium text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <p className="text-2xl font-bold">{results.rating}/5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reviews</p>
                    <p className="text-2xl font-bold">{results.reviews_count.toLocaleString()}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Photos</p>
                    <p className="text-2xl font-bold">{results.photos_count}</p>
                  </div>
                  <Globe className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {results.verified ? (
                        <Badge variant="default">Verifiziert</Badge>
                      ) : (
                        <Badge variant="secondary">Nicht verifiziert</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Geschäftsinformationen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">{results.business_name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kategorie:</span>
                        <span className="font-medium">{results.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Adresse:</span>
                        <span className="font-medium">{results.address}</span>
                      </div>
                      {results.phone && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Telefon:</span>
                          <span className="font-medium">{results.phone}</span>
                        </div>
                      )}
                      {results.website && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Website:</span>
                          <span className="font-medium">{results.website}</span>
                        </div>
                      )}
                      {results.hours && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Öffnungszeiten:</span>
                          <span className="font-medium">{results.hours}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Standort & Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Koordinaten</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Breitengrad:</span>
                        <span className="font-medium">{results.coordinates.lat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Längengrad:</span>
                        <span className="font-medium">{results.coordinates.lng}</span>
                      </div>
                    </div>
                  </div>

                  {results.attributes.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Attribute</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.attributes.map((attr, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {attr}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.amenities.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Ausstattung</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.amenities.map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {results.description && (
            <Card>
              <CardHeader>
                <CardTitle>Beschreibung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{results.description}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
