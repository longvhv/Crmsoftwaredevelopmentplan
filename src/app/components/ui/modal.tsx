import * as React from "react";
import { X } from "lucide-react";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type ModalVariant = "default" | "danger" | "success" | "warning" | "info";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

export interface UseModalOptions {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseModalReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

/* ============================================================
 * HOOKS
 * ============================================================ */

export const useModal = ({
  defaultOpen = false,
  onOpenChange,
}: UseModalOptions = {}): UseModalReturn => {
  const [open, setOpenInternal] = React.useState(defaultOpen);

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      setOpenInternal(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange]
  );

  const openModal = React.useCallback(() => setOpen(true), [setOpen]);
  const closeModal = React.useCallback(() => setOpen(false), [setOpen]);
  const toggleModal = React.useCallback(() => setOpen(!open), [open, setOpen]);

  return {
    open,
    setOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

/* ============================================================
 * MODAL COMPONENT
 * ============================================================ */

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  children,
  size = "md",
  variant = "default",
  title,
  description,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventScroll = true,
  className,
  overlayClassName,
  contentClassName,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (open && preventScroll) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open, preventScroll]);

  // Close on escape key
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

  // Focus trap
  React.useEffect(() => {
    if (!open) return;

    const focusableElements = contentRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    firstElement.focus();

    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  if (!open) return null;

  // Size classes
  const sizeClasses: Record<ModalSize, string> = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
  };

  // Variant styles
  const variantStyles: Record<ModalVariant, { border: string; title: string; icon?: string }> = {
    default: {
      border: "border-border",
      title: "text-foreground",
    },
    danger: {
      border: "border-[var(--error)]/30",
      title: "text-[var(--error)]",
      icon: "🚨",
    },
    success: {
      border: "border-[var(--success)]/30",
      title: "text-[var(--success)]",
      icon: "✅",
    },
    warning: {
      border: "border-[var(--warning)]/30",
      title: "text-[var(--warning)]",
      icon: "⚠️",
    },
    info: {
      border: "border-[var(--brand-primary)]/30",
      title: "text-[var(--brand-primary)]",
      icon: "ℹ️",
    },
  };

  const variantStyle = variantStyles[variant];

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
          "animate-in fade-in-0 duration-200",
          overlayClassName
        )}
        onClick={() => closeOnOverlayClick && onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        <div
          ref={contentRef}
          className={cn(
            "relative w-full bg-card rounded-lg shadow-2xl border",
            "animate-in zoom-in-95 fade-in-0 duration-200",
            sizeClasses[size],
            variantStyle.border,
            size === "full" && "h-[calc(100vh-2rem)]",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || description || showCloseButton) && (
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h2
                      id="modal-title"
                      className={cn("text-lg font-semibold flex items-center gap-2", variantStyle.title)}
                    >
                      {variantStyle.icon && <span>{variantStyle.icon}</span>}
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id="modal-description"
                      className="text-sm text-muted-foreground mt-1"
                    >
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={() => onOpenChange(false)}
                    className="shrink-0 p-2 rounded-lg hover:bg-accent transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="size-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div
            className={cn(
              "overflow-y-auto",
              size === "full" ? "max-h-[calc(100vh-12rem)]" : "max-h-[calc(100vh-16rem)]",
              contentClassName
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

Modal.displayName = "Modal";

/* ============================================================
 * MODAL SECTIONS
 * ============================================================ */

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
};

ModalBody.displayName = "ModalBody";

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => {
  return (
    <div className={cn("px-6 py-4 border-t border-border bg-accent/30", className)}>
      {children}
    </div>
  );
};

ModalFooter.displayName = "ModalFooter";

/* ============================================================
 * MODAL STACK MANAGER
 * ============================================================ */

interface ModalStackContext {
  modals: string[];
  registerModal: (id: string) => void;
  unregisterModal: (id: string) => void;
  getZIndex: (id: string) => number;
}

const ModalStackContext = React.createContext<ModalStackContext | null>(null);

export const ModalStackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modals, setModals] = React.useState<string[]>([]);

  const registerModal = React.useCallback((id: string) => {
    setModals((prev) => [...prev, id]);
  }, []);

  const unregisterModal = React.useCallback((id: string) => {
    setModals((prev) => prev.filter((modalId) => modalId !== id));
  }, []);

  const getZIndex = React.useCallback(
    (id: string) => {
      const index = modals.indexOf(id);
      return index === -1 ? 50 : 50 + index;
    },
    [modals]
  );

  return (
    <ModalStackContext.Provider value={{ modals, registerModal, unregisterModal, getZIndex }}>
      {children}
    </ModalStackContext.Provider>
  );
};

export const useModalStack = (id: string) => {
  const context = React.useContext(ModalStackContext);
  
  React.useEffect(() => {
    if (context) {
      context.registerModal(id);
      return () => context.unregisterModal(id);
    }
  }, [context, id]);

  return context?.getZIndex(id) ?? 50;
};
