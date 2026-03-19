/**
 * Trang Customer Health Score — Chấm điểm sức khoẻ khách hàng,
 * churn prediction, engagement tracking, risk alerts, AI retention.
 * Features: DataTable + Card view, FilterBar, Pagination,
 *           Column Visibility, Inline Edit, Detail Modal,
 *           Charts, AI Insights, Delete đơn lẻ + bulk.
 * Phase 4 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  HeartPulse, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown,
  X, Bot, Sparkles, Activity, DollarSign,
  Users, Eye, Trash2, Plus, Calendar, Zap,
  BarChart3, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
  PieChart, Pie, AreaChart, Area,
} from "recharts";
import type { CustomerHealth, HealthLevel, ChurnRisk } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { HEALTH_LEVEL_CONFIG, CHURN_RISK_CONFIG } from "../../constants/crmConfig";
import {
  fetchCustomerHealthRecords, updateCustomerHealthRecord,
  deleteCustomerHealthRecords as apiDeleteRecords,
} from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Filter config
 * ============================================================ */
const HEALTH_FILTERS: FilterConfig[] = [
  {
    key: "level", label: "Sức khoẻ", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(HEALTH_LEVEL_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
  {
    key: "churnRisk", label: "Rủi ro rời bỏ", type: "select",
    options: Object.entries(CHURN_RISK_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Score bar helpers
 * ============================================================ */
function ScoreBar({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-1.5" : "h-2";
  const bg = value >= 80 ? "bg-green-500" : value >= 60 ? "bg-blue-500" : value >= 40 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className={`w-full ${h} bg-gray-100 rounded-full overflow-hidden`}>
      <div className={`${h} rounded-full transition-all ${bg}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-green-500" />;
  if (trend === "down") return <TrendingDown className="w-3 h-3 text-red-500" />;
  return <span className="w-3 h-3 text-gray-400">—</span>;
}

/* ============================================================
 * Column Definitions
 * ============================================================ */
const HEALTH_COLUMNS: ColumnDef<CustomerHealth>[] = [
  {
    key: "companyName", header: "Khách hàng", sortable: true, minWidth: 200,
    render: (c) => {
      const cfg = HEALTH_LEVEL_CONFIG[c.healthLevel];
      return (
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] text-white flex-shrink-0 ${
            c.healthLevel === "excellent" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
            c.healthLevel === "good" ? "bg-gradient-to-br from-blue-500 to-indigo-600" :
            c.healthLevel === "at-risk" ? "bg-gradient-to-br from-amber-500 to-orange-600" :
            "bg-gradient-to-br from-red-500 to-rose-600"
          }`}>{c.logo}</div>
          <div className="min-w-0">
            <p className="text-gray-900 truncate">{c.companyName}</p>
            <p className="text-[10px] text-gray-400 truncate">{c.industry} · {c.contactPerson}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: "healthScore", header: "Điểm", sortable: true, minWidth: 100,
    render: (c) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-[40px]"><ScoreBar value={c.healthScore} size="sm" /></div>
        <span className="text-[12px] text-gray-700 w-8 text-right">{c.healthScore}</span>
      </div>
    ),
    sortValue: (c) => c.healthScore,
  },
  {
    key: "healthLevel", header: "Cấp độ", sortable: true, minWidth: 100, editable: true,
    render: (c) => {
      const cfg = HEALTH_LEVEL_CONFIG[c.healthLevel];
      return <span className={`text-[11px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.healthLevel} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(HEALTH_LEVEL_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "churnRisk", header: "Rủi ro", sortable: true, minWidth: 90,
    render: (c) => {
      const cfg = CHURN_RISK_CONFIG[c.churnRisk];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.bgColor} ${cfg.color}`}>{c.churnProbability}%</span>;
    },
    sortValue: (c) => c.churnProbability,
  },
  {
    key: "mrr", header: "MRR", sortable: true, minWidth: 90,
    render: (c) => (
      <span className="text-gray-900 text-[13px] flex items-center gap-1">
        ${(c.mrr / 1000).toFixed(1)}K <TrendIcon trend={c.mrrTrend} />
      </span>
    ),
    sortValue: (c) => c.mrr,
  },
  {
    key: "daysSinceContact", header: "Liên hệ", sortable: true, minWidth: 80,
    render: (c) => (
      <span className={`text-[13px] ${c.daysSinceContact > 7 ? "text-red-600" : "text-gray-600"}`}>
        {c.daysSinceContact}d
      </span>
    ),
    sortValue: (c) => c.daysSinceContact,
  },
  {
    key: "npsScore", header: "NPS", sortable: true, minWidth: 50, defaultHidden: true,
    render: (c) => <span className={`text-[13px] ${(c.npsScore ?? 0) >= 8 ? "text-green-600" : (c.npsScore ?? 0) >= 6 ? "text-gray-600" : "text-red-600"}`}>{c.npsScore ?? "—"}</span>,
    sortValue: (c) => c.npsScore ?? 0,
  },
  {
    key: "contractEndDate", header: "Hợp đồng", sortable: true, minWidth: 100, defaultHidden: true,
    render: (c) => <span className="text-gray-600 text-[13px]">{new Date(c.contractEndDate).toLocaleDateString("vi-VN")}</span>,
    sortValue: (c) => new Date(c.contractEndDate).getTime(),
  },
];

/* ============================================================
 * Customer Card
 * ============================================================ */
function CustomerCard({ customer, onView }: { customer: CustomerHealth; onView: () => void }) {
  const hCfg = HEALTH_LEVEL_CONFIG[customer.healthLevel];
  const cCfg = CHURN_RISK_CONFIG[customer.churnRisk];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onView}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm text-white flex-shrink-0 ${
            customer.healthLevel === "excellent" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
            customer.healthLevel === "good" ? "bg-gradient-to-br from-blue-500 to-indigo-600" :
            customer.healthLevel === "at-risk" ? "bg-gradient-to-br from-amber-500 to-orange-600" :
            "bg-gradient-to-br from-red-500 to-rose-600"
          }`}>{customer.logo}</div>
          <div>
            <h4 className="text-sm text-gray-900">{customer.companyName}</h4>
            <p className="text-[10px] text-gray-400">{customer.industry} · {customer.contactPerson}</p>
          </div>
        </div>
        <Eye className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors flex-shrink-0" />
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${hCfg.bgColor} ${hCfg.color}`}>{hCfg.label}</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded ${cCfg.bgColor} ${cCfg.color}`}>Churn: {customer.churnProbability}%</span>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400">Health Score</span>
          <span className={`text-[12px] ${hCfg.color}`}>{customer.healthScore}/100</span>
        </div>
        <ScoreBar value={customer.healthScore} />
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] mb-3">
        <div className="bg-gray-50 rounded p-1.5">
          <p className="text-gray-900">${(customer.mrr / 1000).toFixed(1)}K</p>
          <p className="text-gray-400">MRR</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5">
          <p className={customer.daysSinceContact > 7 ? "text-red-600" : "text-gray-900"}>{customer.daysSinceContact}d</p>
          <p className="text-gray-400">Liên hệ</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5">
          <p className="text-gray-900">{customer.npsScore ?? "—"}</p>
          <p className="text-gray-400">NPS</p>
        </div>
      </div>

      {customer.riskFactors.length > 0 && (
        <div className="bg-red-50 rounded-lg p-2 mb-2">
          <p className="text-[9px] text-red-600 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            {customer.riskFactors[0]}
            {customer.riskFactors.length > 1 && <span className="text-red-400 ml-1">+{customer.riskFactors.length - 1}</span>}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {customer.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{tag}</span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Customer Detail Modal
 * ============================================================ */
function CustomerDetailModal({ customer, onClose }: { customer: CustomerHealth; onClose: () => void }) {
  const hCfg = HEALTH_LEVEL_CONFIG[customer.healthLevel];
  const cCfg = CHURN_RISK_CONFIG[customer.churnRisk];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm text-white ${
              customer.healthLevel === "excellent" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
              customer.healthLevel === "good" ? "bg-gradient-to-br from-blue-500 to-indigo-600" :
              customer.healthLevel === "at-risk" ? "bg-gradient-to-br from-amber-500 to-orange-600" :
              "bg-gradient-to-br from-red-500 to-rose-600"
            }`}>{customer.logo}</div>
            <div>
              <h3 className="text-gray-900">{customer.companyName}</h3>
              <p className="text-xs text-gray-500">{customer.industry} · {customer.contactPerson}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className={`rounded-lg border p-2.5 text-center ${hCfg.bgColor}`}>
              <p className={`text-2xl ${hCfg.color}`}>{customer.healthScore}</p>
              <p className="text-[8px] text-gray-400">Health Score</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <p className={`text-sm px-1.5 py-0.5 rounded inline-block ${cCfg.bgColor} ${cCfg.color}`}>{customer.churnProbability}%</p>
              <p className="text-[8px] text-gray-400 mt-0.5">Churn Risk</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <p className="text-sm text-gray-900">${(customer.mrr / 1000).toFixed(1)}K</p>
              <p className="text-[8px] text-gray-400">MRR</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={customer.metrics}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
              <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>

          <div>
            <h4 className="text-xs text-gray-500 mb-2">Health Score Trend</h4>
            <ResponsiveContainer width="100%" height={90}>
              <AreaChart data={customer.trend}>
                <XAxis dataKey="month" tick={{ fontSize: 8 }} />
                <YAxis tick={{ fontSize: 8 }} domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score"
                  stroke={customer.healthLevel === "critical" || customer.healthLevel === "at-risk" ? "#ef4444" : "#22c55e"}
                  fill={customer.healthLevel === "critical" || customer.healthLevel === "at-risk" ? "#ef4444" : "#22c55e"}
                  fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{customer.loginFrequency}%</p>
              <p className="text-[7px] text-gray-400">Login</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{customer.featureAdoption}%</p>
              <p className="text-[7px] text-gray-400">Adoption</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className={`text-xs ${customer.daysSinceContact > 7 ? "text-red-600" : "text-gray-900"}`}>{customer.daysSinceContact}d</p>
              <p className="text-[7px] text-gray-400">Contact</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className={`text-xs ${customer.ticketCount > 5 ? "text-red-600" : "text-gray-900"}`}>{customer.ticketCount}</p>
              <p className="text-[7px] text-gray-400">Tickets</p>
            </div>
          </div>

          {customer.riskFactors.length > 0 && (
            <div className="bg-red-50 rounded-lg border border-red-100 p-3">
              <h4 className="text-xs text-red-700 mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Yếu tố rủi ro
              </h4>
              <ul className="space-y-1">
                {customer.riskFactors.map((r, i) => (
                  <li key={i} className="text-xs text-red-600 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-green-50 rounded-lg border border-green-100 p-3">
            <h4 className="text-xs text-green-700 mb-1.5 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Hành động giữ chân
            </h4>
            <ul className="space-y-1">
              {customer.retentionActions.map((a, i) => (
                <li key={i} className="text-xs text-green-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">LTV</p>
              <p className="text-sm text-gray-900">${(customer.lifetimeValue / 1000).toFixed(0)}K</p>
            </div>
            <div className={`rounded-lg p-2.5 ${new Date(customer.contractEndDate) < new Date("2026-09-01") ? "bg-amber-50" : "bg-gray-50"}`}>
              <p className="text-[9px] text-gray-400">Hợp đồng đến</p>
              <p className="text-sm text-gray-900">{new Date(customer.contractEndDate).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span><span className="text-violet-900">AI Insight:</span> {customer.aiInsight}</span>
            </p>
          </div>

          {customer.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {customer.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
              ))}
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
export function CustomerHealthPage() {
  const { mode, setMode } = useViewMode("customer-health", "card");
  const [items, setItems] = useState<CustomerHealth[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerHealth | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerHealth | null>(null);
  const [showChart, setShowChart] = useState(true);

  const reload = useCallback(() => { fetchCustomerHealthRecords().then(setItems); }, []);
  useEffect(() => { reload(); }, [reload]);

  /* Filters */
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);
  const hasActiveFilters = !!search || Object.values(filterValues).some((v) => v !== "");
  const clearAll = useCallback(() => { setSearch(""); setFilterValues({}); }, []);

  const filtered = useMemo(() => {
    let result = [...items];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((ch) =>
        ch.companyName.toLowerCase().includes(q) || ch.contactPerson.toLowerCase().includes(q) ||
        ch.industry.toLowerCase().includes(q) || ch.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (filterValues.level) result = result.filter((ch) => ch.healthLevel === filterValues.level);
    if (filterValues.churnRisk) result = result.filter((ch) => ch.churnRisk === filterValues.churnRisk);
    return result.sort((a, b) => a.healthScore - b.healthScore);
  }, [items, search, filterValues]);

  const cardPag = usePagination(filtered, { storageKey: "customer-health-card", initialPageSize: 10 });

  /* Stats */
  const stats = useMemo(() => {
    const avgHealth = items.length > 0 ? Math.round(items.reduce((s, c) => s + c.healthScore, 0) / items.length) : 0;
    const totalMRR = items.reduce((s, c) => s + c.mrr, 0);
    const atRiskMRR = items.filter((c) => c.churnRisk === "high" || c.churnRisk === "very-high").reduce((s, c) => s + c.mrr, 0);
    const atRiskCount = items.filter((c) => c.healthLevel === "at-risk" || c.healthLevel === "critical").length;
    return { avgHealth, totalMRR, atRiskMRR, atRiskCount };
  }, [items]);

  /* Charts */
  const healthDist = useMemo(() =>
    (Object.keys(HEALTH_LEVEL_CONFIG) as HealthLevel[]).map((l) => ({
      name: HEALTH_LEVEL_CONFIG[l].label,
      value: items.filter((c) => c.healthLevel === l).length,
      fill: l === "excellent" ? "#22c55e" : l === "good" ? "#3b82f6" : l === "at-risk" ? "#f59e0b" : "#ef4444",
    })).filter((d) => d.value > 0), [items]);

  const mrrAtRisk = useMemo(() =>
    items
      .filter((c) => c.churnRisk === "high" || c.churnRisk === "very-high")
      .sort((a, b) => b.mrr - a.mrr)
      .map((c) => ({
        name: c.companyName.length > 12 ? c.companyName.slice(0, 12) + "…" : c.companyName,
        mrr: c.mrr / 1000,
        churn: c.churnProbability,
      })), [items]);

  /* Inline edit */
  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateCustomerHealthRecord(rowId, { [field]: value });
    reload();
    toast.success("Đã cập nhật sức khoẻ khách hàng");
  }, [reload]);

  /* Delete */
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await apiDeleteRecords([deleteTarget.id]);
    reload();
    toast.success("Đã xóa bản ghi");
    setDeleteTarget(null);
  }, [deleteTarget, reload]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    await apiDeleteRecords(ids);
    reload();
    toast.success(`Đã xóa ${ids.length} bản ghi`);
  }, [reload]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-violet-600" /> Customer Health Score
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">Churn prediction, engagement, risk alerts, AI retention</p>
        </div>
        <ViewToggle mode={mode} onSetMode={setMode} modes={["card", "table"]} />
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`rounded-xl border p-3 ${stats.avgHealth >= 75 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <HeartPulse className="w-4 h-4 text-green-500 mb-1" />
          <p className={`text-lg ${stats.avgHealth >= 75 ? "text-green-600" : "text-amber-600"}`}>{stats.avgHealth}/100</p>
          <p className="text-xs text-gray-600">Health TB portfolio</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <DollarSign className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">${(stats.totalMRR / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-500">Tổng MRR</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.atRiskMRR > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <AlertTriangle className="w-4 h-4 text-red-500 mb-1" />
          <p className={`text-lg ${stats.atRiskMRR > 0 ? "text-red-600" : "text-green-600"}`}>${(stats.atRiskMRR / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-600">MRR at risk</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.atRiskCount > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
          <Users className="w-4 h-4 text-amber-500 mb-1" />
          <p className={`text-lg ${stats.atRiskCount > 0 ? "text-amber-600" : "text-green-600"}`}>{stats.atRiskCount}</p>
          <p className="text-xs text-gray-500">Khách at risk</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <button type="button" onClick={() => setShowChart(!showChart)} className="flex items-center justify-between w-full">
          <h3 className="text-sm text-gray-800 flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-violet-500" /> Phân tích Portfolio</h3>
          {showChart ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showChart && (
          <div className="grid lg:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-xs text-gray-500 mb-2">Phân bố sức khoẻ</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={healthDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={65}
                    paddingAngle={3} label={({ name, value }) => `${name}: ${value}`}>
                    {healthDist.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">MRR at Risk ($K)</p>
              {mrrAtRisk.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={mrrAtRisk} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                    <Tooltip formatter={(v: number) => [`$${v}K`]} />
                    <Bar dataKey="mrr" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[180px] text-sm text-green-500">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Không có MRR at risk
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Tìm công ty, liên hệ, ngành..."
        filters={HEALTH_FILTERS} filterValues={filterValues} onFilterChange={handleFilterChange}
        onClearAll={clearAll} hasActiveFilters={hasActiveFilters} />

      {mode === "table" ? (
        <DataTable<CustomerHealth> data={filtered} columns={HEALTH_COLUMNS} storageKey="customer-health" selectable
          defaultSortField="healthScore" onInlineEdit={handleInlineEdit} onRowClick={(c) => setSelectedCustomer(c)}
          onBulkDelete={handleBulkDelete} emptyMessage="Không tìm thấy khách hàng phù hợp"
          renderRowActions={(c) => (
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => setSelectedCustomer(c)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget(c)} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cardPag.paginatedItems.map((c) => <CustomerCard key={c.id} customer={c} onView={() => setSelectedCustomer(c)} />)}
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><HeartPulse className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">Không tìm thấy khách hàng phù hợp</p></div>}
          {filtered.length > 0 && <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"><PaginationBar {...cardPag} onGoToPage={cardPag.goToPage} onNextPage={cardPag.nextPage} onPrevPage={cardPag.prevPage} onSetPageSize={cardPag.setPageSize} /></div>}
        </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-violet-600" /><h4 className="text-sm text-violet-900">AI Retention Insights</h4></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />GlobalSoft ($15K MRR) critical — SSO fix + CTO meeting cần trong 24h. Churn risk 60%.</p>
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />FinServe Korea và SeoulTech cần outreach ngay — 11-13 ngày không liên hệ. Tổng MRR at risk $15.7K.</p>
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />TechCorp và EduTech là promoter (NPS 9). Mời referral program — có thể generate 5-8 warm leads.</p>
        </div>
      </div>

      {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
      <ConfirmDeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        itemName={deleteTarget?.companyName ?? ""} entityType="bản ghi sức khoẻ" description="Hành động này không thể hoàn tác." />
    </div>
  );
}
