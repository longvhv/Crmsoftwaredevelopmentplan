import * as React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "loading";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
  onClose?: () => void;
  progress?: boolean;
  icon?: React.ReactNode;
}

export interface ToastOptions extends Omit<Toast, "id"> {
  id?: string;
}

/* ============================================================
 * TOAST CONTEXT
 * ============================================================ */

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: ToastOptions) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<Toast>) => void;
  clearToasts: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/* ============================================================
 * TOAST PROVIDER
 * ============================================================ */

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "top-right",
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    (options: ToastOptions): string => {
      const id = options.id || `toast-${Date.now()}-${Math.random()}`;
      const toast: Toast = {
        ...options,
        id,
        variant: options.variant || "default",
        duration: options.duration !== undefined ? options.duration : 5000,
        progress: options.progress !== false,
      };

      setToasts((prev) => {
        const newToasts = [toast, ...prev];
        return newToasts.slice(0, maxToasts);
      });

      // Auto-dismiss
      if (toast.duration && toast.duration > 0 && toast.variant !== "loading") {
        setTimeout(() => {
          removeToast(id);
        }, toast.duration);
      }

      return id;
    },
    [maxToasts]
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = React.useCallback((id: string, updates: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast))
    );
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} position={position} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

/* ============================================================
 * USE TOAST HOOK
 * ============================================================ */

export interface UseToastReturn {
  toast: (options: ToastOptions) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  loading: (title: string, description?: string) => string;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => Promise<T>;
  dismiss: (id: string) => void;
  update: (id: string, options: Partial<Toast>) => void;
  clear: () => void;
}

export const useToast = (): UseToastReturn => {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  const { addToast, removeToast, updateToast, clearToasts } = context;

  const toast = React.useCallback(
    (options: ToastOptions) => {
      return addToast(options);
    },
    [addToast]
  );

  const success = React.useCallback(
    (title: string, description?: string) => {
      return addToast({ title, description, variant: "success" });
    },
    [addToast]
  );

  const error = React.useCallback(
    (title: string, description?: string) => {
      return addToast({ title, description, variant: "error" });
    },
    [addToast]
  );

  const warning = React.useCallback(
    (title: string, description?: string) => {
      return addToast({ title, description, variant: "warning" });
    },
    [addToast]
  );

  const info = React.useCallback(
    (title: string, description?: string) => {
      return addToast({ title, description, variant: "info" });
    },
    [addToast]
  );

  const loading = React.useCallback(
    (title: string, description?: string) => {
      return addToast({ title, description, variant: "loading", duration: 0 });
    },
    [addToast]
  );

  const promiseToast = React.useCallback(
    async <T,>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      }
    ): Promise<T> => {
      const id = addToast({
        title: options.loading,
        variant: "loading",
        duration: 0,
      });

      try {
        const data = await promise;
        const successMessage =
          typeof options.success === "function" ? options.success(data) : options.success;

        updateToast(id, {
          title: successMessage,
          variant: "success",
          duration: 5000,
        });

        setTimeout(() => removeToast(id), 5000);
        return data;
      } catch (err) {
        const errorMessage =
          typeof options.error === "function" ? options.error(err) : options.error;

        updateToast(id, {
          title: errorMessage,
          variant: "error",
          duration: 5000,
        });

        setTimeout(() => removeToast(id), 5000);
        throw err;
      }
    },
    [addToast, updateToast, removeToast]
  );

  return {
    toast,
    success,
    error,
    warning,
    info,
    loading,
    promise: promiseToast,
    dismiss: removeToast,
    update: updateToast,
    clear: clearToasts,
  };
};

/* ============================================================
 * TOAST CONTAINER
 * ============================================================ */

interface ToastContainerProps {
  toasts: Toast[];
  position: ToastPosition;
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, position, onRemove }) => {
  const positionClasses: Record<ToastPosition, string> = {
    "top-left": "top-0 left-0 items-start",
    "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
    "top-right": "top-0 right-0 items-end",
    "bottom-left": "bottom-0 left-0 items-start",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
    "bottom-right": "bottom-0 right-0 items-end",
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-[100] flex flex-col gap-2 p-4 pointer-events-none",
        "max-w-[calc(100vw-2rem)] sm:max-w-md",
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

/* ============================================================
 * TOAST ITEM
 * ============================================================ */

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = React.useState(false);
  const [progress, setProgress] = React.useState(100);

  // Progress bar animation
  React.useEffect(() => {
    if (!toast.progress || !toast.duration || toast.duration <= 0) return;

    const startTime = Date.now();
    const duration = toast.duration;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [toast.duration, toast.progress]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
      toast.onClose?.();
    }, 200);
  };

  // Variant config
  const variantConfig: Record<
    ToastVariant,
    {
      icon: React.ReactNode;
      iconBg: string;
      iconColor: string;
      border: string;
    }
  > = {
    default: {
      icon: <Info className="size-5" />,
      iconBg: "bg-accent",
      iconColor: "text-foreground",
      border: "border-border",
    },
    success: {
      icon: <CheckCircle className="size-5" />,
      iconBg: "bg-[var(--success)]/10",
      iconColor: "text-[var(--success)]",
      border: "border-[var(--success)]/30",
    },
    error: {
      icon: <AlertCircle className="size-5" />,
      iconBg: "bg-[var(--error)]/10",
      iconColor: "text-[var(--error)]",
      border: "border-[var(--error)]/30",
    },
    warning: {
      icon: <AlertTriangle className="size-5" />,
      iconBg: "bg-[var(--warning)]/10",
      iconColor: "text-[var(--warning)]",
      border: "border-[var(--warning)]/30",
    },
    info: {
      icon: <Info className="size-5" />,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      border: "border-blue-500/30",
    },
    loading: {
      icon: <Loader2 className="size-5 animate-spin" />,
      iconBg: "bg-[var(--brand-primary)]/10",
      iconColor: "text-[var(--brand-primary)]",
      border: "border-[var(--brand-primary)]/30",
    },
  };

  const config = variantConfig[toast.variant || "default"];
  const displayIcon = toast.icon || config.icon;

  return (
    <div
      className={cn(
        "relative w-full bg-card border rounded-lg shadow-lg pointer-events-auto",
        "overflow-hidden",
        config.border,
        isExiting
          ? "animate-out fade-out-0 slide-out-to-right-full duration-200"
          : "animate-in fade-in-0 slide-in-from-right-full duration-300"
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex gap-3 p-4">
        {/* Icon */}
        <div className={cn("shrink-0 p-2 rounded-full", config.iconBg, config.iconColor)}>
          {displayIcon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="font-semibold text-sm">{toast.title}</div>
          {toast.description && (
            <div className="text-sm text-muted-foreground mt-1">{toast.description}</div>
          )}

          {/* Action */}
          {toast.action && (
            <button
              onClick={() => {
                toast.action!.onClick();
                handleClose();
              }}
              className="text-sm font-medium text-[var(--brand-primary)] hover:underline mt-2"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close button */}
        {toast.variant !== "loading" && (
          <button
            onClick={handleClose}
            className="shrink-0 p-1 rounded-md hover:bg-accent transition-colors"
            aria-label="Close notification"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {toast.progress && toast.duration && toast.duration > 0 && (
        <div className="h-1 bg-accent">
          <div
            className={cn("h-full transition-all", config.iconColor.replace("text-", "bg-"))}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

ToastItem.displayName = "ToastItem";
