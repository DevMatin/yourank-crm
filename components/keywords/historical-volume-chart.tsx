import { GlassCard } from '@/components/ui/glass-card';
import { 
  getChartGradientDefs, 
  getChartAreaProps, 
  getChartTooltipStyle, 
  getChartGridStyle, 
  getChartAxisStyle,
  getIconContainerStyle
} from '@/lib/utils/theme-helpers';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, Loader2 } from 'lucide-react';

interface HistoricalVolumeChartProps {
  data: any[];
  keyword: string;
  trendDirection: 'up' | 'down' | 'stable';
  peakMonth: string;
  loading?: boolean;
}

export function HistoricalVolumeChart({ 
  data, 
  keyword, 
  trendDirection, 
  peakMonth, 
  loading = false 
}: HistoricalVolumeChartProps) {
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
          <h3 className="text-foreground">Historical Volume Trends</h3>
        </div>
        <div className="h-64 bg-white/20 dark:bg-white/10 animate-pulse rounded-xl"></div>
      </GlassCard>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return '#10b981';
      case 'down':
        return '#ef4444';
      default:
        return '#34A7AD'; // Use primary teal for stable
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="border rounded-xl p-3 shadow-lg"
          style={getChartTooltipStyle()}
        >
          <p className="font-medium text-foreground">{formatDate(label)}</p>
          <p className="text-sm text-muted-foreground">
            Volume: {formatNumber(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard className="p-6">
      {/* Header mit Icon Container Pattern */}
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
        <h3 className="text-foreground">Historical Volume Trends für "{keyword}"</h3>
      </div>

      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          className="text-center p-4 rounded-xl border"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {getTrendIcon()}
            <span className="text-sm font-medium text-foreground capitalize">{trendDirection}</span>
          </div>
          <div className="text-xs text-muted-foreground">Trend Direction</div>
        </div>
        
        <div 
          className="text-center p-4 rounded-xl border"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="h-4 w-4" style={{ color: '#34A7AD' }} />
            <span className="text-sm font-medium text-foreground">{formatDate(peakMonth)}</span>
          </div>
          <div className="text-xs text-muted-foreground">Peak Month</div>
        </div>
        
        <div 
          className="text-center p-4 rounded-xl border"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm font-medium text-foreground">{data.length}</span>
          </div>
          <div className="text-xs text-muted-foreground">Data Points</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getTrendColor()} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={getTrendColor()} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-muted-foreground/20"
            />
            
            <XAxis 
              dataKey="month" 
              tickFormatter={formatDate}
              className="text-xs"
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            
            <YAxis 
              tickFormatter={formatNumber}
              className="text-xs"
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              type="monotone" 
              dataKey="search_volume" 
              stroke={getTrendColor()}
              strokeWidth={3}
              fill="url(#colorVolume)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Stats */}
      {data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#34A7AD' }}>
              {formatNumber(Math.max(...data.map(d => d.search_volume || 0)))}
            </div>
            <div className="text-xs text-muted-foreground">Peak Volume</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#34A7AD' }}>
              {formatNumber(Math.min(...data.map(d => d.search_volume || 0)))}
            </div>
            <div className="text-xs text-muted-foreground">Min Volume</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#34A7AD' }}>
              {formatNumber(data.reduce((sum, d) => sum + (d.search_volume || 0), 0) / data.length)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Volume</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#34A7AD' }}>
              {data.length > 1 ? (
                ((data[data.length - 1].search_volume || 0) - (data[0].search_volume || 0)) / (data[0].search_volume || 1) * 100
              ).toFixed(1) : '0'}%
            </div>
            <div className="text-xs text-muted-foreground">Total Change</div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
