/**
 * Trung tâm Thông báo — hiển thị notifications từ AI insights,
 * deal stage changes, và activity reminders.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Bot,
  Target,
  AlertTriangle,
  Info,
  X,
  Check,
  Clock,
} from "lucide-react";

/* ============================================================
 * Types
 * ============================================================ */
interface Notification {
  id: string;
  type: "ai-insight" | "deal-update" | "reminder" | "system";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

/* ============================================================
 * Mock notifications
 * ============================================================ */
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "ai-insight",
    priority: "high",
    title: "AI phát hiện deal nóng",
    message: "Deal TechCorp ERP có xác suất thắng 82%. Khuyến nghị gửi proposal cuối cùng ngay.",
    timestamp: "2026-03-03T10:30:00",
    isRead: false,
    actionUrl: "/crm/pipeline",
  },
  {
    id: "n2",
    type: "reminder",
    priority: "high",
    title: "Follow-up quá hạn",
    message: "Liên hệ RetailPlus không có tương tác từ 78 ngày. Cần re-engage hoặc đánh dấu inactive.",
    timestamp: "2026-03-03T09:15:00",
    isRead: false,
    actionUrl: "/crm/contacts",
  },
  {
    id: "n3",
    type: "deal-update",
    priority: "medium",
    title: "Deal chuyển giai đoạn",
    message: "FinanceApp Mobile đã chuyển từ \"Đề xuất\" sang \"Đàm phán\" bởi Trần Minh Tuấn.",
    timestamp: "2026-03-03T08:45:00",
    isRead: false,
    actionUrl: "/crm/pipeline",
  },
  {
    id: "n4",
    type: "ai-insight",
    priority: "medium",
    title: "AI BDR tạo leads mới",
    message: "AI BDR Agent đã tạo 12 leads mới tuần này, tăng 20%. 3 leads có score > 80 cần follow-up.",
    timestamp: "2026-03-02T17:00:00",
    isRead: false,
  },
  {
    id: "n5",
    type: "system",
    priority: "low",
    title: "Báo cáo tuần sẵn sàng",
    message: "Báo cáo CRM tuần 09/2026 đã được AI tổng hợp. Xem tại Dashboard.",
    timestamp: "2026-03-02T08:00:00",
    isRead: true,
    actionUrl: "/crm",
  },
  {
    id: "n6",
    type: "deal-update",
    priority: "high",
    title: "Deal thắng!",
    message: "CloudMigration đã chuyển sang Closed-Won. Giá trị: $45,000. Ch��c mừng team! 🎉",
    timestamp: "2026-03-01T16:30:00",
    isRead: true,
  },
  {
    id: "n7",
    type: "reminder",
    priority: "medium",
    title: "Cuộc họp sắp tới",
    message: "Họp review pipeline với CEO lúc 14:00 hôm nay. Chuẩn bị slides forecast Q2.",
    timestamp: "2026-03-03T07:00:00",
    isRead: true,
  },
  {
    id: "n8",
    type: "ai-insight",
    priority: "low",
    title: "Phân tích sentiment email",
    message: "AI phát hiện tone email từ DataStream Corp có dấu hiệu tích cực. Khuyến nghị đẩy mạnh đàm phán.",
    timestamp: "2026-02-28T14:20:00",
    isRead: true,
  },
];

/* ============================================================
 * Icon & color mapping
 * ============================================================ */
const TYPE_CONFIG: Record<
  Notification["type"],
  { icon: React.ReactNode; color: string; bg: string }
> = {
  "ai-insight": {
    icon: <Bot className="w-4 h-4" />,
    color: "text-violet-600",
    bg: "bg-violet-100",
  },
  "deal-update": {
    icon: <Target className="w-4 h-4" />,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  reminder: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  system: {
    icon: <Info className="w-4 h-4" />,
    color: "text-gray-600",
    bg: "bg-gray-100",
  },
};

const PRIORITY_DOT: Record<Notification["priority"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-gray-300",
};

/* ============================================================
 * Format relative time
 * ============================================================ */
function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date("2026-03-03T12:00:00");
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}

/* ============================================================
 * Notification Item
 * ============================================================ */
function NotificationItem({
  notification,
  onMarkRead,
  onNavigate,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onNavigate: (url: string) => void;
}) {
  const config = TYPE_CONFIG[notification.type];

  return (
    <div
      onClick={() => {
        if (notification.actionUrl) {
          onNavigate(notification.actionUrl);
        }
        if (!notification.isRead) {
          onMarkRead(notification.id);
        }
      }}
      className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.isRead ? "bg-violet-50/30" : ""
      }`}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-full ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h4 className={`text-sm flex-1 ${!notification.isRead ? "text-gray-900" : "text-gray-600"}`}>
            {!notification.isRead && (
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[notification.priority]} mr-1.5 align-middle`} />
            )}
            {notification.title}
          </h4>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
        <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {formatRelativeTime(notification.timestamp)}
        </span>
      </div>

      {/* Mark as read */}
      {!notification.isRead && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead(notification.id);
          }}
          className="flex-shrink-0 p-1 text-gray-300 hover:text-green-600 transition-colors"
          title="Đánh dấu đã đọc"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/* ============================================================
 * Component chính
 * ============================================================ */
export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<Notification["type"] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered = filterType
    ? notifications.filter((n) => n.type === filterType)
    : notifications;

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const handleNavigate = useCallback((url: string) => {
    navigate(url);
    setIsOpen(false);
  }, [navigate]);

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-[360px] sm:w-[400px] bg-white border border-gray-200 rounded-xl shadow-xl max-h-[500px] flex flex-col z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm text-gray-900">Thông báo</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs text-violet-600 hover:text-violet-700 px-2 py-1 hover:bg-violet-50 rounded transition-colors"
                >
                  Đọc tất cả
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="px-3 py-2 border-b border-gray-50 flex items-center gap-1 overflow-x-auto flex-shrink-0">
            {([
              { key: null, label: "Tất cả" },
              { key: "ai-insight" as const, label: "AI" },
              { key: "deal-update" as const, label: "Deals" },
              { key: "reminder" as const, label: "Nhắc nhở" },
              { key: "system" as const, label: "Hệ thống" },
            ]).map((tab) => (
              <button
                key={tab.key ?? "all"}
                type="button"
                onClick={() => setFilterType(tab.key)}
                className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                  filterType === tab.key
                    ? "bg-violet-100 text-violet-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <Bell className="w-6 h-6 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Không có thông báo</p>
              </div>
            ) : (
              filtered.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={handleMarkRead}
                  onNavigate={handleNavigate}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100 text-center flex-shrink-0">
            <span className="text-[10px] text-gray-400">
              {notifications.length} thông báo · {unreadCount} chưa đọc
            </span>
          </div>
        </div>
      )}
    </div>
  );
}