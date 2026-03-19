import type { AIInvolvementLevel, StepPriority, StepStatus } from "../types/plan";

/* ============================================================
 * Cấu hình hiển thị trạng thái
 * ============================================================ */
export interface StatusDisplayConfig {
  color: string;
  label: string;
  dotColor: string;
}

export const STATUS_CONFIG: Record<StepStatus, StatusDisplayConfig> = {
  done: {
    color: "text-green-600 bg-green-100",
    label: "Hoàn thành",
    dotColor: "bg-green-500",
  },
  "in-progress": {
    color: "text-blue-600 bg-blue-100",
    label: "Đang thực hiện",
    dotColor: "bg-blue-500",
  },
  pending: {
    color: "text-gray-500 bg-gray-100",
    label: "Chờ thực hiện",
    dotColor: "bg-gray-300",
  },
  blocked: {
    color: "text-red-600 bg-red-100",
    label: "Bị chặn",
    dotColor: "bg-red-500",
  },
};

export const STATUS_OPTIONS: StepStatus[] = ["done", "in-progress", "pending", "blocked"];

/* ============================================================
 * Cấu hình mức ưu tiên
 * ============================================================ */
export const PRIORITY_CONFIG: Record<StepPriority, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-amber-100 text-amber-700",
  Medium: "bg-blue-100 text-blue-700",
  Low: "bg-gray-100 text-gray-500",
};

export const PRIORITY_OPTIONS: StepPriority[] = ["Critical", "High", "Medium", "Low"];

/* ============================================================
 * Cấu hình mức độ AI
 * ============================================================ */
export const AI_LEVEL_CONFIG: Record<AIInvolvementLevel, { color: string; iconType: "bot" | "zap" | "users" }> = {
  "AI-Driven": { color: "bg-violet-100 text-violet-700", iconType: "bot" },
  "AI-Assisted": { color: "bg-blue-100 text-blue-700", iconType: "zap" },
  "Human-Led": { color: "bg-amber-100 text-amber-700", iconType: "users" },
  "AI-Only": { color: "bg-purple-100 text-purple-700", iconType: "bot" },
};

export const AI_LEVEL_OPTIONS: AIInvolvementLevel[] = ["AI-Driven", "AI-Assisted", "Human-Led", "AI-Only"];

/* ============================================================
 * Cấu hình Phase
 * ============================================================ */
export const PHASE_NAMES: Record<number, string> = {
  0: "Phase 0: Nền tảng & Lập kế hoạch",
  1: "Phase 1: Core Infrastructure",
  2: "Phase 2: Advanced UI Components",
  3: "Phase 3: Enhanced CRM Core Pages",
  4: "Phase 4: Advanced CRM Features",
  5: "Phase 5: AI Integration & World-Class",
  6: "Phase 6: Backend Production & Real-time",
  7: "Phase 7: AI Engine & Machine Learning",
  8: "Phase 8: Omnichannel Communication",
  9: "Phase 9: Security, Compliance & Governance",
  10: "Phase 10: Mobile, i18n & Global Scale",
  11: "Phase 11: Marketplace, Ecosystem & Innovation",
  12: "Phase 12: Advanced AI & Autonomous Agents",
  13: "Phase 13: Analytics, BI & Customer Data Platform",
  14: "Phase 14: Customer Engagement & Experience",
  15: "Phase 15: Industry Solutions & Vertical CRM",
  16: "Phase 16: DevOps, Observability & Global Scale",
  17: "Phase 17: Growth, Monetization & Global Expansion",
  18: "Phase 18: Testing, QA & Reliability Engineering",
  19: "Phase 19: Advanced Integration Architecture & iPaaS",
  20: "Phase 20: Real-time Collaboration & Communication",
  21: "Phase 21: Document & Contract Intelligence",
  22: "Phase 22: Revenue Operations & Financial Intelligence",
  23: "Phase 23: Customer Success & Retention Platform",
  24: "Phase 24: Generative AI, LLM Ops & AI Governance",
  25: "Phase 25: Data Sovereignty, Privacy & Trust Center",
  26: "Phase 26: Performance at Scale — Caching, CDN, Edge",
  27: "Phase 27: Developer Experience & API Economy",
  28: "Phase 28: Accessibility, Inclusive Design & UX Research",
  29: "Phase 29: Business Continuity, Resilience & Future-proofing",
  30: "Phase 30: Sales Playbook & Methodology Engine",
};

export const PHASE_BG_COLORS: Record<number, string> = {
  0: "bg-slate-50 border-slate-200",
  1: "bg-blue-50 border-blue-200",
  2: "bg-green-50 border-green-200",
  3: "bg-violet-50 border-violet-200",
  4: "bg-orange-50 border-orange-200",
  5: "bg-red-50 border-red-200",
  6: "bg-cyan-50 border-cyan-200",
  7: "bg-pink-50 border-pink-200",
  8: "bg-teal-50 border-teal-200",
  9: "bg-rose-50 border-rose-200",
  10: "bg-indigo-50 border-indigo-200",
  11: "bg-amber-50 border-amber-200",
  12: "bg-fuchsia-50 border-fuchsia-200",
  13: "bg-emerald-50 border-emerald-200",
  14: "bg-sky-50 border-sky-200",
  15: "bg-lime-50 border-lime-200",
  16: "bg-stone-50 border-stone-200",
  17: "bg-yellow-50 border-yellow-200",
  18: "bg-slate-50 border-slate-300",
  19: "bg-blue-50 border-blue-300",
  20: "bg-green-50 border-green-300",
  21: "bg-violet-50 border-violet-300",
  22: "bg-orange-50 border-orange-300",
  23: "bg-red-50 border-red-300",
  24: "bg-cyan-50 border-cyan-300",
  25: "bg-pink-50 border-pink-300",
  26: "bg-teal-50 border-teal-300",
  27: "bg-indigo-50 border-indigo-300",
  28: "bg-amber-50 border-amber-300",
  29: "bg-fuchsia-50 border-fuchsia-300",
  30: "bg-rose-50 border-rose-300",
};

export const PHASE_COUNT = 31;

/* ============================================================
 * Nhóm theo (Group By)
 * ============================================================ */
export const GROUP_BY_OPTIONS = [
  { key: "phase" as const, label: "Phase" },
  { key: "category" as const, label: "Danh mục" },
  { key: "status" as const, label: "Trạng thái" },
  { key: "aiInvolvement" as const, label: "Mức AI" },
  { key: "none" as const, label: "Phẳng" },
];