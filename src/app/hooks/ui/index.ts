/* ============================================================
 * UI State Hooks - Central Export
 * All UI state management hooks
 * ============================================================ */

// Selection
export { useSelection } from "./useSelection";
export type { UseSelectionOptions, UseSelectionReturn } from "./useSelection";

// Filters
export { useFilters, applyFilters } from "./useFilters";
export type { UseFiltersOptions, UseFiltersReturn } from "./useFilters";

// Sort
export { useSort, applySort, getSortIcon } from "./useSort";
export type { UseSortOptions, UseSortReturn } from "./useSort";

// Search
export {
  useSearch,
  applySearch,
  highlightMatches,
  getSearchSummary,
} from "./useSearch";
export type { UseSearchOptions, UseSearchReturn } from "./useSearch";

// Pagination
export {
  usePagination,
  useServerPagination,
  paginateData,
  getPaginationSummary,
  getPageNumbers,
} from "./usePagination";
export type {
  UsePaginationOptions,
  UsePaginationReturn,
  UseServerPaginationOptions,
} from "./usePagination";

// View Mode
export { useViewMode, getDensityStyles, getViewModeLabel, getViewModeIcon } from "./useViewMode";
export type { UseViewModeOptions, UseViewModeReturn } from "./useViewMode";

// Column Visibility
export {
  useColumnVisibility,
  createColumnDefinition,
  groupColumnsByPinning,
} from "./useColumnVisibility";
export type {
  UseColumnVisibilityOptions,
  UseColumnVisibilityReturn,
} from "./useColumnVisibility";

// Modal
export {
  useModal,
  useCreateModal,
  useEditModal,
  useDeleteModal,
  useViewModal,
} from "./useModal";
export type { UseModalOptions, UseModalReturn } from "./useModal";

// Dialog
export {
  useDialog,
  useDeleteConfirmation,
  useBulkDeleteConfirmation,
  useUnsavedChangesConfirmation,
} from "./useDialog";
export type {
  UseDialogReturn,
  DialogOptions,
  AlertOptions,
  ConfirmOptions,
  PromptOptions,
} from "./useDialog";

// Table State (combined)
export { useTableState, useSimpleTable } from "./useTableState";
export type {
  UseTableStateOptions,
  UseTableStateReturn,
  UseSimpleTableOptions,
} from "./useTableState";

// Focus Management
export { useFocusTrap, useRovingTabIndex, useSkipToContent } from "./useFocusManagement";
