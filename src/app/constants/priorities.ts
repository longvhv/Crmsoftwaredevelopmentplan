/* ============================================================
 * Priority Constants - Priority Levels & Mappings
 * Centralized priority configurations
 * ============================================================ */

import type { Priority } from "@/types";

/* ============================================================
 * Priority Levels
 * ============================================================ */

export const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  urgent: "Khẩn cấp",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "gray",
  medium: "blue",
  high: "orange",
  urgent: "red",
};

export const PRIORITY_ICONS: Record<Priority, string> = {
  low: "ArrowDown",
  medium: "Minus",
  high: "ArrowUp",
  urgent: "AlertTriangle",
};

export const PRIORITY_DESCRIPTIONS: Record<Priority, string> = {
  low: "Ưu tiên thấp, xử lý khi có thời gian",
  medium: "Ưu tiên trung bình, xử lý trong tuần",
  high: "Ưu tiên cao, cần xử lý sớm",
  urgent: "Khẩn cấp, cần xử lý ngay lập tức",
};

/** Priority numerical values for sorting */
export const PRIORITY_VALUES: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

/** Priority sorting weight (higher = more important) */
export const PRIORITY_WEIGHTS: Record<Priority, number> = {
  low: 10,
  medium: 50,
  high: 100,
  urgent: 200,
};

/* ============================================================
 * Priority Badge Variants (Tailwind CSS)
 * ============================================================ */

export const PRIORITY_BADGE_VARIANTS: Record<
  Priority,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  low: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-300",
  },
  medium: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  high: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
  },
  urgent: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
};

/* ============================================================
 * SLA (Service Level Agreement) Timeframes
 * Response times based on priority (in hours)
 * ============================================================ */

export const PRIORITY_SLA_RESPONSE_TIMES: Record<Priority, number> = {
  low: 48, // 2 days
  medium: 24, // 1 day
  high: 8, // 8 hours
  urgent: 2, // 2 hours
};

/** Resolution times based on priority (in hours) */
export const PRIORITY_SLA_RESOLUTION_TIMES: Record<Priority, number> = {
  low: 120, // 5 days
  medium: 72, // 3 days
  high: 24, // 1 day
  urgent: 8, // 8 hours
};

/* ============================================================
 * Priority Escalation Rules
 * ============================================================ */

/** Auto-escalate priority after X hours without response */
export const PRIORITY_ESCALATION_HOURS: Record<Priority, number | null> = {
  low: 72, // Escalate to medium after 3 days
  medium: 48, // Escalate to high after 2 days
  high: 24, // Escalate to urgent after 1 day
  urgent: null, // Already at max priority
};

/** Next priority level for escalation */
export const PRIORITY_ESCALATION_NEXT: Record<Priority, Priority | null> = {
  low: "medium",
  medium: "high",
  high: "urgent",
  urgent: null,
};

/* ============================================================
 * Utility Functions
 * ============================================================ */

/** Get priority label */
export function getPriorityLabel(priority: Priority): string {
  return PRIORITY_LABELS[priority];
}

/** Get priority color */
export function getPriorityColor(priority: Priority): string {
  return PRIORITY_COLORS[priority];
}

/** Get priority icon */
export function getPriorityIcon(priority: Priority): string {
  return PRIORITY_ICONS[priority];
}

/** Get priority value for sorting */
export function getPriorityValue(priority: Priority): number {
  return PRIORITY_VALUES[priority];
}

/** Compare two priorities (for sorting) */
export function comparePriorities(a: Priority, b: Priority): number {
  return PRIORITY_VALUES[b] - PRIORITY_VALUES[a]; // Descending (urgent first)
}

/** Check if priority should be escalated */
export function shouldEscalatePriority(
  priority: Priority,
  hoursSinceCreated: number
): boolean {
  const escalationHours = PRIORITY_ESCALATION_HOURS[priority];
  return escalationHours !== null && hoursSinceCreated >= escalationHours;
}

/** Get next priority level */
export function getNextPriority(priority: Priority): Priority | null {
  return PRIORITY_ESCALATION_NEXT[priority];
}

/** Check if priority is urgent or high */
export function isHighPriority(priority: Priority): boolean {
  return priority === "urgent" || priority === "high";
}

/** Check if priority is low or medium */
export function isLowPriority(priority: Priority): boolean {
  return priority === "low" || priority === "medium";
}

/** Get SLA response time in hours */
export function getSlaResponseTime(priority: Priority): number {
  return PRIORITY_SLA_RESPONSE_TIMES[priority];
}

/** Get SLA resolution time in hours */
export function getSlaResolutionTime(priority: Priority): number {
  return PRIORITY_SLA_RESOLUTION_TIMES[priority];
}

/** Calculate SLA deadline timestamp */
export function calculateSlaDeadline(
  priority: Priority,
  createdAt: Date,
  type: "response" | "resolution" = "response"
): Date {
  const hours =
    type === "response"
      ? PRIORITY_SLA_RESPONSE_TIMES[priority]
      : PRIORITY_SLA_RESOLUTION_TIMES[priority];

  const deadline = new Date(createdAt);
  deadline.setHours(deadline.getHours() + hours);
  return deadline;
}

/** Check if SLA is breached */
export function isSlaBreached(deadline: Date, now: Date = new Date()): boolean {
  return now > deadline;
}

/** Calculate SLA breach percentage */
export function getSlaBreachPercentage(deadline: Date, createdAt: Date, now: Date = new Date()): number {
  const totalTime = deadline.getTime() - createdAt.getTime();
  const elapsedTime = now.getTime() - createdAt.getTime();
  return Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
}
