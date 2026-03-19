/**
 * Hook useColumnVisibility — Quản lý ẩn/hiện cột DataTable
 * Phase F0-02 — Persist vào localStorage theo storageKey
 */
import { useState, useCallback, useMemo } from "react";
import type { ColumnDef } from "../types/dataTable";

interface UseColumnVisibilityReturn {
  /** Set cột đang ẩn (key) */
  hiddenColumns: Set<string>;
  /** Cột có đang hiện không */
  isVisible: (key: string) => boolean;
  /** Toggle 1 cột */
  toggleColumn: (key: string) => void;
  /** Hiện tất cả cột */
  showAll: () => void;
  /** Reset về mặc định (từ column defs) */
  resetToDefault: () => void;
  /** Số cột đang hiện / tổng */
  visibleCount: number;
  totalCount: number;
}

function loadHidden(key?: string): Set<string> | null {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(`col-vis-${key}`);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch { /* bỏ qua */ }
  return null;
}

function saveHidden(key: string | undefined, hidden: Set<string>) {
  if (!key) return;
  try { localStorage.setItem(`col-vis-${key}`, JSON.stringify([...hidden])); }
  catch { /* bỏ qua */ }
}

export function useColumnVisibility<T>(
  columns: ColumnDef<T>[],
  storageKey?: string,
): UseColumnVisibilityReturn {
  const defaultHidden = useMemo(() => {
    const set = new Set<string>();
    for (const col of columns) {
      if (col.defaultHidden) set.add(col.key);
    }
    return set;
  }, [columns]);

  const [hiddenColumns, setHidden] = useState<Set<string>>(
    () => loadHidden(storageKey) ?? new Set(defaultHidden),
  );

  const hideableKeys = useMemo(
    () => columns.filter((c) => c.hideable !== false).map((c) => c.key),
    [columns],
  );

  const isVisible = useCallback((key: string) => !hiddenColumns.has(key), [hiddenColumns]);

  const toggleColumn = useCallback((key: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      saveHidden(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const showAll = useCallback(() => {
    const next = new Set<string>();
    saveHidden(storageKey, next);
    setHidden(next);
  }, [storageKey]);

  const resetToDefault = useCallback(() => {
    saveHidden(storageKey, defaultHidden);
    setHidden(new Set(defaultHidden));
  }, [storageKey, defaultHidden]);

  const visibleCount = hideableKeys.filter((k) => !hiddenColumns.has(k)).length;

  return {
    hiddenColumns,
    isVisible,
    toggleColumn,
    showAll,
    resetToDefault,
    visibleCount,
    totalCount: hideableKeys.length,
  };
}
