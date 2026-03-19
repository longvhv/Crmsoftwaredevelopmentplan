import * as React from "react";
import { Bell, X, Check, Trash2, Settings, Filter } from "lucide-react";
import { cn } from "./utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Drawer, DrawerBody, DrawerFooter } from "./drawer";

/* ============================================================
 * TYPES
 * ============================================================ */

export type NotificationPriority = "low" | "medium" | "high" | "urgent";
export type NotificationCategory = "system" | "deal" | "contact" | "task" | "message" | "alert";

export interface Notification {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: Record<string, any>;
}

/* ============================================================
 * NOTIFICATION CONTEXT
 * ============================================================ */

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = React.createContext<NotificationContextValue | null>(null);

/* ============================================================
 * NOTIFICATION PROVIDER
 * ============================================================ */

export interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 50,
}) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = React.useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: `notification-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, maxNotifications));
    },
    [maxNotifications]
  );

  const markAsRead = React.useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const deleteNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = React.useMemo(
    () => notifications.filter((notif) => !notif.read).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/* ============================================================
 * USE NOTIFICATION HOOK
 * ============================================================ */

export const useNotification = () => {
  const context = React.useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return context;
};

/* ============================================================
 * NOTIFICATION CENTER COMPONENT
 * ============================================================ */

export interface NotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position?: "left" | "right";
  width?: "sm" | "md" | "lg";
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  open,
  onOpenChange,
  position = "right",
  width = "md",
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useNotification();

  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [categoryFilter, setCategoryFilter] = React.useState<NotificationCategory | "all">("all");

  const filteredNotifications = React.useMemo(() => {
    let filtered = notifications;

    if (filter === "unread") {
      filtered = filtered.filter((notif) => !notif.read);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((notif) => notif.category === categoryFilter);
    }

    return filtered;
  }, [notifications, filter, categoryFilter]);

  const widthClasses = {
    sm: "sm",
    md: "md",
    lg: "lg",
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      position={position}
      size={widthClasses[width]}
      title={
        <div className="flex items-center gap-2">
          <Bell className="size-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="primary" className="ml-1">
              {unreadCount}
            </Badge>
          )}
        </div>
      }
    >
      <DrawerBody className="p-0">
        {/* Header Actions */}
        <div className="px-4 py-3 border-b border-border bg-accent/30 space-y-3">
          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread ({unreadCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="gap-2 flex-1"
            >
              <Check className="size-4" />
              Mark all read
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearAll}
              disabled={notifications.length === 0}
              className="gap-2 flex-1"
            >
              <Trash2 className="size-4" />
              Clear all
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-border">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="size-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1">
                {filter === "unread" ? "You're all caught up!" : "You'll see notifications here"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>
      </DrawerBody>
    </Drawer>
  );
};

/* ============================================================
 * NOTIFICATION ITEM
 * ============================================================ */

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Priority colors
  const priorityColors: Record<NotificationPriority, string> = {
    low: "bg-gray-500",
    medium: "bg-blue-500",
    high: "bg-[var(--warning)]",
    urgent: "bg-[var(--error)]",
  };

  // Category icons
  const categoryIcons: Record<NotificationCategory, string> = {
    system: "⚙️",
    deal: "💼",
    contact: "👤",
    task: "✓",
    message: "💬",
    alert: "🔔",
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={cn(
        "relative px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer",
        !notification.read && "bg-accent/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!notification.read) {
          onMarkAsRead(notification.id);
        }
      }}
    >
      <div className="flex gap-3">
        {/* Unread indicator */}
        {!notification.read && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--brand-primary)]" />
        )}

        {/* Avatar or Icon */}
        <div className="shrink-0">
          {notification.avatar ? (
            <img
              src={notification.avatar}
              alt=""
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="size-10 rounded-full bg-accent flex items-center justify-center text-lg">
              {notification.icon || categoryIcons[notification.category]}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            {isHovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="shrink-0 p-1 rounded hover:bg-accent transition-colors"
                aria-label="Delete notification"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.description}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(notification.timestamp)}
            </span>
            <span className={cn("size-1 rounded-full", priorityColors[notification.priority])} />
            <span className="text-xs text-muted-foreground capitalize">
              {notification.category}
            </span>
          </div>

          {/* Action Button */}
          {notification.action && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                notification.action!.onClick();
              }}
              className="text-sm font-medium text-[var(--brand-primary)] hover:underline mt-2"
            >
              {notification.action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
 * NOTIFICATION BELL BUTTON
 * ============================================================ */

export interface NotificationBellProps {
  onClick?: () => void;
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onClick, className }) => {
  const { unreadCount } = useNotification();

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-lg hover:bg-accent transition-colors",
        className
      )}
      aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
    >
      <Bell className="size-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[var(--error)] rounded-full">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};
