/**
 * Churn Prediction Dashboard — Dự đoán Rời bỏ
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Detail Modal, Delete đơn lẻ + bulk, AI Insights.
 * Phase 7 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ShieldAlert, Sparkles, Bot, TrendingDown,
  Trash2, Eye, X, AlertTriangle,
  ArrowDownRight, ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import type { ChurnRiskAccount, ChurnRiskLevel, InterventionStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  CHURN_RISK_LEVEL_CONFIG, INTERVENTION_STATUS_CONFIG, formatVND,
} from "../../constants/crmConfig";
import { fetchChurnRiskAccounts, deleteChurnRiskAccounts, updateChurnRiskAccount, createChurnRiskAccount } from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";
import { PaginationBar } from "../../components/crm/PaginationBar";

/* ============================================================
 * Filter config
 * ============================================================ */
const CH_FILTERS: FilterConfig[] = [
  {
    key: "level", label: "Mức rủi ro", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(CHURN_RISK_LEVEL_CONFIG).map(([v, c]) => ({ value: v, label: `${c.icon} ${c.label}` })),
    ],
  },
  {
    key: "interventionStatus", label: "Can thiệp", type: "select",
    options: Object.entries(INTERVENTION_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const CH_COLUMNS: ColumnDef<ChurnRiskAccount>[] = [
  {
    key: "customer", header: "Khách hàng", sortable: true, minWidth: 200,
    render: (r) => {
      const risk = CHURN_RISK_LEVEL_CONFIG[r.riskLevel];
      return (
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${
            r.riskLevel === "critical" ? "bg-red-100" :
            r.riskLevel === "high" ? "bg-orange-100" :
            r.riskLevel === "medium" ? "bg-amber-100" : "bg-green-100"
          }`}>{risk.icon}</div>
          <div className="min-w-0">
            <p className="text-gray-900 truncate">{r.customer}</p>
            <p className="text-[10px] text-gray-400">CSM: {r.csm}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: "riskLevel", header: "Mức rủi ro", sortable: true, minWidth: 110,
    render: (r) => {
      const cfg = CHURN_RISK_LEVEL_CONFIG[r.riskLevel];
      return <span className={`text-[9px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.icon} {cfg.label}</span>;
    },
  },
  {
    key: "churnProbability", header: "Xác suất churn", sortable: true, minWidth: 100,
    render: (r) => (
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-12">
          <div className={`h-full rounded-full ${r.churnProbability >= 70 ? "bg-red-400" : r.churnProbability >= 40 ? "bg-amber-400" : "bg-green-400"}`}
            style={{ width: `${r.churnProbability}%` }} />
        </div>
        <span className={`text-[10px] ${r.churnProbability >= 70 ? "text-red-600" : r.churnProbability >= 40 ? "text-amber-600" : "text-green-600"}`}>{r.churnProbability}%</span>
      </div>
    ),
    sortValue: (r) => r.churnProbability,
  },
  {
    key: "arr", header: "ARR", sortable: true, minWidth: 100,
    render: (r) => <span className="text-gray-900 text-xs">{formatVND(r.arr)}₫</span>,
    sortValue: (r) => r.arr,
  },
  {
    key: "healthScore", header: "Health", sortable: true, minWidth: 80,
    render: (r) => (
      <span className="flex items-center gap-0.5 text-xs">
        {r.healthTrend === "declining" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
        {r.healthTrend === "improving" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
        <span className={r.healthScore >= 60 ? "text-green-600" : r.healthScore >= 30 ? "text-amber-600" : "text-red-600"}>{r.healthScore}</span>
      </span>
    ),
    sortValue: (r) => r.healthScore,
  },
  {
    key: "daysToRenewal", header: "Renewal", sortable: true, minWidth: 80,
    render: (r) => (
      <span className={r.daysToRenewal <= 30 ? "text-red-600 text-xs" : "text-gray-600 text-xs"}>
        {r.daysToRenewal}d
      </span>
    ),
    sortValue: (r) => r.daysToRenewal,
  },
  {
    key: "interventionStatus", header: "Can thiệp", sortable: true, minWidth: 110, editable: true,
    render: (r) => {
      const cfg = INTERVENTION_STATUS_CONFIG[r.interventionStatus];
      return <span className={`text-[9px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (_item, _v, onChange, onSave) => (
      <select defaultValue={_item.interventionStatus} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(INTERVENTION_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
  },
  {
    key: "usageChange", header: "Usage", sortable: true, minWidth: 70,
    render: (r) => (
      <span className={r.usageChange >= 0 ? "text-green-600 text-xs" : "text-red-600 text-xs"}>
        {r.usageChange >= 0 ? "+" : ""}{r.usageChange}%
      </span>
    ),
    sortValue: (r) => r.usageChange,
  },
  {
    key: "ticketsOpen", header: "Tickets", sortable: true, minWidth: 60, defaultHidden: true,
    render: (r) => <span className={r.ticketsOpen > 0 ? "text-red-600 text-xs" : "text-gray-400 text-xs"}>{r.ticketsOpen}</span>,
    sortValue: (r) => r.ticketsOpen,
  },
];

/* ============================================================
 * Create Modal
 * ============================================================ */
function ChurnCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [customer, setCustomer] = useState("");
  const [arr, setArr] = useState(0);
  const [riskLevel, setRiskLevel] = useState<ChurnRiskLevel>("medium");
  const [csm, setCsm] = useState("");
  const [daysToRenewal, setDaysToRenewal] = useState(90);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!customer.trim()) { toast.error("Vui lòng nhập tên khách hàng"); return; }
    setSaving(true);
    await createChurnRiskAccount({
      customer, arr, riskLevel, csm, daysToRenewal,
      churnProbability: riskLevel === "critical" ? 85 : riskLevel === "high" ? 65 : riskLevel === "medium" ? 40 : 15,
      healthScore: 50, healthTrend: "stable",
      signals: [], interventionStatus: "none", interventionNote: "",
      lastContact: new Date().toISOString().split("T")[0],
      usageChange: 0, nps: null, ticketsOpen: 0, tags: [],
    });
    toast.success(`Đã thêm tài khoản rủi ro "${customer}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Thêm Tài khoản Rủi ro</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Khách hàng *</label>
            <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Tên khách hàng"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">ARR (VNĐ)</label>
              <input type="number" value={arr} onChange={(e) => setArr(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mức rủi ro</label>
              <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as ChurnRiskLevel)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                {Object.entries(CHURN_RISK_LEVEL_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">CSM phụ trách</label>
              <input type="text" value={csm} onChange={(e) => setCsm(e.target.value)} placeholder="Tên CSM"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày đến Renewal</label>
              <input type="number" value={daysToRenewal} onChange={(e) => setDaysToRenewal(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Thêm Tài khoản"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Card View
 * ============================================================ */
function ChurnCard({ item, onView, onDelete }: {
  item: ChurnRiskAccount; onView: () => void; onDelete: () => void;
}) {
  const risk = CHURN_RISK_LEVEL_CONFIG[item.riskLevel];
  const intv = INTERVENTION_STATUS_CONFIG[item.interventionStatus];

  return (
    <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow group ${
      item.riskLevel === "critical" ? "border-red-300 border-l-4" :
      item.riskLevel === "high" ? "border-orange-200" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onView}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
            item.riskLevel === "critical" ? "bg-red-100" :
            item.riskLevel === "high" ? "bg-orange-100" :
            item.riskLevel === "medium" ? "bg-amber-100" : "bg-green-100"
          }`}>{risk.icon}</div>
          <div className="min-w-0">
            <h4 className="text-sm text-gray-900 truncate">{item.customer}</h4>
            <div className="flex items-center gap-1 flex-wrap">
              <span className={`text-[7px] px-1.5 py-0.5 rounded border ${risk.bgColor} ${risk.color}`}>{risk.label} ({item.churnProbability}%)</span>
              <span className={`text-[7px] px-1.5 py-0.5 rounded border ${intv.bgColor} ${intv.color}`}>{intv.label}</span>
            </div>
          </div>
        </div>
        <button type="button" onClick={onDelete}
          className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Health + Churn bars */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <div className="flex items-center justify-between text-[8px] mb-0.5">
            <span className="text-gray-400">Health</span>
            <span className="flex items-center gap-0.5">
              {item.healthTrend === "declining" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
              {item.healthTrend === "improving" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
              <span className={item.healthScore >= 60 ? "text-green-600" : item.healthScore >= 30 ? "text-amber-600" : "text-red-600"}>{item.healthScore}</span>
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${item.healthScore >= 60 ? "bg-green-400" : item.healthScore >= 30 ? "bg-amber-400" : "bg-red-400"}`}
              style={{ width: `${item.healthScore}%` }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[8px] mb-0.5">
            <span className="text-gray-400">Churn Prob.</span>
            <span className={item.churnProbability >= 70 ? "text-red-600" : item.churnProbability >= 40 ? "text-amber-600" : "text-green-600"}>{item.churnProbability}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${item.churnProbability >= 70 ? "bg-red-400" : item.churnProbability >= 40 ? "bg-amber-400" : "bg-green-400"}`}
              style={{ width: `${item.churnProbability}%` }} />
          </div>
        </div>
      </div>

      {/* Signals */}
      <div className="flex flex-wrap gap-1 mb-2">
        {item.signals.slice(0, 3).map((s) => (
          <span key={s} className="text-[7px] px-1.5 py-0.5 bg-red-50 text-red-600 rounded border border-red-100">⚠ {s}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 text-[8px] text-gray-400 flex-wrap">
        <span>💰 {formatVND(item.arr)}₫</span>
        <span className={item.usageChange >= 0 ? "text-green-600" : "text-red-600"}>📊 {item.usageChange >= 0 ? "+" : ""}{item.usageChange}%</span>
        <span>⏰ Renewal: {item.daysToRenewal}d</span>
      </div>

      {item.interventionNote && (
        <div className="mt-2 bg-blue-50 rounded-lg border border-blue-100 p-2">
          <p className="text-[9px] text-blue-700 line-clamp-2">📋 {item.interventionNote}</p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function ChurnDetailModal({ item, onClose }: { item: ChurnRiskAccount; onClose: () => void }) {
  const risk = CHURN_RISK_LEVEL_CONFIG[item.riskLevel];
  const intv = INTERVENTION_STATUS_CONFIG[item.interventionStatus];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{risk.icon}</span>
            <div>
              <h3 className="text-gray-900">{item.customer}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${risk.bgColor} ${risk.color}`}>{risk.label} ({item.churnProbability}%)</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${intv.bgColor} ${intv.color}`}>{intv.label}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "ARR", value: `${formatVND(item.arr)}₫` },
              { label: "Health Score", value: `${item.healthScore}/100` },
              { label: "Health Trend", value: item.healthTrend === "declining" ? "📉 Giảm" : item.healthTrend === "improving" ? "📈 Tăng" : "➡️ Ổn định" },
              { label: "Renewal", value: `${item.daysToRenewal} ngày` },
              { label: "Usage Change", value: `${item.usageChange >= 0 ? "+" : ""}${item.usageChange}%` },
              { label: "NPS", value: item.nps !== null ? String(item.nps) : "N/A" },
              { label: "Tickets mở", value: String(item.ticketsOpen) },
              { label: "CSM", value: item.csm },
              { label: "Liên hệ cuối", value: item.lastContact },
            ].map((x) => (
              <div key={x.label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[9px] text-gray-400">{x.label}</p>
                <p className="text-xs text-gray-800">{x.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-red-50 rounded-lg border border-red-200 p-3">
            <p className="text-[9px] text-red-400 mb-1">Tín hiệu cảnh báo</p>
            <div className="flex flex-wrap gap-1">
              {item.signals.map((s) => (
                <span key={s} className="text-[9px] px-2 py-0.5 bg-white text-red-600 rounded border border-red-200">⚠ {s}</span>
              ))}
            </div>
          </div>

          {item.interventionNote && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
              <p className="text-[9px] text-blue-400 mb-1">Kế hoạch can thiệp</p>
              <p className="text-sm text-blue-700">{item.interventionNote}</p>
            </div>
          )}

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((t) => (
                <span key={t} className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function ChurnPredictionPage() {
  const [data, setData] = useState<ChurnRiskAccount[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({ level: "", interventionStatus: "" });
  const [selected, setSelected] = useState<ChurnRiskAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { mode, setMode } = useViewMode("churn");

  const loadData = useCallback(async () => {
    const result = await fetchChurnRiskAccounts({
      search: search || undefined,
      level: (filters.level || null) as ChurnRiskLevel | null,
      interventionStatus: (filters.interventionStatus || null) as InterventionStatus | null,
    });
    setData(result);
  }, [search, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => {
    const critical = data.filter((a) => a.riskLevel === "critical");
    const high = data.filter((a) => a.riskLevel === "high");
    const totalARRatRisk = [...critical, ...high].reduce((s, a) => s + a.arr, 0);
    const interventionRate = data.length > 0
      ? Math.round((data.filter((a) => a.interventionStatus !== "none").length / data.length) * 100)
      : 0;
    const avgHealthScore = data.length > 0
      ? Math.round(data.reduce((s, a) => s + a.healthScore, 0) / data.length)
      : 0;
    return { totalARRatRisk, criticalCount: critical.length, highCount: high.length, interventionRate, avgHealthScore };
  }, [data]);

  const sorted = useMemo(() => [...data].sort((a, b) => b.churnProbability - a.churnProbability), [data]);

  const pagination = usePagination(sorted, { storageKey: "churn" });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const count = await deleteChurnRiskAccounts(deleteTarget.ids);
    toast.success(`Đã xoá ${count} tài khoản`);
    setDeleteTarget(null);
    loadData();
  };

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateChurnRiskAccount(rowId, { [field]: value });
    loadData();
    toast.success("Đã cập nhật tài khoản");
  }, [loadData]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" /> Churn Prediction
          </h1>
          <p className="text-gray-500 mt-0.5">Dự đoán rời bỏ — AI risk scoring, early warning, retention playbooks</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} />
          <button type="button" onClick={() => setShowCreate(true)}
            className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
            <Sparkles className="w-4 h-4" /> Thêm Tài khoản
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{formatVND(stats.totalARRatRisk)}₫</p>
          <p className="text-[9px] text-red-700">ARR at Risk</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{stats.criticalCount}</p>
          <p className="text-[9px] text-red-700">Critical</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-2.5 text-center">
          <p className="text-lg text-orange-600">{stats.highCount}</p>
          <p className="text-[9px] text-orange-700">High Risk</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.interventionRate}%</p>
          <p className="text-[9px] text-blue-700">Intervention Rate</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${stats.avgHealthScore >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-lg ${stats.avgHealthScore >= 50 ? "text-amber-600" : "text-red-600"}`}>{stats.avgHealthScore}</p>
          <p className="text-[9px] text-gray-500">Avg Health Score</p>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm khách hàng, CSM..."
        filters={CH_FILTERS}
        filterValues={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onClearAll={() => { setSearch(""); setFilters({ level: "", interventionStatus: "" }); }}
      />

      {/* Table View */}
      {mode === "table" && (
        <DataTable<ChurnRiskAccount>
          data={pagination.paginatedItems}
          columns={CH_COLUMNS}
          storageKey="churn-table"
          selectable
          onInlineEdit={handleInlineEdit}
          onRowClick={setSelected}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} tài khoản được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelected(item)} className="p-1 text-gray-300 hover:text-red-600"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.customer })} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không có tài khoản rủi ro nào phù hợp"
        />
      )}

      {/* Card View */}
      {mode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {pagination.paginatedItems.map((a) => (
            <ChurnCard
              key={a.id}
              item={a}
              onView={() => setSelected(a)}
              onDelete={() => setDeleteTarget({ ids: [a.id], label: a.customer })}
            />
          ))}
          {pagination.paginatedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không có tài khoản rủi ro nào phù hợp</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {sorted.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <PaginationBar {...pagination} onGoToPage={pagination.goToPage} onNextPage={pagination.nextPage} onPrevPage={pagination.prevPage} onSetPageSize={pagination.setPageSize} />
        </div>
      )}

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-red-600" />
          <h4 className="text-sm text-red-900">AI Churn Prediction Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-red-800">
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span><strong>OceanView Corp</strong> (2.1B₫ ARR) — <strong>churn probability 92%</strong>. Renewal trong <strong>15 ngày</strong>. Cần CEO-to-CEO call + emergency retention offer trước 10/03.</span>
          </p>
          <p className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <span>Tổng <strong>ARR at risk: {formatVND(stats.totalARRatRisk)}₫</strong>. Nếu áp dụng đúng playbook, AI estimate giữ được <strong>55%</strong>. ROI churn prevention: <strong>15x</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI model accuracy: <strong>87%</strong>. <strong>Top features</strong>: usage decline (-75% weight), NPS drop (-68%), support ticket escalation (-55%), login frequency (-42%).</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {selected && <ChurnDetailModal item={selected} onClose={() => setSelected(null)} />}
      {showCreate && <ChurnCreateModal onClose={() => setShowCreate(false)} onCreated={loadData} />}
      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemName={deleteTarget.label}
          entityType="tài khoản rủi ro"
          description="Hành động này không thể hoàn tác."
        />
      )}
    </div>
  );
}