/* ============================================================
 * Hook Types - Return types for custom hooks
 * Shared hook interfaces & state management types
 * ============================================================ */

import type {
  UUID,
  ISODateTime,
  BaseEntity,
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  ValidationError,
  SortConfig,
  FilterConfig,
  Pagination,
} from "./common";

import type {
  FormState,
  FormMode,
  FormSubmissionState,
  FormEventHandlers,
} from "./forms";

import type {
  ViewMode,
  ViewConfig,
  ViewState,
  ColumnDefinition,
  InlineEditState,
  RowSelectionState,
} from "./views";

/* ============================================================
 * Data Fetching Hooks
 * ============================================================ */

/** Loading state */
export type LoadingState = "idle" | "loading" | "success" | "error";

/** useQuery return type */
export interface UseQueryResult<T> {
  /** Query data */
  data: T | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  isError: boolean;
  /** Error object */
  error: Error | null;
  /** Refetch function */
  refetch: () => Promise<void>;
  /** Is refetching */
  isRefetching: boolean;
  /** Last updated timestamp */
  dataUpdatedAt?: ISODateTime;
}

/** usePaginatedQuery return type */
export interface UsePaginatedQueryResult<T> {
  /** Paginated data */
  data: T[];
  /** Pagination info */
  pagination: Pagination;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  isError: boolean;
  /** Error object */
  error: Error | null;
  /** Go to page */
  goToPage: (page: number) => void;
  /** Change page size */
  setPageSize: (size: number) => void;
  /** Refetch current page */
  refetch: () => Promise<void>;
  /** Refresh all pages */
  refresh: () => Promise<void>;
}

/** useMutation return type */
export interface UseMutationResult<TData, TVariables> {
  /** Mutation function */
  mutate: (variables: TVariables) => Promise<TData>;
  /** Mutation async function */
  mutateAsync: (variables: TVariables) => Promise<TData>;
  /** Mutation data */
  data: TData | null;
  /** Is mutating */
  isLoading: boolean;
  /** Error state */
  isError: boolean;
  /** Error object */
  error: Error | null;
  /** Is success */
  isSuccess: boolean;
  /** Reset mutation state */
  reset: () => void;
}

/* ============================================================
 * CRUD Hooks
 * ============================================================ */

/** useList hook return type */
export interface UseListResult<T extends BaseEntity> {
  /** List data */
  items: T[];
  /** Total count */
  totalCount: number;
  /** Pagination */
  pagination: Pagination;
  /** Sort config */
  sort: SortConfig[];
  /** Filter config */
  filters: FilterConfig;
  /** Loading state */
  isLoading: boolean;
  /** Error */
  error: Error | null;
  /** Refetch */
  refetch: () => Promise<void>;
  /** Update pagination */
  setPagination: (pagination: Partial<Pagination>) => void;
  /** Update sort */
  setSort: (sort: SortConfig[]) => void;
  /** Update filters */
  setFilters: (filters: FilterConfig) => void;
  /** Clear filters */
  clearFilters: () => void;
}

/** useDetail hook return type */
export interface UseDetailResult<T extends BaseEntity> {
  /** Item data */
  item: T | null;
  /** Loading state */
  isLoading: boolean;
  /** Error */
  error: Error | null;
  /** Refetch */
  refetch: () => Promise<void>;
  /** Update item locally */
  updateLocal: (updates: Partial<T>) => void;
}

/** useCreate hook return type */
export interface UseCreateResult<T extends BaseEntity, TInput = Partial<T>> {
  /** Create function */
  create: (data: TInput) => Promise<T>;
  /** Creating state */
  isCreating: boolean;
  /** Created item */
  createdItem: T | null;
  /** Error */
  error: Error | null;
  /** Reset state */
  reset: () => void;
}

/** useUpdate hook return type */
export interface UseUpdateResult<T extends BaseEntity, TInput = Partial<T>> {
  /** Update function */
  update: (id: UUID, data: TInput & { version: number }) => Promise<T>;
  /** Updating state */
  isUpdating: boolean;
  /** Updated item */
  updatedItem: T | null;
  /** Error */
  error: Error | null;
  /** Reset state */
  reset: () => void;
}

/** useDelete hook return type */
export interface UseDeleteResult {
  /** Delete function (soft delete) */
  deleteItem: (id: UUID) => Promise<void>;
  /** Bulk delete function */
  deleteMany: (ids: UUID[]) => Promise<void>;
  /** Deleting state */
  isDeleting: boolean;
  /** Error */
  error: Error | null;
  /** Reset state */
  reset: () => void;
}

/** useCrud hook return type (combined CRUD operations) */
export interface UseCrudResult<T extends BaseEntity, TInput = Partial<T>> {
  /** List operations */
  list: UseListResult<T>;
  /** Create operation */
  create: UseCreateResult<T, TInput>;
  /** Update operation */
  update: UseUpdateResult<T, TInput>;
  /** Delete operation */
  delete: UseDeleteResult;
}

/* ============================================================
 * Form Hooks
 * ============================================================ */

/** useForm hook return type */
export interface UseFormResult<T> {
  /** Form state */
  formState: FormState<T>;
  /** Form data */
  values: T;
  /** Form errors */
  errors: ValidationError[];
  /** Is dirty */
  isDirty: boolean;
  /** Is valid */
  isValid: boolean;
  /** Is submitting */
  isSubmitting: boolean;
  /** Set field value */
  setValue: (field: keyof T, value: unknown) => void;
  /** Set multiple values */
  setValues: (values: Partial<T>) => void;
  /** Validate form */
  validate: () => Promise<boolean>;
  /** Validate field */
  validateField: (field: keyof T) => Promise<boolean>;
  /** Submit form */
  submit: () => Promise<void>;
  /** Reset form */
  reset: (data?: T) => void;
  /** Get field props (for input binding) */
  getFieldProps: (field: keyof T) => {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    error?: string;
  };
}

/** useFormArray hook return type */
export interface UseFormArrayResult<T> {
  /** Array items */
  items: T[];
  /** Append item */
  append: (item: T) => void;
  /** Prepend item */
  prepend: (item: T) => void;
  /** Insert item at index */
  insert: (index: number, item: T) => void;
  /** Remove item at index */
  remove: (index: number) => void;
  /** Move item */
  move: (fromIndex: number, toIndex: number) => void;
  /** Update item */
  update: (index: number, item: Partial<T>) => void;
  /** Replace all items */
  replace: (items: T[]) => void;
}

/* ============================================================
 * Table/DataTable Hooks
 * ============================================================ */

/** useDataTable hook return type */
export interface UseDataTableResult<T extends BaseEntity> {
  /** Table data */
  data: T[];
  /** Total count */
  totalCount: number;
  /** Columns */
  columns: ColumnDefinition[];
  /** View state */
  viewState: ViewState;
  /** Row selection */
  selection: RowSelectionState;
  /** Inline edit state */
  inlineEdit: InlineEditState;
  /** Loading state */
  isLoading: boolean;
  /** Error */
  error: Error | null;
  /** Set view mode */
  setViewMode: (mode: ViewMode) => void;
  /** Toggle column visibility */
  toggleColumn: (columnId: string) => void;
  /** Reorder columns */
  reorderColumns: (columnIds: string[]) => void;
  /** Update sort */
  updateSort: (sort: SortConfig[]) => void;
  /** Update filters */
  updateFilters: (filters: FilterConfig) => void;
  /** Update pagination */
  updatePagination: (pagination: Partial<Pagination>) => void;
  /** Select row */
  selectRow: (id: UUID) => void;
  /** Select multiple rows */
  selectRows: (ids: UUID[]) => void;
  /** Clear selection */
  clearSelection: () => void;
  /** Start inline edit */
  startEdit: (rowId: UUID, field: string) => void;
  /** Save inline edit */
  saveEdit: () => Promise<void>;
  /** Cancel inline edit */
  cancelEdit: () => void;
  /** Refresh data */
  refresh: () => Promise<void>;
}

/** useColumnManagement hook return type */
export interface UseColumnManagementResult {
  /** Visible columns */
  visibleColumns: ColumnDefinition[];
  /** All columns */
  allColumns: ColumnDefinition[];
  /** Toggle column */
  toggleColumn: (columnId: string) => void;
  /** Show column */
  showColumn: (columnId: string) => void;
  /** Hide column */
  hideColumn: (columnId: string) => void;
  /** Reorder columns */
  reorderColumns: (columnIds: string[]) => void;
  /** Reset to default */
  resetColumns: () => void;
  /** Save preset */
  savePreset: (name: string) => Promise<void>;
  /** Load preset */
  loadPreset: (presetId: UUID) => void;
}

/** useInlineEdit hook return type */
export interface UseInlineEditResult<T = unknown> {
  /** Editing row ID */
  editingRowId: UUID | null;
  /** Editing field */
  editingField: string | null;
  /** Edited value */
  editedValue: unknown;
  /** Original value */
  originalValue: unknown;
  /** Is saving */
  isSaving: boolean;
  /** Errors */
  errors: string[];
  /** Start edit */
  startEdit: (rowId: UUID, field: string, currentValue: unknown) => void;
  /** Update value */
  updateValue: (value: unknown) => void;
  /** Save edit */
  save: (rowId: UUID, field: string, value: unknown) => Promise<void>;
  /** Cancel edit */
  cancel: () => void;
  /** Is editing row */
  isEditing: (rowId: UUID, field?: string) => boolean;
}

/** useRowSelection hook return type */
export interface UseRowSelectionResult {
  /** Selected IDs */
  selectedIds: UUID[];
  /** Is selected */
  isSelected: (id: UUID) => boolean;
  /** Is all selected */
  isAllSelected: boolean;
  /** Is some selected */
  isSomeSelected: boolean;
  /** Select row */
  selectRow: (id: UUID) => void;
  /** Deselect row */
  deselectRow: (id: UUID) => void;
  /** Toggle row */
  toggleRow: (id: UUID) => void;
  /** Select all */
  selectAll: () => void;
  /** Clear selection */
  clearSelection: () => void;
  /** Selected count */
  selectedCount: number;
}

/* ============================================================
 * Filter & Search Hooks
 * ============================================================ */

/** useFilters hook return type */
export interface UseFiltersResult {
  /** Active filters */
  activeFilters: FilterConfig;
  /** Update filters */
  updateFilters: (filters: FilterConfig) => void;
  /** Add filter */
  addFilter: (field: string, operator: string, value: unknown) => void;
  /** Remove filter */
  removeFilter: (field: string) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Has active filters */
  hasFilters: boolean;
  /** Save filter preset */
  savePreset: (name: string) => Promise<void>;
  /** Load filter preset */
  loadPreset: (presetId: UUID) => void;
}

/** useSearch hook return type */
export interface UseSearchResult<T> {
  /** Search query */
  query: string;
  /** Set search query */
  setQuery: (query: string) => void;
  /** Search results */
  results: T[];
  /** Is searching */
  isSearching: boolean;
  /** Clear search */
  clearSearch: () => void;
  /** Has results */
  hasResults: boolean;
}

/* ============================================================
 * UI State Hooks
 * ============================================================ */

/** useModal hook return type */
export interface UseModalResult {
  /** Is modal open */
  isOpen: boolean;
  /** Open modal */
  open: () => void;
  /** Close modal */
  close: () => void;
  /** Toggle modal */
  toggle: () => void;
}

/** useDrawer hook return type */
export interface UseDrawerResult<T = unknown> {
  /** Is drawer open */
  isOpen: boolean;
  /** Drawer content/data */
  content: T | null;
  /** Open drawer */
  open: (content?: T) => void;
  /** Close drawer */
  close: () => void;
  /** Update content */
  updateContent: (content: T) => void;
}

/** useToast hook return type */
export interface UseToastResult {
  /** Show success toast */
  success: (message: string, options?: ToastOptions) => void;
  /** Show error toast */
  error: (message: string, options?: ToastOptions) => void;
  /** Show warning toast */
  warning: (message: string, options?: ToastOptions) => void;
  /** Show info toast */
  info: (message: string, options?: ToastOptions) => void;
  /** Show loading toast */
  loading: (message: string, options?: ToastOptions) => string;
  /** Dismiss toast */
  dismiss: (toastId: string) => void;
}

/** Toast options */
export interface ToastOptions {
  /** Toast duration (ms) */
  duration?: number;
  /** Toast position */
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/** useConfirm hook return type */
export interface UseConfirmResult {
  /** Show confirmation dialog */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

/** Confirmation options */
export interface ConfirmOptions {
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Is dangerous action (red button) */
  isDangerous?: boolean;
}

/* ============================================================
 * Pagination & Sorting Hooks
 * ============================================================ */

/** usePagination hook return type */
export interface UsePaginationResult {
  /** Pagination state */
  pagination: Pagination;
  /** Go to page */
  goToPage: (page: number) => void;
  /** Next page */
  nextPage: () => void;
  /** Previous page */
  previousPage: () => void;
  /** Set page size */
  setPageSize: (size: number) => void;
  /** Can go to next page */
  canGoNext: boolean;
  /** Can go to previous page */
  canGoPrevious: boolean;
}

/** useSorting hook return type */
export interface UseSortingResult {
  /** Current sort config */
  sort: SortConfig[];
  /** Update sort */
  updateSort: (field: string, direction?: "asc" | "desc") => void;
  /** Add sort */
  addSort: (field: string, direction: "asc" | "desc") => void;
  /** Remove sort */
  removeSort: (field: string) => void;
  /** Clear sort */
  clearSort: () => void;
  /** Get sort direction for field */
  getSortDirection: (field: string) => "asc" | "desc" | null;
}

/* ============================================================
 * Local Storage & Preferences Hooks
 * ============================================================ */

/** useLocalStorage hook return type */
export interface UseLocalStorageResult<T> {
  /** Stored value */
  value: T;
  /** Set value */
  setValue: (value: T | ((prev: T) => T)) => void;
  /** Remove value */
  removeValue: () => void;
}

/** useUserPreferences hook return type */
export interface UseUserPreferencesResult<T> {
  /** Preferences */
  preferences: T;
  /** Update preferences */
  updatePreferences: (updates: Partial<T>) => Promise<void>;
  /** Reset to defaults */
  resetToDefaults: () => Promise<void>;
  /** Is loading */
  isLoading: boolean;
}

/* ============================================================
 * Debounce & Throttle Hooks
 * ============================================================ */

/** useDebounce hook return type */
export interface UseDebounceResult<T> {
  /** Debounced value */
  debouncedValue: T;
  /** Is debouncing */
  isDebouncing: boolean;
}

/** useThrottle hook return type */
export interface UseThrottleResult<T> {
  /** Throttled value */
  throttledValue: T;
  /** Is throttling */
  isThrottling: boolean;
}

/* ============================================================
 * WebSocket & Real-time Hooks
 * ============================================================ */

/** useWebSocket hook return type */
export interface UseWebSocketResult<T = unknown> {
  /** Latest message */
  lastMessage: T | null;
  /** Send message */
  sendMessage: (message: T) => void;
  /** Connection state */
  readyState: "connecting" | "open" | "closing" | "closed";
  /** Is connected */
  isConnected: boolean;
}

/** useSubscription hook return type */
export interface UseSubscriptionResult<T> {
  /** Subscribed data */
  data: T | null;
  /** Is subscribed */
  isSubscribed: boolean;
  /** Error */
  error: Error | null;
  /** Resubscribe */
  resubscribe: () => void;
}

/* ============================================================
 * Export & Import Hooks
 * ============================================================ */

/** useExport hook return type */
export interface UseExportResult {
  /** Export data */
  exportData: (format: "csv" | "excel" | "json" | "pdf") => Promise<void>;
  /** Is exporting */
  isExporting: boolean;
  /** Export error */
  error: Error | null;
}

/** useImport hook return type */
export interface UseImportResult<T> {
  /** Import file */
  importFile: (file: File) => Promise<void>;
  /** Import status */
  status: "idle" | "parsing" | "validating" | "importing" | "success" | "error";
  /** Import progress (0-100) */
  progress: number;
  /** Import results */
  results: {
    totalRows: number;
    successCount: number;
    failureCount: number;
    errors: Array<{ row: number; message: string }>;
  } | null;
  /** Is importing */
  isImporting: boolean;
  /** Error */
  error: Error | null;
  /** Reset */
  reset: () => void;
}
