'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatabaseAnalysis } from '@/types/database';
import { getModuleById, getToolById } from '@/config/modules.config';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface RecentAnalysisCardProps {
  analyses: (DatabaseAnalysis & {
    projects?: {
      id: string;
      name: string;
      domain: string;
    } | null;
  })[];
}

export function RecentAnalysisCard({ analyses }: RecentAnalysisCardProps) {
  if (analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Neueste Analysen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Noch keine Analysen durchgeführt
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Starten Sie Ihre erste SEO-Analyse
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neueste Analysen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyses.map((analysis) => {
            const [moduleId, toolId] = analysis.type.split('_');
            const module = getModuleById(moduleId);
            const tool = getToolById(moduleId, toolId);
            
            return (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">
                      {tool?.name || analysis.type}
                    </h4>
                    <Badge
                      variant={
                        analysis.status === 'completed'
                          ? 'default'
                          : analysis.status === 'failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="text-xs"
                    >
                      {analysis.status === 'completed' && 'Abgeschlossen'}
                      {analysis.status === 'pending' && 'Wartend'}
                      {analysis.status === 'processing' && 'Verarbeitung'}
                      {analysis.status === 'failed' && 'Fehlgeschlagen'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    {analysis.projects && (
                      <span className="text-xs text-muted-foreground">
                        {analysis.projects.name}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(analysis.created_at), {
                        addSuffix: true,
                        locale: de
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {analysis.credits_used} Credits
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {analysis.status === 'completed' && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`${module?.basePath}/${toolId}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {analysis.projects && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/projects/${analysis.projects.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {analyses.length >= 5 && (
          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/analyses">
                Alle Analysen anzeigen
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
