# ⚡ QUICK REFERENCE - CRM PROJECT

> **One-page cheat sheet for developers**  
> Updated: 2026-03-17

---

## 📊 AT A GLANCE

```
Progress:  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 76/850 (8.9%)
Timeline:  10 months (Mar 2026 → Jan 2027)
Status:    Phase 1 ✅ | Phase 2 🟡 | Rest ⚪
```

---

## 📁 KEY FILES

| File | Purpose | Status |
|------|---------|--------|
| [PROJECT_README.md](./PROJECT_README.md) | Full project info | ✅ |
| [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) | Executive overview | ✅ |
| [CRM_FEATURE_ROADMAP.md](./CRM_FEATURE_ROADMAP.md) | 850-step plan | ✅ |
| [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) | Progress tracker | ✅ |
| [MASTER_UI_UX_PLAN.md](./MASTER_UI_UX_PLAN.md) | Original plan | ✅ |
| [Guidelines.md](./Guidelines.md) | Coding standards | ✅ |

---

## 🎯 CURRENT FOCUS

### This Week (Sprint 3)
- [ ] Step 77: Date/Time Range Picker
- [ ] Step 78: Multi-select with Chips
- [ ] Step 79: Combobox with Create Option
- [ ] Step 80: Form Field with Inline Validation

### Next Week
- [ ] Steps 81-95: Data Display Components
- [ ] DataTable virtualization
- [ ] Column resizing & pinning
- [ ] Advanced filtering UI

---

## 🏗️ PROJECT STRUCTURE

```
/src/app/
  ├── components/
  │   ├── ui/           # 16 form components ✅
  │   ├── crm/          # CRM components (coming)
  │   └── layout/       # Layout components
  ├── hooks/            # Custom hooks (20+)
  ├── utils/            # Utilities
  ├── pages/            # Route pages
  └── routes.ts         # React Router config

/src/styles/
  ├── theme.css         # CSS variables (200+ colors)
  ├── animations.css    # 25+ keyframes
  └── fonts.css         # Font imports
```

---

## 🧩 AVAILABLE COMPONENTS

### ✅ Form Components (16)
```tsx
FloatingInput       // Material floating labels
MaskedInput         // Phone, currency, date masks
ValidatedInput      // Real-time validation
MultiStepForm       // Wizard with progress
FormProgress        // Completion indicator
Autocomplete        // Async typeahead
TagsInput           // Multi-tag input
FileUpload          // Drag-drop upload
ImageUpload         // Crop/rotate images
Rating              // Star/heart/emoji
Slider              // Range slider
ColorPicker         // HSL color picker
Button              // Primary/secondary/ghost
Input               // With icons
Textarea            // Auto-resize
Badge               // Status badges
```

### ⏳ Coming Next (64)
- DataTable, Timeline, Kanban, Calendar
- Sidebar, Breadcrumb, Command Palette, Tabs
- Toast, Modal, Drawer, Popover, Tooltip
- Gallery, Carousel, Video Player, Avatar
- AI Chat, Code Editor, Rich Text Editor

---

## 💻 COMMON COMMANDS

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build
npm run lint             # Lint code
npm run format           # Format code
npm test                 # Run tests (planned)

# Quick navigation
code /src/app/components/ui/         # UI components
code /src/app/hooks/                 # Custom hooks
code /src/styles/theme.css           # Design tokens
code /IMPLEMENTATION_CHECKLIST.md    # Progress
```

---

## 🎨 DESIGN TOKENS (Quick Access)

### Colors
```css
/* Primary */
--primary: #3B82F6;
--primary-hover: #2563EB;

/* Status */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #0EA5E9;

/* Neutrals */
--neutral-50 to --neutral-900

/* Dark Mode */
@media (prefers-color-scheme: dark) { ... }
```

### Spacing (8px grid)
```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-4: 1rem;      /* 16px */
--spacing-8: 2rem;      /* 32px */
```

---

## 📦 TECH STACK

```
Frontend:   React 18 + TypeScript
Styling:    Tailwind CSS v4.0
Routing:    React Router (Data mode)
Charts:     Recharts
Icons:      Lucide React (150+)
Animation:  Motion (Framer Motion)
Build:      Vite
Testing:    Jest + RTL (planned)
E2E:        Playwright (planned)
Backend:    Supabase (planned)
Database:   YugabyteDB/YSQL (planned)
```

---

## 🚀 DEVELOPMENT WORKFLOW

### 1. Check Next Task
```bash
# View checklist
cat IMPLEMENTATION_CHECKLIST.md | grep "^\- \[ \]" | head -5
```

### 2. Create Branch
```bash
git checkout -b feature/step-77-date-range-picker
```

### 3. Develop
- Follow [Guidelines.md](./Guidelines.md)
- Write tests
- Update documentation

### 4. Commit
```bash
git commit -m "feat(ui): add DateRangePicker component"
```

### 5. PR & Review
- Code review
- Tests pass
- Merge to main

---

## 📏 NAMING CONVENTIONS

| Type | Convention | Example |
|------|------------|---------|
| Database Table | `snake_case` (plural) | `order_items` |
| Database Field | `snake_case` | `user_id` |
| Component | `PascalCase` | `LeadForm` |
| Hook | `camelCase` (prefix `use`) | `useInlineEdit` |
| Util | `camelCase` | `formatCurrency` |
| Constant | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE` |

---

## 🔑 KEY CONCEPTS

### Standard Mixins (All DB records)
```sql
id            UUID v7 (PK)
tenant_id     UUID (required for isolation)
version       INTEGER (optimistic locking)
created_at    TIMESTAMP
updated_at    TIMESTAMP
deleted_at    TIMESTAMP (soft delete)
```

### API Path Format
```
/api/{service}/v1/{resource}
/api/lead/v1/leads           ✅ (singular service)
/api/lead-service/v1/leads   ❌ (avoid -service suffix)
```

### Component Structure
```tsx
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Helper functions
// 5. Main component (export default)
// 6. Sub-components (if any)
```

---

## 🎯 MILESTONES

| Date | Milestone | Progress |
|------|-----------|----------|
| ✅ Mar 17 | Phase 1 Complete | 60/60 |
| 🎯 Mar 31 | Phase 2.1 Complete | 16/20 |
| 🎯 Apr 30 | Phase 2 Complete | 16/80 |
| 🎯 Jun 30 | Core CRM Complete | 0/180 |
| 🎯 Sep 30 | AI + Analytics | 0/150 |
| 🎯 Dec 31 | Polish + Testing | 0/280 |
| 🚀 Jan 1, 2027 | PRODUCTION LAUNCH | 0/850 |

---

## 📊 METRICS TARGETS

### Technical
- Lighthouse: ≥ 90
- Accessibility: 100%
- Test Coverage: ≥ 80%
- Bundle: < 250KB
- First Paint: < 2s

### Business (Post-Launch)
- User Adoption: 80%
- NPS: ≥ 40
- Retention: ≥ 70%

---

## 🆘 QUICK HELP

### Stuck? Check:
1. [Guidelines.md](./Guidelines.md) - Coding standards
2. [CRM_FEATURE_ROADMAP.md](./CRM_FEATURE_ROADMAP.md) - Detailed steps
3. `/src/app/components/ui/` - Example components
4. Team Slack: #crm-dev

### Common Issues:
```tsx
// ❌ Wrong
import { Button } from './button';

// ✅ Correct
import { Button } from './ui/button';

// ❌ Wrong (Tailwind text size)
<h1 className="text-2xl font-bold">

// ✅ Correct (use CSS variables)
<h1>Title</h1>  /* Styled in theme.css */

// ❌ Wrong (any type)
const data: any = [];

// ✅ Correct (proper type)
const data: Lead[] = [];
```

---

## 📞 CONTACTS

- **Tech Lead:** [Name]
- **Product:** [Name]
- **Design:** [Name]
- **Slack:** #crm-dev
- **Email:** dev@example.com

---

## 🎉 QUICK WINS

### This Sprint
- [x] 12 advanced form components (Steps 65-76)
- [x] Image crop with canvas (no dependencies!)
- [x] Color picker with HSL sliders
- [ ] 4 more form components to go

### Next Sprint
- [ ] DataTable virtualization (10k+ rows)
- [ ] Drag-drop kanban board
- [ ] AI chat interface prototype

---

## 💡 TIPS & TRICKS

### Performance
```tsx
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // ...
});

// Use useCallback for functions passed to children
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);

// Use useMemo for expensive calculations
const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);
```

### Tailwind Best Practices
```tsx
// ✅ Extract repeated patterns
const buttonClasses = cn(
  'px-4 py-2 rounded-lg',
  'hover:bg-primary-hover',
  'transition-colors duration-200'
);

// ✅ Use arbitrary values sparingly
<div className="w-[347px]">  /* Avoid if possible */

// ✅ Prefer design tokens
<div className="w-full max-w-md">  /* Better */
```

### TypeScript Tips
```tsx
// ✅ Use interfaces for props
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

// ✅ Use type for unions
type Status = 'pending' | 'success' | 'error';

// ✅ Use generics for reusable types
function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}
```

---

**Keep this file open while coding! ⚡**

Last Updated: 2026-03-17
