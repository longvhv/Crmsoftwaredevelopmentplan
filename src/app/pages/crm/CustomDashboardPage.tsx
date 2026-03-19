/**
 * Trang Custom Dashboard — Widgets kéo thả, ẩn/hiện, resize.
 * User có thể tùy chỉnh layout dashboard với các widget:
 * Revenue, Pipeline, Activities, Tasks, NPS, Forecast, Top Deals,
 * Team Performance, AI Recommendations.
 * Phase 1: Mock data + drag to reorder + toggle visibility.
 */
import { useState, useCallback, useMemo } from "react";
import {
  LayoutDashboard,
  GripVertical,
  Eye,
  EyeOff,
  Settings2,
  X,
  DollarSign,
  Kanban,
  Activity,
  ListChecks,
  MessageSquareHeart,
  LineChart,
  Trophy,
  Users,
  Sparkles,
  Bot,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  BarChart3,
  PieChart,
  Save,
  RotateCcw,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RPieChart,
  Pie,
  LineChart as RLineChart,
  Line,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type WidgetSize = "small" | "medium" | "large";

interface Widget {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  size: WidgetSize;
  visible: boolean;
  order: number;
}

/* ============================================================
 * Widget Data
 * ============================================================ */
const REVENUE_DATA = [
  { month: "T10", value: 180 }, { month: "T11", value: 210 },
  { month: "T12", value: 195 }, { month: "T1", value: 245 },
  { month: "T2", value: 260 }, { month: "T3", value: 280 },
];

const PIPELINE_STAGES = [
  { stage: "Tiếp cận", count: 24, value: 480 },
  { stage: "Tìm hiểu", count: 18, value: 620 },
  { stage: "Đề xuất", count: 12, value: 540 },
  { stage: "Thương lượng", count: 8, value: 380 },
  { stage: "Chốt", count: 5, value: 210 },
];

const PIPELINE_COLORS = ["#6366f1", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

const ACTIVITY_LOG = [
  { id: "a1", action: "Gửi email đề xuất", contact: "David Chen", time: "10 phút trước", type: "email" },
  { id: "a2", action: "Gọi điện follow-up", contact: "Robert Kim", time: "32 phút trước", type: "call" },
  { id: "a3", action: "Demo AI Platform", contact: "Tanaka Yuki", time: "1 giờ trước", type: "meeting" },
  { id: "a4", action: "Gửi báo giá v2", contact: "Emma Wilson", time: "2 giờ trước", type: "email" },
  { id: "a5", action: "Họp review sprint", contact: "Lý Quang Minh", time: "3 giờ trước", type: "meeting" },
];

const TASK_SUMMARY = [
  { status: "Hoàn thành", count: 28, color: "#22c55e" },
  { status: "Đang làm", count: 14, color: "#3b82f6" },
  { status: "Chờ", count: 8, color: "#f59e0b" },
  { status: "Quá hạn", count: 3, color: "#ef4444" },
];

const TOP_DEALS = [
  { name: "TechCorp AI Phase 2", value: 120000, prob: 85, owner: "Nguyễn Văn An" },
  { name: "GlobalSoft WMS v3", value: 95000, prob: 72, owner: "Hoàng Thị Mai" },
  { name: "VietFintech CRM+", value: 80000, prob: 90, owner: "Lê Minh Cường" },
  { name: "MediSys EMR Phase 2", value: 75000, prob: 65, owner: "Hoàng Thị Mai" },
  { name: "SeoulTech ML Pipeline", value: 60000, prob: 55, owner: "Đỗ Hải Yến" },
];

const TEAM_PERF = [
  { name: "An", quota: 300, achieved: 280, attainment: 93 },
  { name: "Cường", quota: 250, achieved: 210, attainment: 84 },
  { name: "Mai", quota: 220, achieved: 210, attainment: 95 },
  { name: "Hùng", quota: 200, achieved: 140, attainment: 70 },
  { name: "Nova 🤖", quota: 150, achieved: 175, attainment: 117 },
  { name: "Tùng", quota: 180, achieved: 95, attainment: 53 },
  { name: "Yến", quota: 160, achieved: 125, attainment: 78 },
];

const NPS_MINI = [
  { month: "T10", nps: 42 }, { month: "T11", nps: 38 },
  { month: "T12", nps: 35 }, { month: "T1", nps: 40 },
  { month: "T2", nps: 36 }, { month: "T3", nps: 38 },
];

const AI_RECOMMENDATIONS = [
  { id: "r1", text: "TechCorp Phase 2 sẵn sàng close — schedule final meeting tuần này", priority: "high" },
  { id: "r2", text: "Robert Kim (FinServe) chưa được contact 10 ngày — gọi ngay để giữ deal", priority: "high" },
  { id: "r3", text: "3 leads mới từ webinar AI Demo cần nurture email sequence", priority: "medium" },
  { id: "r4", text: "Phạm Thanh Tùng đang dưới 60% target — cần coaching session", priority: "medium" },
  { id: "r5", text: "Cross-sell MediSys: Phase 2 EMR + mobile app bundle giảm 10%", priority: "low" },
];

const FORECAST_MINI = [
  { month: "T3", conservative: 210, base: 260, optimistic: 340 },
  { month: "T4", conservative: 200, base: 250, optimistic: 330 },
  { month: "T5", conservative: 220, base: 275, optimistic: 360 },
  { month: "T6", conservative: 230, base: 290, optimistic: 380 },
];

/* ============================================================
 * Default Widgets
 * ============================================================ */
const DEFAULT_WIDGETS: Widget[] = [
  { id: "revenue", title: "Doanh thu", icon: DollarSign, size: "medium", visible: true, order: 0 },
  { id: "pipeline", title: "Pipeline", icon: Kanban, size: "medium", visible: true, order: 1 },
  { id: "activities", title: "Hoạt động gần đây", icon: Activity, size: "medium", visible: true, order: 2 },
  { id: "tasks", title: "Công việc", icon: ListChecks, size: "small", visible: true, order: 3 },
  { id: "top-deals", title: "Top Deals", icon: Trophy, size: "medium", visible: true, order: 4 },
  { id: "team", title: "Team Performance", icon: Users, size: "medium", visible: true, order: 5 },
  { id: "nps", title: "NPS Score", icon: MessageSquareHeart, size: "small", visible: true, order: 6 },
  { id: "forecast", title: "Dự báo", icon: LineChart, size: "medium", visible: true, order: 7 },
  { id: "ai-recs", title: "AI Gợi ý", icon: Sparkles, size: "medium", visible: true, order: 8 },
];

/* ============================================================
 * Widget Renderers
 * ============================================================ */
function RevenueWidget() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-green-50 rounded-lg p-2 text-center flex-1">
          <p className="text-lg text-green-600">$1.37M</p>
          <p className="text-[9px] text-gray-400">YTD Revenue</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center flex-1">
          <p className="text-sm text-gray-900 flex items-center justify-center gap-0.5">
            <ArrowUpRight className="w-3 h-3 text-green-500" /> 18%
          </p>
          <p className="text-[9px] text-gray-400">vs năm trước</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={REVENUE_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `$${v}K`} />
          <Tooltip formatter={(v: number) => [`$${v}K`, "Doanh thu"]} />
          <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function PipelineWidget() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 text-[10px] text-gray-400">
        <span>67 deals</span><span>·</span><span>$2.23M pipeline</span>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={PIPELINE_STAGES} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 9 }} />
          <YAxis type="category" dataKey="stage" tick={{ fontSize: 9 }} width={70} />
          <Tooltip formatter={(v: number, n: string) => [n === "count" ? `${v} deals` : `$${v}K`, n === "count" ? "Số deal" : "Giá trị"]} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {PIPELINE_STAGES.map((_, i) => <Cell key={i} fill={PIPELINE_COLORS[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ActivitiesWidget() {
  return (
    <div className="space-y-2">
      {ACTIVITY_LOG.map((a) => {
        const colors: Record<string, string> = {
          email: "bg-blue-50 text-blue-600",
          call: "bg-green-50 text-green-600",
          meeting: "bg-violet-50 text-violet-600",
        };
        return (
          <div key={a.id} className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${colors[a.type] ?? "bg-gray-50"}`}>
              {a.type === "email" ? "📧" : a.type === "call" ? "📞" : "🤝"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-800 truncate">{a.action}</p>
              <p className="text-[9px] text-gray-400">{a.contact} · {a.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TasksWidget() {
  const total = TASK_SUMMARY.reduce((s, t) => s + t.count, 0);
  return (
    <div>
      <p className="text-sm text-gray-900 mb-2">{total} tổng</p>
      <div className="space-y-1.5">
        {TASK_SUMMARY.map((t) => (
          <div key={t.status} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
            <span className="flex-1 text-xs text-gray-600">{t.status}</span>
            <span className="text-xs text-gray-900">{t.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopDealsWidget() {
  return (
    <div className="space-y-2">
      {TOP_DEALS.map((d, i) => (
        <div key={i} className="flex items-center gap-2.5 p-1.5 rounded-lg bg-gray-50">
          <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[9px] flex-shrink-0">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-800 truncate">{d.name}</p>
            <p className="text-[9px] text-gray-400">{d.owner}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-900">${(d.value / 1000).toFixed(0)}K</p>
            <p className={`text-[8px] ${d.prob >= 80 ? "text-green-600" : d.prob >= 60 ? "text-amber-600" : "text-gray-400"}`}>{d.prob}%</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamWidget() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={TEAM_PERF}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 9 }} />
        <YAxis tick={{ fontSize: 9 }} domain={[0, 130]} tickFormatter={(v) => `${v}%`} />
        <Tooltip formatter={(v: number) => [`${v}%`, "Attainment"]} />
        <Bar dataKey="attainment" radius={[4, 4, 0, 0]}>
          {TEAM_PERF.map((t, i) => (
            <Cell key={i} fill={t.attainment >= 100 ? "#22c55e" : t.attainment >= 70 ? "#f59e0b" : "#ef4444"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function NPSWidget() {
  const currentNPS = NPS_MINI[NPS_MINI.length - 1].nps;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-2xl ${currentNPS >= 50 ? "text-green-600" : currentNPS >= 0 ? "text-amber-600" : "text-red-600"}`}>
          +{currentNPS}
        </span>
        <span className="text-[10px] text-gray-400">NPS hiện tại</span>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <RLineChart data={NPS_MINI}>
          <XAxis dataKey="month" tick={{ fontSize: 8 }} />
          <Tooltip formatter={(v: number) => [`+${v}`, "NPS"]} />
          <Line type="monotone" dataKey="nps" stroke="#6366f1" strokeWidth={2} dot={{ r: 2 }} />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ForecastWidget() {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={FORECAST_MINI}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 9 }} />
        <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => `$${v}K`} />
        <Tooltip formatter={(v: number) => [`$${v}K`]} />
        <Area type="monotone" dataKey="optimistic" stroke="#22c55e" fill="#22c55e" fillOpacity={0.05} strokeWidth={1} />
        <Area type="monotone" dataKey="base" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
        <Area type="monotone" dataKey="conservative" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.05} strokeWidth={1} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function AIRecsWidget() {
  const priorityStyles: Record<string, string> = {
    high: "border-l-red-500 bg-red-50/30",
    medium: "border-l-amber-500 bg-amber-50/30",
    low: "border-l-green-500 bg-green-50/30",
  };
  return (
    <div className="space-y-1.5">
      {AI_RECOMMENDATIONS.map((r) => (
        <div key={r.id} className={`border-l-2 rounded-r-lg p-2 ${priorityStyles[r.priority]}`}>
          <p className="text-xs text-gray-700 flex items-start gap-1.5">
            <Bot className="w-3 h-3 text-violet-500 mt-0.5 flex-shrink-0" />
            {r.text}
          </p>
        </div>
      ))}
    </div>
  );
}

const WIDGET_RENDERERS: Record<string, () => React.ReactNode> = {
  revenue: () => <RevenueWidget />,
  pipeline: () => <PipelineWidget />,
  activities: () => <ActivitiesWidget />,
  tasks: () => <TasksWidget />,
  "top-deals": () => <TopDealsWidget />,
  team: () => <TeamWidget />,
  nps: () => <NPSWidget />,
  forecast: () => <ForecastWidget />,
  "ai-recs": () => <AIRecsWidget />,
};

/* ============================================================
 * Widget Card
 * ============================================================ */
function WidgetCard({
  widget,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isEditing,
}: {
  widget: Widget;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
}) {
  const Icon = widget.icon;
  const sizeClass = widget.size === "small" ? "col-span-1" : widget.size === "large" ? "sm:col-span-2 lg:col-span-3" : "sm:col-span-1 lg:col-span-1";

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-4 ${sizeClass} ${isEditing ? "ring-2 ring-violet-200 ring-offset-1" : ""} hover:shadow-sm transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-800 flex items-center gap-1.5">
          <Icon className="w-4 h-4 text-violet-500" />
          {widget.title}
        </h3>
        {isEditing && (
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={onMoveUp} disabled={isFirst}
              className="p-1 text-gray-400 hover:text-violet-600 disabled:opacity-30">
              <TrendingUp className="w-3 h-3" />
            </button>
            <button type="button" onClick={onMoveDown} disabled={isLast}
              className="p-1 text-gray-400 hover:text-violet-600 disabled:opacity-30">
              <TrendingDown className="w-3 h-3" />
            </button>
            <GripVertical className="w-3.5 h-3.5 text-gray-300" />
          </div>
        )}
      </div>
      {WIDGET_RENDERERS[widget.id]?.()}
    </div>
  );
}

/* ============================================================
 * Settings Panel
 * ============================================================ */
function SettingsPanel({
  widgets,
  onToggle,
  onClose,
  onReset,
}: {
  widgets: Widget[];
  onToggle: (id: string) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-violet-600" /> Quản lý Widgets
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {widgets.map((w) => {
            const Icon = w.icon;
            return (
              <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-violet-500" />
                  <span className="text-sm text-gray-800">{w.title}</span>
                </div>
                <button type="button" onClick={() => onToggle(w.id)}
                  className={`p-1.5 rounded-lg transition-colors ${w.visible ? "bg-violet-100 text-violet-700" : "bg-gray-200 text-gray-400"}`}>
                  {w.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <button type="button" onClick={onReset}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <RotateCcw className="w-3.5 h-3.5" /> Đặt lại mặc định
          </button>
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Xong</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function CustomDashboardPage() {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const visibleWidgets = useMemo(() =>
    widgets.filter((w) => w.visible).sort((a, b) => a.order - b.order),
  [widgets]);

  const moveWidget = useCallback((id: string, direction: "up" | "down") => {
    setWidgets((prev) => {
      const visible = prev.filter((w) => w.visible).sort((a, b) => a.order - b.order);
      const idx = visible.findIndex((w) => w.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= visible.length) return prev;

      const newWidgets = prev.map((w) => ({ ...w }));
      const w1 = newWidgets.find((w) => w.id === visible[idx].id)!;
      const w2 = newWidgets.find((w) => w.id === visible[swapIdx].id)!;
      const tmpOrder = w1.order;
      w1.order = w2.order;
      w2.order = tmpOrder;
      return newWidgets;
    });
  }, []);

  const toggleWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.map((w) => w.id === id ? { ...w, visible: !w.visible } : w));
  }, []);

  const resetWidgets = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
    toast.success("Đã đặt lại dashboard mặc định");
  }, []);

  const saveLayout = useCallback(() => {
    setIsEditing(false);
    toast.success("Đã lưu bố cục dashboard");
  }, []);

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-violet-600" /> Dashboard Tuỳ chỉnh
          </h1>
          <p className="text-gray-500 mt-0.5">
            Kéo thả, ẩn/hiện widgets — Tùy chỉnh dashboard theo nhu cầu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            <Settings2 className="w-4 h-4" /> Widgets
          </button>
          {isEditing ? (
            <button type="button" onClick={saveLayout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700">
              <Save className="w-4 h-4" /> Lưu
            </button>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-100 text-violet-700 text-sm hover:bg-violet-200">
              <GripVertical className="w-4 h-4" /> Sắp xếp
            </button>
          )}
        </div>
      </header>

      {isEditing && (
        <div className="bg-violet-50 rounded-lg border border-violet-200 p-3 flex items-center gap-2 text-sm text-violet-700">
          <Zap className="w-4 h-4 flex-shrink-0" />
          Chế độ chỉnh sửa — Dùng nút ↑↓ để sắp xếp widgets, hoặc bấm "Widgets" để ẩn/hiện.
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 p-3">
          <DollarSign className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-gray-900">$280K</p>
          <p className="text-xs text-green-700">Doanh thu T3/2026</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">67</p>
          <p className="text-xs text-gray-500">Deals trong pipeline</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-violet-600">89%</p>
          <p className="text-xs text-gray-500">Attainment TB team</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-green-600">+38</p>
          <p className="text-xs text-gray-500">NPS Score</p>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleWidgets.map((w, i) => (
          <WidgetCard
            key={w.id}
            widget={w}
            onMoveUp={() => moveWidget(w.id, "up")}
            onMoveDown={() => moveWidget(w.id, "down")}
            isFirst={i === 0}
            isLast={i === visibleWidgets.length - 1}
            isEditing={isEditing}
          />
        ))}
      </div>

      {visibleWidgets.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <LayoutDashboard className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm mb-2">Không có widget nào hiển thị</p>
          <button type="button" onClick={() => setShowSettings(true)}
            className="text-sm text-violet-600 hover:underline flex items-center gap-1 mx-auto">
            <Plus className="w-4 h-4" /> Thêm widgets
          </button>
        </div>
      )}

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Dashboard Summary</h4>
        </div>
        <p className="text-sm text-violet-800">
          Tháng 3 đang trên đà tốt với doanh thu $280K (+7.7% vs T2). Pipeline $2.23M coverage 297%.
          2 deals cần action ngay: TechCorp Phase 2 (close tuần này) và FinServe follow-up (10 ngày không contact).
          Team attainment 89% — cần push Phạm Thanh Tùng (53%) và Trần Đức Hùng (70%).
        </p>
      </div>

      {showSettings && (
        <SettingsPanel
          widgets={widgets}
          onToggle={toggleWidget}
          onClose={() => setShowSettings(false)}
          onReset={resetWidgets}
        />
      )}
    </div>
  );
}
