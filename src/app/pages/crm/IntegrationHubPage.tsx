/**
 * Trang Integration Hub — Quản lý kết nối với dịch vụ bên thứ 3.
 * Slack, Gmail, Jira, Trello, Zoom, LinkedIn, Calendly, Zapier, v.v.
 * Phase 1: Visual catalog + connection status.
 */
import { useState, useMemo, useCallback } from "react";
import {
  Puzzle,
  Search,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Settings,
  ExternalLink,
  Zap,
  Bot,
  Mail,
  Video,
  Calendar,
  MessageSquare,
  GitBranch,
  BarChart3,
  Globe,
  Clock,
  ArrowRight,
  RefreshCw,
  X,
  Shield,
  Activity,
  Webhook,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type ConnectionStatus = "connected" | "disconnected" | "error";
type IntegrationCategory = "communication" | "project-management" | "marketing" | "analytics" | "ai-tools" | "calendar" | "developer";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  status: ConnectionStatus;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  lastSync?: string;
  syncCount?: number;
  features: string[];
  isAIPowered: boolean;
}

/* ============================================================
 * Constants
 * ============================================================ */
const CATEGORY_CONFIG: Record<IntegrationCategory, { label: string; icon: React.ReactNode }> = {
  communication: { label: "Giao tiếp", icon: <MessageSquare className="w-4 h-4" /> },
  "project-management": { label: "Quản lý dự án", icon: <GitBranch className="w-4 h-4" /> },
  marketing: { label: "Marketing", icon: <Globe className="w-4 h-4" /> },
  analytics: { label: "Phân tích", icon: <BarChart3 className="w-4 h-4" /> },
  "ai-tools": { label: "AI & Tự động", icon: <Bot className="w-4 h-4" /> },
  calendar: { label: "Lịch & Booking", icon: <Calendar className="w-4 h-4" /> },
  developer: { label: "Lập trình viên", icon: <Webhook className="w-4 h-4" /> },
};

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  connected: { label: "Đã kết nối", color: "text-green-600 bg-green-50 border-green-200", icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
  disconnected: { label: "Chưa kết nối", color: "text-gray-500 bg-gray-50 border-gray-200", icon: <Circle className="w-4 h-4 text-gray-400" /> },
  error: { label: "Lỗi kết nối", color: "text-red-600 bg-red-50 border-red-200", icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
};

/* ============================================================
 * Mock Data — 14 tích hợp
 * ============================================================ */
const INTEGRATIONS: Integration[] = [
  {
    id: "int1", name: "Slack", description: "Gửi thông báo deal, lead mới, và AI insights trực tiếp vào Slack channels.",
    category: "communication", status: "connected",
    icon: <MessageSquare className="w-6 h-6" />, color: "text-purple-700", bgColor: "bg-purple-100",
    lastSync: "2026-03-03T08:00:00", syncCount: 1247,
    features: ["Thông báo deal mới", "AI Summary hàng ngày", "Lead alerts", "Team mentions"],
    isAIPowered: true,
  },
  {
    id: "int2", name: "Gmail / Google Workspace", description: "Đồng bộ email, theo dõi mở email, tự động log hoạt động.",
    category: "communication", status: "connected",
    icon: <Mail className="w-6 h-6" />, color: "text-red-700", bgColor: "bg-red-100",
    lastSync: "2026-03-03T08:30:00", syncCount: 3456,
    features: ["Email sync 2 chiều", "Tracking email mở", "Auto-log activities", "Template gửi từ CRM"],
    isAIPowered: true,
  },
  {
    id: "int3", name: "Jira", description: "Tự động tạo ticket khi deal won, đồng bộ project status.",
    category: "project-management", status: "connected",
    icon: <GitBranch className="w-6 h-6" />, color: "text-blue-700", bgColor: "bg-blue-100",
    lastSync: "2026-03-03T07:00:00", syncCount: 234,
    features: ["Tạo ticket tự động", "Sync project status", "Link deal ↔ project", "Sprint reports"],
    isAIPowered: false,
  },
  {
    id: "int4", name: "Zoom", description: "Tự động tạo meeting links, ghi chú cuộc họp bằng AI.",
    category: "calendar", status: "connected",
    icon: <Video className="w-6 h-6" />, color: "text-blue-700", bgColor: "bg-blue-100",
    lastSync: "2026-03-02T22:00:00", syncCount: 89,
    features: ["Tạo meeting link", "AI Meeting notes", "Auto-log meetings", "Recording integration"],
    isAIPowered: true,
  },
  {
    id: "int5", name: "LinkedIn Sales Navigator", description: "Tìm kiếm lead, enrichment data, theo dõi hoạt động prospect.",
    category: "marketing", status: "connected",
    icon: <Globe className="w-6 h-6" />, color: "text-sky-700", bgColor: "bg-sky-100",
    lastSync: "2026-03-03T06:00:00", syncCount: 567,
    features: ["Lead search & import", "Company enrichment", "InMail tracking", "Social selling insights"],
    isAIPowered: true,
  },
  {
    id: "int6", name: "Google Calendar", description: "Đồng bộ lịch hẹn, tự động tạo sự kiện CRM.",
    category: "calendar", status: "connected",
    icon: <Calendar className="w-6 h-6" />, color: "text-green-700", bgColor: "bg-green-100",
    lastSync: "2026-03-03T08:00:00", syncCount: 178,
    features: ["Sync 2 chiều", "Tự động tạo events", "Availability check", "Reminder CRM"],
    isAIPowered: false,
  },
  {
    id: "int7", name: "OpenAI GPT-4", description: "AI Engine cho tất cả tính năng AI trong CRM.",
    category: "ai-tools", status: "connected",
    icon: <Bot className="w-6 h-6" />, color: "text-violet-700", bgColor: "bg-violet-100",
    lastSync: "2026-03-03T08:30:00", syncCount: 8923,
    features: ["Lead scoring", "Email generation", "Sentiment analysis", "Deal prediction", "Content creation"],
    isAIPowered: true,
  },
  {
    id: "int8", name: "Calendly", description: "Cho phép khách hàng tự đặt lịch hẹn, sync với CRM.",
    category: "calendar", status: "disconnected",
    icon: <Calendar className="w-6 h-6" />, color: "text-blue-700", bgColor: "bg-blue-100",
    features: ["Booking page", "Tự động tạo contact", "Reminder emails", "Round-robin assignment"],
    isAIPowered: false,
  },
  {
    id: "int9", name: "Zapier", description: "Kết nối 5000+ ứng dụng với CRM qua workflows tự động.",
    category: "ai-tools", status: "disconnected",
    icon: <Zap className="w-6 h-6" />, color: "text-orange-700", bgColor: "bg-orange-100",
    features: ["5000+ integrations", "Custom workflows", "Multi-step zaps", "Conditional logic"],
    isAIPowered: false,
  },
  {
    id: "int10", name: "Trello", description: "Quản lý task và board cho team sales, đồng bộ với pipeline.",
    category: "project-management", status: "disconnected",
    icon: <GitBranch className="w-6 h-6" />, color: "text-blue-700", bgColor: "bg-blue-100",
    features: ["Board sync", "Card ↔ Deal", "Checklist automation", "Team collaboration"],
    isAIPowered: false,
  },
  {
    id: "int11", name: "HubSpot Marketing", description: "Đồng bộ contacts và campaigns giữa HubSpot và CRM.",
    category: "marketing", status: "disconnected",
    icon: <Globe className="w-6 h-6" />, color: "text-orange-700", bgColor: "bg-orange-100",
    features: ["Contact sync", "Campaign tracking", "Form submissions", "Lead nurturing"],
    isAIPowered: false,
  },
  {
    id: "int12", name: "Google Analytics", description: "Theo dõi nguồn traffic và attribution cho lead generation.",
    category: "analytics", status: "error",
    icon: <BarChart3 className="w-6 h-6" />, color: "text-amber-700", bgColor: "bg-amber-100",
    lastSync: "2026-02-28T12:00:00", syncCount: 45,
    features: ["Traffic attribution", "Conversion tracking", "UTM management", "ROI reports"],
    isAIPowered: false,
  },
  {
    id: "int13", name: "Webhook API", description: "Endpoint tùy chỉnh để nhận/gửi dữ liệu từ hệ thống khác.",
    category: "developer", status: "connected",
    icon: <Webhook className="w-6 h-6" />, color: "text-gray-700", bgColor: "bg-gray-100",
    lastSync: "2026-03-03T08:15:00", syncCount: 2341,
    features: ["Custom endpoints", "Event webhooks", "Retry logic", "Payload transformation"],
    isAIPowered: false,
  },
  {
    id: "int14", name: "Microsoft Teams", description: "Thông báo và collaboration qua Teams channels.",
    category: "communication", status: "disconnected",
    icon: <MessageSquare className="w-6 h-6" />, color: "text-indigo-700", bgColor: "bg-indigo-100",
    features: ["Channel notifications", "Meeting integration", "Adaptive cards", "Bot commands"],
    isAIPowered: false,
  },
];

/* ============================================================
 * Integration Card
 * ============================================================ */
function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onViewDetail,
}: {
  integration: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  onViewDetail: () => void;
}) {
  const statusCfg = STATUS_CONFIG[integration.status];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all group">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2.5 rounded-xl ${integration.bgColor} ${integration.color} flex-shrink-0`}>
          {integration.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="text-sm text-gray-900">{integration.name}</h4>
            {integration.isAIPowered && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 flex items-center gap-0.5">
                <Bot className="w-3 h-3" /> AI
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 line-clamp-2 mb-2">{integration.description}</p>

          {/* Status + sync info */}
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
              {statusCfg.icon}
              {statusCfg.label}
            </span>
            {integration.lastSync && (
              <span className="text-gray-400 flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {new Date(integration.lastSync).toLocaleDateString("vi-VN")}
              </span>
            )}
            {integration.syncCount !== undefined && integration.syncCount > 0 && (
              <span className="text-gray-400 flex items-center gap-0.5">
                <Activity className="w-3 h-3" />
                {integration.syncCount.toLocaleString()} syncs
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mt-2">
            {integration.features.slice(0, 3).map((f) => (
              <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100">
                {f}
              </span>
            ))}
            {integration.features.length > 3 && (
              <span className="text-[9px] text-gray-400">+{integration.features.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
        {integration.status === "connected" ? (
          <>
            <button
              type="button"
              onClick={onViewDetail}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" /> Cấu hình
            </button>
            <button
              type="button"
              onClick={onDisconnect}
              className="flex items-center gap-1 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Ngắt
            </button>
          </>
        ) : integration.status === "error" ? (
          <>
            <button
              type="button"
              onClick={onConnect}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs hover:bg-amber-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Kết nối lại
            </button>
            <button
              type="button"
              onClick={onViewDetail}
              className="flex items-center gap-1 px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-lg text-xs transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs hover:bg-violet-700 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" /> Kết nối
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function IntegrationDetailModal({ integration, onClose }: {
  integration: Integration;
  onClose: () => void;
}) {
  const statusCfg = STATUS_CONFIG[integration.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${integration.bgColor} ${integration.color}`}>
                {integration.icon}
              </div>
              <div>
                <h3 className="text-gray-900">{integration.name}</h3>
                <span className={`text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                  {statusCfg.icon} {statusCfg.label}
                </span>
              </div>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">{integration.description}</p>

          {/* Features */}
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Tính năng</p>
            <div className="space-y-1">
              {integration.features.map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-sm text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Sync info */}
          {integration.syncCount !== undefined && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-900">{integration.syncCount.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">Tổng syncs</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-900">
                  {integration.lastSync
                    ? new Date(integration.lastSync).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })
                    : "—"}
                </p>
                <p className="text-[10px] text-gray-400">Sync gần nhất</p>
              </div>
            </div>
          )}

          {/* Security note */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-xs text-blue-700 flex items-center gap-1 mb-1">
              <Shield className="w-3 h-3" /> Bảo mật
            </p>
            <p className="text-[11px] text-blue-600">
              Dữ liệu được mã hóa end-to-end. Quyền truy cập có thể thu hồi bất cứ lúc nào.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            Đóng
          </button>
          {integration.status === "connected" && (
            <button type="button"
              onClick={() => { toast.success("Đã đồng bộ lại dữ liệu"); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">
              <RefreshCw className="w-4 h-4" /> Đồng bộ ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function IntegrationHubPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<IntegrationCategory | "">("");
  const [filterStatus, setFilterStatus] = useState<ConnectionStatus | "">("");
  const [detailIntegration, setDetailIntegration] = useState<Integration | null>(null);

  const filtered = useMemo(() => {
    let result = [...integrations];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) =>
        i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
      );
    }
    if (filterCategory) result = result.filter((i) => i.category === filterCategory);
    if (filterStatus) result = result.filter((i) => i.status === filterStatus);
    return result;
  }, [integrations, search, filterCategory, filterStatus]);

  const stats = useMemo(() => ({
    total: integrations.length,
    connected: integrations.filter((i) => i.status === "connected").length,
    error: integrations.filter((i) => i.status === "error").length,
    aiPowered: integrations.filter((i) => i.isAIPowered && i.status === "connected").length,
    totalSyncs: integrations.reduce((s, i) => s + (i.syncCount ?? 0), 0),
  }), [integrations]);

  const handleConnect = useCallback((id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: "connected" as ConnectionStatus, lastSync: new Date().toISOString(), syncCount: (i.syncCount ?? 0) + 1 }
          : i,
      ),
    );
    const name = integrations.find((i) => i.id === id)?.name;
    toast.success(`Đã kết nối ${name} thành công`);
  }, [integrations]);

  const handleDisconnect = useCallback((id: string) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "disconnected" as ConnectionStatus } : i)),
    );
    const name = integrations.find((i) => i.id === id)?.name;
    toast.info(`Đã ngắt kết nối ${name}`);
  }, [integrations]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Puzzle className="w-6 h-6 text-violet-600" /> Integration Hub
          </h1>
          <p className="text-gray-500 mt-0.5">
            Quản lý kết nối với các dịch vụ bên ngoài · {stats.connected}/{stats.total} đã kết nối
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng tích hợp</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700">{stats.connected}</p>
          <p className="text-xs text-green-600">Đã kết nối</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-3 text-center">
          <p className="text-lg text-red-700">{stats.error}</p>
          <p className="text-xs text-red-600">Lỗi</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
          <p className="text-lg text-violet-700 flex items-center justify-center gap-1">
            <Bot className="w-4 h-4" /> {stats.aiPowered}
          </p>
          <p className="text-xs text-violet-600">AI-Powered</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
          <p className="text-lg text-blue-700">{stats.totalSyncs.toLocaleString()}</p>
          <p className="text-xs text-blue-600">Tổng syncs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm tích hợp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as IntegrationCategory | "")}
            className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả danh mục</option>
            {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ConnectionStatus | "")}
            className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category sections */}
      {(() => {
        const categories = filterCategory
          ? [filterCategory]
          : [...new Set(filtered.map((i) => i.category))];

        return categories.map((cat) => {
          const catIntegrations = filtered.filter((i) => i.category === cat);
          if (catIntegrations.length === 0) return null;
          const catCfg = CATEGORY_CONFIG[cat];

          return (
            <div key={cat}>
              <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
                {catCfg.icon} {catCfg.label}
                <span className="text-[10px] text-gray-400 ml-1">({catIntegrations.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {catIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConnect={() => handleConnect(integration.id)}
                    onDisconnect={() => handleDisconnect(integration.id)}
                    onViewDetail={() => setDetailIntegration(integration)}
                  />
                ))}
              </div>
            </div>
          );
        });
      })()}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Puzzle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Không tìm thấy tích hợp phù hợp</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-violet-100 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">Integration Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            {stats.connected} tích hợp hoạt động, xử lý {stats.totalSyncs.toLocaleString()} sync trong tháng này.
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            {stats.error > 0 ? `${stats.error} tích hợp bị lỗi cần kiểm tra.` : "Tất cả kết nối hoạt động ổn định."}
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            Gợi ý: Kết nối Calendly để cho khách tự đặt lịch, giảm 40% email scheduling.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {detailIntegration && (
        <IntegrationDetailModal
          integration={detailIntegration}
          onClose={() => setDetailIntegration(null)}
        />
      )}
    </div>
  );
}
