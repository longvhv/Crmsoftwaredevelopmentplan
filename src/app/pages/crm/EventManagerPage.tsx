/**
 * Event & Webinar Manager — Quản lý Sự kiện & Webinar
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Detail Modal, AI Insights, Delete đơn lẻ + bulk.
 * Phase 6 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Calendar, Sparkles, Bot, Users, TrendingUp,
  AlertTriangle, Trash2, Eye, X, Plus, Video,
  MapPin, Target,
} from "lucide-react";
import { toast } from "sonner";
import type { CrmEvent, CrmEventType, CrmEventStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { CRM_EVENT_TYPE_CONFIG, CRM_EVENT_STATUS_CONFIG, formatVND } from "../../constants/crmConfig";
import { fetchCrmEvents, deleteCrmEvents, createCrmEvent, updateCrmEvent } from "../../api/crmApi";
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
const EV_FILTERS: FilterConfig[] = [
  {
    key: "status", label: "Trạng thái", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(CRM_EVENT_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
  {
    key: "type", label: "Loại sự kiện", type: "select",
    options: Object.entries(CRM_EVENT_TYPE_CONFIG).map(([v, c]) => ({ value: v, label: `${c.icon} ${c.label}` })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const EV_COLUMNS: ColumnDef<CrmEvent>[] = [
  {
    key: "name", header: "Sự kiện", sortable: true, minWidth: 260,
    render: (r) => {
      const tCfg = CRM_EVENT_TYPE_CONFIG[r.type];
      return (
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
            r.type === "webinar" ? "bg-blue-100" :
            r.type === "workshop" ? "bg-violet-100" :
            r.type === "conference" ? "bg-amber-100" :
            r.type === "meetup" ? "bg-green-100" : "bg-red-100"
          }`}>
            {tCfg.icon}
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 truncate">{r.name}</p>
            <div className="flex items-center gap-1">
              <span className={`text-[8px] px-1.5 py-0.5 rounded border ${tCfg.bgColor} ${tCfg.color}`}>{tCfg.label}</span>
              {r.isVirtual && <span className="text-[8px] px-1 py-0.5 bg-cyan-50 text-cyan-600 rounded">🌐</span>}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 100, editable: true,
    render: (r) => {
      const cfg = CRM_EVENT_STATUS_CONFIG[r.status];
      return <span className={`text-[9px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }}
        onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(CRM_EVENT_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "date", header: "Ngày", sortable: true, minWidth: 110,
    render: (r) => <span className="text-gray-600 text-xs">{r.date} {r.time}</span>,
  },
  {
    key: "registered", header: "Đăng ký", sortable: true, minWidth: 90,
    render: (r) => <span className="text-gray-900">{r.registered}/{r.capacity}</span>,
    sortValue: (r) => r.registered,
  },
  {
    key: "attended", header: "Tham dự", sortable: true, minWidth: 80,
    render: (r) => r.attended > 0
      ? <span className="text-blue-600">{r.attended}</span>
      : <span className="text-gray-300">—</span>,
    sortValue: (r) => r.attended,
  },
  {
    key: "leadsGenerated", header: "Leads", sortable: true, minWidth: 70,
    render: (r) => r.leadsGenerated > 0
      ? <span className="text-green-600">{r.leadsGenerated}</span>
      : <span className="text-gray-300">—</span>,
    sortValue: (r) => r.leadsGenerated,
  },
  {
    key: "pipelineInfluenced", header: "Pipeline", sortable: true, minWidth: 110, defaultHidden: true,
    render: (r) => r.pipelineInfluenced > 0
      ? <span className="text-emerald-600">{formatVND(r.pipelineInfluenced)}₫</span>
      : <span className="text-gray-300">—</span>,
    sortValue: (r) => r.pipelineInfluenced,
  },
  {
    key: "roi", header: "ROI", sortable: true, minWidth: 70,
    render: (r) => r.roi > 0
      ? <span className="text-violet-600">{r.roi}%</span>
      : <span className="text-gray-300">—</span>,
    sortValue: (r) => r.roi,
  },
  {
    key: "engagementScore", header: "Engagement", sortable: true, minWidth: 90, defaultHidden: true,
    render: (r) => r.engagementScore > 0
      ? <span className={r.engagementScore >= 70 ? "text-green-600" : "text-amber-600"}>{r.engagementScore}/100</span>
      : <span className="text-gray-300">—</span>,
    sortValue: (r) => r.engagementScore,
  },
];

/* ============================================================
 * Card View
 * ============================================================ */
function EventCard({ event: e, onView, onDelete }: {
  event: CrmEvent; onView: () => void; onDelete: () => void;
}) {
  const typeCfg = CRM_EVENT_TYPE_CONFIG[e.type];
  const statusCfg = CRM_EVENT_STATUS_CONFIG[e.status];
  const attendanceRate = e.registered > 0 && e.attended > 0 ? Math.round((e.attended / e.registered) * 100) : null;

  return (
    <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow group ${
      e.status === "live" ? "border-green-300 border-l-4" :
      e.status === "upcoming" ? "border-blue-200" : "border-gray-100"
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onView}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
            e.type === "webinar" ? "bg-blue-100" :
            e.type === "workshop" ? "bg-violet-100" :
            e.type === "conference" ? "bg-amber-100" :
            e.type === "meetup" ? "bg-green-100" : "bg-red-100"
          }`}>
            {typeCfg.icon}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm text-gray-900 truncate">{e.name}</h4>
            <div className="flex items-center gap-1 flex-wrap">
              <span className={`text-[8px] px-1.5 py-0.5 rounded border ${typeCfg.bgColor} ${typeCfg.color}`}>{typeCfg.label}</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded border ${statusCfg.bgColor} ${statusCfg.color}`}>{statusCfg.label}</span>
              {e.isVirtual && <span className="text-[8px] px-1 py-0.5 bg-cyan-50 text-cyan-600 rounded border border-cyan-200">🌐 Virtual</span>}
            </div>
          </div>
        </div>
        <button type="button" onClick={onDelete}
          className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[9px] text-gray-500 mb-2 line-clamp-2 cursor-pointer" onClick={onView}>{e.description}</p>

      <div className="flex items-center gap-3 text-[8px] text-gray-400 flex-wrap mb-2">
        <span>📅 {e.date} {e.time}</span>
        <span>⏱️ {e.duration}</span>
        <span>📍 {e.location.length > 20 ? e.location.slice(0, 20) + "…" : e.location}</span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-2">
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-gray-900">{e.attended > 0 ? `${e.attended}/${e.registered}` : `${e.registered}/${e.capacity}`}</p>
          <p className="text-[8px] text-gray-400">{e.attended > 0 ? "Tham dự" : "Đăng ký"}</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className={`text-xs ${e.leadsGenerated > 0 ? "text-green-600" : "text-gray-400"}`}>{e.leadsGenerated || "—"}</p>
          <p className="text-[8px] text-gray-400">Leads</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className={`text-xs ${e.roi > 0 ? "text-violet-600" : "text-gray-400"}`}>{e.roi > 0 ? `${e.roi}%` : "—"}</p>
          <p className="text-[8px] text-gray-400">ROI</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {e.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-[7px] px-1.5 py-0.5 bg-pink-50 text-pink-500 rounded">{t}</span>
        ))}
        {e.followUpSent && <span className="text-[7px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded border border-green-200">✉ Follow-up</span>}
        {attendanceRate !== null && (
          <span className={`text-[7px] px-1.5 py-0.5 rounded ${attendanceRate >= 50 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
            📊 {attendanceRate}%
          </span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function EventDetailModal({ event: e, onClose }: { event: CrmEvent; onClose: () => void }) {
  const typeCfg = CRM_EVENT_TYPE_CONFIG[e.type];
  const statusCfg = CRM_EVENT_STATUS_CONFIG[e.status];
  const attendanceRate = e.registered > 0 && e.attended > 0 ? Math.round((e.attended / e.registered) * 100) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(ev) => ev.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              e.type === "webinar" ? "bg-blue-100" :
              e.type === "workshop" ? "bg-violet-100" :
              e.type === "conference" ? "bg-amber-100" :
              e.type === "meetup" ? "bg-green-100" : "bg-red-100"
            }`}>
              {typeCfg.icon}
            </div>
            <div>
              <h3 className="text-gray-900">{e.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${typeCfg.bgColor} ${typeCfg.color}`}>{typeCfg.label}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${statusCfg.bgColor} ${statusCfg.color}`}>{statusCfg.label}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <p className="text-sm text-gray-700">{e.description}</p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Ngày", value: `${e.date} ${e.time}`, icon: "📅" },
              { label: "Thời lượng", value: e.duration, icon: "⏱️" },
              { label: "Địa điểm", value: e.location, icon: "📍" },
              { label: "Hình thức", value: e.isVirtual ? "Virtual / Hybrid" : "Trực tiếp", icon: "🌐" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[9px] text-gray-400">{item.icon} {item.label}</p>
                <p className="text-xs text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <p className="text-lg text-blue-600">{e.registered}</p>
              <p className="text-[8px] text-blue-700">Đăng ký</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <p className="text-lg text-green-600">{e.attended || "—"}</p>
              <p className="text-[8px] text-green-700">Tham dự</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-2">
              <p className="text-lg text-amber-600">{e.leadsGenerated || "—"}</p>
              <p className="text-[8px] text-amber-700">Leads</p>
            </div>
            <div className="bg-violet-50 rounded-lg p-2">
              <p className="text-lg text-violet-600">{e.roi > 0 ? `${e.roi}%` : "—"}</p>
              <p className="text-[8px] text-violet-700">ROI</p>
            </div>
          </div>

          {e.pipelineInfluenced > 0 && (
            <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3 text-center">
              <p className="text-sm text-emerald-700">Pipeline Influenced: <strong>{formatVND(e.pipelineInfluenced)}₫</strong></p>
            </div>
          )}

          {attendanceRate !== null && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Attendance Rate</span>
                <span className={`text-xs ${attendanceRate >= 50 ? "text-green-600" : "text-amber-600"}`}>{attendanceRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full" style={{ width: `${attendanceRate}%`, backgroundColor: attendanceRate >= 50 ? "#22c55e" : "#f59e0b" }} />
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-2.5">
            <p className="text-[9px] text-gray-400 mb-1">🎙️ Speakers</p>
            <div className="flex flex-wrap gap-1">
              {e.speakers.map((s) => (
                <span key={s} className="text-[9px] px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-600">{s}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {e.tags.map((t) => (
              <span key={t} className="text-[8px] px-1.5 py-0.5 bg-pink-50 text-pink-500 rounded">{t}</span>
            ))}
            {e.followUpSent && <span className="text-[8px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded border border-green-200">✉ Follow-up đã gửi</span>}
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
 * Create Event Modal
 * ============================================================ */
function EventCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CrmEventType>("webinar");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("60 phút");
  const [location, setLocation] = useState("");
  const [isVirtual, setIsVirtual] = useState(true);
  const [capacity, setCapacity] = useState(100);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên sự kiện"); return; }
    if (!date) { toast.error("Vui lòng chọn ngày"); return; }
    setSaving(true);
    await createCrmEvent({
      name, type, status: "upcoming", date, time, duration,
      location: location || (isVirtual ? "Online (Zoom)" : "Chưa xác định"),
      isVirtual, registered: 0, attended: 0, capacity,
      leadsGenerated: 0, pipelineInfluenced: 0, roi: 0,
      speakers: [], tags: [], description: description || name,
      followUpSent: false, engagementScore: 0,
    });
    toast.success(`Đã tạo sự kiện "${name}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Sự kiện mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên sự kiện *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: AI Sales Workshop Q2"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại sự kiện</label>
              <select value={type} onChange={(e) => setType(e.target.value as CrmEventType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                {Object.entries(CRM_EVENT_TYPE_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Sức chứa</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} min={1}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Giờ</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Thời lượng</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option value="30 phút">30 phút</option>
                <option value="60 phút">60 phút</option>
                <option value="90 phút">90 phút</option>
                <option value="2 giờ">2 giờ</option>
                <option value="Cả ngày">Cả ngày</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isVirtual} onChange={(e) => setIsVirtual(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
              <span className="text-sm text-gray-700">Online / Virtual</span>
            </label>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Địa điểm</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder={isVirtual ? "VD: Zoom, Google Meet" : "VD: Văn phòng HCM"}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả sự kiện..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo sự kiện"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function EventManagerPage() {
  const [data, setData] = useState<CrmEvent[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({ status: "", type: "" });
  const [selected, setSelected] = useState<CrmEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { mode, setMode } = useViewMode("crm-events");

  const loadData = useCallback(async () => {
    const result = await fetchCrmEvents({
      search: search || undefined,
      type: (filters.type || null) as CrmEventType | null,
      status: (filters.status || null) as CrmEventStatus | null,
    });
    setData(result);
  }, [search, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => {
    const completed = data.filter((e) => e.status === "completed");
    const totalRegistered = completed.reduce((s, e) => s + e.registered, 0);
    const totalAttended = completed.reduce((s, e) => s + e.attended, 0);
    const avgAttendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;
    const totalLeads = completed.reduce((s, e) => s + e.leadsGenerated, 0);
    const totalPipeline = completed.reduce((s, e) => s + e.pipelineInfluenced, 0);
    const upcomingCount = data.filter((e) => e.status === "upcoming").length;
    return { totalAttended, avgAttendanceRate, totalLeads, totalPipeline, upcomingCount };
  }, [data]);

  const pagination = usePagination(data, { storageKey: "crm-events" });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const count = await deleteCrmEvents(deleteTarget.ids);
    toast.success(`Đã xoá ${count} sự kiện`);
    setDeleteTarget(null);
    loadData();
  };

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateCrmEvent(rowId, { [field]: value });
    toast.success("Đã cập nhật sự kiện");
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-pink-600" /> Event & Webinar Manager
          </h1>
          <p className="text-gray-500 mt-0.5">Quản lý sự kiện — registrations, attendance, pipeline impact, ROI</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} />
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700">
            <Plus className="w-4 h-4" /> Tạo Sự kiện
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-pink-50 rounded-xl border border-pink-200 p-2.5 text-center">
          <p className="text-lg text-pink-600">{stats.upcomingCount}</p>
          <p className="text-[9px] text-pink-700">Sắp diễn ra</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalAttended}</p>
          <p className="text-[9px] text-blue-700">Tổng Attendees</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.avgAttendanceRate}%</p>
          <p className="text-[9px] text-green-700">Attendance Rate</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.totalLeads}</p>
          <p className="text-[9px] text-amber-700">Leads Generated</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2.5 text-center">
          <p className="text-lg text-emerald-600">{formatVND(stats.totalPipeline)}₫</p>
          <p className="text-[9px] text-emerald-700">Pipeline Influenced</p>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm sự kiện, tag..."
        filters={EV_FILTERS}
        filterValues={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onClearAll={() => { setSearch(""); setFilters({ status: "", type: "" }); }}
      />

      {/* Table View */}
      {mode === "table" && (
        <DataTable<CrmEvent>
          data={pagination.paginatedItems}
          columns={EV_COLUMNS}
          storageKey="crm-events-table"
          selectable
          onRowClick={setSelected}
          onInlineEdit={handleInlineEdit}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} sự kiện được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelected(item)} className="p-1 text-gray-300 hover:text-violet-600"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.name })} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không có sự kiện nào phù hợp"
        />
      )}

      {/* Card View */}
      {mode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {pagination.paginatedItems.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              onView={() => setSelected(e)}
              onDelete={() => setDeleteTarget({ ids: [e.id], label: e.name })}
            />
          ))}
          {pagination.paginatedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không có sự kiện nào phù hợp</p>
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

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <h4 className="text-sm text-pink-900">AI Event Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-pink-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Workshop MEDDPICC</strong> có engagement score cao nhất (92) + highest leads-to-pipeline conversion (<strong>120M₫/lead</strong>). Recommend: tổ chức monthly.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Demo Day Q1</strong> — 245/300 registered. AI predict attendance ~58%. Suggest: <strong>reminder 24h + 1h trước</strong> + on-demand recording.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Webinar attendees có <strong>3.5x higher conversion</strong>. Best time: <strong>Thứ 3 + Thứ 5, 10:00-11:00</strong>. Optimal duration: <strong>45-60 phút</strong>.</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {selected && <EventDetailModal event={selected} onClose={() => setSelected(null)} />}
      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemName={deleteTarget.label}
          entityType="sự kiện"
          description={`Bạn có chắc muốn xoá "${deleteTarget.label}"?`}
        />
      )}
      {showCreateModal && <EventCreateModal onClose={() => setShowCreateModal(false)} onCreated={loadData} />}
    </div>
  );
}