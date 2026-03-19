/* ============================================================
 * Mock API - Central Export
 * All mock API services in one place
 * ============================================================ */

// Contacts API
export * from "./contactsApi";

// Deals API
export * from "./dealsApi";

// Leads API
export * from "./leadsApi";

// Utils
export * from "./utils";

/* ============================================================
 * Re-export common types for convenience
 * ============================================================ */

export type {
  PaginationParams,
  SortParams,
  PaginatedResponse,
  ApiResponse,
  ApiError,
  FilterOperator,
} from "./utils";

export type {
  ContactFilters,
  GetContactsParams,
  CreateContactDto,
  UpdateContactDto,
} from "./contactsApi";

export type {
  DealFilters,
  GetDealsParams,
  CreateDealDto,
  UpdateDealDto,
} from "./dealsApi";

export type {
  LeadFilters,
  GetLeadsParams,
  CreateLeadDto,
  UpdateLeadDto,
  ConvertLeadDto,
} from "./leadsApi";
