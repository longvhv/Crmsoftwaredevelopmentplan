/**
 * Trang Marketing Campaign Tracker — Theo dõi chiến dịch marketing & ROI.
 * Campaign overview, channel performance, lead attribution,
 * funnel conversion, budget vs spend, AI optimization suggestions.
 * Phase 1: Mock data + interactive filters.
 */
import { useState, useMemo } from "react";
import {
  Megaphone,
  DollarSign,
  Users,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Eye,
  X,
  Search,
  Bot,
  Sparkles,
  Target,
  Mail,
  Globe,
  MessageCircle,
  Play,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  ExternalLink,
  Filter,
  Hash,
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
  AreaChart,
  Area,
  Funnel,
  FunnelChart,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type CampaignStatus = "active" | "completed" | "scheduled" | "paused";
type CampaignChannel = "email" | "linkedin" | "google-ads" | "webinar" | "content" | "referral";

interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  startDate: string;
  endDate: string | null;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  leads: number;
  mqls: number;
  sqls: number;
  deals: number;
  revenue: number;
  roi: number;
  cpl: number;
  conversionRate: number;
  aiNote: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: "Đang chạy", color: "text-green-600 bg-green-50", icon: <Play className="w-3 h-3" /> },
  completed: { label: "Hoàn thành", color: "text-blue-600 bg-blue-50", icon: <CheckCircle2 className="w-3 h-3" /> },
  scheduled: { label: "Lên lịch", color: "text-amber-600 bg-amber-50", icon: <Clock className="w-3 h-3" /> },
  paused: { label: "Tạm dừng", color: "text-gray-500 bg-gray-100", icon: <AlertTriangle className="w-3 h-3" /> },
};

const CHANNEL_CONFIG: Record<CampaignChannel, { label: string; icon: string; color: string }> = {
  email: { label: "Email", icon: "📧", color: "bg-blue-50 text-blue-700" },
  linkedin: { label: "LinkedIn", icon: "💼", color: "bg-sky-50 text-sky-700" },
  "google-ads": { label: "Google Ads", icon: "🔍", color: "bg-red-50 text-red-700" },
  webinar: { label: "Webinar", icon: "🎥", color: "bg-violet-50 text-violet-700" },
  content: { label: "Content", icon: "📝", color: "bg-green-50 text-green-700" },
  referral: { label: "Referral", icon: "🤝", color: "bg-amber-50 text-amber-700" },
};

/* ============================================================
 * Mock Data — 10 chiến dịch
 * ============================================================ */
const CAMPAIGNS: Campaign[] = [
  {
    id: "cm1", name: "AI Platform Webinar Series", channel: "webinar", status: "active",
    startDate: "2026-01-15", endDate: null,
    budget: 15000, spent: 12400, impressions: 8500, clicks: 2100,
    leads: 340, mqls: 120, sqls: 45, deals: 12, revenue: 360000,
    roi: 2804, cpl: 36, conversionRate: 3.5,
    aiNote: "ROI cao nhất. Tăng tần suất webinar từ 1/tháng lên 2/tháng.",
  },
  {
    id: "cm2", name: "LinkedIn Enterprise Outreach", channel: "linkedin", status: "active",
    startDate: "2026-02-01", endDate: null,
    budget: 8000, spent: 6200, impressions: 45000, clicks: 1800,
    leads: 185, mqls: 65, sqls: 28, deals: 6, revenue: 180000,
    roi: 2803, cpl: 34, conversionRate: 1.5,
    aiNote: "Targeting 'VP Engineering' có CTR 4.2%, cao hơn 'CTO' targeting (2.8%).",
  },
  {
    id: "cm3", name: "Google Ads - Outsource Vietnam", channel: "google-ads", status: "active",
    startDate: "2025-11-01", endDate: null,
    budget: 20000, spent: 18500, impressions: 125000, clicks: 5200,
    leads: 420, mqls: 95, sqls: 32, deals: 8, revenue: 240000,
    roi: 1197, cpl: 44, conversionRate: 2.6,
    aiNote: "Keyword 'AI outsourcing Vietnam' có CPC thấp nhất ($2.1) và conversion cao nhất.",
  },
  {
    id: "cm4", name: "Case Study Email Nurture", channel: "email", status: "active",
    startDate: "2026-01-20", endDate: null,
    budget: 3000, spent: 1800, impressions: 12000, clicks: 2400,
    leads: 85, mqls: 42, sqls: 18, deals: 5, revenue: 150000,
    roi: 8233, cpl: 21, conversionRate: 20.0,
    aiNote: "ROI cực cao nhờ chi phí thấp. Case study TechCorp có open rate 45% — top performer.",
  },
  {
    id: "cm5", name: "Blog SEO - AI Development", channel: "content", status: "active",
    startDate: "2025-09-01", endDate: null,
    budget: 5000, spent: 4200, impressions: 85000, clicks: 6800,
    leads: 210, mqls: 55, sqls: 15, deals: 3, revenue: 90000,
    roi: 2043, cpl: 20, conversionRate: 2.5,
    aiNote: "Long-tail keyword strategy hoạt động tốt. Bài 'AI in CRM 2026' rank #3 Google.",
  },
  {
    id: "cm6", name: "Referral Partner Program", channel: "referral", status: "active",
    startDate: "2025-10-01", endDate: null,
    budget: 10000, spent: 7500, impressions: 0, clicks: 0,
    leads: 45, mqls: 30, sqls: 22, deals: 10, revenue: 420000,
    roi: 5500, cpl: 167, conversionRate: 48.9,
    aiNote: "Conversion rate cao nhất (48.9%). Chi phí/lead cao nhưng lead quality vượt trội.",
  },
  {
    id: "cm7", name: "Email Blast - Year-End Promo", channel: "email", status: "completed",
    startDate: "2025-12-01", endDate: "2025-12-31",
    budget: 2000, spent: 1900, impressions: 18000, clicks: 3200,
    leads: 120, mqls: 38, sqls: 12, deals: 4, revenue: 85000,
    roi: 4374, cpl: 16, conversionRate: 17.8,
    aiNote: "Subject line 'Ưu đãi AI Partnership 2026' có open rate 52% — tái sử dụng cho Q1.",
  },
  {
    id: "cm8", name: "Webinar: CRM cho SME", channel: "webinar", status: "completed",
    startDate: "2025-11-15", endDate: "2025-11-15",
    budget: 5000, spent: 4800, impressions: 3200, clicks: 980,
    leads: 150, mqls: 48, sqls: 15, deals: 3, revenue: 65000,
    roi: 1254, cpl: 32, conversionRate: 4.7,
    aiNote: "Attendance rate 62% — trên benchmark 45%. Follow-up email sequence cần cải thiện.",
  },
  {
    id: "cm9", name: "LinkedIn Ads - Japan Market", channel: "linkedin", status: "scheduled",
    startDate: "2026-03-15", endDate: null,
    budget: 12000, spent: 0, impressions: 0, clicks: 0,
    leads: 0, mqls: 0, sqls: 0, deals: 0, revenue: 0,
    roi: 0, cpl: 0, conversionRate: 0,
    aiNote: "Dự kiến target 'IT Manager' + 'CTO' tại Tokyo/Osaka. Ước tính 200 leads với CPL $45.",
  },
  {
    id: "cm10", name: "Google Ads - Fintech Solutions", channel: "google-ads", status: "paused",
    startDate: "2026-01-10", endDate: null,
    budget: 8000, spent: 5500, impressions: 62000, clicks: 2800,
    leads: 180, mqls: 25, sqls: 8, deals: 1, revenue: 45000,
    roi: 718, cpl: 31, conversionRate: 1.3,
    aiNote: "ROI thấp, tạm dừng để optimize landing page. A/B test mới cần 2 tuần.",
  },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const CHANNEL_PERFORMANCE = (() => {
  const channels: Record<string, { leads: number; revenue: number; spent: number }> = {};
  CAMPAIGNS.forEach((c) => {
    if (!channels[c.channel]) channels[c.channel] = { leads: 0, revenue: 0, spent: 0 };
    channels[c.channel].leads += c.leads;
    channels[c.channel].revenue += c.revenue;
    channels[c.channel].spent += c.spent;
  });
  return Object.entries(channels).map(([ch, data]) => ({
    channel: CHANNEL_CONFIG[ch as CampaignChannel]?.label ?? ch,
    leads: data.leads,
    roi: data.spent > 0 ? Math.round(((data.revenue - data.spent) / data.spent) * 100) : 0,
  })).sort((a, b) => b.roi - a.roi);
})();

const CHANNEL_COLORS = ["#6366f1", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

const FUNNEL_DATA = [
  { name: "Impressions", value: CAMPAIGNS.reduce((s, c) => s + c.impressions, 0) },
  { name: "Clicks", value: CAMPAIGNS.reduce((s, c) => s + c.clicks, 0) },
  { name: "Leads", value: CAMPAIGNS.reduce((s, c) => s + c.leads, 0) },
  { name: "MQLs", value: CAMPAIGNS.reduce((s, c) => s + c.mqls, 0) },
  { name: "SQLs", value: CAMPAIGNS.reduce((s, c) => s + c.sqls, 0) },
  { name: "Deals", value: CAMPAIGNS.reduce((s, c) => s + c.deals, 0) },
];

const MONTHLY_LEADS = [
  { month: "T10", leads: 180, cost: 8200 },
  { month: "T11", leads: 220, cost: 9500 },
  { month: "T12", leads: 280, cost: 11000 },
  { month: "T1", leads: 310, cost: 12500 },
  { month: "T2", leads: 350, cost: 13800 },
  { month: "T3", leads: 295, cost: 11200 },
];

const BUDGET_VS_SPEND = CAMPAIGNS
  .filter((c) => c.status !== "scheduled")
  .sort((a, b) => b.budget - a.budget)
  .slice(0, 6)
  .map((c) => ({
    name: c.name.length > 18 ? c.name.slice(0, 18) + "…" : c.name,
    budget: c.budget / 1000,
    spent: c.spent / 1000,
  }));

/* ============================================================
 * Campaign Card
 * ============================================================ */
function CampaignCard({ campaign, onView }: {
  campaign: Campaign;
  onView: (c: Campaign) => void;
}) {
  const sCfg = STATUS_CONFIG[campaign.status];
  const chCfg = CHANNEL_CONFIG[campaign.channel];
  const roiColor = campaign.roi >= 2000 ? "text-green-600" :
    campaign.roi >= 1000 ? "text-amber-600" : campaign.roi > 0 ? "text-gray-600" : "text-gray-400";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onView(campaign)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${chCfg.color}`}>
            {chCfg.icon}
          </span>
          <div>
            <h4 className="text-sm text-gray-900 line-clamp-1">{campaign.name}</h4>
            <p className="text-[9px] text-gray-400">{chCfg.label}</p>
          </div>
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${sCfg.color}`}>
          {sCfg.icon} {sCfg.label}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-gray-900">{campaign.leads}</p>
          <p className="text-[8px] text-gray-400">Leads</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className="text-xs text-gray-900">{campaign.deals}</p>
          <p className="text-[8px] text-gray-400">Deals</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5 text-center">
          <p className={`text-xs ${roiColor}`}>{campaign.roi > 0 ? `${campaign.roi}%` : "—"}</p>
          <p className="text-[8px] text-gray-400">ROI</p>
        </div>
      </div>

      {/* Budget Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[9px] mb-0.5">
          <span className="text-gray-400">Chi tiêu</span>
          <span className="text-gray-500">${(campaign.spent / 1000).toFixed(1)}K / ${(campaign.budget / 1000).toFixed(0)}K</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${
            campaign.spent / campaign.budget > 0.9 ? "bg-red-500" : campaign.spent / campaign.budget > 0.7 ? "bg-amber-500" : "bg-green-500"
          }`}
            style={{ width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%` }} />
        </div>
      </div>

      {/* Revenue */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Revenue</span>
        <span className="text-green-600">{campaign.revenue > 0 ? `$${(campaign.revenue / 1000).toFixed(0)}K` : "—"}</span>
      </div>
    </div>
  );
}

/* ============================================================
 * Campaign Detail Modal
 * ============================================================ */
function CampaignDetailModal({ campaign, onClose }: {
  campaign: Campaign;
  onClose: () => void;
}) {
  const sCfg = STATUS_CONFIG[campaign.status];
  const chCfg = CHANNEL_CONFIG[campaign.channel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${chCfg.color}`}>
              {chCfg.icon}
            </span>
            <div>
              <h3 className="text-gray-900">{campaign.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                {chCfg.label}
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${sCfg.color}`}>{sCfg.label}</span>
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Dates & Budget */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-900">{new Date(campaign.startDate).toLocaleDateString("vi-VN")}</p>
              <p className="text-[9px] text-gray-400">Bắt đầu</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-900">{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString("vi-VN") : "Đang chạy"}</p>
              <p className="text-[9px] text-gray-400">Kết thúc</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-900">${(campaign.budget / 1000).toFixed(1)}K</p>
              <p className="text-[9px] text-gray-400">Budget</p>
            </div>
          </div>

          {/* Funnel Metrics */}
          <div className="bg-violet-50 rounded-lg border border-violet-100 p-3">
            <h4 className="text-xs text-violet-800 mb-2 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Funnel Metrics
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="text-gray-900">{campaign.impressions.toLocaleString()}</p>
                <p className="text-[8px] text-gray-400">Impressions</p>
              </div>
              <div>
                <p className="text-gray-900">{campaign.clicks.toLocaleString()}</p>
                <p className="text-[8px] text-gray-400">Clicks</p>
              </div>
              <div>
                <p className="text-gray-900">{campaign.leads}</p>
                <p className="text-[8px] text-gray-400">Leads</p>
              </div>
              <div>
                <p className="text-blue-600">{campaign.mqls}</p>
                <p className="text-[8px] text-gray-400">MQLs</p>
              </div>
              <div>
                <p className="text-violet-600">{campaign.sqls}</p>
                <p className="text-[8px] text-gray-400">SQLs</p>
              </div>
              <div>
                <p className="text-green-600">{campaign.deals}</p>
                <p className="text-[8px] text-gray-400">Deals</p>
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg border border-green-100 p-3">
              <p className="text-[9px] text-green-600 mb-0.5">Revenue</p>
              <p className="text-lg text-green-700">{campaign.revenue > 0 ? `$${(campaign.revenue / 1000).toFixed(0)}K` : "—"}</p>
            </div>
            <div className={`rounded-lg border p-3 ${campaign.roi >= 2000 ? "bg-green-50 border-green-100" : campaign.roi >= 1000 ? "bg-amber-50 border-amber-100" : "bg-gray-50 border-gray-200"}`}>
              <p className="text-[9px] text-gray-500 mb-0.5">ROI</p>
              <p className={`text-lg ${campaign.roi >= 2000 ? "text-green-600" : campaign.roi >= 1000 ? "text-amber-600" : "text-gray-600"}`}>
                {campaign.roi > 0 ? `${campaign.roi}%` : "—"}
              </p>
            </div>
          </div>

          {/* KPIs Row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-sm text-gray-900">{campaign.cpl > 0 ? `$${campaign.cpl}` : "—"}</p>
              <p className="text-[8px] text-gray-400">CPL</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-sm text-gray-900">{campaign.conversionRate > 0 ? `${campaign.conversionRate}%` : "—"}</p>
              <p className="text-[8px] text-gray-400">Conv. Rate</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-sm text-gray-900">{campaign.clicks > 0 ? `${((campaign.clicks / campaign.impressions) * 100).toFixed(1)}%` : "—"}</p>
              <p className="text-[8px] text-gray-400">CTR</p>
            </div>
          </div>

          {/* Budget Progress */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Chi tiêu</span>
              <span className="text-gray-700">${(campaign.spent / 1000).toFixed(1)}K / ${(campaign.budget / 1000).toFixed(0)}K ({Math.round((campaign.spent / campaign.budget) * 100)}%)</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${
                campaign.spent / campaign.budget > 0.9 ? "bg-red-500" : "bg-green-500"
              }`}
                style={{ width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%` }} />
            </div>
          </div>

          {/* AI Note */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span><span className="text-violet-900">AI Optimization:</span> {campaign.aiNote}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
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
export function MarketingCampaignPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | "">("");
  const [filterChannel, setFilterChannel] = useState<CampaignChannel | "">("");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const activeCampaigns = CAMPAIGNS.filter((c) => c.status === "active" || c.status === "completed");
    const totalSpent = activeCampaigns.reduce((s, c) => s + c.spent, 0);
    const totalRevenue = activeCampaigns.reduce((s, c) => s + c.revenue, 0);
    const totalLeads = activeCampaigns.reduce((s, c) => s + c.leads, 0);
    const totalDeals = activeCampaigns.reduce((s, c) => s + c.deals, 0);
    const overallROI = totalSpent > 0 ? Math.round(((totalRevenue - totalSpent) / totalSpent) * 100) : 0;
    const avgCPL = totalLeads > 0 ? Math.round(totalSpent / totalLeads) : 0;
    return { totalSpent, totalRevenue, totalLeads, totalDeals, overallROI, avgCPL };
  }, []);

  const filteredCampaigns = useMemo(() => {
    let result = [...CAMPAIGNS];
    if (filterStatus) result = result.filter((c) => c.status === filterStatus);
    if (filterChannel) result = result.filter((c) => c.channel === filterChannel);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    return result;
  }, [filterStatus, filterChannel, search]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-violet-600" /> Chiến dịch Marketing
        </h1>
        <p className="text-gray-500 mt-0.5">
          Campaign tracking, ROI analysis, lead attribution, funnel conversion, AI optimization
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-3">
          <Megaphone className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{CAMPAIGNS.length}</p>
          <p className="text-xs text-violet-700">Chiến dịch</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">{stats.totalLeads.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Tổng Leads</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-green-600">{stats.totalDeals}</p>
          <p className="text-xs text-gray-500">Deals won</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">${(stats.totalSpent / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500">Tổng chi tiêu</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <p className="text-lg text-green-600">${(stats.totalRevenue / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-green-700">Revenue</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.overallROI >= 2000 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-lg ${stats.overallROI >= 2000 ? "text-green-600" : "text-amber-600"}`}>{stats.overallROI}%</p>
          <p className="text-xs text-gray-600">ROI tổng</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Channel ROI */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-violet-500" /> ROI theo Kênh (%)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHANNEL_PERFORMANCE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="channel" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, "ROI"]} />
              <Bar dataKey="roi" radius={[4, 4, 0, 0]}>
                {CHANNEL_PERFORMANCE.map((_, i) => <Cell key={i} fill={CHANNEL_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Trend */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-green-500" /> Lead Generation Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_LEADS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
              <Line type="monotone" dataKey="cost" name="Chi phí ($)" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funnel + Budget */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-500" /> Marketing Funnel
          </h3>
          <div className="space-y-1.5">
            {FUNNEL_DATA.map((step, i) => {
              const maxVal = FUNNEL_DATA[0].value;
              const width = maxVal > 0 ? Math.max(15, (step.value / maxVal) * 100) : 15;
              const colors = ["#6366f1", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
              const prevVal = i > 0 ? FUNNEL_DATA[i - 1].value : null;
              const convRate = prevVal && prevVal > 0 ? ((step.value / prevVal) * 100).toFixed(1) : null;
              return (
                <div key={step.name} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-gray-500 text-right flex-shrink-0">{step.name}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="h-6 rounded-r-lg flex items-center px-2 text-[10px] text-white"
                      style={{ width: `${width}%`, backgroundColor: colors[i], minWidth: "60px" }}>
                      {step.value.toLocaleString()}
                    </div>
                    {convRate && (
                      <span className="text-[9px] text-gray-400">{convRate}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget vs Spend */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-green-500" /> Budget vs Chi tiêu ($K)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BUDGET_VS_SPEND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-15} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(1)}K`]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="budget" name="Budget" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" name="Spent" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {(["", "active", "completed", "scheduled", "paused"] as (CampaignStatus | "")[]).map((s) => (
              <button key={s} type="button" onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  filterStatus === s ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {s === "" ? "Tất cả" : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value as CampaignChannel | "")}
            className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả kênh</option>
            {Object.entries(CHANNEL_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
            ))}
          </select>
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm chiến dịch..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCampaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} onView={setSelectedCampaign} />
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy chiến dịch phù hợp</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Marketing Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Referral Program ROI 5500% — cao nhất. Tăng referral bonus 10% sẽ thêm ~15 leads/tháng.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            Google Ads Fintech đang paused. Thay đổi landing page với case study FinServe có thể tăng conversion 40%.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            Email nurture CPL $21 — thấp nhất. Mở rộng sequence từ 5 email lên 8 email với AI personalization.
          </p>
        </div>
      </div>

      {selectedCampaign && (
        <CampaignDetailModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />
      )}
    </div>
  );
}
