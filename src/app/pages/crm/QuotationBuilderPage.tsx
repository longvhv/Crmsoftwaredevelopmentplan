/**
 * Trang Quotation Builder — Quản lý báo giá.
 * Features: DataTable + Card view toggle, FilterBar, Pagination,
 *           Column Visibility, Inline Edit (status), Detail Modal,
 *           Charts, AI Insights, Delete đơn lẻ + bulk.
 * Phase 4 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  FileSpreadsheet, Bot, Sparkles, Building2, User,
  DollarSign, CheckCircle2, Clock, XCircle, Send,
  Eye, X, Trash2, Plus, Calendar, ShoppingCart,
  Percent, Copy, Download, BarChart3, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import type { Quotation, QuotationStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { QUOTATION_STATUS_CONFIG, formatCurrency } from "../../constants/crmConfig";
import { fetchQuotations, updateQuotation, deleteQuotations as apiDeleteQuotations, createQuotation } from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Status Icons
 * ============================================================ */
const STATUS_ICONS: Record<QuotationStatus, React.ReactNode> = {
  draft: <Clock className="w-3 h-3" />,
  sent: <Send className="w-3 h-3" />,
  viewed: <Eye className="w-3 h-3" />,
  accepted: <CheckCircle2 className="w-3 h-3" />,
  rejected: <XCircle className="w-3 h-3" />,
  expired: <Clock className="w-3 h-3" />,
};

/* ============================================================
 * Filter config
 * ============================================================ */
const QUOTATION_FILTERS: FilterConfig[] = [
  {
    key: "status", label: "Trạng thái", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(QUOTATION_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const QUOTATION_COLUMNS: ColumnDef<Quotation>[] = [
  {
    key: "code", header: "Mã báo giá", sortable: true, minWidth: 130,
    render: (q) => <span className="text-gray-900 font-mono text-[13px]">{q.code}</span>,
  },
  {
    key: "dealName", header: "Deal", sortable: true, minWidth: 200,
    render: (q) => (
      <div className="min-w-0">
        <p className="text-gray-900 truncate">{q.dealName}</p>
        <p className="text-[10px] text-gray-400 truncate">{q.clientCompany} · {q.clientName}</p>
      </div>
    ),
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 110, editable: true,
    render: (q) => {
      const cfg = QUOTATION_STATUS_CONFIG[q.status];
      return (
        <span className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 w-fit ${cfg.bgColor} ${cfg.color}`}>
          {STATUS_ICONS[q.status]} {cfg.label}
        </span>
      );
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(QUOTATION_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "grandTotal", header: "Tổng cộng", sortable: true, minWidth: 120,
    render: (q) => (
      <span className="text-gray-900">{formatCurrency(q.grandTotal, q.currency)}</span>
    ),
    sortValue: (q) => q.grandTotal,
  },
  {
    key: "items", header: "Sản phẩm", minWidth: 60,
    render: (q) => <span className="text-gray-500 text-[13px]">{q.items.length}</span>,
  },
  {
    key: "validUntil", header: "Hiệu lực", sortable: true, minWidth: 100,
    render: (q) => {
      const days = Math.ceil((new Date(q.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return (
        <div className="text-[13px]">
          <p className="text-gray-700">{new Date(q.validUntil).toLocaleDateString("vi-VN")}</p>
          {days > 0 && days <= 14 && <p className="text-[10px] text-amber-500">Còn {days} ngày</p>}
          {days <= 0 && <p className="text-[10px] text-red-500">Đã hết hạn</p>}
        </div>
      );
    },
    sortValue: (q) => new Date(q.validUntil).getTime(),
  },
  {
    key: "createdBy", header: "Tạo bởi", sortable: true, minWidth: 130, defaultHidden: true,
    render: (q) => <span className="text-gray-600 text-[13px]">{q.createdBy}</span>,
  },
  {
    key: "createdDate", header: "Ngày tạo", sortable: true, minWidth: 100, defaultHidden: true,
    render: (q) => <span className="text-gray-600 text-[13px]">{new Date(q.createdDate).toLocaleDateString("vi-VN")}</span>,
    sortValue: (q) => new Date(q.createdDate).getTime(),
  },
];

/* ============================================================
 * Quotation Card
 * ============================================================ */
function QuotationCard({ quote, onView }: { quote: Quotation; onView: () => void }) {
  const sCfg = QUOTATION_STATUS_CONFIG[quote.status];
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onView}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">{quote.code}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${sCfg.bgColor} ${sCfg.color}`}>
            {STATUS_ICONS[quote.status]} {sCfg.label}
          </span>
        </div>
        <Eye className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors flex-shrink-0" />
      </div>
      <h4 className="text-sm text-gray-900 truncate mb-0.5">{quote.dealName}</h4>
      <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
        <Building2 className="w-3 h-3" /> {quote.clientCompany}
        <span className="mx-1">·</span>
        <User className="w-3 h-3" /> {quote.clientName}
      </p>
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
        {quote.items.slice(0, 2).map((item) => (
          <span key={item.id} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 whitespace-nowrap">
            {item.productName} · {item.tier}
          </span>
        ))}
        {quote.items.length > 2 && (
          <span className="text-[9px] text-gray-300">+{quote.items.length - 2}</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-gray-900">
          {formatCurrency(quote.grandTotal, quote.currency)}
        </p>
        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
          <Calendar className="w-3 h-3" />
          {new Date(quote.validUntil).toLocaleDateString("vi-VN")}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
 * Quotation Detail Modal
 * ============================================================ */
function QuotationDetailModal({ quote, onClose }: { quote: Quotation; onClose: () => void }) {
  const sCfg = QUOTATION_STATUS_CONFIG[quote.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <FileSpreadsheet className="w-5 h-5 text-violet-600" />
              <h3 className="text-gray-900">{quote.code}</h3>
              <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${sCfg.bgColor} ${sCfg.color}`}>
                {STATUS_ICONS[quote.status]} {sCfg.label}
              </span>
            </div>
            <p className="text-xs text-gray-500">{quote.dealName} · {quote.clientCompany}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 mb-0.5">Khách hàng</p>
              <p className="text-sm text-gray-900">{quote.clientName}</p>
              <p className="text-xs text-gray-500">{quote.clientCompany}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 mb-0.5">Thông tin</p>
              <p className="text-xs text-gray-600">Tạo: {new Date(quote.createdDate).toLocaleDateString("vi-VN")}</p>
              <p className="text-xs text-gray-600">Hiệu lực: {new Date(quote.validUntil).toLocaleDateString("vi-VN")}</p>
              <p className="text-xs text-gray-600">Bởi: {quote.createdBy}</p>
            </div>
          </div>

          {/* Line items */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <ShoppingCart className="w-3.5 h-3.5" /> Danh mục hàng hoá/dịch vụ
            </h4>
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-400">
                    <th className="text-left py-2 px-3">Sản phẩm</th>
                    <th className="text-left py-2 px-2">Gói</th>
                    <th className="text-right py-2 px-2">SL</th>
                    <th className="text-right py-2 px-2">Đơn giá</th>
                    <th className="text-right py-2 px-2">CK%</th>
                    <th className="text-right py-2 px-3">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item) => (
                    <tr key={item.id} className="border-t border-gray-50">
                      <td className="py-2 px-3 text-gray-900">{item.productName}</td>
                      <td className="py-2 px-2 text-gray-500 text-xs">{item.tier}</td>
                      <td className="py-2 px-2 text-right text-gray-600">{item.quantity}</td>
                      <td className="py-2 px-2 text-right text-gray-600">
                        ${item.unitPrice.toLocaleString()}<span className="text-[9px] text-gray-400">{item.unit}</span>
                      </td>
                      <td className="py-2 px-2 text-right">
                        {item.discount > 0
                          ? <span className="text-red-500">-{item.discount}%</span>
                          : <span className="text-gray-300">—</span>
                        }
                      </td>
                      <td className="py-2 px-3 text-right text-gray-900">${item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Tạm tính</span>
              <span>${quote.subtotal.toLocaleString()}</span>
            </div>
            {quote.discountTotal > 0 && (
              <div className="flex items-center justify-between text-sm text-red-500">
                <span>Chiết khấu</span>
                <span>-${quote.discountTotal.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Thuế VAT ({quote.taxRate}%)</span>
              <span>${quote.taxAmount.toLocaleString()}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex items-center justify-between text-gray-900">
              <span>Tổng cộng</span>
              <span className="text-lg">{formatCurrency(quote.grandTotal, quote.currency)}</span>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="bg-blue-50 rounded-lg border border-blue-100 p-3">
              <p className="text-xs text-blue-800 flex items-start gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                {quote.notes}
              </p>
            </div>
          )}

          {/* AI Suggestion */}
          {quote.aiSuggestion && (
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
              <p className="text-xs text-violet-800 flex items-start gap-1">
                <Sparkles className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
                <span><span className="text-violet-900">AI Upsell:</span> {quote.aiSuggestion}</span>
              </p>
            </div>
          )}

          {/* Tags */}
          {quote.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {quote.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => toast.success("Đã sao chép báo giá")}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <Copy className="w-3.5 h-3.5" /> Sao chép
            </button>
            <button type="button" onClick={() => toast.info("PDF export — đang phát triển")}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
          <button type="button" onClick={onClose}
            className="px-4 py-1.5 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Quotation Modal
 * ============================================================ */
function QuotationCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [clientCompany, setClientCompany] = useState("");
  const [clientName, setClientName] = useState("");
  const [dealName, setDealName] = useState("");
  const [status, setStatus] = useState<QuotationStatus>("draft");
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const code = `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900 + 100))}`;

  const handleSave = async () => {
    if (!clientCompany.trim()) { toast.error("Vui lòng nhập tên công ty"); return; }
    if (!dealName.trim()) { toast.error("Vui lòng nhập tên dự án / deal"); return; }
    if (!validUntil) { toast.error("Vui lòng chọn ngày hết hạn"); return; }
    setSaving(true);
    await createQuotation({
      code, clientName: clientName || clientCompany, clientCompany, dealName, status,
      items: [], subtotal: 0, discountTotal: 0, taxRate: 10, taxAmount: 0, grandTotal: 0,
      currency: "USD", validUntil,
      createdDate: new Date().toISOString().slice(0, 10),
      createdBy: "Chưa gán", notes,
      aiSuggestion: "Báo giá mới — AI sẽ phân tích upsell gợi ý khi thêm sản phẩm.",
      tags: [],
    });
    toast.success(`Đã tạo báo giá "${code}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Báo giá mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div className="bg-violet-50 rounded-lg p-2 text-center">
            <p className="text-xs text-violet-600">Mã báo giá: <span className="text-violet-900">{code}</span></p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Công ty *</label>
              <input type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} placeholder="Tên công ty"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Người đại diện</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Tên liên hệ"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên dự án / Deal *</label>
            <input type="text" value={dealName} onChange={(e) => setDealName(e.target.value)} placeholder="VD: AI Platform Phase 2"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as QuotationStatus)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(QUOTATION_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Hiệu lực đến *</label>
              <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Ghi chú</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Ghi chú cho báo giá..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo báo giá"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function QuotationBuilderPage() {
  const { mode, setMode } = useViewMode("quotations", "card");
  const [items, setItems] = useState<Quotation[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Quotation | null>(null);
  const [showChart, setShowChart] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const reload = useCallback(() => { fetchQuotations().then(setItems); }, []);
  useEffect(() => { reload(); }, [reload]);

  /* Filters */
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);
  const hasActiveFilters = !!search || Object.values(filterValues).some((v) => v !== "");
  const clearAll = useCallback(() => { setSearch(""); setFilterValues({}); }, []);

  const filtered = useMemo(() => {
    let result = [...items];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((qt) =>
        qt.code.toLowerCase().includes(q) || qt.dealName.toLowerCase().includes(q) ||
        qt.clientName.toLowerCase().includes(q) || qt.clientCompany.toLowerCase().includes(q) ||
        qt.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (filterValues.status) result = result.filter((qt) => qt.status === filterValues.status);
    return result;
  }, [items, search, filterValues]);

  const cardPag = usePagination(filtered, { storageKey: "quotations-card", initialPageSize: 10 });

  /* Stats */
  const stats = useMemo(() => ({
    total: items.length,
    totalValue: items.reduce((s, q) => s + q.grandTotal, 0),
    accepted: items.filter((q) => q.status === "accepted").length,
    pending: items.filter((q) => ["draft", "sent", "viewed"].includes(q.status)).length,
    rejected: items.filter((q) => q.status === "rejected").length,
    avgDiscount: items.length > 0 ? Math.round(items.reduce((s, q) => s + (q.subtotal > 0 ? (q.discountTotal / q.subtotal) * 100 : 0), 0) / items.length) : 0,
  }), [items]);

  /* Charts */
  const statusDist = useMemo(() =>
    (Object.keys(QUOTATION_STATUS_CONFIG) as QuotationStatus[]).map((s) => ({
      name: QUOTATION_STATUS_CONFIG[s].label,
      value: items.filter((q) => q.status === s).length,
      fill: s === "accepted" ? "#22c55e" : s === "sent" ? "#3b82f6" : s === "viewed" ? "#8b5cf6" :
        s === "draft" ? "#9ca3af" : s === "rejected" ? "#ef4444" : "#f59e0b",
    })).filter((d) => d.value > 0), [items]);

  const valueByStatus = useMemo(() =>
    (Object.keys(QUOTATION_STATUS_CONFIG) as QuotationStatus[]).map((s) => ({
      name: QUOTATION_STATUS_CONFIG[s].label,
      value: Math.round(items.filter((q) => q.status === s).reduce((sum, q) => sum + q.grandTotal, 0) / 1000),
    })).filter((d) => d.value > 0), [items]);

  const BAR_COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#9ca3af", "#ef4444", "#f59e0b"];

  /* Inline edit */
  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateQuotation(rowId, { [field]: value });
    reload();
    toast.success("Đã cập nhật báo giá");
  }, [reload]);

  /* Delete */
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await apiDeleteQuotations([deleteTarget.id]);
    reload();
    toast.success("Đã xóa báo giá");
    setDeleteTarget(null);
  }, [deleteTarget, reload]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    await apiDeleteQuotations(ids);
    reload();
    toast.success(`Đã xóa ${ids.length} báo giá`);
  }, [reload]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-violet-600" /> Quản lý Báo giá
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">Tạo, theo dõi báo giá, AI upsell gợi ý</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} modes={["card", "table"]} />
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Tạo báo giá</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <FileSpreadsheet className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng báo giá</p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-3">
          <DollarSign className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">${(stats.totalValue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-violet-700">Tổng giá trị</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3">
          <CheckCircle2 className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-green-600">{stats.accepted}</p>
          <p className="text-xs text-gray-500">Chấp nhận</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3">
          <Send className="w-4 h-4 text-blue-500 mb-1" />
          <p className="text-lg text-blue-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Đang chờ</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <Percent className="w-4 h-4 text-amber-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.avgDiscount}%</p>
          <p className="text-xs text-gray-500">CK trung bình</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <button type="button" onClick={() => setShowChart(!showChart)} className="flex items-center justify-between w-full">
          <h3 className="text-sm text-gray-800 flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-violet-500" /> Phân tích Báo giá</h3>
          {showChart ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showChart && (
          <div className="grid lg:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-xs text-gray-500 mb-2">Phân bố trạng thái</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={65}
                    paddingAngle={3} label={({ name, value }) => `${name}: ${value}`}>
                    {statusDist.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Giá trị theo trạng thái ($K)</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={valueByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
                  <Tooltip formatter={(v: number) => [`$${v}K`, "Giá trị"]} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {valueByStatus.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Tìm mã, deal, khách hàng..."
        filters={QUOTATION_FILTERS} filterValues={filterValues} onFilterChange={handleFilterChange}
        onClearAll={clearAll} hasActiveFilters={hasActiveFilters} />

      {mode === "table" ? (
        <DataTable<Quotation> data={filtered} columns={QUOTATION_COLUMNS} storageKey="quotations" selectable
          defaultSortField="createdDate" onInlineEdit={handleInlineEdit} onRowClick={(q) => setSelectedQuote(q)}
          onBulkDelete={handleBulkDelete} emptyMessage="Không tìm thấy báo giá phù hợp"
          renderRowActions={(q) => (
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => setSelectedQuote(q)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget(q)} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cardPag.paginatedItems.map((q) => <QuotationCard key={q.id} quote={q} onView={() => setSelectedQuote(q)} />)}
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><FileSpreadsheet className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">Không tìm thấy báo giá phù hợp</p></div>}
          {filtered.length > 0 && <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"><PaginationBar {...cardPag} onGoToPage={cardPag.goToPage} onNextPage={cardPag.nextPage} onPrevPage={cardPag.prevPage} onSetPageSize={cardPag.setPageSize} /></div>}
        </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-violet-600" /><h4 className="text-sm text-violet-900">AI Quotation Insights</h4></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />Win rate cao hơn 30% khi kèm gói training. Gợi ý upsell cho 2 quotes đang chờ.</p>
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />Có 2 báo giá sắp hết hạn. Gửi reminder cho GlobalSoft WMS và SeoulTech Mobile App.</p>
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />Avg discount 8% — dưới benchmark 12%. Đội sales đang giữ margin tốt.</p>
        </div>
      </div>

      {selectedQuote && <QuotationDetailModal quote={selectedQuote} onClose={() => setSelectedQuote(null)} />}
      <ConfirmDeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        itemName={deleteTarget?.code ?? ""} entityType="báo giá" description="Hành động này không thể hoàn tác." />
      {showCreateModal && <QuotationCreateModal onClose={() => setShowCreateModal(false)} onCreated={reload} />}
    </div>
  );
}