import * as React from "react";
import { cn } from "./utils";

/* ============================================================
 * MASKED INPUT PROPS
 * ============================================================
 * Input with formatting masks (phone, currency, date, etc.)
 * No external dependencies - pure React implementation
 */

export type MaskType = 
  | 'phone'           // (123) 456-7890
  | 'phone-intl'      // +1 (123) 456-7890
  | 'currency'        // $1,234.56
  | 'date'            // MM/DD/YYYY
  | 'time'            // HH:MM
  | 'ssn'             // XXX-XX-XXXX
  | 'credit-card'     // XXXX XXXX XXXX XXXX
  | 'zip'             // 12345 or 12345-6789
  | 'custom';         // Custom mask pattern

export interface MaskedInputProps extends Omit<React.ComponentProps<"input">, 'type' | 'size'> {
  /**
   * Mask type
   */
  maskType: MaskType;
  
  /**
   * Custom mask pattern (for maskType='custom')
   * Use: 9 = digit, A = letter, * = alphanumeric
   * Example: '(999) 999-9999'
   */
  maskPattern?: string;
  
  /**
   * Input variant
   * @default 'default'
   */
  variant?: 'default' | 'filled' | 'outlined' | 'ghost';
  
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
   * Helper text
   */
  helperText?: string;
  
  /**
   * Error message
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
   * Currency symbol (for currency mask)
   * @default '$'
   */
  currencySymbol?: string;
  
  /**
   * Allow decimal (for currency mask)
   * @default true
   */
  allowDecimal?: boolean;
  
  /**
   * Callback for unmasked value
   */
  onUnmaskedChange?: (value: string) => void;
}

/* ============================================================
 * MASK PATTERNS
 * ============================================================ */

const MASK_PATTERNS: Record<Exclude<MaskType, 'custom'>, string> = {
  'phone': '(999) 999-9999',
  'phone-intl': '+9 (999) 999-9999',
  'date': '99/99/9999',
  'time': '99:99',
  'ssn': '999-99-9999',
  'credit-card': '9999 9999 9999 9999',
  'zip': '99999',
  'currency': '', // Handled separately
};

/* ============================================================
 * MASK PLACEHOLDERS
 * ============================================================ */

const MASK_PLACEHOLDERS: Record<MaskType, string> = {
  'phone': '(___) ___-____',
  'phone-intl': '+_ (___) ___-____',
  'currency': '0.00',
  'date': 'MM/DD/YYYY',
  'time': 'HH:MM',
  'ssn': '___-__-____',
  'credit-card': '____ ____ ____ ____',
  'zip': '_____',
  'custom': '',
};

/* ============================================================
 * MASKING UTILITIES
 * ============================================================ */

/**
 * Apply mask pattern to value
 */
function applyMask(value: string, pattern: string): string {
  if (!value) return '';
  
  let maskedValue = '';
  let valueIndex = 0;
  
  for (let i = 0; i < pattern.length && valueIndex < value.length; i++) {
    const patternChar = pattern[i];
    const valueChar = value[valueIndex];
    
    if (patternChar === '9') {
      // Digit
      if (/\d/.test(valueChar)) {
        maskedValue += valueChar;
        valueIndex++;
      } else {
        break;
      }
    } else if (patternChar === 'A') {
      // Letter
      if (/[a-zA-Z]/.test(valueChar)) {
        maskedValue += valueChar;
        valueIndex++;
      } else {
        break;
      }
    } else if (patternChar === '*') {
      // Alphanumeric
      if (/[a-zA-Z0-9]/.test(valueChar)) {
        maskedValue += valueChar;
        valueIndex++;
      } else {
        break;
      }
    } else {
      // Literal character (e.g., '/', '-', ' ')
      maskedValue += patternChar;
      if (valueChar === patternChar) {
        valueIndex++;
      }
    }
  }
  
  return maskedValue;
}

/**
 * Remove mask from value (get raw value)
 */
function removeMask(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Format currency value
 */
function formatCurrency(value: string, symbol: string, allowDecimal: boolean): string {
  // Remove non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  
  // Split into integer and decimal parts
  const parts = cleaned.split('.');
  let integer = parts[0] || '0';
  let decimal = allowDecimal && parts[1] !== undefined ? parts[1].slice(0, 2) : '';
  
  // Add thousand separators
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Combine
  const formatted = decimal ? `${integer}.${decimal}` : integer;
  return `${symbol}${formatted}`;
}

/**
 * Format date value (MM/DD/YYYY with auto-correction)
 */
function formatDate(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  let formatted = '';
  
  if (cleaned.length >= 1) {
    // Month (01-12)
    let month = cleaned.slice(0, 2);
    if (parseInt(month) > 12) month = '12';
    formatted += month;
  }
  
  if (cleaned.length >= 3) {
    // Day (01-31)
    let day = cleaned.slice(2, 4);
    if (parseInt(day) > 31) day = '31';
    formatted += '/' + day;
  }
  
  if (cleaned.length >= 5) {
    // Year
    formatted += '/' + cleaned.slice(4, 8);
  }
  
  return formatted;
}

/**
 * Format time value (HH:MM with auto-correction)
 */
function formatTime(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  let formatted = '';
  
  if (cleaned.length >= 1) {
    // Hour (00-23)
    let hour = cleaned.slice(0, 2);
    if (parseInt(hour) > 23) hour = '23';
    formatted += hour;
  }
  
  if (cleaned.length >= 3) {
    // Minute (00-59)
    let minute = cleaned.slice(2, 4);
    if (parseInt(minute) > 59) minute = '59';
    formatted += ':' + minute;
  }
  
  return formatted;
}

/* ============================================================
 * VARIANT STYLES
 * ============================================================ */

const variantStyles = {
  default: cn(
    'border border-border bg-[var(--input-background)]',
    'hover:border-[var(--neutral-400)] dark:hover:border-[var(--neutral-600)]'
  ),
  filled: cn(
    'border-0 bg-[var(--muted)]',
    'hover:bg-[var(--neutral-200)] dark:hover:bg-[var(--neutral-800)]'
  ),
  outlined: cn(
    'border-2 border-border bg-transparent',
    'hover:border-[var(--neutral-400)] dark:hover:border-[var(--neutral-600)]'
  ),
  ghost: cn(
    'border-0 bg-transparent',
    'hover:bg-[var(--muted)]'
  ),
};

/* ============================================================
 * SIZE STYLES
 * ============================================================ */

const sizeStyles = {
  sm: 'h-8 px-2.5 text-sm rounded-md',
  md: 'h-10 px-3 text-base rounded-lg',
  lg: 'h-12 px-4 text-lg rounded-lg',
};

/* ============================================================
 * STATE STYLES
 * ============================================================ */

const stateStyles = {
  default: 'focus:border-primary focus:ring-2 focus:ring-primary/20',
  error: cn(
    'border-2 border-[var(--error)]',
    'focus:ring-2 focus:ring-[var(--error)]/20'
  ),
  success: cn(
    'border-2 border-[var(--success)]',
    'focus:ring-2 focus:ring-[var(--success)]/20'
  ),
  warning: cn(
    'border-2 border-[var(--warning)]',
    'focus:ring-2 focus:ring-[var(--warning)]/20'
  ),
};

/* ============================================================
 * MASKED INPUT COMPONENT
 * ============================================================ */

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      className,
      maskType,
      maskPattern,
      variant = 'default',
      inputSize = 'md',
      state: stateProp,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      currencySymbol = '$',
      allowDecimal = true,
      disabled,
      value,
      placeholder,
      onChange,
      onUnmaskedChange,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    
    // Determine state
    const state = error ? 'error' : stateProp || 'default';
    const displayHelperText = error || helperText;
    
    // Get placeholder
    const defaultPlaceholder = placeholder || MASK_PLACEHOLDERS[maskType];
    
    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      let formattedValue = '';
      let unmaskedValue = '';
      
      // Apply mask based on type
      if (maskType === 'currency') {
        formattedValue = formatCurrency(rawValue, currencySymbol, allowDecimal);
        unmaskedValue = rawValue.replace(/[^\d.]/g, '');
      } else if (maskType === 'date') {
        formattedValue = formatDate(rawValue);
        unmaskedValue = rawValue.replace(/\D/g, '');
      } else if (maskType === 'time') {
        formattedValue = formatTime(rawValue);
        unmaskedValue = rawValue.replace(/\D/g, '');
      } else if (maskType === 'custom' && maskPattern) {
        const cleaned = removeMask(rawValue);
        formattedValue = applyMask(cleaned, maskPattern);
        unmaskedValue = cleaned;
      } else {
        // Standard mask patterns
        const pattern = MASK_PATTERNS[maskType];
        const cleaned = removeMask(rawValue);
        formattedValue = applyMask(cleaned, pattern);
        unmaskedValue = cleaned;
      }
      
      setDisplayValue(formattedValue);
      
      // Call original onChange with formatted value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue,
        },
      };
      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      
      // Call onUnmaskedChange with raw value
      onUnmaskedChange?.(unmaskedValue);
    };
    
    // Initialize display value from prop
    React.useEffect(() => {
      if (value !== undefined) {
        if (maskType === 'currency') {
          setDisplayValue(formatCurrency(String(value), currencySymbol, allowDecimal));
        } else if (maskType === 'date') {
          setDisplayValue(formatDate(String(value)));
        } else if (maskType === 'time') {
          setDisplayValue(formatTime(String(value)));
        } else {
          const pattern = maskType === 'custom' && maskPattern ? maskPattern : MASK_PATTERNS[maskType];
          const cleaned = removeMask(String(value));
          setDisplayValue(applyMask(cleaned, pattern));
        }
      }
    }, [value, maskType, maskPattern, currencySymbol, allowDecimal]);
    
    // Build input classes
    const inputClasses = cn(
      // Base styles
      'flex items-center w-full',
      'text-foreground placeholder:text-muted-foreground',
      'outline-none',
      'transition-colors duration-200 ease-in-out',
      
      // Disabled
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      
      // Variant
      variantStyles[variant],
      
      // Size
      sizeStyles[inputSize],
      
      // State
      stateStyles[state],
      
      // With icons
      leftIcon && 'pl-9',
      rightIcon && 'pr-9',
      
      // Custom classes
      className
    );
    
    const wrapperClasses = cn(
      'relative',
      fullWidth ? 'w-full' : 'w-auto'
    );
    
    const iconClasses = cn(
      'absolute top-1/2 -translate-y-1/2',
      'text-muted-foreground pointer-events-none'
    );
    
    return (
      <div className={wrapperClasses}>
        <div className="relative">
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
            type="text"
            className={inputClasses}
            disabled={disabled}
            value={displayValue}
            placeholder={defaultPlaceholder}
            onChange={handleChange}
            aria-invalid={state === 'error'}
            aria-describedby={displayHelperText ? `${props.id}-helper` : undefined}
            {...props}
          />
          
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
              'text-xs mt-1.5',
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

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
