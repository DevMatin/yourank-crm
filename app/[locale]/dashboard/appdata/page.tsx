'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Play, Apple, Download } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'app-store',
    name: 'App Store',
    description: 'Analysiere iOS App Store Rankings und Daten',
    icon: Apple,
    credits: 2,
    status: 'active',
    href: '/appdata/app-store'
  },
  {
    id: 'play-store',
    name: 'Play Store',
    description: 'Analysiere Google Play Store Rankings und Daten',
    icon: Play,
    credits: 2,
    status: 'active',
    href: '/appdata/play-store'
  }
];

export default function AppDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AppData API</h1>
        <p className="text-muted-foreground">
          App Store und Google Play Store Analyse
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
          <CardTitle>Über AppData API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das AppData API Modul bietet dir umfassende App Store Analysen für iOS und Android. 
              Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>App Store</strong> - Analysiere iOS App Rankings, Bewertungen und Downloads</li>
              <li><strong>Play Store</strong> - Analysiere Google Play Store Rankings und Metriken</li>
            </ul>
            <p>
              Diese Analysen helfen dir dabei, deine App-Marketing-Strategie zu optimieren, 
              die Konkurrenz zu analysieren und bessere Rankings zu erzielen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
