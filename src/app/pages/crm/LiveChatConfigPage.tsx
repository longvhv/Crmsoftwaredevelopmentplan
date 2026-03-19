/**
 * Live Chat Config — Cấu hình Widget Chat cho website
 * Widget customization, chatbot config, canned responses,
 * routing rules, business hours, chat analytics.
 */
import { useState, useMemo } from "react";
import {
  MessageCircle,
  Settings,
  Palette,
  Bot,
  Clock,
  Users,
  Zap,
  Globe,
  Eye,
  Copy,
  Code2,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  X,
  Search,
  BarChart3,
  ArrowUpRight,
  Play,
  Pause,
  RefreshCw,
  Star,
  Shield,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type WidgetPosition = "bottom-right" | "bottom-left";
type ChatStatus = "online" | "offline" | "away";
type RoutingRule = "round-robin" | "least-active" | "skill-based" | "department";

interface WidgetConfig {
  primaryColor: string;
  position: WidgetPosition;
  greeting: string;
  offlineMessage: string;
  showAgentPhoto: boolean;
  showTypingIndicator: boolean;
  soundEnabled: boolean;
  autoPopup: boolean;
  autoPopupDelay: number;
  requireEmail: boolean;
  language: string;
  customCss: string;
}

interface CannedResponse {
  id: string;
  shortcut: string;
  title: string;
  content: string;
  category: string;
  usageCount: number;
}

interface ChatAgent {
  id: string;
  name: string;
  email: string;
  status: ChatStatus;
  department: string;
  activeChats: number;
  maxChats: number;
  avgResponseTime: number;
  avgRating: number;
  totalChatsToday: number;
}

interface BusinessHours {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<ChatStatus, { label: string; color: string; dot: string }> = {
  online: { label: "Trực tuyến", color: "text-green-600", dot: "bg-green-500" },
  offline: { label: "Ngoại tuyến", color: "text-gray-500", dot: "bg-gray-400" },
  away: { label: "Vắng mặt", color: "text-amber-600", dot: "bg-amber-500" },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_CONFIG: WidgetConfig = {
  primaryColor: "#7c3aed",
  position: "bottom-right",
  greeting: "Xin chào! 👋 Chúng tôi có thể giúp gì cho bạn?",
  offlineMessage: "Hiện tại không có agent trực tuyến. Vui lòng để lại tin nhắn, chúng tôi sẽ phản hồi sớm nhất!",
  showAgentPhoto: true,
  showTypingIndicator: true,
  soundEnabled: true,
  autoPopup: true,
  autoPopupDelay: 15,
  requireEmail: false,
  language: "vi",
  customCss: "",
};

const MOCK_CANNED: CannedResponse[] = [
  { id: "cn_001", shortcut: "/hello", title: "Chào mừng", content: "Xin chào! Cảm ơn bạn đã liên hệ AI-CRM. Tôi có thể giúp gì cho bạn hôm nay?", category: "Chào hỏi", usageCount: 342 },
  { id: "cn_002", shortcut: "/pricing", title: "Thông tin giá", content: "AI-CRM có 4 gói: Starter (2M/tháng), Professional (5M/tháng), Business (12M/tháng), Enterprise (liên hệ). Bạn quan tâm gói nào?", category: "Sales", usageCount: 218 },
  { id: "cn_003", shortcut: "/demo", title: "Book demo", content: "Tuyệt vời! Tôi có thể book demo 30 phút cho bạn. Bạn rảnh thời gian nào trong tuần này?", category: "Sales", usageCount: 156 },
  { id: "cn_004", shortcut: "/transfer", title: "Chuyển tiếp", content: "Để giải quyết tốt nhất, tôi xin chuyển bạn đến chuyên gia phụ trách. Vui lòng chờ trong giây lát!", category: "Support", usageCount: 89 },
  { id: "cn_005", shortcut: "/ticket", title: "Tạo ticket", content: "Tôi đã tạo ticket hỗ trợ #{number} cho vấn đề này. Bạn sẽ nhận email xác nhận và chúng tôi sẽ phản hồi trong 4h làm việc.", category: "Support", usageCount: 134 },
  { id: "cn_006", shortcut: "/bye", title: "Kết thúc", content: "Cảm ơn bạn đã liên hệ! Nếu cần thêm hỗ trợ, đừng ngần ngại nhắn lại nhé. Chúc bạn một ngày tốt lành! 😊", category: "Chào hỏi", usageCount: 287 },
];

const MOCK_AGENTS: ChatAgent[] = [
  { id: "ag_001", name: "Trần Đức Anh", email: "anh@ai-crm.vn", status: "online", department: "Sales", activeChats: 3, maxChats: 5, avgResponseTime: 28, avgRating: 4.8, totalChatsToday: 12 },
  { id: "ag_002", name: "Nguyễn Thị Mai", email: "mai@ai-crm.vn", status: "online", department: "Support", activeChats: 2, maxChats: 5, avgResponseTime: 45, avgRating: 4.6, totalChatsToday: 8 },
  { id: "ag_003", name: "Phạm Minh Tâm", email: "tam@ai-crm.vn", status: "away", department: "Sales", activeChats: 0, maxChats: 5, avgResponseTime: 35, avgRating: 4.5, totalChatsToday: 6 },
  { id: "ag_004", name: "AI Sales Bot", email: "bot@ai-crm.vn", status: "online", department: "AI Bot", activeChats: 8, maxChats: 999, avgResponseTime: 2, avgRating: 4.2, totalChatsToday: 45 },
];

const MOCK_HOURS: BusinessHours[] = [
  { day: "Thứ Hai", enabled: true, start: "08:00", end: "18:00" },
  { day: "Thứ Ba", enabled: true, start: "08:00", end: "18:00" },
  { day: "Thứ Tư", enabled: true, start: "08:00", end: "18:00" },
  { day: "Thứ Năm", enabled: true, start: "08:00", end: "18:00" },
  { day: "Thứ Sáu", enabled: true, start: "08:00", end: "17:00" },
  { day: "Thứ Bảy", enabled: true, start: "09:00", end: "12:00" },
  { day: "Chủ Nhật", enabled: false, start: "09:00", end: "12:00" },
];

type Tab = "widget" | "canned" | "agents" | "hours";

/* ============================================================
 * Create Canned Response Modal
 * ============================================================ */
function CreateCannedModal({ onClose, onCreated }: { onClose: () => void; onCreated: (cn: CannedResponse) => void }) {
  const [shortcut, setShortcut] = useState("/");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Support");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề"); return; }
    if (!content.trim()) { toast.error("Vui lòng nhập nội dung tin nhắn"); return; }
    setSaving(true);
    const newCn: CannedResponse = {
      id: `cn_${Date.now()}`,
      shortcut: shortcut.startsWith("/") ? shortcut : `/${shortcut}`,
      title, content, category, usageCount: 0,
    };
    onCreated(newCn);
    toast.success(`Đã thêm tin nhắn mẫu "${title}"`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Thêm Tin nhắn mẫu</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phím tắt</label>
              <input type="text" value={shortcut} onChange={(e) => setShortcut(e.target.value)} placeholder="/hello"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Danh mục</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Chào hỏi">Chào hỏi</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="Technical">Technical</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Hỏi thông tin liên hệ"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nội dung tin nhắn *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="Nhập nội dung tin nhắn mẫu..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            <p className="text-[9px] text-gray-400 mt-1">Biến hỗ trợ: {"{name}"}, {"{company}"}, {"{number}"}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Đang thêm..." : "Thêm tin nhắn mẫu"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Widget Preview
 * ============================================================ */
function WidgetPreview({ config }: { config: WidgetConfig }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative h-[350px] bg-gray-100 rounded-xl border border-gray-200 overflow-hidden">
      {/* Fake website background */}
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-20 bg-gray-200 rounded mt-4" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>

      {/* Chat Widget */}
      <div className={`absolute bottom-4 ${config.position === "bottom-right" ? "right-4" : "left-4"}`}>
        {open ? (
          <div className="w-[220px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-3 text-white text-center" style={{ backgroundColor: config.primaryColor }}>
              <p className="text-[10px]">{config.greeting}</p>
            </div>
            <div className="p-3 space-y-2 h-[120px]">
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="bg-gray-100 rounded-lg p-1.5 text-[8px] text-gray-600 max-w-[140px]">
                  Xin chào! Tôi có thể giúp gì?
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 p-2 border-t border-gray-100">
              <input className="flex-1 text-[8px] px-2 py-1 bg-gray-50 rounded border border-gray-200" placeholder="Nhập tin nhắn..." readOnly />
              <button type="button" className="p-1 rounded text-white" style={{ backgroundColor: config.primaryColor }}>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : null}
        <button type="button" onClick={() => setOpen(!open)}
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white mt-2"
          style={{ backgroundColor: config.primaryColor }}>
          {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function LiveChatConfigPage() {
  const [activeTab, setActiveTab] = useState<Tab>("widget");
  const [config, setConfig] = useState<WidgetConfig>(MOCK_CONFIG);
  const [routing, setRouting] = useState<RoutingRule>("round-robin");
  const [cannedResponses, setCannedResponses] = useState(MOCK_CANNED);
  const [showCreateCanned, setShowCreateCanned] = useState(false);

  const chatStats = useMemo(() => ({
    totalToday: MOCK_AGENTS.reduce((s, a) => s + a.totalChatsToday, 0),
    onlineAgents: MOCK_AGENTS.filter((a) => a.status === "online").length,
    avgResponseTime: Math.round(MOCK_AGENTS.filter((a) => a.status !== "offline").reduce((s, a) => s + a.avgResponseTime, 0) / MOCK_AGENTS.filter((a) => a.status !== "offline").length),
    avgRating: (MOCK_AGENTS.reduce((s, a) => s + a.avgRating, 0) / MOCK_AGENTS.length).toFixed(1),
  }), []);

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "widget", label: "Widget", icon: Palette },
    { key: "canned", label: "Tin nhắn mẫu", icon: MessageSquare },
    { key: "agents", label: "Agents", icon: Users },
    { key: "hours", label: "Giờ làm việc", icon: Clock },
  ];

  const embedCode = `<script src="https://cdn.ai-crm.vn/chat-widget.js"
  data-color="${config.primaryColor}"
  data-position="${config.position}"
  data-lang="${config.language}"
  data-auto-popup="${config.autoPopup}"
  data-popup-delay="${config.autoPopupDelay}">
</script>`;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" /> Live Chat Config
        </h1>
        <p className="text-gray-500 mt-0.5">
          Cấu hình widget chat — tuỳ chỉnh giao diện, tin nhắn mẫu, routing, giờ làm việc
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{chatStats.totalToday}</p>
          <p className="text-[9px] text-blue-700">Chat hôm nay</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{chatStats.onlineAgents}</p>
          <p className="text-[9px] text-green-700">Agents online</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{chatStats.avgResponseTime}s</p>
          <p className="text-[9px] text-violet-700">TB phản hồi</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{chatStats.avgRating}★</p>
          <p className="text-[9px] text-amber-700">TB đánh giá</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === t.key ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* === Tab: Widget === */}
      {activeTab === "widget" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Settings */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
              <h3 className="text-sm text-gray-900">Tuỳ chỉnh Widget</h3>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Màu chủ đạo</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0" />
                  <span className="text-xs text-gray-600">{config.primaryColor}</span>
                  <div className="flex gap-1 ml-2">
                    {["#7c3aed", "#2563eb", "#059669", "#dc2626", "#ea580c", "#0891b2"].map((c) => (
                      <button key={c} type="button" onClick={() => setConfig({ ...config, primaryColor: c })}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Vị trí</label>
                <div className="flex gap-2">
                  {(["bottom-right", "bottom-left"] as WidgetPosition[]).map((pos) => (
                    <button key={pos} type="button"
                      onClick={() => setConfig({ ...config, position: pos })}
                      className={`px-3 py-1.5 rounded-lg text-xs border ${config.position === pos ? "bg-blue-50 border-blue-300 text-blue-600" : "bg-white border-gray-200 text-gray-500"}`}>
                      {pos === "bottom-right" ? "Dưới phải" : "Dưới trái"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Lời chào</label>
                <textarea value={config.greeting}
                  onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs resize-none" rows={2} />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Tin nhắn ngoại tuyến</label>
                <textarea value={config.offlineMessage}
                  onChange={(e) => setConfig({ ...config, offlineMessage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs resize-none" rows={2} />
              </div>

              <div className="space-y-2">
                {[
                  { key: "showAgentPhoto" as const, label: "Hiện ảnh agent" },
                  { key: "showTypingIndicator" as const, label: "Hiện typing indicator" },
                  { key: "soundEnabled" as const, label: "Bật âm thanh" },
                  { key: "autoPopup" as const, label: "Tự động mở popup" },
                  { key: "requireEmail" as const, label: "Yêu cầu email trước khi chat" },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={config[opt.key]}
                      onChange={(e) => setConfig({ ...config, [opt.key]: e.target.checked })}
                      className="rounded border-gray-300" />
                    <span className="text-xs text-gray-600">{opt.label}</span>
                  </label>
                ))}
              </div>

              {config.autoPopup && (
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Delay popup (giây)</label>
                  <input type="number" value={config.autoPopupDelay}
                    onChange={(e) => setConfig({ ...config, autoPopupDelay: Number(e.target.value) })}
                    className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-xs" min={0} />
                </div>
              )}

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Routing Rule</label>
                <select value={routing} onChange={(e) => setRouting(e.target.value as RoutingRule)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                  <option value="round-robin">Round Robin</option>
                  <option value="least-active">Ít chat nhất</option>
                  <option value="skill-based">Theo kỹ năng</option>
                  <option value="department">Theo phòng ban</option>
                </select>
              </div>

              <button type="button" onClick={() => toast.success("Đã lưu cấu hình widget!")}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Lưu cấu hình
              </button>
            </div>

            {/* Embed Code */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-900 flex items-center gap-1"><Code2 className="w-4 h-4" /> Mã nhúng</h3>
                <button type="button" onClick={() => { navigator.clipboard.writeText(embedCode); toast.success("Đã sao chép!"); }}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] text-blue-600 hover:bg-blue-50 rounded">
                  <Copy className="w-3 h-3" /> Sao chép
                </button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-[9px] overflow-x-auto">{embedCode}</pre>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-sm text-gray-900 mb-2">Xem trước Widget</h3>
            <WidgetPreview config={config} />
          </div>
        </div>
      )}

      {/* === Tab: Canned Responses === */}
      {activeTab === "canned" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{cannedResponses.length} tin nhắn mẫu</p>
            <button type="button" onClick={() => setShowCreateCanned(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <MessageSquare className="w-4 h-4" /> Thêm mới
            </button>
          </div>
          {cannedResponses.map((cn) => (
            <div key={cn.id} className="bg-white rounded-xl border border-gray-100 p-3">
              <div className="flex items-center gap-2 mb-1">
                <code className="text-[10px] px-2 py-0.5 bg-violet-100 text-violet-700 rounded">{cn.shortcut}</code>
                <span className="text-sm text-gray-900">{cn.title}</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{cn.category}</span>
                <span className="text-[8px] text-gray-400 ml-auto">Dùng {cn.usageCount} lần</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{cn.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* === Tab: Agents === */}
      {activeTab === "agents" && (
        <div className="space-y-3">
          {MOCK_AGENTS.map((agent) => {
            const stCfg = STATUS_CFG[agent.status];
            const load = agent.maxChats < 999 ? Math.round((agent.activeChats / agent.maxChats) * 100) : 1;
            return (
              <div key={agent.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                      {agent.name.split(" ").pop()?.[0]}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${stCfg.dot}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-900">{agent.name}</span>
                      <span className={`text-[8px] ${stCfg.color}`}>{stCfg.label}</span>
                      <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{agent.department}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-400 flex-wrap">
                      <span>Active: {agent.activeChats}/{agent.maxChats === 999 ? "∞" : agent.maxChats}</span>
                      <span>TB phản hồi: {agent.avgResponseTime}s</span>
                      <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-amber-500" /> {agent.avgRating}</span>
                      <span>Hôm nay: {agent.totalChatsToday} chat</span>
                    </div>
                    {agent.maxChats < 999 && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 max-w-[120px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${load >= 80 ? "bg-red-400" : load >= 50 ? "bg-amber-400" : "bg-green-400"}`}
                            style={{ width: `${load}%` }} />
                        </div>
                        <span className="text-[8px] text-gray-400">{load}% tải</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Tab: Business Hours === */}
      {activeTab === "hours" && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-900 mb-3">Giờ làm việc Live Chat</h3>
          <p className="text-[10px] text-gray-400 mb-3">Ngoài giờ làm việc, khách sẽ thấy tin nhắn ngoại tuyến và có thể để lại lời nhắn.</p>
          <div className="space-y-2">
            {MOCK_HOURS.map((h) => (
              <div key={h.day} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-2 w-24 cursor-pointer">
                  <input type="checkbox" checked={h.enabled} readOnly className="rounded border-gray-300" />
                  <span className={`text-xs ${h.enabled ? "text-gray-700" : "text-gray-400"}`}>{h.day}</span>
                </label>
                {h.enabled ? (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span className="px-2 py-1 bg-white border border-gray-200 rounded">{h.start}</span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2 py-1 bg-white border border-gray-200 rounded">{h.end}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-400">Nghỉ</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-1.5 mb-1">
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] text-blue-700">AI Chatbot</span>
            </div>
            <p className="text-xs text-blue-800">AI Chatbot hoạt động 24/7 ngoài giờ làm việc. Tự động trả lời FAQ, thu thập thông tin lead, và tạo ticket khi cần chuyển cho human agent.</p>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm text-blue-900">AI Chat Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-blue-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>AI Chatbot xử lý <strong>65% conversations</strong> không cần human agent. Tiết kiệm ước tính <strong>120 giờ/tháng</strong> cho team support.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Peak hours: <strong>9-11h sáng</strong> và <strong>14-16h chiều</strong>. Đề xuất thêm 1 agent online vào khung giờ này để giảm wait time xuống dưới 30s.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Top question: <strong>"Giá bao nhiêu?"</strong> (23%). Auto-popup widget trên pricing page tăng <strong>conversion rate +18%</strong> so với các trang khác.</span>
          </p>
        </div>
      </div>

      {showCreateCanned && <CreateCannedModal onClose={() => setShowCreateCanned(false)} onCreated={(cn) => setCannedResponses((prev) => [...prev, cn])} />}
    </div>
  );
}