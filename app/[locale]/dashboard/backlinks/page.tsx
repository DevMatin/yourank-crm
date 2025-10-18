'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link as LinkIcon, Globe, Anchor, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'overview',
    name: 'Backlinks Overview',
    description: 'Gesamtübersicht aller Backlinks einer Domain',
    icon: LinkIcon,
    credits: 2,
    status: 'active',
    href: '/backlinks/overview'
  },
  {
    id: 'anchors',
    name: 'Anchor Text',
    description: 'Analysiere verwendete Anchor-Texte',
    icon: Anchor,
    credits: 1,
    status: 'active',
    href: '/backlinks/anchors'
  },
  {
    id: 'referring-domains',
    name: 'Referring Domains',
    description: 'Domains die auf deine Seite verlinken',
    icon: ExternalLink,
    credits: 2,
    status: 'active',
    href: '/backlinks/referring-domains'
  }
];

export default function BacklinksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Backlinks API</h1>
        <p className="text-muted-foreground">
          Backlink-Analyse, Anchor-Texte und Referring Domains für Link Building
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
          <CardTitle>Über Backlinks API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das Backlinks API Modul bietet dir umfassende Link-Analysen für deine SEO-Strategie. 
              Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>Backlinks Overview</strong> - Gesamtübersicht aller Backlinks mit Metriken</li>
              <li><strong>Anchor Text</strong> - Analysiere welche Anchor-Texte verwendet werden</li>
              <li><strong>Referring Domains</strong> - Identifiziere Domains die auf dich verlinken</li>
            </ul>
            <p>
              Diese Analysen helfen dir dabei, dein Link-Profil zu verstehen, 
              neue Link-Building-Möglichkeiten zu finden und deine Domain-Autorität zu steigern.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
