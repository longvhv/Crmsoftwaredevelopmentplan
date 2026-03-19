/* ============================================================
 * KanbanView Component
 * Kanban board với drag & drop support
 * ============================================================ */

import React from "react";
import { Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ============================================================
 * Types
 * ============================================================ */

export interface KanbanColumn<T> {
  id: string;
  title: string;
  color?: string;
  items: T[];
  maxItems?: number;
  collapsed?: boolean;
}

export interface KanbanViewProps<T extends { id: string }> {
  columns: KanbanColumn<T>[];
  renderCard: (item: T, columnId: string) => React.ReactNode;
  onCardClick?: (item: T) => void;
  onCardMove?: (itemId: string, fromColumn: string, toColumn: string) => void;
  onAddCard?: (columnId: string) => void;
  onColumnAction?: (columnId: string, action: string) => void;
  cardHeight?: "auto" | "fixed";
  showColumnCount?: boolean;
  showColumnTotal?: boolean;
  getColumnTotal?: (items: T[]) => number;
  emptyMessage?: string;
  className?: string;
}

/* ============================================================
 * KanbanView Component
 * ============================================================ */

export function KanbanView<T extends { id: string }>({
  columns,
  renderCard,
  onCardClick,
  onCardMove,
  onAddCard,
  onColumnAction,
  cardHeight = "auto",
  showColumnCount = true,
  showColumnTotal = false,
  getColumnTotal,
  emptyMessage = "Không có dữ liệu",
  className = "",
}: KanbanViewProps<T>) {
  const [draggedItem, setDraggedItem] = React.useState<{
    item: T;
    columnId: string;
  } | null>(null);

  /* ============================================================
   * Drag and Drop Handlers
   * ============================================================ */

  const handleDragStart = (item: T, columnId: string) => {
    setDraggedItem({ item, columnId });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (targetColumnId: string) => {
    if (draggedItem && draggedItem.columnId !== targetColumnId) {
      onCardMove?.(draggedItem.item.id, draggedItem.columnId, targetColumnId);
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /* ============================================================
   * Render
   * ============================================================ */

  const totalItems = columns.reduce((sum, col) => sum + col.items.length, 0);

  if (totalItems === 0 && !onAddCard) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`flex gap-4 overflow-x-auto pb-4 ${className}`}>
      {columns.map((column) => (
        <KanbanColumnComponent
          key={column.id}
          column={column}
          renderCard={renderCard}
          onCardClick={onCardClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onAddCard={onAddCard}
          onColumnAction={onColumnAction}
          cardHeight={cardHeight}
          showColumnCount={showColumnCount}
          showColumnTotal={showColumnTotal}
          getColumnTotal={getColumnTotal}
          isDragging={
            draggedItem !== null && draggedItem.columnId === column.id
          }
        />
      ))}
    </div>
  );
}

/* ============================================================
 * Kanban Column Component
 * ============================================================ */

interface KanbanColumnComponentProps<T extends { id: string }> {
  column: KanbanColumn<T>;
  renderCard: (item: T, columnId: string) => React.ReactNode;
  onCardClick?: (item: T) => void;
  onDragStart: (item: T, columnId: string) => void;
  onDragEnd: () => void;
  onDrop: (columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onAddCard?: (columnId: string) => void;
  onColumnAction?: (columnId: string, action: string) => void;
  cardHeight: "auto" | "fixed";
  showColumnCount: boolean;
  showColumnTotal: boolean;
  getColumnTotal?: (items: T[]) => number;
  isDragging: boolean;
}

function KanbanColumnComponent<T extends { id: string }>({
  column,
  renderCard,
  onCardClick,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragOver,
  onAddCard,
  onColumnAction,
  cardHeight,
  showColumnCount,
  showColumnTotal,
  getColumnTotal,
  isDragging,
}: KanbanColumnComponentProps<T>) {
  const [isOver, setIsOver] = React.useState(false);

  const handleDragEnter = () => setIsOver(true);
  const handleDragLeave = () => setIsOver(false);

  const handleDrop = () => {
    onDrop(column.id);
    setIsOver(false);
  };

  const total = showColumnTotal && getColumnTotal ? getColumnTotal(column.items) : 0;

  return (
    <div
      className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg ${
        isOver ? "ring-2 ring-primary bg-primary/5" : ""
      }`}
      onDragOver={(e) => {
        onDragOver(e);
        handleDragEnter();
      }}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-lg">
        <div className="flex items-center gap-2">
          {/* Color Indicator */}
          {column.color && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-900">{column.title}</h3>

          {/* Count */}
          {showColumnCount && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              {column.items.length}
              {column.maxItems && ` / ${column.maxItems}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Total */}
          {showColumnTotal && total > 0 && (
            <span className="text-sm font-semibold text-gray-700 mr-2">
              {total.toLocaleString()}đ
            </span>
          )}

          {/* Add Button */}
          {onAddCard && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onAddCard(column.id)}
              className="h-7 w-7 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}

          {/* Actions Menu */}
          {onColumnAction && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onColumnAction(column.id, "menu")}
              className="h-7 w-7 p-0"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Column Body */}
      <div
        className={`p-3 space-y-3 ${
          column.collapsed ? "hidden" : ""
        } overflow-y-auto`}
        style={{
          minHeight: "200px",
          maxHeight: "calc(100vh - 300px)",
        }}
      >
        {column.items.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
            Kéo thả hoặc thêm mới
          </div>
        ) : (
          column.items.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => onDragStart(item, column.id)}
              onDragEnd={onDragEnd}
              onClick={() => onCardClick?.(item)}
              className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-move ${
                isDragging ? "opacity-50" : ""
              } ${cardHeight === "fixed" ? "h-32" : ""}`}
            >
              {renderCard(item, column.id)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Kanban Card Components
 * ============================================================ */

export interface KanbanCardProps {
  children: React.ReactNode;
  className?: string;
}

export function KanbanCard({ children, className = "" }: KanbanCardProps) {
  return <div className={`p-3 ${className}`}>{children}</div>;
}

export function KanbanCardHeader({
  title,
  subtitle,
  badge,
  className = "",
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-2 ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
          {title}
        </h4>
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>
      {subtitle && (
        <p className="text-xs text-gray-600 line-clamp-1">{subtitle}</p>
      )}
    </div>
  );
}

export function KanbanCardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`text-sm text-gray-700 mb-2 ${className}`}>{children}</div>;
}

export function KanbanCardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-2 pt-2 border-t ${className}`}>
      {children}
    </div>
  );
}

export function KanbanCardMeta({
  items,
  className = "",
}: {
  items: Array<{ icon?: React.ReactNode; label: React.ReactNode }>;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 text-xs text-gray-500 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * Deal Card Example
 * ============================================================ */

export interface DealCardProps {
  title: string;
  company: string;
  value: number;
  owner?: string;
  avatar?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
}

export function DealCard({
  title,
  company,
  value,
  owner,
  avatar,
  dueDate,
  priority,
  tags = [],
}: DealCardProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <KanbanCard>
      {/* Header */}
      <KanbanCardHeader
        title={title}
        subtitle={company}
        badge={
          priority && (
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded ${priorityColors[priority]}`}
            >
              {priority}
            </span>
          )
        }
      />

      {/* Value */}
      <div className="mb-2">
        <div className="text-lg font-semibold text-gray-900">
          {value.toLocaleString()}đ
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
              +{tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <KanbanCardFooter>
        {/* Owner */}
        <div className="flex items-center gap-2">
          {avatar ? (
            <img src={avatar} alt={owner} className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
              {owner?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-gray-600">{owner}</span>
        </div>

        {/* Due Date */}
        {dueDate && (
          <span className="text-xs text-gray-500">{dueDate}</span>
        )}
      </KanbanCardFooter>
    </KanbanCard>
  );
}

/* ============================================================
 * Simple Kanban View (no drag-drop)
 * ============================================================ */

export interface SimpleKanbanViewProps<T extends { id: string }> {
  columns: KanbanColumn<T>[];
  renderCard: (item: T) => React.ReactNode;
  onCardClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function SimpleKanbanView<T extends { id: string }>({
  columns,
  renderCard,
  onCardClick,
  emptyMessage = "Không có dữ liệu",
  className = "",
}: SimpleKanbanViewProps<T>) {
  return (
    <div className={`flex gap-4 overflow-x-auto pb-4 ${className}`}>
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80 bg-gray-50 rounded-lg"
        >
          {/* Header */}
          <div className="p-4 border-b bg-white rounded-t-lg">
            <h3 className="font-semibold text-gray-900">{column.title}</h3>
            <span className="text-xs text-gray-500">
              {column.items.length} items
            </span>
          </div>

          {/* Cards */}
          <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
            {column.items.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
                {emptyMessage}
              </div>
            ) : (
              column.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onCardClick?.(item)}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  {renderCard(item)}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
