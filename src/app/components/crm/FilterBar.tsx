/**
 * FilterBar — Thanh tìm kiếm + bộ lọc dùng chung
 * Phase F0-11 — Reusable search + filter pattern
 *
 * Hỗ trợ 2 loại filter:
 *   - select: dropdown chọn 1 giá trị
 *   - button-group: nhóm nút toggle (style pills)
 */
import { Search, X, Filter } from "lucide-react";

/* ============================================================
 * Types
 * ============================================================ */
export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelectConfig {
  key: string;
  label: string;
  type: "select";
  options: FilterOption[];
  /** Placeholder khi chưa chọn */
  placeholder?: string;
}

export interface FilterButtonGroupConfig {
  key: string;
  label: string;
  type: "button-group";
  options: FilterOption[];
}

export type FilterConfig = FilterSelectConfig | FilterButtonGroupConfig;

export interface FilterBarProps {
  /** Giá trị search hiện tại */
  search: string;
  /** Callback khi search thay đổi */
  onSearchChange: (value: string) => void;
  /** Placeholder cho ô search */
  searchPlaceholder?: string;
  /** Danh sách cấu hình filter */
  filters?: FilterConfig[];
  /** Giá trị filter hiện tại (key → value, "" = all) */
  filterValues?: Record<string, string>;
  /** Callback khi 1 filter thay đổi */
  onFilterChange?: (key: string, value: string) => void;
  /** Callback xóa tất cả filter + search */
  onClearAll?: () => void;
  /** Có filter nào đang active không */
  hasActiveFilters?: boolean;
  /** Nội dung phụ bên phải (VD: ViewToggle, nút Tạo mới) */
  actions?: React.ReactNode;
  /** Ẩn nút bộ lọc mở rộng, hiện tất cả filter inline */
  inline?: boolean;
}

/* ============================================================
 * Component
 * ============================================================ */
export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  filters = [],
  filterValues = {},
  onFilterChange,
  onClearAll,
  hasActiveFilters = false,
  actions,
  inline = false,
}: FilterBarProps) {
  /* Phân loại filter */
  const selectFilters = filters.filter((f): f is FilterSelectConfig => f.type === "select");
  const buttonGroupFilters = filters.filter((f): f is FilterButtonGroupConfig => f.type === "button-group");

  /* Active filter chips */
  const activeChips = filters
    .filter((f) => filterValues[f.key] && filterValues[f.key] !== "")
    .map((f) => {
      const opt = f.options.find((o) => o.value === filterValues[f.key]);
      return { key: f.key, filterLabel: f.label, valueLabel: opt?.label ?? filterValues[f.key] };
    });

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Row 1: Search + select filters + actions */}
      <div className="flex items-center gap-2 flex-wrap p-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm
              focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100
              text-gray-700 placeholder-gray-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Select filters (inline hoặc khi có ít filter) */}
        {(inline || selectFilters.length <= 3) &&
          selectFilters.map((f) => (
            <select
              key={f.key}
              value={filterValues[f.key] ?? ""}
              onChange={(e) => onFilterChange?.(f.key, e.target.value)}
              className="px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600
                focus:outline-none focus:border-blue-400 min-w-[120px]"
            >
              <option value="">{f.placeholder ?? `Tất cả ${f.label.toLowerCase()}`}</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}

        {/* Clear button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 px-2.5 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xoá lọc</span>
          </button>
        )}

        {/* Actions slot */}
        {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
      </div>

      {/* Row 2: Button group filters */}
      {buttonGroupFilters.length > 0 && (
        <div className="px-3 pb-3 flex items-center gap-3 flex-wrap">
          {buttonGroupFilters.map((f) => (
            <div key={f.key} className="flex items-center gap-1 flex-wrap">
              <span className="text-[11px] text-gray-400 mr-0.5">{f.label}:</span>
              {f.options.map((opt) => {
                const isActive = (filterValues[f.key] ?? "") === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFilterChange?.(f.key, isActive ? "" : opt.value)}
                    className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 hover:bg-gray-100 bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Row 3: Active filter chips */}
      {activeChips.length > 0 && (
        <div className="px-3 pb-2 flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3 h-3 text-gray-400" />
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px]"
            >
              {chip.filterLabel}: {chip.valueLabel}
              <button
                type="button"
                onClick={() => onFilterChange?.(chip.key, "")}
                className="hover:text-blue-900"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
