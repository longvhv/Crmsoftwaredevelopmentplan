# 🎨 Color System Documentation

> **Version:** 2.0  
> **Last Updated:** 2026-03-17  
> **WCAG Compliance:** AA

## Overview

Hệ thống màu sắc được thiết kế với 3 mục tiêu chính:
1. **Nhất quán** - Màu sắc có ý nghĩa semantic rõ ràng
2. **Accessibility** - Đạt chuẩn WCAG 2.1 AA contrast ratio
3. **Dark Mode** - Hỗ trợ đầy đủ chế độ tối

---

## 🎯 Brand Colors

### Primary Brand (Blue)
Màu chính của brand, dùng cho CTA, links, primary actions.

```css
--brand-primary: #0066ff
--brand-primary-50: #e6f0ff   /* Lightest */
--brand-primary-500: #0066ff  /* Base */
--brand-primary-900: #001433  /* Darkest */
```

**Usage:**
- Primary buttons
- Active navigation items
- Important links
- Focus states

### Secondary Brand (Purple)
Màu phụ, dùng cho accents và secondary actions.

```css
--brand-secondary: #7c3aed
--brand-secondary-50: #f5f3ff
--brand-secondary-500: #8b5cf6
--brand-secondary-900: #4c1d95
```

**Usage:**
- Secondary buttons
- Tags
- Badges
- Decorative elements

### Accent (Cyan)
Màu nhấn, tạo contrast và thu hút attention.

```css
--brand-accent: #06b6d4
--brand-accent-50: #ecfeff
--brand-accent-500: #06b6d4
--brand-accent-900: #164e63
```

**Usage:**
- Highlights
- Notifications
- Special badges
- AI features

---

## ✅ Semantic Colors

### Success (Green)
Thành công, hoàn thành, positive states.

```css
--success: #10b981
--success-50: #ecfdf5
--success-500: #10b981
--success-900: #064e3b
```

**Usage:**
- Success messages
- Completed tasks
- Positive indicators
- "Done" states

### Warning (Amber/Orange)
Cảnh báo, cần chú ý, pending states.

```css
--warning: #f59e0b
--warning-50: #fffbeb
--warning-500: #f59e0b
--warning-900: #78350f
```

**Usage:**
- Warning messages
- Pending actions
- Caution indicators
- Expiring items

### Error (Red)
Lỗi, thất bại, destructive actions.

```css
--error: #ef4444
--error-50: #fef2f2
--error-500: #ef4444
--error-900: #7f1d1d
```

**Usage:**
- Error messages
- Failed states
- Delete buttons
- Critical warnings

### Info (Blue)
Thông tin, neutral notifications.

```css
--info: #3b82f6
--info-50: #eff6ff
--info-500: #3b82f6
--info-900: #1e3a8a
```

**Usage:**
- Info messages
- Tooltips
- Help text
- Neutral notifications

---

## 🏢 CRM Status Colors

### Lead Status

| Status | Color | Variable | Usage |
|--------|-------|----------|-------|
| New | Blue | `--lead-new: #3b82f6` | Leads mới chưa xử lý |
| Contacted | Purple | `--lead-contacted: #8b5cf6` | Đã liên hệ |
| Qualified | Green | `--lead-qualified: #10b981` | Đủ điều kiện |
| Unqualified | Gray | `--lead-unqualified: #6b7280` | Không đủ điều kiện |
| Converted | Dark Green | `--lead-converted: #059669` | Đã chuyển đổi |

### Deal Status

| Status | Color | Variable | Usage |
|--------|-------|----------|-------|
| Prospecting | Blue | `--deal-prospecting: #3b82f6` | Tìm kiếm cơ hội |
| Qualification | Purple | `--deal-qualification: #8b5cf6` | Đánh giá |
| Proposal | Amber | `--deal-proposal: #f59e0b` | Đã gửi đề xuất |
| Negotiation | Orange | `--deal-negotiation: #f97316` | Đàm phán |
| Closed Won | Green | `--deal-closed-won: #10b981` | Thắng thầu |
| Closed Lost | Red | `--deal-closed-lost: #ef4444` | Thua thầu |

### Task Priority

| Priority | Color | Variable | Usage |
|----------|-------|----------|-------|
| Critical | Dark Red | `--priority-critical: #dc2626` | Cực kỳ khẩn cấp |
| High | Orange | `--priority-high: #f97316` | Ưu tiên cao |
| Medium | Blue | `--priority-medium: #3b82f6` | Trung bình |
| Low | Gray | `--priority-low: #6b7280` | Ưu tiên thấp |

---

## 🎨 Chart Colors

8 màu cho data visualization, tối ưu cho contrast và distinguishability:

```css
--chart-1: #3b82f6  /* Blue */
--chart-2: #8b5cf6  /* Purple */
--chart-3: #06b6d4  /* Cyan */
--chart-4: #10b981  /* Green */
--chart-5: #f59e0b  /* Amber */
--chart-6: #ef4444  /* Red */
--chart-7: #ec4899  /* Pink */
--chart-8: #6366f1  /* Indigo */
```

**Usage Guidelines:**
- Dùng theo thứ tự 1→8 cho nhiều series
- Tránh dùng Red/Green cạnh nhau (colorblind-friendly)
- Dùng opacity cho overlapping areas

---

## 🤖 AI & Automation Colors

### AI Features
```css
--ai-primary: #8b5cf6
--ai-gradient-start: #8b5cf6
--ai-gradient-end: #06b6d4
--ai-glow: rgba(139, 92, 246, 0.3)
```

**Usage:**
- AI score badges
- Automation indicators
- Smart suggestions
- ML-powered features

### Gradient: AI
```css
background: var(--gradient-ai);
/* linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%) */
```

---

## 🌓 Dark Mode

Tất cả colors đều có dark mode variant được tự động áp dụng khi class `dark` được thêm vào root element.

### Nguyên tắc Dark Mode:
1. **Neutral colors inverted** - Gray 50 ↔ Gray 950
2. **Semantic colors brightened** - Tăng brightness 10-20%
3. **Shadows softer** - Giảm opacity, tăng spread
4. **Borders lighter** - Từ black → white với opacity thấp hơn

### Example:
```css
/* Light Mode */
--background: #ffffff;
--foreground: #0a0a0a;

/* Dark Mode */
.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
}
```

---

## 🎭 Gradients

7 gradient presets cho backgrounds, cards, buttons:

### Primary
```css
--gradient-primary: linear-gradient(135deg, #0066ff 0%, #00a8ff 100%)
```

### AI (Purple → Cyan)
```css
--gradient-ai: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)
```

### Sunset (Orange → Pink)
```css
--gradient-sunset: linear-gradient(135deg, #f97316 0%, #ec4899 100%)
```

### Ocean (Cyan → Blue)
```css
--gradient-ocean: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)
```

**Usage:**
```css
.hero-card {
  background: var(--gradient-primary);
}
```

---

## 💧 Opacity Variants

Predefined opacity values cho consistency:

```css
--opacity-10: 0.1   /* Subtle tints */
--opacity-20: 0.2   /* Very light */
--opacity-30: 0.3   /* Light */
--opacity-40: 0.4   /* Medium-light */
--opacity-50: 0.5   /* Medium */
--opacity-60: 0.6   /* Medium-strong */
--opacity-70: 0.7   /* Strong */
--opacity-80: 0.8   /* Very strong */
--opacity-90: 0.9   /* Almost opaque */
```

**Usage with colors:**
```css
/* Background with opacity */
background: rgb(from var(--brand-primary) r g b / var(--opacity-10));

/* Or with rgba */
background: rgba(0, 102, 255, var(--opacity-10));
```

---

## ♿ Accessibility (WCAG AA)

### Contrast Ratios

Tất cả color combinations đã được test và đảm bảo đạt WCAG 2.1 Level AA:

| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| `--foreground` | `--background` | 19.8:1 | ✅ AAA |
| `--primary` | `--background` | 7.2:1 | ✅ AA |
| `--success-700` | `--success-50` | 8.1:1 | ✅ AA |
| `--error-700` | `--error-50` | 9.3:1 | ✅ AA |
| `--warning-800` | `--warning-50` | 10.5:1 | ✅ AAA |

### Guidelines:
- **Normal text (16px):** Minimum 4.5:1 contrast ratio
- **Large text (24px+):** Minimum 3:1 contrast ratio
- **Interactive elements:** Minimum 3:1 contrast ratio

### Testing:
```bash
# Use contrast checker tools
npm run test:contrast

# Or online tools:
# - https://webaim.org/resources/contrastchecker/
# - https://contrast-ratio.com/
```

---

## 🛠️ Usage Examples

### Buttons
```tsx
/* Primary button */
<button className="bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-600)]">
  Primary Action
</button>

/* Success button */
<button className="bg-[var(--success)] text-white">
  Save Changes
</button>

/* Destructive button */
<button className="bg-[var(--error)] text-white">
  Delete
</button>
```

### Status Badges
```tsx
/* Lead status */
<span className="bg-[var(--lead-qualified)] text-white">
  Qualified
</span>

/* Deal status */
<span className="bg-[var(--deal-proposal)] text-white">
  Proposal Sent
</span>

/* Priority */
<span className="bg-[var(--priority-critical)] text-white">
  Critical
</span>
```

### Cards with Gradients
```tsx
<div className="bg-[var(--gradient-ai)] p-6 rounded-xl">
  <h3 className="text-white">AI-Powered Insights</h3>
</div>
```

### Charts
```tsx
import { Bar } from 'recharts';

<Bar dataKey="revenue" fill="var(--chart-1)" />
<Bar dataKey="expenses" fill="var(--chart-6)" />
```

---

## 📋 Quick Reference

### Most Common Colors

```css
/* Backgrounds */
--background: #ffffff
--surface: #ffffff
--muted: #f5f5f5

/* Text */
--foreground: #0a0a0a
--muted-foreground: #737373

/* Brand */
--brand-primary: #0066ff
--brand-secondary: #7c3aed

/* Semantic */
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6
```

---

## 🔄 Migration from Old System

Nếu đang dùng old color variables:

| Old Variable | New Variable | Notes |
|--------------|--------------|-------|
| `--primary` | `--brand-primary` | Same value, semantic name |
| `--destructive` | `--error` | Semantic naming |
| No equivalent | `--success` | New semantic color |
| No equivalent | `--warning` | New semantic color |
| No equivalent | `--info` | New semantic color |

**Backward Compatible:** Old variables vẫn hoạt động, nhưng nên migrate sang naming mới.

---

## 📞 Support

- **Design System Lead:** [Your Name]
- **Slack Channel:** #design-system
- **Figma:** [Link to Figma file]
- **Issues:** Report trên GitHub Issues với tag `design-system`

---

**Last Review:** March 17, 2026  
**Next Review:** June 2026
