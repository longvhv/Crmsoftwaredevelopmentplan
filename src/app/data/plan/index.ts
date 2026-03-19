/**
 * Aggregator cho dữ liệu kế hoạch.
 * Import dữ liệu từ tất cả files phase và re-export với kiểu dữ liệu chuẩn.
 *
 * Phase 0–2: /src/app/data/detailedPlanData.ts (Steps 1-120 - DONE)
 * Phase 3–5: /src/app/data/generateFullPlan.ts (Steps 121-850 - UPCOMING)
 * Phase 6–30: Expansion phases (Future)
 */
import type { PlanStep } from "../../types/plan";
import { planSteps as phases0to2 } from "../detailedPlanData";
import { fullPlanSteps } from "../generateFullPlan";

/** Dữ liệu tất cả bước kế hoạch (typed) — Phase 0 → 30 */
export const planStepsData: PlanStep[] = [
  ...phases0to2,
  ...fullPlanSteps,
];

/** Danh sách danh mục (unique) */
export const allCategories: string[] = [...new Set(planStepsData.map((s) => s.category))];

/** Danh sách người phụ trách (unique, sorted) */
export const allResponsible: string[] = [...new Set(planStepsData.flatMap((s) => s.responsible))].sort();

/** Danh sách AI tools (unique, sorted) */
export const allAITools: string[] = [...new Set(planStepsData.flatMap((s) => s.aiTools))].sort();