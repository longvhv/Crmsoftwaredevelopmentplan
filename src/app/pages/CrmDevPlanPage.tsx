/**
 * Trang Kế hoạch Phát triển CRM — Rà soát tổng thể & Gap Analysis
 * Hiển thị audit 96 trang + kế hoạch ~130 bước phát triển.
 */
import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ChevronDown,
  Search,
  X,
  Layers,
  Target,
  ArrowUpDown,
  Pencil,
  FileText,
} from "lucide-react";
import {
  type PageAudit,
  type DevPhase,
  type DevStep,
  type StepPriority,
  type StepStatus,
  type FeatureStatus,
  pageAudits,
  devPhases,
  calcPlanStats,
} from "../data/crmDevPlan";

/* ============================================================
 * Config
 * ============================================================ */
const PRIORITY_CONFIG: Record<StepPriority, { label: string; color: string; bg: string }> = {
  critical: { label: "Quan trọng", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  high: { label: "Cao", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  medium: { label: "Trung bình", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  low: { label: "Thấp", color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
};

const STATUS_CONFIG: Record<StepStatus, { label: string; icon: typeof CheckCircle2; color: string }> = {
  done: { label: "Hoàn thành", icon: CheckCircle2, color: "text-green-600" },
  "in-progress": { label: "Đang làm", icon: Clock, color: "text-blue-600" },
  pending: { label: "Chờ", icon: Circle, color: "text-gray-400" },
};

const FEAT_CONFIG: Record<FeatureStatus, { label: string; color: string }> = {
  done: { label: "✓", color: "text-green-600 bg-green-50" },
  partial: { label: "◐", color: "text-amber-600 bg-amber-50" },
  missing: { label: "✗", color: "text-red-400 bg-red-50" },
};

const FEAT_LABELS: Record<string, string> = {
  search: "Tìm kiếm",
  filter: "Bộ lọc",
  create: "Thêm mới",
  update: "Cập nhật",
  delete: "Xóa",
  pagination: "Phân trang",
  columnVisibility: "Ẩn/hiện cột",
  viewToggle: "Đổi chế độ xem",
  inlineEdit: "Sửa inline",
  detailPage: "Trang chi tiết",
  centralizedType: "Type tập trung",
  centralizedApi: "API tập trung",
};

type TabView = "audit" | "plan";

/* ============================================================
 * Main Component
 * ============================================================ */
export function CrmDevPlanPage() {
  const [tab, setTab] = useState<TabView>("audit");
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<StepPriority | "all">("all");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({ F0: true });

  const stats = useMemo(() => calcPlanStats(), []);
  const allSteps = useMemo(() => devPhases.flatMap((p) => p.steps), []);

  const groups = useMemo(() => {
    const set = new Set<string>();
    pageAudits.forEach((p) => set.add(p.group));
    devPhases.forEach((p) => set.add(p.group));
    return Array.from(set);
  }, []);

  /* Search + Filter */
  const normalizedSearch = search.toLowerCase().trim();

  const filteredAudits = useMemo(() => {
    let result = pageAudits;
    if (filterGroup !== "all") result = result.filter((p) => p.group === filterGroup);
    if (normalizedSearch) {
      result = result.filter(
        (p) =>
          p.pageName.toLowerCase().includes(normalizedSearch) ||
          p.route.toLowerCase().includes(normalizedSearch) ||
          (p.notes || "").toLowerCase().includes(normalizedSearch),
      );
    }
    return result;
  }, [filterGroup, normalizedSearch]);

  const filteredPhases = useMemo(() => {
    return devPhases
      .map((phase) => {
        let steps = phase.steps;
        if (filterGroup !== "all") {
          if (phase.group !== filterGroup && filterGroup !== "Foundation") return null;
          if (phase.group !== filterGroup) return null;
        }
        if (filterPriority !== "all") steps = steps.filter((s) => s.priority === filterPriority);
        if (normalizedSearch) {
          steps = steps.filter(
            (s) =>
              s.title.toLowerCase().includes(normalizedSearch) ||
              s.description.toLowerCase().includes(normalizedSearch) ||
              s.tags.some((t) => t.includes(normalizedSearch)),
          );
        }
        if (steps.length === 0 && (filterPriority !== "all" || normalizedSearch)) return null;
        return { ...phase, steps };
      })
      .filter(Boolean) as DevPhase[];
  }, [filterGroup, filterPriority, normalizedSearch]);

  const togglePhase = (id: string) => {
    setExpandedPhases((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl text-gray-900 mb-1">Kế hoạch Phát triển CRM</h1>
        <p className="text-sm text-gray-500">
          Rà soát tổng thể {stats.auditStats.totalPages} trang — {stats.total} bước phát triển
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <StatMini label="Tổng bước" value={stats.total} icon={<Layers className="w-4 h-4" />} color="text-gray-700" />
        <StatMini label="Quan trọng" value={stats.byCriticality.critical} icon={<AlertTriangle className="w-4 h-4" />} color="text-red-600" />
        <StatMini label="Ưu tiên cao" value={stats.byCriticality.high} icon={<Target className="w-4 h-4" />} color="text-orange-600" />
        <StatMini label="Có phân trang" value={`${stats.auditStats.withPagination}/${stats.auditStats.totalPages}`} icon={<ArrowUpDown className="w-4 h-4" />} color="text-blue-600" />
        <StatMini label="Có CRUD đầy đủ" value={`${stats.auditStats.withFullCrud}/${stats.auditStats.totalPages}`} icon={<Pencil className="w-4 h-4" />} color="text-green-600" />
        <StatMini label="Có trang chi tiết" value={`${stats.auditStats.withDetailPage}/${stats.auditStats.totalPages}`} icon={<FileText className="w-4 h-4" />} color="text-violet-600" />
      </div>

      {/* Gap Analysis Mini */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <h3 className="text-sm text-gray-700 mb-3">Gap Analysis — Tỷ lệ hoàn thiện tính năng</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries({
            "Phân trang": stats.auditStats.withPagination,
            "Ẩn/hiện cột": stats.auditStats.withColumnVis,
            "Đổi chế độ xem": stats.auditStats.withViewToggle,
            "Sửa inline": stats.auditStats.withInlineEdit,
            "Trang chi tiết": stats.auditStats.withDetailPage,
            "Type tập trung": stats.auditStats.withCentralizedType,
          }).map(([label, count]) => {
            const pct = Math.round((count / stats.auditStats.totalPages) * 100);
            return (
              <div key={label} className="text-center">
                <div className="text-lg text-gray-900">{pct}%</div>
                <div className="text-[11px] text-gray-500">{label}</div>
                <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 50 ? "bg-green-500" : pct >= 20 ? "bg-amber-500" : "bg-red-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab toggle + Search/Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setTab("audit")}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${tab === "audit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Rà soát trang ({filteredAudits.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("plan")}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${tab === "plan" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Kế hoạch ({allSteps.length} bước)
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full pl-8 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-blue-400"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Group filter */}
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
        >
          <option value="all">Tất cả nhóm</option>
          {groups.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Priority filter (chỉ hiện ở tab plan) */}
        {tab === "plan" && (
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as StepPriority | "all")}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
          >
            <option value="all">Tất cả mức ưu tiên</option>
            <option value="critical">🔴 Quan trọng</option>
            <option value="high">🟠 Cao</option>
            <option value="medium">🔵 Trung bình</option>
            <option value="low">⚪ Thấp</option>
          </select>
        )}
      </div>

      {/* Content */}
      {tab === "audit" ? (
        <AuditTable audits={filteredAudits} />
      ) : (
        <PlanView phases={filteredPhases} expanded={expandedPhases} onToggle={togglePhase} />
      )}
    </div>
  );
}

/* ============================================================
 * StatMini
 * ============================================================ */
function StatMini({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
      <div className={`flex items-center justify-center gap-1.5 ${color} mb-1`}>
        {icon}
        <span className="text-lg">{value}</span>
      </div>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}

/* ============================================================
 * Audit Table — Ma trận tính năng
 * ============================================================ */
function AuditTable({ audits }: { audits: PageAudit[] }) {
  const featureKeys = Object.keys(FEAT_LABELS) as (keyof PageAudit["features"])[];
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const totalPages = Math.ceil(audits.length / pageSize);
  const paged = audits.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 text-[11px] text-gray-500 sticky left-0 bg-gray-50/50 min-w-[200px]">Trang</th>
              <th className="text-left px-2 py-2 text-[11px] text-gray-500 min-w-[80px]">Nhóm</th>
              <th className="text-center px-1 py-2 text-[11px] text-gray-500 min-w-[40px]">Loại</th>
              {featureKeys.map((k) => (
                <th key={k} className="text-center px-1 py-2 text-[11px] text-gray-500 min-w-[32px]" title={FEAT_LABELS[k]}>
                  {FEAT_LABELS[k].slice(0, 4)}
                </th>
              ))}
              <th className="text-left px-2 py-2 text-[11px] text-gray-500 min-w-[200px]">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((audit) => {
              const doneCount = featureKeys.filter((k) => audit.features[k] === "done").length;
              const totalCount = featureKeys.length;
              const pct = Math.round((doneCount / totalCount) * 100);
              return (
                <tr key={audit.route} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-3 py-2 sticky left-0 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0">
                        <p className="text-gray-900 truncate">{audit.pageName}</p>
                        <p className="text-[10px] text-gray-400 truncate">{audit.route}</p>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${pct >= 50 ? "bg-green-50 text-green-700" : pct >= 25 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-[11px] text-gray-500">{audit.group}</td>
                  <td className="px-1 py-2 text-center">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{audit.pageType}</span>
                  </td>
                  {featureKeys.map((k) => {
                    const status = audit.features[k];
                    const cfg = FEAT_CONFIG[status];
                    return (
                      <td key={k} className="px-1 py-2 text-center">
                        <span className={`text-[11px] inline-flex w-5 h-5 items-center justify-center rounded ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-2 py-2 text-[11px] text-gray-500 max-w-[250px] truncate" title={audit.notes}>{audit.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
          <span className="text-[11px] text-gray-400">
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, audits.length)} / {audits.length} trang
          </span>
          <div className="flex gap-1">
            <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              className="px-2 py-1 text-xs border rounded disabled:opacity-40 hover:bg-gray-50">Trước</button>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="px-2 py-1 text-xs border rounded disabled:opacity-40 hover:bg-gray-50">Sau</button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-100 bg-gray-50/50">
        <span className="text-[10px] text-gray-400">Chú thích:</span>
        {Object.entries(FEAT_CONFIG).map(([key, cfg]) => (
          <span key={key} className={`text-[10px] inline-flex items-center gap-1 ${cfg.color} px-1.5 py-0.5 rounded`}>
            {cfg.label} {key === "done" ? "Hoàn thành" : key === "partial" ? "Một phần" : "Thiếu"}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Plan View — Accordion phases + steps
 * ============================================================ */
function PlanView({
  phases,
  expanded,
  onToggle,
}: {
  phases: DevPhase[];
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  if (phases.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <Search className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">Không tìm thấy bước nào phù hợp</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {phases.map((phase) => {
        const isOpen = expanded[phase.id] ?? false;
        const doneCount = phase.steps.filter((s) => s.status === "done").length;
        const criticalCount = phase.steps.filter((s) => s.priority === "critical").length;

        return (
          <div key={phase.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Phase Header */}
            <button
              type="button"
              onClick={() => onToggle(phase.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors"
            >
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{phase.id}</span>
                  <h3 className="text-sm text-gray-900">{phase.title}</h3>
                  <span className="text-[10px] text-gray-400">({phase.steps.length} bước)</span>
                  {criticalCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                      {criticalCount} quan trọng
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{phase.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${phase.steps.length > 0 ? (doneCount / phase.steps.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-[11px] text-gray-400 w-10 text-right">{doneCount}/{phase.steps.length}</span>
              </div>
            </button>

            {/* Steps */}
            {isOpen && (
              <div className="border-t border-gray-100">
                {phase.steps.map((step, idx) => (
                  <StepRow key={step.id} step={step} isLast={idx === phase.steps.length - 1} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Step Row
 * ============================================================ */
function StepRow({ step, isLast }: { step: DevStep; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CONFIG[step.status];
  const priorityCfg = PRIORITY_CONFIG[step.priority];
  const StatusIcon = statusCfg.icon;

  return (
    <div className={`${isLast ? "" : "border-b border-gray-50"} hover:bg-gray-50/30 transition-colors`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-2.5 px-4 py-2.5 text-left"
      >
        <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${statusCfg.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-400">{step.id}</span>
            <span className="text-sm text-gray-900">{step.title}</span>
          </div>
          {expanded && (
            <div className="mt-2">
              <p className="text-[13px] text-gray-600 mb-2">{step.description}</p>
              {step.relatedPages && step.relatedPages.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mb-1.5">
                  <span className="text-[10px] text-gray-400">Trang liên quan:</span>
                  {step.relatedPages.map((p) => (
                    <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-700">{p}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-1.5 flex-wrap">
                {step.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${priorityCfg.bg} ${priorityCfg.color}`}>
            {priorityCfg.label}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
            {step.size}
          </span>
        </div>
      </button>
    </div>
  );
}