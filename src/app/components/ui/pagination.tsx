import * as React from "react";
import { cn } from "./utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";

/* ============================================================
 * PAGINATION - Advanced pagination with page jump
 * ============================================================
 * Supports page input, size selector, and info display
 */

export interface PaginationProps {
  /**
   * Current page (1-indexed)
   */
  currentPage: number;
  
  /**
   * Total pages
   */
  totalPages: number;
  
  /**
   * Page change handler
   */
  onPageChange: (page: number) => void;
  
  /**
   * Items per page
   */
  pageSize?: number;
  
  /**
   * Page size change handler
   */
  onPageSizeChange?: (size: number) => void;
  
  /**
   * Page size options
   * @default [10, 20, 50, 100]
   */
  pageSizeOptions?: number[];
  
  /**
   * Total items
   */
  totalItems?: number;
  
  /**
   * Max page buttons to show
   * @default 7
   */
  maxButtons?: number;
  
  /**
   * Show page size selector
   * @default false
   */
  showPageSize?: boolean;
  
  /**
   * Show page jump input
   * @default false
   */
  showPageJump?: boolean;
  
  /**
   * Show info text
   * @default true
   */
  showInfo?: boolean;
  
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Variant
   * @default 'default'
   */
  variant?: 'default' | 'outlined' | 'pills';
  
  /**
   * Custom className
   */
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  totalItems,
  maxButtons = 7,
  showPageSize = false,
  showPageJump = false,
  showInfo = true,
  size = 'md',
  variant = 'default',
  className,
}: PaginationProps) {
  const [jumpPage, setJumpPage] = React.useState('');
  
  // Calculate page buttons to show
  const pageButtons = React.useMemo(() => {
    const buttons: (number | 'ellipsis')[] = [];
    
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      const leftSide = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      const rightSide = Math.min(totalPages, leftSide + maxButtons - 1);
      const adjustedLeft = Math.max(1, rightSide - maxButtons + 1);
      
      if (adjustedLeft > 1) {
        buttons.push(1);
        if (adjustedLeft > 2) {
          buttons.push('ellipsis');
        }
      }
      
      for (let i = adjustedLeft; i <= rightSide; i++) {
        buttons.push(i);
      }
      
      if (rightSide < totalPages) {
        if (rightSide < totalPages - 1) {
          buttons.push('ellipsis');
        }
        buttons.push(totalPages);
      }
    }
    
    return buttons;
  }, [currentPage, totalPages, maxButtons]);
  
  const handlePageJump = () => {
    const page = parseInt(jumpPage, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
    }
  };
  
  const SIZES = {
    sm: 'text-xs h-7 px-2',
    md: 'text-sm h-9 px-3',
    lg: 'text-base h-11 px-4',
  };
  
  const getButtonClasses = (isActive: boolean) => {
    const base = cn(
      'flex items-center justify-center font-medium transition-colors min-w-[2.5rem]',
      SIZES[size]
    );
    
    if (variant === 'outlined') {
      return cn(
        base,
        'border',
        isActive
          ? 'border-primary bg-primary text-white'
          : 'border-border hover:border-primary hover:text-primary'
      );
    }
    
    if (variant === 'pills') {
      return cn(
        base,
        'rounded-full',
        isActive
          ? 'bg-primary text-white'
          : 'hover:bg-[var(--muted)]'
      );
    }
    
    // default variant
    return cn(
      base,
      'rounded-md',
      isActive
        ? 'bg-primary text-white'
        : 'hover:bg-[var(--muted)]'
    );
  };
  
  // Calculate info text
  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;
  
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      {/* Info & Page Size */}
      <div className="flex items-center gap-4">
        {showInfo && totalItems !== undefined && (
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </div>
        )}
        
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={cn(
                'border border-border rounded-md bg-background',
                SIZES[size]
              )}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            getButtonClasses(false),
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        
        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            getButtonClasses(false),
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {/* Page Buttons */}
        {pageButtons.map((button, index) => {
          if (button === 'ellipsis') {
            return (
              <div
                key={`ellipsis-${index}`}
                className={cn('flex items-center justify-center', SIZES[size])}
              >
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </div>
            );
          }
          
          return (
            <button
              key={button}
              type="button"
              onClick={() => onPageChange(button)}
              className={getButtonClasses(button === currentPage)}
            >
              {button}
            </button>
          );
        })}
        
        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            getButtonClasses(false),
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            getButtonClasses(false),
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
        
        {/* Page Jump */}
        {showPageJump && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-sm text-muted-foreground">Go to:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePageJump();
                }
              }}
              className={cn(
                'w-16 border border-border rounded-md bg-background text-center',
                SIZES[size]
              )}
              placeholder="..."
            />
            <button
              type="button"
              onClick={handlePageJump}
              className={cn(getButtonClasses(false))}
            >
              Go
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * SIMPLE PAGINATION
 * ============================================================ */

export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: SimplePaginationProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium rounded-md hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}

/* ============================================================
 * HOOK: usePagination
 * ============================================================ */

export interface UsePaginationProps {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
}

export function usePagination({
  totalItems,
  pageSize = 10,
  initialPage = 1,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [currentPageSize, setCurrentPageSize] = React.useState(pageSize);
  
  const totalPages = Math.ceil(totalItems / currentPageSize);
  
  // Reset to page 1 when page size changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [currentPageSize]);
  
  // Ensure current page is valid
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  
  const startIndex = (currentPage - 1) * currentPageSize;
  const endIndex = Math.min(startIndex + currentPageSize, totalItems);
  
  return {
    currentPage,
    setCurrentPage,
    pageSize: currentPageSize,
    setPageSize: setCurrentPageSize,
    totalPages,
    startIndex,
    endIndex,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    nextPage: () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
    previousPage: () => setCurrentPage((p) => Math.max(p - 1, 1)),
    goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
  };
}
