import * as React from "react";
import { cn } from "./utils";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

/* ============================================================
 * SIDEBAR - Collapsible navigation sidebar
 * ============================================================
 * Enterprise-grade sidebar with nested sections, icons, badges
 */

/* ============================================================
 * TYPES
 * ============================================================ */

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: SidebarItem[];
}

export interface SidebarSection {
  id: string;
  label?: string;
  items: SidebarItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface SidebarProps {
  /**
   * Sidebar sections
   */
  sections: SidebarSection[];
  
  /**
   * Collapsed state
   * @default false
   */
  collapsed?: boolean;
  
  /**
   * Collapsed state change handler
   */
  onCollapsedChange?: (collapsed: boolean) => void;
  
  /**
   * Header content
   */
  header?: React.ReactNode;
  
  /**
   * Footer content
   */
  footer?: React.ReactNode;
  
  /**
   * Width when expanded
   * @default '280px'
   */
  width?: string;
  
  /**
   * Width when collapsed
   * @default '64px'
   */
  collapsedWidth?: string;
  
  /**
   * Position
   * @default 'fixed'
   */
  position?: 'fixed' | 'sticky' | 'relative';
  
  /**
   * Show toggle button
   * @default true
   */
  showToggle?: boolean;
  
  /**
   * Variant
   * @default 'default'
   */
  variant?: 'default' | 'bordered' | 'filled';
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * SIDEBAR ITEM COMPONENT
 * ============================================================ */

interface SidebarItemComponentProps {
  item: SidebarItem;
  level: number;
  collapsed: boolean;
}

const SidebarItemComponent: React.FC<SidebarItemComponentProps> = ({
  item,
  level,
  collapsed,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(!item.children);
  const hasChildren = item.children && item.children.length > 0;
  
  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    item.onClick?.();
  };
  
  const paddingLeft = collapsed ? 0 : level * 12 + 16;
  
  const BADGE_VARIANTS = {
    default: 'bg-[var(--muted)] text-muted-foreground',
    primary: 'bg-primary text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-red-500 text-white',
  };
  
  return (
    <div>
      {/* Item Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={item.disabled}
        className={cn(
          'w-full flex items-center gap-3 py-2.5 px-4 text-sm font-medium transition-all',
          'hover:bg-[var(--muted)]/50',
          item.active && 'bg-primary/10 text-primary border-r-2 border-primary',
          item.disabled && 'opacity-50 cursor-not-allowed',
          !item.active && 'text-foreground/80 hover:text-foreground'
        )}
        style={{ paddingLeft: collapsed ? undefined : paddingLeft }}
        title={collapsed ? item.label : undefined}
      >
        {/* Icon */}
        {item.icon && (
          <span className="w-5 h-5 flex-shrink-0">
            {item.icon}
          </span>
        )}
        
        {/* Label */}
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">
              {item.label}
            </span>
            
            {/* Badge */}
            {item.badge && (
              <span
                className={cn(
                  'px-2 py-0.5 text-xs rounded-full font-semibold',
                  BADGE_VARIANTS[item.badgeVariant || 'default']
                )}
              >
                {item.badge}
              </span>
            )}
            
            {/* Expand Icon */}
            {hasChildren && (
              <span className="w-4 h-4 flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </span>
            )}
          </>
        )}
      </button>
      
      {/* Children */}
      {hasChildren && isExpanded && !collapsed && (
        <div className="mt-1">
          {item.children!.map((child) => (
            <SidebarItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              collapsed={collapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================
 * SIDEBAR SECTION COMPONENT
 * ============================================================ */

interface SidebarSectionComponentProps {
  section: SidebarSection;
  collapsed: boolean;
}

const SidebarSectionComponent: React.FC<SidebarSectionComponentProps> = ({
  section,
  collapsed,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(section.defaultCollapsed || false);
  
  return (
    <div className="mb-6">
      {/* Section Header */}
      {section.label && !collapsed && (
        <button
          type="button"
          onClick={() => section.collapsible && setIsCollapsed(!isCollapsed)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
            section.collapsible && 'hover:text-foreground cursor-pointer'
          )}
        >
          <span>{section.label}</span>
          {section.collapsible && (
            <span className="w-4 h-4">
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          )}
        </button>
      )}
      
      {/* Section Items */}
      {(!isCollapsed || !section.collapsible) && (
        <div className="space-y-1">
          {section.items.map((item) => (
            <SidebarItemComponent
              key={item.id}
              item={item}
              level={0}
              collapsed={collapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================
 * SIDEBAR COMPONENT
 * ============================================================ */

export function Sidebar({
  sections,
  collapsed = false,
  onCollapsedChange,
  header,
  footer,
  width = '280px',
  collapsedWidth = '64px',
  position = 'fixed',
  showToggle = true,
  variant = 'default',
  className,
}: SidebarProps) {
  const currentWidth = collapsed ? collapsedWidth : width;
  
  const VARIANT_STYLES = {
    default: 'bg-background',
    bordered: 'bg-background border-r border-border',
    filled: 'bg-[var(--muted)]/30',
  };
  
  return (
    <aside
      className={cn(
        'h-screen flex flex-col transition-all duration-300',
        position === 'fixed' && 'fixed left-0 top-0 z-40',
        position === 'sticky' && 'sticky top-0',
        VARIANT_STYLES[variant],
        className
      )}
      style={{ width: currentWidth }}
    >
      {/* Header */}
      {header && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && <div className="flex-1">{header}</div>}
          
          {showToggle && (
            <button
              type="button"
              onClick={() => onCollapsedChange?.(!collapsed)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)] transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          )}
        </div>
      )}
      
      {/* Sections */}
      <div className="flex-1 overflow-y-auto py-4">
        {sections.map((section) => (
          <SidebarSectionComponent
            key={section.id}
            section={section}
            collapsed={collapsed}
          />
        ))}
      </div>
      
      {/* Footer */}
      {footer && !collapsed && (
        <div className="p-4 border-t border-border">
          {footer}
        </div>
      )}
    </aside>
  );
}

/* ============================================================
 * MOBILE SIDEBAR
 * ============================================================ */

export interface MobileSidebarProps extends SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({
  open,
  onOpenChange,
  ...props
}: MobileSidebarProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 md:hidden transform transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar
          {...props}
          position="relative"
          header={
            <div className="flex items-center justify-between">
              {props.header}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          }
        />
      </div>
    </>
  );
}

/* ============================================================
 * SIDEBAR UTILS
 * ============================================================ */

export function useSidebar(defaultCollapsed = false) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  
  return {
    collapsed,
    setCollapsed,
    toggle: () => setCollapsed(!collapsed),
  };
}
