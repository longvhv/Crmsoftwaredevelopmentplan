/* ============================================================
 * API Types - Request & Response Schemas
 * RESTful API theo chuẩn /api/{service}/v1/{resource}
 * ============================================================ */

import type {
  UUID,
  ISODateTime,
  BaseEntity,
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  ValidationError,
} from "./common";

import type {
  Contact,
  Deal,
  Lead,
  Employee,
  Activity,
  Task,
  Product,
  Quotation,
  Contract,
  SupportTicket,
  ContactType,
  ContactStatus,
  DealStage,
  DealPriority,
  LeadStatus,
  LeadSource,
  EmployeeType,
  EmployeeStatus,
  ActivityType,
  TaskStatus,
  Priority,
  QuotationStatus,
  ContractStatus,
  TicketStatus,
} from "./entities";

/* ============================================================
 * Generic CRUD Operations
 * ============================================================ */

/** Create request (partial entity without system fields) */
export type CreateRequest<T extends BaseEntity> = Omit<
  T,
  "id" | "tenantId" | "version" | "createdAt" | "updatedAt" | "deletedAt"
>;

/** Update request (partial entity with version for optimistic locking) */
export type UpdateRequest<T extends BaseEntity> = Partial<
  Omit<T, "id" | "tenantId" | "createdAt" | "updatedAt" | "deletedAt">
> & {
  version: number; // Required for optimistic locking
};

/** Delete request */
export interface DeleteRequest {
  /** IDs to delete (soft delete) */
  ids: UUID[];
  /** Hard delete (physical removal - dangerous!) */
  hardDelete?: boolean;
}

/** Bulk create request */
export interface BulkCreateRequest<T extends BaseEntity> {
  items: CreateRequest<T>[];
  /** Skip validation errors and continue */
  skipErrors?: boolean;
}

/** Bulk update request */
export interface BulkUpdateRequest<T extends BaseEntity> {
  items: (UpdateRequest<T> & { id: UUID })[];
  skipErrors?: boolean;
}

/** Bulk operation response */
export interface BulkOperationResponse {
  success: boolean;
  totalItems: number;
  successCount: number;
  failureCount: number;
  errors?: Array<{
    index: number;
    itemId?: UUID;
    errors: ValidationError[];
  }>;
}

/* ============================================================
 * CONTACT API
 * ============================================================ */

/** Create contact request */
export interface CreateContactRequest {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  contactType: ContactType;
  status?: ContactStatus;
  source?: string;
  ownerId?: UUID;
  tags?: UUID[];
  customFields?: Record<string, unknown>;
}

/** Update contact request */
export interface UpdateContactRequest extends Partial<CreateContactRequest> {
  version: number;
}

/** Contact list filters */
export interface ContactFilters {
  contactType?: ContactType[];
  status?: ContactStatus[];
  ownerId?: UUID[];
  source?: string[];
  minLeadScore?: number;
  maxLeadScore?: number;
  minLifetimeValue?: number;
  maxLifetimeValue?: number;
  hasEmail?: boolean;
  hasPhone?: boolean;
  tags?: UUID[];
  createdAfter?: ISODateTime;
  createdBefore?: ISODateTime;
}

/** Contact list request */
export interface GetContactsRequest extends QueryParams {
  filters?: ContactFilters;
}

/** Contact list response */
export type GetContactsResponse = PaginatedResponse<Contact>;

/** Single contact response */
export type GetContactResponse = ApiResponse<Contact>;

/** Create contact response */
export type CreateContactResponse = ApiResponse<Contact>;

/** Update contact response */
export type UpdateContactResponse = ApiResponse<Contact>;

/** Delete contact response */
export type DeleteContactResponse = ApiResponse<{ deletedCount: number }>;

/* ============================================================
 * DEAL API
 * ============================================================ */

/** Create deal request */
export interface CreateDealRequest {
  name: string;
  contactId?: UUID;
  value: number;
  currency?: string;
  stage?: DealStage;
  priority?: DealPriority;
  probability?: number;
  ownerId?: UUID;
  source?: string;
  expectedCloseDate?: string;
  pipeline?: string;
  tags?: UUID[];
  customFields?: Record<string, unknown>;
}

/** Update deal request */
export interface UpdateDealRequest extends Partial<CreateDealRequest> {
  version: number;
}

/** Deal list filters */
export interface DealFilters {
  stage?: DealStage[];
  priority?: DealPriority[];
  ownerId?: UUID[];
  contactId?: UUID[];
  minValue?: number;
  maxValue?: number;
  minProbability?: number;
  maxProbability?: number;
  pipeline?: string[];
  expectedCloseAfter?: string;
  expectedCloseBefore?: string;
  won?: boolean;
  tags?: UUID[];
}

/** Deal list request */
export interface GetDealsRequest extends QueryParams {
  filters?: DealFilters;
}

/** Deal list response */
export type GetDealsResponse = PaginatedResponse<Deal>;

/** Single deal response */
export type GetDealResponse = ApiResponse<Deal>;

/** Create deal response */
export type CreateDealResponse = ApiResponse<Deal>;

/** Update deal response */
export type UpdateDealResponse = ApiResponse<Deal>;

/** Deal stage change request */
export interface ChangeDealStageRequest {
  newStage: DealStage;
  probability?: number;
  notes?: string;
  version: number;
}

/** Deal stage change response */
export type ChangeDealStageResponse = ApiResponse<Deal>;

/* ============================================================
 * LEAD API
 * ============================================================ */

/** Create lead request */
export interface CreateLeadRequest {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  status?: LeadStatus;
  source: LeadSource;
  ownerId?: UUID;
  notes?: string;
  tags?: UUID[];
  customFields?: Record<string, unknown>;
}

/** Update lead request */
export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {
  version: number;
}

/** Lead list filters */
export interface LeadFilters {
  status?: LeadStatus[];
  source?: LeadSource[];
  ownerId?: UUID[];
  minLeadScore?: number;
  maxLeadScore?: number;
  qualifiedAfter?: ISODateTime;
  qualifiedBefore?: ISODateTime;
  tags?: UUID[];
}

/** Lead list request */
export interface GetLeadsRequest extends QueryParams {
  filters?: LeadFilters;
}

/** Lead list response */
export type GetLeadsResponse = PaginatedResponse<Lead>;

/** Lead conversion request */
export interface ConvertLeadRequest {
  /** Create contact */
  createContact: boolean;
  /** Create deal */
  createDeal: boolean;
  /** Deal value if creating deal */
  dealValue?: number;
  /** Deal stage if creating deal */
  dealStage?: DealStage;
  /** Notes for conversion */
  notes?: string;
  version: number;
}

/** Lead conversion response */
export interface ConvertLeadResponse {
  success: true;
  lead: Lead;
  contact?: Contact;
  deal?: Deal;
  message: string;
}

/* ============================================================
 * EMPLOYEE API
 * ============================================================ */

/** Create employee request */
export interface CreateEmployeeRequest {
  employeeCode?: string;
  fullName: string;
  email: string;
  phone?: string;
  departmentId?: UUID;
  position?: string;
  employeeType: EmployeeType;
  status?: EmployeeStatus;
  hireDate?: string;
  managerId?: UUID;
  skills?: string[];
}

/** Update employee request */
export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  version: number;
}

/** Employee list filters */
export interface EmployeeFilters {
  employeeType?: EmployeeType[];
  status?: EmployeeStatus[];
  departmentId?: UUID[];
  managerId?: UUID[];
  skills?: string[];
}

/** Employee list request */
export interface GetEmployeesRequest extends QueryParams {
  filters?: EmployeeFilters;
}

/** Employee list response */
export type GetEmployeesResponse = PaginatedResponse<Employee>;

/* ============================================================
 * ACTIVITY API
 * ============================================================ */

/** Create activity request */
export interface CreateActivityRequest {
  activityType: ActivityType;
  subject: string;
  description?: string;
  contactId?: UUID;
  dealId?: UUID;
  ownerId?: UUID;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: ISODateTime;
}

/** Update activity request */
export interface UpdateActivityRequest extends Partial<CreateActivityRequest> {
  version: number;
  completedAt?: ISODateTime;
  outcome?: string;
}

/** Activity list filters */
export interface ActivityFilters {
  activityType?: ActivityType[];
  status?: TaskStatus[];
  priority?: Priority[];
  ownerId?: UUID[];
  contactId?: UUID[];
  dealId?: UUID[];
  dueDateAfter?: ISODateTime;
  dueDateBefore?: ISODateTime;
}

/** Activity list request */
export interface GetActivitiesRequest extends QueryParams {
  filters?: ActivityFilters;
}

/** Activity list response */
export type GetActivitiesResponse = PaginatedResponse<Activity>;

/** Mark activity complete request */
export interface CompleteActivityRequest {
  outcome?: string;
  version: number;
}

/* ============================================================
 * PRODUCT API
 * ============================================================ */

/** Create product request */
export interface CreateProductRequest {
  name: string;
  sku: string;
  description?: string;
  category?: string;
  basePrice: number;
  currency?: string;
  stockQuantity?: number;
  tags?: UUID[];
}

/** Update product request */
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  version: number;
  isActive?: boolean;
}

/** Product list filters */
export interface ProductFilters {
  category?: string[];
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: UUID[];
}

/** Product list request */
export interface GetProductsRequest extends QueryParams {
  filters?: ProductFilters;
}

/** Product list response */
export type GetProductsResponse = PaginatedResponse<Product>;

/* ============================================================
 * QUOTATION API
 * ============================================================ */

/** Quotation line item input */
export interface QuotationLineItemInput {
  productId: UUID;
  pricingTierId?: UUID;
  quantity: number;
  unitPrice?: number;
  discount?: number;
}

/** Create quotation request */
export interface CreateQuotationRequest {
  contactId: UUID;
  dealId?: UUID;
  validUntil?: string;
  lineItems: QuotationLineItemInput[];
  discount?: number;
  notes?: string;
}

/** Update quotation request */
export interface UpdateQuotationRequest
  extends Partial<Omit<CreateQuotationRequest, "lineItems">> {
  version: number;
  status?: QuotationStatus;
}

/** Quotation list filters */
export interface QuotationFilters {
  status?: QuotationStatus[];
  contactId?: UUID[];
  dealId?: UUID[];
  validUntilAfter?: string;
  validUntilBefore?: string;
  minTotal?: number;
  maxTotal?: number;
}

/** Quotation list request */
export interface GetQuotationsRequest extends QueryParams {
  filters?: QuotationFilters;
}

/** Quotation list response */
export type GetQuotationsResponse = PaginatedResponse<Quotation>;

/** Send quotation request */
export interface SendQuotationRequest {
  emailTemplateId?: UUID;
  recipientEmail?: string;
  customMessage?: string;
  version: number;
}

/** Accept/Reject quotation request */
export interface AcceptRejectQuotationRequest {
  accept: boolean;
  notes?: string;
  version: number;
}

/* ============================================================
 * CONTRACT API
 * ============================================================ */

/** Create contract request */
export interface CreateContractRequest {
  contactId: UUID;
  dealId?: UUID;
  quotationId?: UUID;
  startDate: string;
  endDate?: string;
  value: number;
  currency?: string;
  autoRenew?: boolean;
  terms?: string;
}

/** Update contract request */
export interface UpdateContractRequest extends Partial<CreateContractRequest> {
  version: number;
  status?: ContractStatus;
}

/** Contract list filters */
export interface ContractFilters {
  status?: ContractStatus[];
  contactId?: UUID[];
  dealId?: UUID[];
  startDateAfter?: string;
  startDateBefore?: string;
  endDateAfter?: string;
  endDateBefore?: string;
  autoRenew?: boolean;
  minValue?: number;
  maxValue?: number;
}

/** Contract list request */
export interface GetContractsRequest extends QueryParams {
  filters?: ContractFilters;
}

/** Contract list response */
export type GetContractsResponse = PaginatedResponse<Contract>;

/** Renew contract request */
export interface RenewContractRequest {
  newEndDate: string;
  newValue?: number;
  notes?: string;
  version: number;
}

/* ============================================================
 * SUPPORT TICKET API
 * ============================================================ */

/** Create ticket request */
export interface CreateTicketRequest {
  contactId?: UUID;
  subject: string;
  description: string;
  priority?: Priority;
  assignedTo?: UUID;
}

/** Update ticket request */
export interface UpdateTicketRequest extends Partial<CreateTicketRequest> {
  version: number;
  status?: TicketStatus;
  resolution?: string;
}

/** Ticket list filters */
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: Priority[];
  assignedTo?: UUID[];
  contactId?: UUID[];
  createdAfter?: ISODateTime;
  createdBefore?: ISODateTime;
}

/** Ticket list request */
export interface GetTicketsRequest extends QueryParams {
  filters?: TicketFilters;
}

/** Ticket list response */
export type GetTicketsResponse = PaginatedResponse<SupportTicket>;

/** Add ticket message request */
export interface AddTicketMessageRequest {
  message: string;
  isInternal?: boolean;
}

/** Resolve ticket request */
export interface ResolveTicketRequest {
  resolution: string;
  version: number;
}

/* ============================================================
 * SEARCH & AI
 * ============================================================ */

/** Global search request */
export interface GlobalSearchRequest {
  query: string;
  /** Entity types to search */
  entityTypes?: string[];
  /** Maximum results per entity type */
  limit?: number;
}

/** Search result item */
export interface SearchResultItem {
  entityType: string;
  entityId: UUID;
  title: string;
  description?: string;
  score: number;
  highlights?: string[];
}

/** Global search response */
export interface GlobalSearchResponse {
  success: true;
  results: SearchResultItem[];
  totalResults: number;
  query: string;
  timestamp: ISODateTime;
}

/** AI scoring request */
export interface AiScoringRequest {
  entityType: "contact" | "lead" | "deal";
  entityId: UUID;
  /** Force re-scoring even if recent score exists */
  forceRefresh?: boolean;
}

/** AI scoring response */
export interface AiScoringResponse {
  success: true;
  entityId: UUID;
  score: number;
  confidence: number;
  factors: Array<{
    name: string;
    weight: number;
    value: number;
  }>;
  timestamp: ISODateTime;
}

/** AI recommendation request */
export interface AiRecommendationRequest {
  context: "next_action" | "email_subject" | "deal_strategy";
  entityType: string;
  entityId: UUID;
  additionalContext?: Record<string, unknown>;
}

/** AI recommendation response */
export interface AiRecommendationResponse {
  success: true;
  recommendations: Array<{
    title: string;
    description: string;
    confidence: number;
    action?: string;
  }>;
  timestamp: ISODateTime;
}

/* ============================================================
 * EXPORTS & IMPORTS
 * ============================================================ */

/** Export format */
export type ExportFormat = "csv" | "excel" | "json" | "pdf";

/** Export request */
export interface ExportRequest<T = unknown> {
  entityType: string;
  format: ExportFormat;
  filters?: T;
  fields?: string[];
  /** Include soft-deleted records */
  includeDeleted?: boolean;
}

/** Export response */
export interface ExportResponse {
  success: true;
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  recordCount: number;
  expiresAt: ISODateTime;
}

/** Import request */
export interface ImportRequest {
  entityType: string;
  /** File upload URL or base64 data */
  fileData: string;
  /** Mapping of CSV columns to entity fields */
  fieldMapping?: Record<string, string>;
  /** Skip validation errors */
  skipErrors?: boolean;
  /** Update existing records by matching field */
  updateMatchField?: string;
}

/** Import response */
export interface ImportResponse {
  success: true;
  totalRows: number;
  successCount: number;
  failureCount: number;
  updateCount: number;
  errors?: Array<{
    row: number;
    errors: ValidationError[];
  }>;
}
