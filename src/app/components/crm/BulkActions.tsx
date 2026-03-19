/* ============================================================
 * BulkActions Component
 * Hiển thị bulk actions khi có items được chọn
 * ============================================================ */

import React from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BulkAction } from "@/types/ui-state";

/* ============================================================
 * Types
 * ============================================================ */

export interface BulkActionsProps<T = unknown> {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction<T>[];
  selectedItems: T[];
  onDeselectAll: () => void;
  onSelectAll?: () => void;
  isExecuting?: boolean;
  className?: string;
}

/* ============================================================
 * BulkActions Component
 * ============================================================ */

export function BulkActions<T = unknown>({
  selectedCount,
  totalCount,
  actions,
  selectedItems,
  onDeselectAll,
  onSelectAll,
  isExecuting = false,
  className = "",
}: BulkActionsProps<T>) {
  const [executingAction, setExecutingAction] = React.useState<string | null>(
    null
  );

  /* ============================================================
   * Handlers
   * ============================================================ */

  const handleActionClick = async (action: BulkAction<T>) => {
    try {
      setExecutingAction(action.id);

      // Extract IDs from selected items
      const selectedIds = selectedItems.map((item: any) => item.id);

      await action.handler(selectedIds, selectedItems);

      // Optionally deselect after successful action
      // onDeselectAll();
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setExecutingAction(null);
    }
  };

  /* ============================================================
   * Render
   * ============================================================ */

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 bg-primary text-white rounded-lg shadow-lg ${className}`}
    >
      {/* Selection Info */}
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium">
          {selectedCount} mục đã chọn
        </span>

        {onSelectAll && selectedCount < totalCount && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="text-white hover:bg-white/20 h-7"
          >
            Chọn tất cả {totalCount} mục
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {actions.map((action) => {
          const isActionExecuting = executingAction === action.id;

          return (
            <Button
              key={action.id}
              type="button"
              variant={action.isDestructive ? "destructive" : "ghost"}
              size="sm"
              onClick={() => handleActionClick(action)}
              disabled={isExecuting || isActionExecuting}
              className={
                action.isDestructive
                  ? ""
                  : "text-white hover:bg-white/20"
              }
            >
              {isActionExecuting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                action.icon
              )}
              <span className="ml-2">{action.label}</span>
            </Button>
          );
        })}

        {/* Deselect Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDeselectAll}
          disabled={isExecuting}
          className="text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Bỏ chọn</span>
        </Button>
      </div>
    </div>
  );
}

/* ============================================================
 * Compact Bulk Actions
 * ============================================================ */

export interface CompactBulkActionsProps<T = unknown> {
  selectedCount: number;
  actions: BulkAction<T>[];
  selectedItems: T[];
  onDeselectAll: () => void;
  className?: string;
}

export function CompactBulkActions<T = unknown>({
  selectedCount,
  actions,
  selectedItems,
  onDeselectAll,
  className = "",
}: CompactBulkActionsProps<T>) {
  const [executingAction, setExecutingAction] = React.useState<string | null>(
    null
  );

  const handleActionClick = async (action: BulkAction<T>) => {
    try {
      setExecutingAction(action.id);
      const selectedIds = selectedItems.map((item: any) => item.id);
      await action.handler(selectedIds, selectedItems);
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setExecutingAction(null);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 bg-primary text-white rounded ${className}`}
    >
      <span className="text-sm font-medium">{selectedCount} đã chọn</span>

      {actions.map((action) => {
        const isActionExecuting = executingAction === action.id;

        return (
          <Button
            key={action.id}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleActionClick(action)}
            disabled={isActionExecuting}
            className="h-7 text-white hover:bg-white/20"
          >
            {isActionExecuting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              action.icon
            )}
          </Button>
        );
      })}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDeselectAll}
        className="h-7 text-white hover:bg-white/20"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}

/* ============================================================
 * Bulk Actions Dropdown
 * ============================================================ */

export interface BulkActionsDropdownProps<T = unknown> {
  selectedCount: number;
  actions: BulkAction<T>[];
  selectedItems: T[];
  className?: string;
}

export function BulkActionsDropdown<T = unknown>({
  selectedCount,
  actions,
  selectedItems,
  className = "",
}: BulkActionsDropdownProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [executingAction, setExecutingAction] = React.useState<string | null>(
    null
  );

  const handleActionClick = async (action: BulkAction<T>) => {
    try {
      setExecutingAction(action.id);
      const selectedIds = selectedItems.map((item: any) => item.id);
      await action.handler(selectedIds, selectedItems);
      setIsOpen(false);
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setExecutingAction(null);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        Hành động ({selectedCount})
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            {actions.map((action) => {
              const isActionExecuting = executingAction === action.id;

              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  disabled={isActionExecuting}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 disabled:opacity-50 ${
                    action.isDestructive ? "text-red-600" : ""
                  }`}
                >
                  {isActionExecuting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    action.icon
                  )}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
