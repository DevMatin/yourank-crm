/**
 * YouRank Design System 2.0 - Theme Configuration
 * 
 * Zentrale Konfiguration für alle Design-Tokens.
 * Änderungen hier wirken sich auf die gesamte Anwendung aus.
 */

export const themeConfig = {
  // Primary Brand Colors
  colors: {
    primary: '#34A7AD',        // YouRank Teal
    primaryLight: '#5ED2D9',   // Light Teal
    primaryDark: '#26797E',    // Dark Teal
    
    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Neutral Colors (for CSS Variables)
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    muted: 'var(--muted)',
    mutedForeground: 'var(--muted-foreground)',
    border: 'var(--border)',
    card: 'var(--card)',
    cardForeground: 'var(--card-foreground)',
  },
  
  // Typography
  fonts: {
    sans: "'Inter', system-ui, sans-serif",
    display: "'Rubik', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem' // 30px
  },
  
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Spacing
  spacing: {
    cardPadding: '1.5rem',      // 24px (p-6)
    cardGap: '1.5rem',          // 24px (gap-6)
    sectionGap: '2rem',         // 32px
    itemGap: '0.75rem',         // 12px (space-y-3)
    buttonPadding: '0.75rem',    // 12px (px-3 py-2)
    inputPadding: '0.75rem',    // 12px (px-3 py-2)
  },
  
  // Border Radius
  radius: {
    card: '24px',      // rounded-3xl
    button: '12px',    // rounded-xl
    input: '12px',     // rounded-xl
    badge: '6px',      // rounded-md
    full: '9999px'     // rounded-full
  },
  
  // Glassmorphism
  glass: {
    blur: '20px',
    cardBg: 'var(--glass-card-bg)',
    cardBorder: 'var(--glass-card-border)',
    cardShadow: 'var(--glass-card-shadow)',
    sidebarBg: 'var(--glass-sidebar-bg)',
  },
  
  // Charts
  charts: {
    strokeWidth: 3,
    gradientOpacityStart: 0.3,
    gradientOpacityEnd: 0,
    height: '256px',  // h-64
    tooltipPadding: '12px',
    tooltipRadius: '12px',
  },
  
  // Animations
  animations: {
    duration: '300ms',
    easing: 'ease-in-out',
    hoverScale: '1.02',
  },
  
  // Shadows
  shadows: {
    card: '0 8px 32px rgba(0,0,0,0.08)',
    cardHover: '0 12px 48px rgba(52,167,173,0.15)',
    button: '0 4px 12px rgba(52,167,173,0.3)',
    buttonHover: '0 6px 20px rgba(52,167,173,0.4)',
    glow: '0 0 16px rgba(52,167,173,0.3)',
    glowLarge: '0 0 24px rgba(52,167,173,0.5)',
  },
  
  // Icon Container
  iconContainer: {
    size: '40px',      // w-10 h-10
    borderRadius: '12px', // rounded-xl
    background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
    shadow: '0 4px 12px rgba(52,167,173,0.15)',
  },
  
  // Status Badge
  statusBadge: {
    padding: '0.125rem 0.5rem', // px-2 py-0.5
    borderRadius: '6px',         // rounded-md
    fontSize: '0.75rem',         // text-xs
    opacity: 0.15,               // Background opacity
  },
  
  // List Item Box
  listItem: {
    padding: '1rem',             // p-4
    borderRadius: '12px',         // rounded-xl
    border: '1px solid var(--border)',
    hoverBackground: 'rgba(255,255,255,0.2)',
    hoverBackgroundDark: 'rgba(255,255,255,0.1)',
    gap: '0.75rem',              // space-y-3
  },
} as const;

// Helper Functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export const getChartGradient = (id: string, color: string = themeConfig.colors.primary) => ({
  id,
  stops: [
    { offset: '5%', color, opacity: themeConfig.charts.gradientOpacityStart },
    { offset: '95%', color, opacity: themeConfig.charts.gradientOpacityEnd }
  ]
});

export const createStatusBadge = (status: 'success' | 'warning' | 'error' | 'info' | 'primary') => {
  const colorMap = {
    success: themeConfig.colors.success,
    warning: themeConfig.colors.warning,
    error: themeConfig.colors.error,
    info: themeConfig.colors.info,
    primary: themeConfig.colors.primary,
  };
  
  const color = colorMap[status];
  
  return {
    backgroundColor: getColorWithOpacity(color, themeConfig.statusBadge.opacity),
    color: color,
    padding: themeConfig.statusBadge.padding,
    borderRadius: themeConfig.statusBadge.borderRadius,
    fontSize: themeConfig.statusBadge.fontSize,
  };
};

export const createIconContainer = (color: string = themeConfig.colors.primary) => ({
  width: themeConfig.iconContainer.size,
  height: themeConfig.iconContainer.size,
  borderRadius: themeConfig.iconContainer.borderRadius,
  background: themeConfig.iconContainer.background,
  boxShadow: themeConfig.iconContainer.shadow,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const createGlassCard = () => ({
  background: themeConfig.glass.cardBg,
  borderColor: themeConfig.glass.cardBorder,
  backdropFilter: `blur(${themeConfig.glass.blur})`,
  WebkitBackdropFilter: `blur(${themeConfig.glass.blur})`,
  borderRadius: themeConfig.radius.card,
  padding: themeConfig.spacing.cardPadding,
  boxShadow: themeConfig.shadows.card,
});

export const createListItemBox = () => ({
  padding: themeConfig.listItem.padding,
  borderRadius: themeConfig.listItem.borderRadius,
  border: themeConfig.listItem.border,
  transition: `all ${themeConfig.animations.duration} ${themeConfig.animations.easing}`,
  '&:hover': {
    backgroundColor: themeConfig.listItem.hoverBackground,
  },
  '&:hover.dark': {
    backgroundColor: themeConfig.listItem.hoverBackgroundDark,
  },
});

// Type definitions
export type ThemeConfig = typeof themeConfig;
export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'primary';

