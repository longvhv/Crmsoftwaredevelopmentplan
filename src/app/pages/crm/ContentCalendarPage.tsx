/**
 * Content Calendar — Lịch Nội dung Marketing
 * Calendar view, content pipeline, status workflow,
 * multi-channel scheduling, AI suggestions, analytics.
 */
import { useState, useMemo } from "react";
import {
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  Video,
  Image,
  Mail,
  Rss,
  Mic2,
  Search,
  Filter,
  Download,
  Sparkles,
  Bot,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  Send,
  PenLine,
  Eye,
  Zap,
  BarChart3,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type ContentStatus = "idea" | "drafting" | "review" | "scheduled" | "published" | "archived";
type ContentType = "blog" | "video" | "email" | "social" | "podcast" | "infographic";
type Channel = "Website" | "LinkedIn" | "Facebook" | "Email" | "YouTube" | "Podcast" | "Instagram";

interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  channels: Channel[];
  author: string;
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  tags: string[];
  engagement?: number;
  aiScore?: number;
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<ContentStatus, { label: string; color: string; bg: string }> = {
  idea: { label: "Ý tưởng", color: "text-gray-500", bg: "bg-gray-100 border-gray-300" },
  drafting: { label: "Đang viết", color: "text-blue-600", bg: "bg-blue-100 border-blue-300" },
  review: { label: "Duyệt", color: "text-amber-600", bg: "bg-amber-100 border-amber-300" },
  scheduled: { label: "Lên lịch", color: "text-violet-600", bg: "bg-violet-100 border-violet-300" },
  published: { label: "Đã xuất bản", color: "text-green-600", bg: "bg-green-100 border-green-300" },
  archived: { label: "Lưu trữ", color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
};

const TYPE_CFG: Record<ContentType, { label: string; icon: typeof FileText; color: string }> = {
  blog: { label: "Blog", icon: FileText, color: "text-blue-600" },
  video: { label: "Video", icon: Video, color: "text-red-600" },
  email: { label: "Email", icon: Mail, color: "text-violet-600" },
  social: { label: "Social", icon: Rss, color: "text-cyan-600" },
  podcast: { label: "Podcast", icon: Mic2, color: "text-amber-600" },
  infographic: { label: "Infographic", icon: Image, color: "text-emerald-600" },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_CONTENT: ContentItem[] = [
  { id: "ct_001", title: "AI-CRM: 5 tính năng thay đổi cách bạn bán hàng", type: "blog", status: "published", channels: ["Website", "LinkedIn"], author: "Nguyễn Thuỳ Linh", scheduledDate: "2026-03-01", scheduledTime: "08:00", description: "Blog deep-dive về top 5 tính năng AI mới nhất", tags: ["AI", "Sales", "Feature Launch"], engagement: 2450, aiScore: 92 },
  { id: "ct_002", title: "Demo: Predictive Lead Scoring trong thực tế", type: "video", status: "published", channels: ["YouTube", "LinkedIn", "Website"], author: "Trần Đức Anh", scheduledDate: "2026-03-02", scheduledTime: "10:00", description: "Video demo 8 phút về predictive scoring", tags: ["Demo", "AI", "Lead Scoring"], engagement: 1870, aiScore: 88 },
  { id: "ct_003", title: "Newsletter tuần 10: Update sản phẩm & industry insights", type: "email", status: "scheduled", channels: ["Email"], author: "Phạm Thuỳ Linh", scheduledDate: "2026-03-05", scheduledTime: "07:30", description: "Newsletter hàng tuần cho 15K subscribers", tags: ["Newsletter", "Weekly"], aiScore: 85 },
  { id: "ct_004", title: "Infographic: Customer Journey Map 2026", type: "infographic", status: "scheduled", channels: ["LinkedIn", "Instagram", "Website"], author: "Lê Minh Tuấn", scheduledDate: "2026-03-06", scheduledTime: "12:00", description: "Infographic visual journey map cho enterprise customers", tags: ["Journey", "Visual", "Enterprise"], aiScore: 79 },
  { id: "ct_005", title: "Case Study: Cách Công ty XYZ tăng 200% conversion", type: "blog", status: "review", channels: ["Website", "Email", "LinkedIn"], author: "Nguyễn Thuỳ Linh", scheduledDate: "2026-03-08", scheduledTime: "09:00", description: "Case study chi tiết với data thực tế", tags: ["Case Study", "Conversion", "Enterprise"], aiScore: 94 },
  { id: "ct_006", title: "Podcast #15: Phỏng vấn CTO về AI-first CRM", type: "podcast", status: "drafting", channels: ["Podcast", "YouTube"], author: "Trần Đức Anh", scheduledDate: "2026-03-10", scheduledTime: "14:00", description: "Episode 45 phút phỏng vấn chuyên sâu", tags: ["Podcast", "Interview", "AI"], aiScore: 82 },
  { id: "ct_007", title: "Social Series: Tips Sales AI hàng ngày (tuần 3)", type: "social", status: "drafting", channels: ["LinkedIn", "Facebook", "Instagram"], author: "Lê Minh Tuấn", scheduledDate: "2026-03-07", scheduledTime: "11:00", description: "5 posts tip ngắn cho sales team dùng AI", tags: ["Social", "Tips", "Daily"], aiScore: 76 },
  { id: "ct_008", title: "Webinar: ROI Calculator Workshop", type: "video", status: "idea", channels: ["YouTube", "LinkedIn"], author: "Phạm Thuỳ Linh", scheduledDate: "2026-03-15", scheduledTime: "15:00", description: "Workshop live 60 phút hướng dẫn tính ROI", tags: ["Webinar", "ROI", "Workshop"], aiScore: 90 },
  { id: "ct_009", title: "Email drip: Onboarding sequence mới", type: "email", status: "idea", channels: ["Email"], author: "Nguyễn Thuỳ Linh", scheduledDate: "2026-03-12", scheduledTime: "08:00", description: "7-email drip sequence cho new signups", tags: ["Email", "Onboarding", "Automation"], aiScore: 87 },
  { id: "ct_010", title: "Blog: So sánh CRM 2026 — Top 10 giải pháp", type: "blog", status: "idea", channels: ["Website", "LinkedIn"], author: "Trần Đức Anh", scheduledDate: "2026-03-18", scheduledTime: "09:00", description: "Bài so sánh chi tiết 10 CRM hàng đầu", tags: ["Comparison", "SEO", "Industry"], aiScore: 91 },
];

type ViewMode = "calendar" | "pipeline" | "list";

/* ============================================================
 * Helpers
 * ============================================================ */
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfWeek = (year: number, month: number) => new Date(year, month, 1).getDay();
const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTH_NAMES = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

/* ============================================================
 * Content Card (compact)
 * ============================================================ */
function ContentCard({ item, compact = false }: { item: ContentItem; compact?: boolean }) {
  const typeCfg = TYPE_CFG[item.type];
  const stCfg = STATUS_CFG[item.status];
  const TypeIcon = typeCfg.icon;

  return (
    <div className={`p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${
      item.status === "published" ? "bg-green-50 border-green-200" :
      item.status === "scheduled" ? "bg-violet-50 border-violet-200" :
      "bg-white border-gray-200"
    }`}>
      <div className="flex items-center gap-1.5 mb-1">
        <TypeIcon className={`w-3 h-3 ${typeCfg.color} flex-shrink-0`} />
        <span className="text-[9px] text-gray-800 truncate flex-1">{item.title}</span>
        {item.aiScore && item.aiScore >= 90 && <Sparkles className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />}
      </div>
      {!compact && (
        <div className="flex items-center gap-1 flex-wrap">
          <span className={`text-[7px] px-1 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
          {item.channels.slice(0, 2).map((ch) => (
            <span key={ch} className="text-[7px] px-1 py-0.5 bg-gray-100 text-gray-500 rounded">{ch}</span>
          ))}
          {item.channels.length > 2 && <span className="text-[7px] text-gray-400">+{item.channels.length - 2}</span>}
          {item.engagement && <span className="text-[7px] text-green-600 ml-auto">{item.engagement.toLocaleString("vi-VN")} views</span>}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Create Content Modal
 * ============================================================ */
function CreateContentModal({ onClose, onCreated }: { onClose: () => void; onCreated: (item: ContentItem) => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ContentType>("blog");
  const [status, setStatus] = useState<ContentStatus>("idea");
  const [author, setAuthor] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề nội dung"); return; }
    if (!scheduledDate) { toast.error("Vui lòng chọn ngày lên lịch"); return; }
    setSaving(true);
    const newItem: ContentItem = {
      id: `ct_${Date.now()}`, title, type, status,
      channels: type === "blog" ? ["Website", "LinkedIn"] : type === "email" ? ["Email"] : type === "social" ? ["LinkedIn", "Facebook"] : ["Website"],
      author: author || "Chưa gán", scheduledDate, scheduledTime,
      description: description || title,
      tags: [], aiScore: Math.floor(Math.random() * 30 + 60),
    };
    onCreated(newItem);
    toast.success(`Đã tạo nội dung "${title}"`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Nội dung mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Blog: 5 tính năng AI mới nhất"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại nội dung</label>
              <select value={type} onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                {Object.entries(TYPE_CFG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                {Object.entries(STATUS_CFG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tác giả</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Tên tác giả"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày lên lịch *</label>
              <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Giờ</label>
              <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả ngắn về nội dung..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo nội dung"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function ContentCalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [currentMonth, setCurrentMonth] = useState(2); // March = 2 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");
  const [contentData, setContentData] = useState(MOCK_CONTENT);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateContent = (item: ContentItem) => {
    setContentData((prev) => [...prev, item]);
  };

  const filtered = useMemo(() => {
    let result = contentData;
    if (statusFilter !== "all") result = result.filter((c) => c.status === statusFilter);
    if (typeFilter !== "all") result = result.filter((c) => c.type === typeFilter);
    return result;
  }, [contentData, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: contentData.length,
    published: contentData.filter((c) => c.status === "published").length,
    scheduled: contentData.filter((c) => c.status === "scheduled").length,
    inProgress: contentData.filter((c) => c.status === "drafting" || c.status === "review").length,
    totalEngagement: contentData.reduce((s, c) => s + (c.engagement ?? 0), 0),
  }), [contentData]);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  // Calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentYear, currentMonth]);

  const getContentForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filtered.filter((c) => c.scheduledDate === dateStr);
  };

  // Pipeline groups
  const pipelineGroups: { status: ContentStatus; items: ContentItem[] }[] = useMemo(() => {
    const statuses: ContentStatus[] = ["idea", "drafting", "review", "scheduled", "published"];
    return statuses.map((s) => ({ status: s, items: filtered.filter((c) => c.status === s) }));
  }, [filtered]);

  const views: { key: ViewMode; label: string; icon: typeof CalendarDays }[] = [
    { key: "calendar", label: "Lịch", icon: CalendarDays },
    { key: "pipeline", label: "Pipeline", icon: BarChart3 },
    { key: "list", label: "Danh sách", icon: FileText },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-pink-600" /> Content Calendar
          </h1>
          <p className="text-gray-500 mt-0.5">Lịch nội dung marketing — lập kế hoạch, phân bổ kênh, theo dõi hiệu quả</p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 self-start">
          <Plus className="w-4 h-4" /> Tạo nội dung
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Tổng nội dung</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.published}</p>
          <p className="text-[9px] text-green-700">Đã xuất bản</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.scheduled}</p>
          <p className="text-[9px] text-violet-700">Lên lịch</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.inProgress}</p>
          <p className="text-[9px] text-blue-700">Đang làm</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.totalEngagement.toLocaleString("vi-VN")}</p>
          <p className="text-[9px] text-amber-700">Tổng Engagement</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          {views.map((v) => (
            <button key={v.key} type="button" onClick={() => setViewMode(v.key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                viewMode === v.key ? "bg-pink-600 text-white" : "bg-white border border-gray-200 text-gray-500"
              }`}>
              <v.icon className="w-3.5 h-3.5" /> {v.label}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ContentStatus | "all")}
          className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as ContentType | "all")}
          className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả loại</option>
          {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* === Calendar View === */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <h3 className="text-sm text-gray-900">{MONTH_NAMES[currentMonth]} {currentYear}</h3>
            <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[9px] text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} className="min-h-[60px]" />;
              const dayContent = getContentForDay(day);
              const isToday = day === 3 && currentMonth === 2 && currentYear === 2026;

              return (
                <div key={day} className={`min-h-[60px] p-1 rounded-lg border text-left ${
                  isToday ? "border-pink-300 bg-pink-50" : "border-gray-100 bg-gray-50/50"
                }`}>
                  <span className={`text-[9px] ${isToday ? "text-pink-600" : "text-gray-500"}`}>{day}</span>
                  <div className="mt-0.5 space-y-0.5">
                    {dayContent.slice(0, 2).map((c) => (
                      <ContentCard key={c.id} item={c} compact />
                    ))}
                    {dayContent.length > 2 && (
                      <span className="text-[7px] text-gray-400">+{dayContent.length - 2} nội dung</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === Pipeline View === */}
      {viewMode === "pipeline" && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {pipelineGroups.map((group) => {
            const cfg = STATUS_CFG[group.status];
            return (
              <div key={group.status} className="bg-gray-50 rounded-xl p-2 min-h-[200px]">
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-[9px] text-gray-400 ml-auto">{group.items.length}</span>
                </div>
                <div className="space-y-1.5">
                  {group.items.map((item) => <ContentCard key={item.id} item={item} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === List View === */}
      {viewMode === "list" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-2.5 px-3">Nội dung</th>
                  <th className="text-left py-2.5 px-2">Loại</th>
                  <th className="text-left py-2.5 px-2">Trạng thái</th>
                  <th className="text-left py-2.5 px-2">Kênh</th>
                  <th className="text-left py-2.5 px-2">Ngày</th>
                  <th className="text-left py-2.5 px-2">Tác giả</th>
                  <th className="text-right py-2.5 px-2">AI Score</th>
                  <th className="text-right py-2.5 px-3">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const typeCfg = TYPE_CFG[item.type];
                  const stCfg = STATUS_CFG[item.status];
                  const TypeIcon = typeCfg.icon;
                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-800">
                        <div className="flex items-center gap-1.5">
                          <TypeIcon className={`w-3.5 h-3.5 ${typeCfg.color} flex-shrink-0`} />
                          <span className="truncate max-w-[180px]">{item.title}</span>
                        </div>
                      </td>
                      <td className={`py-2 px-2 ${typeCfg.color}`}>{typeCfg.label}</td>
                      <td className="py-2 px-2">
                        <span className={`text-[7px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                      </td>
                      <td className="py-2 px-2 text-gray-500">{item.channels.join(", ")}</td>
                      <td className="py-2 px-2 text-gray-500 whitespace-nowrap">{item.scheduledDate.replace("2026-", "")} {item.scheduledTime}</td>
                      <td className="py-2 px-2 text-gray-500">{item.author}</td>
                      <td className="py-2 px-2 text-right">
                        {item.aiScore && (
                          <span className={`${item.aiScore >= 90 ? "text-green-600" : item.aiScore >= 80 ? "text-blue-600" : "text-amber-600"}`}>
                            {item.aiScore}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right text-gray-500">
                        {item.engagement ? item.engagement.toLocaleString("vi-VN") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <h4 className="text-sm text-pink-900">AI Content Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-pink-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Case Study (AI Score: 94) được dự đoán sẽ có engagement <strong>cao nhất tháng</strong>. Đề xuất promote mạnh trên LinkedIn + Email sequence riêng cho enterprise leads.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Tuần 2 tháng 3 <strong>thiếu nội dung video</strong>. Video content đang có engagement rate cao nhất (1.8x so với blog). Đề xuất thêm 1 short-form video tip.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI gợi ý topic trending: <strong>"AI Agent tự động chốt deal"</strong> — search volume tăng <strong>+340%</strong> trong 2 tuần. Nên viết blog + tạo infographic tuần này.</span>
          </p>
        </div>
      </div>
      {showCreateModal && <CreateContentModal onClose={() => setShowCreateModal(false)} onCreated={handleCreateContent} />}
    </div>
  );
}