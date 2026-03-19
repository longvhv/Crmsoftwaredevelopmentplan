/**
 * Territory Management — Quản lý Vùng lãnh thổ Sales
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Detail Modal, AI Insights, Delete đơn lẻ + bulk.
 * Phase 6 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  MapPin, Sparkles, Bot, Users, Trash2, Eye, X,
  TrendingUp, TrendingDown, Globe, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Territory, TerritoryRegion, TerritoryStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  TERRITORY_STATUS_CONFIG, TERRITORY_REGION_CONFIG, formatCurrency,
} from "../../constants/crmConfig";
import { fetchTerritories, deleteTerritories, createTerritory, updateTerritory } from "../../api/crmApi";
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
const T_FILTERS: FilterConfig[] = [
  {
    key: "region", label: "Khu vực", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(TERRITORY_REGION_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
  {
    key: "status", label: "Trạng thái", type: "select",
    options: Object.entries(TERRITORY_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const T_COLUMNS: ColumnDef<Territory>[] = [
  {
    key: "name", header: "Territory", sortable: true, minWidth: 220,
    render: (r) => {
      const rCfg = TERRITORY_REGION_CONFIG[r.region];
      return (
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl flex-shrink-0">{r.flag}</span>
          <div className="min-w-0">
            <p className="text-gray-900 truncate">{r.name}</p>
            <span className={`text-[8px] px-1.5 py-0.5 rounded border ${rCfg.bgColor}`}>{rCfg.label}</span>
          </div>
        </div>
      );
    },
  },
  {
    key: "attainment", header: "Attainment", sortable: true, minWidth: 100,
    render: (r) => {
      const color = r.attainment >= 100 ? "text-green-600" : r.attainment >= 70 ? "text-blue-600" : r.attainment >= 50 ? "text-amber-600" : "text-red-600";
      return <span className={color}>{r.attainment}%</span>;
    },
    sortValue: (r) => r.attainment,
  },
  {
    key: "revenue", header: "Doanh thu", sortable: true, minWidth: 100,
    render: (r) => <span className="text-gray-900">${(r.revenue / 1000).toFixed(0)}K</span>,
    sortValue: (r) => r.revenue,
  },
  {
    key: "pipeline", header: "Pipeline", sortable: true, minWidth: 100,
    render: (r) => <span className="text-gray-600">${(r.pipeline / 1000).toFixed(0)}K</span>,
    sortValue: (r) => r.pipeline,
  },
  {
    key: "accounts", header: "Accounts", sortable: true, minWidth: 80,
    render: (r) => <span className="text-gray-600">{r.accounts}</span>,
    sortValue: (r) => r.accounts,
  },
  {
    key: "winRate", header: "Win Rate", sortable: true, minWidth: 80,
    render: (r) => <span className={r.winRate >= 35 ? "text-green-600" : "text-amber-600"}>{r.winRate}%</span>,
    sortValue: (r) => r.winRate,
  },
  {
    key: "coverageScore", header: "Coverage", sortable: true, minWidth: 90, defaultHidden: true,
    render: (r) => <span className={r.coverageScore >= 60 ? "text-green-600" : "text-amber-600"}>{r.coverageScore}%</span>,
    sortValue: (r) => r.coverageScore,
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 120, editable: true,
    render: (r) => {
      const cfg = TERRITORY_STATUS_CONFIG[r.status];
      return <span className={`text-[9px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }}
        onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(TERRITORY_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "trend", header: "Xu hướng", sortable: false, minWidth: 60,
    render: (r) => (
      r.trend === "up" ? <ArrowUpRight className="w-4 h-4 text-green-500" /> :
      r.trend === "down" ? <ArrowDownRight className="w-4 h-4 text-red-500" /> :
      <span className="text-gray-300 text-xs">—</span>
    ),
  },
];

/* ============================================================
 * Card View
 * ============================================================ */
function TerritoryCard({ territory: t, onView, onDelete }: {
  territory: Territory; onView: () => void; onDelete: () => void;
}) {
  const rCfg = TERRITORY_REGION_CONFIG[t.region];
  const sCfg = TERRITORY_STATUS_CONFIG[t.status];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onView}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{t.flag}</span>
          <div>
            <h4 className="text-sm text-gray-900 line-clamp-1">{t.name}</h4>
            <span className={`text-[8px] px-1.5 py-0.5 rounded border ${rCfg.bgColor}`}>{rCfg.label}</span>
          </div>
        </div>
        <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className={`text-center rounded-lg p-2 mb-2 ${
        t.attainment >= 100 ? "bg-green-50" : t.attainment >= 70 ? "bg-blue-50" : t.attainment >= 50 ? "bg-amber-50" : "bg-red-50"
      }`}>
        <p className={`text-xl ${
          t.attainment >= 100 ? "text-green-600" : t.attainment >= 70 ? "text-blue-600" : t.attainment >= 50 ? "text-amber-600" : "text-red-600"
        }`}>{t.attainment}%</p>
        <p className="text-[8px] text-gray-400">${(t.revenue / 1000).toFixed(0)}K / ${(t.target / 1000).toFixed(0)}K</p>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] mb-2">
        <div className="bg-gray-50 rounded p-1">
          <p className="text-gray-900">{t.accounts}</p>
          <p className="text-gray-400">Accounts</p>
        </div>
        <div className="bg-gray-50 rounded p-1">
          <p className="text-gray-900">{t.winRate}%</p>
          <p className="text-gray-400">Win Rate</p>
        </div>
        <div className="bg-gray-50 rounded p-1">
          <p className={t.coverageScore >= 60 ? "text-green-600" : "text-amber-600"}>{t.coverageScore}%</p>
          <p className="text-gray-400">Coverage</p>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        <span className={`text-[7px] px-1 py-0.5 rounded ${sCfg.bgColor} ${sCfg.color}`}>{sCfg.label}</span>
        {t.overlapRisk && <span className="text-[7px] px-1 py-0.5 rounded bg-amber-50 text-amber-600">⚠️ Overlap</span>}
        <span className="text-[7px] text-gray-400">{t.reps.length} rep(s)</span>
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function TerritoryDetailModal({ territory: t, onClose }: { territory: Territory; onClose: () => void }) {
  const rCfg = TERRITORY_REGION_CONFIG[t.region];
  const sCfg = TERRITORY_STATUS_CONFIG[t.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{t.flag}</span>
            <div>
              <h3 className="text-gray-900">{t.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${rCfg.bgColor}`}>{rCfg.label}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded ${sCfg.bgColor} ${sCfg.color}`}>{sCfg.label}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className={`rounded-lg p-2.5 text-center ${t.attainment >= 80 ? "bg-green-50" : t.attainment >= 60 ? "bg-amber-50" : "bg-red-50"}`}>
              <p className={`text-xl ${t.attainment >= 80 ? "text-green-600" : t.attainment >= 60 ? "text-amber-600" : "text-red-600"}`}>{t.attainment}%</p>
              <p className="text-[8px] text-gray-400">Attainment</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <p className="text-lg text-gray-900">${(t.revenue / 1000).toFixed(0)}K</p>
              <p className="text-[8px] text-gray-400">Revenue</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <p className="text-lg text-gray-900">${(t.pipeline / 1000).toFixed(0)}K</p>
              <p className="text-[8px] text-gray-400">Pipeline</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Accounts", value: t.accounts },
              { label: "Active Deals", value: t.activeDeals },
              { label: "Win Rate", value: `${t.winRate}%` },
              { label: "Coverage", value: `${t.coverageScore}%` },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded p-1.5">
                <p className="text-xs text-gray-900">{item.value}</p>
                <p className="text-[7px] text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-xs text-gray-500 mb-2">Revenue Trend ($K)</h4>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={t.quarterRevenue}>
                <XAxis dataKey="quarter" tick={{ fontSize: 8 }} />
                <YAxis tick={{ fontSize: 8 }} />
                <Tooltip formatter={(v: number) => [`$${v}K`, "Revenue"]} />
                <Bar dataKey="revenue" fill={rCfg.color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Sales Reps ({t.reps.length})
            </h4>
            <div className="space-y-2">
              {t.reps.map((rep) => (
                <div key={rep.name} className="bg-gray-50 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-xs text-gray-800">{rep.name}</p>
                      <p className="text-[9px] text-gray-400">{rep.role} · {rep.accounts} accounts</p>
                    </div>
                    <span className={`text-xs ${rep.attainment >= 80 ? "text-green-600" : rep.attainment >= 60 ? "text-amber-600" : "text-red-600"}`}>{rep.attainment}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(rep.attainment, 100)}%`, backgroundColor: rep.attainment >= 80 ? "#22c55e" : rep.attainment >= 60 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {t.overlapRisk && t.overlapNote && (
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-3">
              <p className="text-xs text-amber-800 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span><span className="text-amber-900">Overlap Alert:</span> {t.overlapNote}</span>
              </p>
            </div>
          )}

          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span><span className="text-violet-900">AI Territory Analysis:</span> {t.aiInsight}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Territory Modal
 * ============================================================ */
function CreateTerritoryModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState<TerritoryRegion>("vietnam");
  const [country, setCountry] = useState("Việt Nam");
  const [flag, setFlag] = useState("🇻🇳");
  const [target, setTarget] = useState(500000);
  const [saving, setSaving] = useState(false);

  const regionFlags: Record<string, { country: string; flag: string }[]> = {
    vietnam: [{ country: "Việt Nam", flag: "🇻🇳" }],
    apac: [{ country: "Nhật Bản", flag: "🇯🇵" }, { country: "Hàn Quốc", flag: "🇰🇷" }, { country: "Singapore", flag: "🇸🇬" }],
    emea: [{ country: "Đức", flag: "🇩🇪" }, { country: "Anh", flag: "🇬🇧" }],
    americas: [{ country: "Mỹ", flag: "🇺🇸" }, { country: "Canada", flag: "🇨🇦" }],
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên territory"); return; }
    setSaving(true);
    await createTerritory({
      name, region, country, flag,
      status: "new" as TerritoryStatus,
      revenue: 0, target, attainment: 0,
      accounts: 0, activeDeals: 0, pipeline: 0,
      avgDealSize: 0, winRate: 0,
      reps: [], topIndustries: [],
      trend: "stable", quarterRevenue: [],
      coverageScore: 0, overlapRisk: false, overlapNote: null,
      aiInsight: `Territory "${name}" mới được tạo. AI sẽ phân tích potential accounts và đề xuất rep assignment.`,
      tags: ["Mới"],
    });
    toast.success(`Đã tạo territory "${name}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-violet-600" /> Tạo Territory mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên Territory *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Hồ Chí Minh & Miền Nam"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Khu vực</label>
              <select value={region} onChange={(e) => {
                const r = e.target.value as TerritoryRegion;
                setRegion(r);
                const first = regionFlags[r]?.[0];
                if (first) { setCountry(first.country); setFlag(first.flag); }
              }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(TERRITORY_REGION_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Quốc gia</label>
              <select value={country} onChange={(e) => {
                setCountry(e.target.value);
                const found = regionFlags[region]?.find((f) => f.country === e.target.value);
                if (found) setFlag(found.flag);
              }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {(regionFlags[region] || []).map((f) => <option key={f.country} value={f.country}>{f.flag} {f.country}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Target doanh thu ($)</label>
            <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} min={0} step={100000}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI sẽ phân tích market potential, đề xuất rep assignment, và phát hiện overlap risks tự động.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Territory"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function TerritoryManagementPage() {
  const [data, setData] = useState<Territory[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({ region: "", status: "" });
  const [selected, setSelected] = useState<Territory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const { mode, setMode } = useViewMode("territory");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadData = useCallback(async () => {
    const result = await fetchTerritories({
      search: search || undefined,
      region: (filters.region || null) as TerritoryRegion | null,
      status: (filters.status || null) as TerritoryStatus | null,
    });
    setData(result);
  }, [search, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => {
    const totalRevenue = data.reduce((s, t) => s + t.revenue, 0);
    const totalTarget = data.reduce((s, t) => s + t.target, 0);
    const avgAttainment = totalTarget > 0 ? Math.round((totalRevenue / totalTarget) * 100) : 0;
    const totalAccounts = data.reduce((s, t) => s + t.accounts, 0);
    const avgCoverage = data.length > 0 ? Math.round(data.reduce((s, t) => s + t.coverageScore, 0) / data.length) : 0;
    return { totalRevenue, avgAttainment, totalAccounts, avgCoverage };
  }, [data]);

  const pagination = usePagination(data, { storageKey: "territory" });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const count = await deleteTerritories(deleteTarget.ids);
    toast.success(`Đã xoá ${count} territory`);
    setDeleteTarget(null);
    loadData();
  };

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateTerritory(rowId, { [field]: value });
    toast.success("Đã cập nhật territory");
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-violet-600" /> Quản lý Vùng lãnh thổ
          </h1>
          <p className="text-gray-500 mt-0.5">Territory mapping, coverage analysis, overlap detection, AI optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} />
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
            <Plus className="w-4 h-4" /> Tạo Territory
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-3">
          <Globe className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">${(stats.totalRevenue / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-violet-700">Tổng doanh thu</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.avgAttainment >= 80 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-lg ${stats.avgAttainment >= 80 ? "text-green-600" : "text-amber-600"}`}>{stats.avgAttainment}%</p>
          <p className="text-xs text-gray-600">Attainment TB</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">{stats.totalAccounts}</p>
          <p className="text-xs text-gray-500">Tổng accounts</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.avgCoverage >= 60 ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"}`}>
          <p className="text-lg text-gray-900">{stats.avgCoverage}%</p>
          <p className="text-xs text-gray-600">Coverage TB</p>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm territory, quốc gia, rep..."
        filters={T_FILTERS}
        filterValues={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onClearAll={() => { setSearch(""); setFilters({ region: "", status: "" }); }}
      />

      {/* Table View */}
      {mode === "table" && (
        <DataTable<Territory>
          data={pagination.paginatedItems}
          columns={T_COLUMNS}
          storageKey="territory-table"
          selectable
          onRowClick={setSelected}
          onInlineEdit={handleInlineEdit}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} territory được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelected(item)} className="p-1 text-gray-300 hover:text-violet-600"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.name })} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không có territory nào phù hợp"
        />
      )}

      {/* Card View */}
      {mode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {pagination.paginatedItems.map((t) => (
            <TerritoryCard
              key={t.id}
              territory={t}
              onView={() => setSelected(t)}
              onDelete={() => setDeleteTarget({ ids: [t.id], label: t.name })}
            />
          ))}
          {pagination.paginatedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không có territory nào phù hợp</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <PaginationBar {...pagination} onGoToPage={pagination.goToPage} onNextPage={pagination.nextPage} onPrevPage={pagination.prevPage} onSetPageSize={pagination.setPageSize} />
        </div>
      )}

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Territory Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Nhật Bản</strong> vượt target 123% — territory có ROI cao nhất. Recommend: <strong>thêm 1 rep tiếng Nhật</strong> để scale coverage từ 45% lên 70%.</span>
          </p>
          <p className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span><strong>Hà Nội & Miền Bắc</strong> underperforming (62%). 1 rep/52 accounts quá tải. Recommend: <strong>thêm 1 rep + focus government Q2</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI phát hiện <strong>overlap</strong> tại Hàn Quốc — FinServe Korea assign 2 team. Resolve ngay để tránh confuse khách.</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {selected && <TerritoryDetailModal territory={selected} onClose={() => setSelected(null)} />}
      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemName={deleteTarget.label}
          entityType="territory"
          description={`Bạn có chắc muốn xoá "${deleteTarget.label}"?`}
        />
      )}
      {showCreateModal && <CreateTerritoryModal onClose={() => setShowCreateModal(false)} onCreated={loadData} />}
    </div>
  );
}