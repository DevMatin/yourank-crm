'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Brain, HelpCircle, FileText } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'ai-overview',
    name: 'AI Overview Analysis',
    description: 'Analysiere AI Overview Ergebnisse in den SERPs',
    icon: Brain,
    credits: 2,
    status: 'active',
    href: '/serp/ai-overview'
  },
  {
    id: 'people-also-ask',
    name: 'People Also Ask',
    description: 'Extrahiere PAA-Fragen und Antworten aus den SERPs',
    icon: HelpCircle,
    credits: 1,
    status: 'active',
    href: '/serp/people-also-ask'
  },
  {
    id: 'onpage-audit',
    name: 'On-Page SEO Audit',
    description: 'Technische SEO-Analyse von Webseiten',
    icon: FileText,
    credits: 3,
    status: 'active',
    href: '/serp/onpage-audit'
  }
];

export default function SerpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SERP Analysis</h1>
        <p className="text-muted-foreground">
          Suchergebnisanalyse und SERP-Features für deine Keywords
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
          <CardTitle>Über SERP Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das SERP Analysis Modul bietet dir umfassende Einblicke in die Suchergebnisse 
              und SERP-Features für deine Keywords. Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>AI Overview Analysis</strong> - Analysiere die neuen AI Overview Ergebnisse in Google</li>
              <li><strong>People Also Ask</strong> - Extrahiere PAA-Fragen und finde Content-Ideen</li>
              <li><strong>On-Page SEO Audit</strong> - Technische SEO-Analyse deiner Webseiten</li>
            </ul>
            <p>
              Diese Analysen helfen dir dabei, die SERP-Landschaft zu verstehen und 
              deine Content-Strategie entsprechend anzupassen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
