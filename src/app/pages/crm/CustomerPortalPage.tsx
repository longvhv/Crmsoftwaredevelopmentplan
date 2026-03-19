/**
 * Customer Portal (Self-Service)
 * Quản lý portal khách hàng: cấu hình, branding, modules enabled,
 * analytics, user activity, portal health.
 */
import { useState, useMemo } from "react";
import {
  Globe,
  Settings,
  Eye,
  Users,
  Ticket,
  FileText,
  CreditCard,
  BookOpen,
  MessageSquare,
  Shield,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Palette,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Search,
  Star,
  ThumbsUp,
  ThumbsDown,
  Zap,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
interface PortalModule {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  usageCount: number; // lượt sử dụng 30 ngày
}

interface PortalUser {
  id: string;
  name: string;
  email: string;
  company: string;
  lastLogin: string;
  ticketsCreated: number;
  articlesViewed: number;
  status: "active" | "inactive" | "pending";
}

interface PortalTicket {
  id: string;
  subject: string;
  customer: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "critical" | "high" | "medium" | "low";
  channel: "portal" | "email" | "chat" | "phone";
  createdAt: string;
  csatScore: number | null;
}

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_MODULES: PortalModule[] = [
  { id: "mod_tickets", name: "Tạo & Theo dõi Tickets", description: "Khách hàng tự tạo ticket, theo dõi trạng thái, comment, đánh giá", icon: Ticket, enabled: true, usageCount: 4560 },
  { id: "mod_kb", name: "Knowledge Base", description: "Tìm kiếm & xem bài viết hướng dẫn, FAQ, tutorial", icon: BookOpen, enabled: true, usageCount: 12300 },
  { id: "mod_billing", name: "Quản lý Thanh toán", description: "Xem hoá đơn, lịch sử thanh toán, đổi phương thức, nâng cấp gói", icon: CreditCard, enabled: true, usageCount: 2100 },
  { id: "mod_docs", name: "Tài liệu & Hợp đồng", description: "Xem/download hợp đồng, tài liệu kỹ thuật, SLA agreements", icon: FileText, enabled: true, usageCount: 890 },
  { id: "mod_community", name: "Diễn đàn Cộng đồng", description: "Đặt câu hỏi, thảo luận, chia sẻ kinh nghiệm với user khác", icon: MessageSquare, enabled: false, usageCount: 0 },
  { id: "mod_feedback", name: "Góp ý & Feature Request", description: "Đề xuất tính năng mới, vote cho ý tưởng, xem roadmap", icon: Star, enabled: true, usageCount: 567 },
  { id: "mod_security", name: "Bảo mật Tài khoản", description: "Đổi mật khẩu, 2FA, quản lý sessions, API keys", icon: Shield, enabled: true, usageCount: 340 },
  { id: "mod_analytics", name: "Usage Analytics", description: "Dashboard sử dụng: API calls, storage, active users, limits", icon: BarChart3, enabled: false, usageCount: 0 },
];

const MOCK_PORTAL_USERS: PortalUser[] = [
  { id: "pu_001", name: "Nguyễn Văn Hùng", email: "hung@techcorp.vn", company: "TechCorp Việt Nam", lastLogin: "2026-03-03T10:15:00Z", ticketsCreated: 12, articlesViewed: 45, status: "active" },
  { id: "pu_002", name: "Trần Thị Lan", email: "lan@greenlogistics.com", company: "Green Logistics", lastLogin: "2026-03-03T09:30:00Z", ticketsCreated: 8, articlesViewed: 23, status: "active" },
  { id: "pu_003", name: "Phạm Đức Minh", email: "minh@saigonfood.vn", company: "Saigon Food", lastLogin: "2026-03-02T16:00:00Z", ticketsCreated: 3, articlesViewed: 67, status: "active" },
  { id: "pu_004", name: "Lê Hoàng Anh", email: "anh@startupxyz.io", company: "Startup XYZ", lastLogin: "2026-02-28T11:00:00Z", ticketsCreated: 15, articlesViewed: 12, status: "active" },
  { id: "pu_005", name: "Vũ Thị Hương", email: "huong@bigretail.vn", company: "Big Retail Group", lastLogin: "2026-02-20T14:00:00Z", ticketsCreated: 2, articlesViewed: 5, status: "inactive" },
  { id: "pu_006", name: "Đỗ Quang Hải", email: "hai@fintechpro.com", company: "Fintech Pro", lastLogin: "", ticketsCreated: 0, articlesViewed: 0, status: "pending" },
];

const MOCK_RECENT_TICKETS: PortalTicket[] = [
  { id: "PT-1045", subject: "Không thể import CSV trên 10MB", customer: "Nguyễn Văn Hùng", status: "in-progress", priority: "high", channel: "portal", createdAt: "2026-03-03T09:00:00Z", csatScore: null },
  { id: "PT-1044", subject: "Lỗi webhook không gửi được payload", customer: "Lê Hoàng Anh", status: "open", priority: "critical", channel: "portal", createdAt: "2026-03-03T08:30:00Z", csatScore: null },
  { id: "PT-1043", subject: "Hỏi cách cấu hình SSO SAML", customer: "Trần Thị Lan", status: "resolved", priority: "medium", channel: "portal", createdAt: "2026-03-02T15:00:00Z", csatScore: 5 },
  { id: "PT-1042", subject: "Đề xuất thêm filter cho báo cáo", customer: "Phạm Đức Minh", status: "closed", priority: "low", channel: "portal", createdAt: "2026-03-02T10:00:00Z", csatScore: 4 },
  { id: "PT-1041", subject: "API rate limit quá thấp cho Enterprise", customer: "Lê Hoàng Anh", status: "resolved", priority: "high", channel: "email", createdAt: "2026-03-01T14:00:00Z", csatScore: 3 },
];

const STATUS_COLORS: Record<string, string> = {
  open: "bg-red-100 text-red-600",
  "in-progress": "bg-blue-100 text-blue-600",
  resolved: "bg-green-100 text-green-600",
  closed: "bg-gray-100 text-gray-500",
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-500",
};

type Tab = "overview" | "modules" | "users" | "tickets" | "branding";

/* ============================================================
 * Main Page
 * ============================================================ */
export function CustomerPortalPage() {
  const [modules, setModules] = useState(MOCK_MODULES);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [userSearch, setUserSearch] = useState("");

  const enabledModules = modules.filter((m) => m.enabled).length;
  const totalUsage = modules.reduce((s, m) => s + m.usageCount, 0);
  const activeUsers = MOCK_PORTAL_USERS.filter((u) => u.status === "active").length;
  const openTickets = MOCK_RECENT_TICKETS.filter((t) => t.status === "open" || t.status === "in-progress").length;
  const avgCSAT = (() => {
    const scored = MOCK_RECENT_TICKETS.filter((t) => t.csatScore != null);
    return scored.length > 0 ? (scored.reduce((s, t) => s + (t.csatScore || 0), 0) / scored.length).toFixed(1) : "—";
  })();

  const filteredUsers = useMemo(() => {
    if (!userSearch) return MOCK_PORTAL_USERS;
    const q = userSearch.toLowerCase();
    return MOCK_PORTAL_USERS.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.company.toLowerCase().includes(q));
  }, [userSearch]);

  const toggleModule = (id: string) => {
    setModules((prev) => prev.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m));
    const mod = modules.find((m) => m.id === id);
    toast.success(`${mod?.name}: ${mod?.enabled ? "Đã tắt" : "Đã bật"}`);
  };

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "overview", label: "Tổng quan", icon: BarChart3 },
    { key: "modules", label: "Modules", icon: Settings },
    { key: "users", label: "Người dùng", icon: Users },
    { key: "tickets", label: "Portal Tickets", icon: Ticket },
    { key: "branding", label: "Branding", icon: Palette },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Globe className="w-6 h-6 text-teal-600" /> Customer Portal
        </h1>
        <p className="text-gray-500 mt-0.5">
          Cổng tự phục vụ cho khách hàng — tickets, knowledge base, billing, community
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{enabledModules}/{modules.length}</p>
          <p className="text-[9px] text-gray-400">Modules bật</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{activeUsers}</p>
          <p className="text-[9px] text-green-700">Users active</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{totalUsage.toLocaleString()}</p>
          <p className="text-[9px] text-blue-700">Lượt dùng (30d)</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{openTickets}</p>
          <p className="text-[9px] text-amber-700">Tickets mở</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{avgCSAT}/5</p>
          <p className="text-[9px] text-violet-700">CSAT TB</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2.5 text-center">
          <p className="text-lg text-emerald-600">73%</p>
          <p className="text-[9px] text-emerald-700">Self-solve rate</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === t.key ? "bg-teal-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* === Tab: Overview === */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Portal Status */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm text-gray-900">Portal Status</h4>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[9px] text-green-600"><CheckCircle2 className="w-3 h-3" /> Online</span>
                <a href="#" className="flex items-center gap-1 text-[9px] text-blue-600 hover:underline"><ExternalLink className="w-3 h-3" /> portal.ai-crm.vn</a>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-900">99.9%</p>
                <p className="text-[9px] text-gray-400">Uptime (30d)</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-900">240ms</p>
                <p className="text-[9px] text-gray-400">Avg response</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-900">1,240</p>
                <p className="text-[9px] text-gray-400">Sessions hôm nay</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl text-gray-900">4:32</p>
                <p className="text-[9px] text-gray-400">Avg session (phút)</p>
              </div>
            </div>
          </div>

          {/* Module Usage */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm text-gray-900 mb-3">Module Usage (30 ngày)</h4>
            <div className="space-y-2">
              {modules.filter((m) => m.enabled).sort((a, b) => b.usageCount - a.usageCount).map((m) => {
                const maxUsage = modules.reduce((max, m2) => Math.max(max, m2.usageCount), 1);
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <m.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-700">{m.name}</span>
                        <span className="text-xs text-gray-500">{m.usageCount.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 rounded-full" style={{ width: `${(m.usageCount / maxUsage) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent portal tickets */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm text-gray-900 mb-3">Portal Tickets gần đây</h4>
            <div className="space-y-2">
              {MOCK_RECENT_TICKETS.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-b-0">
                  <span className="text-[9px] text-gray-400 w-14 flex-shrink-0">{t.id}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 truncate">{t.subject}</p>
                    <p className="text-[9px] text-gray-400">{t.customer}</p>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                  {t.csatScore != null && (
                    <span className="flex items-center gap-0.5 text-[8px] text-amber-500">
                      <Star className="w-2.5 h-2.5" /> {t.csatScore}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === Tab: Modules === */}
      {activeTab === "modules" && (
        <div className="space-y-2">
          {modules.map((m) => (
            <div key={m.id} className={`flex items-center gap-3 p-3 bg-white rounded-xl border transition-colors ${m.enabled ? "border-teal-200" : "border-gray-100 opacity-70"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.enabled ? "bg-teal-50 border border-teal-200" : "bg-gray-50 border border-gray-200"}`}>
                <m.icon className={`w-5 h-5 ${m.enabled ? "text-teal-600" : "text-gray-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{m.name}</p>
                <p className="text-[10px] text-gray-400">{m.description}</p>
                {m.usageCount > 0 && <p className="text-[9px] text-teal-500 mt-0.5">{m.usageCount.toLocaleString()} lượt sử dụng (30d)</p>}
              </div>
              <button type="button" onClick={() => toggleModule(m.id)}
                className="flex-shrink-0">
                {m.enabled ? <ToggleRight className="w-8 h-8 text-teal-600" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* === Tab: Users === */}
      {activeTab === "users" && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm user portal..."
              value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {filteredUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white ${
                  u.status === "active" ? "bg-teal-500" : u.status === "pending" ? "bg-amber-400" : "bg-gray-300"
                }`}>
                  {u.name.split(" ").pop()?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{u.name}</p>
                  <p className="text-[10px] text-gray-400">{u.email} • {u.company}</p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-[9px] text-gray-400">{u.ticketsCreated} tickets • {u.articlesViewed} articles</p>
                  <p className="text-[9px] text-gray-400">{u.lastLogin ? `Login: ${new Date(u.lastLogin).toLocaleDateString("vi-VN")}` : "Chưa đăng nhập"}</p>
                </div>
                <span className={`text-[8px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                  u.status === "active" ? "bg-green-100 text-green-600" : u.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"
                }`}>{u.status === "active" ? "Active" : u.status === "pending" ? "Pending" : "Inactive"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Tab: Tickets === */}
      {activeTab === "tickets" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Chủ đề</th>
                    <th className="px-3 py-2">Khách hàng</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Priority</th>
                    <th className="px-3 py-2">Kênh</th>
                    <th className="px-3 py-2">CSAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_RECENT_TICKETS.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50">
                      <td className="px-3 py-2.5 text-[10px] text-violet-600">{t.id}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-700 max-w-[200px] truncate">{t.subject}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">{t.customer}</td>
                      <td className="px-3 py-2.5"><span className={`text-[8px] px-1.5 py-0.5 rounded ${STATUS_COLORS[t.status]}`}>{t.status}</span></td>
                      <td className="px-3 py-2.5"><span className={`text-[8px] px-1.5 py-0.5 rounded ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span></td>
                      <td className="px-3 py-2.5 text-[10px] text-gray-400 capitalize">{t.channel}</td>
                      <td className="px-3 py-2.5">
                        {t.csatScore != null ? (
                          <span className="flex items-center gap-0.5 text-xs text-amber-500"><Star className="w-3 h-3" /> {t.csatScore}</span>
                        ) : <span className="text-[9px] text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* === Tab: Branding === */}
      {activeTab === "branding" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm text-gray-900 mb-3">Cấu hình Branding</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Logo URL</label>
                <input type="text" defaultValue="https://ai-crm.vn/logo.svg" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Custom Domain</label>
                <input type="text" defaultValue="portal.ai-crm.vn" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Màu chủ đạo</label>
                <div className="flex items-center gap-2">
                  <input type="color" defaultValue="#0D9488" className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <input type="text" defaultValue="#0D9488" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Tên hiển thị</label>
                <input type="text" defaultValue="AI-CRM Support Portal" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Welcome Message</label>
                <textarea rows={2} defaultValue="Chào mừng bạn đến Cổng hỗ trợ AI-CRM! Tìm câu trả lời nhanh trong Knowledge Base hoặc tạo ticket để nhận hỗ trợ."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
              </div>
            </div>
            <button type="button" onClick={() => toast.success("Đã lưu cấu hình branding")}
              className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
              Lưu thay đổi
            </button>
          </div>

          {/* Portal Preview */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm text-gray-900 mb-3">Preview Portal</h4>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-teal-600 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-white text-sm">AI-CRM Support Portal</span>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-3">Chào mừng bạn! Bạn cần hỗ trợ gì?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {modules.filter((m) => m.enabled).slice(0, 4).map((m) => (
                    <div key={m.id} className="bg-white rounded-lg p-3 text-center border border-gray-200 hover:border-teal-300">
                      <m.icon className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                      <p className="text-[10px] text-gray-700">{m.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <h4 className="text-sm text-teal-900">AI Portal Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-teal-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Self-solve rate đạt <strong>73%</strong> — tăng 8% so với tháng trước nhờ bổ sung 15 bài KB mới. Top article: <strong>"Cách import CSV"</strong> (890 views).</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>5 user chưa kích hoạt</strong> portal trong 30 ngày. Đề xuất gửi email nhắc nhở kèm hướng dẫn sử dụng portal.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Bật module <strong>"Diễn đàn Cộng đồng"</strong> có thể giảm tickets <strong>-20%</strong> (dựa trên benchmark ngành SaaS). Recommend enable.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
