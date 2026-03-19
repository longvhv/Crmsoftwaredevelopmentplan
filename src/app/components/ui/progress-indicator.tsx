import * as React from "react";
import { cn } from "./utils";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

/* ============================================================
 * PROGRESS INDICATOR - Circular & Linear progress displays
 * ============================================================
 * Supports multiple variants, animations, and status indicators
 */

/* ============================================================
 * LINEAR PROGRESS
 * ============================================================ */

export interface LinearProgressProps {
  /**
   * Progress value (0-100)
   */
  value: number;
  
  /**
   * Show percentage label
   * @default false
   */
  showLabel?: boolean;
  
  /**
   * Label position
   * @default 'end'
   */
  labelPosition?: 'start' | 'end' | 'center';
  
  /**
   * Progress variant
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Animated
   * @default true
   */
  animated?: boolean;
  
  /**
   * Indeterminate (loading state)
   * @default false
   */
  indeterminate?: boolean;
  
  /**
   * Custom color
   */
  color?: string;
  
  /**
   * Custom className
   */
  className?: string;
}

const LINEAR_SIZES = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
  xl: 'h-4',
};

const LINEAR_VARIANTS = {
  default: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  gradient: 'bg-gradient-to-r from-primary via-purple-500 to-pink-500',
};

export function LinearProgress({
  value,
  showLabel = false,
  labelPosition = 'end',
  variant = 'default',
  size = 'md',
  animated = true,
  indeterminate = false,
  color,
  className,
}: LinearProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  const label = (
    <span className="text-sm font-medium text-muted-foreground min-w-[3rem] text-right">
      {clampedValue}%
    </span>
  );
  
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {showLabel && labelPosition === 'start' && label}
      
      <div className={cn('flex-1 bg-[var(--muted)] rounded-full overflow-hidden relative', LINEAR_SIZES[size])}>
        {indeterminate ? (
          <div
            className={cn(
              'absolute inset-0 animate-[shimmer_1.5s_infinite]',
              LINEAR_VARIANTS[variant]
            )}
            style={{
              background: color || undefined,
              backgroundImage: 'linear-gradient(90deg, transparent 0%, currentColor 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        ) : (
          <>
            <div
              className={cn(
                'h-full rounded-full transition-all',
                animated && 'duration-500 ease-out',
                LINEAR_VARIANTS[variant]
              )}
              style={{
                width: `${clampedValue}%`,
                backgroundColor: color || undefined,
              }}
            />
            
            {labelPosition === 'center' && showLabel && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow">
                  {clampedValue}%
                </span>
              </div>
            )}
          </>
        )}
      </div>
      
      {showLabel && labelPosition === 'end' && label}
    </div>
  );
}

/* ============================================================
 * CIRCULAR PROGRESS
 * ============================================================ */

export interface CircularProgressProps {
  /**
   * Progress value (0-100)
   */
  value: number;
  
  /**
   * Size in pixels
   * @default 120
   */
  size?: number;
  
  /**
   * Stroke width
   * @default 8
   */
  strokeWidth?: number;
  
  /**
   * Show percentage label
   * @default true
   */
  showLabel?: boolean;
  
  /**
   * Show value instead of percentage
   */
  showValue?: boolean;
  
  /**
   * Max value (for showValue)
   * @default 100
   */
  maxValue?: number;
  
  /**
   * Progress variant
   * @default 'default'
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  
  /**
   * Animated
   * @default true
   */
  animated?: boolean;
  
  /**
   * Indeterminate (loading state)
   * @default false
   */
  indeterminate?: boolean;
  
  /**
   * Custom color
   */
  color?: string;
  
  /**
   * Track color
   */
  trackColor?: string;
  
  /**
   * Custom content in center
   */
  children?: React.ReactNode;
  
  /**
   * Custom className
   */
  className?: string;
}

const CIRCULAR_VARIANTS = {
  default: 'stroke-primary',
  success: 'stroke-green-500',
  warning: 'stroke-amber-500',
  error: 'stroke-red-500',
  gradient: 'stroke-primary', // Will use gradient definition
};

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  showValue = false,
  maxValue = 100,
  variant = 'default',
  animated = true,
  indeterminate = false,
  color,
  trackColor = '#e5e7eb',
  children,
  className,
}: CircularProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;
  const center = size / 2;
  
  return (
    <div className={cn('relative inline-flex', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Gradient Definition */}
        {variant === 'gradient' && (
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        )}
        
        {/* Track (background circle) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        {indeterminate ? (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color || (variant === 'gradient' ? 'url(#progress-gradient)' : undefined)}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
            className={cn(
              'animate-spin',
              !color && variant !== 'gradient' && CIRCULAR_VARIANTS[variant]
            )}
            strokeLinecap="round"
          />
        ) : (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color || (variant === 'gradient' ? 'url(#progress-gradient)' : undefined)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              animated && 'transition-all duration-500 ease-out',
              !color && variant !== 'gradient' && CIRCULAR_VARIANTS[variant]
            )}
          />
        )}
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (showLabel && (
          <div className="text-center">
            <div className="text-2xl font-bold">
              {showValue ? `${Math.round((clampedValue / 100) * maxValue)}` : `${Math.round(clampedValue)}%`}
            </div>
            {showValue && (
              <div className="text-xs text-muted-foreground">of {maxValue}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * PROGRESS RING (Compact circular)
 * ============================================================ */

export interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export function ProgressRing({
  value,
  size = 40,
  strokeWidth = 4,
  variant = 'default',
  className,
}: ProgressRingProps) {
  return (
    <CircularProgress
      value={value}
      size={size}
      strokeWidth={strokeWidth}
      variant={variant}
      showLabel={false}
      className={className}
    />
  );
}

/* ============================================================
 * STEPPED PROGRESS
 * ============================================================ */

export interface SteppedProgressProps {
  /**
   * Current step (1-indexed)
   */
  currentStep: number;
  
  /**
   * Total steps
   */
  totalSteps: number;
  
  /**
   * Step labels
   */
  labels?: string[];
  
  /**
   * Orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Show step numbers
   * @default true
   */
  showNumbers?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

export function SteppedProgress({
  currentStep,
  totalSteps,
  labels = [],
  orientation = 'horizontal',
  showNumbers = true,
  className,
}: SteppedProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  if (orientation === 'vertical') {
    return (
      <div className={cn('flex flex-col', className)}>
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const label = labels[index];
          
          return (
            <div key={step} className="flex gap-3">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors',
                    isCompleted && 'bg-primary text-white',
                    isCurrent && 'bg-primary text-white ring-4 ring-primary/20',
                    !isCompleted && !isCurrent && 'bg-[var(--muted)] text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : showNumbers ? (
                    step
                  ) : (
                    <Circle className="w-3 h-3" />
                  )}
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 h-12 transition-colors',
                      isCompleted ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </div>
              
              {/* Label */}
              {label && (
                <div className="pt-1">
                  <div className={cn('font-medium', isCurrent && 'text-primary')}>
                    {label}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
  
  // Horizontal orientation
  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, index) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        const label = labels[index];
        
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2">
              {/* Step indicator */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors',
                  isCompleted && 'bg-primary text-white',
                  isCurrent && 'bg-primary text-white ring-4 ring-primary/20',
                  !isCompleted && !isCurrent && 'bg-[var(--muted)] text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : showNumbers ? (
                  step
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
              
              {/* Label */}
              {label && (
                <div className="text-xs text-center max-w-[80px]">
                  <div className={cn('font-medium', isCurrent && 'text-primary')}>
                    {label}
                  </div>
                </div>
              )}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 transition-colors',
                  isCompleted ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ============================================================
 * PROGRESS WITH SEGMENTS
 * ============================================================ */

export interface ProgressSegment {
  value: number;
  color?: string;
  label?: string;
}

export interface SegmentedProgressProps {
  segments: ProgressSegment[];
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SegmentedProgress({
  segments,
  showLabels = false,
  size = 'md',
  className,
}: SegmentedProgressProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  
  return (
    <div className={cn('space-y-2', className)}>
      <div className={cn('flex rounded-full overflow-hidden', LINEAR_SIZES[size])}>
        {segments.map((segment, index) => {
          const percentage = (segment.value / total) * 100;
          
          return (
            <div
              key={index}
              className="transition-all duration-500"
              style={{
                width: `${percentage}%`,
                backgroundColor: segment.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
              }}
              title={segment.label}
            />
          );
        })}
      </div>
      
      {showLabels && (
        <div className="flex flex-wrap gap-3 text-sm">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: segment.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                }}
              />
              <span className="text-muted-foreground">
                {segment.label}: {segment.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * LOADING SPINNER
 * ============================================================ */

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  label?: string;
  className?: string;
}

const SPINNER_SIZES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const SPINNER_VARIANTS = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-green-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
};

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  label,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', SPINNER_SIZES[size], SPINNER_VARIANTS[variant])} />
      {label && <div className="text-sm text-muted-foreground">{label}</div>}
    </div>
  );
}
