/* ============================================================
 * Mock Leads API
 * Full CRUD + filters + search + pagination
 * ============================================================ */

import type { Lead, LeadStatus, LeadSource } from "@/types";
import { useMockStore } from "@/data/mockStore";
import {
  simulateRandomDelay,
  buildSuccessResponse,
  buildErrorResponse,
  buildPaginatedResponse,
  paginate,
  applySorting,
  searchInFields,
  filterByDateRange,
  excludeDeleted,
  generateUUID,
  validateRequiredFields,
  isValidUUID,
  HTTP_STATUS,
  type PaginationParams,
  type SortParams,
  type ApiResponse,
  type PaginatedResponse,
  type ApiError,
} from "./utils";

/* ============================================================
 * Types
 * ============================================================ */

export interface LeadFilters {
  status?: LeadStatus | LeadStatus[];
  source?: LeadSource | LeadSource[];
  ownerId?: string;
  search?: string;
  createdAfter?: string;
  createdBefore?: string;
  minLeadScore?: number;
  maxLeadScore?: number;
  qualified?: boolean;
  converted?: boolean;
}

export interface GetLeadsParams extends PaginationParams, SortParams {
  filters?: LeadFilters;
  includeDeleted?: boolean;
}

export interface CreateLeadDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source: LeadSource;
  status?: LeadStatus;
  ownerId?: string;
  customFields?: Record<string, unknown>;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {
  leadScore?: number;
  tags?: string[];
}

export interface ConvertLeadDto {
  createContact?: boolean;
  createDeal?: boolean;
  dealValue?: number;
}

/* ============================================================
 * API Functions
 * ============================================================ */

/** Get all leads with filters, search, pagination */
export async function getLeads(
  params: GetLeadsParams = {}
): Promise<PaginatedResponse<Lead> | ApiError> {
  await simulateRandomDelay();

  try {
    const store = useMockStore.getState();
    let leads = [...store.leads];

    // Exclude deleted
    if (!params.includeDeleted) {
      leads = excludeDeleted(leads);
    }

    // Apply filters
    if (params.filters) {
      leads = applyLeadFilters(leads, params.filters);
    }

    // Apply sorting
    leads = applySorting(leads, params);

    // Paginate
    const { data, total } = paginate(leads, params);

    return buildPaginatedResponse(data, params, total);
  } catch (error) {
    return buildErrorResponse(
      "FETCH_ERROR",
      error instanceof Error ? error.message : "Failed to fetch leads",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

/** Get single lead by ID */
export async function getLeadById(id: string): Promise<ApiResponse<Lead> | ApiError> {
  await simulateRandomDelay();

  if (!isValidUUID(id)) {
    return buildErrorResponse("INVALID_ID", "Invalid lead ID format", HTTP_STATUS.BAD_REQUEST);
  }

  const store = useMockStore.getState();
  const lead = store.leads.find((l) => l.id === id && !l.deletedAt);

  if (!lead) {
    return buildErrorResponse("NOT_FOUND", "Lead not found", HTTP_STATUS.NOT_FOUND);
  }

  return buildSuccessResponse(lead);
}

/** Create new lead */
export async function createLead(dto: CreateLeadDto): Promise<ApiResponse<Lead> | ApiError> {
  await simulateRandomDelay();

  // Validate
  const errors = validateRequiredFields(dto, ["firstName", "lastName", "email", "source"]);
  if (errors.length > 0) {
    return buildErrorResponse("VALIDATION_ERROR", errors.join(", "), HTTP_STATUS.BAD_REQUEST);
  }

  // Check for duplicate email
  const store = useMockStore.getState();
  const duplicate = store.leads.find((l) => l.email === dto.email && !l.deletedAt);
  if (duplicate) {
    return buildErrorResponse(
      "DUPLICATE_EMAIL",
      "Lead with this email already exists",
      HTTP_STATUS.CONFLICT
    );
  }

  // Create lead
  const now = new Date().toISOString();
  const tenantId = "018d0001-0001-7001-8001-000000000001";

  const lead: Lead = {
    id: generateUUID(),
    tenantId,
    version: 1,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,

    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: `${dto.lastName} ${dto.firstName}`,
    email: dto.email,
    phone: dto.phone,
    company: dto.company,
    jobTitle: dto.jobTitle,

    status: dto.status || "new",
    source: dto.source,
    ownerId: dto.ownerId,

    leadScore: 50,

    qualifiedAt: undefined,
    convertedAt: undefined,
    convertedToContactId: undefined,

    aiScore: 50,
    aiMetadata: {
      lastScoredAt: now,
      scoringModel: "lead-ai-v1.2",
      confidence: 0.75,
      factors: [],
    },

    tags: [],
    customFields: dto.customFields || {},
  };

  // Add to store
  store.addLead(lead);

  return buildSuccessResponse(lead, "Lead created successfully");
}

/** Update lead */
export async function updateLead(
  id: string,
  dto: UpdateLeadDto
): Promise<ApiResponse<Lead> | ApiError> {
  await simulateRandomDelay();

  if (!isValidUUID(id)) {
    return buildErrorResponse("INVALID_ID", "Invalid lead ID format", HTTP_STATUS.BAD_REQUEST);
  }

  const store = useMockStore.getState();
  const lead = store.leads.find((l) => l.id === id && !l.deletedAt);

  if (!lead) {
    return buildErrorResponse("NOT_FOUND", "Lead not found", HTTP_STATUS.NOT_FOUND);
  }

  // Check for duplicate email (if changing)
  if (dto.email && dto.email !== lead.email) {
    const duplicate = store.leads.find(
      (l) => l.email === dto.email && !l.deletedAt && l.id !== id
    );
    if (duplicate) {
      return buildErrorResponse(
        "DUPLICATE_EMAIL",
        "Lead with this email already exists",
        HTTP_STATUS.CONFLICT
      );
    }
  }

  // Update fullName if firstName/lastName changed
  const updates: Partial<Lead> = { ...dto };
  if (dto.firstName || dto.lastName) {
    const firstName = dto.firstName || lead.firstName;
    const lastName = dto.lastName || lead.lastName;
    updates.fullName = `${lastName} ${firstName}`;
  }

  // Auto-set qualifiedAt when status changes to qualified
  if (dto.status === "qualified" && lead.status !== "qualified") {
    updates.qualifiedAt = new Date().toISOString();
  }

  // Update store
  store.updateLead(id, updates);

  // Get updated lead
  const updated = store.leads.find((l) => l.id === id);
  if (!updated) {
    return buildErrorResponse(
      "UPDATE_ERROR",
      "Failed to update lead",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  return buildSuccessResponse(updated, "Lead updated successfully");
}

/** Delete lead (soft delete) */
export async function deleteLead(id: string): Promise<ApiResponse<void> | ApiError> {
  await simulateRandomDelay();

  if (!isValidUUID(id)) {
    return buildErrorResponse("INVALID_ID", "Invalid lead ID format", HTTP_STATUS.BAD_REQUEST);
  }

  const store = useMockStore.getState();
  const lead = store.leads.find((l) => l.id === id && !l.deletedAt);

  if (!lead) {
    return buildErrorResponse("NOT_FOUND", "Lead not found", HTTP_STATUS.NOT_FOUND);
  }

  // Soft delete
  store.deleteLead(id);

  return buildSuccessResponse(undefined, "Lead deleted successfully");
}

/** Qualify lead */
export async function qualifyLead(id: string): Promise<ApiResponse<Lead> | ApiError> {
  return updateLead(id, { status: "qualified" });
}

/** Convert lead to contact */
export async function convertLead(
  id: string,
  dto: ConvertLeadDto = {}
): Promise<
  ApiResponse<{ lead: Lead; contactId?: string; dealId?: string }> | ApiError
> {
  await simulateRandomDelay();

  if (!isValidUUID(id)) {
    return buildErrorResponse("INVALID_ID", "Invalid lead ID format", HTTP_STATUS.BAD_REQUEST);
  }

  const store = useMockStore.getState();
  const lead = store.leads.find((l) => l.id === id && !l.deletedAt);

  if (!lead) {
    return buildErrorResponse("NOT_FOUND", "Lead not found", HTTP_STATUS.NOT_FOUND);
  }

  if (lead.status === "converted") {
    return buildErrorResponse(
      "ALREADY_CONVERTED",
      "Lead is already converted",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const now = new Date().toISOString();
  let contactId: string | undefined;
  let dealId: string | undefined;

  // Create contact if requested
  if (dto.createContact !== false) {
    contactId = generateUUID();
    // In real app, would call createContact API
    // For now, just generate ID
  }

  // Create deal if requested
  if (dto.createDeal && dto.dealValue) {
    dealId = generateUUID();
    // In real app, would call createDeal API
  }

  // Update lead to converted
  store.updateLead(id, {
    status: "converted",
    convertedAt: now,
    convertedToContactId: contactId,
  });

  const updated = store.leads.find((l) => l.id === id);
  if (!updated) {
    return buildErrorResponse(
      "CONVERT_ERROR",
      "Failed to convert lead",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  return buildSuccessResponse(
    { lead: updated, contactId, dealId },
    "Lead converted successfully"
  );
}

/** Search leads (quick search) */
export async function searchLeads(
  query: string,
  limit: number = 10
): Promise<ApiResponse<Lead[]> | ApiError> {
  await simulateRandomDelay();

  const store = useMockStore.getState();
  let leads = excludeDeleted(store.leads);

  // Search in multiple fields
  leads = searchInFields(leads, query, ["fullName", "email", "company", "phone"]);

  // Limit results
  leads = leads.slice(0, limit);

  return buildSuccessResponse(leads);
}

/** Get lead stats */
export async function getLeadStats(): Promise<
  ApiResponse<{
    total: number;
    byStatus: Record<LeadStatus, number>;
    bySource: Record<LeadSource, number>;
    avgLeadScore: number;
    qualifiedCount: number;
    convertedCount: number;
    conversionRate: number;
  }> | ApiError
> {
  await simulateRandomDelay();

  const store = useMockStore.getState();
  const leads = excludeDeleted(store.leads);

  const byStatus: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  let totalLeadScore = 0;
  let qualifiedCount = 0;
  let convertedCount = 0;

  leads.forEach((lead) => {
    byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
    bySource[lead.source] = (bySource[lead.source] || 0) + 1;
    totalLeadScore += lead.leadScore;

    if (lead.status === "qualified" || lead.qualifiedAt) qualifiedCount++;
    if (lead.status === "converted" || lead.convertedAt) convertedCount++;
  });

  const conversionRate = leads.length > 0 ? (convertedCount / leads.length) * 100 : 0;

  return buildSuccessResponse({
    total: leads.length,
    byStatus: byStatus as Record<LeadStatus, number>,
    bySource: bySource as Record<LeadSource, number>,
    avgLeadScore: leads.length > 0 ? Math.round(totalLeadScore / leads.length) : 0,
    qualifiedCount,
    convertedCount,
    conversionRate: Math.round(conversionRate * 10) / 10,
  });
}

/* ============================================================
 * Helper Functions
 * ============================================================ */

/** Apply lead-specific filters */
function applyLeadFilters(leads: Lead[], filters: LeadFilters): Lead[] {
  let filtered = [...leads];

  // Status filter
  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
    filtered = filtered.filter((l) => statuses.includes(l.status));
  }

  // Source filter
  if (filters.source) {
    const sources = Array.isArray(filters.source) ? filters.source : [filters.source];
    filtered = filtered.filter((l) => sources.includes(l.source));
  }

  // Owner filter
  if (filters.ownerId) {
    filtered = filtered.filter((l) => l.ownerId === filters.ownerId);
  }

  // Search filter
  if (filters.search) {
    filtered = searchInFields(filtered, filters.search, [
      "fullName",
      "email",
      "company",
      "phone",
    ]);
  }

  // Date range filters
  if (filters.createdAfter || filters.createdBefore) {
    filtered = filterByDateRange(filtered, "createdAt", filters.createdAfter, filters.createdBefore);
  }

  // Lead score range
  if (filters.minLeadScore !== undefined) {
    filtered = filtered.filter((l) => l.leadScore >= filters.minLeadScore!);
  }
  if (filters.maxLeadScore !== undefined) {
    filtered = filtered.filter((l) => l.leadScore <= filters.maxLeadScore!);
  }

  // Qualified filter
  if (filters.qualified !== undefined) {
    filtered = filtered.filter((l) =>
      filters.qualified ? !!l.qualifiedAt : !l.qualifiedAt
    );
  }

  // Converted filter
  if (filters.converted !== undefined) {
    filtered = filtered.filter((l) =>
      filters.converted ? !!l.convertedAt : !l.convertedAt
    );
  }

  return filtered;
}
