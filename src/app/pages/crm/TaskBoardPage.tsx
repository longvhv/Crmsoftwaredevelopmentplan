/**
 * Trang Task Board — Quản lý công việc: Kanban + Table + List.
 * Drag & drop giữa các cột, filter, tạo task mới.
 * Phase P1.02: Board + Table + List view, full CRUD, filters, pagination
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  LayoutGrid, Plus, Clock, User, Flag, Bot, CheckCircle2,
  Circle, AlertCircle, X, Search, GripVertical, ArrowRight,
  Calendar, Sparkles, MoreHorizontal, Trash2, ChevronRight,
  Target, Mail, Phone, Video, FileText, Pencil,
} from "lucide-react";
import { toast } from "sonner";
import type { Task, TaskStatus, TaskPriority, TaskCategory } from "../../types/crm";
import type { ColumnDef, ViewMode } from "../../types/dataTable";
import {
  TASK_STATUS_CONFIG, TASK_STATUS_ORDER,
  TASK_PRIORITY_CONFIG, TASK_CATEGORY_CONFIG,
  CRM_ASSIGNEE_NAMES,
} from "../../constants/crmConfig";
import { fetchTasks, createTask, updateTask, deleteTask as apiDeleteTask, deleteTasks } from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";

/* ============================================================
 * Icon mapping (JSX không thuộc constants layer)
 * ============================================================ */
const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  backlog: <Circle className="w-4 h-4" />,
  todo: <Clock className="w-4 h-4" />,
  "in-progress": <ArrowRight className="w-4 h-4" />,
  done: <CheckCircle2 className="w-4 h-4" />,
};

const CATEGORY_ICONS: Record<TaskCategory, React.ReactNode> = {
  "follow-up": <Phone className="w-3 h-3" />,
  meeting: <Video className="w-3 h-3" />,
  proposal: <FileText className="w-3 h-3" />,
  review: <Target className="w-3 h-3" />,
  outreach: <Mail className="w-3 h-3" />,
  admin: <Flag className="w-3 h-3" />,
};

/* ============================================================
 * Task Card Component
 * ============================================================ */
function TaskCard({
  task,
  onMove,
  onDelete,
  isDragOver,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  onMove: (to: TaskStatus) => void;
  onDelete: () => void;
  isDragOver?: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const prCfg = TASK_PRIORITY_CONFIG[task.priority];
  const catCfg = TASK_CATEGORY_CONFIG[task.category];
  const [showMenu, setShowMenu] = useState(false);

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "done";
  const nextStatuses = TASK_STATUS_ORDER.filter((s) => s !== task.status);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-sm ${
        isDragOver ? "border-violet-400 shadow-md" : "border-gray-100"
      }`}
    >
      {/* Top: priority + category */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${prCfg.bgColor} ${prCfg.color}`}>
            {prCfg.label}
          </span>
          <span className={`flex items-center gap-0.5 text-[10px] ${catCfg.color}`}>
            {CATEGORY_ICONS[task.category]} {catCfg.label}
          </span>
        </div>
        <div className="relative">
          <button type="button" onClick={() => setShowMenu(!showMenu)}
            className="text-gray-300 hover:text-gray-500 p-0.5">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-5 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36"
              onMouseLeave={() => setShowMenu(false)}>
              {nextStatuses.map((s) => (
                <button key={s} type="button"
                  onClick={() => { onMove(s); setShowMenu(false); }}
                  className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                  <ChevronRight className="w-3 h-3" />
                  {TASK_STATUS_CONFIG[s].label}
                </button>
              ))}
              <hr className="my-1 border-gray-100" />
              <button type="button"
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">
                <Trash2 className="w-3 h-3" /> Xoá
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm text-gray-900 mb-1 line-clamp-2">
        {task.isAISuggested && <Bot className="w-3 h-3 text-violet-500 inline mr-1" />}
        {task.title}
      </h4>

      {/* Contact/Deal */}
      {(task.contactName || task.dealName) && (
        <p className="text-[10px] text-gray-400 mb-1.5 truncate">
          {task.contactName && <span className="mr-2">👤 {task.contactName}</span>}
          {task.dealName && <span>🎯 {task.dealName}</span>}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-0.5 mb-2">
          {task.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[8px] px-1 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100">
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="text-[8px] text-gray-300">+{task.tags.length - 2}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span className="flex items-center gap-0.5 truncate">
          <User className="w-3 h-3" />
          {task.assignee.length > 12 ? task.assignee.slice(0, 12) + "…" : task.assignee}
        </span>
        <span className={`flex items-center gap-0.5 ${isOverdue ? "text-red-500" : ""}`}>
          <Calendar className="w-3 h-3" />
          {new Date(task.dueDate).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
          {isOverdue && <AlertCircle className="w-3 h-3" />}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Task Modal
 * ============================================================ */
function CreateTaskModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (task: Task) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [category, setCategory] = useState<TaskCategory>("follow-up");
  const [assignee, setAssignee] = useState(CRM_ASSIGNEE_NAMES[0]);
  const [dueDate, setDueDate] = useState("2026-03-10");

  const handleSave = () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề"); return; }
    onSave({
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category,
      assignee,
      dueDate,
      isAISuggested: false,
      createdDate: "2026-03-03",
      tags: [],
    });
    toast.success("Đã tạo công việc mới");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-violet-600" /> Tạo công việc mới
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Gọi follow-up khách hàng"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Chi tiết..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {TASK_STATUS_ORDER.map((s) => <option key={s} value={s}>{TASK_STATUS_CONFIG[s].label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ưu tiên</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {(Object.keys(TASK_PRIORITY_CONFIG) as TaskPriority[]).map((p) => (
                  <option key={p} value={p}>{TASK_PRIORITY_CONFIG[p].label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phân loại</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {(Object.keys(TASK_CATEGORY_CONFIG) as TaskCategory[]).map((c) => (
                  <option key={c} value={c}>{TASK_CATEGORY_CONFIG[c].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Hạn chót</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Giao cho</label>
            <select value={assignee} onChange={(e) => setAssignee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {CRM_ASSIGNEE_NAMES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            Huỷ
          </button>
          <button type="button" onClick={handleSave}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Kanban Column
 * ============================================================ */
function KanbanColumn({
  status,
  tasks,
  onMove,
  onDelete,
  dragItem,
  onDrop,
  onDragStart,
  onDragEnd,
}: {
  status: TaskStatus;
  tasks: Task[];
  onMove: (taskId: string, to: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  dragItem: string | null;
  onDrop: (status: TaskStatus) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}) {
  const cfg = TASK_STATUS_CONFIG[status];
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={`flex flex-col rounded-xl border ${isDragOver ? "border-violet-300 bg-violet-50/30" : "border-gray-100 bg-gray-50/50"} transition-colors`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); onDrop(status); }}
    >
      {/* Column header */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl border-b ${cfg.headerColor}`}>
        <div className={`flex items-center gap-1.5 text-sm ${cfg.color}`}>
          {STATUS_ICONS[status]}
          {cfg.label}
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/70 text-gray-500">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 min-h-[200px] overflow-y-auto max-h-[calc(100vh-320px)]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={(to) => onMove(task.id, to)}
            onDelete={() => onDelete(task.id)}
            isDragOver={isDragOver && dragItem === task.id}
            onDragStart={() => onDragStart(task.id)}
            onDragEnd={onDragEnd}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-300 text-xs">
            Không có công việc
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Column Definitions cho DataTable
 * ============================================================ */
const TASK_COLUMNS: ColumnDef<Task>[] = [
  {
    key: "status",
    header: "Trạng thái",
    sortable: true,
    minWidth: 110,
    render: (item) => {
      const cfg = TASK_STATUS_CONFIG[item.status];
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs ${cfg.bgColor} ${cfg.color}`}>
          {STATUS_ICONS[item.status]}
          <span>{cfg.label}</span>
        </div>
      );
    },
    sortValue: (item) => TASK_STATUS_ORDER.indexOf(item.status),
  },
  {
    key: "title",
    header: "Tiêu đề",
    sortable: true,
    editable: true,
    minWidth: 200,
    render: (item) => (
      <div>
        <p className="text-gray-900 text-sm truncate flex items-center gap-1">
          {item.isAISuggested && <Bot className="w-3 h-3 text-violet-500" />}
          {item.title}
        </p>
        {item.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>
        )}
      </div>
    ),
  },
  {
    key: "priority",
    header: "Ưu tiên",
    sortable: true,
    minWidth: 90,
    render: (item) => {
      const cfg = TASK_PRIORITY_CONFIG[item.priority];
      return (
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>
          {cfg.label}
        </span>
      );
    },
    sortValue: (item) => ["urgent", "high", "medium", "low"].indexOf(item.priority),
  },
  {
    key: "category",
    header: "Phân loại",
    sortable: true,
    minWidth: 100,
    render: (item) => {
      const cfg = TASK_CATEGORY_CONFIG[item.category];
      return (
        <span className={`inline-flex items-center gap-1 text-xs ${cfg.color}`}>
          {CATEGORY_ICONS[item.category]} {cfg.label}
        </span>
      );
    },
  },
  {
    key: "assignee",
    header: "Người thực hiện",
    sortable: true,
    minWidth: 140,
    render: (item) => (
      <div className="flex items-center gap-1.5">
        <User className="w-3 h-3 text-gray-400" />
        <span className="text-sm text-gray-700 truncate">{item.assignee}</span>
      </div>
    ),
  },
  {
    key: "dueDate",
    header: "Hạn chót",
    sortable: true,
    minWidth: 100,
    render: (item) => {
      const isOverdue = new Date(item.dueDate) < new Date() && item.status !== "done";
      const d = new Date(item.dueDate);
      return (
        <div className={`flex items-center gap-1 text-sm ${isOverdue ? "text-red-600" : "text-gray-700"}`}>
          <Calendar className="w-3 h-3" />
          {d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
          {isOverdue && <AlertCircle className="w-3 h-3" />}
        </div>
      );
    },
    sortValue: (item) => new Date(item.dueDate),
  },
  {
    key: "contactName",
    header: "Liên hệ",
    sortable: false,
    defaultHidden: true,
    minWidth: 120,
    render: (item) =>
      item.contactName ? (
        <span className="text-xs text-gray-600 truncate">{item.contactName}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: "dealName",
    header: "Deal",
    sortable: false,
    defaultHidden: true,
    minWidth: 120,
    render: (item) =>
      item.dealName ? (
        <span className="text-xs text-green-600 truncate">{item.dealName}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: "tags",
    header: "Tags",
    sortable: false,
    defaultHidden: true,
    minWidth: 150,
    render: (item) =>
      item.tags.length > 0 ? (
        <div className="flex flex-wrap gap-0.5">
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[9px] px-1 py-0.5 rounded bg-gray-100 text-gray-500">
              {tag}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="text-[9px] text-gray-400">+{item.tags.length - 2}</span>
          )}
        </div>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
  {
    key: "isAISuggested",
    header: "AI",
    sortable: true,
    defaultHidden: true,
    minWidth: 70,
    render: (item) =>
      item.isAISuggested ? (
        <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded">
          <Bot className="w-3 h-3" />
        </span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
  },
];

/* ============================================================
 * List View — Timeline/Card style cho mobile
 * ============================================================ */
function ListView({ tasks, onSelectTask }: { tasks: Task[]; onSelectTask: (task: Task) => void }) {
  const grouped = useMemo(() => {
    const groups = new Map<TaskStatus, Task[]>();
    for (const task of tasks) {
      const existing = groups.get(task.status);
      if (existing) existing.push(task);
      else groups.set(task.status, [task]);
    }
    return groups;
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Không có công việc nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {TASK_STATUS_ORDER.map((status) => {
        const statusTasks = grouped.get(status) || [];
        if (statusTasks.length === 0) return null;
        const cfg = TASK_STATUS_CONFIG[status];

        return (
          <div key={status}>
            {/* Status header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex items-center gap-1.5 ${cfg.color}`}>
                {STATUS_ICONS[status]}
                <h3 className="text-sm">{cfg.label}</h3>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] text-gray-400">{statusTasks.length} công việc</span>
            </div>

            {/* Tasks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {statusTasks.map((task) => {
                const prCfg = TASK_PRIORITY_CONFIG[task.priority];
                const catCfg = TASK_CATEGORY_CONFIG[task.category];
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "done";

                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onSelectTask(task)}
                    className="text-left bg-white rounded-xl border border-gray-100 p-3 hover:shadow-sm transition-shadow group"
                  >
                    {/* Top badges */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border ${prCfg.bgColor} ${prCfg.color}`}>
                        {prCfg.label}
                      </span>
                      <span className={`flex items-center gap-0.5 text-[10px] ${catCfg.color}`}>
                        {CATEGORY_ICONS[task.category]} {catCfg.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm text-gray-900 mb-1 line-clamp-2 flex items-center gap-1">
                      {task.isAISuggested && <Bot className="w-3 h-3 text-violet-500" />}
                      {task.title}
                    </h4>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1 truncate">
                        <User className="w-3 h-3" />
                        {task.assignee.split(" ").slice(-1)[0]}
                      </span>
                      <span className={`flex items-center gap-1 ${isOverdue ? "text-red-500" : ""}`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
                        {isOverdue && <AlertCircle className="w-3 h-3" />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function TaskBoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "">("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "">("");
  const [filterCategory, setFilterCategory] = useState<TaskCategory | "">("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  /* View mode: board / table / list */
  const { mode: viewMode, setMode: setViewMode } = useViewMode("taskboard-view", "table");

  useEffect(() => {
    fetchTasks().then((data) => setTasks(data));
  }, []);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) =>
        t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      );
    }
    if (filterPriority) result = result.filter((t) => t.priority === filterPriority);
    if (filterStatus) result = result.filter((t) => t.status === filterStatus);
    if (filterCategory) result = result.filter((t) => t.category === filterCategory);
    if (filterAssignee) result = result.filter((t) => t.assignee === filterAssignee);
    return result;
  }, [tasks, search, filterPriority, filterStatus, filterCategory, filterAssignee]);

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
  } = usePagination(filteredTasks, { storageKey: "taskboard-list-pagination" });

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = { backlog: [], todo: [], "in-progress": [], done: [] };
    for (const task of filteredTasks) {
      grouped[task.status].push(task);
    }
    // Sort by priority within each column
    const priorityOrder: TaskPriority[] = ["urgent", "high", "medium", "low"];
    for (const status of TASK_STATUS_ORDER) {
      grouped[status].sort((a, b) =>
        priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority),
      );
    }
    return grouped;
  }, [filteredTasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    overdue: tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "done").length,
    aiTasks: tasks.filter((t) => t.isAISuggested).length,
    doneThisWeek: tasks.filter((t) => t.status === "done").length,
  }), [tasks]);

  const hasFilters = !!search || !!filterPriority || !!filterStatus || !!filterCategory || !!filterAssignee;

  const handleMove = useCallback((taskId: string, to: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: to } : t)));
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(taskId, { status: to });
      toast.success(`"${task.title}" → ${TASK_STATUS_CONFIG[to].label}`);
    }
  }, [tasks]);

  const handleDelete = useCallback(async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    await apiDeleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (task) toast.success(`Đã xoá "${task.title}"`);
    setDeleteTargetId(null);
  }, [tasks]);

  const handleDrop = useCallback((toStatus: TaskStatus) => {
    if (dragItem) {
      handleMove(dragItem, toStatus);
      setDragItem(null);
    }
  }, [dragItem, handleMove]);

  /* Inline edit handler */
  const handleInlineEdit = useCallback(
    async (id: string, field: string, value: unknown) => {
      await updateTask(id, { [field]: value });
      const updated = await fetchTasks();
      setTasks(updated);
      toast.success(`Đã cập nhật ${field}`);
    },
    [],
  );

  /* Bulk delete */
  const handleBulkDelete = useCallback(async (ids: string[]) => {
    await deleteTasks(ids);
    const updated = await fetchTasks();
    setTasks(updated);
    toast.success(`Đã xóa ${ids.length} công việc`);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-violet-600" /> Bảng Công việc
          </h1>
          <p className="text-gray-500 mt-0.5">
            Quản lý công việc sales · Kanban / Table / List view
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={viewMode} onSetMode={setViewMode} modes={["table", "card", "list"]} />
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tạo công việc
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng công việc</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${stats.overdue > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
          <p className={`text-lg ${stats.overdue > 0 ? "text-red-700" : "text-green-700"}`}>{stats.overdue}</p>
          <p className={`text-xs ${stats.overdue > 0 ? "text-red-600" : "text-green-600"}`}>Quá hạn</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
          <p className="text-lg text-violet-700 flex items-center justify-center gap-1">
            <Bot className="w-4 h-4" /> {stats.aiTasks}
          </p>
          <p className="text-xs text-violet-600">AI tạo</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700">{stats.doneThisWeek}</p>
          <p className="text-xs text-green-600">Hoàn thành</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm công việc..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "")}
            className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả trạng thái</option>
            {TASK_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>{TASK_STATUS_CONFIG[s].label}</option>
            ))}
          </select>

          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as TaskPriority | "")}
            className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả ưu tiên</option>
            {(Object.keys(TASK_PRIORITY_CONFIG) as TaskPriority[]).map((p) => (
              <option key={p} value={p}>{TASK_PRIORITY_CONFIG[p].label}</option>
            ))}
          </select>

          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as TaskCategory | "")}
            className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả phân loại</option>
            {(Object.keys(TASK_CATEGORY_CONFIG) as TaskCategory[]).map((c) => (
              <option key={c} value={c}>{TASK_CATEGORY_CONFIG[c].label}</option>
            ))}
          </select>

          <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả người thực hiện</option>
            {CRM_ASSIGNEE_NAMES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterPriority("");
                setFilterStatus("");
                setFilterCategory("");
                setFilterAssignee("");
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
                {filteredTasks.length} công việc
              </p>
            </>
          )}
        </div>
      </div>

      {/* View: Table, Card (Kanban), or List */}
      {viewMode === "table" ? (
        <DataTable
          data={filteredTasks}
          columns={TASK_COLUMNS}
          storageKey="taskboard-table"
          defaultSortField="dueDate"
          onInlineEdit={handleInlineEdit}
          onBulkDelete={handleBulkDelete}
          selectable={true}
          showToolbar={true}
          emptyMessage="Không có công việc nào"
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedTask(item)}
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
      ) : viewMode === "card" ? (
        /* Kanban Board */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {TASK_STATUS_ORDER.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onMove={handleMove}
              onDelete={(id: string) => setDeleteTargetId(id)}
              dragItem={dragItem}
              onDrop={handleDrop}
              onDragStart={(taskId) => setDragItem(taskId)}
              onDragEnd={() => setDragItem(null)}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <>
          <ListView tasks={listPaginatedItems} onSelectTask={setSelectedTask} />
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
      )}

      {/* AI Suggestion */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Task Suggestions</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            {stats.overdue} công việc quá hạn. Gợi ý: Ưu tiên xử lý deal review FinServe trước.
          </p>
          <p className="flex items-start gap-2">
            <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            AI đã tự động tạo {stats.aiTasks} tác vụ tuần này, tiết kiệm ~2h lập kế hoạch.
          </p>
          <p className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            Đề xuất: Tạo task "Chuẩn bị tài liệu tiếng Nhật cho GlobalSoft" trước ngày demo.
          </p>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onSave={(task) => setTasks((prev) => [task, ...prev])}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => { if (deleteTargetId) handleDelete(deleteTargetId); }}
        itemName={tasks.find((t) => t.id === deleteTargetId)?.title ?? ""}
        entityType="công việc"
        description="Công việc đã xoá không thể khôi phục."
      />
    </div>
  );
}