/**
 * YouRank Design System 2.0 - Theme Helper Functions
 * 
 * Utility functions für konsistente Theme-Verwendung in Komponenten.
 */

import { themeConfig, createStatusBadge, createIconContainer, createGlassCard, createListItemBox, getColorWithOpacity, StatusType } from '@/config/theme.config';

// Status Badge Helper
export const getStatusBadgeStyle = (status: StatusType) => {
  return createStatusBadge(status);
};

// Icon Container Helper
export const getIconContainerStyle = (color?: string) => {
  return createIconContainer(color);
};

// Glass Card Helper
export const getGlassCardStyle = () => {
  return createGlassCard();
};

// List Item Box Helper
export const getListItemBoxStyle = () => {
  return createListItemBox();
};

// Chart Gradient Helper
export const getChartGradientDefs = (id: string, color?: string) => {
  const gradient = {
    id,
    stops: [
      { offset: '5%', color: color || themeConfig.colors.primary, opacity: themeConfig.charts.gradientOpacityStart },
      { offset: '95%', color: color || themeConfig.colors.primary, opacity: themeConfig.charts.gradientOpacityEnd }
    ]
  };
  
  return gradient;
};

// Chart Area Props Helper
export const getChartAreaProps = (dataKey: string, gradientId: string, color?: string) => ({
  type: 'monotone' as const,
  dataKey,
  stroke: color || themeConfig.colors.primary,
  strokeWidth: themeConfig.charts.strokeWidth,
  fill: `url(#${gradientId})`,
});

// Chart Tooltip Style Helper
export const getChartTooltipStyle = () => ({
  backgroundColor: themeConfig.colors.card,
  border: `1px solid ${themeConfig.glass.cardBorder}`,
  borderRadius: themeConfig.charts.tooltipRadius,
  backdropFilter: `blur(${themeConfig.glass.blur})`,
  boxShadow: themeConfig.shadows.card,
  color: themeConfig.colors.foreground,
  padding: themeConfig.charts.tooltipPadding,
});

// Chart Grid Style Helper
export const getChartGridStyle = () => ({
  strokeDasharray: '3 3',
  className: 'stroke-muted-foreground/20',
});

// Chart Axis Style Helper
export const getChartAxisStyle = () => ({
  className: 'text-xs',
  tick: { fill: themeConfig.colors.mutedForeground },
});

// Button Hover Style Helper
export const getButtonHoverStyle = () => ({
  hover: 'hover:bg-white/20 dark:hover:bg-white/10',
  transition: 'transition-all duration-300',
});

// Text Color Helpers
export const getTextColors = () => ({
  primary: 'text-foreground',
  secondary: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
});

// Background Color Helpers
export const getBackgroundColors = () => ({
  muted: 'bg-muted',
  hover: 'hover:bg-white/20 dark:hover:bg-white/10',
  card: 'bg-white/10',
  glass: 'backdrop-blur-sm',
});

// Border Radius Helpers
export const getBorderRadius = () => ({
  card: 'rounded-3xl',
  button: 'rounded-xl',
  input: 'rounded-xl',
  badge: 'rounded-md',
  full: 'rounded-full',
});

// Spacing Helpers
export const getSpacing = () => ({
  cardPadding: 'p-6',
  cardGap: 'gap-6',
  sectionGap: 'space-y-6',
  itemGap: 'space-y-3',
  buttonPadding: 'px-3 py-2',
  inputPadding: 'px-3 py-2',
});

// Component Class Helpers
export const getComponentClasses = {
  // Glass Card
  glassCard: () => [
    'p-6',
    'rounded-3xl',
    'border',
    'transition-all',
    'duration-300',
    'hover:shadow-lg',
  ].join(' '),
  
  // Icon Container
  iconContainer: () => [
    'w-10',
    'h-10',
    'rounded-xl',
    'flex',
    'items-center',
    'justify-center',
  ].join(' '),
  
  // Status Badge
  statusBadge: () => [
    'px-2',
    'py-0.5',
    'rounded-md',
    'text-xs',
    'font-medium',
  ].join(' '),
  
  // List Item Box
  listItemBox: () => [
    'flex',
    'items-center',
    'justify-between',
    'p-4',
    'rounded-xl',
    'border',
    'transition-all',
    'hover:bg-white/20',
    'dark:hover:bg-white/10',
  ].join(' '),
  
  // Button
  button: () => [
    'inline-flex',
    'items-center',
    'justify-center',
    'whitespace-nowrap',
    'rounded-xl',
    'text-sm',
    'font-medium',
    'transition-all',
    'duration-300',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ].join(' '),
  
  // Input
  input: () => [
    'flex',
    'h-10',
    'w-full',
    'rounded-xl',
    'px-3',
    'py-2',
    'text-sm',
    'backdrop-blur-xl',
    'border',
    'transition-all',
    'duration-300',
    'file:border-0',
    'file:bg-transparent',
    'file:text-sm',
    'file:font-medium',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'text-foreground',
    'placeholder:text-muted-foreground',
  ].join(' '),
};

// Chart Component Helpers
export const getChartComponents = {
  // Responsive Container
  responsiveContainer: () => ({
    width: '100%',
    height: '100%',
  }),
  
  // Chart Container
  chartContainer: () => ({
    height: themeConfig.charts.height,
  }),
  
  // Area Chart Props
  areaChart: () => ({
    data: [] as any[],
  }),
};

// Theme-aware Color Functions
export const getThemeAwareColor = (lightColor: string, darkColor: string) => ({
  light: lightColor,
  dark: darkColor,
});

// Animation Helpers
export const getAnimations = () => ({
  duration: themeConfig.animations.duration,
  easing: themeConfig.animations.easing,
  hoverScale: themeConfig.animations.hoverScale,
});

// Shadow Helpers
export const getShadows = () => ({
  card: themeConfig.shadows.card,
  cardHover: themeConfig.shadows.cardHover,
  button: themeConfig.shadows.button,
  buttonHover: themeConfig.shadows.buttonHover,
  glow: themeConfig.shadows.glow,
  glowLarge: themeConfig.shadows.glowLarge,
});

// Export all helpers
export {
  themeConfig,
  getColorWithOpacity,
  createStatusBadge,
  createIconContainer,
  createGlassCard,
  createListItemBox,
  type StatusType,
};

