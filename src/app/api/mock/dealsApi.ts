/* ============================================================
 * Mock Deals API
 * Full CRUD + filters + search + pagination
 * ============================================================ */

import type { Deal, DealStage, DealPriority, CurrencyCode } from "@/types";
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
import { DEAL_STAGE_PROBABILITIES } from "@/constants";

/* ============================================================
 * Types
 * ============================================================ */

export interface DealFilters {
  stage?: DealStage | DealStage[];
  priority?: DealPriority | DealPriority[];
  ownerId?: string;
  contactId?: string;
  pipeline?: string;
  won?: boolean;
  search?: string;
  createdAfter?: string;
  createdBefore?: string;
  minValue?: number;
  maxValue?: number;
  minProbability?: number;
  expectedCloseAfter?: string;
  expectedCloseBefore?: string;
}

export interface GetDealsParams extends PaginationParams, SortParams {
  filters?: DealFilters;
  includeDeleted?: boolean;
}

export interface CreateDealDto {
  name: string;
  contactId?: string;
  value: number;
  currency?: CurrencyCode;
  stage?: DealStage;
  priority?: DealPriority;
  ownerId?: string;
  expectedCloseDate?: string;
  pipeline?: string;
  source?: string;
  customFields?: Record<string, unknown>;
}

export interface UpdateDealDto extends Partial<CreateDealDto> {
  probability?: number;
  won?: boolean;
  lostReason?: string;
  actualCloseDate?: string;
  tags?: string[];
}

/* ============================================================
 * API Functions
 * ============================================================ */

/** Get all deals with filters, search, pagination */
export async function getDeals(
  params: GetDealsParams = {}
): Promise<PaginatedResponse<Deal> | ApiError> {
  await simulateRandomDelay();

  try {
    const store = useMockStore.getState();
    let deals = [...store.deals];

    // Exclude deleted
    if (!params.includeDeleted) {
      deals = excludeDeleted(deals);
    }

    // Apply filters
    if (params.filters) {
      deals = applyDealFilters(deals, params.filters);
    }

    // Apply sorting
    deals = applySorting(deals, params);

    // Paginate
    const { data, total } = paginate(deals, params);

    return buildPaginatedResponse(data, params, total);
  } catch (error) {
    return buildErrorResponse(
      "FETCH_ERROR",
      error instanceof Error ? error.message : "Failed to fetch deals",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

/** Get single deal by ID */
export async function getDealById(id: string): Promise<ApiResponse<Deal> | ApiError> {
  await simulateRandomDelay();

  if (!isValidUUID(id)) {
    return buildErrorResponse("INVALID_ID", "Invalid deal ID format", HTTP_STATUS.BAD_REQUEST);
  }

  const store = useMockStore.getState();
  const deal = store.deals.find((d) => d.id === id && !d.deletedAt);

  if (!deal) {
    return buildErrorResponse("NOT_FOUND", "Deal not found", HTTP_STATUS.NOT_FOUND);
  }

  return buildSuccessResponse(deal);
}

/** Create new deal */
export async function createDeal(dto: CreateDealDto): Promise<ApiResponse<Deal> | ApiError> {
  await simulateRandomDelay();

  // Validate
  const errors = validateRequiredFields(dto, ["name", "value"]);
  if (errors.length > 0) {
    return buildErrorResponse("VALIDATION_ERROR", errors.join(", "), HTTP_STATUS.BAD_REQUEST);
  }

  if (dto.value <= 0) {
    return buildErrorResponse(
      "VALIDATION_ERROR",
      "Deal value must be greater than 0",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Create deal
  const now = new Date().toISOString();
  const tenantId = "018d0001-0001-7001-8001-000000000001";
  const stage = dto.stage || "qualification";
  const probability = DEAL_STAGE_PROBABILITIES[stage];

  const deal: Deal = {
    id: generateUUID(),
    tenantId,
    version: 1,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,

    name: dto.name,
    contactId: dto.contactId,
    value: dto.value,
    currency: dto.currency || "VND",

    stage,
    probability,
    priority: dto.priority || "warm",

    ownerId: dto.ownerId,

    expectedCloseDate: dto.expectedCloseDate || getDefaultExpectedCloseDate(),
    actualCloseDate: undefined,

    won: undefined,
    lostReason: undefined,

    pipeline: dto.pipeline || "Default Pipeline",
    source: dto.source,

    aiScore: 50,
    aiMetadata: {
      lastScoredAt: now,
      scoringModel: "deal-ai-v1.5",
      confidence: 0.75,
      factors: [],
    },

    tags: [],
    customFields: dto.customFields || {},
  };

  // Add to store
  useMockStore.getState().addDeal(deal);

  return buildSuccessResponse(deal, "Deal created successfully");
}

/** Update deal */
export async function updateDeal(
  id: string,
  dto: UpdateDealDto
): Promise<ApiResponse<Deal> | ApiError> {
  await simulateRandomDelay();

  if (!isValidUUID(id)) {
    return buildErrorResponse("INVALID_ID", "Invalid deal ID format", HTTP_STATUS.BAD_REQUEST);
  }

  const store = useMockStore.getState();
  const deal = store.deals.find((d) => d.id === id && !d.deletedAt);

  if (!deal) {
    return buildErrorResponse("NOT_FOUND", "Deal not found", HTTP_STATUS.NOT_FOUND);
  }

  // Update probability if stage changed
  const updates: Partial<Deal> = { ...dto };
  if (dto.stage && dto.stage !== deal.stage) {
    updates.probability = DEAL_STAGE_PROBABILITIES[dto.stage];

    // Auto-set won/lost for closed stages
    if (dto.stage === "closed-won") {
      updates.won = true;
      updates.actualCloseDate = updates.actualCloseDate || new Date().toISOString().split("T")[0];
    } else if (dto.stage === "closed-lost") {
      updates.won = false;
      updates.actualCloseDate = updates.actualCloseDate || new Date().toISOString().split("T")[0];
    }
  }

  // Update store
  store.updateDeal(id, updates);

  // Get updated deal
  const updated = store.deals.find((d) => d.id === id);
  if (!updated) {
    return buildErrorResponse(
      "UPDATE_ERROR",
      "Failed to update deal",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  return buildSuccessResponse(updated, "Deal updated successfully");
}

/** Delete deal (soft delete) */
export async function deleteDeal(id: string): Promise<ApiResponse<void> | ApiError> {
  await simulateRandomDelay();

  if (!isValidUUID(id)) {
    return buildErrorResponse("INVALID_ID", "Invalid deal ID format", HTTP_STATUS.BAD_REQUEST);
  }

  const store = useMockStore.getState();
  const deal = store.deals.find((d) => d.id === id && !d.deletedAt);

  if (!deal) {
    return buildErrorResponse("NOT_FOUND", "Deal not found", HTTP_STATUS.NOT_FOUND);
  }

  // Soft delete
  store.deleteDeal(id);

  return buildSuccessResponse(undefined, "Deal deleted successfully");
}

/** Move deal to next stage */
export async function moveDealToStage(
  id: string,
  stage: DealStage
): Promise<ApiResponse<Deal> | ApiError> {
  return updateDeal(id, { stage });
}

/** Mark deal as won */
export async function markDealWon(id: string): Promise<ApiResponse<Deal> | ApiError> {
  return updateDeal(id, {
    stage: "closed-won",
    won: true,
    actualCloseDate: new Date().toISOString().split("T")[0],
  });
}

/** Mark deal as lost */
export async function markDealLost(
  id: string,
  reason?: string
): Promise<ApiResponse<Deal> | ApiError> {
  return updateDeal(id, {
    stage: "closed-lost",
    won: false,
    lostReason: reason,
    actualCloseDate: new Date().toISOString().split("T")[0],
  });
}

/** Get deals by contact */
export async function getDealsByContact(
  contactId: string
): Promise<ApiResponse<Deal[]> | ApiError> {
  await simulateRandomDelay();

  const store = useMockStore.getState();
  const deals = excludeDeleted(store.deals).filter((d) => d.contactId === contactId);

  return buildSuccessResponse(deals);
}

/** Get deal stats */
export async function getDealStats(): Promise<
  ApiResponse<{
    total: number;
    byStage: Record<DealStage, number>;
    byPriority: Record<DealPriority, number>;
    totalValue: number;
    avgDealSize: number;
    winRate: number;
  }> | ApiError
> {
  await simulateRandomDelay();

  const store = useMockStore.getState();
  const deals = excludeDeleted(store.deals);

  const byStage: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  let totalValue = 0;
  let wonCount = 0;
  let lostCount = 0;

  deals.forEach((deal) => {
    byStage[deal.stage] = (byStage[deal.stage] || 0) + 1;
    byPriority[deal.priority] = (byPriority[deal.priority] || 0) + 1;
    totalValue += deal.value;

    if (deal.won === true) wonCount++;
    if (deal.won === false) lostCount++;
  });

  const closedDeals = wonCount + lostCount;
  const winRate = closedDeals > 0 ? (wonCount / closedDeals) * 100 : 0;

  return buildSuccessResponse({
    total: deals.length,
    byStage: byStage as Record<DealStage, number>,
    byPriority: byPriority as Record<DealPriority, number>,
    totalValue,
    avgDealSize: deals.length > 0 ? Math.round(totalValue / deals.length) : 0,
    winRate: Math.round(winRate * 10) / 10,
  });
}

/* ============================================================
 * Helper Functions
 * ============================================================ */

/** Apply deal-specific filters */
function applyDealFilters(deals: Deal[], filters: DealFilters): Deal[] {
  let filtered = [...deals];

  // Stage filter
  if (filters.stage) {
    const stages = Array.isArray(filters.stage) ? filters.stage : [filters.stage];
    filtered = filtered.filter((d) => stages.includes(d.stage));
  }

  // Priority filter
  if (filters.priority) {
    const priorities = Array.isArray(filters.priority)
      ? filters.priority
      : [filters.priority];
    filtered = filtered.filter((d) => priorities.includes(d.priority));
  }

  // Owner filter
  if (filters.ownerId) {
    filtered = filtered.filter((d) => d.ownerId === filters.ownerId);
  }

  // Contact filter
  if (filters.contactId) {
    filtered = filtered.filter((d) => d.contactId === filters.contactId);
  }

  // Pipeline filter
  if (filters.pipeline) {
    filtered = filtered.filter((d) => d.pipeline === filters.pipeline);
  }

  // Won/lost filter
  if (filters.won !== undefined) {
    filtered = filtered.filter((d) => d.won === filters.won);
  }

  // Search filter
  if (filters.search) {
    filtered = searchInFields(filtered, filters.search, ["name", "pipeline"]);
  }

  // Date range filters
  if (filters.createdAfter || filters.createdBefore) {
    filtered = filterByDateRange(filtered, "createdAt", filters.createdAfter, filters.createdBefore);
  }

  // Value range
  if (filters.minValue !== undefined) {
    filtered = filtered.filter((d) => d.value >= filters.minValue!);
  }
  if (filters.maxValue !== undefined) {
    filtered = filtered.filter((d) => d.value <= filters.maxValue!);
  }

  // Probability filter
  if (filters.minProbability !== undefined) {
    filtered = filtered.filter((d) => d.probability >= filters.minProbability!);
  }

  // Expected close date range
  if (filters.expectedCloseAfter || filters.expectedCloseBefore) {
    filtered = filterByDateRange(
      filtered,
      "expectedCloseDate",
      filters.expectedCloseAfter,
      filters.expectedCloseBefore
    );
  }

  return filtered;
}

/** Get default expected close date (90 days from now) */
function getDefaultExpectedCloseDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 90);
  return date.toISOString().split("T")[0];
}
