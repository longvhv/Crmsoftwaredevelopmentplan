/**
 * Sales Playbook Library — Thư viện Playbook Bán hàng
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Detail Modal, Battle Cards tab,
 *   AI Insights, Delete đơn lẻ + bulk.
 * Phase 6 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  BookOpen, Sparkles, Bot, TrendingUp, Star,
  AlertTriangle, Trash2, Eye, X, Plus,
} from "lucide-react";
import { toast } from "sonner";
import type { Playbook, PlaybookType, PlaybookBattleCard, PlaybookStage } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { PLAYBOOK_TYPE_CONFIG } from "../../constants/crmConfig";
import {
  fetchPlaybooks, updatePlaybook, deletePlaybooks,
  fetchPlaybookBattleCards, createPlaybook,
} from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Filter config
 * ============================================================ */
const PB_FILTERS: FilterConfig[] = [
  {
    key: "type", label: "Loại playbook", type: "select",
    options: Object.entries(PLAYBOOK_TYPE_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const PB_COLUMNS: ColumnDef<Playbook>[] = [
  {
    key: "name", header: "Playbook", sortable: true, minWidth: 280,
    render: (r) => {
      const cfg = PLAYBOOK_TYPE_CONFIG[r.type];
      return (
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{cfg.icon}</span>
          <div className="min-w-0">
            <p className="text-gray-900 truncate">{r.name}</p>
            <p className="text-[10px] text-gray-400 truncate">
              <span className={`px-1 py-0.5 rounded ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>
              {r.isAIGenerated && <span className="ml-1 px-1 py-0.5 bg-violet-50 text-violet-600 rounded border border-violet-200">🤖 AI</span>}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    key: "rating", header: "Rating", sortable: true, minWidth: 70, editable: true,
    render: (r) => <span className="text-amber-500 flex items-center gap-0.5"><Star className="w-3 h-3 fill-current" /> {r.rating}</span>,
    sortValue: (r) => r.rating,
    renderEdit: (_item, value, onChange, onSave) => (
      <input type="number" value={value as number} onChange={(e) => onChange(Number(e.target.value))}
        onBlur={onSave} onKeyDown={(e) => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onSave(); }}
        autoFocus min={0} max={5} step={0.1}
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none" />
    ),
  },
  {
    key: "winRateImpact", header: "Win Rate Impact", sortable: true, minWidth: 110,
    render: (r) => (
      r.winRateImpact > 0
        ? <span className="text-green-600">+{r.winRateImpact}%</span>
        : <span className="text-gray-400">—</span>
    ),
    sortValue: (r) => r.winRateImpact,
  },
  {
    key: "steps", header: "Steps", sortable: true, minWidth: 60,
    render: (r) => <span className="text-gray-600">{r.steps}</span>,
    sortValue: (r) => r.steps,
  },
  {
    key: "adoption", header: "Adoption", sortable: true, minWidth: 100,
    render: (r) => {
      const rate = Math.round((r.completedByReps / r.totalReps) * 100);
      const color = rate >= 80 ? "text-green-600" : rate >= 60 ? "text-amber-600" : "text-red-600";
      return <span className={color}>{rate}% ({r.completedByReps}/{r.totalReps})</span>;
    },
    sortValue: (r) => Math.round((r.completedByReps / r.totalReps) * 100),
  },
  {
    key: "avgDealVelocity", header: "Velocity", sortable: true, minWidth: 80, defaultHidden: true,
    render: (r) => (
      r.avgDealVelocity < 0
        ? <span className="text-blue-600">{r.avgDealVelocity}%</span>
        : <span className="text-gray-400">—</span>
    ),
    sortValue: (r) => r.avgDealVelocity,
  },
  {
    key: "author", header: "Tác giả", sortable: true, minWidth: 130,
    render: (r) => <span className="text-gray-600 text-xs">{r.author}</span>,
  },
  {
    key: "lastUpdated", header: "Cập nhật", sortable: true, minWidth: 100,
    render: (r) => <span className="text-gray-500 text-xs">{r.lastUpdated}</span>,
  },
];

/* ============================================================
 * Card View
 * ============================================================ */
function PlaybookCard({ pb, onView, onDelete }: {
  pb: Playbook; onView: () => void; onDelete: () => void;
}) {
  const cfg = PLAYBOOK_TYPE_CONFIG[pb.type];
  const adoptionRate = Math.round((pb.completedByReps / pb.totalReps) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onView}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
            pb.type === "methodology" ? "bg-violet-100" :
            pb.type === "process" ? "bg-blue-100" :
            pb.type === "objection" ? "bg-amber-100" :
            pb.type === "battle-card" ? "bg-red-100" : "bg-green-100"
          }`}>
            {cfg.icon}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm text-gray-900 truncate">{pb.name}</h4>
            <div className="flex items-center gap-1 flex-wrap">
              <span className={`text-[8px] px-1.5 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>
              {pb.isAIGenerated && <span className="text-[8px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded border border-violet-200">🤖 AI</span>}
              <span className="text-[8px] text-amber-500 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-current" /> {pb.rating}</span>
            </div>
          </div>
        </div>
        <button type="button" onClick={onDelete}
          className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[9px] text-gray-500 mb-2 line-clamp-2 cursor-pointer" onClick={onView}>{pb.description}</p>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {pb.stages.slice(0, 4).map((s) => (
          <span key={s} className="text-[7px] px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-200 capitalize">{s}</span>
        ))}
        {pb.stages.length > 4 && <span className="text-[7px] text-gray-400">+{pb.stages.length - 4}</span>}
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-2">
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-gray-900">{pb.steps}</p>
          <p className="text-[8px] text-gray-400">Steps</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className={`text-xs ${adoptionRate >= 80 ? "text-green-600" : "text-amber-600"}`}>{adoptionRate}%</p>
          <p className="text-[8px] text-gray-400">Adoption</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className={`text-xs ${pb.winRateImpact > 0 ? "text-green-600" : "text-gray-400"}`}>
            {pb.winRateImpact > 0 ? `+${pb.winRateImpact}%` : "—"}
          </p>
          <p className="text-[8px] text-gray-400">Win Rate</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {pb.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-[7px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded">{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function PlaybookDetailModal({ pb, onClose }: { pb: Playbook; onClose: () => void }) {
  const cfg = PLAYBOOK_TYPE_CONFIG[pb.type];
  const adoptionRate = Math.round((pb.completedByReps / pb.totalReps) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              pb.type === "methodology" ? "bg-violet-100" : pb.type === "process" ? "bg-blue-100" :
              pb.type === "objection" ? "bg-amber-100" : pb.type === "battle-card" ? "bg-red-100" : "bg-green-100"
            }`}>
              {cfg.icon}
            </div>
            <div>
              <h3 className="text-gray-900">{pb.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>
                {pb.isAIGenerated && <span className="text-[9px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded">🤖 AI Generated</span>}
                <span className="text-[9px] text-amber-500">⭐ {pb.rating}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <p className="text-sm text-gray-600">{pb.description}</p>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{pb.steps}</p>
              <p className="text-[9px] text-gray-400">Steps</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className={`text-sm ${adoptionRate >= 80 ? "text-green-600" : "text-amber-600"}`}>{adoptionRate}%</p>
              <p className="text-[9px] text-gray-400">Adoption</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className={`text-sm ${pb.winRateImpact > 0 ? "text-green-600" : "text-gray-400"}`}>
                {pb.winRateImpact > 0 ? `+${pb.winRateImpact}%` : "—"}
              </p>
              <p className="text-[9px] text-gray-400">Win Rate Impact</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className={`text-sm ${pb.avgDealVelocity < 0 ? "text-blue-600" : "text-gray-400"}`}>
                {pb.avgDealVelocity < 0 ? `${pb.avgDealVelocity}%` : "—"}
              </p>
              <p className="text-[9px] text-gray-400">Velocity Impact</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 mb-1.5">Áp dụng cho giai đoạn</h4>
            <div className="flex flex-wrap gap-1.5">
              {pb.stages.map((s) => (
                <span key={s} className="text-[9px] px-2 py-1 bg-indigo-50 text-indigo-600 rounded border border-indigo-200 capitalize">{s}</span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Tác giả</span><span className="text-gray-900">{pb.author}</span></div>
            <div className="flex justify-between text-sm mt-1"><span className="text-gray-500">Cập nhật</span><span className="text-gray-900">{pb.lastUpdated}</span></div>
            <div className="flex justify-between text-sm mt-1"><span className="text-gray-500">Reps hoàn thành</span><span className="text-gray-900">{pb.completedByReps}/{pb.totalReps}</span></div>
          </div>

          {pb.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {pb.tags.map((t) => (
                <span key={t} className="text-[9px] px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded">{t}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Playbook Modal
 * ============================================================ */
function CreatePlaybookModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<PlaybookType>("methodology");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState(5);
  const [stages, setStages] = useState<PlaybookStage[]>(["discovery", "demo"]);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [saving, setSaving] = useState(false);

  const allStages: PlaybookStage[] = ["prospecting", "discovery", "demo", "proposal", "negotiation", "closing"];

  const toggleStage = (s: PlaybookStage) => {
    setStages((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên playbook"); return; }
    if (stages.length === 0) { toast.error("Vui lòng chọn ít nhất 1 giai đoạn"); return; }
    setSaving(true);
    try {
      await createPlaybook({
        name, type, description: description || name, steps, stages,
        completedByReps: 0, totalReps: 15, winRateImpact: 0,
        avgDealVelocity: 0, lastUpdated: new Date().toISOString().slice(0, 10),
        author: "Người dùng hiện tại", rating: 0, isAIGenerated, tags: [],
      });
      toast.success(`Đã tạo playbook "${name}"`);
      onCreated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Playbook mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên Playbook *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Enterprise MEDDIC Playbook"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại Playbook</label>
              <select value={type} onChange={(e) => setType(e.target.value as PlaybookType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {Object.entries(PLAYBOOK_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Số bước (steps)</label>
              <input type="number" value={steps} onChange={(e) => setSteps(Number(e.target.value))} min={1} max={20}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả chiến lược..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Áp dụng cho giai đoạn *</label>
            <div className="flex flex-wrap gap-1.5">
              {allStages.map((s) => (
                <button key={s} type="button" onClick={() => toggleStage(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs border capitalize transition-colors ${
                    stages.includes(s) ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isAIGenerated} onChange={(e) => setIsAIGenerated(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-gray-700">🤖 Đánh dấu là AI Generated</span>
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Playbook"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
type ActiveTab = "playbooks" | "battle-cards";

export function SalesPlaybookPage() {
  const [items, setItems] = useState<Playbook[]>([]);
  const [battleCards, setBattleCards] = useState<PlaybookBattleCard[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("playbooks");
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const { mode, setMode } = useViewMode("sales-playbook");
  const [selectedPb, setSelectedPb] = useState<Playbook | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Playbook | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* ---- Load data ---- */
  const loadData = useCallback(async () => {
    const [pbData, bcData] = await Promise.all([
      fetchPlaybooks({
        search: search || undefined,
        type: (filterValues.type as PlaybookType) || null,
      }),
      fetchPlaybookBattleCards(),
    ]);
    setItems(pbData);
    setBattleCards(bcData);
  }, [search, filterValues]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    const totalPlaybooks = items.length;
    const aiGenerated = items.filter((p) => p.isAIGenerated).length;
    const impactful = items.filter((p) => p.winRateImpact > 0);
    const avgWinRateImpact = impactful.length > 0 ? Math.round(impactful.reduce((s, p) => s + p.winRateImpact, 0) / impactful.length) : 0;
    const avgRating = totalPlaybooks > 0 ? (items.reduce((s, p) => s + p.rating, 0) / totalPlaybooks).toFixed(1) : "0";
    return { totalPlaybooks, aiGenerated, avgWinRateImpact, avgRating, battleCards: battleCards.length };
  }, [items, battleCards]);

  /* ---- Pagination for card view ---- */
  const { paginatedItems, currentPage, totalPages, startIndex, endIndex, isFirstPage, isLastPage, totalItems, prevPage, nextPage } = usePagination(items, { storageKey: "sales-playbook" });

  /* ---- Handlers ---- */
  const hasActiveFilters = search !== "" || Object.values(filterValues).some((v) => v !== "");
  const handleFilterChange = useCallback((key: string, value: string) => { setFilterValues((prev) => ({ ...prev, [key]: value })); }, []);
  const handleClearAll = useCallback(() => { setSearch(""); setFilterValues({}); }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deletePlaybooks([deleteTarget.id]);
    toast.success(`Đã xóa playbook "${deleteTarget.name}"`);
    setDeleteTarget(null);
    loadData();
  }, [deleteTarget, loadData]);

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    const count = await deletePlaybooks(ids);
    toast.success(`Đã xóa ${count} playbook`);
    loadData();
  }, [loadData]);

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updatePlaybook(rowId, { [field]: value });
    toast.success("Đã cập nhật playbook");
    loadData();
  }, [loadData]);

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: "playbooks", label: "Playbooks" },
    { key: "battle-cards", label: `Battle Cards (${battleCards.length})` },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" /> Sales Playbook Library
          </h1>
          <p className="text-gray-500 mt-0.5">Thư viện Playbook — methodology, battle cards, talk tracks, AI coaching</p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 self-start">
          <Plus className="w-4 h-4" /> <Sparkles className="w-3.5 h-3.5" /> AI Tạo Playbook
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-3 text-center">
          <p className="text-lg text-indigo-600">{stats.totalPlaybooks}</p>
          <p className="text-[9px] text-indigo-700">Playbooks</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-3 text-center">
          <p className="text-lg text-violet-600">{stats.aiGenerated}</p>
          <p className="text-[9px] text-violet-700">AI Generated</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3 text-center">
          <p className="text-lg text-green-600">+{stats.avgWinRateImpact}%</p>
          <p className="text-[9px] text-green-700">Avg Win Rate Impact</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 text-center">
          <p className="text-lg text-amber-600">⭐ {stats.avgRating}</p>
          <p className="text-[9px] text-amber-700">Avg Rating</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-3 text-center">
          <p className="text-lg text-red-600">{stats.battleCards}</p>
          <p className="text-[9px] text-red-700">Battle Cards</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{t.label}</button>
        ))}
      </div>

      {/* === Playbooks Tab === */}
      {activeTab === "playbooks" && (
        <>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Tìm playbook, tác giả, tag..."
            filters={PB_FILTERS}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            hasActiveFilters={hasActiveFilters}
            actions={<ViewToggle mode={mode} onSetMode={setMode} />}
          />

          {mode === "table" ? (
            <DataTable
              data={items}
              columns={PB_COLUMNS}
              storageKey="sales-playbook"
              selectable
              onRowClick={setSelectedPb}
              onInlineEdit={handleInlineEdit}
              onBulkDelete={handleBulkDelete}
              renderRowActions={(item) => (
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setSelectedPb(item)}
                    className="p-1 text-gray-400 hover:text-indigo-600"><Eye className="w-4 h-4" /></button>
                  <button type="button" onClick={() => setDeleteTarget(item)}
                    className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
              defaultSortField="rating"
              emptyMessage="Không có playbook nào"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedItems.map((pb) => (
                  <PlaybookCard key={pb.id} pb={pb}
                    onView={() => setSelectedPb(pb)}
                    onDelete={() => setDeleteTarget(pb)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="bg-white rounded-xl border border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{startIndex}–{endIndex} / {totalItems}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" disabled={isFirstPage} onClick={prevPage}
                      className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-30">←</button>
                    <span>Trang {currentPage + 1}/{totalPages}</span>
                    <button type="button" disabled={isLastPage} onClick={nextPage}
                      className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-30">→</button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* === Battle Cards Tab === */}
      {activeTab === "battle-cards" && (
        <div className="space-y-3">
          {battleCards.map((bc) => (
            <div key={bc.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-900">⚔️ vs {bc.competitor}</h3>
                <div className="flex items-center gap-3 text-[9px]">
                  <span className={bc.winRate >= 50 ? "text-green-600" : "text-red-600"}>Win rate: {bc.winRate}%</span>
                  <span className="text-gray-400">Updated: {bc.lastUpdated}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-[8px] text-green-600 mb-1">✅ Lợi thế của ta</p>
                  {bc.keyDifferentiators.map((d) => (
                    <p key={d} className="text-[9px] text-gray-600 flex items-start gap-1 mb-0.5">
                      <span className="text-green-400">▸</span> {d}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-[8px] text-red-500 mb-1">⚠ Objections thường gặp</p>
                  {bc.objections.map((o) => (
                    <p key={o} className="text-[9px] text-gray-600 flex items-start gap-1 mb-0.5">
                      <span className="text-red-400">▸</span> {o}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-[8px] text-blue-500 mb-1">💬 Talk Tracks</p>
                  {bc.talkTracks.map((t) => (
                    <p key={t} className="text-[9px] text-gray-600 flex items-start gap-1 mb-0.5">
                      <span className="text-blue-400">▸</span> {t}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm text-indigo-900">AI Playbook Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-indigo-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>AI Expansion Playbook</strong> có <strong>win rate impact cao nhất (+30%)</strong>. Reps follow đúng playbook có expansion rate 3.2x cao hơn. Recommend: <strong>bắt buộc adoption</strong> cho toàn team.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Hoàng Thị Linh</strong> adoption chỉ <strong>55%</strong> — thấp nhất team. Correlation: win rate 33%. AI suggest: <strong>pair coaching</strong> với Phạm Văn Khôi (95% adoption).</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI đang <strong>mine 150+ closed deals</strong> để generate <strong>3 playbooks mới</strong>: Industry-specific (FinTech, Healthcare, Manufacturing). ETA: 2 ngày.</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && <CreatePlaybookModal onClose={() => setShowCreateModal(false)} onCreated={loadData} />}
      {selectedPb && <PlaybookDetailModal pb={selectedPb} onClose={() => setSelectedPb(null)} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name ?? ""}
        entityType="playbook"
        description="Thao tác này không thể hoàn tác."
      />
    </div>
  );
}