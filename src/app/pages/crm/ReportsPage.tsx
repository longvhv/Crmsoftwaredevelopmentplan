/**
 * Trang Báo cáo & Dự báo AI — Forecast doanh thu, phân tích pipeline,
 * win/loss analysis, AI performance metrics.
 * Phase P1.03: Reports Dashboard — Analytics visualization (Dashboard chỉ)
 */
import { useEffect, useState, useMemo } from "react";
import {
  Bot,
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Zap,
  Award,
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
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import type { Deal } from "../../types/crm";
import { fetchDeals, getEmployeeName } from "../../api/crmApi";
import {
  DEAL_STAGE_CONFIG,
  ACTIVE_DEAL_STAGES,
  formatCurrency,
  formatCompactNumber,
} from "../../constants/crmConfig";

/* ============================================================
 * Mock forecast data — AI-generated predictions
 * ============================================================ */
const MONTHLY_FORECAST = [
  { month: "T10/25", actual: 85000, forecast: null, label: "Th10" },
  { month: "T11/25", actual: 92000, forecast: null, label: "Th11" },
  { month: "T12/25", actual: 78000, forecast: null, label: "Th12" },
  { month: "T01/26", actual: 105000, forecast: null, label: "Th01" },
  { month: "T02/26", actual: 118000, forecast: null, label: "Th02" },
  { month: "T03/26", actual: 45000, forecast: 135000, label: "Th03*" },
  { month: "T04/26", actual: null, forecast: 142000, label: "Th04" },
  { month: "T05/26", actual: null, forecast: 155000, label: "Th05" },
  { month: "T06/26", actual: null, forecast: 168000, label: "Th06" },
];

const WIN_LOSS_BY_SOURCE = [
  { source: "Giới thiệu", won: 12, lost: 3, winRate: 80 },
  { source: "LinkedIn", won: 8, lost: 5, winRate: 62 },
  { source: "Website", won: 6, lost: 4, winRate: 60 },
  { source: "Cold Outreach", won: 3, lost: 8, winRate: 27 },
  { source: "Sự kiện", won: 5, lost: 2, winRate: 71 },
  { source: "Đối tác", won: 7, lost: 1, winRate: 88 },
];

const AI_PERFORMANCE = [
  { metric: "Lead Score chính xác", value: 87 },
  { metric: "Win Prediction", value: 82 },
  { metric: "Next Action hữu ích", value: 78 },
  { metric: "Auto-log chính xác", value: 95 },
  { metric: "Email Sentiment", value: 74 },
  { metric: "Deal Prioritization", value: 85 },
];

const DEAL_VELOCITY = [
  { stage: "Đánh giá", avgDays: 8, benchmark: 7 },
  { stage: "Tìm hiểu", avgDays: 12, benchmark: 10 },
  { stage: "Đề xuất", avgDays: 15, benchmark: 14 },
  { stage: "Đàm phán", avgDays: 10, benchmark: 12 },
];

const PIPELINE_COLORS = ["#8b5cf6", "#3b82f6", "#f59e0b", "#ef4444", "#10b981", "#6366f1"];

/* ============================================================
 * KPI Card
 * ============================================================ */
function KpiCard({
  icon,
  label,
  value,
  sub,
  trend,
  color = "violet",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "stable";
  color?: string;
}) {
  const bgMap: Record<string, string> = {
    violet: "bg-violet-50 border-violet-100",
    green: "bg-green-50 border-green-100",
    blue: "bg-blue-50 border-blue-100",
    amber: "bg-amber-50 border-amber-100",
  };
  const iconColorMap: Record<string, string> = {
    violet: "text-violet-600",
    green: "text-green-600",
    blue: "text-blue-600",
    amber: "text-amber-600",
  };

  return (
    <div className={`rounded-xl border p-4 ${bgMap[color] ?? bgMap.violet}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={iconColorMap[color] ?? iconColorMap.violet}>{icon}</div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-xl text-gray-900">{value}</p>
      {(sub || trend) && (
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
          {trend === "down" && <TrendingDown className="w-3 h-3 text-red-500" />}
          {sub && <span className="text-[11px] text-gray-400">{sub}</span>}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Chart Card wrapper
 * ============================================================ */
function ChartCard({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="text-violet-500">{icon}</div>}
        <h3 className="text-sm text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function ReportsPage() {
  const [allDeals, setAllDeals] = useState<Deal[]>([]);

  useEffect(() => {
    fetchDeals().then(setAllDeals);
  }, []);

  // Computed metrics
  const metrics = useMemo(() => {
    const active = allDeals.filter((d) => ACTIVE_DEAL_STAGES.includes(d.stage));
    const won = allDeals.filter((d) => d.stage === "closed-won");
    const lost = allDeals.filter((d) => d.stage === "closed-lost");

    const totalPipeline = active.reduce((s, d) => s + d.value, 0);
    const weightedPipeline = active.reduce((s, d) => s + d.value * (d.aiWinProbability / 100), 0);
    const wonValue = won.reduce((s, d) => s + d.value, 0);
    const winRate = won.length + lost.length > 0
      ? Math.round((won.length / (won.length + lost.length)) * 100)
      : 0;
    const avgDealSize = won.length > 0 ? Math.round(wonValue / won.length) : 0;

    return { active, won, lost, totalPipeline, weightedPipeline, wonValue, winRate, avgDealSize };
  }, [allDeals]);

  // Pipeline by stage for pie chart
  const pipelineByStage = useMemo(() => {
    return ACTIVE_DEAL_STAGES.map((stage) => {
      const stageDeals = allDeals.filter((d) => d.stage === stage);
      return {
        name: DEAL_STAGE_CONFIG[stage].label,
        value: stageDeals.reduce((s, d) => s + d.value, 0),
        count: stageDeals.length,
      };
    }).filter((s) => s.value > 0);
  }, [allDeals]);

  // Top performers
  const topPerformers = useMemo(() => {
    const map = new Map<string, { won: number; value: number }>();
    for (const d of allDeals.filter((d) => d.stage === "closed-won")) {
      const existing = map.get(d.assignedTo) ?? { won: 0, value: 0 };
      existing.won += 1;
      existing.value += d.value;
      map.set(d.assignedTo, existing);
    }
    return [...map.entries()]
      .map(([id, data]) => ({ id, name: getEmployeeName(id), ...data }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [allDeals]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-gray-900">Báo cáo & Dự báo AI</h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI-Powered
          </span>
        </div>
        <p className="text-gray-500">
          Forecast doanh thu · Phân tích Pipeline · Win/Loss Analysis · AI Performance
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          icon={<DollarSign className="w-4 h-4" />}
          label="Pipeline hiện tại"
          value={formatCurrency(metrics.totalPipeline)}
          sub={`${metrics.active.length} deals mở`}
          color="violet"
        />
        <KpiCard
          icon={<Bot className="w-4 h-4" />}
          label="Weighted (AI)"
          value={formatCurrency(Math.round(metrics.weightedPipeline))}
          sub="Dựa trên AI Win%"
          trend="up"
          color="blue"
        />
        <KpiCard
          icon={<Award className="w-4 h-4" />}
          label="Đã thắng"
          value={formatCurrency(metrics.wonValue)}
          sub={`${metrics.won.length} deals thắng`}
          trend="up"
          color="green"
        />
        <KpiCard
          icon={<Target className="w-4 h-4" />}
          label="Win Rate"
          value={`${metrics.winRate}%`}
          sub={`${metrics.won.length}W / ${metrics.lost.length}L`}
          color="amber"
        />
      </div>

      {/* Forecast chart + Pipeline breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Forecast */}
        <ChartCard
          title="Dự báo doanh thu (AI Forecast)"
          icon={<TrendingUp className="w-4 h-4" />}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MONTHLY_FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}K`} />
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                labelFormatter={(l) => `Tháng: ${l}`}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#8b5cf6"
                fill="#ede9fe"
                strokeWidth={2}
                name="Thực tế"
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#3b82f6"
                fill="#dbeafe"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Dự báo AI"
                connectNulls
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 p-3 bg-violet-50 rounded-lg border border-violet-100">
            <p className="text-xs text-violet-700 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              AI dự báo Q2/2026 tăng trưởng 18% so với Q1. Tổng forecast Q2: <strong>$465K</strong>
            </p>
          </div>
        </ChartCard>

        {/* Pipeline by Stage */}
        <ChartCard title="Pipeline theo giai đoạn" icon={<PieChartIcon className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pipelineByStage}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pipelineByStage.map((_, idx) => (
                  <Cell key={idx} fill={PIPELINE_COLORS[idx % PIPELINE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pipelineByStage.map((s, idx) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIPELINE_COLORS[idx % PIPELINE_COLORS.length] }}
                  />
                  <span className="text-gray-600">{s.name}</span>
                </div>
                <span className="text-gray-500">
                  {s.count} deals · {formatCompactNumber(s.value)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Win/Loss Analysis + Deal Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Win/Loss by Source */}
        <ChartCard title="Win/Loss theo nguồn" icon={<BarChart3 className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={WIN_LOSS_BY_SOURCE} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="source" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="won" stackId="a" fill="#10b981" name="Thắng" radius={[0, 0, 0, 0]} />
              <Bar dataKey="lost" stackId="a" fill="#ef4444" name="Thua" radius={[0, 4, 4, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-xs text-green-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Đối tác và Giới thiệu có win rate cao nhất (88% & 80%). Cold Outreach cần cải thiện (27%).
            </p>
          </div>
        </ChartCard>

        {/* Deal Velocity */}
        <ChartCard title="Tốc độ chuyển đổi Deal (ngày)" icon={<Calendar className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={DEAL_VELOCITY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `${v} ngày`} />
              <Bar dataKey="avgDays" fill="#8b5cf6" name="Thực tế" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" fill="#e2e8f0" name="Benchmark" radius={[4, 4, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs text-amber-700 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              Giai đoạn "Tìm hiểu" chậm hơn benchmark 2 ngày. Khuyến nghị tăng tần suất demo.
            </p>
          </div>
        </ChartCard>
      </div>

      {/* AI Performance + Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Accuracy Radar */}
        <ChartCard title="Độ chính xác AI" icon={<Bot className="w-4 h-4" />}>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={AI_PERFORMANCE}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Độ chính xác"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#ede9fe"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(v: number) => `${v}%`} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-2 p-3 bg-violet-50 rounded-lg border border-violet-100">
            <p className="text-xs text-violet-700 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              AI Auto-log đạt 95% chính xác. Email Sentiment cần training thêm (74%).
            </p>
          </div>
        </ChartCard>

        {/* Top Performers */}
        <ChartCard title="Top Performers (Closed-Won)" icon={<Award className="w-4 h-4" />}>
          {topPerformers.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Chưa có dữ liệu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topPerformers.map((p, idx) => {
                const maxValue = topPerformers[0]?.value ?? 1;
                const pct = Math.round((p.value / maxValue) * 100);
                const medals = ["bg-amber-400", "bg-gray-400", "bg-orange-400"];

                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {idx < 3 ? (
                          <div className={`w-5 h-5 rounded-full ${medals[idx]} flex items-center justify-center text-[10px] text-white`}>
                            {idx + 1}
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                            {idx + 1}
                          </div>
                        )}
                        <span className="text-sm text-gray-800">{p.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-900">{formatCurrency(p.value)}</span>
                        <span className="text-[10px] text-gray-400 ml-1.5">{p.won} deals</span>
                      </div>
                    </div>
                    <div className="ml-7 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Insight */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <p className="text-xs text-green-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Nguồn "Đối tác" + nhân viên top 1 tạo ra 42% tổng revenue. AI khuyến nghị tập trung kênh này.
            </p>
          </div>
        </ChartCard>
      </div>

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-violet-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-5 h-5 text-violet-600" />
          <h3 className="text-sm text-violet-900">Tổng kết AI — Tháng 3/2026</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-violet-800">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <p>Pipeline tăng trưởng 15% so với tháng trước. Weighted value đạt <strong>{formatCurrency(Math.round(metrics.weightedPipeline))}</strong>.</p>
          </div>
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <p>Win rate hiện tại <strong>{metrics.winRate}%</strong>, trên mức benchmark 30%. Deal cycle trung bình 45 ngày.</p>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <p>3 deals có AI Win% trên 80% cần ưu tiên close trong tuần này để đạt target tháng.</p>
          </div>
          <div className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <p>AI BDR Agent tạo 12 leads mới tuần qua, 3 leads đạt score trên 80 điểm.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
