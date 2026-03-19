/**
 * Revenue Leakage Detector — Phát hiện Rò rỉ Doanh thu
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Detail Modal, Delete đơn lẻ + bulk, AI Insights.
 * Phase 7 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Droplets, Sparkles, Bot, TrendingDown,
  Trash2, Eye, X, Lightbulb, Zap,
  ShieldAlert, Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { RevenueLeakItem, LeakType, LeakSeverity, LeakStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  LEAK_TYPE_CONFIG, LEAK_SEVERITY_CONFIG, LEAK_STATUS_CONFIG, formatVND,
} from "../../constants/crmConfig";
import { fetchRevenueLeaks, deleteRevenueLeaks, updateRevenueLeak, createRevenueLeak } from "../../api/crmApi";
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
const LEAK_FILTERS: FilterConfig[] = [
  {
    key: "severity", label: "Mức độ", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(LEAK_SEVERITY_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
  {
    key: "type", label: "Loại", type: "select",
    options: Object.entries(LEAK_TYPE_CONFIG).map(([v, c]) => ({ value: v, label: `${c.icon} ${c.label}` })),
  },
  {
    key: "status", label: "Trạng thái", type: "select",
    options: Object.entries(LEAK_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const LEAK_COLUMNS: ColumnDef<RevenueLeakItem>[] = [
  {
    key: "title", header: "Vấn đề", sortable: true, minWidth: 280,
    render: (r) => {
      const tCfg = LEAK_TYPE_CONFIG[r.type];
      return (
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base flex-shrink-0">{tCfg.icon}</span>
          <div className="min-w-0">
            <p className="text-gray-900 truncate text-xs">{r.title}</p>
            <p className="text-[10px] text-gray-400 truncate">{r.customer}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: "severity", header: "Mức độ", sortable: true, minWidth: 100, editable: true,
    render: (r) => {
      const cfg = LEAK_SEVERITY_CONFIG[r.severity];
      return <span className={`text-[9px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (_item, _v, onChange, onSave) => (
      <select defaultValue={_item.severity} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(LEAK_SEVERITY_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
  },
  {
    key: "type", header: "Loại", sortable: true, minWidth: 130,
    render: (r) => {
      const cfg = LEAK_TYPE_CONFIG[r.type];
      return <span className={`text-[9px] ${cfg.color}`}>{cfg.icon} {cfg.label}</span>;
    },
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 90, editable: true,
    render: (r) => {
      const cfg = LEAK_STATUS_CONFIG[r.status];
      return <span className={`text-[9px] ${cfg.color}`}>● {cfg.label}</span>;
    },
    renderEdit: (_item, _v, onChange, onSave) => (
      <select defaultValue={_item.status} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(LEAK_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
  },
  {
    key: "estimatedLoss", header: "Tổn thất", sortable: true, minWidth: 110,
    render: (r) => <span className="text-red-600 text-xs">{formatVND(r.estimatedLoss)}₫</span>,
    sortValue: (r) => r.estimatedLoss,
  },
  {
    key: "aiConfidence", header: "AI %", sortable: true, minWidth: 60,
    render: (r) => <span className="text-violet-600 text-xs">{r.aiConfidence}%</span>,
    sortValue: (r) => r.aiConfidence,
  },
  {
    key: "assignedTo", header: "Phụ trách", sortable: true, minWidth: 120, editable: true,
    render: (r) => <span className="text-gray-600 text-xs">{r.assignedTo}</span>,
  },
  {
    key: "detectedDate", header: "Phát hiện", sortable: true, minWidth: 100,
    render: (r) => <span className="text-gray-500 text-xs">{r.detectedDate}</span>,
  },
];

/* ============================================================
 * Create Modal
 * ============================================================ */
function LeakCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [customer, setCustomer] = useState("");
  const [type, setType] = useState<LeakType>("stale-deal");
  const [severity, setSeverity] = useState<LeakSeverity>("medium");
  const [estimatedLoss, setEstimatedLoss] = useState(0);
  const [assignedTo, setAssignedTo] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề vấn đề"); return; }
    setSaving(true);
    await createRevenueLeak({
      title, customer, type, severity, estimatedLoss, assignedTo,
      status: "open", description: title, deal: null,
      detectedDate: new Date().toISOString().split("T")[0],
      aiConfidence: 75, suggestedAction: "Cần phân tích chi tiết", tags: [],
    });
    toast.success(`Đã tạo leak "${title}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Báo cáo Revenue Leak mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề vấn đề *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mô tả ngắn gọn vấn đề"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Khách hàng</label>
            <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Tên khách hàng"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại</label>
              <select value={type} onChange={(e) => setType(e.target.value as LeakType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                {Object.entries(LEAK_TYPE_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mức độ</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value as LeakSeverity)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                {Object.entries(LEAK_SEVERITY_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tổn thất ước tính (VNĐ)</label>
              <input type="number" value={estimatedLoss} onChange={(e) => setEstimatedLoss(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phụ trách</label>
              <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Người phụ trách"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Báo cáo Leak"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Card View
 * ============================================================ */
function LeakCard({ item, onView, onDelete }: {
  item: RevenueLeakItem; onView: () => void; onDelete: () => void;
}) {
  const tCfg = LEAK_TYPE_CONFIG[item.type];
  const sCfg = LEAK_SEVERITY_CONFIG[item.severity];
  const stCfg = LEAK_STATUS_CONFIG[item.status];
  const isResolved = item.status === "resolved";

  return (
    <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow group ${
      isResolved ? "border-green-200 opacity-75" :
      item.severity === "critical" ? "border-red-200" :
      item.severity === "high" ? "border-orange-200" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 min-w-0 cursor-pointer" onClick={onView}>
          <span className="text-xl mt-0.5 flex-shrink-0">{tCfg.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1 flex-wrap mb-0.5">
              <span className={`text-[7px] px-1.5 py-0.5 rounded border ${sCfg.bgColor} ${sCfg.color}`}>{sCfg.label}</span>
              <span className={`text-[7px] ${stCfg.color}`}>● {stCfg.label}</span>
            </div>
            <h4 className="text-xs text-gray-900 line-clamp-2">{item.title}</h4>
          </div>
        </div>
        <button type="button" onClick={onDelete}
          className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[9px] text-gray-500 line-clamp-2 mb-2">{item.description}</p>

      <div className="bg-blue-50 rounded-lg p-2 border border-blue-100 mb-2">
        <div className="flex items-center gap-1 mb-0.5">
          <Lightbulb className="w-3 h-3 text-blue-500" />
          <span className="text-[8px] text-blue-700">AI Đề xuất</span>
        </div>
        <p className="text-[9px] text-blue-600 line-clamp-2">{item.suggestedAction}</p>
      </div>

      <div className="flex items-center gap-3 text-[8px] text-gray-400 flex-wrap">
        <span>💰 <strong className="text-red-600">{formatVND(item.estimatedLoss)}₫</strong></span>
        <span>🎯 {item.assignedTo}</span>
        <span className="text-violet-500">AI {item.aiConfidence}%</span>
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function LeakDetailModal({ item, onClose }: { item: RevenueLeakItem; onClose: () => void }) {
  const tCfg = LEAK_TYPE_CONFIG[item.type];
  const sCfg = LEAK_SEVERITY_CONFIG[item.severity];
  const stCfg = LEAK_STATUS_CONFIG[item.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tCfg.icon}</span>
            <div>
              <h3 className="text-gray-900 text-sm">{item.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${sCfg.bgColor} ${sCfg.color}`}>{sCfg.label}</span>
                <span className={`text-[8px] ${stCfg.color}`}>● {stCfg.label}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <p className="text-sm text-gray-600">{item.description}</p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Tổn thất ước tính", value: `${formatVND(item.estimatedLoss)}₫` },
              { label: "Khách hàng", value: item.customer },
              { label: "Deal", value: item.deal ?? "—" },
              { label: "Phụ trách", value: item.assignedTo },
              { label: "Phát hiện", value: item.detectedDate },
              { label: "AI Confidence", value: `${item.aiConfidence}%` },
            ].map((x) => (
              <div key={x.label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[9px] text-gray-400">{x.label}</p>
                <p className="text-xs text-gray-800">{x.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-blue-800">AI Đề xuất hành động</span>
            </div>
            <p className="text-sm text-blue-700">{item.suggestedAction}</p>
          </div>

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((t) => (
                <span key={t} className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100 gap-2">
          {item.status !== "resolved" && (
            <button type="button" onClick={() => { toast.success("Đang xử lý leak..."); onClose(); }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Xử lý
            </button>
          )}
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function RevenueLeakagePage() {
  const [data, setData] = useState<RevenueLeakItem[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({ severity: "", type: "", status: "" });
  const [selected, setSelected] = useState<RevenueLeakItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { mode, setMode } = useViewMode("leaks");

  const loadData = useCallback(async () => {
    const result = await fetchRevenueLeaks({
      search: search || undefined,
      severity: (filters.severity || null) as LeakSeverity | null,
      type: (filters.type || null) as LeakType | null,
      status: (filters.status || null) as LeakStatus | null,
    });
    setData(result);
  }, [search, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => {
    const openLeaks = data.filter((l) => l.status === "open" || l.status === "investigating");
    const totalLoss = openLeaks.reduce((s, l) => s + l.estimatedLoss, 0);
    const recoveredLoss = data.filter((l) => l.status === "resolved").reduce((s, l) => s + l.estimatedLoss, 0);
    const criticalCount = openLeaks.filter((l) => l.severity === "critical").length;
    const avgConfidence = data.length > 0 ? Math.round(data.reduce((s, l) => s + l.aiConfidence, 0) / data.length) : 0;
    return { openCount: openLeaks.length, totalLoss, recoveredLoss, criticalCount, avgConfidence };
  }, [data]);

  const pagination = usePagination(data, { storageKey: "leaks" });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const count = await deleteRevenueLeaks(deleteTarget.ids);
    toast.success(`Đã xoá ${count} leak`);
    setDeleteTarget(null);
    loadData();
  };

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateRevenueLeak(rowId, { [field]: value });
    loadData();
    toast.success("Đã cập nhật leak");
  }, [loadData]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Droplets className="w-6 h-6 text-red-500" /> Revenue Leakage Detector
          </h1>
          <p className="text-gray-500 mt-0.5">AI phát hiện rò rỉ doanh thu — deals trì trệ, bỏ lỡ upsell, churn signals, lỗi định giá</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} />
          <button type="button" onClick={() => setShowCreate(true)}
            className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
            <Plus className="w-4 h-4" /> Báo cáo Leak
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{formatVND(stats.totalLoss)}₫</p>
          <p className="text-[9px] text-red-700">Tổn thất tiềm năng</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{formatVND(stats.recoveredLoss)}₫</p>
          <p className="text-[9px] text-green-700">Đã thu hồi</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-2.5 text-center">
          <p className="text-lg text-orange-600">{stats.openCount}</p>
          <p className="text-[9px] text-orange-700">Leaks đang mở</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.avgConfidence}%</p>
          <p className="text-[9px] text-violet-700">AI Confidence TB</p>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm leak, khách hàng, deal..."
        filters={LEAK_FILTERS}
        filterValues={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onClearAll={() => { setSearch(""); setFilters({ severity: "", type: "", status: "" }); }}
      />

      {/* Table View */}
      {mode === "table" && (
        <DataTable<RevenueLeakItem>
          data={pagination.paginatedItems}
          columns={LEAK_COLUMNS}
          storageKey="leaks-table"
          selectable
          onInlineEdit={handleInlineEdit}
          onRowClick={setSelected}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} leak được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelected(item)} className="p-1 text-gray-300 hover:text-red-600"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.title.substring(0, 30) })} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không có leak nào phù hợp"
        />
      )}

      {/* Card View */}
      {mode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {pagination.paginatedItems.map((l) => (
            <LeakCard
              key={l.id}
              item={l}
              onView={() => setSelected(l)}
              onDelete={() => setDeleteTarget({ ids: [l.id], label: l.title.substring(0, 30) })}
            />
          ))}
          {pagination.paginatedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <Droplets className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không có leak nào phù hợp</p>
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
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-red-600" />
          <h4 className="text-sm text-red-900">AI Revenue Protection Summary</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-red-800">
          <p className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span>Tổng rò rỉ phát hiện: <strong>13.5B₫</strong>. Nếu xử lý 6 leaks còn lại, <strong>cứu được 13.0B₫</strong> — tương đương <strong>8.2% pipeline value</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <span><strong>Discount abuse</strong> là vấn đề lớn nhất (1.2B₫ margin loss). AI recommend: bật auto-block + Director approval cho discount vượt ngưỡng.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>5 hợp đồng sắp hết hạn</strong> chưa có renewal deal (4.2B₫ at risk). AI đã <strong>auto-create 5 renewal deals</strong> trong pipeline.</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {selected && <LeakDetailModal item={selected} onClose={() => setSelected(null)} />}
      {showCreate && <LeakCreateModal onClose={() => setShowCreate(false)} onCreated={loadData} />}
      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemName={deleteTarget.label}
          entityType="leak"
          description="Hành động này không thể hoàn tác."
        />
      )}
    </div>
  );
}