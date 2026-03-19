import * as React from "react";
import { DollarSign, Calendar, User, Clock, TrendingUp } from "lucide-react";
import { cn } from "./utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./enhanced-card";
import { Badge } from "./badge";
import { Avatar } from "./avatar";
import { Progress } from "./progress";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface DealCardProps {
  title: string;
  value: number;
  currency?: string;
  stage: string;
  probability?: number;
  priority?: "high" | "medium" | "low";
  closeDate?: Date;
  owner?: {
    name: string;
    avatar?: string;
  };
  company?: string;
  daysInStage?: number;
  actions?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

/* ============================================================
 * STYLES
 * ============================================================ */

const priorityColors = {
  high: "bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20",
  medium: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const priorityDotColors = {
  high: "bg-[var(--error)]",
  medium: "bg-[var(--warning)]",
  low: "bg-blue-500",
};

/* ============================================================
 * HELPERS
 * ============================================================ */

const formatCurrency = (value: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)}d overdue`;
  } else if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays <= 7) {
    return `${diffDays}d`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const DealCard = React.forwardRef<HTMLDivElement, DealCardProps>(
  (
    {
      title,
      value,
      currency = "USD",
      stage,
      probability,
      priority,
      closeDate,
      owner,
      company,
      daysInStage,
      actions,
      loading = false,
      onClick,
      className,
    },
    ref
  ) => {
    const isOverdue = closeDate && closeDate < new Date();

    return (
      <Card
        ref={ref}
        variant={onClick ? "interactive" : "bordered"}
        loading={loading}
        onClick={onClick}
        className={cn(
          "transition-all duration-200",
          onClick && "hover:scale-[1.02]",
          className
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight line-clamp-2">
              {title}
            </CardTitle>
            {actions}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* Value */}
            <div className="flex items-baseline gap-2">
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-4 text-muted-foreground" />
                <span className="text-2xl font-bold">
                  {formatCurrency(value, currency)}
                </span>
              </div>
            </div>

            {/* Stage Badge */}
            <div>
              <Badge variant="default" size="sm">
                {stage}
              </Badge>
            </div>

            {/* Probability */}
            {probability !== undefined && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Probability</span>
                  <span className="font-medium">{probability}%</span>
                </div>
                <Progress value={probability} size="sm" />
              </div>
            )}

            {/* Details Grid */}
            <div className="space-y-2 pt-2">
              {/* Priority */}
              {priority && (
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
                    priorityColors[priority]
                  )}>
                    <div className={cn("size-1.5 rounded-full", priorityDotColors[priority])} />
                    <span className="capitalize">{priority}</span>
                  </div>
                </div>
              )}

              {/* Company */}
              {company && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate">{company}</span>
                </div>
              )}

              {/* Close Date */}
              {closeDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className={cn(
                    isOverdue && "text-[var(--error)] font-medium"
                  )}>
                    {formatDate(closeDate)}
                  </span>
                </div>
              )}

              {/* Days in Stage */}
              {daysInStage !== undefined && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-3.5 shrink-0" />
                  <span>{daysInStage}d in stage</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Owner */}
        {owner && (
          <CardFooter>
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                {owner.avatar ? (
                  <img src={owner.avatar} alt={owner.name} className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center bg-[var(--brand-primary)] text-white text-xs font-medium">
                    {owner.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">
                {owner.name}
              </span>
            </div>
          </CardFooter>
        )}
      </Card>
    );
  }
);

DealCard.displayName = "DealCard";
