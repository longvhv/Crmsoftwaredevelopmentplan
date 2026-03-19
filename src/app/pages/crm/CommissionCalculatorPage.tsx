/**
 * Commission Calculator — Tính hoa hồng sales tự động.
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Inline Edit (payoutStatus), Detail Modal,
 *   AI Insights, Delete đơn lẻ + bulk, Charts (bar + line).
 * Phase 5 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Calculator, DollarSign, TrendingUp, Target,
  Sparkles, Bot, Trash2, Eye, X, Zap, Gift,
  ChevronDown, ChevronUp, BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";
import type { SalesRepCommission, PayoutStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { PAYOUT_STATUS_CONFIG, formatUSD } from "../../constants/crmConfig";
import { commissionTiers, bonusRules } from "../../data/commissionData";
import {
  fetchSalesRepCommissions, updateSalesRepCommission,
  deleteSalesRepCommissions,
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
const COMM_FILTERS: FilterConfig[] = [
  {
    key: "payoutStatus", label: "Trạng thái chi", type: "select",
    options: Object.entries(PAYOUT_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const COMM_COLUMNS: ColumnDef<SalesRepCommission>[] = [
  {
    key: "name", header: "Nhân viên", sortable: true, minWidth: 200,
    render: (r) => (
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
          r.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-violet-100 text-violet-700"
        }`}>
          {r.isAI ? "🤖" : r.avatar.slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="text-gray-900 truncate">{r.name}</p>
          <p className="text-[10px] text-gray-400 truncate">{r.role} · Tier: {r.baseTier}</p>
        </div>
      </div>
    ),
  },
  {
    key: "attainment", header: "Attainment", sortable: true, minWidth: 120,
    render: (r) => {
      const color = r.attainment >= 100 ? "text-green-600" : r.attainment >= 80 ? "text-amber-600" : "text-red-600";
      const bgColor = r.attainment >= 100 ? "bg-green-500" : r.attainment >= 80 ? "bg-amber-500" : "bg-red-500";
      return (
        <div className="min-w-0">
          <span className={color}>{r.attainment}%</span>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
            <div className={`h-full rounded-full ${bgColor}`} style={{ width: `${Math.min(150, r.attainment)}%` }} />
          </div>
          <p className="text-[9px] text-gray-400">{formatUSD(r.revenue)} / {formatUSD(r.quota)}</p>
        </div>
      );
    },
    sortValue: (r) => r.attainment,
  },
  {
    key: "baseCommission", header: "Base", sortable: true, minWidth: 90,
    render: (r) => <span className="text-gray-900">{formatUSD(r.baseCommission)}</span>,
    sortValue: (r) => r.baseCommission,
  },
  {
    key: "acceleratorCommission", header: "Accelerator", sortable: true, minWidth: 100,
    defaultHidden: true,
    render: (r) => (
      <span className={r.acceleratorCommission > 0 ? "text-violet-700" : "text-gray-300"}>
        {r.acceleratorCommission > 0 ? `+${formatUSD(r.acceleratorCommission)}` : "—"}
      </span>
    ),
    sortValue: (r) => r.acceleratorCommission,
  },
  {
    key: "bonuses", header: "Bonus", sortable: true, minWidth: 90,
    render: (r) => {
      const total = r.bonuses.reduce((s, b) => s + b.amount, 0);
      return <span className={total > 0 ? "text-amber-700" : "text-gray-300"}>{total > 0 ? `+${formatUSD(total)}` : "—"}</span>;
    },
    sortValue: (r) => r.bonuses.reduce((s, b) => s + b.amount, 0),
  },
  {
    key: "totalCommission", header: "Tổng hoa hồng", sortable: true, minWidth: 120,
    render: (r) => <span className="text-gray-900">{formatUSD(r.totalCommission)}</span>,
    sortValue: (r) => r.totalCommission,
  },
  {
    key: "payoutStatus", header: "Trạng thái", sortable: true, minWidth: 110, editable: true,
    render: (r) => {
      const cfg = PAYOUT_STATUS_CONFIG[r.payoutStatus];
      return <span className={`text-[11px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.payoutStatus} onChange={(e) => { onChange(e.target.value); onSave(); }}
        onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(PAYOUT_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "splitDeals", header: "Split Deals", sortable: true, minWidth: 80,
    defaultHidden: true,
    render: (r) => <span className="text-gray-600">{r.splitDeals}</span>,
    sortValue: (r) => r.splitDeals,
  },
];

/* ============================================================
 * Chart Data helpers
 * ============================================================ */
function buildBarData(reps: SalesRepCommission[]) {
  return [...reps]
    .sort((a, b) => b.totalCommission - a.totalCommission)
    .map((r) => ({
      name: r.name.split(" ").pop() ?? r.name,
      base: Math.round(r.baseCommission / 1000),
      bonus: Math.round((r.bonuses.reduce((s, b) => s + b.amount, 0) + r.acceleratorCommission) / 1000),
    }));
}

function buildTrendData(reps: SalesRepCommission[]) {
  const months = ["T10", "T11", "T12", "T1", "T2", "T3"];
  return months.map((m, i) => ({
    month: m,
    total: reps.reduce((s, r) => s + (r.monthlyCommissions[i] ?? 0), 0) / 1000,
  }));
}

/* ============================================================
 * Card View
 * ============================================================ */
function RepCard({ rep, onView, onDelete }: {
  rep: SalesRepCommission;
  onView: () => void;
  onDelete: () => void;
}) {
  const pCfg = PAYOUT_STATUS_CONFIG[rep.payoutStatus];
  const attColor = rep.attainment >= 100 ? "text-green-600" : rep.attainment >= 80 ? "text-amber-600" : "text-red-600";
  const barColor = rep.attainment >= 100 ? "bg-green-500" : rep.attainment >= 80 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0" onClick={onView} role="button" tabIndex={0}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
            rep.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-violet-100 text-violet-700"
          }`}>
            {rep.isAI ? "🤖" : rep.avatar.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm text-gray-900 truncate">{rep.name}</h4>
            <p className="text-[10px] text-gray-400">{rep.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${pCfg.bgColor} ${pCfg.color}`}>{pCfg.label}</span>
          <button type="button" onClick={onDelete}
            className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Attainment bar */}
      <div className="mb-3" onClick={onView} role="button" tabIndex={0}>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Attainment</span>
          <span className={attColor}>{rep.attainment}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(150, rep.attainment)}%` }} />
        </div>
        <div className="flex items-center justify-between text-[9px] text-gray-400 mt-0.5">
          <span>{formatUSD(rep.revenue)}</span>
          <span>Target: {formatUSD(rep.quota)}</span>
        </div>
      </div>

      {/* Commission breakdown */}
      <div className="grid grid-cols-3 gap-2 mb-2" onClick={onView} role="button" tabIndex={0}>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-gray-900">{formatUSD(rep.baseCommission)}</p>
          <p className="text-[8px] text-gray-400">Base</p>
        </div>
        <div className="bg-violet-50 rounded p-1.5 text-center">
          <p className="text-xs text-violet-700">{formatUSD(rep.acceleratorCommission)}</p>
          <p className="text-[8px] text-gray-400">Accel.</p>
        </div>
        <div className="bg-amber-50 rounded p-1.5 text-center">
          <p className="text-xs text-amber-700">{formatUSD(rep.bonuses.reduce((s, b) => s + b.amount, 0))}</p>
          <p className="text-[8px] text-gray-400">Bonus</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-500">Tổng hoa hồng</span>
        <span className="text-gray-900">{formatUSD(rep.totalCommission)}</span>
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function RepDetailModal({ rep, onClose }: {
  rep: SalesRepCommission;
  onClose: () => void;
}) {
  const pCfg = PAYOUT_STATUS_CONFIG[rep.payoutStatus];
  const monthData = rep.monthlyCommissions.map((v, i) => ({
    month: ["T10", "T11", "T12", "T1", "T2", "T3"][i],
    commission: v / 1000,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
              rep.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-violet-100 text-violet-700"
            }`}>
              {rep.isAI ? "🤖" : rep.avatar.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-gray-900">{rep.name}</h3>
              <p className="text-xs text-gray-500">{rep.role} · Tier: {rep.baseTier}</p>
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
              <p className="text-sm text-gray-900">{formatUSD(rep.revenue)}</p>
              <p className="text-[9px] text-gray-400">Doanh thu</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className={`text-sm ${rep.attainment >= 100 ? "text-green-600" : "text-amber-600"}`}>{rep.attainment}%</p>
              <p className="text-[9px] text-gray-400">Attainment</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{rep.splitDeals}</p>
              <p className="text-[9px] text-gray-400">Split Deals</p>
            </div>
            <div className={`rounded-lg p-2 text-center border ${pCfg.bgColor}`}>
              <p className={`text-sm ${pCfg.color}`}>{pCfg.label}</p>
              <p className="text-[9px] text-gray-400">Trạng thái</p>
            </div>
          </div>

          {/* Commission Breakdown */}
          <div className="bg-violet-50 rounded-lg border border-violet-100 p-3 space-y-2">
            <h4 className="text-xs text-violet-800 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" /> Chi tiết tính hoa hồng
            </h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Base Commission ({rep.baseTier})</span>
                <span className="text-gray-900">{formatUSD(rep.baseCommission)}</span>
              </div>
              {rep.acceleratorCommission > 0 && (
                <div className="flex items-center justify-between text-violet-700">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Accelerator</span>
                  <span>+{formatUSD(rep.acceleratorCommission)}</span>
                </div>
              )}
              {rep.bonuses.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-amber-700">
                  <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> {b.name}</span>
                  <span>+{formatUSD(b.amount)}</span>
                </div>
              ))}
              <hr className="border-violet-200" />
              <div className="flex items-center justify-between text-gray-900">
                <span>Tổng hoa hồng</span>
                <span className="text-lg">{formatUSD(rep.totalCommission)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>Effective Rate</span>
                <span>{((rep.totalCommission / rep.revenue) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Monthly trend */}
          <div>
            <h4 className="text-xs text-gray-500 mb-1">Hoa hồng theo tháng ($K)</h4>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
                <Tooltip formatter={(v: number) => [`$${v.toFixed(1)}K`, "Hoa hồng"]} />
                <Bar dataKey="commission" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tier info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-xs text-gray-500 mb-1.5">Tier hiện tại</h4>
            {commissionTiers.filter((t) => t.name === rep.baseTier).map((t) => (
              <div key={t.id} className="text-sm">
                <p className="text-gray-900">{t.name} — {t.rate}% + accelerator {t.accelerator}x</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
              </div>
            ))}
          </div>
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
export function CommissionCalculatorPage() {
  const [items, setItems] = useState<SalesRepCommission[]>([]);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const { mode, setMode } = useViewMode("commission-calc");
  const [selectedRep, setSelectedRep] = useState<SalesRepCommission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SalesRepCommission | null>(null);
  const [showTiers, setShowTiers] = useState(false);
  const [showBonuses, setShowBonuses] = useState(false);

  /* ---- Load data ---- */
  const loadData = useCallback(async () => {
    const data = await fetchSalesRepCommissions({
      search: search || undefined,
      status: (filterValues.payoutStatus as PayoutStatus) || null,
    });
    setItems(data);
  }, [search, filterValues]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    const totalCommission = items.reduce((s, r) => s + r.totalCommission, 0);
    const totalRevenue = items.reduce((s, r) => s + r.revenue, 0);
    const avgAttainment = items.length > 0 ? Math.round(items.reduce((s, r) => s + r.attainment, 0) / items.length) : 0;
    const overTarget = items.filter((r) => r.attainment >= 100).length;
    return { totalCommission, totalRevenue, avgAttainment, overTarget };
  }, [items]);

  /* ---- Chart data ---- */
  const barData = useMemo(() => buildBarData(items), [items]);
  const trendData = useMemo(() => buildTrendData(items), [items]);

  /* ---- Pagination for card view ---- */
  const { paginatedItems, currentPage, totalPages, pageSize, goToPage, nextPage, prevPage, setPageSize,
    startIndex, endIndex, isFirstPage, isLastPage, totalItems } = usePagination(items, { storageKey: "commission-calc" });

  /* ---- Handlers ---- */
  const hasActiveFilters = search !== "" || Object.values(filterValues).some((v) => v !== "");

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearAll = useCallback(() => {
    setSearch("");
    setFilterValues({});
  }, []);

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateSalesRepCommission(rowId, { [field]: value });
    toast.success("Đã cập nhật trạng thái chi");
    loadData();
  }, [loadData]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteSalesRepCommissions([deleteTarget.id]);
    toast.success(`Đã xóa hoa hồng "${deleteTarget.name}"`);
    setDeleteTarget(null);
    loadData();
  }, [deleteTarget, loadData]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    const count = await deleteSalesRepCommissions(ids);
    toast.success(`Đã xóa ${count} bản ghi hoa hồng`);
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-violet-600" /> Hoa hồng Sales
        </h1>
        <p className="text-gray-500 mt-0.5">
          Tính hoa hồng tự động — Rule engine, accelerator, bonus, payout tracking
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 p-3">
          <DollarSign className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-gray-900">{formatUSD(stats.totalCommission)}</p>
          <p className="text-xs text-green-700">Tổng hoa hồng team</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">{formatUSD(stats.totalRevenue)}</p>
          <p className="text-xs text-gray-500">Tổng doanh thu</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className={`text-lg ${stats.avgAttainment >= 100 ? "text-green-600" : "text-amber-600"}`}>
            {stats.avgAttainment}%
          </p>
          <p className="text-xs text-gray-500">Attainment TB</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-green-600">{stats.overTarget}/{items.length}</p>
          <p className="text-xs text-gray-500">Vượt target</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-violet-500" /> Hoa hồng theo người ($K)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
              <Tooltip formatter={(v: number) => [`$${v}K`]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="base" name="Base" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="bonus" name="Bonus+Accel" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-green-500" /> Xu hướng tổng hoa hồng ($K)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(1)}K`, "Tổng hoa hồng"]} />
              <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Commission Tiers */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <button type="button" onClick={() => setShowTiers(!showTiers)} className="flex items-center justify-between w-full">
          <h3 className="text-sm text-gray-800 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-violet-500" /> Commission Tiers (Rule Engine)
          </h3>
          {showTiers ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showTiers && (
          <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {commissionTiers.map((tier) => {
              const colors: Record<string, string> = {
                Bronze: "border-amber-700/30 bg-amber-50/50", Silver: "border-gray-300 bg-gray-50",
                Gold: "border-amber-400 bg-amber-50", Platinum: "border-violet-400 bg-violet-50",
              };
              return (
                <div key={tier.id} className={`rounded-lg border-2 p-3 ${colors[tier.name] ?? ""}`}>
                  <h4 className="text-sm text-gray-900 mb-1">{tier.name}</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>Tỷ lệ: <span className="text-gray-900">{tier.rate}%</span></p>
                    <p>Accelerator: <span className="text-violet-700">{tier.accelerator}x</span></p>
                    <p className="text-[10px] text-gray-400">
                      {formatUSD(tier.minRevenue)}{tier.maxRevenue ? ` — ${formatUSD(tier.maxRevenue)}` : "+"}
                    </p>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1.5">{tier.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bonus Rules */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <button type="button" onClick={() => setShowBonuses(!showBonuses)} className="flex items-center justify-between w-full">
          <h3 className="text-sm text-gray-800 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-500" /> Bonus Rules ({bonusRules.length})
          </h3>
          {showBonuses ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showBonuses && (
          <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {bonusRules.map((rule) => (
              <div key={rule.id} className="bg-amber-50/50 rounded-lg border border-amber-100 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{rule.icon}</span>
                  <h5 className="text-sm text-gray-900">{rule.name}</h5>
                </div>
                <p className="text-xs text-gray-500 mb-1">{rule.condition}</p>
                <p className="text-sm text-amber-700">
                  {rule.type === "flat" ? `+$${rule.bonus.toLocaleString()}` : `+${rule.bonus}% deal value`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm nhân viên, vai trò..."
        filters={COMM_FILTERS}
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
          columns={COMM_COLUMNS}
          storageKey="commission-calc"
          selectable
          onInlineEdit={handleInlineEdit}
          onRowClick={setSelectedRep}
          onBulkDelete={handleBulkDelete}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelectedRep(item)}
                className="p-1 text-gray-400 hover:text-violet-600"><Eye className="w-4 h-4" /></button>
              <button type="button" onClick={() => setDeleteTarget(item)}
                className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
          defaultSortField="totalCommission"
          emptyMessage="Không có dữ liệu hoa hồng"
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
              <span>{startIndex + 1}–{endIndex} / {totalItems}</span>
              <div className="flex items-center gap-1">
                <button type="button" disabled={isFirstPage} onClick={prevPage}
                  className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-30">←</button>
                <span>Trang {currentPage}/{totalPages}</span>
                <button type="button" disabled={isLastPage} onClick={nextPage}
                  className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-30">→</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Commission Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Nguyễn Văn An đạt Platinum tier — effective rate 12.5%. Gợi ý: giữ compensation để retain top talent.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            AI Agent Nova đạt 127% target nhưng deal size nhỏ. Commission AI nên tái đầu tư vào training data.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            Phạm Thanh Tùng ở 78% attainment — xu hướng giảm 3 tháng. Cần action plan trước khi kết quý.
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
        entityType="bản ghi hoa hồng"
        description="Thao tác này không thể hoàn tác."
      />
    </div>
  );
}
