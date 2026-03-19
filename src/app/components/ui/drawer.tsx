import * as React from "react";
import { X } from "lucide-react";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export type DrawerPosition = "left" | "right" | "top" | "bottom";
export type DrawerSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  position?: DrawerPosition;
  size?: DrawerSize;
  title?: React.ReactNode;
  description?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  className?: string;
  overlayClassName?: string;
}

export interface UseDrawerOptions {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseDrawerReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

/* ============================================================
 * HOOKS
 * ============================================================ */

export const useDrawer = ({
  defaultOpen = false,
  onOpenChange,
}: UseDrawerOptions = {}): UseDrawerReturn => {
  const [open, setOpenInternal] = React.useState(defaultOpen);

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      setOpenInternal(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange]
  );

  const openDrawer = React.useCallback(() => setOpen(true), [setOpen]);
  const closeDrawer = React.useCallback(() => setOpen(false), [setOpen]);
  const toggleDrawer = React.useCallback(() => setOpen(!open), [open, setOpen]);

  return {
    open,
    setOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};

/* ============================================================
 * DRAWER COMPONENT
 * ============================================================ */

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  children,
  position = "right",
  size = "md",
  title,
  description,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventScroll = true,
  className,
  overlayClassName,
}) => {
  const drawerRef = React.useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
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

  // Focus first focusable element
  React.useEffect(() => {
    if (!open || !drawerRef.current) return;

    const focusableElements = drawerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }, [open]);

  if (!open) return null;

  // Size classes based on position
  const sizeClasses: Record<DrawerPosition, Record<DrawerSize, string>> = {
    left: {
      xs: "w-64",
      sm: "w-80",
      md: "w-96",
      lg: "w-[32rem]",
      xl: "w-[40rem]",
      full: "w-full",
    },
    right: {
      xs: "w-64",
      sm: "w-80",
      md: "w-96",
      lg: "w-[32rem]",
      xl: "w-[40rem]",
      full: "w-full",
    },
    top: {
      xs: "h-32",
      sm: "h-48",
      md: "h-64",
      lg: "h-96",
      xl: "h-[32rem]",
      full: "h-full",
    },
    bottom: {
      xs: "h-32",
      sm: "h-48",
      md: "h-64",
      lg: "h-96",
      xl: "h-[32rem]",
      full: "h-full",
    },
  };

  // Position classes
  const positionClasses: Record<DrawerPosition, string> = {
    left: "left-0 top-0 bottom-0",
    right: "right-0 top-0 bottom-0",
    top: "top-0 left-0 right-0",
    bottom: "bottom-0 left-0 right-0",
  };

  // Animation classes
  const animationClasses: Record<DrawerPosition, string> = {
    left: "animate-in slide-in-from-left-0 duration-300",
    right: "animate-in slide-in-from-right-0 duration-300",
    top: "animate-in slide-in-from-top-0 duration-300",
    bottom: "animate-in slide-in-from-bottom-0 duration-300",
  };

  const isHorizontal = position === "left" || position === "right";

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

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed z-50 bg-card border-border shadow-2xl",
          "flex flex-col",
          positionClasses[position],
          sizeClasses[position][size],
          animationClasses[position],
          isHorizontal ? "border-l border-r" : "border-t border-b",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
        aria-describedby={description ? "drawer-description" : undefined}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <div className="shrink-0 px-6 py-4 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {title && (
                  <h2 id="drawer-title" className="text-lg font-semibold">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="drawer-description" className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={() => onOpenChange(false)}
                  className="shrink-0 p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
};

Drawer.displayName = "Drawer";

/* ============================================================
 * DRAWER SECTIONS
 * ============================================================ */

export interface DrawerBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerBody: React.FC<DrawerBodyProps> = ({ children, className }) => {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
};

DrawerBody.displayName = "DrawerBody";

export interface DrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({ children, className }) => {
  return (
    <div className={cn("shrink-0 px-6 py-4 border-t border-border bg-accent/30", className)}>
      {children}
    </div>
  );
};

DrawerFooter.displayName = "DrawerFooter";
