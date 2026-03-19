import * as React from "react";
import { cn } from "./utils";
import { ChevronRight, MoreVertical } from "lucide-react";

/* ============================================================
 * CONTEXTUAL NAVIGATION - Context-aware navigation
 * ============================================================
 * Tabs, pills, and segmented controls with context
 */

/* ============================================================
 * TYPES
 * ============================================================ */

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}

/* ============================================================
 * TABS NAVIGATION
 * ============================================================ */

export interface TabsProps {
  items: NavItem[];
  activeId: string;
  onActiveChange: (id: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  items,
  activeId,
  onActiveChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
}: TabsProps) {
  const SIZES = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };
  
  const getVariantClasses = (isActive: boolean) => {
    if (variant === 'pills') {
      return cn(
        'rounded-lg',
        isActive
          ? 'bg-primary text-white'
          : 'hover:bg-[var(--muted)]/50'
      );
    }
    
    if (variant === 'underline') {
      return cn(
        'border-b-2',
        isActive
          ? 'border-primary text-primary'
          : 'border-transparent hover:border-border'
      );
    }
    
    // default variant
    return cn(
      'border rounded-t-lg',
      isActive
        ? 'bg-background border-border border-b-background text-primary -mb-px'
        : 'border-transparent hover:border-border'
    );
  };
  
  return (
    <div
      className={cn(
        'flex',
        variant === 'default' && 'border-b border-border',
        fullWidth && 'w-full',
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => !item.disabled && onActiveChange(item.id)}
            disabled={item.disabled}
            className={cn(
              'flex items-center gap-2 font-medium transition-all',
              SIZES[size],
              getVariantClasses(isActive),
              item.disabled && 'opacity-50 cursor-not-allowed',
              fullWidth && 'flex-1 justify-center'
            )}
          >
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs bg-[var(--muted)] rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
 * SEGMENTED CONTROL
 * ============================================================ */

export interface SegmentedControlProps {
  items: NavItem[];
  activeId: string;
  onActiveChange: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedControl({
  items,
  activeId,
  onActiveChange,
  size = 'md',
  fullWidth = false,
  className,
}: SegmentedControlProps) {
  const SIZES = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-1.5',
    lg: 'text-base px-5 py-2',
  };
  
  return (
    <div
      className={cn(
        'inline-flex bg-[var(--muted)]/30 border border-border rounded-lg p-1',
        fullWidth && 'w-full',
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => !item.disabled && onActiveChange(item.id)}
            disabled={item.disabled}
            className={cn(
              'flex items-center gap-2 font-medium rounded-md transition-all',
              SIZES[size],
              isActive
                ? 'bg-background shadow-sm text-primary'
                : 'hover:bg-background/50',
              item.disabled && 'opacity-50 cursor-not-allowed',
              fullWidth && 'flex-1 justify-center'
            )}
          >
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
 * VERTICAL NAVIGATION
 * ============================================================ */

export interface VerticalNavProps {
  items: NavItem[];
  activeId: string;
  onActiveChange: (id: string) => void;
  variant?: 'default' | 'filled';
  showDividers?: boolean;
  className?: string;
}

export function VerticalNav({
  items,
  activeId,
  onActiveChange,
  variant = 'default',
  showDividers = false,
  className,
}: VerticalNavProps) {
  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item, index) => {
        const isActive = item.id === activeId;
        
        return (
          <React.Fragment key={item.id}>
            <button
              type="button"
              onClick={() => !item.disabled && onActiveChange(item.id)}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all',
                isActive
                  ? variant === 'filled'
                    ? 'bg-primary text-white'
                    : 'bg-primary/10 text-primary border-l-2 border-primary pl-[14px]'
                  : 'text-foreground/80 hover:bg-[var(--muted)]/50 hover:text-foreground',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {item.icon && <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs rounded-full',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--muted)] text-muted-foreground'
                  )}
                >
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            {showDividers && index < items.length - 1 && (
              <div className="h-px bg-border mx-4" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ============================================================
 * STEP NAVIGATION
 * ============================================================ */

export interface StepNavItem extends NavItem {
  completed?: boolean;
}

export interface StepNavProps {
  items: StepNavItem[];
  activeId: string;
  onActiveChange: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  className?: string;
}

export function StepNav({
  items,
  activeId,
  onActiveChange,
  orientation = 'horizontal',
  showLabels = true,
  className,
}: StepNavProps) {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  
  if (orientation === 'vertical') {
    return (
      <nav className={cn('space-y-4', className)}>
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          const isCompleted = item.completed || index < activeIndex;
          
          return (
            <div key={item.id} className="flex gap-3">
              {/* Step Indicator */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => !item.disabled && onActiveChange(item.id)}
                  disabled={item.disabled}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all',
                    isCompleted && 'bg-primary text-white',
                    isActive && !isCompleted && 'bg-primary text-white ring-4 ring-primary/20',
                    !isActive && !isCompleted && 'bg-[var(--muted)] text-muted-foreground',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {item.icon || index + 1}
                </button>
                
                {index < items.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 h-12 mt-2',
                      isCompleted ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </div>
              
              {/* Label */}
              {showLabels && (
                <div className="pt-1">
                  <div
                    className={cn(
                      'font-medium',
                      isActive && 'text-primary',
                      !isActive && 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  }
  
  // Horizontal orientation
  return (
    <nav className={cn('flex items-center', className)}>
      {items.map((item, index) => {
        const isActive = item.id === activeId;
        const isCompleted = item.completed || index < activeIndex;
        
        return (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center gap-2">
              {/* Step Indicator */}
              <button
                type="button"
                onClick={() => !item.disabled && onActiveChange(item.id)}
                disabled={item.disabled}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all',
                  isCompleted && 'bg-primary text-white',
                  isActive && !isCompleted && 'bg-primary text-white ring-4 ring-primary/20',
                  !isActive && !isCompleted && 'bg-[var(--muted)] text-muted-foreground',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {item.icon || index + 1}
              </button>
              
              {/* Label */}
              {showLabels && (
                <div
                  className={cn(
                    'text-xs text-center max-w-[100px]',
                    isActive && 'font-medium text-primary',
                    !isActive && 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </div>
              )}
            </div>
            
            {/* Connector */}
            {index < items.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  isCompleted ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ============================================================
 * ACTION BAR
 * ============================================================ */

export interface ActionBarProps {
  items: NavItem[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
}

export function ActionBar({
  items,
  activeId,
  onActiveChange,
  variant = 'default',
  className,
}: ActionBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 bg-background border border-border rounded-lg',
        className
      )}
    >
      {items.map((item) => {
        const isActive = activeId && item.id === activeId;
        
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (!item.disabled) {
                item.onClick?.();
                onActiveChange?.(item.id);
              }
            }}
            disabled={item.disabled}
            title={item.label}
            className={cn(
              'flex items-center gap-2 rounded-md font-medium transition-all',
              variant === 'compact' ? 'px-2 py-1.5' : 'px-3 py-2',
              isActive
                ? 'bg-primary text-white'
                : 'hover:bg-[var(--muted)] text-foreground',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
            {variant !== 'compact' && <span className="text-sm">{item.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
 * OVERFLOW MENU
 * ============================================================ */

export interface OverflowMenuProps {
  items: NavItem[];
  visibleCount?: number;
  className?: string;
}

export function OverflowMenu({
  items,
  visibleCount = 5,
  className,
}: OverflowMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  
  const visibleItems = items.slice(0, visibleCount);
  const overflowItems = items.slice(visibleCount);
  
  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Visible Items */}
      {visibleItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          disabled={item.disabled}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-[var(--muted)] transition-colors',
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {item.icon && <span className="w-4 h-4">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
      
      {/* Overflow Menu */}
      {overflowItems.length > 0 && (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {isOpen && (
            <div className="absolute top-full right-0 mt-1 py-1 bg-background border border-border rounded-lg shadow-lg min-w-[200px] z-50">
              {overflowItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  disabled={item.disabled}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--muted)] transition-colors text-left',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
