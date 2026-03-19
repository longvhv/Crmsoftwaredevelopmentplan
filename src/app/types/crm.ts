/* ============================================================
 * Kiểu dữ liệu CRM cốt lõi
 * Thiết kế AI-ready: mọi entity có metadata, scores, tags
 * ============================================================ */

/** Loại nhân viên */
export type EmployeeType = "human" | "ai";

/** Trạng thái hoạt động */
export type ActiveStatus = "active" | "inactive" | "on-leave";

/** Vai trò trong tổ chức */
export interface Role {
  id: string;
  name: string;
  department: string;
}

/** Nhân viên (con người hoặc AI) */
export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: EmployeeType;
  status: ActiveStatus;
  primaryRole: Role;
  secondaryRoles: Role[];
  joinDate: string;
  /** Điểm hiệu suất tổng hợp (0-100) */
  performanceScore: number;
  /** Xu hướng hiệu suất */
  performanceTrend: "up" | "down" | "stable";
  /** Các chỉ số KPI */
  kpiScores: {
    revenue: number;
    activity: number;
    quality: number;
    aiCollaboration: number;
  };
  /** Metadata cho AI */
  tags: string[];
}

/** Trạng thái liên hệ */
export type ContactStatus = "active" | "inactive" | "prospect" | "churned";

/** Loại liên hệ */
export type ContactType = "lead" | "customer" | "partner" | "vendor";

/** Liên hệ / Khách hàng */
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  type: ContactType;
  status: ContactStatus;
  source: string;
  assignedTo: string;
  /** Điểm chất lượng lead do AI tính (0-100) */
  aiLeadScore: number;
  /** Mức độ tương tác (0-100) */
  engagementScore: number;
  lastContactDate: string;
  createdDate: string;
  tags: string[];
  notes?: string;
}

/** Loại công ty */
export type CompanyType = "prospect" | "customer" | "partner" | "vendor";

/** Trạng thái công ty */
export type CompanyStatus = "active" | "inactive" | "churned";

/** Quy mô công ty */
export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+";

/** Công ty / Tổ chức */
export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry: string;
  size: CompanySize;
  type: CompanyType;
  status: CompanyStatus;
  /** Website chính */
  website?: string;
  /** Số điện thoại công ty */
  phone?: string;
  /** Email liên hệ chung */
  email?: string;
  /** Địa chỉ trụ sở chính */
  address?: string;
  city?: string;
  country?: string;
  /** Công ty mẹ (nếu có) */
  parentCompanyId?: string;
  /** Người phụ trách chính */
  assignedTo: string;
  /** Điểm ICP (Ideal Customer Profile) do AI tính (0-100) */
  icpScore: number;
  /** Điểm tương tác (0-100) */
  engagementScore: number;
  /** Số lượng nhân viên ước tính */
  employeeCount?: number;
  /** Doanh thu hàng năm ước tính */
  annualRevenue?: number;
  /** Ngày tạo */
  createdDate: string;
  /** Ngày cập nhật gần nhất */
  lastContactDate: string;
  tags: string[];
  notes?: string;
}

/** Giai đoạn pipeline */
export type DealStage =
  | "qualification"
  | "discovery"
  | "proposal"
  | "negotiation"
  | "closed-won"
  | "closed-lost";

/** Mức ưu tiên deal */
export type DealPriority = "hot" | "warm" | "cold";

/** Deal / Cơ hội kinh doanh */
export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  company: string;
  value: number;
  currency: string;
  stage: DealStage;
  priority: DealPriority;
  probability: number;
  assignedTo: string;
  expectedCloseDate: string;
  createdDate: string;
  /** Dự đoán AI về xác suất thắng */
  aiWinProbability: number;
  /** AI gợi ý hành động tiếp theo */
  aiNextAction?: string;
  tags: string[];
  notes?: string;
}

/** Loại hoạt động */
export type ActivityType = "call" | "email" | "meeting" | "note" | "task";

/** Hoạt động CRM */
export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  contactId?: string;
  dealId?: string;
  performedBy: string;
  performedAt: string;
  duration?: number;
  /** AI tự động ghi lại hay con người */
  isAutoLogged: boolean;
}

/** Thống kê tổng quan CRM */
export interface CrmOverviewStats {
  totalContacts: number;
  activeDeals: number;
  totalPipelineValue: number;
  wonThisMonth: number;
  wonValueThisMonth: number;
  conversionRate: number;
  avgDealSize: number;
  avgDealCycle: number;
  activitiesThisWeek: number;
  aiActionsToday: number;
}

/** Cấu hình hiển thị cho Deal Stage */
export interface DealStageConfig {
  label: string;
  color: string;
  bgColor: string;
}

/** Cấu hình hiển thị cho Contact Type */
export interface ContactTypeConfig {
  label: string;
  color: string;
}

/* ============================================================
 * Ticket Support types
 * ============================================================ */

/** Mức ưu tiên ticket */
export type TicketPriority = "critical" | "high" | "medium" | "low";

/** Trạng thái ticket */
export type TicketStatus = "open" | "in-progress" | "waiting" | "resolved" | "closed";

/** Danh mục ticket */
export type TicketCategory =
  | "bug"
  | "feature-request"
  | "question"
  | "billing"
  | "integration"
  | "performance";

/** Tin nhắn trong ticket */
export interface TicketMessage {
  id: string;
  sender: string;
  isAgent: boolean;
  content: string;
  timestamp: string;
}

/** Ticket hỗ trợ khách hàng */
export interface SupportTicket {
  id: string;
  ticketNo: string;
  subject: string;
  description: string;
  clientCompany: string;
  clientName: string;
  clientEmail: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string;
  assigneeAvatar: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  slaBreached: boolean;
  tags: string[];
  messages: TicketMessage[];
  /** AI phân tích & gợi ý */
  aiSuggestion: string;
  /** Thời gian giải quyết (giờ), null nếu chưa xong */
  resolutionTime: number | null;
}

/* ============================================================
 * Product Catalog types
 * ============================================================ */

/** Loại sản phẩm */
export type ProductType = "product" | "service" | "bundle";

/** Danh mục sản phẩm */
export type ProductCategory =
  | "outsource"
  | "product"
  | "consulting"
  | "ai-solution"
  | "maintenance"
  | "training";

/** Mô hình định giá */
export type PricingModel = "fixed" | "hourly" | "monthly" | "per-user" | "custom";

/** Trạng thái sản phẩm */
export type ProductStatus = "active" | "draft" | "deprecated";

/** Gói giá */
export interface PricingTier {
  name: string;
  price: number;
  unit: string;
  features: string[];
  recommended?: boolean;
}

/** Sản phẩm / Dịch vụ */
export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  type: ProductType;
  category: ProductCategory;
  pricingModel: PricingModel;
  basePrice: number;
  currency: string;
  tiers: PricingTier[];
  dealsUsing: number;
  totalRevenue: number;
  avgDealSize: number;
  winRate: number;
  tags: string[];
  status: ProductStatus;
  /** AI-generated tech fit score */
  aiTechFitScore: number;
}

/* ============================================================
 * Lead Inbox types
 * ============================================================ */

/** Lead status workflow */
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "disqualified";

/** Lead source channel */
export type LeadChannel = 
  | "website" 
  | "linkedin" 
  | "clutch" 
  | "cold-outreach" 
  | "referral" 
  | "event" 
  | "inbound" 
  | "partner";

/** Lead entity */
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  position: string;
  channel: LeadChannel;
  status: LeadStatus;
  /** AI qualification score 0-100 */
  aiScore: number;
  assignedTo: string | null;
  receivedAt: string;
  lastActivity?: string;
  notes?: string;
  tags: string[];
}

/* ============================================================
 * Email Templates types
 * ============================================================ */

/** Email template category */
export type EmailTemplateCategory = 
  | "cold-outreach" 
  | "follow-up" 
  | "proposal" 
  | "nurture" 
  | "onboarding" 
  | "support";

/** Email template status */
export type EmailTemplateStatus = "active" | "draft" | "archived";

/** Email template entity */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: EmailTemplateCategory;
  status: EmailTemplateStatus;
  /** HTML body content */
  bodyHtml: string;
  /** Plain text fallback */
  bodyText: string;
  /** Personalization variables like {{firstName}}, {{company}} */
  variables: string[];
  /** Times used in campaigns */
  usageCount: number;
  /** Open rate % */
  openRate: number;
  /** Click-through rate % */
  ctr: number;
  /** AI-generated effectiveness score 0-100 */
  aiScore: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

/* ============================================================
 * Email Sequences types
 * ============================================================ */

/** Email sequence status */
export type EmailSequenceStatus = "active" | "paused" | "draft" | "completed";

/** Sequence step action type */
export type SequenceStepType = "email" | "wait" | "condition" | "task";

/** Sequence step condition */
export interface SequenceCondition {
  type: "opened" | "clicked" | "replied" | "not-opened";
  /** If true, go to trueStepId, else falseStepId */
  trueStepId?: string;
  falseStepId?: string;
}

/** Individual step in sequence */
export interface SequenceStep {
  id: string;
  type: SequenceStepType;
  order: number;
  /** For email steps */
  templateId?: string;
  /** For wait steps - delay in hours */
  delayHours?: number;
  /** For condition steps */
  condition?: SequenceCondition;
  /** For task steps */
  taskTitle?: string;
  taskAssignee?: string;
}

/** Email sequence entity */
export interface EmailSequence {
  id: string;
  name: string;
  description: string;
  status: EmailSequenceStatus;
  /** Array of steps */
  steps: SequenceStep[];
  /** How many contacts enrolled */
  enrolledCount: number;
  /** How many completed */
  completedCount: number;
  /** Overall open rate % */
  openRate: number;
  /** Overall reply rate % */
  replyRate: number;
  /** AI-generated effectiveness score 0-100 */
  aiScore: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

/* ============================================================
 * Calendar Event types
 * ============================================================ */

/** Loại sự kiện lịch */
export type CalendarEventType = "meeting" | "call" | "follow-up" | "deadline" | "task" | "demo";

/** Sự kiện lịch hẹn */
export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string;
  startTime: string;
  endTime: string;
  contactName?: string;
  company?: string;
  dealTitle?: string;
  location?: string;
  isOnline: boolean;
  assignedTo: string;
  isAIGenerated: boolean;
  priority: "high" | "medium" | "low";
  notes?: string;
}

/* ============================================================
 * Task Board types
 * ============================================================ */

/** Trạng thái task */
export type TaskStatus = "backlog" | "todo" | "in-progress" | "done";

/** Mức ưu tiên task */
export type TaskPriority = "urgent" | "high" | "medium" | "low";

/** Danh mục task */
export type TaskCategory = "follow-up" | "meeting" | "proposal" | "review" | "outreach" | "admin";

/** Công việc / Task */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  assignee: string;
  dueDate: string;
  contactName?: string;
  dealName?: string;
  isAISuggested: boolean;
  createdDate: string;
  tags: string[];
}

/* ============================================================
 * Contract Management types
 * ============================================================ */

/** Trạng thái hợp đồng */
export type ContractStatus = "active" | "expiring-soon" | "expired" | "pending" | "terminated" | "renewed";

/** Loại hợp đồng */
export type ContractType = "outsource" | "product-license" | "consulting" | "managed-service" | "training";

/** Phụ lục / Sửa đổi hợp đồng */
export type AmendmentType = "scope-change" | "price-change" | "extension" | "team-change";

export interface Amendment {
  id: string;
  date: string;
  type: AmendmentType;
  description: string;
  approvedBy: string;
}

/** Hợp đồng */
export interface Contract {
  id: string;
  code: string;
  clientName: string;
  clientCompany: string;
  dealName: string;
  type: ContractType;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  totalValue: number;
  monthlyValue: number;
  currency: string;
  autoRenew: boolean;
  paymentTerms: string;
  amendments: Amendment[];
  owner: string;
  aiRenewalProbability: number;
  aiRenewalNote: string;
  tags: string[];
}

/* ============================================================
 * Vendor Management types
 * ============================================================ */

/** Trạng thái vendor */
export type VendorStatus = "active" | "on-hold" | "evaluating" | "terminated";

/** Tier vendor */
export type VendorTier = "strategic" | "preferred" | "approved" | "trial";

/** Danh mục vendor */
export type VendorCategory = "development" | "design" | "infrastructure" | "consulting" | "qa-testing" | "ai-ml";

export interface VendorContract {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  value: number;
  status: "active" | "expiring" | "expired";
}

/** Nhà cung cấp */
export interface Vendor {
  id: string;
  name: string;
  logo: string;
  category: VendorCategory;
  status: VendorStatus;
  tier: VendorTier;
  country: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  teamSize: number;
  hourlyRate: { min: number; max: number };
  overallScore: number;
  qualityScore: number;
  deliveryScore: number;
  communicationScore: number;
  costScore: number;
  innovationScore: number;
  securityScore: number;
  totalSpend: number;
  activeProjects: number;
  completedProjects: number;
  contracts: VendorContract[];
  trend: "up" | "down" | "stable";
  aiNote: string;
  tags: string[];
}

/* ============================================================
 * Goal & OKR Tracking types
 * ============================================================ */

/** Cấp độ mục tiêu */
export type GoalLevel = "company" | "team" | "individual";

/** Trạng thái mục tiêu */
export type GoalStatus = "on-track" | "at-risk" | "behind" | "completed" | "not-started";

/** Danh mục mục tiêu */
export type GoalCategory = "revenue" | "customer" | "product" | "people" | "operational" | "innovation";

/** Key Result trong OKR */
export interface KeyResult {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  progress: number;
}

/** Mục tiêu / OKR */
export interface Goal {
  id: string;
  title: string;
  description: string;
  level: GoalLevel;
  status: GoalStatus;
  category: GoalCategory;
  owner: string;
  team?: string;
  progress: number;
  startDate: string;
  dueDate: string;
  keyResults: KeyResult[];
  aiCoachingNote: string;
  tags: string[];
}

/* ============================================================
 * Quotation types
 * ============================================================ */

/** Trạng thái báo giá */
export type QuotationStatus = "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";

/** Dòng sản phẩm trong báo giá */
export interface QuotationLineItem {
  id: string;
  productName: string;
  tier: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  discount: number;
  subtotal: number;
}

/** Báo giá */
export interface Quotation {
  id: string;
  code: string;
  clientName: string;
  clientCompany: string;
  dealName: string;
  status: QuotationStatus;
  items: QuotationLineItem[];
  subtotal: number;
  discountTotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  currency: string;
  validUntil: string;
  createdDate: string;
  createdBy: string;
  notes: string;
  aiSuggestion?: string;
  tags: string[];
}

/* ============================================================
 * Customer Health types
 * ============================================================ */

/** Cấp độ sức khoẻ */
export type HealthLevel = "excellent" | "good" | "at-risk" | "critical";

/** Mức rủi ro rời bỏ */
export type ChurnRisk = "low" | "medium" | "high" | "very-high";

/** Chỉ số sức khoẻ con */
export interface HealthMetric {
  name: string;
  score: number;
  trend: "up" | "down" | "stable";
}

/** Sức khoẻ khách hàng */
export interface CustomerHealth {
  id: string;
  companyName: string;
  logo: string;
  industry: string;
  contactPerson: string;
  contactEmail: string;
  healthScore: number;
  healthLevel: HealthLevel;
  churnRisk: ChurnRisk;
  churnProbability: number;
  mrr: number;
  mrrTrend: "up" | "down" | "stable";
  lifetimeValue: number;
  contractEndDate: string;
  lastActivity: string;
  daysSinceContact: number;
  loginFrequency: number;
  featureAdoption: number;
  ticketCount: number;
  npsScore: number | null;
  metrics: HealthMetric[];
  riskFactors: string[];
  retentionActions: string[];
  aiInsight: string;
  trend: { month: string; score: number }[];
  tags: string[];
}

/* ============================================================
 * Inventory Management types
 * ============================================================ */

/** Trạng thái tồn kho */
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "overstock";

/** Loại sản phẩm kho */
export type InventoryItemType = "license" | "hardware" | "subscription" | "consumable";

/** Sản phẩm trong kho */
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  type: InventoryItemType;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reservedStock: number;
  unitPrice: number;
  totalValue: number;
  status: StockStatus;
  location: string;
  supplier: string;
  lastRestocked: string;
  monthlyUsage: number;
  daysUntilStockout: number | null;
  autoReorder: boolean;
  tags: string[];
}

/* ============================================================
 * Forecast types
 * ============================================================ */

/** Kịch bản dự báo */
export type ForecastScenario = "conservative" | "base" | "optimistic";

/** Dự báo theo sales rep */
export interface RepForecast {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quota: number;
  commit: number;
  bestCase: number;
  upside: number;
  pipeline: number;
  coverage: number;
  aiConfidence: number;
  aiNote: string;
  trend: "up" | "down" | "stable";
  isAI?: boolean;
  tags: string[];
}

/* ============================================================
 * Commission Calculator types
 * ============================================================ */

/** Trạng thái thanh toán hoa hồng */
export type PayoutStatus = "paid" | "pending" | "processing";

/** Commission Tier */
export interface CommissionTier {
  id: string;
  name: string;
  minRevenue: number;
  maxRevenue: number | null;
  rate: number;
  accelerator: number;
  description: string;
}

/** Bonus rule */
export interface BonusRule {
  id: string;
  name: string;
  condition: string;
  bonus: number;
  type: "flat" | "percentage";
  icon: string;
}

/** Hoa hồng 1 nhân viên sales */
export interface SalesRepCommission {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quota: number;
  revenue: number;
  attainment: number;
  baseTier: string;
  baseCommission: number;
  acceleratorCommission: number;
  bonuses: { name: string; amount: number }[];
  totalCommission: number;
  splitDeals: number;
  payoutStatus: PayoutStatus;
  monthlyCommissions: number[];
  isAI?: boolean;
  tags: string[];
}

/* ============================================================
 * Competitor Analysis types
 * ============================================================ */

/** Mức đe doạ đối thủ */
export type CompetitorThreat = "high" | "medium" | "low";

/** Kết quả deal so kè */
export type DealOutcome = "won" | "lost";

/** Battle Card */
export interface BattleCard {
  id: string;
  topic: string;
  ourStrength: string;
  theirWeakness: string;
  talkingPoint: string;
}

/** Đối thủ cạnh tranh */
export interface Competitor {
  id: string;
  name: string;
  logo: string;
  description: string;
  region: string;
  threat: CompetitorThreat;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  ourWinRate: number;
  totalEncounters: number;
  dealsWon: number;
  dealsLost: number;
  avgDealSize: number;
  skills: { name: string; score: number }[];
  ourSkills: { name: string; score: number }[];
  battleCards: BattleCard[];
  aiInsight: string;
  topWinReason: string;
  topLossReason: string;
  tags: string[];
}

/** Lịch sử win/loss */
export interface WinLossRecord {
  id: string;
  dealName: string;
  clientCompany: string;
  competitor: string;
  outcome: DealOutcome;
  value: number;
  reason: string;
  date: string;
  owner: string;
  tags: string[];
}

/* ============================================================
 * Quota Management types
 * ============================================================ */

/** Kỳ quota */
export type QuotaPeriod = "monthly" | "quarterly" | "yearly";

/** Trạng thái đạt chỉ tiêu */
export type AttainmentStatus = "exceeded" | "on-track" | "at-risk" | "behind";

/** Xu hướng hiệu suất */
export type QuotaTrend = "up" | "down" | "flat";

/** Nhân viên trong Quota Management */
export interface QuotaRep {
  id: string;
  name: string;
  role: string;
  isAI: boolean;
  avatar: string;
  team: string;
  quota: number;
  closed: number;
  pipeline: number;
  attainment: number;
  status: AttainmentStatus;
  trend: QuotaTrend;
  dealsWon: number;
  dealsOpen: number;
  avgDealSize: number;
  forecastClose: number;
  period: QuotaPeriod;
  tags: string[];
}

/* ============================================================
 * Sales Playbook types
 * ============================================================ */

/** Loại playbook */
export type PlaybookType = "methodology" | "process" | "objection" | "battle-card" | "onboarding";

/** Giai đoạn deal mà playbook áp dụng */
export type PlaybookStage = "prospecting" | "discovery" | "demo" | "proposal" | "negotiation" | "closing";

/** Playbook */
export interface Playbook {
  id: string;
  name: string;
  type: PlaybookType;
  description: string;
  stages: PlaybookStage[];
  steps: number;
  completedByReps: number;
  totalReps: number;
  winRateImpact: number;
  avgDealVelocity: number;
  lastUpdated: string;
  author: string;
  rating: number;
  isAIGenerated: boolean;
  tags: string[];
}

/** Battle Card cho đối thủ */
export interface PlaybookBattleCard {
  id: string;
  competitor: string;
  lastUpdated: string;
  winRate: number;
  keyDifferentiators: string[];
  objections: string[];
  talkTracks: string[];
}

/* ============================================================
 * Territory Management types
 * ============================================================ */

/** Trạng thái territory */
export type TerritoryStatus = "active" | "underperforming" | "high-growth" | "new";

/** Khu vực địa lý */
export type TerritoryRegion = "apac" | "emea" | "americas" | "vietnam";

/** Sales rep trong territory */
export interface TerritoryRep {
  name: string;
  role: string;
  accounts: number;
  quota: number;
  attainment: number;
}

/** Doanh thu theo quý */
export interface QuarterRevenue {
  quarter: string;
  revenue: number;
}

/** Vùng lãnh thổ sales */
export interface Territory {
  id: string;
  name: string;
  region: TerritoryRegion;
  country: string;
  flag: string;
  status: TerritoryStatus;
  revenue: number;
  target: number;
  attainment: number;
  accounts: number;
  activeDeals: number;
  pipeline: number;
  avgDealSize: number;
  winRate: number;
  reps: TerritoryRep[];
  topIndustries: string[];
  trend: "up" | "down" | "stable";
  quarterRevenue: QuarterRevenue[];
  coverageScore: number;
  overlapRisk: boolean;
  overlapNote: string | null;
  aiInsight: string;
  tags: string[];
}

/* ============================================================
 * Event Manager types
 * ============================================================ */

/** Loại sự kiện */
export type CrmEventType = "webinar" | "workshop" | "conference" | "meetup" | "demo-day";

/** Trạng thái sự kiện */
export type CrmEventStatus = "upcoming" | "live" | "completed" | "cancelled";

/** Sự kiện CRM */
export interface CrmEvent {
  id: string;
  name: string;
  type: CrmEventType;
  status: CrmEventStatus;
  date: string;
  time: string;
  duration: string;
  location: string;
  isVirtual: boolean;
  registered: number;
  attended: number;
  capacity: number;
  leadsGenerated: number;
  pipelineInfluenced: number;
  roi: number;
  speakers: string[];
  tags: string[];
  description: string;
  followUpSent: boolean;
  engagementScore: number;
}

/* ============================================================
 * Win/Loss Analysis types (extended)
 * ============================================================ */

/** Lý do thua deal */
export type LossReason =
  | "price"
  | "competitor"
  | "no-budget"
  | "timing"
  | "feature-gap"
  | "champion-left"
  | "no-decision"
  | "internal-politics";

/** Deal phân tích thắng/thua */
export interface AnalyzedDeal {
  id: string;
  name: string;
  customer: string;
  value: number;
  outcome: DealOutcome;
  closeDate: string;
  salesCycle: number;
  rep: string;
  lossReason: LossReason | null;
  competitor: string | null;
  stage: string;
  aiInsight: string;
  tags: string[];
}

/* ============================================================
 * Renewal Pipeline types
 * ============================================================ */

/** Trạng thái gia hạn */
export type RenewalStatus = "upcoming" | "in-progress" | "committed" | "at-risk" | "churned" | "renewed";

/** Hợp đồng gia hạn */
export interface Renewal {
  id: string;
  customer: string;
  logo: string;
  plan: string;
  arr: number;
  contractEnd: string;
  daysUntilRenewal: number;
  status: RenewalStatus;
  healthScore: number;
  nps: number;
  expansionOpportunity: number;
  csm: string;
  lastContact: string;
  riskFactors: string[];
  renewalProbability: number;
  tags: string[];
}

/* ============================================================
 * Revenue Leakage types
 * ============================================================ */

/** Loại rò rỉ doanh thu */
export type LeakType =
  | "stale-deal"
  | "missed-followup"
  | "pricing-error"
  | "discount-abuse"
  | "churn-signal"
  | "missed-upsell"
  | "contract-gap"
  | "billing-error";

/** Mức nghiêm trọng */
export type LeakSeverity = "critical" | "high" | "medium" | "low";

/** Trạng thái leak */
export type LeakStatus = "open" | "investigating" | "resolved" | "dismissed";

/** Revenue Leak Item */
export interface RevenueLeakItem {
  id: string;
  type: LeakType;
  severity: LeakSeverity;
  status: LeakStatus;
  title: string;
  description: string;
  estimatedLoss: number;
  deal: string | null;
  customer: string;
  detectedDate: string;
  assignedTo: string;
  aiConfidence: number;
  suggestedAction: string;
  tags: string[];
}

/* ============================================================
 * Partner Scorecard types
 * ============================================================ */

/** Hạng đối tác */
export type PartnerTier = "platinum" | "gold" | "silver" | "registered";

/** Loại đối tác */
export type PartnerType = "reseller" | "si" | "technology" | "consulting" | "referral";

/** Trạng thái đối tác */
export type PartnerStatus = "active" | "at-risk" | "inactive";

/** Đối tác */
export interface Partner {
  id: string;
  name: string;
  logo: string;
  tier: PartnerTier;
  type: PartnerType;
  region: string;
  score: number;
  revenueGenerated: number;
  revenueTarget: number;
  dealsRegistered: number;
  dealsWon: number;
  certifiedStaff: number;
  requiredCerts: number;
  nps: number;
  lastActivity: string;
  status: PartnerStatus;
  specializations: string[];
  trend: "up" | "down" | "flat";
  tags: string[];
}

/* ============================================================
 * Churn Prediction types
 * ============================================================ */

/** Mức rủi ro churn (chi tiết) */
export type ChurnRiskLevel = "critical" | "high" | "medium" | "low";

/** Trạng thái can thiệp */
export type InterventionStatus = "none" | "planned" | "in-progress" | "completed";

/** Tài khoản có rủi ro churn */
export interface ChurnRiskAccount {
  id: string;
  customer: string;
  arr: number;
  churnProbability: number;
  riskLevel: ChurnRiskLevel;
  healthScore: number;
  healthTrend: "declining" | "stable" | "improving";
  daysToRenewal: number;
  signals: string[];
  interventionStatus: InterventionStatus;
  interventionNote: string;
  csm: string;
  lastContact: string;
  usageChange: number;
  nps: number | null;
  ticketsOpen: number;
  tags: string[];
}

/* ============================================================
 * Team Capacity types
 * ============================================================ */

/** Mức độ burnout */
export type BurnoutRisk = "low" | "medium" | "high" | "critical";

/** Thành viên team */
export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  type: "human" | "ai-agent";
  skills: string[];
  capacityHours: number;
  allocatedHours: number;
  utilization: number;
  activeDeals: number;
  activeTasks: number;
  burnoutRisk: BurnoutRisk;
  satisfaction: number;
  performanceScore: number;
  ptoPlanned: number;
  tags: string[];
}

/* ============================================================
 * NPS Tracker
 * ============================================================ */
export type NPSCategory = "promoter" | "passive" | "detractor";
export type FeedbackChannel = "email" | "in-app" | "survey" | "call" | "meeting";

export interface FeedbackEntry {
  id: string;
  clientName: string;
  clientCompany: string;
  score: number;
  category: NPSCategory;
  channel: FeedbackChannel;
  comment: string;
  date: string;
  sentiment: "positive" | "neutral" | "negative";
  tags: string[];
  responded: boolean;
}

export interface ClientNPS {
  id: string;
  clientCompany: string;
  clientName: string;
  currentNPS: number;
  previousNPS: number;
  trend: "up" | "down" | "stable";
  responseCount: number;
  avgScore: number;
  lastFeedback: string;
  topConcern: string | null;
  topPraise: string | null;
}

/* ============================================================
 * Campaign ROI Analyzer
 * ============================================================ */
export type CampaignChannel = "email" | "social" | "sem" | "seo" | "webinar" | "content" | "referral" | "partner";
export type CampaignStatus = "active" | "completed" | "paused";

export interface CampaignRoi {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  leads: number;
  mqls: number;
  sqls: number;
  opportunities: number;
  wonDeals: number;
  revenue: number;
  cpl: number;
  cac: number;
  roas: number;
  conversionRate: number;
}