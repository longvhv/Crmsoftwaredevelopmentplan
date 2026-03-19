/* ============================================================
 * EmptyState Component
 * Hiển thị empty state với call-to-action
 * ============================================================ */

import React from "react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

/* ============================================================
 * Types
 * ============================================================ */

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

/* ============================================================
 * EmptyState Component
 * ============================================================ */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
  imageUrl,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[400px] px-4 py-12 text-center ${className}`}
    >
      {/* Icon or Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-64 h-64 object-contain mb-6 opacity-50"
        />
      ) : Icon ? (
        <div className="mb-6">
          <Icon className="w-16 h-16 text-gray-400" />
        </div>
      ) : null}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-6 max-w-md">{description}</p>
      )}

      {/* Custom content */}
      {children}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6">
          {action && (
            <Button onClick={action.onClick} className="gap-2">
              {action.icon && <action.icon className="w-4 h-4" />}
              {action.label}
            </Button>
          )}

          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Preset Empty States
 * ============================================================ */

export interface PresetEmptyStateProps {
  onAction?: () => void;
  onSecondaryAction?: () => void;
  className?: string;
}

/** Empty contacts state */
export function EmptyContacts({
  onAction,
  onSecondaryAction,
  className,
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      title="Không có liên hệ nào"
      description="Bắt đầu bằng cách thêm liên hệ đầu tiên của bạn. Liên hệ là khách hàng, đối tác, hoặc người có khả năng trở thành khách hàng."
      action={
        onAction
          ? {
              label: "Thêm liên hệ",
              onClick: onAction,
            }
          : undefined
      }
      secondaryAction={
        onSecondaryAction
          ? {
              label: "Nhập từ file",
              onClick: onSecondaryAction,
            }
          : undefined
      }
      className={className}
    />
  );
}

/** Empty deals state */
export function EmptyDeals({
  onAction,
  onSecondaryAction,
  className,
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      title="Không có giao dịch nào"
      description="Tạo giao dịch đầu tiên để theo dõi cơ hội kinh doanh và quản lý pipeline của bạn."
      action={
        onAction
          ? {
              label: "Tạo giao dịch",
              onClick: onAction,
            }
          : undefined
      }
      secondaryAction={
        onSecondaryAction
          ? {
              label: "Xem hướng dẫn",
              onClick: onSecondaryAction,
            }
          : undefined
      }
      className={className}
    />
  );
}

/** Empty leads state */
export function EmptyLeads({
  onAction,
  onSecondaryAction,
  className,
}: PresetEmptyStateProps) {
  return (
    <EmptyState
      title="Không có khách hàng tiềm năng nào"
      description="Thêm khách hàng tiềm năng để theo dõi và chuyển đổi họ thành khách hàng thực tế."
      action={
        onAction
          ? {
              label: "Thêm khách hàng tiềm năng",
              onClick: onAction,
            }
          : undefined
      }
      secondaryAction={
        onSecondaryAction
          ? {
              label: "Nhập danh sách",
              onClick: onSecondaryAction,
            }
          : undefined
      }
      className={className}
    />
  );
}

/** Empty search results */
export function EmptySearchResults({
  query,
  onClear,
  className,
}: {
  query?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title="Không tìm thấy kết quả"
      description={
        query
          ? `Không tìm thấy kết quả nào cho "${query}". Hãy thử tìm kiếm với từ khóa khác.`
          : "Không tìm thấy kết quả nào phù hợp với tìm kiếm của bạn."
      }
      action={
        onClear
          ? {
              label: "Xóa tìm kiếm",
              onClick: onClear,
            }
          : undefined
      }
      className={className}
    />
  );
}

/** Empty filter results */
export function EmptyFilterResults({
  onClear,
  className,
}: {
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title="Không có kết quả nào"
      description="Không có mục nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh bộ lọc của bạn."
      action={
        onClear
          ? {
              label: "Xóa bộ lọc",
              onClick: onClear,
            }
          : undefined
      }
      className={className}
    />
  );
}

/** Error state */
export function ErrorState({
  title = "Đã xảy ra lỗi",
  description = "Không thể tải dữ liệu. Vui lòng thử lại sau.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: "Thử lại",
              onClick: onRetry,
            }
          : undefined
      }
      className={className}
    />
  );
}
