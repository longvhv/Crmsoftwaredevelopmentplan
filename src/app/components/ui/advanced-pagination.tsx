import * as React from "react";
import { cn } from "./utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

/* ============================================================
 * ADVANCED PAGINATION - Enhanced pagination controls
 * ============================================================
 * Step 97: Advanced pagination with page size, quick jump, and info
 */

export interface AdvancedPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  showPageSizeSelect?: boolean;
  showQuickJumper?: boolean;
  showInfo?: boolean;
  maxVisiblePages?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

export function AdvancedPagination({
  currentPage,
  totalPages,
  pageSize = 10,
  totalItems,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelect = true,
  showQuickJumper = false,
  showInfo = true,
  maxVisiblePages = 7,
  onPageChange,
  onPageSizeChange,
  className,
}: AdvancedPaginationProps) {
  const [jumpPage, setJumpPage] = React.useState("");

  const pages = React.useMemo(() => {
    const items: (number | "ellipsis")[] = [];
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
      
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
      
      items.push(1);
      
      if (shouldShowLeftDots) {
        items.push("ellipsis");
      }
      
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(i);
        }
      }
      
      if (shouldShowRightDots) {
        items.push("ellipsis");
      }
      
      if (totalPages > 1) {
        items.push(totalPages);
      }
    }
    
    return items;
  }, [currentPage, totalPages, maxVisiblePages]);

  const handleJump = () => {
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage("");
    }
  };

  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className={cn("flex items-center justify-between gap-4 flex-wrap", className)}>
      {/* Info */}
      {showInfo && totalItems && (
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <div key={`ellipsis-${index}`} className="px-2">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="min-w-[2.5rem]"
              >
                {page}
              </Button>
            )
          )}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Page Size Select */}
        {showPageSizeSelect && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select value={pageSize.toString()} onValueChange={(val) => onPageSizeChange(parseInt(val))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quick Jumper */}
        {showQuickJumper && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Go to</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJump()}
              className="w-16 px-2 py-1 text-sm border rounded"
              placeholder="Page"
            />
            <Button size="sm" onClick={handleJump}>
              Go
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * SIMPLE PAGINATION - Minimal pagination for mobile
 * ============================================================ */

export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({ currentPage, totalPages, onPageChange, className }: SimplePaginationProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

/* ============================================================
 * LOAD MORE PAGINATION - Infinite scroll style
 * ============================================================ */

export interface LoadMorePaginationProps {
  hasMore: boolean;
  loading?: boolean;
  loadedItems: number;
  totalItems?: number;
  onLoadMore: () => void;
  className?: string;
}

export function LoadMorePagination({
  hasMore,
  loading,
  loadedItems,
  totalItems,
  onLoadMore,
  className,
}: LoadMorePaginationProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 py-4", className)}>
      {totalItems && (
        <div className="text-sm text-muted-foreground">
          Showing {loadedItems} of {totalItems} items
        </div>
      )}
      
      {hasMore && (
        <Button onClick={onLoadMore} disabled={loading} variant="outline">
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}
      
      {!hasMore && loadedItems > 0 && (
        <div className="text-sm text-muted-foreground">
          No more items to load
        </div>
      )}
    </div>
  );
}
