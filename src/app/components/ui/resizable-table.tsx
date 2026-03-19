import * as React from "react";
import { cn } from "./utils";
import { GripVertical } from "lucide-react";

/* ============================================================
 * RESIZABLE TABLE - Columns with drag-to-resize
 * ============================================================
 * Supports min/max width, double-click auto-fit, and persistence
 */

export interface ResizableTableColumn<T = any> {
  key: string;
  header: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface ResizableTableProps<T = any> {
  /**
   * Data array
   */
  data: T[];
  
  /**
   * Column definitions
   */
  columns: ResizableTableColumn<T>[];
  
  /**
   * Row key extractor
   */
  getRowKey: (row: T, index: number) => string;
  
  /**
   * Storage key for persisting widths
   */
  storageKey?: string;
  
  /**
   * Column widths change handler
   */
  onColumnWidthsChange?: (widths: Record<string, number>) => void;
  
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
 * COLUMN RESIZER COMPONENT
 * ============================================================ */

interface ColumnResizerProps {
  onResize: (delta: number) => void;
  onResizeEnd: () => void;
  onDoubleClick: () => void;
}

const ColumnResizer: React.FC<ColumnResizerProps> = ({
  onResize,
  onResizeEnd,
  onDoubleClick,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const startXRef = React.useRef(0);
  
  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    startXRef.current = e.clientX;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startXRef.current;
      startXRef.current = moveEvent.clientX;
      onResize(delta);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      onResizeEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize, onResizeEnd]);
  
  return (
    <div
      className={cn(
        'absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group',
        'hover:bg-primary transition-colors',
        isDragging && 'bg-primary'
      )}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
    >
      <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-3 h-3 text-primary" />
      </div>
    </div>
  );
};

/* ============================================================
 * RESIZABLE TABLE COMPONENT
 * ============================================================ */

export function ResizableTable<T = any>({
  data,
  columns,
  getRowKey,
  storageKey,
  onColumnWidthsChange,
  onRowClick,
  rowClassName,
  loading = false,
  emptyMessage = 'No data available',
  stickyHeader = true,
  className,
}: ResizableTableProps<T>) {
  // Initialize column widths from storage or defaults
  const initialWidths = React.useMemo(() => {
    const widths: Record<string, number> = {};
    
    // Try to load from storage
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`${storageKey}-column-widths`);
        if (stored) {
          const parsed = JSON.parse(stored);
          Object.assign(widths, parsed);
        }
      } catch (err) {
        console.error('Failed to load column widths:', err);
      }
    }
    
    // Set defaults for columns without stored widths
    for (const col of columns) {
      if (!widths[col.key]) {
        widths[col.key] = col.width || 150;
      }
    }
    
    return widths;
  }, [columns, storageKey]);
  
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>(initialWidths);
  
  // Save widths to storage
  const saveWidths = React.useCallback(
    (widths: Record<string, number>) => {
      if (storageKey) {
        try {
          localStorage.setItem(`${storageKey}-column-widths`, JSON.stringify(widths));
        } catch (err) {
          console.error('Failed to save column widths:', err);
        }
      }
      onColumnWidthsChange?.(widths);
    },
    [storageKey, onColumnWidthsChange]
  );
  
  // Resize column
  const resizeColumn = React.useCallback(
    (key: string, delta: number) => {
      setColumnWidths((prev) => {
        const col = columns.find((c) => c.key === key);
        if (!col) return prev;
        
        const currentWidth = prev[key] || col.width || 150;
        const newWidth = Math.max(
          col.minWidth || 50,
          Math.min(col.maxWidth || 1000, currentWidth + delta)
        );
        
        return { ...prev, [key]: newWidth };
      });
    },
    [columns]
  );
  
  // Auto-fit column (double-click)
  const autoFitColumn = React.useCallback(
    (key: string) => {
      // In a real implementation, you would measure the content
      // For now, we'll just reset to default width
      setColumnWidths((prev) => {
        const col = columns.find((c) => c.key === key);
        if (!col) return prev;
        
        return { ...prev, [key]: col.width || 150 };
      });
    },
    [columns]
  );
  
  // Get row class
  const getRowClassName = React.useCallback(
    (row: T, index: number) => {
      if (typeof rowClassName === 'function') {
        return rowClassName(row, index);
      }
      return rowClassName || '';
    },
    [rowClassName]
  );
  
  return (
    <div className={cn('relative border border-border rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          {/* Header */}
          <thead
            className={cn(
              'border-b border-border bg-[var(--muted)]/30',
              stickyHeader && 'sticky top-0 z-10'
            )}
          >
            <tr>
              {columns.map((col, colIndex) => {
                const width = columnWidths[col.key] || col.width || 150;
                const isResizable = col.resizable !== false;
                
                return (
                  <th
                    key={col.key}
                    className={cn(
                      'relative px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                      col.headerClassName
                    )}
                    style={{ width }}
                  >
                    <div className="truncate">{col.header}</div>
                    
                    {/* Resizer */}
                    {isResizable && colIndex < columns.length - 1 && (
                      <ColumnResizer
                        onResize={(delta) => resizeColumn(col.key, delta)}
                        onResizeEnd={() => saveWidths(columnWidths)}
                        onDoubleClick={() => autoFitColumn(col.key)}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          
          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const key = getRowKey(row, index);
                
                return (
                  <tr
                    key={key}
                    className={cn(
                      'border-b border-border transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-[var(--muted)]/50',
                      getRowClassName(row, index)
                    )}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {columns.map((col) => {
                      const width = columnWidths[col.key] || col.width || 150;
                      
                      return (
                        <td
                          key={col.key}
                          className={cn('px-4 py-3 text-sm', col.className)}
                          style={{ width }}
                        >
                          <div className="truncate">
                            {col.render ? col.render(row, index) : (row as any)[col.key]}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
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
 * COLUMN RESIZING HOOK
 * ============================================================ */

export interface UseColumnResizingOptions {
  columns: ResizableTableColumn[];
  storageKey?: string;
  onWidthsChange?: (widths: Record<string, number>) => void;
}

export interface UseColumnResizingReturn {
  columnWidths: Record<string, number>;
  resizeColumn: (key: string, delta: number) => void;
  setColumnWidth: (key: string, width: number) => void;
  resetColumnWidths: () => void;
  autoFitColumn: (key: string) => void;
}

export function useColumnResizing({
  columns,
  storageKey,
  onWidthsChange,
}: UseColumnResizingOptions): UseColumnResizingReturn {
  const defaultWidths = React.useMemo(() => {
    const widths: Record<string, number> = {};
    
    // Load from storage
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`${storageKey}-column-widths`);
        if (stored) {
          Object.assign(widths, JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load column widths:', err);
      }
    }
    
    // Set defaults
    for (const col of columns) {
      if (!widths[col.key]) {
        widths[col.key] = col.width || 150;
      }
    }
    
    return widths;
  }, [columns, storageKey]);
  
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>(defaultWidths);
  
  const saveWidths = React.useCallback(
    (widths: Record<string, number>) => {
      if (storageKey) {
        try {
          localStorage.setItem(`${storageKey}-column-widths`, JSON.stringify(widths));
        } catch (err) {
          console.error('Failed to save column widths:', err);
        }
      }
      onWidthsChange?.(widths);
    },
    [storageKey, onWidthsChange]
  );
  
  const resizeColumn = React.useCallback(
    (key: string, delta: number) => {
      setColumnWidths((prev) => {
        const col = columns.find((c) => c.key === key);
        if (!col) return prev;
        
        const currentWidth = prev[key] || col.width || 150;
        const newWidth = Math.max(
          col.minWidth || 50,
          Math.min(col.maxWidth || 1000, currentWidth + delta)
        );
        
        const newWidths = { ...prev, [key]: newWidth };
        saveWidths(newWidths);
        return newWidths;
      });
    },
    [columns, saveWidths]
  );
  
  const setColumnWidth = React.useCallback(
    (key: string, width: number) => {
      setColumnWidths((prev) => {
        const newWidths = { ...prev, [key]: width };
        saveWidths(newWidths);
        return newWidths;
      });
    },
    [saveWidths]
  );
  
  const resetColumnWidths = React.useCallback(() => {
    const widths: Record<string, number> = {};
    for (const col of columns) {
      widths[col.key] = col.width || 150;
    }
    setColumnWidths(widths);
    saveWidths(widths);
  }, [columns, saveWidths]);
  
  const autoFitColumn = React.useCallback(
    (key: string) => {
      const col = columns.find((c) => c.key === key);
      if (col) {
        setColumnWidth(key, col.width || 150);
      }
    },
    [columns, setColumnWidth]
  );
  
  return {
    columnWidths,
    resizeColumn,
    setColumnWidth,
    resetColumnWidths,
    autoFitColumn,
  };
}
