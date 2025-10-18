import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = React.forwardRef<
  HTMLDivElement,
  GlassCardProps
>(({ children, className = '', hover = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-3xl backdrop-blur-xl border",
        hover ? 'transition-all duration-300' : '',
        className
      )}
      style={{
        background: 'var(--glass-card-bg)',
        borderColor: 'var(--glass-card-border)',
        boxShadow: 'var(--glass-card-shadow)',
      }}
      {...props}
    >
      {/* Top Shine Effect */}
      <div 
        className="absolute inset-x-0 top-0 h-px rounded-t-3xl pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          opacity: 'var(--glass-shine-opacity)'
        }}
      />
      {children}
    </div>
  );
});

GlassCard.displayName = "GlassCard";
