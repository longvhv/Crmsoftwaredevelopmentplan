import * as React from "react";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "./utils";
import { Card, CardContent, CardHeader, CardTitle } from "./enhanced-card";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: LucideIcon;
  loading?: boolean;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  className?: string;
}

/* ============================================================
 * STYLES
 * ============================================================ */

const variantStyles = {
  default: "border-border",
  primary: "border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5",
  success: "border-[var(--success)]/20 bg-[var(--success)]/5",
  warning: "border-[var(--warning)]/20 bg-[var(--warning)]/5",
  error: "border-[var(--error)]/20 bg-[var(--error)]/5",
};

const iconColorStyles = {
  default: "text-muted-foreground bg-accent",
  primary: "text-[var(--brand-primary)] bg-[var(--brand-primary)]/10",
  success: "text-[var(--success)] bg-[var(--success)]/10",
  warning: "text-[var(--warning)] bg-[var(--warning)]/10",
  error: "text-[var(--error)] bg-[var(--error)]/10",
};

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      description,
      trend,
      trendValue,
      icon: Icon,
      loading = false,
      variant = "default",
      className,
    },
    ref
  ) => {
    const getTrendIcon = () => {
      switch (trend) {
        case "up":
          return <TrendingUp className="size-4" />;
        case "down":
          return <TrendingDown className="size-4" />;
        case "neutral":
          return <Minus className="size-4" />;
        default:
          return null;
      }
    };

    const getTrendColor = () => {
      switch (trend) {
        case "up":
          return "text-[var(--success)]";
        case "down":
          return "text-[var(--error)]";
        case "neutral":
          return "text-muted-foreground";
        default:
          return "";
      }
    };

    return (
      <Card
        ref={ref}
        variant="bordered"
        hoverable
        loading={loading}
        className={cn(variantStyles[variant], className)}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
            </div>
            {Icon && (
              <div className={cn(
                "shrink-0 p-2 rounded-lg",
                iconColorStyles[variant]
              )}>
                <Icon className="size-5" />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {/* Value */}
            <div className="text-3xl font-bold tracking-tight">
              {value}
            </div>

            {/* Trend & Description */}
            {(trend || description) && (
              <div className="flex items-center gap-2 text-sm">
                {trend && trendValue && (
                  <div className={cn("flex items-center gap-1 font-medium", getTrendColor())}>
                    {getTrendIcon()}
                    <span>{trendValue}</span>
                  </div>
                )}
                {description && (
                  <span className="text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";
