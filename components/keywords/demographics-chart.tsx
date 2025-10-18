import { GlassCard } from '@/components/ui/glass-card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, AlertTriangle, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  calculateChartGradient, 
  createChartSegment, 
  calculateDonutSegments, 
  calculateDonutSegmentPath,
  CHART_CLASSES,
  CHART_VARS 
} from '@/lib/utils/chart-helpers';

interface DemographicsData {
  age_group: string;
  percentage: number;
  count?: number;
  gender?: string;
  region?: string;
}

interface DemographicsChartProps {
  data: DemographicsData[] | null;
  loading?: boolean;
  keyword?: string;
  type?: 'age' | 'gender' | 'region';
}

type VariantType = 'horizontal-bars' | 'vertical-columns' | 'radial';

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
  const t = useTranslations('keywords');
  const [variant, setVariant] = useState<VariantType>('horizontal-bars');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getTitle = () => {
    switch (type) {
      case 'age': return t('ageDistribution');
      case 'gender': return t('genderDistribution');
      case 'region': return t('regionalDistribution');
      default: return t('demographics');
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'age': return t('ageDistributionDescription');
      case 'gender': return t('genderDistributionDescription');
      case 'region': return t('regionalDistributionDescription');
      default: return t('demographicsDescription');
    }
  };

  // Format data for chart using global utilities
  const maxPercentage = Math.max(...(data?.map(d => d.percentage) || [0]));
  
  const chartData = data?.map((item, index) => 
    createChartSegment(
      {
        name: item.age_group || item.gender || item.region || `Group ${index + 1}`,
        value: item.percentage,
        count: item.count
      },
      index,
      maxPercentage
    )
  )?.sort((a, b) => b.value - a.value) || []; // Sortiere nach Wert (höchste zuerst)
  

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
          <h3 className="text-foreground">{getTitle()}</h3>
          {!loading && (!data || data.length === 0) && (
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          )}
        </div>
        <div className="h-48 w-full bg-white/20 dark:bg-white/10 animate-pulse rounded-xl flex items-center justify-center">
          <div className="text-center">
            <span className="text-muted-foreground">
              {loading ? t('loadingDemographics') : t('noDemographicsData')}
            </span>
            {!loading && (!data || data.length === 0) && (
              <p className="text-xs text-orange-500 mt-1">
                {t('demographicsDataNotLoaded')}
              </p>
            )}
          </div>
        </div>
      </GlassCard>
    );
  }



  // Horizontal Bars Component
  const HorizontalBars = () => {
    return (
      <div className="space-y-6">
        {chartData.map((group, index) => {
      return (
        <div 
              key={group.name} 
              className="space-y-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Label Row */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{group.name}</span>
              </div>

              {/* Bar */}
              <div className="h-8 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 relative overflow-hidden">
                <div
                  className="h-full rounded-xl chart-gradient-primary relative flex items-center justify-center"
                  style={{
                    width: `${group.value}%`,
                    background: `linear-gradient(145deg, 
                      rgba(52,167,173,${group.alphaPrimary || 0.5}),
                      rgba(94,210,217,${group.alphaSecondary || 0.3})
                    )`,
                    transform: hoveredIndex === index ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: hoveredIndex === index 
                      ? `0 0 20px rgba(52, 167, 173, ${0.3 + (group.intensity || 0) * 0.3})`
                      : 'none'
                  }}
                >
                  {/* Percentage Text inside Bar */}
                  <span 
                    className="text-xs font-semibold px-2"
          style={{
                      color: (group.intensity || 0) > 0.4 ? '#ffffff' : '#1f2937',
                      textShadow: (group.intensity || 0) > 0.4 
                        ? '0 1px 3px rgba(0,0,0,0.5)' 
                        : '0 1px 3px rgba(255,255,255,0.8)',
                      fontWeight: '600'
                    }}
                  >
                    {group.value.toFixed(1)}%
                  </span>
                  
                  {/* Shimmer Effect */}
                  {hoveredIndex === index && (
                    <div className="chart-shimmer" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      );
  };

  // Vertical Columns Component
  const VerticalColumns = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-3 h-64">
          {chartData.map((group, index) => {
            
            const height = (group.value / maxPercentage) * 100;
            
            return (
              <div 
                key={group.name} 
                className="flex-1 flex flex-col items-center gap-3"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Percentage Badge */}
                <div className="px-3 py-1 rounded-lg text-xs font-medium bg-white/20 dark:bg-white/10 text-foreground">
                  {group.value.toFixed(1)}%
                </div>

                {/* Column */}
                <div 
                  className="w-full rounded-t-xl relative transition-all duration-700"
                  style={{ 
                    height: `${height}px`,
                    background: `linear-gradient(to top,
                      rgba(52,167,173,${group.alphaPrimary || 0.5}),
                      rgba(94,210,217,${group.alphaSecondary || 0.3})
                    )`,
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: hoveredIndex === index 
                      ? `0 0 20px rgba(52, 167, 173, ${0.3 + (group.intensity || 0) * 0.3})`
                      : 'none'
                  }}
                >
                </div>

                {/* Age Label */}
                <span className="text-xs text-muted-foreground text-center">
                  {group.name}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {chartData.map((item, index) => (
            <div key={index} className="chart-legend-item">
              <div className="flex items-center gap-2">
                <div className="chart-indicator" />
                <span className="text-sm text-foreground">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{item.value.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Radial Chart Component
  const RadialChart = () => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // Start at top
    
    const segments = chartData.map((group) => {
      const angle = (group.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      return { ...group, startAngle, endAngle };
    });

    const dominantGroup = chartData.reduce((max, item) => 
      item.value > max.value ? item : max, chartData[0]
    );

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="256" height="256" viewBox="0 0 200 200" className="transform -rotate-90">
              <defs>
                {segments.map((segment, index) => {
                  // Stärkere Farbdifferenzierung für bessere Unterscheidung
                  const intensity = segment.value / maxPercentage;
                  
                  // Erste 3 Segmente bekommen deutlich unterschiedliche Intensitäten
                  let alphaPrimary, alphaSecondary;
                  if (index === 0) {
                    // Höchster Wert - sehr intensiv
                    alphaPrimary = 0.9;
                    alphaSecondary = 0.7;
                  } else if (index === 1) {
                    // Zweiter Wert - mittlere Intensität
                    alphaPrimary = 0.6;
                    alphaSecondary = 0.4;
                  } else if (index === 2) {
                    // Dritter Wert - schwächere Intensität
                    alphaPrimary = 0.4;
                    alphaSecondary = 0.25;
                  } else {
                    // Restliche Werte - sehr schwach
                    alphaPrimary = 0.25 + (intensity * 0.2);
                    alphaSecondary = 0.15 + (intensity * 0.15);
                  }
                  
                  return (
                    <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={`rgba(52,167,173,${alphaPrimary})`} />
                      <stop offset="100%" stopColor={`rgba(94,210,217,${alphaSecondary})`} />
                    </linearGradient>
                  );
                })}
              </defs>
              
              {segments.map((segment, index) => {
                const centerX = 100;
                const centerY = 100;
                const outerRadius = hoveredIndex === index ? 95 : 90;
                const innerRadius = hoveredIndex === index ? 55 : 60;
                
                const startAngleRad = (segment.startAngle * Math.PI) / 180;
                const endAngleRad = (segment.endAngle * Math.PI) / 180;
                
                const x1 = centerX + outerRadius * Math.cos(startAngleRad);
                const y1 = centerY + outerRadius * Math.sin(startAngleRad);
                const x2 = centerX + outerRadius * Math.cos(endAngleRad);
                const y2 = centerY + outerRadius * Math.sin(endAngleRad);
                
                const x3 = centerX + innerRadius * Math.cos(endAngleRad);
                const y3 = centerY + innerRadius * Math.sin(endAngleRad);
                const x4 = centerX + innerRadius * Math.cos(startAngleRad);
                const y4 = centerY + innerRadius * Math.sin(startAngleRad);
                
                const largeArcFlag = segment.endAngle - segment.startAngle <= 180 ? "0" : "1";
                
                const path = `
                  M ${x1} ${y1}
                  A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
                  L ${x3} ${y3}
                  A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
                  Z
                `;
                
                return (
                  <path
                    key={index}
                    d={path}
                    fill={`url(#gradient-${index})`}
                    stroke="rgba(52, 167, 173, 0.4)"
                    strokeWidth="1"
                    className="transition-all duration-300 cursor-pointer"
                    style={{
                      filter: hoveredIndex === index 
                        ? 'drop-shadow(0 0 8px rgba(52, 167, 173, 0.4))'
                        : 'drop-shadow(0 0 4px rgba(52, 167, 173, 0.2))'
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{dominantGroup.name}</div>
                <div className="text-sm text-muted-foreground">{dominantGroup.value.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {chartData.map((group, index) => {
            // Gleiche Farblogik wie im Chart
            let alphaPrimary, alphaSecondary;
            if (index === 0) {
              alphaPrimary = 0.9;
              alphaSecondary = 0.7;
            } else if (index === 1) {
              alphaPrimary = 0.6;
              alphaSecondary = 0.4;
            } else if (index === 2) {
              alphaPrimary = 0.4;
              alphaSecondary = 0.25;
            } else {
              const intensity = group.value / maxPercentage;
              alphaPrimary = 0.25 + (intensity * 0.2);
              alphaSecondary = 0.15 + (intensity * 0.15);
            }
            
            return (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-xl border transition-all duration-300"
                style={{ 
                  backgroundColor: hoveredIndex === index 
                    ? 'rgba(52,167,173,0.1)' 
                    : 'var(--glass-card-bg)',
                  borderColor: 'var(--glass-card-border)'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Color Indicator */}
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ 
                      background: `linear-gradient(145deg, 
                        rgba(52,167,173,${alphaPrimary}),
                        rgba(94,210,217,${alphaSecondary})
                      )`
                    }}
                  />
                  
                  {/* Label */}
                  <div>
                    <div className="text-sm font-medium text-foreground">{group.name}</div>
                  </div>
                </div>

                {/* Percentage Badge */}
                <div 
                  className="px-3 py-1 rounded-lg text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(52,167,173,0.15)',
                    color: '#34A7AD'
                  }}
                >
                  {group.value.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <GlassCard className="p-6">
      {/* Header mit Icon Container Pattern */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
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
        
        {/* Filter Toggle */}
        <div className="chart-toggle">
          <button
            onClick={() => setVariant('horizontal-bars')}
            className={`chart-toggle-button ${variant === 'horizontal-bars' ? 'active' : ''}`}
          >
            <BarChart3 className="w-4 h-4" />
            Bars
          </button>
          
          <button
            onClick={() => setVariant('vertical-columns')}
            className={`chart-toggle-button ${variant === 'vertical-columns' ? 'active' : ''}`}
          >
            <BarChart3 className="w-4 h-4 rotate-90" />
            Columns
          </button>
          
          <button
            onClick={() => setVariant('radial')}
            className={`chart-toggle-button ${variant === 'radial' ? 'active' : ''}`}
          >
            <PieChartIcon className="w-4 h-4" />
            Radial
          </button>
        </div>
      </div>
      
      {keyword && (
        <p className="text-sm text-muted-foreground mb-6">
          {getDescription()} für "{keyword}"
        </p>
      )}

      {/* Chart Variants */}
      <div className="animate-in fade-in duration-300">
        {variant === 'horizontal-bars' && <HorizontalBars />}
        {variant === 'vertical-columns' && <VerticalColumns />}
        {variant === 'radial' && <RadialChart />}
      </div>
    </GlassCard>
  );
}
