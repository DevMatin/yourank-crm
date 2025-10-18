'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityData {
  date: string;
  analyses: number;
  credits: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  if (data.length === 0) {
    return (
      <GlassCard className="p-6">
        <h3 className="mb-6 text-foreground">Aktivität (letzte 7 Tage)</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Keine Daten verfügbar</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <h3 className="mb-6 text-foreground">Aktivität (letzte 7 Tage)</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34A7AD" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34A7AD" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-muted-foreground/20"
            />
            
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            
            <YAxis 
              className="text-xs"
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--glass-card-border)',
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                color: 'var(--foreground)'
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="analyses" 
              stroke="#34A7AD" 
              strokeWidth={3}
              fill="url(#colorAnalyses)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
