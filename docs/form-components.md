# 📝 Form Components Documentation

> **Version:** 2.0  
> **Last Updated:** 2026-03-17  
> **Phase:** 2.1 - Form Components Enhancement

## Overview

Enhanced form components với design system mới:
1. **Input** - Text input với icons, validation states
2. **Textarea** - Multi-line input với auto-resize, character count
3. **Button** - Action buttons với loading states, icons
4. **Badge** - Status badges với CRM variants
5. Và nhiều components khác...

---

## 🔤 Input Component

### Features

- ✅ 4 variants (default, filled, outlined, ghost)
- ✅ 3 sizes (sm, md, lg)
- ✅ 4 validation states (default, error, success, warning)
- ✅ Left/right icon support
- ✅ Helper text & error messages
- ✅ Full width option
- ✅ Accessibility (ARIA)

### Basic Usage

```tsx
import { Input } from '@/app/components/ui/input';

// Simple input
<Input placeholder="Enter your email" />

// With error
<Input error="Email is required" />

// With helper text
<Input helperText="We'll never share your email" />
```

### Variants

```tsx
// Default (bordered with background)
<Input variant="default" placeholder="Default" />

// Filled (solid background)
<Input variant="filled" placeholder="Filled" />

// Outlined (border only, transparent)
<Input variant="outlined" placeholder="Outlined" />

// Ghost (no border, transparent)
<Input variant="ghost" placeholder="Ghost" />
```

### Sizes

```tsx
// Small (h-8, text-sm)
<Input inputSize="sm" placeholder="Small" />

// Medium - default (h-10, text-base)
<Input inputSize="md" placeholder="Medium" />

// Large (h-12, text-lg)
<Input inputSize="lg" placeholder="Large" />
```

### Validation States

```tsx
import { Mail, Check, AlertTriangle } from 'lucide-react';

// Error state
<Input 
  state="error"
  error="Invalid email address"
  leftIcon={<Mail />}
/>

// Success state
<Input 
  state="success"
  helperText="Email is valid"
  rightIcon={<Check />}
/>

// Warning state
<Input 
  state="warning"
  helperText="This email is already registered"
  leftIcon={<AlertTriangle />}
/>
```

### With Icons

```tsx
import { Search, Mail, Eye, EyeOff } from 'lucide-react';

// Left icon
<Input 
  leftIcon={<Search />}
  placeholder="Search..."
/>

// Right icon
<Input 
  type="email"
  rightIcon={<Mail />}
  placeholder="email@example.com"
/>

// Password with toggle
const [showPassword, setShowPassword] = useState(false);

<Input 
  type={showPassword ? "text" : "password"}
  rightIcon={
    <button onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeOff /> : <Eye />}
    </button>
  }
/>
```

### Full Width

```tsx
<Input 
  fullWidth
  placeholder="Full width input"
/>
```

---

## 📄 Textarea Component

### Features

- ✅ 4 variants (default, filled, outlined, ghost)
- ✅ 3 sizes (sm, md, lg)
- ✅ 4 validation states
- ✅ Auto-resize option
- ✅ Character count
- ✅ Resizable option
- ✅ Helper text & errors

### Basic Usage

```tsx
import { Textarea } from '@/app/components/ui/textarea';

// Simple textarea
<Textarea placeholder="Enter your message" />

// With rows
<Textarea rows={5} placeholder="Enter description" />
```

### Auto-resize

```tsx
// Auto-resize based on content
<Textarea 
  autoResize
  placeholder="This textarea will grow as you type..."
/>
```

### Character Count

```tsx
// With character count and max length
<Textarea 
  maxLength={500}
  showCount
  placeholder="Enter up to 500 characters"
/>
```

### Resizable

```tsx
// Allow manual resize
<Textarea 
  resizable
  placeholder="You can resize this textarea"
/>
```

### Validation

```tsx
// With error
<Textarea 
  error="Message is required"
  placeholder="Enter your message"
/>

// With success
<Textarea 
  state="success"
  helperText="Message saved"
/>
```

---

## 🔘 Button Component

### Features

- ✅ 10 variants (default, primary, destructive, outline, ghost, link, success, warning, ai)
- ✅ 6 sizes (sm, default, lg, icon, icon-sm, icon-lg)
- ✅ Loading state with spinner
- ✅ Left/right icon support
- ✅ Accessibility (focus rings)

### Variants

```tsx
import { Button } from '@/app/components/ui/button';

// Default
<Button>Click me</Button>

// Primary (brand color)
<Button variant="primary">Primary</Button>

// Destructive (red)
<Button variant="destructive">Delete</Button>

// Outline (bordered)
<Button variant="outline">Outline</Button>

// Ghost (transparent)
<Button variant="ghost">Ghost</Button>

// Link
<Button variant="link">Link</Button>

// Success (green)
<Button variant="success">Save</Button>

// Warning (amber)
<Button variant="warning">Warning</Button>

// AI (gradient with glow)
<Button variant="ai">AI Powered</Button>
```

### Sizes

```tsx
// Small
<Button size="sm">Small</Button>

// Default
<Button size="default">Default</Button>

// Large
<Button size="lg">Large</Button>

// Icon only
<Button size="icon">
  <Plus />
</Button>

// Icon small
<Button size="icon-sm">
  <X />
</Button>

// Icon large
<Button size="icon-lg">
  <Settings />
</Button>
```

### Loading State

```tsx
const [loading, setLoading] = useState(false);

<Button 
  loading={loading}
  onClick={async () => {
    setLoading(true);
    await saveData();
    setLoading(false);
  }}
>
  Save Changes
</Button>
```

### With Icons

```tsx
import { Plus, Download, Send } from 'lucide-react';

// Left icon
<Button leftIcon={<Plus />}>
  Add New
</Button>

// Right icon
<Button rightIcon={<Download />}>
  Download
</Button>

// Both icons
<Button 
  leftIcon={<Send />}
  rightIcon={<ArrowRight />}
>
  Send Message
</Button>
```

---

## 🏷️ Badge Component

### Features

- ✅ 14+ variants (default, primary, success, error, ai, CRM statuses, subtle variants)
- ✅ 3 sizes (sm, default, lg)
- ✅ Dismissible option
- ✅ Dot indicator
- ✅ Icon support

### Variants

```tsx
import { Badge } from '@/app/components/ui/badge';

// Default
<Badge>Default</Badge>

// Primary
<Badge variant="primary">Primary</Badge>

// Status badges
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>

// AI badge
<Badge variant="ai">AI</Badge>

// CRM Lead statuses
<Badge variant="lead-new">New</Badge>
<Badge variant="lead-contacted">Contacted</Badge>
<Badge variant="lead-qualified">Qualified</Badge>
<Badge variant="lead-unqualified">Unqualified</Badge>

// Subtle variants (lighter backgrounds)
<Badge variant="subtle-primary">Subtle Primary</Badge>
<Badge variant="subtle-success">Subtle Success</Badge>
<Badge variant="subtle-warning">Subtle Warning</Badge>
<Badge variant="subtle-error">Subtle Error</Badge>
```

### Sizes

```tsx
// Small
<Badge size="sm">Small</Badge>

// Default
<Badge size="default">Default</Badge>

// Large
<Badge size="lg">Large</Badge>
```

### Dismissible

```tsx
const [showBadge, setShowBadge] = useState(true);

{showBadge && (
  <Badge 
    dismissible
    onDismiss={() => setShowBadge(false)}
  >
    Dismissible Badge
  </Badge>
)}
```

### With Dot Indicator

```tsx
<Badge dot variant="success">
  Active
</Badge>

<Badge dot variant="error">
  Offline
</Badge>
```

### With Icon

```tsx
import { Sparkles, Check, AlertTriangle } from 'lucide-react';

<Badge leftIcon={<Sparkles />} variant="ai">
  AI Powered
</Badge>

<Badge leftIcon={<Check />} variant="success">
  Verified
</Badge>

<Badge leftIcon={<AlertTriangle />} variant="warning">
  Pending
</Badge>
```

---

## 💡 Usage Examples

### Login Form

```tsx
import { Input, Button } from '@/app/components/ui';
import { Mail, Lock } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <form className="space-y-4">
      <Input 
        type="email"
        placeholder="Email"
        leftIcon={<Mail />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      
      <Input 
        type="password"
        placeholder="Password"
        leftIcon={<Lock />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      
      <Button 
        variant="primary"
        loading={loading}
        fullWidth
      >
        Sign In
      </Button>
    </form>
  );
}
```

### CRM Lead Form

```tsx
import { Input, Textarea, Button, Badge } from '@/app/components/ui';
import { User, Mail, Phone, Briefcase } from 'lucide-react';

function LeadForm() {
  return (
    <div className="space-y-4">
      {/* Lead Status */}
      <div className="flex items-center gap-2">
        <Badge variant="lead-new" dot>New Lead</Badge>
        <Badge variant="ai" leftIcon={<Sparkles />}>
          AI Score: 85
        </Badge>
      </div>
      
      {/* Basic Info */}
      <Input 
        placeholder="Full Name"
        leftIcon={<User />}
        helperText="Enter lead's full name"
        fullWidth
      />
      
      <Input 
        type="email"
        placeholder="Email Address"
        leftIcon={<Mail />}
        fullWidth
      />
      
      <Input 
        type="tel"
        placeholder="Phone Number"
        leftIcon={<Phone />}
        fullWidth
      />
      
      <Input 
        placeholder="Company"
        leftIcon={<Briefcase />}
        fullWidth
      />
      
      {/* Notes */}
      <Textarea 
        placeholder="Notes about this lead..."
        maxLength={500}
        showCount
        autoResize
        fullWidth
      />
      
      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="primary" leftIcon={<Check />}>
          Save Lead
        </Button>
        <Button variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
}
```

### Search Bar

```tsx
import { Input } from '@/app/components/ui/input';
import { Search, X } from 'lucide-react';

function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <Input 
      placeholder="Search leads, deals, contacts..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      leftIcon={<Search />}
      rightIcon={
        query && (
          <button onClick={() => setQuery('')}>
            <X className="w-4 h-4" />
          </button>
        )
      }
      inputSize="lg"
      fullWidth
    />
  );
}
```

### Validation Form

```tsx
function ValidationForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  return (
    <Input 
      type="email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
      }}
      error={emailError}
      state={emailError ? 'error' : email ? 'success' : 'default'}
      placeholder="email@example.com"
      fullWidth
    />
  );
}
```

---

## ♿ Accessibility

### ARIA Attributes

All form components include proper ARIA attributes:

```tsx
// Input with error
<Input 
  id="email"
  error="Invalid email"
  aria-invalid={true}
  aria-describedby="email-helper"
/>

// Button states
<Button disabled aria-disabled={true}>
  Disabled
</Button>

<Button loading aria-busy={true}>
  Loading...
</Button>
```

### Focus Management

All components have visible focus rings:

```tsx
// Automatic focus ring on keyboard navigation
<Input /> {/* Has focus-visible:ring-2 */}
<Button /> {/* Has focus-visible:ring-2 */}
```

### Screen Reader Support

```tsx
// Dismissible badge
<Badge 
  dismissible
  onDismiss={handleDismiss}
  // Close button has aria-label="Remove badge"
>
  Removable
</Badge>
```

---

## 📋 Quick Reference

### Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'filled' \| 'outlined' \| 'ghost'` | `'default'` | Input style variant |
| `inputSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Validation state |
| `leftIcon` | `ReactNode` | - | Icon on left side |
| `rightIcon` | `ReactNode` | - | Icon on right side |
| `helperText` | `string` | - | Helper text below input |
| `error` | `string` | - | Error message (sets state to error) |
| `fullWidth` | `boolean` | `false` | Full width |

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | See variants above | `'default'` | Button style |
| `size` | `'sm' \| 'default' \| 'lg' \| 'icon' \| 'icon-sm' \| 'icon-lg'` | `'default'` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner |
| `leftIcon` | `ReactNode` | - | Icon on left |
| `rightIcon` | `ReactNode` | - | Icon on right |

### Badge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | See variants above | `'default'` | Badge style |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Badge size |
| `dismissible` | `boolean` | `false` | Show close button |
| `onDismiss` | `() => void` | - | Close callback |
| `dot` | `boolean` | `false` | Show dot indicator |
| `leftIcon` | `ReactNode` | - | Icon on left |

---

**Last Review:** March 17, 2026  
**Next Review:** June 2026
