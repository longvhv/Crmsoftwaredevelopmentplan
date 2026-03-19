/**
 * Trang NPS Tracker — Thu thập và phân tích phản hồi khách hàng.
 * Net Promoter Score tracking, feedback timeline, sentiment analysis,
 * per-client NPS, response breakdown, AI improvement suggestions.
 * Phase 1: Mock data + interactive analytics UI.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  MessageSquareHeart,
  ThumbsUp,
  ThumbsDown,
  Minus,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Star,
  Bot,
  Sparkles,
  Eye,
  X,
  Search,
  Filter,
  Calendar,
  BarChart3,
  MessageCircle,
  Heart,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Quote,
  Smile,
  Meh,
  Frown,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import type { ColumnDef } from "../../types/dataTable";
import type { FeedbackEntry, ClientNPS, NPSCategory, FeedbackChannel } from "../../types/crm";
import {
  fetchNpsFeedbacks,
  fetchClientNpsRecords,
  fetchNpsTrendData,
  createNpsFeedback,
  updateNpsFeedback,
} from "../../api/crmApi";
import {
  AreaChart,
  Area,
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
} from "recharts";

/* Types imported from ../../types/crm */

/* ============================================================
 * Constants
 * ============================================================ */
const CATEGORY_CONFIG: Record<NPSCategory, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  promoter: { label: "Promoter (9-10)", color: "text-green-600", bgColor: "bg-green-50", icon: <ThumbsUp className="w-4 h-4" /> },
  passive: { label: "Passive (7-8)", color: "text-amber-600", bgColor: "bg-amber-50", icon: <Minus className="w-4 h-4" /> },
  detractor: { label: "Detractor (0-6)", color: "text-red-600", bgColor: "bg-red-50", icon: <ThumbsDown className="w-4 h-4" /> },
};

const CHANNEL_LABELS: Record<FeedbackChannel, string> = {
  email: "Email", "in-app": "Trong ứng dụng", survey: "Khảo sát",
  call: "Cuộc gọi", meeting: "Cuộc họp",
};

const SENTIMENT_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  positive: { label: "Tích cực", icon: <Smile className="w-3.5 h-3.5" />, color: "text-green-600" },
  neutral: { label: "Trung lập", icon: <Meh className="w-3.5 h-3.5" />, color: "text-gray-500" },
  negative: { label: "Tiêu cực", icon: <Frown className="w-3.5 h-3.5" />, color: "text-red-600" },
};

/* Mock data & API imported from centralized layer */

/* ============================================================
 * Feedback Card
 * ============================================================ */
function FeedbackCard({ entry }: { entry: FeedbackEntry }) {
  const catCfg = CATEGORY_CONFIG[entry.category];
  const sentCfg = SENTIMENT_CONFIG[entry.sentiment];
  const scoreColor = entry.score >= 9 ? "text-green-600 bg-green-50" :
    entry.score >= 7 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${scoreColor}`}>
            {entry.score}
          </span>
          <div>
            <p className="text-sm text-gray-900">{entry.clientName}</p>
            <p className="text-[10px] text-gray-400">{entry.clientCompany}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${sentCfg.color}`}>
            {sentCfg.icon} {sentCfg.label}
          </span>
          {!entry.responded && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-50 text-red-600">Chưa phản hồi</span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2 flex items-start gap-1.5">
        <Quote className="w-3.5 h-3.5 text-gray-300 mt-0.5 flex-shrink-0" />
        {entry.comment}
      </p>

      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <div className="flex items-center gap-2">
          <span>{CHANNEL_LABELS[entry.channel]}</span>
          <span>{new Date(entry.date).toLocaleDateString("vi-VN")}</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {entry.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100">{tag}</span>
          ))}
          {entry.tags.length > 2 && <span>+{entry.tags.length - 2}</span>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Client NPS Row
 * ============================================================ */
function ClientNPSRow({ client }: { client: ClientNPS }) {
  const npsColor = client.currentNPS >= 50 ? "text-green-600" :
    client.currentNPS >= 0 ? "text-amber-600" : "text-red-600";
  const npsBg = client.currentNPS >= 50 ? "bg-green-50" :
    client.currentNPS >= 0 ? "bg-amber-50" : "bg-red-50";

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
      {/* NPS Score */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${npsBg}`}>
        <span className={`text-sm ${npsColor}`}>{client.currentNPS > 0 ? "+" : ""}{client.currentNPS}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-gray-900 truncate">{client.clientCompany}</h4>
        <p className="text-[10px] text-gray-400">{client.clientName} · {client.responseCount} phản hồi · TB: {client.avgScore}</p>
      </div>

      {/* Trend */}
      <div className="flex-shrink-0 text-center w-12">
        {client.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500 mx-auto" />}
        {client.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />}
        {client.trend === "stable" && <Minus className="w-4 h-4 text-gray-400 mx-auto" />}
        <p className="text-[8px] text-gray-400">{client.previousNPS > 0 ? "+" : ""}{client.previousNPS}</p>
      </div>

      {/* Concern / Praise */}
      <div className="hidden sm:block flex-1 min-w-0 max-w-[200px]">
        {client.topConcern && (
          <p className="text-[10px] text-red-500 truncate flex items-center gap-0.5">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {client.topConcern}
          </p>
        )}
        {client.topPraise && (
          <p className="text-[10px] text-green-600 truncate flex items-center gap-0.5">
            <Heart className="w-3 h-3 flex-shrink-0" /> {client.topPraise}
          </p>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Send NPS Survey Modal
 * ============================================================ */
function SendNPSSurveyModal({ onClose, onSent }: { onClose: () => void; onSent: (entry: FeedbackEntry) => void }) {
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [channel, setChannel] = useState<FeedbackChannel>("email");
  const [customMessage, setCustomMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSend = () => {
    if (!clientName.trim() || !clientCompany.trim()) { toast.error("Vui lòng nhập tên và công ty khách hàng"); return; }
    setSaving(true);
    // Simulate a new pending feedback entry
    const newEntry: FeedbackEntry = {
      id: `fb_${Date.now()}`, clientName, clientCompany,
      score: 0, category: "passive", channel,
      comment: "(Đang chờ phản hồi...)",
      date: new Date().toISOString().slice(0, 10),
      sentiment: "neutral", tags: ["Pending"],
      responded: false,
    };
    onSent(newEntry);
    toast.success(`Đã gửi khảo sát NPS tới ${clientName} (${clientCompany}) qua ${CHANNEL_LABELS[channel]}`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2"><Send className="w-5 h-5 text-violet-600" /> Gửi Khảo sát NPS</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Người nhận *</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="VD: Nguyễn Văn A"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Công ty *</label>
              <input type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} placeholder="VD: TechCorp"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Kênh gửi</label>
            <select value={channel} onChange={(e) => setChannel(e.target.value as FeedbackChannel)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              {Object.entries(CHANNEL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Lời nhắn tuỳ chỉnh (tùy chọn)</label>
            <textarea value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} rows={2}
              placeholder="Thêm lời nhắn cá nhân hoá cho khách hàng..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-start gap-1">
              <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>AI sẽ tự động cá nhân hoá nội dung khảo sát, theo dõi response rate, và gửi reminder sau 48h nếu chưa phản hồi.</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSend} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50 flex items-center gap-1">
            <Send className="w-3.5 h-3.5" /> {saving ? "Đang gửi..." : "Gửi Khảo sát"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function NPSTrackerPage() {
  const [filterCategory, setFilterCategory] = useState<NPSCategory | "">("");
  const [filterSentiment, setFilterSentiment] = useState<string>("");
  const [search, setSearch] = useState("");
  const [feedbackData, setFeedbackData] = useState<FeedbackEntry[]>([]);
  const [clientNpsData, setClientNpsData] = useState<ClientNPS[]>([]);
  const [npsTrend, setNpsTrend] = useState<{ month: string; nps: number; promoters: number; passives: number; detractors: number }[]>([]);
  const [showSendSurvey, setShowSendSurvey] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { mode, setMode } = useViewMode("nps-tracker", "list");

  /** Load data from API */
  const loadData = useCallback(async () => {
    const [fb, cn, trend] = await Promise.all([
      fetchNpsFeedbacks(),
      fetchClientNpsRecords(),
      fetchNpsTrendData(),
    ]);
    setFeedbackData(fb);
    setClientNpsData(cn);
    setNpsTrend(trend);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const promoterCount = useMemo(() => feedbackData.filter((f) => f.category === "promoter").length, [feedbackData]);
  const passiveCount = useMemo(() => feedbackData.filter((f) => f.category === "passive").length, [feedbackData]);
  const detractorCount = useMemo(() => feedbackData.filter((f) => f.category === "detractor").length, [feedbackData]);

  const categoryDist = useMemo(() => [
    { name: "Promoter", value: promoterCount, fill: "#22c55e" },
    { name: "Passive", value: passiveCount, fill: "#f59e0b" },
    { name: "Detractor", value: detractorCount, fill: "#ef4444" },
  ], [promoterCount, passiveCount, detractorCount]);

  const tagFrequency = useMemo(() => {
    const tagMap: Record<string, number> = {};
    feedbackData.forEach((f) => f.tags.forEach((t) => { tagMap[t] = (tagMap[t] || 0) + 1; }));
    return Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }));
  }, [feedbackData]);

  const overallNPS = useMemo(() => {
    const total = feedbackData.length;
    if (total === 0) return 0;
    const pct = (promoterCount / total) * 100 - (detractorCount / total) * 100;
    return Math.round(pct);
  }, [feedbackData, promoterCount, detractorCount]);

  const filteredFeedback = useMemo(() => {
    let result = [...feedbackData];
    if (filterCategory) result = result.filter((f) => f.category === filterCategory);
    if (filterSentiment) result = result.filter((f) => f.sentiment === filterSentiment);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((f) =>
        f.comment.toLowerCase().includes(q) ||
        f.clientName.toLowerCase().includes(q) ||
        f.clientCompany.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filterCategory, filterSentiment, search, feedbackData]);

  const sortedClientNPS = useMemo(() =>
    [...clientNpsData].sort((a, b) => b.currentNPS - a.currentNPS),
  [clientNpsData]);

  const unreplied = useMemo(() => feedbackData.filter((f) => !f.responded).length, [feedbackData]);

  const columns: ColumnDef<FeedbackEntry>[] = [
    {
      key: "score", header: "Điểm", sortable: true, minWidth: 60, editable: true,
      render: (e) => {
        const c = e.score >= 9 ? "text-green-600 bg-green-50" : e.score >= 7 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
        return <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${c}`}>{e.score}</span>;
      },
      sortValue: (e) => e.score,
      renderEdit: (_item, _v, onChange, onSave) => (
        <input type="number" defaultValue={_item.score} min={0} max={10}
          onChange={(ev) => onChange(Number(ev.target.value))}
          onBlur={onSave} onKeyDown={(ev) => ev.key === "Enter" && onSave()} autoFocus
          className="w-16 px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none" />
      ),
    },
    {
      key: "clientName", header: "Khách hàng", sortable: true, minWidth: 160,
      render: (e) => (
        <div className="min-w-0">
          <p className="text-gray-900 truncate">{e.clientName}</p>
          <p className="text-[10px] text-gray-400">{e.clientCompany}</p>
        </div>
      ),
    },
    {
      key: "category", header: "Loại", sortable: true, minWidth: 100,
      render: (e) => {
        const catCfg = CATEGORY_CONFIG[e.category];
        return <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${catCfg.color}`}>{catCfg.icon} {catCfg.label.split(" ")[0]}</span>;
      },
    },
    {
      key: "sentiment", header: "Sentiment", sortable: true, minWidth: 90, editable: true,
      render: (e) => {
        const sentCfg = SENTIMENT_CONFIG[e.sentiment];
        return <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${sentCfg.color}`}>{sentCfg.icon} {sentCfg.label}</span>;
      },
      renderEdit: (item, _v, onChange, onSave) => (
        <select defaultValue={item.sentiment} onChange={(ev) => { onChange(ev.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {Object.entries(SENTIMENT_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
        </select>
      ),
    },
    {
      key: "comment", header: "Nội dung", minWidth: 220,
      render: (e) => <p className="text-sm text-gray-600 truncate max-w-[220px]">{e.comment}</p>,
    },
    {
      key: "channel", header: "Kênh", sortable: true, minWidth: 90,
      render: (e) => <span className="text-xs text-gray-500">{CHANNEL_LABELS[e.channel]}</span>,
    },
    {
      key: "date", header: "Ngày", sortable: true, minWidth: 90,
      render: (e) => <span className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString("vi-VN")}</span>,
    },
    {
      key: "responded", header: "Phản hồi", sortable: true, minWidth: 80,
      render: (e) => e.responded
        ? <CheckCircle2 className="w-4 h-4 text-green-500" />
        : <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-50 text-red-600">Chưa</span>,
    },
  ];

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateNpsFeedback(rowId, { [field]: value });
    setFeedbackData((prev) => prev.map((f) => f.id === rowId ? { ...f, [field]: value } : f));
    toast.success("Đã cập nhật phản hồi");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setFeedbackData((prev) => prev.filter((f) => !deleteTarget.ids.includes(f.id)));
    toast.success(`Đã xóa ${deleteTarget.ids.length > 1 ? deleteTarget.ids.length + " phản hồi" : "\"" + deleteTarget.label + "\""}`);
    setDeleteTarget(null);
    setDeleting(false);
  }, [deleteTarget]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <MessageSquareHeart className="w-6 h-6 text-violet-600" /> NPS & Phản hồi Khách hàng
          </h1>
          <p className="text-gray-500 mt-0.5">
            Net Promoter Score tracking — Sentiment analysis, per-client NPS, AI improvement suggestions
          </p>
        </div>
        <button type="button" onClick={() => setShowSendSurvey(true)}
          className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 self-start">
          <Plus className="w-4 h-4" /> Gửi Khảo sát
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className={`rounded-xl border p-3 ${overallNPS >= 50 ? "bg-green-50 border-green-200" : overallNPS >= 0 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-2xl ${overallNPS >= 50 ? "text-green-600" : overallNPS >= 0 ? "text-amber-600" : "text-red-600"}`}>
            {overallNPS > 0 ? "+" : ""}{overallNPS}
          </p>
          <p className="text-xs text-gray-600">NPS tổng thể</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3">
          <p className="text-lg text-green-700">{promoterCount}</p>
          <p className="text-xs text-green-600">Promoters (9-10)</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-3">
          <p className="text-lg text-amber-700">{passiveCount}</p>
          <p className="text-xs text-amber-600">Passives (7-8)</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-3">
          <p className="text-lg text-red-700">{detractorCount}</p>
          <p className="text-xs text-red-600">Detractors (0-6)</p>
        </div>
        <div className={`rounded-xl border p-3 ${unreplied > 0 ? "bg-orange-50 border-orange-200" : "bg-white border-gray-100"}`}>
          <p className={`text-lg ${unreplied > 0 ? "text-orange-600" : "text-gray-900"}`}>
            <MessageCircle className="w-4 h-4 inline mr-1" />{unreplied}
          </p>
          <p className="text-xs text-gray-500">Chưa phản hồi</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* NPS Trend */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-green-500" /> Xu hướng NPS
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={npsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 60]} />
              <Tooltip />
              <Line type="monotone" dataKey="nps" stroke="#6366f1" strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1" }} name="NPS Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-violet-500" /> Phân bố phản hồi
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="45%" height={200}>
              <PieChart>
                <Pie data={categoryDist} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={70} innerRadius={35}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {categoryDist.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {categoryDist.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                  <span className="flex-1 text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Tags */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4 text-blue-500" /> Chủ đề phổ biến
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {tagFrequency.map(({ tag, count }) => (
            <button key={tag} type="button"
              onClick={() => setSearch(tag)}
              className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-colors">
              {tag} <span className="text-[10px] text-gray-400 ml-1">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Client NPS Rankings */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-violet-500" /> NPS theo Khách hàng
        </h3>
        <div className="space-y-2">
          {sortedClientNPS.map((client) => (
            <ClientNPSRow key={client.id} client={client} />
          ))}
        </div>
      </div>

      {/* Feedback Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {(["", "promoter", "passive", "detractor"] as (NPSCategory | "")[]).map((cat) => (
              <button key={cat} type="button" onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  filterCategory === cat ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {cat === "" ? "Tất cả" : CATEGORY_CONFIG[cat].label.split(" ")[0]}
              </button>
            ))}
          </div>
          <select value={filterSentiment} onChange={(e) => setFilterSentiment(e.target.value)}
            className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Sentiment</option>
            <option value="positive">Tích cực</option>
            <option value="neutral">Trung lập</option>
            <option value="negative">Tiêu cực</option>
          </select>
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm theo nội dung, client, tag..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <ViewToggle mode={mode} onSetMode={setMode} modes={["table", "list"]} />
        </div>
      </div>

      {mode === "table" ? (
        <DataTable<FeedbackEntry>
          data={filteredFeedback}
          columns={columns}
          storageKey="nps-feedback-table"
          selectable
          onInlineEdit={handleInlineEdit}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} phản hồi được chọn` })}
          renderRowActions={(item) => (
            <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.clientName })} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
          )}
          emptyMessage="Không tìm thấy phản hồi phù hợp"
        />
      ) : (
      <>
      {/* Feedback Cards */}
      <div className="space-y-3">
        {filteredFeedback.map((entry) => (
          <FeedbackCard key={entry.id} entry={entry} />
        ))}
      </div>

      {filteredFeedback.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <MessageSquareHeart className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy phản hồi phù hợp</p>
        </div>
      )}
      </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Feedback Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            FinServe Korea & DigitalWave EU là 2 detractors chính. Keyword lặp lại: "delivery trễ", "staffing". Cần escalation riêng.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            "AI features" xuất hiện 4 lần trong feedback tích cực. Đây là USP mạnh nhất — cần nhấn mạnh trong sales pitch.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            2 feedback chưa phản hồi từ detractors (FinServe, DigitalWave). Phản hồi trong 24h sẽ giảm 40% churn risk.
          </p>
        </div>
      </div>
      {showSendSurvey && <SendNPSSurveyModal onClose={() => setShowSendSurvey(false)} onSent={(entry) => setFeedbackData((prev) => [entry, ...prev])} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.label ?? ""}
        entityType="phản hồi NPS"
        description="Thao tác này không thể hoàn tác."
        loading={deleting}
      />
    </div>
  );
}