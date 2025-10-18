'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Store, Search, Star, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';

interface SellerData {
  seller_name: string;
  seller_rating: number;
  total_reviews: number;
  total_products: number;
  seller_url: string;
  seller_type: string;
  verified: boolean;
  location: string;
  join_date: string;
  performance_metrics: {
    response_rate: number;
    shipping_time: number;
    return_rate: number;
  };
}

export default function SellerDataPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SellerData | null>(null);
  const [formData, setFormData] = useState({
    seller_name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/merchant/seller-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fehler bei der Seller Data Analyse');
      }

      const data = await response.json();
      setResults(data.result);
      
      toast.success('Seller Data Analyse erfolgreich abgeschlossen!');
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
        <h1 className="text-3xl font-bold">Seller Data Analysis</h1>
        <p className="text-muted-foreground">
          Analysiere Verkäufer-Daten und Bewertungen
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Analyse-Parameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seller_name">Verkäufer-Name</Label>
              <Input
                id="seller_name"
                placeholder="z.B. Amazon, MediaMarkt, Otto"
                value={formData.seller_name}
                onChange={(e) => setFormData(prev => ({ ...prev, seller_name: e.target.value }))}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Search className="mr-2 h-4 w-4 animate-spin" />
                  Analysiere Verkäufer-Daten...
                </>
              ) : (
                <>
                  <Store className="mr-2 h-4 w-4" />
                  Seller Data Analyse starten
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
                      <p className="text-2xl font-bold">{results.seller_rating}/5</p>
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
                    <p className="text-2xl font-bold">{results.total_reviews.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Products</p>
                    <p className="text-2xl font-bold">{results.total_products.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
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

          <Card>
            <CardHeader>
              <CardTitle>Verkäufer-Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Grundinformationen</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{results.seller_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Typ:</span>
                        <span className="font-medium">{results.seller_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Standort:</span>
                        <span className="font-medium">{results.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seit:</span>
                        <span className="font-medium">{new Date(results.join_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Performance-Metriken</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response Rate:</span>
                        <span className="font-medium">{results.performance_metrics.response_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping Time:</span>
                        <span className="font-medium">{results.performance_metrics.shipping_time} Tage</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Return Rate:</span>
                        <span className="font-medium">{results.performance_metrics.return_rate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
