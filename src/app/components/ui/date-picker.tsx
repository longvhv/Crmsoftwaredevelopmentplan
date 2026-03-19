import * as React from "react";
import { format, isValid, parse, startOfToday, startOfWeek, endOfWeek, subDays, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import { cn } from "./utils";
import { Button } from "./button";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface DatePickerProps {
  // Value
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  defaultValue?: Date;
  
  // Range mode
  mode?: "single" | "range";
  rangeValue?: DateRange;
  onRangeChange?: (range: DateRange | undefined) => void;
  
  // Display
  placeholder?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  optional?: boolean;
  
  // States
  error?: string;
  success?: string;
  disabled?: boolean;
  
  // Features
  showTime?: boolean;
  showPresets?: boolean;
  showTimezone?: boolean;
  
  // Validation
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  
  // Styling
  fullWidth?: boolean;
  className?: string;
}

interface DatePreset {
  label: string;
  value: DateRange | Date;
}

/* ============================================================
 * PRESETS
 * ============================================================ */

const DATE_PRESETS: DatePreset[] = [
  {
    label: "Today",
    value: startOfToday(),
  },
  {
    label: "Yesterday",
    value: subDays(startOfToday(), 1),
  },
  {
    label: "This Week",
    value: { from: startOfWeek(new Date()), to: endOfWeek(new Date()) },
  },
  {
    label: "Last 7 Days",
    value: { from: subDays(new Date(), 7), to: new Date() },
  },
  {
    label: "Last 30 Days",
    value: { from: subDays(new Date(), 30), to: new Date() },
  },
  {
    label: "This Month",
    value: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
  },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC (GMT+0)" },
  { value: "America/New_York", label: "New York (GMT-5)" },
  { value: "America/Los_Angeles", label: "Los Angeles (GMT-8)" },
  { value: "Europe/London", label: "London (GMT+0)" },
  { value: "Europe/Paris", label: "Paris (GMT+1)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  { value: "Asia/Shanghai", label: "Shanghai (GMT+8)" },
  { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh (GMT+7)" },
];

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      defaultValue,
      mode = "single",
      rangeValue,
      onRangeChange,
      placeholder = "Pick a date",
      label,
      helperText,
      required,
      optional,
      error,
      success,
      disabled = false,
      showTime = false,
      showPresets = true,
      showTimezone = false,
      minDate,
      maxDate,
      disabledDates,
      fullWidth = false,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(defaultValue);
    const [internalRange, setInternalRange] = React.useState<DateRange | undefined>();
    const [hours, setHours] = React.useState("12");
    const [minutes, setMinutes] = React.useState("00");
    const [timezone, setTimezone] = React.useState("UTC");
    const [month, setMonth] = React.useState<Date>(new Date());

    const selectedDate = value !== undefined ? value : internalDate;
    const selectedRange = rangeValue !== undefined ? rangeValue : internalRange;

    const displayMessage = error || success || helperText;
    const state = error ? 'error' : success ? 'success' : 'default';

    // Format display value
    const formatDisplayValue = () => {
      if (mode === "range" && selectedRange) {
        if (selectedRange.from && selectedRange.to) {
          return `${format(selectedRange.from, "MMM dd, yyyy")} - ${format(selectedRange.to, "MMM dd, yyyy")}`;
        } else if (selectedRange.from) {
          return format(selectedRange.from, "MMM dd, yyyy");
        }
      } else if (mode === "single" && selectedDate) {
        const formatted = format(selectedDate, "MMM dd, yyyy");
        if (showTime) {
          return `${formatted} ${hours}:${minutes}`;
        }
        return formatted;
      }
      return "";
    };

    const handleDateSelect = (date: Date | undefined) => {
      if (mode === "single") {
        setInternalDate(date);
        onChange?.(date);
        if (!showTime) {
          setOpen(false);
        }
      }
    };

    const handleRangeSelect = (range: DateRange | undefined) => {
      if (mode === "range") {
        setInternalRange(range);
        onRangeChange?.(range);
        if (range?.from && range?.to) {
          setOpen(false);
        }
      }
    };

    const handlePresetClick = (preset: DatePreset) => {
      if (preset.value instanceof Date) {
        handleDateSelect(preset.value);
        setMonth(preset.value);
      } else {
        handleRangeSelect(preset.value);
        if (preset.value.from) {
          setMonth(preset.value.from);
        }
      }
    };

    const handleTimeChange = () => {
      if (selectedDate) {
        const newDate = new Date(selectedDate);
        newDate.setHours(parseInt(hours, 10));
        newDate.setMinutes(parseInt(minutes, 10));
        handleDateSelect(newDate);
      }
    };

    React.useEffect(() => {
      if (showTime && selectedDate) {
        handleTimeChange();
      }
    }, [hours, minutes]);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}
      >
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-0.5 text-[var(--error)]">*</span>}
            {optional && (
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                (optional)
              </span>
            )}
          </label>
        )}

        {/* Trigger Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setOpen(!open)}
            disabled={disabled}
            aria-expanded={open}
            aria-haspopup="dialog"
            className={cn(
              "flex h-10 w-full items-center justify-between gap-2",
              "rounded-md border border-border bg-background px-3 py-2",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "hover:bg-accent/50",
              "focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20",
              success && "border-[var(--success)] focus:border-[var(--success)] focus:ring-[var(--success)]/20"
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className={cn(!formatDisplayValue() && "text-muted-foreground")}>
                {formatDisplayValue() || placeholder}
              </span>
            </div>
          </button>

          {/* Popover */}
          {open && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
              />

              {/* Popover Content */}
              <div
                className={cn(
                  "absolute top-full left-0 z-50 mt-2",
                  "rounded-lg border border-border bg-background shadow-lg",
                  "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
                  showPresets ? "flex" : "block"
                )}
              >
                {/* Presets Sidebar */}
                {showPresets && mode === "range" && (
                  <div className="w-40 border-r border-border p-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Quick Select
                    </p>
                    <div className="space-y-1">
                      {DATE_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handlePresetClick(preset)}
                          className={cn(
                            "w-full rounded px-2 py-1.5 text-left text-xs",
                            "hover:bg-accent transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Calendar */}
                <div className="p-3">
                  {/* Custom Header */}
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
                      className="p-1 hover:bg-accent rounded transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <span className="text-sm font-medium">
                      {format(month, "MMMM yyyy")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
                      className="p-1 hover:bg-accent rounded transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>

                  <DayPicker
                    mode={mode === "range" ? "range" : "single"}
                    selected={mode === "range" ? selectedRange : selectedDate}
                    onSelect={mode === "range" ? handleRangeSelect : handleDateSelect}
                    month={month}
                    onMonthChange={setMonth}
                    disabled={[
                      ...(disabledDates || []),
                      ...(minDate ? [{ before: minDate }] : []),
                      ...(maxDate ? [{ after: maxDate }] : []),
                    ]}
                    className="date-picker"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center hidden",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: cn(
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                      ),
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: cn(
                        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                        "[&:has([aria-selected])]:bg-accent",
                        "[&:has([aria-selected].day-range-end)]:rounded-r-md",
                        "[&:has([aria-selected].day-range-start)]:rounded-l-md"
                      ),
                      day: cn(
                        "h-9 w-9 p-0 font-normal",
                        "hover:bg-accent hover:text-accent-foreground",
                        "rounded-md transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                      ),
                      day_range_start: "day-range-start",
                      day_range_end: "day-range-end",
                      day_selected: cn(
                        "bg-[var(--brand-primary)] text-white",
                        "hover:bg-[var(--brand-primary)] hover:text-white",
                        "focus:bg-[var(--brand-primary)] focus:text-white"
                      ),
                      day_today: "bg-accent text-accent-foreground font-semibold",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />

                  {/* Time Picker */}
                  {showTime && mode === "single" && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Time</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          className="w-16 text-center"
                          inputSize="sm"
                        />
                        <span className="text-sm font-medium">:</span>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={minutes}
                          onChange={(e) => setMinutes(e.target.value)}
                          className="w-16 text-center"
                          inputSize="sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Timezone Selector */}
                  {showTimezone && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger size="sm">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (mode === "single") {
                          handleDateSelect(undefined);
                        } else {
                          handleRangeSelect(undefined);
                        }
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => setOpen(false)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Helper Text */}
        {displayMessage && (
          <p
            className={cn(
              "text-xs",
              state === "error" && "text-[var(--error)]",
              state === "success" && "text-[var(--success)]",
              state === "default" && "text-muted-foreground"
            )}
          >
            {displayMessage}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
