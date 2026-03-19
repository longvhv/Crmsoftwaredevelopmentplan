import type {
  DealStage,
  DealPriority,
  ContactType,
  ContactStatus,
  ActivityType,
  ProductCategory,
  TaskPriority,
  TaskStatus,
  TeamRole,
  TicketPriority,
  TicketStatus,
  LeadStatus,
  LeadSource,
} from "../types/entities";

import type {
  LeadChannel,
  EmailTemplateCategory,
  EmailTemplateStatus,
  EmailSequenceStatus,
  SequenceStepType,
} from "../types/crm";

import {
  Star,
  AlertCircle,
  ArrowUpCircle,
  Circle,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Users,
  Coffee,
  FileText,
  Video,
  AlertTriangle,
  Clock,
  CheckCircle,
  Globe,
  Linkedin,
  Building2,
  UserPlus,
  Handshake,
  PartyPopper,
  Megaphone,
  TrendingUp,
} from "lucide-react";

/* ============================================================
 * Cấu hình Deal Stage
 * ============================================================ */
export const DEAL_STAGE_CONFIG: Record<DealStage, DealStageConfig> = {
  qualification: { label: "Đánh giá", color: "text-slate-700", bgColor: "bg-slate-100" },
  discovery: { label: "Tìm hiểu", color: "text-blue-700", bgColor: "bg-blue-100" },
  proposal: { label: "Đề xuất", color: "text-violet-700", bgColor: "bg-violet-100" },
  negotiation: { label: "Đàm phán", color: "text-amber-700", bgColor: "bg-amber-100" },
  "closed-won": { label: "Thắng", color: "text-green-700", bgColor: "bg-green-100" },
  "closed-lost": { label: "Thua", color: "text-red-700", bgColor: "bg-red-100" },
};

export const DEAL_STAGE_ORDER: DealStage[] = [
  "qualification",
  "discovery",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
];

export const ACTIVE_DEAL_STAGES: DealStage[] = [
  "qualification",
  "discovery",
  "proposal",
  "negotiation",
];

/* ============================================================
 * Cấu hình Contact Type
 * ============================================================ */
export const CONTACT_TYPE_CONFIG: Record<ContactType, ContactTypeConfig> = {
  lead: { label: "Lead", color: "bg-blue-100 text-blue-700" },
  customer: { label: "Khách hàng", color: "bg-green-100 text-green-700" },
  partner: { label: "Đối tác", color: "bg-violet-100 text-violet-700" },
  vendor: { label: "Nhà cung cấp", color: "bg-amber-100 text-amber-700" },
};

export const CONTACT_TYPE_OPTIONS: ContactType[] = ["lead", "customer", "partner", "vendor"];

/* ============================================================
 * Cấu hình Contact Status
 * ============================================================ */
export const CONTACT_STATUS_CONFIG: Record<ContactStatus, { label: string; color: string }> = {
  active: { label: "Hoạt động", color: "bg-green-100 text-green-700" },
  inactive: { label: "Không hoạt động", color: "bg-gray-100 text-gray-500" },
  prospect: { label: "Tiềm năng", color: "bg-blue-100 text-blue-700" },
  churned: { label: "Đã rời", color: "bg-red-100 text-red-700" },
};

/* ============================================================
 * Cấu hình Deal Priority
 * ============================================================ */
export const DEAL_PRIORITY_CONFIG: Record<DealPriority, { label: string; color: string; emoji: string }> = {
  hot: { label: "Nóng", color: "bg-red-100 text-red-700", emoji: "🔥" },
  warm: { label: "Ấm", color: "bg-amber-100 text-amber-700", emoji: "☀️" },
  cold: { label: "Lạnh", color: "bg-blue-100 text-blue-700", emoji: "❄️" },
};

/* ============================================================
 * Cấu hình Activity Type
 * ============================================================ */
export const ACTIVITY_TYPE_CONFIG: Record<ActivityType, { label: string; color: string; icon: string }> = {
  call: { label: "Cuộc gọi", color: "bg-green-100 text-green-700", icon: "phone" },
  email: { label: "Email", color: "bg-blue-100 text-blue-700", icon: "mail" },
  meeting: { label: "Cuộc họp", color: "bg-violet-100 text-violet-700", icon: "video" },
  note: { label: "Ghi chú", color: "bg-amber-100 text-amber-700", icon: "file-text" },
  task: { label: "Công việc", color: "bg-slate-100 text-slate-700", icon: "check-square" },
};

/* ============================================================
 * Cấu hình Employee Status
 * ============================================================ */
export const EMPLOYEE_STATUS_CONFIG: Record<ActiveStatus, { label: string; color: string }> = {
  active: { label: "Đang làm việc", color: "bg-green-100 text-green-700" },
  inactive: { label: "Nghỉ việc", color: "bg-gray-100 text-gray-500" },
  "on-leave": { label: "Nghỉ phép", color: "bg-amber-100 text-amber-700" },
};

/* ============================================================
 * Nguồn liên hệ
 * ============================================================ */
export const CONTACT_SOURCES = [
  "Website",
  "Giới thiệu",
  "LinkedIn",
  "Sự kiện",
  "Cold Outreach",
  "Đối tác",
  "Inbound Marketing",
  "Clutch/GoodFirms",
] as const;

/* ============================================================
 * Định dạng tiền tệ
 * ============================================================ */
export function formatCurrency(value: number, currency = "USD"): string {
  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

/* ============================================================
 * Cấu hình Ticket Priority
 * ============================================================ */
export const TICKET_PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  critical: { label: "Khẩn cấp", color: "text-red-600 bg-red-50 border-red-200" },
  high: { label: "Cao", color: "text-orange-600 bg-orange-50 border-orange-200" },
  medium: { label: "Trung bình", color: "text-amber-600 bg-amber-50 border-amber-200" },
  low: { label: "Thấp", color: "text-blue-600 bg-blue-50 border-blue-200" },
};

/** Thứ tự sắp xếp ưu tiên (nhỏ = cao hơn) */
export const TICKET_PRIORITY_ORDER: Record<TicketPriority, number> = {
  critical: 0, high: 1, medium: 2, low: 3,
};

/* ============================================================
 * Cấu hình Ticket Status
 * ============================================================ */
export const TICKET_STATUS_CONFIG: Record<TicketStatus, { label: string; color: string }> = {
  open: { label: "Mở", color: "text-blue-600 bg-blue-50" },
  "in-progress": { label: "Đang xử lý", color: "text-violet-600 bg-violet-50" },
  waiting: { label: "Chờ phản hồi", color: "text-amber-600 bg-amber-50" },
  resolved: { label: "Đã giải quyết", color: "text-green-600 bg-green-50" },
  closed: { label: "Đã đóng", color: "text-gray-500 bg-gray-100" },
};

/* ============================================================
 * Cấu hình Ticket Category
 * ============================================================ */
export const TICKET_CATEGORY_CONFIG: Record<TicketCategory, { label: string; icon: string; color: string }> = {
  bug: { label: "Lỗi phần mềm", icon: "🐛", color: "bg-red-50 text-red-700" },
  "feature-request": { label: "Yêu cầu tính năng", icon: "✨", color: "bg-violet-50 text-violet-700" },
  question: { label: "Câu hỏi", icon: "❓", color: "bg-blue-50 text-blue-700" },
  billing: { label: "Thanh toán", icon: "💳", color: "bg-green-50 text-green-700" },
  integration: { label: "Tích hợp", icon: "🔗", color: "bg-amber-50 text-amber-700" },
  performance: { label: "Hiệu năng", icon: "⚡", color: "bg-orange-50 text-orange-700" },
};

/* ============================================================
 * Cấu hình Product Type
 * ============================================================ */
export const PRODUCT_TYPE_CONFIG: Record<ProductType, { label: string; color: string; bgColor: string }> = {
  product: { label: "Sản phẩm", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  service: { label: "Dịch vụ", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  bundle: { label: "Gói combo", color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200" },
};

/* ============================================================
 * Cấu hình Product Category
 * ============================================================ */
export const PRODUCT_CATEGORY_CONFIG: Record<ProductCategory, { label: string }> = {
  outsource: { label: "Outsource" },
  product: { label: "Product" },
  consulting: { label: "Tư vấn" },
  "ai-solution": { label: "Giải pháp AI" },
  maintenance: { label: "Bảo trì" },
  training: { label: "Đào tạo" },
};

/* ============================================================
 * Cấu hình Pricing Model
 * ============================================================ */
export const PRICING_MODEL_LABELS: Record<PricingModel, string> = {
  fixed: "Cố định",
  hourly: "Theo giờ",
  monthly: "Theo tháng",
  "per-user": "Theo người dùng",
  custom: "Tuỳ chỉnh",
};

/* ============================================================
 * Cấu hình Product Status
 * ============================================================ */
export const PRODUCT_STATUS_CONFIG: Record<ProductStatus, { label: string; color: string }> = {
  active: { label: "Đang bán", color: "text-green-600 bg-green-50" },
  draft: { label: "Nháp", color: "text-gray-500 bg-gray-50" },
  deprecated: { label: "Ngừng bán", color: "text-red-500 bg-red-50" },
};

/* ============================================================
 * Cấu hình Calendar Event Type
 * ============================================================ */
export const CALENDAR_EVENT_TYPE_CONFIG: Record<CalendarEventType, { label: "string"; color: string; bgColor: string }> = {
  meeting: { label: "Cuộc họp", color: "text-violet-700", bgColor: "bg-violet-100 border-violet-300" },
  call: { label: "Cuộc gọi", color: "text-green-700", bgColor: "bg-green-100 border-green-300" },
  "follow-up": { label: "Follow-up", color: "text-blue-700", bgColor: "bg-blue-100 border-blue-300" },
  deadline: { label: "Hạn chót", color: "text-red-700", bgColor: "bg-red-100 border-red-300" },
  task: { label: "Công việc", color: "text-amber-700", bgColor: "bg-amber-100 border-amber-300" },
  demo: { label: "Demo", color: "text-pink-700", bgColor: "bg-pink-100 border-pink-300" },
};

export const CALENDAR_WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;
export const CALENDAR_WEEKDAYS_FULL = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"] as const;

/* ============================================================
 * Cấu hình Task Status
 * ============================================================ */
export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bgColor: string; headerColor: string }> = {
  backlog: { label: "Backlog", color: "text-gray-500", bgColor: "bg-gray-50", headerColor: "bg-gray-100 border-gray-200" },
  todo: { label: "Cần làm", color: "text-blue-600", bgColor: "bg-blue-50", headerColor: "bg-blue-100 border-blue-200" },
  "in-progress": { label: "Đang làm", color: "text-amber-600", bgColor: "bg-amber-50", headerColor: "bg-amber-100 border-amber-200" },
  done: { label: "Hoàn thành", color: "text-green-600", bgColor: "bg-green-50", headerColor: "bg-green-100 border-green-200" },
};

export const TASK_STATUS_ORDER: TaskStatus[] = ["backlog", "todo", "in-progress", "done"];

/* ============================================================
 * Cấu hình Task Priority
 * ============================================================ */
export const TASK_PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  urgent: { label: "Gấp", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  high: { label: "Cao", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200" },
  medium: { label: "Vừa", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  low: { label: "Thấp", color: "text-gray-500", bgColor: "bg-gray-50 border-gray-200" },
};

/* ============================================================
 * Cấu hình Task Category
 * ============================================================ */
export const TASK_CATEGORY_CONFIG: Record<TaskCategory, { label: "string"; color: string }> = {
  "follow-up": { label: "Theo dõi", color: "text-blue-500" },
  meeting: { label: "Họp", color: "text-violet-500" },
  proposal: { label: "Đề xuất", color: "text-amber-500" },
  review: { label: "Review", color: "text-green-500" },
  outreach: { label: "Tiếp cận", color: "text-pink-500" },
  admin: { label: "Admin", color: "text-gray-600" },
};

/* ============================================================
 * Lead Inbox constants
 * ============================================================ */

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; bgColor: string; icon: any }
> = {
  new: { label: "Mới", color: "text-blue-700", bgColor: "bg-blue-100", icon: Circle },
  contacted: { label: "Đã liên hệ", color: "text-amber-700", bgColor: "bg-amber-100", icon: Phone },
  qualified: { label: "Đủ điều kiện", color: "text-green-700", bgColor: "bg-green-100", icon: CheckCircle2 },
  converted: { label: "Đã chuyển đổi", color: "text-violet-700", bgColor: "bg-violet-100", icon: TrendingUp },
  disqualified: { label: "Loại bỏ", color: "text-red-700", bgColor: "bg-red-100", icon: XCircle },
};

export const LEAD_CHANNEL_CONFIG: Record<LeadChannel, { label: string; color: string; icon: any }> = {
  website: { label: "Website", color: "bg-blue-100 text-blue-700", icon: Globe },
  linkedin: { label: "LinkedIn", color: "bg-sky-100 text-sky-700", icon: Linkedin },
  clutch: { label: "Clutch/GoodFirms", color: "bg-orange-100 text-orange-700", icon: Building2 },
  "cold-outreach": { label: "Cold Outreach", color: "bg-slate-100 text-slate-700", icon: Mail },
  referral: { label: "Giới thiệu", color: "bg-green-100 text-green-700", icon: UserPlus },
  event: { label: "Sự kiện", color: "bg-violet-100 text-violet-700", icon: PartyPopper },
  inbound: { label: "Inbound Marketing", color: "bg-pink-100 text-pink-700", icon: Megaphone },
  partner: { label: "Đối tác", color: "bg-amber-100 text-amber-700", icon: Handshake },
};

export const LEAD_SOURCE_CONFIG: Record<LeadSource, { label: string; color: string; icon: any }> = {
  website: { label: "Website", color: "bg-blue-100 text-blue-700", icon: Globe },
  linkedin: { label: "LinkedIn", color: "bg-sky-100 text-sky-700", icon: Linkedin },
  clutch: { label: "Clutch/GoodFirms", color: "bg-orange-100 text-orange-700", icon: Building2 },
  "cold-outreach": { label: "Cold Outreach", color: "bg-slate-100 text-slate-700", icon: Mail },
  referral: { label: "Giới thiệu", color: "bg-green-100 text-green-700", icon: UserPlus },
  event: { label: "Sự kiện", color: "bg-violet-100 text-violet-700", icon: PartyPopper },
  inbound: { label: "Inbound Marketing", color: "bg-pink-100 text-pink-700", icon: Megaphone },
  partner: { label: "Đối tác", color: "bg-amber-100 text-amber-700", icon: Handshake },
};

/* ============================================================
 * Email Templates constants
 * ============================================================ */

export const EMAIL_TEMPLATE_CATEGORY_CONFIG: Record<EmailTemplateCategory, { label: string; color: string; bgColor: string }> = {
  "cold-outreach": { label: "Cold Outreach", color: "text-blue-700", bgColor: "bg-blue-100" },
  "follow-up": { label: "Follow-up", color: "text-amber-700", bgColor: "bg-amber-100" },
  proposal: { label: "Đề xuất", color: "text-violet-700", bgColor: "bg-violet-100" },
  nurture: { label: "Chăm sóc", color: "text-green-700", bgColor: "bg-green-100" },
  onboarding: { label: "Onboarding", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  support: { label: "Hỗ trợ", color: "text-orange-700", bgColor: "bg-orange-100" },
};

export const EMAIL_TEMPLATE_STATUS_CONFIG: Record<EmailTemplateStatus, { label: "string"; color: string; bgColor: string }> = {
  active: { label: "Đang dùng", color: "text-green-700", bgColor: "bg-green-100" },
  draft: { label: "Nháp", color: "text-gray-700", bgColor: "bg-gray-100" },
  archived: { label: "Lưu trữ", color: "text-slate-700", bgColor: "bg-slate-100" },
};

/* ============================================================
 * Email Sequences constants
 * ============================================================ */

export const EMAIL_SEQUENCE_STATUS_CONFIG: Record<EmailSequenceStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Đang chạy", color: "text-green-700", bgColor: "bg-green-100" },
  paused: { label: "Tạm dừng", color: "text-amber-700", bgColor: "bg-amber-100" },
  draft: { label: "Nháp", color: "text-gray-700", bgColor: "bg-gray-100" },
  completed: { label: "Hoàn thành", color: "text-blue-700", bgColor: "bg-blue-100" },
};

export const SEQUENCE_STEP_TYPE_CONFIG: Record<SequenceStepType, { label: string; color: string; icon: string }> = {
  email: { label: "Gửi Email", color: "text-violet-700", icon: "Mail" },
  wait: { label: "Chờ", color: "text-amber-700", icon: "Clock" },
  condition: { label: "Điều kiện", color: "text-blue-700", icon: "GitBranch" },
  task: { label: "Tạo Task", color: "text-green-700", icon: "CheckSquare" },
};

/* ============================================================
 * Danh sách nhân viên (dùng cho assignee dropdown)
 * ============================================================ */

export const CRM_ASSIGNEES = [
  { id: "e1", name: "Nguyễn Văn An" },
  { id: "e2", name: "Lê Minh Cường" },
  { id: "e3", name: "Hoàng Thị Mai" },
  { id: "e4", name: "Phạm Hoàng Duy" },
  { id: "ai1", name: "AI Sales Agent (BDR)" },
  { id: "ai2", name: "AI Analytics Agent" },
] as const;

/** Array tên nhân viên đơn giản (backward compatible) */
export const CRM_ASSIGNEE_NAMES = CRM_ASSIGNEES.map((a) => a.name);

/* ============================================================
 * Contract Management constants
 * ============================================================ */

export const CONTRACT_STATUS_CONFIG: Record<ContractStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Đang hiệu lực", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  "expiring-soon": { label: "Sắp hết hạn", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  expired: { label: "Đã hết hạn", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  pending: { label: "Chờ ký", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  terminated: { label: "Đã chấm dứt", color: "text-gray-500", bgColor: "bg-gray-50 border-gray-200" },
  renewed: { label: "Đã gia hạn", color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200" },
};

export const CONTRACT_TYPE_CONFIG: Record<ContractType, { label: string; color: string }> = {
  outsource: { label: "Outsource", color: "text-blue-600 bg-blue-50" },
  "product-license": { label: "License sản phẩm", color: "text-green-600 bg-green-50" },
  consulting: { label: "Tư vấn", color: "text-violet-600 bg-violet-50" },
  "managed-service": { label: "Managed Service", color: "text-indigo-600 bg-indigo-50" },
  training: { label: "Đào tạo", color: "text-amber-600 bg-amber-50" },
};

export const AMENDMENT_TYPE_LABELS: Record<AmendmentType, string> = {
  "scope-change": "Thay đổi scope",
  "price-change": "Điều chỉnh giá",
  extension: "Gia hạn",
  "team-change": "Thay đổi team",
};

/* ============================================================
 * Vendor Management constants
 * ============================================================ */

export const VENDOR_STATUS_CONFIG: Record<VendorStatus, { label: string; color: string }> = {
  active: { label: "Đang hợp tác", color: "text-green-600 bg-green-50" },
  "on-hold": { label: "Tạm dừng", color: "text-amber-600 bg-amber-50" },
  evaluating: { label: "Đang đánh giá", color: "text-blue-600 bg-blue-50" },
  terminated: { label: "Đã kết thúc", color: "text-red-600 bg-red-50" },
};

export const VENDOR_TIER_CONFIG: Record<VendorTier, { label: string; color: string; stars: number }> = {
  strategic: { label: "Chiến lược", color: "text-violet-700 bg-violet-50 border-violet-200", stars: 4 },
  preferred: { label: "Ưu tiên", color: "text-blue-700 bg-blue-50 border-blue-200", stars: 3 },
  approved: { label: "Đã duyệt", color: "text-green-700 bg-green-50 border-green-200", stars: 2 },
  trial: { label: "Thử nghiệm", color: "text-gray-600 bg-gray-50 border-gray-200", stars: 1 },
};

export const VENDOR_CATEGORY_CONFIG: Record<VendorCategory, { label: string; icon: string }> = {
  development: { label: "Phát triển PM", icon: "💻" },
  design: { label: "Thiết kế", icon: "🎨" },
  infrastructure: { label: "Hạ tầng", icon: "☁️" },
  consulting: { label: "Tư vấn", icon: "📋" },
  "qa-testing": { label: "QA & Testing", icon: "🧪" },
  "ai-ml": { label: "AI/ML", icon: "🤖" },
};

/* ============================================================
 * Goal & OKR Tracking constants
 * ============================================================ */

export const GOAL_LEVEL_CONFIG: Record<GoalLevel, { label: string; color: string; bgColor: string }> = {
  company: { label: "Công ty", color: "text-violet-700", bgColor: "bg-violet-100" },
  team: { label: "Đội nhóm", color: "text-blue-700", bgColor: "bg-blue-100" },
  individual: { label: "Cá nhân", color: "text-green-700", bgColor: "bg-green-100" },
};

export const GOAL_STATUS_CONFIG: Record<GoalStatus, { label: string; color: string; bgColor: string }> = {
  "on-track": { label: "Đúng tiến độ", color: "text-green-600", bgColor: "bg-green-50" },
  "at-risk": { label: "Có rủi ro", color: "text-amber-600", bgColor: "bg-amber-50" },
  behind: { label: "Chậm tiến độ", color: "text-red-600", bgColor: "bg-red-50" },
  completed: { label: "Hoàn thành", color: "text-blue-600", bgColor: "bg-blue-50" },
  "not-started": { label: "Chưa bắt đầu", color: "text-gray-500", bgColor: "bg-gray-100" },
};

export const GOAL_CATEGORY_CONFIG: Record<GoalCategory, { label: "string"; icon: string; color: string }> = {
  revenue: { label: "Doanh thu", icon: "💰", color: "text-green-600 bg-green-50" },
  customer: { label: "Khách hàng", icon: "👥", color: "text-blue-600 bg-blue-50" },
  product: { label: "Sản phẩm", icon: "📦", color: "text-violet-600 bg-violet-50" },
  people: { label: "Nhân sự", icon: "🧑‍💼", color: "text-pink-600 bg-pink-50" },
  operational: { label: "Vận hành", icon: "⚙️", color: "text-amber-600 bg-amber-50" },
  innovation: { label: "Đổi mới", icon: "🚀", color: "text-indigo-600 bg-indigo-50" },
};

/* ============================================================
 * Quotation constants
 * ============================================================ */

export const QUOTATION_STATUS_CONFIG: Record<QuotationStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Nháp", color: "text-gray-500", bgColor: "bg-gray-50" },
  sent: { label: "Đã gửi", color: "text-blue-600", bgColor: "bg-blue-50" },
  viewed: { label: "Đã xem", color: "text-violet-600", bgColor: "bg-violet-50" },
  accepted: { label: "Chấp nhận", color: "text-green-600", bgColor: "bg-green-50" },
  rejected: { label: "Từ chối", color: "text-red-600", bgColor: "bg-red-50" },
  expired: { label: "Hết hạn", color: "text-amber-600", bgColor: "bg-amber-50" },
};

/* ============================================================
 * Customer Health constants
 * ============================================================ */

export const HEALTH_LEVEL_CONFIG: Record<HealthLevel, { label: string; color: string; bgColor: string }> = {
  excellent: { label: "Xuất sắc", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  good: { label: "Tốt", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  "at-risk": { label: "Cảnh báo", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  critical: { label: "Nguy hiểm", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
};

export const CHURN_RISK_CONFIG: Record<ChurnRisk, { label: string; color: string; bgColor: string }> = {
  low: { label: "Thấp", color: "text-green-600", bgColor: "bg-green-50" },
  medium: { label: "Trung bình", color: "text-amber-600", bgColor: "bg-amber-50" },
  high: { label: "Cao", color: "text-orange-600", bgColor: "bg-orange-50" },
  "very-high": { label: "Rất cao", color: "text-red-600", bgColor: "bg-red-50" },
};

/* ============================================================
 * Inventory Management constants
 * ============================================================ */

export const STOCK_STATUS_CONFIG: Record<StockStatus, { label: string; color: string; bgColor: string }> = {
  "in-stock": { label: "Còn hàng", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  "low-stock": { label: "Sắp hết", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  "out-of-stock": { label: "Hết hàng", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  overstock: { label: "Dư thừa", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
};

export const INVENTORY_TYPE_CONFIG: Record<InventoryItemType, { label: string; color: string }> = {
  license: { label: "License", color: "text-violet-600 bg-violet-50" },
  hardware: { label: "Phần cứng", color: "text-cyan-600 bg-cyan-50" },
  subscription: { label: "Subscription", color: "text-emerald-600 bg-emerald-50" },
  consumable: { label: "Tiêu hao", color: "text-orange-600 bg-orange-50" },
};

/** Format VND compact */
export function formatVND(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B đ`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M đ`;
  return `${n.toLocaleString("vi-VN")} đ`;
}

/* ============================================================
 * Commission Calculator constants
 * ============================================================ */

export const PAYOUT_STATUS_CONFIG: Record<PayoutStatus, { label: string; color: string; bgColor: string }> = {
  paid: { label: "Đã chi", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  pending: { label: "Chờ duyệt", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  processing: { label: "Đang xử lý", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
};

/** Format USD compact */
export function formatUSD(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString("en-US")}`;
}

/* ============================================================
 * Competitor Analysis constants
 * ============================================================ */

export const THREAT_CONFIG: Record<CompetitorThreat, { label: string; color: string; bgColor: string }> = {
  high: { label: "Cao", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  medium: { label: "Trung bình", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  low: { label: "Thấp", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
};

export const DEAL_OUTCOME_CONFIG: Record<DealOutcome, { label: string; color: string; bgColor: string }> = {
  won: { label: "Thắng", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  lost: { label: "Thua", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
};

export const ATTAINMENT_STATUS_CONFIG: Record<AttainmentStatus, { label: string; color: string; bgColor: string }> = {
  exceeded: { label: "Vượt chỉ tiêu", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" },
  "on-track": { label: "Đúng tiến độ", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  "at-risk": { label: "Có rủi ro", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  behind: { label: "Tụt lại", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
};

export const QUOTA_TREND_CONFIG: Record<QuotaTrend, { label: string; color: string }> = {
  up: { label: "Tăng", color: "text-green-600" },
  down: { label: "Giảm", color: "text-red-600" },
  flat: { label: "Bình ổn", color: "text-gray-500" },
};

/* ============================================================
 * Sales Playbook constants
 * ============================================================ */

export const PLAYBOOK_TYPE_CONFIG: Record<PlaybookType, { label: string; icon: string; color: string; bgColor: string }> = {
  methodology: { label: "Methodology", icon: "📐", color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200" },
  process: { label: "Sales Process", icon: "🔄", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  objection: { label: "Objection Handling", icon: "🛡️", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  "battle-card": { label: "Battle Card", icon: "⚔️", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  onboarding: { label: "Onboarding", icon: "🎓", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
};

/* ============================================================
 * Territory Management constants
 * ============================================================ */

export const TERRITORY_STATUS_CONFIG: Record<TerritoryStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Hoạt động tốt", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  underperforming: { label: "Dưới mục tiêu", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  "high-growth": { label: "Tăng trưởng cao", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  new: { label: "Mới mở", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
};

export const TERRITORY_REGION_CONFIG: Record<TerritoryRegion, { label: string; color: string; bgColor: string }> = {
  vietnam: { label: "Việt Nam", color: "#ef4444", bgColor: "bg-red-50 text-red-700 border-red-200" },
  apac: { label: "APAC", color: "#3b82f6", bgColor: "bg-blue-50 text-blue-700 border-blue-200" },
  emea: { label: "EMEA", color: "#8b5cf6", bgColor: "bg-violet-50 text-violet-700 border-violet-200" },
  americas: { label: "Americas", color: "#22c55e", bgColor: "bg-green-50 text-green-700 border-green-200" },
};

/* ============================================================
 * Event Manager constants
 * ============================================================ */

export const CRM_EVENT_TYPE_CONFIG: Record<CrmEventType, { label: string; icon: string; color: string; bgColor: string }> = {
  webinar: { label: "Webinar", icon: "🎥", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  workshop: { label: "Workshop", icon: "🛠️", color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200" },
  conference: { label: "Conference", icon: "🎤", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  meetup: { label: "Meetup", icon: "🤝", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  "demo-day": { label: "Demo Day", icon: "🚀", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
};

export const CRM_EVENT_STATUS_CONFIG: Record<CrmEventStatus, { label: string; color: string; bgColor: string }> = {
  upcoming: { label: "Sắp diễn ra", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  live: { label: "Đang diễn ra", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  completed: { label: "Đã kết thúc", color: "text-gray-500", bgColor: "bg-gray-50 border-gray-200" },
  cancelled: { label: "Đã hủy", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
};

/* ============================================================
 * Win/Loss Analysis constants
 * ============================================================ */

export const LOSS_REASON_CONFIG: Record<LossReason, { label: string; icon: string; color: string }> = {
  price: { label: "Giá quá cao", icon: "💰", color: "text-red-600 bg-red-50" },
  competitor: { label: "Đối thủ thắng", icon: "⚔️", color: "text-orange-600 bg-orange-50" },
  "no-budget": { label: "Không có ngân sách", icon: "🚫", color: "text-gray-600 bg-gray-50" },
  timing: { label: "Không đúng thời điểm", icon: "⏰", color: "text-amber-600 bg-amber-50" },
  "feature-gap": { label: "Thiếu tính năng", icon: "🔧", color: "text-blue-600 bg-blue-50" },
  "champion-left": { label: "Champion rời công ty", icon: "👤", color: "text-violet-600 bg-violet-50" },
  "no-decision": { label: "Không quyết định", icon: "❓", color: "text-cyan-600 bg-cyan-50" },
  "internal-politics": { label: "Chính trị nội bộ", icon: "🏢", color: "text-indigo-600 bg-indigo-50" },
};

/* ============================================================
 * Renewal Pipeline constants
 * ============================================================ */

export const RENEWAL_STATUS_CONFIG: Record<RenewalStatus, { label: string; color: string; bgColor: string }> = {
  upcoming: { label: "Sắp đến hạn", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  "in-progress": { label: "Đang thương lượng", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  committed: { label: "Đã cam kết", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  "at-risk": { label: "Có rủi ro", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  churned: { label: "Đã rời", color: "text-gray-500", bgColor: "bg-gray-100 border-gray-300" },
  renewed: { label: "Đã gia hạn", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" },
};

/* ============================================================
 * Revenue Leakage constants
 * ============================================================ */

export const LEAK_TYPE_CONFIG: Record<LeakType, { label: string; icon: string; color: string }> = {
  "stale-deal": { label: "Deal trì trệ", icon: "⏸️", color: "text-amber-600" },
  "missed-followup": { label: "Bỏ lỡ Follow-up", icon: "📭", color: "text-orange-600" },
  "pricing-error": { label: "Lỗi Định giá", icon: "💲", color: "text-red-600" },
  "discount-abuse": { label: "Lạm dụng Giảm giá", icon: "🏷️", color: "text-rose-600" },
  "churn-signal": { label: "Tín hiệu Churn", icon: "📉", color: "text-red-700" },
  "missed-upsell": { label: "Bỏ lỡ Upsell", icon: "📈", color: "text-blue-600" },
  "contract-gap": { label: "Lỗ hổng Hợp đồng", icon: "📄", color: "text-violet-600" },
  "billing-error": { label: "Lỗi Billing", icon: "🧾", color: "text-pink-600" },
};

export const LEAK_SEVERITY_CONFIG: Record<LeakSeverity, { label: string; color: string; bgColor: string }> = {
  critical: { label: "Nghiêm trọng", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  high: { label: "Cao", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200" },
  medium: { label: "Trung bình", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  low: { label: "Thấp", color: "text-gray-500", bgColor: "bg-gray-50 border-gray-200" },
};

export const LEAK_STATUS_CONFIG: Record<LeakStatus, { label: "string"; color: string }> = {
  open: { label: "Mở", color: "text-red-600" },
  investigating: { label: "Đang xử lý", color: "text-blue-600" },
  resolved: { label: "Đã xử lý", color: "text-green-600" },
  dismissed: { label: "Bỏ qua", color: "text-gray-400" },
};

/* ============================================================
 * Partner Scorecard constants
 * ============================================================ */

export const PARTNER_TIER_CONFIG: Record<PartnerTier, { label: string; color: string; bgColor: string; icon: string }> = {
  platinum: { label: "Platinum", color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200", icon: "💎" },
  gold: { label: "Gold", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200", icon: "🥇" },
  silver: { label: "Silver", color: "text-gray-500", bgColor: "bg-gray-50 border-gray-300", icon: "🥈" },
  registered: { label: "Registered", color: "text-blue-500", bgColor: "bg-blue-50 border-blue-200", icon: "📋" },
};

export const PARTNER_TYPE_CONFIG: Record<PartnerType, { label: string }> = {
  reseller: { label: "Reseller" },
  si: { label: "System Integrator" },
  technology: { label: "Technology Partner" },
  consulting: { label: "Consulting" },
  referral: { label: "Referral Partner" },
};

export const PARTNER_STATUS_CONFIG: Record<PartnerStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Hoạt động", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  "at-risk": { label: "Có rủi ro", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  inactive: { label: "Không hoạt động", color: "text-gray-500", bgColor: "bg-gray-50 border-gray-200" },
};

/* ============================================================
 * Churn Prediction constants
 * ============================================================ */

export const CHURN_RISK_LEVEL_CONFIG: Record<ChurnRiskLevel, { label: string; color: string; bgColor: string; icon: string }> = {
  critical: { label: "Nghiêm trọng", color: "text-red-600", bgColor: "bg-red-50 border-red-200", icon: "🔴" },
  high: { label: "Cao", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200", icon: "🟠" },
  medium: { label: "Trung bình", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200", icon: "🟡" },
  low: { label: "Thấp", color: "text-green-600", bgColor: "bg-green-50 border-green-200", icon: "🟢" },
};

export const INTERVENTION_STATUS_CONFIG: Record<InterventionStatus, { label: string; color: string; bgColor: string }> = {
  none: { label: "Chưa can thiệp", color: "text-gray-500", bgColor: "bg-gray-50 border-gray-200" },
  planned: { label: "Đã lên kế hoạch", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  "in-progress": { label: "Đang can thiệp", color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200" },
  completed: { label: "Đã xử lý", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
};

/* ============================================================
 * Team Capacity constants
 * ============================================================ */

export const BURNOUT_RISK_CONFIG: Record<BurnoutRisk, { label: string; color: string; bgColor: string }> = {
  low: { label: "Ổn định", color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  medium: { label: "Cần theo dõi", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  high: { label: "Cảnh báo", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200" },
  critical: { label: "Nguy hiểm", color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
};