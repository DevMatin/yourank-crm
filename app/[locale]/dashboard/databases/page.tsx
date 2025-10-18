'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, TrendingUp, BarChart3, Calendar } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'historical-data',
    name: 'Historical Data',
    description: 'Analysiere historische SEO-Daten und Rankings',
    icon: Database,
    credits: 2,
    status: 'active',
    href: '/databases/historical-data'
  },
  {
    id: 'trend-analysis',
    name: 'Trend Analysis',
    description: 'Erkenne Trends und Entwicklungen über Zeit',
    icon: TrendingUp,
    credits: 3,
    status: 'active',
    href: '/databases/trend-analysis'
  }
];

export default function DatabasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Databases API</h1>
        <p className="text-muted-foreground">
          Historische Daten und Trend-Analysen für Langzeit-SEO
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
          <CardTitle>Über Databases API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das Databases API Modul bietet dir umfassende historische SEO-Analysen und Trend-Erkennung. 
              Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>Historical Data</strong> - Analysiere historische Rankings, Traffic und Performance-Daten</li>
              <li><strong>Trend Analysis</strong> - Erkenne Trends, saisonale Muster und Entwicklungen über Zeit</li>
            </ul>
            <p>
              Diese Analysen helfen dir dabei, langfristige SEO-Strategien zu entwickeln, 
              saisonale Trends zu verstehen und die Performance-Entwicklung zu tracken.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
