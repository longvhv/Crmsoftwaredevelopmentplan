/* ============================================================
 * DateRangePicker Component
 * Date range picker with presets and calendar
 * ============================================================ */

import { useState, useMemo, useCallback } from "react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";

/* ============================================================
 * Types
 * ============================================================ */

export interface DateRangeValue {
  from: Date;
  to: Date;
}

export interface DateRangePreset {
  label: string;
  getValue: () => DateRangeValue;
}

export interface DateRangePickerProps {
  value?: DateRangeValue | null;
  onChange?: (value: DateRangeValue | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  showPresets?: boolean;
  presets?: DateRangePreset[];
  minDate?: Date;
  maxDate?: Date;
  numberOfMonths?: 1 | 2;
  clearable?: boolean;
}

/* ============================================================
 * Default Presets
 * ============================================================ */

const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: "Today",
    getValue: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = subDays(new Date(), 1);
      return { from: yesterday, to: yesterday };
    },
  },
  {
    label: "Last 7 days",
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: "Last 14 days",
    getValue: () => ({
      from: subDays(new Date(), 13),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: "Last 90 days",
    getValue: () => ({
      from: subDays(new Date(), 89),
      to: new Date(),
    }),
  },
  {
    label: "This week",
    getValue: () => {
      const today = new Date();
      return {
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      };
    },
  },
  {
    label: "Last week",
    getValue: () => {
      const lastWeek = subDays(new Date(), 7);
      return {
        from: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      };
    },
  },
  {
    label: "This month",
    getValue: () => {
      const today = new Date();
      return {
        from: startOfMonth(today),
        to: endOfMonth(today),
      };
    },
  },
  {
    label: "Last month",
    getValue: () => {
      const lastMonth = subDays(startOfMonth(new Date()), 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    },
  },
  {
    label: "This year",
    getValue: () => {
      const today = new Date();
      return {
        from: startOfYear(today),
        to: endOfYear(today),
      };
    },
  },
  {
    label: "Last year",
    getValue: () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      return {
        from: startOfYear(lastYear),
        to: endOfYear(lastYear),
      };
    },
  },
];

/* ============================================================
 * DateRangePicker Component
 * ============================================================ */

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  disabled = false,
  error,
  className,
  showPresets = true,
  presets = DEFAULT_PRESETS,
  minDate,
  maxDate,
  numberOfMonths = 2,
  clearable = true,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    value ? { from: value.from, to: value.to } : undefined
  );

  /* ============================================================
   * Handlers
   * ============================================================ */

  const handleSelect = useCallback(
    (range: DateRange | undefined) => {
      setSelectedRange(range);
      if (range?.from && range?.to) {
        onChange?.({ from: range.from, to: range.to });
        setIsOpen(false);
      }
    },
    [onChange]
  );

  const handlePresetClick = useCallback(
    (preset: DateRangePreset) => {
      const range = preset.getValue();
      setSelectedRange({ from: range.from, to: range.to });
      onChange?.(range);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedRange(undefined);
      onChange?.(null);
    },
    [onChange]
  );

  /* ============================================================
   * Display Text
   * ============================================================ */

  const displayText = useMemo(() => {
    if (!value) return placeholder;

    const { from, to } = value;
    const fromStr = format(from, "MMM d, yyyy");
    const toStr = format(to, "MMM d, yyyy");

    if (from.getTime() === to.getTime()) {
      return fromStr;
    }

    return `${fromStr} - ${toStr}`;
  }, [value, placeholder]);

  /* ============================================================
   * Render
   * ============================================================ */

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-gray-500 dark:text-gray-400",
              error && "border-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="flex-1 truncate">{displayText}</span>
            {clearable && value && !disabled && (
              <X
                className="h-4 w-4 ml-2 hover:text-red-600"
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Presets */}
            {showPresets && (
              <div className="border-r">
                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium mb-2">Quick select</p>
                  {presets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start font-normal"
                      onClick={() => handlePresetClick(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar */}
            <div className="p-3">
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={handleSelect}
                numberOfMonths={numberOfMonths}
                disabled={(date) => {
                  if (minDate && date < minDate) return true;
                  if (maxDate && date > maxDate) return true;
                  return false;
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}

/* ============================================================
 * Single Date Picker
 * ============================================================ */

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  clearable?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  error,
  className,
  minDate,
  maxDate,
  clearable = true,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      onChange?.(date ?? null);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(null);
    },
    [onChange]
  );

  const displayText = useMemo(() => {
    if (!value) return placeholder;
    return format(value, "MMM d, yyyy");
  }, [value, placeholder]);

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-gray-500 dark:text-gray-400",
              error && "border-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="flex-1 truncate">{displayText}</span>
            {clearable && value && !disabled && (
              <X
                className="h-4 w-4 ml-2 hover:text-red-600"
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={handleSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
          />
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
