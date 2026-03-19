/**
 * Trang Gamification & Leaderboard — Bảng xếp hạng sales.
 * Achievements, badges, streaks, monthly/quarterly ranking,
 * team vs individual, AI coaching tips.
 * Phase 1: Mock data với interactive ranking UI.
 */
import { useState, useMemo } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Flame,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Zap,
  Bot,
  Sparkles,
  Award,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  X,
  Gift,
  Rocket,
  Heart,
  Shield,
  Clock,
  Calendar,
  BarChart3,
  ThumbsUp,
  Phone,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedDate?: string;
}

interface SalesRep {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rank: number;
  prevRank: number;
  revenue: number;
  dealsWon: number;
  dealsTotal: number;
  winRate: number;
  activitiesCount: number;
  avgDealSize: number;
  streak: number;
  xp: number;
  level: number;
  badges: Badge[];
  skills: { name: string; score: number }[];
  aiCoachTip: string;
  monthlyRevenue: number[];
  isAI?: boolean;
}

type Period = "monthly" | "quarterly" | "yearly";
type RankBy = "revenue" | "deals" | "activities" | "xp";

/* ============================================================
 * Constants
 * ============================================================ */
const RARITY_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  common: { label: "Phổ thông", color: "text-gray-600", bgColor: "bg-gray-100" },
  rare: { label: "Hiếm", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  epic: { label: "Sử thi", color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200" },
  legendary: { label: "Huyền thoại", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-300" },
};

const LEVEL_TITLES = [
  "", "Thực tập sinh", "Junior Sales", "Sales Rep", "Senior Sales",
  "Sales Lead", "Sales Manager", "Senior Manager", "Sales Director",
  "VP Sales", "Chief Revenue Officer",
];

const RANK_ICONS = [
  <Crown className="w-5 h-5 text-amber-500" />,
  <Medal className="w-5 h-5 text-gray-400" />,
  <Medal className="w-5 h-5 text-amber-700" />,
];

/* ============================================================
 * Mock Data — 8 nhân viên (bao gồm 1 AI Agent)
 * ============================================================ */
const ALL_BADGES: Badge[] = [
  { id: "b1", name: "First Deal", icon: "🎯", description: "Đóng deal đầu tiên", rarity: "common" },
  { id: "b2", name: "Deal Hunter", icon: "🏹", description: "Đóng 10 deals", rarity: "common" },
  { id: "b3", name: "Revenue Star", icon: "⭐", description: "Đạt $100K revenue/tháng", rarity: "rare" },
  { id: "b4", name: "Streak Master", icon: "🔥", description: "Streak 7 ngày liên tiếp có deal", rarity: "rare" },
  { id: "b5", name: "Closer", icon: "💰", description: "Win rate > 70%", rarity: "epic" },
  { id: "b6", name: "Whale Hunter", icon: "🐋", description: "Đóng deal > $100K", rarity: "epic" },
  { id: "b7", name: "Legend", icon: "👑", description: "Top 1 trong 3 tháng liên tiếp", rarity: "legendary" },
  { id: "b8", name: "AI Whisperer", icon: "🤖", description: "Sử dụng AI suggestions 50+ lần", rarity: "rare" },
  { id: "b9", name: "Team Player", icon: "🤝", description: "Hỗ trợ 10 deals cho đồng nghiệp", rarity: "common" },
  { id: "b10", name: "Speed Demon", icon: "⚡", description: "Close deal trong < 14 ngày", rarity: "epic" },
  { id: "b11", name: "Knowledge Guru", icon: "📚", description: "Đọc 20+ bài Knowledge Base", rarity: "common" },
  { id: "b12", name: "Perfect Month", icon: "🏆", description: "Đạt 120% target trong 1 tháng", rarity: "legendary" },
];

const SALES_REPS: SalesRep[] = [
  {
    id: "s1", name: "Nguyễn Văn An", role: "Sales Director", avatar: "NVA",
    rank: 1, prevRank: 1, revenue: 840000, dealsWon: 18, dealsTotal: 24, winRate: 75,
    activitiesCount: 342, avgDealSize: 46667, streak: 12, xp: 15200, level: 8,
    badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[2], ALL_BADGES[4], ALL_BADGES[5], ALL_BADGES[6], ALL_BADGES[11]],
    skills: [
      { name: "Closing", score: 95 }, { name: "Prospecting", score: 82 },
      { name: "Negotiation", score: 90 }, { name: "Relationship", score: 88 },
      { name: "Product Knowledge", score: 85 }, { name: "AI Usage", score: 72 },
    ],
    aiCoachTip: "Xuất sắc về closing. Gợi ý: tăng cường prospecting thông qua LinkedIn outreach.",
    monthlyRevenue: [120, 95, 140, 110, 165, 130],
  },
  {
    id: "s2", name: "Lê Minh Cường", role: "Business Development", avatar: "LMC",
    rank: 2, prevRank: 3, revenue: 620000, dealsWon: 14, dealsTotal: 20, winRate: 70,
    activitiesCount: 298, avgDealSize: 44286, streak: 8, xp: 12800, level: 7,
    badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[2], ALL_BADGES[3], ALL_BADGES[5], ALL_BADGES[7]],
    skills: [
      { name: "Closing", score: 80 }, { name: "Prospecting", score: 92 },
      { name: "Negotiation", score: 78 }, { name: "Relationship", score: 85 },
      { name: "Product Knowledge", score: 90 }, { name: "AI Usage", score: 88 },
    ],
    aiCoachTip: "Mạnh về prospecting & AI. Gợi ý: cải thiện kỹ năng negotiation để tăng deal size.",
    monthlyRevenue: [90, 105, 100, 95, 120, 110],
  },
  {
    id: "s3", name: "Hoàng Thị Mai", role: "Account Manager", avatar: "HTM",
    rank: 3, prevRank: 2, revenue: 540000, dealsWon: 16, dealsTotal: 22, winRate: 73,
    activitiesCount: 412, avgDealSize: 33750, streak: 5, xp: 11400, level: 7,
    badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[3], ALL_BADGES[4], ALL_BADGES[8], ALL_BADGES[10]],
    skills: [
      { name: "Closing", score: 78 }, { name: "Prospecting", score: 75 },
      { name: "Negotiation", score: 82 }, { name: "Relationship", score: 95 },
      { name: "Product Knowledge", score: 80 }, { name: "AI Usage", score: 65 },
    ],
    aiCoachTip: "Relationship building xuất sắc. Gợi ý: sử dụng AI insights nhiều hơn để tối ưu pipeline.",
    monthlyRevenue: [80, 85, 95, 90, 100, 90],
  },
  {
    id: "s4", name: "Trần Đức Hùng", role: "Senior Sales", avatar: "TĐH",
    rank: 4, prevRank: 5, revenue: 420000, dealsWon: 12, dealsTotal: 18, winRate: 67,
    activitiesCount: 256, avgDealSize: 35000, streak: 3, xp: 9200, level: 6,
    badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[2], ALL_BADGES[9]],
    skills: [
      { name: "Closing", score: 72 }, { name: "Prospecting", score: 80 },
      { name: "Negotiation", score: 75 }, { name: "Relationship", score: 70 },
      { name: "Product Knowledge", score: 78 }, { name: "AI Usage", score: 82 },
    ],
    aiCoachTip: "Close speed tốt. Gợi ý: xây dựng deeper relationships để cải thiện retention.",
    monthlyRevenue: [60, 70, 75, 65, 80, 70],
  },
  {
    id: "s5", name: "AI Sales Agent — Nova", role: "AI Agent", avatar: "🤖",
    rank: 5, prevRank: 6, revenue: 380000, dealsWon: 22, dealsTotal: 35, winRate: 63,
    activitiesCount: 1240, avgDealSize: 17273, streak: 30, xp: 18500, level: 9,
    badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[3], ALL_BADGES[7], ALL_BADGES[8], ALL_BADGES[10]],
    skills: [
      { name: "Closing", score: 65 }, { name: "Prospecting", score: 98 },
      { name: "Negotiation", score: 55 }, { name: "Relationship", score: 40 },
      { name: "Product Knowledge", score: 99 }, { name: "AI Usage", score: 100 },
    ],
    aiCoachTip: "Xuất sắc về volume & knowledge. Hạn chế: deal size nhỏ, cần con người hỗ trợ enterprise deals.",
    monthlyRevenue: [45, 55, 60, 65, 72, 83],
    isAI: true,
  },
  {
    id: "s6", name: "Phạm Thanh Tùng", role: "Sales Rep", avatar: "PTT",
    rank: 6, prevRank: 4, revenue: 310000, dealsWon: 9, dealsTotal: 16, winRate: 56,
    activitiesCount: 198, avgDealSize: 34444, streak: 0, xp: 7600, level: 5,
    badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[8]],
    skills: [
      { name: "Closing", score: 60 }, { name: "Prospecting", score: 68 },
      { name: "Negotiation", score: 65 }, { name: "Relationship", score: 72 },
      { name: "Product Knowledge", score: 58 }, { name: "AI Usage", score: 45 },
    ],
    aiCoachTip: "Win rate giảm 2 tháng gần đây. Gợi ý: tham gia Bootcamp closing techniques và đọc battle cards.",
    monthlyRevenue: [65, 55, 50, 45, 50, 45],
  },
  {
    id: "s7", name: "Vũ Ngọc Linh", role: "Junior Sales", avatar: "VNL",
    rank: 7, prevRank: 7, revenue: 180000, dealsWon: 6, dealsTotal: 14, winRate: 43,
    activitiesCount: 320, avgDealSize: 30000, streak: 2, xp: 4800, level: 3,
    badges: [ALL_BADGES[0], ALL_BADGES[10]],
    skills: [
      { name: "Closing", score: 45 }, { name: "Prospecting", score: 72 },
      { name: "Negotiation", score: 40 }, { name: "Relationship", score: 55 },
      { name: "Product Knowledge", score: 50 }, { name: "AI Usage", score: 78 },
    ],
    aiCoachTip: "Tiến bộ tốt. Gợi ý: shadowing senior reps trong meetings enterprise, focus cải thiện closing.",
    monthlyRevenue: [20, 25, 28, 30, 35, 42],
  },
  {
    id: "s8", name: "Đỗ Hải Yến", role: "Sales Rep", avatar: "ĐHY",
    rank: 8, prevRank: 8, revenue: 250000, dealsWon: 8, dealsTotal: 13, winRate: 62,
    activitiesCount: 215, avgDealSize: 31250, streak: 4, xp: 6400, level: 4,
    badges: [ALL_BADGES[0], ALL_BADGES[1], ALL_BADGES[9], ALL_BADGES[10]],
    skills: [
      { name: "Closing", score: 68 }, { name: "Prospecting", score: 58 },
      { name: "Negotiation", score: 70 }, { name: "Relationship", score: 65 },
      { name: "Product Knowledge", score: 72 }, { name: "AI Usage", score: 60 },
    ],
    aiCoachTip: "Balanced skills. Gợi ý: tập trung prospecting để tăng pipeline coverage.",
    monthlyRevenue: [35, 38, 40, 42, 45, 50],
  },
];

/* ============================================================
 * Revenue Ranking Chart
 * ============================================================ */
const RANKING_CHART = SALES_REPS
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 6)
  .map((r) => ({
    name: r.name.split(" ").pop() ?? r.name,
    revenue: r.revenue / 1000,
    isAI: r.isAI ?? false,
  }));

const BAR_COLORS = ["#f59e0b", "#9ca3af", "#b45309", "#6366f1", "#8b5cf6", "#a78bfa"];

/* ============================================================
 * Leaderboard Row
 * ============================================================ */
function LeaderboardRow({ rep, index, onView }: {
  rep: SalesRep;
  index: number;
  onView: (r: SalesRep) => void;
}) {
  const rankChange = rep.prevRank - rep.rank;
  const isTop3 = index < 3;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:shadow-md ${
        isTop3 ? "bg-gradient-to-r from-amber-50/50 to-white border border-amber-100" : "bg-white border border-gray-100"
      }`}
      onClick={() => onView(rep)}
    >
      {/* Rank */}
      <div className="w-8 text-center flex-shrink-0">
        {index < 3 ? RANK_ICONS[index] : <span className="text-sm text-gray-400">#{rep.rank}</span>}
      </div>

      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
        rep.isAI
          ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
          : "bg-violet-100 text-violet-700"
      }`}>
        {rep.isAI ? "🤖" : rep.avatar.slice(0, 2)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h4 className="text-sm text-gray-900 truncate">{rep.name}</h4>
          {rep.isAI && <Bot className="w-3 h-3 text-violet-500 flex-shrink-0" />}
          {rep.streak >= 7 && <Flame className="w-3 h-3 text-orange-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span>{rep.role}</span>
          <span>Lv.{rep.level} {LEVEL_TITLES[rep.level] ?? ""}</span>
        </div>
      </div>

      {/* Rank change */}
      <div className="flex-shrink-0 w-8 text-center">
        {rankChange > 0 && (
          <span className="text-[10px] text-green-600 flex items-center gap-0.5 justify-center">
            <ArrowUpRight className="w-3 h-3" />{rankChange}
          </span>
        )}
        {rankChange < 0 && (
          <span className="text-[10px] text-red-500 flex items-center gap-0.5 justify-center">
            <ArrowDownRight className="w-3 h-3" />{Math.abs(rankChange)}
          </span>
        )}
        {rankChange === 0 && <span className="text-[10px] text-gray-300">—</span>}
      </div>

      {/* Badges mini */}
      <div className="hidden sm:flex items-center gap-0.5 flex-shrink-0">
        {rep.badges.slice(0, 3).map((b) => (
          <span key={b.id} className="text-xs" title={b.name}>{b.icon}</span>
        ))}
        {rep.badges.length > 3 && <span className="text-[9px] text-gray-300">+{rep.badges.length - 3}</span>}
      </div>

      {/* Stats */}
      <div className="hidden sm:grid grid-cols-3 gap-3 text-center flex-shrink-0 w-[180px]">
        <div>
          <p className="text-sm text-gray-900">${(rep.revenue / 1000).toFixed(0)}K</p>
          <p className="text-[8px] text-gray-400">Doanh thu</p>
        </div>
        <div>
          <p className="text-sm text-gray-900">{rep.dealsWon}</p>
          <p className="text-[8px] text-gray-400">Deals</p>
        </div>
        <div>
          <p className="text-sm text-gray-900">{rep.winRate}%</p>
          <p className="text-[8px] text-gray-400">Win</p>
        </div>
      </div>

      {/* XP bar */}
      <div className="hidden lg:block w-[80px] flex-shrink-0">
        <div className="flex items-center justify-between text-[9px] mb-0.5">
          <span className="text-violet-600">{(rep.xp / 1000).toFixed(1)}K XP</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
            style={{ width: `${Math.min(100, (rep.xp % 5000) / 50)}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Rep Detail Modal
 * ============================================================ */
function RepDetailModal({ rep, onClose }: {
  rep: SalesRep;
  onClose: () => void;
}) {
  const revenueData = rep.monthlyRevenue.map((v, i) => ({
    month: ["T10", "T11", "T12", "T1", "T2", "T3"][i],
    revenue: v,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
              rep.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-violet-100 text-violet-700"
            }`}>
              {rep.isAI ? "🤖" : rep.avatar.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-gray-900 flex items-center gap-1.5">
                {rep.name}
                {rep.isAI && <Bot className="w-4 h-4 text-violet-500" />}
              </h3>
              <p className="text-xs text-gray-500">{rep.role} · Lv.{rep.level} {LEVEL_TITLES[rep.level]}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Rank + XP */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-amber-50 rounded-lg p-2 text-center border border-amber-100">
              <p className="text-lg text-amber-600">#{rep.rank}</p>
              <p className="text-[9px] text-amber-500">Xếp hạng</p>
            </div>
            <div className="bg-violet-50 rounded-lg p-2 text-center border border-violet-100">
              <p className="text-lg text-violet-600">{(rep.xp / 1000).toFixed(1)}K</p>
              <p className="text-[9px] text-violet-500">XP</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-2 text-center border border-orange-100">
              <p className="text-lg text-orange-600 flex items-center justify-center gap-0.5">
                <Flame className="w-4 h-4" />{rep.streak}
              </p>
              <p className="text-[9px] text-orange-500">Streak</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center border border-green-100">
              <p className="text-lg text-green-600">{rep.winRate}%</p>
              <p className="text-[9px] text-green-500">Win rate</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">${(rep.revenue / 1000).toFixed(0)}K</p>
              <p className="text-[9px] text-gray-400">Doanh thu</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{rep.dealsWon}/{rep.dealsTotal}</p>
              <p className="text-[9px] text-gray-400">Deals Won/Total</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{rep.activitiesCount}</p>
              <p className="text-[9px] text-gray-400">Hoạt động</p>
            </div>
          </div>

          {/* Skills Radar */}
          <div>
            <h4 className="text-xs text-gray-500 mb-1">Bản đồ kỹ năng</h4>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={rep.skills}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar name={rep.name} dataKey="score" stroke="#6366f1"
                  fill="#6366f1" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: "#6366f1" }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Trend */}
          <div>
            <h4 className="text-xs text-gray-500 mb-1">Doanh thu theo tháng ($K)</h4>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`$${v}K`, "Doanh thu"]} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Badges */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Huy hiệu ({rep.badges.length}/{ALL_BADGES.length})
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {rep.badges.map((badge) => {
                const rCfg = RARITY_CONFIG[badge.rarity];
                return (
                  <div key={badge.id} className={`flex items-center gap-2 p-2 rounded-lg border ${rCfg.bgColor}`}>
                    <span className="text-lg">{badge.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-900 truncate">{badge.name}</p>
                      <p className={`text-[8px] ${rCfg.color}`}>{rCfg.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Coach */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span><span className="text-violet-900">AI Coach:</span> {rep.aiCoachTip}</span>
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
export function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [rankBy, setRankBy] = useState<RankBy>("revenue");
  const [selectedRep, setSelectedRep] = useState<SalesRep | null>(null);

  const sorted = useMemo(() => {
    const reps = [...SALES_REPS];
    switch (rankBy) {
      case "revenue": return reps.sort((a, b) => b.revenue - a.revenue);
      case "deals": return reps.sort((a, b) => b.dealsWon - a.dealsWon);
      case "activities": return reps.sort((a, b) => b.activitiesCount - a.activitiesCount);
      case "xp": return reps.sort((a, b) => b.xp - a.xp);
      default: return reps;
    }
  }, [rankBy]);

  const stats = useMemo(() => ({
    totalRevenue: SALES_REPS.reduce((s, r) => s + r.revenue, 0),
    totalDeals: SALES_REPS.reduce((s, r) => s + r.dealsWon, 0),
    avgWinRate: Math.round(SALES_REPS.reduce((s, r) => s + r.winRate, 0) / SALES_REPS.length),
    totalBadges: SALES_REPS.reduce((s, r) => s + r.badges.length, 0),
  }), []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" /> Bảng xếp hạng & Gamification
        </h1>
        <p className="text-gray-500 mt-0.5">
          Xếp hạng sales, achievements, badges, AI coaching — Con người & AI Agent
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 p-3">
          <Trophy className="w-4 h-4 text-amber-500 mb-1" />
          <p className="text-lg text-gray-900">${(stats.totalRevenue / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-amber-700">Tổng doanh thu team</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <Target className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.totalDeals}</p>
          <p className="text-xs text-gray-500">Deals thắng</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <TrendingUp className="w-4 h-4 text-blue-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.avgWinRate}%</p>
          <p className="text-xs text-gray-500">Win rate TB</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <Award className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.totalBadges}</p>
          <p className="text-xs text-gray-500">Badges earned</p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-xl border border-amber-100 p-4">
        <h3 className="text-sm text-amber-800 mb-4 text-center flex items-center justify-center gap-1.5">
          <Crown className="w-4 h-4 text-amber-500" /> Top 3 — Tháng này
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {sorted.slice(0, 3).map((rep, i) => (
            <div key={rep.id}
              className={`text-center cursor-pointer p-3 rounded-xl transition-all hover:shadow-md ${
                i === 0 ? "bg-amber-50 border border-amber-200 -mt-2" :
                i === 1 ? "bg-gray-50 border border-gray-200" :
                "bg-orange-50/50 border border-orange-100"
              }`}
              onClick={() => setSelectedRep(rep)}>
              {RANK_ICONS[i]}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm mx-auto mt-2 mb-1 ${
                rep.isAI ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white" : "bg-violet-100 text-violet-700"
              }`}>
                {rep.isAI ? "🤖" : rep.avatar.slice(0, 2)}
              </div>
              <p className="text-sm text-gray-900">{rep.name.split(" ").slice(-2).join(" ")}</p>
              <p className="text-xs text-gray-500">${(rep.revenue / 1000).toFixed(0)}K</p>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {rep.badges.slice(0, 3).map((b) => <span key={b.id} className="text-xs">{b.icon}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-violet-500" /> Doanh thu theo người (Top 6)
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={RANKING_CHART}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}K`} />
            <Tooltip formatter={(v: number) => [`$${v}K`, "Doanh thu"]} />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {RANKING_CHART.map((entry, i) => (
                <Cell key={i} fill={entry.isAI ? "#8b5cf6" : BAR_COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {(["revenue", "deals", "activities", "xp"] as RankBy[]).map((r) => (
            <button key={r} type="button" onClick={() => setRankBy(r)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                rankBy === r ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
              }`}>
              {r === "revenue" ? "Doanh thu" : r === "deals" ? "Deals" : r === "activities" ? "Hoạt động" : "XP"}
            </button>
          ))}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="space-y-2">
        {sorted.map((rep, index) => (
          <LeaderboardRow key={rep.id} rep={rep} index={index} onView={setSelectedRep} />
        ))}
      </div>

      {/* Badge Showcase */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" /> Tất cả huy hiệu ({ALL_BADGES.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {ALL_BADGES.map((badge) => {
            const rCfg = RARITY_CONFIG[badge.rarity];
            const ownedBy = SALES_REPS.filter((r) => r.badges.some((b) => b.id === badge.id)).length;
            return (
              <div key={badge.id} className={`p-2.5 rounded-lg border ${rCfg.bgColor}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{badge.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-900 truncate">{badge.name}</p>
                    <p className={`text-[8px] ${rCfg.color}`}>{rCfg.label}</p>
                  </div>
                </div>
                <p className="text-[9px] text-gray-500">{badge.description}</p>
                <p className="text-[8px] text-gray-400 mt-0.5">{ownedBy}/{SALES_REPS.length} đạt</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Performance Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            AI Agent Nova đang tăng trưởng 15%/tháng, nhưng deal size chỉ bằng 37% con người. Gợi ý: phối hợp human cho enterprise deals.
          </p>
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Lê Minh Cường thăng 1 bậc nhờ tận dụng AI tools (+22% prospecting efficiency). Role model cho team.
          </p>
          <p className="flex items-start gap-2">
            <Flame className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            Phạm Thanh Tùng giảm 2 bậc. Win rate giảm từ 65% → 56%. Cần mentor session và review pipeline.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRep && (
        <RepDetailModal rep={selectedRep} onClose={() => setSelectedRep(null)} />
      )}
    </div>
  );
}
