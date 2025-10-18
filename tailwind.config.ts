import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#34a7ad",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#2d8a8f",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '3xl': '24px',
        'xl': '12px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glass-hover": {
          "0%": { 
            backdropFilter: "blur(8px)",
            transform: "scale(1)",
            boxShadow: "0 4px 6px rgba(52, 167, 173, 0.1)"
          },
          "100%": { 
            backdropFilter: "blur(12px)",
            transform: "scale(1.02)",
            boxShadow: "0 10px 15px rgba(52, 167, 173, 0.2)"
          },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(52, 167, 173, 0.3)" 
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(52, 167, 173, 0.5)" 
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glass-hover": "glass-hover 0.3s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      boxShadow: {
        'apple-sm': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'apple-md': '0 12px 48px rgba(52, 167, 173, 0.15)',
        'apple-lg': '0 16px 64px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 16px rgba(52, 167, 173, 0.3)',
        'glow-lg': '0 0 24px rgba(52, 167, 173, 0.5)',
        'button-primary': '0 4px 12px rgba(52, 167, 173, 0.3)',
        'button-primary-hover': '0 6px 20px rgba(52, 167, 173, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Rubik', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
