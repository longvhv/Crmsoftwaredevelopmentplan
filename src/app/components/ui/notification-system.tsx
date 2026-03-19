import * as React from "react";
import { cn } from "./utils";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "./button";

/* ============================================================
 * NOTIFICATION SYSTEM - Advanced notification center
 * ============================================================
 * Step 109: Toast notifications with queue, actions, and persistence
 */

export interface Notification {
  id: string;
  type?: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  persistent?: boolean;
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = React.createContext<NotificationContextValue | undefined>(undefined);

export function useNotifications() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}

/* ============================================================
 * NOTIFICATION PROVIDER
 * ============================================================ */

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = React.useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after duration (unless persistent)
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
}

/* ============================================================
 * NOTIFICATION CONTAINER
 * ============================================================ */

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => {
            notification.onClose?.();
            onRemove(notification.id);
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
 * NOTIFICATION ITEM
 * ============================================================ */

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NOTIFICATION_ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-destructive" />,
  warning: <AlertTriangle className="w-5 h-5 text-orange-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const NOTIFICATION_STYLES = {
  success: "border-green-500/50 bg-green-50 dark:bg-green-950",
  error: "border-destructive/50 bg-destructive/5",
  warning: "border-orange-500/50 bg-orange-50 dark:bg-orange-950",
  info: "border-blue-500/50 bg-blue-50 dark:bg-blue-950",
};

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={cn(
        "pointer-events-auto w-80 rounded-lg border-2 bg-background p-4 shadow-lg",
        "transition-all duration-300 animate-in slide-in-from-right",
        isExiting && "animate-out slide-out-to-right",
        notification.type && NOTIFICATION_STYLES[notification.type]
      )}
    >
      <div className="flex gap-3">
        {notification.type && (
          <div className="flex-shrink-0">{NOTIFICATION_ICONS[notification.type]}</div>
        )}

        <div className="flex-1 space-y-1">
          <h4 className="font-semibold">{notification.title}</h4>
          {notification.description && (
            <p className="text-sm text-muted-foreground">{notification.description}</p>
          )}

          {notification.action && (
            <Button
              variant="link"
              size="sm"
              onClick={notification.action.onClick}
              className="h-auto p-0 text-primary"
            >
              {notification.action.label}
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="flex-shrink-0 h-6 w-6 hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

/* ============================================================
 * TOAST HOOK - Simpler API
 * ============================================================ */

export function useToast() {
  const { addNotification } = useNotifications();

  return {
    toast: addNotification,
    success: (title: string, description?: string) =>
      addNotification({ type: "success", title, description }),
    error: (title: string, description?: string) =>
      addNotification({ type: "error", title, description }),
    warning: (title: string, description?: string) =>
      addNotification({ type: "warning", title, description }),
    info: (title: string, description?: string) =>
      addNotification({ type: "info", title, description }),
  };
}

/* ============================================================
 * INLINE NOTIFICATION - For form/page alerts
 * ============================================================ */

export interface InlineNotificationProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function InlineNotification({
  type = "info",
  title,
  description,
  dismissible = false,
  onDismiss,
  action,
  className,
}: InlineNotificationProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4",
        NOTIFICATION_STYLES[type],
        className
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">{NOTIFICATION_ICONS[type]}</div>

        <div className="flex-1 space-y-1">
          {title && <h4 className="font-semibold">{title}</h4>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}

          {action && (
            <Button
              variant="link"
              size="sm"
              onClick={action.onClick}
              className="h-auto p-0 text-primary"
            >
              {action.label}
            </Button>
          )}
        </div>

        {dismissible && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="flex-shrink-0 h-6 w-6 hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * NOTIFICATION BELL - Icon with badge
 * ============================================================ */

export interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function NotificationBell({ count = 0, onClick, className }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-lg hover:bg-muted transition-colors",
        className
      )}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
