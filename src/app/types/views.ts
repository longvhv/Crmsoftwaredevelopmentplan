/* ============================================================
 * View Types - Table/List/Card Views & Preferences
 * Cho DataTable, Kanban, Calendar views
 * ============================================================ */

import type {
  UUID,
  ISODateTime,
  SortConfig,
  FilterConfig,
  Pagination,
} from "./common";

/* ============================================================
 * View Mode & Layout
 * ============================================================ */

/** View mode (display format) */
export type ViewMode = "table" | "list" | "card" | "kanban" | "calendar" | "timeline";

/** Table density */
export type TableDensity = "compact" | "normal" | "comfortable";

/** Card size */
export type CardSize = "small" | "medium" | "large";

/* ============================================================
 * Column Configuration
 * ============================================================ */

/** Column data type */
export type ColumnDataType =
  | "text"
  | "number"
  | "currency"
  | "date"
  | "datetime"
  | "boolean"
  | "badge"
  | "avatar"
  | "tag"
  | "progress"
  | "action";

/** Column alignment */
export type ColumnAlignment = "left" | "center" | "right";

/** Column definition */
export interface ColumnDefinition {
  /** Unique column ID */
  id: string;
  /** Field name in data object */
  field: string;
  /** Display header text */
  header: string;
  /** Column data type */
  dataType: ColumnDataType;
  /** Column width (px or %) */
  width?: string | number;
  /** Minimum width (px) */
  minWidth?: number;
  /** Maximum width (px) */
  maxWidth?: number;
  /** Text alignment */
  align?: ColumnAlignment;
  /** Is column sortable */
  sortable?: boolean;
  /** Is column filterable */
  filterable?: boolean;
  /** Is column resizable */
  resizable?: boolean;
  /** Is column pinned (left/right/none) */
  pinned?: "left" | "right" | null;
  /** Is column visible */
  visible?: boolean;
  /** Display order */
  order?: number;
  /** Custom render function */
  render?: (value: unknown, row: unknown) => React.ReactNode;
  /** Custom cell CSS class */
  cellClassName?: string;
  /** Custom header CSS class */
  headerClassName?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Is inline editable */
  editable?: boolean;
  /** Aggregation function (sum, avg, count, etc.) */
  aggregate?: "sum" | "avg" | "min" | "max" | "count";
}

/** Column visibility preset */
export interface ColumnPreset {
  id: UUID;
  name: string;
  description?: string;
  columns: string[]; // Column IDs to show
  isDefault?: boolean;
}

/* ============================================================
 * Filter Preset
 * ============================================================ */

/** Saved filter preset */
export interface FilterPreset {
  id: UUID;
  name: string;
  description?: string;
  entityType: string;
  filters: FilterConfig;
  isDefault?: boolean;
  isPublic?: boolean;
  createdBy: UUID;
  createdAt: ISODateTime;
}

/** Quick filter option */
export interface QuickFilter {
  id: string;
  label: string;
  filters: FilterConfig;
  icon?: string;
  badge?: number;
}

/* ============================================================
 * View Configuration
 * ============================================================ */

/** Saved view configuration */
export interface ViewConfig {
  id: UUID;
  name: string;
  description?: string;
  entityType: string;
  viewMode: ViewMode;
  /** Column configuration */
  columns?: ColumnDefinition[];
  /** Column order */
  columnOrder?: string[];
  /** Column visibility */
  columnVisibility?: Record<string, boolean>;
  /** Sort configuration */
  sort?: SortConfig[];
  /** Filter configuration */
  filters?: FilterConfig;
  /** Pagination settings */
  pagination?: {
    pageSize: number;
  };
  /** Table density */
  density?: TableDensity;
  /** Card size (for card view) */
  cardSize?: CardSize;
  /** Grouping field (for kanban) */
  groupBy?: string;
  /** Is default view */
  isDefault?: boolean;
  /** Is public (shared) */
  isPublic?: boolean;
  /** Owner */
  ownerId: UUID;
  /** Created/Updated timestamps */
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** View state (runtime) */
export interface ViewState {
  /** Current view mode */
  viewMode: ViewMode;
  /** Selected rows */
  selectedRows: UUID[];
  /** Expanded rows (for hierarchical data) */
  expandedRows: UUID[];
  /** Active filters */
  activeFilters: FilterConfig;
  /** Active sort */
  activeSort: SortConfig[];
  /** Current pagination */
  pagination: Pagination;
  /** Is loading */
  isLoading: boolean;
  /** Error message */
  error?: string;
}

/* ============================================================
 * Kanban View Types
 * ============================================================ */

/** Kanban column */
export interface KanbanColumn {
  id: string;
  title: string;
  value: string | number;
  color?: string;
  itemCount: number;
  limit?: number;
  collapsed?: boolean;
}

/** Kanban card data */
export interface KanbanCard {
  id: UUID;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  assignee?: {
    id: UUID;
    name: string;
    avatar?: string;
  };
  priority?: string;
  dueDate?: ISODateTime;
  metadata?: Record<string, unknown>;
}

/** Kanban view config */
export interface KanbanViewConfig {
  groupByField: string;
  columns: KanbanColumn[];
  cardFields: string[];
  allowDragDrop: boolean;
  showCardCount: boolean;
  showColumnLimit: boolean;
}

/* ============================================================
 * Calendar View Types
 * ============================================================ */

/** Calendar view mode */
export type CalendarViewMode = "month" | "week" | "day" | "agenda";

/** Calendar event */
export interface CalendarEvent {
  id: UUID;
  title: string;
  start: ISODateTime;
  end: ISODateTime;
  allDay?: boolean;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  editable?: boolean;
  extendedProps?: Record<string, unknown>;
}

/** Calendar view config */
export interface CalendarViewConfig {
  viewMode: CalendarViewMode;
  startDate: ISODateTime;
  endDate: ISODateTime;
  eventSources: string[];
  showWeekends: boolean;
  showWeekNumbers: boolean;
  slotDuration: string; // e.g., "00:30:00" for 30 minutes
  businessHours?: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  };
}

/* ============================================================
 * Timeline View Types
 * ============================================================ */

/** Timeline item */
export interface TimelineItem {
  id: UUID;
  title: string;
  description?: string;
  timestamp: ISODateTime;
  type: "activity" | "milestone" | "note" | "system";
  icon?: string;
  color?: string;
  actor?: {
    id: UUID;
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, unknown>;
}

/** Timeline group */
export interface TimelineGroup {
  date: string;
  items: TimelineItem[];
}

/* ============================================================
 * Data Table State
 * ============================================================ */

/** Row selection state */
export interface RowSelectionState {
  /** Selected row IDs */
  selectedIds: UUID[];
  /** Is "select all" checked */
  selectAll: boolean;
  /** Total selectable rows */
  totalRows: number;
}

/** Inline editing state */
export interface InlineEditState {
  /** Currently editing row ID */
  editingRowId: UUID | null;
  /** Editing field */
  editingField: string | null;
  /** Original value (for cancel) */
  originalValue: unknown;
  /** Current edited value */
  currentValue: unknown;
  /** Is saving */
  isSaving: boolean;
  /** Validation errors */
  errors: string[];
}

/** Table action definition */
export interface TableAction {
  id: string;
  label: string;
  icon?: string;
  variant?: "default" | "primary" | "danger" | "ghost";
  requiresSelection?: boolean;
  multiSelect?: boolean;
  onClick: (selectedIds: UUID[]) => void;
  isVisible?: (selectedIds: UUID[]) => boolean;
  isDisabled?: (selectedIds: UUID[]) => boolean;
}

/** Bulk action definition */
export interface BulkAction extends TableAction {
  confirmMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

/* ============================================================
 * Export Configuration
 * ============================================================ */

/** Export options */
export interface ExportOptions {
  /** Export format */
  format: "csv" | "excel" | "json" | "pdf";
  /** Columns to export */
  columns?: string[];
  /** Include filters */
  includeFilters?: boolean;
  /** File name */
  fileName?: string;
  /** Export all pages or current page only */
  exportAllPages?: boolean;
}

/* ============================================================
 * Search & Faceted Filters
 * ============================================================ */

/** Facet (filter option with count) */
export interface Facet {
  value: string | number;
  label: string;
  count: number;
  selected?: boolean;
}

/** Faceted filter */
export interface FacetedFilter {
  field: string;
  label: string;
  type: "checkbox" | "radio" | "range" | "date-range";
  facets: Facet[];
  showSearch?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
}

/** Advanced search configuration */
export interface AdvancedSearchConfig {
  /** Searchable fields */
  searchableFields: Array<{
    field: string;
    label: string;
    boost?: number; // Search relevance boost
  }>;
  /** Faceted filters */
  facets?: FacetedFilter[];
  /** Enable fuzzy search */
  fuzzySearch?: boolean;
  /** Minimum characters to trigger search */
  minCharacters?: number;
  /** Debounce delay (ms) */
  debounceDelay?: number;
}

/* ============================================================
 * Dashboard & Widget Types
 * ============================================================ */

/** Widget type */
export type WidgetType =
  | "stat"
  | "chart"
  | "table"
  | "list"
  | "activity-feed"
  | "progress"
  | "gauge"
  | "calendar"
  | "custom";

/** Widget size */
export interface WidgetSize {
  cols: number; // Grid columns (1-12)
  rows: number; // Grid rows
}

/** Dashboard widget */
export interface DashboardWidget {
  id: UUID;
  type: WidgetType;
  title: string;
  description?: string;
  size: WidgetSize;
  position: {
    x: number;
    y: number;
  };
  config: Record<string, unknown>;
  dataSource?: string;
  refreshInterval?: number; // seconds
  lastUpdated?: ISODateTime;
}

/** Dashboard layout */
export interface DashboardLayout {
  id: UUID;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  gridColumns: number;
  isDefault?: boolean;
  ownerId: UUID;
}

/* ============================================================
 * List View Types
 * ============================================================ */

/** List item configuration */
export interface ListItemConfig {
  /** Primary text field */
  primaryField: string;
  /** Secondary text field */
  secondaryField?: string;
  /** Avatar/image field */
  avatarField?: string;
  /** Tags field */
  tagsField?: string;
  /** Metadata fields to show */
  metadataFields?: string[];
  /** Actions to show */
  actions?: TableAction[];
}

/** List view configuration */
export interface ListViewConfig {
  itemConfig: ListItemConfig;
  showAvatar?: boolean;
  showCheckbox?: boolean;
  showDivider?: boolean;
  density?: "compact" | "normal" | "comfortable";
}

/* ============================================================
 * Card View Types
 * ============================================================ */

/** Card field configuration */
export interface CardFieldConfig {
  field: string;
  label?: string;
  type: ColumnDataType;
  icon?: string;
}

/** Card view configuration */
export interface CardViewConfig {
  /** Title field */
  titleField: string;
  /** Subtitle field */
  subtitleField?: string;
  /** Image field */
  imageField?: string;
  /** Fields to display */
  fields: CardFieldConfig[];
  /** Card size */
  cardSize: CardSize;
  /** Cards per row */
  cardsPerRow?: number;
  /** Show actions on hover */
  showActionsOnHover?: boolean;
  /** Actions */
  actions?: TableAction[];
}

/* ============================================================
 * User Preferences
 * ============================================================ */

/** User view preferences */
export interface UserViewPreferences {
  userId: UUID;
  entityType: string;
  /** Default view mode */
  defaultViewMode: ViewMode;
  /** Default view config ID */
  defaultViewId?: UUID;
  /** Table preferences */
  tablePreferences?: {
    density: TableDensity;
    pageSize: number;
    stickyHeader: boolean;
    showRowNumbers: boolean;
  };
  /** Saved views */
  savedViews: UUID[];
  /** Saved filters */
  savedFilters: UUID[];
  /** Recently used filters */
  recentFilters: FilterPreset[];
  /** Last updated */
  updatedAt: ISODateTime;
}

/* ============================================================
 * Type Guards
 * ============================================================ */

/** Check if view is table */
export function isTableView(viewMode: ViewMode): boolean {
  return viewMode === "table";
}

/** Check if view is kanban */
export function isKanbanView(viewMode: ViewMode): boolean {
  return viewMode === "kanban";
}

/** Check if view is calendar */
export function isCalendarView(viewMode: ViewMode): boolean {
  return viewMode === "calendar";
}

/** Check if column is editable */
export function isColumnEditable(column: ColumnDefinition): boolean {
  return column.editable === true;
}

/** Check if column is sortable */
export function isColumnSortable(column: ColumnDefinition): boolean {
  return column.sortable !== false; // Default to true
}
