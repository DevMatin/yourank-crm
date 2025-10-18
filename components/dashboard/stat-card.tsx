'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className
}: StatCardProps) {
  return (
    <GlassCard className={cn("p-6", className)}>
      {/* Header mit Icon Container Pattern */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">
          {title}
        </h3>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
            boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
          }}
        >
          <Icon className="h-5 w-5" style={{ color: '#34A7AD' }} />
        </div>
      </div>
      
      {/* Value */}
      <div className="text-2xl font-bold text-foreground mb-2">
        {value}
      </div>
      
      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground mb-3">
          {description}
        </p>
      )}
      
      {/* Trend */}
      {trend && (
        <div className="flex items-center">
          <span
            className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            vs. letzter Monat
          </span>
        </div>
      )}
    </GlassCard>
  );
}
