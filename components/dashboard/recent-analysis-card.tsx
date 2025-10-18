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
        <div className="space-y-3">
          {analyses.map((analysis) => {
            const [moduleId, toolId] = analysis.type.split('_');
            const moduleConfig = getModuleById(moduleId);
            const tool = getToolById(moduleId, toolId);
            
            return (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-4 rounded-xl border transition-all hover:bg-white/20 dark:hover:bg-white/10"
                style={{ borderColor: 'var(--border)' }}
              >
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col gap-1">
                    {/* Title */}
                    <span className="text-sm text-foreground">
                      {tool?.name || analysis.type}
                    </span>
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-2">
                      {/* Status Badge */}
                      <span 
                        className="px-2 py-0.5 rounded-md text-xs"
                        style={{
                          backgroundColor: analysis.status === 'completed' 
                            ? 'rgba(52,167,173,0.15)' 
                            : analysis.status === 'failed'
                            ? 'rgba(239,68,68,0.15)'
                            : 'rgba(107,114,128,0.15)',
                          color: analysis.status === 'completed' 
                            ? '#34A7AD' 
                            : analysis.status === 'failed'
                            ? '#EF4444'
                            : '#6B7280'
                        }}
                      >
                        {analysis.status === 'completed' && 'Abgeschlossen'}
                        {analysis.status === 'pending' && 'Wartend'}
                        {analysis.status === 'processing' && 'Verarbeitung'}
                        {analysis.status === 'failed' && 'Fehlgeschlagen'}
                      </span>
                      
                      {/* Time & Credits */}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(analysis.created_at), {
                          addSuffix: true,
                          locale: de
                        })} · {analysis.credits_used} Credits
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Right Section - Action Buttons */}
                <div className="flex items-center gap-2">
                  {analysis.status === 'completed' && (
                    <Link 
                      href={`${moduleConfig?.basePath}/${toolId}`}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-white/20 dark:hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  )}
                  {analysis.projects && (
                    <Link 
                      href={`/dashboard/projects/${analysis.projects.id}`}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-white/20 dark:hover:bg-white/10"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </Link>
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
