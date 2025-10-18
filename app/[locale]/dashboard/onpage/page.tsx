'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Link as LinkIcon, Zap } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'audit',
    name: 'OnPage Audit',
    description: 'Vollständige technische SEO-Analyse einer Website',
    icon: FileText,
    credits: 3,
    status: 'active',
    href: '/onpage/audit'
  },
  {
    id: 'broken-links',
    name: 'Broken Links',
    description: 'Finde defekte Links auf deiner Website',
    icon: LinkIcon,
    credits: 2,
    status: 'active',
    href: '/onpage/broken-links'
  },
  {
    id: 'pagespeed',
    name: 'Page Speed',
    description: 'Analysiere Ladezeiten und Performance',
    icon: Zap,
    credits: 1,
    status: 'active',
    href: '/onpage/pagespeed'
  }
];

export default function OnPagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">OnPage API</h1>
        <p className="text-muted-foreground">
          Technische SEO-Analysen, Broken Links und Performance-Optimierung
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
          <CardTitle>Über OnPage API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das OnPage API Modul bietet dir umfassende technische SEO-Analysen für deine Website. 
              Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>OnPage Audit</strong> - Vollständige technische SEO-Analyse mit Task-System</li>
              <li><strong>Broken Links</strong> - Finde und repariere defekte Links</li>
              <li><strong>Page Speed</strong> - Analysiere Ladezeiten und Performance-Metriken</li>
            </ul>
            <p>
              Diese Analysen helfen dir dabei, technische SEO-Probleme zu identifizieren, 
              die Benutzererfahrung zu verbessern und deine Rankings zu optimieren.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
