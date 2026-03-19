/**
 * Audit Trail & Compliance
 * Nhật ký kiểm toán chi tiết: theo dõi mọi thay đổi trong hệ thống,
 * filter theo module/user/action, compliance dashboard, export.
 */
import { useState, useMemo } from "react";
import {
  ScrollText,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Clock,
  User,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  Bot,
  Zap,
  FileText,
  Database,
  Lock,
  Settings,
  Trash2,
  Pencil,
  Plus,
  LogIn,
  LogOut,
  Key,
  ArrowRight,
  UserX,
  UserCheck,
  Calendar,
  BarChart3,
  ShieldCheck,
  FileDown,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type AuditAction = "create" | "update" | "delete" | "view" | "login" | "logout" | "export" | "permission_change" | "api_access" | "bulk_action";
type AuditModule = "contacts" | "deals" | "tickets" | "users" | "settings" | "reports" | "api" | "auth" | "workflow" | "data";
type Severity = "info" | "warning" | "critical";

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  isAiAgent: boolean;
  action: AuditAction;
  module: AuditModule;
  severity: Severity;
  resource: string;
  resourceId: string;
  description: string;
  details: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const ACTION_CONFIG: Record<AuditAction, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  create: { label: "Tạo mới", icon: Plus, color: "text-green-600 bg-green-50" },
  update: { label: "Cập nhật", icon: Pencil, color: "text-blue-600 bg-blue-50" },
  delete: { label: "Xoá", icon: Trash2, color: "text-red-600 bg-red-50" },
  view: { label: "Xem", icon: Eye, color: "text-gray-500 bg-gray-50" },
  login: { label: "Đăng nhập", icon: LogIn, color: "text-green-600 bg-green-50" },
  logout: { label: "Đăng xuất", icon: LogOut, color: "text-gray-500 bg-gray-50" },
  export: { label: "Xuất dữ liệu", icon: FileDown, color: "text-amber-600 bg-amber-50" },
  permission_change: { label: "Đổi quyền", icon: Shield, color: "text-violet-600 bg-violet-50" },
  api_access: { label: "API Access", icon: Key, color: "text-cyan-600 bg-cyan-50" },
  bulk_action: { label: "Thao tác hàng loạt", icon: Database, color: "text-orange-600 bg-orange-50" },
};

const MODULE_CONFIG: Record<AuditModule, { label: string; color: string }> = {
  contacts: { label: "Liên hệ", color: "bg-blue-100 text-blue-700" },
  deals: { label: "Deals", color: "bg-green-100 text-green-700" },
  tickets: { label: "Tickets", color: "bg-red-100 text-red-700" },
  users: { label: "Người dùng", color: "bg-violet-100 text-violet-700" },
  settings: { label: "Cài đặt", color: "bg-gray-100 text-gray-700" },
  reports: { label: "Báo cáo", color: "bg-amber-100 text-amber-700" },
  api: { label: "API", color: "bg-cyan-100 text-cyan-700" },
  auth: { label: "Xác thực", color: "bg-emerald-100 text-emerald-700" },
  workflow: { label: "Workflow", color: "bg-indigo-100 text-indigo-700" },
  data: { label: "Dữ liệu", color: "bg-orange-100 text-orange-700" },
};

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string }> = {
  info: { label: "Thông tin", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  warning: { label: "Cảnh báo", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  critical: { label: "Nghiêm trọng", color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_AUDIT_LOGS: AuditEntry[] = [
  {
    id: "aud_001", timestamp: "2026-03-03T10:15:32Z", userId: "usr_001", userName: "Trần Đức Anh", userRole: "Super Admin", isAiAgent: false,
    action: "permission_change", module: "users", severity: "critical",
    resource: "Role Assignment", resourceId: "role_sales_manager",
    description: "Thay đổi quyền role 'Sales Manager': thêm quyền 'deals:delete', 'reports:export'",
    details: { added: ["deals:delete", "reports:export"], removed: [], targetRole: "Sales Manager", affectedUsers: 12 },
    ipAddress: "113.161.72.xx", userAgent: "Chrome 122 / macOS",
  },
  {
    id: "aud_002", timestamp: "2026-03-03T10:02:15Z", userId: "ai_agent_03", userName: "AI Lead Scoring Agent", userRole: "AI Agent", isAiAgent: true,
    action: "update", module: "contacts", severity: "info",
    resource: "Contact", resourceId: "ct_045",
    description: "AI tự động cập nhật lead score: 45 → 88 (tăng do mở email + xem pricing page)",
    details: { oldScore: 45, newScore: 88, reasons: ["Mở email nurture #3", "Xem trang pricing 3 lần", "Tải whitepaper"] },
    ipAddress: "10.0.0.5", userAgent: "AI-CRM Agent Runtime v2.1",
  },
  {
    id: "aud_003", timestamp: "2026-03-03T09:45:00Z", userId: "usr_005", userName: "Vũ Thanh Hà", userRole: "Sales Rep", isAiAgent: false,
    action: "delete", module: "contacts", severity: "warning",
    resource: "Contact", resourceId: "ct_089",
    description: "Xoá contact 'Nguyễn Thế Vinh' (email: vinh@oldcompany.vn) — lý do: duplicate",
    details: { contactName: "Nguyễn Thế Vinh", contactEmail: "vinh@oldcompany.vn", reason: "Duplicate with ct_023" },
    ipAddress: "42.115.89.xx", userAgent: "Chrome 122 / Windows",
  },
  {
    id: "aud_004", timestamp: "2026-03-03T09:30:00Z", userId: "usr_002", userName: "Nguyễn Thị Mai", userRole: "Marketing Manager", isAiAgent: false,
    action: "export", module: "reports", severity: "warning",
    resource: "Report Export", resourceId: "rpt_monthly_revenue",
    description: "Xuất báo cáo 'Doanh thu tháng 02/2026' — 3,456 records, 2.8MB (CSV)",
    details: { reportName: "Doanh thu tháng 02/2026", format: "CSV", records: 3456, fileSize: "2.8MB" },
    ipAddress: "113.161.72.xx", userAgent: "Chrome 122 / macOS",
  },
  {
    id: "aud_005", timestamp: "2026-03-03T09:18:00Z", userId: "usr_001", userName: "Trần Đức Anh", userRole: "Super Admin", isAiAgent: false,
    action: "create", module: "workflow", severity: "info",
    resource: "Workflow", resourceId: "wf_012",
    description: "Tạo workflow mới 'Auto-assign lead theo khu vực' với 5 nodes",
    details: { workflowName: "Auto-assign lead theo khu vực", nodeCount: 5, trigger: "contact.created" },
    ipAddress: "113.161.72.xx", userAgent: "Chrome 122 / macOS",
  },
  {
    id: "aud_006", timestamp: "2026-03-03T08:45:00Z", userId: "usr_001", userName: "Trần Đức Anh", userRole: "Super Admin", isAiAgent: false,
    action: "login", module: "auth", severity: "info",
    resource: "Authentication", resourceId: "session_abc123",
    description: "Đăng nhập thành công — 2FA verified (Google Authenticator)",
    details: { method: "password + 2FA", twoFactorType: "Google Authenticator" },
    ipAddress: "113.161.72.xx", userAgent: "Chrome 122 / macOS",
  },
  {
    id: "aud_007", timestamp: "2026-03-03T08:12:00Z", userId: "ai_agent_01", userName: "AI Deal Analyzer", userRole: "AI Agent", isAiAgent: true,
    action: "update", module: "deals", severity: "info",
    resource: "Deal", resourceId: "dl_089",
    description: "AI cập nhật dự báo deal 'Enterprise License - VNTech': win probability 65% → 82%",
    details: { dealName: "Enterprise License - VNTech", oldProbability: 65, newProbability: 82, factors: ["Champion confirmed", "Budget approved", "Timeline matched"] },
    ipAddress: "10.0.0.5", userAgent: "AI-CRM Agent Runtime v2.1",
  },
  {
    id: "aud_008", timestamp: "2026-03-03T07:55:00Z", userId: "usr_003", userName: "Lê Hoàng Đức", userRole: "Sales Manager", isAiAgent: false,
    action: "bulk_action", module: "contacts", severity: "warning",
    resource: "Bulk Update", resourceId: "bulk_034",
    description: "Cập nhật hàng loạt 156 contacts: gán tag 'Q1-2026-Campaign', thay đổi owner → Phạm Minh Tâm",
    details: { affectedRecords: 156, changes: { tag: "Q1-2026-Campaign", newOwner: "Phạm Minh Tâm" } },
    ipAddress: "42.115.89.xx", userAgent: "Chrome 122 / Windows",
  },
  {
    id: "aud_009", timestamp: "2026-03-03T07:30:00Z", userId: "usr_007", userName: "API Key: Production CRM", userRole: "API Client", isAiAgent: false,
    action: "api_access", module: "api", severity: "info",
    resource: "API Endpoint", resourceId: "GET /api/v2/contacts",
    description: "API request: GET /api/v2/contacts?page=1&limit=100 — 200 OK (89ms)",
    details: { method: "GET", endpoint: "/api/v2/contacts", queryParams: { page: 1, limit: 100 }, statusCode: 200, duration: 89 },
    ipAddress: "203.162.xx.xx", userAgent: "axios/1.6.2",
  },
  {
    id: "aud_010", timestamp: "2026-03-03T06:00:00Z", userId: "system", userName: "Hệ thống", userRole: "System", isAiAgent: false,
    action: "bulk_action", module: "data", severity: "info",
    resource: "Daily Backup", resourceId: "backup_20260303",
    description: "Sao lưu tự động hàng ngày hoàn tất — 45,678 records, 128MB compressed",
    details: { totalRecords: 45678, fileSize: "128MB", duration: "4m 23s", destination: "S3: crm-backups/2026/03/03/" },
    ipAddress: "10.0.0.1", userAgent: "CRM Backup Service v3.0",
  },
  {
    id: "aud_011", timestamp: "2026-03-02T23:15:00Z", userId: "usr_004", userName: "Phạm Minh Tâm", userRole: "Sales Rep", isAiAgent: false,
    action: "login", module: "auth", severity: "critical",
    resource: "Authentication", resourceId: "failed_login_012",
    description: "Đăng nhập thất bại 3 lần liên tiếp — tài khoản tạm khoá 15 phút",
    details: { attempts: 3, lockDuration: "15 minutes", reason: "Wrong password", source: "Mobile app" },
    ipAddress: "14.161.xx.xx", userAgent: "Safari Mobile / iOS 18",
  },
  {
    id: "aud_012", timestamp: "2026-03-02T22:00:00Z", userId: "usr_001", userName: "Trần Đức Anh", userRole: "Super Admin", isAiAgent: false,
    action: "update", module: "settings", severity: "critical",
    resource: "System Settings", resourceId: "config_security",
    description: "Thay đổi cấu hình bảo mật: bật IP Whitelisting, thay đổi session timeout 30min → 15min",
    details: { changes: { ipWhitelist: { old: "disabled", new: "enabled" }, sessionTimeout: { old: "30min", new: "15min" } } },
    ipAddress: "113.161.72.xx", userAgent: "Chrome 122 / macOS",
  },
];

/* ============================================================
 * Main Page
 * ============================================================ */
export function AuditTrailPage() {
  const [logs] = useState<AuditEntry[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
  const [moduleFilter, setModuleFilter] = useState<AuditModule | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = logs;
    if (actionFilter !== "all") result = result.filter((l) => l.action === actionFilter);
    if (moduleFilter !== "all") result = result.filter((l) => l.module === moduleFilter);
    if (severityFilter !== "all") result = result.filter((l) => l.severity === severityFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) =>
        l.description.toLowerCase().includes(q) ||
        l.userName.toLowerCase().includes(q) ||
        l.resource.toLowerCase().includes(q),
      );
    }
    return result;
  }, [logs, actionFilter, moduleFilter, severityFilter, search]);

  const stats = useMemo(() => ({
    total: logs.length,
    critical: logs.filter((l) => l.severity === "critical").length,
    warning: logs.filter((l) => l.severity === "warning").length,
    aiActions: logs.filter((l) => l.isAiAgent).length,
    uniqueUsers: new Set(logs.map((l) => l.userId)).size,
    todayActions: logs.filter((l) => l.timestamp.startsWith("2026-03-03")).length,
  }), [logs]);

  const handleExport = () => {
    toast.success("Đang xuất audit log — 12 entries (CSV)");
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-violet-600" /> Audit Trail & Compliance
        </h1>
        <p className="text-gray-500 mt-0.5">
          Theo dõi mọi thay đổi trong hệ thống — kiểm toán, compliance, và phân tích bảo mật
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Tổng log</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.todayActions}</p>
          <p className="text-[9px] text-blue-700">Hôm nay</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{stats.critical}</p>
          <p className="text-[9px] text-red-700">Nghiêm trọng</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.warning}</p>
          <p className="text-[9px] text-amber-700">Cảnh báo</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.aiActions}</p>
          <p className="text-[9px] text-violet-700">AI Actions</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2.5 text-center">
          <p className="text-lg text-emerald-600">{stats.uniqueUsers}</p>
          <p className="text-[9px] text-emerald-700">Người dùng</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm trong audit log..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <button type="button" onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm ${
            showFilters ? "border-violet-300 bg-violet-50 text-violet-600" : "border-gray-200 text-gray-500"
          }`}>
          <Filter className="w-4 h-4" /> Bộ lọc
        </button>
        <button type="button" onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Download className="w-4 h-4" /> Xuất CSV
        </button>
        <button type="button" onClick={() => toast.success("Đã làm mới")}
          className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Hành động</label>
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value as AuditAction | "all")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="all">Tất cả</option>
              {Object.entries(ACTION_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Module</label>
            <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value as AuditModule | "all")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="all">Tất cả</option>
              {Object.entries(MODULE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Mức độ</label>
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value as Severity | "all")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="all">Tất cả</option>
              <option value="info">Thông tin</option>
              <option value="warning">Cảnh báo</option>
              <option value="critical">Nghiêm trọng</option>
            </select>
          </div>
        </div>
      )}

      {/* Log Entries */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.map((log) => {
            const actionCfg = ACTION_CONFIG[log.action];
            const moduleCfg = MODULE_CONFIG[log.module];
            const severityCfg = SEVERITY_CONFIG[log.severity];
            const ActionIcon = actionCfg.icon;
            const isExpanded = expandedId === log.id;

            return (
              <div key={log.id} className={log.severity === "critical" ? "bg-red-50/30" : ""}>
                <button type="button" onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50/50 transition-colors">
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg ${actionCfg.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <ActionIcon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[8px] px-1.5 py-0.5 rounded ${moduleCfg.color}`}>{moduleCfg.label}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${severityCfg.bg} ${severityCfg.color}`}>{severityCfg.label}</span>
                      {log.isAiAgent && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-600 flex items-center gap-0.5">
                          <Bot className="w-2.5 h-2.5" /> AI
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-800 mt-1">{log.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[9px] text-gray-400 flex-wrap">
                      <span className="flex items-center gap-0.5">
                        {log.isAiAgent ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {log.userName}
                      </span>
                      <span className="text-gray-300">{log.userRole}</span>
                      <span className="flex items-center gap-0.5 font-mono">{log.ipAddress}</span>
                    </div>
                  </div>

                  {/* Time & Expand */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] text-gray-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && log.details && (
                  <div className="px-4 pb-3 ml-11">
                    <div className="bg-gray-900 rounded-lg p-3 text-[10px] font-mono overflow-x-auto">
                      <p className="text-gray-400 mb-1">// Chi tiết thay đổi</p>
                      <pre className="text-green-400">{JSON.stringify(log.details, null, 2)}</pre>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[9px] text-gray-400">
                      <span>Resource: <code className="text-violet-500">{log.resource}</code></span>
                      <span>ID: <code className="text-violet-500">{log.resourceId}</code></span>
                      <span>UA: {log.userAgent}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <ScrollText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Không tìm thấy log nào với bộ lọc hiện tại</p>
          </div>
        )}
      </div>

      {/* Result count */}
      <p className="text-[10px] text-gray-400 text-center">
        Hiển thị {filtered.length} / {logs.length} entries — Dữ liệu audit được lưu trữ 365 ngày
      </p>

      {/* Compliance Dashboard */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <h4 className="text-sm text-gray-900">Compliance Dashboard</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-800">GDPR</span>
            </div>
            <p className="text-[10px] text-green-600">Tuân thủ đầy đủ</p>
            <p className="text-[8px] text-green-500 mt-0.5">Data retention: 365 ngày</p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-800">SOC 2 Type II</span>
            </div>
            <p className="text-[10px] text-green-600">Audit trail đầy đủ</p>
            <p className="text-[8px] text-green-500 mt-0.5">Immutable logs enabled</p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-800">ISO 27001</span>
            </div>
            <p className="text-[10px] text-green-600">Access control logging</p>
            <p className="text-[8px] text-green-500 mt-0.5">Mọi truy cập được ghi nhận</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-800">PCI DSS</span>
            </div>
            <p className="text-[10px] text-amber-600">Cần bổ sung</p>
            <p className="text-[8px] text-amber-500 mt-0.5">Thiếu: encryption at rest audit</p>
          </div>
        </div>
      </div>

      {/* AI Security Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Audit Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span>Phát hiện <strong>3 lần đăng nhập thất bại</strong> từ IP <strong>14.161.xx.xx</strong> vào 23:15. Tài khoản <strong>Phạm Minh Tâm</strong> đã bị khoá tạm. Kiểm tra xem có phải brute force.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>2 AI agents</strong> đã thực hiện <strong>{stats.aiActions} thao tác</strong> hôm nay — tất cả trong scope cho phép. Không phát hiện hành vi bất thường.</span>
          </p>
          <p className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Thay đổi quyền <strong>deals:delete</strong> cho 12 Sales Managers. Kiểm tra lại theo nguyên tắc <strong>least privilege</strong> — xoá deal là hành động rủi ro cao.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
