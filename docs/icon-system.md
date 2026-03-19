# 🎨 Icon System Documentation

> **Version:** 2.0  
> **Last Updated:** 2026-03-17  
> **Library:** lucide-react 0.487.0

## Overview

Hệ thống icon được thiết kế để:
1. **Consistency** - Icons thống nhất trên toàn ứng dụng
2. **Accessibility** - ARIA labels và semantic HTML
3. **Performance** - Tree-shaking với lucide-react
4. **Flexibility** - Preset sizes, colors, animations

---

## 📦 Installation

Icon system sử dụng **lucide-react** - đã được cài đặt sẵn:

```json
{
  "dependencies": {
    "lucide-react": "0.487.0"
  }
}
```

---

## 🎯 Quick Start

### Basic Usage

```tsx
import { Icon } from '@/app/components/ui/Icon';
import { icons } from '@/app/utils/icons';

// Simple icon
<Icon icon={icons.user} />

// With size and color
<Icon icon={icons.mail} size="lg" color="primary" />

// Animated
<Icon icon={icons.loader} size="md" animated="spin" />
```

### Icon Collections

```tsx
import { icons } from '@/app/utils/icons';

// Navigation
<Icon icon={icons.navigation.home} />
<Icon icon={icons.navigation.dashboard} />

// CRM - Leads
<Icon icon={icons.lead.leads} />
<Icon icon={icons.lead.qualified} />

// AI
<Icon icon={icons.ai.sparkles} />
<Icon icon={icons.ai.bot} />
```

---

## 📐 Icon Sizes

### Size Presets

| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 12px | Dense UI, badges |
| `sm` | 16px | Table cells, inline text |
| `md` | 20px | **Default** - Buttons, inputs |
| `lg` | 24px | Headers, cards |
| `xl` | 32px | Feature icons, empty states |
| `2xl` | 40px | Large cards, hero sections |
| `3xl` | 48px | Landing pages, illustrations |

### Examples

```tsx
// Extra small - badges
<Icon icon={icons.check} size="xs" />

// Small - table cells
<Icon icon={icons.user} size="sm" />

// Medium - default buttons
<Icon icon={icons.edit} size="md" />

// Large - card headers
<Icon icon={icons.sparkles} size="lg" />

// Extra large - empty states
<Icon icon={icons.inbox} size="xl" />
```

---

## 🎨 Icon Colors

### Color Presets

| Color | CSS Variable | Usage |
|-------|--------------|-------|
| `default` | `--foreground` | Standard text color |
| `muted` | `--muted-foreground` | Secondary text |
| `primary` | `--brand-primary` | Primary actions |
| `secondary` | `--brand-secondary` | Secondary brand |
| `accent` | `--brand-accent` | Accent highlights |
| `success` | `--success` | Success states |
| `warning` | `--warning` | Warning states |
| `error` | `--error` | Error states |
| `info` | `--info` | Info messages |
| `ai` | `--ai-primary` | AI features |
| `inherit` | - | Inherit from parent |
| `current` | - | Current text color |

### Examples

```tsx
// Default (foreground)
<Icon icon={icons.user} color="default" />

// Muted (secondary text)
<Icon icon={icons.calendar} color="muted" />

// Primary action
<Icon icon={icons.plus} color="primary" />

// Status colors
<Icon icon={icons.check} color="success" />
<Icon icon={icons.alert} color="warning" />
<Icon icon={icons.x} color="error" />

// AI features
<Icon icon={icons.sparkles} color="ai" />
```

---

## 🎬 Icon Animations

### Animation Presets

| Animation | Description | Usage |
|-----------|-------------|-------|
| `spin` | 360° rotation | Loading states |
| `pulse` | Opacity pulse | Attention, notifications |
| `bounce` | Vertical bounce | Success, celebration |
| `ping` | Ripple effect | New notifications |
| `wiggle` | Slight rotation | Playful interactions |
| `shake` | Horizontal shake | Errors, warnings |
| `glow` | Glow effect | AI features, emphasis |

### Examples

```tsx
// Loading spinner
<Icon icon={icons.loader} animated="spin" />

// Pulsing notification
<Icon icon={icons.bell} animated="pulse" />

// Bouncing success
<Icon icon={icons.check} animated="bounce" />

// Wiggling delete button
<Icon icon={icons.trash} animated="wiggle" />

// Glowing AI badge
<Icon icon={icons.sparkles} animated="glow" color="ai" />
```

---

## 📚 Icon Collections

### Navigation Icons

```tsx
import { icons } from '@/app/utils/icons';

icons.navigation.home          // Home
icons.navigation.dashboard     // Dashboard
icons.navigation.menu          // Menu
icons.navigation.close         // Close (X)
icons.navigation.settings      // Settings
icons.navigation.notifications // Bell
icons.navigation.search        // Search
icons.navigation.filter        // Filter
icons.navigation.sort          // Sort
```

### Lead Management Icons

```tsx
icons.lead.leads        // Users group
icons.lead.lead         // Single user
icons.lead.newLead      // User plus
icons.lead.qualified    // User check
icons.lead.unqualified  // User X
icons.lead.contact      // Contact card
icons.lead.company      // Briefcase
icons.lead.star         // Star (favorite)
icons.lead.unstar       // Star off
```

### Deal & Opportunity Icons

```tsx
icons.deal.deal       // Trending up
icons.deal.lost       // Trending down
icons.deal.value      // Dollar sign
icons.deal.pipeline   // Bar chart
icons.deal.forecast   // Pie chart
icons.deal.target     // Target
icons.deal.hot        // Flame
icons.deal.won        // Trophy
icons.deal.award      // Medal
```

### Activity & Task Icons

```tsx
icons.activity.task      // Check circle
icons.activity.pending   // Circle
icons.activity.completed // Check square
icons.activity.failed    // X circle
icons.activity.call      // Phone call
icons.activity.meeting   // Video
icons.activity.email     // Mail
icons.activity.message   // Message square
icons.activity.note      // File text
icons.activity.reminder  // Clock
```

### Contact Information Icons

```tsx
icons.contact.email    // Mail
icons.contact.phone    // Phone
icons.contact.mobile   // Phone
icons.contact.address  // Map pin
icons.contact.website  // Globe
icons.contact.calendar // Calendar
icons.contact.tag      // Tag
icons.contact.link     // Link
```

### AI & Automation Icons

```tsx
icons.ai.ai         // Sparkles
icons.ai.bot        // Bot
icons.ai.magic      // Wand
icons.ai.smart      // Brain
icons.ai.insight    // Lightbulb
icons.ai.automated  // Lightning
icons.ai.prediction // CPU
icons.ai.layers     // Layers
```

### Action Icons

```tsx
icons.action.add      // Plus
icons.action.remove   // Minus
icons.action.edit     // Edit
icons.action.delete   // Trash
icons.action.copy     // Copy
icons.action.download // Download
icons.action.upload   // Upload
icons.action.share    // Share
icons.action.view     // Eye
icons.action.hide     // Eye off
icons.action.save     // Save
icons.action.refresh  // Refresh
icons.action.send     // Send
icons.action.link     // Link
```

### Status Icons

```tsx
icons.status.success  // Check
icons.status.error    // X
icons.status.warning  // Alert triangle
icons.status.info     // Alert circle
icons.status.help     // Help circle
icons.status.loading  // Loader
icons.status.blocked  // Ban
icons.status.verified // Shield
```

### Chart & Analytics Icons

```tsx
icons.chart.bar       // Bar chart
icons.chart.line      // Line chart
icons.chart.pie       // Pie chart
icons.chart.activity  // Activity
icons.chart.growth    // Trending up
icons.chart.percent   // Percent
icons.chart.trending  // Trending up
```

---

## 🧩 Components

### Icon Component

Basic icon with presets:

```tsx
<Icon 
  icon={icons.user} 
  size="md"               // xs | sm | md | lg | xl | 2xl | 3xl
  color="primary"         // default | muted | primary | success | etc.
  animated="pulse"        // spin | pulse | bounce | etc.
  strokeWidth={2}         // Lucide stroke width
  aria-label="User icon"  // Accessibility
  decorative={false}      // Hide from screen readers
/>
```

### IconWithBadge Component

Icon with notification badge:

```tsx
<IconWithBadge 
  icon={icons.bell}
  size="lg"
  badgeCount={5}
  badgeColor="error"              // primary | secondary | success | warning | error
  badgePosition="top-right"       // top-right | top-left | bottom-right | bottom-left
/>
```

### IconButton Component

Clickable icon button:

```tsx
<IconButton 
  icon={icons.trash}
  aria-label="Delete"             // Required for accessibility
  variant="destructive"           // default | ghost | outline | primary | destructive
  size="md"
  loading={false}
  onClick={handleDelete}
/>
```

### StatusIcon Component

Automatic icon based on status:

```tsx
<StatusIcon 
  status="success"      // success | error | warning | info | loading
  size="md"
  colorize={true}       // Auto-apply status color
/>
```

### AnimatedIcon Component

Conditional animation:

```tsx
<AnimatedIcon 
  icon={icons.check}
  animated="bounce"
  animate={isSuccess}   // Control animation
  delay={200}          // Animation delay (ms)
/>
```

---

## 🎯 CRM Status Mappings

### Lead Status Icons

```tsx
import { getStatusIcon } from '@/app/utils/icons';

const LeadStatusIcon = getStatusIcon('lead', 'qualified');
// Returns: UserCheck icon

// All lead statuses:
// 'new' → UserPlus
// 'contacted' → Phone
// 'qualified' → UserCheck
// 'unqualified' → UserX
// 'converted' → Trophy
// 'lost' → TrendingDown
```

### Deal Status Icons

```tsx
const DealStatusIcon = getStatusIcon('deal', 'closed-won');
// Returns: Trophy icon

// All deal statuses:
// 'prospecting' → Search
// 'qualification' → UserCheck
// 'proposal' → FileText
// 'negotiation' → MessageSquare
// 'closed-won' → Trophy
// 'closed-lost' → TrendingDown
```

### Priority Icons

```tsx
const PriorityIcon = getStatusIcon('priority', 'high');
// Returns: Flame icon

// All priorities:
// 'critical' → AlertTriangle
// 'high' → Flame
// 'medium' → Flag
// 'low' → Circle
```

### Activity Type Icons

```tsx
const ActivityIcon = getStatusIcon('activity', 'call');
// Returns: PhoneCall icon

// All activity types:
// 'call' → PhoneCall
// 'meeting' → Video
// 'email' → Mail
// 'task' → CheckCircle2
// 'note' → FileText
// 'deadline' → Calendar
```

---

## 💡 Usage Examples

### CRM Lead Card

```tsx
import { Icon } from '@/app/components/ui/Icon';
import { icons, getStatusIcon } from '@/app/utils/icons';

function LeadCard({ lead }) {
  const StatusIcon = getStatusIcon('lead', lead.status);
  
  return (
    <div className="flex items-center gap-3">
      {/* Lead status icon */}
      <Icon icon={StatusIcon} size="lg" color="primary" />
      
      {/* Lead name */}
      <div>
        <h3>{lead.name}</h3>
        
        {/* Contact info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon icon={icons.mail} size="xs" />
          <span>{lead.email}</span>
        </div>
      </div>
      
      {/* AI score badge */}
      <div className="ml-auto">
        <Icon icon={icons.sparkles} size="sm" color="ai" animated="glow" />
      </div>
    </div>
  );
}
```

### Action Buttons Row

```tsx
import { IconButton } from '@/app/components/ui/Icon';
import { icons } from '@/app/utils/icons';

function ActionButtons({ onEdit, onDelete, onShare }) {
  return (
    <div className="flex items-center gap-2">
      <IconButton 
        icon={icons.edit}
        aria-label="Edit"
        variant="ghost"
        onClick={onEdit}
      />
      
      <IconButton 
        icon={icons.trash}
        aria-label="Delete"
        variant="destructive"
        onClick={onDelete}
      />
      
      <IconButton 
        icon={icons.share}
        aria-label="Share"
        variant="outline"
        onClick={onShare}
      />
    </div>
  );
}
```

### Notification Bell with Badge

```tsx
import { IconWithBadge } from '@/app/components/ui/Icon';
import { icons } from '@/app/utils/icons';

function NotificationButton({ count }) {
  return (
    <button className="relative">
      <IconWithBadge 
        icon={icons.bell}
        size="lg"
        badgeCount={count}
        badgeColor="error"
        badgePosition="top-right"
      />
    </button>
  );
}
```

### Loading State

```tsx
import { Icon, StatusIcon } from '@/app/components/ui/Icon';
import { icons } from '@/app/utils/icons';

function LoadingButton({ loading, children }) {
  return (
    <button disabled={loading}>
      {loading ? (
        <Icon icon={icons.loader} size="sm" animated="spin" />
      ) : (
        <Icon icon={icons.check} size="sm" />
      )}
      <span>{children}</span>
    </button>
  );
}

// Or use StatusIcon
<StatusIcon status="loading" size="md" />
```

### Status Indicators

```tsx
import { StatusIcon } from '@/app/components/ui/Icon';

function StatusMessage({ type, message }) {
  return (
    <div className="flex items-center gap-2">
      <StatusIcon status={type} size="md" />
      <span>{message}</span>
    </div>
  );
}

// Usage:
<StatusMessage type="success" message="Lead created successfully" />
<StatusMessage type="error" message="Failed to save changes" />
<StatusMessage type="loading" message="Saving..." />
```

---

## ♿ Accessibility Guidelines

### ARIA Labels

Always provide `aria-label` for icon-only buttons:

```tsx
// ✅ Good - has aria-label
<IconButton icon={icons.delete} aria-label="Delete lead" />

// ❌ Bad - no label for screen readers
<IconButton icon={icons.delete} />
```

### Decorative Icons

Mark decorative icons (next to text) as `decorative`:

```tsx
// Text + icon (icon is decorative)
<button>
  <Icon icon={icons.save} decorative />
  <span>Save Changes</span>
</button>

// Icon-only (icon is meaningful)
<Icon icon={icons.save} aria-label="Save changes" />
```

### Focus States

Icon buttons automatically include focus rings:

```tsx
<IconButton 
  icon={icons.edit}
  aria-label="Edit"
  // Automatic focus ring for keyboard navigation
/>
```

---

## 🎨 Customization

### Custom Stroke Width

```tsx
<Icon icon={icons.user} strokeWidth={1.5} />  // Thinner
<Icon icon={icons.user} strokeWidth={2.5} />  // Thicker
```

### Custom Classes

```tsx
<Icon 
  icon={icons.star}
  className="text-yellow-500 drop-shadow-lg"
/>
```

### Inline Styles

```tsx
<Icon 
  icon={icons.heart}
  style={{ color: 'red' }}
/>
```

---

## 📋 Quick Reference

### Common Patterns

```tsx
// Primary action button
<IconButton icon={icons.plus} aria-label="Add" variant="primary" />

// Delete button
<IconButton icon={icons.trash} aria-label="Delete" variant="destructive" />

// Notification with count
<IconWithBadge icon={icons.bell} badgeCount={5} badgeColor="error" />

// Loading state
<Icon icon={icons.loader} animated="spin" />

// Success state
<StatusIcon status="success" size="lg" />

// AI feature badge
<Icon icon={icons.sparkles} color="ai" animated="glow" />
```

### Size Guide

- **xs (12px):** Badges, dense tables
- **sm (16px):** Inline text, small buttons
- **md (20px):** Default buttons, inputs
- **lg (24px):** Card headers, prominent buttons
- **xl (32px):** Empty states, feature cards
- **2xl (40px):** Hero sections
- **3xl (48px):** Marketing pages

---

## 📞 Support

- **Design System Lead:** [Your Name]
- **Slack Channel:** #design-system
- **Lucide Docs:** https://lucide.dev
- **Issues:** Report với tag `icons`

---

**Last Review:** March 17, 2026  
**Next Review:** June 2026
