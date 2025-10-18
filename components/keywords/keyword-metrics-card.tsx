'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KeywordMetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function KeywordMetricsCard({
  title,
  value,
  icon: Icon,
  description,
  trend
}: KeywordMetricsCardProps) {
  return (
    <Card className="group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          {title}
        </CardTitle>
            <div 
              className="flex items-center justify-center"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
                boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
              }}
            >
              <Icon className="h-4 w-4" style={{color: '#34A7AD'}} />
            </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm ${
                trend.isPositive 
                  ? "text-green-600 bg-green-500/20 border border-green-500/30" 
                  : "text-red-600 bg-red-500/20 border border-red-500/30"
              }`}
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              vs. Durchschnitt
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
