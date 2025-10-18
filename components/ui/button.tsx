import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-white font-medium transition-all duration-300 hover:opacity-90",
        destructive: "",
        outline: "glass-button",
        secondary: "glass-button",
        ghost: "backdrop-blur-sm transition-all duration-300 text-foreground hover:bg-white/20 dark:hover:bg-white/10",
        link: "underline-offset-4 hover:underline transition-colors duration-300",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-xl px-4",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const getButtonStyle = () => {
      if (variant === 'default') {
        return {
          background: 'linear-gradient(145deg, #34A7AD, #5ED2D9)',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(52, 167, 173, 0.3)',
          ...style
        }
      }
      if (variant === 'destructive') {
        return {
          background: 'linear-gradient(145deg, #DC2626, #EF4444)',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
          ...style
        }
      }
      if (variant === 'link') {
        return {
          color: '#34A7AD',
          ...style
        }
      }
      if (variant === 'ghost') {
        return {
          ...style
        }
      }
      return style
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={getButtonStyle()}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
