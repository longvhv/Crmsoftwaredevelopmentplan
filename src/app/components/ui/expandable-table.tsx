import * as React from "react";
import { cn } from "./utils";
import { ChevronRight, ChevronDown } from "lucide-react";

/* ============================================================
 * EXPANDABLE TABLE - Rows with expandable detail panels
 * ============================================================
 * Supports nested content, lazy loading, and animations
 */

export interface ExpandableTableColumn<T = any> {
  key: string;
  header: string;
  width?: number | string;
  minWidth?: number;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface ExpandableTableProps<T = any> {
  /**
   * Data array
   */
  data: T[];
  
  /**
   * Column definitions
   */
  columns: ExpandableTableColumn<T>[];
  
  /**
   * Row key extractor
   */
  getRowKey: (row: T, index: number) => string;
  
  /**
   * Render expanded content
   */
  renderExpandedContent: (row: T, index: number) => React.ReactNode;
  
  /**
   * Row click handler
   */
  onRowClick?: (row: T, index: number) => void;
  
  /**
   * Expand/collapse handler
   */
  onExpand?: (rowKey: string, isExpanded: boolean) => void;
  
  /**
   * Initially expanded row keys
   */
  defaultExpandedKeys?: string[];
  
  /**
   * Controlled expanded keys
   */
  expandedKeys?: string[];
  
  /**
   * Allow multiple rows expanded
   * @default true
   */
  allowMultiple?: boolean;
  
  /**
   * Lazy load expanded content
   */
  onLoadExpanded?: (row: T, index: number) => Promise<void>;
  
  /**
   * Expand icon position
   * @default 'start'
   */
  expandIconPosition?: 'start' | 'end';
  
  /**
   * Custom row className
   */
  rowClassName?: string | ((row: T, index: number, isExpanded: boolean) => string);
  
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
 * EXPANDABLE TABLE COMPONENT
 * ============================================================ */

export function ExpandableTable<T = any>({
  data,
  columns,
  getRowKey,
  renderExpandedContent,
  onRowClick,
  onExpand,
  defaultExpandedKeys = [],
  expandedKeys: controlledExpandedKeys,
  allowMultiple = true,
  onLoadExpanded,
  expandIconPosition = 'start',
  rowClassName,
  loading = false,
  emptyMessage = 'No data available',
  stickyHeader = true,
  className,
}: ExpandableTableProps<T>) {
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(
    new Set(defaultExpandedKeys)
  );
  const [loadingKeys, setLoadingKeys] = React.useState<Set<string>>(new Set());
  
  const isControlled = controlledExpandedKeys !== undefined;
  const currentExpandedKeys = isControlled
    ? new Set(controlledExpandedKeys)
    : expandedKeys;
  
  // Toggle expand
  const toggleExpand = React.useCallback(
    async (row: T, index: number) => {
      const key = getRowKey(row, index);
      const isExpanded = currentExpandedKeys.has(key);
      
      // If collapsing
      if (isExpanded) {
        if (!isControlled) {
          setExpandedKeys((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        }
        onExpand?.(key, false);
        return;
      }
      
      // If expanding
      let newKeys: Set<string>;
      if (allowMultiple) {
        newKeys = new Set(currentExpandedKeys);
        newKeys.add(key);
      } else {
        newKeys = new Set([key]);
      }
      
      if (!isControlled) {
        setExpandedKeys(newKeys);
      }
      
      // Lazy load if needed
      if (onLoadExpanded) {
        setLoadingKeys((prev) => new Set(prev).add(key));
        try {
          await onLoadExpanded(row, index);
        } finally {
          setLoadingKeys((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        }
      }
      
      onExpand?.(key, true);
    },
    [
      currentExpandedKeys,
      getRowKey,
      isControlled,
      allowMultiple,
      onLoadExpanded,
      onExpand,
    ]
  );
  
  // Get row class
  const getRowClassName = React.useCallback(
    (row: T, index: number, isExpanded: boolean) => {
      if (typeof rowClassName === 'function') {
        return rowClassName(row, index, isExpanded);
      }
      return rowClassName || '';
    },
    [rowClassName]
  );
  
  // Expand icon
  const ExpandIcon: React.FC<{ isExpanded: boolean; isLoading: boolean }> = ({
    isExpanded,
    isLoading,
  }) => {
    if (isLoading) {
      return (
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      );
    }
    
    return isExpanded ? (
      <ChevronDown className="w-4 h-4 transition-transform" />
    ) : (
      <ChevronRight className="w-4 h-4 transition-transform" />
    );
  };
  
  return (
    <div className={cn('relative border border-border rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead
            className={cn(
              'border-b border-border bg-[var(--muted)]/30',
              stickyHeader && 'sticky top-0 z-10'
            )}
          >
            <tr>
              {/* Expand column */}
              <th className="w-12 px-4 py-3" />
              
              {/* Data columns */}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                    col.headerClassName
                  )}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-12 text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const key = getRowKey(row, index);
                const isExpanded = currentExpandedKeys.has(key);
                const isLoadingRow = loadingKeys.has(key);
                
                return (
                  <React.Fragment key={key}>
                    {/* Main Row */}
                    <tr
                      className={cn(
                        'border-b border-border transition-colors',
                        onRowClick && 'cursor-pointer',
                        isExpanded ? 'bg-[var(--muted)]/20' : 'hover:bg-[var(--muted)]/50',
                        getRowClassName(row, index, isExpanded)
                      )}
                      onClick={() => onRowClick?.(row, index)}
                    >
                      {/* Expand Icon Cell */}
                      <td className="w-12 px-4 py-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(row, index);
                          }}
                          className="p-1 hover:bg-[var(--muted)] rounded transition-colors"
                          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                        >
                          <ExpandIcon isExpanded={isExpanded} isLoading={isLoadingRow} />
                        </button>
                      </td>
                      
                      {/* Data Cells */}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn('px-4 py-3 text-sm', col.className)}
                          style={{
                            width: col.width,
                            minWidth: col.minWidth,
                          }}
                        >
                          {col.render ? col.render(row, index) : (row as any)[col.key]}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Expanded Content Row */}
                    {isExpanded && (
                      <tr className="border-b border-border bg-[var(--muted)]/10">
                        <td colSpan={columns.length + 1} className="p-0">
                          <div
                            className={cn(
                              'overflow-hidden transition-all duration-300 ease-in-out',
                              isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                            )}
                          >
                            <div className="p-4 pl-16">
                              {renderExpandedContent(row, index)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
 * EXPANDABLE ROW HOOK
 * ============================================================ */

export interface UseExpandableRowsOptions {
  defaultExpandedKeys?: string[];
  allowMultiple?: boolean;
}

export interface UseExpandableRowsReturn {
  expandedKeys: Set<string>;
  isExpanded: (key: string) => boolean;
  expand: (key: string) => void;
  collapse: (key: string) => void;
  toggle: (key: string) => void;
  expandAll: (keys: string[]) => void;
  collapseAll: () => void;
}

export function useExpandableRows({
  defaultExpandedKeys = [],
  allowMultiple = true,
}: UseExpandableRowsOptions = {}): UseExpandableRowsReturn {
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(
    new Set(defaultExpandedKeys)
  );
  
  const isExpanded = React.useCallback(
    (key: string) => expandedKeys.has(key),
    [expandedKeys]
  );
  
  const expand = React.useCallback(
    (key: string) => {
      setExpandedKeys((prev) => {
        if (allowMultiple) {
          return new Set(prev).add(key);
        }
        return new Set([key]);
      });
    },
    [allowMultiple]
  );
  
  const collapse = React.useCallback((key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);
  
  const toggle = React.useCallback(
    (key: string) => {
      if (expandedKeys.has(key)) {
        collapse(key);
      } else {
        expand(key);
      }
    },
    [expandedKeys, expand, collapse]
  );
  
  const expandAll = React.useCallback((keys: string[]) => {
    setExpandedKeys(new Set(keys));
  }, []);
  
  const collapseAll = React.useCallback(() => {
    setExpandedKeys(new Set());
  }, []);
  
  return {
    expandedKeys,
    isExpanded,
    expand,
    collapse,
    toggle,
    expandAll,
    collapseAll,
  };
}
