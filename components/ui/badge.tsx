import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border-0 px-2 py-1 text-xs font-semibold transition-all duration-300",
  {
    variants: {
      variant: {
        default: "",
        secondary: "bg-muted text-muted-foreground",
        destructive: "",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const getBadgeStyle = () => {
    if (variant === 'default') {
      return {
        background: 'rgba(52, 167, 173, 0.15)',
        color: '#34A7AD',
        ...style
      }
    }
    if (variant === 'destructive') {
      return {
        background: 'rgba(220, 38, 38, 0.15)',
        color: '#DC2626',
        ...style
      }
    }
    if (variant === 'secondary') {
      return {
        ...style
      }
    }
    return style
  }
  
  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      style={getBadgeStyle()}
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
