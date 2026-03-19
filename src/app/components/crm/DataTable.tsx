/**
 * DataTable — Bảng dữ liệu chung tích hợp
 *   sorting, column visibility, inline edit, row selection, pagination
 * Phase F0-07
 */
import { useState, useCallback, useMemo } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Trash2 } from "lucide-react";
import type { ColumnDef, ViewMode } from "../../types/dataTable";
import { usePagination } from "../../hooks/usePagination";
import { useSorting } from "../../hooks/useSorting";
import { useColumnVisibility } from "../../hooks/useColumnVisibility";
import { useInlineEdit } from "../../hooks/useInlineEdit";
import { PaginationBar } from "./PaginationBar";
import { ColumnVisibilityDropdown } from "./ColumnVisibilityDropdown";
import { InlineEditCell } from "./InlineEditCell";

/* ============================================================
 * Props
 * ============================================================ */
interface DataTableProps<T extends { id: string }> {
  /** Dữ liệu (đã filter từ bên ngoài) */
  data: T[];
  /** Định nghĩa cột */
  columns: ColumnDef<T>[];
  /** Key duy nhất dùng persist localStorage (pageSize, columns, sort) */
  storageKey: string;
  /** Cho phép chọn hàng (checkbox) */
  selectable?: boolean;
  /** Callback khi inline edit save */
  onInlineEdit?: (rowId: string, field: string, value: unknown) => void;
  /** Callback khi click hàng */
  onRowClick?: (item: T) => void;
  /** Callback xóa nhiều */
  onBulkDelete?: (ids: string[]) => void;
  /** Render actions cuối hàng */
  renderRowActions?: (item: T) => React.ReactNode;
  /** Field sort mặc định */
  defaultSortField?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Hiện thanh toolbar trên (column vis, bulk actions) */
  showToolbar?: boolean;
}

/* ============================================================
 * Component
 * ============================================================ */
export function DataTable<T extends { id: string }>({
  data,
  columns,
  storageKey,
  selectable = false,
  onInlineEdit,
  onRowClick,
  onBulkDelete,
  renderRowActions,
  defaultSortField,
  emptyMessage = "Không có dữ liệu",
  showToolbar = true,
}: DataTableProps<T>) {
  /* ---- Sorting ---- */
  const sortValueGetters = useMemo(() => {
    const getters: Record<string, (item: T) => string | number | Date> = {};
    for (const col of columns) {
      if (col.sortValue) getters[col.key] = col.sortValue;
    }
    return getters;
  }, [columns]);

  const { sortedItems, sortField, sortDirection, toggleSort } = useSorting(
    data, defaultSortField, "asc", sortValueGetters,
  );

  /* ---- Pagination ---- */
  const {
    paginatedItems, currentPage, totalPages, totalItems,
    pageSize, isFirstPage, isLastPage, startIndex, endIndex,
    goToPage, nextPage, prevPage, setPageSize,
  } = usePagination(sortedItems, { storageKey });

  /* ---- Column visibility ---- */
  const {
    hiddenColumns, isVisible, toggleColumn,
    showAll, resetToDefault, visibleCount, totalCount,
  } = useColumnVisibility(columns, storageKey);

  /* ---- Inline edit ---- */
  const { editingId, editingField, startEdit, cancelEdit, commitEdit, isEditing } = useInlineEdit();

  /* ---- Row selection ---- */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const pageIds = paginatedItems.map((i) => i.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of pageIds) next.delete(id);
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of pageIds) next.add(id);
        return next;
      });
    }
  }, [paginatedItems, selectedIds]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const visibleColumns = useMemo(
    () => columns.filter((c) => isVisible(c.key)),
    [columns, isVisible],
  );

  const hasActions = !!renderRowActions;
  const hasSelection = selectedIds.size > 0;

  /* ---- Inline edit handler ---- */
  const handleInlineSave = useCallback(
    (rowId: string, field: string, value: unknown) => {
      onInlineEdit?.(rowId, field, value);
    },
    [onInlineEdit],
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* ---- Toolbar ---- */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-2">
            {hasSelection ? (
              <>
                <span className="text-xs text-blue-600">{selectedIds.size} đã chọn</span>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Bỏ chọn
                </button>
                {onBulkDelete && (
                  <button
                    type="button"
                    onClick={() => onBulkDelete(Array.from(selectedIds))}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Xóa ({selectedIds.size})
                  </button>
                )}
              </>
            ) : (
              <span className="text-xs text-gray-400">{totalItems} kết quả</span>
            )}
          </div>
          <ColumnVisibilityDropdown
            columns={columns}
            hiddenColumns={hiddenColumns}
            onToggleColumn={toggleColumn}
            onShowAll={showAll}
            onResetToDefault={resetToDefault}
            visibleCount={visibleCount}
            totalCount={totalCount}
          />
        </div>
      )}

      {/* ---- Table ---- */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {/* Checkbox header */}
              {selectable && (
                <th className="w-10 px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={paginatedItems.length > 0 && paginatedItems.every((i) => selectedIds.has(i.id))}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {/* Data columns */}
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-3 py-2.5 text-[11px] text-gray-500 select-none ${
                    col.sortable !== false ? "cursor-pointer hover:text-gray-700" : ""
                  } ${col.headerClassName ?? ""}`}
                  style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <SortIcon field={col.key} currentField={sortField} direction={sortDirection} />
                    )}
                  </div>
                </th>
              ))}
              {/* Actions column */}
              {hasActions && (
                <th className="w-20 px-3 py-2.5 text-right text-[11px] text-gray-500">Thao tác</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)}
                  className="text-center py-12 text-gray-400 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const selected = selectedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-50 transition-colors ${
                      selected ? "bg-blue-50/40" : "hover:bg-gray-50/50"
                    } ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {/* Checkbox */}
                    {selectable && (
                      <td className="w-10 px-3 py-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {/* Data cells */}
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-3 py-2 ${col.className ?? ""}`}
                        onClick={() => {
                          if (!col.editable || isEditing(item.id, col.key)) {
                            onRowClick?.(item);
                          }
                        }}
                      >
                        <CellContent
                          item={item}
                          col={col}
                          isEditing={isEditing(item.id, col.key)}
                          onStartEdit={() => {
                            const val = col.getValue
                              ? col.getValue(item)
                              : (item as Record<string, unknown>)[col.key];
                            startEdit(item.id, col.key, val);
                          }}
                          onSave={(newValue) => {
                            commitEdit(newValue, handleInlineSave);
                          }}
                          onCancel={cancelEdit}
                          inlineEditEnabled={!!onInlineEdit}
                        />
                      </td>
                    ))}
                    {/* Actions */}
                    {hasActions && (
                      <td className="px-3 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                        {renderRowActions!(item)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ---- Pagination ---- */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        startIndex={startIndex}
        endIndex={endIndex}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        onGoToPage={goToPage}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        onSetPageSize={setPageSize}
      />
    </div>
  );
}

/* ============================================================
 * Sort Icon
 * ============================================================ */
function SortIcon({
  field,
  currentField,
  direction,
}: {
  field: string;
  currentField: string | null;
  direction: string;
}) {
  if (field !== currentField) {
    return <ArrowUpDown className="w-3 h-3 text-gray-300" />;
  }
  return direction === "asc"
    ? <ArrowUp className="w-3 h-3 text-blue-600" />
    : <ArrowDown className="w-3 h-3 text-blue-600" />;
}

/* ============================================================
 * Cell Content — Render cell (normal or inline edit)
 * ============================================================ */
function CellContent<T extends { id: string }>({
  item,
  col,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  inlineEditEnabled,
}: {
  item: T;
  col: ColumnDef<T>;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (value: unknown) => void;
  onCancel: () => void;
  inlineEditEnabled: boolean;
}) {
  const rawValue = col.getValue
    ? col.getValue(item)
    : (item as Record<string, unknown>)[col.key];

  /* Custom renderEdit */
  if (isEditing && col.renderEdit) {
    return <>{col.renderEdit(item, rawValue, onSave, () => onSave(rawValue), onCancel)}</>;
  }

  /* Generic inline edit */
  if (col.editable && inlineEditEnabled) {
    return (
      <InlineEditCell
        value={rawValue as string | number}
        isEditing={isEditing}
        onStartEdit={onStartEdit}
        onSave={(newVal) => onSave(newVal)}
        onCancel={onCancel}
      />
    );
  }

  /* Custom render */
  if (col.render) {
    return <>{col.render(item, 0)}</>;
  }

  /* Default render */
  return (
    <span className="truncate block">
      {rawValue == null || rawValue === "" ? "—" : String(rawValue)}
    </span>
  );
}
