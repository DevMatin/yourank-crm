'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { modules } from '@/config/modules.config';
import { 
  Search, 
  Hash, 
  Globe, 
  FlaskConical, 
  Link as LinkIcon, 
  FileText, 
  PenTool, 
  ShoppingCart, 
  Smartphone, 
  Building2, 
  Database, 
  Brain,
  Plus
} from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  Search,
  Hash,
  Globe,
  FlaskConical,
  Link: LinkIcon,
  FileText,
  PenTool,
  ShoppingCart,
  Smartphone,
  Building2,
  Database,
  Brain,
};

export function QuickActions() {
  // Beliebte Tools für Quick Actions
  const popularTools = [
    { moduleId: 'keywords', toolId: 'related', name: 'Verwandte Keywords', icon: 'Hash' },
    { moduleId: 'domain', toolId: 'overview', name: 'Domain-Analyse', icon: 'Globe' },
    { moduleId: 'serp', toolId: 'ai-overview', name: 'SERP-Analyse', icon: 'Search' },
    { moduleId: 'keywords', toolId: 'difficulty', name: 'Keyword-Schwierigkeit', icon: 'Hash' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schnellstart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularTools.map((tool) => {
            const moduleConfig = modules.find(m => m.id === tool.moduleId);
            const Icon = iconMap[tool.icon as keyof typeof iconMap] || Search;
            
            return (
              <Button
                key={`${tool.moduleId}-${tool.toolId}`}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2"
                asChild
              >
                <Link href={`${moduleConfig?.basePath}/${tool.toolId}`}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tool.name}</span>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/dashboard/projects">
              <Plus className="h-4 w-4 mr-2" />
              Neues Projekt erstellen
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
