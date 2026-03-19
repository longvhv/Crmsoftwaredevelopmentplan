/**
 * Trang Nhật ký Hoạt động — Timeline tất cả activities, filter theo loại/người.
 * Phase F5-04→F5-05: DataTable view + pagination + View toggle Timeline/Table
 */
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Phone,
  Mail,
  Video,
  FileText,
  CheckSquare,
  Bot,
  Clock,
  X,
  User,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { Activity, ActivityType } from "../../types/crm";
import type { ColumnDef, ViewMode } from "../../types/dataTable";
import { fetchActivities, getEmployeeName, createActivity } from "../../api/crmApi";
import { ACTIVITY_TYPE_CONFIG } from "../../constants/crmConfig";
import { ActivityFormModal } from "../../components/crm/ActivityFormModal";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Icon map cho loại hoạt động
 * ============================================================ */
const TYPE_ICONS: Record<ActivityType, React.ReactNode> = {
  call: <Phone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  meeting: <Video className="w-4 h-4" />,
  note: <FileText className="w-4 h-4" />,
  task: <CheckSquare className="w-4 h-4" />,
};

const TYPE_COLORS: Record<ActivityType, string> = {
  call: "bg-green-100 text-green-700 border-green-200",
  email: "bg-blue-100 text-blue-700 border-blue-200",
  meeting: "bg-violet-100 text-violet-700 border-violet-200",
  note: "bg-amber-100 text-amber-700 border-amber-200",
  task: "bg-slate-100 text-slate-700 border-slate-200",
};

const TIMELINE_LINE_COLORS: Record<ActivityType, string> = {
  call: "bg-green-400",
  email: "bg-blue-400",
  meeting: "bg-violet-400",
  note: "bg-amber-400",
  task: "bg-slate-400",
};

/* ============================================================
 * Định dạng ngày giờ
 * ============================================================ */
function formatDateTime(iso: string): { date: string; time: string; relative: string } {
  const d = new Date(iso);
  const now = new Date("2026-03-03T12:00:00");
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  let relative: string;
  if (diffHours < 1) relative = "Vừa xong";
  else if (diffHours < 24) relative = `${diffHours} giờ trước`;
  else {
    const diffDays = Math.floor(diffHours / 24);
    relative = `${diffDays} ngày trước`;
  }

  const date = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return { date, time, relative };
}

/* ============================================================
 * Nhóm activities theo ngày
 * ============================================================ */
function groupByDate(items: Activity[]): Map<string, Activity[]> {
  const groups = new Map<string, Activity[]>();
  for (const item of items) {
    const dateKey = new Date(item.performedAt).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const existing = groups.get(dateKey);
    if (existing) existing.push(item);
    else groups.set(dateKey, [item]);
  }
  return groups;
}

/* ============================================================
 * Activity Item trong timeline
 * ============================================================ */
function ActivityItem({ activity }: { activity: Activity }) {
  const typeConfig = ACTIVITY_TYPE_CONFIG[activity.type];
  const { time, relative } = formatDateTime(activity.performedAt);
  const performerName = getEmployeeName(activity.performedBy);

  return (
    <div className="flex gap-3 group">
      {/* Timeline dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${TYPE_COLORS[activity.type]}`}>
          {TYPE_ICONS[activity.type]}
        </div>
        <div className={`w-0.5 flex-1 ${TIMELINE_LINE_COLORS[activity.type]} opacity-30 mt-1`} />
      </div>

      {/* Nội dung */}
      <div className="flex-1 pb-5">
        <div className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm text-gray-900">{activity.title}</h4>
            <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${TYPE_COLORS[activity.type]}`}>
              {typeConfig.label}
            </span>
          </div>

          {activity.description && (
            <p className="text-xs text-gray-500 mb-2">{activity.description}</p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {/* Người thực hiện */}
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              {activity.isAutoLogged ? (
                <Bot className="w-3 h-3 text-violet-500" />
              ) : (
                <User className="w-3 h-3 text-gray-400" />
              )}
              {performerName}
            </span>

            {/* Thời gian */}
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {time}
            </span>

            {/* Relative time */}
            <span className="text-[10px] text-gray-400">{relative}</span>

            {/* Thời lượng */}
            {activity.duration && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                {activity.duration} phút
              </span>
            )}

            {/* AI badge */}
            {activity.isAutoLogged && (
              <span className="text-[10px] bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Bot className="w-2.5 h-2.5" /> Tự động
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Thống kê tóm tắt
 * ============================================================ */
function ActivityStats({ activities: items }: { activities: Activity[] }) {
  const total = items.length;
  const aiCount = items.filter((a) => a.isAutoLogged).length;
  const humanCount = total - aiCount;
  const typeCounts = items.reduce(
    (acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const totalDuration = items.reduce((sum, a) => sum + (a.duration || 0), 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
        <p className="text-xl text-gray-900">{total}</p>
        <p className="text-xs text-gray-500">Tổng hoạt động</p>
      </div>
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
        <p className="text-xl text-blue-700">{humanCount}</p>
        <p className="text-xs text-blue-600">Con người</p>
      </div>
      <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
        <p className="text-xl text-violet-700">{aiCount}</p>
        <p className="text-xs text-violet-600">AI tự động</p>
      </div>
      <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
        <p className="text-xl text-green-700">{typeCounts.call || 0}</p>
        <p className="text-xs text-green-600">Cuộc gọi</p>
      </div>
      <div className="bg-amber-50 rounded-xl border border-amber-100 p-3 text-center">
        <p className="text-xl text-amber-700">{totalDuration}</p>
        <p className="text-xs text-amber-600">Phút ho���t động</p>
      </div>
    </div>
  );
}

/* ============================================================
 * Column Definitions cho DataTable
 * ============================================================ */
const ACTIVITY_COLUMNS: ColumnDef<Activity>[] = [
  {
    key: "type",
    header: "Loại",
    sortable: true,
    minWidth: 120,
    render: (item) => {
      const config = ACTIVITY_TYPE_CONFIG[item.type];
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs ${TYPE_COLORS[item.type]}`}>
          {TYPE_ICONS[item.type]}
          <span>{config.label}</span>
        </div>
      );
    },
    sortValue: (item) => item.type,
  },
  {
    key: "title",
    header: "Tiêu đề",
    sortable: true,
    minWidth: 200,
    render: (item) => (
      <div>
        <p className="text-gray-900 text-sm truncate">{item.title}</p>
        {item.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>
        )}
      </div>
    ),
  },
  {
    key: "performedBy",
    header: "Người thực hiện",
    sortable: true,
    minWidth: 140,
    render: (item) => {
      const name = getEmployeeName(item.performedBy);
      return (
        <div className="flex items-center gap-1.5">
          {item.isAutoLogged ? (
            <Bot className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
          ) : (
            <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          )}
          <span className="text-gray-700 text-sm truncate">{name}</span>
        </div>
      );
    },
    sortValue: (item) => getEmployeeName(item.performedBy),
  },
  {
    key: "performedAt",
    header: "Thời gian",
    sortable: true,
    minWidth: 140,
    render: (item) => {
      const { date, time, relative } = formatDateTime(item.performedAt);
      return (
        <div>
          <p className="text-gray-700 text-[13px]">{date} {time}</p>
          <p className="text-xs text-gray-400">{relative}</p>
        </div>
      );
    },
    sortValue: (item) => new Date(item.performedAt),
  },
  {
    key: "duration",
    header: "Thời lượng",
    sortable: true,
    defaultHidden: false,
    minWidth: 90,
    render: (item) =>
      item.duration ? (
        <span className="text-sm text-gray-600">{item.duration} phút</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
    sortValue: (item) => item.duration ?? 0,
  },
  {
    key: "isAutoLogged",
    header: "Nguồn",
    sortable: true,
    defaultHidden: true,
    minWidth: 100,
    render: (item) =>
      item.isAutoLogged ? (
        <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded">
          <Bot className="w-3 h-3" /> AI tự động
        </span>
      ) : (
        <span className="text-xs text-gray-500">Thủ công</span>
      ),
  },
  {
    key: "contactId",
    header: "Liên hệ",
    sortable: false,
    defaultHidden: true,
    minWidth: 80,
    render: (item) =>
      item.contactId ? (
        <span className="text-xs text-blue-600">#{item.contactId}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: "dealId",
    header: "Deal",
    sortable: false,
    defaultHidden: true,
    minWidth: 80,
    render: (item) =>
      item.dealId ? (
        <span className="text-xs text-green-600">#{item.dealId}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
];

/* ============================================================
 * Trang chính
 * ============================================================ */
export function ActivitiesPage() {
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [filterType, setFilterType] = useState<ActivityType | null>(null);
  const [filterAutoLogged, setFilterAutoLogged] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* View mode: timeline (list) vs table */
  const { mode: viewMode, setMode: setViewMode } = useViewMode("activities-view", "list");

  useEffect(() => {
    fetchActivities().then(setAllActivities);
  }, []);

  const filtered = useMemo(() => {
    let result = [...allActivities];
    if (filterType) result = result.filter((a) => a.type === filterType);
    if (filterAutoLogged !== null) result = result.filter((a) => a.isAutoLogged === filterAutoLogged);
    return result;
  }, [allActivities, filterType, filterAutoLogged]);

  /* Pagination for timeline view */
  const {
    paginatedItems: timelinePaginatedItems,
    currentPage: timelinePage,
    totalPages: timelineTotalPages,
    totalItems: timelineTotal,
    pageSize: timelinePageSize,
    isFirstPage: timelineFirstPage,
    isLastPage: timelineLastPage,
    startIndex: timelineStart,
    endIndex: timelineEnd,
    goToPage: timelineGoToPage,
    nextPage: timelineNextPage,
    prevPage: timelinePrevPage,
    setPageSize: timelineSetPageSize,
  } = usePagination(filtered, { storageKey: "activities-timeline-pagination" });

  const grouped = useMemo(() => groupByDate(timelinePaginatedItems), [timelinePaginatedItems]);
  const hasFilters = !!filterType || filterAutoLogged !== null;

  const activityTypes: ActivityType[] = ["call", "email", "meeting", "note", "task"];

  const handleCreateActivity = useCallback(async (data: Omit<Activity, "id">) => {
    await createActivity(data);
    const refreshed = await fetchActivities();
    setAllActivities(refreshed);
    toast.success(`Đã ghi nhận hoạt động "${data.title}"`);
  }, []);

  /* Inline edit handler cho table view */
  const handleInlineEdit = useCallback(
    async (id: string, field: string, value: unknown) => {
      // Trong phase sau sẽ gọi updateActivity API
      toast.info(`Inline edit: ${field} = ${value}`);
    },
    [],
  );

  return (
    <div className="space-y-5">
      {/* Tiêu đề */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-gray-900">Nhật ký Hoạt động</h1>
          <p className="text-gray-500 mt-1">
            Timeline mọi tương tác · Event Sourcing · AI-Ready Structured Data
          </p>
        </div>
        <ViewToggle mode={viewMode} onSetMode={setViewMode} modes={["table", "list"]} />
      </header>

      {/* Thống kê */}
      <ActivityStats activities={filtered} />

      {/* Bộ lọc */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Lọc theo loại */}
          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg flex-wrap">
            <button
              type="button"
              onClick={() => setFilterType(null)}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-all ${
                !filterType ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tất cả
            </button>
            {activityTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(filterType === t ? null : t)}
                className={`px-2 py-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                  filterType === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {TYPE_ICONS[t]}
                <span className="hidden sm:inline">{ACTIVITY_TYPE_CONFIG[t].label}</span>
              </button>
            ))}
          </div>

          {/* Lọc Human/AI */}
          <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setFilterAutoLogged(null)}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-all ${
                filterAutoLogged === null ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilterAutoLogged(false)}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                filterAutoLogged === false ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User className="w-3 h-3" /> Human
            </button>
            <button
              type="button"
              onClick={() => setFilterAutoLogged(true)}
              className={`px-2.5 py-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                filterAutoLogged === true ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Bot className="w-3 h-3" /> AI
            </button>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={() => { setFilterType(null); setFilterAutoLogged(null); }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg"
            >
              <X className="w-3.5 h-3.5" /> Xoá lọc
            </button>
          )}
        </div>
      </div>

      {/* Kết quả */}
      <p className="text-sm text-gray-500">
        Hiển thị <span className="text-gray-900">{filtered.length}</span> / {allActivities.length} hoạt động
      </p>

      {/* View: Table or Timeline */}
      {viewMode === "table" ? (
        <DataTable
          data={filtered}
          columns={ACTIVITY_COLUMNS}
          storageKey="activities-table"
          defaultSortField="performedAt"
          onInlineEdit={handleInlineEdit}
          emptyMessage="Không có hoạt động nào"
          showToolbar={true}
        />
      ) : (
        <>
          {/* Timeline */}
          <div className="max-w-3xl">
            {[...grouped.entries()].map(([dateLabel, items]) => (
              <div key={dateLabel} className="mb-6">
                {/* Tiêu đề ngày */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <h3 className="text-sm text-gray-700 capitalize">{dateLabel}</h3>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[10px] text-gray-400">{items.length} hoạt động</span>
                </div>

                {/* Các items */}
                <div className="ml-1">
                  {items.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Không có hoạt động nào phù hợp</p>
              </div>
            )}
          </div>

          {/* Pagination cho timeline view */}
          {timelineTotal > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <PaginationBar
                currentPage={timelinePage}
                totalPages={timelineTotalPages}
                totalItems={timelineTotal}
                pageSize={timelinePageSize}
                startIndex={timelineStart}
                endIndex={timelineEnd}
                isFirstPage={timelineFirstPage}
                isLastPage={timelineLastPage}
                onGoToPage={timelineGoToPage}
                onNextPage={timelineNextPage}
                onPrevPage={timelinePrevPage}
                onSetPageSize={timelineSetPageSize}
              />
            </div>
          )}
        </>
      )}

      {/* Modal tạo hoạt động */}
      <ActivityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateActivity}
      />

      {/* Nút thêm hoạt động */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-5 right-5 flex items-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 transition-colors z-20"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline text-sm">Ghi nhận</span>
      </button>
    </div>
  );
}