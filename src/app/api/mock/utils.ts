/* ============================================================
 * Mock API Utilities
 * Helper functions for mock API responses
 * ============================================================ */

/* ============================================================
 * Types
 * ============================================================ */

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

/* ============================================================
 * Delay Simulation (to mimic network latency)
 * ============================================================ */

/** Simulate network delay */
export async function simulateDelay(ms: number = 300): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/** Random delay (200-600ms) */
export async function simulateRandomDelay(): Promise<void> {
  const delay = Math.random() * 400 + 200; // 200-600ms
  await simulateDelay(delay);
}

/* ============================================================
 * Response Builders
 * ============================================================ */

/** Build success response */
export function buildSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/** Build error response */
export function buildErrorResponse(
  error: string,
  message: string,
  statusCode: number = 400
): ApiError {
  return {
    error,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}

/** Build paginated response */
export function buildPaginatedResponse<T>(
  data: T[],
  pagination: PaginationParams,
  total: number
): PaginatedResponse<T> {
  const page = pagination.page || 1;
  const limit = pagination.limit || 20;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/* ============================================================
 * Pagination
 * ============================================================ */

/** Apply pagination to array */
export function paginate<T>(
  items: T[],
  params: PaginationParams = {}
): { data: T[]; total: number } {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const offset = params.offset !== undefined ? params.offset : (page - 1) * limit;

  const data = items.slice(offset, offset + limit);
  const total = items.length;

  return { data, total };
}

/* ============================================================
 * Sorting
 * ============================================================ */

/** Sort array by field */
export function sortBy<T>(
  items: T[],
  field: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    // Handle null/undefined
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return order === "asc" ? 1 : -1;
    if (bVal == null) return order === "asc" ? -1 : 1;

    // String comparison
    if (typeof aVal === "string" && typeof bVal === "string") {
      const comparison = aVal.localeCompare(bVal, "vi");
      return order === "asc" ? comparison : -comparison;
    }

    // Number/Date comparison
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/** Apply sorting params */
export function applySorting<T>(items: T[], params: SortParams): T[] {
  if (!params.sortBy) return items;

  return sortBy(items, params.sortBy as keyof T, params.sortOrder || "asc");
}

/* ============================================================
 * Filtering
 * ============================================================ */

/** Generic filter function */
export function filterBy<T>(
  items: T[],
  filters: Partial<Record<keyof T, unknown>>
): T[] {
  return items.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === "") return true;

      const itemValue = item[key as keyof T];

      // Array contains check
      if (Array.isArray(value)) {
        return value.includes(itemValue);
      }

      // Exact match
      return itemValue === value;
    });
  });
}

/** Filter by date range */
export function filterByDateRange<T>(
  items: T[],
  field: keyof T,
  startDate?: string,
  endDate?: string
): T[] {
  return items.filter((item) => {
    const value = item[field];
    if (typeof value !== "string") return true;

    const date = new Date(value);

    if (startDate) {
      const start = new Date(startDate);
      if (date < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (date > end) return false;
    }

    return true;
  });
}

/* ============================================================
 * Search
 * ============================================================ */

/** Simple text search across multiple fields */
export function searchInFields<T>(
  items: T[],
  query: string,
  fields: Array<keyof T>
): T[] {
  if (!query || query.trim() === "") return items;

  const normalizedQuery = normalizeVietnamese(query.toLowerCase());

  return items.filter((item) => {
    return fields.some((field) => {
      const value = item[field];
      if (value == null) return false;

      const normalizedValue = normalizeVietnamese(String(value).toLowerCase());
      return normalizedValue.includes(normalizedQuery);
    });
  });
}

/** Normalize Vietnamese text for search */
function normalizeVietnamese(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/* ============================================================
 * Advanced Filtering
 * ============================================================ */

export interface FilterOperator {
  field: string;
  operator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "in" | "contains";
  value: unknown;
}

/** Apply advanced filters with operators */
export function applyAdvancedFilters<T>(
  items: T[],
  filters: FilterOperator[]
): T[] {
  return items.filter((item) => {
    return filters.every((filter) => {
      const itemValue = item[filter.field as keyof T];

      switch (filter.operator) {
        case "eq":
          return itemValue === filter.value;
        case "ne":
          return itemValue !== filter.value;
        case "gt":
          return itemValue != null && itemValue > (filter.value as never);
        case "gte":
          return itemValue != null && itemValue >= (filter.value as never);
        case "lt":
          return itemValue != null && itemValue < (filter.value as never);
        case "lte":
          return itemValue != null && itemValue <= (filter.value as never);
        case "in":
          return Array.isArray(filter.value) && filter.value.includes(itemValue);
        case "contains":
          return (
            typeof itemValue === "string" &&
            typeof filter.value === "string" &&
            normalizeVietnamese(itemValue.toLowerCase()).includes(
              normalizeVietnamese(filter.value.toLowerCase())
            )
          );
        default:
          return true;
      }
    });
  });
}

/* ============================================================
 * Validation
 * ============================================================ */

/** Validate required fields */
export function validateRequiredFields<T>(
  data: Partial<T>,
  requiredFields: Array<keyof T>
): string[] {
  const errors: string[] = [];

  requiredFields.forEach((field) => {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      errors.push(`Field '${String(field)}' is required`);
    }
  });

  return errors;
}

/** Validate UUID format */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/* ============================================================
 * ID Generation
 * ============================================================ */

/** Generate UUID v7 (mock) */
export function generateUUID(): string {
  const timestamp = Date.now();
  const hex = timestamp.toString(16).padStart(12, "0");
  
  return `018d${hex.slice(0, 4)}-${hex.slice(4, 8)}-7${hex.slice(8, 11)}-${Math.random()
    .toString(16)
    .slice(2, 6)}-${Math.random().toString(16).slice(2, 14)}`;
}

/* ============================================================
 * Soft Delete Helpers
 * ============================================================ */

/** Filter out soft-deleted items */
export function excludeDeleted<T extends { deletedAt?: string | null }>(items: T[]): T[] {
  return items.filter((item) => !item.deletedAt);
}

/** Get only soft-deleted items */
export function onlyDeleted<T extends { deletedAt?: string | null }>(items: T[]): T[] {
  return items.filter((item) => item.deletedAt);
}

/* ============================================================
 * Mock HTTP Status Codes
 * ============================================================ */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
