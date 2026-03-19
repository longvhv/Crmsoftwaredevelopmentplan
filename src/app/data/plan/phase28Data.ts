/**
 * Phase 28: ACCESSIBILITY, INCLUSIVE DESIGN & UX RESEARCH
 * WCAG 2.2 AA compliance, screen reader optimization,
 * keyboard navigation, i18n v2, RTL support, UX research,
 * design system maturity, usability testing.
 * Steps: 28.1.1 → 28.6.3 (~28 bước)
 */
import type { PlanStep } from "../../types/plan";

export const phase28Steps: PlanStep[] = [
  // --- 28.1 WCAG Compliance ---
  {
    id: "28.1.1",
    name: "WCAG 2.2 AA Compliance Audit & Remediation",
    description:
      "Audit toàn bộ application: color contrast (4.5:1 text, 3:1 UI), focus indicators, alt text, form labels, error identification, timing adjustable. Fix 100% critical & major issues. Third-party audit.",
    phase: 28, category: "Accessibility", subCategory: "WCAG",
    responsible: ["Frontend Dev", "UX Designer", "QA"],
    aiInvolvement: "AI-Assisted", dependencies: ["18.7.4"],
    duration: "7 ngày", status: "pending", priority: "Critical",
    deliverables: ["WCAG audit report", "Remediation plan", "100% critical fix", "Third-party certification"],
    aiTools: ["axe DevTools", "Accessibility Insights"],
  },
  {
    id: "28.1.2",
    name: "Keyboard Navigation & Focus Management",
    description:
      "Full keyboard navigation: tab order optimization, skip links, focus trapping cho modals/dialogs, roving tabindex cho complex widgets, keyboard shortcuts system, shortcut discovery panel.",
    phase: 28, category: "Accessibility", subCategory: "Keyboard",
    responsible: ["Frontend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.1.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Tab order optimization", "Skip links", "Focus trap system", "Keyboard shortcuts"],
    aiTools: ["Focus Manager"],
  },
  {
    id: "28.1.3",
    name: "Screen Reader Optimization (ARIA)",
    description:
      "Screen reader optimization: ARIA roles/properties/states, live regions for dynamic content, table/grid navigation, form validation announcements, custom widget ARIA patterns.",
    phase: 28, category: "Accessibility", subCategory: "Screen Reader",
    responsible: ["Frontend Dev", "QA"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.1.2"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["ARIA implementation", "Live regions", "Custom widget patterns", "Screen reader test results"],
    aiTools: ["NVDA", "VoiceOver", "JAWS"],
  },
  {
    id: "28.1.4",
    name: "Color Accessibility & Theme Options",
    description:
      "Color accessibility: high contrast mode, reduced motion mode, color blind friendly palettes (deuteranopia, protanopia, tritanopia), dark mode accessibility, font size scaling support.",
    phase: 28, category: "Accessibility", subCategory: "Color",
    responsible: ["UX Designer", "Frontend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.1.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["High contrast theme", "Reduced motion mode", "Color blind palettes", "Font scaling"],
    aiTools: ["Color Contrast AI", "Sim Daltonism"],
  },

  // --- 28.2 Internationalization v2 ---
  {
    id: "28.2.1",
    name: "i18n v2 — Full Application Localization",
    description:
      "Localization toàn bộ app: tất cả UI strings, error messages, email templates, PDF documents, help content. Translation management platform (Crowdin/Lokalise), context-aware translation, glossary.",
    phase: 28, category: "Accessibility", subCategory: "i18n",
    responsible: ["Frontend Dev", "Backend Dev", "Localization Manager"],
    aiInvolvement: "AI-Assisted", dependencies: ["10.2.1"],
    duration: "6 ngày", status: "pending", priority: "Critical",
    deliverables: ["Full app localization", "Translation platform setup", "Glossary management", "Context-aware translations"],
    aiTools: ["Crowdin", "AI Translation"],
  },
  {
    id: "28.2.2",
    name: "RTL (Right-to-Left) Layout Support",
    description:
      "RTL support cho Arabic, Hebrew: CSS logical properties (margin-inline-start), bi-directional text, mirrored icons, RTL-aware components, number formatting, calendar direction.",
    phase: 28, category: "Accessibility", subCategory: "RTL",
    responsible: ["Frontend Dev", "UX Designer"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.2.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["RTL CSS implementation", "Bi-directional components", "Mirrored assets", "RTL testing"],
    aiTools: ["RTL CSS Tools"],
  },
  {
    id: "28.2.3",
    name: "Locale-aware Formatting (Dates, Numbers, Currencies)",
    description:
      "Formatting theo locale: date formats (DD/MM/YYYY vs MM/DD/YYYY), number separators (1.000,00 vs 1,000.00), currency display, relative time, timezone handling, calendar systems.",
    phase: 28, category: "Accessibility", subCategory: "Formatting",
    responsible: ["Frontend Dev", "Backend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.2.1"],
    duration: "3 ngày", status: "pending", priority: "High",
    deliverables: ["Intl API integration", "Date format configs", "Number format configs", "Timezone handling"],
    aiTools: ["Intl API", "date-fns"],
  },

  // --- 28.3 Design System Maturity ---
  {
    id: "28.3.1",
    name: "Design System v2 — Comprehensive Component Library",
    description:
      "Design system upgrade: 100+ components, design tokens (colors, spacing, typography, shadows), Figma ↔ code sync, variant support, responsive tokens, animation tokens.",
    phase: 28, category: "Accessibility", subCategory: "Design System",
    responsible: ["UX Designer", "Frontend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.1.1"],
    duration: "7 ngày", status: "pending", priority: "Critical",
    deliverables: ["100+ components", "Design tokens system", "Figma sync", "Variant library"],
    aiTools: ["Figma Tokens", "Style Dictionary"],
  },
  {
    id: "28.3.2",
    name: "Design System Documentation & Contribution Guide",
    description:
      "Docs cho design system: usage guidelines per component, do's and don'ts, composition patterns, migration guides, contribution workflow (propose → review → implement → document).",
    phase: 28, category: "Accessibility", subCategory: "Design Docs",
    responsible: ["UX Designer", "Technical Writer"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.3.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Component guidelines", "Pattern library", "Contribution workflow", "Migration guides"],
    aiTools: ["Storybook Docs"],
  },
  {
    id: "28.3.3",
    name: "Design System Governance & Adoption Metrics",
    description:
      "Governance: component adoption tracking, design debt scoring, usage analytics (which components, which variants), lint rules for design system compliance, quarterly audit.",
    phase: 28, category: "Accessibility", subCategory: "DS Governance",
    responsible: ["UX Designer", "Frontend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.3.2"],
    duration: "3 ngày", status: "pending", priority: "Medium",
    deliverables: ["Adoption dashboard", "Design debt tracker", "Lint rules", "Quarterly audit template"],
    aiTools: ["Design Lint AI"],
  },

  // --- 28.4 UX Research & Testing ---
  {
    id: "28.4.1",
    name: "UX Research Program Setup",
    description:
      "UX research program: user research panel (recruit, manage, incentivize), research repository (insights, findings, recommendations), research templates (interview guides, survey frameworks).",
    phase: 28, category: "Accessibility", subCategory: "UX Research",
    responsible: ["UX Researcher", "Product"],
    aiInvolvement: "Human-Led", dependencies: [],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Research panel", "Insight repository", "Interview templates", "Survey frameworks"],
    aiTools: ["UserTesting", "Dovetail"],
  },
  {
    id: "28.4.2",
    name: "Usability Testing Framework (Moderated & Unmoderated)",
    description:
      "Usability testing: moderated sessions (screen share, think-aloud), unmoderated tests (Maze/UserTesting), task success rates, time-on-task, System Usability Scale (SUS). Monthly testing cadence.",
    phase: 28, category: "Accessibility", subCategory: "Usability Testing",
    responsible: ["UX Researcher", "UX Designer"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.4.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Testing framework", "Task library", "SUS benchmarks", "Monthly testing schedule"],
    aiTools: ["Maze", "UserTesting AI"],
  },
  {
    id: "28.4.3",
    name: "Behavioral Analytics & Session Recording",
    description:
      "Analytics nâng cao: heatmaps, scroll maps, click maps, rage click detection, dead click detection, session recording (privacy-safe), funnel analysis, user flow visualization.",
    phase: 28, category: "Accessibility", subCategory: "Behavioral Analytics",
    responsible: ["Frontend Dev", "Data Analyst"],
    aiInvolvement: "AI-Driven", dependencies: ["28.4.2"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Heatmap integration", "Session recording", "Rage click detection", "Funnel analysis"],
    aiTools: ["Hotjar", "FullStory AI", "PostHog"],
  },

  // --- 28.5 Responsive & Adaptive Design ---
  {
    id: "28.5.1",
    name: "Responsive Design Audit & Enhancement",
    description:
      "Audit responsive design: tất cả pages hoạt động tốt trên 320px → 2560px, breakpoint optimization, touch target sizes (48px min), responsive tables, responsive charts, responsive forms.",
    phase: 28, category: "Accessibility", subCategory: "Responsive",
    responsible: ["Frontend Dev", "UX Designer"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.3.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Responsive audit", "Breakpoint optimization", "Touch target compliance", "Responsive component fixes"],
    aiTools: ["Responsive Tester"],
  },
  {
    id: "28.5.2",
    name: "Progressive Web App (PWA) Enhancement",
    description:
      "PWA upgrade: installable (manifest, service worker), offline access, push notifications, app-like experience, splash screen, icon sets (all sizes), lighthouse PWA score 100.",
    phase: 28, category: "Accessibility", subCategory: "PWA",
    responsible: ["Frontend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["26.4.3"],
    duration: "4 ngày", status: "pending", priority: "Medium",
    deliverables: ["PWA manifest", "Install prompts", "Splash screen", "Lighthouse PWA 100"],
    aiTools: ["PWA Builder", "Workbox"],
  },

  // --- 28.6 Personalization & Customization ---
  {
    id: "28.6.1",
    name: "User Preference System (Theme, Layout, Language)",
    description:
      "Preferences per user: theme (light/dark/system), language, timezone, date format, number format, default views, email frequency, notification channels. Sync across devices.",
    phase: 28, category: "Accessibility", subCategory: "Personalization",
    responsible: ["Frontend Dev", "Backend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.1.4", "28.2.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Preference system", "Cross-device sync", "Theme engine", "Format settings"],
    aiTools: ["Preference Engine"],
  },
  {
    id: "28.6.2",
    name: "Customizable Layouts & Workspace Personalization",
    description:
      "Layout customization: drag-and-drop dashboard layouts, resizable panels, collapsible sidebars, custom navigation order, saved views per user, workspace themes.",
    phase: 28, category: "Accessibility", subCategory: "Layout Customization",
    responsible: ["Frontend Dev", "Product"],
    aiInvolvement: "AI-Assisted", dependencies: ["28.6.1"],
    duration: "4 ngày", status: "pending", priority: "Medium",
    deliverables: ["Drag-and-drop layouts", "Resizable panels", "Custom navigation", "Saved views"],
    aiTools: ["Layout Engine", "React DnD"],
  },
  {
    id: "28.6.3",
    name: "AI-Powered UX Optimization",
    description:
      "AI optimize UX: personalized feature discovery, adaptive navigation (reorder based on usage), smart defaults (pre-fill based on patterns), proactive help suggestions, onboarding flow optimization.",
    phase: 28, category: "Accessibility", subCategory: "AI UX",
    responsible: ["AI Engineer", "UX Designer", "Product"],
    aiInvolvement: "AI-Driven", dependencies: ["28.6.2", "24.2.2"],
    duration: "5 ngày", status: "pending", priority: "Medium",
    deliverables: ["Adaptive navigation", "Smart defaults", "Feature discovery AI", "Proactive help"],
    aiTools: ["UX Optimization AI", "Behavioral Model"],
  },
];
