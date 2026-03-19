import * as React from "react";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

export interface ContextMenuGroup {
  items: ContextMenuItem[];
}

export interface TableContextMenuProps {
  items: ContextMenuItem[] | ContextMenuGroup[];
  onItemClick?: (itemId: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface UseContextMenuOptions {
  onOpen?: (rowIndex: number | null) => void;
  onClose?: () => void;
}

export interface UseContextMenuReturn {
  isOpen: boolean;
  position: { x: number; y: number };
  rowIndex: number | null;
  openMenu: (e: React.MouseEvent, rowIndex?: number) => void;
  closeMenu: () => void;
  getContextMenuProps: () => {
    onContextMenu: (e: React.MouseEvent) => void;
  };
}

/* ============================================================
 * HOOK: CONTEXT MENU
 * ============================================================ */

export const useContextMenu = ({
  onOpen,
  onClose,
}: UseContextMenuOptions = {}): UseContextMenuReturn => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [rowIndex, setRowIndex] = React.useState<number | null>(null);

  const openMenu = React.useCallback(
    (e: React.MouseEvent, index?: number) => {
      e.preventDefault();
      e.stopPropagation();

      const x = e.clientX;
      const y = e.clientY;

      setPosition({ x, y });
      setRowIndex(index ?? null);
      setIsOpen(true);
      onOpen?.(index ?? null);
    },
    [onOpen]
  );

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
    setRowIndex(null);
    onClose?.();
  }, [onClose]);

  // Close on escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeMenu]);

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = () => {
      closeMenu();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, closeMenu]);

  const getContextMenuProps = React.useCallback(
    () => ({
      onContextMenu: (e: React.MouseEvent) => openMenu(e),
    }),
    [openMenu]
  );

  return {
    isOpen,
    position,
    rowIndex,
    openMenu,
    closeMenu,
    getContextMenuProps,
  };
};

/* ============================================================
 * CONTEXT MENU COMPONENT
 * ============================================================ */

export const TableContextMenu: React.FC<TableContextMenuProps> = ({
  items,
  onItemClick,
  children,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();

    const x = e.clientX;
    const y = e.clientY;

    setPosition({ x, y });
    setIsOpen(true);
  };

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled) return;
    
    item.onClick?.();
    onItemClick?.(item.id);
    setIsOpen(false);
  };

  // Adjust position to keep menu in viewport
  React.useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    // Adjust horizontal position
    if (x + rect.width > viewportWidth) {
      x = viewportWidth - rect.width - 8;
    }

    // Adjust vertical position
    if (y + rect.height > viewportHeight) {
      y = viewportHeight - rect.height - 8;
    }

    if (x !== position.x || y !== position.y) {
      setPosition({ x, y });
    }
  }, [isOpen, position]);

  // Close on escape or click outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClose = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key === "Escape") {
        setIsOpen(false);
      } else if (e instanceof MouseEvent) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClose);
    document.addEventListener("keydown", handleClose);

    return () => {
      document.removeEventListener("click", handleClose);
      document.removeEventListener("keydown", handleClose);
    };
  }, [isOpen]);

  const renderItems = (menuItems: ContextMenuItem[]) => {
    return menuItems.map((item, index) => {
      if (item.separator) {
        return (
          <div
            key={`separator-${index}`}
            className="h-px bg-border my-1"
            role="separator"
          />
        );
      }

      return (
        <button
          key={item.id}
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          className={cn(
            "w-full flex items-center justify-between gap-4 px-3 py-2 text-sm rounded-md transition-colors",
            "hover:bg-accent focus:bg-accent focus:outline-none",
            item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
            item.danger && "text-[var(--error)] hover:bg-[var(--error)]/10 focus:bg-[var(--error)]/10"
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span className="shrink-0">{item.icon}</span>
            )}
            <span>{item.label}</span>
          </div>
          {item.shortcut && (
            <span className="text-xs text-muted-foreground">{item.shortcut}</span>
          )}
        </button>
      );
    });
  };

  const isGrouped = items.length > 0 && "items" in items[0];

  return (
    <div onContextMenu={handleContextMenu}>
      {children}

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[12rem] rounded-lg border border-border bg-popover p-1 shadow-lg"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {isGrouped ? (
            (items as ContextMenuGroup[]).map((group, groupIndex) => (
              <div key={groupIndex}>
                {groupIndex > 0 && (
                  <div className="h-px bg-border my-1" role="separator" />
                )}
                {renderItems(group.items)}
              </div>
            ))
          ) : (
            renderItems(items as ContextMenuItem[])
          )}
        </div>
      )}
    </div>
  );
};

TableContextMenu.displayName = "TableContextMenu";
