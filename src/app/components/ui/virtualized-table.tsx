import * as React from "react";
import { cn } from "./utils";

/* ============================================================
 * VIRTUALIZED TABLE - High-performance rendering for large datasets
 * ============================================================
 * Uses virtual scrolling to render only visible rows
 * Supports 10,000+ rows without performance degradation
 */

export interface VirtualizedTableColumn<T = any> {
  key: string;
  header: string;
  width?: number;
  minWidth?: number;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface VirtualizedTableProps<T = any> {
  /**
   * Data array
   */
  data: T[];
  
  /**
   * Column definitions
   */
  columns: VirtualizedTableColumn<T>[];
  
  /**
   * Row height in pixels
   * @default 48
   */
  rowHeight?: number;
  
  /**
   * Overscan count (rows to render outside viewport)
   * @default 5
   */
  overscan?: number;
  
  /**
   * Table height (container)
   * @default '600px'
   */
  height?: string | number;
  
  /**
   * Row key extractor
   */
  getRowKey: (row: T, index: number) => string;
  
  /**
   * Row click handler
   */
  onRowClick?: (row: T, index: number) => void;
  
  /**
   * Custom row className
   */
  rowClassName?: string | ((row: T, index: number) => string);
  
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Empty state message
   */
  emptyMessage?: string;
  
  /**
   * Sticky header
   * @default true
   */
  stickyHeader?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * VIRTUALIZED TABLE COMPONENT
 * ============================================================ */

export function VirtualizedTable<T = any>({
  data,
  columns,
  rowHeight = 48,
  overscan = 5,
  height = '600px',
  getRowKey,
  onRowClick,
  rowClassName,
  loading = false,
  emptyMessage = 'No data available',
  stickyHeader = true,
  className,
}: VirtualizedTableProps<T>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  
  // Calculate visible range
  const containerHeight = typeof height === 'number' ? height : 600;
  const totalHeight = data.length * rowHeight;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(
    data.length - 1,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  );
  
  const visibleData = data.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * rowHeight;
  
  // Handle scroll
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  // Get row class
  const getRowClassName = React.useCallback((row: T, index: number) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row, index);
    }
    return rowClassName || '';
  }, [rowClassName]);
  
  return (
    <div className={cn('relative border border-border rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div
        className={cn(
          'flex border-b border-border bg-[var(--muted)]/30',
          stickyHeader && 'sticky top-0 z-10'
        )}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            className={cn(
              'px-4 py-3 text-sm font-medium text-muted-foreground',
              col.className
            )}
            style={{
              width: col.width,
              minWidth: col.minWidth,
              flex: col.width ? undefined : 1,
            }}
          >
            {col.header}
          </div>
        ))}
      </div>
      
      {/* Body */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-auto"
        style={{ height }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="relative" style={{ height: totalHeight }}>
            <div
              className="absolute left-0 right-0"
              style={{ transform: `translateY(${offsetY}px)` }}
            >
              {visibleData.map((row, idx) => {
                const actualIndex = startIndex + idx;
                const key = getRowKey(row, actualIndex);
                
                return (
                  <div
                    key={key}
                    className={cn(
                      'flex border-b border-border transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-[var(--muted)]/50',
                      getRowClassName(row, actualIndex)
                    )}
                    style={{ height: rowHeight }}
                    onClick={() => onRowClick?.(row, actualIndex)}
                  >
                    {columns.map((col) => (
                      <div
                        key={col.key}
                        className={cn('px-4 py-3 text-sm flex items-center', col.className)}
                        style={{
                          width: col.width,
                          minWidth: col.minWidth,
                          flex: col.width ? undefined : 1,
                        }}
                      >
                        {col.render ? col.render(row, actualIndex) : (row as any)[col.key]}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * SIMPLE VIRTUALIZED LIST (Single column)
 * ============================================================ */

export interface VirtualizedListProps<T = any> {
  data: T[];
  itemHeight: number;
  height?: string | number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey: (item: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function VirtualizedList<T = any>({
  data,
  itemHeight,
  height = '600px',
  overscan = 5,
  renderItem,
  getItemKey,
  loading = false,
  emptyMessage = 'No items',
  className,
}: VirtualizedListProps<T>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const containerHeight = typeof height === 'number' ? height : 600;
  const totalHeight = data.length * itemHeight;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    data.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleData = data.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;
  
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={cn('overflow-auto', className)}
      style={{ height }}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="relative" style={{ height: totalHeight }}>
          <div
            className="absolute left-0 right-0"
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {visibleData.map((item, idx) => {
              const actualIndex = startIndex + idx;
              const key = getItemKey(item, actualIndex);
              
              return (
                <div key={key} style={{ height: itemHeight }}>
                  {renderItem(item, actualIndex)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
