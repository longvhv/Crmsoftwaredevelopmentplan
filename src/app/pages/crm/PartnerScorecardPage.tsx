/**
 * Partner Scorecard — Bảng đánh giá Đối tác
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Detail Modal, Delete đơn lẻ + bulk, AI Insights.
 * Phase 7 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Award, Sparkles, Bot, TrendingUp,
  Trash2, Eye, X, AlertTriangle,
  Plus, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import type { Partner, PartnerTier, PartnerType, PartnerStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  PARTNER_TIER_CONFIG, PARTNER_TYPE_CONFIG, PARTNER_STATUS_CONFIG, formatVND,
} from "../../constants/crmConfig";
import { fetchPartners, deletePartners, updatePartner, createPartner } from "../../api/crmApi";
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
const P_FILTERS: FilterConfig[] = [
  {
    key: "tier", label: "Tier", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(PARTNER_TIER_CONFIG).map(([v, c]) => ({ value: v, label: `${c.icon} ${c.label}` })),
    ],
  },
  {
    key: "type", label: "Loại", type: "select",
    options: Object.entries(PARTNER_TYPE_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
  {
    key: "status", label: "Trạng thái", type: "select",
    options: Object.entries(PARTNER_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const P_COLUMNS: ColumnDef<Partner>[] = [
  {
    key: "name", header: "Đối tác", sortable: true, minWidth: 200,
    render: (r) => {
      const tier = PARTNER_TIER_CONFIG[r.tier];
      return (
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] flex-shrink-0 ${
            r.tier === "platinum" ? "bg-violet-100 text-violet-700" :
            r.tier === "gold" ? "bg-amber-100 text-amber-700" :
            r.tier === "silver" ? "bg-gray-200 text-gray-700" :
            "bg-blue-100 text-blue-700"
          }`}>{r.logo}</div>
          <div className="min-w-0">
            <p className="text-gray-900 truncate">{r.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{tier.icon} {tier.label} • {PARTNER_TYPE_CONFIG[r.type].label}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: "tier", header: "Tier", sortable: true, minWidth: 90, editable: true,
    render: (r) => {
      const cfg = PARTNER_TIER_CONFIG[r.tier];
      return <span className={`text-[9px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.icon} {cfg.label}</span>;
    },
    renderEdit: (_item, _v, onChange, onSave) => (
      <select defaultValue={_item.tier} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(PARTNER_TIER_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
      </select>
    ),
  },
  {
    key: "score", header: "Score", sortable: true, minWidth: 80,
    render: (r) => (
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-12">
          <div className={`h-full rounded-full ${r.score >= 75 ? "bg-green-400" : r.score >= 50 ? "bg-amber-400" : "bg-red-400"}`}
            style={{ width: `${r.score}%` }} />
        </div>
        <span className={`text-[10px] ${r.score >= 75 ? "text-green-600" : r.score >= 50 ? "text-amber-600" : "text-red-600"}`}>{r.score}</span>
      </div>
    ),
    sortValue: (r) => r.score,
  },
  {
    key: "revenueGenerated", header: "Revenue", sortable: true, minWidth: 110,
    render: (r) => <span className="text-gray-900 text-xs">{formatVND(r.revenueGenerated)}₫</span>,
    sortValue: (r) => r.revenueGenerated,
  },
  {
    key: "dealsWon", header: "Deals Won", sortable: true, minWidth: 80,
    render: (r) => {
      const wr = r.dealsRegistered > 0 ? Math.round((r.dealsWon / r.dealsRegistered) * 100) : 0;
      return <span className="text-gray-600 text-xs">{r.dealsWon}/{r.dealsRegistered} ({wr}%)</span>;
    },
    sortValue: (r) => r.dealsWon,
  },
  {
    key: "region", header: "Khu vực", sortable: true, minWidth: 120,
    render: (r) => <span className="text-gray-600 text-xs">{r.region}</span>,
  },
  {
    key: "nps", header: "NPS", sortable: true, minWidth: 60,
    render: (r) => <span className={r.nps >= 50 ? "text-green-600 text-xs" : "text-amber-600 text-xs"}>{r.nps > 0 ? "+" : ""}{r.nps}</span>,
    sortValue: (r) => r.nps,
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 90, editable: true,
    render: (r) => {
      const cfg = PARTNER_STATUS_CONFIG[r.status];
      return <span className={`text-[9px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (_item, _v, onChange, onSave) => (
      <select defaultValue={_item.status} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(PARTNER_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
  },
  {
    key: "certifiedStaff", header: "Chứng chỉ", sortable: true, minWidth: 80, defaultHidden: true,
    render: (r) => <span className={r.certifiedStaff >= r.requiredCerts ? "text-green-600 text-xs" : "text-amber-600 text-xs"}>{r.certifiedStaff}/{r.requiredCerts}</span>,
  },
];

/* ============================================================
 * Create Modal
 * ============================================================ */
function PartnerCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [tier, setTier] = useState<PartnerTier>("registered");
  const [type, setType] = useState<PartnerType>("reseller");
  const [region, setRegion] = useState("Vietnam");
  const [revenueTarget, setRevenueTarget] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên đối tác"); return; }
    setSaving(true);
    await createPartner({
      name, tier, type, region, revenueTarget,
      logo: name.substring(0, 2).toUpperCase(),
      score: 50, revenueGenerated: 0, dealsRegistered: 0, dealsWon: 0,
      certifiedStaff: 0, requiredCerts: 3, nps: 0,
      lastActivity: new Date().toISOString().split("T")[0],
      status: "active", specializations: [], trend: "flat", tags: [],
    });
    toast.success(`Đã thêm đối tác "${name}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Thêm Đối tác mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên đối tác *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên công ty đối tác"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tier</label>
              <select value={tier} onChange={(e) => setTier(e.target.value as PartnerTier)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                {Object.entries(PARTNER_TIER_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại</label>
              <select value={type} onChange={(e) => setType(e.target.value as PartnerType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                {Object.entries(PARTNER_TYPE_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Khu vực</label>
              <input type="text" value={region} onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Revenue Target (VNĐ)</label>
              <input type="number" value={revenueTarget} onChange={(e) => setRevenueTarget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Thêm Partner"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Card View
 * ============================================================ */
function PartnerCard({ item, onView, onDelete }: {
  item: Partner; onView: () => void; onDelete: () => void;
}) {
  const tier = PARTNER_TIER_CONFIG[item.tier];
  const revenueAttainment = Math.round((item.revenueGenerated / item.revenueTarget) * 100);

  return (
    <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow group ${
      item.status === "at-risk" ? "border-red-200" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onView}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 ${
            item.tier === "platinum" ? "bg-violet-100 text-violet-700" :
            item.tier === "gold" ? "bg-amber-100 text-amber-700" :
            item.tier === "silver" ? "bg-gray-200 text-gray-700" :
            "bg-blue-100 text-blue-700"
          }`}>{item.logo}</div>
          <div className="min-w-0">
            <h4 className="text-sm text-gray-900 truncate">{item.name}</h4>
            <div className="flex items-center gap-1 flex-wrap">
              <span className={`text-[7px] px-1.5 py-0.5 rounded border ${tier.bgColor} ${tier.color}`}>{tier.icon} {tier.label}</span>
              <span className="text-[7px] text-gray-400">{PARTNER_TYPE_CONFIG[item.type].label}</span>
              {item.trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
              {item.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
            </div>
          </div>
        </div>
        <button type="button" onClick={onDelete}
          className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[8px] text-gray-400 mb-2">{item.region} | {item.specializations.join(", ")}</p>

      {/* Score + Revenue bars */}
      <div className="space-y-1.5 mb-2">
        <div>
          <div className="flex items-center justify-between text-[8px] mb-0.5">
            <span className="text-gray-400">Partner Score</span>
            <span className={item.score >= 75 ? "text-green-600" : item.score >= 50 ? "text-amber-600" : "text-red-600"}>{item.score}/100</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${item.score >= 75 ? "bg-green-400" : item.score >= 50 ? "bg-amber-400" : "bg-red-400"}`}
              style={{ width: `${item.score}%` }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[8px] mb-0.5">
            <span className="text-gray-400">Revenue Attainment</span>
            <span className={revenueAttainment >= 75 ? "text-green-600" : "text-amber-600"}>{revenueAttainment}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${revenueAttainment >= 75 ? "bg-green-400" : "bg-amber-400"}`}
              style={{ width: `${Math.min(revenueAttainment, 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[8px] text-gray-400 flex-wrap">
        <span>💰 {formatVND(item.revenueGenerated)}₫</span>
        <span>📊 Win {item.dealsWon}/{item.dealsRegistered}</span>
        <span>🎓 {item.certifiedStaff}/{item.requiredCerts}</span>
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function PartnerDetailModal({ item, onClose }: { item: Partner; onClose: () => void }) {
  const tier = PARTNER_TIER_CONFIG[item.tier];
  const revenueAttainment = Math.round((item.revenueGenerated / item.revenueTarget) * 100);
  const winRate = item.dealsRegistered > 0 ? Math.round((item.dealsWon / item.dealsRegistered) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
              item.tier === "platinum" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"
            }`}>{item.logo}</div>
            <div>
              <h3 className="text-gray-900">{item.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${tier.bgColor} ${tier.color}`}>{tier.icon} {tier.label}</span>
                <span className="text-[8px] text-gray-400">{PARTNER_TYPE_CONFIG[item.type].label}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "Khu vực", value: item.region },
              { label: "Score", value: `${item.score}/100` },
              { label: "Revenue", value: `${formatVND(item.revenueGenerated)}₫` },
              { label: "Target", value: `${formatVND(item.revenueTarget)}₫` },
              { label: "Attainment", value: `${revenueAttainment}%` },
              { label: "Win Rate", value: `${winRate}% (${item.dealsWon}/${item.dealsRegistered})` },
              { label: "Chứng chỉ", value: `${item.certifiedStaff}/${item.requiredCerts}` },
              { label: "NPS", value: `${item.nps > 0 ? "+" : ""}${item.nps}` },
              { label: "Hoạt động cuối", value: item.lastActivity },
            ].map((x) => (
              <div key={x.label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[9px] text-gray-400">{x.label}</p>
                <p className="text-xs text-gray-800">{x.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[9px] text-gray-400 mb-1">Chuyên môn</p>
            <div className="flex flex-wrap gap-1">
              {item.specializations.map((s) => (
                <span key={s} className="text-[9px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-200">{s}</span>
              ))}
            </div>
          </div>

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
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function PartnerScorecardPage() {
  const [data, setData] = useState<Partner[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({ tier: "", type: "", status: "" });
  const [selected, setSelected] = useState<Partner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { mode, setMode } = useViewMode("partners");

  const loadData = useCallback(async () => {
    const result = await fetchPartners({
      search: search || undefined,
      tier: (filters.tier || null) as PartnerTier | null,
      type: (filters.type || null) as PartnerType | null,
      status: (filters.status || null) as PartnerStatus | null,
    });
    setData(result);
  }, [search, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => {
    const totalRevenue = data.reduce((s, p) => s + p.revenueGenerated, 0);
    const totalDealsWon = data.reduce((s, p) => s + p.dealsWon, 0);
    const totalDealsReg = data.reduce((s, p) => s + p.dealsRegistered, 0);
    const avgScore = data.length > 0 ? Math.round(data.reduce((s, p) => s + p.score, 0) / data.length) : 0;
    const atRisk = data.filter((p) => p.status === "at-risk").length;
    return { totalRevenue, totalDealsWon, totalDealsReg, avgScore, atRisk };
  }, [data]);

  const sorted = useMemo(() => [...data].sort((a, b) => b.score - a.score), [data]);

  const pagination = usePagination(sorted, { storageKey: "partners" });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const count = await deletePartners(deleteTarget.ids);
    toast.success(`Đã xoá ${count} đối tác`);
    setDeleteTarget(null);
    loadData();
  };

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updatePartner(rowId, { [field]: value });
    loadData();
    toast.success("Đã cập nhật đối tác");
  }, [loadData]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" /> Partner Scorecard
          </h1>
          <p className="text-gray-500 mt-0.5">Bảng đánh giá đối tác — tiers, performance, co-sell, chứng chỉ</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} />
          <button type="button" onClick={() => setShowCreate(true)}
            className="flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700">
            <Plus className="w-4 h-4" /> Thêm Partner
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{formatVND(stats.totalRevenue)}₫</p>
          <p className="text-[9px] text-amber-700">Partner Revenue</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.totalDealsWon}</p>
          <p className="text-[9px] text-green-700">Deals Won</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalDealsReg}</p>
          <p className="text-[9px] text-blue-700">Deals Registered</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.avgScore}/100</p>
          <p className="text-[9px] text-violet-700">Avg Partner Score</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{stats.atRisk}</p>
          <p className="text-[9px] text-red-700">Partners at Risk</p>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm đối tác, khu vực, chuyên môn..."
        filters={P_FILTERS}
        filterValues={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onClearAll={() => { setSearch(""); setFilters({ tier: "", type: "", status: "" }); }}
      />

      {/* Table View */}
      {mode === "table" && (
        <DataTable<Partner>
          data={pagination.paginatedItems}
          columns={P_COLUMNS}
          storageKey="partners-table"
          selectable
          onInlineEdit={handleInlineEdit}
          onRowClick={setSelected}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} đối tác được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelected(item)} className="p-1 text-gray-300 hover:text-amber-600"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.name })} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không có đối tác nào phù hợp"
        />
      )}

      {/* Card View */}
      {mode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {pagination.paginatedItems.map((p) => (
            <PartnerCard
              key={p.id}
              item={p}
              onView={() => setSelected(p)}
              onDelete={() => setDeleteTarget({ ids: [p.id], label: p.name })}
            />
          ))}
          {pagination.paginatedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không có đối tác nào phù hợp</p>
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
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h4 className="text-sm text-amber-900">AI Partner Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-amber-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>FPT Software</strong> (Platinum, score 92) — top partner, <strong>win rate 64%</strong>. AI detect: 3 deals đang ở Proposal (<strong>4.2B₫</strong>). Suggest: dedicate SA hỗ trợ close Q1.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span><strong>TechConnect Corp</strong> (Silver) — <strong>at risk</strong>. Revenue attainment chỉ <strong>40%</strong>. Thiếu <strong>3 certifications</strong>. AI recommend: <strong>enablement program intensive</strong> 4 tuần.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Partner channel đóng góp <strong>35% tổng ARR</strong>. <strong>APAC</strong> là growth engine (+45% YoY). AI suggest: recruit thêm <strong>2 SI partners</strong> cho Japan và Australia.</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {selected && <PartnerDetailModal item={selected} onClose={() => setSelected(null)} />}
      {showCreate && <PartnerCreateModal onClose={() => setShowCreate(false)} onCreated={loadData} />}
      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemName={deleteTarget.label}
          entityType="đối tác"
          description="Hành động này không thể hoàn tác."
        />
      )}
    </div>
  );
}