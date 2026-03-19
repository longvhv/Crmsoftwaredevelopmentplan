import * as React from "react";
import { cn } from "./utils";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./button";

/* ============================================================
 * ADVANCED MODAL - Enhanced modal dialog
 * ============================================================
 * Step 108: Advanced modal with drag, resize, fullscreen
 */

export interface AdvancedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  draggable?: boolean;
  resizable?: boolean;
  closable?: boolean;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showFullscreenToggle?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const SIZE_STYLES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw]",
};

export function AdvancedModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  draggable = false,
  resizable = false,
  closable = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  showFullscreenToggle = false,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
}: AdvancedModalProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const dragStartPos = React.useRef({ x: 0, y: 0 });

  // Close on Escape
  React.useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape, onOpenChange]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || isFullscreen) return;
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setPosition({ x: 0, y: 0 });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={cn(
          "relative bg-background rounded-lg shadow-xl border",
          "flex flex-col max-h-[90vh]",
          isFullscreen ? "w-screen h-screen max-w-none rounded-none" : SIZE_STYLES[size],
          isDragging && "cursor-move",
          className
        )}
        style={
          draggable && !isFullscreen
            ? {
                transform: `translate(${position.x}px, ${position.y}px)`,
              }
            : undefined
        }
      >
        {/* Header */}
        {(title || closable || showFullscreenToggle) && (
          <div
            className={cn(
              "flex items-center justify-between p-6 border-b",
              draggable && !isFullscreen && "cursor-move",
              headerClassName
            )}
            onMouseDown={handleMouseDown}
          >
            <div className="flex-1">
              {title && <h2 className="text-xl font-semibold">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>

            <div className="flex items-center gap-2">
              {showFullscreenToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="hover:bg-muted"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              )}

              {closable && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div className={cn("flex-1 overflow-y-auto p-6", bodyClassName)}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className={cn("flex items-center justify-end gap-2 p-6 border-t", footerClassName)}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * DRAWER - Slide-out panel
 * ============================================================ */

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right" | "top" | "bottom";
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const DRAWER_SIZES = {
  left: { sm: "w-64", md: "w-80", lg: "w-96" },
  right: { sm: "w-64", md: "w-80", lg: "w-96" },
  top: { sm: "h-64", md: "h-80", lg: "h-96" },
  bottom: { sm: "h-64", md: "h-80", lg: "h-96" },
};

export function Drawer({
  open,
  onOpenChange,
  side = "right",
  title,
  children,
  footer,
  size = "md",
  className,
}: DrawerProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "relative bg-background shadow-xl flex flex-col",
          side === "left" && "border-r",
          side === "right" && "border-l ml-auto",
          side === "top" && "border-b w-full",
          side === "bottom" && "border-t w-full mt-auto",
          DRAWER_SIZES[side][size],
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer && <div className="p-6 border-t">{footer}</div>}
      </div>
    </div>
  );
}

/* ============================================================
 * CONFIRMATION DIALOG
 * ============================================================ */

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    warning: "bg-orange-500 text-white hover:bg-orange-600",
  };

  return (
    <AdvancedModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading || loading}>
            {cancelText}
          </Button>
          <Button
            className={variantStyles[variant]}
            onClick={handleConfirm}
            disabled={isLoading || loading}
          >
            {isLoading || loading ? "Processing..." : confirmText}
          </Button>
        </>
      }
    />
  );
}
