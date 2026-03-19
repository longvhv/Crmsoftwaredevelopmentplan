/**
 * Trang Goal & OKR Tracking — Theo dõi mục tiêu cá nhân / team theo OKR.
 * Features: DataTable + Card view toggle, FilterBar, Pagination,
 *           Column Visibility, Inline Edit (status), Detail Modal,
 *           Charts, AI coaching, Delete.
 * Phase 3 — Centralized types/constants/data/API
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Target, Bot, Sparkles, Users, User, Building2,
  TrendingUp, CheckCircle2, Clock, AlertTriangle, BarChart3,
  Eye, X, Trash2, Plus, Calendar, Flag, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import type { Goal, GoalLevel, GoalStatus, GoalCategory } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  GOAL_LEVEL_CONFIG, GOAL_STATUS_CONFIG, GOAL_CATEGORY_CONFIG,
} from "../../constants/crmConfig";
import { fetchGoals, updateGoal, deleteGoals as apiDeleteGoals, createGoal } from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Icons cho Level
 * ============================================================ */
const LEVEL_ICONS: Record<GoalLevel, React.ReactNode> = {
  company: <Building2 className="w-3.5 h-3.5" />,
  team: <Users className="w-3.5 h-3.5" />,
  individual: <User className="w-3.5 h-3.5" />,
};

/* ============================================================
 * Filter config
 * ============================================================ */
const GOAL_FILTERS: FilterConfig[] = [
  {
    key: "level", label: "Cấp độ", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(GOAL_LEVEL_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
  {
    key: "status", label: "Trạng thái", type: "select",
    options: Object.entries(GOAL_STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
  {
    key: "category", label: "Danh mục", type: "select",
    options: Object.entries(GOAL_CATEGORY_CONFIG).map(([v, c]) => ({ value: v, label: `${c.icon} ${c.label}` })),
  },
];

/* ============================================================
 * Progress bar component
 * ============================================================ */
function ProgressBar({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-1.5" : "h-2";
  const bg = value >= 80 ? "bg-green-500" : value >= 50 ? "bg-blue-500" : value >= 30 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className={`w-full ${h} bg-gray-100 rounded-full overflow-hidden`}>
      <div className={`${h} rounded-full transition-all ${bg}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

/* ============================================================
 * Column Definitions
 * ============================================================ */
const GOAL_COLUMNS: ColumnDef<Goal>[] = [
  {
    key: "title", header: "Mục tiêu", sortable: true, minWidth: 280,
    render: (g) => (
      <div className="min-w-0">
        <p className="text-gray-900 truncate">{g.title}</p>
        <p className="text-[10px] text-gray-400 truncate">{g.owner}{g.team ? ` · ${g.team}` : ""}</p>
      </div>
    ),
  },
  {
    key: "level", header: "Cấp độ", sortable: true, minWidth: 90,
    render: (g) => {
      const cfg = GOAL_LEVEL_CONFIG[g.level];
      return (
        <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.bgColor} ${cfg.color} flex items-center gap-1 w-fit`}>
          {LEVEL_ICONS[g.level]} {cfg.label}
        </span>
      );
    },
  },
  {
    key: "category", header: "Danh mục", sortable: true, minWidth: 100,
    render: (g) => {
      const cfg = GOAL_CATEGORY_CONFIG[g.category];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.icon} {cfg.label}</span>;
    },
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 110, editable: true,
    render: (g) => {
      const cfg = GOAL_STATUS_CONFIG[g.status];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(GOAL_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "progress", header: "Tiến độ", sortable: true, minWidth: 120,
    render: (g) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-[50px]"><ProgressBar value={g.progress} size="sm" /></div>
        <span className="text-[12px] text-gray-700 w-8 text-right">{g.progress}%</span>
      </div>
    ),
    sortValue: (g) => g.progress,
  },
  {
    key: "keyResults", header: "KR", minWidth: 50,
    render: (g) => <span className="text-gray-500 text-[13px]">{g.keyResults.length}</span>,
  },
  {
    key: "dueDate", header: "Hạn", sortable: true, minWidth: 90,
    render: (g) => {
      const days = Math.ceil((new Date(g.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return (
        <div className="text-[13px]">
          <p className="text-gray-700">{new Date(g.dueDate).toLocaleDateString("vi-VN", { month: "short", year: "2-digit" })}</p>
          {days > 0 && days <= 30 && <p className="text-[10px] text-amber-500">Còn {days} ngày</p>}
          {days <= 0 && g.status !== "completed" && <p className="text-[10px] text-red-500">Quá hạn</p>}
        </div>
      );
    },
    sortValue: (g) => new Date(g.dueDate).getTime(),
  },
  {
    key: "owner", header: "Phụ trách", sortable: true, minWidth: 140, defaultHidden: true,
    render: (g) => <span className="text-gray-600 text-[13px]">{g.owner}</span>,
  },
];

/* ============================================================
 * Goal Card
 * ============================================================ */
function GoalCard({ goal, onView }: { goal: Goal; onView: () => void }) {
  const lCfg = GOAL_LEVEL_CONFIG[goal.level];
  const sCfg = GOAL_STATUS_CONFIG[goal.status];
  const cCfg = GOAL_CATEGORY_CONFIG[goal.category];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onView}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${lCfg.bgColor} ${lCfg.color}`}>
            {LEVEL_ICONS[goal.level]} {lCfg.label}
          </span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded ${cCfg.color}`}>{cCfg.icon} {cCfg.label}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded ${sCfg.bgColor} ${sCfg.color}`}>{sCfg.label}</span>
        </div>
        <Eye className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors flex-shrink-0" />
      </div>
      <h4 className="text-sm text-gray-900 line-clamp-2 mb-1">{goal.title}</h4>
      <p className="text-[10px] text-gray-400 mb-3">{goal.owner}{goal.team ? ` · ${goal.team}` : ""}</p>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400">Tiến độ tổng</span>
          <span className="text-[12px] text-gray-700">{goal.progress}%</span>
        </div>
        <ProgressBar value={goal.progress} />
      </div>
      <div className="space-y-1.5 mb-3">
        {goal.keyResults.slice(0, 3).map((kr) => (
          <div key={kr.id} className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-600 truncate">{kr.title}</p>
            </div>
            <span className="text-[10px] text-gray-400 whitespace-nowrap">{kr.currentValue}/{kr.targetValue} {kr.unit}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[10px] text-gray-400">
        <span className="flex items-center gap-0.5">
          <Calendar className="w-3 h-3" /> {new Date(goal.dueDate).toLocaleDateString("vi-VN", { month: "short", year: "2-digit" })}
        </span>
        <span>{goal.keyResults.length} Key Results</span>
      </div>
    </div>
  );
}

/* ============================================================
 * Goal Detail Modal
 * ============================================================ */
function GoalDetailModal({ goal, onClose }: { goal: Goal; onClose: () => void }) {
  const lCfg = GOAL_LEVEL_CONFIG[goal.level];
  const sCfg = GOAL_STATUS_CONFIG[goal.status];
  const cCfg = GOAL_CATEGORY_CONFIG[goal.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Target className="w-5 h-5 text-violet-600" />
              <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${lCfg.bgColor} ${lCfg.color}`}>
                {LEVEL_ICONS[goal.level]} {lCfg.label}
              </span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${cCfg.color}`}>{cCfg.icon} {cCfg.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${sCfg.bgColor} ${sCfg.color}`}>{sCfg.label}</span>
            </div>
            <h3 className="text-sm text-gray-900">{goal.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <p className="text-sm text-gray-600">{goal.description}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 mb-1">Phụ trách</p>
              <p className="text-sm text-gray-900">{goal.owner}</p>
              {goal.team && <p className="text-xs text-gray-500">{goal.team}</p>}
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 mb-1">Thời gian</p>
              <p className="text-sm text-gray-900">{new Date(goal.startDate).toLocaleDateString("vi-VN")}</p>
              <p className="text-xs text-gray-500">→ {new Date(goal.dueDate).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Tiến độ tổng</span>
              <span className="text-sm text-gray-900">{goal.progress}%</span>
            </div>
            <ProgressBar value={goal.progress} />
          </div>
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5" /> Key Results ({goal.keyResults.length})
            </h4>
            <div className="space-y-2.5">
              {goal.keyResults.map((kr) => (
                <div key={kr.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-gray-800 flex-1">{kr.title}</p>
                    <span className="text-xs text-gray-600 ml-2 whitespace-nowrap">
                      {kr.currentValue} / {kr.targetValue} {kr.unit}
                    </span>
                  </div>
                  <ProgressBar value={kr.progress} size="sm" />
                  <p className="text-[10px] text-gray-400 mt-1 text-right">{kr.progress}%</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {goal.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{tag}</span>
            ))}
          </div>
          <div className={`rounded-lg border p-3 ${
            goal.status === "on-track" || goal.status === "completed" ? "bg-green-50 border-green-100" :
            goal.status === "at-risk" ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"
          }`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Bot className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-xs text-gray-900">AI Coaching</span>
            </div>
            <p className="text-xs text-gray-600">{goal.aiCoachingNote}</p>
          </div>
        </div>
        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Goal Modal
 * ============================================================ */
function GoalCreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<GoalLevel>("team");
  const [status, setStatus] = useState<GoalStatus>("not-started");
  const [category, setCategory] = useState<GoalCategory>("revenue");
  const [owner, setOwner] = useState("");
  const [team, setTeam] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tên mục tiêu"); return; }
    if (!owner.trim()) { toast.error("Vui lòng nhập người phụ trách"); return; }
    if (!dueDate) { toast.error("Vui lòng chọn ngày hạn"); return; }
    setSaving(true);
    await createGoal({
      title, description: description || title,
      level, status, category, owner,
      team: team || undefined, progress: 0,
      startDate, dueDate,
      keyResults: [],
      aiCoachingNote: "Mục tiêu mới — AI sẽ phân tích và đưa gợi ý sau khi có dữ liệu.",
      tags: [],
    });
    toast.success(`Đã tạo mục tiêu "${title}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Mục tiêu / OKR mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên mục tiêu *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Tăng doanh thu Q2 lên 30%"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả chi tiết mục tiêu..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Cấp độ</label>
              <select value={level} onChange={(e) => setLevel(e.target.value as GoalLevel)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(GOAL_LEVEL_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(GOAL_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Danh mục</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as GoalCategory)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(GOAL_CATEGORY_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.icon} {c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Người phụ trách *</label>
              <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Tên người phụ trách"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Team</label>
              <input type="text" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="VD: Sales Team"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Bắt đầu</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Hạn *</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo mục tiêu"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function GoalTrackingPage() {
  const { mode, setMode } = useViewMode("goals", "card");
  const [items, setItems] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);
  const [showChart, setShowChart] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const reload = useCallback(() => { fetchGoals().then(setItems); }, []);
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
      result = result.filter((g) =>
        g.title.toLowerCase().includes(q) || g.owner.toLowerCase().includes(q) ||
        (g.team?.toLowerCase().includes(q) ?? false) || g.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (filterValues.level) result = result.filter((g) => g.level === filterValues.level);
    if (filterValues.status) result = result.filter((g) => g.status === filterValues.status);
    if (filterValues.category) result = result.filter((g) => g.category === filterValues.category);
    return result;
  }, [items, search, filterValues]);

  const cardPag = usePagination(filtered, { storageKey: "goals-card", initialPageSize: 10 });

  /* Stats */
  const stats = useMemo(() => ({
    total: items.length,
    onTrack: items.filter((g) => g.status === "on-track").length,
    atRisk: items.filter((g) => g.status === "at-risk" || g.status === "behind").length,
    completed: items.filter((g) => g.status === "completed").length,
    avgProgress: items.length > 0 ? Math.round(items.reduce((s, g) => s + g.progress, 0) / items.length) : 0,
  }), [items]);

  /* Charts */
  const progressByLevel = useMemo(() =>
    (Object.keys(GOAL_LEVEL_CONFIG) as GoalLevel[]).map((l) => {
      const g = items.filter((x) => x.level === l);
      return {
        name: GOAL_LEVEL_CONFIG[l].label,
        progress: g.length > 0 ? Math.round(g.reduce((s, x) => s + x.progress, 0) / g.length) : 0,
        count: g.length,
      };
    }), [items]);

  const statusDist = useMemo(() =>
    (Object.keys(GOAL_STATUS_CONFIG) as GoalStatus[]).map((s) => ({
      name: GOAL_STATUS_CONFIG[s].label,
      value: items.filter((g) => g.status === s).length,
      fill: s === "on-track" ? "#22c55e" : s === "at-risk" ? "#f59e0b" : s === "behind" ? "#ef4444" : s === "completed" ? "#3b82f6" : "#9ca3af",
    })).filter((d) => d.value > 0), [items]);

  const BAR_COLORS = ["#8b5cf6", "#3b82f6", "#22c55e"];

  /* Inline edit */
  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateGoal(rowId, { [field]: value });
    reload();
    toast.success("Đã cập nhật mục tiêu");
  }, [reload]);

  /* Delete */
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await apiDeleteGoals([deleteTarget.id]);
    reload();
    toast.success(`Đã xóa mục tiêu`);
    setDeleteTarget(null);
  }, [deleteTarget, reload]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    await apiDeleteGoals(ids);
    reload();
    toast.success(`Đã xóa ${ids.length} mục tiêu`);
  }, [reload]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-600" /> Mục tiêu & OKR
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">Company → Team → Individual goals, AI coaching</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} modes={["card", "table"]} />
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Tạo OKR</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <Target className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng mục tiêu</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3">
          <CheckCircle2 className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-green-600">{stats.onTrack}</p>
          <p className="text-xs text-gray-500">Đúng tiến độ</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.atRisk > 0 ? "bg-amber-50 border-amber-100" : "bg-white border-gray-100"}`}>
          <AlertTriangle className="w-4 h-4 text-amber-500 mb-1" />
          <p className={`text-lg ${stats.atRisk > 0 ? "text-amber-600" : "text-gray-900"}`}>{stats.atRisk}</p>
          <p className="text-xs text-gray-500">Có rủi ro/Chậm</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3">
          <CheckCircle2 className="w-4 h-4 text-blue-500 mb-1" />
          <p className="text-lg text-blue-600">{stats.completed}</p>
          <p className="text-xs text-gray-500">Hoàn thành</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <BarChart3 className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.avgProgress}%</p>
          <p className="text-xs text-gray-500">Tiến độ TB</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <button type="button" onClick={() => setShowChart(!showChart)} className="flex items-center justify-between w-full">
          <h3 className="text-sm text-gray-800 flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-violet-500" /> Phân tích OKR</h3>
          {showChart ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showChart && (
          <div className="grid lg:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-xs text-gray-500 mb-2">Tiến độ TB theo cấp độ</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={progressByLevel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: number) => [`${v}%`, "Tiến độ TB"]} />
                  <Bar dataKey="progress" radius={[4, 4, 0, 0]}>
                    {progressByLevel.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
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
          </div>
        )}
      </div>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Tìm mục tiêu, owner, team..."
        filters={GOAL_FILTERS} filterValues={filterValues} onFilterChange={handleFilterChange}
        onClearAll={clearAll} hasActiveFilters={hasActiveFilters} />

      {mode === "table" ? (
        <DataTable<Goal> data={filtered} columns={GOAL_COLUMNS} storageKey="goals" selectable
          defaultSortField="progress" onInlineEdit={handleInlineEdit} onRowClick={(g) => setSelectedGoal(g)}
          onBulkDelete={handleBulkDelete} emptyMessage="Không tìm thấy mục tiêu phù hợp"
          renderRowActions={(g) => (
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => setSelectedGoal(g)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget(g)} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cardPag.paginatedItems.map((g) => <GoalCard key={g.id} goal={g} onView={() => setSelectedGoal(g)} />)}
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400"><Target className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">Không tìm thấy mục tiêu phù hợp</p></div>}
          {filtered.length > 0 && <div className="bg-white rounded-xl border border-gray-100 overflow-hidden"><PaginationBar {...cardPag} onGoToPage={cardPag.goToPage} onNextPage={cardPag.nextPage} onPrevPage={cardPag.prevPage} onSetPageSize={cardPag.setPageSize} /></div>}
        </>
      )}

      {/* AI Coaching Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-violet-600" /><h4 className="text-sm text-violet-900">AI OKR Coaching</h4></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2"><Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />Mục tiêu NPS Enterprise cần 1 CSM bổ sung để đạt target response time.</p>
          <p className="flex items-start gap-2"><TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />AI BDR Agent đã vượt 116% target discovery calls — có thể tăng quota Q2.</p>
          <p className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />Tuyển dụng AI Engineer chậm 30%. Gợi ý: tăng package + remote hiring.</p>
        </div>
      </div>

      {selectedGoal && <GoalDetailModal goal={selectedGoal} onClose={() => setSelectedGoal(null)} />}
      <ConfirmDeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        itemName={deleteTarget?.title ?? ""} entityType="mục tiêu" description="Hành động này không thể hoàn tác." />
      {showCreateModal && <GoalCreateModal onClose={() => setShowCreateModal(false)} onCreated={reload} />}
    </div>
  );
}