/* ============================================================
 * UI State Types
 * Type definitions for UI state management
 * ============================================================ */

/* ============================================================
 * View Mode Types
 * ============================================================ */

/** View mode for list/table pages */
export type ViewMode = "table" | "list" | "grid" | "kanban";

/** View configuration */
export interface ViewConfig {
  mode: ViewMode;
  density: "compact" | "comfortable" | "spacious";
  showImages: boolean;
  showActions: boolean;
}

/* ============================================================
 * Selection Types
 * ============================================================ */

/** Selection mode */
export type SelectionMode = "none" | "single" | "multiple";

/** Selection state */
export interface SelectionState<T = string> {
  mode: SelectionMode;
  selectedIds: Set<T>;
  lastSelectedId: T | null;
  isAllSelected: boolean;
}

/** Selection actions */
export interface SelectionActions<T = string> {
  select: (id: T) => void;
  deselect: (id: T) => void;
  toggle: (id: T) => void;
  selectAll: (ids: T[]) => void;
  deselectAll: () => void;
  selectRange: (fromId: T, toId: T, allIds: T[]) => void;
}

/* ============================================================
 * Filter Types
 * ============================================================ */

/** Filter operator */
export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "greater_than"
  | "greater_than_or_equal"
  | "less_than"
  | "less_than_or_equal"
  | "in"
  | "not_in"
  | "is_empty"
  | "is_not_empty"
  | "between"
  | "not_between";

/** Filter condition */
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: unknown;
  label?: string;
}

/** Filter group logic */
export type FilterLogic = "AND" | "OR";

/** Filter group */
export interface FilterGroup {
  logic: FilterLogic;
  conditions: FilterCondition[];
}

/** Active filters state */
export interface FiltersState {
  groups: FilterGroup[];
  quickFilters: Record<string, unknown>;
}

/* ============================================================
 * Sort Types
 * ============================================================ */

/** Sort direction */
export type SortDirection = "asc" | "desc";

/** Sort field */
export interface SortField {
  field: string;
  direction: SortDirection;
  label?: string;
}

/** Multi-column sort state */
export interface SortState {
  fields: SortField[];
}

/* ============================================================
 * Search Types
 * ============================================================ */

/** Search scope */
export type SearchScope = "all" | "visible" | "selected";

/** Search options */
export interface SearchOptions {
  scope: SearchScope;
  caseSensitive: boolean;
  useRegex: boolean;
  searchFields: string[];
}

/** Search state */
export interface SearchState {
  query: string;
  options: SearchOptions;
  isActive: boolean;
  resultCount: number;
}

/* ============================================================
 * Column Visibility Types
 * ============================================================ */

/** Column definition */
export interface ColumnDefinition {
  id: string;
  label: string;
  field: string;
  visible: boolean;
  sortable: boolean;
  filterable: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  pinned?: "left" | "right" | null;
  order: number;
}

/** Column visibility state */
export interface ColumnVisibilityState {
  columns: Record<string, ColumnDefinition>;
  visibleColumnIds: string[];
}

/* ============================================================
 * Pagination Types
 * ============================================================ */

/** Pagination state */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Pagination actions */
export interface PaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setPageSize: (size: number) => void;
}

/* ============================================================
 * Modal Types
 * ============================================================ */

/** Modal type */
export type ModalType =
  | "create"
  | "edit"
  | "delete"
  | "view"
  | "import"
  | "export"
  | "settings"
  | "confirm"
  | "custom";

/** Modal state */
export interface ModalState<T = unknown> {
  isOpen: boolean;
  type: ModalType;
  data?: T;
  mode?: "create" | "edit" | "view";
}

/** Modal actions */
export interface ModalActions<T = unknown> {
  open: (type: ModalType, data?: T) => void;
  close: () => void;
  setData: (data: T) => void;
}

/* ============================================================
 * Dialog Types
 * ============================================================ */

/** Dialog type */
export type DialogType = "alert" | "confirm" | "prompt" | "custom";

/** Dialog button */
export interface DialogButton {
  label: string;
  variant?: "default" | "destructive" | "outline" | "ghost";
  onClick: () => void | Promise<void>;
}

/** Dialog state */
export interface DialogState {
  isOpen: boolean;
  type: DialogType;
  title: string;
  message?: string;
  buttons: DialogButton[];
  onClose?: () => void;
}

/* ============================================================
 * Sidebar Types
 * ============================================================ */

/** Sidebar position */
export type SidebarPosition = "left" | "right";

/** Sidebar state */
export interface SidebarState {
  isOpen: boolean;
  position: SidebarPosition;
  width: number;
  isCollapsible: boolean;
  isCollapsed: boolean;
}

/** Sidebar actions */
export interface SidebarActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  setWidth: (width: number) => void;
}

/* ============================================================
 * Panel Types
 * ============================================================ */

/** Panel position */
export type PanelPosition = "top" | "bottom" | "left" | "right";

/** Panel state */
export interface PanelState {
  isOpen: boolean;
  position: PanelPosition;
  size: number;
  isResizable: boolean;
}

/** Panel actions */
export interface PanelActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setSize: (size: number) => void;
}

/* ============================================================
 * Toast Types
 * ============================================================ */

/** Toast variant */
export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

/** Toast position */
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/** Toast options */
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/* ============================================================
 * Loading Types
 * ============================================================ */

/** Loading state */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

/* ============================================================
 * Error Types
 * ============================================================ */

/** Error severity */
export type ErrorSeverity = "info" | "warning" | "error" | "critical";

/** Error state */
export interface ErrorState {
  hasError: boolean;
  error?: Error;
  message?: string;
  severity?: ErrorSeverity;
  recoverable?: boolean;
}

/* ============================================================
 * Layout Types
 * ============================================================ */

/** Layout type */
export type LayoutType = "default" | "split" | "sidebar" | "fullscreen";

/** Layout state */
export interface LayoutState {
  type: LayoutType;
  sidebar: SidebarState;
  panels: Record<string, PanelState>;
}

/* ============================================================
 * Theme Types
 * ============================================================ */

/** Theme mode */
export type ThemeMode = "light" | "dark" | "system";

/** Theme state */
export interface ThemeState {
  mode: ThemeMode;
  primaryColor: string;
  accentColor: string;
}

/* ============================================================
 * Bulk Action Types
 * ============================================================ */

/** Bulk action */
export interface BulkAction<T = unknown> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  handler: (selectedIds: string[], items: T[]) => Promise<void> | void;
  isDestructive?: boolean;
  requiresConfirmation?: boolean;
  confirmMessage?: string;
}

/** Bulk action state */
export interface BulkActionState {
  isExecuting: boolean;
  action?: BulkAction;
  progress?: number;
  error?: Error;
}

/* ============================================================
 * Quick Filter Types
 * ============================================================ */

/** Quick filter preset */
export interface QuickFilterPreset {
  id: string;
  label: string;
  icon?: React.ReactNode;
  filters: FilterCondition[];
  badge?: number;
}

/* ============================================================
 * Saved View Types
 * ============================================================ */

/** Saved view */
export interface SavedView {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isShared: boolean;
  filters: FiltersState;
  sort: SortState;
  columns: ColumnVisibilityState;
  viewConfig: ViewConfig;
  createdAt: string;
  updatedAt: string;
}

/* ============================================================
 * Context Menu Types
 * ============================================================ */

/** Context menu item */
export interface ContextMenuItem<T = unknown> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: "default" | "destructive";
  onClick: (data: T) => void;
  separator?: boolean;
  children?: ContextMenuItem<T>[];
}

/** Context menu state */
export interface ContextMenuState<T = unknown> {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem<T>[];
  data?: T;
}

/* ============================================================
 * Keyboard Shortcut Types
 * ============================================================ */

/** Keyboard shortcut */
export interface KeyboardShortcut {
  id: string;
  keys: string[];
  description: string;
  handler: (event: KeyboardEvent) => void;
  enabled: boolean;
}

/* ============================================================
 * Utility Types
 * ============================================================ */

/** UI state update function */
export type StateUpdater<T> = (prev: T) => T;

/** Async state */
export interface AsyncState<T = unknown> {
  data?: T;
  isLoading: boolean;
  error?: Error;
}
