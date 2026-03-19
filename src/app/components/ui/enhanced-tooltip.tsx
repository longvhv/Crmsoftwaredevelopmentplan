import * as React from "react";
import { cn } from "./utils";

/* ============================================================
 * ENHANCED TOOLTIP - Advanced tooltip component
 * ============================================================
 * Step 111: Enhanced tooltips with rich content and positioning
 */

export interface EnhancedTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delay?: number;
  maxWidth?: string;
  arrow?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  className?: string;
}

export function EnhancedTooltip({
  content,
  children,
  side = "top",
  align = "center",
  delay = 200,
  maxWidth = "16rem",
  arrow = true,
  interactive = false,
  disabled = false,
  className,
}: EnhancedTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    // Calculate position based on side
    switch (side) {
      case "top":
        y = triggerRect.top - tooltipRect.height - 8;
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        y = triggerRect.bottom + 8;
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        x = triggerRect.left - tooltipRect.width - 8;
        break;
      case "right":
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        x = triggerRect.right + 8;
        break;
    }

    // Adjust for alignment
    if (side === "top" || side === "bottom") {
      if (align === "start") {
        x = triggerRect.left;
      } else if (align === "end") {
        x = triggerRect.right - tooltipRect.width;
      }
    } else {
      if (align === "start") {
        y = triggerRect.top;
      } else if (align === "end") {
        y = triggerRect.bottom - tooltipRect.height;
      }
    }

    // Ensure tooltip stays within viewport
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

    setPosition({ x, y });
  }, [side, align]);

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!interactive) {
      setIsVisible(false);
    }
  };

  const handleTooltipMouseEnter = () => {
    if (interactive && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTooltipMouseLeave = () => {
    if (interactive) {
      setIsVisible(false);
    }
  };

  React.useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible, updatePosition]);

  React.useEffect(() => {
    if (isVisible) {
      const handleScroll = () => updatePosition();
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [isVisible, updatePosition]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          className={cn(
            "fixed z-50 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground",
            "shadow-md border animate-in fade-in-0 zoom-in-95",
            className
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            maxWidth,
          }}
        >
          {content}

          {arrow && (
            <div
              className={cn(
                "absolute w-2 h-2 bg-popover border rotate-45",
                side === "top" && "bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b",
                side === "bottom" && "top-[-5px] left-1/2 -translate-x-1/2 border-l border-t",
                side === "left" && "right-[-5px] top-1/2 -translate-y-1/2 border-r border-t",
                side === "right" && "left-[-5px] top-1/2 -translate-y-1/2 border-l border-b"
              )}
            />
          )}
        </div>
      )}
    </>
  );
}

/* ============================================================
 * RICH TOOLTIP - Tooltip with title and description
 * ============================================================ */

export interface RichTooltipProps extends Omit<EnhancedTooltipProps, "content"> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function RichTooltip({ title, description, icon, ...props }: RichTooltipProps) {
  const content = (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="font-semibold">{title}</div>
      </div>
      {description && <div className="text-xs text-muted-foreground">{description}</div>}
    </div>
  );

  return <EnhancedTooltip content={content} maxWidth="20rem" {...props} />;
}

/* ============================================================
 * KEYBOARD SHORTCUT TOOLTIP
 * ============================================================ */

export interface KeyboardShortcutTooltipProps extends Omit<EnhancedTooltipProps, "content"> {
  label: string;
  shortcut: string | string[];
}

export function KeyboardShortcutTooltip({
  label,
  shortcut,
  ...props
}: KeyboardShortcutTooltipProps) {
  const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut];

  const content = (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <div className="flex gap-1">
        {shortcuts.map((key, index) => (
          <kbd
            key={index}
            className="px-1.5 py-0.5 text-xs bg-muted rounded border border-border font-mono"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );

  return <EnhancedTooltip content={content} maxWidth="auto" {...props} />;
}

/* ============================================================
 * INFO TOOLTIP - Inline help icon with tooltip
 * ============================================================ */

export interface InfoTooltipProps {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function InfoTooltip({ content, side = "top", className }: InfoTooltipProps) {
  return (
    <EnhancedTooltip content={content} side={side}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center w-4 h-4 rounded-full",
          "bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background",
          "transition-colors text-xs font-semibold",
          className
        )}
      >
        ?
      </button>
    </EnhancedTooltip>
  );
}

/* ============================================================
 * HELPER TEXT - Inline helper with optional tooltip
 * ============================================================ */

export interface HelperTextProps {
  text: string;
  tooltip?: string;
  className?: string;
}

export function HelperText({ text, tooltip, className }: HelperTextProps) {
  if (!tooltip) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{text}</p>;
  }

  return (
    <div className="flex items-center gap-1">
      <p className={cn("text-sm text-muted-foreground", className)}>{text}</p>
      <InfoTooltip content={tooltip} />
    </div>
  );
}
