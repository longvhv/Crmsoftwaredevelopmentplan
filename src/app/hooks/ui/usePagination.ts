/* ============================================================
 * Pagination Hook
 * Client-side and server-side pagination
 * ============================================================ */

import { useCallback, useMemo, useState } from "react";
import type { PaginationState, PaginationActions } from "@/types/ui-state";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export type UsePaginationReturn = PaginationState & PaginationActions & {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageRange: { start: number; end: number };
  pageSizeOptions: number[];
};

/* ============================================================
 * Default Values
 * ============================================================ */

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/* ============================================================
 * Pagination Hook
 * ============================================================ */

export function usePagination({
  initialPage = 1,
  initialPageSize = 25,
  total = 0,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  /* ============================================================
   * Computed Values
   * ============================================================ */

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize) || 1;
  }, [total, pageSize]);

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const pageRange = useMemo(() => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return { start, end };
  }, [page, pageSize, total]);

  /* ============================================================
   * Actions
   * ============================================================ */

  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages));
      setPage(validPage);
      onPageChange?.(validPage);
    },
    [totalPages, onPageChange]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(page + 1);
    }
  }, [hasNextPage, page, goToPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      goToPage(page - 1);
    }
  }, [hasPreviousPage, page, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [totalPages, goToPage]);

  const setPageSize = useCallback(
    (newPageSize: number) => {
      setPageSizeState(newPageSize);
      // Reset to first page when page size changes
      setPage(1);
      onPageSizeChange?.(newPageSize);
      onPageChange?.(1);
    },
    [onPageSizeChange, onPageChange]
  );

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    // State
    page,
    pageSize,
    total,
    totalPages,

    // Actions
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,

    // Computed
    hasNextPage,
    hasPreviousPage,
    pageRange,
    pageSizeOptions,
  };
}

/* ============================================================
 * Pagination Utilities
 * ============================================================ */

/** Apply pagination to data array */
export function paginateData<T>(
  data: T[],
  page: number,
  pageSize: number
): T[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

/** Get pagination summary text */
export function getPaginationSummary(
  start: number,
  end: number,
  total: number
): string {
  if (total === 0) {
    return "No items";
  }

  if (total === 1) {
    return "1 item";
  }

  return `${start}-${end} of ${total} items`;
}

/** Calculate page numbers to display */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxPages = 7
): (number | "ellipsis")[] {
  if (totalPages <= maxPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  const halfMax = Math.floor(maxPages / 2);

  // Always show first page
  pages.push(1);

  if (currentPage <= halfMax + 1) {
    // Near start
    for (let i = 2; i <= maxPages - 2; i++) {
      pages.push(i);
    }
    pages.push("ellipsis");
    pages.push(totalPages);
  } else if (currentPage >= totalPages - halfMax) {
    // Near end
    pages.push("ellipsis");
    for (let i = totalPages - (maxPages - 3); i < totalPages; i++) {
      pages.push(i);
    }
    pages.push(totalPages);
  } else {
    // Middle
    pages.push("ellipsis");
    for (
      let i = currentPage - halfMax + 2;
      i <= currentPage + halfMax - 2;
      i++
    ) {
      pages.push(i);
    }
    pages.push("ellipsis");
    pages.push(totalPages);
  }

  return pages;
}

/* ============================================================
 * Server-Side Pagination Hook
 * ============================================================ */

export interface UseServerPaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  fetchData: (page: number, pageSize: number) => Promise<{
    data: unknown[];
    total: number;
  }>;
}

export function useServerPagination({
  initialPage = 1,
  initialPageSize = 25,
  fetchData,
}: UseServerPaginationOptions) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<unknown[]>([]);

  const loadPage = useCallback(
    async (newPage: number, newPageSize: number) => {
      setIsLoading(true);
      try {
        const result = await fetchData(newPage, newPageSize);
        setData(result.data);
        setTotal(result.total);
        setPage(newPage);
        setPageSize(newPageSize);
      } catch (error) {
        console.error("Failed to load page:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchData]
  );

  const pagination = usePagination({
    initialPage,
    initialPageSize,
    total,
    onPageChange: (newPage) => loadPage(newPage, pageSize),
    onPageSizeChange: (newPageSize) => loadPage(1, newPageSize),
  });

  return {
    ...pagination,
    data,
    isLoading,
    reload: () => loadPage(page, pageSize),
  };
}
