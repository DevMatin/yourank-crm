'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DatabaseProject, DatabaseAnalysis } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/dashboard/stat-card';
import { 
  ArrowLeft, 
  Globe, 
  BarChart3, 
  Calendar, 
  CreditCard,
  TrendingUp,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProjectStats {
  totalAnalyses: number;
  totalCreditsUsed: number;
  lastAnalysis: string | null;
  analysesThisMonth: number;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<DatabaseProject | null>(null);
  const [analyses, setAnalyses] = useState<DatabaseAnalysis[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    totalAnalyses: 0,
    totalCreditsUsed: 0,
    lastAnalysis: null,
    analysesThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Get project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .eq('user_id', user.id)
          .single();

        if (projectError || !projectData) {
          console.error('Project not found:', projectError);
          router.push('/dashboard/projects');
          return;
        }

        setProject(projectData);

        // Get analyses for this project
        const { data: analysesData } = await supabase
          .from('analyses')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (analysesData) {
          setAnalyses(analysesData);

          // Calculate stats
          const currentMonth = new Date();
          currentMonth.setDate(1);
          currentMonth.setHours(0, 0, 0, 0);

          const totalAnalyses = analysesData.length;
          const totalCreditsUsed = analysesData.reduce((sum: number, a: any) => sum + a.credits_used, 0);
          const lastAnalysis = analysesData.length > 0 ? analysesData[0].created_at : null;
          const analysesThisMonth = analysesData.filter((a: any) => 
            new Date(a.created_at) >= currentMonth
          ).length;

          setStats({
            totalAnalyses,
            totalCreditsUsed,
            lastAnalysis,
            analysesThisMonth
          });
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, router]);

  const handleDeleteProject = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        return;
      }

      router.push('/dashboard/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-lg border animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Projekt nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu Projekten
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>{project.domain}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Bearbeiten
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Projekt löschen</AlertDialogTitle>
                <AlertDialogDescription>
                  Sind Sie sicher, dass Sie das Projekt "{project.name}" löschen möchten? 
                  Alle zugehörigen Analysen werden ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteProject}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Analysen"
          value={stats.totalAnalyses}
          description="Gesamt durchgeführte Analysen"
          icon={BarChart3}
        />
        <StatCard
          title="Credits verwendet"
          value={stats.totalCreditsUsed}
          description="Credits für dieses Projekt"
          icon={CreditCard}
        />
        <StatCard
          title="Dieser Monat"
          value={stats.analysesThisMonth}
          description="Analysen im aktuellen Monat"
          icon={TrendingUp}
        />
        <StatCard
          title="Letzte Analyse"
          value={stats.lastAnalysis ? formatDistanceToNow(new Date(stats.lastAnalysis), { addSuffix: true, locale: de }) : 'Nie'}
          description="Zeitpunkt der letzten Analyse"
          icon={Calendar}
        />
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <CardTitle>Neueste Analysen</CardTitle>
        </CardHeader>
        <CardContent>
          {analyses.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keine Analysen vorhanden</h3>
              <p className="text-muted-foreground mb-4">
                Starten Sie Ihre erste SEO-Analyse für dieses Projekt.
              </p>
              <Button asChild>
                <Link href="/dashboard/keywords/related">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Erste Analyse starten
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.slice(0, 10).map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{analysis.type}</h4>
                      <Badge
                        variant={
                          analysis.status === 'completed'
                            ? 'default'
                            : analysis.status === 'failed'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {analysis.status === 'completed' && 'Abgeschlossen'}
                        {analysis.status === 'pending' && 'Wartend'}
                        {analysis.status === 'processing' && 'Verarbeitung'}
                        {analysis.status === 'failed' && 'Fehlgeschlagen'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(analysis.created_at), {
                          addSuffix: true,
                          locale: de
                        })}
                      </span>
                      <span>{analysis.credits_used} Credits</span>
                    </div>
                  </div>
                  
                  {analysis.status === 'completed' && (
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {analyses.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline">
                    Alle {analyses.length} Analysen anzeigen
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
