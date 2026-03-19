import * as React from "react";
import { cn } from "./utils";
import { Grip, MoreVertical } from "lucide-react";

/* ============================================================
 * TYPES
 * ============================================================ */

export type ViewMode = "table" | "cards" | "list";

export interface ResponsiveTableColumn<T = any> {
  id: string;
  header: string;
  accessor?: keyof T | ((row: T) => any);
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  mobileHidden?: boolean;
  priority?: number; // 1 = most important, show first on mobile
}

export interface ResponsiveTableProps<T = any> {
  columns: ResponsiveTableColumn<T>[];
  data: T[];
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  mobileBreakpoint?: number;
  renderCard?: (row: T, index: number) => React.ReactNode;
  renderListItem?: (row: T, index: number) => React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
  selectedRows?: Set<number>;
  onSelectionChange?: (selectedRows: Set<number>) => void;
  className?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

export interface UseResponsiveTableOptions {
  defaultViewMode?: ViewMode;
  mobileBreakpoint?: number;
}

export interface UseResponsiveTableReturn {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/* ============================================================
 * HOOKS
 * ============================================================ */

export const useResponsiveTable = ({
  defaultViewMode = "table",
  mobileBreakpoint = 768,
}: UseResponsiveTableOptions = {}): UseResponsiveTableReturn => {
  const [viewMode, setViewMode] = React.useState<ViewMode>(defaultViewMode);
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < mobileBreakpoint;
  const isTablet = windowWidth >= mobileBreakpoint && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Auto-switch to cards on mobile if in table mode
  React.useEffect(() => {
    if (isMobile && viewMode === "table") {
      setViewMode("cards");
    }
  }, [isMobile, viewMode]);

  return {
    viewMode,
    setViewMode,
    isMobile,
    isTablet,
    isDesktop,
  };
};

/* ============================================================
 * RESPONSIVE TABLE COMPONENT
 * ============================================================ */

export function ResponsiveTable<T = any>({
  columns,
  data,
  viewMode: controlledViewMode,
  onViewModeChange,
  mobileBreakpoint = 768,
  renderCard,
  renderListItem,
  onRowClick,
  selectedRows,
  onSelectionChange,
  className,
  keyExtractor = (row, index) => index,
}: ResponsiveTableProps<T>) {
  const { viewMode: autoViewMode, isMobile } = useResponsiveTable({ mobileBreakpoint });
  const viewMode = controlledViewMode || autoViewMode;

  // Get accessor value
  const getAccessorValue = (row: T, column: ResponsiveTableColumn<T>) => {
    if (column.cell) return column.cell(row, 0);
    if (typeof column.accessor === "function") return column.accessor(row);
    if (column.accessor) return row[column.accessor];
    return null;
  };

  // Filter columns for mobile (show priority columns only)
  const visibleColumns = isMobile
    ? columns.filter((col) => !col.mobileHidden).sort((a, b) => (a.priority || 99) - (b.priority || 99))
    : columns;

  // Toggle row selection
  const toggleRowSelection = (index: number) => {
    if (!selectedRows || !onSelectionChange) return;
    const newSelection = new Set(selectedRows);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    onSelectionChange(newSelection);
  };

  /* ========================================
   * TABLE VIEW
   * ======================================== */
  if (viewMode === "table") {
    return (
      <div className={cn("overflow-x-auto", className)}>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-accent/50 border-b border-border">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className="text-left align-middle font-semibold h-10 px-3 whitespace-nowrap"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const key = keyExtractor(row, index);
              const isSelected = selectedRows?.has(index);
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row, index)}
                  className={cn(
                    "border-b border-border transition-colors",
                    onRowClick && "cursor-pointer hover:bg-accent/50",
                    isSelected && "bg-[var(--brand-primary)]/10"
                  )}
                >
                  {visibleColumns.map((column) => (
                    <td key={column.id} className="p-3 align-middle">
                      {column.cell ? column.cell(row, index) : getAccessorValue(row, column)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  /* ========================================
   * CARD VIEW
   * ======================================== */
  if (viewMode === "cards") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {data.map((row, index) => {
          const key = keyExtractor(row, index);
          const isSelected = selectedRows?.has(index);

          if (renderCard) {
            return (
              <div
                key={key}
                onClick={() => onRowClick?.(row, index)}
                className={cn(
                  onRowClick && "cursor-pointer",
                  isSelected && "ring-2 ring-[var(--brand-primary)]"
                )}
              >
                {renderCard(row, index)}
              </div>
            );
          }

          return (
            <div
              key={key}
              onClick={() => onRowClick?.(row, index)}
              className={cn(
                "p-4 rounded-lg border border-border bg-card transition-all",
                onRowClick && "cursor-pointer hover:shadow-md hover:-translate-y-0.5",
                isSelected && "ring-2 ring-[var(--brand-primary)] bg-[var(--brand-primary)]/5"
              )}
            >
              {/* Default Card Layout */}
              <div className="space-y-3">
                {visibleColumns.slice(0, 4).map((column) => (
                  <div key={column.id} className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-muted-foreground shrink-0">
                      {column.header}:
                    </span>
                    <span className="text-sm text-right">
                      {column.cell ? column.cell(row, index) : getAccessorValue(row, column)}
                    </span>
                  </div>
                ))}
              </div>

              {/* More button if there are more columns */}
              {visibleColumns.length > 4 && (
                <button
                  className="mt-3 text-sm text-[var(--brand-primary)] font-medium hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick?.(row, index);
                  }}
                >
                  View More
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* ========================================
   * LIST VIEW
   * ======================================== */
  if (viewMode === "list") {
    return (
      <div className={cn("space-y-2", className)}>
        {data.map((row, index) => {
          const key = keyExtractor(row, index);
          const isSelected = selectedRows?.has(index);

          if (renderListItem) {
            return (
              <div
                key={key}
                onClick={() => onRowClick?.(row, index)}
                className={cn(
                  onRowClick && "cursor-pointer",
                  isSelected && "ring-2 ring-[var(--brand-primary)]"
                )}
              >
                {renderListItem(row, index)}
              </div>
            );
          }

          return (
            <div
              key={key}
              onClick={() => onRowClick?.(row, index)}
              className={cn(
                "p-4 rounded-lg border border-border bg-card flex items-center gap-4 transition-all",
                onRowClick && "cursor-pointer hover:bg-accent/50",
                isSelected && "ring-2 ring-[var(--brand-primary)] bg-[var(--brand-primary)]/5"
              )}
            >
              {/* Drag handle (optional) */}
              <div className="shrink-0 text-muted-foreground">
                <Grip className="size-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  {/* Primary column */}
                  <div className="font-medium truncate">
                    {visibleColumns[0]?.cell
                      ? visibleColumns[0].cell(row, index)
                      : getAccessorValue(row, visibleColumns[0])}
                  </div>

                  {/* Secondary info */}
                  {visibleColumns[1] && (
                    <div className="text-sm text-muted-foreground shrink-0">
                      {visibleColumns[1].cell
                        ? visibleColumns[1].cell(row, index)
                        : getAccessorValue(row, visibleColumns[1])}
                    </div>
                  )}
                </div>

                {/* Additional info */}
                {visibleColumns[2] && (
                  <div className="text-sm text-muted-foreground mt-1 truncate">
                    {visibleColumns[2].cell
                      ? visibleColumns[2].cell(row, index)
                      : getAccessorValue(row, visibleColumns[2])}
                  </div>
                )}
              </div>

              {/* Actions */}
              <button
                className="shrink-0 p-2 rounded hover:bg-accent transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Show context menu or actions
                }}
              >
                <MoreVertical className="size-4 text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

ResponsiveTable.displayName = "ResponsiveTable";

/* ============================================================
 * VIEW MODE TOGGLE
 * ============================================================ */

export interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  availableModes?: ViewMode[];
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  availableModes = ["table", "cards", "list"],
  className,
}) => {
  const icons: Record<ViewMode, React.ReactNode> = {
    table: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    cards: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    list: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  };

  return (
    <div className={cn("inline-flex rounded-lg border border-border p-1 bg-accent/30", className)}>
      {availableModes.map((mode) => (
        <button
          key={mode}
          onClick={() => onViewModeChange(mode)}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
            viewMode === mode
              ? "bg-[var(--brand-primary)] text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
          aria-label={`View as ${mode}`}
        >
          {icons[mode]}
        </button>
      ))}
    </div>
  );
};

ViewModeToggle.displayName = "ViewModeToggle";
