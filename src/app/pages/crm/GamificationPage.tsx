/**
 * Trang Gamification & Rewards — Hệ thống game hoá cho sales team.
 * Badges, streaks, challenges, XP/levels, leaderboard mini,
 * weekly challenges, reward shop, AI coaching nudges.
 * Phase 1: Mock data + interactive cards + detail modal.
 */
import { useState, useMemo, useCallback } from "react";
import {
  Gamepad2,
  Search,
  X,
  Bot,
  Sparkles,
  Trophy,
  Flame,
  Star,
  Zap,
  Crown,
  Target,
  Medal,
  Gift,
  TrendingUp,
  Users,
  Award,
  Shield,
  Clock,
  CheckCircle2,
  Lock,
  Heart,
  Rocket,
  ArrowUpRight,
  CalendarCheck,
  Phone,
  Mail,
  DollarSign,
  BarChart3,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import type { ColumnDef } from "../../types/dataTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type BadgeRarity = "common" | "rare" | "epic" | "legendary";
type ChallengeStatus = "active" | "completed" | "expired" | "locked";

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: BadgeRarity;
  earnedDate: string | null;
  criteria: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "individual" | "team";
  status: ChallengeStatus;
  xpReward: number;
  progress: number;
  target: number;
  unit: string;
  deadline: string;
  participants: number;
}

interface SalesPlayer {
  id: string;
  name: string;
  role: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNext: number;
  title: string;
  streak: number;
  badges: Badge[];
  totalBadges: number;
  weeklyXP: number;
  rank: number;
  stats: { metric: string; value: number }[];
  aiNudge: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const RARITY_CONFIG: Record<BadgeRarity, { label: string; color: string; glow: string }> = {
  common: { label: "Common", color: "bg-gray-100 text-gray-600 border-gray-200", glow: "" },
  rare: { label: "Rare", color: "bg-blue-50 text-blue-600 border-blue-200", glow: "ring-1 ring-blue-200" },
  epic: { label: "Epic", color: "bg-violet-50 text-violet-600 border-violet-200", glow: "ring-2 ring-violet-300" },
  legendary: { label: "Legendary", color: "bg-amber-50 text-amber-600 border-amber-300", glow: "ring-2 ring-amber-300 shadow-amber-100 shadow-lg" },
};

const LEVEL_TITLES = ["Newbie", "Explorer", "Hunter", "Warrior", "Champion", "Legend", "Grandmaster"];

/* ============================================================
 * Mock Data
 * ============================================================ */
const ALL_BADGES: Badge[] = [
  { id: "b1", name: "First Blood", emoji: "🩸", description: "Close deal đầu tiên", rarity: "common", earnedDate: null, criteria: "Close 1 deal" },
  { id: "b2", name: "Streak Master", emoji: "🔥", description: "7 ngày liên tiếp đạt daily target", rarity: "rare", earnedDate: null, criteria: "7-day streak" },
  { id: "b3", name: "Pipeline King", emoji: "👑", description: "Pipeline > $500K trong 1 tháng", rarity: "epic", earnedDate: null, criteria: "Pipeline > $500K/month" },
  { id: "b4", name: "Century Club", emoji: "💯", description: "100 activities trong 1 tuần", rarity: "rare", earnedDate: null, criteria: "100 activities/week" },
  { id: "b5", name: "Customer Whisperer", emoji: "🤝", description: "NPS 9+ từ 5 khách hàng liên tiếp", rarity: "epic", earnedDate: null, criteria: "5 consecutive NPS 9+" },
  { id: "b6", name: "AI Collaborator", emoji: "🤖", description: "Sử dụng AI insights 50 lần", rarity: "common", earnedDate: null, criteria: "50 AI insight views" },
  { id: "b7", name: "Deal Slayer", emoji: "⚔️", description: "Close 3 deals > $50K trong 1 quý", rarity: "legendary", earnedDate: null, criteria: "3 deals > $50K/quarter" },
  { id: "b8", name: "Speed Demon", emoji: "⚡", description: "Response time trung bình < 1 giờ", rarity: "rare", earnedDate: null, criteria: "Avg response < 1h" },
  { id: "b9", name: "Team Player", emoji: "🏀", description: "Assist 10 deals cho đồng nghiệp", rarity: "common", earnedDate: null, criteria: "10 deal assists" },
  { id: "b10", name: "Unicorn Hunter", emoji: "🦄", description: "Close deal > $200K", rarity: "legendary", earnedDate: null, criteria: "1 deal > $200K" },
];

const PLAYERS: SalesPlayer[] = [
  {
    id: "pl1", name: "Nguyễn Văn An", role: "Senior Sales", avatar: "👨‍💼",
    level: 12, xp: 8450, xpToNext: 1550, title: "Champion",
    streak: 14, totalBadges: 8, weeklyXP: 680, rank: 1,
    badges: [
      { ...ALL_BADGES[0], earnedDate: "2025-04-15" },
      { ...ALL_BADGES[1], earnedDate: "2026-02-20" },
      { ...ALL_BADGES[2], earnedDate: "2026-01-15" },
      { ...ALL_BADGES[3], earnedDate: "2026-02-10" },
      { ...ALL_BADGES[4], earnedDate: "2026-03-01" },
      { ...ALL_BADGES[5], earnedDate: "2025-12-05" },
      { ...ALL_BADGES[6], earnedDate: "2026-02-28" },
      { ...ALL_BADGES[7], earnedDate: "2026-01-20" },
    ],
    stats: [
      { metric: "Deals", value: 92 }, { metric: "Calls", value: 85 },
      { metric: "Pipeline", value: 95 }, { metric: "NPS", value: 88 },
      { metric: "Response", value: 90 }, { metric: "AI Usage", value: 78 },
    ],
    aiNudge: "14-day streak! Nếu maintain 21 ngày sẽ unlock 'Iron Will' badge (Epic). Focus close TechCorp deal hôm nay để giữ momentum.",
  },
  {
    id: "pl2", name: "Hoàng Thị Mai", role: "Sales Manager", avatar: "👩‍💼",
    level: 14, xp: 11200, xpToNext: 800, title: "Legend",
    streak: 21, totalBadges: 9, weeklyXP: 750, rank: 2,
    badges: [
      { ...ALL_BADGES[0], earnedDate: "2024-08-10" },
      { ...ALL_BADGES[1], earnedDate: "2025-11-15" },
      { ...ALL_BADGES[2], earnedDate: "2025-12-20" },
      { ...ALL_BADGES[3], earnedDate: "2026-01-08" },
      { ...ALL_BADGES[4], earnedDate: "2026-02-14" },
      { ...ALL_BADGES[5], earnedDate: "2025-10-01" },
      { ...ALL_BADGES[6], earnedDate: "2025-09-30" },
      { ...ALL_BADGES[7], earnedDate: "2025-08-25" },
      { ...ALL_BADGES[8], earnedDate: "2026-02-20" },
    ],
    stats: [
      { metric: "Deals", value: 95 }, { metric: "Calls", value: 80 },
      { metric: "Pipeline", value: 90 }, { metric: "NPS", value: 92 },
      { metric: "Response", value: 85 }, { metric: "AI Usage", value: 88 },
    ],
    aiNudge: "21-day streak — longest in team! Sắp level 15 (Grandmaster). Chỉ cần 800 XP nữa. Close 2 deals tuần này sẽ đạt.",
  },
  {
    id: "pl3", name: "Phạm Thanh Tùng", role: "Account Manager", avatar: "👨‍💻",
    level: 8, xp: 4200, xpToNext: 1800, title: "Warrior",
    streak: 3, totalBadges: 5, weeklyXP: 320, rank: 3,
    badges: [
      { ...ALL_BADGES[0], earnedDate: "2025-06-01" },
      { ...ALL_BADGES[5], earnedDate: "2025-11-10" },
      { ...ALL_BADGES[8], earnedDate: "2026-01-15" },
      { ...ALL_BADGES[7], earnedDate: "2025-09-20" },
      { ...ALL_BADGES[3], earnedDate: "2026-02-05" },
    ],
    stats: [
      { metric: "Deals", value: 65 }, { metric: "Calls", value: 70 },
      { metric: "Pipeline", value: 55 }, { metric: "NPS", value: 82 },
      { metric: "Response", value: 75 }, { metric: "AI Usage", value: 60 },
    ],
    aiNudge: "Pipeline score 55% — dưới team avg. Thêm 4 qualified leads tuần này sẽ tăng lên 70%. Streak mới 3 ngày — keep going!",
  },
  {
    id: "pl4", name: "Đỗ Hải Yến", role: "CS Manager", avatar: "👩‍🔬",
    level: 10, xp: 6800, xpToNext: 1200, title: "Champion",
    streak: 8, totalBadges: 6, weeklyXP: 480, rank: 4,
    badges: [
      { ...ALL_BADGES[0], earnedDate: "2025-03-20" },
      { ...ALL_BADGES[4], earnedDate: "2026-01-30" },
      { ...ALL_BADGES[5], earnedDate: "2025-08-15" },
      { ...ALL_BADGES[8], earnedDate: "2025-11-25" },
      { ...ALL_BADGES[1], earnedDate: "2026-02-25" },
      { ...ALL_BADGES[3], earnedDate: "2026-03-01" },
    ],
    stats: [
      { metric: "Deals", value: 50 }, { metric: "Calls", value: 90 },
      { metric: "Pipeline", value: 45 }, { metric: "NPS", value: 95 },
      { metric: "Response", value: 92 }, { metric: "AI Usage", value: 85 },
    ],
    aiNudge: "NPS Queen! Score 95 highest in team. 'Customer Whisperer' badge earned. Challenge: mentor Tùng on NPS improvement.",
  },
  {
    id: "pl5", name: "Trần Minh Anh", role: "Sales Rep", avatar: "👩‍💼",
    level: 5, xp: 2100, xpToNext: 900, title: "Hunter",
    streak: 0, totalBadges: 3, weeklyXP: 180, rank: 5,
    badges: [
      { ...ALL_BADGES[0], earnedDate: "2025-10-01" },
      { ...ALL_BADGES[5], earnedDate: "2026-01-10" },
      { ...ALL_BADGES[8], earnedDate: "2026-02-15" },
    ],
    stats: [
      { metric: "Deals", value: 40 }, { metric: "Calls", value: 55 },
      { metric: "Pipeline", value: 35 }, { metric: "NPS", value: 70 },
      { metric: "Response", value: 60 }, { metric: "AI Usage", value: 45 },
    ],
    aiNudge: "Streak broken! Bắt đầu lại từ hôm nay. Focus: 5 calls + 2 meetings sẽ earn 150 XP. Target level 6 cuối tuần.",
  },
];

const CHALLENGES: Challenge[] = [
  { id: "ch1", title: "March Madness 🏀", description: "Close $100K revenue trong tháng 3", type: "individual", status: "active", xpReward: 500, progress: 72000, target: 100000, unit: "$", deadline: "2026-03-31", participants: 5 },
  { id: "ch2", title: "Call Blitz ⚡", description: "50 outbound calls trong tuần", type: "individual", status: "active", xpReward: 200, progress: 35, target: 50, unit: "calls", deadline: "2026-03-07", participants: 4 },
  { id: "ch3", title: "Team Pipeline Sprint 🏃", description: "Team pipeline đạt $2M", type: "team", status: "active", xpReward: 800, progress: 1650000, target: 2000000, unit: "$", deadline: "2026-03-31", participants: 5 },
  { id: "ch4", title: "AI Explorer 🤖", description: "Sử dụng AI insights 20 lần", type: "individual", status: "active", xpReward: 150, progress: 14, target: 20, unit: "lần", deadline: "2026-03-15", participants: 3 },
  { id: "ch5", title: "Perfect Week ✨", description: "Đạt tất cả daily targets 5/5 ngày", type: "individual", status: "completed", xpReward: 300, progress: 5, target: 5, unit: "ngày", deadline: "2026-02-28", participants: 2 },
  { id: "ch6", title: "Customer Love 💕", description: "Nhận NPS 9+ từ 3 khách hàng", type: "individual", status: "active", xpReward: 250, progress: 2, target: 3, unit: "ratings", deadline: "2026-03-20", participants: 3 },
  { id: "ch7", title: "Unicorn Hunt 🦄", description: "Close deal > $200K", type: "individual", status: "locked", xpReward: 1000, progress: 0, target: 1, unit: "deal", deadline: "2026-06-30", participants: 0 },
];

const REWARDS = [
  { name: "Ngày nghỉ phép thêm", cost: 5000, emoji: "🏖️", stock: 3 },
  { name: "Dinner voucher $100", cost: 2000, emoji: "🍽️", stock: 10 },
  { name: "Gadget budget $200", cost: 3500, emoji: "🎮", stock: 5 },
  { name: "Conference ticket", cost: 8000, emoji: "🎫", stock: 2 },
  { name: "Executive parking 1 tháng", cost: 1500, emoji: "🚗", stock: 4 },
  { name: "Custom title badge", cost: 500, emoji: "🏷️", stock: 99 },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const XP_LEADERBOARD = PLAYERS.map((p) => ({
  name: p.name.split(" ").pop() || p.name,
  xp: p.weeklyXP,
  level: p.level,
})).sort((a, b) => b.xp - a.xp);

const XP_TREND = [
  { week: "W6", an: 520, mai: 600, tung: 280, yen: 400, anh: 150 },
  { week: "W7", an: 580, mai: 650, tung: 310, yen: 420, anh: 170 },
  { week: "W8", an: 620, mai: 700, tung: 290, yen: 460, anh: 160 },
  { week: "W9", an: 680, mai: 750, tung: 320, yen: 480, anh: 180 },
];
const LINE_COLORS = ["#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b", "#6b7280"];

/* ============================================================
 * Detail Modal
 * ============================================================ */
function PlayerDetailModal({ player, onClose }: { player: SalesPlayer; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{player.avatar}</span>
            <div>
              <h3 className="text-gray-900">{player.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] px-2 py-0.5 rounded bg-violet-50 text-violet-600">Lv.{player.level} {player.title}</span>
                <span className="text-[9px] text-gray-400">{player.role}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* XP & Level */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-violet-50 rounded-lg p-2.5">
              <p className="text-lg text-violet-600">{player.xp.toLocaleString()}</p>
              <p className="text-[8px] text-gray-400">Total XP</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-2.5">
              <p className="text-lg text-amber-600 flex items-center justify-center gap-0.5">
                <Flame className="w-4 h-4" /> {player.streak}
              </p>
              <p className="text-[8px] text-gray-400">Day Streak</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2.5">
              <p className="text-lg text-green-600">#{player.rank}</p>
              <p className="text-[8px] text-gray-400">Rank</p>
            </div>
          </div>

          {/* XP Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Level {player.level} → {player.level + 1}</span>
              <span>{player.xpToNext} XP còn lại</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
                style={{ width: `${Math.round(((player.xp % 1000) / 1000) * 100) || 85}%` }} />
            </div>
          </div>

          {/* Radar */}
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={player.stats} outerRadius={70}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 7 }} />
              <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf640" strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>

          {/* Badges */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Medal className="w-3.5 h-3.5" /> Huy hiệu ({player.badges.length}/{ALL_BADGES.length})
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {ALL_BADGES.map((badge) => {
                const earned = player.badges.find((b) => b.id === badge.id);
                const rCfg = RARITY_CONFIG[badge.rarity];
                return (
                  <div key={badge.id} className={`text-center p-2 rounded-lg border transition-all ${
                    earned ? `${rCfg.color} ${rCfg.glow}` : "bg-gray-50 border-gray-200 opacity-40"
                  }`} title={`${badge.name}: ${badge.description}`}>
                    <span className="text-xl">{badge.emoji}</span>
                    <p className="text-[7px] mt-0.5 truncate">{badge.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Nudge */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span><span className="text-violet-900">AI Coach:</span> {player.aiNudge}</span>
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
 * Create Challenge Modal
 * ============================================================ */
function CreateChallengeModal({ onClose, onCreated }: { onClose: () => void; onCreated: (ch: Challenge) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"individual" | "team">("individual");
  const [xpReward, setXpReward] = useState(300);
  const [target, setTarget] = useState(10);
  const [unit, setUnit] = useState("deals");
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tên challenge"); return; }
    setSaving(true);
    const newChallenge: Challenge = {
      id: `ch_${Date.now()}`, title, description,
      type, status: "active", xpReward,
      progress: 0, target, unit,
      deadline: new Date(Date.now() + deadlineDays * 86400000).toISOString().slice(0, 10),
      participants: type === "team" ? 5 : 1,
    };
    onCreated(newChallenge);
    toast.success(`Đã tạo challenge "${title}" — ${xpReward} XP reward`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2"><Target className="w-5 h-5 text-violet-600" /> Tạo Challenge mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên Challenge *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Sprint Master — 20 deals trong 7 ngày"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              placeholder="Mô tả mục tiêu và luật chơi..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại</label>
              <select value={type} onChange={(e) => setType(e.target.value as "individual" | "team")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="individual">👤 Cá nhân</option>
                <option value="team">🏀 Đội</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">XP Reward</label>
              <input type="number" value={xpReward} onChange={(e) => setXpReward(Number(e.target.value))} min={50} step={50}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mục tiêu</label>
              <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} min={1}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Đơn vị</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="deals">Deals</option>
                <option value="calls">Cuộc gọi</option>
                <option value="$">USD ($)</option>
                <option value="demos">Demos</option>
                <option value="meetings">Meetings</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Thời hạn</label>
              <select value={deadlineDays} onChange={(e) => setDeadlineDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value={3}>3 ngày</option>
                <option value={7}>1 tuần</option>
                <option value={14}>2 tuần</option>
                <option value={30}>1 tháng</option>
              </select>
            </div>
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Challenge sẽ tự động activate và thông báo tới {type === "team" ? "toàn bộ team" : "từng cá nhân"}. AI sẽ coaching real-time.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Challenge"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function GamificationPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<SalesPlayer | null>(null);
  const [tab, setTab] = useState<"players" | "challenges" | "rewards">("players");
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { mode, setMode } = useViewMode("gamification", "list");

  const stats = useMemo(() => ({
    totalXP: PLAYERS.reduce((s, p) => s + p.xp, 0),
    avgStreak: Math.round(PLAYERS.reduce((s, p) => s + p.streak, 0) / PLAYERS.length),
    activeChallenges: challenges.filter((c) => c.status === "active").length,
    totalBadgesEarned: PLAYERS.reduce((s, p) => s + p.badges.length, 0),
  }), [challenges]);

  const columns: ColumnDef<SalesPlayer>[] = [
    {
      key: "name", header: "Player", sortable: true, minWidth: 180,
      render: (p) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex-shrink-0">
            <span className="text-2xl">{p.avatar}</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-600 text-white text-[7px] rounded-full flex items-center justify-center">{p.level}</span>
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 truncate">{p.name}</p>
            <p className="text-[10px] text-gray-400">{p.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: "title", header: "Title", sortable: true, minWidth: 90, editable: true,
      render: (p) => <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600">{p.title}</span>,
      renderEdit: (item, _v, onChange, onSave) => (
        <select defaultValue={item.title} onChange={(e) => { onChange(e.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {LEVEL_TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      ),
    },
    {
      key: "weeklyXP", header: "Weekly XP", sortable: true, minWidth: 80,
      render: (p) => <span className="text-violet-600">{p.weeklyXP} XP</span>,
      sortValue: (p) => p.weeklyXP,
    },
    {
      key: "streak", header: "Streak", sortable: true, minWidth: 70,
      render: (p) => p.streak >= 7
        ? <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" /> {p.streak}d</span>
        : <span className="text-xs text-gray-400">{p.streak}d</span>,
      sortValue: (p) => p.streak,
    },
    {
      key: "rank", header: "Rank", sortable: true, minWidth: 50,
      render: (p) => <span className="text-xs text-gray-500">#{p.rank}</span>,
      sortValue: (p) => p.rank,
    },
    {
      key: "badges", header: "Badges", minWidth: 120,
      render: (p) => (
        <div className="flex items-center gap-0.5">
          {p.badges.slice(0, 5).map((b) => <span key={b.id} className="text-xs" title={b.name}>{b.emoji}</span>)}
          {p.badges.length > 5 && <span className="text-[8px] text-gray-400">+{p.badges.length - 5}</span>}
        </div>
      ),
    },
  ];

  const [players, setPlayers] = useState(PLAYERS);
  const handleInlineEdit = useCallback((rowId: string, field: string, value: unknown) => {
    setPlayers((prev) => prev.map((p) => p.id === rowId ? { ...p, [field]: value } : p));
    toast.success("Đã cập nhật player");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setPlayers((prev) => prev.filter((p) => !deleteTarget.ids.includes(p.id)));
    toast.success(`Đã xóa ${deleteTarget.ids.length > 1 ? deleteTarget.ids.length + " players" : "\"" + deleteTarget.label + "\""}`);
    setDeleteTarget(null);
    setDeleting(false);
  }, [deleteTarget]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-violet-600" /> Game hoá Sales
          </h1>
          <p className="text-gray-500 mt-0.5">
            XP, levels, badges, streaks, challenges, reward shop, AI coaching nudges
          </p>
        </div>
        <button type="button" onClick={() => { setTab("challenges"); setShowCreateChallenge(true); }}
          className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 self-start">
          <Plus className="w-4 h-4" /> Tạo Challenge
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-3">
          <Zap className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-violet-600">{stats.totalXP.toLocaleString()}</p>
          <p className="text-xs text-violet-700">Tổng XP team</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-3">
          <Flame className="w-4 h-4 text-amber-500 mb-1" />
          <p className="text-lg text-amber-600">{stats.avgStreak} ngày</p>
          <p className="text-xs text-amber-700">Streak TB</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-3">
          <Target className="w-4 h-4 text-blue-500 mb-1" />
          <p className="text-lg text-blue-600">{stats.activeChallenges}</p>
          <p className="text-xs text-blue-700">Challenges đang chạy</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <Medal className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-green-600">{stats.totalBadgesEarned}</p>
          <p className="text-xs text-green-700">Badges earned</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Weekly XP Leaderboard</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={XP_LEADERBOARD}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => [`${v} XP`]} />
              <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                {XP_LEADERBOARD.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#f59e0b" : i === 1 ? "#6b7280" : i === 2 ? "#cd7f32" : "#8b5cf6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">XP Trend theo Tuần</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={XP_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Line type="monotone" dataKey="an" name="An" stroke={LINE_COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="mai" name="Mai" stroke={LINE_COLORS[1]} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="tung" name="Tùng" stroke={LINE_COLORS[2]} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="yen" name="Yến" stroke={LINE_COLORS[3]} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="anh" name="Anh" stroke={LINE_COLORS[4]} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-100 p-1">
        {([
          { key: "players" as const, label: "🏆 Players", count: PLAYERS.length },
          { key: "challenges" as const, label: "🎯 Challenges", count: challenges.filter((c) => c.status === "active").length },
          { key: "rewards" as const, label: "🎁 Rewards", count: REWARDS.length },
        ]).map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              tab === t.key ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Players Tab */}
      {tab === "players" && (
        <div className="space-y-2">
          <div className="flex justify-end mb-2">
            <ViewToggle mode={mode} onSetMode={setMode} modes={["table", "list"]} />
          </div>
          {mode === "table" ? (
            <DataTable<SalesPlayer>
              columns={columns}
              data={players}
              storageKey="gamification-players"
              selectable
              onRowClick={setSelectedPlayer}
              onInlineEdit={handleInlineEdit}
              onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} players được chọn` })}
              renderRowActions={(item) => (
                <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.name })} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
              )}
              emptyMessage="Không có player nào"
            />
          ) : (
            PLAYERS.map((p) => (
              <div key={p.id}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setSelectedPlayer(p)}>
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <span className="text-3xl">{p.avatar}</span>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 text-white text-[8px] rounded-full flex items-center justify-center">
                      {p.level}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600">{p.title}</span>
                      {p.streak >= 7 && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> {p.streak}d streak
                        </span>
                      )}
                      <span className="text-[8px] text-gray-300">#{p.rank}</span>
                    </div>
                    <p className="text-sm text-gray-900">{p.name}</p>
                    <p className="text-[10px] text-gray-400">{p.role}</p>
                    {/* Mini badges */}
                    <div className="flex items-center gap-0.5 mt-1">
                      {p.badges.slice(0, 6).map((b) => (
                        <span key={b.id} className="text-xs" title={b.name}>{b.emoji}</span>
                      ))}
                      {p.badges.length > 6 && <span className="text-[8px] text-gray-400">+{p.badges.length - 6}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-violet-600">{p.weeklyXP} XP</p>
                    <p className="text-[8px] text-gray-400">tuần này</p>
                    <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        style={{ width: `${Math.round(((p.xp % 1000) / 1000) * 100) || 85}%` }} />
                    </div>
                    <p className="text-[7px] text-gray-300 mt-0.5">{p.xpToNext} to Lv.{p.level + 1}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Challenges Tab */}
      {tab === "challenges" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {challenges.map((ch) => {
            const pct = Math.round((ch.progress / ch.target) * 100);
            return (
              <div key={ch.id} className={`bg-white rounded-xl border p-4 ${
                ch.status === "locked" ? "opacity-50 border-gray-200" :
                ch.status === "completed" ? "border-green-200" :
                ch.status === "expired" ? "border-gray-200 opacity-60" : "border-gray-100"
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm text-gray-900">{ch.title}</h4>
                    <p className="text-[10px] text-gray-500">{ch.description}</p>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap ${
                    ch.status === "active" ? "bg-blue-50 text-blue-600" :
                    ch.status === "completed" ? "bg-green-50 text-green-600" :
                    ch.status === "locked" ? "bg-gray-100 text-gray-500" : "bg-red-50 text-red-600"
                  }`}>{ch.status === "active" ? "Đang chạy" : ch.status === "completed" ? "Hoàn thành" : ch.status === "locked" ? "Khoá" : "Hết hạn"}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
                  <div className="h-2 rounded-full transition-all" style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: ch.status === "completed" ? "#22c55e" : "#8b5cf6"
                  }} />
                </div>
                <div className="flex items-center justify-between text-[9px] text-gray-400">
                  <span>{ch.unit === "$" ? `$${(ch.progress / 1000).toFixed(0)}K / $${(ch.target / 1000).toFixed(0)}K` : `${ch.progress} / ${ch.target} ${ch.unit}`}</span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-violet-500" /> {ch.xpReward} XP
                  </span>
                </div>
                <div className="flex items-center justify-between text-[8px] text-gray-300 mt-1">
                  <span>{ch.type === "team" ? "🏀 Team" : "👤 Individual"} · {ch.participants} participants</span>
                  <span>⏰ {new Date(ch.deadline).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rewards Tab */}
      {tab === "rewards" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {REWARDS.map((r) => (
            <div key={r.name} className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-sm transition-shadow">
              <span className="text-3xl">{r.emoji}</span>
              <p className="text-sm text-gray-900 mt-2">{r.name}</p>
              <p className="text-xs text-violet-600 mt-1 flex items-center justify-center gap-0.5">
                <Zap className="w-3 h-3" /> {r.cost.toLocaleString()} XP
              </p>
              <p className="text-[9px] text-gray-400 mt-0.5">Còn {r.stock} phần</p>
              <button type="button" onClick={() => toast.success(`Đã đổi: ${r.name}!`)}
                className="mt-2 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs hover:bg-violet-700 w-full">
                Đổi thưởng
              </button>
            </div>
          ))}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Gamification Coach</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            Mai giữ 21-day streak — kỷ lục team! Sắp lên Grandmaster (Lv.15). Encourage team celebrate milestone này.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            Minh Anh streak broken, XP thấp nhất. Pair với An (top performer) cho mentoring. Quick win: complete AI Explorer challenge.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Team Pipeline Sprint 82.5% — on track! Cần $350K nữa. Nếu mỗi người add 1 qualified deal, sẽ đạt target và earn 800 XP.
          </p>
        </div>
      </div>

      {selectedPlayer && <PlayerDetailModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
      {showCreateChallenge && <CreateChallengeModal onClose={() => setShowCreateChallenge(false)} onCreated={(ch) => setChallenges((prev) => [ch, ...prev])} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.label ?? ""}
        entityType="player"
        description="Thao tác này không thể hoàn tác."
        loading={deleting}
      />
    </div>
  );
}