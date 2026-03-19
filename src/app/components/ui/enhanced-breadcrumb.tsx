import * as React from "react";
import { cn } from "./utils";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

/* ============================================================
 * ENHANCED BREADCRUMB - Advanced breadcrumb navigation
 * ============================================================
 * Step 96: Enhanced breadcrumb with collapsing, icons, and actions
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface EnhancedBreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  maxItems?: number;
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export function EnhancedBreadcrumb({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  showHome = true,
  maxItems = 5,
  className,
  onItemClick,
}: EnhancedBreadcrumbProps) {
  // Calculate if items should be collapsed
  const shouldCollapse = items.length > maxItems;

  // Calculate visible items
  const visibleItems = React.useMemo(() => {
    if (!shouldCollapse) {
      return items;
    }

    const firstItems = items.slice(0, 1);
    const lastItems = items.slice(-(maxItems - 2));
    return [...firstItems, ...lastItems];
  }, [items, maxItems, shouldCollapse]);

  const collapsedItems = React.useMemo(() => {
    if (!shouldCollapse) return [];
    return items.slice(1, items.length - (maxItems - 2));
  }, [items, maxItems, shouldCollapse]);

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    if (!item.disabled) {
      onItemClick?.(item, index);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-2", className)}>
      {showHome && (
        <>
          <button
            onClick={() => handleItemClick({ label: "Home", href: "/" }, -1)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
          <span className="text-muted-foreground">{separator}</span>
        </>
      )}

      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;
        const isCollapsed = shouldCollapse && index === 1;

        if (isCollapsed) {
          return (
            <React.Fragment key={`collapsed-${index}`}>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {collapsedItems.map((collapsedItem, collapsedIndex) => (
                    <DropdownMenuItem
                      key={collapsedIndex}
                      onClick={() => handleItemClick(collapsedItem, collapsedIndex + 1)}
                      disabled={collapsedItem.disabled}
                    >
                      {collapsedItem.icon && <span className="mr-2">{collapsedItem.icon}</span>}
                      {collapsedItem.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-muted-foreground">{separator}</span>
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={index}>
            <button
              onClick={() => handleItemClick(item, index)}
              disabled={item.disabled || isLast}
              className={cn(
                "flex items-center gap-1 transition-colors",
                isLast
                  ? "text-foreground font-medium cursor-default"
                  : "text-muted-foreground hover:text-foreground",
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              {item.label}
            </button>
            {!isLast && <span className="text-muted-foreground">{separator}</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ============================================================
 * COMPACT BREADCRUMB - Minimal breadcrumb for mobile
 * ============================================================ */

export interface CompactBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  onBack?: () => void;
}

export function CompactBreadcrumb({ items, className, onBack }: CompactBreadcrumbProps) {
  const currentItem = items[items.length - 1];
  const previousItem = items[items.length - 2];

  return (
    <nav className={cn("flex items-center space-x-2", className)}>
      {previousItem && (
        <button
          onClick={onBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="ml-1">{previousItem.label}</span>
        </button>
      )}
      {!previousItem && items.length > 1 && (
        <button
          onClick={onBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="ml-1">Back</span>
        </button>
      )}
      <span className="text-foreground font-medium">{currentItem?.label}</span>
    </nav>
  );
}