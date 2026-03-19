/* ============================================================
 * Type System Index - Central Export Point
 * Import từ đây để có type-safety toàn bộ app
 * ============================================================ */

// Common types
export type {
  UUID,
  ISODateTime,
  ISODate,
  CurrencyCode,
  TenantId,
  BaseEntity,
  OwnedEntity,
  TaggableEntity,
  CustomizableEntity,
  ActiveStatus,
  EntityStatus,
  Priority,
  TaskStatus,
  ApprovalStatus,
  Trend,
  AIMetadata,
  AIScorable,
  Pagination,
  SortDirection,
  SortConfig,
  FilterOperator,
  FilterCondition,
  FilterConfig,
  QueryParams,
  ApiSuccess,
  ApiError,
  ApiResponse,
  PaginatedResponse,
  ValidationError,
  ValidationResult,
  FileMetadata,
  ImageDimensions,
  ImageMetadata,
  ChangeLogEntry,
  AuditTrail,
  Address,
  GeoLocation,
  AddressWithGeo,
  Money,
  PriceRange,
  Duration,
  DateRange,
  DateTimeRange,
  UserRef,
  EmployeeRef,
} from "./common";

export {
  isApiSuccess,
  isApiError,
  isDeleted,
  isActive,
} from "./common";

// Entity types
export type {
  // System Core
  Tenant,
  User,
  Role,
  Department,
  // CRM Core
  EmployeeType,
  EmployeeStatus,
  Employee,
  ContactType,
  ContactStatus,
  Contact,
  DealStage,
  DealPriority,
  Deal,
  ActivityType,
  Activity,
  Tag,
  EntityTag,
  // Leads & Communication
  LeadStatus,
  LeadSource,
  Lead,
  EmailTemplate,
  EmailSequence,
  EmailSequenceStep,
  SmsCampaign,
  // Tasks & Calendar
  Task,
  CalendarEvent,
  // Products & Quotations
  Product,
  PricingTier,
  QuotationStatus,
  Quotation,
  QuotationLineItem,
  // Contracts & Commissions
  ContractStatus,
  Contract,
  ContractAmendment,
  CommissionTier,
  BonusRule,
  SalesRepCommission,
  CommissionBonus,
  // Support
  TicketStatus,
  SupportTicket,
  TicketMessage,
  Vendor,
  VendorContract,
  Partner,
  // Customer Success
  HealthScore,
  CustomerHealth,
  HealthMetric,
  HealthScoreTrend,
  NpsFeedback,
  ClientNpsSnapshot,
  ChurnRiskAccount,
  Renewal,
} from "./entities";

// API types
export type {
  CreateRequest,
  UpdateRequest,
  DeleteRequest,
  BulkCreateRequest,
  BulkUpdateRequest,
  BulkOperationResponse,
  // Contact API
  CreateContactRequest,
  UpdateContactRequest,
  ContactFilters,
  GetContactsRequest,
  GetContactsResponse,
  GetContactResponse,
  CreateContactResponse,
  UpdateContactResponse,
  DeleteContactResponse,
  // Deal API
  CreateDealRequest,
  UpdateDealRequest,
  DealFilters,
  GetDealsRequest,
  GetDealsResponse,
  GetDealResponse,
  CreateDealResponse,
  UpdateDealResponse,
  ChangeDealStageRequest,
  ChangeDealStageResponse,
  // Lead API
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadFilters,
  GetLeadsRequest,
  GetLeadsResponse,
  ConvertLeadRequest,
  ConvertLeadResponse,
  // Employee API
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeFilters,
  GetEmployeesRequest,
  GetEmployeesResponse,
  // Activity API
  CreateActivityRequest,
  UpdateActivityRequest,
  ActivityFilters,
  GetActivitiesRequest,
  GetActivitiesResponse,
  CompleteActivityRequest,
  // Product API
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  GetProductsRequest,
  GetProductsResponse,
  // Quotation API
  QuotationLineItemInput,
  CreateQuotationRequest,
  UpdateQuotationRequest,
  QuotationFilters,
  GetQuotationsRequest,
  GetQuotationsResponse,
  SendQuotationRequest,
  AcceptRejectQuotationRequest,
  // Contract API
  CreateContractRequest,
  UpdateContractRequest,
  ContractFilters,
  GetContractsRequest,
  GetContractsResponse,
  RenewContractRequest,
  // Support Ticket API
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketFilters,
  GetTicketsRequest,
  GetTicketsResponse,
  AddTicketMessageRequest,
  ResolveTicketRequest,
  // Search & AI
  GlobalSearchRequest,
  SearchResultItem,
  GlobalSearchResponse,
  AiScoringRequest,
  AiScoringResponse,
  AiRecommendationRequest,
  AiRecommendationResponse,
  // Export & Import
  ExportFormat,
  ExportRequest,
  ExportResponse,
  ImportRequest,
  ImportResponse,
} from "./api";

// Form types
export type {
  FormMode,
  FormSubmissionState,
  FormState,
  FieldValidationRule,
  FieldMetadata,
  ContactFormData,
  ContactFormValidation,
  DealFormData,
  DealFormValidation,
  LeadFormData,
  LeadFormValidation,
  ActivityFormData,
  ActivityFormValidation,
  ProductFormData,
  ProductFormValidation,
  QuotationLineItemFormData,
  QuotationFormData,
  QuotationFormValidation,
  ContractFormData,
  ContractFormValidation,
  TicketFormData,
  TicketFormValidation,
  CustomFieldDefinition,
  DynamicFormSchema,
  FormAction,
  FormEventHandlers,
  ValidatorFunction,
  FieldValidatorFunction,
} from "./forms";

export {
  CONTACT_FORM_FIELDS,
  DEAL_FORM_FIELDS,
  LEAD_FORM_FIELDS,
  ACTIVITY_FORM_FIELDS,
  PRODUCT_FORM_FIELDS,
  TICKET_FORM_FIELDS,
} from "./forms";

// View types
export type {
  ViewMode,
  TableDensity,
  CardSize,
  ColumnDataType,
  ColumnAlignment,
  ColumnDefinition,
  ColumnPreset,
  FilterPreset,
  QuickFilter,
  ViewConfig,
  ViewState,
  KanbanColumn,
  KanbanCard,
  KanbanViewConfig,
  CalendarViewMode,
  CalendarEvent,
  CalendarViewConfig,
  TimelineItem,
  TimelineGroup,
  RowSelectionState,
  InlineEditState,
  TableAction,
  BulkAction,
  ExportOptions,
  Facet,
  FacetedFilter,
  AdvancedSearchConfig,
  WidgetType,
  WidgetSize,
  DashboardWidget,
  DashboardLayout,
  ListItemConfig,
  ListViewConfig,
  CardFieldConfig,
  CardViewConfig,
  UserViewPreferences,
} from "./views";

export {
  isTableView,
  isKanbanView,
  isCalendarView,
  isColumnEditable,
  isColumnSortable,
} from "./views";

// Hook types
export type {
  LoadingState,
  UseQueryResult,
  UsePaginatedQueryResult,
  UseMutationResult,
  UseListResult,
  UseDetailResult,
  UseCreateResult,
  UseUpdateResult,
  UseDeleteResult,
  UseCrudResult,
  UseFormResult,
  UseFormArrayResult,
  UseDataTableResult,
  UseColumnManagementResult,
  UseInlineEditResult,
  UseRowSelectionResult,
  UseFiltersResult,
  UseSearchResult,
  UseModalResult,
  UseDrawerResult,
  UseToastResult,
  ToastOptions,
  UseConfirmResult,
  ConfirmOptions,
  UsePaginationResult,
  UseSortingResult,
  UseLocalStorageResult,
  UseUserPreferencesResult,
  UseDebounceResult,
  UseThrottleResult,
  UseWebSocketResult,
  UseSubscriptionResult,
  UseExportResult,
  UseImportResult,
} from "./hooks";

// Legacy compatibility (gradual migration from crm.ts)
export type {
  // Re-export some legacy types from crm.ts for backward compatibility
  // TODO: Migrate all usages to new type system and remove this section
} from "./crm";

/* ============================================================
 * Type Utilities
 * ============================================================ */

/** Make all properties optional except specified keys */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/** Make all properties required except specified keys */
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

/** Deep partial (recursive) */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Deep readonly (recursive) */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/** Extract keys of a specific type */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/** Nullable type */
export type Nullable<T> = T | null;

/** Optional type */
export type Optional<T> = T | undefined;

/** Array or single item */
export type ArrayOrSingle<T> = T | T[];

/** Async function */
export type AsyncFunction<T = void> = () => Promise<T>;

/** Callback function */
export type Callback<T = void> = (data: T) => void;

/** Error handler */
export type ErrorHandler = (error: Error) => void;

/** Value or promise */
export type MaybePromise<T> = T | Promise<T>;

/** Extract entity ID type */
export type EntityId<T extends BaseEntity> = T["id"];

/** Extract entity type name */
export type EntityTypeName = 
  | "contact"
  | "deal"
  | "lead"
  | "employee"
  | "activity"
  | "task"
  | "product"
  | "quotation"
  | "contract"
  | "ticket"
  | "vendor"
  | "partner"
  | "tag";

/** Entity type map */
export interface EntityTypeMap {
  contact: Contact;
  deal: Deal;
  lead: Lead;
  employee: Employee;
  activity: Activity;
  task: Task;
  product: Product;
  quotation: Quotation;
  contract: Contract;
  ticket: SupportTicket;
  vendor: Vendor;
  partner: Partner;
  tag: Tag;
}

/** Get entity type by name */
export type GetEntityType<T extends EntityTypeName> = EntityTypeMap[T];

/* ============================================================
 * Constants
 * ============================================================ */

/** Default pagination */
export const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  pageSize: 25,
  totalItems: 0,
  totalPages: 0,
};

/** Page size options */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200] as const;

/** Default sort direction */
export const DEFAULT_SORT_DIRECTION: SortDirection = "asc";

/** Date format */
export const DATE_FORMAT = "yyyy-MM-dd";

/** DateTime format */
export const DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

/** Currency symbols */
export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  VND: "₫",
  USD: "$",
  EUR: "€",
  JPY: "¥",
  SGD: "S$",
};

/** Priority colors */
export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "gray",
  medium: "blue",
  high: "orange",
  urgent: "red",
};

/** Status colors */
export const STATUS_COLORS: Record<string, string> = {
  active: "green",
  inactive: "gray",
  pending: "yellow",
  completed: "green",
  cancelled: "red",
  draft: "gray",
  sent: "blue",
  accepted: "green",
  rejected: "red",
  expired: "orange",
};

/* ============================================================
 * Type Assertions & Guards
 * ============================================================ */

/** Assert entity has ID */
export function assertHasId<T extends BaseEntity>(entity: Partial<T>): asserts entity is T {
  if (!entity.id) {
    throw new Error("Entity must have an ID");
  }
}

/** Assert entity has tenant ID */
export function assertHasTenantId<T extends BaseEntity>(
  entity: Partial<T>
): asserts entity is T {
  if (!entity.tenantId) {
    throw new Error("Entity must have a tenant ID");
  }
}

/** Check if value is UUID */
export function isUUID(value: unknown): value is UUID {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

/** Check if entity is contact */
export function isContact(entity: unknown): entity is Contact {
  return typeof entity === "object" && entity !== null && "contactType" in entity;
}

/** Check if entity is deal */
export function isDeal(entity: unknown): entity is Deal {
  return typeof entity === "object" && entity !== null && "stage" in entity && "probability" in entity;
}

/** Check if entity is lead */
export function isLead(entity: unknown): entity is Lead {
  return typeof entity === "object" && entity !== null && "leadScore" in entity && "source" in entity;
}
