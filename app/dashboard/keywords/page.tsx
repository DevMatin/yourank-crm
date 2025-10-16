'use client';

import { getModuleById } from '@/config/modules.config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hash, Search, TrendingUp, Lightbulb, Target, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const toolIcons = {
  'related': Search,
  'suggestions': Lightbulb,
  'ideas': TrendingUp,
  'difficulty': Target,
  'overview': BarChart3,
};

export default function KeywordsPage() {
  const keywordsModule = getModuleById('keywords');

  if (!keywordsModule) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Modul nicht gefunden.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Hash className="h-8 w-8 text-primary" />
          Keywords Data
        </h1>
        <p className="text-muted-foreground mt-2">
          {keywordsModule.description}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {keywordsModule.tools.map((tool) => {
          const Icon = toolIcons[tool.id as keyof typeof toolIcons] || Hash;
          
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
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant={
                        tool.status === 'active' ? 'default' :
                        tool.status === 'beta' ? 'secondary' : 'outline'
                      }
                    >
                      {tool.status === 'active' ? 'Aktiv' :
                       tool.status === 'beta' ? 'Beta' : 'Bald verfügbar'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {tool.credits} Credits
                    </span>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="capitalize">{tool.status}</span>
                  </div>
                  
                  {tool.status === 'active' ? (
                    <Link href={`/keywords/${tool.id}`}>
                      <Button className="w-full">
                        <Icon className="mr-2 h-4 w-4" />
                        Tool starten
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full" disabled>
                      <Icon className="mr-2 h-4 w-4" />
                      {tool.status === 'beta' ? 'Beta verfügbar' : 'Bald verfügbar'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Module Info */}
      <Card>
        <CardHeader>
          <CardTitle>Über Keywords Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Das Keywords Data Modul bietet umfassende Tools für die Keyword-Recherche und -Analyse. 
            Nutzen Sie diese Tools, um:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Verwandte Keywords zu Ihren Hauptbegriffen zu finden</li>
            <li>Keyword-Schwierigkeiten zu bewerten</li>
            <li>Suchvolumen und Wettbewerb zu analysieren</li>
            <li>Neue Keyword-Ideen zu generieren</li>
            <li>Umfassende Keyword-Übersichten zu erstellen</li>
          </ul>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">💡 Tipp</h4>
            <p className="text-sm text-muted-foreground">
              Beginnen Sie mit der "Related Keywords" Analyse, um verwandte Begriffe zu finden, 
              und nutzen Sie dann "Keyword Difficulty" um die besten Chancen zu identifizieren.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
