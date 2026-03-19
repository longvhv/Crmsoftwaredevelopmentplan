/* ============================================================
 * GridView Component
 * Hiển thị dữ liệu dạng card grid với responsive layout
 * ============================================================ */

import React from "react";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

/* ============================================================
 * Types
 * ============================================================ */

export interface GridViewProps<T extends { id: string }> {
  items: T[];
  renderCard: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 2 | 3 | 4 | 6 | 8;
  emptyMessage?: string;
  className?: string;
}

/* ============================================================
 * GridView Component
 * ============================================================ */

export function GridView<T extends { id: string }>({
  items,
  renderCard,
  onItemClick,
  selectable = false,
  selectedIds = new Set(),
  onToggleSelect,
  columns = 3,
  gap = 4,
  emptyMessage = "Không có dữ liệu",
  className = "",
}: GridViewProps<T>) {
  const columnClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",
  };

  const gapClasses = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {items.map((item) => {
        const isSelected = selectedIds.has(item.id);

        return (
          <div
            key={item.id}
            className={`relative group bg-white rounded-lg border transition-all ${
              isSelected
                ? "ring-2 ring-primary border-primary"
                : "hover:shadow-md border-gray-200"
            } ${onItemClick ? "cursor-pointer" : ""}`}
            onClick={() => onItemClick?.(item)}
          >
            {/* Selection Checkbox */}
            {selectable && (
              <div
                className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleSelect?.(item.id)}
                  className="bg-white shadow-sm"
                />
              </div>
            )}

            {/* Card Content */}
            {renderCard(item)}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Card Components
 * ============================================================ */

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardImage({
  src,
  alt,
  aspectRatio = "16/9",
  className = "",
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full overflow-hidden rounded-t-lg ${className}`}
      style={{ aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  badge,
  actions,
  className = "",
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-3 ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 truncate">{subtitle}</p>
          )}
        </div>
        {(badge || actions) && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {badge}
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`text-sm text-gray-700 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-2 mt-4 pt-4 border-t ${className}`}>
      {children}
    </div>
  );
}

export function CardMeta({
  items,
  className = "",
}: {
  items: Array<{ icon?: React.ReactNode; label: React.ReactNode }>;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 text-xs text-gray-500 ${className}`}>
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
 * Masonry Grid View (Pinterest style)
 * ============================================================ */

export interface MasonryGridViewProps<T extends { id: string }> {
  items: T[];
  renderCard: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  columns?: 2 | 3 | 4;
  gap?: 2 | 3 | 4 | 6;
  emptyMessage?: string;
  className?: string;
}

export function MasonryGridView<T extends { id: string }>({
  items,
  renderCard,
  onItemClick,
  columns = 3,
  gap = 4,
  emptyMessage = "Không có dữ liệu",
  className = "",
}: MasonryGridViewProps<T>) {
  const columnClasses = {
    2: "columns-1 md:columns-2",
    3: "columns-1 md:columns-2 lg:columns-3",
    4: "columns-1 md:columns-2 lg:columns-3 xl:columns-4",
  };

  const gapClasses = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`break-inside-avoid mb-${gap} ${
            onItemClick ? "cursor-pointer" : ""
          }`}
          onClick={() => onItemClick?.(item)}
        >
          <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            {renderCard(item)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * Contact Card Example
 * ============================================================ */

export interface ContactCardProps {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  tags?: string[];
  score?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ContactCard({
  name,
  email,
  phone,
  company,
  avatar,
  tags = [],
  score,
  onEdit,
  onDelete,
}: ContactCardProps) {
  return (
    <Card>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          {company && (
            <p className="text-sm text-gray-600 truncate">{company}</p>
          )}
        </div>

        {/* Score */}
        {score !== undefined && (
          <div className="flex-shrink-0">
            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
              {score}
            </div>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-1 text-sm mb-3">
        <div className="text-gray-600 truncate">{email}</div>
        {phone && <div className="text-gray-600 truncate">{phone}</div>}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2 pt-3 border-t">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Sửa
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
            >
              Xóa
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
