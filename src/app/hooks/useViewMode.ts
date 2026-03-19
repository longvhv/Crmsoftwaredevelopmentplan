/**
 * Hook useViewMode — Toggle chế độ xem (table/card/list)
 * Phase F0-04 — Persist vào localStorage
 */
import { useState, useCallback } from "react";
import type { ViewMode } from "../types/dataTable";

function loadMode(key: string, defaultMode: ViewMode): ViewMode {
  try {
    const v = localStorage.getItem(`view-mode-${key}`);
    if (v === "table" || v === "card" || v === "list") return v;
  } catch { /* bỏ qua */ }
  return defaultMode;
}

function saveMode(key: string, mode: ViewMode) {
  try { localStorage.setItem(`view-mode-${key}`, mode); }
  catch { /* bỏ qua */ }
}

export function useViewMode(storageKey: string, defaultMode: ViewMode = "table") {
  const [mode, setModeState] = useState<ViewMode>(() => loadMode(storageKey, defaultMode));

  const setMode = useCallback((m: ViewMode) => {
    setModeState(m);
    saveMode(storageKey, m);
  }, [storageKey]);

  return { mode, setMode } as const;
}
