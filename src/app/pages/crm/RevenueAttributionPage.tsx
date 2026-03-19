/**
 * Trang Revenue Attribution — Phân bổ doanh thu theo nguồn, kênh, nhân viên.
 * Multi-touch attribution, channel ROI, sales rep performance,
 * source breakdown, campaign influence, AI attribution modeling.
 * Phase 1: Mock data + interactive charts + detail drill-down.
 */
import { useState, useMemo } from "react";
import {
  GitBranch,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  X,
  Bot,
  Sparkles,
  Users,
  Target,
  Globe,
  Mail,
  Phone,
  Megaphone,
  Handshake,
  UserPlus,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
  Award,
  Zap,
  Share2,
  MousePointer,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  Treemap,
  AreaChart,
  Area,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type AttributionModel = "first-touch" | "last-touch" | "linear" | "time-decay" | "ai-weighted";
type Channel = "organic-search" | "paid-ads" | "email" | "referral" | "social" | "direct" | "events" | "partner";

interface ChannelAttribution {
  channel: Channel;
  label: string;
  icon: React.ReactNode;
  color: string;
  revenue: number;
  deals: number;
  leads: number;
  conversionRate: number;
  avgDealSize: number;
  roi: number;
  trend: "up" | "down" | "stable";
  costPerLead: number;
  touchPoints: number;
}

interface SalesRepAttribution {
  id: string;
  name: string;
  avatar: string;
  revenue: number;
  deals: number;
  avgDealSize: number;
  winRate: number;
  topChannel: string;
  trend: "up" | "down" | "stable";
}

interface CampaignInfluence {
  id: string;
  name: string;
  channel: Channel;
  influenced: number;
  revenue: number;
  roi: number;
  status: "active" | "completed";
}

/* ============================================================
 * Constants
 * ============================================================ */
const CHANNEL_COLORS: Record<Channel, string> = {
  "organic-search": "#22c55e",
  "paid-ads": "#3b82f6",
  email: "#f59e0b",
  referral: "#8b5cf6",
  social: "#ec4899",
  direct: "#6366f1",
  events: "#14b8a6",
  partner: "#f97316",
};

const MODEL_LABELS: Record<AttributionModel, { label: string; desc: string }> = {
  "first-touch": { label: "First Touch", desc: "100% credit cho touchpoint đầu tiên" },
  "last-touch": { label: "Last Touch", desc: "100% credit cho touchpoint cuối cùng" },
  linear: { label: "Linear", desc: "Chia đều credit cho tất cả touchpoints" },
  "time-decay": { label: "Time Decay", desc: "Touchpoints gần conversion nhận nhiều credit hơn" },
  "ai-weighted": { label: "AI Weighted", desc: "AI phân bổ credit dựa trên pattern analysis" },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const CHANNELS: ChannelAttribution[] = [
  {
    channel: "organic-search", label: "Tìm kiếm tự nhiên",
    icon: <Globe className="w-4 h-4" />, color: "bg-green-50 text-green-700",
    revenue: 285000, deals: 24, leads: 420, conversionRate: 5.7,
    avgDealSize: 11875, roi: 850, trend: "up", costPerLead: 8, touchPoints: 1680,
  },
  {
    channel: "paid-ads", label: "Quảng cáo trả phí",
    icon: <MousePointer className="w-4 h-4" />, color: "bg-blue-50 text-blue-700",
    revenue: 210000, deals: 18, leads: 580, conversionRate: 3.1,
    avgDealSize: 11667, roi: 320, trend: "stable", costPerLead: 45, touchPoints: 2320,
  },
  {
    channel: "email", label: "Email Marketing",
    icon: <Mail className="w-4 h-4" />, color: "bg-amber-50 text-amber-700",
    revenue: 175000, deals: 15, leads: 310, conversionRate: 4.8,
    avgDealSize: 11667, roi: 4200, trend: "up", costPerLead: 3, touchPoints: 1240,
  },
  {
    channel: "referral", label: "Giới thiệu",
    icon: <Share2 className="w-4 h-4" />, color: "bg-violet-50 text-violet-700",
    revenue: 165000, deals: 12, leads: 85, conversionRate: 14.1,
    avgDealSize: 13750, roi: 0, trend: "up", costPerLead: 0, touchPoints: 255,
  },
  {
    channel: "social", label: "Mạng xã hội",
    icon: <Megaphone className="w-4 h-4" />, color: "bg-pink-50 text-pink-700",
    revenue: 95000, deals: 10, leads: 650, conversionRate: 1.5,
    avgDealSize: 9500, roi: 180, trend: "down", costPerLead: 12, touchPoints: 3250,
  },
  {
    channel: "direct", label: "Trực tiếp",
    icon: <UserPlus className="w-4 h-4" />, color: "bg-indigo-50 text-indigo-700",
    revenue: 120000, deals: 8, leads: 45, conversionRate: 17.8,
    avgDealSize: 15000, roi: 0, trend: "stable", costPerLead: 0, touchPoints: 135,
  },
  {
    channel: "events", label: "Sự kiện & Hội thảo",
    icon: <Handshake className="w-4 h-4" />, color: "bg-teal-50 text-teal-700",
    revenue: 145000, deals: 9, leads: 120, conversionRate: 7.5,
    avgDealSize: 16111, roi: 280, trend: "up", costPerLead: 85, touchPoints: 360,
  },
  {
    channel: "partner", label: "Đối tác",
    icon: <Users className="w-4 h-4" />, color: "bg-orange-50 text-orange-700",
    revenue: 105000, deals: 7, leads: 55, conversionRate: 12.7,
    avgDealSize: 15000, roi: 350, trend: "up", costPerLead: 25, touchPoints: 165,
  },
];

const SALES_REPS: SalesRepAttribution[] = [
  { id: "sr1", name: "Nguyễn Văn An", avatar: "NVA", revenue: 320000, deals: 18, avgDealSize: 17778, winRate: 42, topChannel: "Referral", trend: "up" },
  { id: "sr2", name: "Hoàng Thị Mai", avatar: "HTM", revenue: 285000, deals: 22, avgDealSize: 12955, winRate: 38, topChannel: "Email", trend: "up" },
  { id: "sr3", name: "Phạm Thanh Tùng", avatar: "PTT", revenue: 210000, deals: 15, avgDealSize: 14000, winRate: 35, topChannel: "Events", trend: "stable" },
  { id: "sr4", name: "Lê Minh Cường", avatar: "LMC", revenue: 195000, deals: 14, avgDealSize: 13929, winRate: 33, topChannel: "Paid Ads", trend: "stable" },
  { id: "sr5", name: "Đỗ Hải Yến", avatar: "ĐHY", revenue: 175000, deals: 16, avgDealSize: 10938, winRate: 40, topChannel: "Organic", trend: "down" },
  { id: "sr6", name: "Trần Đức Hùng", avatar: "TĐH", revenue: 115000, deals: 8, avgDealSize: 14375, winRate: 28, topChannel: "Partner", trend: "down" },
];

const CAMPAIGN_INFLUENCE: CampaignInfluence[] = [
  { id: "ci1", name: "Vietnam Tech Summit 2026", channel: "events", influenced: 28, revenue: 125000, roi: 420, status: "completed" },
  { id: "ci2", name: "Google Ads — CRM Keywords", channel: "paid-ads", influenced: 45, revenue: 95000, roi: 280, status: "active" },
  { id: "ci3", name: "Nurture Email Series Q1", channel: "email", influenced: 62, revenue: 88000, roi: 5200, status: "active" },
  { id: "ci4", name: "LinkedIn Thought Leadership", channel: "social", influenced: 35, revenue: 52000, roi: 180, status: "active" },
  { id: "ci5", name: "Partner Webinar — CloudStack", channel: "partner", influenced: 18, revenue: 72000, roi: 350, status: "completed" },
  { id: "ci6", name: "SEO Content Hub", channel: "organic-search", influenced: 120, revenue: 185000, roi: 1200, status: "active" },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const REVENUE_BY_CHANNEL = CHANNELS
  .map((c) => ({ name: c.label.length > 12 ? c.label.slice(0, 12) + "…" : c.label, revenue: c.revenue / 1000, color: CHANNEL_COLORS[c.channel] }))
  .sort((a, b) => b.revenue - a.revenue);

const MONTHLY_TREND = [
  { month: "T10", organic: 40, paid: 32, email: 25, referral: 22, other: 30 },
  { month: "T11", organic: 42, paid: 35, email: 28, referral: 24, other: 28 },
  { month: "T12", organic: 38, paid: 30, email: 30, referral: 26, other: 32 },
  { month: "T1", organic: 45, paid: 34, email: 32, referral: 28, other: 35 },
  { month: "T2", organic: 48, paid: 36, email: 30, referral: 30, other: 38 },
  { month: "T3", organic: 52, paid: 38, email: 35, referral: 32, other: 42 },
];

const CONVERSION_FUNNEL = [
  { stage: "Impressions", value: 125000 },
  { stage: "Clicks", value: 18500 },
  { stage: "Leads", value: 2265 },
  { stage: "MQL", value: 680 },
  { stage: "SQL", value: 245 },
  { stage: "Won", value: 103 },
];

/* ============================================================
 * Trang chính
 * ============================================================ */
export function RevenueAttributionPage() {
  const [model, setModel] = useState<AttributionModel>("ai-weighted");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"channels" | "reps" | "campaigns">("channels");

  const stats = useMemo(() => {
    const totalRevenue = CHANNELS.reduce((s, c) => s + c.revenue, 0);
    const totalDeals = CHANNELS.reduce((s, c) => s + c.deals, 0);
    const totalLeads = CHANNELS.reduce((s, c) => s + c.leads, 0);
    const avgConversion = totalDeals > 0 ? ((totalDeals / totalLeads) * 100).toFixed(1) : "0";
    return { totalRevenue, totalDeals, totalLeads, avgConversion };
  }, []);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-violet-600" /> Phân bổ Doanh thu
        </h1>
        <p className="text-gray-500 mt-0.5">
          Multi-touch attribution, channel ROI, sales rep performance, AI modeling
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-3">
          <DollarSign className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">${(stats.totalRevenue / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-violet-700">Tổng doanh thu attributed</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">{stats.totalDeals}</p>
          <p className="text-xs text-gray-500">Deals won</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">{stats.totalLeads.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total leads</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <p className="text-lg text-green-600">{stats.avgConversion}%</p>
          <p className="text-xs text-green-700">Conversion rate</p>
        </div>
      </div>

      {/* Attribution Model Selector */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-violet-500" /> Attribution Model
        </p>
        <div className="flex items-center gap-1 overflow-x-auto">
          {(Object.entries(MODEL_LABELS) as [AttributionModel, typeof MODEL_LABELS[AttributionModel]][]).map(([key, cfg]) => (
            <button key={key} type="button" onClick={() => { setModel(key); toast.success(`Đã chuyển sang mô hình ${cfg.label}`); }}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
                model === key ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}>
              {key === "ai-weighted" && <Bot className="w-3 h-3 inline mr-0.5" />}
              {cfg.label}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-gray-400 mt-1">{MODEL_LABELS[model].desc}</p>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Doanh thu theo Kênh ($K)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_BY_CHANNEL} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} />
              <Tooltip formatter={(v: number) => [`$${v}K`, "Doanh thu"]} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {REVENUE_BY_CHANNEL.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Trend theo Tháng ($K)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Area type="monotone" dataKey="organic" name="Organic" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
              <Area type="monotone" dataKey="paid" name="Paid" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="email" name="Email" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              <Area type="monotone" dataKey="referral" name="Referral" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="other" name="Khác" stackId="1" stroke="#6b7280" fill="#6b7280" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-violet-500" /> Conversion Funnel tổng hợp
        </h3>
        <div className="flex items-end gap-1 justify-center overflow-x-auto py-2">
          {CONVERSION_FUNNEL.map((stage, i) => {
            const maxVal = CONVERSION_FUNNEL[0].value;
            const height = Math.max(20, (stage.value / maxVal) * 120);
            const convRate = i > 0 ? ((stage.value / CONVERSION_FUNNEL[i - 1].value) * 100).toFixed(1) : "100";
            const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#22c55e"];
            return (
              <div key={stage.stage} className="flex flex-col items-center gap-1 flex-1 min-w-[60px]">
                {i > 0 && <p className="text-[8px] text-gray-400">{convRate}%</p>}
                <div className="rounded-t-lg w-full max-w-[60px] transition-all" style={{ height, backgroundColor: colors[i] }} />
                <p className="text-[8px] text-gray-500 text-center">{stage.stage}</p>
                <p className="text-[10px] text-gray-800">{stage.value >= 1000 ? `${(stage.value / 1000).toFixed(1)}K` : stage.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        <button type="button" onClick={() => setActiveTab("channels")}
          className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
            activeTab === "channels" ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500"
          }`}>
          Kênh ({CHANNELS.length})
        </button>
        <button type="button" onClick={() => setActiveTab("reps")}
          className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
            activeTab === "reps" ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500"
          }`}>
          Sales Reps ({SALES_REPS.length})
        </button>
        <button type="button" onClick={() => setActiveTab("campaigns")}
          className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
            activeTab === "campaigns" ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500"
          }`}>
          Chiến dịch ({CAMPAIGN_INFLUENCE.length})
        </button>
      </div>

      {/* Channel Cards */}
      {activeTab === "channels" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {CHANNELS.sort((a, b) => b.revenue - a.revenue).map((ch) => (
            <div key={ch.channel} className={`rounded-xl border p-4 ${ch.color} hover:shadow-sm transition-shadow`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {ch.icon}
                  <h4 className="text-sm">{ch.label}</h4>
                </div>
                {ch.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />}
                {ch.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
              </div>
              <p className="text-lg text-gray-900 mb-2">${(ch.revenue / 1000).toFixed(0)}K</p>
              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                <div><span className="text-gray-400">Deals:</span> <span className="text-gray-700">{ch.deals}</span></div>
                <div><span className="text-gray-400">Leads:</span> <span className="text-gray-700">{ch.leads}</span></div>
                <div><span className="text-gray-400">Conv:</span> <span className="text-gray-700">{ch.conversionRate}%</span></div>
                <div><span className="text-gray-400">ROI:</span> <span className={ch.roi >= 500 ? "text-green-600" : "text-gray-700"}>{ch.roi > 0 ? `${ch.roi}%` : "N/A"}</span></div>
                <div><span className="text-gray-400">CPL:</span> <span className="text-gray-700">{ch.costPerLead > 0 ? `$${ch.costPerLead}` : "Free"}</span></div>
                <div><span className="text-gray-400">Avg:</span> <span className="text-gray-700">${(ch.avgDealSize / 1000).toFixed(1)}K</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sales Rep Attribution */}
      {activeTab === "reps" && (
        <div className="space-y-2">
          {SALES_REPS.sort((a, b) => b.revenue - a.revenue).map((rep, i) => (
            <div key={rep.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] text-white ${
                    i === 0 ? "bg-amber-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-700" : "bg-gray-300"
                  }`}>
                    {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px]">
                    {rep.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-900">{rep.name}</p>
                    {rep.trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
                    {rep.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                  </div>
                  <p className="text-[10px] text-gray-400">Top channel: {rep.topChannel}</p>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center flex-shrink-0 hidden sm:grid">
                  <div>
                    <p className="text-sm text-gray-900">${(rep.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-[8px] text-gray-400">Doanh thu</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{rep.deals}</p>
                    <p className="text-[8px] text-gray-400">Deals</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">${(rep.avgDealSize / 1000).toFixed(1)}K</p>
                    <p className="text-[8px] text-gray-400">Avg Deal</p>
                  </div>
                  <div>
                    <p className={`text-sm ${rep.winRate >= 35 ? "text-green-600" : "text-amber-600"}`}>{rep.winRate}%</p>
                    <p className="text-[8px] text-gray-400">Win Rate</p>
                  </div>
                </div>
                {/* Mobile stats */}
                <div className="sm:hidden text-right">
                  <p className="text-sm text-gray-900">${(rep.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-[9px] text-gray-400">{rep.deals} deals · {rep.winRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign Influence */}
      {activeTab === "campaigns" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {CAMPAIGN_INFLUENCE.sort((a, b) => b.revenue - a.revenue).map((camp) => {
            const chColor = CHANNEL_COLORS[camp.channel];
            return (
              <div key={camp.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm text-gray-900 line-clamp-1">{camp.name}</h4>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    camp.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {camp.status === "active" ? "Active" : "Xong"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded p-1.5">
                    <p className="text-sm text-gray-900">{camp.influenced}</p>
                    <p className="text-[8px] text-gray-400">Influenced</p>
                  </div>
                  <div className="bg-gray-50 rounded p-1.5">
                    <p className="text-sm text-gray-900">${(camp.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-[8px] text-gray-400">Revenue</p>
                  </div>
                  <div className="bg-gray-50 rounded p-1.5">
                    <p className={`text-sm ${camp.roi >= 500 ? "text-green-600" : "text-gray-900"}`}>{camp.roi}%</p>
                    <p className="text-[8px] text-gray-400">ROI</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chColor }} />
                  <span className="text-[9px] text-gray-400">{CHANNELS.find((c) => c.channel === camp.channel)?.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Attribution Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Organic Search tạo ROI 850% — cao nhất. Đầu tư thêm content SEO sẽ tăng 20% leads với chi phí thấp nhất.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            Social media conversion chỉ 1.5% — thấp nhất. Chuyển 30% budget social sang email (ROI 4200%) để tối ưu.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            Referral có conversion 14.1% và chi phí $0. Activate referral program chính thức sẽ tăng channel này 3x.
          </p>
        </div>
      </div>
    </div>
  );
}
