/* ============================================================
 * ValidationDisplay Component
 * Display validation errors with various styles
 * ============================================================ */

import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { FieldError } from "react-hook-form";

/* ============================================================
 * Types
 * ============================================================ */

export type ValidationSeverity = "error" | "warning" | "info" | "success";

export interface ValidationMessage {
  field?: string;
  message: string;
  severity?: ValidationSeverity;
}

export interface ValidationDisplayProps {
  error?: string | FieldError | ValidationMessage;
  errors?: Array<string | ValidationMessage>;
  severity?: ValidationSeverity;
  variant?: "inline" | "block" | "toast";
  showIcon?: boolean;
  className?: string;
}

/* ============================================================
 * Severity Config
 * ============================================================ */

const SEVERITY_CONFIG = {
  error: {
    icon: AlertCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  success: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
  },
} as const;

/* ============================================================
 * Utility Functions
 * ============================================================ */

function normalizeError(
  error: string | FieldError | ValidationMessage
): ValidationMessage {
  if (typeof error === "string") {
    return { message: error, severity: "error" };
  }

  if ("message" in error && typeof error.message === "string") {
    if ("severity" in error) {
      return error as ValidationMessage;
    }
    return { message: error.message, severity: "error" };
  }

  return { message: "Invalid input", severity: "error" };
}

/* ============================================================
 * Inline Variant
 * ============================================================ */

function InlineValidation({
  message,
  severity = "error",
  showIcon = true,
  className,
}: {
  message: string;
  severity: ValidationSeverity;
  showIcon: boolean;
  className?: string;
}) {
  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-start gap-2 text-sm", config.color, className)}>
      {showIcon && <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

/* ============================================================
 * Block Variant
 * ============================================================ */

function BlockValidation({
  messages,
  severity = "error",
  showIcon = true,
  className,
}: {
  messages: ValidationMessage[];
  severity: ValidationSeverity;
  showIcon: boolean;
  className?: string;
}) {
  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;

  if (messages.length === 0) return null;

  return (
    <Alert
      className={cn(
        config.bgColor,
        config.borderColor,
        "border",
        className
      )}
    >
      {showIcon && <Icon className={cn("w-4 h-4", config.color)} />}
      {messages.length === 1 ? (
        <AlertDescription className={config.color}>
          {messages[0].field && (
            <span className="font-medium">{messages[0].field}: </span>
          )}
          {messages[0].message}
        </AlertDescription>
      ) : (
        <>
          <AlertTitle className={config.color}>
            {messages.length} validation {messages.length === 1 ? "error" : "errors"}
          </AlertTitle>
          <AlertDescription className={config.color}>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {messages.map((msg, idx) => (
                <li key={idx}>
                  {msg.field && (
                    <span className="font-medium">{msg.field}: </span>
                  )}
                  {msg.message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </>
      )}
    </Alert>
  );
}

/* ============================================================
 * ValidationDisplay Component
 * ============================================================ */

export function ValidationDisplay({
  error,
  errors,
  severity = "error",
  variant = "inline",
  showIcon = true,
  className,
}: ValidationDisplayProps) {
  // Process single error
  if (error) {
    const normalized = normalizeError(error);
    const finalSeverity = normalized.severity || severity;

    if (variant === "inline") {
      return (
        <InlineValidation
          message={normalized.message}
          severity={finalSeverity}
          showIcon={showIcon}
          className={className}
        />
      );
    }

    return (
      <BlockValidation
        messages={[normalized]}
        severity={finalSeverity}
        showIcon={showIcon}
        className={className}
      />
    );
  }

  // Process multiple errors
  if (errors && errors.length > 0) {
    const normalized = errors.map(normalizeError);

    if (variant === "inline") {
      return (
        <div className={cn("space-y-2", className)}>
          {normalized.map((msg, idx) => (
            <InlineValidation
              key={idx}
              message={msg.message}
              severity={msg.severity || severity}
              showIcon={showIcon}
            />
          ))}
        </div>
      );
    }

    return (
      <BlockValidation
        messages={normalized}
        severity={severity}
        showIcon={showIcon}
        className={className}
      />
    );
  }

  return null;
}

/* ============================================================
 * Field Error Display
 * ============================================================ */

export interface FieldErrorDisplayProps {
  error?: FieldError;
  className?: string;
}

export function FieldErrorDisplay({ error, className }: FieldErrorDisplayProps) {
  if (!error?.message) return null;

  return (
    <ValidationDisplay
      error={error.message}
      severity="error"
      variant="inline"
      showIcon={true}
      className={className}
    />
  );
}

/* ============================================================
 * Form Errors Summary
 * ============================================================ */

export interface FormErrorsSummaryProps {
  errors: Record<string, FieldError | undefined>;
  title?: string;
  className?: string;
}

export function FormErrorsSummary({
  errors,
  title = "Please fix the following errors:",
  className,
}: FormErrorsSummaryProps) {
  const errorMessages = Object.entries(errors)
    .filter(([, error]) => error?.message)
    .map(([field, error]) => ({
      field,
      message: error!.message as string,
      severity: "error" as ValidationSeverity,
    }));

  if (errorMessages.length === 0) return null;

  return (
    <div className={className}>
      {title && (
        <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
          {title}
        </h4>
      )}
      <ValidationDisplay
        errors={errorMessages}
        variant="block"
        severity="error"
      />
    </div>
  );
}
