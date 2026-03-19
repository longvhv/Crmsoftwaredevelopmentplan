/* ============================================================
 * ColumnVisibilityPanel Component
 * Quản lý hiển thị cột với drag-drop reordering
 * ============================================================ */

import React from "react";
import {
  Eye,
  EyeOff,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDefinition } from "@/types/ui-state";

/* ============================================================
 * Types
 * ============================================================ */

export interface ColumnVisibilityPanelProps {
  columns: ColumnDefinition[];
  onToggleColumn: (columnId: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  onReset: () => void;
  onReorder?: (columnId: string, newOrder: number) => void;
  onMove?: (columnId: string, direction: "left" | "right") => void;
  onPin?: (columnId: string, position: "left" | "right" | null) => void;
  className?: string;
}

/* ============================================================
 * ColumnVisibilityPanel Component
 * ============================================================ */

export function ColumnVisibilityPanel({
  columns,
  onToggleColumn,
  onShowAll,
  onHideAll,
  onReset,
  onMove,
  onPin,
  className = "",
}: ColumnVisibilityPanelProps) {
  const visibleCount = columns.filter((col) => col.visible).length;
  const hiddenCount = columns.length - visibleCount;

  /* ============================================================
   * Drag and Drop State
   * ============================================================ */

  const [draggedColumn, setDraggedColumn] = React.useState<string | null>(null);

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /* ============================================================
   * Render
   * ============================================================ */

  return (
    <div className={`border rounded-lg bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Cột hiển thị</span>
          <span className="text-xs text-gray-500">
            ({visibleCount}/{columns.length})
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onShowAll}
            className="h-7 text-xs"
            disabled={hiddenCount === 0}
          >
            Hiện tất cả
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onHideAll}
            className="h-7 text-xs"
            disabled={visibleCount === 0}
          >
            Ẩn tất cả
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 w-7 p-0"
            title="Đặt lại"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Column List */}
      <div className="max-h-96 overflow-y-auto">
        {columns.map((column) => (
          <div
            key={column.id}
            draggable
            onDragStart={() => handleDragStart(column.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            className={`flex items-center gap-2 px-4 py-2 border-b hover:bg-gray-50 cursor-move ${
              draggedColumn === column.id ? "opacity-50" : ""
            }`}
          >
            {/* Drag Handle */}
            <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

            {/* Checkbox */}
            <input
              type="checkbox"
              checked={column.visible}
              onChange={() => onToggleColumn(column.id)}
              className="w-4 h-4 rounded border-gray-300 flex-shrink-0"
            />

            {/* Label */}
            <span className="flex-1 text-sm">{column.label}</span>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Pin */}
              {onPin && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (column.pinned === "left") {
                      onPin(column.id, "right");
                    } else if (column.pinned === "right") {
                      onPin(column.id, null);
                    } else {
                      onPin(column.id, "left");
                    }
                  }}
                  className="h-6 w-6 p-0"
                  title={
                    column.pinned === "left"
                      ? "Ghim bên phải"
                      : column.pinned === "right"
                      ? "Bỏ ghim"
                      : "Ghim bên trái"
                  }
                >
                  {column.pinned ? (
                    <Pin className="w-3 h-3 text-primary" />
                  ) : (
                    <PinOff className="w-3 h-3" />
                  )}
                </Button>
              )}

              {/* Move Left */}
              {onMove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onMove(column.id, "left")}
                  className="h-6 w-6 p-0"
                  title="Di chuyển sang trái"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
              )}

              {/* Move Right */}
              {onMove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onMove(column.id, "right")}
                  className="h-6 w-6 p-0"
                  title="Di chuyển sang phải"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              )}

              {/* Toggle Visibility */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onToggleColumn(column.id)}
                className="h-6 w-6 p-0"
                title={column.visible ? "Ẩn cột" : "Hiện cột"}
              >
                {column.visible ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Simple Column Toggle
 * ============================================================ */

export interface SimpleColumnToggleProps {
  columns: ColumnDefinition[];
  onToggleColumn: (columnId: string) => void;
  className?: string;
}

export function SimpleColumnToggle({
  columns,
  onToggleColumn,
  className = "",
}: SimpleColumnToggleProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`relative ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Eye className="w-4 h-4" />
        Cột
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
            <div className="p-2 space-y-1">
              {columns.map((column) => (
                <label
                  key={column.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => onToggleColumn(column.id)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">{column.label}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
 * Column Group Toggle
 * ============================================================ */

export interface ColumnGroup {
  id: string;
  label: string;
  columnIds: string[];
}

export interface ColumnGroupToggleProps {
  groups: ColumnGroup[];
  columns: ColumnDefinition[];
  onToggleGroup: (columnIds: string[], visible: boolean) => void;
  className?: string;
}

export function ColumnGroupToggle({
  groups,
  columns,
  onToggleGroup,
  className = "",
}: ColumnGroupToggleProps) {
  const getGroupVisibility = (columnIds: string[]) => {
    const visibleCount = columnIds.filter((id) =>
      columns.find((col) => col.id === id)?.visible
    ).length;

    if (visibleCount === 0) return "none";
    if (visibleCount === columnIds.length) return "all";
    return "some";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {groups.map((group) => {
        const visibility = getGroupVisibility(group.columnIds);

        return (
          <div key={group.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={visibility === "all"}
              ref={(el) => {
                if (el) {
                  el.indeterminate = visibility === "some";
                }
              }}
              onChange={(e) => {
                onToggleGroup(group.columnIds, e.target.checked);
              }}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">{group.label}</span>
            <span className="text-xs text-gray-500">
              ({group.columnIds.filter((id) => columns.find((col) => col.id === id)?.visible).length}/
              {group.columnIds.length})
            </span>
          </div>
        );
      })}
    </div>
  );
}
