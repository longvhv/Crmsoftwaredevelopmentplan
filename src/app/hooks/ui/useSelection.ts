/* ============================================================
 * Selection Hook
 * Multi-select with keyboard support (Shift, Ctrl/Cmd)
 * ============================================================ */

import { useCallback, useState } from "react";
import type { SelectionMode, SelectionState, SelectionActions } from "@/types/ui-state";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseSelectionOptions<T = string> {
  mode?: SelectionMode;
  initialSelected?: T[];
  onSelectionChange?: (selectedIds: T[]) => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export interface UseSelectionReturn<T = string>
  extends SelectionState<T>,
    SelectionActions<T> {
  selectedCount: number;
  isSelected: (id: T) => boolean;
  hasSelection: boolean;
}

/* ============================================================
 * Selection Hook
 * ============================================================ */

export function useSelection<T = string>({
  mode = "multiple",
  initialSelected = [],
  onSelectionChange,
}: UseSelectionOptions<T> = {}): UseSelectionReturn<T> {
  const [selectedIds, setSelectedIds] = useState<Set<T>>(
    new Set(initialSelected)
  );
  const [lastSelectedId, setLastSelectedId] = useState<T | null>(null);
  const [isAllSelected, setIsAllSelected] = useState(false);

  /* ============================================================
   * Selection Actions
   * ============================================================ */

  const select = useCallback(
    (id: T) => {
      if (mode === "none") return;

      setSelectedIds((prev) => {
        const next = mode === "single" ? new Set<T>() : new Set(prev);
        next.add(id);
        onSelectionChange?.(Array.from(next));
        return next;
      });
      setLastSelectedId(id);
    },
    [mode, onSelectionChange]
  );

  const deselect = useCallback(
    (id: T) => {
      if (mode === "none") return;

      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        onSelectionChange?.(Array.from(next));
        return next;
      });

      if (lastSelectedId === id) {
        setLastSelectedId(null);
      }
      setIsAllSelected(false);
    },
    [mode, lastSelectedId, onSelectionChange]
  );

  const toggle = useCallback(
    (id: T) => {
      if (selectedIds.has(id)) {
        deselect(id);
      } else {
        select(id);
      }
    },
    [selectedIds, select, deselect]
  );

  const selectAll = useCallback(
    (ids: T[]) => {
      if (mode !== "multiple") return;

      setSelectedIds(new Set(ids));
      setIsAllSelected(true);
      onSelectionChange?.(ids);
    },
    [mode, onSelectionChange]
  );

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
    setLastSelectedId(null);
    setIsAllSelected(false);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const selectRange = useCallback(
    (fromId: T, toId: T, allIds: T[]) => {
      if (mode !== "multiple") return;

      const fromIndex = allIds.indexOf(fromId);
      const toIndex = allIds.indexOf(toId);

      if (fromIndex === -1 || toIndex === -1) return;

      const start = Math.min(fromIndex, toIndex);
      const end = Math.max(fromIndex, toIndex);

      const rangeIds = allIds.slice(start, end + 1);

      setSelectedIds((prev) => {
        const next = new Set(prev);
        rangeIds.forEach((id) => next.add(id));
        onSelectionChange?.(Array.from(next));
        return next;
      });
    },
    [mode, onSelectionChange]
  );

  /* ============================================================
   * Helper Methods
   * ============================================================ */

  const isSelected = useCallback(
    (id: T): boolean => {
      return selectedIds.has(id);
    },
    [selectedIds]
  );

  const selectedCount = selectedIds.size;
  const hasSelection = selectedCount > 0;

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    // State
    mode,
    selectedIds,
    lastSelectedId,
    isAllSelected,
    selectedCount,
    hasSelection,

    // Actions
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    selectRange,

    // Helpers
    isSelected,
  };
}
