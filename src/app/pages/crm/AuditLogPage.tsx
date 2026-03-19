/**
 * Trang Audit Log — Nhật ký kiểm toán hệ thống.
 * Activity timeline, user actions, data changes, security events,
 * AI anomaly detection, export compliance, filterable + searchable.
 * Phase 1: Mock data + interactive timeline + detail modal.
 */
import { useState, useMemo } from "react";
import {
  ScrollText,
  Search,
  X,
  Bot,
  Sparkles,
  User,
  Shield,
  AlertTriangle,
  Clock,
  Eye,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Plus,
  LogIn,
  LogOut,
  Key,
  Settings,
  FileText,
  Database,
  Users,
  Mail,
  Lock,
  Unlock,
  ArrowRight,
  RefreshCw,
  Zap,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  Legend,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type AuditAction = "create" | "update" | "delete" | "login" | "logout" | "export" | "import" | "permission" | "config" | "api-call";
type AuditSeverity = "info" | "warning" | "critical";
type AuditModule = "contacts" | "deals" | "users" | "settings" | "auth" | "data" | "integrations" | "automation";

interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  severity: AuditSeverity;
  module: AuditModule;
  actor: string;
  actorType: "human" | "ai-agent" | "system";
  actorIP: string;
  description: string;
  details: string;
  entityType: string | null;
  entityId: string | null;
  entityName: string | null;
  changes: { field: string; oldValue: string; newValue: string }[] | null;
  aiAnomaly: boolean;
  aiAnomalyNote: string | null;
}

/* ============================================================
 * Constants
 * ============================================================ */
const ACTION_CONFIG: Record<AuditAction, { label: string; icon: React.ReactNode; color: string }> = {
  create: { label: "Tạo mới", icon: <Plus className="w-3 h-3" />, color: "text-green-600 bg-green-50" },
  update: { label: "Cập nhật", icon: <Edit3 className="w-3 h-3" />, color: "text-blue-600 bg-blue-50" },
  delete: { label: "Xoá", icon: <Trash2 className="w-3 h-3" />, color: "text-red-600 bg-red-50" },
  login: { label: "Đăng nhập", icon: <LogIn className="w-3 h-3" />, color: "text-violet-600 bg-violet-50" },
  logout: { label: "Đăng xuất", icon: <LogOut className="w-3 h-3" />, color: "text-gray-600 bg-gray-100" },
  export: { label: "Xuất dữ liệu", icon: <Download className="w-3 h-3" />, color: "text-amber-600 bg-amber-50" },
  import: { label: "Nhập dữ liệu", icon: <Database className="w-3 h-3" />, color: "text-teal-600 bg-teal-50" },
  permission: { label: "Phân quyền", icon: <Key className="w-3 h-3" />, color: "text-orange-600 bg-orange-50" },
  config: { label: "Cấu hình", icon: <Settings className="w-3 h-3" />, color: "text-indigo-600 bg-indigo-50" },
  "api-call": { label: "API Call", icon: <Globe className="w-3 h-3" />, color: "text-cyan-600 bg-cyan-50" },
};

const SEVERITY_CONFIG: Record<AuditSeverity, { label: string; color: string; dot: string }> = {
  info: { label: "Thông tin", color: "text-blue-600 bg-blue-50", dot: "bg-blue-400" },
  warning: { label: "Cảnh báo", color: "text-amber-600 bg-amber-50", dot: "bg-amber-400" },
  critical: { label: "Nghiêm trọng", color: "text-red-600 bg-red-50", dot: "bg-red-500" },
};

const MODULE_CONFIG: Record<AuditModule, { label: string }> = {
  contacts: { label: "Liên hệ" },
  deals: { label: "Deals" },
  users: { label: "Người dùng" },
  settings: { label: "Cấu hình" },
  auth: { label: "Xác thực" },
  data: { label: "Dữ liệu" },
  integrations: { label: "Tích hợp" },
  automation: { label: "Tự động" },
};

/* ============================================================
 * Mock Data — 20 audit entries
 * ============================================================ */
const ENTRIES: AuditEntry[] = [
  {
    id: "au1", timestamp: "2026-03-03T10:32:15", action: "update", severity: "info", module: "deals",
    actor: "Nguyễn Văn An", actorType: "human", actorIP: "192.168.1.45",
    description: "Cập nhật deal TechCorp AI Phase 2", details: "Chuyển stage từ Negotiation sang Closed Won. Giá trị $120,000.",
    entityType: "Deal", entityId: "D-2026-0089", entityName: "TechCorp AI Phase 2",
    changes: [
      { field: "stage", oldValue: "Negotiation", newValue: "Closed Won" },
      { field: "close_date", oldValue: "2026-03-15", newValue: "2026-03-03" },
    ],
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au2", timestamp: "2026-03-03T10:28:00", action: "login", severity: "warning", module: "auth",
    actor: "unknown@external.com", actorType: "human", actorIP: "45.67.89.123",
    description: "Đăng nhập thất bại 5 lần liên tiếp", details: "IP 45.67.89.123 (Nigeria). Tài khoản tạm khoá 30 phút.",
    entityType: "User", entityId: null, entityName: "unknown@external.com",
    changes: null,
    aiAnomaly: true, aiAnomalyNote: "Brute-force attempt detected. IP đã được thêm vào watchlist. Recommend: enable geo-blocking cho khu vực này.",
  },
  {
    id: "au3", timestamp: "2026-03-03T10:15:42", action: "export", severity: "info", module: "data",
    actor: "Hoàng Thị Mai", actorType: "human", actorIP: "192.168.1.22",
    description: "Xuất báo cáo Pipeline Q1 2026", details: "186 deals exported dạng XLSX. File size 2.1 MB.",
    entityType: "Report", entityId: "RPT-Q1-2026", entityName: "Pipeline Report Q1",
    changes: null,
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au4", timestamp: "2026-03-03T09:58:30", action: "delete", severity: "critical", module: "contacts",
    actor: "Trần Đức Hùng", actorType: "human", actorIP: "192.168.1.10",
    description: "Xoá hàng loạt 45 contacts inactive", details: "Bulk delete 45 contacts có last_activity > 365 ngày. Đã backup trước khi xoá.",
    entityType: "Contact", entityId: null, entityName: "Bulk: 45 contacts",
    changes: null,
    aiAnomaly: true, aiAnomalyNote: "Bulk delete bất thường. 45 records là 3.2% tổng contacts. Đã tạo backup tự động. Recommend: review retention policy.",
  },
  {
    id: "au5", timestamp: "2026-03-03T09:45:00", action: "create", severity: "info", module: "contacts",
    actor: "AI Agent — Nova", actorType: "ai-agent", actorIP: "internal",
    description: "Tạo 85 contacts từ API webhook", details: "Auto-import từ scheduled job. 85/85 records validated. 0 duplicates.",
    entityType: "Contact", entityId: null, entityName: "Batch: 85 contacts",
    changes: null,
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au6", timestamp: "2026-03-03T09:30:12", action: "permission", severity: "warning", module: "users",
    actor: "Trần Đức Hùng", actorType: "human", actorIP: "192.168.1.10",
    description: "Thay đổi quyền cho Phạm Thanh Tùng", details: "Nâng quyền từ Sales Rep lên Sales Manager. Thêm quyền: approve_quotations, view_commissions.",
    entityType: "User", entityId: "USR-PTT", entityName: "Phạm Thanh Tùng",
    changes: [
      { field: "role", oldValue: "Sales Rep", newValue: "Sales Manager" },
      { field: "permissions", oldValue: "basic_crm", newValue: "basic_crm, approve_quotations, view_commissions" },
    ],
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au7", timestamp: "2026-03-03T09:15:00", action: "login", severity: "info", module: "auth",
    actor: "Nguyễn Văn An", actorType: "human", actorIP: "192.168.1.45",
    description: "Đăng nhập thành công", details: "2FA verified. Device: MacBook Pro, Chrome 120.",
    entityType: null, entityId: null, entityName: null,
    changes: null,
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au8", timestamp: "2026-03-03T08:55:30", action: "config", severity: "warning", module: "settings",
    actor: "Lê Minh Cường", actorType: "human", actorIP: "192.168.1.33",
    description: "Thay đổi cấu hình email SMTP", details: "Cập nhật SMTP server từ smtp.old.com sang smtp.new.com. Test email sent successfully.",
    entityType: "Config", entityId: "CFG-EMAIL", entityName: "Email SMTP",
    changes: [
      { field: "smtp_host", oldValue: "smtp.old.com", newValue: "smtp.new.com" },
      { field: "smtp_port", oldValue: "587", newValue: "465" },
    ],
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au9", timestamp: "2026-03-03T08:30:00", action: "api-call", severity: "info", module: "integrations",
    actor: "System — Webhook", actorType: "system", actorIP: "api.hubspot.com",
    description: "HubSpot webhook received", details: "Contact updated event. 3 fields synced: email, phone, company.",
    entityType: "Integration", entityId: "INT-HUBSPOT", entityName: "HubSpot Sync",
    changes: null,
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au10", timestamp: "2026-03-03T07:00:00", action: "create", severity: "info", module: "automation",
    actor: "AI Agent — Nova", actorType: "ai-agent", actorIP: "internal",
    description: "Auto-assign 12 leads mới", details: "Round-robin assignment: An (4), Mai (4), Tùng (4). Dựa trên workload balancing.",
    entityType: "Lead", entityId: null, entityName: "Batch: 12 leads",
    changes: null,
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au11", timestamp: "2026-03-02T22:15:00", action: "login", severity: "critical", module: "auth",
    actor: "admin@company.com", actorType: "human", actorIP: "103.25.67.89",
    description: "Đăng nhập admin ngoài giờ từ IP lạ", details: "IP 103.25.67.89 (Hà Nội). Thời gian: 22:15 — ngoài giờ làm việc. 2FA passed.",
    entityType: null, entityId: null, entityName: null,
    changes: null,
    aiAnomaly: true, aiAnomalyNote: "Đăng nhập admin lúc 22:15 từ IP không quen. Dù 2FA passed, recommend: verify với admin và review session logs.",
  },
  {
    id: "au12", timestamp: "2026-03-02T17:45:00", action: "export", severity: "warning", module: "data",
    actor: "Đỗ Hải Yến", actorType: "human", actorIP: "192.168.1.55",
    description: "Xuất toàn bộ contacts (2,438 records)", details: "Full export dạng CSV. Bao gồm email, phone, company. File 4.8 MB.",
    entityType: "Contact", entityId: null, entityName: "Full Contact Export",
    changes: null,
    aiAnomaly: true, aiAnomalyNote: "Full PII export. Đây là lần đầu user này export toàn bộ contacts. Recommend: verify purpose, check DLP policy.",
  },
  {
    id: "au13", timestamp: "2026-03-02T16:30:00", action: "update", severity: "info", module: "deals",
    actor: "Hoàng Thị Mai", actorType: "human", actorIP: "192.168.1.22",
    description: "Cập nhật giá trị deal MediSys", details: "Tăng giá trị từ $120K lên $135K do thêm Mobile App scope.",
    entityType: "Deal", entityId: "D-2026-0086", entityName: "MediSys EMR Phase 2",
    changes: [
      { field: "amount", oldValue: "$120,000", newValue: "$135,000" },
      { field: "scope", oldValue: "EMR Phase 2", newValue: "EMR Phase 2 + Mobile App" },
    ],
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au14", timestamp: "2026-03-02T15:00:00", action: "import", severity: "info", module: "data",
    actor: "Nguyễn Hoàng Nam", actorType: "human", actorIP: "192.168.1.60",
    description: "Import 2,450 contacts từ HubSpot", details: "CSV import. 2,438 thành công, 12 lỗi (thiếu email). 3 duplicates merged.",
    entityType: "Contact", entityId: null, entityName: "HubSpot Migration",
    changes: null,
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au15", timestamp: "2026-03-02T14:20:00", action: "delete", severity: "warning", module: "deals",
    actor: "Phạm Thanh Tùng", actorType: "human", actorIP: "192.168.1.48",
    description: "Xoá deal LogiTrack — Lost", details: "Deal marked as Lost. Reason: competitor won (25% discount). Archived, not permanently deleted.",
    entityType: "Deal", entityId: "D-2026-0081", entityName: "LogiTrack Volume Deal",
    changes: [{ field: "status", oldValue: "Negotiation", newValue: "Lost (Archived)" }],
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au16", timestamp: "2026-03-02T11:00:00", action: "config", severity: "critical", module: "settings",
    actor: "Trần Đức Hùng", actorType: "human", actorIP: "192.168.1.10",
    description: "Tắt 2FA cho toàn bộ tổ chức", details: "2FA enforcement disabled. Reason: testing SSO integration. Duration: 2 hours.",
    entityType: "Config", entityId: "CFG-2FA", entityName: "Two-Factor Authentication",
    changes: [{ field: "2fa_enforced", oldValue: "true", newValue: "false" }],
    aiAnomaly: true, aiAnomalyNote: "CRITICAL: 2FA bị tắt. Dù có lý do testing, recommend: không bao giờ tắt 2FA toàn org. Dùng test group thay thế.",
  },
  {
    id: "au17", timestamp: "2026-03-02T09:00:00", action: "api-call", severity: "info", module: "integrations",
    actor: "System — Cron", actorType: "system", actorIP: "internal",
    description: "Slack notification sync", details: "42 notifications pushed to Slack #crm-alerts. 0 failures.",
    entityType: "Integration", entityId: "INT-SLACK", entityName: "Slack Sync",
    changes: null,
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au18", timestamp: "2026-03-01T16:45:00", action: "create", severity: "info", module: "deals",
    actor: "Nguyễn Văn An", actorType: "human", actorIP: "192.168.1.45",
    description: "Tạo deal mới: EduTech LMS Integration", details: "Giá trị $45,000. Stage: Qualification. Source: Referral.",
    entityType: "Deal", entityId: "D-2026-0090", entityName: "EduTech LMS Integration",
    changes: null,
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au19", timestamp: "2026-03-01T10:30:00", action: "permission", severity: "info", module: "users",
    actor: "System — Auto", actorType: "system", actorIP: "internal",
    description: "Auto-revoke API key expired", details: "API key của integration HubSpot hết hạn. Auto-revoked. New key generated.",
    entityType: "APIKey", entityId: "KEY-HUB-001", entityName: "HubSpot API Key",
    changes: [{ field: "status", oldValue: "active", newValue: "revoked (expired)" }],
    aiAnomaly: false, aiAnomalyNote: null,
  },
  {
    id: "au20", timestamp: "2026-03-01T08:00:00", action: "logout", severity: "info", module: "auth",
    actor: "Lê Minh Cường", actorType: "human", actorIP: "192.168.1.33",
    description: "Session timeout — auto logout", details: "Inactive 30 minutes. Session terminated.",
    entityType: null, entityId: null, entityName: null,
    changes: null,
    aiAnomaly: false, aiAnomalyNote: null,
  },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const ACTION_CHART = Object.entries(ACTION_CONFIG)
  .map(([key, cfg]) => ({ name: cfg.label, count: ENTRIES.filter((e) => e.action === key).length }))
  .filter((d) => d.count > 0)
  .sort((a, b) => b.count - a.count);
const ACTION_COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#8b5cf6", "#6b7280", "#f59e0b", "#14b8a6", "#f97316", "#6366f1", "#06b6d4"];

const HOURLY_ACTIVITY = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}h`,
  count: ENTRIES.filter((e) => new Date(e.timestamp).getHours() === h).length,
}));

const SEVERITY_PIE = Object.entries(SEVERITY_CONFIG)
  .map(([key, cfg]) => ({ name: cfg.label, value: ENTRIES.filter((e) => e.severity === key).length }))
  .filter((d) => d.value > 0);
const SEV_COLORS = ["#3b82f6", "#f59e0b", "#ef4444"];

/* ============================================================
 * Detail Modal
 * ============================================================ */
function AuditDetailModal({ entry, onClose }: { entry: AuditEntry; onClose: () => void }) {
  const aCfg = ACTION_CONFIG[entry.action];
  const sCfg = SEVERITY_CONFIG[entry.severity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${aCfg.color}`}>{aCfg.icon}</span>
            <div>
              <h3 className="text-gray-900 text-sm">{aCfg.label}</h3>
              <p className="text-[9px] text-gray-400">{new Date(entry.timestamp).toLocaleString("vi-VN")}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <p className="text-sm text-gray-800">{entry.description}</p>
          <p className="text-xs text-gray-600">{entry.details}</p>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[8px] px-1.5 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{MODULE_CONFIG[entry.module].label}</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded ${
              entry.actorType === "ai-agent" ? "bg-violet-50 text-violet-600" :
              entry.actorType === "system" ? "bg-cyan-50 text-cyan-600" : "bg-blue-50 text-blue-600"
            }`}>
              {entry.actorType === "ai-agent" ? "🤖 AI Agent" : entry.actorType === "system" ? "⚙️ System" : "👤 Human"}
            </span>
            {entry.aiAnomaly && (
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-50 text-red-600">⚠️ AI Anomaly</span>
            )}
          </div>

          {/* Actor Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Người thực hiện</p>
              <p className="text-xs text-gray-800">{entry.actor}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">IP Address</p>
              <p className="text-xs text-gray-800 font-mono">{entry.actorIP}</p>
            </div>
          </div>

          {/* Entity */}
          {entry.entityName && (
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Đối tượng</p>
              <p className="text-xs text-gray-800">{entry.entityType}: {entry.entityName}</p>
              {entry.entityId && <p className="text-[8px] text-gray-400 font-mono">{entry.entityId}</p>}
            </div>
          )}

          {/* Changes */}
          {entry.changes && entry.changes.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-3 py-1.5">
                <p className="text-xs text-gray-600">Thay đổi dữ liệu</p>
              </div>
              <div className="divide-y divide-gray-100">
                {entry.changes.map((ch, i) => (
                  <div key={i} className="px-3 py-2 text-xs">
                    <p className="text-gray-500 mb-0.5">{ch.field}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded line-through text-[10px]">{ch.oldValue}</span>
                      <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                      <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[10px]">{ch.newValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Anomaly */}
          {entry.aiAnomaly && entry.aiAnomalyNote && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100 p-3">
              <p className="text-xs text-red-800 flex items-start gap-1.5">
                <Bot className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                <span><span className="text-red-900">AI Anomaly Detection:</span> {entry.aiAnomalyNote}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function AuditLogPage() {
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState<AuditAction | "">("");
  const [filterSeverity, setFilterSeverity] = useState<AuditSeverity | "">("");
  const [filterActor, setFilterActor] = useState<"" | "human" | "ai-agent" | "system">("");

  const stats = useMemo(() => ({
    total: ENTRIES.length,
    anomalies: ENTRIES.filter((e) => e.aiAnomaly).length,
    critical: ENTRIES.filter((e) => e.severity === "critical").length,
    aiActions: ENTRIES.filter((e) => e.actorType === "ai-agent").length,
  }), []);

  const filtered = useMemo(() => {
    let result = [...ENTRIES];
    if (filterAction) result = result.filter((e) => e.action === filterAction);
    if (filterSeverity) result = result.filter((e) => e.severity === filterSeverity);
    if (filterActor) result = result.filter((e) => e.actorType === filterActor);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) =>
        e.description.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q) ||
        (e.entityName && e.entityName.toLowerCase().includes(q)));
    }
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filterAction, filterSeverity, filterActor, search]);

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-violet-600" /> Nhật ký Kiểm toán
          </h1>
          <p className="text-gray-500 mt-0.5">
            Activity timeline, security events, AI anomaly detection, compliance audit trail
          </p>
        </div>
        <button type="button" onClick={() => toast.success("Đang xuất audit log...")}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
          <Download className="w-4 h-4" /> Xuất Log
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng sự kiện</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.anomalies > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <AlertTriangle className="w-4 h-4 text-red-500 mb-1" />
          <p className={`text-lg ${stats.anomalies > 0 ? "text-red-600" : "text-green-600"}`}>{stats.anomalies}</p>
          <p className="text-xs text-gray-600">AI Anomalies</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.critical > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
          <p className="text-lg text-gray-900">{stats.critical}</p>
          <p className="text-xs text-gray-600">Sự kiện nghiêm trọng</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-3">
          <Bot className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.aiActions}</p>
          <p className="text-xs text-violet-700">AI Agent actions</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Theo Hành động</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ACTION_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-20} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {ACTION_CHART.map((_, i) => <Cell key={i} fill={ACTION_COLORS[i % ACTION_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Theo Mức độ</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={SEVERITY_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={65} innerRadius={25}
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {SEVERITY_PIE.map((_, i) => <Cell key={i} fill={SEV_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Hoạt động theo Giờ</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={HOURLY_ACTIVITY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 8 }} interval={2} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {(["", "info", "warning", "critical"] as (AuditSeverity | "")[]).map((s) => (
              <button key={s} type="button" onClick={() => setFilterSeverity(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  filterSeverity === s ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {s === "" ? "Tất cả" : SEVERITY_CONFIG[s].label}
              </button>
            ))}
          </div>
          <select value={filterAction} onChange={(e) => setFilterAction(e.target.value as AuditAction | "")}
            className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả hành động</option>
            {Object.entries(ACTION_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <select value={filterActor} onChange={(e) => setFilterActor(e.target.value as "" | "human" | "ai-agent" | "system")}
            className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả actor</option>
            <option value="human">👤 Con người</option>
            <option value="ai-agent">🤖 AI Agent</option>
            <option value="system">⚙️ System</option>
          </select>
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm sự kiện..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {filtered.map((entry) => {
          const aCfg = ACTION_CONFIG[entry.action];
          const sCfg = SEVERITY_CONFIG[entry.severity];
          return (
            <div key={entry.id}
              className={`bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow cursor-pointer ${
                entry.aiAnomaly ? "border-red-200" : "border-gray-100"
              }`}
              onClick={() => setSelectedEntry(entry)}>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${aCfg.color}`}>
                    {aCfg.icon}
                  </div>
                  <div className={`w-0.5 h-6 mt-1 ${sCfg.dot} opacity-30`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-[8px] px-1.5 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{MODULE_CONFIG[entry.module].label}</span>
                    {entry.aiAnomaly && <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-50 text-red-600">⚠️ Anomaly</span>}
                    <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                      entry.actorType === "ai-agent" ? "bg-violet-50 text-violet-600" :
                      entry.actorType === "system" ? "bg-cyan-50 text-cyan-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {entry.actorType === "ai-agent" ? "🤖" : entry.actorType === "system" ? "⚙️" : "👤"} {entry.actor.length > 20 ? entry.actor.slice(0, 20) + "…" : entry.actor}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-1">{entry.description}</p>
                  {entry.changes && entry.changes.length > 0 && (
                    <p className="text-[9px] text-gray-400 mt-0.5">{entry.changes.length} field(s) changed</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[9px] text-gray-400">{new Date(entry.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="text-[8px] text-gray-300">{new Date(entry.timestamp).toLocaleDateString("vi-VN")}</p>
                  <p className="text-[7px] text-gray-300 font-mono mt-0.5">{entry.actorIP}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy sự kiện phù hợp</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Security Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            4 anomalies detected. Brute-force attempt từ Nigeria, admin login ngoài giờ, bulk PII export, và 2FA disabled — cần review ngay.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            2FA bị tắt lúc 11:00. Nếu chưa bật lại, recommend bật ngay và dùng test group cho SSO testing thay vì tắt toàn org.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            AI Agent tự động xử lý 97 actions (lead assignment + webhook sync) mà không có anomaly nào. Automation coverage: 15%.
          </p>
        </div>
      </div>

      {selectedEntry && <AuditDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
    </div>
  );
}
