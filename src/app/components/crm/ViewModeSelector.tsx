/* ============================================================
 * ViewModeSelector Component
 * Chuyển đổi giữa các chế độ xem (Table/List/Grid/Kanban)
 * ============================================================ */

import React from "react";
import { Table, List, Grid3x3, Columns, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewMode, ViewConfig } from "@/types/ui-state";

/* ============================================================
 * Types
 * ============================================================ */

export interface ViewModeSelectorProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  availableModes?: ViewMode[];
  density?: ViewConfig["density"];
  onDensityChange?: (density: ViewConfig["density"]) => void;
  showImages?: boolean;
  onToggleImages?: () => void;
  showSettings?: boolean;
  className?: string;
}

/* ============================================================
 * View Mode Icons
 * ============================================================ */

const VIEW_MODE_ICONS: Record<ViewMode, React.ComponentType<{ className?: string }>> = {
  table: Table,
  list: List,
  grid: Grid3x3,
  kanban: Columns,
};

const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  table: "Bảng",
  list: "Danh sách",
  grid: "Lưới",
  kanban: "Kanban",
};

/* ============================================================
 * ViewModeSelector Component
 * ============================================================ */

export function ViewModeSelector({
  mode,
  onModeChange,
  availableModes = ["table", "list", "grid", "kanban"],
  density,
  onDensityChange,
  showImages,
  onToggleImages,
  showSettings = false,
  className = "",
}: ViewModeSelectorProps) {
  const [showSettingsPanel, setShowSettingsPanel] = React.useState(false);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Mode Buttons */}
      <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
        {availableModes.map((viewMode) => {
          const Icon = VIEW_MODE_ICONS[viewMode];
          const isActive = mode === viewMode;

          return (
            <Button
              key={viewMode}
              type="button"
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onModeChange(viewMode)}
              className="h-8 w-8 p-0"
              title={VIEW_MODE_LABELS[viewMode]}
            >
              <Icon className="w-4 h-4" />
              <span className="sr-only">{VIEW_MODE_LABELS[viewMode]}</span>
            </Button>
          );
        })}
      </div>

      {/* Settings Button */}
      {showSettings && (density !== undefined || showImages !== undefined) && (
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            className="h-8 w-8 p-0"
            title="Cài đặt hiển thị"
          >
            <Settings2 className="w-4 h-4" />
          </Button>

          {/* Settings Panel */}
          {showSettingsPanel && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSettingsPanel(false)}
              />

              {/* Panel */}
              <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-3 space-y-3">
                {/* Density */}
                {density !== undefined && onDensityChange && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">
                      Độ dày
                    </label>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          onDensityChange("compact");
                          setShowSettingsPanel(false);
                        }}
                        className={`text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                          density === "compact" ? "bg-primary/10" : ""
                        }`}
                      >
                        Gọn
                      </button>
                      <button
                        onClick={() => {
                          onDensityChange("comfortable");
                          setShowSettingsPanel(false);
                        }}
                        className={`text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                          density === "comfortable" ? "bg-primary/10" : ""
                        }`}
                      >
                        Thoải mái
                      </button>
                      <button
                        onClick={() => {
                          onDensityChange("spacious");
                          setShowSettingsPanel(false);
                        }}
                        className={`text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                          density === "spacious" ? "bg-primary/10" : ""
                        }`}
                      >
                        Rộng rãi
                      </button>
                    </div>
                  </div>
                )}

                {/* Toggle Images */}
                {showImages !== undefined && onToggleImages && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">
                      Tùy chọn
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showImages}
                        onChange={onToggleImages}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">Hiển thị hình ảnh</span>
                    </label>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Simple View Mode Selector
 * ============================================================ */

export interface SimpleViewModeSelectorProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  modes?: ViewMode[];
  className?: string;
}

export function SimpleViewModeSelector({
  mode,
  onModeChange,
  modes = ["table", "list"],
  className = "",
}: SimpleViewModeSelectorProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {modes.map((viewMode) => {
        const Icon = VIEW_MODE_ICONS[viewMode];
        const isActive = mode === viewMode;

        return (
          <Button
            key={viewMode}
            type="button"
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onModeChange(viewMode)}
            className="gap-2"
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">
              {VIEW_MODE_LABELS[viewMode]}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Compact View Mode Toggle
 * ============================================================ */

export interface CompactViewModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function CompactViewModeToggle({
  mode,
  onModeChange,
  className = "",
}: CompactViewModeToggleProps) {
  const Icon = VIEW_MODE_ICONS[mode];

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => {
        const modes: ViewMode[] = ["table", "list", "grid"];
        const currentIndex = modes.indexOf(mode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        onModeChange(nextMode);
      }}
      className={`gap-2 ${className}`}
      title={`Chuyển sang ${VIEW_MODE_LABELS[mode]}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs">{VIEW_MODE_LABELS[mode]}</span>
    </Button>
  );
}
