/* ============================================================
 * LoadingState Component
 * Hiển thị loading states với skeleton và spinners
 * ============================================================ */

import React from "react";
import { Loader2 } from "lucide-react";

/* ============================================================
 * Types
 * ============================================================ */

export interface LoadingStateProps {
  type?: "spinner" | "skeleton" | "bars" | "dots";
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

/* ============================================================
 * LoadingState Component
 * ============================================================ */

export function LoadingState({
  type = "spinner",
  message,
  size = "md",
  className = "",
  fullScreen = false,
}: LoadingStateProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
    : "flex items-center justify-center py-12";

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        {type === "spinner" && (
          <Loader2
            className={`${sizeClasses[size]} animate-spin text-primary`}
          />
        )}

        {type === "dots" && (
          <div className="flex items-center gap-2">
            <div
              className={`${
                size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
              } bg-primary rounded-full animate-bounce`}
              style={{ animationDelay: "0ms" }}
            />
            <div
              className={`${
                size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
              } bg-primary rounded-full animate-bounce`}
              style={{ animationDelay: "150ms" }}
            />
            <div
              className={`${
                size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
              } bg-primary rounded-full animate-bounce`}
              style={{ animationDelay: "300ms" }}
            />
          </div>
        )}

        {type === "bars" && (
          <div className="flex items-end gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`${
                  size === "sm" ? "w-1" : size === "md" ? "w-1.5" : "w-2"
                } bg-primary rounded-sm animate-pulse`}
                style={{
                  height: size === "sm" ? "12px" : size === "md" ? "20px" : "28px",
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        )}

        {message && (
          <p className="text-sm text-gray-600 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Skeleton Components
 * ============================================================ */

export interface SkeletonProps {
  className?: string;
}

/** Base skeleton */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}

/** Skeleton table row */
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b">
      <Skeleton className="w-10 h-10 rounded" />
      {Array.from({ length: columns - 1 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 flex-1"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

/** Skeleton table */
export function SkeletonTable({
  rows = 5,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-4 py-2 border-b-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} columns={columns} />
      ))}
    </div>
  );
}

/** Skeleton card */
export function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

/** Skeleton grid */
export function SkeletonGrid({ items = 6 }: { items?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/** Skeleton list item */
export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="w-20 h-8 rounded" />
    </div>
  );
}

/** Skeleton list */
export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </div>
  );
}

/** Skeleton form */
export function SkeletonForm({ fields = 5 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-24 rounded" />
        <Skeleton className="h-10 w-24 rounded" />
      </div>
    </div>
  );
}

/* ============================================================
 * Preset Loading States
 * ============================================================ */

/** Table loading state */
export function TableLoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <div className="p-4">
      <SkeletonTable rows={rows} />
    </div>
  );
}

/** Grid loading state */
export function GridLoadingState({ items = 6 }: { items?: number }) {
  return (
    <div className="p-4">
      <SkeletonGrid items={items} />
    </div>
  );
}

/** List loading state */
export function ListLoadingState({ items = 5 }: { items?: number }) {
  return (
    <div className="p-4">
      <SkeletonList items={items} />
    </div>
  );
}

/** Full page loading */
export function FullPageLoading({ message }: { message?: string }) {
  return <LoadingState type="spinner" message={message} fullScreen />;
}

/** Inline loading */
export function InlineLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Loader2 className="w-4 h-4 animate-spin" />
      {message && <span>{message}</span>}
    </div>
  );
}

/** Button loading */
export function ButtonLoading() {
  return <Loader2 className="w-4 h-4 animate-spin" />;
}
