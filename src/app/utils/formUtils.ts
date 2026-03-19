/* ============================================================
 * Form Utilities
 * Helper functions for form handling
 * ============================================================ */

import type { FieldError } from "react-hook-form";
import { format, parseISO } from "date-fns";

/* ============================================================
 * Data Transformation
 * ============================================================ */

/** Transform form data to API format */
export function transformToApiFormat<T extends Record<string, unknown>>(
  data: T
): Record<string, unknown> {
  const transformed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      continue;
    }

    // Transform dates to ISO strings
    if (value instanceof Date) {
      transformed[key] = value.toISOString();
      continue;
    }

    // Transform empty strings to null for optional fields
    if (value === "") {
      transformed[key] = null;
      continue;
    }

    // Transform arrays
    if (Array.isArray(value)) {
      transformed[key] = value.filter((v) => v !== undefined && v !== null);
      continue;
    }

    // Keep other values as-is
    transformed[key] = value;
  }

  return transformed;
}

/** Transform API data to form format */
export function transformToFormFormat<T extends Record<string, unknown>>(
  data: Record<string, unknown>
): Partial<T> {
  const transformed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip null values
    if (value === null) {
      transformed[key] = "";
      continue;
    }

    // Parse ISO date strings to Date objects
    if (typeof value === "string" && isISODateString(value)) {
      transformed[key] = parseISO(value);
      continue;
    }

    // Keep other values as-is
    transformed[key] = value;
  }

  return transformed as Partial<T>;
}

/* ============================================================
 * Date Utilities
 * ============================================================ */

/** Check if string is ISO date */
function isISODateString(value: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  return isoDateRegex.test(value);
}

/** Format date for display */
export function formatDateForDisplay(date: Date | string | undefined): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy");
}

/** Format datetime for display */
export function formatDateTimeForDisplay(
  date: Date | string | undefined
): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy HH:mm");
}

/** Format date for input field */
export function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd");
}

/** Format datetime for input field */
export function formatDateTimeForInput(
  date: Date | string | undefined
): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd'T'HH:mm");
}

/* ============================================================
 * Number Utilities
 * ============================================================ */

/** Format currency (VND) */
export function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Parse currency string to number */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.-]/g, "");
  return parseFloat(cleaned) || 0;
}

/** Format percentage */
export function formatPercentage(value: number | undefined): string {
  if (value === undefined || value === null) return "0%";
  return `${value.toFixed(1)}%`;
}

/** Parse percentage string to number */
export function parsePercentage(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  return parseFloat(cleaned) || 0;
}

/* ============================================================
 * String Utilities
 * ============================================================ */

/** Capitalize first letter */
export function capitalizeFirst(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Convert to title case */
export function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
}

/** Trim all whitespace */
export function trimAll(str: string): string {
  if (!str) return "";
  return str.trim().replace(/\s+/g, " ");
}

/** Sanitize string for display */
export function sanitizeString(str: string | undefined): string {
  if (!str) return "";
  return trimAll(str);
}

/* ============================================================
 * Validation Utilities
 * ============================================================ */

/** Get error message from FieldError */
export function getErrorMessage(error: FieldError | undefined): string {
  if (!error) return "";
  return error.message || "Invalid value";
}

/** Check if field has error */
export function hasFieldError(
  errors: Record<string, FieldError | undefined>,
  field: string
): boolean {
  return !!errors[field];
}

/** Get nested error message */
export function getNestedError(
  errors: Record<string, unknown>,
  path: string
): string | undefined {
  const keys = path.split(".");
  let current: unknown = errors;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  if (current && typeof current === "object" && "message" in current) {
    return (current as FieldError).message;
  }

  return undefined;
}

/* ============================================================
 * Array Utilities
 * ============================================================ */

/** Remove duplicates from array */
export function removeDuplicates<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/** Move array item */
export function moveArrayItem<T>(
  arr: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  const newArr = [...arr];
  const item = newArr.splice(fromIndex, 1)[0];
  newArr.splice(toIndex, 0, item);
  return newArr;
}

/** Toggle item in array */
export function toggleArrayItem<T>(arr: T[], item: T): T[] {
  const index = arr.indexOf(item);
  if (index > -1) {
    return arr.filter((_, i) => i !== index);
  }
  return [...arr, item];
}

/* ============================================================
 * Object Utilities
 * ============================================================ */

/** Deep clone object */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** Remove empty values from object */
export function removeEmpty<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== "") {
      result[key as keyof T] = value;
    }
  }

  return result;
}

/** Merge objects deeply */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (
      targetValue &&
      sourceValue &&
      typeof targetValue === "object" &&
      typeof sourceValue === "object" &&
      !Array.isArray(targetValue) &&
      !Array.isArray(sourceValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[Extract<keyof T, string>];
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}

/** Get changed fields between two objects */
export function getChangedFields<T extends Record<string, unknown>>(
  original: T,
  updated: T
): Partial<T> {
  const changes: Partial<T> = {};

  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changes[key] = updated[key];
    }
  }

  return changes;
}

/* ============================================================
 * Form State Utilities
 * ============================================================ */

/** Check if form is pristine (no changes) */
export function isFormPristine<T extends Record<string, unknown>>(
  original: T,
  current: T
): boolean {
  return JSON.stringify(original) === JSON.stringify(current);
}

/** Reset form fields to default */
export function resetFormFields<T extends Record<string, unknown>>(
  fields: Array<keyof T>,
  defaultValues: Partial<T>
): Partial<T> {
  const reset: Partial<T> = {};

  for (const field of fields) {
    reset[field] = defaultValues[field];
  }

  return reset;
}

/* ============================================================
 * Debounce Utility
 * ============================================================ */

/** Debounce function */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/* ============================================================
 * File Utilities
 * ============================================================ */

/** Format file size */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/** Validate file type */
export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  if (acceptedTypes.length === 0) return true;

  return acceptedTypes.some((type) => {
    if (type.endsWith("/*")) {
      const category = type.split("/")[0];
      return file.type.startsWith(category + "/");
    }
    return file.type === type;
  });
}

/** Validate file size */
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/* ============================================================
 * Phone Number Utilities
 * ============================================================ */

/** Format Vietnamese phone number */
export function formatVietnamesePhone(phone: string): string {
  if (!phone) return "";

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as: 0xxx xxx xxx or 0xxxx xxx xxx
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  }

  return phone;
}

/** Parse phone number to standard format */
export function parsePhoneNumber(phone: string): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}
