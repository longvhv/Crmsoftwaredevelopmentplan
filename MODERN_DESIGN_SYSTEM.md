# 🎨 MODERN DESIGN SYSTEM - AI-FIRST CRM
**Version:** 2.0  
**Last Updated:** March 17, 2026

---

## 📐 DESIGN TOKENS

### 🎨 Color Palette

#### Primary Brand Colors (Violet/Purple - AI/Intelligence)
```css
--color-primary-50: #faf5ff;
--color-primary-100: #f3e8ff;
--color-primary-200: #e9d5ff;
--color-primary-300: #d8b4fe;
--color-primary-400: #c084fc;
--color-primary-500: #a855f7; /* Main brand */
--color-primary-600: #9333ea;
--color-primary-700: #7e22ce;
--color-primary-800: #6b21a8;
--color-primary-900: #581c87;
--color-primary-950: #3b0764;
```

#### Secondary Colors (Blue - Trust/Professional)
```css
--color-secondary-50: #eff6ff;
--color-secondary-100: #dbeafe;
--color-secondary-200: #bfdbfe;
--color-secondary-300: #93c5fd;
--color-secondary-400: #60a5fa;
--color-secondary-500: #3b82f6; /* Secondary */
--color-secondary-600: #2563eb;
--color-secondary-700: #1d4ed8;
--color-secondary-800: #1e40af;
--color-secondary-900: #1e3a8a;
```

#### Semantic Colors
```css
/* Success (Green) */
--color-success-50: #f0fdf4;
--color-success-500: #22c55e;
--color-success-600: #16a34a;
--color-success-700: #15803d;

/* Warning (Amber) */
--color-warning-50: #fffbeb;
--color-warning-500: #f59e0b;
--color-warning-600: #d97706;
--color-warning-700: #b45309;

/* Error (Red) */
--color-error-50: #fef2f2;
--color-error-500: #ef4444;
--color-error-600: #dc2626;
--color-error-700: #b91c1c;

/* Info (Cyan) */
--color-info-50: #ecfeff;
--color-info-500: #06b6d4;
--color-info-600: #0891b2;
--color-info-700: #0e7490;
```

#### Neutral/Gray Scale (Warm Gray)
```css
--color-gray-50: #fafaf9;
--color-gray-100: #f5f5f4;
--color-gray-200: #e7e5e4;
--color-gray-300: #d6d3d1;
--color-gray-400: #a8a29e;
--color-gray-500: #78716c;
--color-gray-600: #57534e;
--color-gray-700: #44403c;
--color-gray-800: #292524;
--color-gray-900: #1c1917;
--color-gray-950: #0c0a09;
```

#### Surface Colors
```css
--surface-base: #ffffff;
--surface-elevated: #ffffff;
--surface-sunken: #f9fafb;
--surface-overlay: rgba(0, 0, 0, 0.5);
--surface-glass: rgba(255, 255, 255, 0.8);
```

#### Border Colors
```css
--border-default: #e5e7eb;
--border-strong: #d1d5db;
--border-subtle: #f3f4f6;
--border-focus: #a855f7;
--border-error: #ef4444;
--border-success: #22c55e;
```

#### Text Colors
```css
--text-primary: #111827;
--text-secondary: #6b7280;
--text-tertiary: #9ca3af;
--text-disabled: #d1d5db;
--text-inverse: #ffffff;
--text-link: #3b82f6;
--text-link-hover: #2563eb;
```

---

### 📝 Typography

#### Font Families
```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", 
             Consolas, monospace;
--font-display: system-ui, -apple-system, sans-serif;
```

#### Font Sizes (Type Scale)
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */
```

#### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

#### Line Heights
```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

#### Letter Spacing
```css
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

---

### 📏 Spacing Scale

```css
--spacing-0: 0;
--spacing-0.5: 0.125rem;  /* 2px */
--spacing-1: 0.25rem;     /* 4px */
--spacing-1.5: 0.375rem;  /* 6px */
--spacing-2: 0.5rem;      /* 8px */
--spacing-2.5: 0.625rem;  /* 10px */
--spacing-3: 0.75rem;     /* 12px */
--spacing-3.5: 0.875rem;  /* 14px */
--spacing-4: 1rem;        /* 16px */
--spacing-5: 1.25rem;     /* 20px */
--spacing-6: 1.5rem;      /* 24px */
--spacing-7: 1.75rem;     /* 28px */
--spacing-8: 2rem;        /* 32px */
--spacing-10: 2.5rem;     /* 40px */
--spacing-12: 3rem;       /* 48px */
--spacing-16: 4rem;       /* 64px */
--spacing-20: 5rem;       /* 80px */
--spacing-24: 6rem;       /* 96px */
--spacing-32: 8rem;       /* 128px */
```

---

### 🔘 Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px */
--radius-base: 0.375rem; /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-3xl: 2rem;      /* 32px */
--radius-full: 9999px;
```

---

### 🌑 Shadows & Elevation

#### Box Shadows
```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-base: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-2xl: 0 30px 60px -15px rgb(0 0 0 / 0.3);
```

#### Colored Shadows (for emphasis)
```css
--shadow-primary: 0 10px 15px -3px rgb(168 85 247 / 0.2);
--shadow-secondary: 0 10px 15px -3px rgb(59 130 246 / 0.2);
--shadow-success: 0 10px 15px -3px rgb(34 197 94 / 0.2);
--shadow-warning: 0 10px 15px -3px rgb(245 158 11 / 0.2);
--shadow-error: 0 10px 15px -3px rgb(239 68 68 / 0.2);
```

#### Inner Shadows
```css
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
--shadow-inner-lg: inset 0 4px 8px 0 rgb(0 0 0 / 0.1);
```

#### Focus Rings
```css
--ring-width: 2px;
--ring-offset: 2px;
--ring-color: var(--color-primary-500);
--ring-offset-color: #ffffff;
```

---

### ⏱️ Animation & Transitions

#### Durations
```css
--duration-instant: 50ms;
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
--duration-slower: 600ms;
```

#### Timing Functions (Easing)
```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

#### Transition Presets
```css
--transition-base: all var(--duration-normal) var(--ease-out);
--transition-colors: color var(--duration-fast) var(--ease-out),
                     background-color var(--duration-fast) var(--ease-out),
                     border-color var(--duration-fast) var(--ease-out);
--transition-transform: transform var(--duration-normal) var(--ease-out);
--transition-shadow: box-shadow var(--duration-normal) var(--ease-out);
```

---

### 📱 Breakpoints

```css
--breakpoint-xs: 375px;   /* Mobile small */
--breakpoint-sm: 640px;   /* Mobile large */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Laptop */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Large desktop */
```

---

### 🎯 Z-Index Scale

```css
--z-below: -1;
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-notification: 1080;
--z-max: 9999;
```

---

## 🧩 COMPONENT PATTERNS

### Button Variants

#### Primary Button
```tsx
className="px-4 py-2 bg-primary-600 text-white rounded-lg 
           hover:bg-primary-700 hover:shadow-md
           active:bg-primary-800 active:scale-[0.98]
           focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
           disabled:bg-gray-300 disabled:cursor-not-allowed
           transition-all duration-150"
```

#### Secondary Button
```tsx
className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg
           hover:bg-gray-50 hover:border-gray-400
           active:bg-gray-100
           focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
           transition-all duration-150"
```

#### Ghost Button
```tsx
className="px-4 py-2 text-gray-700 rounded-lg
           hover:bg-gray-100
           active:bg-gray-200
           focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
           transition-all duration-150"
```

#### Icon Button
```tsx
className="p-2 text-gray-600 rounded-lg
           hover:bg-gray-100 hover:text-gray-900
           active:bg-gray-200
           focus:ring-2 focus:ring-primary-500
           transition-all duration-150"
```

---

### Card Variants

#### Elevated Card
```tsx
className="bg-white rounded-xl shadow-md border border-gray-100
           hover:shadow-lg hover:-translate-y-0.5
           transition-all duration-250"
```

#### Flat Card
```tsx
className="bg-white rounded-lg border border-gray-200
           hover:border-gray-300
           transition-colors duration-150"
```

#### Glass Card
```tsx
className="bg-white/80 backdrop-blur-lg rounded-xl border border-white/20
           shadow-lg
           transition-all duration-250"
```

---

### Input Variants

#### Text Input
```tsx
className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg
           focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
           hover:border-gray-400
           disabled:bg-gray-50 disabled:text-gray-500
           transition-all duration-150"
```

#### Input with Floating Label
```tsx
<div className="relative">
  <input 
    className="peer w-full px-3 pt-5 pb-2 border border-gray-300 rounded-lg
               focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
               transition-all duration-150"
    placeholder=" "
  />
  <label className="absolute left-3 top-2 text-xs text-gray-500
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-xs
                    transition-all duration-150">
    Label
  </label>
</div>
```

---

### Modal Patterns

#### Modal Backdrop
```tsx
className="fixed inset-0 bg-black/50 backdrop-blur-sm z-modal-backdrop
           animate-in fade-in duration-200"
```

#### Modal Container
```tsx
className="fixed inset-0 z-modal flex items-center justify-center p-4
           animate-in fade-in zoom-in-95 duration-200"
```

#### Modal Content
```tsx
className="bg-white rounded-2xl shadow-2xl max-w-md w-full
           animate-in slide-in-from-bottom-4 duration-300"
```

---

### Toast Patterns

#### Toast Container
```tsx
className="fixed top-4 right-4 z-notification space-y-2"
```

#### Toast Item (Success)
```tsx
className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg border-l-4 border-success-500
           animate-in slide-in-from-right-full duration-300"
```

---

## 🎬 ANIMATION PATTERNS

### Entrance Animations
```css
/* Fade In */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide In from Bottom */
@keyframes slide-in-bottom {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scale-in {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

/* Bounce In */
@keyframes bounce-in {
  0% { 
    opacity: 0;
    transform: scale(0.3);
  }
  50% { 
    opacity: 1;
    transform: scale(1.05);
  }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
```

### Exit Animations
```css
/* Fade Out */
@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Slide Out to Right */
@keyframes slide-out-right {
  from { 
    opacity: 1;
    transform: translateX(0);
  }
  to { 
    opacity: 0;
    transform: translateX(100%);
  }
}
```

### Loading Animations
```css
/* Spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Skeleton Shimmer */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

---

## 🌙 DARK MODE COLORS

### Dark Mode Palette
```css
/* Dark mode backgrounds */
--dark-surface-base: #0f172a;
--dark-surface-elevated: #1e293b;
--dark-surface-sunken: #020617;

/* Dark mode borders */
--dark-border-default: #334155;
--dark-border-subtle: #1e293b;

/* Dark mode text */
--dark-text-primary: #f1f5f9;
--dark-text-secondary: #cbd5e1;
--dark-text-tertiary: #94a3b8;
--dark-text-disabled: #475569;
```

---

## 📐 LAYOUT PATTERNS

### Page Container
```tsx
className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
```

### Content Container
```tsx
className="max-w-7xl mx-auto space-y-6"
```

### Section Spacing
```tsx
className="space-y-4"  // Compact
className="space-y-6"  // Normal
className="space-y-8"  // Spacious
```

### Grid Layouts
```tsx
// 2-column responsive grid
className="grid grid-cols-1 md:grid-cols-2 gap-4"

// 3-column responsive grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"

// Auto-fit grid (cards)
className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4"
```

---

## 🎯 BEST PRACTICES

### DO ✅
- Use consistent spacing (multiples of 4px)
- Maintain clear visual hierarchy
- Provide visual feedback for all interactions
- Use semantic color names
- Test all states (hover, active, focus, disabled)
- Ensure 4.5:1 contrast ratio for text
- Add loading states for async actions
- Use skeleton loaders for content
- Implement smooth transitions (200-400ms)
- Provide keyboard navigation

### DON'T ❌
- Use arbitrary values without tokens
- Animate expensive properties (width, height)
- Forget focus states
- Use low contrast colors
- Overcomplicate animations
- Ignore mobile touch targets (<44px)
- Mix different design patterns
- Forget empty states
- Skip error states
- Ignore accessibility

---

## 📚 COMPONENT CHECKLIST

For every new component, ensure:

- [ ] All states implemented (default, hover, active, focus, disabled, loading, error)
- [ ] Responsive design tested
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Loading state included
- [ ] Empty state included
- [ ] Error state included
- [ ] Smooth transitions added
- [ ] Mobile-friendly touch targets
- [ ] Dark mode support (if applicable)
- [ ] Color contrast meets WCAG AA
- [ ] Documented with examples

---

## 🔗 RESOURCES

### Design Inspiration
- [Linear](https://linear.app) - Modern SaaS UI
- [Notion](https://notion.so) - Clean design system
- [Stripe](https://stripe.com/docs) - Professional dashboard
- [Attio](https://attio.com) - Modern CRM
- [Vercel](https://vercel.com) - Sleek design

### Tools
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com) - Unstyled components
- [Lucide Icons](https://lucide.dev)
- [Motion](https://motion.dev) - Animation library
- [Coolors](https://coolors.co) - Color palettes

---

**Last Updated:** March 17, 2026  
**Version:** 2.0  
**Status:** Ready for Implementation
