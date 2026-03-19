/**
 * Partner Marketplace — Chợ ứng dụng & Plugin
 * App discovery, installation, ratings, categories,
 * developer ecosystem, integration status.
 */
import { useState, useMemo } from "react";
import {
  Store,
  Search,
  Star,
  Download,
  CheckCircle2,
  ExternalLink,
  Filter,
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  Zap,
  Shield,
  Clock,
  Users,
  Plus,
  Heart,
  Eye,
  Code2,
  Globe,
  Puzzle,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type AppStatus = "installed" | "available" | "beta" | "coming-soon";
type AppCategory = "Tích hợp" | "Phân tích" | "Tự động hóa" | "Giao tiếp" | "Bảo mật" | "AI/ML" | "Tài chính" | "Marketing";

interface MarketplaceApp {
  id: string;
  name: string;
  vendor: string;
  description: string;
  longDescription: string;
  category: AppCategory;
  status: AppStatus;
  rating: number;
  reviews: number;
  installs: number;
  price: string;
  icon: string;
  iconColor: string;
  features: string[];
  tags: string[];
  verified: boolean;
  aiPowered: boolean;
  lastUpdated: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<AppStatus, { label: string; color: string; bg: string }> = {
  installed: { label: "Đã cài", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  available: { label: "Có sẵn", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  beta: { label: "Beta", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  "coming-soon": { label: "Sắp ra", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
};

const CATEGORY_COLORS: Record<AppCategory, string> = {
  "Tích hợp": "text-blue-600 bg-blue-50",
  "Phân tích": "text-emerald-600 bg-emerald-50",
  "Tự động hóa": "text-violet-600 bg-violet-50",
  "Giao tiếp": "text-cyan-600 bg-cyan-50",
  "Bảo mật": "text-red-600 bg-red-50",
  "AI/ML": "text-amber-600 bg-amber-50",
  "Tài chính": "text-green-600 bg-green-50",
  "Marketing": "text-pink-600 bg-pink-50",
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_APPS: MarketplaceApp[] = [
  {
    id: "app_001", name: "Slack Connector", vendor: "AI-CRM Team", description: "Đồng bộ thông báo CRM với Slack channels",
    longDescription: "Tích hợp 2 chiều: nhận thông báo deal, activity, mention trong Slack. Tạo deal/task từ Slack command.",
    category: "Giao tiếp", status: "installed", rating: 4.8, reviews: 234, installs: 1520,
    price: "Miễn phí", icon: "💬", iconColor: "bg-purple-100", features: ["Thông báo real-time", "Slash commands", "Channel mapping", "Thread sync"],
    tags: ["Communication", "Notification", "Popular"], verified: true, aiPowered: false, lastUpdated: "2026-02-28",
  },
  {
    id: "app_002", name: "Google Workspace", vendor: "AI-CRM Team", description: "Tích hợp Gmail, Calendar, Drive với CRM",
    longDescription: "Đồng bộ email, lịch hẹn, tài liệu. Auto-log email vào contact timeline. Calendar 2-way sync.",
    category: "Tích hợp", status: "installed", rating: 4.9, reviews: 412, installs: 2100,
    price: "Miễn phí", icon: "📧", iconColor: "bg-red-100", features: ["Email sync", "Calendar sync", "Drive integration", "Contact import"],
    tags: ["Email", "Calendar", "Essential"], verified: true, aiPowered: false, lastUpdated: "2026-03-01",
  },
  {
    id: "app_003", name: "AI Sales Copilot", vendor: "AI-CRM Labs", description: "Trợ lý AI cho sales — gợi ý hành động, draft email, phân tích deal",
    longDescription: "GPT-powered copilot hỗ trợ sales rep: gợi ý next best action, draft email cá nhân hóa, phân tích deal risk, coaching tips.",
    category: "AI/ML", status: "installed", rating: 4.7, reviews: 189, installs: 890,
    price: "299K/tháng", icon: "🤖", iconColor: "bg-violet-100", features: ["Next best action", "Email drafting", "Deal analysis", "Coaching"],
    tags: ["AI", "Sales", "Productivity", "Popular"], verified: true, aiPowered: true, lastUpdated: "2026-03-02",
  },
  {
    id: "app_004", name: "Stripe Payments", vendor: "Stripe Inc.", description: "Tích hợp thanh toán Stripe — subscription, invoice, refund",
    longDescription: "Quản lý subscription lifecycle, auto-create invoice, reconciliation, refund handling, revenue recognition.",
    category: "Tài chính", status: "available", rating: 4.6, reviews: 156, installs: 720,
    price: "Miễn phí", icon: "💳", iconColor: "bg-blue-100", features: ["Subscription mgmt", "Auto-invoice", "Refund handling", "Revenue reports"],
    tags: ["Payment", "Billing", "Essential"], verified: true, aiPowered: false, lastUpdated: "2026-02-20",
  },
  {
    id: "app_005", name: "Zapier Bridge", vendor: "Zapier", description: "Kết nối CRM với 5000+ ứng dụng qua Zapier",
    longDescription: "No-code automation: trigger bất kỳ action CRM nào và kết nối với 5000+ apps. Pre-built templates cho use cases phổ biến.",
    category: "Tự động hóa", status: "available", rating: 4.5, reviews: 98, installs: 450,
    price: "199K/tháng", icon: "⚡", iconColor: "bg-orange-100", features: ["5000+ apps", "Pre-built templates", "Custom triggers", "Multi-step zaps"],
    tags: ["Automation", "No-code", "Integration"], verified: true, aiPowered: false, lastUpdated: "2026-02-15",
  },
  {
    id: "app_006", name: "Advanced Analytics Pro", vendor: "DataViz Co.", description: "Dashboard & report nâng cao với custom visualization",
    longDescription: "Drag-and-drop dashboard builder, custom charts, scheduled reports, data blending từ nhiều nguồn, AI anomaly detection.",
    category: "Phân tích", status: "available", rating: 4.4, reviews: 76, installs: 320,
    price: "499K/tháng", icon: "📊", iconColor: "bg-emerald-100", features: ["Custom dashboards", "Scheduled reports", "Data blending", "AI anomaly"],
    tags: ["Analytics", "BI", "Visualization"], verified: true, aiPowered: true, lastUpdated: "2026-02-25",
  },
  {
    id: "app_007", name: "WhatsApp Business", vendor: "Meta Partners", description: "Giao tiếp khách hàng qua WhatsApp — template, chatbot, broadcast",
    longDescription: "WhatsApp Business API integration: template messages, chatbot routing, broadcast campaigns, analytics, rich media support.",
    category: "Giao tiếp", status: "beta", rating: 4.3, reviews: 42, installs: 180,
    price: "399K/tháng", icon: "📱", iconColor: "bg-green-100", features: ["Template messages", "Chatbot routing", "Broadcast", "Rich media"],
    tags: ["Messaging", "WhatsApp", "Beta"], verified: true, aiPowered: false, lastUpdated: "2026-03-01",
  },
  {
    id: "app_008", name: "SOC2 Compliance Kit", vendor: "SecureFlow", description: "Bộ công cụ tuân thủ SOC2 — audit checklist, evidence collection",
    longDescription: "Automated SOC2 compliance monitoring: continuous control testing, evidence collection, gap analysis, audit-ready reports.",
    category: "Bảo mật", status: "available", rating: 4.2, reviews: 31, installs: 85,
    price: "899K/tháng", icon: "🛡️", iconColor: "bg-red-100", features: ["Continuous monitoring", "Evidence collection", "Gap analysis", "Audit reports"],
    tags: ["Security", "Compliance", "SOC2"], verified: true, aiPowered: false, lastUpdated: "2026-02-10",
  },
  {
    id: "app_009", name: "AI Content Generator", vendor: "AI-CRM Labs", description: "Tạo nội dung marketing bằng AI — email, blog, social posts",
    longDescription: "GPT-powered content generator: tạo email campaigns, blog posts, social media content, landing page copy. Brand voice training.",
    category: "Marketing", status: "beta", rating: 4.1, reviews: 28, installs: 140,
    price: "399K/tháng", icon: "✍️", iconColor: "bg-pink-100", features: ["Email copy", "Blog generation", "Social posts", "Brand voice"],
    tags: ["AI", "Content", "Marketing", "Beta"], verified: true, aiPowered: true, lastUpdated: "2026-03-02",
  },
  {
    id: "app_010", name: "Revenue Forecasting AI", vendor: "PredictLabs", description: "Dự báo doanh thu bằng machine learning — accuracy 92%+",
    longDescription: "Ensemble ML models dự báo revenue theo deal stage, historical patterns, seasonality. Auto-recalibrate hàng tuần.",
    category: "AI/ML", status: "coming-soon", rating: 0, reviews: 0, installs: 0,
    price: "599K/tháng", icon: "🔮", iconColor: "bg-amber-100", features: ["ML forecasting", "Auto-recalibrate", "Scenario planning", "Accuracy tracking"],
    tags: ["AI", "Forecasting", "Revenue"], verified: false, aiPowered: true, lastUpdated: "2026-03-03",
  },
  {
    id: "app_011", name: "HubSpot Migrator", vendor: "MigrationPro", description: "Di chuyển dữ liệu từ HubSpot sang AI-CRM — zero downtime",
    longDescription: "Công cụ migration tự động: contacts, deals, emails, notes, custom fields, workflows. Validation & rollback support.",
    category: "Tích hợp", status: "available", rating: 4.0, reviews: 19, installs: 65,
    price: "Miễn phí", icon: "🔄", iconColor: "bg-orange-100", features: ["Auto-mapping", "Data validation", "Rollback support", "Custom fields"],
    tags: ["Migration", "HubSpot", "Data"], verified: true, aiPowered: false, lastUpdated: "2026-01-30",
  },
  {
    id: "app_012", name: "DocuSign E-Signature", vendor: "DocuSign", description: "Ký điện tử hợp đồng & báo giá trực tiếp từ CRM",
    longDescription: "Gửi hợp đồng, báo giá để ký điện tử. Auto-update deal stage khi ký xong. Template management, audit trail.",
    category: "Tích hợp", status: "available", rating: 4.7, reviews: 143, installs: 620,
    price: "349K/tháng", icon: "✒️", iconColor: "bg-blue-100", features: ["E-signature", "Template management", "Auto-stage update", "Audit trail"],
    tags: ["E-Sign", "Contract", "Popular"], verified: true, aiPowered: false, lastUpdated: "2026-02-18",
  },
];

/* ============================================================
 * Star Rating
 * ============================================================ */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
      ))}
      <span className="text-[9px] text-gray-500 ml-1">{rating > 0 ? rating.toFixed(1) : "—"}</span>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function PartnerMarketplacePage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<AppCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = MOCK_APPS;
    if (categoryFilter !== "all") result = result.filter((a) => a.category === categoryFilter);
    if (statusFilter !== "all") result = result.filter((a) => a.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) =>
        a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [search, categoryFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: MOCK_APPS.length,
    installed: MOCK_APPS.filter((a) => a.status === "installed").length,
    aiPowered: MOCK_APPS.filter((a) => a.aiPowered).length,
    totalInstalls: MOCK_APPS.reduce((s, a) => s + a.installs, 0),
  }), []);

  const categories = useMemo(() => {
    const cats = new Set(MOCK_APPS.map((a) => a.category));
    return Array.from(cats).sort();
  }, []);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Store className="w-6 h-6 text-teal-600" /> Partner Marketplace
        </h1>
        <p className="text-gray-500 mt-0.5">
          Khám phá & cài đặt ứng dụng, plugin, tích hợp — mở rộng khả năng CRM
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Ứng dụng</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.installed}</p>
          <p className="text-[9px] text-green-700">Đã cài đặt</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.aiPowered}</p>
          <p className="text-[9px] text-amber-700">AI-Powered</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalInstalls.toLocaleString("vi-VN")}</p>
          <p className="text-[9px] text-blue-700">Tổng lượt cài</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm ứng dụng, plugin..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as AppCategory | "all")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả danh mục</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as AppStatus | "all")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((app) => {
          const stCfg = STATUS_CFG[app.status];
          const isExpanded = expandedId === app.id;

          return (
            <div key={app.id} className={`bg-white rounded-xl border overflow-hidden transition-shadow hover:shadow-md ${
              app.status === "installed" ? "border-green-200" : "border-gray-100"
            }`}>
              {/* Card Header */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl ${app.iconColor} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {app.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm text-gray-900">{app.name}</span>
                      {app.verified && <Shield className="w-3 h-3 text-blue-500" />}
                      {app.aiPowered && <Sparkles className="w-3 h-3 text-amber-500" />}
                    </div>
                    <p className="text-[9px] text-gray-400">{app.vendor}</p>
                    <StarRating rating={app.rating} />
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 mt-2">{app.description}</p>

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className={`text-[7px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                  <span className={`text-[7px] px-1.5 py-0.5 rounded ${CATEGORY_COLORS[app.category]}`}>{app.category}</span>
                  <span className="text-[8px] text-gray-400 ml-auto">{app.price}</span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-[8px] text-gray-400">
                  <span>{app.installs.toLocaleString("vi-VN")} cài đặt</span>
                  <span>{app.reviews} đánh giá</span>
                </div>
              </div>

              {/* Expand/Actions */}
              <div className="px-4 pb-3 flex items-center gap-1">
                <button type="button" onClick={() => setExpandedId(isExpanded ? null : app.id)}
                  className="text-[9px] text-teal-600 hover:underline">
                  {isExpanded ? "Thu gọn" : "Chi tiết"}
                </button>
                <div className="ml-auto">
                  {app.status === "available" || app.status === "beta" ? (
                    <button type="button" onClick={() => toast.success(`Đã cài đặt ${app.name}`)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[9px] bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                      <Download className="w-3 h-3" /> Cài đặt
                    </button>
                  ) : app.status === "installed" ? (
                    <span className="flex items-center gap-1 text-[9px] text-green-600">
                      <CheckCircle2 className="w-3 h-3" /> Đã cài
                    </span>
                  ) : (
                    <span className="text-[9px] text-gray-400">Sắp ra mắt</span>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
                  <p className="text-[10px] text-gray-600">{app.longDescription}</p>
                  <div>
                    <p className="text-[9px] text-gray-400 mb-1">Tính năng:</p>
                    <div className="flex flex-wrap gap-1">
                      {app.features.map((f) => (
                        <span key={f} className="text-[8px] px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded border border-teal-200">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 mb-1">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {app.tags.map((t) => (
                        <span key={t} className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[8px] text-gray-400">Cập nhật: {app.lastUpdated}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Developer CTA */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200 p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
          <Code2 className="w-7 h-7 text-teal-700" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-sm text-teal-900">Bạn là nhà phát triển?</h3>
          <p className="text-[10px] text-teal-700 mt-0.5">
            Xây dựng app trên AI-CRM Platform — API, SDK, Webhook, OAuth2. Tiếp cận 2000+ doanh nghiệp đang dùng CRM.
          </p>
        </div>
        <button type="button" onClick={() => toast.success("Mở trang Developer Portal")}
          className="flex items-center gap-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 flex-shrink-0">
          <Globe className="w-4 h-4" /> Developer Portal
        </button>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <h4 className="text-sm text-teal-900">AI Marketplace Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-teal-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>AI Sales Copilot</strong> có ROI cao nhất: teams dùng tăng <strong>35% win rate</strong> và giảm <strong>20% sales cycle</strong>. Đề xuất deploy cho toàn bộ sales team.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Bạn đang dùng <strong>3/{stats.total} apps</strong>. Peer companies (cùng ngành, cùng size) trung bình dùng <strong>6-8 apps</strong>. Top suggestion: <strong>DocuSign + Zapier</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>Revenue Forecasting AI</strong> sắp ra mắt — accuracy 92%+ trên test data. AI đề xuất đăng ký early access vì pipeline prediction hiện tại có sai số <strong>±18%</strong>.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
