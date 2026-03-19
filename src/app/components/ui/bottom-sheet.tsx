import * as React from "react";
import { X } from "lucide-react";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  height?: "auto" | "half" | "full";
  snapPoints?: number[];
  defaultSnapPoint?: number;
  showHandle?: boolean;
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnSwipeDown?: boolean;
  className?: string;
  overlayClassName?: string;
}

export interface UseBottomSheetOptions {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseBottomSheetReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  openSheet: () => void;
  closeSheet: () => void;
  toggleSheet: () => void;
}

/* ============================================================
 * HOOKS
 * ============================================================ */

export const useBottomSheet = ({
  defaultOpen = false,
  onOpenChange,
}: UseBottomSheetOptions = {}): UseBottomSheetReturn => {
  const [open, setOpenInternal] = React.useState(defaultOpen);

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      setOpenInternal(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange]
  );

  const openSheet = React.useCallback(() => setOpen(true), [setOpen]);
  const closeSheet = React.useCallback(() => setOpen(false), [setOpen]);
  const toggleSheet = React.useCallback(() => setOpen(!open), [open, setOpen]);

  return {
    open,
    setOpen,
    openSheet,
    closeSheet,
    toggleSheet,
  };
};

/* ============================================================
 * BOTTOM SHEET COMPONENT
 * ============================================================ */

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  height = "auto",
  snapPoints,
  defaultSnapPoint,
  showHandle = true,
  showOverlay = true,
  closeOnOverlayClick = true,
  closeOnSwipeDown = true,
  className,
  overlayClassName,
}) => {
  const [currentSnapPoint, setCurrentSnapPoint] = React.useState(
    defaultSnapPoint || snapPoints?.[0] || 0
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const [startY, setStartY] = React.useState(0);
  const [translateY, setTranslateY] = React.useState(0);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Height styles
  const heightStyles = {
    auto: "max-h-[90vh]",
    half: "h-[50vh]",
    full: "h-[calc(100vh-4rem)]",
  };

  // Handle drag start
  const handleDragStart = (clientY: number) => {
    if (!closeOnSwipeDown) return;
    setStartY(clientY);
    setIsDragging(true);
  };

  // Handle drag move
  const handleDragMove = (clientY: number) => {
    if (!isDragging || !closeOnSwipeDown) return;
    const diff = clientY - startY;
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging || !closeOnSwipeDown) return;
    setIsDragging(false);

    // Close if dragged down more than threshold
    if (translateY > 100) {
      onOpenChange(false);
    }

    setTranslateY(0);
  };

  // Close on escape key
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "animate-in fade-in-0",
            overlayClassName
          )}
          onClick={() => closeOnOverlayClick && onOpenChange(false)}
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-card border-t border-border rounded-t-2xl shadow-2xl",
          "animate-in slide-in-from-bottom-0 duration-300",
          heightStyles[height],
          className
        )}
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Handle */}
        {showHandle && (
          <div
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
            onTouchEnd={handleDragEnd}
            onMouseDown={(e) => handleDragStart(e.clientY)}
            onMouseMove={(e) => {
              if (isDragging) {
                e.preventDefault();
                handleDragMove(e.clientY);
              }
            }}
            onMouseUp={handleDragEnd}
            onMouseLeave={() => {
              if (isDragging) handleDragEnd();
            }}
          >
            <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
          </div>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="shrink-0 p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100% - 8rem)" }}>
          {children}
        </div>
      </div>
    </>
  );
};

BottomSheet.displayName = "BottomSheet";

/* ============================================================
 * BOTTOM SHEET CONTENT SECTIONS
 * ============================================================ */

export interface BottomSheetSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const BottomSheetSection: React.FC<BottomSheetSectionProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={cn("px-6 py-4", className)}>
      {title && <h3 className="text-sm font-semibold mb-3">{title}</h3>}
      {children}
    </div>
  );
};

BottomSheetSection.displayName = "BottomSheetSection";

/* ============================================================
 * BOTTOM SHEET FOOTER
 * ============================================================ */

export interface BottomSheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const BottomSheetFooter: React.FC<BottomSheetFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "sticky bottom-0 px-6 py-4 border-t border-border bg-card",
        className
      )}
    >
      {children}
    </div>
  );
};

BottomSheetFooter.displayName = "BottomSheetFooter";
