/**
 * Team Capacity Planner — Lập kế hoạch Năng lực Đội ngũ
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Detail Modal, Delete đơn lẻ + bulk, AI Insights.
 * Phase 7 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Users, Sparkles, Bot,
  Trash2, Eye, X, AlertTriangle,
  Flame, Target, BrainCircuit,
} from "lucide-react";
import { toast } from "sonner";
import type { TeamMember, BurnoutRisk } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { BURNOUT_RISK_CONFIG } from "../../constants/crmConfig";
import { fetchTeamMembers, deleteTeamMembers, updateTeamMember, createTeamMember } from "../../api/crmApi";
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
const TM_FILTERS: FilterConfig[] = [
  {
    key: "burnoutRisk", label: "Burnout Risk", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(BURNOUT_RISK_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
  {
    key: "type", label: "Loại", type: "select",
    options: [
      { value: "human", label: "Con người" },
      { value: "ai-agent", label: "AI Agent" },
    ],
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const TM_COLUMNS: ColumnDef<TeamMember>[] = [
  {
    key: "name", header: "Thành viên", sortable: true, minWidth: 200,
    render: (r) => (
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
          r.type === "ai-agent" ? "bg-violet-100" : "bg-blue-100"
        }`}>
          {r.type === "ai-agent" ? r.avatar : <span className="text-blue-700 text-[10px]">{r.avatar}</span>}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-gray-900 truncate">{r.name}</p>
            {r.type === "ai-agent" && <span className="text-[7px] px-1 py-0.5 bg-violet-100 text-violet-600 rounded border border-violet-200">AI</span>}
          </div>
          <p className="text-[10px] text-gray-400 truncate">{r.role} • {r.department}</p>
        </div>
      </div>
    ),
  },
  {
    key: "utilization", header: "Utilization", sortable: true, minWidth: 100,
    render: (r) => {
      const isOverloaded = r.utilization > 100;
      return (
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-16">
            <div className={`h-full rounded-full ${isOverloaded ? "bg-red-400" : r.utilization > 90 ? "bg-amber-400" : "bg-green-400"}`}
              style={{ width: `${Math.min(r.utilization, 100)}%` }} />
          </div>
          <span className={`text-[10px] ${isOverloaded ? "text-red-600" : r.utilization > 90 ? "text-amber-600" : "text-green-600"}`}>{r.utilization}%</span>
        </div>
      );
    },
    sortValue: (r) => r.utilization,
  },
  {
    key: "allocatedHours", header: "Giờ", sortable: true, minWidth: 80,
    render: (r) => <span className="text-gray-600 text-xs">{r.allocatedHours}/{r.capacityHours}h</span>,
    sortValue: (r) => r.allocatedHours,
  },
  {
    key: "burnoutRisk", header: "Burnout", sortable: true, minWidth: 100, editable: true,
    render: (r) => {
      const cfg = BURNOUT_RISK_CONFIG[r.burnoutRisk];
      return <span className={`text-[9px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (_item, _v, onChange, onSave) => (
      <select defaultValue={_item.burnoutRisk} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(BURNOUT_RISK_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
  },
  {
    key: "activeDeals", header: "Deals", sortable: true, minWidth: 60,
    render: (r) => <span className="text-gray-600 text-xs">{r.activeDeals}</span>,
    sortValue: (r) => r.activeDeals,
  },
  {
    key: "activeTasks", header: "Tasks", sortable: true, minWidth: 60,
    render: (r) => <span className="text-gray-600 text-xs">{r.activeTasks}</span>,
    sortValue: (r) => r.activeTasks,
  },
  {
    key: "performanceScore", header: "Hiệu suất", sortable: true, minWidth: 80,
    render: (r) => (
      <span className={r.performanceScore >= 90 ? "text-green-600 text-xs" : r.performanceScore >= 80 ? "text-amber-600 text-xs" : "text-red-600 text-xs"}>
        {r.performanceScore}/100
      </span>
    ),
    sortValue: (r) => r.performanceScore,
  },
  {
    key: "satisfaction", header: "Hài lòng", sortable: true, minWidth: 70, defaultHidden: true,
    render: (r) => (
      <span className={r.satisfaction >= 80 ? "text-green-600 text-xs" : r.satisfaction >= 60 ? "text-amber-600 text-xs" : "text-red-600 text-xs"}>
        {r.satisfaction}%
      </span>
    ),
    sortValue: (r) => r.satisfaction,
  },
  {
    key: "department", header: "Phòng ban", sortable: true, minWidth: 90,
    render: (r) => <span className="text-gray-500 text-xs">{r.department}</span>,
  },
  {
    key: "ptoPlanned", header: "PTO", sortable: true, minWidth: 60, defaultHidden: true,
    render: (r) => r.ptoPlanned > 0
      ? <span className="text-amber-600 text-xs">🏖️ {r.ptoPlanned}d</span>
      : <span className="text-gray-300 text-xs">—</span>,
    sortValue: (r) => r.ptoPlanned,
  },
];

/* ============================================================
 * Create Modal
 * ============================================================ */
function MemberCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Sales");
  const [type, setType] = useState<"human" | "ai-agent">("human");
  const [capacityHours, setCapacityHours] = useState(40);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên thành viên"); return; }
    setSaving(true);
    await createTeamMember({
      name, role, department, type, capacityHours,
      avatar: type === "ai-agent" ? "🤖" : name.substring(0, 2).toUpperCase(),
      skills: [], allocatedHours: 0, utilization: 0,
      activeDeals: 0, activeTasks: 0, burnoutRisk: "low",
      satisfaction: 80, performanceScore: 80, ptoPlanned: 0, tags: [],
    });
    toast.success(`Đã thêm thành viên "${name}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Thêm Thành viên mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên thành viên *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên thành viên / AI Agent"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Vai trò</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="VD: Sales Rep"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại</label>
              <select value={type} onChange={(e) => setType(e.target.value as "human" | "ai-agent")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="human">Con người</option>
                <option value="ai-agent">AI Agent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phòng ban</label>
              <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Capacity (giờ/tuần)</label>
              <input type="number" value={capacityHours} onChange={(e) => setCapacityHours(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Thêm Thành viên"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Card View
 * ============================================================ */
function MemberCard({ item, onView, onDelete }: {
  item: TeamMember; onView: () => void; onDelete: () => void;
}) {
  const br = BURNOUT_RISK_CONFIG[item.burnoutRisk];
  const isOverloaded = item.utilization > 100;

  return (
    <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow group ${isOverloaded ? "border-orange-200" : "border-gray-100"}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onView}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
            item.type === "ai-agent" ? "bg-violet-100" : "bg-blue-100"
          }`}>
            {item.type === "ai-agent" ? item.avatar : <span className="text-blue-700 text-[10px]">{item.avatar}</span>}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="text-sm text-gray-900 truncate">{item.name}</h4>
              {item.type === "ai-agent" && <span className="text-[7px] px-1 py-0.5 bg-violet-100 text-violet-600 rounded border border-violet-200">AI</span>}
            </div>
            <p className="text-[9px] text-gray-400">{item.role} • {item.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={`text-lg ${isOverloaded ? "text-red-600" : item.utilization > 90 ? "text-amber-600" : "text-green-600"}`}>
            {item.utilization}%
          </span>
          <button type="button" onClick={onDelete}
            className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Utilization bar */}
      <div className="mb-2">
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${
            isOverloaded ? "bg-red-400" : item.utilization > 90 ? "bg-amber-400" : "bg-green-400"
          }`} style={{ width: `${Math.min(item.utilization, 100)}%` }} />
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[8px] text-gray-400">{item.allocatedHours}/{item.capacityHours}h</span>
          <span className={`text-[7px] px-1.5 py-0.5 rounded border ${br.bgColor} ${br.color}`}>{br.label}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-2">
        {item.skills.slice(0, 3).map((s) => (
          <span key={s} className="text-[7px] px-1 py-0.5 bg-gray-100 text-gray-500 rounded">{s}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 text-[8px] text-gray-400 flex-wrap">
        {item.activeDeals > 0 && <span>📊 {item.activeDeals} deals</span>}
        <span>📋 {item.activeTasks} tasks</span>
        {item.type === "human" && <span>⭐ {item.performanceScore}/100</span>}
        {item.ptoPlanned > 0 && <span className="text-amber-600">🏖️ {item.ptoPlanned}d PTO</span>}
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function MemberDetailModal({ item, onClose }: { item: TeamMember; onClose: () => void }) {
  const br = BURNOUT_RISK_CONFIG[item.burnoutRisk];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
              item.type === "ai-agent" ? "bg-violet-100" : "bg-blue-100"
            }`}>
              {item.type === "ai-agent" ? item.avatar : <span className="text-blue-700 text-[10px]">{item.avatar}</span>}
            </div>
            <div>
              <h3 className="text-gray-900">{item.name}</h3>
              <p className="text-[10px] text-gray-400">{item.role} • {item.department}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "Loại", value: item.type === "ai-agent" ? "AI Agent" : "Con người" },
              { label: "Utilization", value: `${item.utilization}%` },
              { label: "Giờ phân bổ", value: `${item.allocatedHours}/${item.capacityHours}h` },
              { label: "Burnout Risk", value: br.label },
              { label: "Active Deals", value: String(item.activeDeals) },
              { label: "Active Tasks", value: String(item.activeTasks) },
              { label: "Hiệu suất", value: `${item.performanceScore}/100` },
              { label: "Hài lòng", value: `${item.satisfaction}%` },
              { label: "PTO dự kiến", value: item.ptoPlanned > 0 ? `${item.ptoPlanned} ngày` : "—" },
            ].map((x) => (
              <div key={x.label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[9px] text-gray-400">{x.label}</p>
                <p className="text-xs text-gray-800">{x.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[9px] text-gray-400 mb-1">Kỹ năng</p>
            <div className="flex flex-wrap gap-1">
              {item.skills.map((s) => (
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
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function TeamCapacityPage() {
  const [data, setData] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({ burnoutRisk: "", type: "" });
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { mode, setMode } = useViewMode("team-capacity");

  const loadData = useCallback(async () => {
    const result = await fetchTeamMembers({
      search: search || undefined,
      burnoutRisk: (filters.burnoutRisk || null) as BurnoutRisk | null,
    });
    // Also apply type filter client-side (not in API)
    let filtered = result;
    if (filters.type) {
      filtered = result.filter((m) => m.type === filters.type);
    }
    setData(filtered);
  }, [search, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => {
    const humans = data.filter((m) => m.type === "human");
    const aiAgents = data.filter((m) => m.type === "ai-agent");
    const avgUtil = humans.length > 0 ? Math.round(humans.reduce((s, m) => s + m.utilization, 0) / humans.length) : 0;
    const overloaded = humans.filter((m) => m.utilization > 100).length;
    const burnoutCritical = humans.filter((m) => m.burnoutRisk === "critical" || m.burnoutRisk === "high").length;
    return { total: data.length, humans: humans.length, aiAgents: aiAgents.length, avgUtil, overloaded, burnoutCritical };
  }, [data]);

  const sorted = useMemo(() => [...data].sort((a, b) => b.utilization - a.utilization), [data]);

  const pagination = usePagination(sorted, { storageKey: "team-capacity" });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const count = await deleteTeamMembers(deleteTarget.ids);
    toast.success(`Đã xoá ${count} thành viên`);
    setDeleteTarget(null);
    loadData();
  };

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateTeamMember(rowId, { [field]: value });
    loadData();
    toast.success("Đã cập nhật thành viên");
  }, [loadData]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-violet-600" /> Team Capacity Planner
          </h1>
          <p className="text-gray-500 mt-0.5">Năng lực đội ngũ — workload, burnout risk, dự báo nhu cầu, phân bổ tài nguyên</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} />
          <button type="button" onClick={() => toast.success("AI đang phân tích và đề xuất tái phân bổ...")}
            className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
            <BrainCircuit className="w-4 h-4" /> AI Tối ưu
          </button>
          <button type="button" onClick={() => setShowCreate(true)}
            className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
            <Users className="w-4 h-4" /> Thêm Thành viên
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Tổng thành viên</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.humans}</p>
          <p className="text-[9px] text-blue-700">Con người</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.aiAgents}</p>
          <p className="text-[9px] text-violet-700">AI Agents</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${stats.avgUtil > 95 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
          <p className={`text-lg ${stats.avgUtil > 95 ? "text-amber-600" : "text-green-600"}`}>{stats.avgUtil}%</p>
          <p className="text-[9px] text-gray-500">Utilization TB</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-2.5 text-center">
          <p className="text-lg text-orange-600">{stats.overloaded}</p>
          <p className="text-[9px] text-orange-700">Quá tải</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${stats.burnoutCritical > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <p className={`text-lg ${stats.burnoutCritical > 0 ? "text-red-600" : "text-green-600"}`}>{stats.burnoutCritical}</p>
          <p className="text-[9px] text-gray-500">Burnout cao</p>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm thành viên, role, phòng ban..."
        filters={TM_FILTERS}
        filterValues={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onClearAll={() => { setSearch(""); setFilters({ burnoutRisk: "", type: "" }); }}
      />

      {/* Table View */}
      {mode === "table" && (
        <DataTable<TeamMember>
          data={pagination.paginatedItems}
          columns={TM_COLUMNS}
          storageKey="team-capacity-table"
          selectable
          onInlineEdit={handleInlineEdit}
          onRowClick={setSelected}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} thành viên được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelected(item)} className="p-1 text-gray-300 hover:text-violet-600"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.name })} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không có thành viên nào phù hợp"
        />
      )}

      {/* Card View */}
      {mode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {pagination.paginatedItems.map((m) => (
            <MemberCard
              key={m.id}
              item={m}
              onView={() => setSelected(m)}
              onDelete={() => setDeleteTarget({ ids: [m.id], label: m.name })}
            />
          ))}
          {pagination.paginatedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không có thành viên nào phù hợp</p>
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

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Capacity Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Flame className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span><strong>Phạm Văn Khôi</strong> (CS Manager) — <strong>burnout nguy hiểm</strong>, utilization 120%. AI đề xuất: <strong>chuyển 3 accounts cho AI Agent Nova</strong> + phê duyệt 2 ngày PTO.</span>
          </p>
          <p className="flex items-start gap-2">
            <Target className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Tuần 14</strong> dự báo thiếu <strong>125 giờ</strong> do campaign launch + quarter-end rush. AI suggest: tăng capacity AI Agents thêm <strong>60h</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI Agents chỉ dùng <strong>60% capacity</strong>. Offload thêm: <strong>lead qualification</strong> (15h/tuần), <strong>QBR prep</strong> (8h/tuần), <strong>data entry</strong> (5h/tuần).</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {selected && <MemberDetailModal item={selected} onClose={() => setSelected(null)} />}
      {showCreate && <MemberCreateModal onClose={() => setShowCreate(false)} onCreated={loadData} />}
      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemName={deleteTarget.label}
          entityType="thành viên"
          description="Hành động này không thể hoàn tác."
        />
      )}
    </div>
  );
}