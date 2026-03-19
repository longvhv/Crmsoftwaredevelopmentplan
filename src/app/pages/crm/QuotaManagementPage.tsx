/**
 * Quota Management — Quản lý Chỉ tiêu Sales
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Inline Edit (status), Detail Modal,
 *   AI Insights, Delete đơn lẻ + bulk, Team summary.
 * Phase 6 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Milestone, TrendingUp, TrendingDown, Sparkles, Bot,
  Users, Target, Trash2, Eye, X, ArrowUpRight, ArrowDownRight,
  Minus, Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { QuotaRep, AttainmentStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { ATTAINMENT_STATUS_CONFIG, QUOTA_TREND_CONFIG, formatVND } from "../../constants/crmConfig";
import {
  fetchQuotaReps, updateQuotaRep, deleteQuotaReps,
  createQuotaRep,
} from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Filter config
 * ============================================================ */
const QUOTA_FILTERS: FilterConfig[] = [
  {
    key: "status", label: "Trạng thái", type: "select",
    options: Object.entries(ATTAINMENT_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const QUOTA_COLUMNS: ColumnDef<QuotaRep>[] = [
  {
    key: "name", header: "Nhân viên", sortable: true, minWidth: 200,
    render: (r) => (
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
          r.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-teal-100 text-teal-700"
        }`}>
          {r.isAI ? "🤖" : r.avatar.slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="text-gray-900 truncate">{r.name}</p>
          <p className="text-[10px] text-gray-400 truncate">{r.role} · {r.team}</p>
        </div>
      </div>
    ),
  },
  {
    key: "attainment", header: "Attainment", sortable: true, minWidth: 140,
    render: (r) => {
      const color = r.attainment >= 100 ? "text-emerald-600" : r.attainment >= 70 ? "text-blue-600" : r.attainment >= 40 ? "text-amber-600" : "text-red-600";
      const bgColor = r.attainment >= 100 ? "bg-emerald-500" : r.attainment >= 70 ? "bg-blue-500" : r.attainment >= 40 ? "bg-amber-500" : "bg-red-500";
      return (
        <div className="min-w-0">
          <span className={color}>{r.attainment}%</span>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
            <div className={`h-full rounded-full ${bgColor}`} style={{ width: `${Math.min(120, r.attainment)}%` }} />
          </div>
          <p className="text-[9px] text-gray-400">{formatVND(r.closed)} / {formatVND(r.quota)}</p>
        </div>
      );
    },
    sortValue: (r) => r.attainment,
  },
  {
    key: "pipeline", header: "Pipeline", sortable: true, minWidth: 100,
    render: (r) => <span className="text-gray-700">{formatVND(r.pipeline)}</span>,
    sortValue: (r) => r.pipeline,
  },
  {
    key: "forecastClose", header: "Forecast", sortable: true, minWidth: 100,
    render: (r) => <span className="text-gray-700">{formatVND(r.forecastClose)}</span>,
    sortValue: (r) => r.forecastClose,
  },
  {
    key: "dealsWon", header: "Won", sortable: true, minWidth: 60,
    render: (r) => <span className="text-green-600">{r.dealsWon}</span>,
    sortValue: (r) => r.dealsWon,
  },
  {
    key: "dealsOpen", header: "Open", sortable: true, minWidth: 60,
    render: (r) => <span className="text-blue-600">{r.dealsOpen}</span>,
    sortValue: (r) => r.dealsOpen,
  },
  {
    key: "avgDealSize", header: "Avg Deal", sortable: true, minWidth: 100, defaultHidden: true,
    render: (r) => <span className="text-gray-700">{formatVND(r.avgDealSize)}</span>,
    sortValue: (r) => r.avgDealSize,
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 120, editable: true,
    render: (r) => {
      const cfg = ATTAINMENT_STATUS_CONFIG[r.status];
      return <span className={`text-[11px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }}
        onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(ATTAINMENT_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "trend", header: "Xu hướng", sortable: true, minWidth: 80,
    render: (r) => {
      const cfg = QUOTA_TREND_CONFIG[r.trend];
      return (
        <span className={`flex items-center gap-1 ${cfg.color}`}>
          {r.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5" />}
          {r.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5" />}
          {r.trend === "flat" && <Minus className="w-3.5 h-3.5" />}
          {cfg.label}
        </span>
      );
    },
  },
];

/* ============================================================
 * Card View
 * ============================================================ */
function RepCard({ rep, onView, onDelete }: {
  rep: QuotaRep; onView: () => void; onDelete: () => void;
}) {
  const stCfg = ATTAINMENT_STATUS_CONFIG[rep.status];
  const attColor = rep.attainment >= 100 ? "text-emerald-600" : rep.attainment >= 70 ? "text-blue-600" : rep.attainment >= 40 ? "text-amber-600" : "text-red-600";
  const barColor = rep.attainment >= 100 ? "bg-emerald-500" : rep.attainment >= 70 ? "bg-blue-500" : rep.attainment >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0 cursor-pointer" onClick={onView}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
            rep.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-teal-100 text-teal-700"
          }`}>
            {rep.isAI ? "🤖" : rep.avatar.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm text-gray-900 truncate">{rep.name}</h4>
            <p className="text-[10px] text-gray-400">{rep.role} · {rep.team}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${stCfg.bgColor} ${stCfg.color}`}>{stCfg.label}</span>
          <button type="button" onClick={onDelete}
            className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Attainment bar */}
      <div className="mb-3 cursor-pointer" onClick={onView}>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Attainment</span>
          <span className={attColor}>{rep.attainment}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden relative">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(120, rep.attainment)}%` }} />
          <div className="absolute top-0 bottom-0 w-px bg-gray-500 opacity-40" style={{ left: "75%" }} />
        </div>
        <div className="flex items-center justify-between text-[9px] text-gray-400 mt-0.5">
          <span>{formatVND(rep.closed)}</span>
          <span>Quota: {formatVND(rep.quota)}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-1.5 mb-2" onClick={onView}>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-green-600">{rep.dealsWon}</p>
          <p className="text-[8px] text-gray-400">Won</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-blue-600">{rep.dealsOpen}</p>
          <p className="text-[8px] text-gray-400">Open</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-gray-700">{formatVND(rep.avgDealSize)}</p>
          <p className="text-[8px] text-gray-400">Avg Deal</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-violet-700">{formatVND(rep.forecastClose)}</p>
          <p className="text-[8px] text-gray-400">Forecast</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[9px] text-gray-400">
        <span>Pipeline: {formatVND(rep.pipeline)}</span>
        <span className={QUOTA_TREND_CONFIG[rep.trend].color}>
          {rep.trend === "up" ? "↑" : rep.trend === "down" ? "↓" : "→"} {QUOTA_TREND_CONFIG[rep.trend].label}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function RepDetailModal({ rep, onClose }: { rep: QuotaRep; onClose: () => void }) {
  const stCfg = ATTAINMENT_STATUS_CONFIG[rep.status];
  const gap = rep.quota - rep.closed;
  const coverageRatio = gap > 0 ? (rep.pipeline / gap).toFixed(1) : "∞";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
              rep.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-teal-100 text-teal-700"
            }`}>
              {rep.isAI ? "🤖" : rep.avatar.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-gray-900">{rep.name}</h3>
              <p className="text-xs text-gray-500">{rep.role} · {rep.team}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className={`text-sm ${rep.attainment >= 70 ? "text-emerald-600" : "text-amber-600"}`}>{rep.attainment}%</p>
              <p className="text-[9px] text-gray-400">Attainment</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{formatVND(rep.closed)}</p>
              <p className="text-[9px] text-gray-400">Đã Close</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-violet-600">{coverageRatio}x</p>
              <p className="text-[9px] text-gray-400">Pipeline Coverage</p>
            </div>
            <div className={`rounded-lg p-2 text-center border ${stCfg.bgColor}`}>
              <p className={`text-sm ${stCfg.color}`}>{stCfg.label}</p>
              <p className="text-[9px] text-gray-400">Trạng thái</p>
            </div>
          </div>

          {/* Attainment bar */}
          <div className="bg-teal-50 rounded-lg border border-teal-100 p-3">
            <h4 className="text-xs text-teal-800 flex items-center gap-1 mb-2">
              <Target className="w-3.5 h-3.5" /> Chi tiết chỉ tiêu
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Quota Q1/2026</span><span className="text-gray-900">{formatVND(rep.quota)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Đã Close</span><span className="text-green-700">{formatVND(rep.closed)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Còn thiếu</span><span className="text-red-600">{formatVND(gap > 0 ? gap : 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Pipeline hiện tại</span><span className="text-blue-700">{formatVND(rep.pipeline)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">AI Forecast Close</span><span className="text-violet-700">{formatVND(rep.forecastClose)}</span></div>
              <hr className="border-teal-200" />
              <div className="flex justify-between"><span className="text-gray-600">Deals Won / Open</span><span>{rep.dealsWon} / {rep.dealsOpen}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Avg Deal Size</span><span>{formatVND(rep.avgDealSize)}</span></div>
            </div>
          </div>

          {/* Attainment progress */}
          <div>
            <h4 className="text-xs text-gray-500 mb-1">Tiến độ Attainment</h4>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden relative">
              <div className={`h-full rounded-full ${
                rep.attainment >= 100 ? "bg-emerald-400" : rep.attainment >= 70 ? "bg-blue-400" : rep.attainment >= 40 ? "bg-amber-400" : "bg-red-400"
              }`} style={{ width: `${Math.min(rep.attainment, 100)}%` }} />
              <div className="absolute top-0 bottom-0 w-px bg-gray-600 opacity-50" style={{ left: "75%" }} />
            </div>
            <p className="text-[9px] text-gray-400 mt-0.5">Target tại thời điểm này: 75% | Ngưỡng an toàn: 40%</p>
          </div>

          {/* Tags */}
          {rep.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {rep.tags.map((t) => (
                <span key={t} className="text-[9px] px-2 py-0.5 bg-teal-50 text-teal-600 rounded">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Quota Rep Modal
 * ============================================================ */
function CreateQuotaRepModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Account Executive");
  const [team, setTeam] = useState("Sales Team A");
  const [quota, setQuota] = useState(5000000000);
  const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("quarterly");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên nhân viên"); return; }
    setSaving(true);
    await createQuotaRep({
      name, role, team, quota, period,
      isAI: false, avatar: name.slice(0, 2).toUpperCase(),
      closed: 0, pipeline: 0, attainment: 0,
      status: "behind" as AttainmentStatus, trend: "flat" as const,
      dealsWon: 0, dealsOpen: 0, avgDealSize: 0, forecastClose: 0,
      tags: ["Mới"],
    });
    toast.success(`Đã thêm chỉ tiêu cho "${name}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2"><Milestone className="w-5 h-5 text-teal-600" /> Gán Chỉ tiêu mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nhân viên *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Nguyễn Văn An"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Vai trò</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Account Executive</option>
                <option>Senior AE</option>
                <option>Enterprise AE</option>
                <option>Sales Manager</option>
                <option>BDR</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Team</label>
              <select value={team} onChange={(e) => setTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Sales Team A</option>
                <option>Sales Team B</option>
                <option>Enterprise</option>
                <option>SMB</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Quota (VNĐ)</label>
              <input type="number" value={quota} onChange={(e) => setQuota(Number(e.target.value))} min={0} step={500000000}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kỳ</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value as typeof period)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="monthly">Hàng tháng</option>
                <option value="quarterly">Hàng quý</option>
                <option value="yearly">Hàng năm</option>
              </select>
            </div>
          </div>
          <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
            <p className="text-[10px] text-teal-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI sẽ tự động forecast attainment, tracking pipeline coverage, và đề xuất coaching khi cần.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Gán Chỉ tiêu"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function QuotaManagementPage() {
  const [items, setItems] = useState<QuotaRep[]>([]);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const { mode, setMode } = useViewMode("quota-mgmt");
  const [selectedRep, setSelectedRep] = useState<QuotaRep | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<QuotaRep | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* ---- Load data ---- */
  const loadData = useCallback(async () => {
    const data = await fetchQuotaReps({
      search: search || undefined,
      attainmentStatus: (filterValues.status as AttainmentStatus) || null,
    });
    setItems(data);
  }, [search, filterValues]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    const totalQuota = items.reduce((s, r) => s + r.quota, 0);
    const totalClosed = items.reduce((s, r) => s + r.closed, 0);
    const totalPipeline = items.reduce((s, r) => s + r.pipeline, 0);
    const totalForecast = items.reduce((s, r) => s + r.forecastClose, 0);
    const teamAttainment = totalQuota > 0 ? Math.round((totalClosed / totalQuota) * 100) : 0;
    const remaining = totalQuota - totalClosed;
    const coverageRatio = remaining > 0 ? (totalPipeline / remaining).toFixed(1) : "∞";
    const onTrackCount = items.filter((r) => r.status === "on-track" || r.status === "exceeded").length;
    return { totalQuota, totalClosed, totalPipeline, totalForecast, teamAttainment, coverageRatio, onTrackCount };
  }, [items]);

  /* ---- Pagination for card view ---- */
  const { paginatedItems, currentPage, totalPages, startIndex, endIndex, isFirstPage, isLastPage, totalItems, prevPage, nextPage } = usePagination(items, { storageKey: "quota-mgmt" });

  /* ---- Handlers ---- */
  const hasActiveFilters = search !== "" || Object.values(filterValues).some((v) => v !== "");

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearAll = useCallback(() => { setSearch(""); setFilterValues({}); }, []);

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateQuotaRep(rowId, { [field]: value });
    toast.success("Đã cập nhật trạng thái");
    loadData();
  }, [loadData]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteQuotaReps([deleteTarget.id]);
    toast.success(`Đã xóa "${deleteTarget.name}"`);
    setDeleteTarget(null);
    loadData();
  }, [deleteTarget, loadData]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    const count = await deleteQuotaReps(ids);
    toast.success(`Đã xóa ${count} bản ghi`);
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Milestone className="w-6 h-6 text-teal-600" /> Quota Management
          </h1>
          <p className="text-gray-500 mt-0.5">
            Quản lý chỉ tiêu — attainment tracking, capacity planning, AI forecasting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} />
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
            <Plus className="w-4 h-4" /> Gán Chỉ tiêu
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-teal-50 rounded-xl border border-teal-200 p-3 text-center">
          <p className="text-lg text-teal-600">{formatVND(stats.totalQuota)}</p>
          <p className="text-[9px] text-teal-700">Tổng Quota Q1</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3 text-center">
          <p className="text-lg text-green-600">{formatVND(stats.totalClosed)}</p>
          <p className="text-[9px] text-green-700">Đã Close</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${stats.teamAttainment >= 50 ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-lg ${stats.teamAttainment >= 50 ? "text-blue-600" : "text-amber-600"}`}>{stats.teamAttainment}%</p>
          <p className="text-[9px] text-gray-500">Team Attainment</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-3 text-center">
          <p className="text-lg text-violet-600">{stats.coverageRatio}x</p>
          <p className="text-[9px] text-violet-700">Pipeline Coverage</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3 text-center">
          <p className="text-lg text-emerald-600">{stats.onTrackCount}/{items.length}</p>
          <p className="text-[9px] text-emerald-700">On-track / Exceeded</p>
        </div>
      </div>

      {/* Human vs AI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: "Nhân viên Con người", filter: false, icon: "👥", colors: "bg-teal-50 border-teal-200 text-teal-700" },
          { label: "AI Agents", filter: true, icon: "🤖", colors: "bg-violet-50 border-violet-200 text-violet-700" },
        ].map(({ label, filter, icon, colors }) => {
          const group = items.filter((r) => r.isAI === filter);
          const gQuota = group.reduce((s, r) => s + r.quota, 0);
          const gClosed = group.reduce((s, r) => s + r.closed, 0);
          const gAtt = gQuota > 0 ? Math.round((gClosed / gQuota) * 100) : 0;
          return (
            <div key={label} className={`rounded-xl border p-3 ${colors}`}>
              <h4 className="text-sm mb-1">{icon} {label} ({group.length})</h4>
              <div className="flex items-center gap-4 text-xs">
                <span>Quota: {formatVND(gQuota)}</span>
                <span>Close: {formatVND(gClosed)}</span>
                <span>Att: {gAtt}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm nhân viên, vai trò, team..."
        filters={QUOTA_FILTERS}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        hasActiveFilters={hasActiveFilters}
        actions={<ViewToggle mode={mode} onSetMode={setMode} />}
      />

      {/* Data View */}
      {mode === "table" ? (
        <DataTable
          data={items}
          columns={QUOTA_COLUMNS}
          storageKey="quota-mgmt"
          selectable
          onInlineEdit={handleInlineEdit}
          onRowClick={setSelectedRep}
          onBulkDelete={handleBulkDelete}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelectedRep(item)}
                className="p-1 text-gray-400 hover:text-teal-600"><Eye className="w-4 h-4" /></button>
              <button type="button" onClick={() => setDeleteTarget(item)}
                className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
          defaultSortField="attainment"
          emptyMessage="Không có dữ liệu chỉ tiêu"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedItems.map((rep) => (
              <RepCard key={rep.id} rep={rep}
                onView={() => setSelectedRep(rep)}
                onDelete={() => setDeleteTarget(rep)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
              <span>{startIndex}–{endIndex} / {totalItems}</span>
              <div className="flex items-center gap-1">
                <button type="button" disabled={isFirstPage} onClick={prevPage}
                  className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-30">←</button>
                <span>Trang {currentPage + 1}/{totalPages}</span>
                <button type="button" disabled={isLastPage} onClick={nextPage}
                  className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-30">→</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <h4 className="text-sm text-teal-900">AI Quota Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-teal-800">
          <p className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Hoàng Thị Linh</strong> đang <strong>behind 33%</strong> (mục tiêu 75%). Pipeline 9.8B₫ nhưng win rate chỉ 33%. Recommend: pair coaching với <strong>Phạm Văn Khôi</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Phạm Văn Khôi</strong> đã đạt <strong>85%</strong> quota — forecast vượt 119%. AI suggest: <strong>tăng quota Q2</strong> lên 10B₫ (+25%).</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Team forecast <strong>{formatVND(stats.totalForecast)}</strong> vs quota <strong>{formatVND(stats.totalQuota)}</strong> — gap <strong>{formatVND(stats.totalQuota - stats.totalForecast)}</strong>. AI tìm thấy 3 deals high-probability có thể accelerate.</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {selectedRep && <RepDetailModal rep={selectedRep} onClose={() => setSelectedRep(null)} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name ?? ""}
        entityType="bản ghi chỉ tiêu"
        description="Thao tác này không thể hoàn tác."
      />
      {showCreateModal && <CreateQuotaRepModal onClose={() => setShowCreateModal(false)} onCreated={loadData} />}
    </div>
  );
}