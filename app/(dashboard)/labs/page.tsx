'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Target, BarChart3, Users } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'keyword-gap',
    name: 'Keyword Gap',
    description: 'Finde Keyword-Lücken zu Konkurrenten',
    icon: Target,
    credits: 3,
    status: 'active',
    href: '/labs/keyword-gap'
  },
  {
    id: 'ranked-keywords',
    name: 'Ranked Keywords',
    description: 'Keywords für die eine Domain rankt',
    icon: BarChart3,
    credits: 2,
    status: 'active',
    href: '/labs/ranked-keywords'
  },
  {
    id: 'competitors',
    name: 'Competitors',
    description: 'Finde direkte Konkurrenten',
    icon: Users,
    credits: 2,
    status: 'active',
    href: '/labs/competitors'
  }
];

export default function LabsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Labs API</h1>
        <p className="text-muted-foreground">
          Keyword-Gap, Competitors und Tracking für erweiterte SEO-Analysen
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
          <CardTitle>Über Labs API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das Labs API Modul bietet dir erweiterte SEO-Analysen und Competitive Intelligence. 
              Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>Keyword Gap</strong> - Finde Keywords, für die Konkurrenten ranken, aber du nicht</li>
              <li><strong>Ranked Keywords</strong> - Analysiere alle Keywords für die eine Domain rankt</li>
              <li><strong>Competitors</strong> - Identifiziere direkte Konkurrenten und analysiere ihre Stärken</li>
            </ul>
            <p>
              Diese erweiterten Analysen helfen dir dabei, deine SEO-Strategie zu optimieren 
              und Wettbewerbsvorteile zu identifizieren.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
