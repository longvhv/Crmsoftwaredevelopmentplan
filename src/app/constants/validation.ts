/* ============================================================
 * Validation Constants - Patterns, Rules & Messages
 * Centralized validation logic
 * ============================================================ */

/* ============================================================
 * Regular Expression Patterns
 * ============================================================ */

export const VALIDATION_PATTERNS = {
  /** Email pattern (RFC 5322 simplified) */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** Phone number (Vietnamese format) */
  phone: /^(0|\+84)[0-9]{9,10}$/,

  /** Phone number (International format) */
  phoneInternational: /^\+?[1-9]\d{1,14}$/,

  /** UUID v7 format */
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  /** URL pattern */
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,

  /** Alphanumeric (letters and numbers only) */
  alphanumeric: /^[a-zA-Z0-9]+$/,

  /** Alphanumeric with spaces */
  alphanumericSpace: /^[a-zA-Z0-9\s]+$/,

  /** Letters only (Vietnamese) */
  lettersOnly: /^[a-zA-ZÀ-ỹ\s]+$/,

  /** Numbers only */
  numbersOnly: /^[0-9]+$/,

  /** Decimal number */
  decimal: /^-?\d+(\.\d+)?$/,

  /** Positive integer */
  positiveInteger: /^[1-9]\d*$/,

  /** Positive number (including 0) */
  positiveNumber: /^(0|[1-9]\d*)(\.\d+)?$/,

  /** Percentage (0-100) */
  percentage: /^(100(\.0+)?|[1-9]?\d(\.\d+)?)$/,

  /** Date (YYYY-MM-DD) */
  date: /^\d{4}-\d{2}-\d{2}$/,

  /** DateTime (ISO 8601) */
  dateTime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,

  /** Postal code (Vietnamese) */
  postalCodeVN: /^\d{6}$/,

  /** Tax ID (Vietnamese MST - Mã số thuế) */
  taxIdVN: /^\d{10}(-\d{3})?$/,

  /** Credit card number (basic) */
  creditCard: /^\d{13,19}$/,

  /** Currency amount (with optional decimals) */
  currency: /^\d+(\.\d{2})?$/,

  /** SKU / Product code */
  sku: /^[A-Z0-9-_]{3,50}$/,

  /** Hex color */
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

  /** IP Address (IPv4) */
  ipv4: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,

  /** Slug (URL-friendly) */
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  /** Password (minimum 8 chars, 1 uppercase, 1 lowercase, 1 number) */
  passwordStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,

  /** Username (3-20 chars, alphanumeric + underscore) */
  username: /^[a-zA-Z0-9_]{3,20}$/,
} as const;

/* ============================================================
 * Field Length Constraints
 * ============================================================ */

export const FIELD_LENGTHS = {
  // Text fields
  shortText: { min: 2, max: 100 },
  mediumText: { min: 2, max: 200 },
  longText: { min: 10, max: 500 },
  description: { min: 10, max: 2000 },
  richText: { min: 10, max: 10000 },

  // Specific fields
  name: { min: 2, max: 100 },
  email: { min: 5, max: 255 },
  phone: { min: 10, max: 15 },
  company: { min: 2, max: 200 },
  jobTitle: { min: 2, max: 100 },
  address: { min: 10, max: 500 },
  sku: { min: 3, max: 50 },
  url: { min: 10, max: 2083 }, // Max URL length

  // Numeric fields
  percentage: { min: 0, max: 100 },
  score: { min: 0, max: 100 },
  priority: { min: 1, max: 4 },

  // Currency
  currency: { min: 0, max: 999999999999.99 }, // ~1 trillion
} as const;

/* ============================================================
 * Validation Error Messages (Vietnamese)
 * ============================================================ */

export const VALIDATION_MESSAGES = {
  // Required
  required: "Trường này là bắt buộc",
  requiredField: (fieldName: string) => `${fieldName} là bắt buộc`,

  // Format
  invalidEmail: "Email không hợp lệ",
  invalidPhone: "Số điện thoại không hợp lệ",
  invalidUrl: "URL không hợp lệ",
  invalidDate: "Ngày không hợp lệ",
  invalidDateTime: "Ngày giờ không hợp lệ",
  invalidUuid: "UUID không hợp lệ",
  invalidFormat: (fieldName: string) => `${fieldName} không đúng định dạng`,

  // Length
  tooShort: (min: number) => `Tối thiểu ${min} ký tự`,
  tooLong: (max: number) => `Tối đa ${max} ký tự`,
  lengthBetween: (min: number, max: number) => `Từ ${min} đến ${max} ký tự`,

  // Numeric
  mustBeNumber: "Phải là số",
  mustBePositive: "Phải là số dương",
  mustBeInteger: "Phải là số nguyên",
  min: (min: number) => `Giá trị tối thiểu là ${min}`,
  max: (max: number) => `Giá trị tối đa là ${max}`,
  between: (min: number, max: number) => `Giá trị từ ${min} đến ${max}`,

  // Comparison
  mustBeAfter: (field: string) => `Phải sau ${field}`,
  mustBeBefore: (field: string) => `Phải trước ${field}`,
  mustBeGreaterThan: (field: string) => `Phải lớn hơn ${field}`,
  mustBeLessThan: (field: string) => `Phải nhỏ hơn ${field}`,

  // Uniqueness
  alreadyExists: (fieldName: string) => `${fieldName} đã tồn tại`,
  emailExists: "Email đã được sử dụng",
  phoneExists: "Số điện thoại đã được sử dụng",

  // Password
  passwordTooWeak: "Mật khẩu quá yếu (cần ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số)",
  passwordMismatch: "Mật khẩu không khớp",

  // File upload
  fileTooLarge: (maxSize: string) => `File quá lớn (tối đa ${maxSize})`,
  invalidFileType: (types: string) => `File không đúng định dạng (chỉ chấp nhận ${types})`,

  // Selection
  mustSelect: "Vui lòng chọn ít nhất 1 mục",
  selectAtMost: (max: number) => `Chọn tối đa ${max} mục`,

  // Custom
  custom: (message: string) => message,
} as const;

/* ============================================================
 * Validation Functions
 * ============================================================ */

/** Validate email */
export function isValidEmail(email: string): boolean {
  return VALIDATION_PATTERNS.email.test(email);
}

/** Validate phone (Vietnamese) */
export function isValidPhone(phone: string): boolean {
  return VALIDATION_PATTERNS.phone.test(phone);
}

/** Validate UUID */
export function isValidUuid(uuid: string): boolean {
  return VALIDATION_PATTERNS.uuid.test(uuid);
}

/** Validate URL */
export function isValidUrl(url: string): boolean {
  return VALIDATION_PATTERNS.url.test(url);
}

/** Validate date (YYYY-MM-DD) */
export function isValidDate(date: string): boolean {
  if (!VALIDATION_PATTERNS.date.test(date)) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/** Validate string length */
export function isValidLength(str: string, min: number, max: number): boolean {
  const len = str.length;
  return len >= min && len <= max;
}

/** Validate number range */
export function isInRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

/** Validate percentage (0-100) */
export function isValidPercentage(value: number): boolean {
  return isInRange(value, 0, 100);
}

/** Validate positive number */
export function isPositiveNumber(value: number): boolean {
  return value > 0;
}

/** Validate integer */
export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

/** Validate positive integer */
export function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

/* ============================================================
 * Field Validators (returns error message or null)
 * ============================================================ */

/** Validate required field */
export function validateRequired(value: unknown, fieldName = "Trường này"): string | null {
  if (value === null || value === undefined || value === "") {
    return VALIDATION_MESSAGES.requiredField(fieldName);
  }
  return null;
}

/** Validate email field */
export function validateEmail(email: string, required = true): string | null {
  if (!email && !required) return null;
  if (!email) return VALIDATION_MESSAGES.required;
  if (!isValidEmail(email)) return VALIDATION_MESSAGES.invalidEmail;
  return null;
}

/** Validate phone field */
export function validatePhone(phone: string, required = true): string | null {
  if (!phone && !required) return null;
  if (!phone) return VALIDATION_MESSAGES.required;
  if (!isValidPhone(phone)) return VALIDATION_MESSAGES.invalidPhone;
  return null;
}

/** Validate URL field */
export function validateUrl(url: string, required = true): string | null {
  if (!url && !required) return null;
  if (!url) return VALIDATION_MESSAGES.required;
  if (!isValidUrl(url)) return VALIDATION_MESSAGES.invalidUrl;
  return null;
}

/** Validate text length */
export function validateTextLength(
  text: string,
  min: number,
  max: number,
  fieldName = "Trường này"
): string | null {
  if (!text) return VALIDATION_MESSAGES.requiredField(fieldName);
  if (text.length < min) return VALIDATION_MESSAGES.tooShort(min);
  if (text.length > max) return VALIDATION_MESSAGES.tooLong(max);
  return null;
}

/** Validate number range */
export function validateNumberRange(
  value: number,
  min: number,
  max: number
): string | null {
  if (typeof value !== "number" || isNaN(value)) {
    return VALIDATION_MESSAGES.mustBeNumber;
  }
  if (value < min) return VALIDATION_MESSAGES.min(min);
  if (value > max) return VALIDATION_MESSAGES.max(max);
  return null;
}

/** Validate date is after another date */
export function validateDateAfter(
  date: string,
  afterDate: string,
  fieldName = "ngày này"
): string | null {
  if (!isValidDate(date) || !isValidDate(afterDate)) {
    return VALIDATION_MESSAGES.invalidDate;
  }
  if (new Date(date) <= new Date(afterDate)) {
    return VALIDATION_MESSAGES.mustBeAfter(fieldName);
  }
  return null;
}

/** Validate date is before another date */
export function validateDateBefore(
  date: string,
  beforeDate: string,
  fieldName = "ngày này"
): string | null {
  if (!isValidDate(date) || !isValidDate(beforeDate)) {
    return VALIDATION_MESSAGES.invalidDate;
  }
  if (new Date(date) >= new Date(beforeDate)) {
    return VALIDATION_MESSAGES.mustBeBefore(fieldName);
  }
  return null;
}

/* ============================================================
 * Sanitization Functions
 * ============================================================ */

/** Sanitize string (remove leading/trailing spaces) */
export function sanitizeString(str: string): string {
  return str.trim();
}

/** Sanitize email (lowercase + trim) */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Sanitize phone (remove non-digits except +) */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/** Sanitize URL (trim + lowercase protocol) */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return "https://" + trimmed;
  }
  return trimmed;
}

/** Sanitize number (parse and validate) */
export function sanitizeNumber(value: string | number): number | null {
  if (typeof value === "number") return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

/** Sanitize integer */
export function sanitizeInteger(value: string | number): number | null {
  if (typeof value === "number") return Math.floor(value);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

/* ============================================================
 * Composite Validators (for forms)
 * ============================================================ */

/** Validate contact form data */
export interface ContactFormValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
}

export function validateContactForm(data: {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
}): ContactFormValidationErrors {
  const errors: ContactFormValidationErrors = {};

  // Required: firstName
  const firstNameError = validateTextLength(
    data.firstName,
    FIELD_LENGTHS.name.min,
    FIELD_LENGTHS.name.max,
    "Tên"
  );
  if (firstNameError) errors.firstName = firstNameError;

  // Optional: lastName
  if (data.lastName) {
    const lastNameError = validateTextLength(
      data.lastName,
      FIELD_LENGTHS.name.min,
      FIELD_LENGTHS.name.max,
      "Họ"
    );
    if (lastNameError) errors.lastName = lastNameError;
  }

  // Optional: email
  if (data.email) {
    const emailError = validateEmail(data.email, false);
    if (emailError) errors.email = emailError;
  }

  // Optional: phone
  if (data.phone) {
    const phoneError = validatePhone(data.phone, false);
    if (phoneError) errors.phone = phoneError;
  }

  return errors;
}

/** Validate deal form data */
export interface DealFormValidationErrors {
  name?: string;
  value?: string;
  probability?: string;
}

export function validateDealForm(data: {
  name: string;
  value: number;
  probability: number;
}): DealFormValidationErrors {
  const errors: DealFormValidationErrors = {};

  // Required: name
  const nameError = validateTextLength(
    data.name,
    FIELD_LENGTHS.mediumText.min,
    FIELD_LENGTHS.mediumText.max,
    "Tên deal"
  );
  if (nameError) errors.name = nameError;

  // Required: value
  const valueError = validateNumberRange(data.value, 0, FIELD_LENGTHS.currency.max);
  if (valueError) errors.value = valueError;

  // Optional: probability (0-100)
  if (data.probability !== undefined) {
    const probError = validateNumberRange(data.probability, 0, 100);
    if (probError) errors.probability = probError;
  }

  return errors;
}
