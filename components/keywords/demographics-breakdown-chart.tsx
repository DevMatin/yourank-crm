import { GlassCard } from '@/components/ui/glass-card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Users, Smartphone, Monitor, Loader2, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { 
  createChartSegment, 
  calculateDonutSegments, 
  calculateDonutSegmentPath,
  CHART_CLASSES 
} from '@/lib/utils/chart-helpers';

interface DemographicsBreakdownChartProps {
  ageGroups: any[];
  deviceDistribution: any;
  loading?: boolean;
}

export function DemographicsBreakdownChart({ 
  ageGroups, 
  deviceDistribution, 
  loading = false 
}: DemographicsBreakdownChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <h3 className="text-foreground">Age Distribution</h3>
          </div>
          <div className="h-64 bg-white/20 dark:bg-white/10 animate-pulse rounded-xl"></div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
                boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
              }}
            >
              <Smartphone className="h-5 w-5" style={{ color: '#34A7AD' }} />
            </div>
            <h3 className="text-foreground">Device Distribution</h3>
          </div>
          <div className="h-64 bg-white/20 dark:bg-white/10 animate-pulse rounded-xl"></div>
        </GlassCard>
      </div>
    );
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

  // Process age groups data with global utilities
  const maxPercentage = Math.max(...ageGroups.map(g => g.percentage || 0));
  const ageData = ageGroups
    .map((group, index) => {
      // Berechne count basierend auf percentage falls nicht vorhanden
      const count = group.count || Math.round((group.percentage || 0) * 100); // Fallback: percentage * 100
      
      return createChartSegment(
        {
          name: group.age_group || `Group ${index + 1}`,
          value: group.percentage || 0,
          count: count
        },
        index,
        maxPercentage
      );
    })
    .sort((a, b) => b.value - a.value); // Sortiere nach Wert (höchste zuerst)

  // Process device distribution data
  const deviceData = [
    { name: 'Mobile', value: deviceDistribution.mobile || 0, color: '#10B981' },
    { name: 'Desktop', value: deviceDistribution.desktop || 0, color: '#34A7AD' },
    { name: 'Tablet', value: deviceDistribution.tablet || 0, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
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
          <p className="font-medium text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Age Distribution */}
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
          <h3 className="text-foreground">Age Distribution</h3>
        </div>
        
        {ageData.length > 0 ? (
          <>
            <div className="h-64 flex items-center justify-center">
              <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                  <defs>
                    {ageData.map((item, index) => (
                      <linearGradient key={index} id={item.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={`rgba(52,167,173,${item.alphaPrimary})`} />
                        <stop offset="100%" stopColor={`rgba(94,210,217,${item.alphaSecondary})`} />
                      </linearGradient>
                    ))}
                  </defs>
                  
                  {(() => {
                    const segments = calculateDonutSegments(ageData);
                    
                    return ageData.map((segment, index) => {
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
                          stroke="rgba(52, 167, 173, 0.4)"
                          strokeWidth="1"
                          className={CHART_CLASSES.radialSegment}
                          style={{
                            filter: hoveredIndex === index 
                              ? 'drop-shadow(0 0 8px rgba(52, 167, 173, 0.4))'
                              : 'drop-shadow(0 0 4px rgba(52, 167, 173, 0.2))'
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
                      {ageData.reduce((max, item) => item.value > max.value ? item : max, ageData[0])?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {ageData.reduce((max, item) => item.value > max.value ? item : max, ageData[0])?.value.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Age Groups Summary */}
            <div className="space-y-2 mt-4">
              {ageData.map((item, index) => (
                <div 
                  key={index} 
                  className={`${CHART_CLASSES.legendItem} ${hoveredIndex === index ? 'bg-opacity-10' : ''}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={CHART_CLASSES.indicator}
                      style={{ 
                        background: `linear-gradient(145deg, 
                          rgba(52,167,173,${item.alphaPrimary}),
                          rgba(94,210,217,${item.alphaSecondary})
                        )`
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                    </div>
                  </div>
                  <span className={CHART_CLASSES.badge}>
                    {item.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Altersgruppen-Daten verfügbar</p>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Device Distribution */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
              boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
            }}
          >
            <Smartphone className="h-5 w-5" style={{ color: '#34A7AD' }} />
          </div>
          <h3 className="text-foreground">Device Distribution</h3>
        </div>
        
        {deviceData.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    className="text-xs"
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <Tooltip 
                    formatter={(value) => `${Number(value).toFixed(1)}%`}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--glass-card-border)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Bar dataKey="value" fill="#34A7AD" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Device Summary */}
            <div className="space-y-2 mt-4">
              {deviceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.name === 'Mobile' && <Smartphone className="h-4 w-4 text-muted-foreground" />}
                    {item.name === 'Desktop' && <Monitor className="h-4 w-4 text-muted-foreground" />}
                    {item.name === 'Tablet' && <Smartphone className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${item.value}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                    <span 
                      className="px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: 'rgba(52,167,173,0.15)',
                        color: '#34A7AD'
                      }}
                    >
                      {item.value.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Geräte-Daten verfügbar</p>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
