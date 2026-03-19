import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { GlobalSearch } from "./crm/GlobalSearch";
import { NotificationCenter } from "./crm/NotificationCenter";
import { AIChatWidget } from "./crm/AIChatWidget";
import { ChevronRight } from "lucide-react";

/** Map đường dẫn → tên hiển thị breadcrumb */
const ROUTE_LABELS: Record<string, string> = {
  "": "Tổng quan kiến trúc",
  "detailed-plan": "Kế hoạch chi tiết",
  modules: "Hệ thống Module",
  "ai-agents": "AI Agent & Tự động hóa",
  evaluation: "Đánh giá nhân viên",
  "ai-tools": "Công cụ AI",
  organization: "Tổ chức nhân sự",
  "data-architecture": "Kiến trúc dữ liệu",
  security: "Bảo mật & Tuân thủ",
  roadmap: "Lộ trình triển khai",
  crm: "CRM Dashboard",
  "crm/contacts": "Liên hệ",
  "crm/pipeline": "Sales Pipeline",
  "crm/team": "Nhân sự",
  "crm/activities": "Hoạt động",
  "crm/settings": "Cấu hình",
  "crm/deals": "Chi tiết Deal",
  "crm/reports": "Báo cáo",
  "crm/email-templates": "Email Templates",
  "crm/leads": "Lead Inbox",
  "crm/calendar": "Lịch hẹn",
  "crm/automations": "Tự động hóa",
  "crm/journey": "Customer Journey",
  "crm/integrations": "Tích hợp",
  "crm/ai-insights": "AI Insights",
  "crm/tasks": "Bảng Công việc",
  "crm/products": "Sản phẩm & Dịch vụ",
  "crm/knowledge-base": "Knowledge Base",
  "crm/quotations": "Báo giá",
  "crm/sla": "SLA Tracking",
  "crm/leaderboard": "Bảng xếp hạng",
  "crm/contracts": "Hợp đồng",
  "crm/commissions": "Hoa hồng Sales",
  "crm/nps": "NPS & Phản hồi",
  "crm/forecast": "Dự báo Doanh thu",
  "crm/competitors": "Phân tích Đối thủ",
  "crm/custom-dashboard": "Dashboard Tuỳ chỉnh",
  "crm/marketing": "Chiến dịch Marketing",
  "crm/vendors": "Nhà cung cấp",
  "crm/tickets": "Hỗ trợ Khách hàng",
  "crm/approvals": "Phê duyệt",
  "crm/customer-health": "Sức khỏe Khách hàng",
  "crm/data-center": "Nhập / Xuất Dữ liệu",
  "crm/attribution": "Phân bổ Doanh thu",
  "crm/audit-log": "Nhật ký Kiểm toán",
  "crm/goals": "Mục tiêu & OKR",
  "crm/territories": "Vùng lãnh thổ",
  "crm/documents": "Quản lý Tài liệu",
  "crm/subscriptions": "Quản lý Subscription",
  "crm/partners": "Cổng Đối tác",
  "crm/gamification": "Game hoá Sales",
  "crm/meetings": "Meeting Intelligence",
  "crm/workflow-builder": "Workflow Builder",
  "crm/rbac": "Phân quyền (RBAC)",
  "crm/custom-fields": "Trường Tuỳ chỉnh",
  "crm/notifications": "Cài đặt Thông báo",
  "crm/api-explorer": "API Explorer",
  "crm/webhooks": "Webhook Manager",
  "crm/import-wizard": "Import Wizard",
  "crm/profile": "Hồ sơ & API Keys",
  "crm/email-sequences": "Email Sequences",
  "crm/audit-trail": "Audit Trail",
  "crm/sms-campaigns": "SMS Campaigns",
  "crm/chatbot-training": "AI Chatbot Training",
  "crm/form-builder": "Form Builder",
  "crm/landing-pages": "Landing Pages",
  "crm/customer-portal": "Customer Portal",
  "crm/social-monitor": "Social Media Monitor",
  "crm/voip-dialer": "VoIP Dialer",
  "crm/surveys": "Survey Builder",
  "crm/data-enrichment": "Data Enrichment",
  "crm/predictive-analytics": "Predictive Analytics",
  "crm/referral-program": "Referral Program",
  "crm/live-chat-config": "Live Chat Config",
  "crm/ab-testing": "A/B Testing",
  "crm/segmentation": "Customer Segmentation",
  "crm/dependency-graph": "Dependency Graph",
  "crm/revenue-intelligence": "Revenue Intelligence",
  "crm/content-calendar": "Content Calendar",
  "crm/marketplace": "Partner Marketplace",
  "crm/inventory": "Inventory Management",
  "crm/feedback-wall": "Feedback Wall",
  "crm/ai-training": "AI Training Dashboard",
  "crm/multi-currency": "Multi-Currency Manager",
  "crm/compliance": "Compliance Dashboard",
  "crm/dev-portal": "Developer Portal",
  "crm/team-capacity": "Team Capacity Planner",
  "crm/onboarding": "Onboarding Workflow",
  "crm/trust-center": "Trust Center",
  "crm/revenue-leakage": "Revenue Leakage Detector",
  "crm/renewals": "Renewal Pipeline",
  "crm/ai-copilot": "AI Copilot Settings",
  "crm/cpq": "CPQ — Configure, Price, Quote",
  "crm/customer-360": "Customer 360°",
  "crm/campaign-roi": "Campaign ROI Analyzer",
  "crm/win-loss": "Win/Loss Analysis",
  "crm/quotas": "Quota Management",
  "crm/partner-scorecard": "Partner Scorecard",
  "crm/deal-room": "Deal Room",
  "crm/revenue-waterfall": "Revenue Waterfall",
  "crm/churn-prediction": "Churn Prediction",
  "crm/sales-playbook": "Sales Playbook Library",
  "crm/account-planning": "Account Planning",
  "crm/event-manager": "Event & Webinar Manager",
};

function Breadcrumb() {
  const location = useLocation();
  const path = location.pathname.replace(/^\//, "");
  const isCrm = path.startsWith("crm");

  const parts: { label: string; isCurrent: boolean }[] = [];

  if (isCrm) {
    parts.push({ label: "CRM", isCurrent: path === "crm" });
    if (path !== "crm") {
      // Handle dynamic routes like crm/deals/:id, crm/contacts/:id, crm/team/:id
      const staticPath = path
        .replace(/^crm\/deals\/.*/, "crm/deals")
        .replace(/^crm\/contacts\/[^/]+$/, "crm/contacts")
        .replace(/^crm\/team\/[^/]+$/, "crm/team");
      const label = ROUTE_LABELS[path] ?? ROUTE_LABELS[staticPath] ?? path;
      parts.push({ label, isCurrent: true });
    }
  } else {
    parts.push({ label: "Bản thiết kế", isCurrent: !path });
    if (path) {
      const label = ROUTE_LABELS[path] ?? path;
      parts.push({ label, isCurrent: true });
    }
  }

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-400">
      {parts.map((p, i) => (
        <span key={p.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
          <span className={p.isCurrent ? "text-gray-700" : ""}>{p.label}</span>
        </span>
      ))}
    </nav>
  );
}

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-2.5 lg:px-6">
          <div className="max-w-[1400px] mx-auto flex items-center gap-4">
            {/* Breadcrumb — ẩn trên di động */}
            <div className="hidden sm:block flex-shrink-0">
              <Breadcrumb />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Global Search */}
            <GlobalSearch />

            {/* Notification Center */}
            <NotificationCenter />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-4 pt-4 lg:p-6 xl:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI Chatbot Widget — nổi toàn cục */}
      <AIChatWidget />
    </div>
  );
}