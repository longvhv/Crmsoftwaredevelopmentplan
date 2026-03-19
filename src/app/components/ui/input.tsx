import * as React from "react";
import { cn } from "./utils";
import { X } from "lucide-react";

/* ============================================================
 * INPUT TYPES
 * ============================================================ */

export type InputVariant = 'default' | 'filled' | 'outlined' | 'ghost';
export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type InputState = 'default' | 'error' | 'success' | 'warning';

/* ============================================================
 * INPUT PROPS
 * ============================================================ */

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: InputVariant;
  inputSize?: InputSize;
  state?: InputState;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;
  fullWidth?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  showCount?: boolean;
  label?: string;
  required?: boolean;
  optional?: boolean;
}

/* ============================================================
 * STYLES
 * ============================================================ */

const variantStyles: Record<InputVariant, string> = {
  default: cn(
    'border border-border bg-background',
    'hover:border-[var(--brand-primary-400)]',
    'focus-within:border-[var(--brand-primary)] focus-within:ring-2 focus-within:ring-[var(--brand-primary)]/20'
  ),
  filled: cn(
    'border-0 bg-accent',
    'hover:bg-accent/80',
    'focus-within:bg-background focus-within:ring-2 focus-within:ring-[var(--brand-primary)]/20'
  ),
  outlined: cn(
    'border-2 border-border bg-transparent',
    'hover:border-[var(--brand-primary-400)]',
    'focus-within:border-[var(--brand-primary)] focus-within:ring-2 focus-within:ring-[var(--brand-primary)]/20'
  ),
  ghost: cn(
    'border-0 bg-transparent',
    'hover:bg-accent',
    'focus-within:bg-accent focus-within:ring-0'
  ),
};

const sizeStyles: Record<InputSize, string> = {
  xs: 'h-7 text-xs rounded-md',
  sm: 'h-8 text-sm rounded-md',
  md: 'h-10 text-base rounded-lg',
  lg: 'h-12 text-lg rounded-lg',
  xl: 'h-14 text-xl rounded-xl',
};

const inputSizeStyles: Record<InputSize, string> = {
  xs: 'px-2 py-1',
  sm: 'px-2.5 py-1.5',
  md: 'px-3 py-2',
  lg: 'px-4 py-3',
  xl: 'px-5 py-4',
};

const iconSizeClasses: Record<InputSize, string> = {
  xs: 'size-3.5',
  sm: 'size-4',
  md: 'size-4',
  lg: 'size-5',
  xl: 'size-6',
};

const stateStyles: Record<InputState, string> = {
  default: '',
  error: 'border-[var(--error)] focus-within:ring-[var(--error)]/20',
  success: 'border-[var(--success)] focus-within:ring-[var(--success)]/20',
  warning: 'border-[var(--warning)] focus-within:ring-[var(--warning)]/20',
};

/* ============================================================
 * INPUT COMPONENT
 * ============================================================ */

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant = 'default',
      inputSize = 'md',
      state: stateProp,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      helperText,
      error,
      success,
      warning,
      fullWidth = false,
      disabled = false,
      clearable = false,
      onClear,
      showCount = false,
      label,
      required = false,
      optional = false,
      value,
      maxLength,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>('');
    const inputValue = value !== undefined ? value : internalValue;
    
    // Determine state
    const state = error ? 'error' : success ? 'success' : warning ? 'warning' : stateProp || 'default';
    const displayMessage = error || success || warning || helperText;
    
    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClear) {
        onClear();
      }
      setInternalValue('');
    };
    
    // Determine character count
    const currentLength = typeof inputValue === 'string' ? inputValue.length : 0;
    
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              'text-sm font-medium text-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
            {optional && <span className="ml-1.5 text-xs text-muted-foreground font-normal">(optional)</span>}
          </label>
        )}
        
        {/* Input Container */}
        <div
          className={cn(
            'relative flex items-center gap-2 transition-all duration-200',
            sizeStyles[inputSize],
            variantStyles[variant],
            stateStyles[state],
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            fullWidth && 'w-full',
            className
          )}
        >
          {/* Left Icon */}
          {leftIcon && (
            <div className={cn('flex-shrink-0 text-muted-foreground', iconSizeClasses[inputSize])}>
              {leftIcon}
            </div>
          )}
          
          {/* Prefix */}
          {prefix && (
            <div className="flex-shrink-0 text-sm text-muted-foreground font-medium">
              {prefix}
            </div>
          )}
          
          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            value={inputValue}
            onChange={(e) => setInternalValue(e.target.value)}
            disabled={disabled}
            maxLength={maxLength}
            aria-invalid={state === 'error'}
            aria-describedby={displayMessage ? `${props.id}-message` : undefined}
            aria-required={required}
            className={cn(
              'flex-1 min-w-0 bg-transparent border-0 outline-none',
              'text-foreground placeholder:text-muted-foreground',
              'disabled:cursor-not-allowed',
              inputSizeStyles[inputSize]
            )}
            {...props}
          />
          
          {/* Suffix */}
          {suffix && (
            <div className="flex-shrink-0 text-sm text-muted-foreground font-medium">
              {suffix}
            </div>
          )}
          
          {/* Clear Button */}
          {clearable && inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'flex-shrink-0 text-muted-foreground hover:text-foreground',
                'transition-colors rounded-full hover:bg-accent',
                'p-0.5 cursor-pointer',
                iconSizeClasses[inputSize]
              )}
              aria-label="Clear input"
            >
              <X className="size-full" />
            </button>
          )}
          
          {/* Right Icon */}
          {rightIcon && (
            <div className={cn('flex-shrink-0 text-muted-foreground', iconSizeClasses[inputSize])}>
              {rightIcon}
            </div>
          )}
        </div>
        
        {/* Footer: Helper Text + Character Count */}
        <div className="flex items-start justify-between gap-2 min-h-[1.25rem]">
          {/* Helper Text / Message */}
          {displayMessage && (
            <p
              id={`${props.id}-message`}
              className={cn(
                'text-xs',
                state === 'error' && 'text-[var(--error)]',
                state === 'success' && 'text-[var(--success)]',
                state === 'warning' && 'text-[var(--warning)]',
                state === 'default' && 'text-muted-foreground'
              )}
            >
              {displayMessage}
            </p>
          )}
          
          {/* Character Count */}
          {showCount && (
            <p
              className={cn(
                'text-xs text-muted-foreground whitespace-nowrap ml-auto',
                maxLength && currentLength > maxLength && 'text-[var(--error)]'
              )}
            >
              {currentLength}{maxLength ? ` / ${maxLength}` : ''}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
