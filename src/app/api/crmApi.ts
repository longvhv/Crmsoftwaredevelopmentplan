/**
 * API Layer cho CRM.
 *
 * Hiện tại sử dụng mock data. Khi tích hợp backend thực,
 * chỉ cần thay thế nội dung các hàm bằng fetch/axios calls.
 */
import type {
  Contact,
  Deal,
  Employee,
  Activity,
  CrmOverviewStats,
  ContactType,
  ContactStatus,
  DealStage,
  SupportTicket,
  TicketPriority,
  TicketStatus,
  TicketCategory,
  Product,
  ProductType,
  ProductCategory,
  ProductStatus,
  CalendarEvent,
  CalendarEventType,
  Task,
  TaskStatus,
  TaskPriority,
  TaskCategory,
  Lead,
  LeadStatus,
  LeadChannel,
  EmailTemplate,
  EmailTemplateCategory,
  EmailTemplateStatus,
  EmailSequence,
  EmailSequenceStatus,
  Contract,
  ContractStatus,
  ContractType,
  Vendor,
  VendorStatus,
  VendorCategory,
  Goal,
  GoalLevel,
  GoalStatus,
  GoalCategory,
  Quotation,
  QuotationStatus,
  CustomerHealth,
  HealthLevel,
  ChurnRisk,
  InventoryItem,
  StockStatus,
  InventoryItemType,
  RepForecast,
  SalesRepCommission,
  PayoutStatus,
  Competitor,
  CompetitorThreat,
  WinLossRecord,
  DealOutcome,
  QuotaRep,
  AttainmentStatus,
  Playbook,
  PlaybookType,
  PlaybookBattleCard,
  Territory,
  TerritoryRegion,
  TerritoryStatus,
  CrmEvent,
  CrmEventType,
  CrmEventStatus,
  AnalyzedDeal,
  LossReason,
  Renewal,
  RenewalStatus,
  RevenueLeakItem,
  LeakType,
  LeakSeverity,
  LeakStatus,
  Partner,
  PartnerTier,
  PartnerType,
  PartnerStatus,
  ChurnRiskAccount,
  ChurnRiskLevel,
  InterventionStatus,
  TeamMember,
  BurnoutRisk,
  FeedbackEntry,
  NPSCategory,
  FeedbackChannel,
  ClientNPS,
  CampaignRoi,
  CampaignChannel,
  CampaignStatus,
} from "../types/crm";
import { contacts, deals, employees, activities, leads, emailTemplates, emailSequences } from "../data/crmData";
import { tickets } from "../data/ticketData";
import { products } from "../data/productData";
import { calendarEvents } from "../data/calendarData";
import { tasks } from "../data/taskData";
import { contracts } from "../data/contractData";
import { vendors } from "../data/vendorData";
import { goals } from "../data/goalData";
import { quotations } from "../data/quotationData";
import { customerHealthRecords } from "../data/customerHealthData";
import { inventoryItems } from "../data/inventoryData";
import { repForecasts } from "../data/forecastData";
import { salesRepCommissions } from "../data/commissionData";
import { competitors, winLossRecords } from "../data/competitorData";
import { quotaReps } from "../data/quotaData";
import { playbooks, playbookBattleCards } from "../data/playbookData";
import { territories } from "../data/territoryData";
import { crmEvents } from "../data/eventData";
import { analyzedDeals } from "../data/winLossData";
import { renewals } from "../data/renewalData";
import { revenueLeaks } from "../data/revenueLeakData";
import { partners } from "../data/partnerData";
import { churnRiskAccounts } from "../data/churnData";
import { teamMembers } from "../data/teamCapacityData";
import { npsFeedbacks, clientNpsRecords, npsTrendData } from "../data/npsData";
import { campaignRois } from "../data/campaignRoiData";
import { ACTIVE_DEAL_STAGES } from "../constants/crmConfig";

/** Bộ đếm ID tự tăng */
let nextContactId = contacts.length + 1;
let nextDealId = deals.length + 1;
let nextActivityId = activities.length + 1;
let nextTicketId = tickets.length + 1;
let nextProductId = products.length + 1;
let nextEventId = calendarEvents.length + 1;
let nextTaskId = tasks.length + 1;
let nextLeadId = leads.length + 1;
let nextEmailTemplateId = emailTemplates.length + 1;
let nextEmailSequenceId = emailSequences.length + 1;
let nextContractId = contracts.length + 1;
let nextVendorId = vendors.length + 1;
let nextGoalId = goals.length + 1;
let nextQuotationId = quotations.length + 1;
let nextCustomerHealthId = customerHealthRecords.length + 1;
let nextInventoryId = inventoryItems.length + 1;
let nextRepForecastId = repForecasts.length + 1;
let nextCommissionId = salesRepCommissions.length + 1;
let nextCompetitorId = competitors.length + 1;
let nextWinLossId = winLossRecords.length + 1;
let nextQuotaRepId = quotaReps.length + 1;
let nextPlaybookId = playbooks.length + 1;
let nextBattleCardId = playbookBattleCards.length + 1;
let nextTerritoryId = territories.length + 1;
let nextEventId2 = crmEvents.length + 1;
let nextAnalyzedDealId = analyzedDeals.length + 1;
let nextRenewalId = renewals.length + 1;
let nextLeakId = revenueLeaks.length + 1;
let nextPartnerId = partners.length + 1;
let nextChurnAccountId = churnRiskAccounts.length + 1;
let nextTeamMemberId = teamMembers.length + 1;
let nextFeedbackId = npsFeedbacks.length + 1;
let nextClientNpsId = clientNpsRecords.length + 1;
let nextCampaignRoiId = campaignRois.length + 1;

/** Simulated delay — đặt 0 cho production */
const DELAY_MS = 0;

function simulate<T>(data: T): Promise<T> {
  if (DELAY_MS <= 0) return Promise.resolve(data);
  return new Promise((resolve) => setTimeout(() => resolve(data), DELAY_MS));
}

/* ============================================================
 * Contacts
 * ============================================================ */
export async function fetchContacts(filters?: {
  search?: string;
  type?: ContactType | null;
  status?: ContactStatus | null;
  assignedTo?: string | null;
}): Promise<Contact[]> {
  let result = [...contacts];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.position.toLowerCase().includes(q),
    );
  }
  if (filters?.type) result = result.filter((c) => c.type === filters.type);
  if (filters?.status) result = result.filter((c) => c.status === filters.status);
  if (filters?.assignedTo) result = result.filter((c) => c.assignedTo === filters.assignedTo);

  return simulate(result);
}

export async function fetchContactById(id: string): Promise<Contact | undefined> {
  return simulate(contacts.find((c) => c.id === id));
}

/** Tạo liên hệ mới */
export async function createContact(data: Omit<Contact, "id">): Promise<Contact> {
  const newContact: Contact = { ...data, id: `c${nextContactId++}` };
  contacts.push(newContact);
  return simulate(newContact);
}

/** Cập nhật liên hệ */
export async function updateContact(id: string, data: Partial<Contact>): Promise<Contact | undefined> {
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return simulate(undefined);
  contacts[idx] = { ...contacts[idx], ...data };
  return simulate(contacts[idx]);
}

/** Xóa liên hệ */
export async function deleteContact(id: string): Promise<boolean> {
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return simulate(false);
  contacts.splice(idx, 1);
  return simulate(true);
}

/** Xóa nhiều liên hệ */
export async function deleteContacts(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = contacts.findIndex((c) => c.id === id);
    if (idx !== -1) { contacts.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Deals
 * ============================================================ */
export async function fetchDeals(filters?: {
  stage?: DealStage | null;
  assignedTo?: string | null;
  priority?: string | null;
}): Promise<Deal[]> {
  let result = [...deals];
  if (filters?.stage) result = result.filter((d) => d.stage === filters.stage);
  if (filters?.assignedTo) result = result.filter((d) => d.assignedTo === filters.assignedTo);
  if (filters?.priority) result = result.filter((d) => d.priority === filters.priority);
  return simulate(result);
}

export async function fetchDealsByStage(): Promise<Map<DealStage, Deal[]>> {
  const map = new Map<DealStage, Deal[]>();
  const allDeals = await fetchDeals();
  for (const deal of allDeals) {
    const existing = map.get(deal.stage);
    if (existing) existing.push(deal);
    else map.set(deal.stage, [deal]);
  }
  return simulate(map);
}

/** Lấy deals liên quan đến 1 contact */
export async function fetchDealsByContactId(contactId: string): Promise<Deal[]> {
  const result = deals.filter((d) => d.contactId === contactId);
  return simulate(result);
}

/** Tạo deal mới */
export async function createDeal(data: Omit<Deal, "id">): Promise<Deal> {
  const newDeal: Deal = { ...data, id: `d${nextDealId++}` };
  deals.push(newDeal);
  return simulate(newDeal);
}

/** Cập nhật deal (bao gồm chuyển stage qua DnD) */
export async function updateDeal(id: string, data: Partial<Deal>): Promise<Deal | undefined> {
  const idx = deals.findIndex((d) => d.id === id);
  if (idx === -1) return simulate(undefined);
  deals[idx] = { ...deals[idx], ...data };
  return simulate(deals[idx]);
}

/* ============================================================
 * Employees
 * ============================================================ */
export async function fetchEmployees(filters?: {
  search?: string;
  type?: string | null;
  department?: string | null;
}): Promise<Employee[]> {
  let result = [...employees];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.primaryRole.name.toLowerCase().includes(q) ||
        e.primaryRole.department.toLowerCase().includes(q),
    );
  }
  if (filters?.type) result = result.filter((e) => e.type === filters.type);
  if (filters?.department) result = result.filter((e) => e.primaryRole.department === filters.department);
  return simulate(result);
}

export async function fetchDepartments(): Promise<string[]> {
  const depts = [...new Set(employees.map((e) => e.primaryRole.department))].sort();
  return simulate(depts);
}

/* ============================================================
 * Activities
 * ============================================================ */
export async function fetchRecentActivities(limit = 10): Promise<Activity[]> {
  const sorted = [...activities].sort(
    (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime(),
  );
  return simulate(sorted.slice(0, limit));
}

/** Lấy tất cả activities với bộ lọc */
export async function fetchActivities(filters?: {
  type?: string | null;
  performedBy?: string | null;
  contactId?: string | null;
  dealId?: string | null;
}): Promise<Activity[]> {
  let result = [...activities].sort(
    (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime(),
  );
  if (filters?.type) result = result.filter((a) => a.type === filters.type);
  if (filters?.performedBy) result = result.filter((a) => a.performedBy === filters.performedBy);
  if (filters?.contactId) result = result.filter((a) => a.contactId === filters.contactId);
  if (filters?.dealId) result = result.filter((a) => a.dealId === filters.dealId);
  return simulate(result);
}

/** Tạo hoạt động mới */
export async function createActivity(data: Omit<Activity, "id">): Promise<Activity> {
  const newActivity: Activity = { ...data, id: `a${nextActivityId++}` };
  activities.push(newActivity);
  return simulate(newActivity);
}

/* ============================================================
 * Overview Stats
 * ============================================================ */
export async function fetchCrmOverviewStats(): Promise<CrmOverviewStats> {
  const activeDeals = deals.filter((d) =>
    ACTIVE_DEAL_STAGES.includes(d.stage),
  );
  const wonDeals = deals.filter((d) => d.stage === "closed-won");
  const allActiveDeals = deals.filter((d) => d.stage !== "closed-lost");

  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const wonValueThisMonth = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const avgDealSize =
    allActiveDeals.length > 0
      ? Math.round(allActiveDeals.reduce((sum, d) => sum + d.value, 0) / allActiveDeals.length)
      : 0;

  const stats: CrmOverviewStats = {
    totalContacts: contacts.length,
    activeDeals: activeDeals.length,
    totalPipelineValue,
    wonThisMonth: wonDeals.length,
    wonValueThisMonth,
    conversionRate: deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0,
    avgDealSize,
    avgDealCycle: 45,
    activitiesThisWeek: activities.length,
    aiActionsToday: activities.filter((a) => a.isAutoLogged).length,
  };

  return simulate(stats);
}

/* ============================================================
 * Helper: Tìm tên nhân viên theo ID
 * ============================================================ */
export function getEmployeeName(id: string): string {
  return employees.find((e) => e.id === id)?.name ?? id;
}

/* ============================================================
 * Tickets (Support)
 * ============================================================ */
export async function fetchTickets(filters?: {
  search?: string;
  priority?: TicketPriority | null;
  status?: TicketStatus | null;
  category?: TicketCategory | null;
}): Promise<SupportTicket[]> {
  let result = [...tickets];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((t) =>
      t.subject.toLowerCase().includes(q) || t.ticketNo.toLowerCase().includes(q) ||
      t.clientCompany.toLowerCase().includes(q) || t.clientName.toLowerCase().includes(q));
  }
  if (filters?.priority) result = result.filter((t) => t.priority === filters.priority);
  if (filters?.status) result = result.filter((t) => t.status === filters.status);
  if (filters?.category) result = result.filter((t) => t.category === filters.category);
  return simulate(result);
}

export async function fetchTicketById(id: string): Promise<SupportTicket | undefined> {
  return simulate(tickets.find((t) => t.id === id));
}

export async function createTicket(data: Omit<SupportTicket, "id">): Promise<SupportTicket> {
  const newTicket: SupportTicket = { ...data, id: `t${nextTicketId++}` };
  tickets.push(newTicket);
  return simulate(newTicket);
}

export async function updateTicket(id: string, data: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
  const idx = tickets.findIndex((t) => t.id === id);
  if (idx === -1) return simulate(undefined);
  tickets[idx] = { ...tickets[idx], ...data };
  return simulate(tickets[idx]);
}

export async function deleteTicket(id: string): Promise<boolean> {
  const idx = tickets.findIndex((t) => t.id === id);
  if (idx === -1) return simulate(false);
  tickets.splice(idx, 1);
  return simulate(true);
}

export async function deleteTickets(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = tickets.findIndex((t) => t.id === id);
    if (idx !== -1) { tickets.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Products (Catalog)
 * ============================================================ */
export async function fetchProducts(filters?: {
  search?: string;
  type?: ProductType | null;
  category?: ProductCategory | null;
  status?: ProductStatus | null;
}): Promise<Product[]> {
  let result = [...products];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((p) =>
      p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)));
  }
  if (filters?.type) result = result.filter((p) => p.type === filters.type);
  if (filters?.category) result = result.filter((p) => p.category === filters.category);
  if (filters?.status) result = result.filter((p) => p.status === filters.status);
  return simulate(result);
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  return simulate(products.find((p) => p.id === id));
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const newProduct: Product = { ...data, id: `p${nextProductId++}` };
  products.push(newProduct);
  return simulate(newProduct);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined> {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return simulate(undefined);
  products[idx] = { ...products[idx], ...data };
  return simulate(products[idx]);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return simulate(false);
  products.splice(idx, 1);
  return simulate(true);
}

export async function deleteProducts(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = products.findIndex((p) => p.id === id);
    if (idx !== -1) { products.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Calendar Events
 * ============================================================ */
export async function fetchCalendarEvents(filters?: {
  type?: CalendarEventType | null;
  assignedTo?: string | null;
}): Promise<CalendarEvent[]> {
  let result = [...calendarEvents];
  if (filters?.type) result = result.filter((e) => e.type === filters.type);
  if (filters?.assignedTo) result = result.filter((e) => e.assignedTo === filters.assignedTo);
  return simulate(result);
}

export async function createCalendarEvent(data: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
  const newEvent: CalendarEvent = { ...data, id: `ev${nextEventId++}` };
  calendarEvents.push(newEvent);
  return simulate(newEvent);
}

export async function updateCalendarEvent(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent | undefined> {
  const idx = calendarEvents.findIndex((e) => e.id === id);
  if (idx === -1) return simulate(undefined);
  calendarEvents[idx] = { ...calendarEvents[idx], ...data };
  return simulate(calendarEvents[idx]);
}

export async function deleteCalendarEvent(id: string): Promise<boolean> {
  const idx = calendarEvents.findIndex((e) => e.id === id);
  if (idx === -1) return simulate(false);
  calendarEvents.splice(idx, 1);
  return simulate(true);
}

/* ============================================================
 * Tasks (Task Board)
 * ============================================================ */
export async function fetchTasks(filters?: {
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  category?: TaskCategory | null;
  assignee?: string | null;
  search?: string;
}): Promise<Task[]> {
  let result = [...tasks];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q)));
  }
  if (filters?.status) result = result.filter((t) => t.status === filters.status);
  if (filters?.priority) result = result.filter((t) => t.priority === filters.priority);
  if (filters?.category) result = result.filter((t) => t.category === filters.category);
  if (filters?.assignee) result = result.filter((t) => t.assignee === filters.assignee);
  return simulate(result);
}

export async function createTask(data: Omit<Task, "id">): Promise<Task> {
  const newTask: Task = { ...data, id: `tk${nextTaskId++}` };
  tasks.push(newTask);
  return simulate(newTask);
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task | undefined> {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return simulate(undefined);
  tasks[idx] = { ...tasks[idx], ...data };
  return simulate(tasks[idx]);
}

export async function deleteTask(id: string): Promise<boolean> {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return simulate(false);
  tasks.splice(idx, 1);
  return simulate(true);
}

export async function deleteTasks(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx !== -1) { tasks.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Leads
 * ============================================================ */
export async function fetchLeads(filters?: {
  search?: string;
  status?: LeadStatus | null;
  channel?: LeadChannel | null;
  assignedTo?: string | null;
}): Promise<Lead[]> {
  let result = [...leads];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.position.toLowerCase().includes(q),
    );
  }
  if (filters?.status) result = result.filter((l) => l.status === filters.status);
  if (filters?.channel) result = result.filter((l) => l.channel === filters.channel);
  if (filters?.assignedTo) result = result.filter((l) => l.assignedTo === filters.assignedTo);

  return simulate(result);
}

export async function fetchLeadById(id: string): Promise<Lead | undefined> {
  return simulate(leads.find((l) => l.id === id));
}

/** Tạo lead mới */
export async function createLead(data: Omit<Lead, "id">): Promise<Lead> {
  const newLead: Lead = { ...data, id: `l${nextLeadId++}` };
  leads.push(newLead);
  return simulate(newLead);
}

/** Cập nhật lead */
export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead | undefined> {
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return simulate(undefined);
  leads[idx] = { ...leads[idx], ...data };
  return simulate(leads[idx]);
}

/** Xóa lead */
export async function deleteLead(id: string): Promise<boolean> {
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return simulate(false);
  leads.splice(idx, 1);
  return simulate(true);
}

/** Xóa nhiều lead */
export async function deleteLeads(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = leads.findIndex((l) => l.id === id);
    if (idx !== -1) { leads.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Email Templates
 * ============================================================ */
export async function fetchEmailTemplates(filters?: {
  search?: string;
  category?: EmailTemplateCategory | null;
  status?: EmailTemplateStatus | null;
}): Promise<EmailTemplate[]> {
  let result = [...emailTemplates];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (et) =>
        et.name.toLowerCase().includes(q) ||
        et.subject.toLowerCase().includes(q) ||
        et.bodyText.toLowerCase().includes(q) ||
        et.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.category) result = result.filter((et) => et.category === filters.category);
  if (filters?.status) result = result.filter((et) => et.status === filters.status);

  return simulate(result);
}

export async function fetchEmailTemplateById(id: string): Promise<EmailTemplate | undefined> {
  return simulate(emailTemplates.find((et) => et.id === id));
}

export async function createEmailTemplate(data: Omit<EmailTemplate, "id">): Promise<EmailTemplate> {
  const newEmailTemplate: EmailTemplate = { ...data, id: `et${nextEmailTemplateId++}` };
  emailTemplates.push(newEmailTemplate);
  return simulate(newEmailTemplate);
}

export async function updateEmailTemplate(id: string, data: Partial<EmailTemplate>): Promise<EmailTemplate | undefined> {
  const idx = emailTemplates.findIndex((et) => et.id === id);
  if (idx === -1) return simulate(undefined);
  emailTemplates[idx] = { ...emailTemplates[idx], ...data };
  return simulate(emailTemplates[idx]);
}

export async function deleteEmailTemplate(id: string): Promise<boolean> {
  const idx = emailTemplates.findIndex((et) => et.id === id);
  if (idx === -1) return simulate(false);
  emailTemplates.splice(idx, 1);
  return simulate(true);
}

export async function deleteEmailTemplates(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = emailTemplates.findIndex((et) => et.id === id);
    if (idx !== -1) { emailTemplates.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Email Sequences
 * ============================================================ */
export async function fetchEmailSequences(filters?: {
  search?: string;
  status?: EmailSequenceStatus | null;
}): Promise<EmailSequence[]> {
  let result = [...emailSequences];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (es) =>
        es.name.toLowerCase().includes(q) ||
        es.description.toLowerCase().includes(q) ||
        es.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.status) result = result.filter((es) => es.status === filters.status);

  return simulate(result);
}

export async function fetchEmailSequenceById(id: string): Promise<EmailSequence | undefined> {
  return simulate(emailSequences.find((es) => es.id === id));
}

export async function createEmailSequence(data: Omit<EmailSequence, "id">): Promise<EmailSequence> {
  const newEmailSequence: EmailSequence = { ...data, id: `es${nextEmailSequenceId++}` };
  emailSequences.push(newEmailSequence);
  return simulate(newEmailSequence);
}

export async function updateEmailSequence(id: string, data: Partial<EmailSequence>): Promise<EmailSequence | undefined> {
  const idx = emailSequences.findIndex((es) => es.id === id);
  if (idx === -1) return simulate(undefined);
  emailSequences[idx] = { ...emailSequences[idx], ...data };
  return simulate(emailSequences[idx]);
}

export async function deleteEmailSequence(id: string): Promise<boolean> {
  const idx = emailSequences.findIndex((es) => es.id === id);
  if (idx === -1) return simulate(false);
  emailSequences.splice(idx, 1);
  return simulate(true);
}

export async function deleteEmailSequences(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = emailSequences.findIndex((es) => es.id === id);
    if (idx !== -1) { emailSequences.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Contracts
 * ============================================================ */
export async function fetchContracts(filters?: {
  search?: string;
  status?: ContractStatus | null;
  type?: ContractType | null;
}): Promise<Contract[]> {
  let result = [...contracts];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.dealName.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.clientCompany.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.status) result = result.filter((c) => c.status === filters.status);
  if (filters?.type) result = result.filter((c) => c.type === filters.type);
  return simulate(result);
}

export async function updateContract(id: string, data: Partial<Contract>): Promise<Contract | undefined> {
  const idx = contracts.findIndex((c) => c.id === id);
  if (idx === -1) return simulate(undefined);
  contracts[idx] = { ...contracts[idx], ...data };
  return simulate(contracts[idx]);
}

export async function createContract(data: Omit<Contract, "id">): Promise<Contract> {
  const newContract: Contract = { ...data, id: `ct${nextContractId++}` };
  contracts.push(newContract);
  return simulate(newContract);
}

export async function deleteContracts(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = contracts.findIndex((c) => c.id === id);
    if (idx !== -1) { contracts.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Vendors
 * ============================================================ */
export async function fetchVendors(filters?: {
  search?: string;
  status?: VendorStatus | null;
  category?: VendorCategory | null;
}): Promise<Vendor[]> {
  let result = [...vendors];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.country.toLowerCase().includes(q) ||
        v.contactPerson.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.status) result = result.filter((v) => v.status === filters.status);
  if (filters?.category) result = result.filter((v) => v.category === filters.category);
  return simulate(result);
}

export async function updateVendor(id: string, data: Partial<Vendor>): Promise<Vendor | undefined> {
  const idx = vendors.findIndex((v) => v.id === id);
  if (idx === -1) return simulate(undefined);
  vendors[idx] = { ...vendors[idx], ...data };
  return simulate(vendors[idx]);
}

export async function createVendor(data: Omit<Vendor, "id">): Promise<Vendor> {
  const newVendor: Vendor = { ...data, id: `vd${nextVendorId++}` };
  vendors.push(newVendor);
  return simulate(newVendor);
}

export async function deleteVendors(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = vendors.findIndex((v) => v.id === id);
    if (idx !== -1) { vendors.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Goals & OKR
 * ============================================================ */
export async function fetchGoals(filters?: {
  search?: string;
  level?: GoalLevel | null;
  status?: GoalStatus | null;
  category?: GoalCategory | null;
}): Promise<Goal[]> {
  let result = [...goals];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.owner.toLowerCase().includes(q) ||
        (g.team?.toLowerCase().includes(q) ?? false) ||
        g.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.level) result = result.filter((g) => g.level === filters.level);
  if (filters?.status) result = result.filter((g) => g.status === filters.status);
  if (filters?.category) result = result.filter((g) => g.category === filters.category);
  return simulate(result);
}

export async function updateGoal(id: string, data: Partial<Goal>): Promise<Goal | undefined> {
  const idx = goals.findIndex((g) => g.id === id);
  if (idx === -1) return simulate(undefined);
  goals[idx] = { ...goals[idx], ...data };
  return simulate(goals[idx]);
}

export async function createGoal(data: Omit<Goal, "id">): Promise<Goal> {
  const newGoal: Goal = { ...data, id: `gl${nextGoalId++}` };
  goals.push(newGoal);
  return simulate(newGoal);
}

export async function deleteGoals(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = goals.findIndex((g) => g.id === id);
    if (idx !== -1) { goals.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Quotations
 * ============================================================ */
export async function fetchQuotations(filters?: {
  search?: string;
  status?: QuotationStatus | null;
}): Promise<Quotation[]> {
  let result = [...quotations];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(
      (qt) =>
        qt.code.toLowerCase().includes(s) ||
        qt.dealName.toLowerCase().includes(s) ||
        qt.clientName.toLowerCase().includes(s) ||
        qt.clientCompany.toLowerCase().includes(s) ||
        qt.tags.some((t) => t.toLowerCase().includes(s)),
    );
  }
  if (filters?.status) result = result.filter((qt) => qt.status === filters.status);
  return simulate(result);
}

export async function updateQuotation(id: string, data: Partial<Quotation>): Promise<Quotation | undefined> {
  const idx = quotations.findIndex((q) => q.id === id);
  if (idx === -1) return simulate(undefined);
  quotations[idx] = { ...quotations[idx], ...data };
  return simulate(quotations[idx]);
}

export async function createQuotation(data: Omit<Quotation, "id">): Promise<Quotation> {
  const newQuotation: Quotation = { ...data, id: `qt${nextQuotationId++}` };
  quotations.push(newQuotation);
  return simulate(newQuotation);
}

export async function deleteQuotations(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = quotations.findIndex((q) => q.id === id);
    if (idx !== -1) { quotations.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Customer Health
 * ============================================================ */
export async function fetchCustomerHealthRecords(filters?: {
  search?: string;
  level?: HealthLevel | null;
  churnRisk?: ChurnRisk | null;
}): Promise<CustomerHealth[]> {
  let result = [...customerHealthRecords];
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(
      (ch) =>
        ch.companyName.toLowerCase().includes(s) ||
        ch.contactPerson.toLowerCase().includes(s) ||
        ch.industry.toLowerCase().includes(s) ||
        ch.tags.some((t) => t.toLowerCase().includes(s)),
    );
  }
  if (filters?.level) result = result.filter((ch) => ch.healthLevel === filters.level);
  if (filters?.churnRisk) result = result.filter((ch) => ch.churnRisk === filters.churnRisk);
  return simulate(result);
}

export async function updateCustomerHealthRecord(id: string, data: Partial<CustomerHealth>): Promise<CustomerHealth | undefined> {
  const idx = customerHealthRecords.findIndex((ch) => ch.id === id);
  if (idx === -1) return simulate(undefined);
  customerHealthRecords[idx] = { ...customerHealthRecords[idx], ...data };
  return simulate(customerHealthRecords[idx]);
}

export async function deleteCustomerHealthRecords(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = customerHealthRecords.findIndex((ch) => ch.id === id);
    if (idx !== -1) { customerHealthRecords.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Inventory
 * ============================================================ */
export async function fetchInventoryItems(filters?: {
  search?: string;
  status?: StockStatus | null;
  type?: InventoryItemType | null;
}): Promise<InventoryItem[]> {
  let result = [...inventoryItems];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.supplier.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.status) result = result.filter((i) => i.status === filters.status);
  if (filters?.type) result = result.filter((i) => i.type === filters.type);
  return simulate(result);
}

export async function fetchInventoryItemById(id: string): Promise<InventoryItem | undefined> {
  return simulate(inventoryItems.find((i) => i.id === id));
}

export async function createInventoryItem(data: Omit<InventoryItem, "id">): Promise<InventoryItem> {
  const newItem: InventoryItem = { ...data, id: `i${nextInventoryId++}` };
  inventoryItems.push(newItem);
  return simulate(newItem);
}

export async function updateInventoryItem(id: string, data: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
  const idx = inventoryItems.findIndex((i) => i.id === id);
  if (idx === -1) return simulate(undefined);
  inventoryItems[idx] = { ...inventoryItems[idx], ...data };
  return simulate(inventoryItems[idx]);
}

export async function deleteInventoryItems(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = inventoryItems.findIndex((i) => i.id === id);
    if (idx !== -1) { inventoryItems.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Rep Forecasts
 * ============================================================ */
export async function fetchRepForecasts(filters?: {
  search?: string;
}): Promise<RepForecast[]> {
  let result = [...repForecasts];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.role.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return simulate(result);
}

export async function fetchRepForecastById(id: string): Promise<RepForecast | undefined> {
  return simulate(repForecasts.find((f) => f.id === id));
}

export async function createRepForecast(data: Omit<RepForecast, "id">): Promise<RepForecast> {
  const newForecast: RepForecast = { ...data, id: `rf${nextRepForecastId++}` };
  repForecasts.push(newForecast);
  return simulate(newForecast);
}

export async function updateRepForecast(id: string, data: Partial<RepForecast>): Promise<RepForecast | undefined> {
  const idx = repForecasts.findIndex((f) => f.id === id);
  if (idx === -1) return simulate(undefined);
  repForecasts[idx] = { ...repForecasts[idx], ...data };
  return simulate(repForecasts[idx]);
}

export async function deleteRepForecasts(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = repForecasts.findIndex((f) => f.id === id);
    if (idx !== -1) { repForecasts.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Sales Rep Commissions
 * ============================================================ */
export async function fetchSalesRepCommissions(filters?: {
  search?: string;
  status?: PayoutStatus | null;
}): Promise<SalesRepCommission[]> {
  let result = [...salesRepCommissions];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.status) result = result.filter((c) => c.payoutStatus === filters.status);
  return simulate(result);
}

export async function fetchSalesRepCommissionById(id: string): Promise<SalesRepCommission | undefined> {
  return simulate(salesRepCommissions.find((c) => c.id === id));
}

export async function createSalesRepCommission(data: Omit<SalesRepCommission, "id">): Promise<SalesRepCommission> {
  const newCommission: SalesRepCommission = { ...data, id: `sc${nextCommissionId++}` };
  salesRepCommissions.push(newCommission);
  return simulate(newCommission);
}

export async function updateSalesRepCommission(id: string, data: Partial<SalesRepCommission>): Promise<SalesRepCommission | undefined> {
  const idx = salesRepCommissions.findIndex((c) => c.id === id);
  if (idx === -1) return simulate(undefined);
  salesRepCommissions[idx] = { ...salesRepCommissions[idx], ...data };
  return simulate(salesRepCommissions[idx]);
}

export async function deleteSalesRepCommissions(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = salesRepCommissions.findIndex((c) => c.id === id);
    if (idx !== -1) { salesRepCommissions.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Competitors
 * ============================================================ */
export async function fetchCompetitors(filters?: {
  search?: string;
  threat?: CompetitorThreat | null;
}): Promise<Competitor[]> {
  let result = [...competitors];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.threat) result = result.filter((c) => c.threat === filters.threat);
  return simulate(result);
}

export async function fetchCompetitorById(id: string): Promise<Competitor | undefined> {
  return simulate(competitors.find((c) => c.id === id));
}

export async function createCompetitor(data: Omit<Competitor, "id">): Promise<Competitor> {
  const newCompetitor: Competitor = { ...data, id: `co${nextCompetitorId++}` };
  competitors.push(newCompetitor);
  return simulate(newCompetitor);
}

export async function updateCompetitor(id: string, data: Partial<Competitor>): Promise<Competitor | undefined> {
  const idx = competitors.findIndex((c) => c.id === id);
  if (idx === -1) return simulate(undefined);
  competitors[idx] = { ...competitors[idx], ...data };
  return simulate(competitors[idx]);
}

export async function deleteCompetitors(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = competitors.findIndex((c) => c.id === id);
    if (idx !== -1) { competitors.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Win/Loss Records
 * ============================================================ */
export async function fetchWinLossRecords(filters?: {
  search?: string;
  outcome?: DealOutcome | null;
}): Promise<WinLossRecord[]> {
  let result = [...winLossRecords];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (w) =>
        w.dealName.toLowerCase().includes(q) ||
        w.competitor.toLowerCase().includes(q) ||
        w.clientCompany.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.outcome) result = result.filter((w) => w.outcome === filters.outcome);
  return simulate(result);
}

export async function fetchWinLossRecordById(id: string): Promise<WinLossRecord | undefined> {
  return simulate(winLossRecords.find((w) => w.id === id));
}

export async function createWinLossRecord(data: Omit<WinLossRecord, "id">): Promise<WinLossRecord> {
  const newRecord: WinLossRecord = { ...data, id: `wl${nextWinLossId++}` };
  winLossRecords.push(newRecord);
  return simulate(newRecord);
}

export async function updateWinLossRecord(id: string, data: Partial<WinLossRecord>): Promise<WinLossRecord | undefined> {
  const idx = winLossRecords.findIndex((w) => w.id === id);
  if (idx === -1) return simulate(undefined);
  winLossRecords[idx] = { ...winLossRecords[idx], ...data };
  return simulate(winLossRecords[idx]);
}

export async function deleteWinLossRecords(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = winLossRecords.findIndex((w) => w.id === id);
    if (idx !== -1) { winLossRecords.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Quota Reps
 * ============================================================ */
export async function fetchQuotaReps(filters?: {
  search?: string;
  attainmentStatus?: AttainmentStatus | null;
}): Promise<QuotaRep[]> {
  let result = [...quotaReps];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (qr) =>
        qr.name.toLowerCase().includes(q) ||
        qr.role.toLowerCase().includes(q) ||
        qr.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.attainmentStatus) result = result.filter((qr) => qr.status === filters.attainmentStatus);
  return simulate(result);
}

export async function fetchQuotaRepById(id: string): Promise<QuotaRep | undefined> {
  return simulate(quotaReps.find((qr) => qr.id === id));
}

export async function createQuotaRep(data: Omit<QuotaRep, "id">): Promise<QuotaRep> {
  const newQuotaRep: QuotaRep = { ...data, id: `qr${nextQuotaRepId++}` };
  quotaReps.push(newQuotaRep);
  return simulate(newQuotaRep);
}

export async function updateQuotaRep(id: string, data: Partial<QuotaRep>): Promise<QuotaRep | undefined> {
  const idx = quotaReps.findIndex((qr) => qr.id === id);
  if (idx === -1) return simulate(undefined);
  quotaReps[idx] = { ...quotaReps[idx], ...data };
  return simulate(quotaReps[idx]);
}

export async function deleteQuotaReps(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = quotaReps.findIndex((qr) => qr.id === id);
    if (idx !== -1) { quotaReps.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Playbooks
 * ============================================================ */
export async function fetchPlaybooks(filters?: {
  search?: string;
  type?: PlaybookType | null;
}): Promise<Playbook[]> {
  let result = [...playbooks];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  if (filters?.type) result = result.filter((p) => p.type === filters.type);
  return simulate(result);
}

export async function fetchPlaybookById(id: string): Promise<Playbook | undefined> {
  return simulate(playbooks.find((p) => p.id === id));
}

export async function createPlaybook(data: Omit<Playbook, "id">): Promise<Playbook> {
  const newPlaybook: Playbook = { ...data, id: `pb${nextPlaybookId++}` };
  playbooks.push(newPlaybook);
  return simulate(newPlaybook);
}

export async function updatePlaybook(id: string, data: Partial<Playbook>): Promise<Playbook | undefined> {
  const idx = playbooks.findIndex((p) => p.id === id);
  if (idx === -1) return simulate(undefined);
  playbooks[idx] = { ...playbooks[idx], ...data };
  return simulate(playbooks[idx]);
}

export async function deletePlaybooks(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = playbooks.findIndex((p) => p.id === id);
    if (idx !== -1) { playbooks.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Playbook Battle Cards
 * ============================================================ */
export async function fetchPlaybookBattleCards(): Promise<PlaybookBattleCard[]> {
  return simulate([...playbookBattleCards]);
}

export async function fetchPlaybookBattleCardById(id: string): Promise<PlaybookBattleCard | undefined> {
  return simulate(playbookBattleCards.find((pbc) => pbc.id === id));
}

export async function createPlaybookBattleCard(data: Omit<PlaybookBattleCard, "id">): Promise<PlaybookBattleCard> {
  const newBattleCard: PlaybookBattleCard = { ...data, id: `pbc${nextBattleCardId++}` };
  playbookBattleCards.push(newBattleCard);
  return simulate(newBattleCard);
}

export async function updatePlaybookBattleCard(id: string, data: Partial<PlaybookBattleCard>): Promise<PlaybookBattleCard | undefined> {
  const idx = playbookBattleCards.findIndex((pbc) => pbc.id === id);
  if (idx === -1) return simulate(undefined);
  playbookBattleCards[idx] = { ...playbookBattleCards[idx], ...data };
  return simulate(playbookBattleCards[idx]);
}

export async function deletePlaybookBattleCards(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = playbookBattleCards.findIndex((pbc) => pbc.id === id);
    if (idx !== -1) { playbookBattleCards.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Territories
 * ============================================================ */
export async function fetchTerritories(filters?: {
  search?: string;
  region?: TerritoryRegion | null;
  status?: TerritoryStatus | null;
}): Promise<Territory[]> {
  let result = [...territories];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  if (filters?.region) result = result.filter((t) => t.region === filters.region);
  if (filters?.status) result = result.filter((t) => t.status === filters.status);
  return simulate(result);
}

export async function fetchTerritoryById(id: string): Promise<Territory | undefined> {
  return simulate(territories.find((t) => t.id === id));
}

export async function createTerritory(data: Omit<Territory, "id">): Promise<Territory> {
  const newTerritory: Territory = { ...data, id: `tr${nextTerritoryId++}` };
  territories.push(newTerritory);
  return simulate(newTerritory);
}

export async function updateTerritory(id: string, data: Partial<Territory>): Promise<Territory | undefined> {
  const idx = territories.findIndex((t) => t.id === id);
  if (idx === -1) return simulate(undefined);
  territories[idx] = { ...territories[idx], ...data };
  return simulate(territories[idx]);
}

export async function deleteTerritories(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = territories.findIndex((t) => t.id === id);
    if (idx !== -1) { territories.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * CRM Events
 * ============================================================ */
export async function fetchCrmEvents(filters?: {
  search?: string;
  type?: CrmEventType | null;
  status?: CrmEventStatus | null;
}): Promise<CrmEvent[]> {
  let result = [...crmEvents];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  if (filters?.type) result = result.filter((e) => e.type === filters.type);
  if (filters?.status) result = result.filter((e) => e.status === filters.status);
  return simulate(result);
}

export async function fetchCrmEventById(id: string): Promise<CrmEvent | undefined> {
  return simulate(crmEvents.find((e) => e.id === id));
}

export async function createCrmEvent(data: Omit<CrmEvent, "id">): Promise<CrmEvent> {
  const newEvent: CrmEvent = { ...data, id: `ce${nextEventId2++}` };
  crmEvents.push(newEvent);
  return simulate(newEvent);
}

export async function updateCrmEvent(id: string, data: Partial<CrmEvent>): Promise<CrmEvent | undefined> {
  const idx = crmEvents.findIndex((e) => e.id === id);
  if (idx === -1) return simulate(undefined);
  crmEvents[idx] = { ...crmEvents[idx], ...data };
  return simulate(crmEvents[idx]);
}

export async function deleteCrmEvents(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = crmEvents.findIndex((e) => e.id === id);
    if (idx !== -1) { crmEvents.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Analyzed Deals
 * ============================================================ */
export async function fetchAnalyzedDeals(filters?: {
  search?: string;
  outcome?: DealOutcome | null;
  lossReason?: LossReason | null;
}): Promise<AnalyzedDeal[]> {
  let result = [...analyzedDeals];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (ad) =>
        ad.name.toLowerCase().includes(q) ||
        (ad.competitor?.toLowerCase().includes(q) ?? false) ||
        ad.customer.toLowerCase().includes(q) ||
        ad.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  if (filters?.outcome) result = result.filter((ad) => ad.outcome === filters.outcome);
  if (filters?.lossReason) result = result.filter((ad) => ad.lossReason === filters.lossReason);
  return simulate(result);
}

export async function fetchAnalyzedDealById(id: string): Promise<AnalyzedDeal | undefined> {
  return simulate(analyzedDeals.find((ad) => ad.id === id));
}

export async function createAnalyzedDeal(data: Omit<AnalyzedDeal, "id">): Promise<AnalyzedDeal> {
  const newDeal: AnalyzedDeal = { ...data, id: `ad${nextAnalyzedDealId++}` };
  analyzedDeals.push(newDeal);
  return simulate(newDeal);
}

export async function updateAnalyzedDeal(id: string, data: Partial<AnalyzedDeal>): Promise<AnalyzedDeal | undefined> {
  const idx = analyzedDeals.findIndex((ad) => ad.id === id);
  if (idx === -1) return simulate(undefined);
  analyzedDeals[idx] = { ...analyzedDeals[idx], ...data };
  return simulate(analyzedDeals[idx]);
}

export async function deleteAnalyzedDeals(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = analyzedDeals.findIndex((ad) => ad.id === id);
    if (idx !== -1) { analyzedDeals.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Renewals
 * ============================================================ */
export async function fetchRenewals(filters?: {
  search?: string;
  status?: RenewalStatus | null;
}): Promise<Renewal[]> {
  let result = [...renewals];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (r) =>
        r.customer.toLowerCase().includes(q) ||
        r.plan.toLowerCase().includes(q) ||
        r.csm.toLowerCase().includes(q) ||
        r.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  if (filters?.status) result = result.filter((r) => r.status === filters.status);
  return simulate(result);
}

export async function fetchRenewalById(id: string): Promise<Renewal | undefined> {
  return simulate(renewals.find((r) => r.id === id));
}

export async function createRenewal(data: Omit<Renewal, "id">): Promise<Renewal> {
  const newRenewal: Renewal = { ...data, id: `re${nextRenewalId++}` };
  renewals.push(newRenewal);
  return simulate(newRenewal);
}

export async function updateRenewal(id: string, data: Partial<Renewal>): Promise<Renewal | undefined> {
  const idx = renewals.findIndex((r) => r.id === id);
  if (idx === -1) return simulate(undefined);
  renewals[idx] = { ...renewals[idx], ...data };
  return simulate(renewals[idx]);
}

export async function deleteRenewals(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = renewals.findIndex((r) => r.id === id);
    if (idx !== -1) { renewals.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Revenue Leaks
 * ============================================================ */
export async function fetchRevenueLeaks(filters?: {
  search?: string;
  type?: LeakType | null;
  severity?: LeakSeverity | null;
  status?: LeakStatus | null;
}): Promise<RevenueLeakItem[]> {
  let result = [...revenueLeaks];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (rl) =>
        rl.title.toLowerCase().includes(q) ||
        rl.customer.toLowerCase().includes(q) ||
        rl.assignedTo.toLowerCase().includes(q) ||
        rl.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  if (filters?.type) result = result.filter((rl) => rl.type === filters.type);
  if (filters?.severity) result = result.filter((rl) => rl.severity === filters.severity);
  if (filters?.status) result = result.filter((rl) => rl.status === filters.status);
  return simulate(result);
}

export async function fetchRevenueLeakById(id: string): Promise<RevenueLeakItem | undefined> {
  return simulate(revenueLeaks.find((rl) => rl.id === id));
}

export async function createRevenueLeak(data: Omit<RevenueLeakItem, "id">): Promise<RevenueLeakItem> {
  const newLeak: RevenueLeakItem = { ...data, id: `rl${nextLeakId++}` };
  revenueLeaks.push(newLeak);
  return simulate(newLeak);
}

export async function updateRevenueLeak(id: string, data: Partial<RevenueLeakItem>): Promise<RevenueLeakItem | undefined> {
  const idx = revenueLeaks.findIndex((rl) => rl.id === id);
  if (idx === -1) return simulate(undefined);
  revenueLeaks[idx] = { ...revenueLeaks[idx], ...data };
  return simulate(revenueLeaks[idx]);
}

export async function deleteRevenueLeaks(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = revenueLeaks.findIndex((rl) => rl.id === id);
    if (idx !== -1) { revenueLeaks.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Partners
 * ============================================================ */
export async function fetchPartners(filters?: {
  search?: string;
  tier?: PartnerTier | null;
  type?: PartnerType | null;
  status?: PartnerStatus | null;
}): Promise<Partner[]> {
  let result = [...partners];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.specializations.some((s) => s.toLowerCase().includes(q)) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  if (filters?.tier) result = result.filter((p) => p.tier === filters.tier);
  if (filters?.type) result = result.filter((p) => p.type === filters.type);
  if (filters?.status) result = result.filter((p) => p.status === filters.status);
  return simulate(result);
}

export async function fetchPartnerById(id: string): Promise<Partner | undefined> {
  return simulate(partners.find((p) => p.id === id));
}

export async function createPartner(data: Omit<Partner, "id">): Promise<Partner> {
  const newPartner: Partner = { ...data, id: `pa${nextPartnerId++}` };
  partners.push(newPartner);
  return simulate(newPartner);
}

export async function updatePartner(id: string, data: Partial<Partner>): Promise<Partner | undefined> {
  const idx = partners.findIndex((p) => p.id === id);
  if (idx === -1) return simulate(undefined);
  partners[idx] = { ...partners[idx], ...data };
  return simulate(partners[idx]);
}

export async function deletePartners(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = partners.findIndex((p) => p.id === id);
    if (idx !== -1) { partners.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Churn Risk Accounts
 * ============================================================ */
export async function fetchChurnRiskAccounts(filters?: {
  search?: string;
  level?: ChurnRiskLevel | null;
  interventionStatus?: InterventionStatus | null;
}): Promise<ChurnRiskAccount[]> {
  let result = [...churnRiskAccounts];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (cra) =>
        cra.customer.toLowerCase().includes(q) ||
        cra.csm.toLowerCase().includes(q) ||
        cra.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  if (filters?.level) result = result.filter((cra) => cra.riskLevel === filters.level);
  if (filters?.interventionStatus) result = result.filter((cra) => cra.interventionStatus === filters.interventionStatus);
  return simulate(result);
}

export async function fetchChurnRiskAccountById(id: string): Promise<ChurnRiskAccount | undefined> {
  return simulate(churnRiskAccounts.find((cra) => cra.id === id));
}

export async function createChurnRiskAccount(data: Omit<ChurnRiskAccount, "id">): Promise<ChurnRiskAccount> {
  const newChurnRiskAccount: ChurnRiskAccount = { ...data, id: `cra${nextChurnAccountId++}` };
  churnRiskAccounts.push(newChurnRiskAccount);
  return simulate(newChurnRiskAccount);
}

export async function updateChurnRiskAccount(id: string, data: Partial<ChurnRiskAccount>): Promise<ChurnRiskAccount | undefined> {
  const idx = churnRiskAccounts.findIndex((cra) => cra.id === id);
  if (idx === -1) return simulate(undefined);
  churnRiskAccounts[idx] = { ...churnRiskAccounts[idx], ...data };
  return simulate(churnRiskAccounts[idx]);
}

export async function deleteChurnRiskAccounts(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = churnRiskAccounts.findIndex((cra) => cra.id === id);
    if (idx !== -1) { churnRiskAccounts.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * Team Members
 * ============================================================ */
export async function fetchTeamMembers(filters?: {
  search?: string;
  burnoutRisk?: BurnoutRisk | null;
}): Promise<TeamMember[]> {
  let result = [...teamMembers];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (tm) =>
        tm.name.toLowerCase().includes(q) ||
        tm.role.toLowerCase().includes(q) ||
        tm.department.toLowerCase().includes(q) ||
        tm.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  if (filters?.burnoutRisk) result = result.filter((tm) => tm.burnoutRisk === filters.burnoutRisk);
  return simulate(result);
}

export async function fetchTeamMemberById(id: string): Promise<TeamMember | undefined> {
  return simulate(teamMembers.find((tm) => tm.id === id));
}

export async function createTeamMember(data: Omit<TeamMember, "id">): Promise<TeamMember> {
  const newTeamMember: TeamMember = { ...data, id: `tm${nextTeamMemberId++}` };
  teamMembers.push(newTeamMember);
  return simulate(newTeamMember);
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember | undefined> {
  const idx = teamMembers.findIndex((tm) => tm.id === id);
  if (idx === -1) return simulate(undefined);
  teamMembers[idx] = { ...teamMembers[idx], ...data };
  return simulate(teamMembers[idx]);
}

export async function deleteTeamMembers(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = teamMembers.findIndex((tm) => tm.id === id);
    if (idx !== -1) { teamMembers.splice(idx, 1); count++; }
  }
  return simulate(count);
}

/* ============================================================
 * NPS Tracker API
 * ============================================================ */
export async function fetchNpsFeedbacks(filters?: {
  search?: string;
  category?: NPSCategory | null;
  channel?: FeedbackChannel | null;
  sentiment?: string | null;
}): Promise<FeedbackEntry[]> {
  let result = [...npsFeedbacks];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((f) =>
      f.clientName.toLowerCase().includes(q) ||
      f.clientCompany.toLowerCase().includes(q) ||
      f.comment.toLowerCase().includes(q)
    );
  }
  if (filters?.category) result = result.filter((f) => f.category === filters.category);
  if (filters?.channel) result = result.filter((f) => f.channel === filters.channel);
  if (filters?.sentiment) result = result.filter((f) => f.sentiment === filters.sentiment);
  return simulate(result);
}

export async function fetchClientNpsRecords(): Promise<ClientNPS[]> {
  return simulate([...clientNpsRecords]);
}

export async function fetchNpsTrendData(): Promise<typeof npsTrendData> {
  return simulate([...npsTrendData]);
}

export async function createNpsFeedback(data: Omit<FeedbackEntry, "id">): Promise<FeedbackEntry> {
  const newEntry: FeedbackEntry = { ...data, id: `f${nextFeedbackId++}` };
  npsFeedbacks.push(newEntry);
  return simulate(newEntry);
}

export async function updateNpsFeedback(id: string, data: Partial<FeedbackEntry>): Promise<FeedbackEntry | undefined> {
  const idx = npsFeedbacks.findIndex((f) => f.id === id);
  if (idx === -1) return simulate(undefined);
  npsFeedbacks[idx] = { ...npsFeedbacks[idx], ...data };
  return simulate(npsFeedbacks[idx]);
}

/* ============================================================
 * Campaign ROI API
 * ============================================================ */
export async function fetchCampaignRois(filters?: {
  search?: string;
  channel?: CampaignChannel | null;
  status?: CampaignStatus | null;
}): Promise<CampaignRoi[]> {
  let result = [...campaignRois];
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((c) => c.name.toLowerCase().includes(q));
  }
  if (filters?.channel) result = result.filter((c) => c.channel === filters.channel);
  if (filters?.status) result = result.filter((c) => c.status === filters.status);
  return simulate(result);
}

export async function createCampaignRoi(data: Omit<CampaignRoi, "id">): Promise<CampaignRoi> {
  const newCampaign: CampaignRoi = { ...data, id: `cp_${String(nextCampaignRoiId++).padStart(2, "0")}` };
  campaignRois.push(newCampaign);
  return simulate(newCampaign);
}

export async function updateCampaignRoi(id: string, data: Partial<CampaignRoi>): Promise<CampaignRoi | undefined> {
  const idx = campaignRois.findIndex((c) => c.id === id);
  if (idx === -1) return simulate(undefined);
  campaignRois[idx] = { ...campaignRois[idx], ...data };
  return simulate(campaignRois[idx]);
}

export async function deleteCampaignRois(ids: string[]): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const idx = campaignRois.findIndex((c) => c.id === id);
    if (idx !== -1) { campaignRois.splice(idx, 1); count++; }
  }
  return simulate(count);
}