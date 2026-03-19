/* ============================================================
 * Column Visibility Hook
 * Show/hide/reorder table columns
 * ============================================================ */

import { useCallback, useState, useMemo } from "react";
import type { ColumnDefinition, ColumnVisibilityState } from "@/types/ui-state";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseColumnVisibilityOptions {
  initialColumns: ColumnDefinition[];
  onColumnsChange?: (columns: ColumnDefinition[]) => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export interface UseColumnVisibilityReturn {
  columns: Record<string, ColumnDefinition>;
  visibleColumns: ColumnDefinition[];
  hiddenColumns: ColumnDefinition[];
  visibleColumnIds: string[];
  columnCount: number;
  visibleCount: number;
  hiddenCount: number;

  // Actions
  showColumn: (columnId: string) => void;
  hideColumn: (columnId: string) => void;
  toggleColumn: (columnId: string) => void;
  showAllColumns: () => void;
  hideAllColumns: () => void;
  resetColumns: () => void;

  // Reordering
  reorderColumn: (columnId: string, newOrder: number) => void;
  moveColumn: (columnId: string, direction: "left" | "right") => void;

  // Pinning
  pinColumn: (columnId: string, position: "left" | "right") => void;
  unpinColumn: (columnId: string) => void;

  // Width
  setColumnWidth: (columnId: string, width: number) => void;

  // Helpers
  isColumnVisible: (columnId: string) => boolean;
  getColumn: (columnId: string) => ColumnDefinition | undefined;
}

/* ============================================================
 * Column Visibility Hook
 * ============================================================ */

export function useColumnVisibility({
  initialColumns,
  onColumnsChange,
}: UseColumnVisibilityOptions): UseColumnVisibilityReturn {
  // Convert array to record for faster lookups
  const [columns, setColumns] = useState<Record<string, ColumnDefinition>>(
    () => {
      const record: Record<string, ColumnDefinition> = {};
      initialColumns.forEach((col) => {
        record[col.id] = col;
      });
      return record;
    }
  );

  /* ============================================================
   * Update Handler
   * ============================================================ */

  const updateColumns = useCallback(
    (updater: (prev: Record<string, ColumnDefinition>) => Record<string, ColumnDefinition>) => {
      setColumns((prev) => {
        const next = updater(prev);
        onColumnsChange?.(Object.values(next));
        return next;
      });
    },
    [onColumnsChange]
  );

  /* ============================================================
   * Visibility Actions
   * ============================================================ */

  const showColumn = useCallback(
    (columnId: string) => {
      updateColumns((prev) => ({
        ...prev,
        [columnId]: { ...prev[columnId], visible: true },
      }));
    },
    [updateColumns]
  );

  const hideColumn = useCallback(
    (columnId: string) => {
      updateColumns((prev) => ({
        ...prev,
        [columnId]: { ...prev[columnId], visible: false },
      }));
    },
    [updateColumns]
  );

  const toggleColumn = useCallback(
    (columnId: string) => {
      updateColumns((prev) => ({
        ...prev,
        [columnId]: { ...prev[columnId], visible: !prev[columnId].visible },
      }));
    },
    [updateColumns]
  );

  const showAllColumns = useCallback(() => {
    updateColumns((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id] = { ...next[id], visible: true };
      });
      return next;
    });
  }, [updateColumns]);

  const hideAllColumns = useCallback(() => {
    updateColumns((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id] = { ...next[id], visible: false };
      });
      return next;
    });
  }, [updateColumns]);

  const resetColumns = useCallback(() => {
    const record: Record<string, ColumnDefinition> = {};
    initialColumns.forEach((col) => {
      record[col.id] = col;
    });
    setColumns(record);
    onColumnsChange?.(initialColumns);
  }, [initialColumns, onColumnsChange]);

  /* ============================================================
   * Reordering Actions
   * ============================================================ */

  const reorderColumn = useCallback(
    (columnId: string, newOrder: number) => {
      updateColumns((prev) => {
        const allColumns = Object.values(prev).sort((a, b) => a.order - b.order);
        const columnIndex = allColumns.findIndex((c) => c.id === columnId);

        if (columnIndex === -1) return prev;

        // Remove column from current position
        const [column] = allColumns.splice(columnIndex, 1);

        // Insert at new position
        allColumns.splice(newOrder, 0, column);

        // Update all orders
        const next = { ...prev };
        allColumns.forEach((col, index) => {
          next[col.id] = { ...col, order: index };
        });

        return next;
      });
    },
    [updateColumns]
  );

  const moveColumn = useCallback(
    (columnId: string, direction: "left" | "right") => {
      updateColumns((prev) => {
        const allColumns = Object.values(prev).sort((a, b) => a.order - b.order);
        const currentIndex = allColumns.findIndex((c) => c.id === columnId);

        if (currentIndex === -1) return prev;

        const newIndex =
          direction === "left"
            ? Math.max(0, currentIndex - 1)
            : Math.min(allColumns.length - 1, currentIndex + 1);

        if (newIndex === currentIndex) return prev;

        // Swap positions
        const next = { ...prev };
        [allColumns[currentIndex], allColumns[newIndex]] = [
          allColumns[newIndex],
          allColumns[currentIndex],
        ];

        // Update orders
        allColumns.forEach((col, index) => {
          next[col.id] = { ...col, order: index };
        });

        return next;
      });
    },
    [updateColumns]
  );

  /* ============================================================
   * Pinning Actions
   * ============================================================ */

  const pinColumn = useCallback(
    (columnId: string, position: "left" | "right") => {
      updateColumns((prev) => ({
        ...prev,
        [columnId]: { ...prev[columnId], pinned: position },
      }));
    },
    [updateColumns]
  );

  const unpinColumn = useCallback(
    (columnId: string) => {
      updateColumns((prev) => ({
        ...prev,
        [columnId]: { ...prev[columnId], pinned: null },
      }));
    },
    [updateColumns]
  );

  /* ============================================================
   * Width Actions
   * ============================================================ */

  const setColumnWidth = useCallback(
    (columnId: string, width: number) => {
      updateColumns((prev) => ({
        ...prev,
        [columnId]: { ...prev[columnId], width },
      }));
    },
    [updateColumns]
  );

  /* ============================================================
   * Helpers
   * ============================================================ */

  const isColumnVisible = useCallback(
    (columnId: string): boolean => {
      return columns[columnId]?.visible ?? false;
    },
    [columns]
  );

  const getColumn = useCallback(
    (columnId: string): ColumnDefinition | undefined => {
      return columns[columnId];
    },
    [columns]
  );

  /* ============================================================
   * Computed Values
   * ============================================================ */

  const allColumns = useMemo(
    () => Object.values(columns).sort((a, b) => a.order - b.order),
    [columns]
  );

  const visibleColumns = useMemo(
    () => allColumns.filter((col) => col.visible),
    [allColumns]
  );

  const hiddenColumns = useMemo(
    () => allColumns.filter((col) => !col.visible),
    [allColumns]
  );

  const visibleColumnIds = useMemo(
    () => visibleColumns.map((col) => col.id),
    [visibleColumns]
  );

  const columnCount = allColumns.length;
  const visibleCount = visibleColumns.length;
  const hiddenCount = hiddenColumns.length;

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    columns,
    visibleColumns,
    hiddenColumns,
    visibleColumnIds,
    columnCount,
    visibleCount,
    hiddenCount,

    // Actions
    showColumn,
    hideColumn,
    toggleColumn,
    showAllColumns,
    hideAllColumns,
    resetColumns,

    // Reordering
    reorderColumn,
    moveColumn,

    // Pinning
    pinColumn,
    unpinColumn,

    // Width
    setColumnWidth,

    // Helpers
    isColumnVisible,
    getColumn,
  };
}

/* ============================================================
 * Column Utilities
 * ============================================================ */

/** Create default column definition */
export function createColumnDefinition(
  id: string,
  label: string,
  field: string,
  options: Partial<ColumnDefinition> = {}
): ColumnDefinition {
  return {
    id,
    label,
    field,
    visible: true,
    sortable: true,
    filterable: true,
    pinned: null,
    order: 0,
    ...options,
  };
}

/** Group columns by pinning */
export function groupColumnsByPinning(columns: ColumnDefinition[]): {
  left: ColumnDefinition[];
  center: ColumnDefinition[];
  right: ColumnDefinition[];
} {
  const left: ColumnDefinition[] = [];
  const center: ColumnDefinition[] = [];
  const right: ColumnDefinition[] = [];

  columns.forEach((col) => {
    if (col.pinned === "left") {
      left.push(col);
    } else if (col.pinned === "right") {
      right.push(col);
    } else {
      center.push(col);
    }
  });

  return { left, center, right };
}
