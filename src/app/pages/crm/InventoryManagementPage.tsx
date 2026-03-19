/**
 * Inventory Management — Quản lý Kho & License.
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Inline Edit (status), Detail Modal,
 *   AI Insights, Delete đơn lẻ + bulk.
 * Phase 5 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Warehouse, Package, Plus, AlertTriangle, Sparkles, Bot,
  RefreshCw, Trash2, Eye, X, CheckCircle2, ShieldAlert,
  TrendingDown, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import type { InventoryItem, StockStatus, InventoryItemType } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { STOCK_STATUS_CONFIG, INVENTORY_TYPE_CONFIG, formatVND } from "../../constants/crmConfig";
import {
  fetchInventoryItems, updateInventoryItem,
  deleteInventoryItems as apiDeleteItems, createInventoryItem,
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
const INV_FILTERS: FilterConfig[] = [
  {
    key: "status", label: "Trạng thái", type: "select",
    options: Object.entries(STOCK_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
  {
    key: "type", label: "Loại", type: "select",
    options: Object.entries(INVENTORY_TYPE_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const INV_COLUMNS: ColumnDef<InventoryItem>[] = [
  {
    key: "name", header: "Sản phẩm", sortable: true, minWidth: 220,
    render: (i) => (
      <div className="min-w-0">
        <p className="text-gray-900 truncate">{i.name}</p>
        <p className="text-[10px] text-gray-400 truncate">SKU: {i.sku} · {i.category}</p>
      </div>
    ),
  },
  {
    key: "type", header: "Loại", sortable: true, minWidth: 100,
    render: (i) => {
      const cfg = INVENTORY_TYPE_CONFIG[i.type];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>;
    },
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 110, editable: true,
    render: (i) => {
      const cfg = STOCK_STATUS_CONFIG[i.status];
      return <span className={`text-[11px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(STOCK_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "currentStock", header: "Tồn kho", sortable: true, minWidth: 100,
    render: (i) => (
      <div className="min-w-0">
        <span className="text-gray-900">{i.currentStock}</span>
        <span className="text-[10px] text-gray-400"> / {i.maxStock}</span>
        {i.reservedStock > 0 && <span className="text-[9px] text-amber-500 ml-1">({i.reservedStock} đặt)</span>}
      </div>
    ),
    sortValue: (i) => i.currentStock,
  },
  {
    key: "unitPrice", header: "Đơn giá", sortable: true, minWidth: 110, defaultHidden: true,
    render: (i) => <span className="text-gray-600 text-[13px]">{formatVND(i.unitPrice)}</span>,
    sortValue: (i) => i.unitPrice,
  },
  {
    key: "totalValue", header: "Giá trị", sortable: true, minWidth: 120,
    render: (i) => <span className="text-gray-900">{formatVND(i.totalValue)}</span>,
    sortValue: (i) => i.totalValue,
  },
  {
    key: "location", header: "Vị trí", sortable: true, minWidth: 120, defaultHidden: true,
    render: (i) => <span className="text-gray-500 text-[13px]">{i.location}</span>,
  },
  {
    key: "supplier", header: "Nhà cung cấp", sortable: true, minWidth: 120,
    render: (i) => <span className="text-gray-500 text-[13px]">{i.supplier}</span>,
  },
  {
    key: "daysUntilStockout", header: "Còn ~ngày", sortable: true, minWidth: 80,
    render: (i) => {
      if (i.daysUntilStockout === null) return <span className="text-gray-300">—</span>;
      const color = i.daysUntilStockout <= 30 ? "text-red-600" : i.daysUntilStockout <= 90 ? "text-amber-600" : "text-green-600";
      return <span className={`text-[13px] ${color}`}>~{i.daysUntilStockout}d</span>;
    },
    sortValue: (i) => i.daysUntilStockout ?? 9999,
  },
  {
    key: "autoReorder", header: "Tự đặt", minWidth: 60,
    render: (i) => i.autoReorder
      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
      : <span className="text-gray-300">—</span>,
  },
];

/* ============================================================
 * Detail Modal
 * ============================================================ */
function InventoryDetailModal({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  const stCfg = STOCK_STATUS_CONFIG[item.status];
  const tpCfg = INVENTORY_TYPE_CONFIG[item.type];
  const stockPct = item.maxStock > 0 ? (item.currentStock / item.maxStock) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="text-gray-900">{item.name}</h3>
            <p className="text-xs text-gray-500">SKU: {item.sku} · {item.category}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] px-2 py-0.5 rounded border ${stCfg.bgColor} ${stCfg.color}`}>{stCfg.label}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded ${tpCfg.color}`}>{tpCfg.label}</span>
            {item.autoReorder && <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded border border-green-200">Auto-reorder</span>}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <p className="text-sm text-gray-900">{item.currentStock}</p>
              <p className="text-[9px] text-gray-400">Tồn kho</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <p className="text-sm text-gray-900">{item.reservedStock}</p>
              <p className="text-[9px] text-gray-400">Đã đặt</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <p className="text-sm text-gray-900">{item.daysUntilStockout ?? "—"}</p>
              <p className="text-[9px] text-gray-400">Ngày còn</p>
            </div>
          </div>
          {/* Stock bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-gray-500">Tồn: {item.currentStock} / {item.maxStock} (min: {item.minStock})</span>
              <span className="text-gray-400">{Math.round(stockPct)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
              <div className="absolute h-full w-px bg-red-400" style={{ left: `${(item.minStock / item.maxStock) * 100}%` }} />
              <div className={`h-full rounded-full transition-all ${
                item.status === "out-of-stock" ? "bg-red-400" :
                item.status === "low-stock" ? "bg-amber-400" :
                item.status === "overstock" ? "bg-blue-400" : "bg-green-400"
              }`} style={{ width: `${Math.min(stockPct, 100)}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400">Đơn giá</p>
              <p className="text-sm text-gray-900">{formatVND(item.unitPrice)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400">Tổng giá trị</p>
              <p className="text-sm text-gray-900">{formatVND(item.totalValue)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400">Sử dụng/tháng</p>
              <p className="text-sm text-gray-900">~{item.monthlyUsage}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400">Nhập cuối</p>
              <p className="text-sm text-gray-900">{item.lastRestocked}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400">Vị trí · NCC</p>
            <p className="text-sm text-gray-900">{item.location} · {item.supplier}</p>
          </div>
          {item.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {item.tags.map((t) => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 flex-shrink-0">
          {(item.status === "low-stock" || item.status === "out-of-stock") && (
            <button type="button" onClick={() => { toast.success(`Đã tạo đơn đặt hàng cho ${item.name}`); onClose(); }}
              className="flex items-center gap-1 px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
              <RefreshCw className="w-4 h-4" /> Đặt hàng
            </button>
          )}
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Card View Item
 * ============================================================ */
function InventoryCard({ item, onView, onDelete }: {
  item: InventoryItem;
  onView: (i: InventoryItem) => void;
  onDelete: (i: InventoryItem) => void;
}) {
  const stCfg = STOCK_STATUS_CONFIG[item.status];
  const tpCfg = INVENTORY_TYPE_CONFIG[item.type];
  const stockPct = item.maxStock > 0 ? Math.min((item.currentStock / item.maxStock) * 100, 100) : 0;

  return (
    <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer ${
      item.status === "out-of-stock" ? "border-red-200" :
      item.status === "low-stock" ? "border-amber-200" : "border-gray-100"
    }`} onClick={() => onView(item)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            item.type === "license" ? "bg-violet-50" :
            item.type === "hardware" ? "bg-cyan-50" :
            item.type === "subscription" ? "bg-emerald-50" : "bg-orange-50"
          }`}>
            <Package className={`w-4 h-4 ${tpCfg.color.split(" ")[0]}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-900 truncate">{item.name}</p>
            <p className="text-[9px] text-gray-400">{item.sku} · {item.supplier}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bgColor} ${stCfg.color}`}>{stCfg.label}</span>
          <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(item); }}
            className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>
      {/* Stock bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[9px] mb-0.5">
          <span className="text-gray-400">Tồn: {item.currentStock}/{item.maxStock}</span>
          <span className="text-gray-400">{item.daysUntilStockout !== null ? `~${item.daysUntilStockout}d` : "—"}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${
            item.status === "out-of-stock" ? "bg-red-400" :
            item.status === "low-stock" ? "bg-amber-400" :
            item.status === "overstock" ? "bg-blue-400" : "bg-green-400"
          }`} style={{ width: `${stockPct}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-gray-500">{formatVND(item.totalValue)}</span>
        <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0.5 rounded ${tpCfg.color}`}>{tpCfg.label}</span>
          {item.autoReorder && <CheckCircle2 className="w-3 h-3 text-green-500" />}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Inventory Item Modal
 * ============================================================ */
function InventoryCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState(`SKU-${Date.now().toString(36).toUpperCase().slice(-6)}`);
  const [type, setType] = useState<InventoryItemType>("license");
  const [category, setCategory] = useState("CRM License");
  const [currentStock, setCurrentStock] = useState(10);
  const [minStock, setMinStock] = useState(5);
  const [maxStock, setMaxStock] = useState(100);
  const [unitPrice, setUnitPrice] = useState(0);
  const [location, setLocation] = useState("");
  const [supplier, setSupplier] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên sản phẩm"); return; }
    setSaving(true);
    const status: StockStatus = currentStock === 0 ? "out-of-stock" : currentStock <= minStock ? "low-stock" : currentStock >= maxStock ? "overstock" : "in-stock";
    await createInventoryItem({
      name, sku, type, category, currentStock, minStock, maxStock,
      reservedStock: 0, unitPrice, totalValue: currentStock * unitPrice,
      status, location: location || "Kho chính",
      supplier: supplier || "Chưa gán",
      lastRestocked: new Date().toISOString().slice(0, 10),
      monthlyUsage: 0, daysUntilStockout: null,
      autoReorder: false, tags: [],
    });
    toast.success(`Đã thêm "${name}" vào kho`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Thêm vào Kho</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên sản phẩm *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: CRM Enterprise License"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">SKU</label>
              <input type="text" value={sku} onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại</label>
              <select value={type} onChange={(e) => setType(e.target.value as InventoryItemType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                {Object.entries(INVENTORY_TYPE_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Danh mục</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Đơn giá (VNĐ)</label>
              <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tồn kho</label>
              <input type="number" value={currentStock} onChange={(e) => setCurrentStock(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tối thiểu</label>
              <input type="number" value={minStock} onChange={(e) => setMinStock(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tối đa</label>
              <input type="number" value={maxStock} onChange={(e) => setMaxStock(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Vị trí kho</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="VD: Kho HCM"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nhà cung cấp</label>
              <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Tên NCC"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Thêm vào kho"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function InventoryManagementPage() {
  const { mode, setMode } = useViewMode("inventory", "table");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; name: string } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* ---- Load data ---- */
  const loadData = useCallback(async () => {
    const data = await fetchInventoryItems({
      search: search || undefined,
      status: (filterValues.status as StockStatus) || null,
      type: (filterValues.type as InventoryItemType) || null,
    });
    setItems(data);
  }, [search, filterValues]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    const totalValue = items.reduce((s, i) => s + i.totalValue, 0);
    const lowStock = items.filter((i) => i.status === "low-stock").length;
    const outOfStock = items.filter((i) => i.status === "out-of-stock").length;
    const autoReorder = items.filter((i) => i.autoReorder).length;
    return { totalValue, lowStock, outOfStock, autoReorder, total: items.length };
  }, [items]);

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
    await updateInventoryItem(rowId, { [field]: value });
    toast.success("Đã cập nhật");
    loadData();
  }, [loadData]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const count = await apiDeleteItems(deleteTarget.ids);
    toast.success(`Đã xóa ${count} mục`);
    setDeleteTarget(null);
    loadData();
  }, [deleteTarget, loadData]);

  const handleBulkDelete = useCallback((ids: string[]) => {
    setDeleteTarget({ ids, name: `${ids.length} mục` });
  }, []);

  /* ---- Card mode pagination ---- */
  const {
    paginatedItems: cardItems, currentPage, totalPages, totalItems,
    pageSize, isFirstPage, isLastPage, startIndex, endIndex,
    goToPage, nextPage, prevPage, setPageSize,
  } = usePagination(items, { storageKey: "inv-cards" });

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-cyan-600" /> Inventory Management
          </h1>
          <p className="text-gray-500 mt-0.5">Quản lý kho, license, thiết bị — theo dõi tồn kho, cảnh báo, tự động đặt hàng</p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 self-start">
          <Plus className="w-4 h-4" /> Thêm vào kho
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Sản phẩm</p>
        </div>
        <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-2.5 text-center">
          <p className="text-lg text-cyan-600">{formatVND(stats.totalValue)}</p>
          <p className="text-[9px] text-cyan-700">Tổng giá trị kho</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.lowStock}</p>
          <p className="text-[9px] text-amber-700">Sắp hết</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{stats.outOfStock}</p>
          <p className="text-[9px] text-red-700">Hết hàng</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.autoReorder}</p>
          <p className="text-[9px] text-green-700">Auto-reorder</p>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm sản phẩm, SKU, NCC..."
        filters={INV_FILTERS}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        hasActiveFilters={hasActiveFilters}
        actions={<ViewToggle mode={mode} onSetMode={setMode} />}
      />

      {/* Table View */}
      {mode === "table" && (
        <DataTable<InventoryItem>
          data={items}
          columns={INV_COLUMNS}
          storageKey="inventory"
          selectable
          onInlineEdit={handleInlineEdit}
          onRowClick={setSelectedItem}
          onBulkDelete={handleBulkDelete}
          defaultSortField="name"
          emptyMessage="Không tìm thấy sản phẩm nào"
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelectedItem(item)}
                className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], name: item.name })}
                className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
        />
      )}

      {/* Card View */}
      {mode === "card" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cardItems.map((item) => (
              <InventoryCard key={item.id} item={item}
                onView={setSelectedItem}
                onDelete={(i) => setDeleteTarget({ ids: [i.id], name: i.name })} />
            ))}
          </div>
          {items.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-400">
                <span>{startIndex + 1}–{endIndex} / {totalItems}</span>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={isFirstPage} onClick={prevPage}
                    className="px-2 py-1 border rounded disabled:opacity-30">←</button>
                  <span>Trang {currentPage}/{totalPages}</span>
                  <button type="button" disabled={isLastPage} onClick={nextPage}
                    className="px-2 py-1 border rounded disabled:opacity-30">→</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Alerts (in-page) */}
      {items.filter((i) => i.status === "low-stock" || i.status === "out-of-stock").length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm text-gray-800 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" /> Cảnh báo tồn kho ({items.filter((i) => i.status === "low-stock" || i.status === "out-of-stock").length})
          </h3>
          {items
            .filter((i) => i.status === "low-stock" || i.status === "out-of-stock")
            .sort((a, b) => (a.daysUntilStockout ?? 0) - (b.daysUntilStockout ?? 0))
            .map((item) => (
              <div key={item.id} className={`p-3 rounded-xl border ${
                item.status === "out-of-stock" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
              }`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
                    item.status === "out-of-stock" ? "text-red-500" : "text-amber-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{item.name}</p>
                    <p className="text-[10px] text-gray-500">
                      {item.status === "out-of-stock"
                        ? "Đã hết hàng — cần đặt ngay!"
                        : `Còn ${item.currentStock} (min: ${item.minStock}) — ~${item.daysUntilStockout} ngày`}
                    </p>
                  </div>
                  <button type="button" onClick={() => toast.success(`Đặt hàng ${item.name}`)}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex-shrink-0">
                    <RefreshCw className="w-3 h-3" /> Đặt
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <h4 className="text-sm text-cyan-900">AI Inventory Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-cyan-800">
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>AI Agent Seat License</strong> sẽ hết trong ~30 ngày. Nhu cầu tăng 25%/tháng. Đề xuất đặt thêm <strong>20 licenses</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span><strong>CRM Basic License dư thừa 40 units</strong>. Chi phí holding: <strong>{formatVND(200000000)}</strong>. Đề xuất chuyển đổi sang Enterprise.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI dự đoán: <strong>Email Marketing Credits</strong> cần tăng 50% trong Q2 do seasonal campaigns. Nên pre-order <strong>8 packs</strong>.</span>
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && <InventoryDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name ?? ""}
        entityType="sản phẩm kho"
        description="Dữ liệu tồn kho sẽ bị xóa vĩnh viễn."
      />
      {showCreateModal && <InventoryCreateModal onClose={() => setShowCreateModal(false)} onCreated={loadData} />}
    </div>
  );
}