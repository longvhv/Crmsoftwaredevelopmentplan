# ✨ Elevation & Shadow System Documentation

> **Version:** 2.0  
> **Last Updated:** 2026-03-17  
> **Purpose:** Create depth and visual hierarchy

## Overview

Hệ thống elevation & shadow được thiết kế để:
1. **Visual Hierarchy** - Tạo độ sâu và thứ bậc rõ ràng
2. **Affordance** - Gợi ý interaction (clickable, draggable, etc.)
3. **Focus Management** - Highlight active/focused elements
4. **Brand Expression** - Colored shadows cho AI features

---

## 🎭 Shadow Levels

### Standard Shadows (Light → Heavy)

| Level | Token | Usage | Example |
|-------|-------|-------|---------|
| none | `shadow.none` | Flat surfaces | Inline text, icons |
| xs | `shadow.xs` | Minimal depth | Table rows, list items |
| sm | `shadow.sm` | Subtle raised | Cards (default), buttons |
| md | `shadow.md` | Floating elements | Hover cards, floating buttons |
| lg | `shadow.lg` | Overlays | Dropdowns, menus, popovers |
| xl | `shadow.xl` | Modals | Dialogs, modal windows |
| 2xl | `shadow['2xl']` | Maximum depth | Full-screen modals, major overlays |

### Usage Guidelines

```tsx
import { shadow } from '@/app/utils/elevation';

// Basic card with subtle shadow
<div className={`bg-card rounded-lg ${shadow.sm}`}>
  Card content
</div>

// Floating action button
<button className={`rounded-full ${shadow.md} hover:${shadow.lg}`}>
  <PlusIcon />
</button>

// Dropdown menu
<div className={`bg-popover rounded-lg ${shadow.lg}`}>
  Menu items
</div>
```

---

## 📐 Elevation Levels

### Semantic Elevation (Component-based)

| Level | Name | Shadow | Z-Index | Usage |
|-------|------|--------|---------|-------|
| 0 | Flat | none | 0 | Background, flat surfaces |
| 1 | Raised | sm | 1 | Cards, buttons |
| 2 | Floating | md | 10 | Floating buttons, hovering cards |
| 3 | Overlay | lg | 1000 | Dropdowns, menus |
| 4 | Modal | xl | 1400 | Dialogs, modal windows |
| 5 | Popover | 2xl | 1500 | Tooltips, popovers |

### Elevation Presets

```tsx
import { elevation } from '@/app/utils/elevation';

// Flat surface (no shadow)
<div className={elevation.flat}>Content</div>

// Raised card (Level 1)
<div className={elevation.raised}>Card</div>

// Floating element (Level 2)
<div className={elevation.floating}>Floating card</div>

// Overlay (Level 3)
<div className={elevation.overlay}>Dropdown menu</div>

// Modal (Level 4)
<div className={elevation.modal}>Modal dialog</div>

// Popover (Level 5)
<div className={elevation.popover}>Tooltip</div>
```

---

## 🎨 Colored Shadows

### Brand & Semantic Colored Shadows

Add colored shadows to emphasize brand identity or semantic meaning:

| Color | Token | Usage |
|-------|-------|-------|
| Primary | `shadowColored.primary` | Primary CTAs, important features |
| Secondary | `shadowColored.secondary` | Secondary actions |
| Success | `shadowColored.success` | Success states, positive actions |
| Warning | `shadowColored.warning` | Warning states, caution |
| Error | `shadowColored.error` | Error states, destructive actions |
| Info | `shadowColored.info` | Info messages, neutral highlights |
| AI | `shadowColored.ai` | AI-powered features |

### Usage

```tsx
import { shadowColored } from '@/app/utils/elevation';

// Primary button with colored shadow
<button className={`bg-[var(--brand-primary)] ${shadowColored.primary}`}>
  Get Started
</button>

// AI feature card
<div className={`bg-card ${shadowColored.ai}`}>
  AI Score: 95/100
</div>

// Success notification
<div className={`bg-[var(--success-50)] ${shadowColored.success}`}>
  Operation successful!
</div>
```

---

## ✨ Glow Effects

### Luminous Highlights

Glow effects for emphasis and AI features:

| Size | Token | Intensity | Usage |
|------|-------|-----------|-------|
| sm | `glow.sm` | Subtle | Gentle highlight |
| md | `glow.md` | Medium | Standard glow |
| lg | `glow.lg` | Strong | Emphasis |
| ai | `glow.ai` | AI Purple | AI-powered features |
| success | `glow.success` | Green | Success states |
| warning | `glow.warning` | Amber | Warning states |
| error | `glow.error` | Red | Error states |

### Usage

```tsx
import { glow, aiEffect } from '@/app/utils/elevation';

// AI badge with glow
<span className={`inline-flex items-center ${glow.ai}`}>
  🤖 AI Powered
</span>

// Pulsing AI indicator
<div className={aiEffect.pulse}>
  AI analyzing...
</div>

// Success indicator with glow
<div className={`rounded-full p-2 ${glow.success}`}>
  ✓
</div>
```

---

## 🎯 Focus Ring Styles

### Keyboard Navigation Accessibility

Focus rings for accessible keyboard navigation:

| Variant | Token | Usage |
|---------|-------|-------|
| Default | `focusRing.default` | Standard elements |
| Primary | `focusRing.primary` | Primary actions |
| Error | `focusRing.error` | Error states |
| Success | `focusRing.success` | Success states |
| None | `focusRing.none` | Remove focus ring |
| Visible | `focusRing.visible` | Keyboard-only focus |
| Visible Primary | `focusRing.visiblePrimary` | Keyboard-only, primary |

### Usage

```tsx
import { focusRing } from '@/app/utils/elevation';

// Button with focus ring
<button className={focusRing.default}>
  Click me
</button>

// Input with error focus
<input className={focusRing.error} />

// Link with keyboard-only focus
<a href="#" className={focusRing.visible}>
  Learn more
</a>
```

### Focus Ring Widths

```tsx
import { focusRingWidth } from '@/app/utils/elevation';

// Thin ring (1px)
<button className={`${focusRing.default} ${focusRingWidth.thin}`}>
  Subtle focus
</button>

// Thick ring (4px)
<button className={`${focusRing.primary} ${focusRingWidth.thick}`}>
  Prominent focus
</button>
```

---

## 🖼️ Component Presets

### Card Elevation

Standard card appearances:

```tsx
import { cardElevation } from '@/app/utils/elevation';

// Flat card (border only)
<div className={cardElevation.flat}>Content</div>

// Raised card (border + subtle shadow)
<div className={cardElevation.raised}>Content</div>

// Floating card (shadow only, no border)
<div className={cardElevation.floating}>Content</div>

// Interactive card (hover effect)
<div className={cardElevation.hover}>
  Hover to lift
</div>
```

### Button Shadows

```tsx
import { buttonShadow } from '@/app/utils/elevation';

// Flat button
<button className={buttonShadow.none}>Flat</button>

// Subtle shadow
<button className={buttonShadow.subtle}>Subtle</button>

// Normal shadow (active state)
<button className={buttonShadow.normal}>Normal</button>

// Strong shadow
<button className={buttonShadow.strong}>Strong</button>
```

### Input Elevation

```tsx
import { inputElevation } from '@/app/utils/elevation';

// Default input
<input className={inputElevation.default} />

// Error state
<input className={inputElevation.error} />

// Success state
<input className={inputElevation.success} />
```

### Menu Shadow

```tsx
import { menuShadow } from '@/app/utils/elevation';

// Standard dropdown
<div className={`bg-popover rounded-lg ${menuShadow.default}`}>
  Menu items
</div>

// Floating menu (stronger shadow)
<div className={`bg-popover rounded-lg ${menuShadow.floating}`}>
  Floating menu
</div>
```

### Modal Shadow

```tsx
import { modalShadow } from '@/app/utils/elevation';

// Modal backdrop
<div className={modalShadow.backdrop}>
  {/* Backdrop overlay */}
</div>

// Modal dialog
<div className={`bg-card rounded-xl ${modalShadow.dialog}`}>
  Modal content
</div>
```

---

## 🎬 Animation Utilities

### Shadow Transitions

Smooth shadow transitions for interactive elements:

```tsx
import { shadowTransition, liftOnHover } from '@/app/utils/elevation';

// Fast transition (150ms)
<button className={`${shadow.sm} hover:${shadow.md} ${shadowTransition.fast}`}>
  Fast
</button>

// Normal transition (200ms)
<button className={`${shadow.sm} hover:${shadow.md} ${shadowTransition.normal}`}>
  Normal
</button>

// Slow transition (300ms)
<button className={`${shadow.sm} hover:${shadow.md} ${shadowTransition.slow}`}>
  Slow
</button>
```

### Lift on Hover

Combine shadow with transform for lift effect:

```tsx
import { liftOnHover } from '@/app/utils/elevation';

// Subtle lift
<div className={`${shadow.sm} ${liftOnHover.subtle}`}>
  Hover to lift (subtle)
</div>

// Normal lift
<div className={`${shadow.sm} ${liftOnHover.normal}`}>
  Hover to lift (normal)
</div>

// Strong lift
<div className={`${shadow.sm} ${liftOnHover.strong}`}>
  Hover to lift (strong)
</div>
```

---

## 🤖 AI-Specific Effects

### AI Component Styling

Special effects for AI-powered features:

```tsx
import { aiEffect } from '@/app/utils/elevation';

// AI glow only
<div className={aiEffect.glow}>
  AI content
</div>

// AI colored shadow
<div className={aiEffect.shadow}>
  AI content
</div>

// AI border (2px purple)
<div className={aiEffect.border}>
  AI content
</div>

// Full AI effect (border + shadow + glow)
<div className={aiEffect.full}>
  AI-powered feature
</div>

// Pulsing AI indicator
<div className={aiEffect.pulse}>
  AI analyzing...
</div>

// Gradient border with glow
<div className={aiEffect.gradientBorder}>
  Premium AI feature
</div>
```

### AI Badge Example

```tsx
import { aiEffect, glow } from '@/app/utils/elevation';

<div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--ai-gradient-start)] to-[var(--ai-gradient-end)] ${glow.ai}`}>
  <SparklesIcon className="w-4 h-4" />
  <span className="text-white font-medium">AI Score: 95</span>
</div>
```

---

## 🛠️ Helper Functions

### combineShadow()

Combine shadow with additional effects:

```tsx
import { combineShadow } from '@/app/utils/elevation';

// Shadow with border
<div className={combineShadow('md', { border: true })}>
  Content
</div>

// Shadow with hover effect
<div className={combineShadow('sm', { hover: true, transition: true })}>
  Hover to increase shadow
</div>

// Shadow with colored shadow
<div className={combineShadow('md', { colored: 'primary' })}>
  Primary colored shadow
</div>

// All options combined
<div className={combineShadow('md', { 
  border: true, 
  hover: true, 
  transition: true,
  colored: 'ai'
})}>
  Full featured shadow
</div>
```

### getElevation()

Get elevation by level (0-5):

```tsx
import { getElevation } from '@/app/utils/elevation';

// Level 0 (flat)
<div className={getElevation(0)}>Flat</div>

// Level 2 (floating)
<div className={getElevation(2)}>Floating</div>

// Level 4 (modal)
<div className={getElevation(4)}>Modal</div>
```

### createFocusRing()

Create custom focus ring with any color:

```tsx
import { createFocusRing } from '@/app/utils/elevation';

<button className={createFocusRing('var(--success)')}>
  Custom focus ring
</button>

<button className={createFocusRing('#ff0000')}>
  Red focus ring
</button>
```

### applyAiGlow()

Apply AI glow with animation:

```tsx
import { applyAiGlow } from '@/app/utils/elevation';

// Medium glow, no animation
<div className={applyAiGlow('medium', false)}>
  AI feature
</div>

// High glow, animated
<div className={applyAiGlow('high', true)}>
  Pulsing AI feature
</div>
```

---

## 💡 Usage Examples

### CRM Lead Card with Elevation

```tsx
import { cardElevation, liftOnHover } from '@/app/utils/elevation';
import { cardLayout } from '@/app/utils/layout';

<div className={`${cardLayout} ${cardElevation.raised} ${liftOnHover.subtle}`}>
  <h3>John Doe</h3>
  <p>Email: john@example.com</p>
  <span className="text-sm text-muted-foreground">Score: 85/100</span>
</div>
```

### AI-Powered Feature Card

```tsx
import { aiEffect, shadowColored } from '@/app/utils/elevation';

<div className={`p-6 rounded-xl bg-gradient-to-br from-purple-50 to-cyan-50 ${aiEffect.full}`}>
  <div className="flex items-center gap-2 mb-4">
    <SparklesIcon className="w-5 h-5 text-[var(--ai-primary)]" />
    <h3 className="font-semibold">AI Insights</h3>
  </div>
  <p>This lead has a 95% conversion probability...</p>
</div>
```

### Interactive Button with Shadow

```tsx
import { shadow, shadowTransition, focusRing } from '@/app/utils/elevation';

<button 
  className={`
    px-6 py-3 
    bg-[var(--brand-primary)] text-white 
    rounded-lg 
    ${shadow.sm} 
    hover:${shadow.md} 
    active:${shadow.xs}
    ${shadowTransition.normal}
    ${focusRing.visiblePrimary}
  `}
>
  Click me
</button>
```

### Dropdown Menu with Proper Elevation

```tsx
import { menuShadow, focusRing } from '@/app/utils/elevation';
import { zIndex } from '@/app/utils/layout';

<div className={`
  absolute top-full mt-2
  bg-popover rounded-lg 
  ${menuShadow.default}
  ${zIndex.dropdown}
  min-w-[200px]
`}>
  <button className={`w-full px-4 py-2 text-left hover:bg-muted ${focusRing.visible}`}>
    Menu Item 1
  </button>
  <button className={`w-full px-4 py-2 text-left hover:bg-muted ${focusRing.visible}`}>
    Menu Item 2
  </button>
</div>
```

### Modal Dialog

```tsx
import { modalShadow, zIndex } from '@/app/utils/elevation';

// Backdrop
<div className={`fixed inset-0 ${modalShadow.backdrop} ${zIndex.modalBackdrop}`} />

// Dialog
<div className={`
  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  bg-card rounded-xl p-6
  ${modalShadow.dialog}
  ${zIndex.modal}
  max-w-lg w-full
`}>
  <h2>Modal Title</h2>
  <p>Modal content...</p>
</div>
```

---

## 📋 Quick Reference

### Shadow Hierarchy

```
none → xs → sm → md → lg → xl → 2xl
  ↑      ↑    ↑    ↑    ↑    ↑     ↑
Flat  Minimal Card Float Over Modal Full
```

### Elevation Levels

```
Level 0: Flat (background)
Level 1: Raised (cards, buttons)
Level 2: Floating (hover states)
Level 3: Overlay (dropdowns, menus)
Level 4: Modal (dialogs)
Level 5: Popover (tooltips)
```

### Common Patterns

```tsx
// Standard card
className="bg-card rounded-lg border shadow-sm"

// Floating card
className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow"

// Dropdown menu
className="bg-popover rounded-lg border shadow-lg"

// Modal
className="bg-card rounded-xl shadow-xl border"

// Button with focus
className="shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"

// AI feature
className="border-2 border-[var(--ai-primary)] shadow-[0_8px_16px_-4px_rgba(139,92,246,0.4)]"
```

---

## ♿ Accessibility Guidelines

### Focus Rings (WCAG 2.1)

- **Always provide visible focus** for keyboard navigation
- **Minimum contrast:** 3:1 for focus indicators
- **Use `focus-visible`** for keyboard-only focus
- **Never remove focus** without providing alternative

### Shadow Contrast

- Shadows should be visible but not overwhelming
- Dark mode: Reduce shadow opacity for subtlety
- Test with low vision simulators

---

## 📞 Support

- **Design System Lead:** [Your Name]
- **Slack Channel:** #design-system
- **Figma:** [Link to Elevation specs]
- **Issues:** Report on GitHub với tag `elevation` hoặc `shadows`

---

**Last Review:** March 17, 2026  
**Next Review:** June 2026
