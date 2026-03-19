import * as React from "react";
import { cn } from "./utils";
import { X } from "lucide-react";
import { Button } from "./button";

/* ============================================================
 * ADVANCED POPOVER - Enhanced popover component
 * ============================================================
 * Step 112: Advanced popovers with positioning and actions
 */

export interface AdvancedPopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  showArrow?: boolean;
  showClose?: boolean;
  className?: string;
  contentClassName?: string;
}

export function AdvancedPopover({
  trigger,
  content,
  title,
  footer,
  side = "bottom",
  align = "center",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  closeOnClickOutside = true,
  closeOnEscape = true,
  showArrow = true,
  showClose = false,
  className,
  contentClassName,
}: AdvancedPopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const setOpen = (open: boolean) => {
    if (!isControlled) {
      setInternalOpen(open);
    }
    onOpenChange?.(open);
  };

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current || !popoverRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    // Calculate position based on side
    switch (side) {
      case "top":
        y = triggerRect.top - popoverRect.height - 8;
        x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        break;
      case "bottom":
        y = triggerRect.bottom + 8;
        x = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        break;
      case "left":
        y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        x = triggerRect.left - popoverRect.width - 8;
        break;
      case "right":
        y = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        x = triggerRect.right + 8;
        break;
    }

    // Adjust for alignment
    if (side === "top" || side === "bottom") {
      if (align === "start") {
        x = triggerRect.left;
      } else if (align === "end") {
        x = triggerRect.right - popoverRect.width;
      }
    } else {
      if (align === "start") {
        y = triggerRect.top;
      } else if (align === "end") {
        y = triggerRect.bottom - popoverRect.height;
      }
    }

    // Ensure popover stays within viewport
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - popoverRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - popoverRect.height - padding));

    setPosition({ x, y });
  }, [side, align, isOpen]);

  // Update position when opened or on scroll/resize
  React.useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleUpdate = () => updatePosition();
      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);
      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    }
  }, [isOpen, updatePosition]);

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeOnClickOutside]);

  // Close on Escape
  React.useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen(!isOpen)}
        className={cn("inline-block cursor-pointer", className)}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className={cn(
            "fixed z-50 w-72 rounded-lg border bg-popover text-popover-foreground shadow-lg",
            "animate-in fade-in-0 zoom-in-95",
            contentClassName
          )}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-center justify-between px-4 py-3 border-b">
              {title && <h3 className="font-semibold">{title}</h3>}
              {showClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-6 w-6 ml-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4">{content}</div>

          {/* Footer */}
          {footer && <div className="px-4 py-3 border-t">{footer}</div>}

          {/* Arrow */}
          {showArrow && (
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
 * CONTEXT MENU - Right-click menu
 * ============================================================ */

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
  danger?: boolean;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
          {items.map((item, index) => {
            if (item.separator) {
              return <div key={index} className="h-px bg-border my-1" />;
            }

            return (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                  "transition-colors focus:outline-none",
                  item.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  item.danger && "text-destructive hover:bg-destructive/10"
                )}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ============================================================
 * QUICK ACTION MENU - Floating action menu
 * ============================================================ */

export interface QuickActionMenuProps {
  trigger: React.ReactNode;
  actions: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }>;
  className?: string;
}

export function QuickActionMenu({ trigger, actions, className }: QuickActionMenuProps) {
  const content = (
    <div className="space-y-1">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={cn(
            "flex w-full items-center gap-2 rounded px-3 py-2 text-sm",
            "transition-colors hover:bg-accent",
            action.disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {action.icon && <span className="w-4 h-4">{action.icon}</span>}
          {action.label}
        </button>
      ))}
    </div>
  );

  return (
    <AdvancedPopover
      trigger={trigger}
      content={content}
      side="bottom"
      align="end"
      className={className}
    />
  );
}
