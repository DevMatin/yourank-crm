'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Tag, Sparkles, Heart, Code, Zap } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'sentiment',
    name: 'Content Sentiment',
    description: 'Analysiere Stimmung und Emotionen in Texten',
    icon: Heart,
    credits: 1,
    status: 'active',
    href: '/content/sentiment'
  },
  {
    id: 'meta-tags',
    name: 'Meta Tags',
    description: 'Analysiere Meta-Tags und HTML-Struktur',
    icon: Tag,
    credits: 1,
    status: 'active',
    href: '/content/meta-tags'
  },
  {
    id: 'generation',
    name: 'Content Generation',
    description: 'Generiere SEO-optimierte Inhalte (Beta)',
    icon: Sparkles,
    credits: 3,
    status: 'active',
    href: '/content/generation'
  }
];

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content API</h1>
        <p className="text-muted-foreground">
          Content-Analyse, Sentiment und automatische Content-Generierung
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
          <CardTitle>Über Content API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p>
              Das Content API Modul bietet dir umfassende Content-Analysen und -Optimierung. 
              Mit diesen Tools kannst du:
            </p>
            <ul>
              <li><strong>Content Sentiment</strong> - Analysiere Stimmung und Emotionen in Texten</li>
              <li><strong>Meta Tags</strong> - Überprüfe Meta-Tags und HTML-Struktur</li>
              <li><strong>Content Generation</strong> - Generiere SEO-optimierte Inhalte mit AI</li>
            </ul>
            <p>
              Diese Analysen helfen dir dabei, deine Content-Strategie zu optimieren, 
              die Benutzererfahrung zu verbessern und bessere Rankings zu erzielen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
