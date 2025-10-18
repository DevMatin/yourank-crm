import { GlassCard } from '@/components/ui/glass-card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MousePointer, DollarSign, Eye, Loader2 } from 'lucide-react';

interface TrafficComparisonChartProps {
  organicTraffic: number;
  paidTraffic: number;
  organicCtr: number;
  paidCtr: number;
  loading?: boolean;
}

export function TrafficComparisonChart({ 
  organicTraffic, 
  paidTraffic, 
  organicCtr, 
  paidCtr, 
  loading = false 
}: TrafficComparisonChartProps) {
  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
              boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
            }}
          >
            <TrendingUp className="h-5 w-5" style={{ color: '#34A7AD' }} />
          </div>
          <h3 className="text-foreground">Traffic Comparison</h3>
        </div>
        <div className="h-64 bg-white/20 dark:bg-white/10 animate-pulse rounded-xl"></div>
      </GlassCard>
    );
  }

  const data = [
    {
      name: 'Organic',
      traffic: organicTraffic,
      ctr: organicCtr,
      color: '#10B981'
    },
    {
      name: 'Paid',
      traffic: paidTraffic,
      ctr: paidCtr,
      color: '#34A7AD'
    }
  ];

  const ctrData = [
    { name: 'Organic CTR', value: organicCtr, color: '#10B981' },
    { name: 'Paid CTR', value: paidCtr, color: '#34A7AD' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="border rounded-xl p-3 shadow-lg"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--glass-card-border)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            color: 'var(--foreground)'
          }}
        >
          <p className="font-medium text-foreground">{label} Traffic</p>
          <p className="text-sm text-muted-foreground">
            Volume: {formatNumber(payload[0].value)}
          </p>
          <p className="text-sm text-muted-foreground">
            CTR: {payload[0].payload.ctr.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Traffic Volume Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
              boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
            }}
          >
            <TrendingUp className="h-5 w-5" style={{ color: '#34A7AD' }} />
          </div>
          <h3 className="text-foreground">Traffic Volume Comparison</h3>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-muted-foreground/20"
              />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                tickFormatter={formatNumber}
                className="text-xs"
                tick={{ fill: 'var(--muted-foreground)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="traffic" fill="#34A7AD" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div 
            className="text-center p-3 rounded-xl border"
            style={{ 
              backgroundColor: 'rgba(16,185,129,0.1)',
              borderColor: 'rgba(16,185,129,0.2)'
            }}
          >
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatNumber(organicTraffic)}
            </div>
            <div className="text-sm text-muted-foreground">Organic Traffic</div>
          </div>
          <div 
            className="text-center p-3 rounded-xl border"
            style={{ 
              backgroundColor: 'rgba(52,167,173,0.1)',
              borderColor: 'rgba(52,167,173,0.2)'
            }}
          >
            <div className="text-lg font-bold" style={{ color: '#34A7AD' }}>
              {formatNumber(paidTraffic)}
            </div>
            <div className="text-sm text-muted-foreground">Paid Traffic</div>
          </div>
        </div>
      </GlassCard>

      {/* CTR Comparison Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
              boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
            }}
          >
            <MousePointer className="h-5 w-5" style={{ color: '#34A7AD' }} />
          </div>
          <h3 className="text-foreground">Click-Through Rate Comparison</h3>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ctrData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {ctrData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${Number(value).toFixed(2)}%`}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--glass-card-border)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  color: 'var(--foreground)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* CTR Summary */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></div>
              <span className="text-sm text-foreground">Organic CTR</span>
            </div>
            <span 
              className="px-2 py-0.5 rounded-md text-xs font-medium"
              style={{
                backgroundColor: 'rgba(16,185,129,0.15)',
                color: '#10B981'
              }}
            >
              {organicCtr.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#34A7AD' }}></div>
              <span className="text-sm text-foreground">Paid CTR</span>
            </div>
            <span 
              className="px-2 py-0.5 rounded-md text-xs font-medium"
              style={{
                backgroundColor: 'rgba(52,167,173,0.15)',
                color: '#34A7AD'
              }}
            >
              {paidCtr.toFixed(2)}%
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
