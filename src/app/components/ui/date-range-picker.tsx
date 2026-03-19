import * as React from "react";
import { cn } from "./utils";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "./button";

/* ============================================================
 * DATE RANGE PICKER PROPS
 * ============================================================
 * Date and time range picker with calendar UI
 * No external dependencies - pure React implementation
 */

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  /**
   * Selected date range
   */
  value?: DateRange;
  
  /**
   * Default date range (uncontrolled)
   */
  defaultValue?: DateRange;
  
  /**
   * Include time picker
   * @default false
   */
  includeTime?: boolean;
  
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  
  /**
   * Preset ranges (Today, Yesterday, Last 7 days, etc.)
   */
  presets?: DateRangePreset[];
  
  /**
   * Show preset ranges
   * @default true
   */
  showPresets?: boolean;
  
  /**
   * Number of months to display
   * @default 2
   */
  monthsToShow?: 1 | 2 | 3;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Placeholder text
   * @default 'Select date range'
   */
  placeholder?: string;
  
  /**
   * Change callback
   */
  onChange?: (range: DateRange) => void;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Error message
   */
  error?: string;
}

export interface DateRangePreset {
  label: string;
  range: DateRange;
}

/* ============================================================
 * DEFAULT PRESETS
 * ============================================================ */

const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: 'Today',
    range: {
      start: new Date(new Date().setHours(0, 0, 0, 0)),
      end: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  },
  {
    label: 'Yesterday',
    range: {
      start: new Date(new Date().setDate(new Date().getDate() - 1)),
      end: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
  },
  {
    label: 'Last 7 days',
    range: {
      start: new Date(new Date().setDate(new Date().getDate() - 7)),
      end: new Date(),
    },
  },
  {
    label: 'Last 30 days',
    range: {
      start: new Date(new Date().setDate(new Date().getDate() - 30)),
      end: new Date(),
    },
  },
  {
    label: 'This month',
    range: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
  },
  {
    label: 'Last month',
    range: {
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    },
  },
];

/* ============================================================
 * DATE UTILITIES
 * ============================================================ */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const isInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  return date >= start && date <= end;
};

const getDaysInMonth = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  
  // Add empty days for alignment
  const firstDayOfWeek = firstDay.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(new Date(year, month, -firstDayOfWeek + i + 1));
  }
  
  // Add days of month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  return days;
};

const formatDate = (date: Date | null, includeTime: boolean = false): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  if (!includeTime) {
    return `${month}/${day}/${year}`;
  }
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${month}/${day}/${year} ${hours}:${minutes}`;
};

/* ============================================================
 * DATE RANGE PICKER COMPONENT
 * ============================================================ */

const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value: valueProp,
      defaultValue = { start: null, end: null },
      includeTime = false,
      minDate,
      maxDate,
      presets = DEFAULT_PRESETS,
      showPresets = true,
      monthsToShow = 2,
      disabled = false,
      placeholder = 'Select date range',
      onChange,
      className,
      error,
    },
    ref
  ) => {
    const [range, setRange] = React.useState<DateRange>(valueProp || defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [selectingStart, setSelectingStart] = React.useState(true);
    
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    
    const isControlled = valueProp !== undefined;
    const currentRange = isControlled ? valueProp : range;
    
    // Update range
    const updateRange = (newRange: DateRange) => {
      if (disabled) return;
      
      if (!isControlled) {
        setRange(newRange);
      }
      
      onChange?.(newRange);
    };
    
    // Handle date click
    const handleDateClick = (date: Date) => {
      if (disabled) return;
      
      // Check min/max constraints
      if (minDate && date < minDate) return;
      if (maxDate && date > maxDate) return;
      
      if (selectingStart) {
        updateRange({ start: date, end: null });
        setSelectingStart(false);
      } else {
        if (currentRange.start && date < currentRange.start) {
          // If end date is before start, swap them
          updateRange({ start: date, end: currentRange.start });
        } else {
          updateRange({ ...currentRange, end: date });
        }
        setSelectingStart(true);
        
        // Close picker if both dates selected and no time picker
        if (!includeTime) {
          setTimeout(() => setIsOpen(false), 200);
        }
      }
    };
    
    // Handle preset click
    const handlePresetClick = (preset: DateRangePreset) => {
      updateRange(preset.range);
      if (!includeTime) {
        setIsOpen(false);
      }
    };
    
    // Navigate months
    const previousMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };
    
    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };
    
    // Click outside to close
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);
    
    // Format display value
    const displayValue = React.useMemo(() => {
      if (!currentRange.start && !currentRange.end) return '';
      
      if (currentRange.start && !currentRange.end) {
        return formatDate(currentRange.start, includeTime);
      }
      
      if (currentRange.start && currentRange.end) {
        return `${formatDate(currentRange.start, includeTime)} - ${formatDate(currentRange.end, includeTime)}`;
      }
      
      return '';
    }, [currentRange, includeTime]);
    
    return (
      <div ref={ref} className={cn('relative w-full', className)}>
        {/* Input Field */}
        <button
          ref={containerRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2.5 text-left rounded-lg border transition-all',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20' : 'border-border',
            'bg-background text-foreground'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={cn('flex-1', !displayValue && 'text-muted-foreground')}>
              {displayValue || placeholder}
            </span>
            <Calendar className="w-5 h-5 text-muted-foreground ml-2" />
          </div>
        </button>
        
        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-xl p-4 min-w-max">
            <div className="flex gap-4">
              {/* Presets Sidebar */}
              {showPresets && presets.length > 0 && (
                <div className="flex flex-col gap-1 pr-4 border-r border-border min-w-[140px]">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Quick Select</h4>
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        'px-3 py-2 text-sm text-left rounded-lg transition-colors',
                        'hover:bg-[var(--muted)]',
                        'focus:outline-none focus:bg-[var(--muted)]'
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Calendar(s) */}
              <div className="flex gap-4">
                {Array.from({ length: monthsToShow }, (_, i) => {
                  const monthDate = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + i,
                    1
                  );
                  
                  return (
                    <div key={i} className="min-w-[280px]">
                      {/* Month Header */}
                      <div className="flex items-center justify-between mb-4">
                        {i === 0 && (
                          <button
                            type="button"
                            onClick={previousMonth}
                            className="p-1 hover:bg-[var(--muted)] rounded transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        )}
                        
                        <span className="font-semibold text-sm flex-1 text-center">
                          {MONTHS[monthDate.getMonth()]} {monthDate.getFullYear()}
                        </span>
                        
                        {i === monthsToShow - 1 && (
                          <button
                            type="button"
                            onClick={nextMonth}
                            className="p-1 hover:bg-[var(--muted)] rounded transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      
                      {/* Day Headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(monthDate.getFullYear(), monthDate.getMonth()).map((date, index) => {
                          const isCurrentMonth = date.getMonth() === monthDate.getMonth();
                          const isStart = isSameDay(date, currentRange.start);
                          const isEnd = isSameDay(date, currentRange.end);
                          const inRange = isInRange(date, currentRange.start, currentRange.end);
                          const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
                          const isToday = isSameDay(date, new Date());
                          
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleDateClick(date)}
                              disabled={isDisabled || !isCurrentMonth}
                              className={cn(
                                'aspect-square p-2 text-sm rounded-lg transition-all',
                                'hover:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-primary/20',
                                !isCurrentMonth && 'text-muted-foreground opacity-30',
                                isDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent',
                                isToday && 'font-bold border border-primary',
                                (isStart || isEnd) && 'bg-primary text-white hover:bg-primary',
                                inRange && !isStart && !isEnd && 'bg-primary/10'
                              )}
                            >
                              {date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Time Picker (if enabled) */}
            {includeTime && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Start:</span>
                    <input
                      type="time"
                      value={currentRange.start ? `${String(currentRange.start.getHours()).padStart(2, '0')}:${String(currentRange.start.getMinutes()).padStart(2, '0')}` : ''}
                      onChange={(e) => {
                        if (currentRange.start) {
                          const [hours, minutes] = e.target.value.split(':');
                          const newDate = new Date(currentRange.start);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          updateRange({ ...currentRange, start: newDate });
                        }
                      }}
                      className="px-2 py-1 border border-border rounded text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">End:</span>
                    <input
                      type="time"
                      value={currentRange.end ? `${String(currentRange.end.getHours()).padStart(2, '0')}:${String(currentRange.end.getMinutes()).padStart(2, '0')}` : ''}
                      onChange={(e) => {
                        if (currentRange.end) {
                          const [hours, minutes] = e.target.value.split(':');
                          const newDate = new Date(currentRange.end);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          updateRange({ ...currentRange, end: newDate });
                        }
                      }}
                      className="px-2 py-1 border border-border rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  updateRange({ start: null, end: null });
                  setSelectingStart(true);
                }}
              >
                Clear
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={!currentRange.start || !currentRange.end}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Error */}
        {error && (
          <p className="text-xs text-[var(--error)] mt-1">{error}</p>
        )}
      </div>
    );
  }
);

DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
