/**
 * Forecast & Revenue Planning — Dự báo doanh thu.
 * Features: DataTable + Card view toggle, FilterBar, Pagination,
 *   Column Visibility, Inline Edit (quota), Detail Modal,
 *   Charts (Area, Bar), AI Insights, Delete đơn lẻ + bulk.
 * Phase 5 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  LineChart as LineChartIcon, TrendingUp, Target, Bot, Sparkles,
  ChevronDown, ChevronUp, AlertTriangle, ArrowUpRight, ArrowDownRight,
  BarChart3, Calendar, Layers, Eye, X, Trash2, Gauge, Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend, Line, ReferenceLine,
} from "recharts";
import type { RepForecast, ForecastScenario } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { formatCurrency } from "../../constants/crmConfig";
import {
  fetchRepForecasts, updateRepForecast,
  deleteRepForecasts as apiDeleteForecasts,
} from "../../api/crmApi";
import { monthlyForecastData } from "../../data/forecastData";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar } from "../../components/crm/FilterBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Constants
 * ============================================================ */
const SCENARIO_CONFIG: Record<ForecastScenario, { label: string; color: string; stroke: string; desc: string }> = {
  conservative: { label: "Thận trọng", color: "text-amber-600 bg-amber-50", stroke: "#f59e0b", desc: "Chỉ tính commit deals (>80% xác suất)" },
  base: { label: "Cơ bản", color: "text-blue-600 bg-blue-50", stroke: "#3b82f6", desc: "Commit + Best Case (>50% xác suất)" },
  optimistic: { label: "Lạc quan", color: "text-green-600 bg-green-50", stroke: "#22c55e", desc: "Tất cả pipeline có xác suất >20%" },
};

const QUARTER_SUMMARIES = [
  { quarter: "Q1", target: 750000, commit: 640000, bestCase: 820000, upside: 280000, coverage: 232, gap: 110000 },
  { quarter: "Q2", target: 810000, commit: 580000, bestCase: 760000, upside: 350000, coverage: 209, gap: 230000 },
  { quarter: "Q3", target: 870000, commit: 450000, bestCase: 680000, upside: 420000, coverage: 178, gap: 420000 },
  { quarter: "Q4", target: 930000, commit: 320000, bestCase: 550000, upside: 500000, coverage: 147, gap: 610000 },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const FORECAST_COLUMNS: ColumnDef<RepForecast>[] = [
  {
    key: "name", header: "Người bán", sortable: true, minWidth: 180,
    render: (r) => (
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
          r.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-violet-100 text-violet-700"
        }`}>{r.isAI ? "🤖" : r.avatar.slice(0, 2)}</div>
        <div className="min-w-0">
          <p className="text-gray-900 text-[13px] truncate flex items-center gap-1">
            {r.name}
            {r.trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
            {r.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
          </p>
          <p className="text-[10px] text-gray-400">{r.role}</p>
        </div>
      </div>
    ),
  },
  {
    key: "quota", header: "Target", sortable: true, minWidth: 90, editable: true,
    render: (r) => <span className="text-gray-900">${(r.quota / 1000).toFixed(0)}K</span>,
    sortValue: (r) => r.quota,
  },
  {
    key: "commit", header: "Commit", sortable: true, minWidth: 90,
    render: (r) => {
      const pct = Math.round((r.commit / r.quota) * 100);
      const color = pct >= 90 ? "text-green-600" : pct >= 70 ? "text-amber-600" : "text-red-600";
      return <span className={`${color}`}>${(r.commit / 1000).toFixed(0)}K <span className="text-[9px]">({pct}%)</span></span>;
    },
    sortValue: (r) => r.commit,
  },
  {
    key: "bestCase", header: "Best Case", sortable: true, minWidth: 90,
    render: (r) => <span className="text-blue-600">${(r.bestCase / 1000).toFixed(0)}K</span>,
    sortValue: (r) => r.bestCase,
  },
  {
    key: "upside", header: "Upside", sortable: true, minWidth: 80, defaultHidden: true,
    render: (r) => <span className="text-amber-600">${(r.upside / 1000).toFixed(0)}K</span>,
    sortValue: (r) => r.upside,
  },
  {
    key: "pipeline", header: "Pipeline", sortable: true, minWidth: 90,
    render: (r) => <span className="text-gray-600">${(r.pipeline / 1000).toFixed(0)}K</span>,
    sortValue: (r) => r.pipeline,
  },
  {
    key: "coverage", header: "Coverage", sortable: true, minWidth: 80,
    render: (r) => {
      const color = r.coverage >= 250 ? "text-green-600" : r.coverage >= 200 ? "text-amber-600" : "text-red-600";
      return <span className={`${color}`}>{r.coverage}%</span>;
    },
    sortValue: (r) => r.coverage,
  },
  {
    key: "aiConfidence", header: "AI %", sortable: true, minWidth: 70,
    render: (r) => {
      const color = r.aiConfidence >= 80 ? "text-green-600 bg-green-50" :
        r.aiConfidence >= 60 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
      return <span className={`text-[11px] px-1.5 py-0.5 rounded ${color}`}>{r.aiConfidence}%</span>;
    },
    sortValue: (r) => r.aiConfidence,
  },
];

/* ============================================================
 * Detail Modal
 * ============================================================ */
function RepDetailModal({ rep, onClose }: { rep: RepForecast; onClose: () => void }) {
  const commitPct = Math.round((rep.commit / rep.quota) * 100);
  const confColor = rep.aiConfidence >= 80 ? "text-green-600 bg-green-50" :
    rep.aiConfidence >= 60 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
              rep.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-violet-100 text-violet-700"
            }`}>{rep.isAI ? "🤖" : rep.avatar.slice(0, 2)}</div>
            <div>
              <h3 className="text-gray-900">{rep.name}</h3>
              <p className="text-xs text-gray-500">{rep.role}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">${(rep.quota / 1000).toFixed(0)}K</p>
              <p className="text-[9px] text-gray-400">Target</p>
            </div>
            <div className={`rounded-lg p-2 text-center ${commitPct >= 90 ? "bg-green-50" : "bg-amber-50"}`}>
              <p className={`text-sm ${commitPct >= 90 ? "text-green-600" : "text-amber-600"}`}>{commitPct}%</p>
              <p className="text-[9px] text-gray-400">Commit</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{rep.coverage}%</p>
              <p className="text-[9px] text-gray-400">Coverage</p>
            </div>
            <div className={`rounded-lg p-2 text-center ${confColor}`}>
              <p className="text-sm">{rep.aiConfidence}%</p>
              <p className="text-[9px] opacity-70">AI Conf.</p>
            </div>
          </div>
          {/* Stacked bar */}
          <div>
            <p className="text-[10px] text-gray-400 mb-1">Pipeline Breakdown</p>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (rep.commit / rep.quota) * 100)}%` }} />
              <div className="h-full bg-blue-400" style={{ width: `${Math.min(100 - (rep.commit / rep.quota) * 100, ((rep.bestCase - rep.commit) / rep.quota) * 100)}%` }} />
              <div className="h-full bg-amber-400" style={{ width: `${Math.min(100 - (rep.bestCase / rep.quota) * 100, (rep.upside / rep.quota) * 100)}%` }} />
            </div>
            <div className="flex items-center gap-4 text-[9px] text-gray-400 mt-1">
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Commit ${(rep.commit / 1000).toFixed(0)}K</span>
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-full bg-blue-400" /> Best ${(rep.bestCase / 1000).toFixed(0)}K</span>
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Upside ${(rep.upside / 1000).toFixed(0)}K</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400">Pipeline</p>
              <p className="text-sm text-gray-900">${(rep.pipeline / 1000).toFixed(0)}K</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400">Gap vs Target</p>
              <p className={`text-sm ${rep.commit >= rep.quota ? "text-green-600" : "text-red-600"}`}>
                {rep.commit >= rep.quota ? "+" : "-"}${(Math.abs(rep.quota - rep.commit) / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
          <div className="bg-violet-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>{rep.aiNote}</span>
            </p>
          </div>
          {rep.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {rep.tags.map((t) => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
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
 * Card View
 * ============================================================ */
function RepForecastCard({ rep, onView, onDelete }: {
  rep: RepForecast; onView: (r: RepForecast) => void; onDelete: (r: RepForecast) => void;
}) {
  const commitPct = Math.round((rep.commit / rep.quota) * 100);
  const confColor = rep.aiConfidence >= 80 ? "text-green-600 bg-green-50" :
    rep.aiConfidence >= 60 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView(rep)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
            rep.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-violet-100 text-violet-700"
          }`}>{rep.isAI ? "🤖" : rep.avatar.slice(0, 2)}</div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="text-sm text-gray-900">{rep.name}</h4>
              {rep.trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
              {rep.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
            </div>
            <p className="text-[10px] text-gray-400">{rep.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] px-2 py-1 rounded-full ${confColor}`}>AI: {rep.aiConfidence}%</span>
          <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(rep); }}
            className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>
      {/* Stacked bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-gray-500">Commit vs Target</span>
          <span className={commitPct >= 100 ? "text-green-600" : commitPct >= 70 ? "text-amber-600" : "text-red-600"}>{commitPct}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (rep.commit / rep.quota) * 100)}%` }} />
          <div className="h-full bg-blue-400" style={{ width: `${Math.min(100 - (rep.commit / rep.quota) * 100, ((rep.bestCase - rep.commit) / rep.quota) * 100)}%` }} />
          <div className="h-full bg-amber-400" style={{ width: `${Math.min(100 - (rep.bestCase / rep.quota) * 100, (rep.upside / rep.quota) * 100)}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] mb-2">
        <div className="bg-green-50 rounded p-1"><p className="text-green-700">${(rep.commit / 1000).toFixed(0)}K</p><p className="text-gray-400">Commit</p></div>
        <div className="bg-blue-50 rounded p-1"><p className="text-blue-700">${(rep.bestCase / 1000).toFixed(0)}K</p><p className="text-gray-400">Best</p></div>
        <div className="bg-amber-50 rounded p-1"><p className="text-amber-700">${(rep.upside / 1000).toFixed(0)}K</p><p className="text-gray-400">Upside</p></div>
        <div className="bg-gray-50 rounded p-1"><p className="text-gray-600">{rep.coverage}%</p><p className="text-gray-400">Cov.</p></div>
      </div>
      <p className="text-[10px] text-violet-700 bg-violet-50 rounded-lg p-2 flex items-start gap-1">
        <Bot className="w-3 h-3 mt-0.5 flex-shrink-0 text-violet-500" /> {rep.aiNote}
      </p>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function ForecastPage() {
  const { mode, setMode } = useViewMode("forecast", "table");
  const [reps, setReps] = useState<RepForecast[]>([]);
  const [search, setSearch] = useState("");
  const [activeScenario, setActiveScenario] = useState<ForecastScenario>("base");
  const [showQuarters, setShowQuarters] = useState(true);
  const [selectedRep, setSelectedRep] = useState<RepForecast | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; name: string } | null>(null);

  /* ---- Load data ---- */
  const loadData = useCallback(async () => {
    const data = await fetchRepForecasts({ search: search || undefined });
    setReps(data);
  }, [search]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ---- Stats ---- */
  const teamStats = useMemo(() => {
    const totalQuota = reps.reduce((s, r) => s + r.quota, 0);
    const totalCommit = reps.reduce((s, r) => s + r.commit, 0);
    const totalBestCase = reps.reduce((s, r) => s + r.bestCase, 0);
    const totalPipeline = reps.reduce((s, r) => s + r.pipeline, 0);
    const avgConfidence = reps.length > 0 ? Math.round(reps.reduce((s, r) => s + r.aiConfidence, 0) / reps.length) : 0;
    return { totalQuota, totalCommit, totalBestCase, totalPipeline, avgConfidence };
  }, [reps]);

  const commitPct = teamStats.totalQuota > 0 ? Math.round((teamStats.totalCommit / teamStats.totalQuota) * 100) : 0;

  /* ---- Handlers ---- */
  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateRepForecast(rowId, { [field]: Number(value) });
    toast.success("Đã cập nhật");
    loadData();
  }, [loadData]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const count = await apiDeleteForecasts(deleteTarget.ids);
    toast.success(`Đã xóa ${count} dự báo`);
    setDeleteTarget(null);
    loadData();
  }, [deleteTarget, loadData]);

  const handleBulkDelete = useCallback((ids: string[]) => {
    setDeleteTarget({ ids, name: `${ids.length} dự báo` });
  }, []);

  /* ---- Card pagination ---- */
  const { paginatedItems: cardItems, currentPage, totalPages, totalItems, isFirstPage, isLastPage, startIndex, endIndex, goToPage, nextPage, prevPage } = usePagination(reps, { storageKey: "forecast-cards" });

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <LineChartIcon className="w-6 h-6 text-violet-600" /> Dự báo Doanh thu
        </h1>
        <p className="text-gray-500 mt-0.5">AI Scenario Modeling — Pipeline-weighted forecast, quota coverage, per-rep analysis</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-3">
          <Target className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">${(teamStats.totalQuota / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-violet-700">Target Q1</p>
        </div>
        <div className={`rounded-xl border p-3 ${commitPct >= 85 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-lg ${commitPct >= 85 ? "text-green-600" : "text-amber-600"}`}>${(teamStats.totalCommit / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-gray-600">Commit ({commitPct}%)</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3">
          <p className="text-lg text-blue-600">${(teamStats.totalBestCase / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-blue-700">Best Case</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">${(teamStats.totalPipeline / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-gray-500">Pipeline</p>
        </div>
        <div className={`rounded-xl border p-3 ${teamStats.avgConfidence >= 70 ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"}`}>
          <p className={`text-lg ${teamStats.avgConfidence >= 70 ? "text-green-600" : "text-amber-600"}`}>{teamStats.avgConfidence}%</p>
          <p className="text-xs text-gray-500">AI Confidence TB</p>
        </div>
      </div>

      {/* Scenario Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-sm text-gray-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-violet-500" /> Dự báo 12 tháng — AI Scenario
          </h3>
          <div className="flex items-center gap-1">
            {(Object.keys(SCENARIO_CONFIG) as ForecastScenario[]).map((s) => {
              const cfg = SCENARIO_CONFIG[s];
              return (
                <button key={s} type="button" onClick={() => setActiveScenario(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    activeScenario === s ? cfg.color + " border border-current/20" : "text-gray-400 hover:bg-gray-100"
                  }`}>{cfg.label}</button>
              );
            })}
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mb-3">{SCENARIO_CONFIG[activeScenario].desc}</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyForecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
            <Tooltip formatter={(v: number | null) => v !== null ? [`$${v}K`] : ["—"]} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <ReferenceLine y={270} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "AVG Target", fontSize: 9, fill: "#ef4444" }} />
            <Area type="monotone" dataKey="optimistic" name="Lạc quan" stroke="#22c55e" fill="#22c55e"
              fillOpacity={activeScenario === "optimistic" ? 0.15 : 0.03}
              strokeWidth={activeScenario === "optimistic" ? 2.5 : 1} strokeOpacity={activeScenario === "optimistic" ? 1 : 0.3} />
            <Area type="monotone" dataKey="base" name="Cơ bản" stroke="#3b82f6" fill="#3b82f6"
              fillOpacity={activeScenario === "base" ? 0.15 : 0.03}
              strokeWidth={activeScenario === "base" ? 2.5 : 1} strokeOpacity={activeScenario === "base" ? 1 : 0.3} />
            <Area type="monotone" dataKey="conservative" name="Thận trọng" stroke="#f59e0b" fill="#f59e0b"
              fillOpacity={activeScenario === "conservative" ? 0.15 : 0.03}
              strokeWidth={activeScenario === "conservative" ? 2.5 : 1} strokeOpacity={activeScenario === "conservative" ? 1 : 0.3} />
            <Line type="monotone" dataKey="actual" name="Thực tế" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quarterly Summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <button type="button" onClick={() => setShowQuarters(!showQuarters)} className="flex items-center justify-between w-full mb-3">
          <h3 className="text-sm text-gray-800 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-500" /> Tóm tắt theo Quý
          </h3>
          {showQuarters ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showQuarters && (
          <div className="space-y-2">
            {QUARTER_SUMMARIES.map((q) => {
              const coverageColor = q.coverage >= 200 ? "text-green-600" : q.coverage >= 150 ? "text-amber-600" : "text-red-600";
              return (
                <div key={q.quarter} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-900 w-8">{q.quarter}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-gray-500">Target: ${(q.target / 1000).toFixed(0)}K</span>
                      <span className="text-green-600">Commit: ${(q.commit / 1000).toFixed(0)}K</span>
                      <span className="text-blue-600">BC: ${(q.bestCase / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(100, (q.commit / q.target) * 100)}%` }} />
                    </div>
                  </div>
                  <span className={`text-xs ${coverageColor}`}>{q.coverage}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Gap Alert */}
      {teamStats.totalCommit < teamStats.totalQuota && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm text-amber-800">
              Gap Analysis: thiếu ${((teamStats.totalQuota - teamStats.totalCommit) / 1000).toFixed(0)}K commit so với target
            </h4>
          </div>
          <p className="text-xs text-amber-700 ml-6">
            Cần convert {Math.ceil((teamStats.totalQuota - teamStats.totalCommit) / 45000)} deals best-case (avg $45K) để đóng gap.
            AI gợi ý focus vào 5 deals có xác suất &gt;65% trong pipeline.
          </p>
        </div>
      )}

      {/* Per-Rep Section */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm người bán, vai trò..."
        onClearAll={() => setSearch("")}
        hasActiveFilters={search !== ""}
        actions={<ViewToggle mode={mode} onSetMode={setMode} />}
      />

      {/* Table View */}
      {mode === "table" && (
        <DataTable<RepForecast>
          data={reps}
          columns={FORECAST_COLUMNS}
          storageKey="forecast"
          selectable
          onInlineEdit={handleInlineEdit}
          onRowClick={setSelectedRep}
          onBulkDelete={handleBulkDelete}
          defaultSortField="commit"
          emptyMessage="Không tìm thấy dữ liệu dự báo"
          renderRowActions={(rep) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelectedRep(rep)}
                className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [rep.id], name: rep.name })}
                className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
        />
      )}

      {/* Card View */}
      {mode === "card" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cardItems.map((rep) => (
              <RepForecastCard key={rep.id} rep={rep}
                onView={setSelectedRep}
                onDelete={(r) => setDeleteTarget({ ids: [r.id], name: r.name })} />
            ))}
          </div>
          {reps.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-400">
                <span>{startIndex + 1}–{endIndex} / {totalItems}</span>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={isFirstPage} onClick={prevPage} className="px-2 py-1 border rounded disabled:opacity-30">←</button>
                  <span>Trang {currentPage}/{totalPages}</span>
                  <button type="button" disabled={isLastPage} onClick={nextPage} className="px-2 py-1 border rounded disabled:opacity-30">→</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Forecast Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Base scenario đạt 95% target Q1. Nếu close TechCorp Phase 2 ($120K commit), sẽ vượt 103%.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            Q2-Q3 pipeline coverage chỉ 178-209% — dưới benchmark 250%. Cần tăng prospecting từ T4.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            Seasonal pattern: Q4 luôn cao nhất. AI dự đoán tăng trưởng 15% YoY nếu giữ pipeline coverage &gt;250%.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRep && <RepDetailModal rep={selectedRep} onClose={() => setSelectedRep(null)} />}

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name ?? ""}
        entityType="dự báo"
        description="Dữ liệu dự báo sẽ bị xóa vĩnh viễn."
      />
    </div>
  );
}