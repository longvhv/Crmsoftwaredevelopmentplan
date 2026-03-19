/* ============================================================
 * ListView Component
 * Hiển thị dữ liệu dạng list với avatar/image và actions
 * ============================================================ */

import React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

/* ============================================================
 * Types
 * ============================================================ */

export interface ListViewColumn<T> {
  id: string;
  label?: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

export interface ListViewProps<T extends { id: string }> {
  items: T[];
  columns: ListViewColumn<T>[];
  onItemClick?: (item: T) => void;
  renderImage?: (item: T) => React.ReactNode;
  renderTitle: (item: T) => React.ReactNode;
  renderSubtitle?: (item: T) => React.ReactNode;
  renderMeta?: (item: T) => React.ReactNode;
  renderActions?: (item: T) => React.ReactNode;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  emptyMessage?: string;
  density?: "compact" | "comfortable" | "spacious";
  showDividers?: boolean;
  className?: string;
}

/* ============================================================
 * ListView Component
 * ============================================================ */

export function ListView<T extends { id: string }>({
  items,
  columns,
  onItemClick,
  renderImage,
  renderTitle,
  renderSubtitle,
  renderMeta,
  renderActions,
  selectable = false,
  selectedIds = new Set(),
  onToggleSelect,
  onToggleSelectAll,
  emptyMessage = "Không có dữ liệu",
  density = "comfortable",
  showDividers = true,
  className = "",
}: ListViewProps<T>) {
  const densityClasses = {
    compact: "py-2",
    comfortable: "py-3",
    spacious: "py-4",
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {items.map((item, index) => {
        const isSelected = selectedIds.has(item.id);
        const showDivider = showDividers && index < items.length - 1;

        return (
          <div
            key={item.id}
            className={`relative group ${densityClasses[density]} px-4 hover:bg-gray-50 transition-colors ${
              isSelected ? "bg-blue-50/40" : ""
            } ${onItemClick ? "cursor-pointer" : ""} ${
              showDivider ? "border-b border-gray-100" : ""
            }`}
            onClick={() => onItemClick?.(item)}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              {selectable && (
                <div
                  className="flex-shrink-0 pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect?.(item.id)}
                  />
                </div>
              )}

              {/* Image/Avatar */}
              {renderImage && (
                <div className="flex-shrink-0">{renderImage(item)}</div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title & Subtitle */}
                <div className="mb-1">
                  <div className="font-medium text-gray-900">
                    {renderTitle(item)}
                  </div>
                  {renderSubtitle && (
                    <div className="text-sm text-gray-600 mt-0.5">
                      {renderSubtitle(item)}
                    </div>
                  )}
                </div>

                {/* Meta */}
                {renderMeta && (
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {renderMeta(item)}
                  </div>
                )}

                {/* Columns (Additional Info) */}
                {columns.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                    {columns.map((col) => (
                      <div key={col.id} className={col.className}>
                        {col.label && (
                          <div className="text-xs text-gray-500 mb-0.5">
                            {col.label}
                          </div>
                        )}
                        <div className="text-sm">{col.render(item)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              {renderActions && (
                <div
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  {renderActions(item)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Compact ListView
 * ============================================================ */

export interface CompactListViewProps<T extends { id: string }> {
  items: T[];
  renderTitle: (item: T) => React.ReactNode;
  renderSubtitle?: (item: T) => React.ReactNode;
  renderIcon?: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function CompactListView<T extends { id: string }>({
  items,
  renderTitle,
  renderSubtitle,
  renderIcon,
  onItemClick,
  emptyMessage = "Không có dữ liệu",
  className = "",
}: CompactListViewProps<T>) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
            onItemClick ? "cursor-pointer" : ""
          }`}
          onClick={() => onItemClick?.(item)}
        >
          {renderIcon && (
            <div className="flex-shrink-0">{renderIcon(item)}</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {renderTitle(item)}
            </div>
            {renderSubtitle && (
              <div className="text-xs text-gray-600 truncate">
                {renderSubtitle(item)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * Simple List View (for sidebars, dropdowns)
 * ============================================================ */

export interface SimpleListItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
}

export interface SimpleListViewProps {
  items: SimpleListItem[];
  onItemClick?: (id: string) => void;
  className?: string;
}

export function SimpleListView({
  items,
  onItemClick,
  className = "",
}: SimpleListViewProps) {
  return (
    <div className={`space-y-0.5 ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => !item.disabled && onItemClick?.(item.id)}
          disabled={item.disabled}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
            item.active
              ? "bg-primary text-white"
              : "hover:bg-gray-100 text-gray-700"
          } ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {item.icon && (
              <span className="flex-shrink-0 text-current">{item.icon}</span>
            )}
            <span className="text-sm font-medium truncate">{item.label}</span>
          </div>
          {item.badge !== undefined && (
            <span
              className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full ${
                item.active
                  ? "bg-white/20 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
 * Grouped List View
 * ============================================================ */

export interface ListGroup<T> {
  id: string;
  label: string;
  items: T[];
}

export interface GroupedListViewProps<T extends { id: string }> {
  groups: ListGroup<T>[];
  renderItem: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function GroupedListView<T extends { id: string }>({
  groups,
  renderItem,
  onItemClick,
  emptyMessage = "Không có dữ liệu",
  className = "",
}: GroupedListViewProps<T>) {
  const totalItems = groups.reduce((sum, group) => sum + group.items.length, 0);

  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {groups.map((group) => {
        if (group.items.length === 0) return null;

        return (
          <div key={group.id}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
              {group.label} ({group.items.length})
            </h3>
            <div className="bg-white rounded-lg border divide-y">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                    onItemClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onItemClick?.(item)}
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
