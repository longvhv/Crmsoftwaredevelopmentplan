import * as React from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "./utils";

/* ============================================================
 * PROGRESS BAR
 * ============================================================ */

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "success" | "error" | "warning" | "info";
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  label,
  animated = false,
  striped = false,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const variantClasses = {
    default: "bg-[var(--brand-primary)]",
    success: "bg-[var(--success)]",
    error: "bg-[var(--error)]",
    warning: "bg-[var(--warning)]",
    info: "bg-blue-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-accent rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            variantClasses[variant],
            striped &&
              "bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]",
            animated && striped && "animate-[shimmer_1.5s_linear_infinite]"
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = "ProgressBar";

/* ============================================================
 * CIRCULAR PROGRESS
 * ============================================================ */

export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "success" | "error" | "warning" | "info";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = "default",
  showLabel = true,
  label,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: "stroke-[var(--brand-primary)]",
    success: "stroke-[var(--success)]",
    error: "stroke-[var(--error)]",
    warning: "stroke-[var(--warning)]",
    info: "stroke-blue-500",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-accent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={cn("transition-all duration-300 ease-out", variantColors[variant])}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(percentage)}%</span>
          {label && <span className="text-xs text-muted-foreground mt-1">{label}</span>}
        </div>
      )}
    </div>
  );
};

CircularProgress.displayName = "CircularProgress";

/* ============================================================
 * STEP PROGRESS
 * ============================================================ */

export interface Step {
  label: string;
  description?: string;
  status?: "pending" | "current" | "completed" | "error";
}

export interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
  showDescription?: boolean;
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  orientation = "horizontal",
  showDescription = true,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row items-start" : "flex-col",
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;
        const status = step.status || (isCompleted ? "completed" : isCurrent ? "current" : "pending");
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            <div
              className={cn(
                "flex",
                orientation === "horizontal" ? "flex-col items-center" : "flex-row items-start",
                orientation === "horizontal" && "flex-1"
              )}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex items-center justify-center size-8 rounded-full border-2 transition-all",
                    status === "completed" &&
                      "bg-[var(--success)] border-[var(--success)] text-white",
                    status === "current" &&
                      "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white",
                    status === "pending" && "bg-card border-border text-muted-foreground",
                    status === "error" && "bg-[var(--error)] border-[var(--error)] text-white"
                  )}
                >
                  {status === "completed" ? (
                    <CheckCircle className="size-5" />
                  ) : status === "error" ? (
                    "✕"
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step content (vertical only) */}
                {orientation === "vertical" && (
                  <div className="flex-1 min-w-0 pb-8">
                    <div
                      className={cn(
                        "font-medium text-sm",
                        status === "current" && "text-[var(--brand-primary)]",
                        status === "pending" && "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </div>
                    {showDescription && step.description && (
                      <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Step content (horizontal only) */}
              {orientation === "horizontal" && (
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "font-medium text-sm",
                      status === "current" && "text-[var(--brand-primary)]",
                      status === "pending" && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </div>
                  {showDescription && step.description && (
                    <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                  )}
                </div>
              )}
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={cn(
                  "transition-all",
                  orientation === "horizontal"
                    ? "flex-1 h-0.5 mt-4 mx-2"
                    : "w-0.5 h-8 ml-4 -mt-8",
                  isCompleted ? "bg-[var(--success)]" : "bg-accent"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

StepProgress.displayName = "StepProgress";

/* ============================================================
 * LOADING INDICATORS
 * ============================================================ */

export interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "success" | "error" | "warning";
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "default",
  label,
  className,
}) => {
  const sizeClasses = {
    xs: "size-3",
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
    xl: "size-12",
  };

  const variantClasses = {
    default: "text-muted-foreground",
    primary: "text-[var(--brand-primary)]",
    success: "text-[var(--success)]",
    error: "text-[var(--error)]",
    warning: "text-[var(--warning)]",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size], variantClasses[variant])} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
};

LoadingSpinner.displayName = "LoadingSpinner";

/* ============================================================
 * SKELETON LOADER
 * ============================================================ */

export interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  width,
  height,
  className,
}) => {
  const variantClasses = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded",
  };

  return (
    <div
      className={cn(
        "bg-accent animate-pulse",
        variantClasses[variant],
        className
      )}
      style={{
        width: width || (variant === "circular" ? height : "100%"),
        height: height || (variant === "text" ? undefined : "auto"),
      }}
    />
  );
};

Skeleton.displayName = "Skeleton";

/* ============================================================
 * LEGACY EXPORTS (for backward compatibility)
 * ============================================================ */

// Alias for backward compatibility with old imports
export const Progress = ProgressBar;
export const LinearProgress = ProgressBar;