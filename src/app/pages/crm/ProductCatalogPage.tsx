/**
 * Trang Danh mục Sản phẩm & Dịch vụ — DataTable + Grid view toggle
 * Features: FilterBar, Pagination, Column Visibility, Inline Edit (status),
 *           ViewToggle (Table/Card), Detail Modal, Charts, AI Cross-sell.
 * Phase F5-10 → F5-11 — Centralized types/constants/data/API
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Package, Plus, Star, TrendingUp, DollarSign, ShoppingCart, Layers,
  BarChart3, Bot, Sparkles, Eye, X, CheckCircle2, ChevronDown,
  ChevronUp, Users, Globe, Cpu, Shield, Trash2, Copy,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import type { Product, ProductCategory, ProductType, PricingModel, ProductStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  PRODUCT_TYPE_CONFIG,
  PRODUCT_CATEGORY_CONFIG,
  PRICING_MODEL_LABELS,
  PRODUCT_STATUS_CONFIG,
} from "../../constants/crmConfig";
import { fetchProducts, updateProduct, deleteProducts as apiDeleteProducts, createProduct } from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Icon mapping cho Category (JSX không thuộc constants)
 * ============================================================ */
const CATEGORY_ICONS: Record<ProductCategory, React.ReactNode> = {
  outsource: <Globe className="w-3.5 h-3.5" />,
  product: <Package className="w-3.5 h-3.5" />,
  consulting: <Users className="w-3.5 h-3.5" />,
  "ai-solution": <Cpu className="w-3.5 h-3.5" />,
  maintenance: <Shield className="w-3.5 h-3.5" />,
  training: <Star className="w-3.5 h-3.5" />,
};

/* ============================================================
 * Filter config
 * ============================================================ */
const PRODUCT_FILTERS: FilterConfig[] = [
  {
    key: "type", label: "Loại", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(PRODUCT_TYPE_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
  {
    key: "category", label: "Danh mục", type: "select",
    options: Object.entries(PRODUCT_CATEGORY_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
  {
    key: "status", label: "Trạng thái", type: "select",
    options: Object.entries(PRODUCT_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const PRODUCT_COLUMNS: ColumnDef<Product>[] = [
  {
    key: "name", header: "Sản phẩm", sortable: true, minWidth: 220,
    render: (p) => (
      <div className="flex items-center gap-2.5">
        <span className="text-lg flex-shrink-0">{p.icon}</span>
        <div className="min-w-0">
          <p className="text-gray-900 truncate">{p.name}</p>
          <p className="text-[10px] text-gray-400 line-clamp-1">{p.shortDescription}</p>
        </div>
      </div>
    ),
  },
  {
    key: "type", header: "Loại", sortable: true, minWidth: 80,
    render: (p) => {
      const cfg = PRODUCT_TYPE_CONFIG[p.type];
      return <span className={`text-[11px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
  },
  {
    key: "category", header: "Danh mục", sortable: true, minWidth: 110,
    render: (p) => (
      <span className="text-[11px] text-gray-600 flex items-center gap-1">
        {CATEGORY_ICONS[p.category]} {PRODUCT_CATEGORY_CONFIG[p.category].label}
      </span>
    ),
  },
  {
    key: "basePrice", header: "Giá cơ bản", sortable: true, minWidth: 100,
    render: (p) => (
      <span className="text-gray-900 text-[13px]">
        ${p.basePrice.toLocaleString()}
        <span className="text-[10px] text-gray-400 ml-0.5">{PRICING_MODEL_LABELS[p.pricingModel]}</span>
      </span>
    ),
    sortValue: (p) => p.basePrice,
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 90, editable: true,
    render: (p) => {
      const cfg = PRODUCT_STATUS_CONFIG[p.status];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(PRODUCT_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
  },
  { key: "dealsUsing", header: "Deals", sortable: true, minWidth: 60, render: (p) => <span className="text-gray-700 text-[13px]">{p.dealsUsing}</span>, sortValue: (p) => p.dealsUsing },
  { key: "totalRevenue", header: "Doanh thu", sortable: true, minWidth: 100, render: (p) => <span className="text-gray-900 text-[13px]">${(p.totalRevenue / 1000).toFixed(0)}K</span>, sortValue: (p) => p.totalRevenue },
  {
    key: "winRate", header: "Win rate", sortable: true, minWidth: 80,
    render: (p) => (
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[30px]">
          <div className={`h-full rounded-full ${p.winRate >= 70 ? "bg-green-500" : p.winRate >= 50 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: `${p.winRate}%` }} />
        </div>
        <span className="text-[11px] text-gray-600 w-7 text-right">{p.winRate}%</span>
      </div>
    ),
    sortValue: (p) => p.winRate,
  },
  { key: "avgDealSize", header: "Deal TB", sortable: true, minWidth: 80, defaultHidden: true, render: (p) => <span className="text-gray-600 text-[13px]">${(p.avgDealSize / 1000).toFixed(0)}K</span>, sortValue: (p) => p.avgDealSize },
  { key: "tags", header: "Tags", minWidth: 140, defaultHidden: true, render: (p) => <div className="flex flex-wrap gap-1">{p.tags.map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{t}</span>)}</div> },
  { key: "createdDate", header: "Ngày tạo", sortable: true, minWidth: 90, defaultHidden: true, render: (p) => <span className="text-gray-500 text-[13px]">{p.createdDate}</span> },
];

/* ============================================================
 * Create Product Modal
 * ============================================================ */
function ProductCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [type, setType] = useState<ProductType>("service");
  const [category, setCategory] = useState<ProductCategory>("outsource");
  const [pricingModel, setPricingModel] = useState<PricingModel>("monthly");
  const [basePrice, setBasePrice] = useState(0);
  const [status, setStatus] = useState<ProductStatus>("draft");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên sản phẩm"); return; }
    setSaving(true);
    await createProduct({
      name, shortDescription, type, category, pricingModel, basePrice, status,
      currency: "USD", icon: "📦",
      tiers: [{ name: "Standard", price: basePrice, unit: pricingModel === "monthly" ? "/tháng" : "", features: [], recommended: true }],
      dealsUsing: 0, totalRevenue: 0, avgDealSize: 0, winRate: 0,
      tags: [], createdDate: new Date().toISOString().split("T")[0],
      aiCrossSell: [], aiNote: "",
    });
    toast.success(`Đã tạo sản phẩm "${name}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Sản phẩm mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên sản phẩm *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: AI Analytics Platform"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả ngắn</label>
            <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Mô tả sản phẩm..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại</label>
              <select value={type} onChange={(e) => setType(e.target.value as ProductType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.entries(PRODUCT_TYPE_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Danh mục</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.entries(PRODUCT_CATEGORY_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Giá cơ bản ($)</label>
              <input type="number" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Pricing</label>
              <select value={pricingModel} onChange={(e) => setPricingModel(e.target.value as PricingModel)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.entries(PRICING_MODEL_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.entries(PRODUCT_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Product Card
 * ============================================================ */
function ProductCard({ product, onViewDetail }: { product: Product; onViewDetail: () => void }) {
  const typeCfg = PRODUCT_TYPE_CONFIG[product.type];
  const catCfg = PRODUCT_CATEGORY_CONFIG[product.category];
  const statusCfg = PRODUCT_STATUS_CONFIG[product.status];
  const recTier = product.tiers.find((t) => t.recommended) ?? product.tiers[0];
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow group">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl flex-shrink-0">{product.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm text-gray-900 truncate">{product.name}</h4>
          <p className="text-xs text-gray-500 line-clamp-1">{product.shortDescription}</p>
        </div>
        <button type="button" onClick={onViewDetail} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 p-1 transition-opacity"><Eye className="w-4 h-4" /></button>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${typeCfg.bgColor} ${typeCfg.color}`}>{typeCfg.label}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 flex items-center gap-0.5">
          {CATEGORY_ICONS[product.category]} {catCfg.label}
        </span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded ${statusCfg.color}`}>{statusCfg.label}</span>
      </div>
      <div className="bg-gray-50 rounded-lg p-2.5 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400">{recTier.name} · {PRICING_MODEL_LABELS[product.pricingModel]}</span>
          {recTier.recommended && <span className="text-[8px] px-1 py-0.5 rounded bg-violet-100 text-violet-600">Phổ biến</span>}
        </div>
        <p className="text-gray-900">{recTier.price > 0 ? `$${recTier.price.toLocaleString()}` : "Liên hệ"}<span className="text-xs text-gray-400 ml-0.5">{recTier.unit}</span></p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div><p className="text-sm text-gray-900">{product.dealsUsing}</p><p className="text-[9px] text-gray-400">Deals</p></div>
        <div><p className="text-sm text-gray-900">${(product.totalRevenue / 1000).toFixed(0)}K</p><p className="text-[9px] text-gray-400">Doanh thu</p></div>
        <div><p className="text-sm text-gray-900">{product.winRate}%</p><p className="text-[9px] text-gray-400">Win rate</p></div>
      </div>
    </div>
  );
}

/* ============================================================
 * Product Detail Modal
 * ============================================================ */
function ProductDetailModal({ product, allProducts, onClose }: { product: Product; allProducts: Product[]; onClose: () => void }) {
  const typeCfg = PRODUCT_TYPE_CONFIG[product.type];
  const catCfg = PRODUCT_CATEGORY_CONFIG[product.category];
  const crossSell = allProducts.filter((p) => product.aiCrossSell.includes(p.id));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{product.icon}</span>
            <div>
              <h3 className="text-sm text-gray-900">{product.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${typeCfg.bgColor} ${typeCfg.color}`}>{typeCfg.label}</span>
                <span className="text-[9px] text-gray-400 flex items-center gap-0.5">{CATEGORY_ICONS[product.category]} {catCfg.label}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <p className="text-sm text-gray-600">{product.shortDescription}</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Deals", value: `${product.dealsUsing}`, icon: <ShoppingCart className="w-3 h-3" /> },
              { label: "Doanh thu", value: `$${(product.totalRevenue / 1000).toFixed(0)}K`, icon: <DollarSign className="w-3 h-3" /> },
              { label: "Deal TB", value: `$${(product.avgDealSize / 1000).toFixed(0)}K`, icon: <BarChart3 className="w-3 h-3" /> },
              { label: "Win rate", value: `${product.winRate}%`, icon: <TrendingUp className="w-3 h-3" /> },
            ].map((m) => (
              <div key={m.label} className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-gray-400 text-[10px] mb-0.5">{m.icon} {m.label}</div>
                <p className="text-sm text-gray-900">{m.value}</p>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Bảng giá</h4>
            <div className="space-y-2">
              {product.tiers.map((tier) => (
                <div key={tier.name} className={`rounded-lg border p-3 ${tier.recommended ? "border-violet-300 bg-violet-50/50" : "border-gray-100"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">{tier.name}</span>
                    <span className="text-gray-800">{tier.price > 0 ? `$${tier.price.toLocaleString()}` : "Liên hệ"}<span className="text-xs text-gray-400 ml-0.5">{tier.unit}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-1">{tier.features.map((f) => <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{f}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">{product.tags.map((tag) => <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>)}</div>
          {crossSell.length > 0 && (
            <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg border border-violet-100 p-3">
              <h4 className="text-xs text-violet-800 mb-2 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-violet-500" /> AI gợi ý bán kèm</h4>
              <div className="space-y-1.5">
                {crossSell.map((cp) => (
                  <div key={cp.id} className="flex items-center gap-2 text-sm"><span>{cp.icon}</span><span className="text-gray-700 flex-1">{cp.name}</span><span className="text-[10px] text-violet-600">+{cp.winRate}% win rate</span></div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={() => toast.success("Đã sao chép link")} className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"><Copy className="w-3.5 h-3.5" /> Sao chép</button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính — dùng API layer thay vì inline data
 * ============================================================ */
export function ProductCatalogPage() {
  const { mode, setMode } = useViewMode("products", "card");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [showChart, setShowChart] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* Load data từ API layer */
  const reload = useCallback(() => { fetchProducts().then(setProducts); }, []);
  useEffect(() => { reload(); }, [reload]);

  /* FilterBar */
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const handleFilterChange = useCallback((key: string, value: string) => { setFilterValues((prev) => ({ ...prev, [key]: value })); }, []);
  const hasActiveFilters = !!search || Object.values(filterValues).some((v) => v !== "");
  const clearAll = useCallback(() => { setSearch(""); setFilterValues({}); }, []);

  /* Filter (client-side on loaded data) */
  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (filterValues.type) result = result.filter((p) => p.type === filterValues.type);
    if (filterValues.category) result = result.filter((p) => p.category === filterValues.category);
    if (filterValues.status) result = result.filter((p) => p.status === filterValues.status);
    return result;
  }, [products, search, filterValues]);

  const cardPag = usePagination(filtered, { storageKey: "products-card", initialPageSize: 10 });

  /* Chart data (computed from loaded products) */
  const revenueChart = useMemo(() =>
    [...products].filter((p) => p.status === "active").sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 6)
      .map((p) => ({ name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name, revenue: p.totalRevenue / 1000 })),
  [products]);
  const BAR_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"];

  /* Stats */
  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    totalRevenue: products.reduce((s, p) => s + p.totalRevenue, 0),
    avgWinRate: products.length > 0 ? Math.round(products.reduce((s, p) => s + p.winRate, 0) / products.length) : 0,
  }), [products]);

  /* Inline edit qua API */
  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateProduct(rowId, { [field]: value });
    reload();
    toast.success("Đã cập nhật sản phẩm");
  }, [reload]);

  /* Delete */
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await apiDeleteProducts([deleteTarget.id]);
    reload();
    toast.success(`Đã xóa "${deleteTarget.name}"`);
    setDeleteTarget(null);
  }, [deleteTarget, reload]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    await apiDeleteProducts(ids);
    reload();
    toast.success(`Đã xóa ${ids.length} sản phẩm`);
  }, [reload]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2"><Package className="w-5 h-5 text-blue-600" /> Danh mục Sản phẩm & Dịch vụ</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Pricing tiers · Cross-sell AI · Revenue analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} modes={["card", "table"]} />
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Thêm</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3"><Package className="w-4 h-4 text-violet-500 mb-1" /><p className="text-lg text-gray-900">{stats.total}</p><p className="text-xs text-gray-500">Tổng offerings</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-3"><CheckCircle2 className="w-4 h-4 text-green-500 mb-1" /><p className="text-lg text-gray-900">{stats.active}</p><p className="text-xs text-gray-500">Đang bán</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-3"><DollarSign className="w-4 h-4 text-blue-500 mb-1" /><p className="text-lg text-gray-900">${(stats.totalRevenue / 1_000_000).toFixed(2)}M</p><p className="text-xs text-gray-500">Tổng doanh thu</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-3"><TrendingUp className="w-4 h-4 text-amber-500 mb-1" /><p className="text-lg text-gray-900">{stats.avgWinRate}%</p><p className="text-xs text-gray-500">Win rate TB</p></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <button type="button" onClick={() => setShowChart(!showChart)} className="flex items-center justify-between w-full">
          <h3 className="text-sm text-gray-800 flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-violet-500" /> Doanh thu theo sản phẩm (Top 6)</h3>
          {showChart ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showChart && revenueChart.length > 0 && (
          <div className="mt-3">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}K`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                <Tooltip formatter={(v: number) => [`$${v}K`, "Doanh thu"]} />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>{revenueChart.map((_, i) => <Cell key={i} fill={BAR_COLORS[i]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Tìm sản phẩm, dịch vụ, tag..."
        filters={PRODUCT_FILTERS} filterValues={filterValues} onFilterChange={handleFilterChange} onClearAll={clearAll} hasActiveFilters={hasActiveFilters} />

      {mode === "table" ? (
        <DataTable<Product> data={filtered} columns={PRODUCT_COLUMNS} storageKey="products" selectable
          defaultSortField="totalRevenue" onInlineEdit={handleInlineEdit} onRowClick={(p) => setSelectedProduct(p)}
          onBulkDelete={handleBulkDelete} emptyMessage="Không tìm thấy sản phẩm phù hợp"
          renderRowActions={(p) => (
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => setSelectedProduct(p)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget(p)} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cardPag.paginatedItems.map((product) => <ProductCard key={product.id} product={product} onViewDetail={() => setSelectedProduct(product)} />)}
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><Package className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">Không tìm thấy sản phẩm phù hợp</p></div>}
          {filtered.length > 0 && <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"><PaginationBar {...cardPag} onGoToPage={cardPag.goToPage} onNextPage={cardPag.nextPage} onPrevPage={cardPag.prevPage} onSetPageSize={cardPag.setPageSize} /></div>}
        </>
      )}

      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-violet-600" /><h4 className="text-sm text-violet-900">AI Cross-sell Insights</h4></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />Deal outsource thường thắng cao hơn 18% khi đi kèm AI Chatbot.</p>
          <p className="flex items-start gap-2"><TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />Bundle "DX trọn gói" có deal size gấp 2.5x so với bán lẻ.</p>
          <p className="flex items-start gap-2"><DollarSign className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />Training sau bán hàng tăng retention rate thêm 35%.</p>
        </div>
      </div>

      {selectedProduct && <ProductDetailModal product={selectedProduct} allProducts={products} onClose={() => setSelectedProduct(null)} />}
      <ConfirmDeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        itemName={deleteTarget?.name ?? ""} entityType="sản phẩm" description="Hành động này không thể hoàn tác." />
      {showCreateModal && <ProductCreateModal onClose={() => setShowCreateModal(false)} onCreated={reload} />}
    </div>
  );
}
