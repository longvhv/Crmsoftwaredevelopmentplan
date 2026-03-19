/**
 * PaginationBar — Thanh phân trang dùng chung
 * Phase F0-08 — Hiển thị navigation + page size selector, mobile responsive
 */
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PAGE_SIZE_OPTIONS, type PageSize } from "../../types/dataTable";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: PageSize;
  startIndex: number;
  endIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  onGoToPage: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onSetPageSize: (size: PageSize) => void;
}

export function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  startIndex,
  endIndex,
  isFirstPage,
  isLastPage,
  onGoToPage,
  onNextPage,
  onPrevPage,
  onSetPageSize,
}: PaginationBarProps) {
  if (totalItems === 0) return null;

  /* Tính số trang hiển thị (tối đa 5 nút) */
  const pageNumbers: number[] = [];
  const maxVisible = 5;
  let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible);
  if (end - start < maxVisible) start = Math.max(0, end - maxVisible);
  for (let i = start; i < end; i++) pageNumbers.push(i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2.5 border-t border-gray-100 bg-gray-50/30">
      {/* Info + Page size */}
      <div className="flex items-center gap-3 text-[12px] text-gray-500">
        <span>
          {startIndex}–{endIndex} / {totalItems}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onSetPageSize(Number(e.target.value) as PageSize)}
          className="border border-gray-200 rounded px-1.5 py-0.5 bg-white text-gray-600 text-[12px] focus:outline-none focus:border-blue-400"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} / trang
            </option>
          ))}
        </select>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-0.5">
        {/* First */}
        <button
          type="button"
          onClick={() => onGoToPage(0)}
          disabled={isFirstPage}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Trang đầu"
        >
          <ChevronsLeft className="w-3.5 h-3.5 text-gray-600" />
        </button>
        {/* Prev */}
        <button
          type="button"
          onClick={onPrevPage}
          disabled={isFirstPage}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Trang trước"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onGoToPage(p)}
            className={`min-w-[28px] h-7 rounded text-[12px] transition-colors ${
              p === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p + 1}
          </button>
        ))}

        {/* Next */}
        <button
          type="button"
          onClick={onNextPage}
          disabled={isLastPage}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Trang sau"
        >
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>
        {/* Last */}
        <button
          type="button"
          onClick={() => onGoToPage(totalPages - 1)}
          disabled={isLastPage}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Trang cuối"
        >
          <ChevronsRight className="w-3.5 h-3.5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
