import { GlassCard } from '@/components/ui/glass-card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users } from 'lucide-react';

interface DemographicsData {
  age_group: string;
  percentage: number;
  gender?: string;
  region?: string;
}

interface DemographicsChartProps {
  data: DemographicsData[] | null;
  loading?: boolean;
  keyword?: string;
  type?: 'age' | 'gender' | 'region';
}

const COLORS = [
  '#34A7AD',  // Primary Teal
  '#5ED2D9',  // Light Teal
  '#10B981',  // Success Green
  '#F59E0B',  // Warning Orange
  '#EF4444',  // Error Red
  '#3B82F6',  // Info Blue
  '#8B5CF6',  // Purple
  '#F97316'   // Orange
];

export function DemographicsChart({ 
  data, 
  loading = false, 
  keyword, 
  type = 'age' 
}: DemographicsChartProps) {
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
            <Users className="h-5 w-5" style={{ color: '#34A7AD' }} />
          </div>
          <h3 className="text-foreground">Demographics</h3>
        </div>
        <div className="h-48 w-full bg-white/20 dark:bg-white/10 animate-pulse rounded-xl flex items-center justify-center">
          <span className="text-muted-foreground">Loading demographics...</span>
        </div>
      </GlassCard>
    );
  }

  // Format data for chart
  const chartData = data.map((item, index) => ({
    name: item.age_group || item.gender || item.region || `Group ${index + 1}`,
    value: item.percentage || 0,
    fill: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
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
          <p className="text-sm font-medium text-foreground">{data.name}</p>
          <p className="text-sm" style={{ color: '#34A7AD' }}>
            {`${data.value.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const getTitle = () => {
    switch (type) {
      case 'age': return 'Age Distribution';
      case 'gender': return 'Gender Distribution';
      case 'region': return 'Regional Distribution';
      default: return 'Demographics';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'age': return 'Altersverteilung der Nutzer';
      case 'gender': return 'Geschlechterverteilung der Nutzer';
      case 'region': return 'Regionale Verteilung der Nutzer';
      default: return 'Demografische Verteilung';
    }
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
          <Users className="h-5 w-5" style={{ color: '#34A7AD' }} />
        </div>
        <h3 className="text-foreground">{getTitle()}</h3>
      </div>
      
      {keyword && (
        <p className="text-sm text-muted-foreground mb-6">
          {getDescription()} für "{keyword}"
        </p>
      )}

      {/* Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#34A7AD"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Data Table */}
      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.fill }}
              ></div>
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-medium text-foreground">{item.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
