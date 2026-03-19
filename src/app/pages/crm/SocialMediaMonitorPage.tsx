/**
 * Social Media Monitor
 * Theo dõi mạng xã hội: mentions, sentiment analysis,
 * competitor tracking, social listening, engagement metrics.
 */
import { useState, useMemo, useCallback } from "react";
import {
  Globe,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Bot,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Users,
  BarChart3,
  Clock,
  ExternalLink,
  Zap,
  Filter,
  RefreshCw,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Hash,
  AtSign,
  Plus,
  Bell,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import type { ColumnDef } from "../../types/dataTable";

/* ============================================================
 * Types
 * ============================================================ */
type Platform = "facebook" | "linkedin" | "twitter" | "tiktok" | "zalo" | "youtube";
type Sentiment = "positive" | "negative" | "neutral";

interface SocialMention {
  id: string;
  platform: Platform;
  author: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  sentiment: Sentiment;
  sentimentScore: number; // -100 to 100
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  url: string;
  createdAt: string;
  tags: string[];
  isInfluencer: boolean;
  responded: boolean;
}

interface SocialMetric {
  platform: Platform;
  followers: number;
  followerChange: number;
  posts: number;
  engagement: number;
  engagementChange: number;
  reach: number;
  mentions: number;
}

/* ============================================================
 * Constants
 * ============================================================ */
const PLATFORM_CFG: Record<Platform, { label: string; color: string; bg: string }> = {
  facebook: { label: "Facebook", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  linkedin: { label: "LinkedIn", color: "text-blue-700", bg: "bg-blue-50 border-blue-300" },
  twitter: { label: "X (Twitter)", color: "text-gray-800", bg: "bg-gray-50 border-gray-300" },
  tiktok: { label: "TikTok", color: "text-pink-600", bg: "bg-pink-50 border-pink-200" },
  zalo: { label: "Zalo", color: "text-blue-500", bg: "bg-blue-50 border-blue-200" },
  youtube: { label: "YouTube", color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const SENTIMENT_CFG: Record<Sentiment, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  positive: { label: "Tích cực", color: "text-green-600 bg-green-50", icon: ThumbsUp },
  negative: { label: "Tiêu cực", color: "text-red-600 bg-red-50", icon: ThumbsDown },
  neutral: { label: "Trung lập", color: "text-gray-500 bg-gray-50", icon: Minus },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_MENTIONS: SocialMention[] = [
  {
    id: "sm_001", platform: "linkedin", author: "Nguyễn Minh Tuấn", authorHandle: "@minhtuannguyen",
    authorAvatar: "", content: "Vừa triển khai AI-CRM cho đội sales 50 người. Kết quả sau 3 tháng: deal velocity tăng 40%, forecast accuracy 92%. CRM AI-first thực sự khác biệt! 🚀 #AI #CRM #SalesOps",
    sentiment: "positive", sentimentScore: 85, likes: 234, comments: 45, shares: 28, reach: 12500,
    url: "#", createdAt: "2026-03-03T09:00:00Z", tags: ["Review", "Testimonial"], isInfluencer: true, responded: true,
  },
  {
    id: "sm_002", platform: "facebook", author: "Cộng đồng SaaS Việt Nam", authorHandle: "@saasvietenam",
    authorAvatar: "", content: "AI-CRM vs HubSpot: So sánh chi tiết 2026. AI-CRM thắng ở AI capabilities và giá cả, nhưng HubSpot có ecosystem lớn hơn. Đọc bài phân tích: [link]",
    sentiment: "positive", sentimentScore: 62, likes: 156, comments: 67, shares: 34, reach: 8900,
    url: "#", createdAt: "2026-03-03T07:30:00Z", tags: ["Comparison", "Review"], isInfluencer: false, responded: false,
  },
  {
    id: "sm_003", platform: "twitter", author: "Trần Đức Long", authorHandle: "@duclong_dev",
    authorAvatar: "", content: "API documentation của @AI_CRM khá tốt, nhưng rate limit 100 req/min cho Enterprise plan thì hơi thấp. Đang phải batch requests. Mong team nâng lên 500 🙏",
    sentiment: "negative", sentimentScore: -35, likes: 12, comments: 5, shares: 2, reach: 1200,
    url: "#", createdAt: "2026-03-03T06:15:00Z", tags: ["API", "Feedback"], isInfluencer: false, responded: true,
  },
  {
    id: "sm_004", platform: "tiktok", author: "Sales Coach Việt Nam", authorHandle: "@salescoachvn",
    authorAvatar: "", content: "Mình dùng AI Sales Coach trong AI-CRM — nó gợi ý câu trả lời objections real-time luôn! Video demo 60 giây: [video] 🤯 #SalesTips #AItools",
    sentiment: "positive", sentimentScore: 92, likes: 1560, comments: 234, shares: 456, reach: 45000,
    url: "#", createdAt: "2026-03-02T20:00:00Z", tags: ["Video", "Demo", "Influencer"], isInfluencer: true, responded: true,
  },
  {
    id: "sm_005", platform: "linkedin", author: "Phạm Thị Hà", authorHandle: "@phamthiha",
    authorAvatar: "", content: "Đang evaluate CRM mới cho startup 20 người. AI-CRM trông interesting, nhưng chưa rõ có hỗ trợ multi-language cho team offshore không. Ai đã dùng cho mình xin feedback?",
    sentiment: "neutral", sentimentScore: 5, likes: 8, comments: 12, shares: 1, reach: 2300,
    url: "#", createdAt: "2026-03-02T15:00:00Z", tags: ["Inquiry", "Evaluation"], isInfluencer: false, responded: false,
  },
  {
    id: "sm_006", platform: "youtube", author: "Tech Review VN", authorHandle: "@techreviewvn",
    authorAvatar: "", content: "Review AI-CRM 2026: CRM thuần Việt đầu tiên tích hợp AI Agent. Video 15 phút chi tiết. Điểm: 8.5/10. Trừ điểm vì chưa có mobile app native.",
    sentiment: "positive", sentimentScore: 70, likes: 890, comments: 134, shares: 67, reach: 32000,
    url: "#", createdAt: "2026-03-01T10:00:00Z", tags: ["Review", "Video", "Influencer"], isInfluencer: true, responded: true,
  },
  {
    id: "sm_007", platform: "facebook", author: "IT Manager Forum VN", authorHandle: "@itmanagervn",
    authorAvatar: "", content: "Có ai gặp issue integration AI-CRM với SAP không? Webhook nhận payload chậm ~5s, không biết do SAP hay AI-CRM side. Cần help!",
    sentiment: "negative", sentimentScore: -45, likes: 3, comments: 8, shares: 0, reach: 450,
    url: "#", createdAt: "2026-03-01T08:00:00Z", tags: ["Issue", "Integration", "SAP"], isInfluencer: false, responded: false,
  },
  {
    id: "sm_008", platform: "zalo", author: "Nhóm CEO Startup", authorHandle: "Zalo Group",
    authorAvatar: "", content: "Nhóm ơi, AI-CRM vừa ra tính năng Email Sequence Builder, drip campaign tự động. Mình test thử thấy UX mượt hơn Mailchimp. Recommend!",
    sentiment: "positive", sentimentScore: 78, likes: 45, comments: 12, shares: 8, reach: 3400,
    url: "#", createdAt: "2026-02-28T16:00:00Z", tags: ["Recommendation", "Email"], isInfluencer: false, responded: false,
  },
];

const MOCK_METRICS: SocialMetric[] = [
  { platform: "facebook", followers: 12500, followerChange: 340, posts: 24, engagement: 4.2, engagementChange: 0.3, reach: 89000, mentions: 45 },
  { platform: "linkedin", followers: 8900, followerChange: 520, posts: 18, engagement: 6.8, engagementChange: 0.8, reach: 124000, mentions: 67 },
  { platform: "twitter", followers: 5600, followerChange: 180, posts: 45, engagement: 2.1, engagementChange: -0.2, reach: 34000, mentions: 23 },
  { platform: "tiktok", followers: 15200, followerChange: 1200, posts: 12, engagement: 8.5, engagementChange: 1.2, reach: 230000, mentions: 18 },
  { platform: "youtube", followers: 3400, followerChange: 210, posts: 4, engagement: 5.3, engagementChange: 0.5, reach: 78000, mentions: 12 },
  { platform: "zalo", followers: 22000, followerChange: 890, posts: 30, engagement: 3.8, engagementChange: 0.1, reach: 156000, mentions: 34 },
];

const TRENDING_TOPICS = [
  { topic: "#AI_CRM", mentions: 156, sentiment: 78, trend: "up" as const },
  { topic: "#CRM_Vietnam", mentions: 89, sentiment: 65, trend: "up" as const },
  { topic: "#SalesAI", mentions: 67, sentiment: 82, trend: "up" as const },
  { topic: "AI-CRM review", mentions: 45, sentiment: 72, trend: "stable" as const },
  { topic: "AI-CRM vs HubSpot", mentions: 34, sentiment: 58, trend: "up" as const },
  { topic: "AI-CRM API", mentions: 23, sentiment: 42, trend: "down" as const },
];

type Tab = "mentions" | "metrics" | "trending";

/* ============================================================
 * Create Monitoring Alert Modal
 * ============================================================ */
function CreateAlertModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [keyword, setKeyword] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>(["facebook", "linkedin", "twitter"]);
  const [alertType, setAlertType] = useState<"mention" | "sentiment-drop" | "spike">("mention");
  const [saving, setSaving] = useState(false);

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  };

  const handleSave = () => {
    if (!keyword.trim()) { toast.error("Vui lòng nhập từ khóa theo dõi"); return; }
    if (platforms.length === 0) { toast.error("Vui lòng chọn ít nhất 1 nền tảng"); return; }
    setSaving(true);
    onCreated();
    toast.success(`Đã tạo alert cho "${keyword}" trên ${platforms.length} nền tảng`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2"><Bell className="w-5 h-5 text-rose-600" /> Tạo Alert Monitoring</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Từ khóa / Hashtag *</label>
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="VD: AI-CRM, #sales_automation, @competitor"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Loại cảnh báo</label>
            <select value={alertType} onChange={(e) => setAlertType(e.target.value as typeof alertType)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
              <option value="mention">🔔 Mỗi khi được mention</option>
              <option value="sentiment-drop">📉 Khi sentiment giảm mạnh</option>
              <option value="spike">📈 Khi mention tăng đột biến</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Nền tảng theo dõi ({platforms.length})</label>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(PLATFORM_CFG).map(([key, cfg]) => {
                const isSelected = platforms.includes(key as Platform);
                return (
                  <button key={key} type="button" onClick={() => togglePlatform(key as Platform)}
                    className={`px-2 py-1.5 rounded-lg border text-xs text-center transition-colors ${isSelected ? `${cfg.bg} ${cfg.color}` : "border-gray-200 text-gray-400 hover:border-gray-300"}`}>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
            <p className="text-[10px] text-rose-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI sẽ tự động phân tích sentiment cho mọi mention mới và gửi thông báo real-time qua email + in-app.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Alert"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function SocialMediaMonitorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("mentions");
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | "all">("all");
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { mode, setMode } = useViewMode("social-monitor", "list");

  const filtered = useMemo(() => {
    let result = MOCK_MENTIONS;
    if (platformFilter !== "all") result = result.filter((m) => m.platform === platformFilter);
    if (sentimentFilter !== "all") result = result.filter((m) => m.sentiment === sentimentFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.content.toLowerCase().includes(q) || m.author.toLowerCase().includes(q));
    }
    return result;
  }, [platformFilter, sentimentFilter, search]);

  const stats = useMemo(() => {
    const positive = MOCK_MENTIONS.filter((m) => m.sentiment === "positive").length;
    const negative = MOCK_MENTIONS.filter((m) => m.sentiment === "negative").length;
    const totalReach = MOCK_MENTIONS.reduce((s, m) => s + m.reach, 0);
    const totalEngagement = MOCK_MENTIONS.reduce((s, m) => s + m.likes + m.comments + m.shares, 0);
    const avgSentiment = (MOCK_MENTIONS.reduce((s, m) => s + m.sentimentScore, 0) / MOCK_MENTIONS.length).toFixed(0);
    return { total: MOCK_MENTIONS.length, positive, negative, totalReach, totalEngagement, avgSentiment: Number(avgSentiment) };
  }, []);

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "mentions", label: "Mentions", icon: AtSign },
    { key: "metrics", label: "Metrics", icon: BarChart3 },
    { key: "trending", label: "Trending", icon: Hash },
  ];

  const columns: ColumnDef<SocialMention>[] = [
    {
      key: "author", header: "Tác giả", sortable: true, minWidth: 160,
      render: (m) => (
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-gray-900">{m.author}</span>
            {m.isInfluencer && <Star className="w-3 h-3 text-amber-500" />}
          </div>
          <p className="text-[10px] text-gray-400">{m.authorHandle}</p>
        </div>
      ),
    },
    {
      key: "platform", header: "Nền tảng", sortable: true, minWidth: 90,
      render: (m) => {
        const pCfg = PLATFORM_CFG[m.platform];
        return <span className={`text-[8px] px-1.5 py-0.5 rounded border ${pCfg.bg} ${pCfg.color}`}>{pCfg.label}</span>;
      },
    },
    {
      key: "sentiment", header: "Sentiment", sortable: true, minWidth: 100, editable: true,
      render: (m) => {
        const sCfg = SENTIMENT_CFG[m.sentiment];
        const SentIcon = sCfg.icon;
        return <span className={`flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded ${sCfg.color}`}><SentIcon className="w-2.5 h-2.5" /> {sCfg.label}</span>;
      },
      renderEdit: (item, _v, onChange, onSave) => (
        <select defaultValue={item.sentiment} onChange={(e) => { onChange(e.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {Object.entries(SENTIMENT_CFG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
        </select>
      ),
    },
    {
      key: "content", header: "Nội dung", minWidth: 220,
      render: (m) => <p className="text-xs text-gray-600 truncate max-w-[220px]">{m.content}</p>,
    },
    {
      key: "reach", header: "Reach", sortable: true, minWidth: 70,
      render: (m) => <span className="text-xs text-gray-500">{(m.reach / 1000).toFixed(1)}K</span>,
      sortValue: (m) => m.reach,
    },
    {
      key: "likes", header: "Likes", sortable: true, minWidth: 60,
      render: (m) => <span className="text-xs text-gray-500">{m.likes.toLocaleString()}</span>,
      sortValue: (m) => m.likes,
    },
    {
      key: "createdAt", header: "Ngày", sortable: true, minWidth: 85,
      render: (m) => <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleDateString("vi-VN")}</span>,
    },
    {
      key: "responded", header: "Phản hồi", sortable: true, minWidth: 70,
      render: (m) => m.responded
        ? <span className="text-[8px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded">Đã PH</span>
        : <span className="text-[8px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded">Chờ</span>,
    },
  ];

  const [mentions, setMentions] = useState(MOCK_MENTIONS);
  const handleMentionInlineEdit = useCallback((rowId: string, field: string, value: unknown) => {
    setMentions((prev) => prev.map((m) => m.id === rowId ? { ...m, [field]: value } : m));
    toast.success("Đã cập nhật mention");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setMentions((prev) => prev.filter((m) => !deleteTarget.ids.includes(m.id)));
    toast.success(`Đã xóa ${deleteTarget.ids.length > 1 ? deleteTarget.ids.length + " mentions" : "\"" + deleteTarget.label + "\""}`);
    setDeleteTarget(null);
    setDeleting(false);
  }, [deleteTarget]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-rose-600" /> Social Media Monitor
          </h1>
          <p className="text-gray-500 mt-0.5">
            Theo dõi thương hiệu trên mạng xã hội — mentions, sentiment, competitors, engagement
          </p>
        </div>
        <button type="button" onClick={() => setShowCreateAlert(true)}
          className="flex items-center gap-1 px-3 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 self-start">
          <Plus className="w-4 h-4" /> Tạo Alert
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Mentions (7d)</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.positive}</p>
          <p className="text-[9px] text-green-700">Tích cực</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-500">{stats.negative}</p>
          <p className="text-[9px] text-red-700">Tiêu cực</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{(stats.totalReach / 1000).toFixed(0)}K</p>
          <p className="text-[9px] text-blue-700">Reach</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.totalEngagement.toLocaleString()}</p>
          <p className="text-[9px] text-violet-700">Engagement</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${stats.avgSentiment >= 50 ? "bg-green-50 border-green-200" : stats.avgSentiment >= 0 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-lg ${stats.avgSentiment >= 50 ? "text-green-600" : stats.avgSentiment >= 0 ? "text-amber-600" : "text-red-600"}`}>{stats.avgSentiment > 0 ? "+" : ""}{stats.avgSentiment}</p>
          <p className="text-[9px] text-gray-500">TB Sentiment</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === t.key ? "bg-rose-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* === Tab: Mentions === */}
      {activeTab === "mentions" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[150px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Tìm mentions..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
            </div>
            <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value as Platform | "all")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">Tất cả nền tảng</option>
              {Object.entries(PLATFORM_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value as Sentiment | "all")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">Tất cả sentiment</option>
              <option value="positive">Tích c���c</option>
              <option value="negative">Tiêu cực</option>
              <option value="neutral">Trung lập</option>
            </select>
            <ViewToggle mode={mode} onSetMode={setMode} modes={["table", "list"]} />
          </div>

          <div className="space-y-3">
            {mode === "list" ? (
              filtered.map((mention) => {
                const pCfg = PLATFORM_CFG[mention.platform];
                const sCfg = SENTIMENT_CFG[mention.sentiment];
                const SentIcon = sCfg.icon;
                return (
                  <div key={mention.id} className={`bg-white rounded-xl border overflow-hidden transition-colors ${
                    !mention.responded && mention.sentiment === "negative" ? "border-red-200" : "border-gray-100 hover:border-rose-200"
                  }`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white ${
                          mention.sentiment === "positive" ? "bg-green-500" : mention.sentiment === "negative" ? "bg-red-400" : "bg-gray-400"
                        }`}>
                          {mention.author.split(" ").pop()?.[0] || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-900">{mention.author}</span>
                            <span className="text-[10px] text-gray-400">{mention.authorHandle}</span>
                            {mention.isInfluencer && <span className="text-[8px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded border border-amber-200">⭐ Influencer</span>}
                            <span className={`text-[8px] px-1.5 py-0.5 rounded border ${pCfg.bg} ${pCfg.color}`}>{pCfg.label}</span>
                          </div>
                          <p className="text-xs text-gray-700 mt-1 leading-relaxed">{mention.content}</p>

                          <div className="flex items-center gap-3 mt-2 text-[9px] text-gray-400 flex-wrap">
                            <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" /> {mention.likes.toLocaleString()}</span>
                            <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" /> {mention.comments}</span>
                            <span className="flex items-center gap-0.5"><Share2 className="w-3 h-3" /> {mention.shares}</span>
                            <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {(mention.reach / 1000).toFixed(1)}K reach</span>
                            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {new Date(mention.createdAt).toLocaleDateString("vi-VN")}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded ${sCfg.color}`}>
                              <SentIcon className="w-2.5 h-2.5" /> {sCfg.label} ({mention.sentimentScore > 0 ? "+" : ""}{mention.sentimentScore})
                            </span>
                            {mention.responded && <span className="text-[8px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded">✓ Đã phản hồi</span>}
                            {!mention.responded && <span className="text-[8px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded">⏳ Chờ phản hồi</span>}
                            {mention.tags.map((t) => (
                              <span key={t} className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 border-t border-gray-100">
                      {!mention.responded && (
                        <button type="button" onClick={() => toast.success("Mở composer phản hồi")}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-violet-600 hover:bg-violet-50 rounded-lg">
                          <MessageCircle className="w-3 h-3" /> Phản hồi
                        </button>
                      )}
                      <button type="button" onClick={() => toast.success("Đã tạo task follow-up")}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-white rounded-lg">
                        <Zap className="w-3 h-3" /> Tạo Task
                      </button>
                      {mention.isInfluencer && (
                        <button type="button" onClick={() => toast.success("Đã thêm vào CRM contacts")}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Users className="w-3 h-3" /> Thêm Contact
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <DataTable columns={columns} data={filtered} storageKey="social-mentions"
                selectable
                onInlineEdit={handleMentionInlineEdit}
                onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} mentions được chọn` })}
                renderRowActions={(item) => (
                  <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.author })} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              />
            )}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <AtSign className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Không tìm thấy mention nào</p>
            </div>
          )}
        </div>
      )}

      {/* === Tab: Metrics === */}
      {activeTab === "metrics" && (
        <div className="space-y-3">
          {MOCK_METRICS.map((m) => {
            const pCfg = PLATFORM_CFG[m.platform];
            return (
              <div key={m.platform} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[8px] px-2 py-1 rounded border ${pCfg.bg} ${pCfg.color}`}>{pCfg.label}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                  <div>
                    <p className="text-sm text-gray-900">{(m.followers / 1000).toFixed(1)}K</p>
                    <p className="text-[8px] text-gray-400">Followers</p>
                    <p className={`text-[8px] flex items-center justify-center gap-0.5 ${m.followerChange > 0 ? "text-green-500" : "text-red-500"}`}>
                      {m.followerChange > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                      {m.followerChange > 0 ? "+" : ""}{m.followerChange}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{m.posts}</p>
                    <p className="text-[8px] text-gray-400">Posts (30d)</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">{m.engagement}%</p>
                    <p className="text-[8px] text-gray-400">Engagement</p>
                    <p className={`text-[8px] flex items-center justify-center gap-0.5 ${m.engagementChange > 0 ? "text-green-500" : "text-red-500"}`}>
                      {m.engagementChange > 0 ? "+" : ""}{m.engagementChange}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-violet-600">{(m.reach / 1000).toFixed(0)}K</p>
                    <p className="text-[8px] text-gray-400">Reach</p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-600">{m.mentions}</p>
                    <p className="text-[8px] text-gray-400">Mentions</p>
                  </div>
                  <div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${m.engagement * 10}%` }} />
                    </div>
                    <p className="text-[8px] text-gray-400 mt-1">Engagement bar</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Tab: Trending === */}
      {activeTab === "trending" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm text-gray-900 mb-3">Trending Topics (7 ngày)</h4>
            <div className="space-y-2">
              {TRENDING_TOPICS.map((t, i) => (
                <div key={t.topic} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-b-0">
                  <span className="text-[9px] text-gray-400 w-4">{i + 1}.</span>
                  <span className="text-sm text-gray-900 flex-1">{t.topic}</span>
                  <span className="text-xs text-gray-500">{t.mentions} mentions</span>
                  <div className="w-12">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${t.sentiment >= 60 ? "bg-green-400" : t.sentiment >= 40 ? "bg-amber-400" : "bg-red-400"}`}
                        style={{ width: `${t.sentiment}%` }} />
                    </div>
                    <p className="text-[7px] text-gray-400 text-center mt-0.5">{t.sentiment}% +</p>
                  </div>
                  {t.trend === "up" && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                  {t.trend === "down" && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                  {t.trend === "stable" && <Minus className="w-4 h-4 text-gray-400" />}
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Mentions */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm text-gray-900 mb-3">So sánh Mentions vs Đối thủ</h4>
            <div className="space-y-2">
              {[
                { name: "AI-CRM", mentions: 199, sentiment: 68, color: "bg-violet-400" },
                { name: "HubSpot", mentions: 1240, sentiment: 72, color: "bg-orange-400" },
                { name: "Salesforce", mentions: 3450, sentiment: 65, color: "bg-blue-400" },
                { name: "Zoho CRM", mentions: 560, sentiment: 58, color: "bg-green-400" },
                { name: "Freshsales", mentions: 320, sentiment: 61, color: "bg-teal-400" },
              ].map((c) => {
                const maxMentions = 3450;
                return (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-700 w-20">{c.name}</span>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${c.color} rounded-full`} style={{ width: `${(c.mentions / maxMentions) * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">{c.mentions}</span>
                    <span className={`text-[8px] w-10 text-right ${c.sentiment >= 65 ? "text-green-500" : "text-amber-500"}`}>{c.sentiment}%+</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-rose-600" />
          <h4 className="text-sm text-rose-900">AI Social Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-rose-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Video TikTok <strong>@salescoachvn</strong> đạt <strong>45K reach</strong> — influencer này nên được nurture. Đề xuất mời làm case study hoặc webinar speaker.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>2 mentions tiêu cực chưa phản hồi</strong> — "API rate limit" và "SAP webhook". Đề xuất reply trong 2h để giữ sentiment score. Template reply có sẵn.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Sentiment chung <strong>+39 (Tích cực)</strong>. Keyword hot nhất: <strong>"AI-first"</strong>, <strong>"Sales Coach"</strong>. Nên tăng content về AI capabilities.</span>
          </p>
        </div>
      </div>
      {showCreateAlert && <CreateAlertModal onClose={() => setShowCreateAlert(false)} onCreated={() => {}} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.label ?? ""}
        entityType="mention"
        description="Thao tác này không thể hoàn tác."
        loading={deleting}
      />
    </div>
  );
}