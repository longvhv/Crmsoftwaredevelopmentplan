/**
 * Trang Ticket Support — Hệ thống ticket hỗ trợ khách hàng.
 * Features: DataTable + Card view toggle, FilterBar, Pagination,
 *           Column Visibility, Inline Edit, Delete, Detail Modal, Charts.
 * Phase F3-04 → F3-08 — Centralized types/constants/data/API
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Ticket, AlertTriangle, CheckCircle2, X, Bot, Sparkles,
  User, Building2, MessageSquare, ArrowDownRight, Eye,
  ShieldAlert, Timer, CircleDot, Inbox, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, Legend,
} from "recharts";
import type { SupportTicket, TicketPriority } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  TICKET_PRIORITY_CONFIG, TICKET_PRIORITY_ORDER,
  TICKET_STATUS_CONFIG, TICKET_CATEGORY_CONFIG,
} from "../../constants/crmConfig";
import { fetchTickets, updateTicket, deleteTicket, deleteTickets } from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Icon mapping (JSX không thuộc constants layer)
 * ============================================================ */
const PRIORITY_ICONS: Record<string, React.ReactNode> = {
  critical: <ShieldAlert className="w-3 h-3" />,
  high: <AlertTriangle className="w-3 h-3" />,
  medium: <CircleDot className="w-3 h-3" />,
  low: <ArrowDownRight className="w-3 h-3" />,
};

/* ============================================================
 * Filter config
 * ============================================================ */
const TICKET_FILTERS: FilterConfig[] = [
  { key: "priority", label: "Ưu tiên", type: "select", options: Object.entries(TICKET_PRIORITY_CONFIG).map(([v, c]) => ({ value: v, label: c.label })) },
  { key: "category", label: "Danh mục", type: "select", options: Object.entries(TICKET_CATEGORY_CONFIG).map(([v, c]) => ({ value: v, label: `${c.icon} ${c.label}` })) },
  { key: "status", label: "Trạng thái", type: "button-group", options: [{ value: "", label: "Tất cả" }, ...Object.entries(TICKET_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))] },
];

/* Chart colors */
const STATUS_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#22c55e", "#9ca3af"];
const CAT_COLORS = ["#ef4444", "#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b", "#f97316"];
const VOLUME_TREND = [
  { week: "W5", opened: 8, resolved: 6 }, { week: "W6", opened: 12, resolved: 10 },
  { week: "W7", opened: 10, resolved: 11 }, { week: "W8", opened: 7, resolved: 9 },
  { week: "W9", opened: 9, resolved: 7 }, { week: "W10", opened: 6, resolved: 5 },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const TICKET_COLUMNS: ColumnDef<SupportTicket>[] = [
  { key: "ticketNo", header: "Mã ticket", sortable: true, minWidth: 120, render: (t) => <span className="text-gray-500 text-[13px]">{t.ticketNo}</span> },
  {
    key: "subject", header: "Tiêu đề", sortable: true, minWidth: 220,
    render: (t) => (
      <div>
        <p className="text-gray-900 line-clamp-1">{t.subject}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-[9px] px-1.5 py-0.5 rounded ${TICKET_CATEGORY_CONFIG[t.category].color}`}>{TICKET_CATEGORY_CONFIG[t.category].icon} {TICKET_CATEGORY_CONFIG[t.category].label}</span>
          {t.slaBreached && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-600">SLA Breach</span>}
        </div>
      </div>
    ),
  },
  {
    key: "priority", header: "Ưu tiên", sortable: true, minWidth: 100, editable: true,
    render: (t) => { const cfg = TICKET_PRIORITY_CONFIG[t.priority]; return <span className={`text-[11px] px-2 py-0.5 rounded border inline-flex items-center gap-1 ${cfg.color}`}>{PRIORITY_ICONS[t.priority]} {cfg.label}</span>; },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.priority} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(TICKET_PRIORITY_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
    sortValue: (t) => TICKET_PRIORITY_ORDER[t.priority],
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 110, editable: true,
    render: (t) => { const cfg = TICKET_STATUS_CONFIG[t.status]; return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>; },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(TICKET_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
  },
  { key: "clientCompany", header: "Khách hàng", sortable: true, minWidth: 140, render: (t) => (<div><p className="text-gray-700 text-[13px] truncate">{t.clientCompany}</p><p className="text-[10px] text-gray-400 truncate">{t.clientName}</p></div>) },
  {
    key: "assignee", header: "Phụ trách", sortable: true, minWidth: 130, editable: true,
    render: (t) => (<div className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[8px] flex-shrink-0">{t.assigneeAvatar === "🤖" ? "🤖" : t.assigneeAvatar.slice(0, 2)}</span><span className="text-gray-600 text-[13px] truncate">{t.assignee}</span></div>),
  },
  { key: "createdAt", header: "Ngày tạo", sortable: true, minWidth: 100, defaultHidden: true, render: (t) => <span className="text-gray-500 text-[13px]">{new Date(t.createdAt).toLocaleDateString("vi-VN")}</span>, sortValue: (t) => new Date(t.createdAt) },
  {
    key: "slaDeadline", header: "SLA", sortable: true, minWidth: 100,
    render: (t) => {
      if (t.slaBreached) return <span className="text-[11px] text-red-600">⚠️ Đã breach</span>;
      const remain = new Date(t.slaDeadline).getTime() - new Date("2026-03-03T12:00:00").getTime();
      if (remain <= 0) return <span className="text-[11px] text-red-600">Quá hạn</span>;
      const h = Math.floor(remain / 3600000);
      return <span className={`text-[11px] ${h < 12 ? "text-amber-600" : "text-green-600"}`}>{h}h còn lại</span>;
    },
    sortValue: (t) => new Date(t.slaDeadline),
  },
  { key: "resolutionTime", header: "Thời gian XL", sortable: true, minWidth: 80, defaultHidden: true, render: (t) => t.resolutionTime != null ? <span className="text-green-600 text-[13px]">{t.resolutionTime}h</span> : <span className="text-gray-300 text-[13px]">—</span>, sortValue: (t) => t.resolutionTime ?? 9999 },
  { key: "messages", header: "Tin nhắn", sortable: true, minWidth: 70, defaultHidden: true, render: (t) => <span className="text-gray-500 text-[13px]">{t.messages.length}</span>, sortValue: (t) => t.messages.length },
];

/* ============================================================
 * Ticket Card
 * ============================================================ */
function TicketCard({ ticket, onClick }: { ticket: SupportTicket; onClick: () => void }) {
  const sCfg = TICKET_STATUS_CONFIG[ticket.status];
  const catCfg = TICKET_CATEGORY_CONFIG[ticket.category];
  return (
    <button type="button" onClick={onClick} className="w-full text-left bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${ticket.priority === "critical" ? "bg-red-100 text-red-600" : ticket.priority === "high" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>{PRIORITY_ICONS[ticket.priority]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] text-gray-400">{ticket.ticketNo}</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded ${catCfg.color}`}>{catCfg.icon} {catCfg.label}</span>
            {ticket.slaBreached && <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-100 text-red-600">⚠️ SLA</span>}
          </div>
          <p className="text-sm text-gray-900 mt-0.5 line-clamp-1">{ticket.subject}</p>
          <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
            <span className="flex items-center gap-0.5"><Building2 className="w-2.5 h-2.5" /> {ticket.clientCompany}</span>
            <span className="flex items-center gap-0.5"><User className="w-2.5 h-2.5" /> {ticket.assignee}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ============================================================
 * Ticket Detail Modal
 * ============================================================ */
function TicketDetailModal({ ticket, onClose }: { ticket: SupportTicket; onClose: () => void }) {
  const pCfg = TICKET_PRIORITY_CONFIG[ticket.priority];
  const sCfg = TICKET_STATUS_CONFIG[ticket.status];
  const catCfg = TICKET_CATEGORY_CONFIG[ticket.category];
  const slaRemaining = useMemo(() => {
    const diff = new Date(ticket.slaDeadline).getTime() - new Date("2026-03-03T12:00:00").getTime();
    if (diff <= 0) return "Đã quá hạn";
    return `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m còn lại`;
  }, [ticket.slaDeadline]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div><p className="text-xs text-gray-400">{ticket.ticketNo}</p><p className="text-sm text-gray-900 mt-0.5">{ticket.subject}</p></div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[9px] px-2 py-0.5 rounded border flex items-center gap-0.5 ${pCfg.color}`}>{PRIORITY_ICONS[ticket.priority]} {pCfg.label}</span>
            <span className={`text-[9px] px-2 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
            <span className={`text-[9px] px-2 py-0.5 rounded ${catCfg.color}`}>{catCfg.icon} {catCfg.label}</span>
          </div>
          <p className="text-sm text-gray-600">{ticket.description}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2.5"><p className="text-[9px] text-gray-400 mb-0.5">Khách hàng</p><p className="text-xs text-gray-800">{ticket.clientName}</p><p className="text-[9px] text-gray-500">{ticket.clientCompany}</p></div>
            <div className="bg-gray-50 rounded-lg p-2.5"><p className="text-[9px] text-gray-400 mb-0.5">Phụ trách</p><p className="text-xs text-gray-800">{ticket.assignee}</p></div>
          </div>
          <div className={`rounded-lg border p-2.5 ${ticket.slaBreached ? "bg-red-50 border-red-200" : "bg-green-50 border-green-100"}`}>
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-gray-500 flex items-center gap-1"><Timer className="w-3 h-3" /> SLA</p>
              <p className={`text-xs ${ticket.slaBreached ? "text-red-600" : "text-green-600"}`}>{ticket.slaBreached ? "⚠️ Đã breach" : slaRemaining}</p>
            </div>
          </div>
          {ticket.resolutionTime != null && <div className="bg-green-50 rounded-lg border border-green-100 p-2.5"><p className="text-xs text-green-700"><CheckCircle2 className="w-3 h-3 inline mr-1" />Đã giải quyết trong {ticket.resolutionTime} giờ</p></div>}
          {ticket.messages.length > 0 && (
            <div>
              <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Trao đổi ({ticket.messages.length})</h4>
              <div className="space-y-2">
                {ticket.messages.map((msg) => (
                  <div key={msg.id} className={`rounded-lg p-2.5 ${msg.isAgent ? "bg-violet-50 border border-violet-100 ml-4" : "bg-gray-50 mr-4"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-[10px] ${msg.isAgent ? "text-violet-700" : "text-gray-700"}`}>{msg.sender}</p>
                      <p className="text-[8px] text-gray-400">{new Date(msg.timestamp).toLocaleString("vi-VN")}</p>
                    </div>
                    <p className="text-xs text-gray-600">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5"><Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" /><span><span className="text-violet-900">AI:</span> {ticket.aiSuggestion}</span></p>
          </div>
        </div>
        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính — dùng API layer thay vì inline data
 * ============================================================ */
export function TicketSupportPage() {
  const { mode, setMode } = useViewMode("tickets", "table");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SupportTicket | null>(null);

  /* Load data từ API layer */
  const reload = useCallback(() => { fetchTickets().then(setTickets); }, []);
  useEffect(() => { reload(); }, [reload]);

  /* FilterBar state */
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const handleFilterChange = useCallback((key: string, value: string) => { setFilterValues((prev) => ({ ...prev, [key]: value })); }, []);
  const hasActiveFilters = !!search || Object.values(filterValues).some((v) => v !== "");
  const clearAll = useCallback(() => { setSearch(""); setFilterValues({}); }, []);

  /* Stats (dynamic từ loaded data) */
  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === "open" || t.status === "in-progress" || t.status === "waiting").length;
    const breached = tickets.filter((t) => t.slaBreached).length;
    const resolved = tickets.filter((t) => t.resolutionTime != null);
    const avgRes = resolved.length > 0 ? Math.round(resolved.reduce((s, t) => s + (t.resolutionTime ?? 0), 0) / resolved.length) : 0;
    const critical = tickets.filter((t) => t.priority === "critical" && t.status !== "resolved" && t.status !== "closed").length;
    return { open, breached, avgRes, critical };
  }, [tickets]);

  /* Chart data (dynamic từ loaded data) */
  const statusChart = useMemo(() => Object.entries(TICKET_STATUS_CONFIG).map(([key, cfg]) => ({ name: cfg.label, value: tickets.filter((t) => t.status === key).length })), [tickets]);
  const categoryChart = useMemo(() => Object.entries(TICKET_CATEGORY_CONFIG).map(([key, cfg]) => ({ name: cfg.label, count: tickets.filter((t) => t.category === key).length })), [tickets]);

  /* Filter */
  const filtered = useMemo(() => {
    let result = [...tickets];
    if (filterValues.priority) result = result.filter((t) => t.priority === filterValues.priority);
    if (filterValues.status) result = result.filter((t) => t.status === filterValues.status);
    if (filterValues.category) result = result.filter((t) => t.category === filterValues.category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.subject.toLowerCase().includes(q) || t.ticketNo.toLowerCase().includes(q) || t.clientCompany.toLowerCase().includes(q) || t.clientName.toLowerCase().includes(q));
    }
    return result.sort((a, b) => TICKET_PRIORITY_ORDER[a.priority] - TICKET_PRIORITY_ORDER[b.priority] || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, filterValues, search]);

  const cardPag = usePagination(filtered, { storageKey: "tickets-card" });

  /* Inline edit qua API */
  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateTicket(rowId, { [field]: value });
    reload();
    toast.success("Đã cập nhật ticket");
  }, [reload]);

  /* Delete qua API */
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteTicket(deleteTarget.id);
    reload();
    toast.success(`Đã xóa ticket "${deleteTarget.ticketNo}"`);
    setDeleteTarget(null);
  }, [deleteTarget, reload]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    await deleteTickets(ids);
    reload();
    toast.success(`Đã xóa ${ids.length} ticket`);
  }, [reload]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2"><Ticket className="w-5 h-5 text-blue-600" /> Hỗ trợ Khách hàng</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Ticket management · SLA tracking · AI categorization</p>
        </div>
        <ViewToggle mode={mode} onSetMode={setMode} modes={["table", "card"]} />
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`rounded-xl border p-3 ${stats.open > 5 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}><Inbox className="w-4 h-4 text-amber-500 mb-1" /><p className="text-lg text-gray-900">{stats.open}</p><p className="text-xs text-gray-600">Ticket đang mở</p></div>
        <div className={`rounded-xl border p-3 ${stats.critical > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}><ShieldAlert className="w-4 h-4 text-red-500 mb-1" /><p className={`text-lg ${stats.critical > 0 ? "text-red-600" : "text-green-600"}`}>{stats.critical}</p><p className="text-xs text-gray-600">Critical mở</p></div>
        <div className={`rounded-xl border p-3 ${stats.breached > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}><AlertTriangle className="w-4 h-4 text-red-500 mb-1" /><p className={`text-lg ${stats.breached > 0 ? "text-red-600" : "text-green-600"}`}>{stats.breached}</p><p className="text-xs text-gray-600">SLA breach</p></div>
        <div className="bg-white rounded-xl border border-gray-100 p-3"><Timer className="w-4 h-4 text-blue-500 mb-1" /><p className="text-lg text-gray-900">{stats.avgRes}h</p><p className="text-xs text-gray-500">Thời gian xử lý TB</p></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Theo Trạng thái</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart><Pie data={statusChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={22} label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""} labelLine={false}>{statusChart.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Theo Danh mục</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={categoryChart} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 8 }} width={85} /><Tooltip /><Bar dataKey="count" radius={[0, 4, 4, 0]}>{categoryChart.map((_, i) => <Cell key={i} fill={CAT_COLORS[i]} />)}</Bar></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Volume Trend</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={VOLUME_TREND}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="week" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} /><Line type="monotone" dataKey="opened" name="Mở mới" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} /><Line type="monotone" dataKey="resolved" name="Giải quyết" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} /></LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Tìm ticket, khách hàng..." filters={TICKET_FILTERS} filterValues={filterValues} onFilterChange={handleFilterChange} onClearAll={clearAll} hasActiveFilters={hasActiveFilters} />

      {mode === "table" ? (
        <DataTable<SupportTicket> data={filtered} columns={TICKET_COLUMNS} storageKey="tickets" selectable defaultSortField="priority" onInlineEdit={handleInlineEdit} onRowClick={(t) => setSelectedTicket(t)} onBulkDelete={handleBulkDelete} emptyMessage="Không tìm thấy ticket phù hợp"
          renderRowActions={(t) => (<div className="flex items-center gap-0.5"><button type="button" onClick={() => setSelectedTicket(t)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Eye className="w-3.5 h-3.5" /></button><button type="button" onClick={() => setDeleteTarget(t)} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button></div>)} />
      ) : (
        <>
          <div className="space-y-2">{cardPag.paginatedItems.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicket(ticket)} />)}</div>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><Ticket className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">Không tìm thấy ticket phù hợp</p></div>}
          {filtered.length > 0 && <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"><PaginationBar {...cardPag} onGoToPage={cardPag.goToPage} onNextPage={cardPag.nextPage} onPrevPage={cardPag.prevPage} onSetPageSize={cardPag.setPageSize} /></div>}
        </>
      )}

      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-violet-600" /><h4 className="text-sm text-violet-900">AI Support Insights</h4></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />1 ticket SLA breach (GlobalSoft SSO). Escalate ngay.</p>
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />30% tickets liên quan performance. Cần optimization sprint.</p>
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />AI Agent Nova xử lý 25% tickets tự động.</p>
        </div>
      </div>

      {selectedTicket && <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
      <ConfirmDeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemName={deleteTarget?.ticketNo ?? ""} entityType="ticket" description="Hành động này không thể hoàn tác." />
    </div>
  );
}
