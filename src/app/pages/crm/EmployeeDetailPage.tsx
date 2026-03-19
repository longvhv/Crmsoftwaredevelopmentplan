/**
 * Trang chi tiết Nhân viên / AI Agent — Hiển thị KPI radar chart,
 * deals phụ trách, hoạt động gần đây, và AI metrics.
 * Phase 1: Nâng cấp Team Management
 */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Bot,
  Briefcase,
  Award,
  Mail,
  Calendar,
  ExternalLink,
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  Activity as ActivityIcon,
  Phone,
  Video,
  FileText,
  CheckSquare,
  Zap,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import type { Employee, Deal, Activity, ActivityType } from "../../types/crm";
import { fetchEmployees, fetchDeals, fetchActivities } from "../../api/crmApi";
import {
  EMPLOYEE_STATUS_CONFIG,
  DEAL_STAGE_CONFIG,
  DEAL_PRIORITY_CONFIG,
  ACTIVITY_TYPE_CONFIG,
  formatCurrency,
} from "../../constants/crmConfig";

/* ============================================================
 * Helpers
 * ============================================================ */
function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <ArrowUpRight className="w-4 h-4 text-green-500" />;
  if (trend === "down") return <ArrowDownRight className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
}

function TrendLabel({ trend }: { trend: "up" | "down" | "stable" }) {
  const config = {
    up: { label: "Đang tăng", color: "text-green-600" },
    down: { label: "Đang giảm", color: "text-red-600" },
    stable: { label: "Ổn định", color: "text-gray-500" },
  };
  const c = config[trend];
  return <span className={`text-xs ${c.color}`}>{c.label}</span>;
}

const ACT_ICONS: Record<ActivityType, React.ReactNode> = {
  call: <Phone className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  meeting: <Video className="w-3.5 h-3.5" />,
  note: <FileText className="w-3.5 h-3.5" />,
  task: <CheckSquare className="w-3.5 h-3.5" />,
};

const ACT_COLORS: Record<ActivityType, string> = {
  call: "bg-green-100 text-green-700",
  email: "bg-blue-100 text-blue-700",
  meeting: "bg-violet-100 text-violet-700",
  note: "bg-amber-100 text-amber-700",
  task: "bg-slate-100 text-slate-700",
};

/* ============================================================
 * Score Ring lớn
 * ============================================================ */
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 90 ? "#22c55e" : score >= 80 ? "#3b82f6" : score >= 70 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg text-gray-900">
        {score}
      </span>
    </div>
  );
}

/* ============================================================
 * Tab: Tổng quan — KPI Radar + Stats
 * ============================================================ */
function OverviewTab({ employee, dealsCount, activitiesCount }: {
  employee: Employee;
  dealsCount: number;
  activitiesCount: number;
}) {
  const { kpiScores } = employee;
  const radarData = [
    { metric: "Doanh thu", value: kpiScores.revenue },
    { metric: "Hoạt động", value: kpiScores.activity },
    { metric: "Chất lượng", value: kpiScores.quality },
    { metric: "AI Cộng tác", value: kpiScores.aiCollaboration },
  ];

  const kpiItems = [
    { label: "Doanh thu", value: kpiScores.revenue, color: "bg-green-500", desc: "Chỉ số đóng góp doanh thu" },
    { label: "Hoạt động", value: kpiScores.activity, color: "bg-blue-500", desc: "Mức độ hoạt động hàng ngày" },
    { label: "Chất lượng", value: kpiScores.quality, color: "bg-amber-500", desc: "Chất lượng công việc" },
    { label: "Cộng tác AI", value: kpiScores.aiCollaboration, color: "bg-violet-500", desc: "Hiệu quả phối hợp với AI" },
  ];

  // Mock monthly performance data
  const monthlyPerf = [
    { month: "T10", score: Math.max(60, employee.performanceScore - 12) },
    { month: "T11", score: Math.max(60, employee.performanceScore - 7) },
    { month: "T12", score: Math.max(60, employee.performanceScore - 3) },
    { month: "T01", score: Math.max(60, employee.performanceScore + 1) },
    { month: "T02", score: Math.max(60, employee.performanceScore - 1) },
    { month: "T03", score: employee.performanceScore },
  ];

  return (
    <div className="space-y-5">
      {/* Score + Trend */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-violet-100 p-5">
        <div className="flex items-center gap-5 flex-wrap">
          <ScoreRing score={employee.performanceScore} size={80} />
          <div className="flex-1">
            <h4 className="text-sm text-gray-800 mb-1">Điểm hiệu suất tổng hợp</h4>
            <div className="flex items-center gap-2 mb-2">
              <TrendIndicator trend={employee.performanceTrend} />
              <TrendLabel trend={employee.performanceTrend} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-lg text-gray-900">{dealsCount}</p>
                <p className="text-[11px] text-gray-500">Deals</p>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-900">{activitiesCount}</p>
                <p className="text-[11px] text-gray-500">Hoạt động</p>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-900">{employee.tags.length}</p>
                <p className="text-[11px] text-gray-500">Kỹ năng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Radar + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h4 className="text-sm text-gray-800 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-violet-500" /> KPI Radar
          </h4>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                dataKey="value"
                stroke="#8b5cf6"
                fill="#ede9fe"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(v: number) => `${v}/100`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* KPI Detail Bars */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h4 className="text-sm text-gray-800 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-500" /> Chi tiết KPI
          </h4>
          <div className="space-y-4">
            {kpiItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-sm text-gray-900">{item.value}/100</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.value}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Performance Trend */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h4 className="text-sm text-gray-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-500" /> Xu hướng hiệu suất (6 tháng gần nhất)
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyPerf}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => `${v} điểm`} />
            <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Hiệu suất" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vai trò */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h4 className="text-sm text-gray-800 mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-violet-500" /> Vai trò & Phòng ban
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded">Chính (70%)</span>
            <span className="text-sm text-gray-900">{employee.primaryRole.name}</span>
            <span className="text-xs text-gray-400">— {employee.primaryRole.department}</span>
          </div>
          {employee.secondaryRoles.length > 0 && (
            <div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Kiêm nhiệm (30%)</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {employee.secondaryRoles.map((role) => (
                  <span key={role.id} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100">
                    {role.name} ({role.department})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {employee.tags.length > 0 && (
          <div className="pt-3 mt-3 border-t border-gray-50">
            <p className="text-[11px] text-gray-400 mb-1.5">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {employee.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Tab: Deals phụ trách
 * ============================================================ */
function DealsTab({ deals, onNavigateDeal }: { deals: Deal[]; onNavigateDeal: (id: string) => void }) {
  if (deals.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <Target className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Chưa có deal nào được phân công</p>
      </div>
    );
  }

  const totalValue = deals.reduce((s, d) => s + d.value, 0);
  const won = deals.filter((d) => d.stage === "closed-won");
  const active = deals.filter((d) => d.stage !== "closed-won" && d.stage !== "closed-lost");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{deals.length}</p>
          <p className="text-xs text-gray-500">Tổng deals</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700">{won.length}</p>
          <p className="text-xs text-green-600">Thắng</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
          <p className="text-lg text-violet-700">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-violet-600">Tổng giá trị</p>
        </div>
      </div>

      <div className="space-y-2">
        {deals.map((deal) => {
          const stageConfig = DEAL_STAGE_CONFIG[deal.stage];
          const priorityConfig = DEAL_PRIORITY_CONFIG[deal.priority];
          return (
            <button
              key={deal.id}
              type="button"
              onClick={() => onNavigateDeal(deal.id)}
              className="w-full text-left bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:border-gray-200 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h4 className="text-sm text-gray-900 truncate">{deal.title}</h4>
                  <p className="text-xs text-gray-400">{deal.company} · {deal.contactName}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${stageConfig.bgColor} ${stageConfig.color}`}>
                  {stageConfig.label}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityConfig.color}`}>
                  {priorityConfig.emoji} {priorityConfig.label}
                </span>
                <span className="text-xs text-gray-500 ml-auto">{formatCurrency(deal.value)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
 * Tab: Hoạt động gần đây
 * ============================================================ */
function ActivitiesTab({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <ActivityIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Chưa có hoạt động nào được ghi nhận</p>
      </div>
    );
  }

  // Activity breakdown
  const breakdown = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of activities) {
      map[a.type] = (map[a.type] ?? 0) + 1;
    }
    return Object.entries(map)
      .map(([type, count]) => ({
        type: type as ActivityType,
        label: ACTIVITY_TYPE_CONFIG[type as ActivityType].label,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [activities]);

  return (
    <div className="space-y-4">
      {/* Breakdown */}
      <div className="flex flex-wrap gap-2">
        {breakdown.map((item) => (
          <div key={item.type} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${ACT_COLORS[item.type]}`}>
            {ACT_ICONS[item.type]}
            <span className="text-xs">{item.label}: {item.count}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {activities.slice(0, 20).map((act) => {
          const typeConfig = ACTIVITY_TYPE_CONFIG[act.type];
          return (
            <div key={act.id} className="flex gap-3 group">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${ACT_COLORS[act.type]}`}>
                  {ACT_ICONS[act.type]}
                </div>
                <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
              </div>
              <div className="flex-1 pb-3">
                <div className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm text-gray-900">{act.title}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                  </div>
                  {act.description && <p className="text-xs text-gray-500 mb-1">{act.description}</p>}
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(act.performedAt).toLocaleDateString("vi-VN")}
                    </span>
                    {act.isAutoLogged && (
                      <span className="flex items-center gap-0.5 text-violet-500">
                        <Bot className="w-3 h-3" /> Tự động
                      </span>
                    )}
                    {act.duration && (
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{act.duration} phút</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
type DetailTab = "overview" | "deals" | "activities";

export function EmployeeDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assignedDeals, setAssignedDeals] = useState<Deal[]>([]);
  const [relatedActivities, setRelatedActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const [allEmp, allDeals, allActs] = await Promise.all([
        fetchEmployees(),
        fetchDeals(),
        fetchActivities({ performedBy: employeeId }),
      ]);

      const found = allEmp.find((e) => e.id === employeeId);
      if (!found) {
        toast.error("Không tìm thấy nhân viên");
        navigate("/crm/team");
        return;
      }
      setEmployee(found);
      setAssignedDeals(allDeals.filter((d) => d.assignedTo === employeeId));
      setRelatedActivities(allActs);
    } finally {
      setLoading(false);
    }
  }, [employeeId, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !employee) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 text-sm">Đang tải thông tin nhân viên...</p>
      </div>
    );
  }

  const isAI = employee.type === "ai";
  const statusConfig = EMPLOYEE_STATUS_CONFIG[employee.status];

  const TABS: { key: DetailTab; label: string; count?: number }[] = [
    { key: "overview", label: "Tổng quan" },
    { key: "deals", label: "Deals", count: assignedDeals.length },
    { key: "activities", label: "Hoạt động", count: relatedActivities.length },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate("/crm/team")}
          className="mt-1 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Quay lại Nhân sự"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0 ${
              isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600" : "bg-gradient-to-br from-blue-500 to-blue-600"
            }`}
          >
            {isAI ? <Bot className="w-6 h-6" /> : employee.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h1 className="text-gray-900 truncate">{employee.name}</h1>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded ${isAI ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>
                {isAI ? "AI Agent" : "Nhân viên"}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              <span className="text-xs text-gray-400">
                {employee.primaryRole.name} · {employee.primaryRole.department}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Quick info */}
      <div className="flex items-center gap-4 flex-wrap text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Mail className="w-4 h-4 text-gray-400" /> {employee.email}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" /> Tham gia: {employee.joinDate}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.key
                ? "border-violet-500 text-violet-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl">
        {activeTab === "overview" && (
          <OverviewTab
            employee={employee}
            dealsCount={assignedDeals.length}
            activitiesCount={relatedActivities.length}
          />
        )}
        {activeTab === "deals" && (
          <DealsTab deals={assignedDeals} onNavigateDeal={(id) => navigate(`/crm/deals/${id}`)} />
        )}
        {activeTab === "activities" && <ActivitiesTab activities={relatedActivities} />}
      </div>

      {/* AI Insight (cho AI Agent) */}
      {isAI && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-violet-600" />
            <h4 className="text-sm text-violet-900">AI Agent Insights</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-violet-800">
            <p className="flex items-start gap-2">
              <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
              Agent đã tự động xử lý {relatedActivities.filter((a) => a.isAutoLogged).length} hoạt động trong tuần qua.
            </p>
            <p className="flex items-start gap-2">
              <Target className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
              Đang phụ trách {assignedDeals.filter((d) => d.stage !== "closed-won" && d.stage !== "closed-lost").length} deals mở với tổng giá trị{" "}
              {formatCurrency(assignedDeals.filter((d) => d.stage !== "closed-won" && d.stage !== "closed-lost").reduce((s, d) => s + d.value, 0))}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}