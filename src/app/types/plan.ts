/** Mức độ AI tham gia vào bước thực hiện */
export type AIInvolvementLevel = "AI-Driven" | "AI-Assisted" | "Human-Led" | "AI-Only";

/** Trạng thái thực hiện của bước */
export type StepStatus = "done" | "in-progress" | "pending" | "blocked";

/** Mức độ ưu tiên */
export type StepPriority = "Critical" | "High" | "Medium" | "Low";

/** Cách nhóm danh sách */
export type GroupByOption = "phase" | "category" | "status" | "aiInvolvement" | "none";

/** Bước kế hoạch chi tiết */
export interface PlanStep {
  id: string;
  name: string;
  description: string;
  phase: number;
  category: string;
  subCategory: string;
  responsible: string[];
  aiInvolvement: AIInvolvementLevel;
  dependencies: string[];
  duration: string;
  status: StepStatus;
  priority: StepPriority;
  deliverables: string[];
  aiTools: string[];
  notes?: string;
}

/** Bộ lọc cho danh sách kế hoạch */
export interface PlanFilters {
  searchQuery: string;
  phase: number | null;
  category: string | null;
  status: StepStatus | null;
  aiInvolvement: AIInvolvementLevel | null;
  responsible: string | null;
}

/** Thống kê tổng quan kế hoạch */
export interface PlanStats {
  total: number;
  done: number;
  inProgress: number;
  pending: number;
  blocked: number;
  aiDriven: number;
  critical: number;
}
