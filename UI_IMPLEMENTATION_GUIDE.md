# 🛠️ UI/UX IMPLEMENTATION GUIDE

**Step-by-Step Instructions for Each Component**

---

## 📚 TABLE OF CONTENTS

1. [Getting Started](#getting-started)
2. [Component Templates](#component-templates)
3. [Implementation Checklist](#implementation-checklist)
4. [Code Standards](#code-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 GETTING STARTED

### Project Structure
```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── demos/           # Showcase pages
│   │   │   ├── ButtonShowcase.tsx
│   │   │   ├── FormShowcase.tsx
│   │   │   └── ...
│   │   └── crm/             # Business components
│   │       ├── ContactCard.tsx
│   │       ├── DealCard.tsx
│   │       └── ...
│   └── styles/
│       ├── theme.css        # Design tokens
│       └── fonts.css        # Font imports
└── Guidelines.md            # Project guidelines
```

### Design System Files
- **Colors & Tokens:** `/src/styles/theme.css`
- **Guidelines:** `/Guidelines.md`
- **Progress:** `/UI_DAILY_PROGRESS.md`
- **Roadmap:** `/UI_REFINEMENT_ROADMAP.md`

---

## 🧩 COMPONENT TEMPLATES

### 1. Basic Component Template

```typescript
import * as React from "react";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface ComponentProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  // Add your props here
}

/* ============================================================
 * STYLES
 * ============================================================ */

const variantStyles = {
  default: 'border border-border bg-background',
  outlined: 'border-2 border-border bg-transparent',
  filled: 'border-0 bg-accent',
};

const sizeStyles = {
  sm: 'h-8 px-2 text-sm',
  md: 'h-10 px-3 text-base',
  lg: 'h-12 px-4 text-lg',
};

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variant & Size
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Component.displayName = "Component";
```

### 2. Form Component Template

```typescript
import * as React from "react";
import { cn } from "./utils";

export interface FormComponentProps extends React.ComponentProps<"input"> {
  // Design
  variant?: 'default' | 'filled' | 'outlined' | 'ghost';
  inputSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // States
  state?: 'default' | 'error' | 'success' | 'warning';
  error?: string;
  success?: string;
  warning?: string;
  
  // Features
  label?: string;
  helperText?: string;
  required?: boolean;
  optional?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Layout
  fullWidth?: boolean;
}

export const FormComponent = React.forwardRef<HTMLInputElement, FormComponentProps>(
  (
    {
      className,
      variant = 'default',
      inputSize = 'md',
      state: stateProp,
      error,
      success,
      warning,
      label,
      helperText,
      required,
      optional,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Determine state
    const state = error ? 'error' : success ? 'success' : warning ? 'warning' : stateProp || 'default';
    const displayMessage = error || success || warning || helperText;
    
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
            {optional && <span className="ml-1.5 text-xs text-muted-foreground font-normal">(optional)</span>}
          </label>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={state === 'error'}
          aria-required={required}
          className={cn(
            // Base styles
            'flex h-10 w-full px-3 py-2',
            'border border-border bg-background',
            'text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            className
          )}
          {...props}
        />
        
        {/* Helper Text */}
        {displayMessage && (
          <p className={cn(
            'text-xs',
            state === 'error' && 'text-[var(--error)]',
            state === 'success' && 'text-[var(--success)]',
            state === 'warning' && 'text-[var(--warning)]',
            state === 'default' && 'text-muted-foreground'
          )}>
            {displayMessage}
          </p>
        )}
      </div>
    );
  }
);

FormComponent.displayName = "FormComponent";
```

### 3. Showcase Page Template

```typescript
import React from "react";
import { YourComponent } from "../ui/your-component";

export function YourComponentShowcase() {
  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Your Component</h1>
        <p className="text-muted-foreground">
          Description of your component
        </p>
      </div>

      {/* Variants Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variants</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <YourComponent variant="default">Default</YourComponent>
          <YourComponent variant="outlined">Outlined</YourComponent>
          <YourComponent variant="filled">Filled</YourComponent>
        </div>
      </section>

      {/* Sizes Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <YourComponent size="sm">Small</YourComponent>
          <YourComponent size="md">Medium</YourComponent>
          <YourComponent size="lg">Large</YourComponent>
        </div>
      </section>

      {/* States Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">States</h2>
        <div className="grid gap-4">
          <YourComponent state="default">Default</YourComponent>
          <YourComponent state="error">Error</YourComponent>
          <YourComponent state="success">Success</YourComponent>
          <YourComponent disabled>Disabled</YourComponent>
        </div>
      </section>
    </div>
  );
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### For Every Component

#### 1. Planning (5 min)
- [ ] Read component requirements
- [ ] Check existing similar components
- [ ] Identify dependencies (Radix UI, icons, etc.)
- [ ] Plan props API

#### 2. Implementation (30-60 min)
- [ ] Create component file in `/src/app/components/ui/`
- [ ] Import dependencies
- [ ] Define TypeScript interfaces
- [ ] Create style variants
- [ ] Implement component logic
- [ ] Add forwardRef for DOM access
- [ ] Export component

#### 3. Styling (15-30 min)
- [ ] Use design tokens from theme.css
- [ ] Implement all sizes (xs/sm/md/lg/xl)
- [ ] Implement all variants
- [ ] Add hover states
- [ ] Add focus states (violet ring)
- [ ] Add disabled states
- [ ] Add animations (200ms duration)
- [ ] Test responsive behavior

#### 4. Accessibility (15 min)
- [ ] Add ARIA labels
- [ ] Add ARIA states (invalid, required, etc.)
- [ ] Test keyboard navigation
- [ ] Add focus indicators
- [ ] Test with screen reader (optional but recommended)

#### 5. Demo Page (20 min)
- [ ] Create showcase file in `/src/app/components/demos/`
- [ ] Show all variants
- [ ] Show all sizes
- [ ] Show all states
- [ ] Add usage examples
- [ ] Add complete form example (if form component)

#### 6. Testing (10 min)
- [ ] Visual test all variants
- [ ] Test all sizes
- [ ] Test all states
- [ ] Test on mobile (DevTools)
- [ ] Test keyboard navigation
- [ ] Test with existing pages

#### 7. Documentation (5 min)
- [ ] Add JSDoc comments
- [ ] Update progress tracker
- [ ] Note any issues or improvements

---

## 📏 CODE STANDARDS

### TypeScript
```typescript
// ✅ Good: Explicit types
export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

// ❌ Bad: Any types
export interface ButtonProps {
  variant?: any;
  size?: any;
}
```

### Props Naming
```typescript
// ✅ Good: Consistent naming
inputSize?: 'sm' | 'md' | 'lg';  // Avoid conflict with HTML size
leftIcon?: React.ReactNode;      // Clear prefix

// ❌ Bad: Ambiguous naming
size?: 'sm' | 'md' | 'lg';       // Conflicts with HTML size
icon?: React.ReactNode;          // Which side?
```

### Styles Organization
```typescript
// ✅ Good: Organized by purpose
const baseStyles = 'flex items-center justify-center';
const interactionStyles = 'hover:bg-accent focus:ring-2';
const variantStyles = {
  default: 'bg-background border-border',
  primary: 'bg-primary text-primary-foreground',
};

// ❌ Bad: All mixed together
const className = 'flex items-center bg-background border hover:bg-accent';
```

### Conditional Styles
```typescript
// ✅ Good: Use cn() utility
className={cn(
  baseStyles,
  variantStyles[variant],
  disabled && 'opacity-50',
  className
)}

// ❌ Bad: String concatenation
className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
```

---

## 🧪 TESTING GUIDELINES

### Visual Testing Checklist
```
[ ] Component renders correctly
[ ] All variants display properly
[ ] All sizes are correct
[ ] Spacing is consistent
[ ] Colors match design system
[ ] Animations are smooth (60fps)
[ ] No visual bugs or glitches
```

### Interaction Testing
```
[ ] Hover states work
[ ] Focus states work (violet ring)
[ ] Active/pressed states work
[ ] Disabled state works
[ ] Loading state works (if applicable)
[ ] Click/tap works
[ ] Keyboard navigation works
```

### Responsive Testing
```
[ ] Desktop (1920x1080)
[ ] Laptop (1366x768)
[ ] Tablet (768x1024)
[ ] Mobile (375x667)
[ ] Mobile landscape (667x375)
```

### Browser Testing (Optional)
```
[ ] Chrome/Edge (primary)
[ ] Firefox
[ ] Safari
```

---

## 🎨 COMMON PATTERNS

### 1. State Management
```typescript
// Controlled component
const [value, setValue] = useState('');

// Uncontrolled with default
const [internalValue, setInternalValue] = useState('');
const inputValue = value !== undefined ? value : internalValue;
```

### 2. Conditional Rendering
```typescript
// With wrapper
return (
  <div>
    {label && <label>{label}</label>}
    <input />
    {helperText && <p>{helperText}</p>}
  </div>
);

// Without wrapper (early return)
if (simple) {
  return <input />;
}

return (
  <div>
    <label>{label}</label>
    <input />
  </div>
);
```

### 3. Icon Sizing
```typescript
const iconSizes = {
  xs: 'size-3.5',
  sm: 'size-4',
  md: 'size-4',
  lg: 'size-5',
  xl: 'size-6',
};

<div className={iconSizes[size]}>
  {icon}
</div>
```

### 4. Focus Ring
```typescript
// Standard focus ring
'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2'

// Within container (use focus-within)
'focus-within:border-[var(--brand-primary)] focus-within:ring-2 focus-within:ring-[var(--brand-primary)]/20'
```

### 5. Transitions
```typescript
// Standard transition
'transition-all duration-200 ease-in-out'

// Specific properties (better performance)
'transition-colors duration-200'
'transition-transform duration-200'
```

---

## 🐛 TROUBLESHOOTING

### Issue: Styles not applying
**Solution:**
- Check Tailwind class names (no typos)
- Ensure cn() utility is used
- Check if parent component overrides styles
- Verify CSS variables are defined in theme.css

### Issue: Component not forwarding ref
**Solution:**
```typescript
// ✅ Good: Use forwardRef
export const Component = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => <div ref={ref} {...props} />
);

// ❌ Bad: No forwardRef
export const Component = (props: Props) => <div {...props} />;
```

### Issue: TypeScript errors
**Solution:**
- Extend correct base type (React.ComponentProps<"element">)
- Use Pick/Omit for prop conflicts
- Add explicit types for all props

### Issue: Focus ring not visible
**Solution:**
- Use `focus-visible:` instead of `focus:`
- Ensure ring color has good contrast
- Add `outline-none` to remove default outline
- Check z-index if ring is behind other elements

### Issue: Animations janky
**Solution:**
- Use transform/opacity (GPU accelerated)
- Avoid animating layout properties (width, height)
- Use will-change sparingly
- Test on lower-end devices

---

## 💡 BEST PRACTICES

### 1. Component Design
- **Single Responsibility** - One component, one job
- **Composition** - Build complex from simple
- **Flexibility** - Support common use cases
- **Consistency** - Follow design system

### 2. Props API
- **Intuitive** - Clear, self-documenting names
- **Flexible** - Support variants and customization
- **Safe** - Sensible defaults
- **Typed** - Full TypeScript support

### 3. Performance
- **React.memo** - For expensive components
- **useCallback** - For event handlers
- **useMemo** - For computed values
- **Code splitting** - Lazy load heavy components

### 4. Accessibility
- **Semantic HTML** - Use correct elements
- **ARIA labels** - Add when needed
- **Keyboard nav** - Support all interactions
- **Focus management** - Clear indicators

---

## 📖 EXAMPLES

### Example: Creating a Badge Component

```typescript
// 1. Plan
// - Variants: default, primary, success, warning, error
// - Sizes: sm, md, lg
// - Features: removable, dot indicator

// 2. Implementation
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "./utils";

export interface BadgeProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  dot?: boolean;
}

const variantStyles = {
  default: 'bg-accent text-foreground border-border',
  primary: 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]',
  success: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
  warning: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
  error: 'bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20',
};

const sizeStyles = {
  sm: 'h-5 px-1.5 text-xs',
  md: 'h-6 px-2 text-sm',
  lg: 'h-7 px-2.5 text-base',
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      removable = false,
      onRemove,
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border font-medium',
          'transition-colors duration-200',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className={cn(
            'size-1.5 rounded-full',
            variant === 'default' && 'bg-foreground',
            variant === 'primary' && 'bg-white',
            variant === 'success' && 'bg-[var(--success)]',
            variant === 'warning' && 'bg-[var(--warning)]',
            variant === 'error' && 'bg-[var(--error)]',
          )} />
        )}
        
        <span className="truncate">{children}</span>
        
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Remove"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = "Badge";

// 3. Create Demo Page
// See BadgeShowcase.tsx

// 4. Test
// - Visual test all variants
// - Test removable functionality
// - Test keyboard navigation (remove button)
// - Test on mobile

// 5. Document
// - Add JSDoc comments
// - Update progress tracker
```

---

## 🎯 QUICK START GUIDE

### Creating Your First Component (15 min)

1. **Copy Template** (2 min)
   ```bash
   cp src/app/components/ui/button.tsx src/app/components/ui/your-component.tsx
   ```

2. **Update Types** (3 min)
   - Change interface name
   - Update props
   - Update component name

3. **Update Styles** (5 min)
   - Define variant styles
   - Define size styles
   - Update className

4. **Create Demo** (5 min)
   ```bash
   cp src/app/components/demos/ButtonShowcase.tsx src/app/components/demos/YourComponentShowcase.tsx
   ```

5. **Test** (5 min)
   - Visual test
   - Interaction test
   - Mobile test

**Done! 🎉**

---

## 📚 RESOURCES

### Design System
- Theme CSS: `/src/styles/theme.css`
- Guidelines: `/Guidelines.md`
- Roadmap: `/UI_REFINEMENT_ROADMAP.md`

### Libraries
- **Radix UI:** https://www.radix-ui.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Lucide Icons:** https://lucide.dev/
- **Motion:** https://motion.dev/

### Tools
- **Tailwind Merge:** Combine Tailwind classes
- **Class Variance Authority:** Type-safe variants
- **TypeScript:** Type safety

---

**Last Updated:** March 17, 2026  
**Version:** 1.0  
**Questions? Check `/UI_DAILY_PROGRESS.md` for help!**
