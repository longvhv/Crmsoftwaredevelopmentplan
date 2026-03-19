/* ============================================================
 * ColorPicker Component
 * Color picker with presets and custom color input
 * ============================================================ */

import { useState, useCallback, useMemo } from "react";
import { Check, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ============================================================
 * Types
 * ============================================================ */

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  showPresets?: boolean;
  presetColors?: string[];
  allowCustom?: boolean;
  format?: "hex" | "rgb" | "hsl";
}

/* ============================================================
 * Preset Colors
 * ============================================================ */

const DEFAULT_PRESET_COLORS = [
  // Grayscale
  "#000000",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#E5E7EB",
  "#F3F4F6",
  "#FFFFFF",
  // Primary Colors
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#EAB308", // Yellow
  "#84CC16", // Lime
  "#22C55E", // Green
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#0EA5E9", // Sky
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#D946EF", // Fuchsia
  "#EC4899", // Pink
  "#F43F5E", // Rose
  // Extended
  "#DC2626",
  "#EA580C",
  "#D97706",
  "#CA8A04",
  "#65A30D",
  "#16A34A",
  "#059669",
  "#0D9488",
  "#0891B2",
  "#0284C7",
  "#2563EB",
  "#4F46E5",
  "#7C3AED",
  "#9333EA",
  "#C026D3",
  "#DB2777",
  "#E11D48",
];

/* ============================================================
 * Utility Functions
 * ============================================================ */

function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

function normalizeColor(color: string): string {
  const cleaned = color.trim().toUpperCase();
  if (cleaned.startsWith("#")) return cleaned;
  return `#${cleaned}`;
}

function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

/* ============================================================
 * Color Swatch Component
 * ============================================================ */

interface ColorSwatchProps {
  color: string;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showCheck?: boolean;
}

function ColorSwatch({
  color,
  selected = false,
  onClick,
  size = "md",
  showCheck = true,
}: ColorSwatchProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded border-2 transition-all relative",
        sizeClasses[size],
        selected
          ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
      )}
      style={{ backgroundColor: color }}
      title={color}
    >
      {selected && showCheck && (
        <Check
          className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ color: getContrastColor(color) }}
        />
      )}
    </button>
  );
}

/* ============================================================
 * ColorPicker Component
 * ============================================================ */

export function ColorPicker({
  value = "#000000",
  onChange,
  placeholder = "Select color",
  disabled = false,
  error,
  className,
  showPresets = true,
  presetColors = DEFAULT_PRESET_COLORS,
  allowCustom = true,
  format = "hex",
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  /* ============================================================
   * Handlers
   * ============================================================ */

  const handleColorSelect = useCallback(
    (color: string) => {
      onChange?.(color);
      setCustomColor(color);
    },
    [onChange]
  );

  const handleCustomColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      setCustomColor(color);
    },
    []
  );

  const handleCustomColorSubmit = useCallback(() => {
    const normalized = normalizeColor(customColor);
    if (isValidHexColor(normalized)) {
      handleColorSelect(normalized);
    }
  }, [customColor, handleColorSelect]);

  const handleNativePickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleColorSelect(e.target.value);
    },
    [handleColorSelect]
  );

  /* ============================================================
   * Color Groups
   * ============================================================ */

  const colorGroups = useMemo(() => {
    const groups: string[][] = [];
    const groupSize = 8;

    for (let i = 0; i < presetColors.length; i += groupSize) {
      groups.push(presetColors.slice(i, i + groupSize));
    }

    return groups;
  }, [presetColors]);

  /* ============================================================
   * Render
   * ============================================================ */

  const displayColor = value || "#000000";

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start gap-2",
              error && "border-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div
              className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: displayColor }}
            />
            <span className="flex-1 text-left font-mono text-sm">
              {displayColor}
            </span>
            <Pipette className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              {showPresets && <TabsTrigger value="presets">Presets</TabsTrigger>}
              {allowCustom && <TabsTrigger value="custom">Custom</TabsTrigger>}
            </TabsList>

            {/* Preset Colors Tab */}
            {showPresets && (
              <TabsContent value="presets" className="p-4 space-y-3">
                {colorGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex gap-2">
                    {group.map((color) => (
                      <ColorSwatch
                        key={color}
                        color={color}
                        selected={displayColor === color}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </div>
                ))}
              </TabsContent>
            )}

            {/* Custom Color Tab */}
            {allowCustom && (
              <TabsContent value="custom" className="p-4 space-y-4">
                {/* Native Color Picker */}
                <div className="space-y-2">
                  <Label>Color Picker</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={displayColor}
                      onChange={handleNativePickerChange}
                      className="w-20 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={displayColor}
                      readOnly
                      className="flex-1 font-mono"
                    />
                  </div>
                </div>

                {/* Manual Input */}
                <div className="space-y-2">
                  <Label>Hex Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={customColor}
                      onChange={handleCustomColorChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCustomColorSubmit();
                        }
                      }}
                      placeholder="#000000"
                      className="flex-1 font-mono"
                    />
                    <Button
                      type="button"
                      onClick={handleCustomColorSubmit}
                      disabled={!isValidHexColor(normalizeColor(customColor))}
                    >
                      Apply
                    </Button>
                  </div>
                  {!isValidHexColor(normalizeColor(customColor)) && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Invalid hex color
                    </p>
                  )}
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div
                    className="w-full h-20 rounded border"
                    style={{ backgroundColor: displayColor }}
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

/* ============================================================
 * Simple Color Swatches
 * ============================================================ */

export interface ColorSwatchesProps {
  value?: string;
  onChange?: (color: string) => void;
  colors?: string[];
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ColorSwatches({
  value,
  onChange,
  colors = DEFAULT_PRESET_COLORS.slice(8, 24),
  className,
  size = "md",
}: ColorSwatchesProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {colors.map((color) => (
        <ColorSwatch
          key={color}
          color={color}
          selected={value === color}
          onClick={() => onChange?.(color)}
          size={size}
        />
      ))}
    </div>
  );
}
