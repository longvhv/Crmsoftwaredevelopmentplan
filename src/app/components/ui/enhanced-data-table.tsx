import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  GripVertical,
  Pin,
  PinOff,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "./utils";
import { Checkbox } from "./checkbox";
import { Button } from "./button";

/* ============================================================
 * TYPES
 * ============================================================ */

export type SortDirection = "asc" | "desc" | null;

export interface Column<T = any> {
  id: string;
  header: string;
  accessor?: keyof T | ((row: T) => any);
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  pinnable?: boolean;
  resizable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: "left" | "center" | "right";
  sticky?: boolean;
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  
  // Selection
  selectable?: boolean;
  selectedRows?: Set<number>;
  onSelectionChange?: (selectedRows: Set<number>) => void;
  
  // Sorting
  sortable?: boolean;
  sortBy?: string;
  sortDirection?: SortDirection;
  onSort?: (columnId: string, direction: SortDirection) => void;
  
  // Features
  zebra?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  resizable?: boolean;
  density?: "compact" | "normal" | "comfortable";
  
  // Pinning & Visibility
  pinnedColumns?: Set<string>;
  onPinColumn?: (columnId: string) => void;
  hiddenColumns?: Set<string>;
  onToggleColumnVisibility?: (columnId: string) => void;
  
  // States
  loading?: boolean;
  empty?: React.ReactNode;
  
  // Styling
  className?: string;
}

/* ============================================================
 * STYLES
 * ============================================================ */

const densityStyles = {
  compact: "text-xs [&_th]:h-8 [&_th]:px-2 [&_td]:p-1.5",
  normal: "text-sm [&_th]:h-10 [&_th]:px-3 [&_td]:p-2.5",
  comfortable: "text-sm [&_th]:h-12 [&_th]:px-4 [&_td]:p-4",
};

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const EnhancedDataTable = <T extends Record<string, any>>({
  columns,
  data,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  sortable = false,
  sortBy,
  sortDirection,
  onSort,
  zebra = false,
  hoverable = true,
  stickyHeader = false,
  resizable = false,
  density = "normal",
  pinnedColumns = new Set(),
  onPinColumn,
  hiddenColumns = new Set(),
  onToggleColumnVisibility,
  loading = false,
  empty,
  className,
}: DataTableProps<T>) => {
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = React.useState<string | null>(null);

  // Filter visible columns
  const visibleColumns = columns.filter(col => !hiddenColumns.has(col.id));

  // Sort columns (pinned first)
  const sortedColumns = React.useMemo(() => {
    const pinned = visibleColumns.filter(col => pinnedColumns.has(col.id));
    const unpinned = visibleColumns.filter(col => !pinnedColumns.has(col.id));
    return [...pinned, ...unpinned];
  }, [visibleColumns, pinnedColumns]);

  /* ============================================================
   * SELECTION HANDLERS
   * ============================================================ */

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      const allRows = new Set(data.map((_, index) => index));
      onSelectionChange(allRows);
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    if (!onSelectionChange) return;
    
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(index);
    } else {
      newSelection.delete(index);
    }
    onSelectionChange(newSelection);
  };

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < data.length;

  /* ============================================================
   * SORT HANDLERS
   * ============================================================ */

  const handleSort = (columnId: string) => {
    if (!sortable || !onSort) return;

    let newDirection: SortDirection = "asc";
    if (sortBy === columnId) {
      if (sortDirection === "asc") {
        newDirection = "desc";
      } else if (sortDirection === "desc") {
        newDirection = null;
      }
    }
    onSort(columnId, newDirection);
  };

  const getSortIcon = (columnId: string) => {
    if (sortBy !== columnId) {
      return <ChevronsUpDown className="size-4 text-muted-foreground" />;
    }
    if (sortDirection === "asc") {
      return <ChevronUp className="size-4 text-[var(--brand-primary)]" />;
    }
    if (sortDirection === "desc") {
      return <ChevronDown className="size-4 text-[var(--brand-primary)]" />;
    }
    return <ChevronsUpDown className="size-4 text-muted-foreground" />;
  };

  /* ============================================================
   * RESIZE HANDLERS
   * ============================================================ */

  const handleResizeStart = (columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingColumn(columnId);

    const startX = e.clientX;
    const startWidth = columnWidths[columnId] || 150;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      setColumnWidths(prev => ({ ...prev, [columnId]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  /* ============================================================
   * CELL ACCESSOR
   * ============================================================ */

  const getCellValue = (row: T, column: Column<T>) => {
    if (column.accessor) {
      if (typeof column.accessor === "function") {
        return column.accessor(row);
      }
      return row[column.accessor];
    }
    return null;
  };

  /* ============================================================
   * LOADING STATE
   * ============================================================ */

  if (loading) {
    return (
      <div className="w-full space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-accent rounded animate-pulse" />
        ))}
      </div>
    );
  }

  /* ============================================================
   * EMPTY STATE
   * ============================================================ */

  if (data.length === 0) {
    return (
      <div className="w-full border border-border rounded-xl">
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          {empty || (
            <>
              <div className="size-12 rounded-full bg-accent flex items-center justify-center mb-4">
                <Eye className="size-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No Data</h3>
              <p className="text-sm text-muted-foreground">
                There are no records to display
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ============================================================
   * TABLE RENDER
   * ============================================================ */

  return (
    <div className={cn("w-full", className)}>
      <div className="relative w-full overflow-x-auto border border-border rounded-xl">
        <table className={cn("w-full caption-bottom", densityStyles[density])}>
          {/* HEADER */}
          <thead
            className={cn(
              "bg-accent/50 border-b border-border",
              stickyHeader && "sticky top-0 z-10 bg-accent"
            )}
          >
            <tr>
              {/* Selection Column */}
              {selectable && (
                <th className="w-12 px-3">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}

              {/* Data Columns */}
              {sortedColumns.map((column) => {
                const isPinned = pinnedColumns.has(column.id);
                const isSorted = sortBy === column.id;
                const width = columnWidths[column.id] || column.width;

                return (
                  <th
                    key={column.id}
                    className={cn(
                      "text-left align-middle font-semibold relative group",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      isPinned && "bg-accent/80 sticky left-0 z-20"
                    )}
                    style={{
                      width: width ? `${width}px` : undefined,
                      minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
                      maxWidth: column.maxWidth ? `${column.maxWidth}px` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {/* Column Header */}
                      <div
                        className={cn(
                          "flex items-center gap-2 flex-1 min-w-0",
                          sortable && column.sortable !== false && "cursor-pointer select-none"
                        )}
                        onClick={() =>
                          sortable && column.sortable !== false && handleSort(column.id)
                        }
                      >
                        <span className="truncate">{column.header}</span>
                        {sortable && column.sortable !== false && getSortIcon(column.id)}
                      </div>

                      {/* Pin Button */}
                      {column.pinnable !== false && onPinColumn && (
                        <button
                          type="button"
                          onClick={() => onPinColumn(column.id)}
                          className={cn(
                            "shrink-0 p-1 rounded hover:bg-accent transition-colors",
                            !isPinned && "opacity-0 group-hover:opacity-100"
                          )}
                          aria-label={isPinned ? "Unpin column" : "Pin column"}
                        >
                          {isPinned ? (
                            <PinOff className="size-3.5" />
                          ) : (
                            <Pin className="size-3.5" />
                          )}
                        </button>
                      )}

                      {/* Resize Handle */}
                      {resizable && column.resizable !== false && (
                        <div
                          className={cn(
                            "absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-[var(--brand-primary)] transition-colors",
                            resizingColumn === column.id && "bg-[var(--brand-primary)]"
                          )}
                          onMouseDown={(e) => handleResizeStart(column.id, e)}
                        >
                          <GripVertical className="size-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.map((row, rowIndex) => {
              const isSelected = selectedRows.has(rowIndex);
              const isEven = rowIndex % 2 === 0;

              return (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-b border-border transition-colors",
                    hoverable && "hover:bg-accent/50",
                    zebra && isEven && "bg-accent/20",
                    isSelected && "bg-[var(--brand-primary)]/10 hover:bg-[var(--brand-primary)]/15"
                  )}
                  data-state={isSelected ? "selected" : undefined}
                >
                  {/* Selection Cell */}
                  {selectable && (
                    <td className="w-12 px-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectRow(rowIndex, checked as boolean)
                        }
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}

                  {/* Data Cells */}
                  {sortedColumns.map((column) => {
                    const isPinned = pinnedColumns.has(column.id);
                    const width = columnWidths[column.id] || column.width;

                    return (
                      <td
                        key={column.id}
                        className={cn(
                          "align-middle",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right",
                          isPinned && "bg-background sticky left-0 z-10"
                        )}
                        style={{
                          width: width ? `${width}px` : undefined,
                          minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
                          maxWidth: column.maxWidth ? `${column.maxWidth}px` : undefined,
                        }}
                      >
                        {column.cell
                          ? column.cell(row, rowIndex)
                          : getCellValue(row, column)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

EnhancedDataTable.displayName = "EnhancedDataTable";
