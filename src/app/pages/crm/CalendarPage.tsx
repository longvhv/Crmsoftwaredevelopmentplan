/**
 * Trang Lịch hẹn CRM — View tháng/tuần/ngày + DataTable + List.
 * Hiển thị meetings, follow-ups, tasks, deadlines.
 * Phase P1.01: Calendar + Table + List view, full CRUD, filters, pagination
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  User,
  Video,
  Phone,
  Mail,
  Target,
  Bot,
  X,
  AlertCircle,
  CheckCircle2,
  Zap,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import type { CalendarEvent, CalendarEventType } from "../../types/crm";
import type { ColumnDef, ViewMode } from "../../types/dataTable";
import { CALENDAR_EVENT_TYPE_CONFIG, CALENDAR_WEEKDAYS, CRM_ASSIGNEE_NAMES } from "../../constants/crmConfig";
import { fetchCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Icon mapping (JSX không thuộc constants layer)
 * ============================================================ */
const EVENT_TYPE_ICONS: Record<CalendarEventType, React.ReactNode> = {
  meeting: <Video className="w-3 h-3" />,
  call: <Phone className="w-3 h-3" />,
  "follow-up": <Mail className="w-3 h-3" />,
  deadline: <AlertCircle className="w-3 h-3" />,
  task: <CheckCircle2 className="w-3 h-3" />,
  demo: <Target className="w-3 h-3" />,
};

/* ============================================================
 * Helper functions
 * ============================================================ */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekDates(baseDate: Date): Date[] {
  const day = baseDate.getDay();
  const start = new Date(baseDate);
  start.setDate(start.getDate() - day + 1); // Thứ 2
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

/* ============================================================
 * Column Definitions cho DataTable
 * ============================================================ */
const CALENDAR_COLUMNS: ColumnDef<CalendarEvent>[] = [
  {
    key: "type",
    header: "Loại",
    sortable: true,
    minWidth: 110,
    render: (item) => {
      const cfg = CALENDAR_EVENT_TYPE_CONFIG[item.type];
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs ${cfg.bgColor} ${cfg.color}`}>
          {EVENT_TYPE_ICONS[item.type]}
          <span>{cfg.label}</span>
        </div>
      );
    },
    sortValue: (item) => item.type,
  },
  {
    key: "title",
    header: "Tiêu đề",
    sortable: true,
    editable: true,
    minWidth: 200,
    render: (item) => (
      <div>
        <p className="text-gray-900 text-sm truncate">{item.title}</p>
        {item.contactName && (
          <p className="text-xs text-gray-500 truncate">{item.contactName} {item.company && `· ${item.company}`}</p>
        )}
      </div>
    ),
  },
  {
    key: "date",
    header: "Ngày",
    sortable: true,
    minWidth: 100,
    render: (item) => {
      const d = new Date(item.date);
      return (
        <span className="text-sm text-gray-700">
          {d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
        </span>
      );
    },
    sortValue: (item) => new Date(item.date),
  },
  {
    key: "time",
    header: "Thời gian",
    sortable: true,
    minWidth: 100,
    render: (item) => (
      <div className="text-xs text-gray-600">
        <p>{item.startTime} – {item.endTime}</p>
      </div>
    ),
    sortValue: (item) => item.startTime,
  },
  {
    key: "assignedTo",
    header: "Phụ trách",
    sortable: true,
    minWidth: 130,
    render: (item) => (
      <div className="flex items-center gap-1.5">
        <Users className="w-3 h-3 text-gray-400" />
        <span className="text-sm text-gray-700 truncate">{item.assignedTo}</span>
      </div>
    ),
  },
  {
    key: "location",
    header: "Địa điểm",
    sortable: false,
    defaultHidden: false,
    minWidth: 120,
    render: (item) =>
      item.isOnline ? (
        <span className="inline-flex items-center gap-1 text-xs text-blue-600">
          <Video className="w-3 h-3" /> Online
        </span>
      ) : item.location ? (
        <span className="text-xs text-gray-600 truncate">{item.location}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: "priority",
    header: "Ưu tiên",
    sortable: true,
    defaultHidden: true,
    minWidth: 90,
    render: (item) => {
      const config = {
        high: { label: "Cao", color: "bg-red-100 text-red-700" },
        medium: { label: "Vừa", color: "bg-amber-100 text-amber-700" },
        low: { label: "Thấp", color: "bg-gray-100 text-gray-500" },
      }[item.priority];
      return <span className={`text-xs px-2 py-0.5 rounded ${config.color}`}>{config.label}</span>;
    },
  },
  {
    key: "isAIGenerated",
    header: "AI",
    sortable: true,
    defaultHidden: true,
    minWidth: 80,
    render: (item) =>
      item.isAIGenerated ? (
        <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded">
          <Bot className="w-3 h-3" /> AI
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: "dealTitle",
    header: "Deal",
    sortable: false,
    defaultHidden: true,
    minWidth: 100,
    render: (item) =>
      item.dealTitle ? (
        <span className="text-xs text-green-600 truncate">{item.dealTitle}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
];

/* ============================================================
 * List View — Timeline style cho mobile
 * ============================================================ */
function ListView({ events, onSelectEvent }: { events: CalendarEvent[]; onSelectEvent: (ev: CalendarEvent) => void }) {
  const grouped = useMemo(() => {
    const groups = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const dateKey = new Date(ev.date).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const existing = groups.get(dateKey);
      if (existing) existing.push(ev);
      else groups.set(dateKey, [ev]);
    }
    return groups;
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Không có sự kiện nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {[...grouped.entries()].map(([dateLabel, items]) => (
        <div key={dateLabel}>
          {/* Date header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <h3 className="text-sm text-gray-700 capitalize">{dateLabel}</h3>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] text-gray-400">{items.length} sự kiện</span>
          </div>

          {/* Events */}
          <div className="space-y-2">
            {items.map((ev) => {
              const cfg = CALENDAR_EVENT_TYPE_CONFIG[ev.type];
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => onSelectEvent(ev)}
                  className="w-full text-left bg-white rounded-xl border border-gray-100 p-3 hover:shadow-sm transition-shadow group"
                >
                  <div className="flex items-start gap-3">
                    <span className={`p-2 rounded-lg ${cfg.bgColor} ${cfg.color} flex-shrink-0`}>
                      {EVENT_TYPE_ICONS[ev.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm text-gray-900 truncate">{ev.title}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${cfg.bgColor} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.startTime} – {ev.endTime}
                        </span>
                        {ev.contactName && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {ev.contactName}
                          </span>
                        )}
                        {ev.isOnline ? (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Video className="w-3 h-3" /> Online
                          </span>
                        ) : ev.location ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {ev.location}
                          </span>
                        ) : null}
                        {ev.isAIGenerated && (
                          <span className="flex items-center gap-1 text-violet-600">
                            <Bot className="w-3 h-3" /> AI
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * Event Detail Modal
 * ============================================================ */
function EventDetailModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const cfg = CALENDAR_EVENT_TYPE_CONFIG[event.type];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className={`p-4 border-b ${cfg.bgColor.split(" ")[0]}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${cfg.bgColor} ${cfg.color}`}>{EVENT_TYPE_ICONS[event.type]}</span>
              <div>
                <h3 className="text-gray-900 text-sm">{event.title}</h3>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>
              </div>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            {new Date(event.date).toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            {event.startTime} – {event.endTime}
          </div>

          {event.contactName && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              {event.contactName} {event.company && `· ${event.company}`}
            </div>
          )}

          {event.dealTitle && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4 text-gray-400" />
              {event.dealTitle}
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              {event.location}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            {event.isOnline ? <Video className="w-4 h-4 text-blue-500" /> : <MapPin className="w-4 h-4 text-amber-500" />}
            {event.isOnline ? "Họp trực tuyến" : "Gặp trực tiếp"}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            Phụ trách: {event.assignedTo}
            {event.isAIGenerated && (
              <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Bot className="w-3 h-3" /> AI đề xuất
              </span>
            )}
          </div>

          {event.notes && (
            <div className="bg-violet-50 border border-violet-100 rounded-lg p-3">
              <p className="text-xs text-violet-600 flex items-center gap-1 mb-1">
                <Bot className="w-3 h-3" /> Ghi chú AI
              </p>
              <p className="text-sm text-violet-800">{event.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => { toast.success("Đã xác nhận sự kiện"); onClose(); }}
              className="flex-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
            >
              Xác nhận
            </button>
            <button
              type="button"
              onClick={() => { toast.info("Đã hoãn sự kiện"); onClose(); }}
              className="flex-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Hoãn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Compact Event Badge (trong ô lịch)
 * ============================================================ */
function EventBadge({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const cfg = CALENDAR_EVENT_TYPE_CONFIG[event.type];
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`w-full text-left px-1.5 py-0.5 rounded border text-[10px] truncate flex items-center gap-0.5 hover:opacity-80 transition-opacity ${cfg.bgColor} ${cfg.color}`}
    >
      {EVENT_TYPE_ICONS[event.type]}
      <span className="truncate">{event.startTime} {event.title}</span>
      {event.isAIGenerated && <Bot className="w-2.5 h-2.5 flex-shrink-0 opacity-60" />}
    </button>
  );
}

/* ============================================================
 * Week View — Danh sách sự kiện theo ngày
 * ============================================================ */
function WeekView({
  weekDates,
  events,
  today,
  onSelectEvent,
}: {
  weekDates: Date[];
  events: CalendarEvent[];
  today: string;
  onSelectEvent: (ev: CalendarEvent) => void;
}) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7h-18h

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header ngày */}
      <div className="grid grid-cols-8 border-b border-gray-100">
        <div className="p-2 text-center text-xs text-gray-400 border-r border-gray-50">Giờ</div>
        {weekDates.map((d) => {
          const key = formatDateKey(d);
          const isToday = key === today;
          return (
            <div key={key} className={`p-2 text-center border-r border-gray-50 last:border-r-0 ${isToday ? "bg-violet-50" : ""}`}>
              <p className="text-[10px] text-gray-400">{CALENDAR_WEEKDAYS[d.getDay()]}</p>
              <p className={`text-sm ${isToday ? "text-violet-700 bg-violet-600 text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto" : "text-gray-700"}`}>
                {d.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Grid giờ */}
      <div className="max-h-[500px] overflow-y-auto">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-50 min-h-[48px]">
            <div className="p-1 text-[10px] text-gray-400 text-right pr-2 border-r border-gray-50">
              {String(hour).padStart(2, "0")}:00
            </div>
            {weekDates.map((d) => {
              const dateKey = formatDateKey(d);
              const hourEvents = events.filter((ev) => {
                const h = parseInt(ev.startTime.split(":")[0], 10);
                return ev.date === dateKey && h === hour;
              });
              const isToday = dateKey === today;
              return (
                <div key={dateKey} className={`p-0.5 border-r border-gray-50 last:border-r-0 ${isToday ? "bg-violet-50/30" : ""}`}>
                  {hourEvents.map((ev) => {
                    const cfg = CALENDAR_EVENT_TYPE_CONFIG[ev.type];
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => onSelectEvent(ev)}
                        className={`w-full text-left p-1 rounded border text-[9px] mb-0.5 hover:opacity-80 transition-opacity ${cfg.bgColor} ${cfg.color}`}
                      >
                        <div className="flex items-center gap-0.5 truncate">
                          {EVENT_TYPE_ICONS[ev.type]}
                          <span className="truncate">{ev.title}</span>
                        </div>
                        <p className="text-[8px] opacity-70">{ev.startTime}–{ev.endTime}</p>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Create Event Modal
 * ============================================================ */
function CreateEventModal({ onClose, onSave, defaultDate }: {
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  defaultDate: string;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<CalendarEventType>("meeting");
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [contactName, setContactName] = useState("");
  const [company, setCompany] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  const handleSave = () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề"); return; }
    onSave({
      id: `ev-new-${Date.now()}`,
      title: title.trim(),
      type,
      date,
      startTime,
      endTime,
      contactName: contactName || undefined,
      company: company || undefined,
      isOnline,
      assignedTo: "Nguyễn Văn An",
      isAIGenerated: false,
      priority: "medium",
    });
    toast.success("Đã tạo sự kiện mới");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-violet-600" /> Tạo sự kiện mới
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Họp với khách hàng"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Loại sự kiện</label>
            <select value={type} onChange={(e) => setType(e.target.value as CalendarEventType)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {Object.entries(CALENDAR_EVENT_TYPE_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Bắt đầu</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kết thúc</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Liên hệ</label>
              <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Tên liên hệ"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Công ty</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Tên công ty"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)}
              className="w-4 h-4 rounded text-violet-600" />
            <span className="text-sm text-gray-600">Họp trực tuyến</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            Huỷ
          </button>
          <button type="button" onClick={handleSave}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">
            Tạo sự kiện
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 3)); // 03/03/2026
  const [calendarViewMode, setCalendarViewMode] = useState<"month" | "week">("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<CalendarEventType | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  /* View mode: calendar / table / list */
  const { mode: viewMode, setMode: setViewMode } = useViewMode("calendar-view", "table");

  const today = "2026-03-03";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (filterType) result = result.filter((e) => e.type === filterType);
    if (filterAssignee) result = result.filter((e) => e.assignedTo === filterAssignee);
    if (filterPriority) result = result.filter((e) => e.priority === filterPriority);
    // Sort by date then time for table/list view
    return result.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  }, [events, filterType, filterAssignee, filterPriority]);

  /* Pagination for list view */
  const {
    paginatedItems: listPaginatedItems,
    currentPage: listPage,
    totalPages: listTotalPages,
    totalItems: listTotal,
    pageSize: listPageSize,
    isFirstPage: listFirstPage,
    isLastPage: listLastPage,
    startIndex: listStart,
    endIndex: listEnd,
    goToPage: listGoToPage,
    nextPage: listNextPage,
    prevPage: listPrevPage,
    setPageSize: listSetPageSize,
  } = usePagination(filteredEvents, { storageKey: "calendar-list-pagination" });

  const navigate = useCallback((dir: -1 | 1) => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (calendarViewMode === "month") next.setMonth(next.getMonth() + dir);
      else next.setDate(next.getDate() + 7 * dir);
      return next;
    });
  }, [calendarViewMode]);

  const goToday = () => setCurrentDate(new Date(2026, 2, 3));

  /* ---- Month View Data ---- */
  const monthGrid = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrev = getDaysInMonth(prevYear, prevMonth);

    const cells: { date: Date; isCurrentMonth: boolean }[] = [];
    // Ngày tháng trước
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ date: new Date(prevYear, prevMonth, daysInPrev - i), isCurrentMonth: false });
    }
    // Ngày tháng hiện tại
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    // Ngày tháng sau
    const remaining = 42 - cells.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ date: new Date(nextYear, nextMonth, d), isCurrentMonth: false });
    }
    return cells;
  }, [year, month]);

  /* ---- Week View Data ---- */
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    const thisMonth = events.filter((e) => e.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`));
    const aiGenerated = thisMonth.filter((e) => e.isAIGenerated).length;
    const highPriority = thisMonth.filter((e) => e.priority === "high").length;
    return { total: thisMonth.length, aiGenerated, highPriority };
  }, [events, year, month]);

  const monthLabel = currentDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
  const weekLabel = `${weekDates[0].toLocaleDateString("vi-VN", { day: "numeric", month: "short" })} – ${weekDates[6].toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" })}`;

  const hasFilters = !!filterType || !!filterAssignee || !!filterPriority;

  useEffect(() => {
    fetchCalendarEvents().then((data) => setEvents(data));
  }, []);

  /* Inline edit handler */
  const handleInlineEdit = useCallback(
    async (id: string, field: string, value: unknown) => {
      await updateCalendarEvent(id, { [field]: value });
      const updated = await fetchCalendarEvents();
      setEvents(updated);
      toast.success(`Đã cập nhật ${field}`);
    },
    [],
  );

  /* Bulk delete */
  const handleBulkDelete = useCallback(async (ids: string[]) => {
    for (const id of ids) {
      await deleteCalendarEvent(id);
    }
    const updated = await fetchCalendarEvents();
    setEvents(updated);
    toast.success(`Đã xóa ${ids.length} sự kiện`);
  }, []);

  /* Single delete action */
  const handleDeleteConfirm = useCallback(
    async () => {
      if (!deleteTargetId) return;
      await deleteCalendarEvent(deleteTargetId);
      const updated = await fetchCalendarEvents();
      setEvents(updated);
      setDeleteTargetId(null);
      toast.success("Đã xóa sự kiện");
    },
    [deleteTargetId],
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-violet-600" /> Lịch hẹn CRM
          </h1>
          <p className="text-gray-500 mt-0.5">
            Quản lý cuộc họp, follow-up, deadline và sự kiện
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={viewMode} onSetMode={setViewMode} modes={["table", "list"]} />
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tạo sự kiện
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Sự kiện tháng này</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
          <p className="text-lg text-violet-700 flex items-center justify-center gap-1">
            <Bot className="w-4 h-4" /> {stats.aiGenerated}
          </p>
          <p className="text-xs text-violet-600">AI đề xuất</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-3 text-center">
          <p className="text-lg text-red-700">{stats.highPriority}</p>
          <p className="text-xs text-red-600">Ưu tiên cao</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterType ?? ""}
            onChange={(e) => setFilterType((e.target.value || null) as CalendarEventType | null)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
          >
            <option value="">Tất cả loại</option>
            {Object.entries(CALENDAR_EVENT_TYPE_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <select
            value={filterAssignee ?? ""}
            onChange={(e) => setFilterAssignee(e.target.value || null)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
          >
            <option value="">Tất cả người phụ trách</option>
            {CRM_ASSIGNEE_NAMES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <select
            value={filterPriority ?? ""}
            onChange={(e) => setFilterPriority(e.target.value || null)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
          >
            <option value="">Tất cả ưu tiên</option>
            <option value="high">Cao</option>
            <option value="medium">Vừa</option>
            <option value="low">Thấp</option>
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setFilterType(null);
                setFilterAssignee(null);
                setFilterPriority(null);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg"
            >
              <X className="w-3.5 h-3.5" /> Xoá lọc
            </button>
          )}

          {viewMode === "table" && (
            <>
              <div className="flex-1" />
              <p className="text-xs text-gray-500">
                {filteredEvents.length} sự kiện
              </p>
            </>
          )}
        </div>
      </div>

      {/* View: Table, List, or Calendar (legacy) */}
      {viewMode === "table" ? (
        <DataTable
          data={filteredEvents}
          columns={CALENDAR_COLUMNS}
          storageKey="calendar-table"
          defaultSortField="date"
          onInlineEdit={handleInlineEdit}
          onBulkDelete={handleBulkDelete}
          selectable={true}
          showToolbar={true}
          emptyMessage="Không có sự kiện nào"
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedEvent(item)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Xem chi tiết"
              >
                <Pencil className="w-3.5 h-3.5 text-gray-500" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTargetId(item.id)}
                className="p-1 hover:bg-red-50 rounded transition-colors"
                title="Xóa"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          )}
        />
      ) : viewMode === "list" ? (
        <>
          <ListView events={listPaginatedItems} onSelectEvent={setSelectedEvent} />
          {listTotal > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <PaginationBar
                currentPage={listPage}
                totalPages={listTotalPages}
                totalItems={listTotal}
                pageSize={listPageSize}
                startIndex={listStart}
                endIndex={listEnd}
                isFirstPage={listFirstPage}
                isLastPage={listLastPage}
                onGoToPage={listGoToPage}
                onNextPage={listNextPage}
                onPrevPage={listPrevPage}
                onSetPageSize={listSetPageSize}
              />
            </div>
          )}
        </>
      ) : null}

      {/* Legacy calendar views can be added as 3rd mode if needed */}

      {/* Modals */}
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      {showCreate && (
        <CreateEventModal
          defaultDate={today}
          onClose={() => setShowCreate(false)}
          onSave={(ev) => {
            createCalendarEvent(ev).then((newEvent) => setEvents((prev) => [...prev, newEvent]));
          }}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemName={events.find((e) => e.id === deleteTargetId)?.title ?? ""}
        entityType="sự kiện"
        description="Sự kiện đã xoá không thể khôi phục."
      />
    </div>
  );
}