/* ============================================================
 * Form Field Component
 * Reusable form field with label, error display, and validation
 * ============================================================ */

import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { FieldError } from "react-hook-form";

/* ============================================================
 * Base Field Props
 * ============================================================ */

interface BaseFieldProps {
  label?: string;
  description?: string;
  error?: FieldError;
  required?: boolean;
  className?: string;
}

/* ============================================================
 * Text Field
 * ============================================================ */

export interface TextFieldProps
  extends BaseFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: "text" | "email" | "tel" | "url" | "password" | "number";
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, description, error, required, className, ...props }, ref) => {
    const id = props.id || props.name;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={id} className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(error && "border-red-500")}
          {...props}
        />
        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-500">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

/* ============================================================
 * Textarea Field
 * ============================================================ */

export interface TextareaFieldProps
  extends BaseFieldProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(({ label, description, error, required, className, rows = 4, ...props }, ref) => {
  const id = props.id || props.name;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(error && "border-red-500")}
        {...props}
      />
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
});

TextareaField.displayName = "TextareaField";

/* ============================================================
 * Select Field
 * ============================================================ */

export interface SelectFieldProps extends BaseFieldProps {
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      label,
      description,
      error,
      required,
      className,
      options,
      placeholder,
      value,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const id = props.id || (props as { name?: string }).name;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={id} className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger
            ref={ref}
            id={id}
            aria-invalid={!!error}
            className={cn(error && "border-red-500")}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-500">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

/* ============================================================
 * Checkbox Field
 * ============================================================ */

export interface CheckboxFieldProps extends BaseFieldProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const CheckboxField = forwardRef<HTMLButtonElement, CheckboxFieldProps>(
  (
    {
      label,
      description,
      error,
      required,
      className,
      checked,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const id = props.id || (props as { name?: string }).name;

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center space-x-2">
          <Checkbox
            ref={ref}
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-invalid={!!error}
          />
          {label && (
            <Label
              htmlFor={id}
              className="flex items-center gap-1 cursor-pointer"
            >
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
          )}
        </div>
        {description && !error && (
          <p className="text-sm text-muted-foreground pl-6">{description}</p>
        )}
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-500 pl-6">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

CheckboxField.displayName = "CheckboxField";

/* ============================================================
 * Form Row (for inline fields)
 * ============================================================ */

export interface FormRowProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FormRow({ children, columns = 2, className }: FormRowProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        {
          "grid-cols-1": columns === 1,
          "grid-cols-1 md:grid-cols-2": columns === 2,
          "grid-cols-1 md:grid-cols-3": columns === 3,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": columns === 4,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

/* ============================================================
 * Form Section
 * ============================================================ */

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ============================================================
 * Form Actions
 * ============================================================ */

export interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  canSubmit?: boolean;
  showCancel?: boolean;
  className?: string;
}

export function FormActions({
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onCancel,
  isSubmitting = false,
  canSubmit = true,
  showCancel = true,
  className,
}: FormActionsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="submit"
        disabled={isSubmitting || !canSubmit}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </button>
      {showCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-input rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelLabel}
        </button>
      )}
    </div>
  );
}
