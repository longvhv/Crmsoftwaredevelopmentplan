/**
 * Renewal Pipeline — Quản lý Gia hạn Hợp đồng
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Detail Modal, Delete đơn lẻ + bulk, AI Insights.
 * Phase 7 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  RefreshCw, Sparkles, Bot, TrendingUp,
  TrendingDown, Trash2, Eye, X, AlertTriangle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { Renewal, RenewalStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { RENEWAL_STATUS_CONFIG, formatVND } from "../../constants/crmConfig";
import { fetchRenewals, deleteRenewals, updateRenewal, createRenewal } from "../../api/crmApi";
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
const RN_FILTERS: FilterConfig[] = [
  {
    key: "status", label: "Trạng thái", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(RENEWAL_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const RN_COLUMNS: ColumnDef<Renewal>[] = [
  {
    key: "customer", header: "Khách hàng", sortable: true, minWidth: 200,
    render: (r) => (
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] flex-shrink-0 ${
          r.status === "at-risk" ? "bg-red-100 text-red-700" :
          r.status === "committed" || r.status === "renewed" ? "bg-green-100 text-green-700" :
          "bg-cyan-100 text-cyan-700"
        }`}>{r.logo}</div>
        <div className="min-w-0">
          <p className="text-gray-900 truncate">{r.customer}</p>
          <p className="text-[10px] text-gray-400 truncate">{r.plan}</p>
        </div>
      </div>
    ),
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 110, editable: true,
    render: (r) => {
      const cfg = RENEWAL_STATUS_CONFIG[r.status];
      return <span className={`text-[9px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (_item, _v, onChange, onSave) => (
      <select defaultValue={_item.status} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(RENEWAL_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
  },
  {
    key: "arr", header: "ARR", sortable: true, minWidth: 110,
    render: (r) => <span className="text-gray-900">{formatVND(r.arr)}₫</span>,
    sortValue: (r) => r.arr,
  },
  {
    key: "daysUntilRenewal", header: "Còn lại", sortable: true, minWidth: 80,
    render: (r) => {
      const isExpired = r.daysUntilRenewal < 0 && r.status !== "renewed" && r.status !== "churned";
      const isUrgent = r.daysUntilRenewal > 0 && r.daysUntilRenewal <= 30;
      return (
        <span className={isExpired ? "text-red-600" : isUrgent ? "text-amber-600" : "text-gray-600"}>
          {isExpired ? "Quá hạn" : `${r.daysUntilRenewal} ngày`}
        </span>
      );
    },
    sortValue: (r) => r.daysUntilRenewal,
  },
  {
    key: "healthScore", header: "Health", sortable: true, minWidth: 80,
    render: (r) => (
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-12">
          <div className={`h-full rounded-full ${r.healthScore >= 70 ? "bg-green-400" : r.healthScore >= 40 ? "bg-amber-400" : "bg-red-400"}`}
            style={{ width: `${r.healthScore}%` }} />
        </div>
        <span className={`text-[10px] ${r.healthScore >= 70 ? "text-green-600" : r.healthScore >= 40 ? "text-amber-600" : "text-red-600"}`}>{r.healthScore}</span>
      </div>
    ),
    sortValue: (r) => r.healthScore,
  },
  {
    key: "renewalProbability", header: "Xác suất", sortable: true, minWidth: 80,
    render: (r) => (
      <span className={`text-xs ${r.renewalProbability >= 70 ? "text-green-600" : r.renewalProbability >= 40 ? "text-amber-600" : "text-red-600"}`}>
        {r.renewalProbability}%
      </span>
    ),
    sortValue: (r) => r.renewalProbability,
  },
  {
    key: "csm", header: "CSM", sortable: true, minWidth: 130, editable: true,
    render: (r) => <span className="text-gray-600 text-xs">{r.csm}</span>,
  },
  {
    key: "contractEnd", header: "Hết hạn", sortable: true, minWidth: 100,
    render: (r) => <span className="text-gray-500 text-xs">{r.contractEnd}</span>,
  },
  {
    key: "expansionOpportunity", header: "Expansion", sortable: true, minWidth: 100, defaultHidden: true,
    render: (r) => r.expansionOpportunity > 0
      ? <span className="text-violet-600 text-xs">+{formatVND(r.expansionOpportunity)}₫</span>
      : <span className="text-gray-300 text-xs">—</span>,
    sortValue: (r) => r.expansionOpportunity,
  },
];

/* ============================================================
 * Create Modal
 * ============================================================ */
function RenewalCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [customer, setCustomer] = useState("");
  const [plan, setPlan] = useState("Enterprise");
  const [arr, setArr] = useState(0);
  const [status, setStatus] = useState<RenewalStatus>("upcoming");
  const [csm, setCsm] = useState("");
  const [contractEnd, setContractEnd] = useState("2026-06-30");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!customer.trim()) { toast.error("Vui lòng nhập tên khách hàng"); return; }
    setSaving(true);
    await createRenewal({
      customer, plan, arr, status, csm, contractEnd,
      logo: customer.substring(0, 2).toUpperCase(),
      daysUntilRenewal: Math.max(0, Math.floor((new Date(contractEnd).getTime() - Date.now()) / 86400000)),
      healthScore: 70, nps: 30, expansionOpportunity: 0,
      lastContact: new Date().toISOString().split("T")[0],
      riskFactors: [], renewalProbability: 60, tags: [],
    });
    toast.success(`Đã tạo renewal "${customer}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Renewal mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Khách hàng *</label>
            <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Tên khách hàng"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Plan</label>
              <input type="text" value={plan} onChange={(e) => setPlan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">ARR (VNĐ)</label>
              <input type="number" value={arr} onChange={(e) => setArr(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as RenewalStatus)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                {Object.entries(RENEWAL_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày hết hạn</label>
              <input type="date" value={contractEnd} onChange={(e) => setContractEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">CSM phụ trách</label>
            <input type="text" value={csm} onChange={(e) => setCsm(e.target.value)} placeholder="Tên CSM"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Renewal"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Card View
 * ============================================================ */
function RenewalCard({ item, onView, onDelete }: {
  item: Renewal; onView: () => void; onDelete: () => void;
}) {
  const stCfg = RENEWAL_STATUS_CONFIG[item.status];
  const isUrgent = item.daysUntilRenewal > 0 && item.daysUntilRenewal <= 30;

  return (
    <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow group ${
      item.status === "at-risk" ? "border-red-200" :
      item.status === "churned" ? "border-gray-300 opacity-60" :
      isUrgent ? "border-amber-200" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onView}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 ${
            item.status === "at-risk" ? "bg-red-100 text-red-700" :
            item.status === "committed" || item.status === "renewed" ? "bg-green-100 text-green-700" :
            "bg-cyan-100 text-cyan-700"
          }`}>{item.logo}</div>
          <div className="min-w-0">
            <h4 className="text-sm text-gray-900 truncate">{item.customer}</h4>
            <div className="flex items-center gap-1 flex-wrap">
              <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bgColor} ${stCfg.color}`}>{stCfg.label}</span>
              <span className="text-[8px] text-gray-400">{item.plan}</span>
            </div>
          </div>
        </div>
        <button type="button" onClick={onDelete}
          className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-2">
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-gray-900">{formatVND(item.arr)}₫</p>
          <p className="text-[8px] text-gray-400">ARR</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className={`text-xs ${item.daysUntilRenewal <= 30 && item.daysUntilRenewal > 0 ? "text-amber-600" : item.daysUntilRenewal < 0 ? "text-red-600" : "text-gray-900"}`}>
            {item.daysUntilRenewal < 0 ? "Quá hạn" : `${item.daysUntilRenewal}d`}
          </p>
          <p className="text-[8px] text-gray-400">Còn lại</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className={`text-xs ${item.renewalProbability >= 70 ? "text-green-600" : item.renewalProbability >= 40 ? "text-amber-600" : "text-red-600"}`}>
            {item.renewalProbability}%
          </p>
          <p className="text-[8px] text-gray-400">Xác suất</p>
        </div>
      </div>

      {/* Health & probability bars */}
      <div className="space-y-1.5 mb-2">
        <div>
          <div className="flex items-center justify-between text-[8px] mb-0.5">
            <span className="text-gray-400">Health</span>
            <span className={item.healthScore >= 70 ? "text-green-600" : item.healthScore >= 40 ? "text-amber-600" : "text-red-600"}>{item.healthScore}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${item.healthScore >= 70 ? "bg-green-400" : item.healthScore >= 40 ? "bg-amber-400" : "bg-red-400"}`}
              style={{ width: `${item.healthScore}%` }} />
          </div>
        </div>
      </div>

      {item.riskFactors.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {item.riskFactors.slice(0, 2).map((rf) => (
            <span key={rf} className="text-[7px] px-1 py-0.5 bg-red-50 text-red-500 rounded border border-red-100">⚠ {rf}</span>
          ))}
        </div>
      )}

      {item.expansionOpportunity > 0 && (
        <span className="text-[7px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded border border-violet-200">
          📈 +{formatVND(item.expansionOpportunity)}₫
        </span>
      )}
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function RenewalDetailModal({ item, onClose }: { item: Renewal; onClose: () => void }) {
  const stCfg = RENEWAL_STATUS_CONFIG[item.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
              item.status === "at-risk" ? "bg-red-100 text-red-700" : "bg-cyan-100 text-cyan-700"
            }`}>{item.logo}</div>
            <div>
              <h3 className="text-gray-900">{item.customer}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bgColor} ${stCfg.color}`}>{stCfg.label}</span>
                <span className="text-[8px] text-gray-400">{item.plan}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "ARR", value: `${formatVND(item.arr)}₫` },
              { label: "Hết hạn", value: item.contractEnd },
              { label: "Còn lại", value: item.daysUntilRenewal < 0 ? "Quá hạn" : `${item.daysUntilRenewal} ngày` },
              { label: "Health Score", value: `${item.healthScore}/100` },
              { label: "Xác suất", value: `${item.renewalProbability}%` },
              { label: "NPS", value: `${item.nps > 0 ? "+" : ""}${item.nps}` },
              { label: "CSM", value: item.csm },
              { label: "Liên hệ cuối", value: item.lastContact },
              { label: "Expansion", value: item.expansionOpportunity > 0 ? `+${formatVND(item.expansionOpportunity)}₫` : "—" },
            ].map((x) => (
              <div key={x.label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[9px] text-gray-400">{x.label}</p>
                <p className="text-xs text-gray-800">{x.value}</p>
              </div>
            ))}
          </div>

          {item.riskFactors.length > 0 && (
            <div className="bg-red-50 rounded-lg border border-red-200 p-3">
              <p className="text-[9px] text-red-400 mb-1">Yếu tố rủi ro</p>
              <div className="flex flex-wrap gap-1">
                {item.riskFactors.map((rf) => (
                  <span key={rf} className="text-[9px] px-2 py-0.5 bg-white text-red-600 rounded border border-red-200">⚠ {rf}</span>
                ))}
              </div>
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
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function RenewalPipelinePage() {
  const [data, setData] = useState<Renewal[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({ status: "" });
  const [selected, setSelected] = useState<Renewal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { mode, setMode } = useViewMode("renewals");

  const loadData = useCallback(async () => {
    const result = await fetchRenewals({
      search: search || undefined,
      status: (filters.status || null) as RenewalStatus | null,
    });
    setData(result);
  }, [search, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => {
    const active = data.filter((r) => r.status !== "renewed" && r.status !== "churned");
    const upcomingARR = active.reduce((s, r) => s + r.arr, 0);
    const atRiskARR = data.filter((r) => r.status === "at-risk").reduce((s, r) => s + r.arr, 0);
    const committedARR = data.filter((r) => r.status === "committed" || r.status === "renewed").reduce((s, r) => s + r.arr, 0);
    const expansionTotal = data.reduce((s, r) => s + r.expansionOpportunity, 0);
    const avgProbability = active.length > 0
      ? Math.round(active.reduce((s, r) => s + r.renewalProbability, 0) / active.length)
      : 0;
    return { upcomingARR, atRiskARR, committedARR, expansionTotal, avgProbability };
  }, [data]);

  const sorted = useMemo(() => [...data].sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal), [data]);

  const pagination = usePagination(sorted, { storageKey: "renewals" });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const count = await deleteRenewals(deleteTarget.ids);
    toast.success(`Đã xoá ${count} renewal`);
    setDeleteTarget(null);
    loadData();
  };

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateRenewal(rowId, { [field]: value });
    loadData();
    toast.success("Đã cập nhật renewal");
  }, [loadData]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-cyan-600" /> Renewal Pipeline
          </h1>
          <p className="text-gray-500 mt-0.5">Quản lý gia hạn hợp đồng — ARR at risk, expansion, health-based priority</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} />
          <button type="button" onClick={() => setShowCreate(true)}
            className="flex items-center gap-1 px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
            <Plus className="w-4 h-4" /> Tạo Renewal
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-2.5 text-center">
          <p className="text-lg text-cyan-600">{formatVND(stats.upcomingARR)}₫</p>
          <p className="text-[9px] text-cyan-700">ARR sắp gia hạn</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{formatVND(stats.atRiskARR)}₫</p>
          <p className="text-[9px] text-red-700">ARR at risk</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{formatVND(stats.committedARR)}₫</p>
          <p className="text-[9px] text-green-700">Đã cam kết/gia hạn</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{formatVND(stats.expansionTotal)}₫</p>
          <p className="text-[9px] text-violet-700">Cơ hội Expansion</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.avgProbability}%</p>
          <p className="text-[9px] text-blue-700">Xác suất gia hạn TB</p>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm khách hàng, CSM, plan..."
        filters={RN_FILTERS}
        filterValues={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onClearAll={() => { setSearch(""); setFilters({ status: "" }); }}
      />

      {/* Table View */}
      {mode === "table" && (
        <DataTable<Renewal>
          data={pagination.paginatedItems}
          columns={RN_COLUMNS}
          storageKey="renewals-table"
          selectable
          onInlineEdit={handleInlineEdit}
          onRowClick={setSelected}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} renewal được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelected(item)} className="p-1 text-gray-300 hover:text-cyan-600"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.customer })} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không có renewal nào phù hợp"
        />
      )}

      {/* Card View */}
      {mode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {pagination.paginatedItems.map((r) => (
            <RenewalCard
              key={r.id}
              item={r}
              onView={() => setSelected(r)}
              onDelete={() => setDeleteTarget({ ids: [r.id], label: r.customer })}
            />
          ))}
          {pagination.paginatedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không có renewal nào phù hợp</p>
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
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <h4 className="text-sm text-cyan-900">AI Renewal Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-cyan-800">
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span><strong>CloudFirst Global</strong> — ARR <strong>3.5B₫ at risk</strong>, chỉ <strong>35% xác suất gia hạn</strong>. AI recommend: CEO executive engagement + retention package (20% discount + dedicated SA).</span>
          </p>
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Expansion pipeline: 4.8B₫</strong> từ 5 khách hàng healthy. <strong>Sakura Systems</strong> (1.5B₫ expansion) đã committed. Tổng net revenue retention dự kiến: <strong>118%</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>DataDriven Inc</strong> (480M₫, 12 ngày) — AI phát hiện <strong>0 logins trong 30 ngày</strong>. Auto-triggered: re-engagement campaign, CS call scheduled, <strong>winback offer 30%</strong>.</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {selected && <RenewalDetailModal item={selected} onClose={() => setSelected(null)} />}
      {showCreate && <RenewalCreateModal onClose={() => setShowCreate(false)} onCreated={loadData} />}
      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemName={deleteTarget.label}
          entityType="renewal"
          description="Hành động này không thể hoàn tác."
        />
      )}
    </div>
  );
}