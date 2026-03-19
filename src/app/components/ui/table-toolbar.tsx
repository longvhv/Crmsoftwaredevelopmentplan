import * as React from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  RefreshCw,
  MoreVertical,
  Filter,
} from "lucide-react";
import { cn } from "./utils";
import { Input } from "./input";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Checkbox } from "./checkbox";
import { Badge } from "./badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface Column {
  id: string;
  header: string;
}

export interface TableToolbarProps {
  // Search
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Columns
  columns?: Column[];
  hiddenColumns?: Set<string>;
  onToggleColumnVisibility?: (columnId: string) => void;

  // Density
  density?: "compact" | "normal" | "comfortable";
  onDensityChange?: (density: "compact" | "normal" | "comfortable") => void;

  // Actions
  onRefresh?: () => void;
  onExport?: () => void;
  onFilter?: () => void;

  // Custom Actions
  actions?: React.ReactNode;

  // Filter count
  activeFilters?: number;

  className?: string;
}

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchable = true,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  columns = [],
  hiddenColumns = new Set(),
  onToggleColumnVisibility,
  density = "normal",
  onDensityChange,
  onRefresh,
  onExport,
  onFilter,
  actions,
  activeFilters = 0,
  className,
}) => {
  const visibleColumnsCount = columns.length - hiddenColumns.size;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 p-4 bg-card border border-border rounded-t-xl",
        className
      )}
    >
      {/* Left Side - Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        {searchable && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        )}

        {/* Filter Button */}
        {onFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFilter}
            className="relative"
          >
            <Filter className="size-4 mr-2" />
            Filters
            {activeFilters > 0 && (
              <Badge
                variant="primary"
                size="sm"
                className="ml-2 px-1.5 min-w-[1.25rem] h-5"
              >
                {activeFilters}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2">
        {/* Custom Actions */}
        {actions}

        {/* Refresh */}
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            aria-label="Refresh"
          >
            <RefreshCw className="size-4" />
          </Button>
        )}

        {/* Export */}
        {onExport && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            aria-label="Export"
          >
            <Download className="size-4" />
          </Button>
        )}

        {/* Density */}
        {onDensityChange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Table density">
                <SlidersHorizontal className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48">
              <div className="space-y-2">
                <h4 className="font-medium text-sm mb-3">Display Density</h4>
                <div className="space-y-1">
                  {(["compact", "normal", "comfortable"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => onDensityChange(d)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent transition-colors",
                        density === d && "bg-accent font-medium"
                      )}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Column Visibility */}
        {columns.length > 0 && onToggleColumnVisibility && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Toggle columns">
                <Eye className="size-4 mr-2" />
                Columns
                <Badge variant="default" size="sm" className="ml-2">
                  {visibleColumnsCount}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64">
              <div className="space-y-2">
                <h4 className="font-medium text-sm mb-3">Toggle Columns</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {columns.map((column) => {
                    const isVisible = !hiddenColumns.has(column.id);
                    return (
                      <label
                        key={column.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-accent px-2 py-1.5 rounded transition-colors"
                      >
                        <Checkbox
                          checked={isVisible}
                          onCheckedChange={() => onToggleColumnVisibility(column.id)}
                        />
                        <span className="text-sm flex-1">{column.header}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <div className="pt-2 mt-2 border-t border-border flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      columns.forEach((col) => {
                        if (hiddenColumns.has(col.id)) {
                          onToggleColumnVisibility(col.id);
                        }
                      });
                    }}
                  >
                    Show All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      columns.forEach((col) => {
                        if (!hiddenColumns.has(col.id)) {
                          onToggleColumnVisibility(col.id);
                        }
                      });
                    }}
                  >
                    Hide All
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* More Options */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="More options">
              <MoreVertical className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48">
            <div className="space-y-1">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="size-4" />
                  Refresh Data
                </button>
              )}
              {onExport && (
                <button
                  onClick={onExport}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Download className="size-4" />
                  Export Data
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

TableToolbar.displayName = "TableToolbar";
