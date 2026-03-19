import * as React from "react";
import { cn } from "./utils";
import { Check, Circle } from "lucide-react";

/* ============================================================
 * STEPPER - Multi-step progress indicator
 * ============================================================
 * Step 99: Stepper component for multi-step workflows
 */

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "circles" | "dots" | "numbers";
  onStepClick?: (step: number) => void;
  allowClickPreviousSteps?: boolean;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  orientation = "horizontal",
  variant = "default",
  onStepClick,
  allowClickPreviousSteps = true,
  className,
}: StepperProps) {
  const handleStepClick = (index: number) => {
    if (allowClickPreviousSteps && index < currentStep && onStepClick) {
      onStepClick(index);
    }
  };

  if (variant === "circles") {
    return (
      <CircleStepper
        steps={steps}
        currentStep={currentStep}
        orientation={orientation}
        onStepClick={handleStepClick}
        allowClickPreviousSteps={allowClickPreviousSteps}
        className={className}
      />
    );
  }

  if (variant === "dots") {
    return (
      <DotStepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        className={className}
      />
    );
  }

  if (variant === "numbers") {
    return (
      <NumberStepper
        steps={steps}
        currentStep={currentStep}
        orientation={orientation}
        onStepClick={handleStepClick}
        allowClickPreviousSteps={allowClickPreviousSteps}
        className={className}
      />
    );
  }

  // Default stepper
  return (
    <DefaultStepper
      steps={steps}
      currentStep={currentStep}
      orientation={orientation}
      onStepClick={handleStepClick}
      allowClickPreviousSteps={allowClickPreviousSteps}
      className={className}
    />
  );
}

/* ============================================================
 * DEFAULT STEPPER
 * ============================================================ */

interface StepperVariantProps {
  steps: StepItem[];
  currentStep: number;
  orientation: "horizontal" | "vertical";
  onStepClick?: (index: number) => void;
  allowClickPreviousSteps?: boolean;
  className?: string;
}

function DefaultStepper({
  steps,
  currentStep,
  orientation,
  onStepClick,
  allowClickPreviousSteps,
  className,
}: StepperVariantProps) {
  return (
    <div
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row items-start" : "flex-col",
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = allowClickPreviousSteps && isCompleted;

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                "flex",
                orientation === "horizontal" ? "flex-col items-center" : "flex-row gap-4",
                "flex-1"
              )}
            >
              {/* Step Circle */}
              <button
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center justify-center rounded-full transition-all",
                  "w-10 h-10 font-semibold",
                  isCompleted && "bg-primary text-primary-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isActive && "bg-muted text-muted-foreground",
                  isClickable && "cursor-pointer hover:scale-110"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </button>

              {/* Step Content */}
              <div
                className={cn(
                  "flex flex-col",
                  orientation === "horizontal" ? "items-center text-center mt-2" : "flex-1"
                )}
              >
                <div
                  className={cn(
                    "font-medium",
                    isActive && "text-primary",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}
                >
                  {step.label}
                  {step.optional && (
                    <span className="ml-1 text-xs text-muted-foreground">(Optional)</span>
                  )}
                </div>
                {step.description && (
                  <div className="text-sm text-muted-foreground mt-1">{step.description}</div>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "transition-colors",
                  orientation === "horizontal"
                    ? "h-0.5 w-full mt-5 mx-2"
                    : "w-0.5 h-12 ml-5 my-2",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ============================================================
 * CIRCLE STEPPER
 * ============================================================ */

function CircleStepper({
  steps,
  currentStep,
  orientation,
  onStepClick,
  allowClickPreviousSteps,
  className,
}: StepperVariantProps) {
  return (
    <div
      className={cn(
        "flex gap-4",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = allowClickPreviousSteps && isCompleted;

        return (
          <button
            key={step.id}
            onClick={() => isClickable && onStepClick?.(index)}
            disabled={!isClickable}
            className={cn(
              "flex items-center gap-3 rounded-lg p-3 transition-all",
              "border-2",
              isActive && "border-primary bg-primary/5",
              isCompleted && "border-primary/50",
              !isActive && !isCompleted && "border-muted",
              isClickable && "cursor-pointer hover:border-primary"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                "w-8 h-8 font-semibold",
                isCompleted && "bg-primary text-primary-foreground",
                isActive && "bg-primary text-primary-foreground",
                !isCompleted && !isActive && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <div className="text-left">
              <div className={cn("font-medium", isActive && "text-primary")}>
                {step.label}
              </div>
              {step.description && (
                <div className="text-xs text-muted-foreground">{step.description}</div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
 * DOT STEPPER
 * ============================================================ */

interface DotStepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

function DotStepper({ steps, currentStep, onStepClick, className }: DotStepperProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <button
            key={step.id}
            onClick={() => onStepClick?.(index)}
            className={cn(
              "rounded-full transition-all",
              isActive && "w-8 h-2 bg-primary",
              isCompleted && "w-2 h-2 bg-primary",
              !isActive && !isCompleted && "w-2 h-2 bg-muted",
              "hover:scale-125"
            )}
            aria-label={step.label}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
 * NUMBER STEPPER
 * ============================================================ */

function NumberStepper({
  steps,
  currentStep,
  orientation,
  onStepClick,
  allowClickPreviousSteps,
  className,
}: StepperVariantProps) {
  return (
    <div
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row divide-x" : "flex-col divide-y",
        "border rounded-lg overflow-hidden",
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = allowClickPreviousSteps && isCompleted;

        return (
          <button
            key={step.id}
            onClick={() => isClickable && onStepClick?.(index)}
            disabled={!isClickable}
            className={cn(
              "flex items-center gap-3 p-4 flex-1 transition-colors",
              isActive && "bg-primary/5",
              isClickable && "cursor-pointer hover:bg-muted"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                "w-6 h-6 text-sm font-semibold",
                isCompleted && "bg-primary text-primary-foreground",
                isActive && "bg-primary text-primary-foreground",
                !isCompleted && !isActive && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
            </div>
            <div className="text-left flex-1">
              <div className={cn("font-medium text-sm", isActive && "text-primary")}>
                {step.label}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
