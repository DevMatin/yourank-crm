'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentAnalysisCard } from '@/components/dashboard/recent-analysis-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ActivityChart } from '@/components/dashboard/activity-chart';
import { useRealtime } from '@/components/providers/realtime-provider';
import { DatabaseUser, DatabaseAnalysis, DatabaseProject } from '@/types/database';
import { 
  BarChart3, 
  CreditCard, 
  FolderOpen, 
  TrendingUp 
} from 'lucide-react';

interface DashboardStats {
  totalAnalyses: number;
  totalCreditsUsed: number;
  activeProjects: number;
  analysesThisMonth: number;
}

interface ActivityData {
  date: string;
  analyses: number;
  credits: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<DatabaseUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    totalCreditsUsed: 0,
    activeProjects: 0,
    analysesThisMonth: 0
  });
  const [recentAnalyses, setRecentAnalyses] = useState<(DatabaseAnalysis & {
    projects?: DatabaseProject | null;
  })[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const { subscribeToAnalyses, subscribeToUserUpdates } = useRealtime();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userData) {
          setUser(userData);
        }

        // Get stats
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);

        const { data: analysesData } = await supabase
          .from('analyses')
          .select('credits_used, created_at')
          .eq('user_id', authUser.id);

        const { data: projectsData } = await supabase
          .from('projects')
          .select('id')
          .eq('user_id', authUser.id);

        // Calculate stats
        const totalAnalyses = analysesData?.length || 0;
        const totalCreditsUsed = analysesData?.reduce((sum, a) => sum + a.credits_used, 0) || 0;
        const activeProjects = projectsData?.length || 0;
        const analysesThisMonth = analysesData?.filter(a => 
          new Date(a.created_at) >= currentMonth
        ).length || 0;

        setStats({
          totalAnalyses,
          totalCreditsUsed,
          activeProjects,
          analysesThisMonth
        });

        // Get recent analyses
        const { data: recentData } = await supabase
          .from('analyses')
          .select(`
            *,
            projects (
              id,
              name,
              domain
            )
          `)
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentAnalyses(recentData || []);

        // Generate activity data (last 7 days)
        const activityData: ActivityData[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('de-DE', { 
            day: '2-digit', 
            month: '2-digit' 
          });

          const dayAnalyses = analysesData?.filter(a => {
            const analysisDate = new Date(a.created_at);
            return analysisDate.toDateString() === date.toDateString();
          }) || [];

          activityData.push({
            date: dateStr,
            analyses: dayAnalyses.length,
            credits: dayAnalyses.reduce((sum, a) => sum + a.credits_used, 0)
          });
        }

        setActivityData(activityData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubscribeAnalyses = subscribeToAnalyses((analysis) => {
      // Refresh dashboard data when analysis status changes
      fetchDashboardData();
    });

    const unsubscribeUser = subscribeToUserUpdates((userUpdates) => {
      // Update user data when credits change
      setUser(prev => prev ? { ...prev, ...userUpdates } : null);
    });

    return () => {
      unsubscribeAnalyses();
      unsubscribeUser();
    };
  }, [subscribeToAnalyses, subscribeToUserUpdates]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-lg border animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Gesamt Analysen"
          value={stats.totalAnalyses}
          description="Alle durchgeführten Analysen"
          icon={BarChart3}
          trend={{
            value: stats.analysesThisMonth > 0 ? Math.round((stats.analysesThisMonth / Math.max(stats.totalAnalyses - stats.analysesThisMonth, 1)) * 100) : 0,
            isPositive: true
          }}
        />
        <StatCard
          title="Verbrauchte Credits"
          value={stats.totalCreditsUsed}
          description="Credits insgesamt verwendet"
          icon={CreditCard}
        />
        <StatCard
          title="Aktive Projekte"
          value={stats.activeProjects}
          description="Projekte in Bearbeitung"
          icon={FolderOpen}
        />
        <StatCard
          title="Credits verfügbar"
          value={user?.credits || 0}
          description="Verfügbare Credits"
          icon={TrendingUp}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAnalysisCard analyses={recentAnalyses} />
        <ActivityChart data={activityData} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}