/* ============================================================
 * CRM Shared Components - Central Export
 * All reusable CRM components
 * ============================================================ */

// ============================================================
// State & Layout Components
// ============================================================
export { EmptyState } from "./EmptyState";
export {
  EmptyContacts,
  EmptyDeals,
  EmptyLeads,
  EmptySearchResults,
  EmptyFilterResults,
  ErrorState,
} from "./EmptyState";
export type { EmptyStateProps, PresetEmptyStateProps } from "./EmptyState";

export { LoadingState } from "./LoadingState";
export {
  Skeleton,
  SkeletonTable,
  SkeletonTableRow,
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  SkeletonListItem,
  SkeletonForm,
  TableLoadingState,
  GridLoadingState,
  ListLoadingState,
  FullPageLoading,
  InlineLoading,
  ButtonLoading,
} from "./LoadingState";
export type { LoadingStateProps, SkeletonProps } from "./LoadingState";

// ============================================================
// Search & Filter Components
// ============================================================
export { SearchBar } from "./SearchBar";
export { AdvancedSearchBar, SearchBarWithScope } from "./SearchBar";
export type {
  SearchBarProps,
  AdvancedSearchBarProps,
  SearchBarWithScopeProps,
  SearchScope,
} from "./SearchBar";

export { FilterPanel } from "./FilterPanel";
export { SimpleFilterBar } from "./FilterPanel";
export type {
  FilterPanelProps,
  SimpleFilterBarProps,
} from "./FilterPanel";

// ============================================================
// Pagination Components
// ============================================================
export { Pagination } from "./Pagination";
export {
  SimplePagination,
  CompactPagination,
  InfiniteScrollIndicator,
} from "./Pagination";
export type {
  PaginationProps,
  SimplePaginationProps,
  CompactPaginationProps,
  InfiniteScrollIndicatorProps,
} from "./Pagination";

// Backward compatibility
export { Pagination as PaginationBar } from "./Pagination";

// ============================================================
// Bulk Actions Components
// ============================================================
export { BulkActions } from "./BulkActions";
export {
  CompactBulkActions,
  BulkActionsDropdown,
} from "./BulkActions";
export type {
  BulkActionsProps,
  CompactBulkActionsProps,
  BulkActionsDropdownProps,
} from "./BulkActions";

// ============================================================
// View Mode Components
// ============================================================
export { ViewModeSelector } from "./ViewModeSelector";
export {
  SimpleViewModeSelector,
  CompactViewModeToggle,
} from "./ViewModeSelector";
export type {
  ViewModeSelectorProps,
  SimpleViewModeSelectorProps,
  CompactViewModeToggleProps,
} from "./ViewModeSelector";

// Backward compatibility
export { ViewModeSelector as ViewToggle } from "./ViewModeSelector";

// ============================================================
// Status & Badge Components
// ============================================================
export { StatusBadge } from "./StatusBadge";
export {
  ActiveBadge,
  InactiveBadge,
  PendingBadge,
  CancelledBadge,
  CompletedBadge,
  LeadStatusBadge,
  DealStatusBadge,
  PriorityBadge,
  ContactTypeBadge,
  ScoreBadge,
  CountBadge,
} from "./StatusBadge";
export type {
  StatusBadgeProps,
  LeadStatusBadgeProps,
  DealStatusBadgeProps,
  PriorityBadgeProps,
  ContactTypeBadgeProps,
  ScoreBadgeProps,
  CountBadgeProps,
} from "./StatusBadge";

// ============================================================
// Column Management Components
// ============================================================
export { ColumnVisibilityPanel } from "./ColumnVisibilityPanel";
export {
  SimpleColumnToggle,
  ColumnGroupToggle,
} from "./ColumnVisibilityPanel";
export type {
  ColumnVisibilityPanelProps,
  SimpleColumnToggleProps,
  ColumnGroupToggleProps,
  ColumnGroup,
} from "./ColumnVisibilityPanel";

// Backward compatibility
export { SimpleColumnToggle as ColumnVisibilityDropdown } from "./ColumnVisibilityPanel";

// ============================================================
// Table Components
// ============================================================
export { DataTable } from "./DataTable";

export { InlineEditCell } from "./InlineEditCell";
export type { InlineEditCellProps } from "./InlineEditCell";

// ============================================================
// View Components
// ============================================================
export { ListView } from "./ListView";
export {
  CompactListView,
  SimpleListView,
  GroupedListView,
} from "./ListView";
export type {
  ListViewProps,
  ListViewColumn,
  CompactListViewProps,
  SimpleListViewProps,
  SimpleListItem,
  GroupedListViewProps,
  ListGroup,
} from "./ListView";

export { GridView } from "./GridView";
export {
  MasonryGridView,
  Card,
  CardImage,
  CardHeader,
  CardContent,
  CardFooter,
  CardMeta,
  ContactCard,
} from "./GridView";
export type {
  GridViewProps,
  MasonryGridViewProps,
  CardProps,
  ContactCardProps,
} from "./GridView";

export { KanbanView } from "./KanbanView";
export {
  SimpleKanbanView,
  KanbanCard,
  KanbanCardHeader,
  KanbanCardContent,
  KanbanCardFooter,
  KanbanCardMeta,
  DealCard,
} from "./KanbanView";
export type {
  KanbanViewProps,
  KanbanColumn,
  SimpleKanbanViewProps,
  KanbanCardProps,
  DealCardProps,
} from "./KanbanView";

// ============================================================
// Filter Components (Legacy)
// ============================================================
export { SimpleFilterBar as FilterBar } from "./FilterPanel";

// ============================================================
// Modal Components
// ============================================================
export { ContactFormModal } from "./ContactFormModal";
export type { ContactFormModalProps } from "./ContactFormModal";

export { DealFormModal } from "./DealFormModal";
export type { DealFormModalProps } from "./DealFormModal";

export { ActivityFormModal } from "./ActivityFormModal";
export type { ActivityFormModalProps } from "./ActivityFormModal";

export { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
export type { ConfirmDeleteDialogProps } from "./ConfirmDeleteDialog";

export { AIScoreModal } from "./AIScoreModal";
export type { AIScoreModalProps } from "./AIScoreModal";

// ============================================================
// Special Components
// ============================================================
export { GlobalSearch } from "./GlobalSearch";
export type { GlobalSearchProps } from "./GlobalSearch";

export { NotificationCenter } from "./NotificationCenter";
export type { NotificationCenterProps } from "./NotificationCenter";

export { AIChatWidget } from "./AIChatWidget";
export type { AIChatWidgetProps } from "./AIChatWidget";

// ============================================================
// Form Components
// ============================================================
export { FormBuilder } from "./FormBuilder";
export type {
  FormBuilderProps,
  FormBuilderSection,
  FormBuilderTab,
  FieldConfig,
} from "./FormBuilder";

export { ValidationDisplay } from "./ValidationDisplay";
export { FieldErrorDisplay, FormErrorsSummary } from "./ValidationDisplay";
export type {
  ValidationDisplayProps,
  ValidationMessage,
  ValidationSeverity,
  FieldErrorDisplayProps,
  FormErrorsSummaryProps,
} from "./ValidationDisplay";

export { FileUpload } from "./FileUpload";
export type { FileUploadProps, UploadedFile } from "./FileUpload";

export { RichTextEditor, RichTextViewer } from "./RichTextEditor";
export type {
  RichTextEditorProps,
  RichTextViewerProps,
} from "./RichTextEditor";

export { DateRangePicker, DatePicker } from "./DateRangePicker";
export type {
  DateRangePickerProps,
  DatePickerProps,
  DateRangeValue,
  DateRangePreset,
} from "./DateRangePicker";

export { TagInput, SimpleTagInput } from "./TagInput";
export type {
  TagInputProps,
  SimpleTagInputProps,
  Tag,
} from "./TagInput";

export { ColorPicker, ColorSwatches } from "./ColorPicker";
export type {
  ColorPickerProps,
  ColorSwatchesProps,
} from "./ColorPicker";

export { PhoneInput, PhoneDisplay, ValidatedPhoneInput } from "./PhoneInput";
export type {
  PhoneInputProps,
  PhoneDisplayProps,
  ValidatedPhoneInputProps,
  PhoneInputValue,
} from "./PhoneInput";

// ============================================================
// Specialized Components - Charts & Visualizations
// ============================================================
export { ChartCard } from "./ChartCard";
export type { ChartCardProps } from "./ChartCard";

export { BarChartCard } from "./BarChartCard";
export type { BarChartCardProps, BarChartDataItem } from "./BarChartCard";

export { LineChartCard } from "./LineChartCard";
export type { LineChartCardProps, LineChartDataItem } from "./LineChartCard";

export { PieChartCard } from "./PieChartCard";
export type { PieChartCardProps, PieChartDataItem } from "./PieChartCard";

export { AreaChartCard } from "./AreaChartCard";
export type { AreaChartCardProps, AreaChartDataItem } from "./AreaChartCard";

export { RadarChartCard } from "./RadarChartCard";
export type { RadarChartCardProps, RadarChartDataItem } from "./RadarChartCard";

export { FunnelChart } from "./FunnelChart";
export type { FunnelChartProps, FunnelStage } from "./FunnelChart";

export { HeatmapCard } from "./HeatmapCard";
export type { HeatmapCardProps, HeatmapDataPoint } from "./HeatmapCard";

// ============================================================
// Specialized Components - Statistics & Metrics
// ============================================================
export { StatCard } from "./StatCard";
export type { StatCardProps } from "./StatCard";

export { MetricCard } from "./MetricCard";
export type { MetricCardProps } from "./MetricCard";

export { ProgressCard } from "./ProgressCard";
export type { ProgressCardProps } from "./ProgressCard";

// ============================================================
// Specialized Components - Timeline & Activity
// ============================================================
export { Timeline } from "./Timeline";
export type { TimelineProps } from "./Timeline";

export { TimelineItem } from "./TimelineItem";
export type { TimelineItemProps } from "./TimelineItem";

export { ActivityFeed } from "./ActivityFeed";
export type { ActivityFeedProps, ActivityItem } from "./ActivityFeed";

// ============================================================
// Specialized Components - Calendar
// ============================================================
export { CalendarView } from "./CalendarView";
export type { CalendarViewProps, CalendarEvent } from "./CalendarView";