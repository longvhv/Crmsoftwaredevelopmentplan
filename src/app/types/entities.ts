/* ============================================================
 * Entity Types - Core CRM Entities
 * Tuân thủ schema từ /docs/*.schema.md
 * ============================================================ */

import type {
  UUID,
  ISODateTime,
  ISODate,
  CurrencyCode,
  BaseEntity,
  OwnedEntity,
  TaggableEntity,
  CustomizableEntity,
  Priority,
  TaskStatus,
  Trend,
  AIScorable,
  Money,
  Address,
  UserRef,
  EmployeeRef,
} from "./common";

/* ============================================================
 * SYSTEM CORE (V001)
 * ============================================================ */

/** Tenant (multi-tenant root) */
export interface Tenant extends BaseEntity {
  name: string;
  domain: string;
  plan: "free" | "starter" | "professional" | "enterprise";
  status: "active" | "inactive" | "suspended" | "trial";
  maxUsers: number;
  settings: Record<string, unknown>;
}

/** User (authentication) */
export interface User extends BaseEntity {
  email: string;
  displayName: string;
  avatarUrl?: string;
  status: "active" | "inactive" | "pending" | "suspended";
  emailVerified: boolean;
  mfaEnabled: boolean;
  locale: string;
  timezone: string;
  lastLoginAt?: ISODateTime;
}

/** Role (RBAC) */
export interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
}

/** Department */
export interface Department extends BaseEntity {
  name: string;
  description?: string;
  parentDepartmentId?: UUID;
  managerId?: UUID;
}

/* ============================================================
 * CRM CORE (V002)
 * ============================================================ */

/** Employee type */
export type EmployeeType = "human" | "ai-agent";

/** Employee status */
export type EmployeeStatus = "active" | "inactive" | "on-leave";

/** Employee (nhân viên hoặc AI agent) */
export interface Employee extends BaseEntity, TaggableEntity {
  employeeCode?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  departmentId?: UUID;
  position?: string;
  employeeType: EmployeeType;
  status: EmployeeStatus;
  hireDate?: ISODate;
  managerId?: UUID;
  skills: string[];
  /** KPI scores */
  performanceScore?: number;
  performanceTrend?: Trend;
}

/** Contact type */
export type ContactType = "customer" | "lead" | "partner" | "vendor" | "other";

/** Contact status */
export type ContactStatus = "active" | "inactive" | "churned";

/** Contact (liên hệ / khách hàng) */
export interface Contact extends BaseEntity, TaggableEntity, CustomizableEntity, AIScorable {
  firstName: string;
  lastName?: string;
  fullName: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  contactType: ContactType;
  status: ContactStatus;
  source?: string;
  ownerId?: UUID;
  address?: Address;
  socialProfiles?: Record<string, string>;
  leadScore?: number;
  lifetimeValue: number;
  lastActivityAt?: ISODateTime;
}

/** Deal stage (from deal_stages table or inline) */
export type DealStage =
  | "qualification"
  | "discovery"
  | "proposal"
  | "negotiation"
  | "closed-won"
  | "closed-lost";

/** Deal priority */
export type DealPriority = "hot" | "warm" | "cold";

/** Deal (cơ hội kinh doanh) */
export interface Deal extends BaseEntity, TaggableEntity, CustomizableEntity, AIScorable {
  name: string;
  contactId?: UUID;
  value: number;
  currency: CurrencyCode;
  stage: DealStage;
  probability: number;
  ownerId?: UUID;
  source?: string;
  expectedCloseDate?: ISODate;
  actualCloseDate?: ISODate;
  won?: boolean;
  lostReason?: string;
  pipeline: string;
}

/** Activity type */
export type ActivityType = "call" | "email" | "meeting" | "note" | "task";

/** Activity (hoạt động CRM) */
export interface Activity extends BaseEntity {
  activityType: ActivityType;
  subject: string;
  description?: string;
  contactId?: UUID;
  dealId?: UUID;
  ownerId?: UUID;
  status: TaskStatus;
  priority: Priority;
  dueDate?: ISODateTime;
  completedAt?: ISODateTime;
  outcome?: string;
}

/** Tag (universal tagging) */
export interface Tag extends BaseEntity {
  name: string;
  color?: string;
}

/** Entity tag (polymorphic N-N) */
export interface EntityTag extends BaseEntity {
  tagId: UUID;
  entityType: string;
  entityId: UUID;
}

/* ============================================================
 * LEADS & COMMUNICATION (V003)
 * ============================================================ */

/** Lead status */
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "disqualified";

/** Lead source */
export type LeadSource =
  | "website"
  | "referral"
  | "linkedin"
  | "clutch"
  | "cold-outreach"
  | "event"
  | "inbound"
  | "partner";

/** Lead (potential customer) */
export interface Lead extends BaseEntity, TaggableEntity, CustomizableEntity, AIScorable {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  status: LeadStatus;
  source: LeadSource;
  campaign?: string;
  referrer?: string;
  ownerId?: UUID;
  leadScore: number;
  qualified: boolean;
  qualifiedAt?: ISODateTime;
  converted: boolean;
  convertedAt?: ISODateTime;
  convertedDate?: ISODateTime;
  contactId?: UUID;
  dealId?: UUID;
  disqualifiedReason?: string;
  interestedProducts?: string[];
  budget?: number;
  timeline?: string;
  city?: string;
  state?: string;
  country?: string;
  notes?: string;
}

/** Email template */
export interface EmailTemplate extends BaseEntity {
  name: string;
  subject: string;
  body: string;
  category?: string;
  isActive: boolean;
}

/** Email sequence */
export interface EmailSequence extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
}

/** Email sequence step */
export interface EmailSequenceStep extends BaseEntity {
  sequenceId: UUID;
  stepOrder: number;
  templateId: UUID;
  delayDays: number;
}

/** SMS campaign */
export interface SmsCampaign extends BaseEntity {
  name: string;
  message: string;
  scheduledAt?: ISODateTime;
  sentAt?: ISODateTime;
  recipientCount: number;
  deliveredCount: number;
  failedCount: number;
}

/* ============================================================
 * TASKS & CALENDAR (V004)
 * ============================================================ */

/** Task (to-do item) */
export interface Task extends BaseEntity {
  title: string;
  description?: string;
  assignedTo?: UUID;
  relatedEntityType?: string;
  relatedEntityId?: UUID;
  status: TaskStatus;
  priority: Priority;
  dueDate?: ISODateTime;
  completedAt?: ISODateTime;
}

/** Calendar event */
export interface CalendarEvent extends BaseEntity {
  title: string;
  description?: string;
  startTime: ISODateTime;
  endTime: ISODateTime;
  location?: string;
  attendees: UUID[];
  organizer: UUID;
  isAllDay: boolean;
  eventType: "meeting" | "call" | "demo" | "webinar" | "other";
}

/* ============================================================
 * PRODUCTS & QUOTATIONS (V004)
 * ============================================================ */

/** Product */
export interface Product extends BaseEntity, TaggableEntity {
  name: string;
  sku: string;
  description?: string;
  category?: string;
  basePrice: number;
  currency: CurrencyCode;
  isActive: boolean;
  stockQuantity?: number;
}

/** Pricing tier (SKU variant) */
export interface PricingTier extends BaseEntity {
  productId: UUID;
  tierName: string;
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
  currency: CurrencyCode;
}

/** Quotation status */
export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

/** Quotation */
export interface Quotation extends BaseEntity {
  quotationNumber: string;
  contactId: UUID;
  dealId?: UUID;
  status: QuotationStatus;
  validUntil?: ISODate;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: CurrencyCode;
  notes?: string;
}

/** Quotation line item */
export interface QuotationLineItem extends BaseEntity {
  quotationId: UUID;
  productId: UUID;
  pricingTierId?: UUID;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

/* ============================================================
 * CONTRACTS & COMMISSIONS (V005)
 * ============================================================ */

/** Contract status */
export type ContractStatus = "draft" | "active" | "expired" | "terminated" | "renewed";

/** Contract */
export interface Contract extends BaseEntity {
  contractNumber: string;
  contactId: UUID;
  dealId?: UUID;
  quotationId?: UUID;
  status: ContractStatus;
  startDate: ISODate;
  endDate?: ISODate;
  value: number;
  currency: CurrencyCode;
  autoRenew: boolean;
  terms?: string;
}

/** Contract amendment */
export interface ContractAmendment extends BaseEntity {
  contractId: UUID;
  amendmentNumber: string;
  effectiveDate: ISODate;
  changes: string;
  approvedBy?: UUID;
  approvedAt?: ISODateTime;
}

/** Commission tier */
export interface CommissionTier extends BaseEntity {
  tierName: string;
  minRevenue: number;
  maxRevenue?: number;
  commissionRate: number;
  isActive: boolean;
}

/** Bonus rule */
export interface BonusRule extends BaseEntity {
  ruleName: string;
  description?: string;
  condition: string;
  bonusAmount?: number;
  bonusPercentage?: number;
  isActive: boolean;
}

/** Sales rep commission */
export interface SalesRepCommission extends BaseEntity {
  employeeId: UUID;
  dealId: UUID;
  revenue: number;
  commissionAmount: number;
  paidAt?: ISODateTime;
}

/** Commission bonus */
export interface CommissionBonus extends BaseEntity {
  employeeId: UUID;
  bonusRuleId: UUID;
  bonusAmount: number;
  period: string;
  paidAt?: ISODateTime;
}

/* ============================================================
 * SUPPORT (V006)
 * ============================================================ */

/** Ticket status */
export type TicketStatus = "open" | "in-progress" | "pending" | "resolved" | "closed";

/** Support ticket */
export interface SupportTicket extends BaseEntity {
  ticketNumber: string;
  contactId?: UUID;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  assignedTo?: UUID;
  resolvedAt?: ISODateTime;
  closedAt?: ISODateTime;
  resolution?: string;
}

/** Ticket message (thread) */
export interface TicketMessage extends BaseEntity {
  ticketId: UUID;
  senderId: UUID;
  message: string;
  isInternal: boolean;
}

/** Vendor */
export interface Vendor extends BaseEntity, TaggableEntity {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: Address;
  category?: string;
  status: "active" | "inactive";
}

/** Vendor contract */
export interface VendorContract extends BaseEntity {
  vendorId: UUID;
  contractNumber: string;
  startDate: ISODate;
  endDate?: ISODate;
  value: number;
  currency: CurrencyCode;
  status: ContractStatus;
}

/** Partner */
export interface Partner extends BaseEntity, TaggableEntity {
  name: string;
  partnerType: "reseller" | "referral" | "technology" | "strategic";
  contactPerson?: string;
  email?: string;
  phone?: string;
  status: "active" | "inactive";
  commissionRate?: number;
}

/* ============================================================
 * CUSTOMER SUCCESS (V007)
 * ============================================================ */

/** Customer health score */
export type HealthScore = "healthy" | "at-risk" | "churned";

/** Customer health */
export interface CustomerHealth extends BaseEntity {
  contactId: UUID;
  healthScore: HealthScore;
  engagementScore: number;
  productAdoptionScore: number;
  supportSatisfactionScore: number;
  renewalProbability: number;
  lastReviewedAt?: ISODateTime;
}

/** Health metric (individual metric) */
export interface HealthMetric extends BaseEntity {
  customerHealthId: UUID;
  metricName: string;
  metricValue: number;
  threshold: number;
  status: "good" | "warning" | "critical";
}

/** Health score trend (time series) */
export interface HealthScoreTrend extends BaseEntity {
  customerHealthId: UUID;
  recordedAt: ISODateTime;
  healthScore: HealthScore;
  engagementScore: number;
}

/** NPS feedback */
export interface NpsFeedback extends BaseEntity {
  contactId: UUID;
  score: number;
  comment?: string;
  surveyDate: ISODate;
  category: "promoter" | "passive" | "detractor";
}

/** Client NPS snapshot */
export interface ClientNpsSnapshot extends BaseEntity {
  contactId: UUID;
  snapshotDate: ISODate;
  npsScore: number;
  promoters: number;
  passives: number;
  detractors: number;
}

/** Churn risk account */
export interface ChurnRiskAccount extends BaseEntity {
  contactId: UUID;
  riskScore: number;
  riskFactors: string[];
  mitigationPlan?: string;
  assignedTo?: UUID;
  reviewDate?: ISODate;
}

/** Renewal */
export interface Renewal extends BaseEntity {
  contractId: UUID;
  contactId: UUID;
  renewalDate: ISODate;
  renewalValue: number;
  renewalProbability: number;
  status: "upcoming" | "in-progress" | "renewed" | "lost";
  assignedTo?: UUID;
}

/* ============================================================
 * Type Exports for Re-use
 * ============================================================ */

export type {
  // Common re-exports
  UUID,
  ISODateTime,
  ISODate,
  CurrencyCode,
  Priority,
  TaskStatus,
  Trend,
  Money,
  Address,
  UserRef,
  EmployeeRef,
} from "./common";