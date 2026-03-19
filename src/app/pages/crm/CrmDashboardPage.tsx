/**
 * Trang Dashboard CRM — Tổng quan hoạt động kinh doanh real-time.
 * Phase 1: Core CRM + AI Foundation
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Activity,
  Bot,
  Phone,
  Mail,
  Video,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import type { CrmOverviewStats, Activity as CrmActivity, Deal } from "../../types/crm";
import { fetchCrmOverviewStats, fetchRecentActivities, fetchDeals, getEmployeeName } from "../../api/crmApi";
import { DEAL_STAGE_CONFIG, ACTIVE_DEAL_STAGES, formatCurrency, formatCompactNumber } from "../../constants/crmConfig";
import { SectionCard } from "../../components/SectionCard";

/* ============================================================
 * Stat Card nhỏ cho Dashboard
 * ============================================================ */
function DashStat({
  icon,
  label,
  value,
  change,
  changeType,
  bgClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  bgClass: string;
}) {
  const changeIcon =
    changeType === "up" ? (
      <ArrowUpRight className="w-3 h-3 text-green-600" />
    ) : changeType === "down" ? (
      <ArrowDownRight className="w-3 h-3 text-red-600" />
    ) : (
      <Minus className="w-3 h-3 text-gray-400" />
    );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg ${bgClass} flex items-center justify-center text-white`}>
          {icon}
        </div>
        {change && (
          <span className="flex items-center gap-0.5 text-xs">
            {changeIcon}
            <span className={changeType === "up" ? "text-green-600" : changeType === "down" ? "text-red-600" : "text-gray-400"}>
              {change}
            </span>
          </span>
        )}
      </div>
      <p className="text-2xl text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

/* ============================================================
 * Icon theo loại hoạt động
 * ============================================================ */
const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  call: <Phone className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  meeting: <Video className="w-3.5 h-3.5" />,
  note: <FileText className="w-3.5 h-3.5" />,
  task: <Target className="w-3.5 h-3.5" />,
};

const ACTIVITY_COLORS: Record<string, string> = {
  call: "bg-green-100 text-green-700",
  email: "bg-blue-100 text-blue-700",
  meeting: "bg-violet-100 text-violet-700",
  note: "bg-amber-100 text-amber-700",
  task: "bg-slate-100 text-slate-700",
};

/* ============================================================
 * Component: Danh sách hoạt động gần đây
 * ============================================================ */
function RecentActivities({ items }: { items: CrmActivity[] }) {
  return (
    <div className="space-y-2">
      {items.map((act) => (
        <div
          key={act.id}
          className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${ACTIVITY_COLORS[act.type]}`}>
            {ACTIVITY_ICONS[act.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">{act.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-gray-400">
                {getEmployeeName(act.performedBy)}
              </span>
              {act.isAutoLogged && (
                <span className="text-[10px] bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Bot className="w-2.5 h-2.5" /> AI
                </span>
              )}
            </div>
          </div>
          <span className="text-[11px] text-gray-400 flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3 h-3" />
            {formatTime(act.performedAt)}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatTime(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date("2026-03-03T12:00:00");
  const diffHours = Math.round((now.getTime() - d.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return "Vừa xong";
  if (diffHours < 24) return `${diffHours}h trước`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}

/* ============================================================
 * Component: Top deals
 * ============================================================ */
function TopDeals({ deals: topDeals }: { deals: Deal[] }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-2">
      {topDeals.map((deal) => {
        const stageConfig = DEAL_STAGE_CONFIG[deal.stage];
        return (
          <div
            key={deal.id}
            onClick={() => navigate(`/crm/deals/${deal.id}`)}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{deal.title}</p>
              <p className="text-[11px] text-gray-400">{deal.company}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-gray-900">{formatCurrency(deal.value)}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${stageConfig.bgColor} ${stageConfig.color}`}>
                {stageConfig.label}
              </span>
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
const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#f59e0b", "#6366f1"];

export function CrmDashboardPage() {
  const [stats, setStats] = useState<CrmOverviewStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<CrmActivity[]>([]);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);

  useEffect(() => {
    async function load() {
      const [s, a, d] = await Promise.all([
        fetchCrmOverviewStats(),
        fetchRecentActivities(8),
        fetchDeals(),
      ]);
      setStats(s);
      setRecentActivities(a);
      setAllDeals(d);
    }
    load();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 text-sm">Đang tải dữ liệu...</p>
      </div>
    );
  }

  const activeDeals = allDeals.filter((d) => ACTIVE_DEAL_STAGES.includes(d.stage));
  const topDeals = [...activeDeals].sort((a, b) => b.value - a.value).slice(0, 5);

  const pipelineByStage = ACTIVE_DEAL_STAGES.map((stage) => {
    const stageDeals = activeDeals.filter((d) => d.stage === stage);
    return {
      name: DEAL_STAGE_CONFIG[stage].label,
      value: stageDeals.reduce((sum, d) => sum + d.value, 0),
      count: stageDeals.length,
    };
  });

  const dealsByPriority = [
    { name: "Nóng 🔥", value: activeDeals.filter((d) => d.priority === "hot").length },
    { name: "Ấm ☀️", value: activeDeals.filter((d) => d.priority === "warm").length },
    { name: "Lạnh ❄️", value: activeDeals.filter((d) => d.priority === "cold").length },
  ];

  /* Dữ liệu Revenue trend 6 tháng gần nhất */
  const revenueTrend = [
    { month: "T10", revenue: 125000, target: 120000 },
    { month: "T11", revenue: 148000, target: 130000 },
    { month: "T12", revenue: 132000, target: 140000 },
    { month: "T01", revenue: 165000, target: 150000 },
    { month: "T02", revenue: 178000, target: 160000 },
    { month: "T03", revenue: 142000, target: 170000 },
  ];

  /* Dữ liệu Conversion funnel */
  const conversionFunnel = ACTIVE_DEAL_STAGES.map((stage, idx) => {
    const count = activeDeals.filter((d) => d.stage === stage).length;
    return {
      name: DEAL_STAGE_CONFIG[stage].label,
      count,
      percentage: activeDeals.length > 0 ? Math.round((count / activeDeals.length) * 100) : 0,
    };
  });

  /* Dữ liệu Activity theo ngày trong tuần */
  const activityByDay = [
    { day: "T2", human: 12, ai: 8 },
    { day: "T3", human: 15, ai: 10 },
    { day: "T4", human: 18, ai: 12 },
    { day: "T5", human: 14, ai: 15 },
    { day: "T6", human: 20, ai: 11 },
    { day: "T7", human: 5, ai: 7 },
    { day: "CN", human: 2, ai: 6 },
  ];

  return (
    <div className="space-y-5">
      {/* Tiêu đề */}
      <header>
        <h1 className="text-gray-900">CRM Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Tổng quan hoạt động kinh doanh · Cập nhật real-time · AI-powered insights
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <DashStat
          icon={<Users className="w-4 h-4" />}
          label="Tổng liên hệ"
          value={stats.totalContacts.toString()}
          change="+12%"
          changeType="up"
          bgClass="bg-blue-500"
        />
        <DashStat
          icon={<Target className="w-4 h-4" />}
          label="Deals đang mở"
          value={stats.activeDeals.toString()}
          change="+3"
          changeType="up"
          bgClass="bg-violet-500"
        />
        <DashStat
          icon={<DollarSign className="w-4 h-4" />}
          label="Pipeline"
          value={formatCompactNumber(stats.totalPipelineValue)}
          change="+18%"
          changeType="up"
          bgClass="bg-green-500"
        />
        <DashStat
          icon={<TrendingUp className="w-4 h-4" />}
          label="Tỷ lệ chốt"
          value={`${stats.conversionRate}%`}
          change="-2%"
          changeType="down"
          bgClass="bg-amber-500"
        />
        <DashStat
          icon={<Bot className="w-4 h-4" />}
          label="AI Actions hôm nay"
          value={stats.aiActionsToday.toString()}
          change="24/7"
          changeType="neutral"
          bgClass="bg-indigo-500"
        />
      </div>

      {/* Charts + Activities */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Pipeline by stage */}
        <SectionCard
          title="Pipeline theo giai đoạn"
          subtitle="Giá trị đang mở"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pipelineByStage}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tickFormatter={(v: number) => formatCompactNumber(v)}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Giá trị"]}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Deals by priority pie */}
        <SectionCard title="Phân bổ ưu tiên" subtitle="Deals đang mở">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dealsByPriority}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {dealsByPriority.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
            <span>Tổng: {activeDeals.length} deals</span>
            <span>·</span>
            <span>{formatCurrency(stats.totalPipelineValue)}</span>
          </div>
        </SectionCard>
      </div>

      {/* Revenue Trend + Conversion Funnel + Activity By Day */}
      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard
          title="Xu hướng doanh thu"
          subtitle="6 tháng gần nhất"
          icon={<TrendingUp className="w-5 h-5" />}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => formatCompactNumber(v)} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [formatCurrency(v)]} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Doanh thu"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Mục tiêu"
                stroke="#f59e0b"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard
          title="Hoạt động theo ngày"
          subtitle="Human vs AI (tuần hiện tại)"
          icon={<Activity className="w-5 h-5" />}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activityByDay}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="human" name="Con người" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="stack" />
              <Bar dataKey="ai" name="AI" fill="#8b5cf6" radius={[4, 4, 0, 0]} stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Con người
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-violet-500" /> AI Agent
            </span>
          </div>
        </SectionCard>
      </div>

      {/* Conversion Funnel */}
      <SectionCard title="Phễu chuyển đổi" subtitle="Tỷ lệ deals ở mỗi giai đoạn" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-2">
          {conversionFunnel.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-16 text-right flex-shrink-0">{item.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
                  style={{ width: `${Math.max(item.percentage, 8)}%` }}
                />
                <span className="absolute inset-0 flex items-center px-3 text-xs text-gray-700">
                  {item.count} deals · {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Top Deals + Recent Activities */}
      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard
          title="Top Deals"
          subtitle="Theo giá trị"
          icon={<DollarSign className="w-5 h-5" />}
        >
          <TopDeals deals={topDeals} />
        </SectionCard>

        <SectionCard
          title="Hoạt động gần đây"
          subtitle="Cả Human & AI"
          icon={<Activity className="w-5 h-5" />}
        >
          <RecentActivities items={recentActivities} />
        </SectionCard>
      </div>

      {/* AI Insights */}
      <SectionCard title="AI Insights" subtitle="Phân tích tự động" icon={<Bot className="w-5 h-5" />}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              title: "Deal TechCorp có xác suất thắng 82%",
              desc: "AI khuyến nghị gửi proposal cuối cùng với ưu đãi 5% để đẩy nhanh quá trình đàm phán.",
              type: "success" as const,
            },
            {
              title: "Lead RetailPlus đã mất hoạt động 78 ngày",
              desc: "Không có tương tác từ 15/12/2025. Đề xuất chuyển sang trạng thái inactive hoặc re-engage.",
              type: "warning" as const,
            },
            {
              title: "AI BDR đã tạo 12 leads mới tuần này",
              desc: "Tăng 20% so với tuần trước. 3 leads có AI score > 80 cần follow-up ngay.",
              type: "info" as const,
            },
          ].map((insight) => (
            <div
              key={insight.title}
              className={`p-4 rounded-xl border ${
                insight.type === "success"
                  ? "border-green-200 bg-green-50"
                  : insight.type === "warning"
                  ? "border-amber-200 bg-amber-50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <h4
                className={`text-sm mb-1 ${
                  insight.type === "success"
                    ? "text-green-800"
                    : insight.type === "warning"
                    ? "text-amber-800"
                    : "text-blue-800"
                }`}
              >
                {insight.title}
              </h4>
              <p
                className={`text-xs ${
                  insight.type === "success"
                    ? "text-green-600"
                    : insight.type === "warning"
                    ? "text-amber-600"
                    : "text-blue-600"
                }`}
              >
                {insight.desc}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}