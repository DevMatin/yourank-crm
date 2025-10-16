'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, TrendingUp, BarChart3, Target } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'overview',
    name: 'Domain Overview',
    description: 'Umfassende Domain-Analyse mit allen wichtigen Metriken',
    icon: Globe,
    credits: 3,
    status: 'active',
    href: '/domain/overview'
  },
  {
    id: 'traffic',
    name: 'Traffic Analytics',
    description: 'Detaillierte Traffic-Analyse und Besucherstatistiken',
    icon: TrendingUp,
    credits: 2,
    status: 'active',
    href: '/domain/traffic'
  },
  {
    id: 'ranked-keywords',
    name: 'Ranked Keywords',
    description: 'Keywords für die die Domain in den SERPs rankt',
    icon: Target,
    credits: 2,
    status: 'active',
    href: '/domain/ranked-keywords'
  }
];

export default function DomainPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Domain Analytics</h1>
        <p className="text-muted-foreground">
          Domainrank, Sichtbarkeit und Traffic-Analyse für deine Website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <CardTitle>Über Domain Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das Domain Analytics Modul bietet dir umfassende Einblicke in die Performance 
              und Sichtbarkeit deiner Website. Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>Domain Overview</strong> - Umfassende Analyse mit Domainrank, Sichtbarkeit und Traffic</li>
              <li><strong>Traffic Analytics</strong> - Detaillierte Besucherstatistiken und Traffic-Quellen</li>
              <li><strong>Ranked Keywords</strong> - Alle Keywords für die deine Domain rankt</li>
            </ul>
            <p>
              Diese Analysen helfen dir dabei, die Stärken und Schwächen deiner Website 
              zu identifizieren und deine SEO-Strategie zu optimieren.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
