import * as React from "react";
import { cn } from "./utils";
import { Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";

/* ============================================================
 * TIMELINE - Vertical/Horizontal timeline with grouping
 * ============================================================
 * Supports icons, custom colors, grouping, and alternating layout
 */

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date | string;
  icon?: React.ReactNode;
  status?: 'default' | 'success' | 'error' | 'warning' | 'info';
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimelineGroup {
  id: string;
  label: string;
  items: TimelineItem[];
}

export interface TimelineProps {
  /**
   * Timeline items
   */
  items?: TimelineItem[];
  
  /**
   * Grouped timeline items
   */
  groups?: TimelineGroup[];
  
  /**
   * Orientation
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  
  /**
   * Alternating layout (zig-zag for vertical)
   * @default false
   */
  alternating?: boolean;
  
  /**
   * Show connecting line
   * @default true
   */
  showLine?: boolean;
  
  /**
   * Line position for vertical
   * @default 'left'
   */
  linePosition?: 'left' | 'center';
  
  /**
   * Item click handler
   */
  onItemClick?: (item: TimelineItem) => void;
  
  /**
   * Custom render for item content
   */
  renderItem?: (item: TimelineItem) => React.ReactNode;
  
  /**
   * Custom render for timestamp
   */
  renderTimestamp?: (timestamp: Date | string) => React.ReactNode;
  
  /**
   * Animate on scroll
   * @default false
   */
  animate?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * STATUS COLORS & ICONS
 * ============================================================ */

const STATUS_COLORS = {
  default: 'bg-gray-500',
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
};

const STATUS_ICONS = {
  default: Circle,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertCircle,
  info: Circle,
};

/* ============================================================
 * TIMELINE ITEM COMPONENT
 * ============================================================ */

interface TimelineItemNodeProps {
  item: TimelineItem;
  index: number;
  isLast: boolean;
  orientation: 'vertical' | 'horizontal';
  alternating: boolean;
  showLine: boolean;
  linePosition: 'left' | 'center';
  onItemClick?: (item: TimelineItem) => void;
  renderItem?: (item: TimelineItem) => React.ReactNode;
  renderTimestamp?: (timestamp: Date | string) => React.ReactNode;
  animate: boolean;
}

const TimelineItemNode: React.FC<TimelineItemNodeProps> = ({
  item,
  index,
  isLast,
  orientation,
  alternating,
  showLine,
  linePosition,
  onItemClick,
  renderItem,
  renderTimestamp,
  animate,
}) => {
  const [isVisible, setIsVisible] = React.useState(!animate);
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (!animate) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [animate]);
  
  const status = item.status || 'default';
  const IconComponent = item.icon ? null : STATUS_ICONS[status];
  const bgColor = item.color || STATUS_COLORS[status];
  
  const isAlternatingRight = alternating && index % 2 === 1;
  
  if (orientation === 'horizontal') {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center gap-2 flex-1',
          animate && 'transition-all duration-500',
          animate && (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')
        )}
      >
        {/* Icon */}
        <div className="relative">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-white',
              bgColor
            )}
          >
            {item.icon || (IconComponent && <IconComponent className="w-5 h-5" />)}
          </div>
          
          {/* Line */}
          {showLine && !isLast && (
            <div className="absolute top-5 left-full w-full h-0.5 bg-border" style={{ width: '100%' }} />
          )}
        </div>
        
        {/* Content */}
        <div
          className={cn(
            'text-center max-w-[200px]',
            onItemClick && 'cursor-pointer hover:opacity-80 transition-opacity'
          )}
          onClick={() => onItemClick?.(item)}
        >
          {renderItem ? (
            renderItem(item)
          ) : (
            <>
              <div className="font-medium text-sm">{item.title}</div>
              {item.description && (
                <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {renderTimestamp ? renderTimestamp(item.timestamp) : formatTimestamp(item.timestamp)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  
  // Vertical orientation
  if (linePosition === 'center' && alternating) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-4',
          isAlternatingRight && 'flex-row-reverse',
          animate && 'transition-all duration-500 delay-[var(--delay)]',
          animate && (isVisible ? 'opacity-100 translate-x-0' : isAlternatingRight ? 'opacity-0 translate-x-8' : 'opacity-0 -translate-x-8')
        )}
        style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
      >
        {/* Content (Left or Right) */}
        <div className="flex-1" style={{ maxWidth: '45%' }}>
          <div
            className={cn(
              'p-4 border border-border rounded-lg bg-background',
              onItemClick && 'cursor-pointer hover:border-primary transition-colors'
            )}
            onClick={() => onItemClick?.(item)}
          >
            {renderItem ? (
              renderItem(item)
            ) : (
              <>
                <div className="font-medium">{item.title}</div>
                {item.description && (
                  <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  {renderTimestamp ? renderTimestamp(item.timestamp) : formatTimestamp(item.timestamp)}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Icon (Center) */}
        <div className="relative flex-shrink-0">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-white z-10 relative',
              bgColor
            )}
          >
            {item.icon || (IconComponent && <IconComponent className="w-5 h-5" />)}
          </div>
          
          {/* Line */}
          {showLine && !isLast && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border" style={{ height: 'calc(100% + 1rem)' }} />
          )}
        </div>
        
        {/* Empty space (opposite side) */}
        <div className="flex-1" style={{ maxWidth: '45%' }} />
      </div>
    );
  }
  
  // Standard vertical (left aligned)
  return (
    <div
      ref={ref}
      className={cn(
        'flex gap-4',
        animate && 'transition-all duration-500 delay-[var(--delay)]',
        animate && (isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4')
      )}
      style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
    >
      {/* Icon & Line */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-white z-10 relative',
            bgColor
          )}
        >
          {item.icon || (IconComponent && <IconComponent className="w-5 h-5" />)}
        </div>
        
        {/* Line */}
        {showLine && !isLast && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 bg-border" style={{ height: 'calc(100% + 1rem)' }} />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-8">
        <div
          className={cn(
            'p-4 border border-border rounded-lg bg-background',
            onItemClick && 'cursor-pointer hover:border-primary transition-colors'
          )}
          onClick={() => onItemClick?.(item)}
        >
          {renderItem ? (
            renderItem(item)
          ) : (
            <>
              <div className="font-medium">{item.title}</div>
              {item.description && (
                <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
              )}
              <div className="text-xs text-muted-foreground mt-2">
                {renderTimestamp ? renderTimestamp(item.timestamp) : formatTimestamp(item.timestamp)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
 * TIMELINE COMPONENT
 * ============================================================ */

export function Timeline({
  items = [],
  groups,
  orientation = 'vertical',
  alternating = false,
  showLine = true,
  linePosition = 'left',
  onItemClick,
  renderItem,
  renderTimestamp,
  animate = false,
  className,
}: TimelineProps) {
  const allItems = React.useMemo(() => {
    if (groups) {
      return groups.flatMap((g) => g.items);
    }
    return items;
  }, [items, groups]);
  
  if (groups) {
    return (
      <div className={cn('space-y-8', className)}>
        {groups.map((group) => (
          <div key={group.id}>
            {/* Group Label */}
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {group.label}
              </h3>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            {/* Group Items */}
            <div
              className={cn(
                orientation === 'horizontal' ? 'flex gap-4' : 'space-y-0',
                orientation === 'horizontal' && 'relative'
              )}
            >
              {orientation === 'horizontal' && showLine && (
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
              )}
              
              {group.items.map((item, index) => (
                <TimelineItemNode
                  key={item.id}
                  item={item}
                  index={index}
                  isLast={index === group.items.length - 1}
                  orientation={orientation}
                  alternating={alternating}
                  showLine={showLine}
                  linePosition={linePosition}
                  onItemClick={onItemClick}
                  renderItem={renderItem}
                  renderTimestamp={renderTimestamp}
                  animate={animate}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        orientation === 'horizontal' ? 'flex gap-4 relative' : 'space-y-0',
        className
      )}
    >
      {orientation === 'horizontal' && showLine && (
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
      )}
      
      {allItems.map((item, index) => (
        <TimelineItemNode
          key={item.id}
          item={item}
          index={index}
          isLast={index === allItems.length - 1}
          orientation={orientation}
          alternating={alternating}
          showLine={showLine}
          linePosition={linePosition}
          onItemClick={onItemClick}
          renderItem={renderItem}
          renderTimestamp={renderTimestamp}
          animate={animate}
        />
      ))}
    </div>
  );
}

/* ============================================================
 * UTILITIES
 * ============================================================ */

function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return date.toLocaleDateString();
  }
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

/* ============================================================
 * TIMELINE HOOKS
 * ============================================================ */

export interface UseTimelineOptions {
  items: TimelineItem[];
  groupBy?: (item: TimelineItem) => string;
}

export interface UseTimelineReturn {
  items: TimelineItem[];
  groups: TimelineGroup[];
  addItem: (item: Omit<TimelineItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<TimelineItem>) => void;
}

export function useTimeline({ items: initialItems, groupBy }: UseTimelineOptions): UseTimelineReturn {
  const [items, setItems] = React.useState<TimelineItem[]>(initialItems);
  
  const groups = React.useMemo(() => {
    if (!groupBy) return [];
    
    const grouped = new Map<string, TimelineItem[]>();
    
    for (const item of items) {
      const key = groupBy(item);
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(item);
    }
    
    return Array.from(grouped.entries()).map(([label, groupItems]) => ({
      id: label,
      label,
      items: groupItems,
    }));
  }, [items, groupBy]);
  
  const addItem = React.useCallback((item: Omit<TimelineItem, 'id'>) => {
    setItems((prev) => [
      ...prev,
      { ...item, id: Math.random().toString(36).substring(2, 9) },
    ]);
  }, []);
  
  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);
  
  const updateItem = React.useCallback((id: string, updates: Partial<TimelineItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);
  
  return {
    items,
    groups,
    addItem,
    removeItem,
    updateItem,
  };
}
