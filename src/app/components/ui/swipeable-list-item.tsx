import * as React from "react";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface SwipeAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "error";
  onClick: () => void | Promise<void>;
}

export interface SwipeableListItemProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipeStart?: (direction: "left" | "right") => void;
  onSwipeEnd?: () => void;
  threshold?: number;
  disabled?: boolean;
  className?: string;
}

export interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  disabled?: boolean;
}

export interface UseSwipeGestureReturn {
  swipeProps: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
  };
  translateX: number;
  isSwiping: boolean;
}

/* ============================================================
 * HOOKS
 * ============================================================ */

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  disabled = false,
}: UseSwipeGestureOptions): UseSwipeGestureReturn => {
  const [startX, setStartX] = React.useState(0);
  const [translateX, setTranslateX] = React.useState(0);
  const [isSwiping, setIsSwiping] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleStart = (clientX: number) => {
    if (disabled) return;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || disabled) return;
    const diff = clientX - startX;
    // Add resistance at edges
    const resistance = 0.5;
    setTranslateX(diff * resistance);
    setIsSwiping(true);
  };

  const handleEnd = () => {
    if (!isDragging || disabled) return;
    
    setIsDragging(false);
    setIsSwiping(false);

    // Check if threshold is met
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    // Reset position
    setTranslateX(0);
  };

  const swipeProps = {
    onTouchStart: (e: React.TouchEvent) => handleStart(e.touches[0].clientX),
    onTouchMove: (e: React.TouchEvent) => handleMove(e.touches[0].clientX),
    onTouchEnd: handleEnd,
    onMouseDown: (e: React.MouseEvent) => handleStart(e.clientX),
    onMouseMove: (e: React.MouseEvent) => handleMove(e.clientX),
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
  };

  return {
    swipeProps,
    translateX,
    isSwiping,
  };
};

/* ============================================================
 * SWIPEABLE LIST ITEM COMPONENT
 * ============================================================ */

export const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  onSwipeStart,
  onSwipeEnd,
  threshold = 80,
  disabled = false,
  className,
}) => {
  const [translateX, setTranslateX] = React.useState(0);
  const [startX, setStartX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [revealedSide, setRevealedSide] = React.useState<"left" | "right" | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const actionColors = {
    primary: "bg-[var(--brand-primary)] text-white",
    success: "bg-[var(--success)] text-white",
    warning: "bg-[var(--warning)] text-white",
    error: "bg-[var(--error)] text-white",
  };

  const handleStart = (clientX: number) => {
    if (disabled) return;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || disabled) return;
    
    const diff = clientX - startX;
    
    // Prevent swiping if no actions available in that direction
    if (diff > 0 && leftActions.length === 0) return;
    if (diff < 0 && rightActions.length === 0) return;

    // Add resistance
    const maxSwipe = 150;
    const resistance = Math.abs(diff) > maxSwipe ? 0.3 : 1;
    setTranslateX(diff * resistance);

    // Notify swipe start
    if (Math.abs(diff) > 10 && !revealedSide) {
      onSwipeStart?.(diff > 0 ? "right" : "left");
    }
  };

  const handleEnd = () => {
    if (!isDragging || disabled) return;
    
    setIsDragging(false);

    // Check if threshold is met to reveal actions
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0 && leftActions.length > 0) {
        setRevealedSide("left");
        setTranslateX(leftActions.length * 80);
      } else if (translateX < 0 && rightActions.length > 0) {
        setRevealedSide("right");
        setTranslateX(-rightActions.length * 80);
      } else {
        resetPosition();
      }
    } else {
      resetPosition();
    }
  };

  const resetPosition = () => {
    setTranslateX(0);
    setRevealedSide(null);
    onSwipeEnd?.();
  };

  const handleActionClick = async (action: SwipeAction) => {
    await action.onClick();
    resetPosition();
  };

  // Reset on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        resetPosition();
      }
    };

    if (revealedSide) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [revealedSide]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ touchAction: disabled ? "auto" : "pan-y" }}
    >
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className="absolute inset-y-0 left-0 flex">
          {leftActions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                "w-20 flex flex-col items-center justify-center gap-1 text-sm font-medium transition-all",
                actionColors[action.color || "primary"],
                translateX > threshold && "shadow-lg"
              )}
              style={{
                transform: `translateX(-${100 - Math.min(100, (translateX / threshold) * 100)}%)`,
              }}
            >
              {action.icon && <span className="text-xl">{action.icon}</span>}
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className="absolute inset-y-0 right-0 flex">
          {rightActions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={cn(
                "w-20 flex flex-col items-center justify-center gap-1 text-sm font-medium transition-all",
                actionColors[action.color || "error"],
                translateX < -threshold && "shadow-lg"
              )}
              style={{
                transform: `translateX(${100 - Math.min(100, (Math.abs(translateX) / threshold) * 100)}%)`,
              }}
            >
              {action.icon && <span className="text-xl">{action.icon}</span>}
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div
        className={cn(
          "relative bg-card transition-transform select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => {
          if (isDragging) {
            e.preventDefault();
            handleMove(e.clientX);
          }
        }}
        onMouseUp={handleEnd}
        onMouseLeave={() => {
          if (isDragging) handleEnd();
        }}
      >
        {children}
      </div>
    </div>
  );
};

SwipeableListItem.displayName = "SwipeableListItem";

/* ============================================================
 * SWIPE ACTIONS PRESET
 * ============================================================ */

export const createDeleteAction = (onDelete: () => void | Promise<void>): SwipeAction => ({
  id: "delete",
  label: "Delete",
  icon: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  color: "error",
  onClick: onDelete,
});

export const createArchiveAction = (onArchive: () => void | Promise<void>): SwipeAction => ({
  id: "archive",
  label: "Archive",
  icon: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  color: "warning",
  onClick: onArchive,
});

export const createEditAction = (onEdit: () => void | Promise<void>): SwipeAction => ({
  id: "edit",
  label: "Edit",
  icon: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  color: "primary",
  onClick: onEdit,
});

export const createStarAction = (onStar: () => void | Promise<void>): SwipeAction => ({
  id: "star",
  label: "Favorite",
  icon: (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  color: "warning",
  onClick: onStar,
});
