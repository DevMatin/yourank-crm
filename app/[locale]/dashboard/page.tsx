'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Hash, 
  TrendingUp, 
  Target, 
  Users, 
  BarChart3,
  Search,
  Zap,
  Clock,
  ChevronRight,
  CreditCard
} from 'lucide-react';

interface UserData {
  email: string;
  name: string | null;
  credits: number;
  plan: string;
}

interface RecentAnalysis {
  id: string;
  type: string;
  keyword: string;
  created_at: string;
  status: string;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const [user, setUser] = useState<UserData | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          // User-Daten setzen (mit 500 Credits als Default)
          setUser({
            email: authUser.email || '',
            name: authUser.user_metadata?.name || null,
            credits: 500,
            plan: 'free'
          });

          // Letzte Analysen laden (falls Tabelle existiert)
          try {
            const { data: analyses } = await supabase
              .from('analyses')
              .select('id, type, keyword, created_at, status')
              .eq('user_id', authUser.id)
              .order('created_at', { ascending: false })
              .limit(5);

            if (analyses) {
              setRecentAnalyses(analyses);
            }
          } catch (error) {
            console.log('Analyses table not yet available');
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickAccessCards = [
    {
      id: 'overview',
      title: 'Keywords Overview',
      description: 'All-in-One Keyword Analyse',
      icon: BarChart3,
      href: '/dashboard/keywords/overview-v2',
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500'
    },
    {
      id: 'research',
      title: 'Keyword Research',
      description: 'Neue Keywords finden',
      icon: Search,
      href: '/dashboard/keywords/research',
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-500'
    },
    {
      id: 'competition',
      title: 'Competition',
      description: 'Wettbewerb analysieren',
      icon: Target,
      href: '/dashboard/keywords/competition',
      color: 'from-orange-500/20 to-red-500/20',
      iconColor: 'text-orange-500'
    },
    {
      id: 'trends',
      title: 'Trends',
      description: 'Trend-Analysen',
      icon: TrendingUp,
      href: '/dashboard/keywords/trends',
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-500'
    },
    {
      id: 'audience',
      title: 'Audience',
      description: 'Zielgruppen-Insights',
      icon: Users,
      href: '/dashboard/keywords/audience',
      color: 'from-indigo-500/20 to-blue-500/20',
      iconColor: 'text-indigo-500'
    },
    {
      id: 'performance',
      title: 'Performance',
      description: 'Traffic & Clickstream',
      icon: Zap,
      href: '/dashboard/keywords/performance',
      color: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-500'
    }
  ];

  const stats = [
    {
      title: 'Verfügbare Credits',
      value: user?.credits || 500,
      icon: CreditCard,
      change: null,
      color: 'text-blue-500'
    },
    {
      title: 'Analysen (Monat)',
      value: recentAnalyses.length,
      icon: BarChart3,
      change: null,
      color: 'text-green-500'
    },
    {
      title: 'Aktiver Plan',
      value: user?.plan === 'free' ? 'Free' : 'Pro',
      icon: Zap,
      change: null,
      color: 'text-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Willkommen Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Willkommen zurück{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Hier ist eine Übersicht deiner SEO-Analysen und verfügbaren Tools.
        </p>
      </div>

      {/* Statistiken */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Schnellzugriff Karten */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Schnellzugriff
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.id} href={card.href}>
                <Card className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                      <Icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {card.title}
                      <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Letzte Analysen */}
      {recentAnalyses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Letzte Analysen
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Hash className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{analysis.keyword}</p>
                        <p className="text-sm text-muted-foreground">
                          {analysis.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(analysis.created_at).toLocaleDateString('de-DE')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {analysis.status === 'completed' ? 'Abgeschlossen' : 'In Bearbeitung'}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Call to Action wenn keine Analysen */}
      {recentAnalyses.length === 0 && (
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle>Starte deine erste Analyse</CardTitle>
            <CardDescription>
              Nutze unsere leistungsstarken SEO-Tools, um deine Keywords zu analysieren und deine Sichtbarkeit zu verbessern.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/keywords/overview-v2">
              <Button size="lg">
                Jetzt starten
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
