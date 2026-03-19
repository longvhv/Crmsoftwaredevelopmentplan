/**
 * Hook usePagination — Quản lý phân trang client-side
 * Phase F0-01
 */
import { useState, useMemo, useCallback } from "react";
import { DEFAULT_PAGE_SIZE, type PageSize, PAGE_SIZE_OPTIONS } from "../types/dataTable";

interface UsePaginationOptions {
  /** Số item mỗi trang, mặc định 25 */
  initialPageSize?: PageSize;
  /** Key lưu localStorage (nếu muốn persist pageSize) */
  storageKey?: string;
}

interface UsePaginationReturn<T> {
  /** Items đã phân trang cho trang hiện tại */
  paginatedItems: T[];
  /** Trang hiện tại (0-based) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Tổng số items */
  totalItems: number;
  /** Số items mỗi trang */
  pageSize: PageSize;
  /** Đang ở trang đầu */
  isFirstPage: boolean;
  /** Đang ở trang cuối */
  isLastPage: boolean;
  /** Chỉ số bắt đầu (1-based, cho hiển thị) */
  startIndex: number;
  /** Chỉ số kết thúc (1-based, cho hiển thị) */
  endIndex: number;
  /** Chuyển trang */
  goToPage: (page: number) => void;
  /** Trang tiếp */
  nextPage: () => void;
  /** Trang trước */
  prevPage: () => void;
  /** Đổi page size */
  setPageSize: (size: PageSize) => void;
  /** Reset về trang 1 */
  resetPage: () => void;
}

function loadPageSize(key?: string): PageSize {
  if (!key) return DEFAULT_PAGE_SIZE;
  try {
    const v = localStorage.getItem(`pagination-${key}`);
    const n = Number(v);
    if (PAGE_SIZE_OPTIONS.includes(n as PageSize)) return n as PageSize;
  } catch { /* bỏ qua */ }
  return DEFAULT_PAGE_SIZE;
}

function savePageSize(key: string | undefined, size: PageSize) {
  if (!key) return;
  try { localStorage.setItem(`pagination-${key}`, String(size)); }
  catch { /* bỏ qua */ }
}

export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = {},
): UsePaginationReturn<T> {
  const { initialPageSize, storageKey } = options;
  const [pageSize, setPageSizeState] = useState<PageSize>(
    () => initialPageSize ?? loadPageSize(storageKey),
  );
  const [currentPage, setCurrentPage] = useState(0);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Clamp current page nếu data thay đổi
  const safePage = Math.min(currentPage, totalPages - 1);
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }

  const paginatedItems = useMemo(
    () => items.slice(safePage * pageSize, (safePage + 1) * pageSize),
    [items, safePage, pageSize],
  );

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 0));
  }, []);

  const setPageSize = useCallback((size: PageSize) => {
    setPageSizeState(size);
    savePageSize(storageKey, size);
    setCurrentPage(0);
  }, [storageKey]);

  const resetPage = useCallback(() => setCurrentPage(0), []);

  return {
    paginatedItems,
    currentPage: safePage,
    totalPages,
    totalItems,
    pageSize,
    isFirstPage: safePage === 0,
    isLastPage: safePage >= totalPages - 1,
    startIndex: totalItems === 0 ? 0 : safePage * pageSize + 1,
    endIndex: Math.min((safePage + 1) * pageSize, totalItems),
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    resetPage,
  };
}
