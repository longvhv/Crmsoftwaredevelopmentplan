/**
 * Trang Contract Management — Quản lý hợp đồng khách hàng.
 * Features: DataTable + Card view toggle, FilterBar, Pagination,
 *           Column Visibility, Inline Edit (status), Detail Modal,
 *           Charts, AI renewal prediction, Delete.
 * Phase 3 — Centralized types/constants/data/API
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  FileCheck, Plus, Building2, Calendar, CheckCircle2,
  AlertTriangle, XCircle, DollarSign, TrendingUp, Eye, X,
  Copy, Bot, Sparkles, RefreshCw, History, Trash2, PenLine,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import type { Contract, ContractStatus, ContractType } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  CONTRACT_STATUS_CONFIG, CONTRACT_TYPE_CONFIG, AMENDMENT_TYPE_LABELS,
} from "../../constants/crmConfig";
import { fetchContracts, updateContract, deleteContracts as apiDeleteContracts, createContract } from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Helpers
 * ============================================================ */
function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function renewalColor(prob: number): string {
  if (prob >= 80) return "text-green-600";
  if (prob >= 50) return "text-amber-600";
  return "text-red-600";
}

/* ============================================================
 * Filter config
 * ============================================================ */
const CONTRACT_FILTERS: FilterConfig[] = [
  {
    key: "status", label: "Trạng thái", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(CONTRACT_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
  {
    key: "type", label: "Loại", type: "select",
    options: Object.entries(CONTRACT_TYPE_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const CONTRACT_COLUMNS: ColumnDef<Contract>[] = [
  {
    key: "code", header: "Mã HĐ", sortable: true, minWidth: 120,
    render: (c) => <span className="font-mono text-xs text-gray-700">{c.code}</span>,
  },
  {
    key: "dealName", header: "Dự án", sortable: true, minWidth: 200,
    render: (c) => (
      <div className="min-w-0">
        <p className="text-gray-900 truncate">{c.dealName}</p>
        <p className="text-[10px] text-gray-400 flex items-center gap-1 truncate">
          <Building2 className="w-3 h-3 flex-shrink-0" /> {c.clientCompany}
        </p>
      </div>
    ),
  },
  {
    key: "type", header: "Loại", sortable: true, minWidth: 110,
    render: (c) => {
      const cfg = CONTRACT_TYPE_CONFIG[c.type];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>;
    },
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 110, editable: true,
    render: (c) => {
      const cfg = CONTRACT_STATUS_CONFIG[c.status];
      return <span className={`text-[11px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(CONTRACT_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "totalValue", header: "Giá trị", sortable: true, minWidth: 100,
    render: (c) => <span className="text-gray-900 text-[13px]">${c.totalValue.toLocaleString()}</span>,
    sortValue: (c) => c.totalValue,
  },
  {
    key: "monthlyValue", header: "/tháng", sortable: true, minWidth: 80,
    render: (c) => <span className="text-gray-600 text-[13px]">${(c.monthlyValue / 1000).toFixed(0)}K</span>,
    sortValue: (c) => c.monthlyValue,
  },
  {
    key: "endDate", header: "Hết hạn", sortable: true, minWidth: 100,
    render: (c) => {
      const days = daysUntil(c.endDate);
      return (
        <div className="text-[13px]">
          <p className="text-gray-700">{new Date(c.endDate).toLocaleDateString("vi-VN")}</p>
          <p className={`text-[10px] ${days <= 0 ? "text-red-500" : days <= 60 ? "text-amber-500" : "text-gray-400"}`}>
            {days > 0 ? `Còn ${days} ngày` : "Đã hết hạn"}
          </p>
        </div>
      );
    },
    sortValue: (c) => new Date(c.endDate).getTime(),
  },
  {
    key: "aiRenewalProbability", header: "AI Renewal", sortable: true, minWidth: 90,
    render: (c) => (
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[30px]">
          <div className={`h-full rounded-full ${c.aiRenewalProbability >= 80 ? "bg-green-500" : c.aiRenewalProbability >= 50 ? "bg-amber-500" : "bg-red-400"}`}
            style={{ width: `${c.aiRenewalProbability}%` }} />
        </div>
        <span className={`text-[11px] w-7 text-right ${renewalColor(c.aiRenewalProbability)}`}>{c.aiRenewalProbability}%</span>
      </div>
    ),
    sortValue: (c) => c.aiRenewalProbability,
  },
  {
    key: "owner", header: "Phụ trách", sortable: true, minWidth: 120, defaultHidden: true,
    render: (c) => <span className="text-gray-600 text-[13px]">{c.owner}</span>,
  },
  {
    key: "amendments", header: "Phụ lục", minWidth: 70, defaultHidden: true,
    render: (c) => <span className="text-gray-500 text-[13px]">{c.amendments.length}</span>,
  },
];

/* ============================================================
 * Contract Card
 * ============================================================ */
function ContractCard({ contract, onView }: { contract: Contract; onView: () => void }) {
  const sCfg = CONTRACT_STATUS_CONFIG[contract.status];
  const tCfg = CONTRACT_TYPE_CONFIG[contract.type];
  const days = daysUntil(contract.endDate);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onView}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">{contract.code}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${sCfg.bgColor} ${sCfg.color}`}>
            {sCfg.label}
          </span>
        </div>
        <Eye className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors" />
      </div>
      <h4 className="text-sm text-gray-900 truncate mb-0.5">{contract.dealName}</h4>
      <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
        <Building2 className="w-3 h-3" /> {contract.clientCompany}
      </p>
      <div className="flex items-center gap-1 mb-3 flex-wrap">
        <span className={`text-[9px] px-1.5 py-0.5 rounded ${tCfg.color}`}>{tCfg.label}</span>
        {contract.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100">{tag}</span>
        ))}
      </div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-gray-900">${contract.totalValue.toLocaleString()}</p>
          <p className="text-[9px] text-gray-400">${contract.monthlyValue.toLocaleString()}/tháng</p>
        </div>
        <div className="text-right">
          <p className={`text-sm ${renewalColor(contract.aiRenewalProbability)}`}>{contract.aiRenewalProbability}%</p>
          <p className="text-[9px] text-gray-400">Gia hạn AI</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[10px] text-gray-400">
        <span className="flex items-center gap-0.5">
          <Calendar className="w-3 h-3" />
          {new Date(contract.startDate).toLocaleDateString("vi-VN", { month: "short", year: "2-digit" })} → {new Date(contract.endDate).toLocaleDateString("vi-VN", { month: "short", year: "2-digit" })}
        </span>
        {days > 0
          ? <span className={days <= 60 ? "text-amber-600" : ""}>Còn {days} ngày</span>
          : <span className="text-red-500">Đã hết hạn</span>
        }
      </div>
      {contract.amendments.length > 0 && (
        <div className="mt-2 flex items-center gap-1 text-[9px] text-gray-400">
          <History className="w-3 h-3" /> {contract.amendments.length} phụ lục/sửa đổi
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Contract Detail Modal
 * ============================================================ */
function ContractDetailModal({ contract, onClose }: { contract: Contract; onClose: () => void }) {
  const sCfg = CONTRACT_STATUS_CONFIG[contract.status];
  const tCfg = CONTRACT_TYPE_CONFIG[contract.type];
  const days = daysUntil(contract.endDate);
  const totalDays = Math.ceil((new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const progressPct = Math.min(100, Math.max(0, ((totalDays - days) / totalDays) * 100));
  const renewBg = contract.aiRenewalProbability >= 80 ? "bg-green-50 border-green-100"
    : contract.aiRenewalProbability >= 50 ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <FileCheck className="w-5 h-5 text-violet-600" />
              <h3 className="text-gray-900">{contract.code}</h3>
              <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${sCfg.bgColor} ${sCfg.color}`}>{sCfg.label}</span>
            </div>
            <p className="text-xs text-gray-500">{contract.dealName} · {contract.clientCompany}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 mb-1">Khách hàng</p>
              <p className="text-sm text-gray-900">{contract.clientName}</p>
              <p className="text-xs text-gray-500">{contract.clientCompany}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 mb-1">Phụ trách</p>
              <p className="text-sm text-gray-900">{contract.owner}</p>
              <p className={`text-[9px] rounded px-1.5 py-0.5 inline-block mt-0.5 ${tCfg.color}`}>{tCfg.label}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">${(contract.totalValue / 1000).toFixed(0)}K</p>
              <p className="text-[9px] text-gray-400">Tổng giá trị</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">${(contract.monthlyValue / 1000).toFixed(0)}K</p>
              <p className="text-[9px] text-gray-400">/tháng</p>
            </div>
            <div className={`rounded-lg p-2 text-center ${days <= 60 && days > 0 ? "bg-amber-50" : days <= 0 ? "bg-red-50" : "bg-gray-50"}`}>
              <p className={`text-sm ${days <= 0 ? "text-red-600" : days <= 60 ? "text-amber-600" : "text-gray-900"}`}>
                {days > 0 ? days : "Hết"}
              </p>
              <p className="text-[9px] text-gray-400">Ngày còn lại</p>
            </div>
            <div className={`rounded-lg p-2 text-center ${renewBg}`}>
              <p className={`text-sm ${renewalColor(contract.aiRenewalProbability)}`}>{contract.aiRenewalProbability}%</p>
              <p className="text-[9px] opacity-75">AI Renewal</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="text-gray-400 text-[10px]">Bắt đầu</p>
                <p className="text-gray-900">{new Date(contract.startDate).toLocaleDateString("vi-VN")}</p>
              </div>
              <div className="flex-1 mx-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[10px]">Kết thúc</p>
                <p className="text-gray-900">{new Date(contract.endDate).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[10px]">
              {contract.autoRenew && (
                <span className="flex items-center gap-0.5 text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  <RefreshCw className="w-3 h-3" /> Tự động gia hạn
                </span>
              )}
              <span className="text-gray-400">{contract.paymentTerms}</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <History className="w-3.5 h-3.5" /> Lịch sử sửa đổi ({contract.amendments.length})
            </h4>
            {contract.amendments.length === 0
              ? <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 text-center">Chưa có sửa đổi</p>
              : (
                <div className="space-y-2">
                  {contract.amendments.map((am) => (
                    <div key={am.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 text-xs">
                          <span className="text-gray-900">{AMENDMENT_TYPE_LABELS[am.type]}</span>
                          <span className="text-gray-400">{new Date(am.date).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <p className="text-[11px] text-gray-600">{am.description}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5">Phê duyệt: {am.approvedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
          <div className="flex flex-wrap gap-1">
            {contract.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
            ))}
          </div>
          <div className={`rounded-lg border p-3 ${renewBg}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Bot className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-xs text-gray-900">AI Dự đoán gia hạn: <span className={renewalColor(contract.aiRenewalProbability)}>{contract.aiRenewalProbability}%</span></span>
            </div>
            <p className="text-xs text-gray-600">{contract.aiRenewalNote}</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={() => toast.success("Đã sao chép thông tin hợp đồng")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            <Copy className="w-3.5 h-3.5" /> Sao chép
          </button>
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Contract Modal
 * ============================================================ */
function ContractCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [dealName, setDealName] = useState("");
  const [type, setType] = useState<ContractType>("outsource");
  const [status, setStatus] = useState<ContractStatus>("pending");
  const [totalValue, setTotalValue] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("2027-03-01");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!clientCompany.trim()) { toast.error("Vui lòng nhập tên công ty"); return; }
    if (!dealName.trim()) { toast.error("Vui lòng nhập tên dự án"); return; }
    setSaving(true);
    const code = `HĐ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    await createContract({
      code, clientName: clientName || clientCompany, clientCompany, dealName, type, status,
      startDate, endDate, totalValue, monthlyValue: Math.round(totalValue / 12),
      currency: "USD", autoRenew: false, paymentTerms: "Net 30",
      amendments: [], owner: "Chưa gán",
      aiRenewalProbability: 60, aiRenewalNote: "Hợp đồng mới — chưa có dữ liệu AI.", tags: [],
    });
    toast.success(`Đã tạo hợp đồng "${code}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Hợp đồng mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
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
              <label className="text-xs text-gray-500 mb-1 block">Loại hợp đồng</label>
              <select value={type} onChange={(e) => setType(e.target.value as ContractType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(CONTRACT_TYPE_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as ContractStatus)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(CONTRACT_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Giá trị ($)</label>
              <input type="number" value={totalValue} onChange={(e) => setTotalValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Bắt đầu</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kết thúc</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo hợp đồng"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function ContractManagementPage() {
  const { mode, setMode } = useViewMode("contracts", "card");
  const [items, setItems] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contract | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const reload = useCallback(() => { fetchContracts().then(setItems); }, []);
  useEffect(() => { reload(); }, [reload]);

  /* Filter */
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
      result = result.filter((c) =>
        c.code.toLowerCase().includes(q) || c.dealName.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) || c.clientCompany.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (filterValues.status) result = result.filter((c) => c.status === filterValues.status);
    if (filterValues.type) result = result.filter((c) => c.type === filterValues.type);
    return result;
  }, [items, search, filterValues]);

  const cardPag = usePagination(filtered, { storageKey: "contracts-card", initialPageSize: 10 });

  /* Stats */
  const stats = useMemo(() => {
    const active = items.filter((c) => ["active", "expiring-soon"].includes(c.status));
    return {
      total: items.length,
      totalValue: items.reduce((s, c) => s + c.totalValue, 0),
      activeARR: active.reduce((s, c) => s + c.monthlyValue * 12, 0),
      expiringSoon: items.filter((c) => c.status === "expiring-soon").length,
      avgRenewalProb: items.length > 0 ? Math.round(items.reduce((s, c) => s + c.aiRenewalProbability, 0) / items.length) : 0,
    };
  }, [items]);

  /* Charts */
  const valueByType = useMemo(() =>
    (Object.keys(CONTRACT_TYPE_CONFIG) as ContractType[]).map((t) => ({
      name: CONTRACT_TYPE_CONFIG[t].label,
      value: items.filter((c) => c.type === t).reduce((s, c) => s + c.totalValue, 0) / 1000,
    })).filter((d) => d.value > 0), [items]);

  const statusDist = useMemo(() =>
    (Object.keys(CONTRACT_STATUS_CONFIG) as ContractStatus[]).map((s) => ({
      name: CONTRACT_STATUS_CONFIG[s].label,
      value: items.filter((c) => c.status === s).length,
      fill: s === "active" ? "#22c55e" : s === "expiring-soon" ? "#f59e0b" : s === "renewed" ? "#8b5cf6" : s === "expired" ? "#ef4444" : s === "pending" ? "#3b82f6" : "#9ca3af",
    })).filter((d) => d.value > 0), [items]);

  const BAR_COLORS = ["#6366f1", "#22c55e", "#8b5cf6", "#3b82f6", "#f59e0b"];

  /* Inline edit */
  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateContract(rowId, { [field]: value });
    reload();
    toast.success("Đã cập nhật hợp đồng");
  }, [reload]);

  /* Delete */
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await apiDeleteContracts([deleteTarget.id]);
    reload();
    toast.success(`Đã xóa "${deleteTarget.code}"`);
    setDeleteTarget(null);
  }, [deleteTarget, reload]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    await apiDeleteContracts(ids);
    reload();
    toast.success(`Đã xóa ${ids.length} hợp đồng`);
  }, [reload]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-violet-600" /> Quản lý Hợp đồng
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">Vòng đời hợp đồng — Gia hạn, sửa đổi, AI renewal prediction</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} modes={["card", "table"]} />
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Tạo HĐ</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <FileCheck className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng hợp đồng</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <DollarSign className="w-4 h-4 text-blue-500 mb-1" />
          <p className="text-lg text-gray-900">${(stats.totalValue / 1_000_000).toFixed(2)}M</p>
          <p className="text-xs text-gray-500">Tổng giá trị</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <TrendingUp className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-green-600">${(stats.activeARR / 1_000_000).toFixed(2)}M</p>
          <p className="text-xs text-gray-500">ARR (Active)</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.expiringSoon > 0 ? "bg-amber-50 border-amber-100" : "bg-white border-gray-100"}`}>
          <AlertTriangle className="w-4 h-4 text-amber-500 mb-1" />
          <p className={`text-lg ${stats.expiringSoon > 0 ? "text-amber-600" : "text-gray-900"}`}>{stats.expiringSoon}</p>
          <p className="text-xs text-gray-500">Sắp hết hạn</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <Bot className="w-4 h-4 text-violet-500 mb-1" />
          <p className={`text-lg ${stats.avgRenewalProb >= 70 ? "text-green-600" : "text-amber-600"}`}>{stats.avgRenewalProb}%</p>
          <p className="text-xs text-gray-500">TB Renewal AI</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-violet-500" /> Giá trị theo loại ($K)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={valueByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(0)}K`, "Giá trị"]} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>{valueByType.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-violet-500" /> Phân bố trạng thái
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}
                label={({ name, value }) => `${name}: ${value}`}>
                {statusDist.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Tìm mã HĐ, dự án, công ty..."
        filters={CONTRACT_FILTERS} filterValues={filterValues} onFilterChange={handleFilterChange}
        onClearAll={clearAll} hasActiveFilters={hasActiveFilters} />

      {mode === "table" ? (
        <DataTable<Contract> data={filtered} columns={CONTRACT_COLUMNS} storageKey="contracts" selectable
          defaultSortField="totalValue" onInlineEdit={handleInlineEdit} onRowClick={(c) => setSelectedContract(c)}
          onBulkDelete={handleBulkDelete} emptyMessage="Không tìm thấy hợp đồng phù hợp"
          renderRowActions={(c) => (
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => setSelectedContract(c)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget(c)} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cardPag.paginatedItems.map((c) => <ContractCard key={c.id} contract={c} onView={() => setSelectedContract(c)} />)}
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><FileCheck className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">Không tìm thấy hợp đồng phù hợp</p></div>}
          {filtered.length > 0 && <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"><PaginationBar {...cardPag} onGoToPage={cardPag.goToPage} onNextPage={cardPag.nextPage} onPrevPage={cardPag.prevPage} onSetPageSize={cardPag.setPageSize} /></div>}
        </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-violet-600" /><h4 className="text-sm text-violet-900">AI Contract Insights</h4></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />2 hợp đồng sắp hết hạn cần chú ý. Tỷ lệ gia hạn trung bình 77%.</p>
          <p className="flex items-start gap-2"><TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />Hợp đồng outsource chiếm 64% tổng giá trị, đang tăng trưởng 23% YoY.</p>
          <p className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />DigitalWave EU cần escalation — SLA breach nghiêm trọng, renewal risk cao.</p>
        </div>
      </div>

      {selectedContract && <ContractDetailModal contract={selectedContract} onClose={() => setSelectedContract(null)} />}
      <ConfirmDeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        itemName={deleteTarget?.code ?? ""} entityType="hợp đồng" description="Hành động này không thể hoàn tác." />
      {showCreateModal && <ContractCreateModal onClose={() => setShowCreateModal(false)} onCreated={reload} />}
    </div>
  );
}
