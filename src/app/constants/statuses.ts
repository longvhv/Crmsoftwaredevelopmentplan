/* ============================================================
 * Status Constants - Centralized Status Values
 * Tất cả status enums và mappings cho entities
 * ============================================================ */

import type {
  ContactStatus,
  ContactType,
  DealStage,
  DealPriority,
  LeadStatus,
  LeadSource,
  EmployeeStatus,
  EmployeeType,
  ActivityType,
  TaskStatus,
  QuotationStatus,
  ContractStatus,
  TicketStatus,
  ApprovalStatus,
  EntityStatus,
  HealthScore,
} from "@/types";

/* ============================================================
 * Contact Statuses
 * ============================================================ */

export const CONTACT_STATUSES: ContactStatus[] = ["active", "inactive", "churned"];

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  churned: "Mất khách",
};

export const CONTACT_STATUS_COLORS: Record<ContactStatus, string> = {
  active: "green",
  inactive: "gray",
  churned: "red",
};

export const CONTACT_STATUS_DESCRIPTIONS: Record<ContactStatus, string> = {
  active: "Khách hàng đang hoạt động tích cực",
  inactive: "Khách hàng tạm thời không hoạt động",
  churned: "Khách hàng đã ngừng sử dụng dịch vụ",
};

/* ============================================================
 * Contact Types
 * ============================================================ */

export const CONTACT_TYPES: ContactType[] = ["customer", "lead", "partner", "vendor", "other"];

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  customer: "Khách hàng",
  lead: "Tiềm năng",
  partner: "Đối tác",
  vendor: "Nhà cung cấp",
  other: "Khác",
};

export const CONTACT_TYPE_COLORS: Record<ContactType, string> = {
  customer: "blue",
  lead: "purple",
  partner: "green",
  vendor: "orange",
  other: "gray",
};

export const CONTACT_TYPE_ICONS: Record<ContactType, string> = {
  customer: "User",
  lead: "UserPlus",
  partner: "Handshake",
  vendor: "Building2",
  other: "Users",
};

/* ============================================================
 * Deal Stages
 * ============================================================ */

export const DEAL_STAGES: DealStage[] = [
  "qualification",
  "discovery",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
];

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  qualification: "Đánh giá",
  discovery: "Khám phá",
  proposal: "Đề xuất",
  negotiation: "Đàm phán",
  "closed-won": "Thắng",
  "closed-lost": "Thua",
};

export const DEAL_STAGE_COLORS: Record<DealStage, string> = {
  qualification: "gray",
  discovery: "blue",
  proposal: "purple",
  negotiation: "orange",
  "closed-won": "green",
  "closed-lost": "red",
};

export const DEAL_STAGE_PROBABILITIES: Record<DealStage, number> = {
  qualification: 10,
  discovery: 25,
  proposal: 50,
  negotiation: 75,
  "closed-won": 100,
  "closed-lost": 0,
};

export const DEAL_STAGE_DESCRIPTIONS: Record<DealStage, string> = {
  qualification: "Đánh giá nhu cầu và tính phù hợp của khách hàng",
  discovery: "Khám phá chi tiết yêu cầu và thách thức của khách hàng",
  proposal: "Gửi đề xuất giải pháp và báo giá",
  negotiation: "Đàm phán điều khoản và giá cả",
  "closed-won": "Thắng thầu - Deal thành công",
  "closed-lost": "Thua thầu - Deal thất bại",
};

export const DEAL_STAGE_IS_CLOSED: Record<DealStage, boolean> = {
  qualification: false,
  discovery: false,
  proposal: false,
  negotiation: false,
  "closed-won": true,
  "closed-lost": true,
};

export const DEAL_STAGE_IS_WON: Record<DealStage, boolean> = {
  qualification: false,
  discovery: false,
  proposal: false,
  negotiation: false,
  "closed-won": true,
  "closed-lost": false,
};

/* ============================================================
 * Deal Priorities
 * ============================================================ */

export const DEAL_PRIORITIES: DealPriority[] = ["hot", "warm", "cold"];

export const DEAL_PRIORITY_LABELS: Record<DealPriority, string> = {
  hot: "Nóng",
  warm: "Ấm",
  cold: "Lạnh",
};

export const DEAL_PRIORITY_COLORS: Record<DealPriority, string> = {
  hot: "red",
  warm: "orange",
  cold: "blue",
};

export const DEAL_PRIORITY_ICONS: Record<DealPriority, string> = {
  hot: "Flame",
  warm: "Sun",
  cold: "Snowflake",
};

export const DEAL_PRIORITY_DESCRIPTIONS: Record<DealPriority, string> = {
  hot: "Deal ưu tiên cao, cần xử lý ngay",
  warm: "Deal tiềm năng, cần theo dõi",
  cold: "Deal ít khả năng thành công",
};

/* ============================================================
 * Lead Statuses
 * ============================================================ */

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "nurturing",
  "converted",
  "lost",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Đủ điều kiện",
  nurturing: "Nuôi dưỡng",
  converted: "Đã chuyển đổi",
  lost: "Mất",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: "purple",
  contacted: "blue",
  qualified: "cyan",
  nurturing: "orange",
  converted: "green",
  lost: "red",
};

export const LEAD_STATUS_DESCRIPTIONS: Record<LeadStatus, string> = {
  new: "Lead mới chưa được xử lý",
  contacted: "Đã liên hệ lần đầu",
  qualified: "Đã đánh giá đủ điều kiện",
  nurturing: "Đang nuôi dưỡng quan hệ",
  converted: "Đã chuyển thành khách hàng",
  lost: "Không thể chuyển đổi",
};

/* ============================================================
 * Lead Sources
 * ============================================================ */

export const LEAD_SOURCES: LeadSource[] = [
  "website",
  "referral",
  "social",
  "event",
  "ad",
  "cold-call",
  "partner",
  "other",
];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  referral: "Giới thiệu",
  social: "Mạng xã hội",
  event: "Sự kiện",
  ad: "Quảng cáo",
  "cold-call": "Gọi điện lạnh",
  partner: "Đối tác",
  other: "Khác",
};

export const LEAD_SOURCE_COLORS: Record<LeadSource, string> = {
  website: "blue",
  referral: "purple",
  social: "pink",
  event: "green",
  ad: "orange",
  "cold-call": "gray",
  partner: "cyan",
  other: "gray",
};

export const LEAD_SOURCE_ICONS: Record<LeadSource, string> = {
  website: "Globe",
  referral: "UserPlus",
  social: "Share2",
  event: "Calendar",
  ad: "Megaphone",
  "cold-call": "Phone",
  partner: "Handshake",
  other: "MoreHorizontal",
};

/* ============================================================
 * Employee Statuses
 * ============================================================ */

export const EMPLOYEE_STATUSES: EmployeeStatus[] = ["active", "inactive", "on-leave"];

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  "on-leave": "Nghỉ phép",
};

export const EMPLOYEE_STATUS_COLORS: Record<EmployeeStatus, string> = {
  active: "green",
  inactive: "gray",
  "on-leave": "orange",
};

/* ============================================================
 * Employee Types
 * ============================================================ */

export const EMPLOYEE_TYPES: EmployeeType[] = ["human", "ai-agent"];

export const EMPLOYEE_TYPE_LABELS: Record<EmployeeType, string> = {
  human: "Nhân viên",
  "ai-agent": "AI Agent",
};

export const EMPLOYEE_TYPE_COLORS: Record<EmployeeType, string> = {
  human: "blue",
  "ai-agent": "purple",
};

export const EMPLOYEE_TYPE_ICONS: Record<EmployeeType, string> = {
  human: "User",
  "ai-agent": "Bot",
};

/* ============================================================
 * Activity Types
 * ============================================================ */

export const ACTIVITY_TYPES: ActivityType[] = ["call", "email", "meeting", "note", "task"];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  call: "Cuộc gọi",
  email: "Email",
  meeting: "Cuộc họp",
  note: "Ghi chú",
  task: "Nhiệm vụ",
};

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  call: "blue",
  email: "purple",
  meeting: "green",
  note: "gray",
  task: "orange",
};

export const ACTIVITY_TYPE_ICONS: Record<ActivityType, string> = {
  call: "Phone",
  email: "Mail",
  meeting: "Users",
  note: "FileText",
  task: "CheckSquare",
};

/* ============================================================
 * Task Statuses
 * ============================================================ */

export const TASK_STATUSES: TaskStatus[] = ["planned", "in-progress", "completed", "cancelled"];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  planned: "Dự định",
  "in-progress": "Đang thực hiện",
  completed: "Hoàn thành",
  cancelled: "Hủy bỏ",
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  planned: "gray",
  "in-progress": "blue",
  completed: "green",
  cancelled: "red",
};

export const TASK_STATUS_ICONS: Record<TaskStatus, string> = {
  planned: "Clock",
  "in-progress": "Loader",
  completed: "CheckCircle",
  cancelled: "XCircle",
};

/* ============================================================
 * Quotation Statuses
 * ============================================================ */

export const QUOTATION_STATUSES: QuotationStatus[] = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
];

export const QUOTATION_STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: "Nháp",
  sent: "Đã gửi",
  accepted: "Chấp nhận",
  rejected: "Từ chối",
  expired: "Hết hạn",
};

export const QUOTATION_STATUS_COLORS: Record<QuotationStatus, string> = {
  draft: "gray",
  sent: "blue",
  accepted: "green",
  rejected: "red",
  expired: "orange",
};

export const QUOTATION_STATUS_ICONS: Record<QuotationStatus, string> = {
  draft: "FileText",
  sent: "Send",
  accepted: "CheckCircle",
  rejected: "XCircle",
  expired: "Clock",
};

/* ============================================================
 * Contract Statuses
 * ============================================================ */

export const CONTRACT_STATUSES: ContractStatus[] = [
  "draft",
  "active",
  "expired",
  "terminated",
  "renewed",
];

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: "Nháp",
  active: "Hoạt động",
  expired: "Hết hạn",
  terminated: "Chấm dứt",
  renewed: "Gia hạn",
};

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
  draft: "gray",
  active: "green",
  expired: "orange",
  terminated: "red",
  renewed: "blue",
};

export const CONTRACT_STATUS_ICONS: Record<ContractStatus, string> = {
  draft: "FileText",
  active: "FileCheck",
  expired: "Clock",
  terminated: "FileX",
  renewed: "RefreshCw",
};

/* ============================================================
 * Ticket Statuses
 * ============================================================ */

export const TICKET_STATUSES: TicketStatus[] = [
  "open",
  "in-progress",
  "pending",
  "resolved",
  "closed",
];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Mở",
  "in-progress": "Đang xử lý",
  pending: "Chờ phản hồi",
  resolved: "Đã giải quyết",
  closed: "Đóng",
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  open: "red",
  "in-progress": "blue",
  pending: "orange",
  resolved: "green",
  closed: "gray",
};

export const TICKET_STATUS_ICONS: Record<TicketStatus, string> = {
  open: "AlertCircle",
  "in-progress": "Loader",
  pending: "Clock",
  resolved: "CheckCircle",
  closed: "XCircle",
};

/* ============================================================
 * Approval Statuses
 * ============================================================ */

export const APPROVAL_STATUSES: ApprovalStatus[] = ["pending", "approved", "rejected", "cancelled"];

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  cancelled: "Hủy bỏ",
};

export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: "orange",
  approved: "green",
  rejected: "red",
  cancelled: "gray",
};

export const APPROVAL_STATUS_ICONS: Record<ApprovalStatus, string> = {
  pending: "Clock",
  approved: "CheckCircle",
  rejected: "XCircle",
  cancelled: "Ban",
};

/* ============================================================
 * Entity Statuses (Generic)
 * ============================================================ */

export const ENTITY_STATUSES: EntityStatus[] = ["active", "inactive", "archived", "draft"];

export const ENTITY_STATUS_LABELS: Record<EntityStatus, string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  archived: "Lưu trữ",
  draft: "Nháp",
};

export const ENTITY_STATUS_COLORS: Record<EntityStatus, string> = {
  active: "green",
  inactive: "gray",
  archived: "orange",
  draft: "blue",
};

/* ============================================================
 * Health Scores
 * ============================================================ */

export const HEALTH_SCORES: HealthScore[] = ["healthy", "at-risk", "churned"];

export const HEALTH_SCORE_LABELS: Record<HealthScore, string> = {
  healthy: "Khỏe mạnh",
  "at-risk": "Có rủi ro",
  churned: "Mất khách",
};

export const HEALTH_SCORE_COLORS: Record<HealthScore, string> = {
  healthy: "green",
  "at-risk": "orange",
  churned: "red",
};

export const HEALTH_SCORE_ICONS: Record<HealthScore, string> = {
  healthy: "Heart",
  "at-risk": "AlertTriangle",
  churned: "HeartCrack",
};

export const HEALTH_SCORE_DESCRIPTIONS: Record<HealthScore, string> = {
  healthy: "Khách hàng hoạt động tốt, mức độ tương tác cao",
  "at-risk": "Khách hàng có dấu hiệu giảm tương tác, cần quan tâm",
  churned: "Khách hàng đã ngừng sử dụng dịch vụ",
};

/* ============================================================
 * Utility Functions
 * ============================================================ */

/** Get label for any status type */
export function getStatusLabel(
  status: string,
  type:
    | "contact"
    | "deal"
    | "lead"
    | "employee"
    | "activity"
    | "task"
    | "quotation"
    | "contract"
    | "ticket"
    | "approval"
    | "entity"
    | "health"
): string {
  const maps = {
    contact: CONTACT_STATUS_LABELS,
    deal: DEAL_STAGE_LABELS,
    lead: LEAD_STATUS_LABELS,
    employee: EMPLOYEE_STATUS_LABELS,
    activity: ACTIVITY_TYPE_LABELS,
    task: TASK_STATUS_LABELS,
    quotation: QUOTATION_STATUS_LABELS,
    contract: CONTRACT_STATUS_LABELS,
    ticket: TICKET_STATUS_LABELS,
    approval: APPROVAL_STATUS_LABELS,
    entity: ENTITY_STATUS_LABELS,
    health: HEALTH_SCORE_LABELS,
  };

  return maps[type][status as never] || status;
}

/** Get color for any status type */
export function getStatusColor(
  status: string,
  type:
    | "contact"
    | "deal"
    | "lead"
    | "employee"
    | "activity"
    | "task"
    | "quotation"
    | "contract"
    | "ticket"
    | "approval"
    | "entity"
    | "health"
): string {
  const maps = {
    contact: CONTACT_STATUS_COLORS,
    deal: DEAL_STAGE_COLORS,
    lead: LEAD_STATUS_COLORS,
    employee: EMPLOYEE_STATUS_COLORS,
    activity: ACTIVITY_TYPE_COLORS,
    task: TASK_STATUS_COLORS,
    quotation: QUOTATION_STATUS_COLORS,
    contract: CONTRACT_STATUS_COLORS,
    ticket: TICKET_STATUS_COLORS,
    approval: APPROVAL_STATUS_COLORS,
    entity: ENTITY_STATUS_COLORS,
    health: HEALTH_SCORE_COLORS,
  };

  return maps[type][status as never] || "gray";
}

/** Get icon for any status type */
export function getStatusIcon(
  status: string,
  type:
    | "contactType"
    | "dealPriority"
    | "leadSource"
    | "employeeType"
    | "activity"
    | "task"
    | "quotation"
    | "contract"
    | "ticket"
    | "approval"
    | "health"
): string {
  const maps = {
    contactType: CONTACT_TYPE_ICONS,
    dealPriority: DEAL_PRIORITY_ICONS,
    leadSource: LEAD_SOURCE_ICONS,
    employeeType: EMPLOYEE_TYPE_ICONS,
    activity: ACTIVITY_TYPE_ICONS,
    task: TASK_STATUS_ICONS,
    quotation: QUOTATION_STATUS_ICONS,
    contract: CONTRACT_STATUS_ICONS,
    ticket: TICKET_STATUS_ICONS,
    approval: APPROVAL_STATUS_ICONS,
    health: HEALTH_SCORE_ICONS,
  };

  return maps[type][status as never] || "Circle";
}
