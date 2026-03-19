/* ============================================================
 * Form Types
 * Type definitions for form state and validation
 * ============================================================ */

import type { FieldError, UseFormReturn } from "react-hook-form";

/* ============================================================
 * Form State Types
 * ============================================================ */

/** Form mode - create or edit */
export type FormMode = "create" | "edit";

/** Form submission state */
export type FormSubmitState = "idle" | "submitting" | "success" | "error";

/** Form validation state */
export interface FormValidationState {
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isSubmitted: boolean;
  errors: Record<string, FieldError | undefined>;
}

/** Base form config */
export interface BaseFormConfig<T = unknown> {
  mode: FormMode;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  resetOnSuccess?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/** Form context value */
export interface FormContextValue<T = unknown> {
  form: UseFormReturn<T>;
  mode: FormMode;
  submitState: FormSubmitState;
  isSubmitting: boolean;
  canSubmit: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
  handleCancel: () => void;
}

/* ============================================================
 * Field Types
 * ============================================================ */

/** Field type discriminator */
export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "password"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "date"
  | "datetime"
  | "time"
  | "file"
  | "switch"
  | "slider"
  | "color"
  | "combobox"
  | "custom";

/** Base field props */
export interface BaseFieldProps<T = unknown> {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: FieldError;
  value?: T;
  onChange?: (value: T) => void;
  onBlur?: () => void;
}

/** Text field props */
export interface TextFieldProps extends BaseFieldProps<string> {
  type?: "text" | "email" | "tel" | "url" | "password";
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
}

/** Number field props */
export interface NumberFieldProps extends BaseFieldProps<number> {
  min?: number;
  max?: number;
  step?: number;
}

/** Textarea field props */
export interface TextareaFieldProps extends BaseFieldProps<string> {
  rows?: number;
  maxLength?: number;
  autoResize?: boolean;
}

/** Select field option */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/** Select field props */
export interface SelectFieldProps<T = string> extends BaseFieldProps<T> {
  options: SelectOption<T>[];
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
}

/** Checkbox field props */
export interface CheckboxFieldProps extends BaseFieldProps<boolean> {
  label: string;
}

/** Radio group props */
export interface RadioGroupProps<T = string> extends BaseFieldProps<T> {
  options: SelectOption<T>[];
  orientation?: "horizontal" | "vertical";
}

/** Date field props */
export interface DateFieldProps extends BaseFieldProps<Date | string> {
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  showTime?: boolean;
}

/** File field props */
export interface FileFieldProps extends BaseFieldProps<File | File[]> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
}

/** Combobox field props */
export interface ComboboxFieldProps<T = string> extends BaseFieldProps<T> {
  options: SelectOption<T>[];
  searchable?: boolean;
  creatable?: boolean;
  onCreateOption?: (value: string) => Promise<SelectOption<T>>;
}

/* ============================================================
 * Validation Types
 * ============================================================ */

/** Validation rule */
export interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean | string | Promise<boolean | string>;
  message?: string;
}

/** Common validation rules */
export interface CommonValidationRules {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  custom?: ValidationRule[];
}

/** Field validation config */
export interface FieldValidationConfig extends CommonValidationRules {
  deps?: string[];
}

/* ============================================================
 * Form Section Types
 * ============================================================ */

/** Form section */
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: string[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

/** Form tab */
export interface FormTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  sections: FormSection[];
}

/** Form layout config */
export interface FormLayoutConfig {
  sections?: FormSection[];
  tabs?: FormTab[];
  columns?: 1 | 2 | 3;
}

/* ============================================================
 * Error Types
 * ============================================================ */

/** Form error */
export interface FormError {
  field?: string;
  message: string;
  type?: string;
}

/** Validation error response */
export interface ValidationErrorResponse {
  errors: FormError[];
  message?: string;
}

/* ============================================================
 * Utility Types
 * ============================================================ */

/** Extract form data type from schema */
export type InferFormData<T> = T extends { parse: (data: unknown) => infer R }
  ? R
  : never;

/** Make all fields optional for edit forms */
export type PartialFormData<T> = {
  [K in keyof T]?: T[K] | null;
};

/** Form field value type */
export type FieldValue<T, K extends keyof T> = T[K];

/** Form submit handler */
export type FormSubmitHandler<T> = (data: T) => Promise<void> | void;

/** Form change handler */
export type FormChangeHandler<T> = (data: Partial<T>) => void;

/** Form validation handler */
export type FormValidationHandler<T> = (
  data: Partial<T>
) => Promise<Record<string, string>> | Record<string, string>;
