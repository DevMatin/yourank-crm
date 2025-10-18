import { GlassCard } from '@/components/ui/glass-card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TrendData {
  month: string;
  volume: number;
  trend?: number;
}

interface TrendChartProps {
  data: TrendData[] | null;
  loading?: boolean;
  keyword?: string;
}

export function TrendChart({ data, loading = false, keyword }: TrendChartProps) {
  if (loading || !data || data.length === 0) {
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
            <TrendingUp className="h-5 w-5" style={{color: '#34A7AD'}} />
          </div>
          <h3 className="text-foreground">Search Volume Trend</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <span className="text-muted-foreground">Loading trend data...</span>
        </div>
      </GlassCard>
    );
  }

  // Format data for chart
  const chartData = data.map((item, index) => ({
    ...item,
    month: item.month || `Month ${index + 1}`,
    volume: item.volume || 0
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--glass-card-border)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            color: 'var(--foreground)',
            padding: '12px'
          }}
        >
          <p className="text-sm font-medium">{`Month: ${label}`}</p>
          <p className="text-sm text-foreground">
            {`Search Volume: ${payload[0].value.toLocaleString()}`}
          </p>
          {payload[1] && (
            <p className="text-sm" style={{color: '#10B981'}}>
              {`Trend: ${payload[1].value > 0 ? '+' : ''}${payload[1].value}%`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

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
          <TrendingUp className="h-5 w-5" style={{color: '#34A7AD'}} />
        </div>
        <h3 className="text-foreground">Search Volume Trend</h3>
      </div>
      
      {keyword && (
        <p className="text-sm text-muted-foreground mb-6">
          Trend für "{keyword}" über die letzten 12 Monate
        </p>
      )}
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34A7AD" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34A7AD" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-muted-foreground/20"
            />
            
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            
            <YAxis 
              className="text-xs"
              tick={{ fill: 'var(--muted-foreground)' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              type="monotone" 
              dataKey="volume" 
              stroke="#34A7AD" 
              strokeWidth={3}
              fill="url(#colorVolume)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: '#34A7AD' }}
          ></div>
          <span className="text-muted-foreground">Search Volume</span>
        </div>
      </div>
    </GlassCard>
  );
}
