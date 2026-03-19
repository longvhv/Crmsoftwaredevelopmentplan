import * as React from "react";
import { cn } from "./utils";

/* ============================================================
 * SLIDER PROPS
 * ============================================================
 * Range slider with tooltips, marks, and dual handles
 */

export interface SliderProps {
  /**
   * Current value (single) or values (range)
   */
  value?: number | [number, number];
  
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: number | [number, number];
  
  /**
   * Minimum value
   * @default 0
   */
  min?: number;
  
  /**
   * Maximum value
   * @default 100
   */
  max?: number;
  
  /**
   * Step increment
   * @default 1
   */
  step?: number;
  
  /**
   * Range mode (dual handles)
   * @default false
   */
  range?: boolean;
  
  /**
   * Orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Show tooltip on hover/drag
   * @default true
   */
  showTooltip?: boolean;
  
  /**
   * Always show tooltip
   * @default false
   */
  alwaysShowTooltip?: boolean;
  
  /**
   * Show value marks
   */
  marks?: number[] | Record<number, string>;
  
  /**
   * Show min/max labels
   * @default false
   */
  showMinMax?: boolean;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Color scheme
   * @default 'primary'
   */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Format tooltip value
   */
  formatTooltip?: (value: number) => string;
  
  /**
   * Change callback
   */
  onChange?: (value: number | [number, number]) => void;
  
  /**
   * Change complete callback (on mouse up)
   */
  onChangeComplete?: (value: number | [number, number]) => void;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * COLOR STYLES
 * ============================================================ */

const colorStyles = {
  primary: {
    track: 'bg-primary',
    thumb: 'bg-primary border-primary',
    tooltip: 'bg-primary text-white',
  },
  success: {
    track: 'bg-[var(--success)]',
    thumb: 'bg-[var(--success)] border-[var(--success)]',
    tooltip: 'bg-[var(--success)] text-white',
  },
  warning: {
    track: 'bg-[var(--warning)]',
    thumb: 'bg-[var(--warning)] border-[var(--warning)]',
    tooltip: 'bg-[var(--warning)] text-white',
  },
  error: {
    track: 'bg-[var(--error)]',
    thumb: 'bg-[var(--error)] border-[var(--error)]',
    tooltip: 'bg-[var(--error)] text-white',
  },
  info: {
    track: 'bg-[var(--info)]',
    thumb: 'bg-[var(--info)] border-[var(--info)]',
    tooltip: 'bg-[var(--info)] text-white',
  },
};

/* ============================================================
 * SIZE STYLES
 * ============================================================ */

const sizeStyles = {
  sm: {
    track: 'h-1',
    thumb: 'w-3 h-3',
    tooltip: 'text-xs px-1.5 py-0.5',
  },
  md: {
    track: 'h-1.5',
    thumb: 'w-4 h-4',
    tooltip: 'text-sm px-2 py-1',
  },
  lg: {
    track: 'h-2',
    thumb: 'w-5 h-5',
    tooltip: 'text-base px-2.5 py-1.5',
  },
};

/* ============================================================
 * TOOLTIP COMPONENT
 * ============================================================ */

interface TooltipProps {
  value: number;
  visible: boolean;
  color: keyof typeof colorStyles;
  size: keyof typeof sizeStyles;
  formatValue?: (value: number) => string;
}

const Tooltip: React.FC<TooltipProps> = ({ value, visible, color, size, formatValue }) => {
  const colors = colorStyles[color];
  const sizes = sizeStyles[size];
  
  if (!visible) return null;
  
  const displayValue = formatValue ? formatValue(value) : value.toString();
  
  return (
    <div
      className={cn(
        'absolute -top-10 left-1/2 -translate-x-1/2',
        'rounded px-2 py-1 whitespace-nowrap',
        'transition-opacity duration-200',
        'pointer-events-none',
        colors.tooltip,
        sizes.tooltip,
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {displayValue}
      {/* Arrow */}
      <div
        className={cn(
          'absolute top-full left-1/2 -translate-x-1/2',
          'w-0 h-0 border-4 border-transparent',
          colors.tooltip.replace('text-white', 'border-t-current')
        )}
        style={{ borderTopColor: 'currentColor' }}
      />
    </div>
  );
};

/* ============================================================
 * SLIDER COMPONENT
 * ============================================================ */

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: valueProp,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      range = false,
      orientation = 'horizontal',
      showTooltip = true,
      alwaysShowTooltip = false,
      marks,
      showMinMax = false,
      disabled = false,
      color = 'primary',
      size = 'md',
      formatTooltip,
      onChange,
      onChangeComplete,
      className,
    },
    ref
  ) => {
    const [value, setValue] = React.useState<number | [number, number]>(
      valueProp ?? defaultValue
    );
    const [isDragging, setIsDragging] = React.useState<number | null>(null); // 0 = first thumb, 1 = second thumb
    const [showTooltipState, setShowTooltipState] = React.useState(alwaysShowTooltip);
    
    const trackRef = React.useRef<HTMLDivElement | null>(null);
    
    const isControlled = valueProp !== undefined;
    const currentValue = isControlled ? valueProp : value;
    
    // Normalize to array
    const values: [number, number] = Array.isArray(currentValue)
      ? currentValue
      : [min, currentValue];
    
    // Calculate percentage
    const getPercentage = (val: number) => {
      return ((val - min) / (max - min)) * 100;
    };
    
    // Get value from position
    const getValueFromPosition = (clientX: number, clientY: number) => {
      if (!trackRef.current) return min;
      
      const rect = trackRef.current.getBoundingClientRect();
      const isHorizontal = orientation === 'horizontal';
      
      const position = isHorizontal
        ? ((clientX - rect.left) / rect.width) * 100
        : ((rect.bottom - clientY) / rect.height) * 100;
      
      const clampedPosition = Math.max(0, Math.min(100, position));
      let newValue = min + (clampedPosition / 100) * (max - min);
      
      // Snap to step
      newValue = Math.round(newValue / step) * step;
      newValue = Math.max(min, Math.min(max, newValue));
      
      return newValue;
    };
    
    // Update value
    const updateValue = (newValue: number, thumbIndex: number) => {
      if (disabled) return;
      
      let updatedValue: number | [number, number];
      
      if (range) {
        const [val0, val1] = values;
        if (thumbIndex === 0) {
          updatedValue = [Math.min(newValue, val1), val1];
        } else {
          updatedValue = [val0, Math.max(newValue, val0)];
        }
      } else {
        updatedValue = newValue;
      }
      
      if (!isControlled) {
        setValue(updatedValue);
      }
      
      onChange?.(updatedValue);
    };
    
    // Mouse/Touch handlers
    const handlePointerDown = (e: React.PointerEvent, thumbIndex: number) => {
      if (disabled) return;
      
      e.preventDefault();
      setIsDragging(thumbIndex);
      setShowTooltipState(true);
      
      const handlePointerMove = (moveEvent: PointerEvent) => {
        const newValue = getValueFromPosition(moveEvent.clientX, moveEvent.clientY);
        updateValue(newValue, thumbIndex);
      };
      
      const handlePointerUp = () => {
        setIsDragging(null);
        if (!alwaysShowTooltip) {
          setShowTooltipState(false);
        }
        onChangeComplete?.(isControlled ? valueProp : value);
        
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
      
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    };
    
    // Track click
    const handleTrackClick = (e: React.MouseEvent) => {
      if (disabled) return;
      
      const newValue = getValueFromPosition(e.clientX, e.clientY);
      
      if (range) {
        // Find closest thumb
        const [val0, val1] = values;
        const dist0 = Math.abs(newValue - val0);
        const dist1 = Math.abs(newValue - val1);
        const thumbIndex = dist0 < dist1 ? 0 : 1;
        updateValue(newValue, thumbIndex);
      } else {
        updateValue(newValue, 1);
      }
    };
    
    // Mark positions
    const markPositions = React.useMemo(() => {
      if (!marks) return [];
      
      if (Array.isArray(marks)) {
        return marks.map((mark) => ({
          value: mark,
          label: mark.toString(),
          percentage: getPercentage(mark),
        }));
      } else {
        return Object.entries(marks).map(([value, label]) => ({
          value: Number(value),
          label,
          percentage: getPercentage(Number(value)),
        }));
      }
    }, [marks, min, max]);
    
    const colors = colorStyles[color];
    const sizes = sizeStyles[size];
    
    const isHorizontal = orientation === 'horizontal';
    const showValue0 = range;
    const showValue1 = true;
    
    const percentage0 = range ? getPercentage(values[0]) : 0;
    const percentage1 = getPercentage(values[1]);
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full',
          !isHorizontal && 'h-64',
          className
        )}
      >
        {/* Min/Max Labels */}
        {showMinMax && isHorizontal && (
          <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
            <span>{formatTooltip ? formatTooltip(min) : min}</span>
            <span>{formatTooltip ? formatTooltip(max) : max}</span>
          </div>
        )}
        
        {/* Track Container */}
        <div
          className={cn(
            'relative',
            isHorizontal ? 'w-full py-2' : 'h-full px-2 flex items-center'
          )}
        >
          {/* Background Track */}
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            className={cn(
              'relative bg-[var(--muted)] rounded-full cursor-pointer',
              isHorizontal ? 'w-full' : 'h-full w-1.5',
              sizes.track,
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Active Track */}
            <div
              className={cn(
                'absolute rounded-full transition-all',
                colors.track,
                isHorizontal ? 'h-full' : 'w-full'
              )}
              style={
                isHorizontal
                  ? { left: `${percentage0}%`, width: `${percentage1 - percentage0}%` }
                  : { bottom: `${percentage0}%`, height: `${percentage1 - percentage0}%` }
              }
            />
            
            {/* Marks */}
            {markPositions.map((mark) => (
              <div
                key={mark.value}
                className="absolute"
                style={
                  isHorizontal
                    ? { left: `${mark.percentage}%`, top: '50%', transform: 'translate(-50%, -50%)' }
                    : { bottom: `${mark.percentage}%`, left: '50%', transform: 'translate(-50%, 50%)' }
                }
              >
                <div className="w-1 h-1 bg-background rounded-full border border-border" />
                {mark.label && (
                  <span
                    className="absolute text-xs text-muted-foreground whitespace-nowrap"
                    style={
                      isHorizontal
                        ? { top: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)' }
                        : { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }
                    }
                  >
                    {mark.label}
                  </span>
                )}
              </div>
            ))}
            
            {/* Thumb 0 (range mode) */}
            {showValue0 && (
              <div
                className="absolute"
                style={
                  isHorizontal
                    ? { left: `${percentage0}%`, top: '50%', transform: 'translate(-50%, -50%)' }
                    : { bottom: `${percentage0}%`, left: '50%', transform: 'translate(-50%, 50%)' }
                }
              >
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(e, 0)}
                  onMouseEnter={() => showTooltip && setShowTooltipState(true)}
                  onMouseLeave={() => showTooltip && !alwaysShowTooltip && !isDragging && setShowTooltipState(false)}
                  disabled={disabled}
                  className={cn(
                    'relative rounded-full border-2 bg-background shadow-md transition-all',
                    'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    colors.thumb,
                    sizes.thumb,
                    disabled && 'cursor-not-allowed opacity-50',
                    isDragging === 0 && 'scale-110 ring-2 ring-offset-2'
                  )}
                  aria-label={`Slider thumb ${values[0]}`}
                >
                  {showTooltip && (
                    <Tooltip
                      value={values[0]}
                      visible={showTooltipState && (alwaysShowTooltip || isDragging === 0)}
                      color={color}
                      size={size}
                      formatValue={formatTooltip}
                    />
                  )}
                </button>
              </div>
            )}
            
            {/* Thumb 1 */}
            {showValue1 && (
              <div
                className="absolute"
                style={
                  isHorizontal
                    ? { left: `${percentage1}%`, top: '50%', transform: 'translate(-50%, -50%)' }
                    : { bottom: `${percentage1}%`, left: '50%', transform: 'translate(-50%, 50%)' }
                }
              >
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(e, 1)}
                  onMouseEnter={() => showTooltip && setShowTooltipState(true)}
                  onMouseLeave={() => showTooltip && !alwaysShowTooltip && !isDragging && setShowTooltipState(false)}
                  disabled={disabled}
                  className={cn(
                    'relative rounded-full border-2 bg-background shadow-md transition-all',
                    'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    colors.thumb,
                    sizes.thumb,
                    disabled && 'cursor-not-allowed opacity-50',
                    isDragging === 1 && 'scale-110 ring-2 ring-offset-2'
                  )}
                  aria-label={`Slider thumb ${values[1]}`}
                >
                  {showTooltip && (
                    <Tooltip
                      value={values[1]}
                      visible={showTooltipState && (alwaysShowTooltip || isDragging === 1)}
                      color={color}
                      size={size}
                      formatValue={formatTooltip}
                    />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
