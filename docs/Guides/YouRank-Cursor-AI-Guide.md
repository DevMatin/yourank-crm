# 🎯 YouRank Design System 2.0 - Cursor AI Quick Guide

**Version:** 2.0  
**Date:** 2025-01-17  
**Style:** Apple macOS Sonoma / VisionOS with Glassmorphism 2.0  
**Primary Color:** #34A7AD (YouRank Teal)

---

## 🚀 Quick Start for Cursor AI

### The Golden Rule
```
CSS Variables = RESPONSIVE colors (change between Light/Dark)
Inline Styles = STATIC colors (stay same in both modes)
```

---

## 🎨 Color System Cheat Sheet

### ✅ Use CSS Variables / Tailwind

```tsx
// Primary Text
<h1 className="text-foreground">Title</h1>

// Secondary Text  
<p className="text-muted-foreground">Description</p>

// Backgrounds
style={{ background: 'var(--glass-card-bg)' }}

// Borders
style={{ borderColor: 'var(--glass-card-border)' }}

// Shadows
style={{ boxShadow: 'var(--glass-card-shadow)' }}
```

### ✅ Use Inline Styles for Teal Accents

```tsx
// Teal Icons
<Icon style={{ color: '#34A7AD' }} />

// Teal Gradients
style={{ background: 'linear-gradient(145deg, #34A7AD, #5ED2D9)' }}

// Teal Badges
style={{ backgroundColor: 'rgba(52,167,173,0.15)', color: '#34A7AD' }}
```

### ❌ Never Hardcode Responsive Colors

```tsx
// ❌ WRONG
<div style={{ color: '#1B1D1F' }}>Text</div>
<span className="text-[#6B6E71]">Label</span>

// ✅ CORRECT
<div className="text-foreground">Text</div>
<span className="text-muted-foreground">Label</span>
```

---

## 🏗️ Component Templates

### 1. GlassCard (Use for ALL Cards)

```tsx
import { GlassCard } from './components/GlassCard';

// Basic Card
<GlassCard className="p-6">
  <h3 className="text-foreground mb-2">Title</h3>
  <p className="text-muted-foreground">Content</p>
</GlassCard>

// Card with Hover Effect
<GlassCard className="p-6" hover={true}>
  {/* Content */}
</GlassCard>
```

**Why GlassCard?**
- Built-in glassmorphism effects
- Automatic theme support
- Top shine gradient
- Hover animations
- Consistent styling

---

### 2. Stat Card Pattern

```tsx
import { GlassCard } from './components/GlassCard';
import { TrendingUp } from 'lucide-react';

<GlassCard className="p-6">
  <div className="flex items-start justify-between mb-4">
    {/* Icon Container */}
    <div 
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{
        background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))'
      }}
    >
      <TrendingUp className="w-6 h-6" style={{ color: '#34A7AD' }} />
    </div>
    
    {/* Trend Badge */}
    <span 
      className="px-2 py-1 rounded text-xs"
      style={{
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        color: '#10B981'
      }}
    >
      +12%
    </span>
  </div>
  
  {/* Content */}
  <h3 className="text-sm text-muted-foreground mb-1">Total Users</h3>
  <p className="text-foreground">1,234</p>
</GlassCard>
```

---

### 3. Button Patterns

```tsx
import { Plus } from 'lucide-react';

// Primary Button (Teal Gradient)
<button
  className="px-6 py-3 rounded-xl text-white transition-all hover:scale-105"
  style={{
    background: 'linear-gradient(145deg, #34A7AD, #5ED2D9)',
    boxShadow: '0 4px 12px rgba(52,167,173,0.3)'
  }}
>
  Create New
</button>

// Glass Button (Theme-aware)
<button
  className="px-6 py-3 rounded-xl text-foreground transition-all 
             hover:bg-white/20 dark:hover:bg-white/10"
  style={{
    background: 'var(--glass-card-bg)',
    border: '1px solid var(--glass-card-border)'
  }}
>
  Secondary Action
</button>

// Icon Button
<button
  className="w-10 h-10 rounded-xl flex items-center justify-center 
             transition-all hover:bg-white/20 dark:hover:bg-white/10"
  style={{
    background: 'var(--glass-card-bg)',
    border: '1px solid var(--glass-card-border)'
  }}
>
  <Plus className="w-5 h-5" style={{ color: '#34A7AD' }} />
</button>
```

**CRITICAL:** Always include `dark:hover:bg-white/10` variant!

---

### 4. Badge Patterns

```tsx
import { Check } from 'lucide-react';

// Standard Badge
<span 
  className="px-3 py-1.5 rounded-lg text-sm"
  style={{
    backgroundColor: 'rgba(52,167,173,0.15)',
    color: '#34A7AD'
  }}
>
  Active
</span>

// Badge with Icon
<span 
  className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
  style={{
    backgroundColor: 'rgba(52,167,173,0.15)',
    color: '#34A7AD'
  }}
>
  <Check className="w-4 h-4" />
  Verified
</span>

// Credits Badge (rounded-full)
<span 
  className="px-4 py-2 rounded-full text-sm"
  style={{
    background: 'linear-gradient(145deg, rgba(52,167,173,0.2), rgba(94,210,217,0.15))',
    border: '1px solid rgba(52,167,173,0.3)',
    color: '#34A7AD'
  }}
>
  348 Credits
</span>
```

---

### 5. Input Patterns

```tsx
// Text Input
<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-3 rounded-xl text-sm outline-none 
             text-foreground placeholder:text-muted-foreground"
  style={{
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid var(--glass-card-border)'
  }}
/>

// Textarea
<textarea
  placeholder="Enter description..."
  rows={4}
  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none
             text-foreground placeholder:text-muted-foreground"
  style={{
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid var(--glass-card-border)'
  }}
/>

// Search Input with Icon
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
  <input
    type="search"
    placeholder="Search..."
    className="w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none 
               text-foreground placeholder:text-muted-foreground"
    style={{
      background: 'rgba(255,255,255,0.1)',
      border: '1px solid var(--glass-card-border)'
    }}
  />
</div>
```

---

### 6. Icon Container Pattern

```tsx
import { Activity } from 'lucide-react';

// Small Icon Container (40x40)
<div 
  className="w-10 h-10 rounded-xl flex items-center justify-center"
  style={{
    background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))',
    boxShadow: '0 4px 12px rgba(52,167,173,0.15)'
  }}
>
  <Activity className="w-5 h-5" style={{ color: '#34A7AD' }} />
</div>

// Medium Icon Container (48x48)
<div 
  className="w-12 h-12 rounded-xl flex items-center justify-center"
  style={{
    background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))'
  }}
>
  <Activity className="w-6 h-6" style={{ color: '#34A7AD' }} />
</div>

// Large Icon Container (64x64)
<div 
  className="w-16 h-16 rounded-2xl flex items-center justify-center"
  style={{
    background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))'
  }}
>
  <Activity className="w-8 h-8" style={{ color: '#34A7AD' }} />
</div>
```

---

### 7. Navigation Patterns

```tsx
import { Home, Settings } from 'lucide-react';

// Navigation Item (Inactive)
<button 
  className="w-full px-4 py-3 rounded-xl flex items-center gap-3 
             transition-all hover:bg-white/20 dark:hover:bg-white/10"
>
  <Home className="w-5 h-5 text-muted-foreground" />
  <span className="text-sm text-muted-foreground">Dashboard</span>
</button>

// Navigation Item (Active)
<button 
  className="w-full px-4 py-3 rounded-xl flex items-center gap-3"
  style={{
    background: 'rgba(255,255,255,0.1)'
  }}
>
  <Settings className="w-5 h-5" style={{ color: '#34A7AD' }} />
  <span className="text-sm text-foreground">Settings</span>
</button>

// Navigation with Badge
<button 
  className="w-full px-4 py-3 rounded-xl flex items-center gap-3 justify-between
             transition-all hover:bg-white/20 dark:hover:bg-white/10"
>
  <div className="flex items-center gap-3">
    <Home className="w-5 h-5 text-muted-foreground" />
    <span className="text-sm text-muted-foreground">Notifications</span>
  </div>
  <span 
    className="px-2 py-0.5 rounded-full text-xs"
    style={{
      backgroundColor: 'rgba(52,167,173,0.15)',
      color: '#34A7AD'
    }}
  >
    12
  </span>
</button>
```

---

### 8. List Item Pattern

```tsx
import { FileText, MoreVertical } from 'lucide-react';

<GlassCard className="p-4 hover:bg-white/5 dark:hover:bg-white/2 transition-all">
  <div className="flex items-start justify-between gap-4">
    {/* Icon */}
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))'
      }}
    >
      <FileText className="w-5 h-5" style={{ color: '#34A7AD' }} />
    </div>
    
    {/* Content */}
    <div className="flex-1 min-w-0">
      <h4 className="text-foreground mb-1">Document Title</h4>
      <p className="text-sm text-muted-foreground">Last updated 2 hours ago</p>
    </div>
    
    {/* Action Button */}
    <button 
      className="w-8 h-8 rounded-lg flex items-center justify-center
                 transition-all hover:bg-white/20 dark:hover:bg-white/10"
    >
      <MoreVertical className="w-4 h-4 text-muted-foreground" />
    </button>
  </div>
</GlassCard>
```

---

### 9. Progress Bar Pattern

```tsx
// Simple Progress Bar
<div>
  <div className="flex justify-between mb-2">
    <span className="text-sm text-foreground">Storage Used</span>
    <span className="text-sm text-muted-foreground">75%</span>
  </div>
  <div 
    className="w-full h-2 rounded-full overflow-hidden"
    style={{ background: 'rgba(255,255,255,0.1)' }}
  >
    <div 
      className="h-full rounded-full transition-all duration-500"
      style={{
        width: '75%',
        background: 'linear-gradient(90deg, #34A7AD, #5ED2D9)'
      }}
    />
  </div>
</div>

// Progress Bar with Multiple Segments
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span className="text-foreground">Completed</span>
    <span className="text-muted-foreground">23 / 100</span>
  </div>
  <div 
    className="w-full h-2 rounded-full overflow-hidden"
    style={{ background: 'rgba(255,255,255,0.1)' }}
  >
    <div 
      className="h-full rounded-full transition-all duration-500"
      style={{
        width: '23%',
        background: 'linear-gradient(90deg, #34A7AD, #5ED2D9)'
      }}
    />
  </div>
</div>
```

---

### 10. Chart Pattern (Recharts)

```tsx
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { date: 'Jan', value: 400 },
  { date: 'Feb', value: 300 },
  { date: 'Mar', value: 600 },
];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid 
      strokeDasharray="3 3" 
      className="stroke-muted-foreground/10"
    />
    <XAxis 
      dataKey="date" 
      className="text-xs"
      tick={{ fill: 'var(--muted-foreground)' }}
    />
    <YAxis 
      className="text-xs"
      tick={{ fill: 'var(--muted-foreground)' }}
    />
    <Tooltip 
      contentStyle={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--glass-card-border)',
        borderRadius: '12px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        color: 'var(--foreground)'
      }}
    />
    <Line 
      type="monotone" 
      dataKey="value" 
      stroke="#34A7AD" 
      strokeWidth={2}
      dot={{ fill: '#34A7AD', strokeWidth: 0, r: 4 }}
      activeDot={{ r: 6 }}
    />
  </LineChart>
</ResponsiveContainer>
```

---

### 11. Empty State Pattern

```tsx
import { Inbox } from 'lucide-react';

<GlassCard className="p-12">
  <div className="flex flex-col items-center justify-center text-center">
    {/* Icon */}
    <div 
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{
        background: 'linear-gradient(145deg, rgba(52,167,173,0.15), rgba(94,210,217,0.1))'
      }}
    >
      <Inbox className="w-8 h-8" style={{ color: '#34A7AD' }} />
    </div>
    
    {/* Text */}
    <h3 className="text-foreground mb-2">No items found</h3>
    <p className="text-sm text-muted-foreground mb-6">
      Get started by creating your first item
    </p>
    
    {/* Action Button */}
    <button
      className="px-6 py-3 rounded-xl text-white transition-all hover:scale-105"
      style={{
        background: 'linear-gradient(145deg, #34A7AD, #5ED2D9)',
        boxShadow: '0 4px 12px rgba(52,167,173,0.3)'
      }}
    >
      Create Item
    </button>
  </div>
</GlassCard>
```

---

### 12. Loading State Pattern

```tsx
// Skeleton Card
<GlassCard className="p-6">
  <div className="animate-pulse space-y-4">
    <div 
      className="h-12 w-12 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.1)' }}
    />
    <div className="space-y-2">
      <div 
        className="h-4 rounded"
        style={{ background: 'rgba(255,255,255,0.1)', width: '60%' }}
      />
      <div 
        className="h-4 rounded"
        style={{ background: 'rgba(255,255,255,0.1)', width: '40%' }}
      />
    </div>
  </div>
</GlassCard>

// Spinner
<div 
  className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
  style={{ borderColor: '#34A7AD', borderTopColor: 'transparent' }}
/>
```

---

### 13. Theme Toggle Pattern

```tsx
import { useTheme } from './components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="w-10 h-10 rounded-xl flex items-center justify-center 
                 transition-all hover:bg-white/20 dark:hover:bg-white/10"
      style={{
        background: 'var(--glass-card-bg)',
        border: '1px solid var(--glass-card-border)'
      }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-muted-foreground" />
      ) : (
        <Sun className="w-5 h-5" style={{ color: '#34A7AD' }} />
      )}
    </button>
  );
}
```

---

## 📏 Layout Guidelines

### Border Radius

```tsx
// Cards & Panels
className="rounded-3xl"  // 24px

// Buttons & Inputs
className="rounded-xl"   // 12px

// Small elements
className="rounded-lg"   // 8px

// Pills
className="rounded-full" // 9999px
```

### Spacing

```tsx
// Padding
className="p-4"  // Small (16px)
className="p-6"  // Medium (24px)
className="p-8"  // Large (32px)

// Gaps
className="gap-2"  // Tight (8px)
className="gap-4"  // Normal (16px)
className="gap-6"  // Relaxed (24px)
```

### Grid Layouts

```tsx
// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Auto-fit Grid
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
  {/* Cards */}
</div>
```

---

## 🎨 CSS Variables Reference

### Most Used Variables

```css
/* Backgrounds */
--glass-card-bg           /* Card background gradient */
--glass-sidebar-bg        /* Sidebar background */
--background              /* Page background */
--card                    /* Solid card background */

/* Text Colors */
--foreground              /* Primary text */
--muted-foreground        /* Secondary text */

/* Borders & Shadows */
--glass-card-border       /* Card border color */
--glass-card-shadow       /* Card shadow */

/* Primary Color */
--primary                 /* #34A7AD */
--primary-hover           /* #2D9499 */
```

### Usage in Components

```tsx
// Background
style={{ background: 'var(--glass-card-bg)' }}

// Border
style={{ borderColor: 'var(--glass-card-border)' }}

// Shadow
style={{ boxShadow: 'var(--glass-card-shadow)' }}

// Text (use Tailwind instead)
className="text-foreground"
className="text-muted-foreground"
```

---

## ⚠️ Common Mistakes & Solutions

### Mistake 1: Hardcoded Text Colors

```tsx
// ❌ WRONG
<div style={{ color: '#1B1D1F' }}>Text</div>
<span style={{ color: '#E5E7EB' }}>Light text</span>

// ✅ CORRECT
<div className="text-foreground">Text</div>
<span className="text-foreground">Light text</span>
```

### Mistake 2: Missing Dark Hover Variant

```tsx
// ❌ WRONG
<button className="hover:bg-white/20">

// ✅ CORRECT
<button className="hover:bg-white/20 dark:hover:bg-white/10">
```

### Mistake 3: Manual Card Implementation

```tsx
// ❌ WRONG
<div 
  className="rounded-3xl backdrop-blur-xl border"
  style={{
    background: 'linear-gradient(...)',
    borderColor: '...'
  }}
>

// ✅ CORRECT
import { GlassCard } from './components/GlassCard';

<GlassCard className="p-6">
  {/* Content */}
</GlassCard>
```

### Mistake 4: Using Font Size Classes

```tsx
// ❌ WRONG (unless specifically requested)
<h1 className="text-2xl font-bold">Title</h1>

// ✅ CORRECT
<h1 className="text-foreground">Title</h1>

// Reason: We have default typography in globals.css
```

### Mistake 5: Inconsistent Border Radius

```tsx
// ❌ WRONG
<button className="rounded-2xl">  // 16px
<div className="rounded-lg">      // 8px (for buttons)

// ✅ CORRECT
<button className="rounded-xl">   // 12px for buttons
<div className="rounded-3xl">     // 24px for cards
```

---

## 🚦 Prompt Examples for Cursor AI

### Creating a New Page

```
Create a dashboard page with:
- 4 stat cards showing metrics
- A chart showing weekly activity
- A list of recent items
- Follow the YouRank design system
```

### Creating a Component

```
Create a UserCard component that shows:
- User avatar
- Name and email
- Status badge
- Edit button
Use GlassCard and follow design system
```

### Adding Theme Support

```
Add dark mode support to this component
Make sure to use CSS variables for colors
Include proper hover states
```

### Creating a Form

```
Create a settings form with:
- Text inputs for name, email
- Textarea for bio
- Toggle switches for preferences
- Save button (teal gradient)
Follow the design system input patterns
```

---

## ✅ Component Checklist

Before submitting a component, verify:

### Colors ✓
- [ ] Text uses `text-foreground` or `text-muted-foreground`
- [ ] Teal accents use `style={{ color: '#34A7AD' }}`
- [ ] Backgrounds use `var(--glass-card-bg)`
- [ ] Borders use `var(--glass-card-border)`
- [ ] No hardcoded responsive colors

### Layout ✓
- [ ] Cards use `rounded-3xl` (24px)
- [ ] Buttons use `rounded-xl` (12px)
- [ ] Consistent padding (p-4, p-6, p-8)
- [ ] Proper gaps (gap-2, gap-4, gap-6)

### Interactivity ✓
- [ ] Hover states include dark variant
- [ ] Transitions for smooth animations
- [ ] Focus states for accessibility
- [ ] Proper button/link semantics

### Theme Support ✓
- [ ] Works in Light Mode
- [ ] Works in Dark Mode
- [ ] Smooth transition between modes
- [ ] CSS variables used correctly

### Components ✓
- [ ] Uses GlassCard for containers
- [ ] Imports from correct paths
- [ ] Follows existing patterns
- [ ] TypeScript types included

### Performance ✓
- [ ] No unnecessary re-renders
- [ ] Optimized images
- [ ] Proper React keys in lists
- [ ] Efficient state management

---

## 🎯 Design System At a Glance

| Element | Class/Style | Example |
|---------|-------------|---------|
| **Card** | `<GlassCard>` | Container component |
| **Primary Text** | `text-foreground` | Headings, labels |
| **Secondary Text** | `text-muted-foreground` | Descriptions |
| **Teal Accent** | `style={{ color: '#34A7AD' }}` | Icons, badges |
| **Primary Button** | Teal gradient | CTAs |
| **Glass Button** | `var(--glass-card-bg)` | Secondary actions |
| **Badge** | `rgba(52,167,173,0.15)` bg | Status indicators |
| **Input** | `rgba(255,255,255,0.1)` bg | Forms |
| **Hover (Light)** | `hover:bg-white/20` | Interactive elements |
| **Hover (Dark)** | `dark:hover:bg-white/10` | Interactive elements |
| **Card Radius** | `rounded-3xl` | 24px |
| **Button Radius** | `rounded-xl` | 12px |

---

## 📚 Import Shortcuts

```tsx
// Foundation
import { GlassCard } from './components/GlassCard';
import { useTheme } from './components/ThemeProvider';

// Icons
import { Icon } from 'lucide-react';

// ShadCN (examples)
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Dialog } from './components/ui/dialog';
import { Select } from './components/ui/select';
```

---

## 🎬 Final Tips

1. **Always start with GlassCard** for containers
2. **Use CSS variables** for theme-aware colors
3. **Include dark: variants** for hover states
4. **Follow spacing guidelines** (gap-4, p-6, rounded-xl)
5. **Import icons from lucide-react**
6. **Test in both Light and Dark mode**
7. **Add transitions** for smooth interactions
8. **Keep accessibility in mind** (aria-labels, focus states)

---

**Version:** 2.0  
**Status:** Production Ready ✅  
**Last Updated:** 2025-01-17

For detailed rules, see `.cursorrules` file.
