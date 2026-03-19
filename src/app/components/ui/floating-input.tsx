import * as React from "react";
import { cn } from "./utils";

/* ============================================================
 * FLOATING INPUT PROPS
 * ============================================================
 * Material Design-inspired floating label input
 * Label floats up when input is focused or has value
 */

export interface FloatingInputProps extends Omit<React.ComponentProps<"input">, 'size'> {
  /**
   * Input label (required for floating effect)
   */
  label: string;
  
  /**
   * Input variant
   * @default 'outlined'
   */
  variant?: 'outlined' | 'filled' | 'standard';
  
  /**
   * Input size
   * @default 'md'
   */
  inputSize?: 'sm' | 'md' | 'lg';
  
  /**
   * Input state
   * @default 'default'
   */
  state?: 'default' | 'error' | 'success' | 'warning';
  
  /**
   * Helper text below input
   */
  helperText?: string;
  
  /**
   * Error message (sets state to 'error')
   */
  error?: string;
  
  /**
   * Left icon
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Right icon
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Required field indicator
   * @default false
   */
  required?: boolean;
}

/* ============================================================
 * VARIANT STYLES
 * ============================================================ */

const variantStyles = {
  outlined: {
    container: 'border-2 rounded-lg bg-transparent',
    input: 'bg-transparent',
    label: 'bg-background px-1',
    focused: 'border-primary',
    error: 'border-[var(--error)]',
    success: 'border-[var(--success)]',
    default: 'border-border hover:border-[var(--neutral-400)]',
  },
  filled: {
    container: 'border-0 border-b-2 rounded-t-lg bg-[var(--muted)]',
    input: 'bg-transparent',
    label: 'bg-transparent px-0',
    focused: 'border-b-primary bg-[var(--muted)]/80',
    error: 'border-b-[var(--error)]',
    success: 'border-b-[var(--success)]',
    default: 'border-b-border hover:bg-[var(--muted)]/60',
  },
  standard: {
    container: 'border-0 border-b-2 rounded-none bg-transparent',
    input: 'bg-transparent',
    label: 'bg-transparent px-0',
    focused: 'border-b-primary',
    error: 'border-b-[var(--error)]',
    success: 'border-b-[var(--success)]',
    default: 'border-b-border hover:border-b-[var(--neutral-400)]',
  },
};

/* ============================================================
 * SIZE STYLES
 * ============================================================ */

const sizeStyles = {
  sm: {
    container: 'h-10',
    input: 'text-sm px-3',
    label: 'text-xs',
    labelFloat: '-top-2 text-xs',
    labelDefault: 'top-2.5',
    icon: 'text-sm',
  },
  md: {
    container: 'h-12',
    input: 'text-base px-3',
    label: 'text-sm',
    labelFloat: '-top-2.5 text-xs',
    labelDefault: 'top-3',
    icon: 'text-base',
  },
  lg: {
    container: 'h-14',
    input: 'text-lg px-4',
    label: 'text-base',
    labelFloat: '-top-3 text-sm',
    labelDefault: 'top-4',
    icon: 'text-lg',
  },
};

/* ============================================================
 * FLOATING INPUT COMPONENT
 * ============================================================ */

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      className,
      label,
      variant = 'outlined',
      inputSize = 'md',
      state: stateProp,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      required = false,
      disabled,
      value,
      defaultValue,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    
    // Determine state
    const state = error ? 'error' : stateProp || 'default';
    const displayHelperText = error || helperText;
    
    // Check if label should float
    const shouldFloat = isFocused || hasValue || value !== undefined || defaultValue !== undefined;
    
    // Update hasValue when value changes
    React.useEffect(() => {
      if (inputRef.current) {
        setHasValue(!!inputRef.current.value);
      }
    }, [value]);
    
    // Handle focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };
    
    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };
    
    // Handle label click
    const handleLabelClick = () => {
      inputRef.current?.focus();
    };
    
    // Build container classes
    const containerClasses = cn(
      // Base container
      'relative flex items-center',
      'transition-all duration-200 ease-out',
      
      // Variant
      variantStyles[variant].container,
      
      // Size
      sizeStyles[inputSize].container,
      
      // State
      isFocused && variantStyles[variant].focused,
      !isFocused && state === 'error' && variantStyles[variant].error,
      !isFocused && state === 'success' && variantStyles[variant].success,
      !isFocused && state === 'default' && variantStyles[variant].default,
      
      // Disabled
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      
      // Width
      fullWidth ? 'w-full' : 'w-auto'
    );
    
    // Build label classes
    const labelClasses = cn(
      // Base label
      'absolute left-0 pointer-events-none',
      'text-muted-foreground',
      'transition-all duration-200 ease-out',
      'origin-top-left',
      
      // Variant
      variantStyles[variant].label,
      
      // Size and position
      shouldFloat ? sizeStyles[inputSize].labelFloat : sizeStyles[inputSize].labelDefault,
      shouldFloat && 'scale-100',
      !shouldFloat && 'scale-100',
      
      // State colors
      isFocused && 'text-primary',
      !isFocused && state === 'error' && 'text-[var(--error)]',
      !isFocused && state === 'success' && 'text-[var(--success)]',
      
      // With icons
      leftIcon && shouldFloat && 'left-0',
      leftIcon && !shouldFloat && 'left-9'
    );
    
    // Build input classes
    const inputClasses = cn(
      // Base input
      'flex-1 w-full bg-transparent',
      'text-foreground placeholder:text-transparent',
      'outline-none border-0',
      'transition-all duration-200 ease-out',
      
      // Variant
      variantStyles[variant].input,
      
      // Size
      sizeStyles[inputSize].input,
      
      // With icons
      leftIcon && 'pl-9',
      rightIcon && 'pr-9',
      
      // Disabled
      'disabled:cursor-not-allowed disabled:opacity-50',
      
      // Custom classes
      className
    );
    
    // Build icon classes
    const iconClasses = cn(
      'absolute flex items-center justify-center pointer-events-none',
      'text-muted-foreground',
      sizeStyles[inputSize].icon
    );
    
    return (
      <div className={fullWidth ? 'w-full' : 'w-auto'}>
        <div className={containerClasses}>
          {/* Left Icon */}
          {leftIcon && (
            <span className={cn(iconClasses, 'left-3')}>
              {leftIcon}
            </span>
          )}
          
          {/* Input */}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            className={inputClasses}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={state === 'error'}
            aria-describedby={displayHelperText ? `${props.id}-helper` : undefined}
            aria-required={required}
            {...props}
          />
          
          {/* Floating Label */}
          <label
            onClick={handleLabelClick}
            className={labelClasses}
          >
            {label}
            {required && <span className="text-[var(--error)] ml-1">*</span>}
          </label>
          
          {/* Right Icon */}
          {rightIcon && (
            <span className={cn(iconClasses, 'right-3 pointer-events-auto')}>
              {rightIcon}
            </span>
          )}
        </div>
        
        {/* Helper Text */}
        {displayHelperText && (
          <p
            id={`${props.id}-helper`}
            className={cn(
              'text-xs mt-1.5 ml-3',
              state === 'error' && 'text-[var(--error)]',
              state === 'success' && 'text-[var(--success)]',
              state === 'warning' && 'text-[var(--warning)]',
              state === 'default' && 'text-muted-foreground'
            )}
          >
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
