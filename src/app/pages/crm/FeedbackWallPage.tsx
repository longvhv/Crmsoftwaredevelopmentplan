/**
 * Customer Feedback Wall — Bảng Phản hồi Khách hàng
 * ProductBoard-style feedback board, voting, prioritization,
 * sentiment analysis, feature requests, bug reports.
 */
import { useState, useMemo } from "react";
import {
  MessageSquarePlus,
  ThumbsUp,
  ThumbsDown,
  Search,
  Plus,
  Filter,
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bug,
  Lightbulb,
  Star,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Eye,
  ChevronUp,
  Flame,
  Target,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type FeedbackType = "feature-request" | "bug-report" | "improvement" | "praise" | "question";
type FeedbackStatus = "new" | "under-review" | "planned" | "in-progress" | "completed" | "declined";
type Priority = "critical" | "high" | "medium" | "low";
type Sentiment = "positive" | "neutral" | "negative";

interface Feedback {
  id: string;
  title: string;
  description: string;
  type: FeedbackType;
  status: FeedbackStatus;
  priority: Priority;
  sentiment: Sentiment;
  votes: number;
  hasVoted: boolean;
  comments: number;
  author: string;
  company: string;
  createdAt: string;
  tags: string[];
  aiSummary: string;
  impactScore: number;
}

/* ============================================================
 * Constants
 * ============================================================ */
const TYPE_CFG: Record<FeedbackType, { label: string; icon: typeof Lightbulb; color: string; bg: string }> = {
  "feature-request": { label: "Tính năng", icon: Lightbulb, color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
  "bug-report": { label: "Lỗi", icon: Bug, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  improvement: { label: "Cải thiện", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  praise: { label: "Khen ngợi", icon: Star, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  question: { label: "Câu hỏi", icon: MessageCircle, color: "text-cyan-600", bg: "bg-cyan-50 border-cyan-200" },
};

const STATUS_CFG: Record<FeedbackStatus, { label: string; color: string; bg: string }> = {
  new: { label: "Mới", color: "text-gray-600", bg: "bg-gray-100 border-gray-300" },
  "under-review": { label: "Đang xem", color: "text-amber-600", bg: "bg-amber-100 border-amber-300" },
  planned: { label: "Đã lên kế hoạch", color: "text-blue-600", bg: "bg-blue-100 border-blue-300" },
  "in-progress": { label: "Đang xây", color: "text-violet-600", bg: "bg-violet-100 border-violet-300" },
  completed: { label: "Hoàn thành", color: "text-green-600", bg: "bg-green-100 border-green-300" },
  declined: { label: "Từ chối", color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
};

const PRIORITY_CFG: Record<Priority, { label: string; color: string }> = {
  critical: { label: "Nghiêm trọng", color: "text-red-600" },
  high: { label: "Cao", color: "text-orange-600" },
  medium: { label: "Trung bình", color: "text-blue-600" },
  low: { label: "Thấp", color: "text-gray-500" },
};

const SENTIMENT_CFG: Record<Sentiment, { icon: typeof ThumbsUp; color: string }> = {
  positive: { icon: ThumbsUp, color: "text-green-500" },
  neutral: { icon: MessageCircle, color: "text-gray-400" },
  negative: { icon: ThumbsDown, color: "text-red-500" },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_FEEDBACK: Feedback[] = [
  {
    id: "fb_001", title: "Tích hợp Zalo OA cho giao tiếp khách hàng Việt Nam",
    description: "Khách hàng Việt Nam chủ yếu dùng Zalo. Cần tích hợp Zalo Official Account để gửi tin nhắn, chatbot, và notification trực tiếp từ CRM.",
    type: "feature-request", status: "planned", priority: "high", sentiment: "neutral",
    votes: 87, hasVoted: false, comments: 23, author: "Nguyễn Minh Tâm", company: "TechViet Solutions",
    createdAt: "2026-01-15", tags: ["Zalo", "Messaging", "Vietnam", "Integration"],
    aiSummary: "Top-voted request. 67% khách VN muốn Zalo. Ước tính tăng 15% engagement.", impactScore: 92,
  },
  {
    id: "fb_002", title: "Báo cáo tùy chỉnh bị chậm khi có hơn 10K records",
    description: "Khi tạo custom report với filter phức tạp trên dataset >10K records, thời gian load vượt 30 giây. Cần tối ưu query performance.",
    type: "bug-report", status: "in-progress", priority: "critical", sentiment: "negative",
    votes: 64, hasVoted: true, comments: 18, author: "Trần Đức Minh", company: "DataPro Corp",
    createdAt: "2026-02-05", tags: ["Performance", "Reports", "Database"],
    aiSummary: "Critical performance issue. Ảnh hưởng 23% enterprise users. Team đang optimize indexing.", impactScore: 95,
  },
  {
    id: "fb_003", title: "AI Agent tự động tạo meeting summary quá xuất sắc!",
    description: "Tính năng AI tự động tóm tắt cuộc họp và tạo action items hoạt động rất tốt. Team sales tiết kiệm 2 giờ/ngày. Mong team phát triển thêm!",
    type: "praise", status: "completed", priority: "low", sentiment: "positive",
    votes: 45, hasVoted: false, comments: 12, author: "Phạm Thuỳ Linh", company: "CloudFirst VN",
    createdAt: "2026-02-20", tags: ["AI", "Meeting", "Praise"],
    aiSummary: "High NPS impact. Users love this feature. Should be highlighted in marketing.", impactScore: 78,
  },
  {
    id: "fb_004", title: "Thêm Kanban view cho task management",
    description: "Hiện task list chỉ có list view. Cần thêm Kanban board giống Trello để sales team dễ quản lý công việc hàng ngày.",
    type: "feature-request", status: "completed", priority: "medium", sentiment: "neutral",
    votes: 72, hasVoted: true, comments: 15, author: "Lê Hoàng Nam", company: "AgileVN Co.",
    createdAt: "2025-12-10", tags: ["UI/UX", "Task", "Kanban"],
    aiSummary: "Already shipped in v2.3. High satisfaction. Template feature cũng được request.", impactScore: 85,
  },
  {
    id: "fb_005", title: "Custom field cho Deal không hỗ trợ formula",
    description: "Custom field hiện chỉ có text, number, date. Cần thêm formula field (tương tự Airtable) để tính ROI, margin tự động.",
    type: "improvement", status: "under-review", priority: "high", sentiment: "neutral",
    votes: 58, hasVoted: false, comments: 9, author: "Vũ Quang Huy", company: "FinancePlus",
    createdAt: "2026-02-12", tags: ["Custom Fields", "Formula", "Deal"],
    aiSummary: "21 companies yêu cầu tương tự. Formula engine cần ~3 sprints. High business value.", impactScore: 88,
  },
  {
    id: "fb_006", title: "Mobile app không sync offline data khi mất mạng",
    description: "Khi sales đi gặp khách ở vùng mất mạng, data nhập trên mobile bị mất khi reconnect. Cần offline-first architecture.",
    type: "bug-report", status: "planned", priority: "high", sentiment: "negative",
    votes: 51, hasVoted: false, comments: 14, author: "Đỗ Thanh Hương", company: "FieldSales Pro",
    createdAt: "2026-01-28", tags: ["Mobile", "Offline", "Sync"],
    aiSummary: "Affects field sales teams. Data loss = trust issue. Offline sync planned for Phase 14.", impactScore: 90,
  },
  {
    id: "fb_007", title: "Dashboard widget cho pipeline velocity metrics",
    description: "Cần widget hiển thị pipeline velocity: avg days in each stage, conversion rates giữa stages, bottleneck detection.",
    type: "feature-request", status: "new", priority: "medium", sentiment: "neutral",
    votes: 34, hasVoted: false, comments: 6, author: "Hoàng Minh Đức", company: "SalesForce VN",
    createdAt: "2026-02-28", tags: ["Dashboard", "Pipeline", "Velocity"],
    aiSummary: "Nice-to-have. Can leverage existing pipeline data. ~1 sprint effort.", impactScore: 65,
  },
  {
    id: "fb_008", title: "API rate limit quá thấp cho enterprise integration",
    description: "Rate limit 100 req/min quá thấp cho ERP sync hàng ngày (50K+ records). Enterprise tier cần ít nhất 1000 req/min.",
    type: "improvement", status: "under-review", priority: "high", sentiment: "negative",
    votes: 42, hasVoted: true, comments: 11, author: "Nguyễn Văn Bình", company: "Enterprise Solutions Inc.",
    createdAt: "2026-02-18", tags: ["API", "Rate Limit", "Enterprise"],
    aiSummary: "Revenue risk: 3 enterprise clients threatening to churn. Quick fix: tiered rate limits.", impactScore: 93,
  },
  {
    id: "fb_009", title: "Tích hợp với hệ thống kế toán MISA",
    description: "Phần mềm kế toán MISA rất phổ biến tại Việt Nam. Cần sync invoice, payment, customer data 2 chiều.",
    type: "feature-request", status: "new", priority: "medium", sentiment: "neutral",
    votes: 39, hasVoted: false, comments: 7, author: "Trịnh Thị Hoa", company: "AccountingPro",
    createdAt: "2026-03-01", tags: ["MISA", "Accounting", "Vietnam", "Integration"],
    aiSummary: "MISA chiếm 40% thị phần kế toán VN. High potential. Cần MISA API partnership.", impactScore: 82,
  },
  {
    id: "fb_010", title: "Dark mode cho giao diện CRM",
    description: "Team dev/sales thường làm việc khuya. Dark mode sẽ giúp giảm mỏi mắt và tiết kiệm pin laptop.",
    type: "feature-request", status: "new", priority: "low", sentiment: "positive",
    votes: 28, hasVoted: false, comments: 4, author: "Phan Quốc Khánh", company: "NightOwl Studio",
    createdAt: "2026-02-22", tags: ["UI/UX", "Dark Mode", "Accessibility"],
    aiSummary: "Nice-to-have. 18% users requested. Low effort with Tailwind dark: classes.", impactScore: 45,
  },
];

type ViewMode = "board" | "list";
type SortBy = "votes" | "impact" | "newest" | "comments";

/* ============================================================
 * Create Feedback Modal
 * ============================================================ */
function CreateFeedbackModal({ onClose, onCreated }: { onClose: () => void; onCreated: (fb: Feedback) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<FeedbackType>("feature-request");
  const [priority, setPriority] = useState<Priority>("medium");
  const [author, setAuthor] = useState("");
  const [company, setCompany] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề phản hồi"); return; }
    setSaving(true);
    const newFb: Feedback = {
      id: `fb_${Date.now()}`, title, description: description || title,
      type, status: "new", priority,
      sentiment: "neutral", votes: 0, hasVoted: false, comments: 0,
      author: author || "Ẩn danh", company: company || "Không rõ",
      createdAt: new Date().toISOString().slice(0, 10),
      tags: [], aiSummary: "Phản hồi mới — AI sẽ phân tích sau.",
      impactScore: Math.floor(Math.random() * 40 + 30),
    };
    onCreated(newFb);
    toast.success(`Đã gửi phản hồi "${title}"`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Gửi Phản hồi mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Tích hợp Zalo OA..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả chi tiết</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Mô tả yêu cầu / vấn đề..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại</label>
              <select value={type} onChange={(e) => setType(e.target.value as FeedbackType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                {Object.entries(TYPE_CFG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mức ưu tiên</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                {Object.entries(PRIORITY_CFG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Người gửi</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Tên người gửi"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Công ty</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Tên công ty"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 disabled:opacity-50">
            {saving ? "Đang gửi..." : "Gửi phản hồi"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function FeedbackWallPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [typeFilter, setTypeFilter] = useState<FeedbackType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("votes");
  const [search, setSearch] = useState("");
  const [feedbackData, setFeedbackData] = useState(MOCK_FEEDBACK);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateFeedback = (fb: Feedback) => {
    setFeedbackData((prev) => [fb, ...prev]);
  };

  const handleVote = (id: string) => {
    setFeedbackData((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, votes: f.hasVoted ? f.votes - 1 : f.votes + 1, hasVoted: !f.hasVoted } : f
      )
    );
    toast.success("Đã cập nhật vote!");
  };

  const filtered = useMemo(() => {
    let result = feedbackData;
    if (typeFilter !== "all") result = result.filter((f) => f.type === typeFilter);
    if (statusFilter !== "all") result = result.filter((f) => f.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((f) => f.title.toLowerCase().includes(q) || f.tags.some((t) => t.toLowerCase().includes(q)));
    }
    result = [...result].sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      if (sortBy === "impact") return b.impactScore - a.impactScore;
      if (sortBy === "comments") return b.comments - a.comments;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [feedbackData, typeFilter, statusFilter, sortBy, search]);

  const stats = useMemo(() => ({
    total: feedbackData.length,
    totalVotes: feedbackData.reduce((s, f) => s + f.votes, 0),
    pending: feedbackData.filter((f) => f.status === "new" || f.status === "under-review").length,
    positive: feedbackData.filter((f) => f.sentiment === "positive").length,
    negative: feedbackData.filter((f) => f.sentiment === "negative").length,
  }), [feedbackData]);

  // Board groups by status
  const boardGroups = useMemo(() => {
    const statuses: FeedbackStatus[] = ["new", "under-review", "planned", "in-progress", "completed"];
    return statuses.map((s) => ({ status: s, items: filtered.filter((f) => f.status === s) }));
  }, [filtered]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <MessageSquarePlus className="w-6 h-6 text-rose-600" /> Customer Feedback Wall
          </h1>
          <p className="text-gray-500 mt-0.5">Bảng phản hồi khách hàng — voting, prioritization, AI sentiment analysis</p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 self-start">
          <Plus className="w-4 h-4" /> Gửi Phản hồi
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Phản hồi</p>
        </div>
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-2.5 text-center">
          <p className="text-lg text-rose-600">{stats.totalVotes}</p>
          <p className="text-[9px] text-rose-700">Tổng Votes</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.pending}</p>
          <p className="text-[9px] text-amber-700">Chờ xử lý</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.positive}</p>
          <p className="text-[9px] text-green-700">Tích cực</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{stats.negative}</p>
          <p className="text-[9px] text-red-700">Tiêu cực</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[140px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm feedback..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setViewMode("board")}
            className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === "board" ? "bg-rose-600 text-white" : "bg-white border border-gray-200 text-gray-500"}`}>
            Board
          </button>
          <button type="button" onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === "list" ? "bg-rose-600 text-white" : "bg-white border border-gray-200 text-gray-500"}`}>
            List
          </button>
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as FeedbackType | "all")}
          className="px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả loại</option>
          {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="votes">Nhiều votes nhất</option>
          <option value="impact">Impact Score</option>
          <option value="newest">Mới nhất</option>
          <option value="comments">Nhiều bình luận</option>
        </select>
      </div>

      {/* === Board View === */}
      {viewMode === "board" && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 overflow-x-auto">
          {boardGroups.map((group) => {
            const cfg = STATUS_CFG[group.status];
            return (
              <div key={group.status} className="bg-gray-50 rounded-xl p-2 min-h-[200px] min-w-[160px]">
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-[8px] text-gray-400 ml-auto">{group.items.length}</span>
                </div>
                <div className="space-y-1.5">
                  {group.items.map((fb) => {
                    const tCfg = TYPE_CFG[fb.type];
                    const TIcon = tCfg.icon;
                    const sCfg = SENTIMENT_CFG[fb.sentiment];
                    const SIcon = sCfg.icon;
                    return (
                      <div key={fb.id} className={`p-2.5 bg-white rounded-lg border cursor-pointer hover:shadow-sm transition ${
                        fb.priority === "critical" ? "border-red-200" : "border-gray-200"
                      }`}>
                        <div className="flex items-start gap-1.5 mb-1">
                          <TIcon className={`w-3 h-3 ${tCfg.color} mt-0.5 flex-shrink-0`} />
                          <span className="text-[9px] text-gray-800 line-clamp-2">{fb.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className={`text-[7px] px-1 py-0.5 rounded border ${tCfg.bg} ${tCfg.color}`}>{tCfg.label}</span>
                          <SIcon className={`w-2.5 h-2.5 ${sCfg.color}`} />
                        </div>
                        <div className="flex items-center justify-between">
                          <button type="button" onClick={() => handleVote(fb.id)}
                            className={`flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded ${
                              fb.hasVoted ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-500 hover:bg-rose-50"
                            }`}>
                            <ChevronUp className="w-2.5 h-2.5" /> {fb.votes}
                          </button>
                          <span className="text-[7px] text-gray-400 flex items-center gap-0.5">
                            <MessageCircle className="w-2 h-2" /> {fb.comments}
                          </span>
                          {fb.impactScore >= 85 && <Flame className="w-2.5 h-2.5 text-orange-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === List View === */}
      {viewMode === "list" && (
        <div className="space-y-2">
          {filtered.map((fb) => {
            const tCfg = TYPE_CFG[fb.type];
            const TIcon = tCfg.icon;
            const stCfg = STATUS_CFG[fb.status];
            const sCfg = SENTIMENT_CFG[fb.sentiment];
            const SIcon = sCfg.icon;
            const pCfg = PRIORITY_CFG[fb.priority];

            return (
              <div key={fb.id} className={`bg-white rounded-xl border p-4 ${
                fb.priority === "critical" ? "border-red-200" : "border-gray-100"
              }`}>
                <div className="flex items-start gap-3">
                  {/* Vote button */}
                  <button type="button" onClick={() => handleVote(fb.id)}
                    className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border flex-shrink-0 ${
                      fb.hasVoted ? "bg-rose-50 border-rose-300 text-rose-600" : "bg-gray-50 border-gray-200 text-gray-400 hover:border-rose-300"
                    }`}>
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-xs">{fb.votes}</span>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <TIcon className={`w-4 h-4 ${tCfg.color} flex-shrink-0`} />
                      <span className="text-sm text-gray-900">{fb.title}</span>
                      {fb.impactScore >= 85 && <Flame className="w-3.5 h-3.5 text-orange-500" />}
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className={`text-[7px] px-1.5 py-0.5 rounded border ${tCfg.bg} ${tCfg.color}`}>{tCfg.label}</span>
                      <span className={`text-[7px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                      <span className={`text-[7px] ${pCfg.color}`}>● {pCfg.label}</span>
                      <SIcon className={`w-3 h-3 ${sCfg.color}`} />
                      {fb.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[7px] px-1 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
                      ))}
                    </div>

                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{fb.description}</p>

                    {/* AI Summary */}
                    <div className="mt-2 p-2 bg-violet-50 rounded-lg border border-violet-200">
                      <p className="text-[9px] text-violet-700 flex items-start gap-1">
                        <Bot className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span><strong>AI:</strong> {fb.aiSummary}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-[8px] text-gray-400">
                      <span>{fb.author} • {fb.company}</span>
                      <span>{fb.createdAt}</span>
                      <span className="flex items-center gap-0.5">
                        <MessageCircle className="w-2.5 h-2.5" /> {fb.comments} bình luận
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Target className="w-2.5 h-2.5" /> Impact: {fb.impactScore}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-rose-600" />
          <h4 className="text-sm text-rose-900">AI Feedback Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-rose-800">
          <p className="flex items-start gap-2">
            <Flame className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <span>Top trend: <strong>Zalo integration</strong> (87 votes, Impact 92). Ước tính mở rộng thị trường VN thêm <strong>15%</strong>. Kết hợp với MISA request (39 votes) sẽ cover <strong>80% nhu cầu localization</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>3 critical items</strong> chưa resolve: Report performance, API rate limit, Offline sync. Tổng impact score: <strong>278</strong>. AI đề xuất ưu tiên API rate limit vì <strong>3 enterprise clients</strong> đang churn risk.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Sentiment analysis: <strong>60% neutral, 20% positive, 20% negative</strong>. Negative feedback tập trung vào performance và data sync. AI phát hiện pattern: <strong>enterprise users</strong> chiếm 85% negative feedback.</span>
          </p>
        </div>
      </div>
      {showCreateModal && <CreateFeedbackModal onClose={() => setShowCreateModal(false)} onCreated={handleCreateFeedback} />}
    </div>
  );
}