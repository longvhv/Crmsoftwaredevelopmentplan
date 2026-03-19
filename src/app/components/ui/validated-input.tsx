import * as React from "react";
import { cn } from "./utils";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

/* ============================================================
 * VALIDATED INPUT PROPS
 * ============================================================
 * Input with real-time validation and visual feedback
 */

export type ValidatorFunction = (value: string) => string | null | Promise<string | null>;

export interface ValidationRule {
  /**
   * Validation function
   * Returns error message if invalid, null if valid
   */
  validator: ValidatorFunction;
  
  /**
   * Validation trigger
   * @default 'blur'
   */
  trigger?: 'change' | 'blur' | 'submit';
  
  /**
   * Debounce delay for 'change' trigger (ms)
   * @default 300
   */
  debounce?: number;
}

export interface ValidatedInputProps extends Omit<React.ComponentProps<"input">, 'size'> {
  /**
   * Validation rules
   */
  validationRules?: ValidationRule[];
  
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
   * Helper text (shown when no error)
   */
  helperText?: string;
  
  /**
   * Left icon
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Show validation icon
   * @default true
   */
  showValidationIcon?: boolean;
  
  /**
   * Show success state
   * @default true
   */
  showSuccess?: boolean;
  
  /**
   * Callback when validation state changes
   */
  onValidationChange?: (isValid: boolean, error: string | null) => void;
}

/* ============================================================
 * BUILT-IN VALIDATORS
 * ============================================================ */

export const validators = {
  /**
   * Required field validator
   */
  required: (message = 'This field is required'): ValidationRule => ({
    validator: (value) => {
      return value.trim() ? null : message;
    },
    trigger: 'blur',
  }),
  
  /**
   * Email validator
   */
  email: (message = 'Invalid email address'): ValidationRule => ({
    validator: (value) => {
      if (!value) return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : message;
    },
    trigger: 'blur',
  }),
  
  /**
   * Min length validator
   */
  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (!value) return null;
      return value.length >= min ? null : message || `Minimum ${min} characters required`;
    },
    trigger: 'change',
    debounce: 300,
  }),
  
  /**
   * Max length validator
   */
  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (!value) return null;
      return value.length <= max ? null : message || `Maximum ${max} characters allowed`;
    },
    trigger: 'change',
    debounce: 300,
  }),
  
  /**
   * Pattern validator (regex)
   */
  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    validator: (value) => {
      if (!value) return null;
      return regex.test(value) ? null : message;
    },
    trigger: 'blur',
  }),
  
  /**
   * URL validator
   */
  url: (message = 'Invalid URL'): ValidationRule => ({
    validator: (value) => {
      if (!value) return null;
      try {
        new URL(value);
        return null;
      } catch {
        return message;
      }
    },
    trigger: 'blur',
  }),
  
  /**
   * Phone validator (US format)
   */
  phone: (message = 'Invalid phone number'): ValidationRule => ({
    validator: (value) => {
      if (!value) return null;
      const phoneRegex = /^[\d\s\-\(\)]+$/;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 10 && phoneRegex.test(value) ? null : message;
    },
    trigger: 'blur',
  }),
  
  /**
   * Number validator
   */
  number: (message = 'Must be a number'): ValidationRule => ({
    validator: (value) => {
      if (!value) return null;
      return !isNaN(Number(value)) ? null : message;
    },
    trigger: 'change',
    debounce: 300,
  }),
  
  /**
   * Min value validator (for numbers)
   */
  min: (min: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (!value) return null;
      const num = Number(value);
      return !isNaN(num) && num >= min ? null : message || `Must be at least ${min}`;
    },
    trigger: 'blur',
  }),
  
  /**
   * Max value validator (for numbers)
   */
  max: (max: number, message?: string): ValidationRule => ({
    validator: (value) => {
      if (!value) return null;
      const num = Number(value);
      return !isNaN(num) && num <= max ? null : message || `Must be at most ${max}`;
    },
    trigger: 'blur',
  }),
  
  /**
   * Custom async validator (e.g., check username availability)
   */
  async: (
    asyncFn: (value: string) => Promise<boolean>,
    message = 'Validation failed'
  ): ValidationRule => ({
    validator: async (value) => {
      if (!value) return null;
      const isValid = await asyncFn(value);
      return isValid ? null : message;
    },
    trigger: 'blur',
  }),
};

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
 * VALIDATED INPUT COMPONENT
 * ============================================================ */

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  (
    {
      className,
      validationRules = [],
      variant = 'default',
      inputSize = 'md',
      helperText,
      leftIcon,
      fullWidth = false,
      showValidationIcon = true,
      showSuccess = true,
      disabled,
      value,
      onChange,
      onBlur,
      onValidationChange,
      ...props
    },
    ref
  ) => {
    const [error, setError] = React.useState<string | null>(null);
    const [isValidating, setIsValidating] = React.useState(false);
    const [isValid, setIsValid] = React.useState(false);
    const [touched, setTouched] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const debounceTimerRef = React.useRef<NodeJS.Timeout>();
    
    // Validate value
    const validate = React.useCallback(
      async (value: string, trigger: 'change' | 'blur' | 'submit') => {
        // Filter rules by trigger
        const rules = validationRules.filter(
          (rule) => !rule.trigger || rule.trigger === trigger
        );
        
        if (rules.length === 0) return;
        
        setIsValidating(true);
        
        try {
          for (const rule of rules) {
            const result = await rule.validator(value);
            if (result) {
              // Validation failed
              setError(result);
              setIsValid(false);
              onValidationChange?.(false, result);
              setIsValidating(false);
              return;
            }
          }
          
          // All validations passed
          setError(null);
          setIsValid(true);
          onValidationChange?.(true, null);
        } catch (err) {
          setError('Validation error');
          setIsValid(false);
          onValidationChange?.(false, 'Validation error');
        } finally {
          setIsValidating(false);
        }
      },
      [validationRules, onValidationChange]
    );
    
    // Handle change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(e);
      
      // Clear previous debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Get debounce delay from first 'change' trigger rule
      const changeRule = validationRules.find((rule) => rule.trigger === 'change');
      const debounce = changeRule?.debounce || 300;
      
      // Debounced validation
      debounceTimerRef.current = setTimeout(() => {
        validate(newValue, 'change');
      }, debounce);
    };
    
    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      onBlur?.(e);
      validate(e.target.value, 'blur');
    };
    
    // Cleanup debounce on unmount
    React.useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);
    
    // Determine state
    const state = error && touched ? 'error' : isValid && touched && showSuccess ? 'success' : 'default';
    
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
      state === 'error' && 'border-2 border-[var(--error)] focus:ring-2 focus:ring-[var(--error)]/20',
      state === 'success' && 'border-2 border-[var(--success)] focus:ring-2 focus:ring-[var(--success)]/20',
      state === 'default' && 'focus:border-primary focus:ring-2 focus:ring-primary/20',
      
      // With icons
      leftIcon && 'pl-9',
      (showValidationIcon && (isValidating || error || isValid)) && 'pr-9',
      
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
    
    // Validation icon
    const validationIcon = isValidating ? (
      <Loader2 className="w-4 h-4 animate-spin text-primary" />
    ) : error && touched ? (
      <XCircle className="w-4 h-4 text-[var(--error)]" />
    ) : isValid && touched && showSuccess ? (
      <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
    ) : null;
    
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
            className={inputClasses}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={state === 'error'}
            aria-describedby={error || helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
          
          {/* Validation Icon */}
          {showValidationIcon && validationIcon && (
            <span className={cn(iconClasses, 'right-3')}>
              {validationIcon}
            </span>
          )}
        </div>
        
        {/* Helper Text / Error */}
        {(error || helperText) && touched && (
          <p
            id={`${props.id}-helper`}
            className={cn(
              'text-xs mt-1.5 flex items-center gap-1',
              state === 'error' && 'text-[var(--error)]',
              state === 'success' && 'text-[var(--success)]',
              state === 'default' && 'text-muted-foreground'
            )}
          >
            {error && state === 'error' && <AlertCircle className="w-3 h-3" />}
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";

export { ValidatedInput };
