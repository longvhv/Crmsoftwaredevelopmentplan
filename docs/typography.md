# 🔤 Typography System Documentation

> **Version:** 2.0  
> **Last Updated:** 2026-03-17  
> **Type Scale:** Minor Third (1.200)

## Overview

Hệ thống typography được thiết kế theo nguyên tắc:
1. **Hierarchy** - Rõ ràng về thứ bậc thông tin
2. **Readability** - Tối ưu cho khả năng đọc
3. **Consistency** - Nhất quán trên toàn bộ ứng dụng
4. **Responsive** - Tự động điều chỉnh theo màn hình

---

## 📏 Type Scale

Sử dụng **Minor Third (1.200)** ratio cho scale harmonious:

| Size | Token | Pixels | Rem | Usage |
|------|-------|--------|-----|-------|
| 7xl | `--text-7xl` | 72px | 4.5rem | Hero displays |
| 6xl | `--text-6xl` | 60px | 3.75rem | Extra large displays |
| 5xl | `--text-5xl` | 48px | 3rem | Large displays |
| 4xl | `--text-4xl` | 36px | 2.25rem | Page titles |
| 3xl | `--text-3xl` | 30px | 1.875rem | Section headers |
| 2xl | `--text-2xl` | 24px | 1.5rem | Subsection headers |
| xl | `--text-xl` | 20px | 1.25rem | Card titles |
| lg | `--text-lg` | 18px | 1.125rem | Large body text |
| **base** | `--text-base` | **16px** | **1rem** | **Default body** |
| sm | `--text-sm` | 14px | 0.875rem | Small body text |
| xs | `--text-xs` | 12px | 0.75rem | Captions, labels |

---

## 🎯 Typography Presets

### Display Text (Hero Sections)

Used for landing pages, marketing headers, hero sections.

| Size | Class | Font Size | Line Height | Weight | Tracking |
|------|-------|-----------|-------------|--------|----------|
| 2xl | `display['2xl']` | 72px | 1.1 | 700 | -0.025em |
| xl | `display.xl` | 60px | 1.1 | 700 | -0.025em |
| lg | `display.lg` | 48px | 1.2 | 700 | -0.025em |

**Usage:**
```tsx
import { display } from '@/app/utils/typography';

<h1 className={display['2xl']}>
  Welcome to Our CRM
</h1>
```

---

### Headings (Page & Section Titles)

Used for page titles, section headers, card titles.

| Size | Class | Font Size | Line Height | Weight |
|------|-------|-----------|-------------|--------|
| xl | `heading.xl` | 36px | 1.25 | 600 |
| lg | `heading.lg` | 30px | 1.3 | 600 |
| md | `heading.md` | 24px | 1.35 | 600 |
| sm | `heading.sm` | 20px | 1.4 | 600 |
| xs | `heading.xs` | 18px | 1.45 | 600 |

**Usage:**
```tsx
import { heading } from '@/app/utils/typography';

<h2 className={heading.lg}>Lead Management</h2>
<h3 className={heading.md}>Recent Activity</h3>
<h4 className={heading.sm}>Contact Details</h4>
```

---

### Body Text (Main Content)

Used for paragraphs, descriptions, main content.

| Size | Class | Font Size | Line Height | Weight |
|------|-------|-----------|-------------|--------|
| lg | `body.lg` | 18px | 1.625 | 400 |
| **md** | `body.md` | **16px** | **1.5** | **400** |
| sm | `body.sm` | 14px | 1.5 | 400 |
| xs | `body.xs` | 12px | 1.5 | 400 |

**Usage:**
```tsx
import { body } from '@/app/utils/typography';

<p className={body.md}>
  This is the default body text for paragraphs and descriptions.
</p>

<p className={body.lg}>
  Large body text for emphasis or lead paragraphs.
</p>
```

---

### Labels (Form & UI Labels)

Used for form labels, button labels, UI text.

| Size | Class | Font Size | Line Height | Weight |
|------|-------|-----------|-------------|--------|
| lg | `label.lg` | 14px | 1.5 | 500 |
| md | `label.md` | 13px | 1.5 | 500 |
| sm | `label.sm` | 12px | 1.5 | 500 |

**Usage:**
```tsx
import { label } from '@/app/utils/typography';

<label className={label.lg}>Email Address</label>
<span className={label.sm}>Required</span>
```

---

### Helper Text (Captions & Metadata)

Used for captions, hints, metadata, timestamps.

| Size | Class | Font Size | Color |
|------|-------|-----------|-------|
| lg | `helper.lg` | 14px | muted |
| md | `helper.md` | 12px | muted |
| sm | `helper.sm` | 11px | muted |

**Usage:**
```tsx
import { helper } from '@/app/utils/typography';

<p className={helper.md}>
  Last updated 2 hours ago
</p>
```

---

### Code/Monospace

Used for code snippets, technical text, IDs.

| Variant | Class | Usage |
|---------|-------|-------|
| base | `code.base` | Plain code text |
| inline | `code.inline` | Inline code in text |
| block | `code.block` | Code blocks |

**Usage:**
```tsx
import { code } from '@/app/utils/typography';

<code className={code.inline}>npm install</code>

<pre className={code.block}>
  {`const greeting = "Hello World";`}
</pre>
```

---

## 🎨 Font Weights

9 weight options for different emphasis levels:

| Weight | Variable | Value | Usage |
|--------|----------|-------|-------|
| Thin | `--font-weight-thin` | 100 | Decorative only |
| Extralight | `--font-weight-extralight` | 200 | Very light emphasis |
| Light | `--font-weight-light` | 300 | Light emphasis |
| **Normal** | `--font-weight-normal` | **400** | **Body text** |
| Medium | `--font-weight-medium` | 500 | Labels, buttons |
| Semibold | `--font-weight-semibold` | 600 | Headings |
| Bold | `--font-weight-bold` | 700 | Strong emphasis |
| Extrabold | `--font-weight-extrabold` | 800 | Extra emphasis |
| Black | `--font-weight-black` | 900 | Maximum emphasis |

**Common Patterns:**
- **Body text:** 400 (Normal)
- **Labels & Buttons:** 500 (Medium)
- **Headings:** 600 (Semibold)
- **Display:** 700 (Bold)

---

## 📐 Line Heights

6 line height options for different text densities:

| Name | Variable | Value | Usage |
|------|----------|-------|-------|
| None | `--leading-none` | 1 | Tight spacing, icons |
| Tight | `--leading-tight` | 1.25 | Headings |
| Snug | `--leading-snug` | 1.375 | Compact text |
| **Normal** | `--leading-normal` | **1.5** | **Body text** |
| Relaxed | `--leading-relaxed` | 1.625 | Comfortable reading |
| Loose | `--leading-loose` | 2 | Spacious reading |

**Best Practices:**
- **Headings:** Use tight (1.25) for visual impact
- **Body:** Use normal (1.5) for readability
- **Long-form:** Use relaxed (1.625) for comfort

---

## 🔠 Letter Spacing (Tracking)

6 tracking options for fine-tuning readability:

| Name | Variable | Value | Usage |
|------|----------|-------|-------|
| Tighter | `--tracking-tighter` | -0.05em | Large displays |
| Tight | `--tracking-tight` | -0.025em | Headings |
| **Normal** | `--tracking-normal` | **0em** | **Default** |
| Wide | `--tracking-wide` | 0.025em | Uppercase text |
| Wider | `--tracking-wider` | 0.05em | Labels, badges |
| Widest | `--tracking-widest` | 0.1em | All-caps headings |

**Usage:**
```tsx
import { tracking } from '@/app/utils/typography';

<h1 className={`${heading.xl} ${tracking.tight}`}>
  Tight Tracking
</h1>

<span className={`${label.sm} ${tracking.wider} uppercase`}>
  Badge
</span>
```

---

## 🎭 Preset Combinations

Common typography patterns ready to use:

### Page Structure

```tsx
import { pageTitle, sectionTitle, cardTitle } from '@/app/utils/typography';

// Page header
<h1 className={pageTitle}>Lead Management</h1>

// Section header
<h2 className={sectionTitle}>Recent Leads</h2>

// Card header
<h3 className={cardTitle}>Contact Details</h3>
```

### Content Patterns

```tsx
import { paragraph, caption, muted } from '@/app/utils/typography';

// Main paragraph
<p className={paragraph}>
  This is the main content of the page...
</p>

// Image caption
<p className={caption}>Photo by John Doe</p>

// Less important text
<p className={muted}>Optional field</p>
```

### Interactive Elements

```tsx
import { buttonText, link, badgeText } from '@/app/utils/typography';

// Button
<button className={buttonText}>Save Changes</button>

// Link
<a href="#" className={link}>Learn more</a>

// Badge
<span className={badgeText}>New</span>
```

---

## 📱 Responsive Typography

Auto-scaling typography for mobile → desktop:

### Responsive Display

```tsx
import { displayResponsive } from '@/app/utils/typography';

// Scales from heading.lg (mobile) to display.2xl (desktop)
<h1 className={displayResponsive['2xl']}>
  Hero Title
</h1>
```

**Scaling:**
- `displayResponsive['2xl']`: 48px → 72px
- `displayResponsive.xl`: 48px → 60px
- `displayResponsive.lg`: 24px → 48px

### Responsive Headings

```tsx
import { headingResponsive } from '@/app/utils/typography';

// Scales from heading.md (mobile) to heading.xl (desktop)
<h2 className={headingResponsive.xl}>
  Section Title
</h2>
```

**Scaling:**
- `headingResponsive.xl`: 24px → 36px
- `headingResponsive.lg`: 20px → 30px
- `headingResponsive.md`: 18px → 24px

---

## 🛠️ Helper Functions

### getTypography()

Dynamic typography class retrieval:

```tsx
import { getTypography } from '@/app/utils/typography';

const variant = 'heading';
const size = 'lg';

<h2 className={getTypography(variant, size)}>
  Dynamic Typography
</h2>
```

### combineTypography()

Combine multiple typography classes:

```tsx
import { combineTypography, heading, tracking, textAlign } from '@/app/utils/typography';

<h2 className={combineTypography(heading.lg, tracking.tight, textAlign.center)}>
  Combined Styles
</h2>
```

### truncateLines()

Truncate text after N lines with ellipsis:

```tsx
import { truncateLines } from '@/app/utils/typography';

<p className={`${body.md} ${truncateLines(3)}`}>
  Long text that will be truncated after 3 lines with an ellipsis...
</p>
```

---

## ♿ Accessibility Guidelines

### Minimum Font Sizes

Per WCAG 2.1 guidelines:
- **Body text:** Minimum 16px (1rem)
- **Small text:** Minimum 12px (0.75rem)
- **Interactive elements:** Minimum 14px (0.875rem)

### Line Length

For optimal readability:
- **Minimum:** 45 characters
- **Optimal:** 50-75 characters
- **Maximum:** 90 characters

```tsx
// Constrain line length for readability
<div className="max-w-prose">
  <p className={paragraph}>
    Text content with optimal line length...
  </p>
</div>
```

### Contrast Ratios

Text must meet WCAG AA contrast requirements:
- **Normal text:** Minimum 4.5:1
- **Large text (18px+):** Minimum 3:1
- **Bold text (14px+):** Minimum 3:1

---

## 🎨 Usage Examples

### CRM Lead Card

```tsx
import { heading, body, label, helper } from '@/app/utils/typography';

<div className="p-6 bg-card rounded-lg">
  <h3 className={heading.sm}>John Doe</h3>
  <p className={helper.md}>john@example.com</p>
  
  <div className="mt-4 space-y-2">
    <div>
      <span className={label.sm}>Status</span>
      <p className={body.sm}>Qualified</p>
    </div>
    <div>
      <span className={label.sm}>Score</span>
      <p className={body.sm}>85/100</p>
    </div>
  </div>
</div>
```

### Dashboard Stats Card

```tsx
import { display, body, helper } from '@/app/utils/typography';

<div className="p-6 bg-card rounded-xl">
  <p className={helper.lg}>Total Revenue</p>
  <h2 className={display.lg}>$1.2M</h2>
  <p className={body.sm}>
    <span className="text-success">↑ 12.5%</span> from last month
  </p>
</div>
```

### Form Layout

```tsx
import { heading, label, helper, body } from '@/app/utils/typography';

<form className="space-y-6">
  <h2 className={heading.md}>Create New Lead</h2>
  
  <div className="space-y-2">
    <label className={label.lg}>Full Name *</label>
    <input type="text" className={body.md} />
    <p className={helper.md}>Enter the lead's full name</p>
  </div>
  
  <button className="font-medium">Submit</button>
</form>
```

---

## 📋 Quick Reference

### Common Patterns

```tsx
// Page header
className={heading.xl + ' tracking-tight'}

// Section header
className={heading.lg + ' tracking-tight'}

// Card title
className={heading.sm}

// Body paragraph
className={body.md + ' text-foreground'}

// Caption/metadata
className={helper.md}

// Button text
className={body.sm + ' font-medium'}

// Badge/label
className={label.sm + ' uppercase tracking-wide'}
```

### CSS Custom Properties

Direct CSS usage:

```css
.custom-heading {
  font-size: var(--heading-lg-size);
  line-height: var(--heading-lg-line);
  font-weight: var(--heading-lg-weight);
}

.custom-body {
  font-size: var(--body-md-size);
  line-height: var(--body-md-line);
  font-weight: var(--body-md-weight);
}
```

---

## 🔄 Migration from Old System

| Old Approach | New Approach | Notes |
|--------------|--------------|-------|
| `text-2xl` | `heading.xl` | Semantic preset |
| `text-lg font-semibold` | `heading.xs` | Combined preset |
| `text-sm text-gray-500` | `helper.lg` | Muted helper |
| Custom sizes | `display` / `heading` | Use presets |

---

## 📐 Design Tokens Reference

Full list of CSS custom properties:

```css
/* Font Sizes */
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */
--text-5xl: 3rem        /* 48px */
--text-6xl: 3.75rem     /* 60px */
--text-7xl: 4.5rem      /* 72px */

/* Font Weights */
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700

/* Line Heights */
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.625

/* Letter Spacing */
--tracking-tight: -0.025em
--tracking-normal: 0em
--tracking-wide: 0.025em
--tracking-wider: 0.05em
```

---

## 📞 Support

- **Design System Lead:** [Your Name]
- **Slack Channel:** #design-system
- **Figma:** [Link to Typography specs]
- **Issues:** Report trên GitHub với tag `typography`

---

**Last Review:** March 17, 2026  
**Next Review:** June 2026
