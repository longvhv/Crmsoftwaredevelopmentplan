/**
 * Trang AI Insights — Tổng hợp mọi phân tích AI cho CRM.
 * Win/loss analysis, Revenue forecast, Churn prediction,
 * Lead scoring distribution, Sentiment analytics, AI Agent performance.
 * Phase 1: Visual dashboard with mock AI data.
 */
import { useState, useMemo } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  DollarSign,
  Users,
  Bot,
  Zap,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  Lightbulb,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Activity,
  Eye,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type InsightCategory = "all" | "revenue" | "deals" | "leads" | "churn" | "agents";

interface ActionableInsight {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  type: "opportunity" | "warning" | "info";
  metric?: string;
  action: string;
}

/* ============================================================
 * Mock Data — AI-generated analytics
 * ============================================================ */
const REVENUE_FORECAST = [
  { month: "T10/25", actual: 185000, forecast: null },
  { month: "T11/25", actual: 210000, forecast: null },
  { month: "T12/25", actual: 195000, forecast: null },
  { month: "T1/26", actual: 245000, forecast: null },
  { month: "T2/26", actual: 220000, forecast: null },
  { month: "T3/26", actual: 280000, forecast: 270000 },
  { month: "T4/26", actual: null, forecast: 310000 },
  { month: "T5/26", actual: null, forecast: 340000 },
  { month: "T6/26", actual: null, forecast: 365000 },
  { month: "T7/26", actual: null, forecast: 395000 },
  { month: "T8/26", actual: null, forecast: 420000 },
];

const WIN_LOSS_DATA = [
  { stage: "Qualification", won: 45, lost: 12 },
  { stage: "Discovery", won: 38, lost: 15 },
  { stage: "Proposal", won: 30, lost: 18 },
  { stage: "Negotiation", won: 25, lost: 8 },
  { stage: "Closed", won: 22, lost: 6 },
];

const LOSS_REASONS = [
  { reason: "Giá cả", count: 18, pct: 31 },
  { reason: "Tính năng thiếu", count: 12, pct: 21 },
  { reason: "Đối thủ cạnh tranh", count: 10, pct: 17 },
  { reason: "Ngân sách cắt giảm", count: 8, pct: 14 },
  { reason: "Thời gian triển khai dài", count: 6, pct: 10 },
  { reason: "Khác", count: 4, pct: 7 },
];
const LOSS_COLORS = ["#ef4444", "#f97316", "#eab308", "#6366f1", "#8b5cf6", "#94a3b8"];

const LEAD_SCORE_DIST = [
  { range: "0-20", count: 12, label: "Rất lạnh" },
  { range: "21-40", count: 28, label: "Lạnh" },
  { range: "41-60", count: 45, label: "Ấm" },
  { range: "61-80", count: 38, label: "Nóng" },
  { range: "81-100", count: 15, label: "Rất nóng" },
];
const LEAD_COLORS = ["#94a3b8", "#60a5fa", "#fbbf24", "#f97316", "#ef4444"];

const CHURN_RISK = [
  { name: "TechCorp Inc.", risk: 78, value: 120000, reason: "Không phản hồi 30 ngày", lastContact: "2026-01-28" },
  { name: "DigitalWave EU", risk: 72, value: 150000, reason: "Engagement giảm 60%", lastContact: "2026-02-05" },
  { name: "StartupXYZ", risk: 65, value: 35000, reason: "Ticket hỗ trợ tăng vọt", lastContact: "2026-02-20" },
  { name: "RetailPro Asia", risk: 58, value: 90000, reason: "Không gia hạn module mới", lastContact: "2026-02-15" },
  { name: "EduTech Global", risk: 45, value: 55000, reason: "Sử dụng giảm 25%", lastContact: "2026-03-01" },
];

const SENTIMENT_TREND = [
  { week: "T7", positive: 65, neutral: 25, negative: 10 },
  { week: "T8", positive: 60, neutral: 28, negative: 12 },
  { week: "T9", positive: 70, neutral: 22, negative: 8 },
  { week: "T10", positive: 68, neutral: 24, negative: 8 },
  { week: "T11", positive: 72, neutral: 20, negative: 8 },
  { week: "T12", positive: 75, neutral: 18, negative: 7 },
];

const AI_AGENT_PERF = [
  { metric: "Email mở", agent: 82, human: 65 },
  { metric: "Phản hồi", agent: 78, human: 70 },
  { metric: "Chuyển đổi", agent: 45, human: 55 },
  { metric: "Tốc độ", agent: 95, human: 60 },
  { metric: "Chính xác", agent: 88, human: 92 },
  { metric: "Cá nhân hóa", agent: 70, human: 85 },
];

const ACTIONABLE_INSIGHTS: ActionableInsight[] = [
  {
    id: "ai1", category: "revenue", title: "Doanh thu Q2 dự kiến tăng 25%",
    description: "Dựa trên pipeline hiện tại và tỷ lệ chuyển đổi lịch sử, AI dự đoán doanh thu Q2/2026 đạt $1.41M.",
    impact: "high", type: "opportunity", metric: "+$280K", action: "Tăng cường follow-up 15 deal đang ở giai đoạn Negotiation",
  },
  {
    id: "ai2", category: "churn", title: "5 khách hàng có nguy cơ rời bỏ cao",
    description: "AI phát hiện 5 khách hàng với tổng giá trị $450K có dấu hiệu churn trong 30 ngày tới.",
    impact: "high", type: "warning", metric: "$450K at risk", action: "Triển khai chương trình win-back ngay cho 2 khách hàng rủi ro cao nhất",
  },
  {
    id: "ai3", category: "leads", title: "Kênh LinkedIn có ROI cao nhất",
    description: "Lead từ LinkedIn Sales Navigator có tỷ lệ chuyển đổi 38% — cao gấp 2.3 lần kênh khác.",
    impact: "medium", type: "info", metric: "38% CVR", action: "Tăng ngân sách LinkedIn InMail thêm 30%",
  },
  {
    id: "ai4", category: "deals", title: "Thời gian proposal → close trung bình tăng",
    description: "Chu kỳ từ Proposal đến Close tăng từ 18 lên 24 ngày. Nguyên nhân: thiếu follow-up sau demo.",
    impact: "medium", type: "warning", metric: "+6 ngày", action: "Thiết lập automation follow-up 48h sau khi gửi proposal",
  },
  {
    id: "ai5", category: "agents", title: "AI Agent xử lý 340 tác vụ/tuần",
    description: "AI Sales Agent đã tự động hóa email nurturing, lead scoring, và meeting scheduling, tiết kiệm ~20h/tuần.",
    impact: "medium", type: "opportunity", metric: "20h/tuần", action: "Mở rộng AI Agent sang chăm sóc khách hàng sau bán hàng",
  },
  {
    id: "ai6", category: "revenue", title: "Deal size trung bình tăng 15%",
    description: "Kích thước deal trung bình tăng từ $68K lên $78K nhờ upselling module AI.",
    impact: "low", type: "opportunity", metric: "+15%", action: "Đào tạo team sales về giá trị upsell AI modules",
  },
];

/* ============================================================
 * Stat Card Component
 * ============================================================ */
function StatCard({ icon, label, value, trend, trendValue, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`p-2 rounded-lg ${color}`}>{icon}</span>
        <span className={`text-xs flex items-center gap-0.5 ${
          trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-gray-400"
        }`}>
          {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> :
           trend === "down" ? <ArrowDownRight className="w-3 h-3" /> :
           <Minus className="w-3 h-3" />}
          {trendValue}
        </span>
      </div>
      <p className="text-lg text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

/* ============================================================
 * Insight Card Component
 * ============================================================ */
function InsightCard({ insight }: { insight: ActionableInsight }) {
  const typeConfig = {
    opportunity: { icon: <Lightbulb className="w-4 h-4" />, color: "text-green-600", bg: "bg-green-50 border-green-200" },
    warning: { icon: <AlertTriangle className="w-4 h-4" />, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    info: { icon: <Eye className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  };
  const impactConfig = {
    high: { label: "Ảnh hưởng lớn", color: "text-red-600 bg-red-50" },
    medium: { label: "Ảnh hưởng vừa", color: "text-amber-600 bg-amber-50" },
    low: { label: "Ảnh hưởng nhỏ", color: "text-gray-500 bg-gray-50" },
  };
  const cfg = typeConfig[insight.type];
  const impCfg = impactConfig[insight.impact];

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg}`}>
      <div className="flex items-start gap-2 mb-2">
        <span className={`mt-0.5 ${cfg.color}`}>{cfg.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-sm text-gray-900">{insight.title}</h4>
            {insight.metric && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-white/70 text-gray-700 border border-white">
                {insight.metric}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${impCfg.color}`}>
              {impCfg.label}
            </span>
            <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> {insight.action}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState<InsightCategory>("all");

  const tabs: { key: InsightCategory; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "Tổng quan", icon: <Brain className="w-4 h-4" /> },
    { key: "revenue", label: "Doanh thu", icon: <DollarSign className="w-4 h-4" /> },
    { key: "deals", label: "Deals", icon: <Target className="w-4 h-4" /> },
    { key: "leads", label: "Leads", icon: <Users className="w-4 h-4" /> },
    { key: "churn", label: "Churn", icon: <ShieldAlert className="w-4 h-4" /> },
    { key: "agents", label: "AI Agents", icon: <Bot className="w-4 h-4" /> },
  ];

  const filteredInsights = useMemo(() => {
    if (activeTab === "all") return ACTIONABLE_INSIGHTS;
    return ACTIONABLE_INSIGHTS.filter((i) => i.category === activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Brain className="w-6 h-6 text-violet-600" /> AI Insights & Dự đoán
        </h1>
        <p className="text-gray-500 mt-0.5">
          Phân tích thông minh, dự báo doanh thu, phát hiện rủi ro — được tạo hoàn toàn bởi AI
        </p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<DollarSign className="w-4 h-4" />} label="Doanh thu dự báo Q2"
          value="$1.41M" trend="up" trendValue="+25%" color="bg-green-100 text-green-700" />
        <StatCard icon={<Target className="w-4 h-4" />} label="Win rate tháng này"
          value="68%" trend="up" trendValue="+5%" color="bg-blue-100 text-blue-700" />
        <StatCard icon={<ShieldAlert className="w-4 h-4" />} label="Khách rủi ro churn"
          value="5" trend="down" trendValue="$450K" color="bg-red-100 text-red-700" />
        <StatCard icon={<Bot className="w-4 h-4" />} label="AI tự động/tuần"
          value="340" trend="up" trendValue="+12%" color="bg-violet-100 text-violet-700" />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "bg-violet-600 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content — changes per tab */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Revenue Forecast Chart */}
        {(activeTab === "all" || activeTab === "revenue") && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 lg:col-span-2">
            <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-green-500" /> Dự báo doanh thu 8 tháng
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={REVENUE_FORECAST}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, ""]}
                  labelStyle={{ fontSize: 12 }}
                />
                <Area type="monotone" dataKey="actual" stroke="#6366f1" fill="#ede9fe"
                  strokeWidth={2} name="Thực tế" dot={{ r: 3 }} />
                <Area type="monotone" dataKey="forecast" stroke="#22c55e" fill="#dcfce7"
                  strokeWidth={2} strokeDasharray="6 3" name="Dự báo AI" dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              <Bot className="w-3 h-3" /> Dự báo dựa trên pipeline, tỷ lệ chuyển đổi lịch sử, và seasonality — độ tin cậy 85%
            </p>
          </div>
        )}

        {/* Win/Loss Funnel */}
        {(activeTab === "all" || activeTab === "deals") && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-500" /> Phân tích Win/Loss theo giai đoạn
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={WIN_LOSS_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 10 }} width={80} />
                <Tooltip />
                <Bar dataKey="won" fill="#22c55e" name="Thắng" radius={[0, 4, 4, 0]} />
                <Bar dataKey="lost" fill="#ef4444" name="Thua" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Loss Reasons Pie */}
        {(activeTab === "all" || activeTab === "deals") && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-500" /> Nguyên nhân thua deal
            </h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <RePieChart>
                  <Pie data={LOSS_REASONS} dataKey="count" nameKey="reason"
                    cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                    {LOSS_REASONS.map((_, i) => (
                      <Cell key={i} fill={LOSS_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v} deals`, ""]} />
                </RePieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {LOSS_REASONS.map((item, i) => (
                  <div key={item.reason} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: LOSS_COLORS[i] }} />
                    <span className="flex-1 text-gray-600 truncate">{item.reason}</span>
                    <span className="text-gray-900">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lead Score Distribution */}
        {(activeTab === "all" || activeTab === "leads") && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-violet-500" /> Phân bố điểm Lead
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={LEAD_SCORE_DIST}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v} leads`, ""]}
                  labelFormatter={(l) => `Score: ${l}`} />
                <Bar dataKey="count" name="Leads" radius={[4, 4, 0, 0]}>
                  {LEAD_SCORE_DIST.map((_, i) => (
                    <Cell key={i} fill={LEAD_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-gray-400">
              {LEAD_SCORE_DIST.map((item, i) => (
                <span key={item.range} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LEAD_COLORS[i] }} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sentiment Trend */}
        {(activeTab === "all" || activeTab === "leads") && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-pink-500" /> Xu hướng Sentiment
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={SENTIMENT_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="positive" stackId="1" stroke="#22c55e"
                  fill="#dcfce7" name="Tích cực" />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="#94a3b8"
                  fill="#f1f5f9" name="Trung lập" />
                <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444"
                  fill="#fee2e2" name="Tiêu cực" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Churn Risk Table */}
        {(activeTab === "all" || activeTab === "churn") && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 lg:col-span-2">
            <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" /> Cảnh báo rủi ro Churn
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left py-2 pr-4">Khách hàng</th>
                    <th className="text-left py-2 pr-4">Rủi ro</th>
                    <th className="text-left py-2 pr-4 hidden sm:table-cell">Giá trị</th>
                    <th className="text-left py-2 pr-4 hidden md:table-cell">Nguyên nhân</th>
                    <th className="text-left py-2 hidden lg:table-cell">Liên hệ cuối</th>
                  </tr>
                </thead>
                <tbody>
                  {CHURN_RISK.map((item) => (
                    <tr key={item.name} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 pr-4 text-gray-900">{item.name}</td>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${
                              item.risk >= 70 ? "bg-red-500" : item.risk >= 50 ? "bg-amber-500" : "bg-yellow-400"
                            }`} style={{ width: `${item.risk}%` }} />
                          </div>
                          <span className={`text-xs ${
                            item.risk >= 70 ? "text-red-600" : item.risk >= 50 ? "text-amber-600" : "text-yellow-600"
                          }`}>{item.risk}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-gray-600 hidden sm:table-cell">
                        ${item.value.toLocaleString()}
                      </td>
                      <td className="py-2.5 pr-4 text-gray-500 text-xs hidden md:table-cell">
                        {item.reason}
                      </td>
                      <td className="py-2.5 text-gray-400 text-xs hidden lg:table-cell">
                        {new Date(item.lastContact).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
              <Bot className="w-3 h-3" /> Rủi ro được tính dựa trên: tần suất tương tác, satisfaction score, usage metrics, và payment behavior
            </p>
          </div>
        )}

        {/* AI Agent Performance Radar */}
        {(activeTab === "all" || activeTab === "agents") && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-violet-500" /> Hiệu suất AI Agent vs Con người
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={AI_AGENT_PERF} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#6b7280" }} />
                <Radar name="AI Agent" dataKey="agent" stroke="#8b5cf6" fill="#ede9fe" fillOpacity={0.5} />
                <Radar name="Con người" dataKey="human" stroke="#22c55e" fill="#dcfce7" fillOpacity={0.5} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI Agent Stats */}
        {(activeTab === "all" || activeTab === "agents") && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Thống kê AI Agents
            </h3>
            <div className="space-y-3">
              {[
                { agent: "AI Sales Agent", tasks: 156, accuracy: 88, status: "active" as const },
                { agent: "AI Analytics Agent", tasks: 89, accuracy: 94, status: "active" as const },
                { agent: "AI Content Agent", tasks: 67, accuracy: 82, status: "active" as const },
                { agent: "AI Support Agent", tasks: 28, accuracy: 90, status: "training" as const },
              ].map((a) => (
                <div key={a.agent} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <Bot className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{a.agent}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                      <span>{a.tasks} tác vụ/tuần</span>
                      <span>Độ chính xác: {a.accuracy}%</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    a.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {a.status === "active" ? "Hoạt động" : "Đang huấn luyện"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actionable Insights */}
      <div>
        <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Đề xuất hành động từ AI
          <span className="text-[10px] text-gray-400">({filteredInsights.length})</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {filteredInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Footer AI note */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 text-sm text-violet-800">
          <RefreshCw className="w-4 h-4 text-violet-500 flex-shrink-0" />
          <p>
            Insights được cập nhật mỗi 6 giờ · Mô hình AI sử dụng dữ liệu 12 tháng gần nhất ·
            Độ tin cậy trung bình: <span className="text-violet-900">87%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
