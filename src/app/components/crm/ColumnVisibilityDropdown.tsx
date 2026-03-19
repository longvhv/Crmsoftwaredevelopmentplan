/**
 * ColumnVisibilityDropdown — Dropdown chọn cột hiển thị
 * Phase F0-09
 */
import { useState, useRef, useEffect } from "react";
import { Columns3, Check, RotateCcw, Eye } from "lucide-react";
import type { ColumnDef } from "../../types/dataTable";

interface ColumnVisibilityDropdownProps<T> {
  columns: ColumnDef<T>[];
  hiddenColumns: Set<string>;
  onToggleColumn: (key: string) => void;
  onShowAll: () => void;
  onResetToDefault: () => void;
  visibleCount: number;
  totalCount: number;
}

export function ColumnVisibilityDropdown<T>({
  columns,
  hiddenColumns,
  onToggleColumn,
  onShowAll,
  onResetToDefault,
  visibleCount,
  totalCount,
}: ColumnVisibilityDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Đóng khi click ngoài */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const hideableColumns = columns.filter((c) => c.hideable !== false);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg
          hover:bg-gray-50 text-gray-600 transition-colors"
        title="Ẩn/hiện cột"
      >
        <Columns3 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Cột</span>
        <span className="text-gray-400">{visibleCount}/{totalCount}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1">
          {/* Header */}
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-700">Hiển thị cột</p>
            <p className="text-[10px] text-gray-400">{visibleCount}/{totalCount} cột đang hiện</p>
          </div>

          {/* Column list */}
          <div className="max-h-[280px] overflow-y-auto py-1">
            {hideableColumns.map((col) => {
              const visible = !hiddenColumns.has(col.key);
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => onToggleColumn(col.key)}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                    visible
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 bg-white"
                  }`}>
                    {visible && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm truncate ${visible ? "text-gray-800" : "text-gray-400"}`}>
                    {col.header}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 px-2 py-1.5 flex gap-1">
            <button
              type="button"
              onClick={onShowAll}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[11px] text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <Eye className="w-3 h-3" />
              Hiện tất cả
            </button>
            <button
              type="button"
              onClick={onResetToDefault}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[11px] text-gray-500 hover:bg-gray-100 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Mặc định
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
