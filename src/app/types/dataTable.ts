/**
 * Types dùng chung cho DataTable, pagination, column visibility, inline edit.
 * Phase F0 — Shared Foundation Infrastructure
 */

/* ============================================================
 * Paginated Response — chuẩn API trả về có phân trang
 * ============================================================ */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/* ============================================================
 * Column Definition — mô tả 1 cột trong DataTable
 * ============================================================ */
export interface ColumnDef<T> {
  /** Key duy nhất (thường là keyof T) */
  key: string;
  /** Tiêu đề cột */
  header: string;
  /** Có thể sort không */
  sortable?: boolean;
  /** Có thể ẩn/hiện không (mặc định true) */
  hideable?: boolean;
  /** Ẩn mặc định (user phải bật) */
  defaultHidden?: boolean;
  /** Chiều rộng tối thiểu (px) */
  minWidth?: number;
  /** Render custom cell content */
  render?: (item: T, rowIndex: number) => React.ReactNode;
  /** Render inline edit cell */
  renderEdit?: (
    item: T,
    value: unknown,
    onChange: (value: unknown) => void,
    onSave: () => void,
    onCancel: () => void,
  ) => React.ReactNode;
  /** Lấy giá trị sắp xếp (mặc định dùng item[key]) */
  sortValue?: (item: T) => string | number | Date;
  /** Lấy giá trị hiển thị (mặc định dùng item[key]) */
  getValue?: (item: T) => unknown;
  /** Có cho phép inline edit không */
  editable?: boolean;
  /** CSS class cho cell */
  className?: string;
  /** CSS class cho header */
  headerClassName?: string;
}

/* ============================================================
 * Sort State
 * ============================================================ */
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: string;
  direction: SortDirection;
}

/* ============================================================
 * View Mode
 * ============================================================ */
export type ViewMode = "table" | "card" | "list";

/* ============================================================
 * Inline Edit State
 * ============================================================ */
export interface InlineEditState {
  rowId: string | null;
  field: string | null;
  originalValue: unknown;
}

/* ============================================================
 * Page Size Options
 * ============================================================ */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 25;
