/**
 * Kế hoạch phát triển CRM — Rà soát tổng thể & Gap Analysis
 * 
 * Phân loại trang theo mức độ hoàn thiện:
 * - pageType: loại trang (crud | dashboard | builder | kanban | config | analytics | detail)
 * - Đánh giá 8 tiêu chí: search, filter, create, update, delete, pagination,
 *   columnVisibility, viewToggle, inlineEdit, detailPage, centralizedType, centralizedApi
 */

/* ============================================================
 * Types
 * ============================================================ */
export type PageType = "crud" | "dashboard" | "builder" | "kanban" | "config" | "analytics" | "detail" | "visual";

export type FeatureStatus = "done" | "partial" | "missing";

export type StepPriority = "critical" | "high" | "medium" | "low";
export type StepSize = "XS" | "S" | "M" | "L" | "XL";
export type StepStatus = "pending" | "in-progress" | "done";

export interface PageAudit {
  route: string;
  pageName: string;
  fileName: string;
  group: string;
  pageType: PageType;
  features: {
    search: FeatureStatus;
    filter: FeatureStatus;
    create: FeatureStatus;
    update: FeatureStatus;
    delete: FeatureStatus;
    pagination: FeatureStatus;
    columnVisibility: FeatureStatus;
    viewToggle: FeatureStatus;
    inlineEdit: FeatureStatus;
    detailPage: FeatureStatus;
    centralizedType: FeatureStatus;
    centralizedApi: FeatureStatus;
  };
  notes?: string;
}

export interface DevStep {
  id: string;
  title: string;
  description: string;
  relatedPages?: string[];
  priority: StepPriority;
  size: StepSize;
  status: StepStatus;
  tags: string[];
}

export interface DevPhase {
  id: string;
  title: string;
  description: string;
  group: string;
  steps: DevStep[];
}

/* ============================================================
 * Helper tạo feature map nhanh
 * ============================================================ */
type FeatKey = keyof PageAudit["features"];
const ALL_FEATS: FeatKey[] = [
  "search", "filter", "create", "update", "delete",
  "pagination", "columnVisibility", "viewToggle",
  "inlineEdit", "detailPage", "centralizedType", "centralizedApi",
];

function feats(overrides: Partial<Record<FeatKey, FeatureStatus>>): PageAudit["features"] {
  const base: Record<FeatKey, FeatureStatus> = {} as any;
  for (const k of ALL_FEATS) base[k] = "missing";
  return { ...base, ...overrides };
}

/* ============================================================
 * PAGE AUDIT — Rà soát 96 trang CRM
 * ============================================================ */
export const pageAudits: PageAudit[] = [
  /* ── TỔNG QUAN ── */
  { route: "/crm", pageName: "Dashboard", fileName: "CrmDashboardPage.tsx", group: "Tổng quan", pageType: "dashboard",
    features: feats({ search: "missing", filter: "partial" }), notes: "Có stat cards + charts, thiếu bộ lọc thời gian" },
  { route: "/crm/custom-dashboard", pageName: "Dashboard Tuỳ chỉnh", fileName: "CustomDashboardPage.tsx", group: "Tổng quan", pageType: "builder",
    features: feats({ create: "partial", update: "partial" }), notes: "Có widget drag, thiếu save/load layout" },

  /* ── BÁN HÀNG — Liên hệ & Lead ── */
  { route: "/crm/contacts", pageName: "Liên hệ", fileName: "ContactsPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "done", update: "done", delete: "done", pagination: "done", columnVisibility: "done", viewToggle: "done", inlineEdit: "done", detailPage: "done", centralizedType: "done", centralizedApi: "done" }),
    notes: "✅ Trang mẫu hoàn chỉnh: DataTable + Card view, CRUD, pagination, column vis, inline edit, sort, bulk delete" },
  { route: "/crm/leads", pageName: "Lead Inbox", fileName: "LeadInboxPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial", update: "partial" }),
    notes: "Có inbox UI, thiếu CRUD đầy đủ + pagination" },
  { route: "/crm/customer-360", pageName: "Customer 360°", fileName: "Customer360Page.tsx", group: "Bán hàng", pageType: "detail",
    features: feats({ search: "partial", filter: "partial" }),
    notes: "Trang chi tiết khách hàng 360°, thiếu liên kết dữ liệu thực" },

  /* ── BÁN HÀNG — Pipeline & Deals ── */
  { route: "/crm/pipeline", pageName: "Sales Pipeline", fileName: "PipelinePage.tsx", group: "Bán hàng", pageType: "kanban",
    features: feats({ search: "done", filter: "done", create: "done", update: "done", pagination: "done", columnVisibility: "done", viewToggle: "done", inlineEdit: "done", detailPage: "done", centralizedType: "done", centralizedApi: "done" }),
    notes: "✅ Kanban DnD + Table view toggle, FilterBar, DataTable với pagination/column vis/inline edit" },
  { route: "/crm/deal-room", pageName: "Deal Room", fileName: "DealRoomPage.tsx", group: "Bán hàng", pageType: "detail",
    features: feats({ filter: "partial" }), notes: "Collaboration room, thiếu CRUD" },
  { route: "/crm/sales-playbook", pageName: "Sales Playbook", fileName: "SalesPlaybookPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "partial", filter: "partial" }), notes: "Trang mới, thiếu hầu hết features" },
  { route: "/crm/account-planning", pageName: "Account Planning", fileName: "AccountPlanningPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "partial" }), notes: "Trang mới, thiếu hầu hết features" },

  /* ── BÁN HÀNG — Báo giá & Hợp đồng ── */
  { route: "/crm/quotations", pageName: "Báo giá", fileName: "QuotationBuilderPage.tsx", group: "Bán hàng", pageType: "builder",
    features: feats({ search: "done", filter: "done", create: "done", update: "partial" }),
    notes: "Builder phức tạp, thiếu pagination + delete + column vis" },
  { route: "/crm/cpq", pageName: "CPQ", fileName: "CpqPage.tsx", group: "Bán hàng", pageType: "builder",
    features: feats({ search: "partial" }), notes: "Configure-Price-Quote, thiếu CRUD" },
  { route: "/crm/contracts", pageName: "Hợp đồng", fileName: "ContractManagementPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial", update: "partial" }),
    notes: "Có charts + list, thiếu pagination + inline edit + detail page" },
  { route: "/crm/subscriptions", pageName: "Subscription", fileName: "SubscriptionManagementPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial" }),
    notes: "Có list view, thiếu CRUD đầy đủ + pagination" },

  /* ── BÁN HÀNG — Doanh thu ── */
  { route: "/crm/forecast", pageName: "Dự báo Doanh thu", fileName: "ForecastPage.tsx", group: "Bán hàng", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Charts + projections, thiếu filter thời gian chi tiết" },
  { route: "/crm/commissions", pageName: "Hoa hồng Sales", fileName: "CommissionCalculatorPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done" }),
    notes: "Calculator + list, thiếu CRUD + pagination" },
  { route: "/crm/revenue-intelligence", pageName: "Revenue Intelligence", fileName: "RevenueIntelligencePage.tsx", group: "Bán hàng", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Trang mới, analytics thuần" },
  { route: "/crm/revenue-waterfall", pageName: "Revenue Waterfall", fileName: "RevenueWaterfallPage.tsx", group: "Bán hàng", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Trang mới, waterfall chart" },
  { route: "/crm/revenue-leakage", pageName: "Revenue Leakage", fileName: "RevenueLeakagePage.tsx", group: "Bán hàng", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Trang mới, leakage analysis" },
  { route: "/crm/attribution", pageName: "Phân bổ Doanh thu", fileName: "RevenueAttributionPage.tsx", group: "Bán hàng", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Charts, thiếu filter đầy đủ" },
  { route: "/crm/quotas", pageName: "Quota Management", fileName: "QuotaManagementPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "partial", filter: "partial" }), notes: "Trang mới, thiếu CRUD" },
  { route: "/crm/win-loss", pageName: "Win/Loss Analysis", fileName: "WinLossAnalysisPage.tsx", group: "Bán hàng", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Trang mới, analytics" },

  /* ── BÁN HÀNG — Đối thủ & Lãnh thổ ── */
  { route: "/crm/competitors", pageName: "Phân tích Đối thủ", fileName: "CompetitorAnalysisPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial" }),
    notes: "Có cards + radar chart, thiếu CRUD đầy đủ + pagination" },
  { route: "/crm/territories", pageName: "Vùng lãnh thổ", fileName: "TerritoryManagementPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial" }),
    notes: "Map + list, thiếu inline edit + pagination" },

  /* ── BÁN HÀNG — Đối tác ── */
  { route: "/crm/partners", pageName: "Cổng Đối tác", fileName: "PartnerPortalPage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial" }),
    notes: "Portal cards, thiếu CRUD đầy đủ + pagination" },
  { route: "/crm/marketplace", pageName: "Partner Marketplace", fileName: "PartnerMarketplacePage.tsx", group: "Bán hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done" }), notes: "Trang mới, marketplace cards" },
  { route: "/crm/partner-scorecard", pageName: "Partner Scorecard", fileName: "PartnerScorecardPage.tsx", group: "Bán hàng", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Trang mới, scorecard analytics" },

  /* ── MARKETING ── */
  { route: "/crm/marketing", pageName: "Chiến dịch Marketing", fileName: "MarketingCampaignPage.tsx", group: "Marketing", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial", update: "partial" }),
    notes: "Có campaign cards, thiếu pagination + inline edit" },
  { route: "/crm/sms-campaigns", pageName: "SMS Campaigns", fileName: "SmsCampaignPage.tsx", group: "Marketing", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial" }),
    notes: "Campaign list, thiếu CRUD đầy đủ + pagination" },
  { route: "/crm/campaign-roi", pageName: "Campaign ROI", fileName: "CampaignRoiPage.tsx", group: "Marketing", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Trang mới, ROI analytics" },
  { route: "/crm/ab-testing", pageName: "A/B Testing", fileName: "ABTestingPage.tsx", group: "Marketing", pageType: "crud",
    features: feats({ search: "partial", filter: "partial", create: "partial" }),
    notes: "Experiment cards, thiếu CRUD + pagination" },
  { route: "/crm/email-sequences", pageName: "Email Sequences", fileName: "EmailSequenceBuilderPage.tsx", group: "Marketing", pageType: "builder",
    features: feats({ search: "done", filter: "done", create: "partial" }),
    notes: "Sequence builder, thiếu CRUD đầy đủ" },
  { route: "/crm/email-templates", pageName: "Email Templates", fileName: "EmailTemplatesPage.tsx", group: "Marketing", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "done", update: "done" }),
    notes: "Template editor + list, thiếu pagination + delete" },
  { route: "/crm/content-calendar", pageName: "Content Calendar", fileName: "ContentCalendarPage.tsx", group: "Marketing", pageType: "visual",
    features: feats({ create: "partial" }), notes: "Trang mới, calendar view" },
  { route: "/crm/form-builder", pageName: "Form Builder", fileName: "FormBuilderPage.tsx", group: "Marketing", pageType: "builder",
    features: feats({ create: "partial", update: "partial" }), notes: "Drag & drop builder" },
  { route: "/crm/landing-pages", pageName: "Landing Pages", fileName: "LandingPageBuilderPage.tsx", group: "Marketing", pageType: "builder",
    features: feats({ search: "partial", create: "partial" }), notes: "Page builder, thiếu CRUD" },
  { route: "/crm/referral-program", pageName: "Referral Program", fileName: "ReferralProgramPage.tsx", group: "Marketing", pageType: "crud",
    features: feats({ search: "partial", filter: "partial" }), notes: "Trang mới, referral tracking" },
  { route: "/crm/event-manager", pageName: "Event Manager", fileName: "EventManagerPage.tsx", group: "Marketing", pageType: "crud",
    features: feats({ search: "partial", filter: "partial", create: "partial" }), notes: "Trang mới, event cards" },
  { route: "/crm/social-monitor", pageName: "Social Media Monitor", fileName: "SocialMediaMonitorPage.tsx", group: "Marketing", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Social listening dashboard" },

  /* ── KHÁCH HÀNG ── */
  { route: "/crm/journey", pageName: "Customer Journey", fileName: "CustomerJourneyPage.tsx", group: "Khách hàng", pageType: "visual",
    features: feats({ search: "done", filter: "done" }), notes: "Journey map visual, thiếu CRUD" },
  { route: "/crm/customer-health", pageName: "Sức khỏe KH", fileName: "CustomerHealthPage.tsx", group: "Khách hàng", pageType: "analytics",
    features: feats({ search: "done", filter: "done" }), notes: "Health scores + charts" },
  { route: "/crm/segmentation", pageName: "Customer Segmentation", fileName: "CustomerSegmentationPage.tsx", group: "Khách hàng", pageType: "crud",
    features: feats({ search: "partial", filter: "partial", create: "partial" }),
    notes: "Segment builder, thiếu CRUD đầy đủ" },
  { route: "/crm/tickets", pageName: "Hỗ trợ Khách hàng", fileName: "TicketSupportPage.tsx", group: "Khách hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "done", update: "done", delete: "done", pagination: "done", columnVisibility: "done", viewToggle: "done", inlineEdit: "done", centralizedType: "done", centralizedApi: "done" }),
    notes: "✅ Centralized types/data/API. DataTable + Card, FilterBar, inline edit, bulk delete, charts" },
  { route: "/crm/customer-portal", pageName: "Customer Portal", fileName: "CustomerPortalPage.tsx", group: "Khách hàng", pageType: "config",
    features: feats({ update: "partial" }), notes: "Portal config, settings-style page" },
  { route: "/crm/live-chat-config", pageName: "Live Chat Config", fileName: "LiveChatConfigPage.tsx", group: "Khách hàng", pageType: "config",
    features: feats({ update: "partial" }), notes: "Chat widget config" },
  { route: "/crm/knowledge-base", pageName: "Knowledge Base", fileName: "KnowledgeBasePage.tsx", group: "Khách hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "done", update: "partial" }),
    notes: "Article management, thiếu pagination + delete" },
  { route: "/crm/onboarding", pageName: "Onboarding", fileName: "OnboardingWorkflowPage.tsx", group: "Khách hàng", pageType: "builder",
    features: feats({ create: "partial", update: "partial" }), notes: "Workflow steps, thiếu CRUD" },
  { route: "/crm/nps", pageName: "NPS & Phản hồi", fileName: "NPSTrackerPage.tsx", group: "Khách hàng", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "NPS charts + response list" },
  { route: "/crm/surveys", pageName: "Survey Builder", fileName: "SurveyBuilderPage.tsx", group: "Khách hàng", pageType: "builder",
    features: feats({ create: "partial" }), notes: "Survey form builder" },
  { route: "/crm/churn-prediction", pageName: "Churn Prediction", fileName: "ChurnPredictionPage.tsx", group: "Khách hàng", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "AI prediction dashboard" },
  { route: "/crm/renewals", pageName: "Renewal Pipeline", fileName: "RenewalPipelinePage.tsx", group: "Khách hàng", pageType: "kanban",
    features: feats({ filter: "partial" }), notes: "Pipeline view cho renewals" },
  { route: "/crm/sla", pageName: "SLA Tracking", fileName: "SLATrackingPage.tsx", group: "Khách hàng", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial" }),
    notes: "SLA rules + tracking, thiếu CRUD đầy đủ + pagination" },
  { route: "/crm/feedback-wall", pageName: "Feedback Wall", fileName: "FeedbackWallPage.tsx", group: "Khách hàng", pageType: "crud",
    features: feats({ search: "partial", filter: "partial" }), notes: "Trang mới, feedback masonry" },

  /* ── AI & TỰ ĐỘNG ── */
  { route: "/crm/ai-insights", pageName: "AI Insights", fileName: "AIInsightsPage.tsx", group: "AI & Tự động", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "AI dashboard + insight cards" },
  { route: "/crm/predictive-analytics", pageName: "Predictive Analytics", fileName: "PredictiveAnalyticsPage.tsx", group: "AI & Tự động", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Prediction models dashboard" },
  { route: "/crm/data-enrichment", pageName: "Data Enrichment", fileName: "DataEnrichmentPage.tsx", group: "AI & Tự động", pageType: "config",
    features: feats({ update: "partial" }), notes: "Enrichment config + queue" },
  { route: "/crm/meetings", pageName: "Meeting Intelligence", fileName: "MeetingIntelligencePage.tsx", group: "AI & Tự động", pageType: "crud",
    features: feats({ search: "done", filter: "done" }), notes: "Meeting recordings + analysis, thiếu CRUD" },
  { route: "/crm/ai-training", pageName: "AI Training", fileName: "AiTrainingDashboardPage.tsx", group: "AI & Tự động", pageType: "config",
    features: feats({ update: "partial" }), notes: "Training dashboard" },
  { route: "/crm/chatbot-training", pageName: "AI Chatbot Training", fileName: "AiChatbotTrainingPage.tsx", group: "AI & Tự động", pageType: "builder",
    features: feats({ create: "partial", update: "partial" }), notes: "Chatbot flow builder" },
  { route: "/crm/ai-copilot", pageName: "AI Copilot Settings", fileName: "AiCopilotSettingsPage.tsx", group: "AI & Tự động", pageType: "config",
    features: feats({ update: "partial" }), notes: "Copilot config" },
  { route: "/crm/automations", pageName: "Quy trình tự động", fileName: "AutomationRulesPage.tsx", group: "AI & Tự động", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "done", update: "partial" }),
    notes: "Automation rules list, thiếu pagination + inline edit" },
  { route: "/crm/workflow-builder", pageName: "Workflow Builder", fileName: "WorkflowBuilderPage.tsx", group: "AI & Tự động", pageType: "builder",
    features: feats({ create: "done", update: "partial" }), notes: "Visual workflow builder phức tạp" },

  /* ── VẬN HÀNH ── */
  { route: "/crm/team", pageName: "Nhân sự", fileName: "TeamPage.tsx", group: "Vận hành", pageType: "crud",
    features: feats({ search: "done", filter: "done", pagination: "done", columnVisibility: "done", viewToggle: "done", inlineEdit: "done", detailPage: "done", centralizedType: "done", centralizedApi: "done" }),
    notes: "✅ DataTable + Card view, FilterBar, pagination, column vis (13 cột, 6 KPI), inline edit status, sort" },
  { route: "/crm/team-capacity", pageName: "Capacity Planner", fileName: "TeamCapacityPage.tsx", group: "Vận hành", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Capacity charts" },
  { route: "/crm/leaderboard", pageName: "Bảng xếp hạng", fileName: "LeaderboardPage.tsx", group: "Vận hành", pageType: "analytics",
    features: feats({ filter: "done" }), notes: "Ranking table + charts" },
  { route: "/crm/gamification", pageName: "Game hoá Sales", fileName: "GamificationPage.tsx", group: "Vận hành", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Gamification dashboard" },
  { route: "/crm/activities", pageName: "Hoạt động", fileName: "ActivitiesPage.tsx", group: "Vận hành", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "done", centralizedType: "done", centralizedApi: "done" }),
    notes: "Activity list + modal, thiếu pagination + inline edit + update/delete" },
  { route: "/crm/calendar", pageName: "Lịch hẹn", fileName: "CalendarPage.tsx", group: "Vận hành", pageType: "visual",
    features: feats({ create: "done", update: "partial", viewToggle: "done", centralizedType: "done", centralizedApi: "done" }),
    notes: "✅ Centralized types/data/API. Calendar month/week toggle, filter type, create event qua API" },
  { route: "/crm/tasks", pageName: "Bảng Công việc", fileName: "TaskBoardPage.tsx", group: "Vận hành", pageType: "kanban",
    features: feats({ search: "done", filter: "done", create: "done", update: "done", centralizedType: "done", centralizedApi: "done" }),
    notes: "✅ Centralized types/data/API. Kanban D&D, search/filter, create task qua API" },
  { route: "/crm/approvals", pageName: "Phê duyệt", fileName: "ApprovalWorkflowPage.tsx", group: "Vận hành", pageType: "crud",
    features: feats({ search: "done", filter: "done", update: "partial" }),
    notes: "Approval list, thiếu create + pagination" },
  { route: "/crm/goals", pageName: "Mục tiêu & OKR", fileName: "GoalTrackingPage.tsx", group: "Vận hành", pageType: "crud",
    features: feats({ search: "partial", filter: "partial", create: "partial" }),
    notes: "OKR cards, thiếu CRUD đầy đủ + pagination" },
  { route: "/crm/products", pageName: "Sản phẩm & Dịch vụ", fileName: "ProductCatalogPage.tsx", group: "Vận hành", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "done", update: "done", delete: "done", pagination: "done", columnVisibility: "done", viewToggle: "done", inlineEdit: "done" }),
    notes: "✅ Centralized types/data/API. DataTable + Card grid, FilterBar, inline edit status, bulk delete, charts" },
  { route: "/crm/inventory", pageName: "Quản lý Kho", fileName: "InventoryManagementPage.tsx", group: "Vận hành", pageType: "crud",
    features: feats({ search: "done", filter: "done" }), notes: "Inventory list, thiếu CRUD + pagination" },
  { route: "/crm/vendors", pageName: "Nhà cung cấp", fileName: "VendorManagementPage.tsx", group: "Vận hành", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial" }),
    notes: "Vendor cards + radar, thiếu CRUD đầy đủ + pagination + detail page" },
  { route: "/crm/multi-currency", pageName: "Đa Tiền tệ", fileName: "MultiCurrencyPage.tsx", group: "Vận hành", pageType: "config",
    features: feats({ update: "partial" }), notes: "Currency config + exchange rates" },
  { route: "/crm/documents", pageName: "Tài liệu & E-Sign", fileName: "DocumentManagementPage.tsx", group: "Vận hành", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "partial" }),
    notes: "Document library, thiếu CRUD + pagination + detail" },
  { route: "/crm/voip-dialer", pageName: "VoIP Dialer", fileName: "VoipDialerPage.tsx", group: "Vận hành", pageType: "visual",
    features: feats({}), notes: "Dialer UI, trang đặc biệt" },

  /* ── QUẢN TRỊ ── */
  { route: "/crm/settings", pageName: "Cài đặt chung", fileName: "CrmSettingsPage.tsx", group: "Quản trị", pageType: "config",
    features: feats({ update: "done" }), notes: "Settings form hoạt động" },
  { route: "/crm/custom-fields", pageName: "Trường Tuỳ chỉnh", fileName: "CustomFieldsPage.tsx", group: "Quản trị", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "done", update: "done", delete: "done" }),
    notes: "CRUD đầy đủ, thiếu pagination" },
  { route: "/crm/rbac", pageName: "Phân quyền (RBAC)", fileName: "RBACPage.tsx", group: "Quản trị", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "done", update: "done" }),
    notes: "Roles + permissions, thiếu pagination + delete" },
  { route: "/crm/notifications", pageName: "Cài đặt Thông báo", fileName: "NotificationPreferencesPage.tsx", group: "Quản trị", pageType: "config",
    features: feats({ update: "done" }), notes: "Toggle preferences" },
  { route: "/crm/api-explorer", pageName: "API Explorer", fileName: "ApiExplorerPage.tsx", group: "Quản trị", pageType: "builder",
    features: feats({ search: "done", filter: "done" }), notes: "API docs + playground" },
  { route: "/crm/webhooks", pageName: "Webhook Manager", fileName: "WebhookManagerPage.tsx", group: "Quản trị", pageType: "crud",
    features: feats({ search: "done", filter: "done", create: "done", update: "partial", delete: "partial" }),
    notes: "Webhook CRUD, thiếu pagination + inline edit" },
  { route: "/crm/dev-portal", pageName: "Developer Portal", fileName: "DevPortalPage.tsx", group: "Quản trị", pageType: "config",
    features: feats({}), notes: "Dev docs + SDK info" },
  { route: "/crm/integrations", pageName: "Tích hợp", fileName: "IntegrationHubPage.tsx", group: "Quản trị", pageType: "crud",
    features: feats({ search: "done", filter: "done", update: "partial" }),
    notes: "Integration cards, thiếu CRUD + pagination" },
  { route: "/crm/dependency-graph", pageName: "Dependency Graph", fileName: "DependencyGraphPage.tsx", group: "Quản trị", pageType: "visual",
    features: feats({}), notes: "Graph visualization, trang đặc biệt" },
  { route: "/crm/import-wizard", pageName: "Import Wizard", fileName: "DataImportWizardPage.tsx", group: "Quản trị", pageType: "builder",
    features: feats({ create: "partial" }), notes: "Step wizard import" },
  { route: "/crm/data-center", pageName: "Nhập / Xuất DL", fileName: "DataImportExportPage.tsx", group: "Quản trị", pageType: "config",
    features: feats({ search: "done", filter: "done" }), notes: "Import/Export history" },
  { route: "/crm/reports", pageName: "Báo cáo", fileName: "ReportsPage.tsx", group: "Quản trị", pageType: "analytics",
    features: feats({ filter: "partial" }), notes: "Report list + charts" },
  { route: "/crm/audit-trail", pageName: "Audit Trail", fileName: "AuditTrailPage.tsx", group: "Quản trị", pageType: "crud",
    features: feats({ search: "done", filter: "done" }), notes: "Audit log list, thiếu pagination + export" },
  { route: "/crm/audit-log", pageName: "Nhật ký Kiểm toán", fileName: "AuditLogPage.tsx", group: "Quản trị", pageType: "crud",
    features: feats({ search: "done", filter: "done" }), notes: "System audit log, thiếu pagination" },
  { route: "/crm/compliance", pageName: "Compliance", fileName: "ComplianceDashboardPage.tsx", group: "Quản trị", pageType: "dashboard",
    features: feats({ filter: "partial" }), notes: "Compliance checklist + progress" },
  { route: "/crm/trust-center", pageName: "Trust Center", fileName: "TrustCenterPage.tsx", group: "Quản trị", pageType: "config",
    features: feats({}), notes: "Trust & security info" },
  { route: "/crm/profile", pageName: "Hồ sơ & API Keys", fileName: "UserProfilePage.tsx", group: "Quản trị", pageType: "config",
    features: feats({ update: "done" }), notes: "Profile form + API key management" },
];

/* ============================================================
 * DEVELOPMENT PHASES — Kế hoạch chi tiết ~320 bước
 * ============================================================ */
export const devPhases: DevPhase[] = [
  /* ────────────────────────────────────────────
   * PHASE F0: Shared Foundation Infrastructure
   * ──────────────────────────────────────────── */
  {
    id: "F0", title: "Hạ tầng chia sẻ (Shared Foundation)", group: "Foundation",
    description: "Xây dựng các hook, component dùng chung cho toàn bộ CRM — giảm code trùng lặp, tăng nhất quán.",
    steps: [
      { id: "F0-01", title: "Hook usePagination", description: "Tạo hook usePagination(items, pageSize) trả về { currentPage, totalPages, paginatedItems, goTo, next, prev }. Hỗ trợ URL query params.", relatedPages: ["Tất cả trang CRUD"], priority: "critical", size: "M", status: "done", tags: ["hook", "pagination"] },
      { id: "F0-02", title: "Hook useColumnVisibility", description: "Tạo hook quản lý ẩn/hiện cột: useColumnVisibility(allColumns) → { visibleColumns, toggleColumn, showAll, hideAll }. Persist vào localStorage theo key trang.", relatedPages: ["Tất cả trang CRUD"], priority: "critical", size: "M", status: "done", tags: ["hook", "column"] },
      { id: "F0-03", title: "Hook useInlineEdit", description: "Tạo hook useInlineEdit() quản lý trạng thái chỉnh sửa inline: { editingId, editingField, startEdit, cancelEdit, saveEdit }.", relatedPages: ["Tất cả trang CRUD"], priority: "high", size: "M", status: "done", tags: ["hook", "inline-edit"] },
      { id: "F0-04", title: "Hook useViewMode", description: "Tạo hook useViewMode(defaultMode) → { mode, setMode } với persist localStorage. Modes: 'table' | 'card' | 'list' | 'kanban'.", relatedPages: ["Trang quan trọng"], priority: "high", size: "S", status: "done", tags: ["hook", "view-mode"] },
      { id: "F0-05", title: "Hook useDataFilter", description: "Tạo hook useDataFilter(items, filterConfig) tổng quát, hỗ trợ multi-field filtering, debounce search, URL params sync.", relatedPages: ["Tất cả trang CRUD"], priority: "high", size: "L", status: "pending", tags: ["hook", "filter"] },
      { id: "F0-06", title: "Hook useSorting", description: "Tạo hook useSorting(items, defaultField, defaultDir) → { sortedItems, sortField, sortDir, toggleSort }.", relatedPages: ["Tất cả trang CRUD"], priority: "high", size: "S", status: "done", tags: ["hook", "sort"] },
      { id: "F0-07", title: "Component DataTable", description: "Tạo component DataTable tích hợp pagination, column visibility, inline edit, sorting, row selection. Props: columns, data, onEdit, onDelete, pageSize.", relatedPages: ["Tất cả trang CRUD"], priority: "critical", size: "XL", status: "done", tags: ["component", "table"] },
      { id: "F0-08", title: "Component PaginationBar", description: "Tạo component PaginationBar hiển thị navigation phân trang + page size selector (10/25/50/100). Mobile responsive.", relatedPages: ["Tất cả trang CRUD"], priority: "critical", size: "M", status: "done", tags: ["component", "pagination"] },
      { id: "F0-09", title: "Component ColumnVisibilityDropdown", description: "Tạo dropdown cho phép tick chọn cột hiển thị, có nút 'Hiện tất cả' / 'Mặc định'.", relatedPages: ["Tất cả trang CRUD"], priority: "high", size: "M", status: "done", tags: ["component", "column"] },
      { id: "F0-10", title: "Component ViewToggle", description: "Tạo button group toggle giữa Bảng / Danh sách / Card. Icon-based, compact.", relatedPages: ["Trang quan trọng"], priority: "high", size: "S", status: "done", tags: ["component", "view-mode"] },
      { id: "F0-11", title: "Component FilterBar", description: "Tạo FilterBar tổng quát: search input + dropdown filters + active filter chips + nút xóa lọc.", relatedPages: ["Tất cả trang CRUD"], priority: "high", size: "L", status: "done", tags: ["component", "filter"] },
      { id: "F0-12", title: "Component InlineEditCell", description: "Tạo component cho inline edit: click text → input/select/date picker. Support types: text, number, select, date, combobox.", relatedPages: ["Tất cả trang CRUD"], priority: "high", size: "L", status: "done", tags: ["component", "inline-edit"] },
      { id: "F0-13", title: "Component ConfirmDeleteDialog", description: "Tạo dialog xác nhận xóa dùng chung: tên item, cảnh báo, nút Hủy/Xóa. Dùng AlertDialog từ shadcn.", relatedPages: ["Tất cả trang CRUD"], priority: "high", size: "S", status: "done", tags: ["component", "delete"] },
      { id: "F0-14", title: "Component DetailPageLayout", description: "Tạo layout chuẩn cho trang chi tiết: breadcrumb + header + tabs + action buttons. Responsive.", relatedPages: ["Tất cả detail pages"], priority: "high", size: "L", status: "pending", tags: ["component", "detail"] },
      { id: "F0-15", title: "Component EmptyState", description: "Tạo component trạng thái rỗng dùng chung: icon + message + CTA button.", relatedPages: ["Tất cả"], priority: "medium", size: "XS", status: "pending", tags: ["component", "ux"] },
      { id: "F0-16", title: "Component BulkActionBar", description: "Tạo thanh hành động hàng loạt: chọn nhiều → xóa/xuất/gán. Hiện khi có selection.", relatedPages: ["Trang CRUD quan trọng"], priority: "medium", size: "M", status: "pending", tags: ["component", "bulk"] },
      { id: "F0-17", title: "Component ExportButton", description: "Tạo nút Xuất CSV/Excel dùng chung. Xuất theo filter hiện tại.", relatedPages: ["Tất cả trang CRUD"], priority: "medium", size: "M", status: "pending", tags: ["component", "export"] },
      { id: "F0-18", title: "Chuẩn hóa API layer pattern", description: "Tạo hàm apiFactory(entityName, mockData) sinh CRUD API chuẩn: fetchAll, fetchById, create, update, delete, fetchPaginated. Giảm boilerplate.", relatedPages: ["api/crmApi.ts"], priority: "critical", size: "L", status: "pending", tags: ["api", "pattern"] },
      { id: "F0-19", title: "Chuẩn hóa PaginatedResponse type", description: "Thêm type PaginatedResponse<T> = { items: T[], total: number, page: number, pageSize: number, totalPages: number } vào types/crm.ts.", relatedPages: ["types/crm.ts"], priority: "critical", size: "XS", status: "done", tags: ["type"] },
      { id: "F0-20", title: "Component FormModal pattern", description: "Tạo FormModal wrapper chuẩn: header, body scrollable, footer với Save/Cancel. Auto-focus first field, Escape to close.", relatedPages: ["Tất cả trang CRUD"], priority: "high", size: "M", status: "pending", tags: ["component", "form"] },
      { id: "F0-21", title: "Hook useFormState", description: "Tạo hook form state đơn giản (không cần react-hook-form cho form nhỏ): { values, setField, reset, isDirty, validate }.", relatedPages: ["Tất cả form"], priority: "medium", size: "M", status: "pending", tags: ["hook", "form"] },
      { id: "F0-22", title: "Tạo thư mục types chia nhỏ", description: "Tách types/crm.ts thành các file nhỏ hơn nếu vượt 500 dòng: types/contact.ts, types/deal.ts, types/ticket.ts... Re-export từ index.", relatedPages: ["types/"], priority: "medium", size: "M", status: "pending", tags: ["refactor", "type"] },
    ],
  },

  /* ────────────────────────────────────────────
   * PHASE F1: BÁN HÀNG — Nâng cấp toàn bộ
   * ──────────────────────────────────────────── */
  {
    id: "F1", title: "Bán hàng — Nâng cấp đầy đủ tính năng", group: "Bán hàng",
    description: "Nâng cấp 23 trang Bán hàng: thêm pagination, inline edit, column visibility, view toggle, detail pages, CRUD hoàn chỉnh.",
    steps: [
      // Liên hệ & Lead
      { id: "F1-01", title: "Contacts: Thêm phân trang", description: "Tích hợp usePagination + PaginationBar vào ContactsPage. Mặc định 25/trang.", relatedPages: ["ContactsPage.tsx"], priority: "critical", size: "M", status: "done", tags: ["pagination", "contacts"] },
      { id: "F1-02", title: "Contacts: Column visibility", description: "Thêm ColumnVisibilityDropdown, cho phép ẩn/hiện: Email, Phone, Company, Score, Status, Assigned.", relatedPages: ["ContactsPage.tsx"], priority: "high", size: "M", status: "done", tags: ["column", "contacts"] },
      { id: "F1-03", title: "Contacts: Inline edit", description: "Cho phép click vào Name, Company, Status, Type để sửa inline. Save on blur/Enter.", relatedPages: ["ContactsPage.tsx"], priority: "high", size: "L", status: "done", tags: ["inline-edit", "contacts"] },
      { id: "F1-04", title: "Contacts: View toggle Table/Card", description: "Thêm ViewToggle: dạng bảng (DataTable) và dạng card (hiện tại). Persist viewMode.", relatedPages: ["ContactsPage.tsx"], priority: "high", size: "L", status: "done", tags: ["view-toggle", "contacts"] },
      { id: "F1-05", title: "Contacts: Delete + bulk delete", description: "Thêm nút Xóa (có xác nhận) + checkbox chọn nhiều + bulk delete.", relatedPages: ["ContactsPage.tsx"], priority: "high", size: "M", status: "done", tags: ["delete", "contacts"] },
      { id: "F1-06", title: "Contacts: Sắp xếp cột", description: "Click header cột để sort ASC/DESC. Hiện icon sort.", relatedPages: ["ContactsPage.tsx"], priority: "medium", size: "S", status: "done", tags: ["sort", "contacts"] },

      // Lead Inbox
      { id: "F1-07", title: "Lead Inbox: CRUD đầy đủ", description: "Thêm form tạo lead mới + update status + delete. Chuyển types vào crm.ts.", relatedPages: ["LeadInboxPage.tsx"], priority: "high", size: "L", status: "pending", tags: ["crud", "leads"] },
      { id: "F1-08", title: "Lead Inbox: Phân trang", description: "Thêm pagination cho danh sách lead.", relatedPages: ["LeadInboxPage.tsx"], priority: "high", size: "M", status: "pending", tags: ["pagination", "leads"] },
      { id: "F1-09", title: "Lead Inbox: Centralize types + API", description: "Di chuyển Lead types vào types/crm.ts, tạo API functions trong crmApi.ts.", relatedPages: ["LeadInboxPage.tsx", "types/crm.ts", "api/crmApi.ts"], priority: "high", size: "M", status: "pending", tags: ["refactor", "leads"] },

      // Customer 360
      { id: "F1-10", title: "Customer 360: Liên kết data thực", description: "Kết nối với contacts, deals, activities, tickets API thực. Hiển thị timeline tổng hợp.", relatedPages: ["Customer360Page.tsx"], priority: "high", size: "L", status: "pending", tags: ["integration", "customer-360"] },

      // Pipeline
      { id: "F1-11", title: "Pipeline: Search + Filter", description: "Thêm thanh search + filter theo assignee, priority, amount range trên Kanban board.", relatedPages: ["PipelinePage.tsx"], priority: "high", size: "M", status: "done", tags: ["filter", "pipeline"] },
      { id: "F1-12", title: "Pipeline: View toggle Kanban/Table", description: "Thêm toggle giữa Kanban (hiện tại) và Table view với đầy đủ pagination + column vis.", relatedPages: ["PipelinePage.tsx"], priority: "high", size: "XL", status: "done", tags: ["view-toggle", "pipeline"] },
      { id: "F1-13", title: "Pipeline: Delete deal + bulk actions", description: "Thêm delete deal (drag to trash hoặc menu) + bulk move stage.", relatedPages: ["PipelinePage.tsx"], priority: "medium", size: "M", status: "pending", tags: ["delete", "pipeline"] },

      // Deal Room
      { id: "F1-14", title: "Deal Room: CRUD collaboration notes", description: "Thêm CRUD cho notes, files, stakeholders. Inline edit comments.", relatedPages: ["DealRoomPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "deal-room"] },

      // Sales Playbook
      { id: "F1-15", title: "Sales Playbook: CRUD đầy đủ", description: "Tạo CRUD cho playbook entries: create, edit, delete. Thêm search + filter theo stage/type.", relatedPages: ["SalesPlaybookPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "playbook"] },
      { id: "F1-16", title: "Sales Playbook: Detail page", description: "Tạo trang chi tiết playbook với steps, templates, best practices.", relatedPages: ["SalesPlaybookPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["detail", "playbook"] },

      // Account Planning
      { id: "F1-17", title: "Account Planning: CRUD đầy đủ", description: "Tạo CRUD cho account plans: whitespace analysis, relationship map, action items.", relatedPages: ["AccountPlanningPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "account-planning"] },

      // Báo giá & Hợp đồng
      { id: "F1-18", title: "Quotation: Pagination + Delete", description: "Thêm pagination danh sách báo giá + delete quotation.", relatedPages: ["QuotationBuilderPage.tsx"], priority: "high", size: "M", status: "pending", tags: ["pagination", "quotation"] },
      { id: "F1-19", title: "Quotation: Column visibility", description: "Thêm column vis cho bảng danh sách báo giá.", relatedPages: ["QuotationBuilderPage.tsx"], priority: "medium", size: "S", status: "pending", tags: ["column", "quotation"] },
      { id: "F1-20", title: "CPQ: CRUD cấu hình sản phẩm", description: "Tạo CRUD cho product bundles, pricing rules, discount policies.", relatedPages: ["CpqPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "cpq"] },
      { id: "F1-21", title: "Contracts: Pagination + Inline edit", description: "Thêm pagination + inline edit status/dates + detail page route.", relatedPages: ["ContractManagementPage.tsx"], priority: "high", size: "L", status: "pending", tags: ["pagination", "inline-edit", "contracts"] },
      { id: "F1-22", title: "Contracts: Detail page", description: "Tạo route /crm/contracts/:id với tabs: Overview, Amendments, History, Documents.", relatedPages: ["ContractManagementPage.tsx"], priority: "high", size: "XL", status: "pending", tags: ["detail", "contracts"] },
      { id: "F1-23", title: "Subscriptions: CRUD đầy đủ", description: "Thêm create/update/delete subscription + pagination + inline edit.", relatedPages: ["SubscriptionManagementPage.tsx"], priority: "high", size: "L", status: "pending", tags: ["crud", "subscriptions"] },

      // Doanh thu
      { id: "F1-24", title: "Forecast: Bộ lọc thời gian", description: "Thêm filter by quarter, year, team, product line. Drill-down charts.", relatedPages: ["ForecastPage.tsx"], priority: "high", size: "M", status: "pending", tags: ["filter", "forecast"] },
      { id: "F1-25", title: "Commissions: CRUD + Pagination", description: "Thêm CRUD commission rules + pagination bảng tính hoa hồng.", relatedPages: ["CommissionCalculatorPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "commissions"] },
      { id: "F1-26", title: "Revenue Intelligence: Filter nâng cao", description: "Thêm filter by period, segment, product. Interactive charts.", relatedPages: ["RevenueIntelligencePage.tsx"], priority: "medium", size: "M", status: "pending", tags: ["filter", "revenue"] },
      { id: "F1-27", title: "Quota Management: CRUD đầy đủ", description: "Tạo CRUD quotas: assign, edit, track progress. Pagination + inline edit.", relatedPages: ["QuotaManagementPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "quotas"] },

      // Đối thủ & Lãnh thổ
      { id: "F1-28", title: "Competitors: CRUD + Pagination + Detail", description: "Thêm CRUD đầy đủ + pagination + trang chi tiết đối thủ.", relatedPages: ["CompetitorAnalysisPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "competitors"] },
      { id: "F1-29", title: "Territories: Inline edit + Pagination", description: "Thêm inline edit territory assignments + pagination.", relatedPages: ["TerritoryManagementPage.tsx"], priority: "medium", size: "M", status: "pending", tags: ["inline-edit", "territories"] },

      // Đối tác
      { id: "F1-30", title: "Partners: CRUD + Detail page", description: "Thêm CRUD đầy đủ + trang chi tiết partner profile.", relatedPages: ["PartnerPortalPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "partners"] },
      { id: "F1-31", title: "Partner Marketplace: CRUD + Pagination", description: "Thêm create listing + pagination + filter nâng cao.", relatedPages: ["PartnerMarketplacePage.tsx"], priority: "low", size: "M", status: "pending", tags: ["crud", "marketplace"] },
    ],
  },

  /* ────────────────────────────────────────────
   * PHASE F2: MARKETING — Nâng cấp
   * ──────────────────────────────────────────── */
  {
    id: "F2", title: "Marketing — Nâng cấp đầy đủ tính năng", group: "Marketing",
    description: "Nâng cấp 12 trang Marketing: CRUD campaigns, pagination, detail pages, view toggles.",
    steps: [
      { id: "F2-01", title: "Campaigns: Pagination + View toggle", description: "Thêm pagination + toggle Table/Card cho danh sách chiến dịch.", relatedPages: ["MarketingCampaignPage.tsx"], priority: "high", size: "L", status: "pending", tags: ["pagination", "view-toggle", "campaigns"] },
      { id: "F2-02", title: "Campaigns: CRUD đầy đủ + Detail page", description: "Hoàn thiện CRUD + tạo route /crm/marketing/:id với tabs: Overview, Analytics, Audience.", relatedPages: ["MarketingCampaignPage.tsx"], priority: "high", size: "XL", status: "pending", tags: ["crud", "detail", "campaigns"] },
      { id: "F2-03", title: "SMS Campaigns: CRUD + Pagination", description: "CRUD đầy đủ + pagination + inline edit status.", relatedPages: ["SmsCampaignPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "sms"] },
      { id: "F2-04", title: "Campaign ROI: Filter nâng cao", description: "Thêm date range, channel, campaign type filters. Comparison mode.", relatedPages: ["CampaignRoiPage.tsx"], priority: "medium", size: "M", status: "pending", tags: ["filter", "roi"] },
      { id: "F2-05", title: "A/B Testing: CRUD experiments", description: "Tạo CRUD cho experiments: variants, metrics, auto-winner. Pagination.", relatedPages: ["ABTestingPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "ab-testing"] },
      { id: "F2-06", title: "Email Sequences: CRUD + Pagination", description: "Hoàn thiện CRUD sequences + pagination list.", relatedPages: ["EmailSequenceBuilderPage.tsx"], priority: "high", size: "M", status: "pending", tags: ["crud", "email"] },
      { id: "F2-07", title: "Email Templates: Pagination + Delete", description: "Thêm pagination + delete template.", relatedPages: ["EmailTemplatesPage.tsx"], priority: "high", size: "S", status: "pending", tags: ["pagination", "email"] },
      { id: "F2-08", title: "Content Calendar: CRUD events", description: "Thêm CRUD cho calendar events + drag to reschedule.", relatedPages: ["ContentCalendarPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "content"] },
      { id: "F2-09", title: "Form Builder: CRUD forms + Pagination", description: "CRUD danh sách forms + pagination + form analytics.", relatedPages: ["FormBuilderPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "forms"] },
      { id: "F2-10", title: "Landing Pages: CRUD + Pagination", description: "CRUD landing pages + pagination + preview mode.", relatedPages: ["LandingPageBuilderPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "landing"] },
      { id: "F2-11", title: "Referral Program: CRUD + Analytics", description: "CRUD referral links/rules + tracking + pagination.", relatedPages: ["ReferralProgramPage.tsx"], priority: "low", size: "L", status: "pending", tags: ["crud", "referral"] },
      { id: "F2-12", title: "Event Manager: CRUD + Detail + Pagination", description: "CRUD events + trang chi tiết event + registrations pagination.", relatedPages: ["EventManagerPage.tsx"], priority: "medium", size: "XL", status: "pending", tags: ["crud", "events"] },
    ],
  },

  /* ────────────────────────────────────────────
   * PHASE F3: KHÁCH HÀNG — Nâng cấp
   * ──────────────────────────────────────────── */
  {
    id: "F3", title: "Khách hàng — Nâng cấp đầy đủ tính năng", group: "Khách hàng",
    description: "Nâng cấp 15 trang Khách hàng: tickets CRUD, SLA tracking, knowledge base, feedback.",
    steps: [
      { id: "F3-01", title: "Journey: CRUD journey maps", description: "Thêm CRUD journey stages + touchpoints. Inline edit.", relatedPages: ["CustomerJourneyPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "journey"] },
      { id: "F3-02", title: "Customer Health: Pagination + Filter", description: "Thêm pagination danh sách KH + filter by health score range.", relatedPages: ["CustomerHealthPage.tsx"], priority: "high", size: "M", status: "pending", tags: ["pagination", "health"] },
      { id: "F3-03", title: "Segmentation: CRUD segments + Rules", description: "CRUD segment rules + preview segment members + pagination.", relatedPages: ["CustomerSegmentationPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "segment"] },
      { id: "F3-04", title: "Tickets: Pagination + Column vis", description: "Thêm pagination + column visibility cho ticket list.", relatedPages: ["TicketSupportPage.tsx"], priority: "critical", size: "M", status: "done", tags: ["pagination", "column", "tickets"] },
      { id: "F3-05", title: "Tickets: Inline edit + Delete", description: "Inline edit priority, status, assignee. Delete ticket.", relatedPages: ["TicketSupportPage.tsx"], priority: "high", size: "L", status: "done", tags: ["inline-edit", "delete", "tickets"] },
      { id: "F3-06", title: "Tickets: Detail page route", description: "Tạo route /crm/tickets/:id với conversation thread, attachments, SLA info.", relatedPages: ["TicketSupportPage.tsx"], priority: "high", size: "XL", status: "pending", tags: ["detail", "tickets"] },
      { id: "F3-07", title: "Tickets: View toggle Table/Card", description: "Toggle giữa table view và card list view.", relatedPages: ["TicketSupportPage.tsx"], priority: "medium", size: "M", status: "done", tags: ["view-toggle", "tickets"] },
      { id: "F3-08", title: "Tickets: Centralize types + API", description: "Di chuyển ticket types → types/crm.ts, API → crmApi.ts.", relatedPages: ["TicketSupportPage.tsx"], priority: "high", size: "M", status: "done", tags: ["refactor", "tickets"] },
      { id: "F3-09", title: "Knowledge Base: Pagination + Delete", description: "Thêm pagination articles + delete article + categories CRUD.", relatedPages: ["KnowledgeBasePage.tsx"], priority: "high", size: "M", status: "pending", tags: ["pagination", "kb"] },
      { id: "F3-10", title: "Knowledge Base: Detail page", description: "Tạo route /crm/knowledge-base/:id với WYSIWYG editor, version history.", relatedPages: ["KnowledgeBasePage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["detail", "kb"] },
      { id: "F3-11", title: "Onboarding: CRUD workflow steps", description: "CRUD onboarding templates + step management + checklist tracking.", relatedPages: ["OnboardingWorkflowPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "onboarding"] },
      { id: "F3-12", title: "NPS: Response pagination + Filter", description: "Pagination cho response list + filter by score range, date.", relatedPages: ["NPSTrackerPage.tsx"], priority: "medium", size: "M", status: "pending", tags: ["pagination", "nps"] },
      { id: "F3-13", title: "Surveys: CRUD + Responses view", description: "CRUD surveys + response collection + analytics + pagination.", relatedPages: ["SurveyBuilderPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "surveys"] },
      { id: "F3-14", title: "SLA: CRUD rules + Pagination", description: "CRUD SLA policies + escalation rules + tracking pagination.", relatedPages: ["SLATrackingPage.tsx"], priority: "high", size: "L", status: "pending", tags: ["crud", "sla"] },
      { id: "F3-15", title: "Renewals: CRUD + View toggle", description: "CRUD renewals + toggle Kanban/Table + pagination.", relatedPages: ["RenewalPipelinePage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "renewals"] },
      { id: "F3-16", title: "Feedback Wall: CRUD + Pagination + Voting", description: "CRUD feedback items + upvote/downvote + pagination + filter.", relatedPages: ["FeedbackWallPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "feedback"] },
    ],
  },

  /* ────────────────────────────────────────────
   * PHASE F4: AI & TỰ ĐỘNG — Nâng cấp
   * ──────────────────────────────────────────── */
  {
    id: "F4", title: "AI & Tự động — Nâng cấp đầy đủ tính năng", group: "AI & Tự động",
    description: "Nâng cấp 9 trang AI & Automation: training data CRUD, automation rules pagination.",
    steps: [
      { id: "F4-01", title: "AI Insights: Filter nâng cao", description: "Thêm filter by type (revenue, churn, upsell), time range, confidence.", relatedPages: ["AIInsightsPage.tsx"], priority: "high", size: "M", status: "pending", tags: ["filter", "ai"] },
      { id: "F4-02", title: "Predictive Analytics: Filter + Export", description: "Thêm model selection, date range, export predictions.", relatedPages: ["PredictiveAnalyticsPage.tsx"], priority: "medium", size: "M", status: "pending", tags: ["filter", "predictive"] },
      { id: "F4-03", title: "Data Enrichment: CRUD + Queue pagination", description: "CRUD enrichment rules + pagination cho enrichment queue.", relatedPages: ["DataEnrichmentPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "enrichment"] },
      { id: "F4-04", title: "Meeting Intelligence: CRUD + Pagination", description: "CRUD meeting records + transcripts pagination + search.", relatedPages: ["MeetingIntelligencePage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "meetings"] },
      { id: "F4-05", title: "AI Training: CRUD training datasets", description: "CRUD training data + upload + labeling + pagination.", relatedPages: ["AiTrainingDashboardPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "training"] },
      { id: "F4-06", title: "Chatbot Training: CRUD intents + QA pairs", description: "CRUD intent/entity definitions + Q&A pairs + pagination.", relatedPages: ["AiChatbotTrainingPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "chatbot"] },
      { id: "F4-07", title: "Automations: Pagination + Inline edit", description: "Thêm pagination rules + inline toggle active/inactive.", relatedPages: ["AutomationRulesPage.tsx"], priority: "high", size: "M", status: "pending", tags: ["pagination", "automations"] },
      { id: "F4-08", title: "Automations: Centralize types + API", description: "Di chuyển automation types → types/, API → crmApi.ts.", relatedPages: ["AutomationRulesPage.tsx"], priority: "medium", size: "M", status: "pending", tags: ["refactor", "automations"] },
    ],
  },

  /* ────────────────────────────────────────────
   * PHASE F5: VẬN HÀNH — Nâng cấp
   * ──────────────────────────────────────────── */
  {
    id: "F5", title: "Vận hành — Nâng cấp đầy đủ tính năng", group: "Vận hành",
    description: "Nâng cấp 15 trang Vận hành: team CRUD, task pagination, product catalog, inventory.",
    steps: [
      { id: "F5-01", title: "Team: CRUD nhân viên", description: "Thêm create/update employee form + delete + pagination.", relatedPages: ["TeamPage.tsx"], priority: "high", size: "L", status: "done", tags: ["crud", "team"] },
      { id: "F5-02", title: "Team: View toggle Table/Card", description: "Toggle giữa card view (hiện tại) và table view.", relatedPages: ["TeamPage.tsx"], priority: "high", size: "M", status: "done", tags: ["view-toggle", "team"] },
      { id: "F5-03", title: "Team: Column visibility + Sort", description: "Thêm column visibility + sort cho table view.", relatedPages: ["TeamPage.tsx"], priority: "medium", size: "M", status: "done", tags: ["column", "sort", "team"] },
      { id: "F5-04", title: "Activities: Pagination + Inline edit", description: "Thêm pagination + inline edit type/status + delete.", relatedPages: ["ActivitiesPage.tsx"], priority: "high", size: "M", status: "pending", tags: ["pagination", "activities"] },
      { id: "F5-05", title: "Activities: View toggle Table/Timeline", description: "Toggle giữa table view và timeline view.", relatedPages: ["ActivitiesPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["view-toggle", "activities"] },
      { id: "F5-06", title: "Calendar: Search + Filter", description: "Thêm search events + filter by type/assignee.", relatedPages: ["CalendarPage.tsx"], priority: "medium", size: "M", status: "pending", tags: ["filter", "calendar"] },
      { id: "F5-07", title: "Task Board: View toggle Kanban/Table", description: "Thêm table view với pagination + column vis bên cạnh Kanban.", relatedPages: ["TaskBoardPage.tsx"], priority: "high", size: "XL", status: "pending", tags: ["view-toggle", "tasks"] },
      { id: "F5-08", title: "Approvals: CRUD + Pagination", description: "CRUD approval requests + pagination + inline approve/reject.", relatedPages: ["ApprovalWorkflowPage.tsx"], priority: "high", size: "L", status: "pending", tags: ["crud", "approvals"] },
      { id: "F5-09", title: "Goals/OKR: CRUD + Pagination + Inline", description: "CRUD goals + progress inline update + pagination.", relatedPages: ["GoalTrackingPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "goals"] },
      { id: "F5-10", title: "Products: Pagination + Delete + View toggle", description: "Thêm pagination + delete + table/card toggle.", relatedPages: ["ProductCatalogPage.tsx"], priority: "high", size: "L", status: "done", tags: ["pagination", "view-toggle", "products"] },
      { id: "F5-11", title: "Products: Detail page", description: "Tạo route /crm/products/:id với tabs: Info, Pricing, Stock, History.", relatedPages: ["ProductCatalogPage.tsx"], priority: "medium", size: "XL", status: "pending", tags: ["detail", "products"] },
      { id: "F5-12", title: "Inventory: CRUD + Pagination + Inline", description: "CRUD inventory items + stock adjustments + pagination + inline edit quantity.", relatedPages: ["InventoryManagementPage.tsx"], priority: "high", size: "L", status: "pending", tags: ["crud", "inventory"] },
      { id: "F5-13", title: "Vendors: CRUD + Detail + Pagination", description: "CRUD đầy đủ + detail page /crm/vendors/:id + pagination.", relatedPages: ["VendorManagementPage.tsx"], priority: "high", size: "XL", status: "pending", tags: ["crud", "detail", "vendors"] },
      { id: "F5-14", title: "Documents: CRUD + Pagination + View toggle", description: "CRUD documents + pagination + table/grid toggle + download.", relatedPages: ["DocumentManagementPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "documents"] },
      { id: "F5-15", title: "Capacity: Filter nâng cao", description: "Thêm filter by team, skill, period cho capacity planner.", relatedPages: ["TeamCapacityPage.tsx"], priority: "low", size: "M", status: "pending", tags: ["filter", "capacity"] },
    ],
  },

  /* ────────────────────────────────────────────
   * PHASE F6: QUẢN TRỊ — Nâng cấp
   * ──────────────────────────────────────────── */
  {
    id: "F6", title: "Quản trị — Nâng cấp đầy đủ tính năng", group: "Quản trị",
    description: "Nâng cấp 17 trang Quản trị: RBAC pagination, audit log pagination + export, webhook CRUD.",
    steps: [
      { id: "F6-01", title: "Custom Fields: Pagination", description: "Thêm pagination cho danh sách custom fields.", relatedPages: ["CustomFieldsPage.tsx"], priority: "high", size: "S", status: "pending", tags: ["pagination", "fields"] },
      { id: "F6-02", title: "RBAC: Pagination + Delete role", description: "Thêm pagination roles + delete role (có kiểm tra dependencies).", relatedPages: ["RBACPage.tsx"], priority: "high", size: "M", status: "pending", tags: ["pagination", "rbac"] },
      { id: "F6-03", title: "Webhooks: Pagination + Inline edit", description: "Thêm pagination + inline toggle active/inactive + delete.", relatedPages: ["WebhookManagerPage.tsx"], priority: "medium", size: "M", status: "pending", tags: ["pagination", "webhooks"] },
      { id: "F6-04", title: "Integrations: CRUD + Pagination", description: "CRUD integration configs + pagination + filter by status.", relatedPages: ["IntegrationHubPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "integrations"] },
      { id: "F6-05", title: "Audit Trail: Pagination + Export", description: "Thêm pagination + export CSV + date range filter.", relatedPages: ["AuditTrailPage.tsx"], priority: "critical", size: "M", status: "pending", tags: ["pagination", "export", "audit"] },
      { id: "F6-06", title: "Audit Log: Pagination + Column vis", description: "Thêm pagination + column visibility + advanced filter.", relatedPages: ["AuditLogPage.tsx"], priority: "critical", size: "M", status: "pending", tags: ["pagination", "column", "audit"] },
      { id: "F6-07", title: "Reports: CRUD + Pagination + Detail", description: "CRUD report definitions + saved reports + pagination + detail view.", relatedPages: ["ReportsPage.tsx"], priority: "high", size: "XL", status: "pending", tags: ["crud", "reports"] },
      { id: "F6-08", title: "Data Center: Pagination import history", description: "Thêm pagination cho import/export history.", relatedPages: ["DataImportExportPage.tsx"], priority: "medium", size: "S", status: "pending", tags: ["pagination", "data"] },
      { id: "F6-09", title: "Compliance: Checklist CRUD", description: "CRUD compliance items + progress tracking + evidence upload.", relatedPages: ["ComplianceDashboardPage.tsx"], priority: "medium", size: "L", status: "pending", tags: ["crud", "compliance"] },
    ],
  },

  /* ────────────────────────────────────────────
   * PHASE F7: TỔNG QUAN — Dashboard nâng cao
   * ──────────────────────────────────────────── */
  {
    id: "F7", title: "Tổng quan — Dashboard nâng cao", group: "Tổng quan",
    description: "Nâng cấp 2 trang Dashboard: filter thời gian, widget config, drill-down.",
    steps: [
      { id: "F7-01", title: "Dashboard: Date range filter", description: "Thêm date range picker (Hôm nay, 7 ngày, 30 ngày, Quý, Custom) cho tất cả stat cards.", relatedPages: ["CrmDashboardPage.tsx"], priority: "critical", size: "L", status: "pending", tags: ["filter", "dashboard"] },
      { id: "F7-02", title: "Dashboard: Widget drill-down", description: "Click vào stat card → navigate tới trang chi tiết tương ứng với filter applied.", relatedPages: ["CrmDashboardPage.tsx"], priority: "high", size: "M", status: "pending", tags: ["navigation", "dashboard"] },
      { id: "F7-03", title: "Dashboard: Real-time refresh", description: "Thêm auto-refresh interval (30s/1m/5m) + manual refresh button.", relatedPages: ["CrmDashboardPage.tsx"], priority: "medium", size: "M", status: "pending", tags: ["refresh", "dashboard"] },
      { id: "F7-04", title: "Custom Dashboard: Save/Load layouts", description: "Persist widget layout vào localStorage/API. Support multiple saved layouts.", relatedPages: ["CustomDashboardPage.tsx"], priority: "high", size: "L", status: "pending", tags: ["persistence", "dashboard"] },
      { id: "F7-05", title: "Custom Dashboard: More widget types", description: "Thêm widget types: table, list, funnel, gauge, metric card.", relatedPages: ["CustomDashboardPage.tsx"], priority: "medium", size: "XL", status: "pending", tags: ["widgets", "dashboard"] },
    ],
  },

  /* ────────────────────────────────────────────
   * PHASE F8: Cross-cutting Concerns
   * ──────────────────────────────────────────── */
  {
    id: "F8", title: "Cross-cutting — Tính năng cắt ngang", group: "Foundation",
    description: "Các tính năng áp dụng cho toàn bộ hệ thống.",
    steps: [
      { id: "F8-01", title: "Mobile responsive audit toàn bộ", description: "Rà soát + fix responsive cho tất cả 96 trang. Priority: CRUD pages + Dashboard.", relatedPages: ["Tất cả"], priority: "high", size: "XL", status: "pending", tags: ["responsive", "mobile"] },
      { id: "F8-02", title: "Keyboard navigation cho DataTable", description: "Arrow keys navigate rows, Enter để mở detail, Escape để hủy edit.", relatedPages: ["DataTable"], priority: "medium", size: "L", status: "pending", tags: ["a11y", "keyboard"] },
      { id: "F8-03", title: "Toast notifications chuẩn hóa", description: "Tạo toast helper: success/error/warning messages chuẩn cho CRUD operations.", relatedPages: ["Tất cả"], priority: "medium", size: "S", status: "pending", tags: ["ux", "toast"] },
      { id: "F8-04", title: "Loading skeleton chuẩn hóa", description: "Tạo skeleton loader cho DataTable, Cards, Detail pages. Dùng shadcn Skeleton.", relatedPages: ["Tất cả"], priority: "medium", size: "M", status: "pending", tags: ["ux", "loading"] },
      { id: "F8-05", title: "URL state sync cho filters", description: "Đồng bộ filter state với URL query params. Back/Forward giữ filter.", relatedPages: ["Tất cả trang CRUD"], priority: "high", size: "L", status: "pending", tags: ["ux", "url"] },
      { id: "F8-06", title: "Breadcrumb tự động", description: "Tạo breadcrumb component tự sinh từ route hierarchy.", relatedPages: ["Layout.tsx"], priority: "medium", size: "M", status: "pending", tags: ["navigation", "breadcrumb"] },
      { id: "F8-07", title: "Error boundary cho từng page", description: "Wrap mỗi page trong ErrorBoundary với fallback UI thân thiện.", relatedPages: ["routes.ts"], priority: "medium", size: "M", status: "pending", tags: ["error", "ux"] },
      { id: "F8-08", title: "Centralize tất cả inline types", description: "Di chuyển tất cả types định nghĩa inline trong pages → types/ folder. Ước tính ~60 trang cần xử lý.", relatedPages: ["Tất cả"], priority: "high", size: "XL", status: "in-progress", tags: ["refactor", "types"] },
      { id: "F8-09", title: "Centralize tất cả inline mock data", description: "Di chuyển mock data inline → data/ folder. Tạo data files cho từng module.", relatedPages: ["Tất cả"], priority: "high", size: "XL", status: "in-progress", tags: ["refactor", "data"] },
      { id: "F8-10", title: "Centralize tất cả inline API", description: "Tạo API functions trong api/ cho tất cả entities. Dùng apiFactory pattern.", relatedPages: ["Tất cả"], priority: "high", size: "XL", status: "in-progress", tags: ["refactor", "api"] },
      { id: "F8-11", title: "Print / PDF export cho reports", description: "Thêm nút Print/PDF cho các trang báo cáo, hóa đơn, hợp đồng.", relatedPages: ["Reports, Quotations, Contracts"], priority: "low", size: "L", status: "pending", tags: ["export", "print"] },
      { id: "F8-12", title: "Batch operations framework", description: "Tạo framework cho batch operations: chọn nhiều → thực hiện hàng loạt.", relatedPages: ["Tất cả trang CRUD"], priority: "medium", size: "L", status: "pending", tags: ["batch", "crud"] },
    ],
  },
];

/* ============================================================
 * Helper: Tính toán stats
 * ============================================================ */
export function calcPlanStats() {
  const allSteps = devPhases.flatMap((p) => p.steps);
  const total = allSteps.length;
  const done = allSteps.filter((s) => s.status === "done").length;
  const inProgress = allSteps.filter((s) => s.status === "in-progress").length;
  const pending = allSteps.filter((s) => s.status === "pending").length;

  const byCriticality = {
    critical: allSteps.filter((s) => s.priority === "critical").length,
    high: allSteps.filter((s) => s.priority === "high").length,
    medium: allSteps.filter((s) => s.priority === "medium").length,
    low: allSteps.filter((s) => s.priority === "low").length,
  };

  const bySize: Record<string, number> = {};
  for (const s of allSteps) bySize[s.size] = (bySize[s.size] || 0) + 1;

  const byTag: Record<string, number> = {};
  for (const s of allSteps) for (const t of s.tags) byTag[t] = (byTag[t] || 0) + 1;

  const auditStats = {
    totalPages: pageAudits.length,
    withPagination: pageAudits.filter((p) => p.features.pagination === "done").length,
    withColumnVis: pageAudits.filter((p) => p.features.columnVisibility === "done").length,
    withViewToggle: pageAudits.filter((p) => p.features.viewToggle === "done").length,
    withInlineEdit: pageAudits.filter((p) => p.features.inlineEdit === "done").length,
    withDetailPage: pageAudits.filter((p) => p.features.detailPage === "done").length,
    withFullCrud: pageAudits.filter((p) =>
      p.features.create === "done" && p.features.update === "done" && p.features.delete === "done"
    ).length,
    withCentralizedType: pageAudits.filter((p) => p.features.centralizedType === "done").length,
    withCentralizedApi: pageAudits.filter((p) => p.features.centralizedApi === "done").length,
  };

  return { total, done, inProgress, pending, byCriticality, bySize, byTag, auditStats };
}
