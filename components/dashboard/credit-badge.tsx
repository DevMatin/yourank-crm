'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CreditBadgeProps {
  credits: number;
  maxCredits?: number;
  className?: string;
  showProgress?: boolean;
}

export function CreditBadge({ 
  credits, 
  maxCredits = 100, 
  className,
  showProgress = false 
}: CreditBadgeProps) {
  const percentage = (credits / maxCredits) * 100;
  const isLow = credits < 10;
  const isMedium = credits < 25;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge 
        variant={isLow ? "destructive" : isMedium ? "secondary" : "default"}
        className="font-mono"
      >
        {credits} Credits
      </Badge>
      {showProgress && (
        <div className="flex items-center gap-2 min-w-[100px]">
          <Progress 
            value={percentage} 
            className="h-2"
          />
          <span className="text-xs text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
