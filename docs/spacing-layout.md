# 📏 Spacing & Layout System Documentation

> **Version:** 2.0  
> **Last Updated:** 2026-03-17  
> **Base Unit:** 4px (0.25rem)

## Overview

Hệ thống spacing & layout được thiết kế theo nguyên tắc:
1. **4px Grid System** - Tất cả spacing đều là bội số của 4px
2. **Consistent Spacing** - Spacing nhất quán trên toàn ứng dụng
3. **Responsive by Default** - Tự động điều chỉnh theo màn hình
4. **Semantic Naming** - Tên có ý nghĩa rõ ràng

---

## 📐 Spacing Scale

### Base Spacing (4px increments)

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--space-0` | 0 | 0px | No spacing |
| `--space-px` | 1px | 1px | Hairline |
| `--space-0-5` | 0.125rem | 2px | Minimal |
| `--space-1` | 0.25rem | 4px | Tight |
| `--space-2` | 0.5rem | 8px | Compact |
| `--space-3` | 0.75rem | 12px | Cozy |
| `--space-4` | **1rem** | **16px** | **Base** |
| `--space-5` | 1.25rem | 20px | Comfortable |
| `--space-6` | 1.5rem | 24px | Spacious |
| `--space-8` | 2rem | 32px | Loose |
| `--space-10` | 2.5rem | 40px | Extra loose |
| `--space-12` | 3rem | 48px | Section |
| `--space-16` | 4rem | 64px | Large section |
| `--space-20` | 5rem | 80px | Major section |
| `--space-24` | 6rem | 96px | Hero section |
| `--space-32` | 8rem | 128px | Extra large |

### Extended Spacing (Large sections)

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--space-40` | 10rem | 160px | Page sections |
| `--space-48` | 12rem | 192px | Landing sections |
| `--space-64` | 16rem | 256px | Hero areas |
| `--space-80` | 20rem | 320px | Large layouts |
| `--space-96` | 24rem | 384px | Extra large |

---

## 📦 Container System

### Container Sizes

Responsive max-width containers for content areas:

| Size | Max Width | Pixels | Device Target |
|------|-----------|--------|---------------|
| xs | 20rem | 320px | Mobile (portrait) |
| sm | 24rem | 384px | Small mobile |
| md | 28rem | 448px | Large mobile |
| lg | 32rem | 512px | Tablet |
| xl | 36rem | 576px | Small desktop |
| 2xl | 42rem | 672px | Desktop |
| 3xl | 48rem | 768px | Large desktop |
| 4xl | 56rem | 896px | XL desktop |
| 5xl | 64rem | 1024px | 2XL desktop |
| 6xl | 72rem | 1152px | 3XL desktop |
| **7xl** | **80rem** | **1280px** | **Full HD (default)** |
| full | 100% | - | Full width |
| prose | 65ch | ~720px | Optimal reading |

### Usage

```tsx
import { container, containerCentered } from '@/app/utils/layout';

// Max-width only
<div className={container['7xl']}>
  Content with max-width constraint
</div>

// Centered with horizontal padding
<div className={containerCentered['7xl']}>
  Centered content with responsive padding
</div>
```

---

## 📊 Grid System

### Grid Columns

```tsx
import { gridCols, gridResponsive, gridWithGap } from '@/app/utils/layout';

// Fixed columns
<div className={`grid ${gridCols[3]} gap-6`}>
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

// Responsive grid (1 → 2 → 3 columns)
<div className={gridResponsive['1-2-3']}>
  Grid items automatically adjust
</div>
```

### Grid Presets

| Preset | Mobile | Tablet | Desktop | Usage |
|--------|--------|--------|---------|-------|
| `1-2-3` | 1 col | 2 cols | 3 cols | Cards, products |
| `1-2-4` | 1 col | 2 cols | 4 cols | Small cards |
| `1-3` | 1 col | 1 col | 3 cols | Feature sections |
| `1-2` | 1 col | 2 cols | 2 cols | Two-column layout |
| `2-4` | 2 cols | 2 cols | 4 cols | Grid items |
| `autoFit` | Auto | Auto | Auto | Dynamic sizing |

### Grid Gaps

```tsx
import { gap } from '@/app/utils/layout';

<div className={`grid grid-cols-3 ${gap.md}`}>
  Items with 24px gap
</div>
```

| Size | Spacing | Pixels | Usage |
|------|---------|--------|-------|
| xs | 8px | 0.5rem | Tight grids |
| sm | 16px | 1rem | Compact grids |
| **md** | **24px** | **1.5rem** | **Default** |
| lg | 32px | 2rem | Spacious grids |
| xl | 48px | 3rem | Large grids |

---

## 🔲 Flex Layouts

### Flex Utilities

```tsx
import { flex, flexWithGap } from '@/app/utils/layout';

// Common patterns
<div className={flex.between}>
  <span>Left</span>
  <span>Right</span>
</div>

<div className={flex.center}>
  Centered content
</div>

// With gap
<div className={flexWithGap.md}>
  <button>Button 1</button>
  <button>Button 2</button>
</div>
```

### Flex Presets

| Preset | Classes | Usage |
|--------|---------|-------|
| `row` | `flex flex-row` | Horizontal layout |
| `col` | `flex flex-col` | Vertical layout |
| `center` | `flex items-center justify-center` | Center both axes |
| `between` | `flex items-center justify-between` | Space between |
| `start` | `flex items-start justify-start` | Align start |
| `end` | `flex items-end justify-end` | Align end |
| `wrap` | `flex flex-wrap` | Wrap items |

---

## 📚 Component Spacing

### Card Padding

```tsx
import { cardPadding } from '@/app/utils/layout';

<div className={`bg-card rounded-lg ${cardPadding.md}`}>
  Card content
</div>
```

| Size | Padding | Pixels | Usage |
|------|---------|--------|-------|
| sm | 16px | 1rem | Compact cards |
| **md** | **24px** | **1.5rem** | **Default cards** |
| lg | 32px | 2rem | Feature cards |
| xl | 40px | 2.5rem | Hero cards |

### Stack Spacing (Vertical)

For vertical spacing between stacked elements:

```tsx
import { stack } from '@/app/utils/layout';

<div className={stack.md}>
  <h2>Title</h2>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</div>
```

| Size | Spacing | Pixels | Usage |
|------|---------|--------|-------|
| xs | 8px | 0.5rem | Tight lists |
| sm | 16px | 1rem | Compact content |
| **md** | **24px** | **1.5rem** | **Default** |
| lg | 32px | 2rem | Sections |
| xl | 48px | 3rem | Major sections |

### Inline Spacing (Horizontal)

For horizontal spacing between inline elements:

```tsx
import { inline } from '@/app/utils/layout';

<div className={inline.md}>
  <button>Save</button>
  <button>Cancel</button>
</div>
```

| Size | Spacing | Pixels | Usage |
|------|---------|--------|-------|
| xs | 8px | 0.5rem | Tight buttons |
| sm | 12px | 0.75rem | Button groups |
| **md** | **16px** | **1rem** | **Default** |
| lg | 24px | 1.5rem | Spacious |
| xl | 32px | 2rem | Wide spacing |

### Section Spacing

Vertical spacing between major page sections:

```tsx
import { section } from '@/app/utils/layout';

<section className={section.md}>
  Section content
</section>
```

| Size | Spacing | Pixels | Usage |
|------|---------|--------|-------|
| sm | 48px | 3rem | Compact sections |
| **md** | **64px** | **4rem** | **Default sections** |
| lg | 96px | 6rem | Major sections |
| xl | 128px | 8rem | Hero sections |

---

## 🎯 Layout Presets

### Page Layout

Standard page container with responsive padding:

```tsx
import { pageLayout } from '@/app/utils/layout';

<div className={pageLayout}>
  Page content
</div>

// Equivalent to:
// max-w-[80rem] mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10
```

### Card Layout

Standard card with background, border, and padding:

```tsx
import { cardLayout } from '@/app/utils/layout';

<div className={cardLayout}>
  Card content
</div>

// Equivalent to:
// bg-card rounded-lg border p-6
```

### Section Layout

Content section with vertical spacing and centering:

```tsx
import { sectionLayout } from '@/app/utils/layout';

<section className={sectionLayout}>
  Section content
</section>

// Equivalent to:
// py-16 max-w-[72rem] mx-auto px-8
```

### Dashboard Grid

Responsive grid for dashboard layouts:

```tsx
import { dashboardGrid } from '@/app/utils/layout';

<div className={dashboardGrid}>
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

// Equivalent to:
// grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

### Form Layout

Standard form spacing:

```tsx
import { formLayout } from '@/app/utils/layout';

<form className={formLayout.container}>
  <div className={formLayout.field}>
    <label>Name</label>
    <input type="text" />
  </div>
  
  <div className={formLayout.group}>
    <div className={formLayout.field}>
      <label>First Name</label>
      <input type="text" />
    </div>
    <div className={formLayout.field}>
      <label>Last Name</label>
      <input type="text" />
    </div>
  </div>
</form>
```

---

## 🎚️ Z-Index Layers

Consistent stacking order for overlapping elements:

| Layer | Value | Usage |
|-------|-------|-------|
| base | 0 | Default layer |
| dropdown | 1000 | Dropdown menus |
| sticky | 1100 | Sticky headers |
| fixed | 1200 | Fixed elements |
| modalBackdrop | 1300 | Modal backgrounds |
| modal | 1400 | Modal dialogs |
| popover | 1500 | Popovers |
| tooltip | 1600 | Tooltips |
| notification | 1700 | Toast notifications |
| max | 9999 | Always on top |

```tsx
import { zIndex } from '@/app/utils/layout';

<div className={zIndex.modal}>
  Modal content
</div>

<div className={zIndex.tooltip}>
  Tooltip
</div>
```

---

## 📐 Aspect Ratios

Consistent aspect ratios for media:

```tsx
import { aspectRatio } from '@/app/utils/layout';

<div className={aspectRatio.video}>
  <img src="..." alt="..." className="w-full h-full object-cover" />
</div>
```

| Ratio | Value | Usage |
|-------|-------|-------|
| square | 1:1 | Profile images, icons |
| video | 16:9 | Videos, thumbnails |
| photo | 4:3 | Photos, images |
| portrait | 3:4 | Portrait photos |
| wide | 21:9 | Cinematic |
| ultrawide | 32:9 | Ultra-wide displays |

---

## 📱 Responsive Utilities

### Breakpoints

Standard responsive breakpoints:

| Breakpoint | Pixels | Device |
|------------|--------|--------|
| xs | 480px | Small mobile |
| sm | 640px | Mobile |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Extra large |

### Responsive Visibility

```tsx
import { responsive } from '@/app/utils/layout';

// Show only on mobile
<div className={responsive.mobileOnly}>
  Mobile menu
</div>

// Hide on mobile, show on tablet+
<div className={responsive.tabletUp}>
  Desktop menu
</div>

// Show only on desktop
<div className={responsive.desktopOnly}>
  Desktop sidebar
</div>
```

---

## 🛠️ Helper Functions

### combineLayout()

Combine multiple layout classes:

```tsx
import { combineLayout, flex, gap, cardPadding } from '@/app/utils/layout';

<div className={combineLayout(flex.between, gap.md, cardPadding.lg)}>
  Combined layout classes
</div>
```

### getContainer()

Get container class with optional centering:

```tsx
import { getContainer } from '@/app/utils/layout';

// Max-width only
<div className={getContainer('7xl', false)}>Content</div>

// Centered with padding
<div className={getContainer('7xl', true)}>Content</div>
```

### createGrid()

Create custom grid with columns and gap:

```tsx
import { createGrid } from '@/app/utils/layout';

<div className={createGrid(3, 'md')}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Equivalent to: grid grid-cols-3 gap-6
```

### createFlex()

Create flex layout with alignment and gap:

```tsx
import { createFlex } from '@/app/utils/layout';

<div className={createFlex('row', 'between', 'sm')}>
  <span>Left</span>
  <span>Right</span>
</div>

// Equivalent to: flex flex-row items-center justify-between gap-4
```

---

## 💡 Usage Examples

### CRM Lead Card

```tsx
import { cardLayout, stack, flex } from '@/app/utils/layout';
import { heading, body, helper } from '@/app/utils/typography';

<div className={cardLayout}>
  <div className={stack.md}>
    <h3 className={heading.sm}>John Doe</h3>
    <p className={helper.md}>john@example.com</p>
    
    <div className={flex.between}>
      <span className={body.sm}>Status: Qualified</span>
      <span className={body.sm}>Score: 85</span>
    </div>
  </div>
</div>
```

### Dashboard Stats Grid

```tsx
import { dashboardGrid, cardLayout } from '@/app/utils/layout';

<div className={dashboardGrid}>
  <div className={cardLayout}>
    <h3>Total Leads</h3>
    <p className="text-3xl">1,234</p>
  </div>
  
  <div className={cardLayout}>
    <h3>Conversions</h3>
    <p className="text-3xl">234</p>
  </div>
  
  <div className={cardLayout}>
    <h3>Revenue</h3>
    <p className="text-3xl">$1.2M</p>
  </div>
</div>
```

### Two-Column Layout

```tsx
import { flex, gap } from '@/app/utils/layout';

<div className={`${flex.row} ${gap.lg}`}>
  {/* Sidebar */}
  <aside className="w-64 flex-shrink-0">
    Sidebar content
  </aside>
  
  {/* Main content */}
  <main className="flex-1 min-w-0">
    Main content
  </main>
</div>
```

### Responsive Page Layout

```tsx
import { pageLayout, section, stack } from '@/app/utils/layout';

<div className={pageLayout}>
  <section className={section.lg}>
    <div className={stack.lg}>
      <h1>Page Title</h1>
      <p>Page description</p>
    </div>
  </section>
  
  <section className={section.md}>
    <h2>Section Title</h2>
    {/* Section content */}
  </section>
</div>
```

---

## 📋 Quick Reference

### Common Spacing Values

```tsx
// Padding
p-4   // 16px (base)
p-6   // 24px (comfortable)
p-8   // 32px (spacious)

// Margin
m-4   // 16px
m-6   // 24px
m-8   // 32px

// Gap
gap-4  // 16px
gap-6  // 24px
gap-8  // 32px

// Space between (stack/inline)
space-y-4  // 16px vertical
space-x-4  // 16px horizontal
```

### Component Patterns

```tsx
// Card
className="bg-card rounded-lg border p-6"

// Section
className="py-16 max-w-6xl mx-auto px-8"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Flex between
className="flex items-center justify-between"

// Stack
className="space-y-6"
```

---

## 📞 Support

- **Design System Lead:** [Your Name]
- **Slack Channel:** #design-system
- **Figma:** [Link to Spacing specs]
- **Issues:** Report on GitHub với tag `spacing` hoặc `layout`

---

**Last Review:** March 17, 2026  
**Next Review:** June 2026
