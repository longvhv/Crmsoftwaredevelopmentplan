import * as React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  threshold?: number;
  maxPullDown?: number;
  resistance?: number;
  refreshingText?: string;
  pullText?: string;
  releaseText?: string;
  disabled?: boolean;
  className?: string;
}

export interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  maxPullDown?: number;
  resistance?: number;
  disabled?: boolean;
}

export interface UsePullToRefreshReturn {
  isRefreshing: boolean;
  pullDistance: number;
  pullProgress: number;
  containerProps: {
    ref: React.RefObject<HTMLDivElement>;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
}

/* ============================================================
 * HOOKS
 * ============================================================ */

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPullDown = 150,
  resistance = 0.5,
  disabled = false,
}: UsePullToRefreshOptions): UsePullToRefreshReturn => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [isPulling, setIsPulling] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const pullProgress = Math.min((pullDistance / threshold) * 100, 100);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    // Only allow pull to refresh when scrolled to top
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0) {
      // Apply resistance
      const distance = Math.min(diff * resistance, maxPullDown);
      setPullDistance(distance);
      
      // Prevent default scroll if pulling
      if (distance > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling || disabled || isRefreshing) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  return {
    isRefreshing,
    pullDistance,
    pullProgress,
    containerProps: {
      ref: containerRef,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

/* ============================================================
 * PULL TO REFRESH COMPONENT
 * ============================================================ */

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
  maxPullDown = 150,
  resistance = 0.5,
  refreshingText = "Refreshing...",
  pullText = "Pull to refresh",
  releaseText = "Release to refresh",
  disabled = false,
  className,
}) => {
  const { isRefreshing, pullDistance, pullProgress, containerProps } = usePullToRefresh({
    onRefresh,
    threshold,
    maxPullDown,
    resistance,
    disabled,
  });

  const shouldRelease = pullDistance >= threshold && !isRefreshing;
  const opacity = Math.min(pullProgress / 100, 1);
  const iconRotation = (pullProgress / 100) * 360;

  return (
    <div
      {...containerProps}
      className={cn("relative overflow-auto", className)}
      style={{ touchAction: disabled ? "auto" : "pan-y" }}
    >
      {/* Pull Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center"
        style={{
          height: `${pullDistance}px`,
          opacity,
          transition: isRefreshing || pullDistance === 0 ? "all 0.3s" : "none",
        }}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          {isRefreshing ? (
            <>
              <Loader2 className="size-6 animate-spin text-[var(--brand-primary)]" />
              <span className="text-sm font-medium">{refreshingText}</span>
            </>
          ) : (
            <>
              <RefreshCw
                className={cn(
                  "size-6 transition-all",
                  shouldRelease && "text-[var(--brand-primary)]"
                )}
                style={{
                  transform: `rotate(${iconRotation}deg)`,
                }}
              />
              <span className="text-sm font-medium">
                {shouldRelease ? releaseText : pullText}
              </span>
            </>
          )}
          
          {/* Progress Bar */}
          <div className="w-16 h-1 bg-accent rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--brand-primary)] transition-all"
              style={{ width: `${pullProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0 ? "transform 0.3s" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
};

PullToRefresh.displayName = "PullToRefresh";

/* ============================================================
 * SIMPLE REFRESH BUTTON (FOR DESKTOP)
 * ============================================================ */

export interface RefreshButtonProps {
  onRefresh: () => Promise<void> | void;
  isRefreshing?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  isRefreshing: controlledIsRefreshing,
  children,
  className,
}) => {
  const [internalIsRefreshing, setInternalIsRefreshing] = React.useState(false);
  const isRefreshing = controlledIsRefreshing ?? internalIsRefreshing;

  const handleClick = async () => {
    if (isRefreshing) return;
    
    setInternalIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setInternalIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isRefreshing}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
        "text-sm font-medium transition-colors",
        "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      aria-label="Refresh"
    >
      <RefreshCw
        className={cn(
          "size-4 transition-transform",
          isRefreshing && "animate-spin"
        )}
      />
      {children || "Refresh"}
    </button>
  );
};

RefreshButton.displayName = "RefreshButton";

/* ============================================================
 * REFRESH INDICATOR (OVERLAY)
 * ============================================================ */

export interface RefreshIndicatorProps {
  isRefreshing: boolean;
  message?: string;
  className?: string;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({
  isRefreshing,
  message = "Refreshing...",
  className,
}) => {
  if (!isRefreshing) return null;

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50",
        "px-4 py-2 rounded-full shadow-lg",
        "bg-card border border-border",
        "flex items-center gap-2",
        "animate-in slide-in-from-top-2 fade-in-0",
        className
      )}
    >
      <Loader2 className="size-4 animate-spin text-[var(--brand-primary)]" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

RefreshIndicator.displayName = "RefreshIndicator";
