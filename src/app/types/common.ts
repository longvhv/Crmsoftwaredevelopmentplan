/* ============================================================
 * Common Types - Shared across all entities
 * Standard Mixins theo Guidelines.md
 * ============================================================ */

/** UUID v7 format (primary key) */
export type UUID = string;

/** ISO 8601 timestamp string */
export type ISODateTime = string;

/** ISO 8601 date string (YYYY-MM-DD) */
export type ISODate = string;

/** Currency code (ISO 4217) */
export type CurrencyCode = "VND" | "USD" | "EUR" | "JPY" | "SGD";

/** Tenant ID (multi-tenant isolation) */
export type TenantId = UUID;

/* ============================================================
 * Standard Mixins (theo Guidelines.md)
 * Mọi entity nghiệp vụ phải có các trường này
 * ============================================================ */

/** Base entity fields (Standard Mixins) */
export interface BaseEntity {
  /** Primary key (UUID v7) */
  id: UUID;
  /** Tenant ID for multi-tenant isolation */
  tenantId: TenantId;
  /** Version for optimistic locking */
  version: number;
  /** Created timestamp (UTC) */
  createdAt: ISODateTime;
  /** Last updated timestamp (UTC) */
  updatedAt: ISODateTime;
  /** Soft delete timestamp (NULL if active) */
  deletedAt: ISODateTime | null;
}

/** Entity with owner/creator tracking */
export interface OwnedEntity extends BaseEntity {
  /** User/Employee who created this record */
  createdBy: UUID;
  /** User/Employee who last updated this record */
  updatedBy: UUID;
}

/** Entity with tags support */
export interface TaggableEntity extends BaseEntity {
  /** Tag IDs attached to this entity */
  tags: UUID[];
}

/** Entity with custom fields support */
export interface CustomizableEntity extends BaseEntity {
  /** Dynamic custom fields (JSON) */
  customFields: Record<string, unknown>;
}

/* ============================================================
 * Common Enums & Status Types
 * ============================================================ */

/** Generic active/inactive status */
export type ActiveStatus = "active" | "inactive";

/** Extended status with more states */
export type EntityStatus = "active" | "inactive" | "archived" | "draft";

/** Priority levels */
export type Priority = "low" | "medium" | "high" | "urgent";

/** Task/Activity status */
export type TaskStatus = "planned" | "in-progress" | "completed" | "cancelled";

/** Approval status */
export type ApprovalStatus = "pending" | "approved" | "rejected" | "cancelled";

/** Trend direction */
export type Trend = "up" | "down" | "stable";

/* ============================================================
 * Metadata & AI Support
 * ============================================================ */

/** AI-generated metadata for entities */
export interface AIMetadata {
  /** AI confidence score (0-100) */
  confidence: number;
  /** AI model version used */
  modelVersion: string;
  /** Timestamp of AI processing */
  processedAt: ISODateTime;
  /** Additional AI-specific data */
  metadata?: Record<string, unknown>;
}

/** Entity with AI scoring capability */
export interface AIScorable {
  /** AI-calculated score (0-100) */
  aiScore: number;
  /** AI metadata */
  aiMetadata?: AIMetadata;
}

/* ============================================================
 * Pagination & Filtering
 * ============================================================ */

/** Pagination parameters */
export interface Pagination {
  /** Current page (1-based) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
}

/** Sort direction */
export type SortDirection = "asc" | "desc";

/** Sort configuration */
export interface SortConfig {
  /** Field to sort by */
  field: string;
  /** Sort direction */
  direction: SortDirection;
}

/** Filter operator */
export type FilterOperator =
  | "eq" // equals
  | "ne" // not equals
  | "gt" // greater than
  | "gte" // greater than or equal
  | "lt" // less than
  | "lte" // less than or equal
  | "in" // in array
  | "nin" // not in array
  | "contains" // string contains
  | "startsWith" // string starts with
  | "endsWith" // string ends with
  | "between" // between two values
  | "isNull" // is null
  | "isNotNull"; // is not null

/** Single filter condition */
export interface FilterCondition {
  /** Field to filter */
  field: string;
  /** Filter operator */
  operator: FilterOperator;
  /** Filter value(s) */
  value: unknown;
}

/** Filter configuration */
export interface FilterConfig {
  /** Filter conditions (AND logic) */
  conditions: FilterCondition[];
  /** Search query (global search) */
  search?: string;
}

/** Complete query parameters */
export interface QueryParams {
  /** Pagination */
  pagination?: Pagination;
  /** Sorting */
  sort?: SortConfig[];
  /** Filters */
  filters?: FilterConfig;
  /** Fields to include (projection) */
  fields?: string[];
  /** Include soft-deleted records */
  includeDeleted?: boolean;
}

/* ============================================================
 * API Response Wrappers
 * ============================================================ */

/** Successful API response */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: ISODateTime;
}

/** Error API response */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: ISODateTime;
}

/** API response (success or error) */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/** Paginated API response */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: Pagination;
  timestamp: ISODateTime;
}

/* ============================================================
 * Validation & Error Handling
 * ============================================================ */

/** Validation error for a single field */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/** Form validation result */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/* ============================================================
 * File & Media Types
 * ============================================================ */

/** File upload metadata */
export interface FileMetadata {
  /** Original filename */
  filename: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Storage URL */
  url: string;
  /** Thumbnail URL (if image) */
  thumbnailUrl?: string;
  /** Upload timestamp */
  uploadedAt: ISODateTime;
  /** Uploaded by user */
  uploadedBy: UUID;
}

/** Image dimensions */
export interface ImageDimensions {
  width: number;
  height: number;
}

/** Image metadata (extends FileMetadata) */
export interface ImageMetadata extends FileMetadata {
  dimensions?: ImageDimensions;
  /** Alt text for accessibility */
  altText?: string;
}

/* ============================================================
 * Audit & History
 * ============================================================ */

/** Change log entry */
export interface ChangeLogEntry {
  /** Field that changed */
  field: string;
  /** Old value (JSON) */
  oldValue: unknown;
  /** New value (JSON) */
  newValue: unknown;
  /** Timestamp of change */
  changedAt: ISODateTime;
  /** User who made the change */
  changedBy: UUID;
}

/** Audit trail for an entity */
export interface AuditTrail {
  /** Entity type */
  entityType: string;
  /** Entity ID */
  entityId: UUID;
  /** Change history */
  changes: ChangeLogEntry[];
}

/* ============================================================
 * Address & Location
 * ============================================================ */

/** Physical address */
export interface Address {
  /** Street address line 1 */
  street1: string;
  /** Street address line 2 (optional) */
  street2?: string;
  /** City/District */
  city: string;
  /** State/Province */
  state?: string;
  /** Postal/Zip code */
  postalCode?: string;
  /** Country */
  country: string;
  /** Country code (ISO 3166-1 alpha-2) */
  countryCode: string;
}

/** Geographic coordinates */
export interface GeoLocation {
  /** Latitude */
  lat: number;
  /** Longitude */
  lng: number;
}

/** Address with geolocation */
export interface AddressWithGeo extends Address {
  /** Geographic coordinates */
  location?: GeoLocation;
}

/* ============================================================
 * Money & Financial
 * ============================================================ */

/** Money amount with currency */
export interface Money {
  /** Amount (decimal) */
  amount: number;
  /** Currency code */
  currency: CurrencyCode;
}

/** Price range */
export interface PriceRange {
  /** Minimum price */
  min: Money;
  /** Maximum price */
  max: Money;
}

/* ============================================================
 * Time & Duration
 * ============================================================ */

/** Duration in different units */
export interface Duration {
  /** Duration in seconds */
  seconds?: number;
  /** Duration in minutes */
  minutes?: number;
  /** Duration in hours */
  hours?: number;
  /** Duration in days */
  days?: number;
}

/** Date range */
export interface DateRange {
  /** Start date (inclusive) */
  startDate: ISODate;
  /** End date (inclusive) */
  endDate: ISODate;
}

/** DateTime range */
export interface DateTimeRange {
  /** Start datetime (inclusive) */
  startDateTime: ISODateTime;
  /** End datetime (inclusive) */
  endDateTime: ISODateTime;
}

/* ============================================================
 * User & Identity
 * ============================================================ */

/** User reference (minimal info for display) */
export interface UserRef {
  id: UUID;
  name: string;
  email: string;
  avatarUrl?: string;
}

/** Employee reference */
export interface EmployeeRef extends UserRef {
  /** Employee type */
  type: "human" | "ai";
  /** Department */
  department?: string;
}

/* ============================================================
 * Type Guards & Utilities
 * ============================================================ */

/** Check if API response is successful */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.success === true;
}

/** Check if API response is an error */
export function isApiError<T>(response: ApiResponse<T>): response is ApiError {
  return response.success === false;
}

/** Check if entity is soft-deleted */
export function isDeleted(entity: BaseEntity): boolean {
  return entity.deletedAt !== null;
}

/** Check if entity is active (not deleted) */
export function isActive(entity: BaseEntity): boolean {
  return entity.deletedAt === null;
}
