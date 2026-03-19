/**
 * Trang Vendor Management — Quản lý nhà cung cấp / đối tác outsource.
 * Features: DataTable + Card view toggle, FilterBar, Pagination,
 *           Column Visibility, Inline Edit (status), Detail Modal,
 *           Charts (Radar, Bar, Line), AI recommendations, Delete.
 * Phase 3 — Centralized types/constants/data/API
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Building2, Star, DollarSign, Users, TrendingUp, TrendingDown,
  Eye, X, Bot, Sparkles, CheckCircle2, Globe, BarChart3,
  ArrowUpRight, ArrowDownRight, Phone, Mail, FileCheck, Trash2,
  Plus, Minus,
} from "lucide-react";
import { toast } from "sonner";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Cell, LineChart, Line,
} from "recharts";
import type { Vendor, VendorStatus, VendorCategory } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  VENDOR_STATUS_CONFIG, VENDOR_TIER_CONFIG, VENDOR_CATEGORY_CONFIG,
} from "../../constants/crmConfig";
import { fetchVendors, updateVendor, deleteVendors as apiDeleteVendors, createVendor } from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Filter config
 * ============================================================ */
const VENDOR_FILTERS: FilterConfig[] = [
  {
    key: "status", label: "Trạng thái", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(VENDOR_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
  {
    key: "category", label: "Danh mục", type: "select",
    options: Object.entries(VENDOR_CATEGORY_CONFIG).map(([v, c]) => ({ value: v, label: `${c.icon} ${c.label}` })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
function scoreColor(score: number): string {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-amber-600";
  return "text-red-600";
}

const VENDOR_COLUMNS: ColumnDef<Vendor>[] = [
  {
    key: "name", header: "Vendor", sortable: true, minWidth: 200,
    render: (v) => (
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] text-white flex-shrink-0">{v.logo}</div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-gray-900 truncate">{v.name}</p>
            {v.trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
            {v.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
          </div>
          <p className="text-[10px] text-gray-400 flex items-center gap-0.5"><Globe className="w-2.5 h-2.5" /> {v.country}</p>
        </div>
      </div>
    ),
  },
  {
    key: "category", header: "Danh mục", sortable: true, minWidth: 110,
    render: (v) => {
      const cfg = VENDOR_CATEGORY_CONFIG[v.category];
      return <span className="text-[11px] text-gray-600">{cfg.icon} {cfg.label}</span>;
    },
  },
  {
    key: "tier", header: "Tier", sortable: true, minWidth: 90,
    render: (v) => {
      const cfg = VENDOR_TIER_CONFIG[v.tier];
      return (
        <span className={`text-[11px] px-2 py-0.5 rounded border ${cfg.color}`}>
          {"★".repeat(cfg.stars)} {cfg.label}
        </span>
      );
    },
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 100, editable: true,
    render: (v) => {
      const cfg = VENDOR_STATUS_CONFIG[v.status];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(VENDOR_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "overallScore", header: "Điểm", sortable: true, minWidth: 60,
    render: (v) => <span className={`text-[13px] ${scoreColor(v.overallScore)}`}>{v.overallScore}</span>,
    sortValue: (v) => v.overallScore,
  },
  {
    key: "totalSpend", header: "Tổng chi", sortable: true, minWidth: 90,
    render: (v) => <span className="text-gray-900 text-[13px]">${(v.totalSpend / 1000).toFixed(0)}K</span>,
    sortValue: (v) => v.totalSpend,
  },
  {
    key: "teamSize", header: "Team", sortable: true, minWidth: 60,
    render: (v) => <span className="text-gray-600 text-[13px]">{v.teamSize}</span>,
    sortValue: (v) => v.teamSize,
  },
  {
    key: "hourlyRate", header: "$/giờ", minWidth: 80,
    render: (v) => <span className="text-gray-600 text-[13px]">${v.hourlyRate.min}-{v.hourlyRate.max}</span>,
    sortValue: (v) => v.hourlyRate.min,
    sortable: true,
  },
  {
    key: "activeProjects", header: "Dự án", sortable: true, minWidth: 60,
    render: (v) => <span className="text-gray-700 text-[13px]">{v.activeProjects}/{v.completedProjects}</span>,
    sortValue: (v) => v.activeProjects,
  },
  {
    key: "contactPerson", header: "Liên hệ", minWidth: 120, defaultHidden: true,
    render: (v) => <span className="text-gray-600 text-[13px]">{v.contactPerson}</span>,
  },
];

/* ============================================================
 * Chart data helpers
 * ============================================================ */
const SPEND_COLORS = ["#6366f1", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
const SCORE_TREND = [
  { month: "T10", avg: 80 }, { month: "T11", avg: 81 }, { month: "T12", avg: 79 },
  { month: "T1", avg: 82 }, { month: "T2", avg: 83 }, { month: "T3", avg: 84 },
];

/* ============================================================
 * Vendor Detail Modal
 * ============================================================ */
function VendorDetailModal({ vendor, onClose }: { vendor: Vendor; onClose: () => void }) {
  const sCfg = VENDOR_STATUS_CONFIG[vendor.status];
  const tCfg = VENDOR_TIER_CONFIG[vendor.tier];
  const radarData = [
    { metric: "Chất lượng", score: vendor.qualityScore },
    { metric: "Giao hàng", score: vendor.deliveryScore },
    { metric: "Giao tiếp", score: vendor.communicationScore },
    { metric: "Chi phí", score: vendor.costScore },
    { metric: "Đổi mới", score: vendor.innovationScore },
    { metric: "Bảo mật", score: vendor.securityScore },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm text-white">{vendor.logo}</div>
            <div>
              <h3 className="text-gray-900 flex items-center gap-2">
                {vendor.name}
                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tCfg.color}`}>{tCfg.label}</span>
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Globe className="w-3 h-3" /> {vendor.country}
                <span className={`ml-1 text-[9px] px-1.5 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <p className="text-sm text-gray-600">{vendor.description}</p>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <p className="text-xs text-gray-700 flex items-center gap-1.5"><Users className="w-3 h-3 text-gray-400" /> {vendor.contactPerson}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1.5"><Mail className="w-3 h-3 text-gray-400" /> {vendor.contactEmail}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1.5"><Phone className="w-3 h-3 text-gray-400" /> {vendor.contactPhone}</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className={`rounded-lg p-2 text-center ${vendor.overallScore >= 85 ? "bg-green-50" : vendor.overallScore >= 70 ? "bg-amber-50" : "bg-red-50"}`}>
              <p className={`text-lg ${scoreColor(vendor.overallScore)}`}>{vendor.overallScore}</p>
              <p className="text-[8px] text-gray-400">Overall</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{vendor.teamSize}</p>
              <p className="text-[8px] text-gray-400">Team Size</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">${vendor.hourlyRate.min}-{vendor.hourlyRate.max}</p>
              <p className="text-[8px] text-gray-400">$/giờ</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">${(vendor.totalSpend / 1000).toFixed(0)}K</p>
              <p className="text-[8px] text-gray-400">Tổng chi</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: "#9ca3af" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
              <Radar name={vendor.name} dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg border border-blue-100 p-2.5 text-center">
              <p className="text-lg text-blue-600">{vendor.activeProjects}</p>
              <p className="text-[9px] text-gray-500">Dự án đang chạy</p>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-100 p-2.5 text-center">
              <p className="text-lg text-green-600">{vendor.completedProjects}</p>
              <p className="text-[9px] text-gray-500">Đã hoàn thành</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1"><FileCheck className="w-3.5 h-3.5" /> Hợp đồng ({vendor.contracts.length})</h4>
            <div className="space-y-1.5">
              {vendor.contracts.map((c) => {
                const cColor = c.status === "active" ? "bg-green-50 border-green-100" : c.status === "expiring" ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100";
                return (
                  <div key={c.id} className={`rounded-lg border p-2.5 ${cColor}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-900">${(c.value / 1000).toFixed(0)}K</p>
                    </div>
                    <p className="text-[9px] text-gray-400">{new Date(c.startDate).toLocaleDateString("vi-VN")} — {new Date(c.endDate).toLocaleDateString("vi-VN")}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {vendor.tags.map((tag) => <span key={tag} className="text-[9px] px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full">{tag}</span>)}
          </div>
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span><span className="text-violet-900">AI Recommendation:</span> {vendor.aiNote}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Vendor Card (dùng trong Card view)
 * ============================================================ */
function VendorCard({ vendor, onView }: { vendor: Vendor; onView: () => void }) {
  const sCfg = VENDOR_STATUS_CONFIG[vendor.status];
  const tCfg = VENDOR_TIER_CONFIG[vendor.tier];
  const catCfg = VENDOR_CATEGORY_CONFIG[vendor.category];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onView}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm text-white flex-shrink-0">{vendor.logo}</div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm text-gray-900">{vendor.name}</h4>
              {vendor.trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
              {vendor.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
            </div>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" /> {vendor.country} · {catCfg.icon} {catCfg.label}
            </p>
          </div>
        </div>
        <Eye className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors" />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tCfg.color}`}>{"★".repeat(tCfg.stars)} {tCfg.label}</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div>
          <p className={`text-sm ${scoreColor(vendor.overallScore)}`}>{vendor.overallScore}</p>
          <p className="text-[9px] text-gray-400">Điểm</p>
        </div>
        <div>
          <p className="text-sm text-gray-900">${(vendor.totalSpend / 1000).toFixed(0)}K</p>
          <p className="text-[9px] text-gray-400">Tổng chi</p>
        </div>
        <div>
          <p className="text-sm text-gray-900">{vendor.activeProjects}/{vendor.completedProjects}</p>
          <p className="text-[9px] text-gray-400">DA active/done</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {vendor.tags.slice(0, 3).map((t) => <span key={t} className="text-[9px] px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-100">{t}</span>)}
      </div>
    </div>
  );
}

/* ============================================================
 * Create Vendor Modal
 * ============================================================ */
function VendorCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<VendorCategory>("development");
  const [status, setStatus] = useState<VendorStatus>("evaluating");
  const [country, setCountry] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");
  const [teamSize, setTeamSize] = useState(5);
  const [hourlyMin, setHourlyMin] = useState(25);
  const [hourlyMax, setHourlyMax] = useState(60);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên vendor"); return; }
    if (!country.trim()) { toast.error("Vui lòng nhập quốc gia"); return; }
    setSaving(true);
    await createVendor({
      name, logo: name.slice(0, 2).toUpperCase(), category, status, tier: "trial",
      country, contactPerson: contactPerson || name, contactEmail, contactPhone,
      description: description || `Vendor mới — ${name}`,
      teamSize, hourlyRate: { min: hourlyMin, max: hourlyMax },
      overallScore: 70, qualityScore: 70, deliveryScore: 70, communicationScore: 70,
      costScore: 70, innovationScore: 70, securityScore: 70,
      totalSpend: 0, activeProjects: 0, completedProjects: 0,
      contracts: [], trend: "stable",
      aiNote: "Vendor mới — chưa có đủ dữ liệu AI đánh giá.", tags: [],
    });
    toast.success(`Đã thêm vendor "${name}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Thêm Nhà cung cấp mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên vendor *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: CloudStack Asia"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Danh mục</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(VENDOR_CATEGORY_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as VendorStatus)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(VENDOR_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Quốc gia *</label>
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="VD: Việt Nam"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Người liên hệ</label>
              <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Tên liên hệ"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="email@vendor.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Điện thoại</label>
              <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+84..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Quy mô team</label>
              <input type="number" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} min={1}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">$/giờ (min)</label>
              <input type="number" value={hourlyMin} onChange={(e) => setHourlyMin(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">$/giờ (max)</label>
              <input type="number" value={hourlyMax} onChange={(e) => setHourlyMax(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả ngắn về vendor..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Thêm vendor"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function VendorManagementPage() {
  const { mode, setMode } = useViewMode("vendors", "card");
  const [items, setItems] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const reload = useCallback(() => { fetchVendors().then(setItems); }, []);
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
      result = result.filter((v) => v.name.toLowerCase().includes(q) || v.country.toLowerCase().includes(q) || v.contactPerson.toLowerCase().includes(q) || v.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (filterValues.status) result = result.filter((v) => v.status === filterValues.status);
    if (filterValues.category) result = result.filter((v) => v.category === filterValues.category);
    return result.sort((a, b) => b.overallScore - a.overallScore);
  }, [items, search, filterValues]);

  const cardPag = usePagination(filtered, { storageKey: "vendors-card", initialPageSize: 10 });

  /* Stats */
  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((v) => v.status === "active").length,
    totalSpend: items.reduce((s, v) => s + v.totalSpend, 0),
    avgScore: items.length > 0 ? Math.round(items.reduce((s, v) => s + v.overallScore, 0) / items.length) : 0,
    activeContracts: items.reduce((s, v) => s + v.contracts.filter((c) => c.status === "active").length, 0),
  }), [items]);

  /* Chart */
  const spendByCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    items.forEach((v) => {
      const label = VENDOR_CATEGORY_CONFIG[v.category]?.label ?? v.category;
      cats[label] = (cats[label] ?? 0) + v.totalSpend;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value: value / 1000 })).sort((a, b) => b.value - a.value);
  }, [items]);

  /* Inline edit */
  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateVendor(rowId, { [field]: value });
    reload();
    toast.success("Đã cập nhật vendor");
  }, [reload]);

  /* Delete */
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await apiDeleteVendors([deleteTarget.id]);
    reload();
    toast.success(`Đã xóa "${deleteTarget.name}"`);
    setDeleteTarget(null);
  }, [deleteTarget, reload]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    await apiDeleteVendors(ids);
    reload();
    toast.success(`Đã xóa ${ids.length} vendor`);
  }, [reload]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-violet-600" /> Quản lý Nhà cung cấp
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">Vendor profiles, performance scoring, AI recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} modes={["card", "table"]} />
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Thêm</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-3">
          <Building2 className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-violet-700">Tổng vendors ({stats.active} active)</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <DollarSign className="w-4 h-4 text-blue-500 mb-1" />
          <p className="text-lg text-gray-900">${(stats.totalSpend / 1_000_000).toFixed(2)}M</p>
          <p className="text-xs text-gray-500">Tổng chi tiêu</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.avgScore >= 80 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <Star className="w-4 h-4 text-amber-500 mb-1" />
          <p className={`text-lg ${scoreColor(stats.avgScore)}`}>{stats.avgScore}/100</p>
          <p className="text-xs text-gray-600">Điểm TB</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <FileCheck className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.activeContracts}</p>
          <p className="text-xs text-gray-500">Hợp đồng active</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-violet-500" /> Chi tiêu theo Danh mục ($K)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={spendByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(0)}K`, "Chi tiêu"]} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>{spendByCategory.map((_, i) => <Cell key={i} fill={SPEND_COLORS[i % SPEND_COLORS.length]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-green-500" /> Điểm chất lượng TB theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={SCORE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[70, 90]} />
              <Tooltip formatter={(v: number) => [`${v}/100`, "Điểm TB"]} />
              <Line type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Tìm vendor, quốc gia, liên hệ..."
        filters={VENDOR_FILTERS} filterValues={filterValues} onFilterChange={handleFilterChange}
        onClearAll={clearAll} hasActiveFilters={hasActiveFilters} />

      {mode === "table" ? (
        <DataTable<Vendor> data={filtered} columns={VENDOR_COLUMNS} storageKey="vendors" selectable
          defaultSortField="overallScore" onInlineEdit={handleInlineEdit} onRowClick={(v) => setSelectedVendor(v)}
          onBulkDelete={handleBulkDelete} emptyMessage="Không tìm thấy vendor phù hợp"
          renderRowActions={(v) => (
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => setSelectedVendor(v)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget(v)} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cardPag.paginatedItems.map((v) => <VendorCard key={v.id} vendor={v} onView={() => setSelectedVendor(v)} />)}
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">Không tìm thấy vendor phù hợp</p></div>}
          {filtered.length > 0 && <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"><PaginationBar {...cardPag} onGoToPage={cardPag.goToPage} onNextPage={cardPag.nextPage} onPrevPage={cardPag.prevPage} onSetPageSize={cardPag.setPageSize} /></div>}
        </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-violet-600" /><h4 className="text-sm text-violet-900">AI Vendor Insights</h4></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />NeuralWave AI và CloudStack Asia là 2 vendor chiến lược quan trọng nhất.</p>
          <p className="flex items-start gap-2"><TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />DevTeam Philippines và TechBridge India cần review — quality score giảm.</p>
          <p className="flex items-start gap-2"><DollarSign className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />Tiết kiệm ~$120K/năm nếu gia hạn dài hạn 3 năm với CloudStack Asia.</p>
        </div>
      </div>

      {selectedVendor && <VendorDetailModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />}
      <ConfirmDeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        itemName={deleteTarget?.name ?? ""} entityType="nhà cung cấp" description="Hành động này không thể hoàn tác." />
      {showCreateModal && <VendorCreateModal onClose={() => setShowCreateModal(false)} onCreated={reload} />}
    </div>
  );
}