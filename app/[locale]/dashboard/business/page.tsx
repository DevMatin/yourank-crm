'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Info, Search } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'local-finder',
    name: 'Local Finder',
    description: 'Analysiere lokale Suchergebnisse und Google My Business',
    icon: MapPin,
    credits: 2,
    status: 'active',
    href: '/business/local-finder'
  },
  {
    id: 'business-info',
    name: 'Business Info',
    description: 'Analysiere Geschäftsinformationen und Bewertungen',
    icon: Building2,
    credits: 1,
    status: 'active',
    href: '/business/business-info'
  }
];

export default function BusinessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Business API</h1>
        <p className="text-muted-foreground">
          Lokale Suche und Geschäftsinformationen
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          
          return (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {tool.credits} Credits
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {tool.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={tool.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {tool.status === 'active' ? 'Verfügbar' : 'In Entwicklung'}
                  </Badge>
                  
                  <Button asChild disabled={tool.status !== 'active'}>
                    <Link href={tool.href}>
                      Tool öffnen
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Über Business API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das Business API Modul bietet dir umfassende lokale SEO und Geschäftsanalysen. 
              Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>Local Finder</strong> - Analysiere lokale Suchergebnisse und Google My Business</li>
              <li><strong>Business Info</strong> - Überprüfe Geschäftsinformationen und Bewertungen</li>
            </ul>
            <p>
              Diese Analysen helfen dir dabei, deine lokale SEO-Strategie zu optimieren, 
              die Sichtbarkeit in lokalen Suchergebnissen zu verbessern und Kunden zu gewinnen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
