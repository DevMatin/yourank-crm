import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl px-3 py-2 text-sm backdrop-blur-xl border transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 text-foreground placeholder:text-muted-foreground",
          className
        )}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'var(--glass-card-border)',
          ...style
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
