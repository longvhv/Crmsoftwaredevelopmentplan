/**
 * Hook useSorting — Sắp xếp danh sách theo cột
 * Phase F0-06
 */
import { useState, useMemo, useCallback } from "react";
import type { SortDirection, SortState } from "../types/dataTable";

interface UseSortingReturn<T> {
  /** Items đã sắp xếp */
  sortedItems: T[];
  /** Field đang sort */
  sortField: string | null;
  /** Hướng sort */
  sortDirection: SortDirection;
  /** Toggle sort cho 1 field (click header cột) */
  toggleSort: (field: string) => void;
  /** Set sort cụ thể */
  setSort: (field: string, direction: SortDirection) => void;
  /** Xóa sort */
  clearSort: () => void;
}

export function useSorting<T>(
  items: T[],
  defaultField?: string,
  defaultDirection: SortDirection = "asc",
  /** Hàm custom getValue cho sort, key = field name */
  sortValueGetters?: Record<string, (item: T) => string | number | Date>,
): UseSortingReturn<T> {
  const [sortState, setSortState] = useState<SortState | null>(
    defaultField ? { field: defaultField, direction: defaultDirection } : null,
  );

  const sortedItems = useMemo(() => {
    if (!sortState) return items;
    const { field, direction } = sortState;
    const getter = sortValueGetters?.[field];

    return [...items].sort((a, b) => {
      const aVal = getter ? getter(a) : (a as Record<string, unknown>)[field];
      const bVal = getter ? getter(b) : (b as Record<string, unknown>)[field];

      let cmp = 0;
      if (aVal == null && bVal == null) cmp = 0;
      else if (aVal == null) cmp = -1;
      else if (bVal == null) cmp = 1;
      else if (typeof aVal === "string" && typeof bVal === "string") {
        cmp = aVal.localeCompare(bVal, "vi");
      } else if (aVal instanceof Date && bVal instanceof Date) {
        cmp = aVal.getTime() - bVal.getTime();
      } else {
        cmp = Number(aVal) - Number(bVal);
      }

      return direction === "desc" ? -cmp : cmp;
    });
  }, [items, sortState, sortValueGetters]);

  const toggleSort = useCallback((field: string) => {
    setSortState((prev) => {
      if (prev?.field === field) {
        // asc → desc → clear
        if (prev.direction === "asc") return { field, direction: "desc" };
        return null;
      }
      return { field, direction: "asc" };
    });
  }, []);

  const setSort = useCallback((field: string, direction: SortDirection) => {
    setSortState({ field, direction });
  }, []);

  const clearSort = useCallback(() => setSortState(null), []);

  return {
    sortedItems,
    sortField: sortState?.field ?? null,
    sortDirection: sortState?.direction ?? "asc",
    toggleSort,
    setSort,
    clearSort,
  };
}
