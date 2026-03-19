/**
 * Trang Sales Pipeline — Kanban board + Table view với toggle.
 * Features: DnD Kanban, DataTable, ViewToggle, FilterBar, Pagination,
 *           Column Visibility, Inline Edit, Detail Panel.
 * Phase F1-11 → F1-13
 */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Bot,
  Flame,
  Sun,
  Snowflake,
  Calendar,
  User,
  X,
  Plus,
  GripVertical,
  ExternalLink,
  Eye,
  Pencil,
  Trash2,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Zap,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { Deal, DealStage, DealPriority } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { fetchDeals, getEmployeeName, updateDeal, createDeal } from "../../api/crmApi";
import {
  DEAL_STAGE_CONFIG,
  ACTIVE_DEAL_STAGES,
  DEAL_PRIORITY_CONFIG,
  formatCurrency,
  formatCompactNumber,
} from "../../constants/crmConfig";
import { DealFormModal } from "../../components/crm/DealFormModal";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { useViewMode } from "../../hooks/useViewMode";
import { PipelineAnalytics } from "../../components/crm/deals/PipelineAnalytics";

const DND_ITEM_TYPE = "DEAL";

/* ============================================================
 * Pipeline Filter Config
 * ============================================================ */
const PIPELINE_FILTERS: FilterConfig[] = [
  {
    key: "assignedTo", label: "Người phụ trách", type: "select",
    options: [], // Sẽ được set dynamically
  },
  {
    key: "priority", label: "Ưu tiên", type: "select",
    options: Object.entries(DEAL_PRIORITY_CONFIG).map(([v, c]) => ({ value: v, label: `${c.emoji} ${c.label}` })),
  },
  {
    key: "stage", label: "Giai đoạn", type: "select",
    options: Object.entries(DEAL_STAGE_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Deal Columns cho DataTable
 * ============================================================ */
const DEAL_COLUMNS: ColumnDef<Deal>[] = [
  {
    key: "title", header: "Tên Deal", sortable: true, minWidth: 200, editable: true,
    render: (d) => (
      <div>
        <p className="text-gray-900 line-clamp-1">{d.title}</p>
        <p className="text-[10px] text-gray-400 truncate">{d.company}</p>
      </div>
    ),
  },
  {
    key: "value", header: "Giá trị", sortable: true, minWidth: 110,
    render: (d) => <span className="text-gray-900">{formatCurrency(d.value)}</span>,
    sortValue: (d) => d.value,
  },
  {
    key: "stage", header: "Giai đoạn", sortable: true, minWidth: 100, editable: true,
    render: (d) => {
      const cfg = DEAL_STAGE_CONFIG[d.stage];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.stage} onChange={(e) => { onChange(e.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(DEAL_STAGE_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
  },
  {
    key: "priority", header: "Ưu tiên", sortable: true, minWidth: 80,
    render: (d) => {
      const cfg = DEAL_PRIORITY_CONFIG[d.priority];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.emoji} {cfg.label}</span>;
    },
    sortValue: (d) => ({ hot: 0, warm: 1, cold: 2 })[d.priority],
  },
  {
    key: "aiWinProbability", header: "AI Win%", sortable: true, minWidth: 90,
    render: (d) => (
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[30px]">
          <div className={`h-full rounded-full ${d.aiWinProbability >= 70 ? "bg-green-500" : d.aiWinProbability >= 40 ? "bg-amber-500" : "bg-red-400"}`}
            style={{ width: `${d.aiWinProbability}%` }} />
        </div>
        <span className="text-[11px] text-gray-600 w-7 text-right">{d.aiWinProbability}%</span>
      </div>
    ),
    sortValue: (d) => d.aiWinProbability,
  },
  {
    key: "contactName", header: "Liên hệ", sortable: true, minWidth: 120,
    render: (d) => <span className="text-gray-600 text-[13px] truncate block">{d.contactName}</span>,
  },
  {
    key: "assignedTo", header: "Phụ trách", sortable: true, minWidth: 120,
    render: (d) => <span className="text-gray-600 text-[13px] truncate block">{getEmployeeName(d.assignedTo)}</span>,
    sortValue: (d) => getEmployeeName(d.assignedTo),
  },
  {
    key: "expectedCloseDate", header: "Dự kiến chốt", sortable: true, minWidth: 100,
    render: (d) => <span className="text-gray-500 text-[13px]">{d.expectedCloseDate}</span>,
  },
  {
    key: "probability", header: "Xác suất", sortable: true, minWidth: 70, defaultHidden: true,
    render: (d) => <span className="text-gray-500 text-[13px]">{d.probability}%</span>,
    sortValue: (d) => d.probability,
  },
  {
    key: "createdDate", header: "Ngày tạo", sortable: true, minWidth: 100, defaultHidden: true,
    render: (d) => <span className="text-gray-500 text-[13px]">{d.createdDate}</span>,
  },
];

/* ============================================================
 * Priority Icons
 * ============================================================ */
const PRIORITY_ICONS = {
  hot: <Flame className="w-3 h-3 text-red-500" />,
  warm: <Sun className="w-3 h-3 text-amber-500" />,
  cold: <Snowflake className="w-3 h-3 text-blue-500" />,
};

/* ============================================================
 * Draggable Deal Card
 * ============================================================ */
function DraggableDealCard({ deal, isSelected, onSelect }: { deal: Deal; isSelected: boolean; onSelect: () => void }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: DND_ITEM_TYPE, item: { id: deal.id, stage: deal.stage },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  return (
    <div ref={dragRef as unknown as React.Ref<HTMLDivElement>} className={`transition-all ${isDragging ? "opacity-40 scale-95" : ""}`}>
      <button type="button" onClick={onSelect}
        className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm ${isSelected ? "border-blue-300 bg-blue-50 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"}`}>
        <div className="flex items-start gap-1.5 mb-1.5">
          <GripVertical className="w-3.5 h-3.5 text-gray-300 mt-0.5 flex-shrink-0 cursor-grab" />
          <h4 className="text-sm text-gray-900 line-clamp-2 flex-1">{deal.title}</h4>
          {PRIORITY_ICONS[deal.priority]}
        </div>
        <p className="text-xs text-gray-400 mb-2 ml-5">{deal.company}</p>
        <div className="flex items-center justify-between ml-5">
          <span className="text-sm text-gray-900">{formatCurrency(deal.value)}</span>
          <div className="flex items-center gap-1">
            <div className="w-8 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${deal.aiWinProbability}%` }} />
            </div>
            <span className="text-[10px] text-gray-400">{deal.aiWinProbability}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 ml-5">
          <span className="text-[10px] text-gray-400 flex items-center gap-1"><User className="w-2.5 h-2.5" />{getEmployeeName(deal.assignedTo)}</span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{deal.expectedCloseDate}</span>
        </div>
      </button>
    </div>
  );
}

/* ============================================================
 * Droppable Kanban Column
 * ============================================================ */
function DroppableKanbanColumn({ stage, deals: columnDeals, selectedDealId, onSelectDeal, onDropDeal }: {
  stage: DealStage; deals: Deal[]; selectedDealId: string | null;
  onSelectDeal: (deal: Deal) => void; onDropDeal: (dealId: string, newStage: DealStage) => void;
}) {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: DND_ITEM_TYPE,
    drop: (item: { id: string; stage: DealStage }) => { if (item.stage !== stage) onDropDeal(item.id, stage); },
    canDrop: (item: { stage: DealStage }) => item.stage !== stage,
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  });
  const config = DEAL_STAGE_CONFIG[stage];
  const totalValue = columnDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col min-w-[260px] sm:min-w-[280px] max-w-[320px]">
      <div className={`px-3 py-2.5 rounded-t-xl ${config.bgColor} border border-b-0`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${config.color}`}>{config.label}</span>
            <span className="text-[10px] bg-white/70 text-gray-600 px-1.5 py-0.5 rounded-full">{columnDeals.length}</span>
          </div>
          <span className="text-[11px] text-gray-500">{formatCompactNumber(totalValue)}</span>
        </div>
      </div>
      <div ref={dropRef as unknown as React.Ref<HTMLDivElement>}
        className={`flex-1 border border-t-0 rounded-b-xl p-2 space-y-2 min-h-[120px] transition-colors ${
          isOver && canDrop ? "bg-blue-100/50 border-blue-300" : canDrop ? "bg-blue-50/30 border-blue-200" : "bg-gray-50/50 border-gray-200"
        }`}>
        {isOver && canDrop && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-3 text-center text-xs text-blue-500">Thả deal vào đây</div>
        )}
        {columnDeals.map((deal) => (
          <DraggableDealCard key={deal.id} deal={deal} isSelected={selectedDealId === deal.id} onSelect={() => onSelectDeal(deal)} />
        ))}
        {columnDeals.length === 0 && !isOver && <div className="text-center py-6 text-gray-300 text-xs">Chưa có deal</div>}
      </div>
    </div>
  );
}

/* ============================================================
 * Deal Detail Panel
 * ============================================================ */
function DealDetail({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const stageConfig = DEAL_STAGE_CONFIG[deal.stage];
  const priorityConfig = DEAL_PRIORITY_CONFIG[deal.priority];
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-violet-50">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-gray-900 pr-4">{deal.title}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs px-2 py-0.5 rounded ${stageConfig.bgColor} ${stageConfig.color}`}>{stageConfig.label}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${priorityConfig.color}`}>{priorityConfig.emoji} {priorityConfig.label}</span>
          {deal.tags.map((tag) => <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{tag}</span>)}
        </div>
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><p className="text-xs text-gray-400">Giá trị</p><p className="text-lg text-gray-900">{formatCurrency(deal.value)}</p></div>
          <div><p className="text-xs text-gray-400">Xác suất</p><p className="text-sm text-gray-700">{deal.probability}%</p></div>
          <div><p className="text-xs text-gray-400 flex items-center gap-1"><Bot className="w-3 h-3 text-violet-500" /> AI Win%</p><p className="text-sm text-violet-700">{deal.aiWinProbability}%</p></div>
          <div><p className="text-xs text-gray-400">Dự kiến chốt</p><p className="text-sm text-gray-700">{deal.expectedCloseDate}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-xs text-gray-400">Liên hệ</p><p className="text-sm text-gray-700">{deal.contactName}</p></div>
          <div><p className="text-xs text-gray-400">Công ty</p><p className="text-sm text-gray-700">{deal.company}</p></div>
          <div><p className="text-xs text-gray-400">Phụ trách</p><p className="text-sm text-gray-700">{getEmployeeName(deal.assignedTo)}</p></div>
          <div><p className="text-xs text-gray-400">Ngày tạo</p><p className="text-sm text-gray-700">{deal.createdDate}</p></div>
        </div>
        {deal.aiNextAction && (
          <div className="p-3 bg-violet-50 rounded-lg border border-violet-100">
            <p className="text-xs text-violet-700 mb-1 flex items-center gap-1"><Bot className="w-3.5 h-3.5" /> AI đề xuất</p>
            <p className="text-sm text-violet-900">{deal.aiNextAction}</p>
          </div>
        )}
        {deal.notes && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100"><p className="text-xs text-amber-800">{deal.notes}</p></div>
        )}
        <button type="button" onClick={() => navigate(`/crm/deals/${deal.id}`)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm hover:bg-blue-100 transition-colors">
          <ExternalLink className="w-4 h-4" /> Xem chi tiết đầy đủ
        </button>
      </div>
    </div>
  );
}

/* ============================================================
 * Pipeline Summary
 * ============================================================ */
function PipelineSummary({ deals: allDeals }: { deals: Deal[] }) {
  const active = allDeals.filter((d) => ACTIVE_DEAL_STAGES.includes(d.stage));
  const totalValue = active.reduce((sum, d) => sum + d.value, 0);
  const avgProb = active.length > 0 ? Math.round(active.reduce((sum, d) => sum + d.aiWinProbability, 0) / active.length) : 0;
  const weightedValue = active.reduce((sum, d) => sum + d.value * (d.aiWinProbability / 100), 0);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white rounded-xl border border-gray-100 p-3 text-center"><p className="text-xl text-gray-900">{active.length}</p><p className="text-xs text-gray-500">Deals mở</p></div>
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center"><p className="text-xl text-blue-700">{formatCompactNumber(totalValue)}</p><p className="text-xs text-blue-600">Pipeline</p></div>
      <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center"><p className="text-xl text-green-700">{formatCompactNumber(weightedValue)}</p><p className="text-xs text-green-600">Weighted</p></div>
      <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center"><p className="text-xl text-violet-700">{avgProb}%</p><p className="text-xs text-violet-600">TB AI Win%</p></div>
    </div>
  );
}

/* ============================================================
 * Main Pipeline Content (bên trong DndProvider)
 * ============================================================ */
function PipelineContent() {
  const navigate = useNavigate();
  const { mode, setMode } = useViewMode("pipeline", "card"); // card = kanban
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  /* FilterBar state */
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);
  const hasActiveFilters = !!search || Object.values(filterValues).some((v) => v !== "");
  const clearAll = useCallback(() => { setSearch(""); setFilterValues({}); }, []);

  const reload = useCallback(() => { fetchDeals().then(setAllDeals); }, []);
  useEffect(() => { reload(); }, [reload]);

  /* Dynamic filter config for assignees */
  const dynamicFilters = useMemo(() => {
    const assignees = [...new Set(allDeals.map((d) => d.assignedTo))].map((id) => ({
      value: id, label: getEmployeeName(id),
    }));
    return PIPELINE_FILTERS.map((f) =>
      f.key === "assignedTo" ? { ...f, options: assignees } : f
    ) as FilterConfig[];
  }, [allDeals]);

  /* Filter */
  const filtered = useMemo(() => {
    let result = [...allDeals];
    if (filterValues.assignedTo) result = result.filter((d) => d.assignedTo === filterValues.assignedTo);
    if (filterValues.priority) result = result.filter((d) => d.priority === filterValues.priority);
    if (filterValues.stage) result = result.filter((d) => d.stage === filterValues.stage);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((d) =>
        d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q) ||
        d.contactName.toLowerCase().includes(q));
    }
    return result;
  }, [allDeals, filterValues, search]);

  /* Kanban data */
  const dealsByStage = useMemo(() => {
    const map: Record<DealStage, Deal[]> = {
      qualification: [], discovery: [], proposal: [], negotiation: [], "closed-won": [], "closed-lost": [],
    };
    for (const deal of filtered) map[deal.stage].push(deal);
    return map;
  }, [filtered]);

  const handleDropDeal = useCallback(async (dealId: string, newStage: DealStage) => {
    await updateDeal(dealId, { stage: newStage });
    reload();
    setSelectedDeal((prev) => prev?.id === dealId ? { ...prev, stage: newStage } : prev);
    toast.success(`Đã chuyển deal sang "${DEAL_STAGE_CONFIG[newStage].label}"`);
  }, [reload]);

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateDeal(rowId, { [field]: value });
    toast.success("Đã cập nhật deal");
    reload();
  }, [reload]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {mode === "card" ? "Kéo thả deals giữa giai đoạn" : "Quản lý dạng bảng"} · {allDeals.length} deals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle
            mode={mode}
            onSetMode={setMode}
            modes={["card", "table"]}
          />
          <button
            type="button"
            onClick={() => navigate("/crm/deals/scoring")}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            title="AI Scoring Dashboard"
          >
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">AI Scoring</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/crm/deals/automation")}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
            title="Automation Rules"
          >
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Automation</span>
          </button>
          <button type="button" onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" /><span className="hidden sm:inline">Tạo Deal</span>
          </button>
        </div>
      </header>

      <PipelineSummary deals={filtered} />

      {/* Analytics Toggle */}
      <button
        type="button"
        onClick={() => setShowAnalytics(!showAnalytics)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <BarChart3 className="w-4 h-4" />
        Pipeline Analytics
        {showAnalytics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <PipelineAnalytics deals={allDeals} />
        </div>
      )}

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm deal, công ty, liên hệ..."
        filters={dynamicFilters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Content */}
      <div className={selectedDeal ? "grid lg:grid-cols-3 gap-4" : ""}>
        {/* KANBAN VIEW */}
        {mode === "card" && (
          <div className={selectedDeal ? "lg:col-span-2 overflow-x-auto" : "overflow-x-auto"}>
            <div className="flex gap-3 pb-4 min-w-max">
              {ACTIVE_DEAL_STAGES.map((stage) => (
                <DroppableKanbanColumn key={stage} stage={stage} deals={dealsByStage[stage]}
                  selectedDealId={selectedDeal?.id ?? null}
                  onSelectDeal={(deal) => setSelectedDeal(selectedDeal?.id === deal.id ? null : deal)}
                  onDropDeal={handleDropDeal} />
              ))}
            </div>
            <div className="flex gap-3 mt-2 flex-wrap">
              {(["closed-won", "closed-lost"] as DealStage[]).map((stage) => {
                const stageDeals = dealsByStage[stage];
                const config = DEAL_STAGE_CONFIG[stage];
                return (
                  <div key={stage} className={`px-3 py-2 rounded-lg ${config.bgColor} border flex items-center gap-2`}>
                    <span className={`text-xs ${config.color}`}>{config.label}</span>
                    <span className="text-xs text-gray-500">{stageDeals.length} deals</span>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-500">{formatCurrency(stageDeals.reduce((s, d) => s + d.value, 0))}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TABLE VIEW */}
        {mode === "table" && (
          <div className={selectedDeal ? "lg:col-span-2" : ""}>
            <DataTable<Deal>
              data={filtered}
              columns={DEAL_COLUMNS}
              storageKey="pipeline-table"
              selectable
              defaultSortField="value"
              onInlineEdit={handleInlineEdit}
              onRowClick={(d) => setSelectedDeal(selectedDeal?.id === d.id ? null : d)}
              emptyMessage="Không tìm thấy deal phù hợp"
              renderRowActions={(d) => (
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => navigate(`/crm/deals/${d.id}`)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Chi tiết"><Eye className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => setSelectedDeal(d)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Pencil className="w-3.5 h-3.5" /></button>
                </div>
              )}
            />
          </div>
        )}

        {/* Detail panel */}
        {selectedDeal && (
          <div className="lg:col-span-1">
            <DealDetail deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
          </div>
        )}
      </div>

      {/* Form tạo deal mới */}
      <DealFormModal isOpen={showForm} onClose={() => setShowForm(false)}
        onSave={async (data) => { await createDeal(data); reload(); toast.success(`Đã tạo deal "${data.title}"`); }} />
    </div>
  );
}

/** Trang export — bọc DndProvider */
export function PipelinePage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <PipelineContent />
    </DndProvider>
  );
}