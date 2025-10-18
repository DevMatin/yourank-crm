import { GlassCard } from '@/components/ui/glass-card';

interface LoadingSkeletonProps {
  type: 'basics' | 'related' | 'trends' | 'demographics' | 'research';
  className?: string;
}

export function LoadingSkeleton({ type, className = '' }: LoadingSkeletonProps) {
  switch (type) {
    case 'basics':
      return (
        <GlassCard className={`p-6 ${className}`}>
          {/* Header Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-xl animate-pulse"></div>
            <div className="h-6 bg-white/20 dark:bg-white/10 rounded w-32 animate-pulse"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-white/20 dark:bg-white/10 rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-white/20 dark:bg-white/10 rounded w-16 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 dark:bg-white/10 rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-white/20 dark:bg-white/10 rounded w-16 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 dark:bg-white/10 rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-white/20 dark:bg-white/10 rounded w-16 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 dark:bg-white/10 rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-white/20 dark:bg-white/10 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          </div>
        </GlassCard>
      );

    case 'related':
      return (
        <GlassCard className={`p-6 ${className}`}>
          {/* Header Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-xl animate-pulse"></div>
            <div className="h-6 bg-white/20 dark:bg-white/10 rounded w-40 animate-pulse"></div>
          </div>
          
          {/* List Items Skeleton */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 border rounded-xl animate-pulse"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-white/20 dark:bg-white/10 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-white/20 dark:bg-white/10 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-12 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      );

    case 'trends':
      return (
        <GlassCard className={`p-6 ${className}`}>
          {/* Header Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-xl animate-pulse"></div>
            <div className="h-6 bg-white/20 dark:bg-white/10 rounded w-32 animate-pulse"></div>
          </div>
          
          {/* Chart Skeleton */}
          <div className="h-64 w-full">
            <div className="h-full w-full bg-white/20 dark:bg-white/10 rounded-xl animate-pulse"></div>
          </div>
        </GlassCard>
      );

    case 'demographics':
      return (
        <GlassCard className={`p-6 ${className}`}>
          {/* Header Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-xl animate-pulse"></div>
            <div className="h-6 bg-white/20 dark:bg-white/10 rounded w-40 animate-pulse"></div>
          </div>
          
          {/* Chart Skeleton */}
          <div className="h-48 w-full">
            <div className="h-full w-full bg-white/20 dark:bg-white/10 rounded-xl animate-pulse"></div>
          </div>
        </GlassCard>
      );

    case 'research':
      return (
        <GlassCard className={`p-6 ${className}`}>
          {/* Header Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-xl animate-pulse"></div>
            <div className="h-6 bg-white/20 dark:bg-white/10 rounded w-32 animate-pulse"></div>
          </div>
          
          {/* Table Skeleton */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-2 border rounded animate-pulse"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 w-40 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-16 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      );

    default:
      return (
        <GlassCard className={`p-6 ${className}`}>
          <div className="space-y-4">
            <div className="h-4 w-full bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
          </div>
        </GlassCard>
      );
  }
}

// Spezielle Loading-Komponente für die Overview-Seite
export function OverviewLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Keyword Basics */}
      <LoadingSkeleton type="basics" />
      
      {/* Related Keywords */}
      <LoadingSkeleton type="related" />
      
      {/* Trends Chart */}
      <LoadingSkeleton type="trends" />
      
      {/* Demographics */}
      <LoadingSkeleton type="demographics" />
    </div>
  );
}

// Loading-Komponente für Research-Seite
export function ResearchLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton type="research" />
    </div>
  );
}
