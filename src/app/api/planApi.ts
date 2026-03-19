/**
 * API Layer cho Kế hoạch Chi tiết
 *
 * Hiện tại sử dụng mock data với simulated delay.
 * Khi tích hợp backend thực, chỉ cần thay thế nội dung
 * các hàm bên dưới bằng fetch/axios calls.
 */

import type { PlanFilters, PlanStats, PlanStep } from "../types/plan";
import { PHASE_NAMES, STATUS_CONFIG } from "../constants/planConfig";
import { planStepsData } from "../data/plan";

/** Thời gian delay giả lập (ms) — đặt 0 trong production */
const SIMULATED_DELAY_MS = 0;

function simulateDelay<T>(data: T): Promise<T> {
  if (SIMULATED_DELAY_MS <= 0) {
    return Promise.resolve(data);
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), SIMULATED_DELAY_MS);
  });
}

/* ============================================================
 * GET: Lấy tất cả bước kế hoạch
 * ============================================================ */
export async function fetchAllSteps(): Promise<PlanStep[]> {
  return simulateDelay([...planStepsData]);
}

/* ============================================================
 * GET: Lấy danh sách bước có filter
 * ============================================================ */
export async function fetchFilteredSteps(filters: PlanFilters): Promise<PlanStep[]> {
  const steps = await fetchAllSteps();

  return steps.filter((step) => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchFields = [
        step.name,
        step.description,
        step.id,
        step.category,
        step.subCategory,
        ...step.responsible,
        ...step.aiTools,
      ];
      if (!matchFields.some((field) => field.toLowerCase().includes(query))) {
        return false;
      }
    }
    if (filters.phase !== null && step.phase !== filters.phase) return false;
    if (filters.category && step.category !== filters.category) return false;
    if (filters.status && step.status !== filters.status) return false;
    if (filters.aiInvolvement && step.aiInvolvement !== filters.aiInvolvement) return false;
    if (filters.responsible && !step.responsible.includes(filters.responsible)) return false;
    return true;
  });
}

/* ============================================================
 * GET: Thống kê tổng quan
 * ============================================================ */
export async function fetchPlanStats(): Promise<PlanStats> {
  const steps = await fetchAllSteps();
  return simulateDelay({
    total: steps.length,
    done: steps.filter((s) => s.status === "done").length,
    inProgress: steps.filter((s) => s.status === "in-progress").length,
    pending: steps.filter((s) => s.status === "pending").length,
    blocked: steps.filter((s) => s.status === "blocked").length,
    aiDriven: steps.filter((s) => s.aiInvolvement === "AI-Driven" || s.aiInvolvement === "AI-Only").length,
    critical: steps.filter((s) => s.priority === "Critical").length,
  });
}

/* ============================================================
 * GET: Lấy danh sách danh mục
 * ============================================================ */
export async function fetchCategories(): Promise<string[]> {
  const steps = await fetchAllSteps();
  return simulateDelay([...new Set(steps.map((s) => s.category))]);
}

/* ============================================================
 * GET: Lấy danh sách người phụ trách
 * ============================================================ */
export async function fetchResponsibleList(): Promise<string[]> {
  const steps = await fetchAllSteps();
  return simulateDelay([...new Set(steps.flatMap((s) => s.responsible))].sort());
}

/* ============================================================
 * GET: Lấy chi tiết một bước
 * ============================================================ */
export async function fetchStepById(id: string): Promise<PlanStep | undefined> {
  const steps = await fetchAllSteps();
  return simulateDelay(steps.find((s) => s.id === id));
}

/* ============================================================
 * Helpers: Nhóm dữ liệu
 * ============================================================ */
export function groupStepsByKey(
  steps: PlanStep[],
  groupBy: string,
): Map<string, PlanStep[]> {
  const groups = new Map<string, PlanStep[]>();

  for (const step of steps) {
    let key: string;
    switch (groupBy) {
      case "phase":
        key = PHASE_NAMES[step.phase];
        break;
      case "category":
        key = step.category;
        break;
      case "status":
        key = STATUS_CONFIG[step.status].label;
        break;
      case "aiInvolvement":
        key = step.aiInvolvement;
        break;
      default:
        key = "Tất cả";
    }

    const existing = groups.get(key);
    if (existing) {
      existing.push(step);
    } else {
      groups.set(key, [step]);
    }
  }

  return groups;
}
