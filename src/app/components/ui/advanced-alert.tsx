import * as React from "react";
import { cn } from "./utils";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./button";

/* ============================================================
 * ADVANCED ALERT - Enhanced alert component
 * ============================================================
 * Step 110: Advanced alerts with collapsible content, actions
 */

export interface AdvancedAlertProps {
  variant?: "default" | "success" | "error" | "warning" | "info";
  title?: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onDismiss?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost";
  }>;
  className?: string;
}

const ALERT_VARIANTS = {
  default: {
    container: "border-border bg-background",
    icon: <Info className="w-5 h-5" />,
    iconColor: "text-muted-foreground",
  },
  success: {
    container: "border-green-500/50 bg-green-50 dark:bg-green-950",
    icon: <CheckCircle2 className="w-5 h-5" />,
    iconColor: "text-green-600 dark:text-green-400",
  },
  error: {
    container: "border-destructive/50 bg-destructive/5",
    icon: <AlertCircle className="w-5 h-5" />,
    iconColor: "text-destructive",
  },
  warning: {
    container: "border-orange-500/50 bg-orange-50 dark:bg-orange-950",
    icon: <AlertTriangle className="w-5 h-5" />,
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  info: {
    container: "border-blue-500/50 bg-blue-50 dark:bg-blue-950",
    icon: <Info className="w-5 h-5" />,
    iconColor: "text-blue-600 dark:text-blue-400",
  },
};

export function AdvancedAlert({
  variant = "default",
  title,
  description,
  children,
  icon,
  dismissible = false,
  collapsible = false,
  defaultCollapsed = false,
  onDismiss,
  actions,
  className,
}: AdvancedAlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const variantConfig = ALERT_VARIANTS[variant];
  const displayIcon = icon ?? variantConfig.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4",
        variantConfig.container,
        className
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn("flex-shrink-0", variantConfig.iconColor)}>
          {displayIcon}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {title && (
                <h4 className="font-semibold leading-tight">{title}</h4>
              )}
              {description && !isCollapsed && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              {collapsible && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="h-6 w-6 hover:bg-muted"
                >
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </Button>
              )}

              {dismissible && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDismiss}
                  className="h-6 w-6 hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Collapsible Content */}
          {!isCollapsed && children && (
            <div className="text-sm">{children}</div>
          )}

          {/* Actions */}
          {!isCollapsed && actions && actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * BANNER ALERT - Full-width banner style
 * ============================================================ */

export interface BannerAlertProps {
  variant?: "default" | "success" | "error" | "warning" | "info";
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function BannerAlert({
  variant = "info",
  message,
  action,
  dismissible = true,
  onDismiss,
  className,
}: BannerAlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const variantConfig = ALERT_VARIANTS[variant];

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-6 py-3 border-b-2",
        variantConfig.container,
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className={variantConfig.iconColor}>
          {variantConfig.icon}
        </div>
        <p className="text-sm font-medium">{message}</p>
      </div>

      <div className="flex items-center gap-2">
        {action && (
          <Button variant="ghost" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}

        {dismissible && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * FLOATING ALERT - Positioned alert
 * ============================================================ */

export interface FloatingAlertProps {
  variant?: "default" | "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  position?: "top" | "bottom";
  duration?: number;
  onClose?: () => void;
  className?: string;
}

export function FloatingAlert({
  variant = "info",
  title,
  description,
  position = "top",
  duration = 5000,
  onClose,
  className,
}: FloatingAlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const variantConfig = ALERT_VARIANTS[variant];

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 w-96 max-w-[90vw]",
        "rounded-lg border-2 shadow-lg p-4",
        "animate-in slide-in-from-top",
        position === "top" ? "top-4" : "bottom-4",
        variantConfig.container,
        className
      )}
    >
      <div className="flex gap-3">
        <div className={cn("flex-shrink-0", variantConfig.iconColor)}>
          {variantConfig.icon}
        </div>

        <div className="flex-1 space-y-1">
          <h4 className="font-semibold">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="h-6 w-6 hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

/* ============================================================
 * ALERT LIST - Stacked alerts
 * ============================================================ */

export interface AlertItem {
  id: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  dismissible?: boolean;
}

export interface AlertListProps {
  alerts: AlertItem[];
  onDismiss?: (id: string) => void;
  className?: string;
}

export function AlertList({ alerts, onDismiss, className }: AlertListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {alerts.map((alert) => (
        <AdvancedAlert
          key={alert.id}
          variant={alert.variant}
          title={alert.title}
          description={alert.description}
          dismissible={alert.dismissible}
          onDismiss={() => onDismiss?.(alert.id)}
        />
      ))}
    </div>
  );
}
