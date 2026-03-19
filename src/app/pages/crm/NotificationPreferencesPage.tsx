/**
 * Notification Preferences Page
 * Cấu hình thông báo đa kênh (Email, In-App, SMS, Push, Slack, Teams)
 * cho từng loại sự kiện CRM, với quiet hours, digest mode, và AI summary.
 */
import { useState, useMemo, useCallback } from "react";
import {
  Bell,
  BellOff,
  BellRing,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  Hash,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Clock,
  Moon,
  Sun,
  Sparkles,
  Bot,
  Shield,
  Users,
  Contact2,
  Kanban,
  Ticket,
  FileCheck,
  Target,
  Zap,
  Calendar,
  AlertTriangle,
  Info,
  Volume2,
  VolumeX,
  Settings,
  ToggleLeft,
  ToggleRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type ChannelKey = "email" | "inApp" | "sms" | "push" | "slack" | "teams";

interface Channel {
  key: ChannelKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  enabled: boolean;
  description: string;
}

interface NotificationEvent {
  id: string;
  category: string;
  name: string;
  description: string;
  channels: Record<ChannelKey, boolean>;
  priority: "critical" | "high" | "medium" | "low";
  frequency: "instant" | "digest" | "daily" | "weekly";
}

interface QuietHoursConfig {
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
  allowCritical: boolean;
  weekendsOff: boolean;
}

interface DigestConfig {
  enabled: boolean;
  schedule: "hourly" | "every4h" | "daily" | "weekly";
  time: string;
  includeAISummary: boolean;
}

/* ============================================================
 * Constants
 * ============================================================ */
const CHANNELS: Channel[] = [
  { key: "email", label: "Email", icon: Mail, color: "text-blue-600 bg-blue-50", enabled: true, description: "Gửi email đến hộp thư đăng ký" },
  { key: "inApp", label: "In-App", icon: Bell, color: "text-violet-600 bg-violet-50", enabled: true, description: "Thông báo trong ứng dụng CRM" },
  { key: "sms", label: "SMS", icon: Smartphone, color: "text-green-600 bg-green-50", enabled: false, description: "Tin nhắn SMS (cần cấu hình)" },
  { key: "push", label: "Push", icon: Send, color: "text-amber-600 bg-amber-50", enabled: true, description: "Push notification trên trình duyệt/mobile" },
  { key: "slack", label: "Slack", icon: Hash, color: "text-purple-600 bg-purple-50", enabled: true, description: "Gửi vào channel/DM Slack" },
  { key: "teams", label: "Teams", icon: MessageSquare, color: "text-indigo-600 bg-indigo-50", enabled: false, description: "Gửi vào MS Teams (cần kết nối)" },
];

const CATEGORIES: { key: string; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: "deals", label: "Deals & Pipeline", icon: Kanban, color: "text-green-600" },
  { key: "contacts", label: "Liên hệ & Leads", icon: Contact2, color: "text-blue-600" },
  { key: "tasks", label: "Công việc & Hoạt động", icon: Target, color: "text-amber-600" },
  { key: "tickets", label: "Ticket & Hỗ trợ", icon: Ticket, color: "text-red-600" },
  { key: "contracts", label: "Hợp đồng & Tài chính", icon: FileCheck, color: "text-violet-600" },
  { key: "automation", label: "Tự động hoá & Workflow", icon: Zap, color: "text-cyan-600" },
  { key: "team", label: "Nhóm & Phân quyền", icon: Users, color: "text-pink-600" },
  { key: "system", label: "Hệ thống & Bảo mật", icon: Shield, color: "text-gray-600" },
];

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-500",
};

const FREQUENCY_LABELS: Record<string, string> = {
  instant: "Tức thì",
  digest: "Gộp theo lịch",
  daily: "Hàng ngày",
  weekly: "Hàng tuần",
};

/* ============================================================
 * Mock Events
 * ============================================================ */
const INITIAL_EVENTS: NotificationEvent[] = [
  // Deals
  { id: "e1", category: "deals", name: "Deal mới được tạo", description: "Khi có deal mới trong pipeline", channels: { email: true, inApp: true, sms: false, push: true, slack: true, teams: false }, priority: "high", frequency: "instant" },
  { id: "e2", category: "deals", name: "Deal chuyển giai đoạn", description: "Khi deal được move sang stage khác", channels: { email: false, inApp: true, sms: false, push: true, slack: true, teams: false }, priority: "medium", frequency: "instant" },
  { id: "e3", category: "deals", name: "Deal won / lost", description: "Khi deal đóng thành công hoặc thất bại", channels: { email: true, inApp: true, sms: true, push: true, slack: true, teams: false }, priority: "critical", frequency: "instant" },
  { id: "e4", category: "deals", name: "Deal quá hạn close date", description: "Deal vượt qua ngày dự kiến đóng", channels: { email: true, inApp: true, sms: false, push: true, slack: false, teams: false }, priority: "high", frequency: "daily" },
  { id: "e5", category: "deals", name: "Giá trị deal thay đổi >20%", description: "Khi amount thay đổi đáng kể", channels: { email: true, inApp: true, sms: false, push: false, slack: true, teams: false }, priority: "high", frequency: "instant" },

  // Contacts
  { id: "e6", category: "contacts", name: "Lead mới từ website", description: "Form submission hoặc chatbot capture", channels: { email: true, inApp: true, sms: false, push: true, slack: true, teams: false }, priority: "high", frequency: "instant" },
  { id: "e7", category: "contacts", name: "Lead score đạt ngưỡng", description: "Khi lead score >= 80 (hot lead)", channels: { email: true, inApp: true, sms: true, push: true, slack: true, teams: false }, priority: "critical", frequency: "instant" },
  { id: "e8", category: "contacts", name: "Contact chưa liên hệ 30 ngày", description: "Cảnh báo contact bị lãng quên", channels: { email: true, inApp: true, sms: false, push: false, slack: false, teams: false }, priority: "medium", frequency: "weekly" },
  { id: "e9", category: "contacts", name: "Trùng lặp contact phát hiện", description: "AI phát hiện duplicate contacts", channels: { email: false, inApp: true, sms: false, push: false, slack: false, teams: false }, priority: "low", frequency: "daily" },

  // Tasks
  { id: "e10", category: "tasks", name: "Task được giao cho bạn", description: "Khi có task mới được assign", channels: { email: true, inApp: true, sms: false, push: true, slack: true, teams: false }, priority: "high", frequency: "instant" },
  { id: "e11", category: "tasks", name: "Task sắp đến hạn (24h)", description: "Nhắc nhở task sắp hết deadline", channels: { email: true, inApp: true, sms: false, push: true, slack: false, teams: false }, priority: "high", frequency: "instant" },
  { id: "e12", category: "tasks", name: "Task quá hạn", description: "Task đã vượt deadline", channels: { email: true, inApp: true, sms: true, push: true, slack: true, teams: false }, priority: "critical", frequency: "instant" },
  { id: "e13", category: "tasks", name: "Comment trên task/activity", description: "Khi có người bình luận", channels: { email: false, inApp: true, sms: false, push: true, slack: false, teams: false }, priority: "medium", frequency: "instant" },

  // Tickets
  { id: "e14", category: "tickets", name: "Ticket mới được tạo", description: "Khách hàng tạo ticket hỗ trợ mới", channels: { email: true, inApp: true, sms: false, push: true, slack: true, teams: false }, priority: "high", frequency: "instant" },
  { id: "e15", category: "tickets", name: "Ticket vi phạm SLA", description: "Ticket sắp hoặc đã vi phạm SLA", channels: { email: true, inApp: true, sms: true, push: true, slack: true, teams: false }, priority: "critical", frequency: "instant" },
  { id: "e16", category: "tickets", name: "Khách hàng phản hồi ticket", description: "Có reply mới từ khách hàng", channels: { email: true, inApp: true, sms: false, push: true, slack: false, teams: false }, priority: "high", frequency: "instant" },

  // Contracts
  { id: "e17", category: "contracts", name: "Hợp đồng sắp hết hạn (30 ngày)", description: "Nhắc nhở gia hạn hợp đồng", channels: { email: true, inApp: true, sms: false, push: false, slack: true, teams: false }, priority: "high", frequency: "weekly" },
  { id: "e18", category: "contracts", name: "Thanh toán quá hạn", description: "Invoice chưa được thanh toán", channels: { email: true, inApp: true, sms: true, push: true, slack: true, teams: false }, priority: "critical", frequency: "daily" },
  { id: "e19", category: "contracts", name: "Hoa hồng được tính", description: "Commission mới được calculate", channels: { email: true, inApp: true, sms: false, push: false, slack: false, teams: false }, priority: "medium", frequency: "digest" },

  // Automation
  { id: "e20", category: "automation", name: "Workflow thực thi thành công", description: "Automation rule chạy xong", channels: { email: false, inApp: true, sms: false, push: false, slack: false, teams: false }, priority: "low", frequency: "digest" },
  { id: "e21", category: "automation", name: "Workflow thực thi thất bại", description: "Automation gặp lỗi", channels: { email: true, inApp: true, sms: false, push: true, slack: true, teams: false }, priority: "critical", frequency: "instant" },
  { id: "e22", category: "automation", name: "AI Agent hoàn thành task", description: "AI agent báo cáo kết quả", channels: { email: false, inApp: true, sms: false, push: true, slack: true, teams: false }, priority: "medium", frequency: "digest" },

  // Team
  { id: "e23", category: "team", name: "Được mention trong bình luận", description: "@mention trong comment/note", channels: { email: true, inApp: true, sms: false, push: true, slack: true, teams: false }, priority: "high", frequency: "instant" },
  { id: "e24", category: "team", name: "Phê duyệt chờ xử lý", description: "Có approval request cần duyệt", channels: { email: true, inApp: true, sms: false, push: true, slack: true, teams: false }, priority: "high", frequency: "instant" },
  { id: "e25", category: "team", name: "Thành viên mới gia nhập", description: "User mới được thêm vào team", channels: { email: true, inApp: true, sms: false, push: false, slack: true, teams: false }, priority: "low", frequency: "instant" },

  // System
  { id: "e26", category: "system", name: "Đăng nhập từ thiết bị mới", description: "Phát hiện login bất thường", channels: { email: true, inApp: true, sms: true, push: true, slack: false, teams: false }, priority: "critical", frequency: "instant" },
  { id: "e27", category: "system", name: "Xuất dữ liệu lớn", description: "Khi có export >1000 records", channels: { email: true, inApp: true, sms: false, push: false, slack: true, teams: false }, priority: "high", frequency: "instant" },
  { id: "e28", category: "system", name: "Bảo trì hệ thống", description: "Thông báo maintenance scheduled", channels: { email: true, inApp: true, sms: false, push: true, slack: true, teams: false }, priority: "medium", frequency: "instant" },
  { id: "e29", category: "system", name: "Báo cáo hàng tuần", description: "Weekly performance summary", channels: { email: true, inApp: false, sms: false, push: false, slack: true, teams: false }, priority: "low", frequency: "weekly" },
];

/* ============================================================
 * Toggle Switch Component
 * ============================================================ */
function Toggle({
  checked,
  onChange,
  size = "sm",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "md";
}) {
  const sizes = size === "sm"
    ? { track: "w-8 h-4", thumb: "w-3 h-3", translate: "translate-x-4" }
    : { track: "w-10 h-5", thumb: "w-4 h-4", translate: "translate-x-5" };

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`${sizes.track} rounded-full transition-colors relative flex-shrink-0 ${
        checked ? "bg-violet-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`${sizes.thumb} bg-white rounded-full shadow-sm absolute top-0.5 left-0.5 transition-transform ${
          checked ? sizes.translate : ""
        }`}
      />
    </button>
  );
}

/* ============================================================
 * Channel Toggle Cell
 * ============================================================ */
function ChannelCell({
  enabled,
  channelEnabled,
  onChange,
}: {
  enabled: boolean;
  channelEnabled: boolean;
  onChange: (v: boolean) => void;
}) {
  if (!channelEnabled) {
    return (
      <div className="flex justify-center">
        <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 text-xs" title="Kênh chưa kích hoạt">
          —
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          enabled
            ? "bg-violet-100 text-violet-600 hover:bg-violet-200"
            : "bg-gray-50 text-gray-300 hover:bg-gray-100 hover:text-gray-500"
        }`}
      >
        {enabled ? <Check className="w-3.5 h-3.5" /> : <X className="w-3 h-3" />}
      </button>
    </div>
  );
}

/* ============================================================
 * Main Page Component
 * ============================================================ */
export function NotificationPreferencesPage() {
  const [events, setEvents] = useState<NotificationEvent[]>(INITIAL_EVENTS);
  const [channels, setChannels] = useState<Channel[]>(CHANNELS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set());
  const [showQuietHours, setShowQuietHours] = useState(false);
  const [showDigest, setShowDigest] = useState(false);

  const [quietHours, setQuietHours] = useState<QuietHoursConfig>({
    enabled: true,
    startTime: "22:00",
    endTime: "07:00",
    timezone: "Asia/Ho_Chi_Minh (UTC+7)",
    allowCritical: true,
    weekendsOff: false,
  });

  const [digest, setDigest] = useState<DigestConfig>({
    enabled: true,
    schedule: "daily",
    time: "08:00",
    includeAISummary: true,
  });

  const filteredEvents = useMemo(() => {
    let result = events;
    if (selectedCategory !== "all") {
      result = result.filter((e) => e.category === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [events, selectedCategory, search]);

  const groupedEvents = useMemo(() => {
    const map = new Map<string, NotificationEvent[]>();
    filteredEvents.forEach((e) => {
      const list = map.get(e.category) ?? [];
      list.push(e);
      map.set(e.category, list);
    });
    return map;
  }, [filteredEvents]);

  const stats = useMemo(() => {
    const total = events.length;
    let enabledCount = 0;
    events.forEach((e) => {
      if (Object.values(e.channels).some((v) => v)) enabledCount++;
    });
    const critical = events.filter((e) => e.priority === "critical").length;
    const activeChannels = channels.filter((c) => c.enabled).length;
    return { total, enabledCount, mutedCount: total - enabledCount, critical, activeChannels };
  }, [events, channels]);

  const toggleChannel = useCallback((eventId: string, channel: ChannelKey, value: boolean) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, channels: { ...e.channels, [channel]: value } } : e,
      ),
    );
  }, []);

  const toggleChannelGlobal = useCallback((channelKey: ChannelKey) => {
    setChannels((prev) =>
      prev.map((c) => (c.key === channelKey ? { ...c, enabled: !c.enabled } : c)),
    );
    toast.success("Đã cập nhật kênh thông báo");
  }, []);

  const toggleCatCollapse = (cat: string) => {
    setCollapsedCats((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const muteAll = () => {
    setEvents((prev) =>
      prev.map((e) => ({
        ...e,
        channels: { email: false, inApp: false, sms: false, push: false, slack: false, teams: false },
      })),
    );
    toast.success("Đã tắt tất cả thông báo");
  };

  const enableAllCritical = () => {
    setEvents((prev) =>
      prev.map((e) =>
        e.priority === "critical"
          ? { ...e, channels: { email: true, inApp: true, sms: true, push: true, slack: e.channels.slack, teams: e.channels.teams } }
          : e,
      ),
    );
    toast.success("Đã bật thông báo cho tất cả sự kiện quan trọng");
  };

  const updateFrequency = useCallback((eventId: string, freq: NotificationEvent["frequency"]) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, frequency: freq } : e)),
    );
  }, []);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <BellRing className="w-6 h-6 text-violet-600" /> Cài đặt Thông báo
        </h1>
        <p className="text-gray-500 mt-0.5">
          Cấu hình kênh, sự kiện, giờ im lặng, và gộp thông báo — Notification Preferences
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <Bell className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Loại sự kiện</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <BellRing className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-green-600">{stats.enabledCount}</p>
          <p className="text-xs text-green-700">Đang bật</p>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
          <BellOff className="w-4 h-4 text-gray-400 mb-1" />
          <p className="text-lg text-gray-500">{stats.mutedCount}</p>
          <p className="text-xs text-gray-500">Đang tắt</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-3">
          <AlertTriangle className="w-4 h-4 text-red-500 mb-1" />
          <p className="text-lg text-red-600">{stats.critical}</p>
          <p className="text-xs text-red-700">Quan trọng</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-3 col-span-2 sm:col-span-1">
          <Volume2 className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-violet-600">{stats.activeChannels}/{channels.length}</p>
          <p className="text-xs text-violet-700">Kênh hoạt động</p>
        </div>
      </div>

      {/* Channel Cards */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm text-gray-900 mb-3">Kênh thông báo</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <div
                key={ch.key}
                className={`rounded-xl border p-3 transition-colors ${
                  ch.enabled ? "border-violet-200 bg-violet-50/50" : "border-gray-100 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${ch.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <Toggle checked={ch.enabled} onChange={() => toggleChannelGlobal(ch.key)} />
                </div>
                <p className="text-xs text-gray-900">{ch.label}</p>
                <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-2">{ch.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiet Hours & Digest */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quiet Hours */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm text-gray-900">Giờ im lặng</h3>
            </div>
            <Toggle checked={quietHours.enabled} onChange={(v) => setQuietHours((p) => ({ ...p, enabled: v }))} size="md" />
          </div>
          {quietHours.enabled && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 block mb-1">Bắt đầu</label>
                  <input type="time" value={quietHours.startTime}
                    onChange={(e) => setQuietHours((p) => ({ ...p, startTime: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                </div>
                <span className="text-gray-300 mt-4">→</span>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 block mb-1">Kết thúc</label>
                  <input type="time" value={quietHours.endTime}
                    onChange={(e) => setQuietHours((p) => ({ ...p, endTime: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <Toggle checked={quietHours.allowCritical} onChange={(v) => setQuietHours((p) => ({ ...p, allowCritical: v }))} />
                  Cho phép thông báo "Quan trọng" xuyên giờ im lặng
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <Toggle checked={quietHours.weekendsOff} onChange={(v) => setQuietHours((p) => ({ ...p, weekendsOff: v }))} />
                  Tắt thông báo vào cuối tuần
                </label>
              </div>
              <p className="text-[9px] text-gray-400">Múi giờ: {quietHours.timezone}</p>
            </div>
          )}
        </div>

        {/* Digest */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm text-gray-900">Gộp thông báo (Digest)</h3>
            </div>
            <Toggle checked={digest.enabled} onChange={(v) => setDigest((p) => ({ ...p, enabled: v }))} size="md" />
          </div>
          {digest.enabled && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 block mb-1">Lịch gửi</label>
                  <select value={digest.schedule}
                    onChange={(e) => setDigest((p) => ({ ...p, schedule: e.target.value as DigestConfig["schedule"] }))}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                    <option value="hourly">Mỗi giờ</option>
                    <option value="every4h">Mỗi 4 giờ</option>
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 block mb-1">Thời điểm gửi</label>
                  <input type="time" value={digest.time}
                    onChange={(e) => setDigest((p) => ({ ...p, time: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <Toggle checked={digest.includeAISummary} onChange={(v) => setDigest((p) => ({ ...p, includeAISummary: v }))} />
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                Bao gồm AI Summary (tóm tắt thông minh)
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Filter & Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm sự kiện..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <select value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="all">Tất cả nhóm</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          <button type="button" onClick={enableAllCritical}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Bật tất cả Quan trọng
          </button>
          <button type="button" onClick={muteAll}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 rounded-lg border border-gray-200">
            <VolumeX className="w-3.5 h-3.5" /> Tắt hết
          </button>
        </div>
      </div>

      {/* Event Matrix */}
      <div className="space-y-4">
        {Array.from(groupedEvents.entries()).map(([catKey, catEvents]) => {
          const cat = CATEGORIES.find((c) => c.key === catKey);
          if (!cat) return null;
          const CatIcon = cat.icon;
          const isCollapsed = collapsedCats.has(catKey);

          return (
            <div key={catKey} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Category Header */}
              <button type="button"
                onClick={() => toggleCatCollapse(catKey)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  {isCollapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  <CatIcon className={`w-4 h-4 ${cat.color}`} />
                  <span className="text-sm text-gray-800">{cat.label}</span>
                  <span className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">{catEvents.length}</span>
                </div>
              </button>

              {!isCollapsed && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="text-left py-2 px-4 text-xs text-gray-400 min-w-[200px]">Sự kiện</th>
                        {channels.map((ch) => {
                          const Icon = ch.icon;
                          return (
                            <th key={ch.key} className="py-2 px-1 text-center min-w-[50px]">
                              <div className="flex flex-col items-center gap-0.5">
                                <Icon className={`w-3.5 h-3.5 ${ch.enabled ? "text-gray-500" : "text-gray-300"}`} />
                                <span className={`text-[8px] ${ch.enabled ? "text-gray-400" : "text-gray-300"}`}>{ch.label}</span>
                              </div>
                            </th>
                          );
                        })}
                        <th className="py-2 px-2 text-center text-xs text-gray-400 min-w-[80px]">Tần suất</th>
                        <th className="py-2 px-2 text-center text-xs text-gray-400 min-w-[60px]">Mức</th>
                      </tr>
                    </thead>
                    <tbody>
                      {catEvents.map((event) => (
                        <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-2.5 px-4">
                            <p className="text-xs text-gray-900">{event.name}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">{event.description}</p>
                          </td>
                          {channels.map((ch) => (
                            <td key={ch.key} className="py-2.5 px-1">
                              <ChannelCell
                                enabled={event.channels[ch.key]}
                                channelEnabled={ch.enabled}
                                onChange={(v) => toggleChannel(event.id, ch.key, v)}
                              />
                            </td>
                          ))}
                          <td className="py-2.5 px-2 text-center">
                            <select value={event.frequency}
                              onChange={(e) => updateFrequency(event.id, e.target.value as NotificationEvent["frequency"])}
                              className="text-[10px] px-1.5 py-1 border border-gray-200 rounded bg-white text-gray-600">
                              <option value="instant">Tức thì</option>
                              <option value="digest">Gộp</option>
                              <option value="daily">Ngày</option>
                              <option value="weekly">Tuần</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`text-[8px] px-1.5 py-0.5 rounded ${PRIORITY_COLORS[event.priority]}`}>
                              {event.priority === "critical" ? "Quan trọng" :
                               event.priority === "high" ? "Cao" :
                               event.priority === "medium" ? "TB" : "Thấp"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Notification Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Bạn nhận trung bình <strong>47 thông báo/ngày</strong>. Gợi ý chuyển 12 sự kiện "medium" sang digest mode để giảm <strong>~60% noise</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Kênh <strong>SMS</strong> đang bật cho 4 sự kiện non-critical — recommend chỉ giữ SMS cho "Deal won/lost" và "SLA vi phạm" để tiết kiệm chi phí.</span>
          </p>
          <p className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Giờ im lặng 22:00–07:00 đã chặn <strong>~15 thông báo/đêm</strong>. 2 thông báo critical vẫn được gửi qua nhờ "allowCritical".</span>
          </p>
        </div>
      </div>
    </div>
  );
}
