/**
 * Win/Loss Analysis — Phân tích Thắng/Thua
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Detail Modal, AI Insights, Delete đơn lẻ + bulk.
 * Phase 6 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  ThumbsDown, ThumbsUp, Sparkles, Bot, TrendingUp,
  TrendingDown, Trash2, Eye, X, Target,
} from "lucide-react";
import { toast } from "sonner";
import type { AnalyzedDeal, LossReason } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { DEAL_OUTCOME_CONFIG, LOSS_REASON_CONFIG, formatVND } from "../../constants/crmConfig";
import { fetchAnalyzedDeals, deleteAnalyzedDeals, updateAnalyzedDeal } from "../../api/crmApi";
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
const WL_FILTERS: FilterConfig[] = [
  {
    key: "outcome", label: "Kết quả", type: "button-group",
    options: [
      { value: "", label: "Tất cả" },
      ...Object.entries(DEAL_OUTCOME_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
    ],
  },
  {
    key: "lossReason", label: "Lý do thua", type: "select",
    options: Object.entries(LOSS_REASON_CONFIG).map(([v, c]) => ({ value: v, label: `${c.icon} ${c.label}` })),
  },
];

/* ============================================================
 * Column Definitions
 * ============================================================ */
const WL_COLUMNS: ColumnDef<AnalyzedDeal>[] = [
  {
    key: "name", header: "Deal", sortable: true, minWidth: 240,
    render: (r) => {
      const isWon = r.outcome === "won";
      return (
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isWon ? "bg-green-100" : "bg-red-100"}`}>
            {isWon ? <ThumbsUp className="w-3.5 h-3.5 text-green-600" /> : <ThumbsDown className="w-3.5 h-3.5 text-red-600" />}
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 truncate">{r.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{r.customer}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: "outcome", header: "Kết quả", sortable: true, minWidth: 80, editable: true,
    render: (r) => {
      const cfg = DEAL_OUTCOME_CONFIG[r.outcome];
      return <span className={`text-[9px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.outcome} onChange={(e) => { onChange(e.target.value); onSave(); }}
        onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(DEAL_OUTCOME_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "value", header: "Giá trị", sortable: true, minWidth: 110,
    render: (r) => <span className="text-gray-900">{formatVND(r.value)}₫</span>,
    sortValue: (r) => r.value,
  },
  {
    key: "salesCycle", header: "Chu kỳ", sortable: true, minWidth: 70,
    render: (r) => <span className="text-gray-600">{r.salesCycle} ngày</span>,
    sortValue: (r) => r.salesCycle,
  },
  {
    key: "competitor", header: "Đối thủ", sortable: true, minWidth: 120,
    render: (r) => r.competitor
      ? <span className="text-violet-600 text-xs">⚔️ {r.competitor}</span>
      : <span className="text-gray-300 text-xs">—</span>,
  },
  {
    key: "lossReason", header: "Lý do thua", sortable: true, minWidth: 150, editable: true,
    render: (r) => {
      if (!r.lossReason) return <span className="text-gray-300 text-xs">—</span>;
      const cfg = LOSS_REASON_CONFIG[r.lossReason];
      return <span className={`text-[9px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.icon} {cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.lossReason || ""} onChange={(e) => { onChange(e.target.value || null); onSave(); }}
        onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        <option value="">— Không có —</option>
        {Object.entries(LOSS_REASON_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.icon} {cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "rep", header: "Sales Rep", sortable: true, minWidth: 140,
    render: (r) => <span className="text-gray-600 text-xs">{r.rep}</span>,
  },
  {
    key: "closeDate", header: "Ngày đóng", sortable: true, minWidth: 100,
    render: (r) => <span className="text-gray-500 text-xs">{r.closeDate}</span>,
  },
];

/* ============================================================
 * Card View
 * ============================================================ */
function DealCard({ deal, onView, onDelete }: {
  deal: AnalyzedDeal; onView: () => void; onDelete: () => void;
}) {
  const isWon = deal.outcome === "won";
  const outCfg = DEAL_OUTCOME_CONFIG[deal.outcome];

  return (
    <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow group ${isWon ? "border-green-200" : "border-red-200"}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onView}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isWon ? "bg-green-100" : "bg-red-100"}`}>
            {isWon ? <ThumbsUp className="w-4 h-4 text-green-600" /> : <ThumbsDown className="w-4 h-4 text-red-600" />}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm text-gray-900 truncate">{deal.name}</h4>
            <div className="flex items-center gap-1 flex-wrap">
              <span className={`text-[8px] px-1.5 py-0.5 rounded border ${outCfg.bgColor} ${outCfg.color}`}>{outCfg.label}</span>
              {deal.competitor && <span className="text-[8px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded border border-violet-200">vs {deal.competitor}</span>}
            </div>
          </div>
        </div>
        <button type="button" onClick={onDelete}
          className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-2">
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-gray-900">{formatVND(deal.value)}₫</p>
          <p className="text-[8px] text-gray-400">Giá trị</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-gray-900">{deal.salesCycle}d</p>
          <p className="text-[8px] text-gray-400">Chu kỳ</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-gray-600">{deal.rep.length > 12 ? deal.rep.slice(0, 12) + "…" : deal.rep}</p>
          <p className="text-[8px] text-gray-400">Rep</p>
        </div>
      </div>

      {deal.lossReason && (
        <div className="mb-2">
          <span className={`text-[8px] px-1.5 py-0.5 rounded ${LOSS_REASON_CONFIG[deal.lossReason].color}`}>
            {LOSS_REASON_CONFIG[deal.lossReason].icon} {LOSS_REASON_CONFIG[deal.lossReason].label}
          </span>
        </div>
      )}

      <div className={`rounded-lg p-2 border ${isWon ? "bg-green-50 border-green-100" : "bg-orange-50 border-orange-100"}`}>
        <div className="flex items-center gap-1 mb-0.5">
          <Sparkles className={`w-3 h-3 ${isWon ? "text-green-500" : "text-orange-500"}`} />
          <span className={`text-[8px] ${isWon ? "text-green-700" : "text-orange-700"}`}>AI Insight</span>
        </div>
        <p className={`text-[9px] line-clamp-2 ${isWon ? "text-green-600" : "text-orange-600"}`}>{deal.aiInsight}</p>
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function DealDetailModal({ deal, onClose }: { deal: AnalyzedDeal; onClose: () => void }) {
  const isWon = deal.outcome === "won";
  const outCfg = DEAL_OUTCOME_CONFIG[deal.outcome];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isWon ? "bg-green-100" : "bg-red-100"}`}>
              {isWon ? <ThumbsUp className="w-5 h-5 text-green-600" /> : <ThumbsDown className="w-5 h-5 text-red-600" />}
            </div>
            <div>
              <h3 className="text-gray-900">{deal.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${outCfg.bgColor} ${outCfg.color}`}>{outCfg.label}</span>
                {deal.competitor && <span className="text-[8px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded border border-violet-200">vs {deal.competitor}</span>}
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Khách hàng", value: deal.customer },
              { label: "Giá trị", value: `${formatVND(deal.value)}₫` },
              { label: "Chu kỳ bán", value: `${deal.salesCycle} ngày` },
              { label: "Ngày đóng", value: deal.closeDate },
              { label: "Sales Rep", value: deal.rep },
              { label: "Giai đoạn", value: deal.stage },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[9px] text-gray-400">{item.label}</p>
                <p className="text-xs text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>

          {deal.lossReason && (
            <div className="bg-red-50 rounded-lg border border-red-200 p-3">
              <p className="text-[9px] text-red-400 mb-1">Lý do thua</p>
              <p className="text-sm text-red-700">{LOSS_REASON_CONFIG[deal.lossReason].icon} {LOSS_REASON_CONFIG[deal.lossReason].label}</p>
            </div>
          )}

          <div className={`rounded-lg border p-3 ${isWon ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Bot className={`w-4 h-4 ${isWon ? "text-green-500" : "text-orange-500"}`} />
              <span className={`text-xs ${isWon ? "text-green-800" : "text-orange-800"}`}>AI Insight</span>
            </div>
            <p className={`text-sm ${isWon ? "text-green-700" : "text-orange-700"}`}>{deal.aiInsight}</p>
          </div>

          {deal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {deal.tags.map((t) => (
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
export function WinLossAnalysisPage() {
  const [data, setData] = useState<AnalyzedDeal[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({ outcome: "", lossReason: "" });
  const [selected, setSelected] = useState<AnalyzedDeal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const { mode, setMode } = useViewMode("winloss");

  const loadData = useCallback(async () => {
    const result = await fetchAnalyzedDeals({
      search: search || undefined,
      outcome: (filters.outcome || null) as AnalyzedDeal["outcome"] | null,
      lossReason: (filters.lossReason || null) as LossReason | null,
    });
    setData(result);
  }, [search, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => {
    const won = data.filter((d) => d.outcome === "won");
    const lost = data.filter((d) => d.outcome === "lost");
    const winRate = data.length > 0 ? Math.round((won.length / data.length) * 100) : 0;
    const wonValue = won.reduce((s, d) => s + d.value, 0);
    const lostValue = lost.reduce((s, d) => s + d.value, 0);
    const avgWonCycle = won.length > 0 ? Math.round(won.reduce((s, d) => s + d.salesCycle, 0) / won.length) : 0;
    return { winRate, wonValue, lostValue, wonCount: won.length, lostCount: lost.length, avgWonCycle };
  }, [data]);

  const filtered = useMemo(() => {
    return data;
  }, [data]);

  const pagination = usePagination(filtered, { storageKey: "winloss" });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const count = await deleteAnalyzedDeals(deleteTarget.ids);
    toast.success(`Đã xoá ${count} deal`);
    setDeleteTarget(null);
    loadData();
  };

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateAnalyzedDeal(rowId, { [field]: value });
    toast.success("Đã cập nhật deal");
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-orange-600" /> Win/Loss Analysis
          </h1>
          <p className="text-gray-500 mt-0.5">Phân tích thắng/thua — nguyên nhân, đối thủ, xu hướng, bài học từ AI</p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} />
          <button type="button" onClick={() => toast.success("AI đang phân tích pattern thắng/thua...")}
            className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">
            <Sparkles className="w-4 h-4" /> AI Phân tích
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className={`rounded-xl border p-2.5 text-center ${stats.winRate >= 50 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-lg ${stats.winRate >= 50 ? "text-green-600" : "text-red-600"}`}>{stats.winRate}%</p>
          <p className="text-[9px] text-gray-500">Win Rate</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{formatVND(stats.wonValue)}₫</p>
          <p className="text-[9px] text-green-700">{stats.wonCount} Deals Won</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{formatVND(stats.lostValue)}₫</p>
          <p className="text-[9px] text-red-700">{stats.lostCount} Deals Lost</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.avgWonCycle}d</p>
          <p className="text-[9px] text-blue-700">Avg Won Cycle</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{data.length}</p>
          <p className="text-[9px] text-violet-700">Tổng Deals</p>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm deal, khách hàng, đối thủ..."
        filters={WL_FILTERS}
        filterValues={filters}
        onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
        onClearAll={() => { setSearch(""); setFilters({ outcome: "", lossReason: "" }); }}
      />

      {/* Table View */}
      {mode === "table" && (
        <DataTable<AnalyzedDeal>
          data={pagination.paginatedItems}
          columns={WL_COLUMNS}
          storageKey="winloss-table"
          selectable
          onRowClick={setSelected}
          onInlineEdit={handleInlineEdit}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} deal được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelected(item)} className="p-1 text-gray-300 hover:text-violet-600"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.name })} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không có deal nào phù hợp"
        />
      )}

      {/* Card View */}
      {mode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {pagination.paginatedItems.map((d) => (
            <DealCard
              key={d.id}
              deal={d}
              onView={() => setSelected(d)}
              onDelete={() => setDeleteTarget({ ids: [d.id], label: d.name })}
            />
          ))}
          {pagination.paginatedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Không có deal nào phù hợp</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <PaginationBar {...pagination} onGoToPage={pagination.goToPage} onNextPage={pagination.nextPage} onPrevPage={pagination.prevPage} onSetPageSize={pagination.setPageSize} />
        </div>
      )}

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <h4 className="text-sm text-orange-900">AI Win/Loss Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-orange-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Win pattern</strong>: 4/5 deals won có <strong>AI Agent demo</strong> trong sales process. Win rate 80% vs 25% không có demo. Recommend: <strong>bắt buộc AI demo cho deal &gt; 1B₫</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span><strong>Top loss reason</strong>: Giá cao (8.5B₫ mất). 2/3 deals lost vì giá thực ra <strong>thiếu value demonstration</strong>. Fix: tạo <strong>ROI Calculator tự động</strong> + case study theo industry.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>AI Agent Luna</strong> win rate 0% — chỉ handle deals khó (startup no-budget + SMB politics). Recommend: <strong>re-route high-probability deals</strong> cho Luna.</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {selected && <DealDetailModal deal={selected} onClose={() => setSelected(null)} />}
      {deleteTarget && (
        <ConfirmDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemName={deleteTarget.label}
          entityType="deal phân tích"
          description={`Bạn có chắc muốn xoá "${deleteTarget.label}"?`}
        />
      )}
    </div>
  );
}