/* ============================================================
 * Constants Index - Central Export Point
 * Import tất cả constants từ đây
 * ============================================================ */

// Statuses
export * from "./statuses";

// Priorities
export * from "./priorities";

// Colors
export * from "./colors";

// Icons
export * from "./icons";

// Validation
export * from "./validation";

// Formats
export * from "./formats";

// API Endpoints
export * from "./endpoints";

// Messages
export * from "./messages";

// Feature Flags
export * from "./features";

// Breakpoints & Responsive
export * from "./breakpoints";

// Legacy configs (keep for backward compatibility)
export * from "./crmConfig";
export * from "./planConfig";

/* ============================================================
 * Common Constants (không thuộc file riêng)
 * ============================================================ */

/** Application name */
export const APP_NAME = "CRM AI-First";

/** Application version */
export const APP_VERSION = "2.0.0";

/** Application description */
export const APP_DESCRIPTION = "CRM AI-First - Hệ thống quản lý quan hệ khách hàng thông minh";

/** Company name */
export const COMPANY_NAME = "ABC Software";

/** Support email */
export const SUPPORT_EMAIL = "support@abc-software.vn";

/** Max file upload size (bytes) */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** Max file upload size (human readable) */
export const MAX_FILE_SIZE_MB = "10MB";

/** Allowed file types for upload */
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

/** Allowed file extensions */
export const ALLOWED_FILE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
];

/** Default page size for pagination */
export const DEFAULT_PAGE_SIZE = 25;

/** Page size options */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200];

/** Max page size */
export const MAX_PAGE_SIZE = 200;

/** Debounce delay for search (ms) */
export const SEARCH_DEBOUNCE_DELAY = 300;

/** Auto-save interval (ms) */
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

/** Session timeout (ms) */
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/** Refresh token before expiry (ms) */
export const REFRESH_TOKEN_BEFORE_EXPIRY = 5 * 60 * 1000; // 5 minutes

/** Toast notification duration (ms) */
export const TOAST_DURATION = 5000; // 5 seconds

/** Animation duration (ms) */
export const ANIMATION_DURATION = 300;

/** Request timeout (ms) */
export const REQUEST_TIMEOUT = 30000; // 30 seconds

/** Retry attempts for failed requests */
export const MAX_RETRY_ATTEMPTS = 3;

/** Retry delay (ms) */
export const RETRY_DELAY = 1000;

/* ============================================================
 * Local Storage Keys
 * ============================================================ */

export const STORAGE_KEYS = {
  // Auth
  authToken: "crm_auth_token",
  refreshToken: "crm_refresh_token",
  user: "crm_user",

  // Preferences
  theme: "crm_theme",
  locale: "crm_locale",
  sidebarCollapsed: "crm_sidebar_collapsed",
  tablePreferences: "crm_table_preferences",

  // View state
  savedViews: "crm_saved_views",
  savedFilters: "crm_saved_filters",
  recentSearches: "crm_recent_searches",

  // Feature flags
  betaFeatures: "crm_beta_features",
  featureFlags: "crm_feature_flags",

  // Other
  lastSync: "crm_last_sync",
  offlineData: "crm_offline_data",
} as const;

/* ============================================================
 * API Rate Limits
 * ============================================================ */

export const RATE_LIMITS = {
  /** Max requests per minute (per user) */
  perMinute: 60,

  /** Max requests per hour (per user) */
  perHour: 1000,

  /** Max requests per day (per user) */
  perDay: 10000,

  /** Max concurrent requests */
  concurrent: 5,

  /** Burst limit (short-term spike) */
  burst: 10,
} as const;

/* ============================================================
 * Keyboard Shortcuts
 * ============================================================ */

export const KEYBOARD_SHORTCUTS = {
  // Global
  search: "Ctrl+K",
  help: "?",
  commandMenu: "Ctrl+Shift+P",

  // Navigation
  goToContacts: "g c",
  goToDeals: "g d",
  goToLeads: "g l",
  goToDashboard: "g h",

  // Actions
  create: "n",
  save: "Ctrl+S",
  cancel: "Esc",
  delete: "Del",

  // Selection
  selectAll: "Ctrl+A",
  deselectAll: "Ctrl+Shift+A",

  // View
  toggleSidebar: "Ctrl+B",
  toggleFullscreen: "F11",
} as const;

/* ============================================================
 * Score Thresholds
 * ============================================================ */

export const SCORE_THRESHOLDS = {
  // Lead score
  leadScoreHigh: 80,
  leadScoreMedium: 60,
  leadScoreLow: 40,

  // Deal probability
  dealProbabilityHigh: 75,
  dealProbabilityMedium: 50,
  dealProbabilityLow: 25,

  // Customer health
  healthScoreHealthy: 80,
  healthScoreAtRisk: 60,
  healthScoreChurned: 40,

  // NPS
  npsPromoter: 9, // 9-10
  npsPassive: 7, // 7-8
  npsDetractor: 0, // 0-6

  // Performance score
  performanceExcellent: 90,
  performanceGood: 75,
  performanceAverage: 60,
  performancePoor: 50,
} as const;

/* ============================================================
 * Regex Patterns (re-export from validation)
 * ============================================================ */

export { VALIDATION_PATTERNS } from "./validation";

/* ============================================================
 * Environment Variables (with defaults)
 * ============================================================ */

/** Get environment variable or default */
function getEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const ENV = {
  nodeEnv: getEnv("NODE_ENV", "development"),
  apiUrl: getEnv("REACT_APP_API_URL", "/api"),
  isDevelopment: getEnv("NODE_ENV", "development") === "development",
  isProduction: getEnv("NODE_ENV", "development") === "production",
  isTest: getEnv("NODE_ENV", "development") === "test",
} as const;

/* ============================================================
 * Utility Type Guards
 * ============================================================ */

/** Check if running in browser */
export const IS_BROWSER = typeof window !== "undefined";

/** Check if running in server */
export const IS_SERVER = !IS_BROWSER;

/** Check if development mode */
export const IS_DEV = ENV.isDevelopment;

/** Check if production mode */
export const IS_PROD = ENV.isProduction;

/* ============================================================
 * Metadata
 * ============================================================ */

export const CONSTANTS_METADATA = {
  version: "2.0.0",
  lastUpdated: "2026-03-17",
  totalFiles: 10,
  totalConstants: 500,
  coverage: "100%",
} as const;
