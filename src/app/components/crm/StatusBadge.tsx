/* ============================================================
 * StatusBadge Component
 * Status badges với màu sắc và icon
 * ============================================================ */

import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Circle,
  Ban,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

/* ============================================================
 * Types
 * ============================================================ */

export interface StatusBadgeProps {
  status: string;
  variant?:
    | "default"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "neutral"
    | "primary";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon | false;
  className?: string;
  dot?: boolean;
}

/* ============================================================
 * Variant Styles
 * ============================================================ */

const VARIANT_STYLES = {
  default: "bg-gray-100 text-gray-800 border-gray-200",
  success: "bg-green-100 text-green-800 border-green-200",
  error: "bg-red-100 text-red-800 border-red-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
  primary: "bg-primary/10 text-primary border-primary/20",
};

const VARIANT_DOT_STYLES = {
  default: "bg-gray-500",
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
  neutral: "bg-gray-400",
  primary: "bg-primary",
};

const SIZE_STYLES = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

const ICON_SIZE_STYLES = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const DOT_SIZE_STYLES = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
};

/* ============================================================
 * StatusBadge Component
 * ============================================================ */

export function StatusBadge({
  status,
  variant = "default",
  size = "md",
  icon,
  className = "",
  dot = false,
}: StatusBadgeProps) {
  const Icon = icon === false ? null : icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
    >
      {dot && (
        <span
          className={`rounded-full ${VARIANT_DOT_STYLES[variant]} ${DOT_SIZE_STYLES[size]}`}
        />
      )}
      {Icon && <Icon className={ICON_SIZE_STYLES[size]} />}
      <span>{status}</span>
    </span>
  );
}

/* ============================================================
 * Preset Status Badges
 * ============================================================ */

/** Active status */
export function ActiveBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <StatusBadge
      status="Hoạt động"
      variant="success"
      icon={CheckCircle2}
      size={size}
    />
  );
}

/** Inactive status */
export function InactiveBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <StatusBadge
      status="Không hoạt động"
      variant="neutral"
      icon={Circle}
      size={size}
    />
  );
}

/** Pending status */
export function PendingBadge({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <StatusBadge
      status="Chờ xử lý"
      variant="warning"
      icon={Clock}
      size={size}
    />
  );
}

/** Cancelled status */
export function CancelledBadge({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  return (
    <StatusBadge
      status="Đã hủy"
      variant="error"
      icon={XCircle}
      size={size}
    />
  );
}

/** Completed status */
export function CompletedBadge({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  return (
    <StatusBadge
      status="Hoàn thành"
      variant="success"
      icon={CheckCircle2}
      size={size}
    />
  );
}

/* ============================================================
 * Lead Status Badges
 * ============================================================ */

export interface LeadStatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export function LeadStatusBadge({ status, size = "md" }: LeadStatusBadgeProps) {
  const statusMap: Record<
    string,
    { variant: StatusBadgeProps["variant"]; icon?: LucideIcon }
  > = {
    new: { variant: "info", icon: Zap },
    contacted: { variant: "primary", icon: Clock },
    qualified: { variant: "success", icon: CheckCircle2 },
    unqualified: { variant: "error", icon: XCircle },
    lost: { variant: "neutral", icon: Minus },
  };

  const config = statusMap[status.toLowerCase()] || {
    variant: "default" as const,
  };

  return (
    <StatusBadge
      status={status}
      variant={config.variant}
      icon={config.icon}
      size={size}
    />
  );
}

/* ============================================================
 * Deal Status Badges
 * ============================================================ */

export interface DealStatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export function DealStatusBadge({ status, size = "md" }: DealStatusBadgeProps) {
  const statusMap: Record<
    string,
    { variant: StatusBadgeProps["variant"]; icon?: LucideIcon }
  > = {
    draft: { variant: "neutral", icon: Circle },
    open: { variant: "info", icon: TrendingUp },
    won: { variant: "success", icon: CheckCircle2 },
    lost: { variant: "error", icon: TrendingDown },
    cancelled: { variant: "neutral", icon: Ban },
  };

  const config = statusMap[status.toLowerCase()] || {
    variant: "default" as const,
  };

  return (
    <StatusBadge
      status={status}
      variant={config.variant}
      icon={config.icon}
      size={size}
    />
  );
}

/* ============================================================
 * Priority Badges
 * ============================================================ */

export interface PriorityBadgeProps {
  priority: string;
  size?: "sm" | "md" | "lg";
}

export function PriorityBadge({ priority, size = "md" }: PriorityBadgeProps) {
  const priorityMap: Record<
    string,
    { variant: StatusBadgeProps["variant"]; icon?: LucideIcon }
  > = {
    low: { variant: "info", icon: TrendingDown },
    medium: { variant: "warning", icon: Minus },
    high: { variant: "error", icon: TrendingUp },
    urgent: { variant: "error", icon: AlertCircle },
  };

  const config = priorityMap[priority.toLowerCase()] || {
    variant: "default" as const,
  };

  return (
    <StatusBadge
      status={priority}
      variant={config.variant}
      icon={config.icon}
      size={size}
    />
  );
}

/* ============================================================
 * Contact Type Badges
 * ============================================================ */

export interface ContactTypeBadgeProps {
  type: string;
  size?: "sm" | "md" | "lg";
}

export function ContactTypeBadge({ type, size = "md" }: ContactTypeBadgeProps) {
  const typeMap: Record<
    string,
    { variant: StatusBadgeProps["variant"]; label?: string }
  > = {
    customer: { variant: "success", label: "Khách hàng" },
    partner: { variant: "primary", label: "Đối tác" },
    lead: { variant: "info", label: "Tiềm năng" },
    prospect: { variant: "warning", label: "Triển vọng" },
    other: { variant: "neutral", label: "Khác" },
  };

  const config = typeMap[type.toLowerCase()] || {
    variant: "default" as const,
    label: type,
  };

  return (
    <StatusBadge
      status={config.label || type}
      variant={config.variant}
      size={size}
      dot
    />
  );
}

/* ============================================================
 * Score Badge (Lead Score, Health Score, etc.)
 * ============================================================ */

export interface ScoreBadgeProps {
  score: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ScoreBadge({
  score,
  max = 100,
  size = "md",
  showLabel = true,
}: ScoreBadgeProps) {
  const percentage = (score / max) * 100;

  let variant: StatusBadgeProps["variant"] = "neutral";
  if (percentage >= 80) {
    variant = "success";
  } else if (percentage >= 60) {
    variant = "primary";
  } else if (percentage >= 40) {
    variant = "warning";
  } else {
    variant = "error";
  }

  return (
    <StatusBadge
      status={showLabel ? `${score}/${max}` : String(score)}
      variant={variant}
      size={size}
      icon={false}
    />
  );
}

/* ============================================================
 * Count Badge
 * ============================================================ */

export interface CountBadgeProps {
  count: number;
  label?: string;
  variant?: StatusBadgeProps["variant"];
  size?: "sm" | "md" | "lg";
}

export function CountBadge({
  count,
  label,
  variant = "default",
  size = "sm",
}: CountBadgeProps) {
  return (
    <StatusBadge
      status={label ? `${count} ${label}` : String(count)}
      variant={variant}
      size={size}
      icon={false}
    />
  );
}
