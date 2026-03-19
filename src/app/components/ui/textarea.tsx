import * as React from "react";
import { cn } from "./utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  variant?: 'default' | 'filled' | 'outlined' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'error' | 'success' | 'warning';
  helperText?: string;
  error?: string;
  success?: string;
  warning?: string;
  fullWidth?: boolean;
  showCount?: boolean;
  label?: string;
  required?: boolean;
  optional?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const variantStyles = {
  default: cn(
    'border border-border bg-background',
    'hover:border-[var(--brand-primary-400)]',
    'focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20'
  ),
  filled: cn(
    'border-0 bg-accent',
    'hover:bg-accent/80',
    'focus:bg-background focus:ring-2 focus:ring-[var(--brand-primary)]/20'
  ),
  outlined: cn(
    'border-2 border-border bg-transparent',
    'hover:border-[var(--brand-primary-400)]',
    'focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20'
  ),
  ghost: cn(
    'border-0 bg-transparent',
    'hover:bg-accent',
    'focus:bg-accent focus:ring-0'
  ),
};

const sizeStyles = {
  sm: 'min-h-20 px-2.5 py-1.5 text-sm rounded-md',
  md: 'min-h-24 px-3 py-2 text-base rounded-lg',
  lg: 'min-h-32 px-4 py-3 text-lg rounded-lg',
};

const stateStyles = {
  default: '',
  error: 'border-[var(--error)] focus:ring-[var(--error)]/20',
  success: 'border-[var(--success)] focus:ring-[var(--success)]/20',
  warning: 'border-[var(--warning)] focus:ring-[var(--warning)]/20',
};

const resizeStyles = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = 'default',
      inputSize = 'md',
      state: stateProp,
      helperText,
      error,
      success,
      warning,
      fullWidth = false,
      disabled = false,
      showCount = false,
      label,
      required = false,
      optional = false,
      resize = 'vertical',
      value,
      maxLength,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>('');
    const textareaValue = value !== undefined ? value : internalValue;
    
    // Determine state
    const state = error ? 'error' : success ? 'success' : warning ? 'warning' : stateProp || 'default';
    const displayMessage = error || success || warning || helperText;
    
    // Determine character count
    const currentLength = typeof textareaValue === 'string' ? textareaValue.length : 0;
    
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
        
        {/* Textarea */}
        <textarea
          ref={ref}
          value={textareaValue}
          onChange={(e) => setInternalValue(e.target.value)}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={state === 'error'}
          aria-describedby={displayMessage ? `${props.id}-message` : undefined}
          aria-required={required}
          className={cn(
            'flex w-full',
            'text-foreground placeholder:text-muted-foreground',
            'outline-none transition-all duration-200',
            'disabled:cursor-not-allowed disabled:opacity-50',
            variantStyles[variant],
            sizeStyles[inputSize],
            stateStyles[state],
            resizeStyles[resize],
            className
          )}
          {...props}
        />
        
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

Textarea.displayName = "Textarea";

export { Textarea };
