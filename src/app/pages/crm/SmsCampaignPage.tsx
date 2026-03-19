/**
 * SMS Campaign Manager
 * Quản lý chiến dịch SMS marketing: tạo chiến dịch, chọn danh sách,
 * soạn nội dung (có merge fields), lên lịch gửi, analytics chi tiết.
 */
import { useState, useMemo } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Send,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Copy,
  Play,
  Pause,
  Eye,
  X,
  Sparkles,
  Bot,
  TrendingUp,
  BarChart3,
  Pencil,
  Phone,
  Zap,
  Ban,
  ChevronRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

/* Add import for ConfirmDeleteDialog after existing imports */
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";

/* ============================================================
 * Types
 * ============================================================ */
type CampaignStatus = "active" | "draft" | "scheduled" | "completed" | "paused";
type CampaignType = "promotional" | "transactional" | "reminder" | "survey" | "otp";

interface SmsCampaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  message: string;
  senderName: string;
  targetAudience: string;
  recipientCount: number;
  scheduledAt: string | null;
  sentAt: string | null;
  // Stats
  sent: number;
  delivered: number;
  failed: number;
  clicked: number; // short link clicks
  replied: number;
  optedOut: number;
  cost: number; // VND
  // Meta
  createdBy: string;
  createdAt: string;
  tags: string[];
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Đang gửi", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  draft: { label: "Bản nháp", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  scheduled: { label: "Đã lên lịch", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  completed: { label: "Hoàn thành", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  paused: { label: "Tạm dừng", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

const TYPE_CFG: Record<CampaignType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  promotional: { label: "Khuyến mãi", icon: Zap },
  transactional: { label: "Giao dịch", icon: DollarSign },
  reminder: { label: "Nhắc nhở", icon: Clock },
  survey: { label: "Khảo sát", icon: MessageSquare },
  otp: { label: "OTP / Xác thực", icon: Phone },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_CAMPAIGNS: SmsCampaign[] = [
  {
    id: "sms_001",
    name: "Flash Sale Tết Nguyên Đán 2026",
    type: "promotional",
    status: "completed",
    message:
      "🎆 [AI-CRM] Chào {{first_name}}, Flash Sale Tết GIẢM 50% tất cả gói Enterprise! Chỉ còn 48h. Đăng ký ngay: {{short_link}} — Trả lời STOP để huỷ",
    senderName: "AI-CRM",
    targetAudience: "Segment: Professional Plan + Active > 6 tháng",
    recipientCount: 3200,
    scheduledAt: "2026-01-28T08:00:00Z",
    sentAt: "2026-01-28T08:00:12Z",
    sent: 3200,
    delivered: 3108,
    failed: 92,
    clicked: 876,
    replied: 134,
    optedOut: 18,
    cost: 4800000,
    createdBy: "Nguyễn Thị Mai",
    createdAt: "2026-01-25T10:00:00Z",
    tags: ["Tết 2026", "Flash Sale", "Enterprise"],
  },
  {
    id: "sms_002",
    name: "Nhắc lịch Demo Enterprise",
    type: "reminder",
    status: "active",
    message:
      "Xin chào {{full_name}}, nhắc bạn cuộc hẹn Demo AI-CRM Enterprise lúc {{appointment_time}} ngày {{appointment_date}}. Link tham gia: {{meeting_link}} — AI-CRM Team",
    senderName: "AI-CRM",
    targetAudience: "Contacts có lịch demo trong 24h tới",
    recipientCount: 45,
    scheduledAt: null,
    sentAt: null,
    sent: 312,
    delivered: 308,
    failed: 4,
    clicked: 267,
    replied: 89,
    optedOut: 1,
    cost: 468000,
    createdBy: "Trần Đức Anh",
    createdAt: "2026-02-01T09:00:00Z",
    tags: ["Demo", "Reminder", "Automated"],
  },
  {
    id: "sms_003",
    name: "NPS Survey Q1/2026",
    type: "survey",
    status: "scheduled",
    message:
      "{{first_name}} ơi, bạn có hài lòng với AI-CRM không? Đánh giá nhanh 30 giây tại đây: {{survey_link}} — Cảm ơn bạn rất nhiều! 🙏",
    senderName: "AI-CRM",
    targetAudience: "All Active Customers (>30 ngày)",
    recipientCount: 5600,
    scheduledAt: "2026-03-15T09:00:00Z",
    sentAt: null,
    sent: 0,
    delivered: 0,
    failed: 0,
    clicked: 0,
    replied: 0,
    optedOut: 0,
    cost: 0,
    createdBy: "Lê Hoàng Đức",
    createdAt: "2026-03-02T14:00:00Z",
    tags: ["NPS", "Q1-2026", "Survey"],
  },
  {
    id: "sms_004",
    name: "Win-back Churned Customers",
    type: "promotional",
    status: "draft",
    message:
      "{{first_name}}, chúng tôi nhớ bạn! Quay lại AI-CRM với ưu đãi ĐẶC BIỆT: 3 tháng miễn phí + migration support. Chi tiết: {{offer_link}}",
    senderName: "AI-CRM",
    targetAudience: "Churned < 60 ngày, LTV > 10 triệu",
    recipientCount: 420,
    scheduledAt: null,
    sentAt: null,
    sent: 0,
    delivered: 0,
    failed: 0,
    clicked: 0,
    replied: 0,
    optedOut: 0,
    cost: 0,
    createdBy: "Phạm Minh Tâm",
    createdAt: "2026-03-03T08:00:00Z",
    tags: ["Win-back", "Churn"],
  },
  {
    id: "sms_005",
    name: "Xác nhận thanh toán",
    type: "transactional",
    status: "active",
    message:
      "AI-CRM: Thanh toán {{amount}} cho gói {{plan_name}} đã thành công. Mã GD: {{transaction_id}}. Hoá đơn: {{invoice_link}}",
    senderName: "AI-CRM",
    targetAudience: "Trigger: Payment Success Event",
    recipientCount: 0,
    scheduledAt: null,
    sentAt: null,
    sent: 1847,
    delivered: 1840,
    failed: 7,
    clicked: 623,
    replied: 12,
    optedOut: 0,
    cost: 2770500,
    createdBy: "Hệ thống",
    createdAt: "2025-12-01T00:00:00Z",
    tags: ["Transactional", "Payment", "Automated"],
  },
];

const MERGE_FIELDS = [
  "{{first_name}}", "{{full_name}}", "{{company}}", "{{phone}}",
  "{{short_link}}", "{{appointment_time}}", "{{appointment_date}}",
  "{{meeting_link}}", "{{survey_link}}", "{{offer_link}}",
  "{{amount}}", "{{plan_name}}", "{{transaction_id}}", "{{invoice_link}}",
];

/* ============================================================
 * Detail Modal
 * ============================================================ */
function CampaignDetailModal({ campaign, onClose }: { campaign: SmsCampaign; onClose: () => void }) {
  const statusCfg = STATUS_CFG[campaign.status];
  const TypeIcon = TYPE_CFG[campaign.type].icon;
  const deliverRate = campaign.sent > 0 ? ((campaign.delivered / campaign.sent) * 100).toFixed(1) : "—";
  const clickRate = campaign.delivered > 0 ? ((campaign.clicked / campaign.delivered) * 100).toFixed(1) : "—";
  const replyRate = campaign.delivered > 0 ? ((campaign.replied / campaign.delivered) * 100).toFixed(1) : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TypeIcon className="w-5 h-5 text-violet-600" />
            <div>
              <h3 className="text-gray-900 text-sm">{campaign.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${statusCfg.bg} ${statusCfg.color}`}>{statusCfg.label}</span>
                <span className="text-[8px] text-gray-400">{TYPE_CFG[campaign.type].label}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        {/* Message Preview */}
        <div className="p-4">
          <p className="text-[10px] text-gray-400 mb-1">Nội dung tin nhắn:</p>
          <div className="bg-green-50 rounded-xl p-3 text-sm text-gray-800 border border-green-200">
            {campaign.message}
          </div>
          <p className="text-[9px] text-gray-400 mt-1 text-right">
            {campaign.message.length} ký tự • {Math.ceil(campaign.message.length / 160)} SMS
          </p>
        </div>

        {/* Stats Grid */}
        {campaign.sent > 0 && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-900">{campaign.sent.toLocaleString()}</p>
                <p className="text-[8px] text-gray-400">Đã gửi</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">{deliverRate}%</p>
                <p className="text-[8px] text-gray-400">Tới nơi</p>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <p className="text-sm text-red-500">{campaign.failed}</p>
                <p className="text-[8px] text-gray-400">Thất bại</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">{clickRate}%</p>
                <p className="text-[8px] text-gray-400">Click</p>
              </div>
              <div className="text-center p-2 bg-violet-50 rounded-lg">
                <p className="text-sm text-violet-600">{replyRate}%</p>
                <p className="text-[8px] text-gray-400">Reply</p>
              </div>
              <div className="text-center p-2 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-600">{campaign.optedOut}</p>
                <p className="text-[8px] text-gray-400">Opt-out</p>
              </div>
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="px-4 pb-4 text-[10px] text-gray-400 space-y-1">
          <div className="flex justify-between"><span>Đối tượng:</span><span className="text-gray-600 text-right max-w-[60%]">{campaign.targetAudience}</span></div>
          <div className="flex justify-between"><span>Người nhận:</span><span className="text-gray-600">{campaign.recipientCount.toLocaleString()}</span></div>
          {campaign.scheduledAt && <div className="flex justify-between"><span>Lên lịch:</span><span className="text-gray-600">{new Date(campaign.scheduledAt).toLocaleString("vi-VN")}</span></div>}
          {campaign.sentAt && <div className="flex justify-between"><span>Đã gửi lúc:</span><span className="text-gray-600">{new Date(campaign.sentAt).toLocaleString("vi-VN")}</span></div>}
          {campaign.cost > 0 && <div className="flex justify-between"><span>Chi phí:</span><span className="text-gray-600">{campaign.cost.toLocaleString("vi-VN")}₫</span></div>}
          <div className="flex justify-between"><span>Tạo bởi:</span><span className="text-gray-600">{campaign.createdBy}</span></div>
          <div className="flex gap-1 mt-1">
            {campaign.tags.map((t) => (
              <span key={t} className="px-1.5 py-0.5 bg-violet-100 text-violet-600 rounded">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Compose Modal
 * ============================================================ */
function ComposeModal({ onClose, onSend }: { onClose: () => void; onSend: (c: SmsCampaign) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<CampaignType>("promotional");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("");

  const charCount = message.length;
  const smsCount = Math.ceil(charCount / 160) || 0;

  const handleSend = () => {
    if (!name || !message) { toast.error("Vui lòng nhập tên và nội dung tin nhắn"); return; }
    const newCampaign: SmsCampaign = {
      id: `sms_${Date.now()}`,
      name,
      type,
      status: "draft",
      message,
      senderName: "AI-CRM",
      targetAudience: audience || "Tất cả contacts",
      recipientCount: 0,
      scheduledAt: null,
      sentAt: null,
      sent: 0, delivered: 0, failed: 0, clicked: 0, replied: 0, optedOut: 0, cost: 0,
      createdBy: "Bạn",
      createdAt: new Date().toISOString(),
      tags: [],
    };
    onSend(newCampaign);
    onClose();
    toast.success(`Đã tạo chiến dịch "${name}"`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-sm text-gray-900">Tạo chiến dịch SMS mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Tên chiến dịch *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="VD: Flash Sale tháng 3"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Loại chiến dịch</label>
            <select value={type} onChange={(e) => setType(e.target.value as CampaignType)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Đối tượng</label>
            <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)}
              placeholder="VD: Segment Active Customers"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Nội dung tin nhắn *</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
              rows={4} placeholder="Nhập nội dung SMS... Dùng {{first_name}} để cá nhân hoá"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
            <div className="flex items-center justify-between mt-1">
              <div className="flex flex-wrap gap-1">
                {MERGE_FIELDS.slice(0, 5).map((f) => (
                  <button key={f} type="button"
                    onClick={() => setMessage((prev) => prev + f)}
                    className="text-[8px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded hover:bg-violet-100">
                    {f}
                  </button>
                ))}
              </div>
              <span className={`text-[9px] ${charCount > 160 ? "text-amber-500" : "text-gray-400"}`}>
                {charCount}/160 • {smsCount} SMS
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button type="button" onClick={handleSend}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
              <Send className="w-4 h-4" /> Lưu bản nháp
            </button>
            <button type="button" onClick={() => { toast.success("AI đang tạo nội dung SMS..."); }}
              className="flex items-center gap-1.5 px-3 py-2 border border-violet-200 text-violet-600 rounded-lg text-sm hover:bg-violet-50">
              <Sparkles className="w-4 h-4" /> AI Viết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function SmsCampaignPage() {
  const [campaigns, setCampaigns] = useState<SmsCampaign[]>(MOCK_CAMPAIGNS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [selectedCampaign, setSelectedCampaign] = useState<SmsCampaign | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SmsCampaign | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    let result = campaigns;
    if (statusFilter !== "all") result = result.filter((c) => c.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.message.toLowerCase().includes(q));
    }
    return result;
  }, [campaigns, statusFilter, search]);

  const stats = useMemo(() => {
    const totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
    const totalDelivered = campaigns.reduce((s, c) => s + c.delivered, 0);
    const totalClicked = campaigns.reduce((s, c) => s + c.clicked, 0);
    const totalCost = campaigns.reduce((s, c) => s + c.cost, 0);
    return {
      totalCampaigns: campaigns.length,
      active: campaigns.filter((c) => c.status === "active").length,
      totalSent,
      deliverRate: totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : "0",
      clickRate: totalDelivered > 0 ? ((totalClicked / totalDelivered) * 100).toFixed(1) : "0",
      totalCost,
    };
  }, [campaigns]);

  const handleAddCampaign = (c: SmsCampaign) => setCampaigns((prev) => [c, ...prev]);
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setTimeout(() => {
      setCampaigns((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Đã xoá chiến dịch");
      setDeleteTarget(null);
      setDeleting(false);
    }, 400);
  };
  const handleDuplicate = (c: SmsCampaign) => {
    const clone = { ...c, id: `sms_${Date.now()}`, name: `${c.name} (Copy)`, status: "draft" as const, sent: 0, delivered: 0, failed: 0, clicked: 0, replied: 0, optedOut: 0, cost: 0, createdAt: new Date().toISOString() };
    setCampaigns((prev) => [clone, ...prev]);
    toast.success("Đã sao chép chiến dịch");
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-green-600" /> SMS Campaign Manager
        </h1>
        <p className="text-gray-500 mt-0.5">
          Quản lý chiến dịch SMS marketing — gửi hàng loạt, cá nhân hoá, lên lịch, analytics
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.totalCampaigns}</p>
          <p className="text-[9px] text-gray-400">Chiến dịch</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.active}</p>
          <p className="text-[9px] text-green-700">Đang chạy</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalSent.toLocaleString()}</p>
          <p className="text-[9px] text-blue-700">Tổng gửi</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2.5 text-center">
          <p className="text-lg text-emerald-600">{stats.deliverRate}%</p>
          <p className="text-[9px] text-emerald-700">Tỉ lệ tới</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.clickRate}%</p>
          <p className="text-[9px] text-violet-700">Click Rate</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{(stats.totalCost / 1_000_000).toFixed(1)}tr</p>
          <p className="text-[9px] text-amber-700">Chi phí (VNĐ)</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm chiến dịch..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | "all")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button type="button" onClick={() => setShowCompose(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
          <Plus className="w-4 h-4" /> Tạo chiến dịch
        </button>
      </div>

      {/* Campaign Cards */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const stCfg = STATUS_CFG[c.status];
          const TypeIcon = TYPE_CFG[c.type].icon;
          const deliverRate = c.sent > 0 ? ((c.delivered / c.sent) * 100).toFixed(1) : null;
          return (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-green-200 transition-colors">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${stCfg.bg}`}>
                    <TypeIcon className={`w-5 h-5 ${stCfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm text-gray-900">{c.name}</h3>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                      <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{TYPE_CFG[c.type].label}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{c.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-[9px] text-gray-400 flex-wrap">
                      <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {c.recipientCount > 0 ? c.recipientCount.toLocaleString() : "Trigger"} người nhận</span>
                      {c.sent > 0 && <span className="flex items-center gap-0.5"><Send className="w-3 h-3" /> {c.sent.toLocaleString()} gửi</span>}
                      {deliverRate && <span className="flex items-center gap-0.5 text-green-500"><CheckCircle2 className="w-3 h-3" /> {deliverRate}%</span>}
                      {c.cost > 0 && <span className="flex items-center gap-0.5 text-amber-500"><DollarSign className="w-3 h-3" /> {(c.cost / 1000).toLocaleString()}k₫</span>}
                      {c.scheduledAt && <span className="flex items-center gap-0.5 text-blue-500"><Calendar className="w-3 h-3" /> {new Date(c.scheduledAt).toLocaleDateString("vi-VN")}</span>}
                    </div>
                  </div>
                </div>

                {/* Mini stats bar */}
                {c.sent > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: `${(c.delivered / c.sent) * 100}%` }} />
                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${(c.failed / c.sent) * 100}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[8px] text-gray-400">
                      <span className="text-green-500">{c.delivered.toLocaleString()} tới</span>
                      <span>{c.clicked.toLocaleString()} click • {c.replied} reply</span>
                      <span className="text-red-400">{c.failed} thất bại</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  {c.tags.map((t) => (
                    <span key={t} className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                <button type="button" onClick={() => setSelectedCampaign(c)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-white rounded-lg">
                  <Eye className="w-3 h-3" /> Chi tiết
                </button>
                <button type="button" onClick={() => handleDuplicate(c)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-white rounded-lg">
                  <Copy className="w-3 h-3" /> Sao chép
                </button>
                <div className="flex-1" />
                <button type="button" onClick={() => setDeleteTarget(c)}
                  className="p-1.5 text-gray-300 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Không tìm thấy chiến dịch SMS nào</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-green-600" />
          <h4 className="text-sm text-green-900">AI SMS Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-green-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Chiến dịch <strong>"Flash Sale Tết"</strong> đạt <strong>27.4% click rate</strong> — cao gấp 3x trung bình ngành. Nên áp dụng format tương tự cho Q2.</span>
          </p>
          <p className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Thời điểm gửi SMS tốt nhất: <strong>8:00-9:00 sáng Thứ 3 & Thứ 5</strong>. Delivery rate cao hơn 12% so với gửi buổi chiều.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>SMS có <strong>merge field {{first_name}}</strong> tăng reply rate <strong>+45%</strong>. Đề xuất bổ sung cá nhân hoá cho chiến dịch "Win-back".</span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {selectedCampaign && <CampaignDetailModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />}
      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} onSend={handleAddCampaign} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        itemName={deleteTarget?.name ?? ""}
        entityType="chiến dịch SMS"
        description="Hành động này không thể hoàn tác. Mọi dữ liệu analytics liên quan sẽ bị mất."
        loading={deleting}
      />
    </div>
  );
}