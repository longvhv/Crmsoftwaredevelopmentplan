/* ============================================================
 * View Mode Hook
 * Switch between table/list/grid/kanban views
 * ============================================================ */

import { useCallback, useState } from "react";
import type { ViewMode, ViewConfig } from "@/types/ui-state";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseViewModeOptions {
  initialMode?: ViewMode;
  initialConfig?: Partial<ViewConfig>;
  onViewChange?: (config: ViewConfig) => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export interface UseViewModeReturn {
  viewConfig: ViewConfig;
  mode: ViewMode;
  density: ViewConfig["density"];
  showImages: boolean;
  showActions: boolean;

  // Actions
  setMode: (mode: ViewMode) => void;
  setDensity: (density: ViewConfig["density"]) => void;
  toggleImages: () => void;
  toggleActions: () => void;
  updateConfig: (config: Partial<ViewConfig>) => void;

  // Helpers
  isTableView: boolean;
  isListView: boolean;
  isGridView: boolean;
  isKanbanView: boolean;
}

/* ============================================================
 * Default Config
 * ============================================================ */

const DEFAULT_CONFIG: ViewConfig = {
  mode: "table",
  density: "comfortable",
  showImages: true,
  showActions: true,
};

/* ============================================================
 * View Mode Hook
 * ============================================================ */

export function useViewMode({
  initialMode = "table",
  initialConfig = {},
  onViewChange,
}: UseViewModeOptions = {}): UseViewModeReturn {
  const [viewConfig, setViewConfig] = useState<ViewConfig>({
    ...DEFAULT_CONFIG,
    mode: initialMode,
    ...initialConfig,
  });

  /* ============================================================
   * Update Handler
   * ============================================================ */

  const updateViewConfig = useCallback(
    (updater: (prev: ViewConfig) => ViewConfig) => {
      setViewConfig((prev) => {
        const next = updater(prev);
        onViewChange?.(next);
        return next;
      });
    },
    [onViewChange]
  );

  /* ============================================================
   * Actions
   * ============================================================ */

  const setMode = useCallback(
    (mode: ViewMode) => {
      updateViewConfig((prev) => ({ ...prev, mode }));
    },
    [updateViewConfig]
  );

  const setDensity = useCallback(
    (density: ViewConfig["density"]) => {
      updateViewConfig((prev) => ({ ...prev, density }));
    },
    [updateViewConfig]
  );

  const toggleImages = useCallback(() => {
    updateViewConfig((prev) => ({ ...prev, showImages: !prev.showImages }));
  }, [updateViewConfig]);

  const toggleActions = useCallback(() => {
    updateViewConfig((prev) => ({ ...prev, showActions: !prev.showActions }));
  }, [updateViewConfig]);

  const updateConfig = useCallback(
    (config: Partial<ViewConfig>) => {
      updateViewConfig((prev) => ({ ...prev, ...config }));
    },
    [updateViewConfig]
  );

  /* ============================================================
   * Computed Values
   * ============================================================ */

  const isTableView = viewConfig.mode === "table";
  const isListView = viewConfig.mode === "list";
  const isGridView = viewConfig.mode === "grid";
  const isKanbanView = viewConfig.mode === "kanban";

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    viewConfig,
    mode: viewConfig.mode,
    density: viewConfig.density,
    showImages: viewConfig.showImages,
    showActions: viewConfig.showActions,

    // Actions
    setMode,
    setDensity,
    toggleImages,
    toggleActions,
    updateConfig,

    // Helpers
    isTableView,
    isListView,
    isGridView,
    isKanbanView,
  };
}

/* ============================================================
 * View Mode Utilities
 * ============================================================ */

/** Get density styles */
export function getDensityStyles(density: ViewConfig["density"]) {
  switch (density) {
    case "compact":
      return {
        rowHeight: 32,
        padding: "4px 8px",
        fontSize: "12px",
        spacing: "2px",
      };
    case "comfortable":
      return {
        rowHeight: 48,
        padding: "8px 12px",
        fontSize: "14px",
        spacing: "4px",
      };
    case "spacious":
      return {
        rowHeight: 64,
        padding: "12px 16px",
        fontSize: "16px",
        spacing: "8px",
      };
  }
}

/** Get view mode label */
export function getViewModeLabel(mode: ViewMode): string {
  switch (mode) {
    case "table":
      return "Table";
    case "list":
      return "List";
    case "grid":
      return "Grid";
    case "kanban":
      return "Kanban";
  }
}

/** Get view mode icon name */
export function getViewModeIcon(mode: ViewMode): string {
  switch (mode) {
    case "table":
      return "table";
    case "list":
      return "list";
    case "grid":
      return "grid";
    case "kanban":
      return "columns";
  }
}
