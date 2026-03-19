/* ============================================================
 * Mock Contacts API
 * Full CRUD + filters + search + pagination
 * ============================================================ */

import type { Contact, ContactType, ContactStatus } from "@/types";
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

export interface ContactFilters {
  contactType?: ContactType | ContactType[];
  status?: ContactStatus | ContactStatus[];
  ownerId?: string;
  source?: string;
  search?: string;
  createdAfter?: string;
  createdBefore?: string;
  minLeadScore?: number;
  maxLeadScore?: number;
  minLifetimeValue?: number;
  hasCompany?: boolean;
  tags?: string[];
}

export interface GetContactsParams extends PaginationParams, SortParams {
  filters?: ContactFilters;
  includeDeleted?: boolean;
}

export interface CreateContactDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  contactType: ContactType;
  status?: ContactStatus;
  source?: string;
  ownerId?: string;
  customFields?: Record<string, unknown>;
}

export interface UpdateContactDto extends Partial<CreateContactDto> {
  leadScore?: number;
  lifetimeValue?: number;
  tags?: string[];
}

/* ============================================================
 * API Functions
 * ============================================================ */

/** Get all contacts with filters, search, pagination */
export async function getContacts(
  params: GetContactsParams = {}
): Promise<PaginatedResponse<Contact> | ApiError> {
  await simulateRandomDelay();

  try {
    const store = useMockStore.getState();
    let contacts = [...store.contacts];

    // Exclude deleted (unless explicitly requested)
    if (!params.includeDeleted) {
      contacts = excludeDeleted(contacts);
    }

    // Apply filters
    if (params.filters) {
      contacts = applyContactFilters(contacts, params.filters);
    }

    // Apply sorting
    contacts = applySorting(contacts, params);

    // Paginate
    const { data, total } = paginate(contacts, params);

    return buildPaginatedResponse(data, params, total);
  } catch (error) {
    return buildErrorResponse(
      "FETCH_ERROR",
      error instanceof Error ? error.message : "Failed to fetch contacts",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

/** Get single contact by ID */
export async function getContactById(
  id: string
): Promise<ApiResponse<Contact> | ApiError> {
  await simulateRandomDelay();

  if (!isValidUUID(id)) {
    return buildErrorResponse("INVALID_ID", "Invalid contact ID format", HTTP_STATUS.BAD_REQUEST);
  }

  const store = useMockStore.getState();
  const contact = store.contacts.find((c) => c.id === id && !c.deletedAt);

  if (!contact) {
    return buildErrorResponse("NOT_FOUND", "Contact not found", HTTP_STATUS.NOT_FOUND);
  }

  return buildSuccessResponse(contact);
}

/** Create new contact */
export async function createContact(
  dto: CreateContactDto
): Promise<ApiResponse<Contact> | ApiError> {
  await simulateRandomDelay();

  // Validate
  const errors = validateRequiredFields(dto, ["firstName", "lastName", "contactType"]);
  if (errors.length > 0) {
    return buildErrorResponse("VALIDATION_ERROR", errors.join(", "), HTTP_STATUS.BAD_REQUEST);
  }

  // Check for duplicate email
  if (dto.email) {
    const store = useMockStore.getState();
    const duplicate = store.contacts.find(
      (c) => c.email === dto.email && !c.deletedAt
    );
    if (duplicate) {
      return buildErrorResponse(
        "DUPLICATE_EMAIL",
        "Contact with this email already exists",
        HTTP_STATUS.CONFLICT
      );
    }
  }

  // Create contact
  const now = new Date().toISOString();
  const tenantId = "018d0001-0001-7001-8001-000000000001";

  const contact: Contact = {
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

    contactType: dto.contactType,
    status: dto.status || "active",
    source: dto.source,
    ownerId: dto.ownerId,

    leadScore: dto.contactType === "lead" ? 50 : undefined,
    lifetimeValue: 0,

    aiScore: 50,
    aiMetadata: {
      lastScoredAt: now,
      scoringModel: "crm-ai-v2.1",
      confidence: 0.75,
      factors: [],
    },

    tags: [],
    customFields: dto.customFields || {},
  };

  // Add to store
  useMockStore.getState().addContact(contact);

  return buildSuccessResponse(contact, "Contact created successfully");
}

/** Update contact */
export async function updateContact(
  id: string,
  dto: UpdateContactDto
): Promise<ApiResponse<Contact> | ApiError> {
  await simulateRandomDelay();

  if (!isValidUUID(id)) {
    return buildErrorResponse("INVALID_ID", "Invalid contact ID format", HTTP_STATUS.BAD_REQUEST);
  }

  const store = useMockStore.getState();
  const contact = store.contacts.find((c) => c.id === id && !c.deletedAt);

  if (!contact) {
    return buildErrorResponse("NOT_FOUND", "Contact not found", HTTP_STATUS.NOT_FOUND);
  }

  // Check for duplicate email (if changing email)
  if (dto.email && dto.email !== contact.email) {
    const duplicate = store.contacts.find(
      (c) => c.email === dto.email && !c.deletedAt && c.id !== id
    );
    if (duplicate) {
      return buildErrorResponse(
        "DUPLICATE_EMAIL",
        "Contact with this email already exists",
        HTTP_STATUS.CONFLICT
      );
    }
  }

  // Update fullName if firstName/lastName changed
  const updates: Partial<Contact> = { ...dto };
  if (dto.firstName || dto.lastName) {
    const firstName = dto.firstName || contact.firstName;
    const lastName = dto.lastName || contact.lastName;
    updates.fullName = `${lastName} ${firstName}`;
  }

  // Update store
  store.updateContact(id, updates);

  // Get updated contact
  const updated = store.contacts.find((c) => c.id === id);
  if (!updated) {
    return buildErrorResponse("UPDATE_ERROR", "Failed to update contact", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  return buildSuccessResponse(updated, "Contact updated successfully");
}

/** Delete contact (soft delete) */
export async function deleteContact(id: string): Promise<ApiResponse<void> | ApiError> {
  await simulateRandomDelay();

  if (!isValidUUID(id)) {
    return buildErrorResponse("INVALID_ID", "Invalid contact ID format", HTTP_STATUS.BAD_REQUEST);
  }

  const store = useMockStore.getState();
  const contact = store.contacts.find((c) => c.id === id && !c.deletedAt);

  if (!contact) {
    return buildErrorResponse("NOT_FOUND", "Contact not found", HTTP_STATUS.NOT_FOUND);
  }

  // Soft delete
  store.deleteContact(id);

  return buildSuccessResponse(undefined, "Contact deleted successfully");
}

/** Bulk delete contacts */
export async function bulkDeleteContacts(
  ids: string[]
): Promise<ApiResponse<{ deleted: number }> | ApiError> {
  await simulateRandomDelay();

  const store = useMockStore.getState();
  let deleted = 0;

  for (const id of ids) {
    const contact = store.contacts.find((c) => c.id === id && !c.deletedAt);
    if (contact) {
      store.deleteContact(id);
      deleted++;
    }
  }

  return buildSuccessResponse({ deleted }, `${deleted} contacts deleted successfully`);
}

/** Search contacts (quick search) */
export async function searchContacts(
  query: string,
  limit: number = 10
): Promise<ApiResponse<Contact[]> | ApiError> {
  await simulateRandomDelay();

  const store = useMockStore.getState();
  let contacts = excludeDeleted(store.contacts);

  // Search in multiple fields
  contacts = searchInFields(contacts, query, ["fullName", "email", "company", "phone"]);

  // Limit results
  contacts = contacts.slice(0, limit);

  return buildSuccessResponse(contacts);
}

/** Get contact stats */
export async function getContactStats(): Promise<
  ApiResponse<{
    total: number;
    byType: Record<ContactType, number>;
    byStatus: Record<ContactStatus, number>;
    avgLeadScore: number;
    totalLifetimeValue: number;
  }> | ApiError
> {
  await simulateRandomDelay();

  const store = useMockStore.getState();
  const contacts = excludeDeleted(store.contacts);

  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  let totalLeadScore = 0;
  let leadCount = 0;
  let totalLifetimeValue = 0;

  contacts.forEach((contact) => {
    // Count by type
    byType[contact.contactType] = (byType[contact.contactType] || 0) + 1;

    // Count by status
    byStatus[contact.status] = (byStatus[contact.status] || 0) + 1;

    // Lead score
    if (contact.leadScore !== undefined) {
      totalLeadScore += contact.leadScore;
      leadCount++;
    }

    // LTV
    totalLifetimeValue += contact.lifetimeValue || 0;
  });

  return buildSuccessResponse({
    total: contacts.length,
    byType: byType as Record<ContactType, number>,
    byStatus: byStatus as Record<ContactStatus, number>,
    avgLeadScore: leadCount > 0 ? Math.round(totalLeadScore / leadCount) : 0,
    totalLifetimeValue,
  });
}

/* ============================================================
 * Helper Functions
 * ============================================================ */

/** Apply contact-specific filters */
function applyContactFilters(contacts: Contact[], filters: ContactFilters): Contact[] {
  let filtered = [...contacts];

  // Type filter
  if (filters.contactType) {
    const types = Array.isArray(filters.contactType)
      ? filters.contactType
      : [filters.contactType];
    filtered = filtered.filter((c) => types.includes(c.contactType));
  }

  // Status filter
  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
    filtered = filtered.filter((c) => statuses.includes(c.status));
  }

  // Owner filter
  if (filters.ownerId) {
    filtered = filtered.filter((c) => c.ownerId === filters.ownerId);
  }

  // Source filter
  if (filters.source) {
    filtered = filtered.filter((c) => c.source === filters.source);
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
    filtered = filterByDateRange(
      filtered,
      "createdAt",
      filters.createdAfter,
      filters.createdBefore
    );
  }

  // Lead score range
  if (filters.minLeadScore !== undefined) {
    filtered = filtered.filter(
      (c) => c.leadScore !== undefined && c.leadScore >= filters.minLeadScore!
    );
  }
  if (filters.maxLeadScore !== undefined) {
    filtered = filtered.filter(
      (c) => c.leadScore !== undefined && c.leadScore <= filters.maxLeadScore!
    );
  }

  // Lifetime value range
  if (filters.minLifetimeValue !== undefined) {
    filtered = filtered.filter(
      (c) => (c.lifetimeValue || 0) >= filters.minLifetimeValue!
    );
  }

  // Has company filter
  if (filters.hasCompany !== undefined) {
    filtered = filtered.filter((c) =>
      filters.hasCompany ? !!c.company : !c.company
    );
  }

  // Tags filter (contact must have ALL specified tags)
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((c) =>
      filters.tags!.every((tag) => c.tags?.includes(tag))
    );
  }

  return filtered;
}
