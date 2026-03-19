/**
 * Trang SLA Tracking — Theo dõi cam kết SLA với khách hàng.
 * Bao gồm: SLA dashboard, compliance rate, breach alerts, timeline,
 * per-client SLA status, AI predictions.
 * Phase 1: Mock data + interactive monitoring UI.
 */
import { useState, useMemo, useCallback } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Building2,
  Timer,
  Zap,
  Bot,
  Sparkles,
  Eye,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  BarChart3,
  Bell,
  ChevronRight,
  Filter,
  Search,
  Users,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import type { ColumnDef } from "../../types/dataTable";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type SLAStatus = "healthy" | "warning" | "breached" | "at-risk";
type SLAMetricType = "response-time" | "resolution-time" | "uptime" | "delivery" | "bug-fix";

interface SLAMetric {
  id: string;
  type: SLAMetricType;
  label: string;
  target: number;
  actual: number;
  unit: string;
  status: SLAStatus;
}

interface ClientSLA {
  id: string;
  clientName: string;
  clientCompany: string;
  contractType: string;
  startDate: string;
  endDate: string;
  overallScore: number;
  overallStatus: SLAStatus;
  metrics: SLAMetric[];
  breachCount: number;
  lastBreachDate: string | null;
  aiPrediction: string;
  monthlyTrend: number[];
}

interface SLAAlert {
  id: string;
  clientName: string;
  metric: string;
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  resolved: boolean;
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CONFIG: Record<SLAStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  healthy: { label: "Đạt chuẩn", color: "text-green-600", bgColor: "bg-green-50 border-green-200", icon: <CheckCircle2 className="w-4 h-4" /> },
  warning: { label: "Cảnh báo", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200", icon: <AlertTriangle className="w-4 h-4" /> },
  "at-risk": { label: "Nguy cơ", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200", icon: <AlertCircle className="w-4 h-4" /> },
  breached: { label: "Vi phạm", color: "text-red-600", bgColor: "bg-red-50 border-red-200", icon: <XCircle className="w-4 h-4" /> },
};

const METRIC_TYPE_LABELS: Record<SLAMetricType, string> = {
  "response-time": "Thời gian phản hồi",
  "resolution-time": "Thời gian giải quyết",
  uptime: "Uptime hệ thống",
  delivery: "Đúng hạn delivery",
  "bug-fix": "Sửa lỗi nghiêm trọng",
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  critical: { label: "Nghiêm trọng", color: "text-red-600", bgColor: "bg-red-50" },
  warning: { label: "Cảnh báo", color: "text-amber-600", bgColor: "bg-amber-50" },
  info: { label: "Thông tin", color: "text-blue-600", bgColor: "bg-blue-50" },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const CLIENT_SLAS: ClientSLA[] = [
  {
    id: "sla1", clientName: "David Chen", clientCompany: "TechCorp Inc.",
    contractType: "Enterprise Outsource", startDate: "2025-07-01", endDate: "2026-06-30",
    overallScore: 96, overallStatus: "healthy", breachCount: 1, lastBreachDate: "2025-11-15",
    aiPrediction: "Dự đoán duy trì SLA 97%+ trong Q2/2026. Không có nguy cơ breach.",
    monthlyTrend: [94, 95, 97, 96, 98, 96],
    metrics: [
      { id: "m1", type: "response-time", label: "Phản hồi ticket", target: 4, actual: 2.8, unit: "giờ", status: "healthy" },
      { id: "m2", type: "resolution-time", label: "Giải quyết bug", target: 24, actual: 18, unit: "giờ", status: "healthy" },
      { id: "m3", type: "delivery", label: "Sprint delivery", target: 95, actual: 96, unit: "%", status: "healthy" },
      { id: "m4", type: "bug-fix", label: "Critical bug fix", target: 8, actual: 6, unit: "giờ", status: "healthy" },
    ],
  },
  {
    id: "sla2", clientName: "Sarah Miller", clientCompany: "InnovateAI",
    contractType: "ML Project Outsource", startDate: "2025-10-01", endDate: "2026-09-30",
    overallScore: 88, overallStatus: "warning", breachCount: 3, lastBreachDate: "2026-02-20",
    aiPrediction: "Nguy cơ breach resolution-time trong 2 tuần nếu không bổ sung thêm 1 senior dev.",
    monthlyTrend: [92, 90, 88, 86, 85, 88],
    metrics: [
      { id: "m5", type: "response-time", label: "Phản hồi ticket", target: 4, actual: 3.5, unit: "giờ", status: "healthy" },
      { id: "m6", type: "resolution-time", label: "Giải quyết bug", target: 24, actual: 28, unit: "giờ", status: "breached" },
      { id: "m7", type: "delivery", label: "Sprint delivery", target: 90, actual: 88, unit: "%", status: "warning" },
      { id: "m8", type: "uptime", label: "Staging uptime", target: 99.5, actual: 99.2, unit: "%", status: "warning" },
    ],
  },
  {
    id: "sla3", clientName: "Tanaka Yuki", clientCompany: "GlobalSoft Japan",
    contractType: "WMS Product License", startDate: "2025-09-01", endDate: "2026-08-31",
    overallScore: 99, overallStatus: "healthy", breachCount: 0, lastBreachDate: null,
    aiPrediction: "SLA xuất sắc. Gợi ý: sử dụng làm case study cho market Nhật Bản.",
    monthlyTrend: [98, 99, 99, 100, 99, 99],
    metrics: [
      { id: "m9", type: "response-time", label: "Phản hồi ticket", target: 2, actual: 1.2, unit: "giờ", status: "healthy" },
      { id: "m10", type: "uptime", label: "System uptime", target: 99.9, actual: 99.95, unit: "%", status: "healthy" },
      { id: "m11", type: "bug-fix", label: "Critical bug fix", target: 4, actual: 2, unit: "giờ", status: "healthy" },
    ],
  },
  {
    id: "sla4", clientName: "Robert Kim", clientCompany: "FinServe Korea",
    contractType: "API Integration", startDate: "2026-01-01", endDate: "2026-12-31",
    overallScore: 82, overallStatus: "at-risk", breachCount: 4, lastBreachDate: "2026-03-01",
    aiPrediction: "SLA nguy cơ cao. 65% khả năng breach delivery target trong sprint tới nếu không điều chỉnh scope.",
    monthlyTrend: [90, 87, 84, 82],
    metrics: [
      { id: "m12", type: "response-time", label: "Phản hồi ticket", target: 4, actual: 5.2, unit: "giờ", status: "breached" },
      { id: "m13", type: "resolution-time", label: "Giải quyết bug", target: 24, actual: 32, unit: "giờ", status: "breached" },
      { id: "m14", type: "delivery", label: "Sprint delivery", target: 90, actual: 78, unit: "%", status: "breached" },
      { id: "m15", type: "bug-fix", label: "Critical bug fix", target: 8, actual: 10, unit: "giờ", status: "warning" },
    ],
  },
  {
    id: "sla5", clientName: "Trần Quốc Bảo", clientCompany: "MediSys",
    contractType: "EMR Product + Support", startDate: "2025-06-01", endDate: "2026-05-31",
    overallScore: 94, overallStatus: "healthy", breachCount: 2, lastBreachDate: "2025-12-10",
    aiPrediction: "SLA ổn định. Lưu ý: contract hết hạn T5/2026, chuẩn bị gia hạn.",
    monthlyTrend: [91, 93, 94, 95, 94, 94],
    metrics: [
      { id: "m16", type: "response-time", label: "Phản hồi ticket", target: 2, actual: 1.8, unit: "giờ", status: "healthy" },
      { id: "m17", type: "uptime", label: "EMR uptime", target: 99.9, actual: 99.85, unit: "%", status: "warning" },
      { id: "m18", type: "resolution-time", label: "Giải quyết bug", target: 12, actual: 10, unit: "giờ", status: "healthy" },
      { id: "m19", type: "bug-fix", label: "Critical bug fix", target: 4, actual: 3.5, unit: "giờ", status: "healthy" },
    ],
  },
  {
    id: "sla6", clientName: "Emma Wilson", clientCompany: "DigitalWave EU",
    contractType: "DX Consulting + Dev", startDate: "2025-11-01", endDate: "2026-10-31",
    overallScore: 75, overallStatus: "breached", breachCount: 7, lastBreachDate: "2026-03-02",
    aiPrediction: "SLA vi phạm nghiêm trọng. Cần escalation Level 2 ngay. Gợi ý: họp executive với client tuần này.",
    monthlyTrend: [88, 85, 80, 78, 75],
    metrics: [
      { id: "m20", type: "response-time", label: "Phản hồi ticket", target: 4, actual: 8, unit: "giờ", status: "breached" },
      { id: "m21", type: "resolution-time", label: "Giải quyết bug", target: 24, actual: 48, unit: "giờ", status: "breached" },
      { id: "m22", type: "delivery", label: "Sprint delivery", target: 90, actual: 72, unit: "%", status: "breached" },
      { id: "m23", type: "uptime", label: "Staging uptime", target: 99, actual: 97.5, unit: "%", status: "breached" },
    ],
  },
];

const SLA_ALERTS: SLAAlert[] = [
  { id: "a1", clientName: "DigitalWave EU", metric: "Sprint delivery", severity: "critical",
    message: "Sprint 12 chỉ hoàn thành 72% (target 90%). Lần vi phạm thứ 7.", timestamp: "2026-03-02T14:30:00", resolved: false },
  { id: "a2", clientName: "FinServe Korea", metric: "Phản hồi ticket", severity: "critical",
    message: "Ticket #FK-234 phản hồi sau 5.2h (target 4h). Team thiếu người trực.", timestamp: "2026-03-01T09:15:00", resolved: false },
  { id: "a3", clientName: "InnovateAI", metric: "Giải quyết bug", severity: "warning",
    message: "Bug #IA-089 giải quyết 28h (target 24h). Cần review quy trình escalation.", timestamp: "2026-02-28T16:00:00", resolved: false },
  { id: "a4", clientName: "MediSys", metric: "EMR uptime", severity: "warning",
    message: "Uptime tháng 2 đạt 99.85% (target 99.9%). Nguyên nhân: maintenance ngoài kế hoạch.", timestamp: "2026-02-27T08:00:00", resolved: true },
  { id: "a5", clientName: "DigitalWave EU", metric: "Phản hồi ticket", severity: "critical",
    message: "3 ticket liên tiếp phản hồi trên 6h. Pattern lặp lại — cần review staffing.", timestamp: "2026-02-25T11:30:00", resolved: false },
  { id: "a6", clientName: "FinServe Korea", metric: "Sprint delivery", severity: "warning",
    message: "Sprint 8 hoàn thành 78%. Scope quá lớn so với capacity.", timestamp: "2026-02-20T17:00:00", resolved: true },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const COMPLIANCE_TREND = [
  { month: "T10", compliance: 94, breaches: 2 },
  { month: "T11", compliance: 92, breaches: 3 },
  { month: "T12", compliance: 90, breaches: 4 },
  { month: "T1", compliance: 91, breaches: 3 },
  { month: "T2", compliance: 88, breaches: 5 },
  { month: "T3", compliance: 89, breaches: 4 },
];

const STATUS_DISTRIBUTION = [
  { name: "Đạt chuẩn", value: 3, fill: "#22c55e" },
  { name: "Cảnh báo", value: 1, fill: "#f59e0b" },
  { name: "Nguy cơ", value: 1, fill: "#f97316" },
  { name: "Vi phạm", value: 1, fill: "#ef4444" },
];

/* ============================================================
 * Client SLA Card
 * ============================================================ */
function ClientSLACard({ client, onView }: {
  client: ClientSLA;
  onView: (c: ClientSLA) => void;
}) {
  const sCfg = STATUS_CONFIG[client.overallStatus];

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onView(client)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm text-gray-900 truncate">{client.clientCompany}</h4>
          <p className="text-xs text-gray-500">{client.contractType}</p>
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${sCfg.bgColor} ${sCfg.color}`}>
          {sCfg.icon} {sCfg.label}
        </span>
      </div>

      {/* Score circle */}
      <div className="flex items-center gap-4 mb-3">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="#f3f4f6" strokeWidth="4" />
            <circle cx="28" cy="28" r="24" fill="none"
              stroke={client.overallScore >= 90 ? "#22c55e" : client.overallScore >= 80 ? "#f59e0b" : "#ef4444"}
              strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${(client.overallScore / 100) * 150.8} 150.8`} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-900">
            {client.overallScore}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          {/* Mini sparkline with trend */}
          <div className="flex items-end gap-0.5 h-6">
            {client.monthlyTrend.map((v, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t ${
                  v >= 95 ? "bg-green-400" : v >= 85 ? "bg-amber-400" : "bg-red-400"
                }`}
                style={{ height: `${(v / 100) * 100}%` }}
              />
            ))}
          </div>
          <p className="text-[9px] text-gray-400 mt-0.5">Trend 6 tháng</p>
        </div>
      </div>

      {/* Metrics summary */}
      <div className="grid grid-cols-2 gap-1.5">
        {client.metrics.slice(0, 4).map((m) => {
          const mCfg = STATUS_CONFIG[m.status];
          return (
            <div key={m.id} className="flex items-center gap-1 text-[10px]">
              <span className={mCfg.color}>{mCfg.icon}</span>
              <span className="text-gray-500 truncate">{METRIC_TYPE_LABELS[m.type]}</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50 text-[10px] text-gray-400">
        <span>Vi phạm: <span className={client.breachCount > 3 ? "text-red-500" : "text-gray-600"}>{client.breachCount}</span></span>
        <span>HĐ: {new Date(client.endDate).toLocaleDateString("vi-VN", { month: "short", year: "numeric" })}</span>
      </div>
    </div>
  );
}

/* ============================================================
 * Client SLA Detail Modal
 * ============================================================ */
function SLADetailModal({ client, onClose }: {
  client: ClientSLA;
  onClose: () => void;
}) {
  const sCfg = STATUS_CONFIG[client.overallStatus];
  const clientAlerts = SLA_ALERTS.filter((a) => a.clientName === client.clientCompany || a.clientName === client.clientName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-gray-900">{client.clientCompany}</h3>
              <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${sCfg.bgColor} ${sCfg.color}`}>
                {sCfg.icon} {sCfg.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{client.contractType} · {client.clientName}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Score + Contract */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className={`text-2xl ${client.overallScore >= 90 ? "text-green-600" : client.overallScore >= 80 ? "text-amber-600" : "text-red-600"}`}>
                {client.overallScore}%
              </p>
              <p className="text-[10px] text-gray-400">SLA Score</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className={`text-2xl ${client.breachCount > 3 ? "text-red-600" : "text-gray-900"}`}>
                {client.breachCount}
              </p>
              <p className="text-[10px] text-gray-400">Vi phạm</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-900">
                {new Date(client.endDate).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-[10px] text-gray-400">Hết hạn HĐ</p>
            </div>
          </div>

          {/* Metrics detail */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Chi tiết SLA Metrics
            </h4>
            <div className="space-y-2">
              {client.metrics.map((m) => {
                const mCfg = STATUS_CONFIG[m.status];
                const isTime = m.unit === "giờ";
                const pct = isTime
                  ? Math.max(0, Math.min(100, (1 - m.actual / (m.target * 2)) * 100))
                  : (m.actual / m.target) * 100;
                const isGood = isTime ? m.actual <= m.target : m.actual >= m.target;

                return (
                  <div key={m.id} className={`rounded-lg border p-3 ${mCfg.bgColor}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900 flex items-center gap-1">
                        {mCfg.icon} {m.label}
                      </span>
                      <span className={`text-xs ${mCfg.color}`}>{mCfg.label}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500">
                        Thực tế: <span className={isGood ? "text-green-600" : "text-red-600"}>{m.actual}{m.unit}</span>
                      </span>
                      <span className="text-gray-400">Target: {m.target}{m.unit}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isGood ? "bg-green-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(100, isTime ? (isGood ? 100 : (m.target / m.actual) * 100) : pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend sparkline bigger */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2">Xu hướng SLA Score</h4>
            <div className="flex items-end gap-1 h-12">
              {client.monthlyTrend.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t ${
                      v >= 95 ? "bg-green-400" : v >= 85 ? "bg-amber-400" : "bg-red-400"
                    }`}
                    style={{ height: `${((v - 60) / 40) * 48}px` }}
                  />
                  <span className="text-[8px] text-gray-400 mt-0.5">{v}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Alerts */}
          {clientAlerts.length > 0 && (
            <div>
              <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" /> Cảnh báo gần đây
              </h4>
              <div className="space-y-1.5">
                {clientAlerts.slice(0, 3).map((alert) => {
                  const sevCfg = SEVERITY_CONFIG[alert.severity];
                  return (
                    <div key={alert.id} className={`rounded-lg p-2 text-xs ${sevCfg.bgColor}`}>
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] px-1 py-0.5 rounded ${sevCfg.color}`}>{sevCfg.label}</span>
                        <span className="text-gray-400">{alert.metric}</span>
                        {alert.resolved && <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />}
                      </div>
                      <p className="text-gray-600 mt-0.5">{alert.message}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Prediction */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span><span className="text-violet-900">AI:</span> {client.aiPrediction}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create SLA Client Modal
 * ============================================================ */
function CreateSLAModal({ onClose, onCreated }: { onClose: () => void; onCreated: (sla: ClientSLA) => void }) {
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [contractType, setContractType] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10));
  const [metricTypes, setMetricTypes] = useState<SLAMetricType[]>(["response-time", "resolution-time"]);
  const [saving, setSaving] = useState(false);

  const toggleMetric = (type: SLAMetricType) => {
    setMetricTypes((prev) => prev.includes(type) ? prev.filter((m) => m !== type) : [...prev, type]);
  };

  const METRIC_DEFAULTS: Record<SLAMetricType, { target: number; unit: string }> = {
    "response-time": { target: 4, unit: "giờ" },
    "resolution-time": { target: 24, unit: "giờ" },
    uptime: { target: 99.9, unit: "%" },
    delivery: { target: 95, unit: "%" },
    "bug-fix": { target: 8, unit: "giờ" },
  };

  const handleSave = () => {
    if (!clientName.trim() || !clientCompany.trim()) { toast.error("Vui lòng nhập tên liên hệ và công ty"); return; }
    if (!contractType.trim()) { toast.error("Vui lòng nhập loại hợp đồng"); return; }
    if (metricTypes.length === 0) { toast.error("Vui lòng chọn ít nhất 1 metric SLA"); return; }
    setSaving(true);
    const metrics: SLAMetric[] = metricTypes.map((type, idx) => ({
      id: `m_${Date.now()}_${idx}`,
      type, label: METRIC_TYPE_LABELS[type],
      target: METRIC_DEFAULTS[type].target,
      actual: METRIC_DEFAULTS[type].target, // start at target
      unit: METRIC_DEFAULTS[type].unit,
      status: "healthy" as SLAStatus,
    }));
    const newSLA: ClientSLA = {
      id: `sla_${Date.now()}`, clientName, clientCompany, contractType,
      startDate, endDate,
      overallScore: 100, overallStatus: "healthy",
      metrics, breachCount: 0, lastBreachDate: null,
      aiPrediction: "SLA mới — chưa đủ dữ liệu để dự đoán. Theo dõi 30 ngày đầu.",
      monthlyTrend: [100],
    };
    onCreated(newSLA);
    toast.success(`Đã tạo SLA cho "${clientCompany}" với ${metrics.length} metrics`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo SLA Contract mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Người liên hệ *</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="VD: Nguyễn Văn A"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Công ty *</label>
              <input type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} placeholder="VD: TechCorp"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Loại hợp đồng *</label>
            <input type="text" value={contractType} onChange={(e) => setContractType(e.target.value)} placeholder="VD: Enterprise Outsource"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày bắt đầu</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày kết thúc</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Metrics SLA ({metricTypes.length}) *</label>
            <div className="space-y-1.5">
              {Object.entries(METRIC_TYPE_LABELS).map(([key, label]) => {
                const isSelected = metricTypes.includes(key as SLAMetricType);
                const defaults = METRIC_DEFAULTS[key as SLAMetricType];
                return (
                  <button key={key} type="button" onClick={() => toggleMetric(key as SLAMetricType)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-left text-sm transition-colors ${isSelected ? "border-violet-300 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-violet-600 border-violet-600" : "border-gray-300"}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={isSelected ? "text-violet-700" : "text-gray-600"}>{label}</span>
                    </div>
                    <span className="text-[9px] text-gray-400">Target: {defaults.target}{defaults.unit}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI sẽ tự động theo dõi các metrics và cảnh báo khi có nguy cơ vi phạm SLA.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo SLA Contract"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function SLATrackingPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<SLAStatus | "">("");
  const [selectedClient, setSelectedClient] = useState<ClientSLA | null>(null);
  const [showAlerts, setShowAlerts] = useState(true);
  const [clients, setClients] = useState(CLIENT_SLAS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { mode, setMode } = useViewMode("sla-tracking", "card");

  const filtered = useMemo(() => {
    let result = [...clients];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.clientCompany.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q),
      );
    }
    if (filterStatus) result = result.filter((c) => c.overallStatus === filterStatus);
    return result.sort((a, b) => a.overallScore - b.overallScore);
  }, [search, filterStatus, clients]);

  const stats = useMemo(() => {
    const avgScore = Math.round(clients.reduce((s, c) => s + c.overallScore, 0) / clients.length);
    const totalBreaches = clients.reduce((s, c) => s + c.breachCount, 0);
    const healthyCount = clients.filter((c) => c.overallStatus === "healthy").length;
    const unresolvedAlerts = SLA_ALERTS.filter((a) => !a.resolved).length;
    return { avgScore, totalBreaches, healthyCount, unresolvedAlerts };
  }, [clients]);

  const statusTabs: { key: SLAStatus | ""; label: string; count: number }[] = [
    { key: "", label: "Tất cả", count: clients.length },
    { key: "healthy", label: "Đạt chuẩn", count: clients.filter((c) => c.overallStatus === "healthy").length },
    { key: "warning", label: "Cảnh báo", count: clients.filter((c) => c.overallStatus === "warning").length },
    { key: "at-risk", label: "Nguy cơ", count: clients.filter((c) => c.overallStatus === "at-risk").length },
    { key: "breached", label: "Vi phạm", count: clients.filter((c) => c.overallStatus === "breached").length },
  ];

  const columns: ColumnDef<ClientSLA>[] = [
    {
      key: "clientCompany", header: "Công ty", sortable: true, minWidth: 200,
      render: (c) => (
        <div className="min-w-0">
          <p className="text-gray-900 truncate">{c.clientCompany}</p>
          <p className="text-[10px] text-gray-400 truncate">{c.contractType}</p>
        </div>
      ),
    },
    {
      key: "overallScore", header: "SLA Score", sortable: true, minWidth: 80,
      render: (c) => (
        <span className={`text-sm ${c.overallScore >= 90 ? "text-green-600" : c.overallScore >= 80 ? "text-amber-600" : "text-red-600"}`}>
          {c.overallScore}%
        </span>
      ),
      sortValue: (c) => c.overallScore,
    },
    {
      key: "overallStatus", header: "Trạng thái", sortable: true, minWidth: 110, editable: true,
      render: (c) => {
        const sCfg = STATUS_CONFIG[c.overallStatus];
        return <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${sCfg.bgColor} ${sCfg.color}`}>{sCfg.icon} {sCfg.label}</span>;
      },
      renderEdit: (item, _v, onChange, onSave) => (
        <select value={item.overallStatus} onChange={(e) => { onChange(e.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {Object.entries(STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
        </select>
      ),
    },
    {
      key: "breachCount", header: "Vi phạm", sortable: true, minWidth: 70,
      render: (c) => <span className={c.breachCount > 3 ? "text-red-500" : "text-gray-600"}>{c.breachCount}</span>,
      sortValue: (c) => c.breachCount,
    },
    {
      key: "clientName", header: "Liên hệ", sortable: true, minWidth: 130,
      render: (c) => <span className="text-gray-600 text-xs">{c.clientName}</span>,
    },
    {
      key: "endDate", header: "Hết hạn HĐ", sortable: true, minWidth: 100,
      render: (c) => <span className="text-gray-600 text-xs">{new Date(c.endDate).toLocaleDateString("vi-VN", { month: "short", year: "numeric" })}</span>,
    },
  ];

  const handleInlineEdit = useCallback((rowId: string, field: string, value: unknown) => {
    setClients((prev) => prev.map((c) => c.id === rowId ? { ...c, [field]: value } : c));
    toast.success("Đã cập nhật SLA");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setClients((prev) => prev.filter((c) => !deleteTarget.ids.includes(c.id)));
    toast.success(`Đã xóa ${deleteTarget.ids.length > 1 ? deleteTarget.ids.length + " SLA contracts" : "\"" + deleteTarget.label + "\""}`);
    setDeleteTarget(null);
    setDeleting(false);
  }, [deleteTarget]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-violet-600" /> SLA Tracking
          </h1>
          <p className="text-gray-500 mt-0.5">
            Theo dõi cam kết SLA với khách hàng — Compliance rate, breach alerts, AI predictions
          </p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 self-start">
          <Plus className="w-4 h-4" /> Tạo SLA
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <div className="flex items-center justify-between mb-1">
            <ShieldCheck className="w-4 h-4 text-violet-500" />
            <span className={`text-[10px] flex items-center gap-0.5 ${
              stats.avgScore >= 90 ? "text-green-600" : "text-amber-600"
            }`}>
              {stats.avgScore >= 90 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              vs tháng trước
            </span>
          </div>
          <p className={`text-lg ${stats.avgScore >= 90 ? "text-green-600" : "text-amber-600"}`}>
            {stats.avgScore}%
          </p>
          <p className="text-xs text-gray-500">SLA Score trung bình</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-green-700">{stats.healthyCount}/{clients.length}</p>
          <p className="text-xs text-gray-500">Clients đạt chuẩn</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.totalBreaches > 10 ? "bg-red-50 border-red-100" : "bg-white border-gray-100"}`}>
          <p className={`text-lg ${stats.totalBreaches > 10 ? "text-red-600" : "text-gray-900"}`}>{stats.totalBreaches}</p>
          <p className="text-xs text-gray-500">Tổng vi phạm</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.unresolvedAlerts > 3 ? "bg-amber-50 border-amber-100" : "bg-white border-gray-100"}`}>
          <p className={`text-lg ${stats.unresolvedAlerts > 3 ? "text-amber-600" : "text-gray-900"}`}>
            <Bell className="w-4 h-4 inline mr-1" />{stats.unresolvedAlerts}
          </p>
          <p className="text-xs text-gray-500">Cảnh báo chưa xử lý</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Compliance Trend */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-green-500" /> Xu hướng Compliance Rate
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={COMPLIANCE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[80, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="compliance" stroke="#6366f1" fill="#ede9fe"
                strokeWidth={2} name="Compliance %" dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-violet-500" /> Phân bố trạng thái SLA
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={STATUS_DISTRIBUTION} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                  {STATUS_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {STATUS_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                  <span className="flex-1 text-gray-600">{item.name}</span>
                  <span className="text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <button type="button" onClick={() => setShowAlerts(!showAlerts)}
          className="flex items-center justify-between w-full mb-2">
          <h3 className="text-sm text-gray-800 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-red-500" /> Cảnh báo SLA
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
              {stats.unresolvedAlerts} chưa xử lý
            </span>
          </h3>
          {showAlerts ? <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </button>
        {showAlerts && (
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {SLA_ALERTS.map((alert) => {
              const sevCfg = SEVERITY_CONFIG[alert.severity];
              return (
                <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg ${sevCfg.bgColor}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${sevCfg.color} bg-white/70`}>{sevCfg.label}</span>
                      <span className="text-xs text-gray-900">{alert.clientName}</span>
                      <span className="text-[10px] text-gray-400">· {alert.metric}</span>
                    </div>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      {new Date(alert.timestamp).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  {alert.resolved ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-100 text-green-600 flex-shrink-0">Đã xử lý</span>
                  ) : (
                    <button type="button" onClick={() => toast.success(`Đã đánh dấu xử lý alert cho ${alert.clientName}`)}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-white text-gray-500 hover:bg-gray-100 flex-shrink-0 border border-gray-200">
                      Xử lý
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter + Client Cards */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
            {statusTabs.map((tab) => (
              <button key={tab.key} type="button"
                onClick={() => setFilterStatus(tab.key as SLAStatus | "")}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  filterStatus === tab.key ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {tab.label} <span className="text-[10px] opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>
          <div className="relative min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm client..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <ViewToggle mode={mode} onSetMode={setMode} />
        </div>
      </div>

      {mode === "table" ? (
        <DataTable<ClientSLA>
          data={filtered}
          columns={columns}
          storageKey="sla-tracking-table"
          selectable
          onRowClick={setSelectedClient}
          onInlineEdit={handleInlineEdit}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} SLA contracts được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => setSelectedClient(item)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.clientCompany })} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không tìm thấy client phù hợp"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((client) => (
              <ClientSLACard key={client.id} client={client} onView={setSelectedClient} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không tìm thấy client phù hợp</p>
            </div>
          )}
        </>
      )}

      {/* AI Bottom Insight */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI SLA Predictions</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            DigitalWave EU cần escalation Level 2 ngay. SLA score dự đoán giảm xuống 70% nếu không hành động.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            FinServe Korea: bổ sung 1 senior dev sẽ cải thiện resolution-time 40%, đưa SLA về mức an toàn.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            GlobalSoft Japan đạt SLA xuất sắc 6 tháng liên tiếp. Gợi ý: đề xuất mở rộng hợp đồng.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedClient && (
        <SLADetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />
      )}
      {showCreateModal && <CreateSLAModal onClose={() => setShowCreateModal(false)} onCreated={(sla) => setClients((prev) => [sla, ...prev])} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.label ?? ""}
        entityType="SLA contract"
        description="Thao tác này không thể hoàn tác. Dữ liệu SLA sẽ bị đánh dấu xóa."
        loading={deleting}
      />
    </div>
  );
}