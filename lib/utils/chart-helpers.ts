/**
 * Global Chart System Utilities
 * Zentrale Funktionen für alle Chart-Komponenten
 */

export interface ChartGradientConfig {
  intensity: number;
  alphaPrimary: number;
  alphaSecondary: number;
}

export interface ChartSegment {
  name: string;
  value: number;
  count?: number;
  intensity: number;
  alphaPrimary: number;
  alphaSecondary: number;
  gradientId: string;
}

/**
 * Berechnet intensity-based Türkis-Gradient-Werte
 */
export function calculateChartGradient(value: number, maxValue: number): ChartGradientConfig {
  const intensity = value / maxValue;
  const alphaPrimary = 0.5 + (intensity * 0.5); // 0.5 - 1.0
  const alphaSecondary = 0.3 + (intensity * 0.4); // 0.3 - 0.7
  
  return {
    intensity,
    alphaPrimary,
    alphaSecondary
  };
}

/**
 * Erstellt Chart-Segment mit Gradient-Konfiguration
 */
export function createChartSegment(
  data: { name: string; value: number; count?: number },
  index: number,
  maxValue: number
): ChartSegment {
  const gradient = calculateChartGradient(data.value, maxValue);
  
  return {
    name: data.name,
    value: data.value,
    count: data.count || 0,
    intensity: gradient.intensity,
    alphaPrimary: gradient.alphaPrimary,
    alphaSecondary: gradient.alphaSecondary,
    gradientId: `chart-gradient-${index}`
  };
}

/**
 * Generiert SVG linearGradient Definition
 */
export function generateSVGGradient(
  gradientId: string,
  alphaPrimary: number,
  alphaSecondary: number,
  isSuccess = false
): string {
  const primaryColor = isSuccess ? '16,185,129' : '52,167,173';
  const secondaryColor = isSuccess ? '16,185,129' : '94,210,217';
  
  return `
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="rgba(${primaryColor},${alphaPrimary})" />
      <stop offset="100%" stopColor="rgba(${secondaryColor},${alphaSecondary})" />
    </linearGradient>
  `;
}

/**
 * Berechnet SVG-Path für Donut-Segment
 */
export function calculateDonutSegmentPath(
  startAngle: number,
  endAngle: number,
  outerRadius: number,
  innerRadius: number,
  centerX = 100,
  centerY = 100
): string {
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  
  const x1 = centerX + outerRadius * Math.cos(startAngleRad);
  const y1 = centerY + outerRadius * Math.sin(startAngleRad);
  const x2 = centerX + outerRadius * Math.cos(endAngleRad);
  const y2 = centerY + outerRadius * Math.sin(endAngleRad);
  
  const x3 = centerX + innerRadius * Math.cos(endAngleRad);
  const y3 = centerY + innerRadius * Math.sin(endAngleRad);
  const x4 = centerX + innerRadius * Math.cos(startAngleRad);
  const y4 = centerY + innerRadius * Math.sin(startAngleRad);
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return `
    M ${x1} ${y1}
    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
    L ${x3} ${y3}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
    Z
  `;
}

/**
 * Berechnet alle Segmente für Donut-Chart
 */
export function calculateDonutSegments(
  data: Array<{ value: number }>,
  startAngle = -90
): Array<{ startAngle: number; endAngle: number }> {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = startAngle;
  
  return data.map((item) => {
    const angle = (item.value / total) * 360;
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle = end;
    
    return { startAngle: start, endAngle: end };
  });
}

/**
 * CSS-Klassen für Chart-Elemente
 */
export const CHART_CLASSES = {
  container: 'chart-container',
  bar: 'chart-bar',
  column: 'chart-column',
  radialSegment: 'chart-radial-segment',
  gradientPrimary: 'chart-gradient-primary',
  gradientSecondary: 'chart-gradient-secondary',
  gradientSuccess: 'chart-gradient-success',
  shimmer: 'chart-shimmer',
  shimmerVertical: 'chart-shimmer-vertical',
  badge: 'chart-badge',
  legendItem: 'chart-legend-item',
  indicator: 'chart-indicator',
  indicatorSuccess: 'chart-indicator-success',
  toggle: 'chart-toggle',
  toggleButton: 'chart-toggle-button',
  toggleButtonActive: 'chart-toggle-button active'
} as const;

/**
 * CSS-Variablen für Chart-System
 */
export const CHART_VARS = {
  primary: 'var(--chart-primary)',
  secondary: 'var(--chart-secondary)',
  success: 'var(--chart-success)',
  glowColor: 'var(--chart-glow-color)',
  glowHover: 'var(--chart-glow-hover)',
  borderColor: 'var(--chart-border-color)',
  hoverScale: 'var(--chart-hover-scale)',
  columnHoverScale: 'var(--chart-column-hover-scale)',
  radialHoverScale: 'var(--chart-radial-hover-scale)',
  transitionFast: 'var(--chart-transition-fast)',
  transitionSmooth: 'var(--chart-transition-smooth)',
  transitionBounce: 'var(--chart-transition-bounce)',
  barHeight: 'var(--chart-bar-height)',
  columnMaxHeight: 'var(--chart-column-max-height)',
  radialSize: 'var(--chart-radial-size)',
  radialOuterRadius: 'var(--chart-radial-outer-radius)',
  radialInnerRadius: 'var(--chart-radial-inner-radius)',
  radialHoverOuter: 'var(--chart-radial-hover-outer)',
  radialHoverInner: 'var(--chart-radial-hover-inner)',
  gap: 'var(--chart-gap)',
  padding: 'var(--chart-padding)',
  borderRadius: 'var(--chart-border-radius)',
  borderRadiusLg: 'var(--chart-border-radius-lg)',
  borderRadiusXl: 'var(--chart-border-radius-xl)'
} as const;


