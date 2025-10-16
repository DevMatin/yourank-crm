'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hash, Search, TrendingUp, Brain, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'related',
    name: 'Related Keywords',
    description: 'Finde verwandte Keywords zu deinem Suchbegriff',
    icon: Hash,
    credits: 1,
    status: 'active',
    href: '/keywords/related'
  },
  {
    id: 'suggestions',
    name: 'Keyword Suggestions',
    description: 'Automatische Keyword-Vorschläge basierend auf deinem Input',
    icon: Search,
    credits: 1,
    status: 'active',
    href: '/keywords/suggestions'
  },
  {
    id: 'ideas',
    name: 'Keyword Ideas',
    description: 'Kreative Keyword-Ideen für deine Content-Strategie',
    icon: Brain,
    credits: 1,
    status: 'active',
    href: '/keywords/ideas'
  },
  {
    id: 'difficulty',
    name: 'Keyword Difficulty',
    description: 'Bewerte die Schwierigkeit von Keywords für deine Domain',
    icon: TrendingUp,
    credits: 1,
    status: 'active',
    href: '/keywords/difficulty'
  },
  {
    id: 'overview',
    name: 'Keyword Overview',
    description: 'Umfassende Keyword-Analyse mit allen wichtigen Metriken',
    icon: BarChart3,
    credits: 2,
    status: 'active',
    href: '/keywords/overview'
  }
];

export default function KeywordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keywords Data</h1>
        <p className="text-muted-foreground">
          Keyword-Recherche und Difficulty-Analyse für deine SEO-Strategie
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
          <CardTitle>Über Keywords Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das Keywords Data Modul bietet dir umfassende Tools für die Keyword-Recherche 
              und -Analyse. Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>Verwandte Keywords</strong> zu deinen Hauptbegriffen finden</li>
              <li><strong>Keyword-Vorschläge</strong> basierend auf Suchvolumen und Trends erhalten</li>
              <li><strong>Kreative Keyword-Ideen</strong> für deine Content-Strategie entwickeln</li>
              <li><strong>Keyword-Schwierigkeit</strong> bewerten und realistische Ziele setzen</li>
              <li><strong>Umfassende Übersichten</strong> mit allen wichtigen Metriken erstellen</li>
            </ul>
            <p>
              Alle Tools nutzen die neuesten Daten von DataForSEO und bieten dir 
              präzise, aktuelle Informationen für deine SEO-Entscheidungen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
