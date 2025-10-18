import { GlassCard } from '@/components/ui/glass-card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MousePointer, DollarSign, Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { 
  calculateDonutSegments, 
  calculateDonutSegmentPath,
  CHART_CLASSES 
} from '@/lib/utils/chart-helpers';

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    { 
      name: 'Organic CTR', 
      value: organicCtr, 
      color: '#10B981', 
      gradientId: 'organic-gradient',
      count: Math.round(organicCtr * 1000) // Realistische Anzahl basierend auf CTR
    },
    { 
      name: 'Paid CTR', 
      value: paidCtr, 
      color: '#34A7AD', 
      gradientId: 'paid-gradient',
      count: Math.round(paidCtr * 1000) // Realistische Anzahl basierend auf CTR
    }
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
        
        <div className="h-64 flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
              <defs>
                {/* Organic Gradient (Green) */}
                <linearGradient id="organic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(16,185,129,0.8)" />
                  <stop offset="100%" stopColor="rgba(16,185,129,0.6)" />
                </linearGradient>
                
                {/* Paid Gradient (Teal) */}
                <linearGradient id="paid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(52,167,173,0.8)" />
                  <stop offset="100%" stopColor="rgba(94,210,217,0.6)" />
                </linearGradient>
              </defs>
              
              {(() => {
                const segments = calculateDonutSegments(ctrData);
                
                return ctrData.map((segment, index) => {
                  const segmentData = segments[index];
                  const outerRadius = hoveredIndex === index ? 100 : 95;
                  const innerRadius = hoveredIndex === index ? 55 : 60;
                  
                  const path = calculateDonutSegmentPath(
                    segmentData.startAngle,
                    segmentData.endAngle,
                    outerRadius,
                    innerRadius
                  );
                  
                  return (
                    <path
                      key={index}
                      d={path}
                      fill={`url(#${segment.gradientId})`}
                      stroke={segment.color === '#10B981' ? 'rgba(16,185,129,0.4)' : 'rgba(52,167,173,0.4)'}
                      strokeWidth="1"
                      className={CHART_CLASSES.radialSegment}
                      style={{
                        filter: hoveredIndex === index 
                          ? `drop-shadow(0 0 8px ${segment.color === '#10B981' ? 'rgba(16,185,129,0.4)' : 'rgba(52,167,173,0.4)'})`
                          : `drop-shadow(0 0 4px ${segment.color === '#10B981' ? 'rgba(16,185,129,0.2)' : 'rgba(52,167,173,0.2)'})`
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                });
              })()}
            </svg>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">
                  {organicCtr > paidCtr ? 'Organic CTR' : 'Paid CTR'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.max(organicCtr, paidCtr).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTR Summary */}
        <div className="space-y-3 mt-4">
          {ctrData.map((item, index) => (
            <div 
              key={index}
              className={`${CHART_CLASSES.legendItem} ${hoveredIndex === index ? 'bg-opacity-10' : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`${CHART_CLASSES.indicator} ${item.color === '#10B981' ? CHART_CLASSES.indicatorSuccess : ''}`}
                  style={{ 
                    background: item.color === '#10B981' 
                      ? 'linear-gradient(145deg, rgba(16,185,129,0.8), rgba(16,185,129,0.6))'
                      : 'linear-gradient(145deg, rgba(52,167,173,0.8), rgba(94,210,217,0.6))'
                  }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{item.name}</div>
                </div>
              </div>
              <span 
                className={CHART_CLASSES.badge}
                style={{
                  backgroundColor: item.color === '#10B981' 
                    ? 'rgba(16,185,129,0.15)' 
                    : 'rgba(52,167,173,0.15)',
                  color: item.color
                }}
              >
                {item.value.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
