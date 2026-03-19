# 🎨 KẾ HOẠCH NÂNG CẤP UI/UX TOÀN DIỆN CRM
## Mục tiêu: Đẹp hơn • Hiện đại hơn • Chuyên nghiệp hơn • Dễ dùng hơn

> **Tổng số bước:** 350 bước
> **Thời gian dự kiến:** 8-12 tuần
> **Ưu tiên:** Design System → Components → Layouts → Interactions → Polish

---

## 📊 TỔNG QUAN TIẾN ĐỘ

```
Phase 1: Design System Foundation    [░░░░░░░░░░░░░░░░░░░░] 0/60  (0%)
Phase 2: Component Refinement        [░░░░░░░░░░░░░░░░░░░░] 0/70  (0%)
Phase 3: Layout & Navigation         [░░░░░░░░░░░░░░░░░░░░] 0/50  (0%)
Phase 4: Data Visualization          [░░░░░░░░░░░░░░░░░░░░] 0/40  (0%)
Phase 5: Interactions & Animation    [░░░░░░░░░░░░░░░░░░░░] 0/50  (0%)
Phase 6: Accessibility & UX          [░░░░░░░░░░░░░░░░░░░░] 0/40  (0%)
Phase 7: Performance & Loading       [░░░░░░░░░░░░░░░░░░░░] 0/20  (0%)
Phase 8: Polish & Details            [░░░░░░░░░░░░░░░░░░░░] 0/20  (0%)
```

---

## 🎯 PHASE 1: DESIGN SYSTEM FOUNDATION (60 bước)

### 1.1 Color System Enhancement (15 bước)

**Mục tiêu:** Tạo hệ thống màu sắc hiện đại, nhất quán với semantic colors

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 1 | Thiết kế color palette chính với 10 shades/color | `/src/styles/theme.css` | Critical | ⬜ |
| 2 | Thêm brand colors (primary, secondary, accent) | `/src/styles/theme.css` | Critical | ⬜ |
| 3 | Thêm semantic colors (success, warning, error, info) | `/src/styles/theme.css` | Critical | ⬜ |
| 4 | Thêm neutral colors (gray scale 50-950) | `/src/styles/theme.css` | Critical | ⬜ |
| 5 | Thêm surface colors (background, foreground, muted) | `/src/styles/theme.css` | High | ⬜ |
| 6 | Dark mode color palette | `/src/styles/theme.css` | High | ⬜ |
| 7 | Color opacity variants (10%, 20%, 50%) | `/src/styles/theme.css` | Medium | ⬜ |
| 8 | Status colors cho Leads (new, qualified, converted) | `/src/styles/theme.css` | High | ⬜ |
| 9 | Status colors cho Deals (stages) | `/src/styles/theme.css` | High | ⬜ |
| 10 | Status colors cho Tasks | `/src/styles/theme.css` | High | ⬜ |
| 11 | AI/Automation accent colors | `/src/styles/theme.css` | Medium | ⬜ |
| 12 | Chart colors palette (8+ colors) | `/src/styles/theme.css` | Medium | ⬜ |
| 13 | Gradient presets (5+ gradients) | `/src/styles/theme.css` | Medium | ⬜ |
| 14 | Color contrast validation (WCAG AA) | `/docs/color-contrast.md` | High | ⬜ |
| 15 | Color documentation & usage guide | `/docs/colors.md` | Medium | ⬜ |

**Deliverables:**
- ✨ Modern color palette với 100+ color tokens
- 🌓 Full dark mode support
- ♿ WCAG AA compliant color combinations
- 📊 Specialized chart & status colors

---

### 1.2 Typography System (12 bước)

**Mục tiêu:** Hệ thống typography rõ ràng, dễ đọc, phân cấp tốt

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 16 | Import modern font families (Inter, Manrope, IBM Plex) | `/src/styles/fonts.css` | Critical | ⬜ |
| 17 | Define type scale (12px → 72px, 12 sizes) | `/src/styles/theme.css` | Critical | ⬜ |
| 18 | Font weight scale (300, 400, 500, 600, 700, 800) | `/src/styles/theme.css` | High | ⬜ |
| 19 | Line height tokens (tight, normal, relaxed, loose) | `/src/styles/theme.css` | High | ⬜ |
| 20 | Letter spacing tokens | `/src/styles/theme.css` | Medium | ⬜ |
| 21 | Heading styles (h1-h6) với proper hierarchy | `/src/styles/theme.css` | High | ⬜ |
| 22 | Body text styles (sm, base, lg) | `/src/styles/theme.css` | High | ⬜ |
| 23 | Caption & label text styles | `/src/styles/theme.css` | Medium | ⬜ |
| 24 | Code & monospace font setup | `/src/styles/theme.css` | Low | ⬜ |
| 25 | Number font (tabular-nums for tables) | `/src/styles/theme.css` | Medium | ⬜ |
| 26 | Text color tokens (primary, secondary, muted, disabled) | `/src/styles/theme.css` | High | ⬜ |
| 27 | Typography documentation | `/docs/typography.md` | Medium | ⬜ |

**Deliverables:**
- 🔤 Professional font stack
- 📏 Consistent type scale
- 📖 Clear visual hierarchy
- 📱 Optimized for readability

---

### 1.3 Spacing & Layout System (10 bước)

**Mục tiêu:** Spacing tokens nhất quán cho margins, paddings, gaps

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 28 | Define spacing scale (0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32) | `/src/styles/theme.css` | Critical | ⬜ |
| 29 | Container max-widths (sm, md, lg, xl, 2xl) | `/src/styles/theme.css` | High | ⬜ |
| 30 | Section spacing presets | `/src/styles/theme.css` | High | ⬜ |
| 31 | Grid system (12-column, gap variants) | `/src/styles/theme.css` | High | ⬜ |
| 32 | Breakpoint tokens (sm, md, lg, xl, 2xl) | `/src/styles/theme.css` | High | ⬜ |
| 33 | Z-index scale (dropdown, modal, tooltip, toast) | `/src/styles/theme.css` | Medium | ⬜ |
| 34 | Border radius tokens (sm, md, lg, xl, 2xl, full) | `/src/styles/theme.css` | High | ⬜ |
| 35 | Border width tokens | `/src/styles/theme.css` | Medium | ⬜ |
| 36 | Component sizing (input heights, button sizes) | `/src/styles/theme.css` | High | ⬜ |
| 37 | Spacing documentation | `/docs/spacing.md` | Medium | ⬜ |

**Deliverables:**
- 📐 Consistent spacing system
- 📦 Reusable layout primitives
- 📱 Responsive breakpoints
- 🎯 Predictable sizing

---

### 1.4 Shadows & Effects (8 bước)

**Mục tiêu:** Elevation system với shadows, glows, và effects

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 38 | Shadow scale (xs, sm, md, lg, xl, 2xl) | `/src/styles/theme.css` | High | ⬜ |
| 39 | Colored shadows (brand, success, error) | `/src/styles/theme.css` | Medium | ⬜ |
| 40 | Inner shadows | `/src/styles/theme.css` | Low | ⬜ |
| 41 | Glow effects (hover states) | `/src/styles/theme.css` | Medium | ⬜ |
| 42 | Glass morphism utilities | `/src/styles/theme.css` | Low | ⬜ |
| 43 | Backdrop blur tokens | `/src/styles/theme.css` | Medium | ⬜ |
| 44 | Elevation levels documentation | `/docs/elevation.md` | Medium | ⬜ |
| 45 | Shadow performance optimization | `/src/styles/theme.css` | Low | ⬜ |

**Deliverables:**
- 🌓 Depth perception với shadows
- ✨ Modern glass effects
- 🎨 Colored elevation
- 🚀 Performance optimized

---

### 1.5 Icons & Illustrations (15 bước)

**Mục tiêu:** Icon system nhất quán, thêm illustrations

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 46 | Audit existing icons (lucide-react) | `/src/app/constants/icons.ts` | High | ⬜ |
| 47 | Create icon size tokens (xs, sm, md, lg, xl) | `/src/styles/theme.css` | High | ⬜ |
| 48 | Icon color system (inherit, muted, accent) | `/src/styles/theme.css` | Medium | ⬜ |
| 49 | Custom icon components wrapper | `/src/app/components/ui/icon.tsx` | Medium | ⬜ |
| 50 | Status icons (success, warning, error, info) | `/src/app/components/ui/status-icon.tsx` | High | ⬜ |
| 51 | Empty state illustrations (8+ states) | `/src/app/components/crm/EmptyState.tsx` | High | ⬜ |
| 52 | Error state illustrations | `/src/app/components/crm/ErrorState.tsx` | Medium | ⬜ |
| 53 | Loading state illustrations | `/src/app/components/crm/LoadingState.tsx` | Medium | ⬜ |
| 54 | Onboarding illustrations | `/src/app/components/illustrations/` | Low | ⬜ |
| 55 | Feature illustrations (AI, Analytics, etc) | `/src/app/components/illustrations/` | Low | ⬜ |
| 56 | Icon animation presets (spin, pulse, bounce) | `/src/styles/animations.css` | Medium | ⬜ |
| 57 | SVG optimization | Build script | Medium | ⬜ |
| 58 | Icon sprite generation | Build script | Low | ⬜ |
| 59 | Illustration placeholder system | `/src/app/components/ui/illustration-placeholder.tsx` | Low | ⬜ |
| 60 | Icons & illustrations guide | `/docs/icons-illustrations.md` | Medium | ⬜ |

**Deliverables:**
- 🎨 Unified icon system
- 🖼️ Custom illustrations cho key states
- ⚡ Optimized SVG assets
- 📚 Comprehensive icon library

---

## 🧩 PHASE 2: COMPONENT REFINEMENT (70 bước)

### 2.1 Button Components (12 bước)

**Mục tiêu:** Buttons với variants, sizes, states hoàn chỉnh

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 61 | Redesign primary button (modern, có depth) | `/src/app/components/ui/button.tsx` | Critical | ⬜ |
| 62 | Secondary button variant | `/src/app/components/ui/button.tsx` | High | ⬜ |
| 63 | Outline button variant | `/src/app/components/ui/button.tsx` | High | ⬜ |
| 64 | Ghost button variant | `/src/app/components/ui/button.tsx` | High | ⬜ |
| 65 | Destructive button variant | `/src/app/components/ui/button.tsx` | High | ⬜ |
| 66 | Link button variant | `/src/app/components/ui/button.tsx` | Medium | ⬜ |
| 67 | Button sizes (xs, sm, md, lg, xl) | `/src/app/components/ui/button.tsx` | High | ⬜ |
| 68 | Icon buttons (square, circle) | `/src/app/components/ui/button.tsx` | High | ⬜ |
| 69 | Button with icon (left, right, only) | `/src/app/components/ui/button.tsx` | High | ⬜ |
| 70 | Loading state với spinner | `/src/app/components/ui/button.tsx` | High | ⬜ |
| 71 | Disabled state styling | `/src/app/components/ui/button.tsx` | High | ⬜ |
| 72 | Button group component | `/src/app/components/ui/button-group.tsx` | Medium | ⬜ |

**Deliverables:**
- 🎯 8+ button variants
- 📏 5 size options
- ⚡ Loading & disabled states
- 🎨 Modern, tactile design

---

### 2.2 Form Components (15 bước)

**Mục tiêu:** Form inputs đẹp, rõ ràng, accessible

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 73 | Redesign text input với floating labels | `/src/app/components/ui/input.tsx` | Critical | ⬜ |
| 74 | Input sizes (sm, md, lg) | `/src/app/components/ui/input.tsx` | High | ⬜ |
| 75 | Input states (focus, error, disabled, success) | `/src/app/components/ui/input.tsx` | Critical | ⬜ |
| 76 | Input with icons (prefix, suffix) | `/src/app/components/ui/input.tsx` | High | ⬜ |
| 77 | Search input component | `/src/app/components/ui/search-input.tsx` | High | ⬜ |
| 78 | Textarea with auto-resize | `/src/app/components/ui/textarea.tsx` | High | ⬜ |
| 79 | Modern checkbox design | `/src/app/components/ui/checkbox.tsx` | High | ⬜ |
| 80 | Modern radio button design | `/src/app/components/ui/radio-group.tsx` | High | ⬜ |
| 81 | Toggle switch redesign | `/src/app/components/ui/switch.tsx` | High | ⬜ |
| 82 | Enhanced select dropdown | `/src/app/components/ui/select.tsx` | High | ⬜ |
| 83 | Multi-select component | `/src/app/components/ui/multi-select.tsx` | Medium | ⬜ |
| 84 | Date picker redesign | `/src/app/components/ui/date-picker.tsx` | High | ⬜ |
| 85 | Date range picker | `/src/app/components/ui/date-range-picker.tsx` | Medium | ⬜ |
| 86 | Color picker component | `/src/app/components/crm/ColorPicker.tsx` | Medium | ⬜ |
| 87 | Form field wrapper component | `/src/app/components/forms/FormField.tsx` | High | ⬜ |

**Deliverables:**
- ✅ Modern form inputs
- 🎯 Clear validation states
- ♿ Fully accessible
- 🎨 Consistent styling

---

### 2.3 Data Display Components (10 bước)

**Mục tiêu:** Tables, lists, cards với design hiện đại

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 88 | DataTable header redesign (sticky, shadow) | `/src/app/components/crm/DataTable.tsx` | Critical | ⬜ |
| 89 | Table row hover effects | `/src/app/components/crm/DataTable.tsx` | High | ⬜ |
| 90 | Table zebra striping option | `/src/app/components/crm/DataTable.tsx` | Medium | ⬜ |
| 91 | Table cell alignment & padding | `/src/app/components/crm/DataTable.tsx` | High | ⬜ |
| 92 | Table sorting indicators | `/src/app/components/crm/DataTable.tsx` | High | ⬜ |
| 93 | Table empty state redesign | `/src/app/components/crm/DataTable.tsx` | High | ⬜ |
| 94 | Card component variants | `/src/app/components/ui/card.tsx` | High | ⬜ |
| 95 | Card hover effects | `/src/app/components/ui/card.tsx` | Medium | ⬜ |
| 96 | List item component | `/src/app/components/ui/list-item.tsx` | Medium | ⬜ |
| 97 | Stats card component | `/src/app/components/crm/StatCard.tsx` | High | ⬜ |

**Deliverables:**
- 📊 Professional data tables
- 🎴 Beautiful card designs
- 📝 Clean list layouts
- ✨ Subtle interactions

---

### 2.4 Navigation Components (8 bước)

**Mục tiêu:** Navigation rõ ràng, dễ sử dụng

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 98 | Sidebar redesign (modern, collapsible) | `/src/app/components/Sidebar.tsx` | Critical | ⬜ |
| 99 | Sidebar item hover states | `/src/app/components/Sidebar.tsx` | High | ⬜ |
| 100 | Sidebar active state indicator | `/src/app/components/Sidebar.tsx` | High | ⬜ |
| 101 | Sidebar icons alignment | `/src/app/components/Sidebar.tsx` | Medium | ⬜ |
| 102 | Breadcrumb component | `/src/app/components/ui/breadcrumb.tsx` | High | ⬜ |
| 103 | Tabs redesign | `/src/app/components/ui/tabs.tsx` | High | ⬜ |
| 104 | Pagination redesign | `/src/app/components/crm/PaginationBar.tsx` | High | ⬜ |
| 105 | Top navigation bar | `/src/app/components/ui/navbar.tsx` | Medium | ⬜ |

**Deliverables:**
- 🧭 Clear navigation hierarchy
- 🎯 Active state indicators
- 📱 Mobile-friendly navigation
- ✨ Smooth transitions

---

### 2.5 Overlay Components (10 bước)

**Mục tiêu:** Modals, dialogs, popovers với UX tốt

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 106 | Modal redesign (backdrop blur) | `/src/app/components/ui/dialog.tsx` | Critical | ⬜ |
| 107 | Modal animations (slide-up, fade) | `/src/app/components/ui/dialog.tsx` | High | ⬜ |
| 108 | Modal sizes (sm, md, lg, xl, full) | `/src/app/components/ui/dialog.tsx` | High | ⬜ |
| 109 | Sheet/Drawer component | `/src/app/components/ui/sheet.tsx` | High | ⬜ |
| 110 | Popover redesign | `/src/app/components/ui/popover.tsx` | High | ⬜ |
| 111 | Tooltip redesign | `/src/app/components/ui/tooltip.tsx` | High | ⬜ |
| 112 | Dropdown menu redesign | `/src/app/components/ui/dropdown-menu.tsx` | High | ⬜ |
| 113 | Alert dialog component | `/src/app/components/ui/alert-dialog.tsx` | High | ⬜ |
| 114 | Command palette (Cmd+K) | `/src/app/components/ui/command.tsx` | Medium | ⬜ |
| 115 | Toast notification redesign | `/src/app/components/ui/sonner.tsx` | High | ⬜ |

**Deliverables:**
- 🎭 Elegant overlays
- 🎬 Smooth animations
- ♿ Keyboard accessible
- 📱 Mobile optimized

---

### 2.6 Feedback Components (8 bước)

**Mục tiêu:** Loading states, progress, notifications

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 116 | Skeleton loader component | `/src/app/components/ui/skeleton.tsx` | Critical | ⬜ |
| 117 | Spinner variants (dots, circle, bars) | `/src/app/components/ui/spinner.tsx` | High | ⬜ |
| 118 | Progress bar redesign | `/src/app/components/ui/progress.tsx` | High | ⬜ |
| 119 | Circular progress indicator | `/src/app/components/ui/circular-progress.tsx` | Medium | ⬜ |
| 120 | Alert component variants | `/src/app/components/ui/alert.tsx` | High | ⬜ |
| 121 | Banner component | `/src/app/components/ui/banner.tsx` | Medium | ⬜ |
| 122 | Empty state component | `/src/app/components/crm/EmptyState.tsx` | High | ⬜ |
| 123 | Error state component | `/src/app/components/crm/ErrorState.tsx` | High | ⬜ |

**Deliverables:**
- ⏳ Elegant loading states
- 📊 Clear progress indicators
- ⚠️ Informative alerts
- 🎨 Friendly empty states

---

### 2.7 Badge & Status Components (7 bước)

**Mục tiêu:** Badges, tags, status indicators

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 124 | Badge redesign (pill, dot variants) | `/src/app/components/ui/badge.tsx` | High | ⬜ |
| 125 | Status badge component | `/src/app/components/crm/StatusBadge.tsx` | High | ⬜ |
| 126 | Priority badge | `/src/app/components/badges/PriorityBadge.tsx` | High | ⬜ |
| 127 | Tag input redesign | `/src/app/components/crm/TagInput.tsx` | Medium | ⬜ |
| 128 | AI score badge | `/src/app/components/badges/AILevelBadge.tsx` | High | ⬜ |
| 129 | Presence indicator (online/offline) | `/src/app/components/ui/presence.tsx` | Low | ⬜ |
| 130 | Notification badge (count) | `/src/app/components/ui/notification-badge.tsx` | Medium | ⬜ |

**Deliverables:**
- 🏷️ Modern badge designs
- 🎯 Clear status indicators
- 🎨 Semantic colors
- ✨ Subtle animations

---

## 🏗️ PHASE 3: LAYOUT & NAVIGATION (50 bước)

### 3.1 Page Layout System (10 bước)

**Mục tiêu:** Consistent page layouts, spacing

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 131 | Page container component | `/src/app/components/layouts/PageContainer.tsx` | Critical | ⬜ |
| 132 | Page header component | `/src/app/components/layouts/PageHeader.tsx` | Critical | ⬜ |
| 133 | Page content wrapper | `/src/app/components/layouts/PageContent.tsx` | High | ⬜ |
| 134 | Page footer component | `/src/app/components/layouts/PageFooter.tsx` | Medium | ⬜ |
| 135 | Two-column layout | `/src/app/components/layouts/TwoColumnLayout.tsx` | High | ⬜ |
| 136 | Sidebar layout | `/src/app/components/layouts/SidebarLayout.tsx` | High | ⬜ |
| 137 | Dashboard layout | `/src/app/components/layouts/DashboardLayout.tsx` | High | ⬜ |
| 138 | Detail page layout | `/src/app/components/layouts/DetailLayout.tsx` | High | ⬜ |
| 139 | Form page layout | `/src/app/components/layouts/FormLayout.tsx` | Medium | ⬜ |
| 140 | Layout spacing utilities | `/src/app/components/layouts/utils.ts` | Medium | ⬜ |

**Deliverables:**
- 📐 Reusable layout components
- 🎯 Consistent spacing
- 📱 Responsive by default
- 🎨 Clean visual hierarchy

---

### 3.2 Sidebar Enhancement (12 bước)

**Mục tiêu:** Sidebar hiện đại, dễ điều hướng

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 141 | Sidebar collapse/expand animation | `/src/app/components/Sidebar.tsx` | Critical | ⬜ |
| 142 | Mini sidebar mode (icons only) | `/src/app/components/Sidebar.tsx` | High | ⬜ |
| 143 | Sidebar search functionality | `/src/app/components/Sidebar.tsx` | High | ⬜ |
| 144 | Sidebar favorites section | `/src/app/components/Sidebar.tsx` | Medium | ⬜ |
| 145 | Sidebar recent items | `/src/app/components/Sidebar.tsx` | Medium | ⬜ |
| 146 | Sidebar groups collapsible | `/src/app/components/Sidebar.tsx` | High | ⬜ |
| 147 | Sidebar item badges (counts, new) | `/src/app/components/Sidebar.tsx` | Medium | ⬜ |
| 148 | Sidebar footer (user menu) | `/src/app/components/Sidebar.tsx` | High | ⬜ |
| 149 | Sidebar keyboard shortcuts | `/src/app/components/Sidebar.tsx` | Medium | ⬜ |
| 150 | Sidebar mobile drawer | `/src/app/components/Sidebar.tsx` | High | ⬜ |
| 151 | Sidebar dark mode toggle | `/src/app/components/Sidebar.tsx` | Low | ⬜ |
| 152 | Sidebar preferences persistence | `/src/app/components/Sidebar.tsx` | Medium | ⬜ |

**Deliverables:**
- 🎯 Intuitive navigation
- 🔍 Quick search
- 📱 Mobile optimized
- ⚡ Fast interactions

---

### 3.3 Top Navigation Bar (8 bước)

**Mục tiêu:** Header với search, notifications, user menu

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 153 | Top navbar component | `/src/app/components/Navbar.tsx` | Critical | ⬜ |
| 154 | Global search (Cmd+K) | `/src/app/components/crm/GlobalSearch.tsx` | Critical | ⬜ |
| 155 | Notification center | `/src/app/components/crm/NotificationCenter.tsx` | High | ⬜ |
| 156 | User profile dropdown | `/src/app/components/UserMenu.tsx` | High | ⬜ |
| 157 | Quick actions menu | `/src/app/components/QuickActions.tsx` | Medium | ⬜ |
| 158 | Organization switcher | `/src/app/components/OrgSwitcher.tsx` | Medium | ⬜ |
| 159 | Help/support button | `/src/app/components/HelpButton.tsx` | Low | ⬜ |
| 160 | Navbar sticky behavior | `/src/app/components/Navbar.tsx` | High | ⬜ |

**Deliverables:**
- 🔍 Powerful global search
- 🔔 Real-time notifications
- 👤 User profile access
- ⚡ Quick actions

---

### 3.4 Breadcrumb & Context (6 bước)

**Mục tiêu:** Context awareness, breadcrumbs

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 161 | Breadcrumb component | `/src/app/components/ui/breadcrumb.tsx` | High | ⬜ |
| 162 | Auto breadcrumb from routes | `/src/app/hooks/useBreadcrumbs.ts` | High | ⬜ |
| 163 | Page title component | `/src/app/components/PageTitle.tsx` | High | ⬜ |
| 164 | Context actions bar | `/src/app/components/ContextActions.tsx` | Medium | ⬜ |
| 165 | Back button component | `/src/app/components/BackButton.tsx` | Medium | ⬜ |
| 166 | Related items sidebar | `/src/app/components/RelatedItems.tsx` | Low | ⬜ |

**Deliverables:**
- 🗺️ Clear navigation path
- 🎯 Contextual actions
- 🔙 Easy navigation back
- 📍 Location awareness

---

### 3.5 Page Headers (8 bước)

**Mục tiêu:** Page headers với actions, filters, stats

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 167 | Page header layout | `/src/app/components/layouts/PageHeader.tsx` | Critical | ⬜ |
| 168 | Header with title & actions | `/src/app/components/layouts/PageHeader.tsx` | Critical | ⬜ |
| 169 | Header with tabs | `/src/app/components/layouts/PageHeader.tsx` | High | ⬜ |
| 170 | Header with filters | `/src/app/components/layouts/PageHeader.tsx` | High | ⬜ |
| 171 | Header with stats cards | `/src/app/components/layouts/PageHeader.tsx` | High | ⬜ |
| 172 | Sticky header on scroll | `/src/app/components/layouts/PageHeader.tsx` | Medium | ⬜ |
| 173 | Header breadcrumb integration | `/src/app/components/layouts/PageHeader.tsx` | Medium | ⬜ |
| 174 | Mobile responsive header | `/src/app/components/layouts/PageHeader.tsx` | High | ⬜ |

**Deliverables:**
- 📋 Consistent page headers
- 🎯 Contextual actions
- 📊 Quick stats overview
- 📱 Mobile friendly

---

### 3.6 Filter & Search Panels (6 bước)

**Mục tiêu:** Advanced filtering UI

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 175 | Filter panel redesign | `/src/app/components/crm/FilterPanel.tsx` | Critical | ⬜ |
| 176 | Filter chips/tags | `/src/app/components/crm/FilterBar.tsx` | High | ⬜ |
| 177 | Saved filters feature | `/src/app/components/crm/SavedFilters.tsx` | Medium | ⬜ |
| 178 | Advanced search builder | `/src/app/components/crm/SearchBuilder.tsx` | Medium | ⬜ |
| 179 | Date range picker integration | `/src/app/components/crm/DateRangePicker.tsx` | High | ⬜ |
| 180 | Filter reset button | `/src/app/components/crm/FilterPanel.tsx` | High | ⬜ |

**Deliverables:**
- 🔍 Powerful filtering
- 🏷️ Visual filter tags
- 💾 Save filter presets
- 🎯 Quick filter access

---

## 📊 PHASE 4: DATA VISUALIZATION (40 bước)

### 4.1 Chart Components (12 bước)

**Mục tiêu:** Beautiful, interactive charts

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 181 | Chart color palette | `/src/app/constants/chartColors.ts` | Critical | ⬜ |
| 182 | Line chart redesign | `/src/app/components/crm/LineChartCard.tsx` | High | ⬜ |
| 183 | Bar chart redesign | `/src/app/components/crm/BarChartCard.tsx` | High | ⬜ |
| 184 | Area chart redesign | `/src/app/components/crm/AreaChartCard.tsx` | High | ⬜ |
| 185 | Pie/Donut chart redesign | `/src/app/components/crm/PieChartCard.tsx` | High | ⬜ |
| 186 | Funnel chart redesign | `/src/app/components/crm/FunnelChart.tsx` | Medium | ⬜ |
| 187 | Radar chart redesign | `/src/app/components/crm/RadarChartCard.tsx` | Medium | ⬜ |
| 188 | Heatmap redesign | `/src/app/components/crm/HeatmapCard.tsx` | Medium | ⬜ |
| 189 | Chart tooltip styling | All chart components | High | ⬜ |
| 190 | Chart legend styling | All chart components | Medium | ⬜ |
| 191 | Chart responsive behavior | All chart components | High | ⬜ |
| 192 | Chart export functionality | All chart components | Low | ⬜ |

**Deliverables:**
- 📊 Modern chart designs
- 🎨 Consistent color usage
- 📱 Responsive charts
- 💡 Interactive tooltips

---

### 4.2 Metric Cards (8 bước)

**Mục tiêu:** Eye-catching metric displays

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 193 | Metric card redesign | `/src/app/components/crm/MetricCard.tsx` | Critical | ⬜ |
| 194 | Metric card with trend | `/src/app/components/crm/MetricCard.tsx` | High | ⬜ |
| 195 | Metric card with sparkline | `/src/app/components/crm/MetricCard.tsx` | Medium | ⬜ |
| 196 | Metric card sizes (sm, md, lg) | `/src/app/components/crm/MetricCard.tsx` | Medium | ⬜ |
| 197 | Metric card color variants | `/src/app/components/crm/MetricCard.tsx` | Medium | ⬜ |
| 198 | Metric card loading state | `/src/app/components/crm/MetricCard.tsx` | High | ⬜ |
| 199 | Metric grid layout | `/src/app/components/crm/MetricGrid.tsx` | High | ⬜ |
| 200 | Metric comparison cards | `/src/app/components/crm/ComparisonCard.tsx` | Medium | ⬜ |

**Deliverables:**
- 📈 Clear metric display
- 📊 Visual trends
- 🎨 Color coding
- ⚡ Loading states

---

### 4.3 Progress & Goals (6 bước)

**Mục tiêu:** Progress indicators, goal tracking

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 201 | Progress bar variants | `/src/app/components/crm/ProgressCard.tsx` | High | ⬜ |
| 202 | Goal progress card | `/src/app/components/crm/GoalCard.tsx` | High | ⬜ |
| 203 | Quota attainment visualization | `/src/app/components/crm/QuotaCard.tsx` | High | ⬜ |
| 204 | Circular progress indicators | `/src/app/components/ui/circular-progress.tsx` | Medium | ⬜ |
| 205 | Multi-step progress | `/src/app/components/ui/stepper.tsx` | Medium | ⬜ |
| 206 | Achievement badges | `/src/app/components/crm/AchievementBadge.tsx` | Low | ⬜ |

**Deliverables:**
- 🎯 Clear goal tracking
- 📊 Visual progress
- 🏆 Achievement system
- 📈 Quota visualization

---

### 4.4 Timeline & Activity Feed (8 bước)

**Mục tiêu:** Beautiful timeline, activity streams

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 207 | Timeline component redesign | `/src/app/components/crm/Timeline.tsx` | High | ⬜ |
| 208 | Timeline item variants | `/src/app/components/crm/TimelineItem.tsx` | High | ⬜ |
| 209 | Timeline grouping (by date) | `/src/app/components/crm/Timeline.tsx` | Medium | ⬜ |
| 210 | Activity feed redesign | `/src/app/components/crm/ActivityFeed.tsx` | High | ⬜ |
| 211 | Activity type icons | `/src/app/components/crm/ActivityFeed.tsx` | High | ⬜ |
| 212 | Real-time activity updates | `/src/app/components/crm/ActivityFeed.tsx` | Medium | ⬜ |
| 213 | Activity filtering | `/src/app/components/crm/ActivityFeed.tsx` | Medium | ⬜ |
| 214 | Activity infinite scroll | `/src/app/components/crm/ActivityFeed.tsx` | Medium | ⬜ |

**Deliverables:**
- 📅 Clear timeline view
- 📝 Activity stream
- 🎨 Visual hierarchy
- ⚡ Real-time updates

---

### 4.5 Calendar & Schedule (6 bước)

**Mục tiêu:** Modern calendar UI

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 215 | Calendar view redesign | `/src/app/components/crm/CalendarView.tsx` | High | ⬜ |
| 216 | Calendar event cards | `/src/app/components/crm/CalendarView.tsx` | High | ⬜ |
| 217 | Calendar month/week/day views | `/src/app/components/crm/CalendarView.tsx` | High | ⬜ |
| 218 | Calendar drag & drop | `/src/app/components/crm/CalendarView.tsx` | Medium | ⬜ |
| 219 | Calendar event colors | `/src/app/components/crm/CalendarView.tsx` | Medium | ⬜ |
| 220 | Mini calendar component | `/src/app/components/ui/mini-calendar.tsx` | Medium | ⬜ |

**Deliverables:**
- 📅 Beautiful calendar
- 🎨 Color-coded events
- 🖱️ Drag & drop
- 📱 Responsive views

---

## ⚡ PHASE 5: INTERACTIONS & ANIMATION (50 bước)

### 5.1 Micro-interactions (12 bước)

**Mục tiêu:** Subtle animations cho better UX

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 221 | Button hover animations | `/src/styles/animations.css` | High | ⬜ |
| 222 | Button press animations | `/src/styles/animations.css` | High | ⬜ |
| 223 | Input focus animations | `/src/styles/animations.css` | High | ⬜ |
| 224 | Checkbox/radio check animation | `/src/styles/animations.css` | Medium | ⬜ |
| 225 | Toggle switch animation | `/src/styles/animations.css` | Medium | ⬜ |
| 226 | Card hover lift effect | `/src/styles/animations.css` | Medium | ⬜ |
| 227 | Badge pulse animation | `/src/styles/animations.css` | Low | ⬜ |
| 228 | Icon animations (spin, bounce) | `/src/styles/animations.css` | Medium | ⬜ |
| 229 | Tooltip appear animation | `/src/styles/animations.css` | Medium | ⬜ |
| 230 | Dropdown slide animation | `/src/styles/animations.css` | Medium | ⬜ |
| 231 | Number counter animation | `/src/app/components/ui/animated-number.tsx` | Low | ⬜ |
| 232 | Progress bar fill animation | `/src/styles/animations.css` | Medium | ⬜ |

**Deliverables:**
- ✨ Smooth micro-interactions
- 🎬 Subtle animations
- 🎯 Performance optimized
- 🎨 Consistent timing

---

### 5.2 Page Transitions (8 bước)

**Mục tiêu:** Smooth page/route transitions

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 233 | Page fade transition | `/src/app/components/PageTransition.tsx` | High | ⬜ |
| 234 | Page slide transition | `/src/app/components/PageTransition.tsx` | Medium | ⬜ |
| 235 | Shared element transitions | `/src/app/components/PageTransition.tsx` | Low | ⬜ |
| 236 | Loading page transitions | `/src/app/components/PageTransition.tsx` | High | ⬜ |
| 237 | Route change progress bar | `/src/app/components/RouteProgress.tsx` | Medium | ⬜ |
| 238 | Modal open/close animations | `/src/app/components/ui/dialog.tsx` | High | ⬜ |
| 239 | Sheet slide animations | `/src/app/components/ui/sheet.tsx` | High | ⬜ |
| 240 | Tab switching animations | `/src/app/components/ui/tabs.tsx` | Medium | ⬜ |

**Deliverables:**
- 🎬 Smooth transitions
- ⚡ Fast perceived performance
- 🎯 Context preservation
- 📱 Mobile optimized

---

### 5.3 Loading States (10 bước)

**Mục tiêu:** Elegant loading experiences

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 241 | Skeleton loader for cards | `/src/app/components/ui/skeleton.tsx` | Critical | ⬜ |
| 242 | Skeleton loader for tables | `/src/app/components/ui/skeleton.tsx` | Critical | ⬜ |
| 243 | Skeleton loader for charts | `/src/app/components/ui/skeleton.tsx` | High | ⬜ |
| 244 | Skeleton loader for forms | `/src/app/components/ui/skeleton.tsx` | High | ⬜ |
| 245 | Shimmer effect animation | `/src/styles/animations.css` | High | ⬜ |
| 246 | Spinner variants | `/src/app/components/ui/spinner.tsx` | High | ⬜ |
| 247 | Progress indicators | `/src/app/components/ui/progress.tsx` | Medium | ⬜ |
| 248 | Loading overlay | `/src/app/components/ui/loading-overlay.tsx` | Medium | ⬜ |
| 249 | Lazy loading components | Multiple files | Medium | ⬜ |
| 250 | Suspense fallbacks | Multiple files | High | ⬜ |

**Deliverables:**
- ⏳ Engaging loading states
- 💫 Shimmer effects
- 🎯 Context-aware loaders
- ⚡ Perceived performance

---

### 5.4 Gesture & Interactions (8 bước)

**Mục tiêu:** Touch & mouse interactions

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 251 | Drag & drop for Kanban | `/src/app/components/crm/KanbanView.tsx` | High | ⬜ |
| 252 | Drag & drop for calendar | `/src/app/components/crm/CalendarView.tsx` | Medium | ⬜ |
| 253 | Swipe gestures (mobile) | `/src/app/hooks/useSwipe.ts` | Medium | ⬜ |
| 254 | Long press menus | `/src/app/hooks/useLongPress.ts` | Low | ⬜ |
| 255 | Pinch to zoom (images) | `/src/app/hooks/usePinchZoom.ts` | Low | ⬜ |
| 256 | Infinite scroll | `/src/app/hooks/useInfiniteScroll.ts` | Medium | ⬜ |
| 257 | Pull to refresh | `/src/app/hooks/usePullToRefresh.ts` | Medium | ⬜ |
| 258 | Keyboard shortcuts | `/src/app/hooks/useKeyboardShortcuts.ts` | High | ⬜ |

**Deliverables:**
- 🖱️ Smooth drag & drop
- 📱 Touch gestures
- ⌨️ Keyboard shortcuts
- 🎯 Intuitive interactions

---

### 5.5 Scroll Effects (6 bước)

**Mục tiêu:** Scroll-based animations

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 259 | Sticky header on scroll | `/src/app/components/Navbar.tsx` | High | ⬜ |
| 260 | Scroll reveal animations | `/src/app/hooks/useScrollReveal.ts` | Low | ⬜ |
| 261 | Parallax effects | `/src/app/hooks/useParallax.ts` | Low | ⬜ |
| 262 | Scroll progress indicator | `/src/app/components/ScrollProgress.tsx` | Low | ⬜ |
| 263 | Back to top button | `/src/app/components/BackToTop.tsx` | Medium | ⬜ |
| 264 | Virtual scrolling for long lists | `/src/app/hooks/useVirtualScroll.ts` | Medium | ⬜ |

**Deliverables:**
- 📜 Smooth scrolling
- 🎬 Scroll animations
- ⚡ Performance optimized
- 🎯 Better navigation

---

### 5.6 Toast & Notifications (6 bước)

**Mục tiêu:** Better notification UX

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 265 | Toast position variants | `/src/app/components/ui/sonner.tsx` | High | ⬜ |
| 266 | Toast types (success, error, info, warning) | `/src/app/components/ui/sonner.tsx` | High | ⬜ |
| 267 | Toast actions (undo, retry) | `/src/app/components/ui/sonner.tsx` | Medium | ⬜ |
| 268 | Toast animations | `/src/app/components/ui/sonner.tsx` | High | ⬜ |
| 269 | Notification center | `/src/app/components/crm/NotificationCenter.tsx` | High | ⬜ |
| 270 | Notification badges | `/src/app/components/ui/notification-badge.tsx` | Medium | ⬜ |

**Deliverables:**
- 🔔 Clear notifications
- 🎬 Smooth animations
- 🎯 Actionable toasts
- 📱 Mobile friendly

---

## ♿ PHASE 6: ACCESSIBILITY & UX (40 bước)

### 6.1 Keyboard Navigation (10 bước)

**Mục tiêu:** Full keyboard accessibility

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 271 | Focus visible styles | `/src/styles/theme.css` | Critical | ⬜ |
| 272 | Focus trap for modals | `/src/app/components/ui/dialog.tsx` | Critical | ⬜ |
| 273 | Tab navigation order | Multiple files | High | ⬜ |
| 274 | Skip to content link | `/src/app/components/Layout.tsx` | High | ⬜ |
| 275 | Keyboard shortcuts documentation | `/docs/keyboard-shortcuts.md` | Medium | ⬜ |
| 276 | Escape key to close modals | `/src/app/components/ui/dialog.tsx` | High | ⬜ |
| 277 | Arrow key navigation in lists | Multiple files | Medium | ⬜ |
| 278 | Enter/Space activation | Multiple files | High | ⬜ |
| 279 | Ctrl+K command palette | `/src/app/components/ui/command.tsx` | High | ⬜ |
| 280 | Keyboard accessible tooltips | `/src/app/components/ui/tooltip.tsx` | Medium | ⬜ |

**Deliverables:**
- ⌨️ Full keyboard support
- 🎯 Logical tab order
- 🔍 Command palette
- ✨ Visible focus states

---

### 6.2 Screen Reader Support (8 bước)

**Mục tiêu:** ARIA labels, semantic HTML

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 281 | ARIA labels audit | All components | Critical | ⬜ |
| 282 | ARIA live regions | Dynamic components | High | ⬜ |
| 283 | ARIA expanded/collapsed states | Collapsible components | High | ⬜ |
| 284 | Alt text for images | All image components | High | ⬜ |
| 285 | Semantic HTML elements | All components | High | ⬜ |
| 286 | ARIA descriptions | Complex components | Medium | ⬜ |
| 287 | Screen reader announcements | Interactive elements | High | ⬜ |
| 288 | ARIA landmarks | Layout components | Medium | ⬜ |

**Deliverables:**
- 🔊 Screen reader friendly
- 🏷️ Proper ARIA labels
- 🎯 Semantic HTML
- ♿ WCAG 2.1 AA compliant

---

### 6.3 Form UX Improvements (10 bước)

**Mục tiêu:** Better form experiences

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 289 | Inline validation | Form components | Critical | ⬜ |
| 290 | Real-time feedback | Form components | High | ⬜ |
| 291 | Clear error messages | Form components | Critical | ⬜ |
| 292 | Password strength indicator | `/src/app/components/ui/password-input.tsx` | Medium | ⬜ |
| 293 | Auto-save drafts | Form pages | Medium | ⬜ |
| 294 | Form progress indicator | Multi-step forms | Medium | ⬜ |
| 295 | Field help text | Form components | High | ⬜ |
| 296 | Required field indicators | Form components | High | ⬜ |
| 297 | Form success states | Form components | High | ⬜ |
| 298 | Prevent accidental data loss | Form pages | High | ⬜ |

**Deliverables:**
- ✅ Clear validation
- 💡 Helpful feedback
- 💾 Auto-save
- 🎯 Better UX

---

### 6.4 Mobile UX (8 bước)

**Mục tiêu:** Mobile-first improvements

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 299 | Touch target sizes (44x44px min) | All interactive elements | Critical | ⬜ |
| 300 | Mobile navigation drawer | `/src/app/components/Sidebar.tsx` | Critical | ⬜ |
| 301 | Bottom sheet for mobile actions | `/src/app/components/ui/bottom-sheet.tsx` | High | ⬜ |
| 302 | Mobile-optimized tables | `/src/app/components/crm/DataTable.tsx` | Critical | ⬜ |
| 303 | Swipe actions | List/Card components | Medium | ⬜ |
| 304 | Pull to refresh | List pages | Medium | ⬜ |
| 305 | Mobile search optimization | Search components | High | ⬜ |
| 306 | Responsive breakpoints | All pages | High | ⬜ |

**Deliverables:**
- 📱 Mobile-first design
- 👆 Touch-friendly
- 🔄 Swipe gestures
- 📊 Responsive tables

---

### 6.5 Error Handling (4 bước)

**Mục tiêu:** Better error experiences

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 307 | Error boundary component | `/src/app/components/ErrorBoundary.tsx` | Critical | ⬜ |
| 308 | 404 page design | `/src/app/pages/NotFound.tsx` | High | ⬜ |
| 309 | 500 error page | `/src/app/pages/ServerError.tsx` | High | ⬜ |
| 310 | Network error states | Data components | High | ⬜ |

**Deliverables:**
- 🚨 Graceful error handling
- 🎨 Friendly error pages
- 🔄 Retry mechanisms
- 💡 Helpful messages

---

## 🚀 PHASE 7: PERFORMANCE & LOADING (20 bước)

### 7.1 Performance Optimization (10 bước)

**Mục tiêu:** Fast, smooth experience

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 311 | Code splitting by route | `/src/app/routes.ts` | Critical | ⬜ |
| 312 | Lazy load heavy components | Multiple files | High | ⬜ |
| 313 | Image optimization | All image components | High | ⬜ |
| 314 | Virtual scrolling for tables | `/src/app/components/crm/DataTable.tsx` | Medium | ⬜ |
| 315 | Debounce search inputs | Search components | High | ⬜ |
| 316 | Memoization optimization | React components | Medium | ⬜ |
| 317 | Bundle size analysis | Build config | Medium | ⬜ |
| 318 | Remove unused CSS | Build config | Medium | ⬜ |
| 319 | Tree shaking optimization | Build config | Low | ⬜ |
| 320 | Performance monitoring | `/src/lib/performance.ts` | Low | ⬜ |

**Deliverables:**
- ⚡ Fast load times
- 🎯 Optimized bundles
- 📊 Performance monitoring
- 🚀 Smooth interactions

---

### 7.2 Loading Strategies (10 bước)

**Mục tiêu:** Smart loading patterns

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 321 | Progressive loading | Data-heavy pages | High | ⬜ |
| 322 | Skeleton screens everywhere | All pages | Critical | ⬜ |
| 323 | Optimistic UI updates | Form submissions | High | ⬜ |
| 324 | Prefetch critical data | Route config | Medium | ⬜ |
| 325 | Background data refresh | Data hooks | Medium | ⬜ |
| 326 | Stale-while-revalidate | React Query config | High | ⬜ |
| 327 | Pagination vs infinite scroll | List pages | Medium | ⬜ |
| 328 | Image lazy loading | All images | High | ⬜ |
| 329 | Chart lazy rendering | Chart components | Medium | ⬜ |
| 330 | Component suspense boundaries | All pages | High | ⬜ |

**Deliverables:**
- ⏳ Better perceived performance
- 🎯 Smart caching
- 🔄 Background updates
- 📱 Optimized for mobile

---

## ✨ PHASE 8: POLISH & DETAILS (20 bước)

### 8.1 Visual Polish (10 bước)

**Mục tiêu:** Finishing touches

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 331 | Consistent shadow usage | All components | High | ⬜ |
| 332 | Consistent border radius | All components | High | ⬜ |
| 333 | Consistent spacing | All components | High | ⬜ |
| 334 | Icon consistency audit | All pages | Medium | ⬜ |
| 335 | Color usage audit | All components | High | ⬜ |
| 336 | Typography audit | All pages | High | ⬜ |
| 337 | Remove visual clutter | All pages | Medium | ⬜ |
| 338 | Improve visual hierarchy | All pages | High | ⬜ |
| 339 | Add subtle gradients | Cards, buttons | Low | ⬜ |
| 340 | Polish empty states | All empty states | Medium | ⬜ |

**Deliverables:**
- ✨ Polished UI
- 🎨 Consistent design
- 🎯 Clear hierarchy
- 💎 Attention to detail

---

### 8.2 Dark Mode (5 bước)

**Mục tiêu:** Full dark mode support

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 341 | Dark mode color tokens | `/src/styles/theme.css` | High | ⬜ |
| 342 | Dark mode toggle | `/src/app/components/ThemeToggle.tsx` | High | ⬜ |
| 343 | Dark mode persistence | `/src/hooks/useTheme.ts` | High | ⬜ |
| 344 | Dark mode chart colors | Chart components | Medium | ⬜ |
| 345 | Dark mode images | Image components | Low | ⬜ |

**Deliverables:**
- 🌓 Full dark mode
- 💾 Preference persistence
- 🎨 Optimized colors
- 📊 Dark mode charts

---

### 8.3 Documentation & Testing (5 bước)

**Mục tiêu:** Document design system

| # | Task | File | Priority | Status |
|---|------|------|----------|--------|
| 346 | Component documentation | `/docs/components/` | Medium | ⬜ |
| 347 | Design tokens documentation | `/docs/design-tokens.md` | Medium | ⬜ |
| 348 | Style guide page | `/src/app/pages/StyleGuide.tsx` | Low | ⬜ |
| 349 | Accessibility guidelines | `/docs/accessibility.md` | High | ⬜ |
| 350 | Visual regression testing | Test config | Low | ⬜ |

**Deliverables:**
- 📚 Complete documentation
- 🎨 Style guide
- ✅ Testing coverage
- ♿ A11y guidelines

---

## 📋 IMPLEMENTATION PRIORITIES

### 🔴 Critical (Must Have - Week 1-2)
1. Color System Enhancement (1.1)
2. Typography System (1.2)
3. Button Components (2.1)
4. Form Components (2.2)
5. Page Layout System (3.1)
6. Keyboard Navigation (6.1)

### 🟠 High Priority (Should Have - Week 3-4)
1. Spacing & Layout System (1.3)
2. Data Display Components (2.3)
3. Navigation Components (2.4)
4. Sidebar Enhancement (3.2)
5. Chart Components (4.1)
6. Mobile UX (6.4)

### 🟡 Medium Priority (Nice to Have - Week 5-6)
1. Shadows & Effects (1.4)
2. Overlay Components (2.5)
3. Filter & Search Panels (3.6)
4. Metric Cards (4.2)
5. Micro-interactions (5.1)
6. Performance Optimization (7.1)

### 🟢 Low Priority (Future - Week 7-8)
1. Icons & Illustrations (1.5)
2. Badge & Status Components (2.7)
3. Scroll Effects (5.5)
4. Dark Mode (8.2)
5. Visual Polish (8.1)

---

## 🎯 SUCCESS METRICS

### Performance
- ⚡ Page load < 2s
- 🎯 First Contentful Paint < 1s
- 📊 Lighthouse Score > 90

### Accessibility
- ♿ WCAG 2.1 AA Compliant
- ⌨️ Full keyboard navigation
- 🔊 Screen reader compatible

### User Experience
- 📱 Mobile responsive (100% pages)
- 🎨 Design consistency (95%+)
- ✨ Smooth animations (60fps)

### Developer Experience
- 📚 Complete documentation
- 🧩 Reusable components
- 🎯 Type safety (100%)

---

## 📝 NOTES

### Design Principles
1. **Simplicity First** - Remove visual clutter
2. **Consistency** - Uniform patterns across app
3. **Accessibility** - Everyone can use it
4. **Performance** - Fast and smooth
5. **Mobile-First** - Works great on all devices

### Tech Stack
- **CSS Framework:** Tailwind CSS v4
- **Components:** shadcn/ui + custom
- **Icons:** lucide-react
- **Charts:** Recharts
- **Animations:** Framer Motion / CSS
- **Accessibility:** Radix UI primitives

### Resources
- Design inspiration: Dribbble, Behance
- Component reference: shadcn/ui, Vercel
- Accessibility: ARIA Authoring Practices
- Performance: web.dev, Chrome DevTools

---

## 🚀 GETTING STARTED

### Week 1: Foundation
1. Complete Phase 1.1-1.3 (Color, Typography, Spacing)
2. Update theme.css với design tokens
3. Create base component variants
4. Test on sample pages

### Week 2: Components
1. Complete Phase 2.1-2.3 (Buttons, Forms, Data Display)
2. Refactor existing components
3. Add new variants
4. Test accessibility

### Week 3-4: Layout & Navigation
1. Complete Phase 3 (Layouts, Navigation)
2. Implement new page structures
3. Enhance sidebar & header
4. Mobile optimization

### Week 5-6: Visualization & Interaction
1. Complete Phase 4-5 (Charts, Animations)
2. Add micro-interactions
3. Improve loading states
4. Polish transitions

### Week 7-8: Final Polish
1. Complete Phase 6-8 (A11y, Performance, Polish)
2. Bug fixes
3. Documentation
4. Testing & QA

---

**Last Updated:** 2026-03-17
**Status:** Ready to Start 🚀
**Progress:** 0/350 steps (0%)
