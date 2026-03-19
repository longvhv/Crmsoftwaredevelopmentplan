/**
 * Trang Quản lý Nhân sự — DataTable + Card view toggle
 * Features: FilterBar, Pagination, Column Visibility, Inline Edit,
 *           ViewToggle (Table/Card), Detail Panel, Performance Scores.
 * Phase F5-01 → F5-03
 */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Bot,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Award,
  Briefcase,
  X,
  ExternalLink,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { Employee, EmployeeType, ActiveStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { fetchEmployees, fetchDepartments } from "../../api/crmApi";
import { EMPLOYEE_STATUS_CONFIG } from "../../constants/crmConfig";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Helpers
 * ============================================================ */
function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />;
  if (trend === "down") return <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-gray-400" />;
}

function ScoreRing({ score, size = 40 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 90 ? "#22c55e" : score >= 80 ? "#3b82f6" : score >= 70 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] text-gray-900">{score}</span>
    </div>
  );
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[30px]">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] text-gray-600 w-6 text-right">{value}</span>
    </div>
  );
}

/* ============================================================
 * Column Definitions
 * ============================================================ */
const EMPLOYEE_COLUMNS: ColumnDef<Employee>[] = [
  {
    key: "name", header: "Tên", sortable: true, minWidth: 180,
    render: (e) => {
      const isAI = e.type === "ai";
      return (
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ${
            isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600" : "bg-gradient-to-br from-blue-500 to-blue-600"
          }`}>
            {isAI ? <Bot className="w-4 h-4" /> : e.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 truncate flex items-center gap-1">
              {e.name} <TrendIndicator trend={e.performanceTrend} />
            </p>
            <p className="text-[10px] text-gray-400 truncate">{e.email}</p>
          </div>
        </div>
      );
    },
    sortValue: (e) => e.name,
  },
  {
    key: "type", header: "Loại", sortable: true, minWidth: 70,
    render: (e) => (
      <span className={`text-[11px] px-2 py-0.5 rounded ${e.type === "ai" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>
        {e.type === "ai" ? "AI" : "Nhân viên"}
      </span>
    ),
  },
  {
    key: "primaryRole", header: "Vai trò chính", sortable: true, minWidth: 150,
    render: (e) => (
      <div>
        <p className="text-gray-700 text-[13px] truncate">{e.primaryRole.name}</p>
        <p className="text-[10px] text-gray-400">{e.primaryRole.department}</p>
      </div>
    ),
    sortValue: (e) => e.primaryRole.name,
  },
  {
    key: "department", header: "Phòng ban", sortable: true, minWidth: 120, defaultHidden: true,
    render: (e) => <span className="text-gray-600 text-[13px]">{e.primaryRole.department}</span>,
    sortValue: (e) => e.primaryRole.department,
  },
  {
    key: "status", header: "Trạng thái", sortable: true, minWidth: 100,
    editable: true,
    render: (e) => {
      const cfg = EMPLOYEE_STATUS_CONFIG[e.status];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.status} onChange={(ev) => { onChange(ev.target.value); onSave(); }} onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(EMPLOYEE_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
    ),
  },
  {
    key: "performanceScore", header: "Điểm hiệu suất", sortable: true, minWidth: 110,
    render: (e) => (
      <div className="flex items-center gap-2">
        <ScoreRing score={e.performanceScore} size={32} />
        <TrendIndicator trend={e.performanceTrend} />
      </div>
    ),
    sortValue: (e) => e.performanceScore,
  },
  {
    key: "kpiRevenue", header: "KPI Doanh thu", sortable: true, minWidth: 100, defaultHidden: true,
    render: (e) => <ScoreBar value={e.kpiScores.revenue} color="bg-green-500" />,
    sortValue: (e) => e.kpiScores.revenue,
  },
  {
    key: "kpiActivity", header: "KPI Hoạt động", sortable: true, minWidth: 100, defaultHidden: true,
    render: (e) => <ScoreBar value={e.kpiScores.activity} color="bg-blue-500" />,
    sortValue: (e) => e.kpiScores.activity,
  },
  {
    key: "kpiQuality", header: "KPI Chất lượng", sortable: true, minWidth: 100, defaultHidden: true,
    render: (e) => <ScoreBar value={e.kpiScores.quality} color="bg-amber-500" />,
    sortValue: (e) => e.kpiScores.quality,
  },
  {
    key: "kpiAI", header: "KPI AI Collab", sortable: true, minWidth: 100, defaultHidden: true,
    render: (e) => <ScoreBar value={e.kpiScores.aiCollaboration} color="bg-violet-500" />,
    sortValue: (e) => e.kpiScores.aiCollaboration,
  },
  {
    key: "secondaryRoles", header: "Kiêm nhiệm", minWidth: 140, defaultHidden: true,
    render: (e) => e.secondaryRoles.length > 0
      ? <div className="flex flex-wrap gap-1">{e.secondaryRoles.map((r) => (
          <span key={r.id} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{r.name}</span>
        ))}</div>
      : <span className="text-gray-300 text-[13px]">—</span>,
  },
  {
    key: "joinDate", header: "Ngày tham gia", sortable: true, minWidth: 100, defaultHidden: true,
    render: (e) => <span className="text-gray-500 text-[13px]">{e.joinDate}</span>,
  },
  {
    key: "tags", header: "Tags", minWidth: 140, defaultHidden: true,
    render: (e) => (
      <div className="flex flex-wrap gap-1">
        {e.tags.map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{t}</span>)}
      </div>
    ),
  },
];

/* ============================================================
 * Employee Card
 * ============================================================ */
function EmployeeCard({ employee, rank, isSelected, onSelect }: {
  employee: Employee; rank: number; isSelected: boolean; onSelect: () => void;
}) {
  const statusConfig = EMPLOYEE_STATUS_CONFIG[employee.status];
  const isAI = employee.type === "ai";
  return (
    <button type="button" onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-sm ${
        isSelected ? "border-blue-300 bg-blue-50/50 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"
      }`}>
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm ${
            isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600" : "bg-gradient-to-br from-blue-500 to-blue-600"
          }`}>{isAI ? <Bot className="w-5 h-5" /> : employee.name.charAt(0)}</div>
          {rank <= 3 && <span className="absolute -top-1 -right-1 text-xs">{rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm text-gray-900 truncate">{employee.name}</h4>
            <TrendIndicator trend={employee.performanceTrend} />
          </div>
          <p className="text-xs text-gray-400 truncate">{employee.primaryRole.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${isAI ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>
              {isAI ? "AI" : "Human"}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusConfig.color}`}>{statusConfig.label}</span>
          </div>
        </div>
        <ScoreRing score={employee.performanceScore} />
      </div>
    </button>
  );
}

/* ============================================================
 * Employee Detail Panel
 * ============================================================ */
function EmployeeDetail({ employee, onClose, onViewDetail }: {
  employee: Employee; onClose: () => void; onViewDetail: () => void;
}) {
  const isAI = employee.type === "ai";
  const statusConfig = EMPLOYEE_STATUS_CONFIG[employee.status];
  const kpiItems = [
    { label: "Doanh thu", value: employee.kpiScores.revenue, color: "bg-green-500" },
    { label: "Hoạt động", value: employee.kpiScores.activity, color: "bg-blue-500" },
    { label: "Chất lượng", value: employee.kpiScores.quality, color: "bg-amber-500" },
    { label: "Cộng tác AI", value: employee.kpiScores.aiCollaboration, color: "bg-violet-500" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-violet-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg ${
              isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600" : "bg-gradient-to-br from-blue-500 to-blue-600"
            }`}>{isAI ? <Bot className="w-6 h-6" /> : employee.name.charAt(0)}</div>
            <div>
              <h3 className="text-gray-900">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs px-2 py-0.5 rounded ${isAI ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>
            {isAI ? "Nhân viên AI" : "Nhân viên"}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${statusConfig.color}`}>{statusConfig.label}</span>
          {employee.tags.map((tag) => <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{tag}</span>)}
        </div>
      </div>
      <div className="p-4 sm:p-5 space-y-5">
        <div className="flex items-center gap-4">
          <ScoreRing score={employee.performanceScore} size={64} />
          <div>
            <p className="text-sm text-gray-900">Điểm hiệu suất tổng hợp</p>
            <div className="flex items-center gap-1 mt-0.5">
              <TrendIndicator trend={employee.performanceTrend} />
              <span className="text-xs text-gray-500">
                {employee.performanceTrend === "up" ? "Đang tăng" : employee.performanceTrend === "down" ? "Đang giảm" : "Ổn định"}
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> Vai trò</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded">Chính (70%)</span>
              <span className="text-sm text-gray-900">{employee.primaryRole.name}</span>
              <span className="text-[10px] text-gray-400">— {employee.primaryRole.department}</span>
            </div>
            {employee.secondaryRoles.length > 0 && (
              <div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Kiêm nhiệm</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {employee.secondaryRoles.map((role) => (
                    <span key={role.id} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100">{role.name} ({role.department})</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><Award className="w-3.5 h-3.5" /> KPI chi tiết</p>
          <div className="space-y-2">
            {kpiItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20">{item.label}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
                <span className="text-xs text-gray-700 w-8 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-xs text-gray-400">Phòng ban</p><p className="text-gray-700">{employee.primaryRole.department}</p></div>
          <div><p className="text-xs text-gray-400">Ngày tham gia</p><p className="text-gray-700">{employee.joinDate}</p></div>
        </div>
        <button type="button" onClick={onViewDetail}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm hover:bg-blue-100 transition-colors">
          <ExternalLink className="w-4 h-4" /> Xem chi tiết đầy đủ
        </button>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function TeamPage() {
  const navigate = useNavigate();
  const { mode, setMode } = useViewMode("team", "table");

  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  /* FilterBar state */
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);
  const hasActiveFilters = !!search || Object.values(filterValues).some((v) => v !== "");
  const clearAll = useCallback(() => { setSearch(""); setFilterValues({}); }, []);

  useEffect(() => {
    Promise.all([fetchEmployees(), fetchDepartments()]).then(([emp, dept]) => {
      setAllEmployees(emp);
      setDepartments(dept);
    });
  }, []);

  /* Dynamic filter config */
  const dynamicFilters = useMemo((): FilterConfig[] => [
    {
      key: "type", label: "Loại", type: "button-group",
      options: [
        { value: "", label: "Tất cả" },
        { value: "human", label: "Nhân viên" },
        { value: "ai", label: "AI" },
      ],
    },
    {
      key: "department", label: "Phòng ban", type: "select",
      options: departments.map((d) => ({ value: d, label: d })),
    },
    {
      key: "status", label: "Trạng thái", type: "select",
      options: Object.entries(EMPLOYEE_STATUS_CONFIG).map(([k, c]) => ({ value: k, label: c.label })),
    },
  ], [departments]);

  /* Filter */
  const filtered = useMemo(() => {
    let result = [...allEmployees];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q) || e.primaryRole.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
    }
    if (filterValues.type) result = result.filter((e) => e.type === filterValues.type);
    if (filterValues.department) result = result.filter((e) => e.primaryRole.department === filterValues.department);
    if (filterValues.status) result = result.filter((e) => e.status === filterValues.status);
    return result.sort((a, b) => b.performanceScore - a.performanceScore);
  }, [allEmployees, search, filterValues]);

  /* Card pagination */
  const cardPag = usePagination(filtered, { storageKey: "team-card" });

  /* Stats */
  const stats = useMemo(() => {
    const humans = allEmployees.filter((e) => e.type === "human").length;
    const ais = allEmployees.filter((e) => e.type === "ai").length;
    const avgScore = allEmployees.length > 0
      ? Math.round(allEmployees.reduce((sum, e) => sum + e.performanceScore, 0) / allEmployees.length) : 0;
    return { total: allEmployees.length, humans, ais, avgScore };
  }, [allEmployees]);

  /* Inline edit */
  const handleInlineEdit = useCallback((rowId: string, field: string, value: unknown) => {
    setAllEmployees((prev) => prev.map((e) => e.id === rowId ? { ...e, [field]: value } : e));
    toast.success("Đã cập nhật nhân viên");
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Quản lý Nhân sự</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {stats.total} nhân viên · {stats.humans} con người · {stats.ais} AI
          </p>
        </div>
        <ViewToggle mode={mode} onSetMode={setMode} modes={["table", "card"]} />
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-xl text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng nhân sự</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
          <p className="text-xl text-blue-700">{stats.humans}</p>
          <p className="text-xs text-blue-600">Nhân viên</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
          <p className="text-xl text-violet-700">{stats.ais}</p>
          <p className="text-xs text-violet-600">AI Agents</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-xl text-green-700">{stats.avgScore}</p>
          <p className="text-xs text-green-600">Điểm TB</p>
        </div>
      </div>

      {/* FilterBar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm kiếm nhân viên, vai trò..."
        filters={dynamicFilters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Content */}
      <div className={selectedEmployee ? "grid lg:grid-cols-3 gap-4" : ""}>
        {/* TABLE VIEW */}
        {mode === "table" && (
          <div className={selectedEmployee ? "lg:col-span-1" : ""}>
            <DataTable<Employee>
              data={filtered}
              columns={EMPLOYEE_COLUMNS}
              storageKey="team"
              defaultSortField="performanceScore"
              onInlineEdit={handleInlineEdit}
              onRowClick={(e) => setSelectedEmployee(selectedEmployee?.id === e.id ? null : e)}
              emptyMessage="Không tìm thấy nhân sự phù hợp"
              renderRowActions={(e) => (
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => navigate(`/crm/team/${e.id}`)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Chi tiết">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            />
          </div>
        )}

        {/* CARD VIEW */}
        {mode === "card" && (
          <div className={selectedEmployee ? "lg:col-span-1" : ""}>
            <div className={`grid gap-3 ${selectedEmployee ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
              {cardPag.paginatedItems.map((emp, idx) => (
                <EmployeeCard key={emp.id} employee={emp}
                  rank={cardPag.startIndex + idx}
                  isSelected={selectedEmployee?.id === emp.id}
                  onSelect={() => setSelectedEmployee(selectedEmployee?.id === emp.id ? null : emp)} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Không tìm thấy nhân sự phù hợp</p>
              </div>
            )}
            {filtered.length > 0 && (
              <div className="mt-3 bg-white rounded-xl border border-gray-100 overflow-hidden">
                <PaginationBar {...cardPag} onGoToPage={cardPag.goToPage} onNextPage={cardPag.nextPage}
                  onPrevPage={cardPag.prevPage} onSetPageSize={cardPag.setPageSize} />
              </div>
            )}
          </div>
        )}

        {/* Detail panel */}
        {selectedEmployee && (
          <div className="lg:col-span-2">
            <EmployeeDetail
              employee={selectedEmployee}
              onClose={() => setSelectedEmployee(null)}
              onViewDetail={() => navigate(`/crm/team/${selectedEmployee.id}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
