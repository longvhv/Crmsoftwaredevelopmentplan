# 🎨 Visual Design Guide

> **Version:** 3.0  
> **Last Updated:** 2026-03-17  
> **Design System:** Modern, AI-First, Enterprise CRM

---

## 📐 Design Principles

### 1. Clarity First
- Information hierarchy is paramount
- White space creates breathing room
- Typography establishes order
- Color guides attention

### 2. Consistent & Predictable
- Patterns repeat across pages
- Actions behave the same way
- Feedback is immediate and clear
- Navigation is intuitive

### 3. Efficient & Delightful
- Minimize clicks to completion
- Anticipate user needs
- Celebrate successes
- Guide through errors

### 4. Accessible & Inclusive
- WCAG 2.1 AAA compliance
- Keyboard navigation first-class
- Color-blind friendly palettes
- Screen reader optimized

### 5. AI-Powered & Intelligent
- AI features prominently visible
- Suggestions contextually relevant
- Automation transparent
- Human control always available

---

## 🎨 Color System

### Brand Colors

```css
/* Primary Brand */
--brand-primary: #6366f1;      /* Indigo 500 - Main brand color */
--brand-primary-hover: #4f46e5; /* Indigo 600 - Hover state */
--brand-primary-light: #a5b4fc; /* Indigo 300 - Light variant */
--brand-primary-dark: #3730a3;  /* Indigo 800 - Dark variant */

/* Secondary Brand */
--brand-secondary: #8b5cf6;     /* Violet 500 - Secondary actions */
--brand-accent: #ec4899;        /* Pink 500 - Accents & highlights */
```

### Semantic Colors

```css
/* Success (Green) */
--success: #10b981;             /* Positive actions, completed states */
--success-light: #d1fae5;
--success-dark: #047857;

/* Warning (Amber) */
--warning: #f59e0b;             /* Caution, pending states */
--warning-light: #fef3c7;
--warning-dark: #b45309;

/* Error (Red) */
--error: #ef4444;               /* Errors, destructive actions */
--error-light: #fee2e2;
--error-dark: #b91c1c;

/* Info (Blue) */
--info: #3b82f6;                /* Information, neutral alerts */
--info-light: #dbeafe;
--info-dark: #1e40af;
```

### AI Colors

```css
/* AI Gradient */
--ai-gradient-start: #8b5cf6;   /* Violet 500 */
--ai-gradient-end: #6366f1;     /* Indigo 500 */

/* AI Glow */
--ai-glow: rgba(139, 92, 246, 0.4);
--ai-shimmer: linear-gradient(
  90deg,
  transparent,
  rgba(255, 255, 255, 0.3),
  transparent
);
```

### Neutral Colors (Warm Gray Scale)

```css
/* Light Mode */
--neutral-50: #fafaf9;
--neutral-100: #f5f5f4;
--neutral-200: #e7e5e4;
--neutral-300: #d6d3d1;
--neutral-400: #a8a29e;
--neutral-500: #78716c;
--neutral-600: #57534e;
--neutral-700: #44403c;
--neutral-800: #292524;
--neutral-900: #1c1917;
--neutral-950: #0c0a09;

/* Dark Mode - Adjusted for OLED */
--dark-bg-primary: #0c0a09;     /* True black for OLED */
--dark-bg-secondary: #1c1917;   /* Elevated surfaces */
--dark-bg-tertiary: #292524;    /* Cards, modals */
```

### CRM Status Colors

```css
/* Lead Status */
--lead-new: #3b82f6;           /* Blue - New lead */
--lead-contacted: #8b5cf6;     /* Violet - Contacted */
--lead-qualified: #10b981;     /* Green - Qualified */
--lead-unqualified: #6b7280;   /* Gray - Unqualified */
--lead-converted: #10b981;     /* Green - Converted */
--lead-lost: #ef4444;          /* Red - Lost */

/* Deal Status */
--deal-prospecting: #3b82f6;
--deal-qualification: #8b5cf6;
--deal-proposal: #f59e0b;
--deal-negotiation: #ec4899;
--deal-won: #10b981;
--deal-lost: #ef4444;
```

---

## 📝 Typography

### Font Families

```css
/* Primary Font - Inter (or system fallback) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;

/* Monospace - JetBrains Mono */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 
             'Monaco', monospace;
```

### Type Scale

```css
/* Display (Marketing, Headings) */
--text-display-xl: 4.5rem;    /* 72px */
--text-display-lg: 3.75rem;   /* 60px */
--text-display-md: 3rem;      /* 48px */
--text-display-sm: 2.25rem;   /* 36px */

/* Heading (App Headings) */
--text-h1: 2rem;              /* 32px */
--text-h2: 1.5rem;            /* 24px */
--text-h3: 1.25rem;           /* 20px */
--text-h4: 1.125rem;          /* 18px */

/* Body */
--text-body-lg: 1.125rem;     /* 18px */
--text-body: 1rem;            /* 16px - Default */
--text-body-sm: 0.875rem;     /* 14px */
--text-body-xs: 0.75rem;      /* 12px */

/* Caption */
--text-caption: 0.75rem;      /* 12px */
--text-overline: 0.625rem;    /* 10px */
```

### Font Weights

```css
--font-weight-light: 300;
--font-weight-regular: 400;    /* Default */
--font-weight-medium: 500;     /* Buttons, labels */
--font-weight-semibold: 600;   /* Headings */
--font-weight-bold: 700;       /* Emphasis */
```

### Line Heights

```css
--line-height-tight: 1.25;     /* Headings */
--line-height-normal: 1.5;     /* Body text */
--line-height-relaxed: 1.75;   /* Long-form content */
```

---

## 📏 Spacing System

### Base Unit: 4px (0.25rem)

```css
/* Spacing Scale (Tailwind-inspired) */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px - Base */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Component Spacing

```css
/* Internal Padding */
--padding-input: 0.75rem 1rem;        /* 12px 16px */
--padding-button-sm: 0.5rem 0.75rem;  /* 8px 12px */
--padding-button: 0.625rem 1rem;      /* 10px 16px */
--padding-button-lg: 0.75rem 1.5rem;  /* 12px 24px */
--padding-card: 1.5rem;               /* 24px */
--padding-modal: 2rem;                /* 32px */

/* Gaps */
--gap-xs: 0.5rem;     /* 8px */
--gap-sm: 0.75rem;    /* 12px */
--gap-md: 1rem;       /* 16px */
--gap-lg: 1.5rem;     /* 24px */
--gap-xl: 2rem;       /* 32px */
```

---

## 🌑 Shadows & Elevation

### Shadow Levels

```css
/* Level 0 - Flat */
--shadow-none: none;

/* Level 1 - Slight elevation (buttons, inputs) */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Level 2 - Cards */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Level 3 - Dropdowns, popovers */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Level 4 - Modals */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Level 5 - Large modals, drawers */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* AI Glow Shadow */
--shadow-ai: 0 0 20px rgba(139, 92, 246, 0.4),
             0 0 40px rgba(139, 92, 246, 0.2);
```

### Glassmorphism

```css
/* Frosted Glass Effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 🎬 Motion & Animation

### Duration

```css
--duration-instant: 0ms;      /* Instant feedback */
--duration-fast: 150ms;       /* Quick transitions */
--duration-normal: 300ms;     /* Default */
--duration-slow: 500ms;       /* Deliberate animations */
--duration-slower: 700ms;     /* Page transitions */
```

### Easing Functions

```css
/* Standard Easings */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Custom Easings */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--ease-smooth: cubic-bezier(0.33, 1, 0.68, 1);
```

### Animation Patterns

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale In */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Shimmer (Loading) */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

---

## 📐 Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px - Tight corners */
--radius-md: 0.5rem;     /* 8px - Default */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Modals */
--radius-2xl: 1.5rem;    /* 24px - Large containers */
--radius-full: 9999px;   /* Pill shape, circles */
```

---

## 🎯 Component Patterns

### Button States

```css
/* Default State */
.button {
  background: var(--brand-primary);
  color: white;
  transition: all 150ms ease-out;
}

/* Hover State */
.button:hover {
  background: var(--brand-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Active State */
.button:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Focus State */
.button:focus-visible {
  outline: none;
  ring: 2px solid var(--brand-primary);
  ring-offset: 2px;
}

/* Disabled State */
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Card Elevation

```css
/* Default Card */
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all 300ms ease-out;
}

/* Hover State */
.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* AI Card (with glow) */
.card-ai {
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.1),
    rgba(99, 102, 241, 0.1)
  );
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: var(--shadow-ai);
}
```

### Input States

```css
/* Default Input */
.input {
  border: 1px solid var(--neutral-300);
  transition: all 150ms ease-out;
}

/* Focus State */
.input:focus {
  outline: none;
  border-color: var(--brand-primary);
  ring: 3px solid rgba(99, 102, 241, 0.1);
}

/* Error State */
.input.error {
  border-color: var(--error);
  ring: 3px solid rgba(239, 68, 68, 0.1);
}

/* Success State */
.input.success {
  border-color: var(--success);
  ring: 3px solid rgba(16, 185, 129, 0.1);
}
```

---

## 🎨 Visual Effects

### Glassmorphism

Best for: Overlays, modals, navigation bars

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}
```

### Neumorphism (Soft UI)

Best for: Special buttons, toggle switches

```css
.neuro-raised {
  background: #f0f0f0;
  box-shadow: 8px 8px 16px #d1d1d1,
             -8px -8px 16px #ffffff;
}

.neuro-pressed {
  background: #f0f0f0;
  box-shadow: inset 8px 8px 16px #d1d1d1,
             inset -8px -8px 16px #ffffff;
}
```

### AI Gradient Mesh

Best for: Hero sections, AI feature cards

```css
.ai-mesh {
  background: 
    radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.3) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.3) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.3) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(139, 92, 246, 0.3) 0px, transparent 50%);
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
--breakpoint-2xl: 1536px; /* Extra large screens */
```

### Touch Targets

```css
/* Minimum Touch Target Size: 44px × 44px */
.button-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

### Responsive Typography

```css
/* Fluid Typography (clamp) */
.heading-responsive {
  font-size: clamp(1.5rem, 2vw + 1rem, 3rem);
}

.body-responsive {
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem);
}
```

---

## ♿ Accessibility

### Color Contrast

- **Text on background:** Minimum 7:1 ratio (AAA)
- **Large text (18px+):** Minimum 4.5:1 ratio (AA)
- **UI components:** Minimum 3:1 ratio

### Focus Indicators

```css
/* Always visible on keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}

/* Custom focus ring */
.custom-focus:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}
```

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 🎯 UI Component Checklist

### Every Component Should Have:

- [ ] Default state
- [ ] Hover state (desktop)
- [ ] Active/pressed state
- [ ] Focus state (keyboard)
- [ ] Disabled state
- [ ] Loading state (if applicable)
- [ ] Error state (if applicable)
- [ ] Success state (if applicable)
- [ ] Empty state (if applicable)
- [ ] Dark mode variant
- [ ] Mobile optimized
- [ ] Touch-friendly (44px min)
- [ ] Keyboard accessible
- [ ] Screen reader support
- [ ] ARIA labels
- [ ] High contrast mode support

---

## 📚 Resources

### Design Tools
- **Figma:** Component library and prototypes
- **Coolors:** Color palette generator
- **Contrast Checker:** WCAG compliance
- **Tailwind CSS:** Utility classes reference

### Inspiration
- **Dribbble:** Modern UI designs
- **Behance:** CRM dashboard designs
- **Mobbin:** Mobile app patterns
- **UI8:** Component libraries

### Icon Libraries
- **Lucide:** Primary icon set (already integrated)
- **Heroicons:** Alternative if needed
- **Phosphor:** Additional icons

---

**Last Review:** March 17, 2026  
**Next Review:** June 2026  
**Maintained By:** Design Team
