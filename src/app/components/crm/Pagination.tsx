/* ============================================================
 * Pagination Component
 * Full-featured pagination với page size selector
 * ============================================================ */

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPageNumbers } from "@/hooks/ui";

/* ============================================================
 * Types
 * ============================================================ */

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showSummary?: boolean;
  showFirstLast?: boolean;
  maxPages?: number;
  className?: string;
}

/* ============================================================
 * Pagination Component
 * ============================================================ */

export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
  showSummary = true,
  showFirstLast = true,
  maxPages = 7,
  className = "",
}: PaginationProps) {
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pageNumbers = getPageNumbers(page, totalPages, maxPages);

  /* ============================================================
   * Handlers
   * ============================================================ */

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onPageSizeChange?.(newPageSize);
  };

  /* ============================================================
   * Render
   * ============================================================ */

  if (total === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Summary */}
      {showSummary && (
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-medium">{start}</span> đến{" "}
          <span className="font-medium">{end}</span> trong tổng số{" "}
          <span className="font-medium">{total}</span> mục
        </div>
      )}

      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        {showFirstLast && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={!hasPreviousPage}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="w-4 h-4" />
            <span className="sr-only">Trang đầu</span>
          </Button>
        )}

        {/* Previous Page */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPreviousPage}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="sr-only">Trang trước</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-400"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={pageNum}
                type="button"
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className="h-8 w-8 p-0"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* Next Page */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNextPage}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
          <span className="sr-only">Trang sau</span>
        </Button>

        {/* Last Page */}
        {showFirstLast && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={!hasNextPage}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="w-4 h-4" />
            <span className="sr-only">Trang cuối</span>
          </Button>
        )}
      </div>

      {/* Page Size Selector */}
      {showPageSize && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="h-8 px-2 border border-gray-200 rounded-md text-sm bg-white"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">mục</span>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Simple Pagination
 * ============================================================ */

export interface SimplePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({
  page,
  totalPages,
  onPageChange,
  className = "",
}: SimplePaginationProps) {
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Trước
      </Button>

      <span className="text-sm text-gray-600">
        Trang {page} / {totalPages}
      </span>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
      >
        Sau
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

/* ============================================================
 * Compact Pagination (for mobile)
 * ============================================================ */

export interface CompactPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function CompactPagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  className = "",
}: CompactPaginationProps) {
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage}
        className="h-8"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <span className="text-sm text-gray-600">
        {start}-{end} / {total}
      </span>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="h-8"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

/* ============================================================
 * Infinite Scroll Indicator
 * ============================================================ */

export interface InfiniteScrollIndicatorProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  className?: string;
}

export function InfiniteScrollIndicator({
  hasMore,
  isLoading,
  onLoadMore,
  className = "",
}: InfiniteScrollIndicatorProps) {
  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div ref={observerTarget} className={`py-4 text-center ${className}`}>
      {isLoading && (
        <span className="text-sm text-gray-600">Đang tải thêm...</span>
      )}
      {!isLoading && hasMore && (
        <Button type="button" variant="outline" size="sm" onClick={onLoadMore}>
          Tải thêm
        </Button>
      )}
      {!hasMore && (
        <span className="text-sm text-gray-500">Đã hiển thị tất cả</span>
      )}
    </div>
  );
}
