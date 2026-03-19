/* ============================================================
 * Format Constants - Date, Time, Currency & Number Formats
 * Centralized formatting configurations
 * ============================================================ */

import type { CurrencyCode } from "@/types";

/* ============================================================
 * Date & Time Formats
 * ============================================================ */

/** Date format strings (for date-fns, dayjs, etc.) */
export const DATE_FORMATS = {
  // ISO formats
  iso: "yyyy-MM-dd",
  isoDateTime: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",

  // Display formats (Vietnamese)
  short: "dd/MM/yyyy", // 17/03/2026
  medium: "dd MMM yyyy", // 17 Th3 2026
  long: "dd MMMM yyyy", // 17 Tháng 3 2026
  full: "EEEE, dd MMMM yyyy", // Thứ Ba, 17 Tháng 3 2026

  // Date with time
  dateTime: "dd/MM/yyyy HH:mm", // 17/03/2026 14:30
  dateTimeFull: "dd/MM/yyyy HH:mm:ss", // 17/03/2026 14:30:45

  // Month/Year only
  monthYear: "MM/yyyy", // 03/2026
  monthYearLong: "MMMM yyyy", // Tháng 3 2026

  // Time only
  time: "HH:mm", // 14:30
  timeFull: "HH:mm:ss", // 14:30:45
  time12h: "hh:mm a", // 02:30 PM

  // Relative formats (for display)
  relative: "relative", // "2 giờ trước", "3 ngày trước"
} as const;

/** Default date format for display */
export const DEFAULT_DATE_FORMAT = DATE_FORMATS.short;

/** Default datetime format for display */
export const DEFAULT_DATETIME_FORMAT = DATE_FORMATS.dateTime;

/* ============================================================
 * Timezone
 * ============================================================ */

/** Default timezone (Vietnam) */
export const DEFAULT_TIMEZONE = "Asia/Ho_Chi_Minh"; // UTC+7

/** Timezone offset */
export const TIMEZONE_OFFSET = "+07:00";

/* ============================================================
 * Currency Formats
 * ============================================================ */

/** Currency symbols */
export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  VND: "₫",
  USD: "$",
  EUR: "€",
  JPY: "¥",
  SGD: "S$",
};

/** Currency display names */
export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  VND: "Việt Nam Đồng",
  USD: "US Dollar",
  EUR: "Euro",
  JPY: "Japanese Yen",
  SGD: "Singapore Dollar",
};

/** Currency decimal places */
export const CURRENCY_DECIMALS: Record<CurrencyCode, number> = {
  VND: 0, // Vietnamese Dong doesn't use decimals
  USD: 2,
  EUR: 2,
  JPY: 0,
  SGD: 2,
};

/** Default currency */
export const DEFAULT_CURRENCY: CurrencyCode = "VND";

/** Currency format options (Intl.NumberFormat) */
export const CURRENCY_FORMAT_OPTIONS: Record<
  CurrencyCode,
  Intl.NumberFormatOptions
> = {
  VND: {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  USD: {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  EUR: {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  JPY: {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  SGD: {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
};

/* ============================================================
 * Number Formats
 * ============================================================ */

/** Number format options */
export const NUMBER_FORMATS = {
  /** Integer (no decimals) */
  integer: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },

  /** Decimal (2 decimals) */
  decimal: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },

  /** Percentage */
  percentage: {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },

  /** Compact (1K, 1M, 1B) */
  compact: {
    notation: "compact" as const,
    compactDisplay: "short" as const,
  },

  /** Scientific */
  scientific: {
    notation: "scientific" as const,
  },
} as const;

/* ============================================================
 * File Size Formats
 * ============================================================ */

/** File size units */
export const FILE_SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

/** File size threshold (1024 bytes = 1 KB) */
export const FILE_SIZE_THRESHOLD = 1024;

/* ============================================================
 * Locale Settings
 * ============================================================ */

/** Default locale (Vietnamese) */
export const DEFAULT_LOCALE = "vi-VN";

/** Supported locales */
export const SUPPORTED_LOCALES = ["vi-VN", "en-US"] as const;

/** Locale display names */
export const LOCALE_NAMES: Record<string, string> = {
  "vi-VN": "Tiếng Việt",
  "en-US": "English",
};

/* ============================================================
 * Utility Functions
 * ============================================================ */

/** Format date to string */
export function formatDate(
  date: Date | string,
  format: string = DEFAULT_DATE_FORMAT
): string {
  // Implementation using date-fns or dayjs
  // This is a placeholder - actual implementation depends on chosen library
  const d = typeof date === "string" ? new Date(date) : date;
  
  // Simple fallback (replace with proper date library)
  if (format === DATE_FORMATS.short) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  return d.toLocaleDateString(DEFAULT_LOCALE);
}

/** Format datetime to string */
export function formatDateTime(
  date: Date | string,
  format: string = DEFAULT_DATETIME_FORMAT
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  // Simple fallback
  if (format === DATE_FORMATS.dateTime) {
    const dateStr = formatDate(d, DATE_FORMATS.short);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${dateStr} ${hours}:${minutes}`;
  }
  
  return d.toLocaleString(DEFAULT_LOCALE);
}

/** Format time to string */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/** Format currency */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  locale: string = DEFAULT_LOCALE
): string {
  const formatter = new Intl.NumberFormat(locale, CURRENCY_FORMAT_OPTIONS[currency]);
  return formatter.format(amount);
}

/** Format number */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = NUMBER_FORMATS.decimal,
  locale: string = DEFAULT_LOCALE
): string {
  const formatter = new Intl.NumberFormat(locale, options);
  return formatter.format(value);
}

/** Format percentage */
export function formatPercentage(
  value: number,
  decimals: number = 0,
  locale: string = DEFAULT_LOCALE
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(value / 100);
}

/** Format file size */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  let unitIndex = 0;
  let size = bytes;

  while (size >= FILE_SIZE_THRESHOLD && unitIndex < FILE_SIZE_UNITS.length - 1) {
    size /= FILE_SIZE_THRESHOLD;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${FILE_SIZE_UNITS[unitIndex]}`;
}

/** Format compact number (1K, 1M, 1B) */
export function formatCompactNumber(
  value: number,
  locale: string = DEFAULT_LOCALE
): string {
  const formatter = new Intl.NumberFormat(locale, NUMBER_FORMATS.compact);
  return formatter.format(value);
}

/** Format relative time (e.g., "2 giờ trước") */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;
  if (diffWeek < 4) return `${diffWeek} tuần trước`;
  if (diffMonth < 12) return `${diffMonth} tháng trước`;
  return `${diffYear} năm trước`;
}

/** Parse date from string */
export function parseDate(dateString: string, format?: string): Date | null {
  try {
    return new Date(dateString);
  } catch {
    return null;
  }
}

/** Get currency symbol */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_SYMBOLS[currency];
}

/** Get currency name */
export function getCurrencyName(currency: CurrencyCode): string {
  return CURRENCY_NAMES[currency];
}

/** Get currency decimals */
export function getCurrencyDecimals(currency: CurrencyCode): number {
  return CURRENCY_DECIMALS[currency];
}

/* ============================================================
 * Duration Formats
 * ============================================================ */

/** Format duration in seconds to human-readable string */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

/** Format duration in minutes to hours and minutes */
export function formatDurationHM(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} phút`;
  if (mins === 0) return `${hours} giờ`;
  return `${hours} giờ ${mins} phút`;
}

/* ============================================================
 * Phone Number Formats
 * ============================================================ */

/** Format phone number (Vietnamese) */
export function formatPhoneVN(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");

  // Format: 0xxx xxx xxx or 0xxxx xxx xxx
  if (cleaned.startsWith("0")) {
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
  }

  return phone; // Return as-is if not matching
}

/** Format phone number (international) */
export function formatPhoneInternational(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("84")) {
    // Vietnamese number starting with country code
    return `+84 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }

  return phone;
}
