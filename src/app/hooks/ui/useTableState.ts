/* ============================================================
 * Table State Hook
 * Combined state management for data tables
 * Integrates selection, filters, sort, search, pagination, columns
 * ============================================================ */

import { useMemo } from "react";
import { useSelection, type UseSelectionOptions } from "./useSelection";
import { useFilters, type UseFiltersOptions, applyFilters } from "./useFilters";
import { useSort, type UseSortOptions, applySort } from "./useSort";
import { useSearch, type UseSearchOptions, applySearch } from "./useSearch";
import { usePagination, type UsePaginationOptions, paginateData } from "./usePagination";
import { useViewMode, type UseViewModeOptions } from "./useViewMode";
import {
  useColumnVisibility,
  type UseColumnVisibilityOptions,
} from "./useColumnVisibility";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseTableStateOptions<T> {
  data: T[];
  selection?: UseSelectionOptions;
  filters?: UseFiltersOptions;
  sort?: UseSortOptions;
  search?: UseSearchOptions;
  pagination?: UsePaginationOptions;
  viewMode?: UseViewModeOptions;
  columns?: UseColumnVisibilityOptions;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export interface UseTableStateReturn<T> {
  // Processed data
  processedData: T[];
  filteredData: T[];
  sortedData: T[];
  searchedData: T[];
  paginatedData: T[];

  // State hooks
  selection: ReturnType<typeof useSelection>;
  filters: ReturnType<typeof useFilters>;
  sort: ReturnType<typeof useSort>;
  search: ReturnType<typeof useSearch>;
  pagination: ReturnType<typeof usePagination>;
  viewMode: ReturnType<typeof useViewMode>;
  columns: ReturnType<typeof useColumnVisibility>;

  // Computed values
  totalCount: number;
  filteredCount: number;
  selectedCount: number;
  isEmpty: boolean;
  isFiltered: boolean;
  isSorted: boolean;
  isSearching: boolean;

  // Actions
  resetAll: () => void;
}

/* ============================================================
 * Table State Hook
 * ============================================================ */

export function useTableState<T extends Record<string, unknown>>({
  data,
  selection: selectionOptions,
  filters: filtersOptions,
  sort: sortOptions,
  search: searchOptions,
  pagination: paginationOptions,
  viewMode: viewModeOptions,
  columns: columnsOptions,
}: UseTableStateOptions<T>): UseTableStateReturn<T> {
  /* ============================================================
   * Individual State Hooks
   * ============================================================ */

  const selection = useSelection(selectionOptions);
  const filters = useFilters(filtersOptions);
  const sort = useSort(sortOptions);
  const search = useSearch(searchOptions);
  const viewMode = useViewMode(viewModeOptions);

  // Columns require options
  const columns = columnsOptions
    ? useColumnVisibility(columnsOptions)
    : ({} as ReturnType<typeof useColumnVisibility>);

  /* ============================================================
   * Data Processing Pipeline
   * ============================================================ */

  // 1. Apply filters
  const filteredData = useMemo(() => {
    if (!filters.hasFilters) return data;
    return applyFilters(data, filters.filters);
  }, [data, filters.filters, filters.hasFilters]);

  // 2. Apply search
  const searchedData = useMemo(() => {
    if (!search.search.isActive) return filteredData;
    return applySearch(filteredData, search.search);
  }, [filteredData, search.search]);

  // 3. Apply sort
  const sortedData = useMemo(() => {
    if (!sort.hasSort) return searchedData;
    return applySort(searchedData, sort.sortFields);
  }, [searchedData, sort.sortFields, sort.hasSort]);

  // 4. Update pagination total
  const totalAfterFilters = sortedData.length;

  const pagination = usePagination({
    ...paginationOptions,
    total: totalAfterFilters,
  });

  // 5. Apply pagination
  const paginatedData = useMemo(() => {
    return paginateData(sortedData, pagination.page, pagination.pageSize);
  }, [sortedData, pagination.page, pagination.pageSize]);

  /* ============================================================
   * Computed Values
   * ============================================================ */

  const totalCount = data.length;
  const filteredCount = sortedData.length;
  const selectedCount = selection.selectedCount;
  const isEmpty = data.length === 0;
  const isFiltered = filters.hasFilters || search.search.isActive;
  const isSorted = sort.hasSort;
  const isSearching = search.isSearching;

  /* ============================================================
   * Reset All
   * ============================================================ */

  const resetAll = () => {
    selection.deselectAll();
    filters.clearAll();
    sort.clearSort();
    search.clearSearch();
    pagination.firstPage();
  };

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    // Processed data
    processedData: paginatedData,
    filteredData,
    sortedData,
    searchedData,
    paginatedData,

    // State hooks
    selection,
    filters,
    sort,
    search,
    pagination,
    viewMode,
    columns,

    // Computed values
    totalCount,
    filteredCount,
    selectedCount,
    isEmpty,
    isFiltered,
    isSorted,
    isSearching,

    // Actions
    resetAll,
  };
}

/* ============================================================
 * Simplified Table Hook (most common use case)
 * ============================================================ */

export interface UseSimpleTableOptions<T> {
  data: T[];
  searchFields?: string[];
  defaultPageSize?: number;
}

export function useSimpleTable<T extends Record<string, unknown>>({
  data,
  searchFields = [],
  defaultPageSize = 25,
}: UseSimpleTableOptions<T>) {
  return useTableState({
    data,
    selection: {
      mode: "multiple",
    },
    search: {
      searchFields,
    },
    pagination: {
      initialPageSize: defaultPageSize,
    },
    sort: {
      multiSort: true,
    },
  });
}
