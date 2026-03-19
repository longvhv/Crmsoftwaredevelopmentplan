/* ============================================================
 * Sort Hook
 * Multi-column sorting with stable sort
 * ============================================================ */

import { useCallback, useState, useMemo } from "react";
import type { SortDirection, SortField, SortState } from "@/types/ui-state";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseSortOptions {
  initialSort?: SortField[];
  multiSort?: boolean;
  onSortChange?: (sort: SortField[]) => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export interface UseSortReturn {
  sort: SortState;
  sortFields: SortField[];
  sortCount: number;
  hasSort: boolean;

  // Actions
  setSortField: (field: string, direction?: SortDirection) => void;
  addSortField: (field: string, direction?: SortDirection) => void;
  removeSortField: (field: string) => void;
  toggleSortField: (field: string) => void;
  clearSort: () => void;

  // Helpers
  getSortDirection: (field: string) => SortDirection | undefined;
  isSorted: (field: string) => boolean;
  getSortIndex: (field: string) => number;
}

/* ============================================================
 * Sort Hook
 * ============================================================ */

export function useSort({
  initialSort = [],
  multiSort = false,
  onSortChange,
}: UseSortOptions = {}): UseSortReturn {
  const [sortFields, setSortFields] = useState<SortField[]>(initialSort);

  /* ============================================================
   * Update Handler
   * ============================================================ */

  const updateSort = useCallback(
    (updater: (prev: SortField[]) => SortField[]) => {
      setSortFields((prev) => {
        const next = updater(prev);
        onSortChange?.(next);
        return next;
      });
    },
    [onSortChange]
  );

  /* ============================================================
   * Actions
   * ============================================================ */

  const setSortField = useCallback(
    (field: string, direction: SortDirection = "asc") => {
      updateSort(() => [{ field, direction }]);
    },
    [updateSort]
  );

  const addSortField = useCallback(
    (field: string, direction: SortDirection = "asc") => {
      if (!multiSort) {
        setSortField(field, direction);
        return;
      }

      updateSort((prev) => {
        // Remove existing sort for this field
        const filtered = prev.filter((s) => s.field !== field);
        return [...filtered, { field, direction }];
      });
    },
    [multiSort, setSortField, updateSort]
  );

  const removeSortField = useCallback(
    (field: string) => {
      updateSort((prev) => prev.filter((s) => s.field !== field));
    },
    [updateSort]
  );

  const toggleSortField = useCallback(
    (field: string) => {
      updateSort((prev) => {
        const existing = prev.find((s) => s.field === field);

        if (!existing) {
          // Not sorted yet, add ascending
          if (multiSort) {
            return [...prev, { field, direction: "asc" as SortDirection }];
          } else {
            return [{ field, direction: "asc" as SortDirection }];
          }
        } else if (existing.direction === "asc") {
          // Currently ascending, change to descending
          if (multiSort) {
            return prev.map((s) =>
              s.field === field ? { ...s, direction: "desc" as SortDirection } : s
            );
          } else {
            return [{ field, direction: "desc" as SortDirection }];
          }
        } else {
          // Currently descending, remove sort
          if (multiSort) {
            return prev.filter((s) => s.field !== field);
          } else {
            return [];
          }
        }
      });
    },
    [multiSort, updateSort]
  );

  const clearSort = useCallback(() => {
    updateSort(() => []);
  }, [updateSort]);

  /* ============================================================
   * Helpers
   * ============================================================ */

  const getSortDirection = useCallback(
    (field: string): SortDirection | undefined => {
      return sortFields.find((s) => s.field === field)?.direction;
    },
    [sortFields]
  );

  const isSorted = useCallback(
    (field: string): boolean => {
      return sortFields.some((s) => s.field === field);
    },
    [sortFields]
  );

  const getSortIndex = useCallback(
    (field: string): number => {
      return sortFields.findIndex((s) => s.field === field);
    },
    [sortFields]
  );

  /* ============================================================
   * Computed Values
   * ============================================================ */

  const sortCount = sortFields.length;
  const hasSort = sortCount > 0;

  const sort: SortState = useMemo(
    () => ({
      fields: sortFields,
    }),
    [sortFields]
  );

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    sort,
    sortFields,
    sortCount,
    hasSort,

    // Actions
    setSortField,
    addSortField,
    removeSortField,
    toggleSortField,
    clearSort,

    // Helpers
    getSortDirection,
    isSorted,
    getSortIndex,
  };
}

/* ============================================================
 * Sort Utilities
 * ============================================================ */

/** Apply sort to data array */
export function applySort<T extends Record<string, unknown>>(
  data: T[],
  sortFields: SortField[]
): T[] {
  if (sortFields.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const sortField of sortFields) {
      const { field, direction } = sortField;
      const aValue = a[field];
      const bValue = b[field];

      const result = compareValues(aValue, bValue);

      if (result !== 0) {
        return direction === "asc" ? result : -result;
      }
    }
    return 0;
  });
}

/** Compare two values for sorting */
function compareValues(a: unknown, b: unknown): number {
  // Handle null/undefined
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : -1;
  if (b === null || b === undefined) return 1;

  // Handle numbers
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // Handle strings (case-insensitive)
  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();

  if (aStr < bStr) return -1;
  if (aStr > bStr) return 1;
  return 0;
}

/** Get sort indicator icon */
export function getSortIcon(
  field: string,
  sortFields: SortField[]
): "asc" | "desc" | "none" {
  const sortField = sortFields.find((s) => s.field === field);
  if (!sortField) return "none";
  return sortField.direction;
}
