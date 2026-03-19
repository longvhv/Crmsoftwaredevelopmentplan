import * as React from "react";
import { cn } from "./utils";
import { ChevronRight, Home, MoreHorizontal, ChevronDown } from "lucide-react";

/* ============================================================
 * BREADCRUMB - Navigation breadcrumb with dropdown
 * ============================================================
 * Supports dropdowns, icons, separators, and overflow handling
 */

/* ============================================================
 * TYPES
 * ============================================================ */

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  items?: BreadcrumbItem[];
}

export interface BreadcrumbProps {
  /**
   * Breadcrumb items
   */
  items: BreadcrumbItem[];
  
  /**
   * Separator
   * @default <ChevronRight />
   */
  separator?: React.ReactNode;
  
  /**
   * Show home icon
   * @default true
   */
  showHome?: boolean;
  
  /**
   * Home item
   */
  homeItem?: BreadcrumbItem;
  
  /**
   * Max items to show before collapse
   * @default undefined (show all)
   */
  maxItems?: number;
  
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * BREADCRUMB DROPDOWN
 * ============================================================ */

interface BreadcrumbDropdownProps {
  item: BreadcrumbItem;
  size: 'sm' | 'md' | 'lg';
}

const BreadcrumbDropdown: React.FC<BreadcrumbDropdownProps> = ({ item, size }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  const SIZES = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--muted)] transition-colors',
          SIZES[size]
        )}
      >
        {item.icon && <span className="w-4 h-4">{item.icon}</span>}
        <span>{item.label}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && item.items && (
        <div className="absolute top-full left-0 mt-1 py-1 bg-background border border-border rounded-lg shadow-lg min-w-[200px] z-50">
          {item.items.map((subItem) => (
            <button
              key={subItem.id}
              type="button"
              onClick={() => {
                subItem.onClick?.();
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--muted)] transition-colors text-left',
                SIZES[size]
              )}
            >
              {subItem.icon && <span className="w-4 h-4">{subItem.icon}</span>}
              <span>{subItem.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================
 * BREADCRUMB ITEM COMPONENT
 * ============================================================ */

interface BreadcrumbItemComponentProps {
  item: BreadcrumbItem;
  isLast: boolean;
  separator: React.ReactNode;
  size: 'sm' | 'md' | 'lg';
}

const BreadcrumbItemComponent: React.FC<BreadcrumbItemComponentProps> = ({
  item,
  isLast,
  separator,
  size,
}) => {
  const hasDropdown = item.items && item.items.length > 0;
  
  const SIZES = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <li className="flex items-center gap-2">
      {hasDropdown ? (
        <BreadcrumbDropdown item={item} size={size} />
      ) : (
        <button
          type="button"
          onClick={item.onClick}
          disabled={isLast}
          className={cn(
            'flex items-center gap-2 px-2 py-1 rounded transition-colors',
            SIZES[size],
            isLast
              ? 'text-foreground font-medium cursor-default'
              : 'text-muted-foreground hover:text-foreground hover:bg-[var(--muted)]'
          )}
        >
          {item.icon && <span className="w-4 h-4">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      )}
      
      {!isLast && (
        <span className="text-muted-foreground flex-shrink-0">
          {separator}
        </span>
      )}
    </li>
  );
};

/* ============================================================
 * BREADCRUMB COMPONENT
 * ============================================================ */

export function Breadcrumb({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  showHome = true,
  homeItem = {
    id: 'home',
    label: 'Home',
    icon: <Home className="w-4 h-4" />,
    onClick: () => {},
  },
  maxItems,
  size = 'md',
  className,
}: BreadcrumbProps) {
  const allItems = showHome ? [homeItem, ...items] : items;
  
  // Handle overflow
  const displayItems = React.useMemo(() => {
    if (!maxItems || allItems.length <= maxItems) {
      return allItems;
    }
    
    // Show first, collapsed, and last items
    const first = allItems[0];
    const last = allItems[allItems.length - 1];
    const hidden = allItems.slice(1, -1);
    
    const collapsedItem: BreadcrumbItem = {
      id: 'collapsed',
      label: '...',
      icon: <MoreHorizontal className="w-4 h-4" />,
      items: hidden,
    };
    
    return [first, collapsedItem, last];
  }, [allItems, maxItems]);
  
  return (
    <nav className={cn('flex items-center', className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        {displayItems.map((item, index) => (
          <BreadcrumbItemComponent
            key={item.id}
            item={item}
            isLast={index === displayItems.length - 1}
            separator={separator}
            size={size}
          />
        ))}
      </ol>
    </nav>
  );
}

/* ============================================================
 * BREADCRUMB WITH AUTO-COLLAPSE
 * ============================================================ */

export interface ResponsiveBreadcrumbProps extends Omit<BreadcrumbProps, 'maxItems'> {
  /**
   * Breakpoint for auto-collapse
   * @default 640
   */
  collapseBreakpoint?: number;
}

export function ResponsiveBreadcrumb({
  collapseBreakpoint = 640,
  ...props
}: ResponsiveBreadcrumbProps) {
  const [maxItems, setMaxItems] = React.useState<number | undefined>(undefined);
  
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < collapseBreakpoint) {
        setMaxItems(3);
      } else {
        setMaxItems(undefined);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapseBreakpoint]);
  
  return <Breadcrumb {...props} maxItems={maxItems} />;
}

/* ============================================================
 * SIMPLE BREADCRUMB
 * ============================================================ */

export interface SimpleBreadcrumbProps {
  items: string[];
  separator?: React.ReactNode;
  className?: string;
}

export function SimpleBreadcrumb({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  className,
}: SimpleBreadcrumbProps) {
  return (
    <nav className={cn('flex items-center text-sm', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span
            className={cn(
              index === items.length - 1
                ? 'text-foreground font-medium'
                : 'text-muted-foreground'
            )}
          >
            {item}
          </span>
          {index < items.length - 1 && (
            <span className="mx-2 text-muted-foreground">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
