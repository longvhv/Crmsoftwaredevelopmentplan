import * as React from "react";
import { cn } from "./utils";
import { AlertCircle, CheckCircle, Info, Loader } from "lucide-react";

/* ============================================================
 * FORM FIELD PROPS
 * ============================================================
 * Complete form field with label, validation, helper text, and error
 * Wraps any form control (input, select, textarea, etc.)
 */

export interface FormFieldProps {
  /**
   * Field label
   */
  label?: string;
  
  /**
   * Field name/id
   */
  name: string;
  
  /**
   * Required field indicator
   * @default false
   */
  required?: boolean;
  
  /**
   * Helper text (shown below field)
   */
  helperText?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Success message
   */
  success?: string;
  
  /**
   * Warning message
   */
  warning?: string;
  
  /**
   * Info message
   */
  info?: string;
  
  /**
   * Validation state
   * @default 'idle'
   */
  validationState?: 'idle' | 'validating' | 'valid' | 'invalid';
  
  /**
   * Show validation icon
   * @default true
   */
  showValidationIcon?: boolean;
  
  /**
   * Label position
   * @default 'top'
   */
  labelPosition?: 'top' | 'left' | 'inline';
  
  /**
   * Field size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Character counter (max length)
   */
  maxLength?: number;
  
  /**
   * Current character count
   */
  characterCount?: number;
  
  /**
   * Show character counter
   * @default false
   */
  showCharacterCount?: boolean;
  
  /**
   * Tooltip text (shown on label hover)
   */
  tooltip?: string;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Custom label className
   */
  labelClassName?: string;
  
  /**
   * Children (the actual form control)
   */
  children: React.ReactNode;
}

/* ============================================================
 * SIZE STYLES
 * ============================================================ */

const sizeStyles = {
  sm: {
    label: 'text-xs',
    message: 'text-xs',
  },
  md: {
    label: 'text-sm',
    message: 'text-xs',
  },
  lg: {
    label: 'text-base',
    message: 'text-sm',
  },
};

/* ============================================================
 * VALIDATION ICON
 * ============================================================ */

interface ValidationIconProps {
  state: FormFieldProps['validationState'];
}

const ValidationIcon: React.FC<ValidationIconProps> = ({ state }) => {
  switch (state) {
    case 'validating':
      return <Loader className="w-4 h-4 text-muted-foreground animate-spin" />;
    case 'valid':
      return <CheckCircle className="w-4 h-4 text-[var(--success)]" />;
    case 'invalid':
      return <AlertCircle className="w-4 h-4 text-[var(--error)]" />;
    default:
      return null;
  }
};

/* ============================================================
 * MESSAGE COMPONENT
 * ============================================================ */

interface MessageProps {
  type: 'error' | 'success' | 'warning' | 'info' | 'helper';
  message: string;
  className?: string;
}

const Message: React.FC<MessageProps> = ({ type, message, className }) => {
  const icons = {
    error: <AlertCircle className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />,
    warning: <AlertCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
    helper: null,
  };
  
  const colors = {
    error: 'text-[var(--error)]',
    success: 'text-[var(--success)]',
    warning: 'text-[var(--warning)]',
    info: 'text-[var(--info)]',
    helper: 'text-muted-foreground',
  };
  
  return (
    <div className={cn('flex items-start gap-1.5 mt-1.5', colors[type], className)}>
      {icons[type]}
      <span className="flex-1">{message}</span>
    </div>
  );
};

/* ============================================================
 * FORM FIELD COMPONENT
 * ============================================================ */

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      name,
      required = false,
      helperText,
      error,
      success,
      warning,
      info,
      validationState = 'idle',
      showValidationIcon = true,
      labelPosition = 'top',
      size = 'md',
      disabled = false,
      maxLength,
      characterCount,
      showCharacterCount = false,
      tooltip,
      className,
      labelClassName,
      children,
    },
    ref
  ) => {
    const styles = sizeStyles[size];
    
    // Determine actual validation state from props
    const actualValidationState = React.useMemo(() => {
      if (error) return 'invalid';
      if (success) return 'valid';
      return validationState;
    }, [error, success, validationState]);
    
    // Character count color
    const characterCountColor = React.useMemo(() => {
      if (!maxLength || characterCount === undefined) return 'text-muted-foreground';
      
      const percentage = (characterCount / maxLength) * 100;
      
      if (percentage >= 100) return 'text-[var(--error)]';
      if (percentage >= 90) return 'text-[var(--warning)]';
      return 'text-muted-foreground';
    }, [characterCount, maxLength]);
    
    // Label element
    const labelElement = label && (
      <label
        htmlFor={name}
        className={cn(
          'font-medium',
          styles.label,
          disabled && 'opacity-50',
          labelPosition === 'left' && 'self-start pt-2',
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-[var(--error)] ml-1">*</span>}
        {tooltip && (
          <span
            className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--muted)] text-xs cursor-help"
            title={tooltip}
          >
            ?
          </span>
        )}
      </label>
    );
    
    // Field wrapper
    const fieldWrapper = (
      <div className="relative flex-1">
        {children}
        
        {/* Validation Icon (positioned absolutely inside field) */}
        {showValidationIcon && actualValidationState !== 'idle' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ValidationIcon state={actualValidationState} />
          </div>
        )}
      </div>
    );
    
    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          labelPosition === 'left' && 'flex items-center gap-4',
          labelPosition === 'inline' && 'flex items-center gap-2',
          className
        )}
      >
        {/* Label */}
        {labelPosition !== 'inline' && labelElement}
        
        {/* Field + Messages Container */}
        <div className="flex-1 min-w-0">
          {/* Inline Label + Field */}
          {labelPosition === 'inline' ? (
            <div className="flex items-center gap-2">
              {labelElement}
              {fieldWrapper}
            </div>
          ) : (
            fieldWrapper
          )}
          
          {/* Messages */}
          <div className={cn('space-y-1', styles.message)}>
            {/* Error Message */}
            {error && <Message type="error" message={error} />}
            
            {/* Success Message */}
            {!error && success && <Message type="success" message={success} />}
            
            {/* Warning Message */}
            {!error && !success && warning && <Message type="warning" message={warning} />}
            
            {/* Info Message */}
            {!error && !success && !warning && info && <Message type="info" message={info} />}
            
            {/* Helper Text */}
            {!error && !success && !warning && !info && helperText && (
              <Message type="helper" message={helperText} />
            )}
            
            {/* Character Count */}
            {showCharacterCount && maxLength && characterCount !== undefined && (
              <div className={cn('text-right', characterCountColor)}>
                {characterCount} / {maxLength}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

FormField.displayName = "FormField";

/* ============================================================
 * FORM FIELD GROUP (Multiple fields in a row)
 * ============================================================ */

export interface FormFieldGroupProps {
  /**
   * Number of columns
   * @default 2
   */
  columns?: 1 | 2 | 3 | 4;
  
  /**
   * Gap between fields
   * @default 'md'
   */
  gap?: 'sm' | 'md' | 'lg';
  
  /**
   * Responsive behavior
   * @default true (stack on mobile)
   */
  responsive?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Children (FormField components)
   */
  children: React.ReactNode;
}

const FormFieldGroup = React.forwardRef<HTMLDivElement, FormFieldGroupProps>(
  (
    {
      columns = 2,
      gap = 'md',
      responsive = true,
      className,
      children,
    },
    ref
  ) => {
    const gapStyles = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    };
    
    const columnStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          responsive ? columnStyles[columns] : `grid-cols-${columns}`,
          gapStyles[gap],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

FormFieldGroup.displayName = "FormFieldGroup";

/* ============================================================
 * FORM SECTION (Grouped fields with title)
 * ============================================================ */

export interface FormSectionProps {
  /**
   * Section title
   */
  title?: string;
  
  /**
   * Section description
   */
  description?: string;
  
  /**
   * Collapsible section
   * @default false
   */
  collapsible?: boolean;
  
  /**
   * Initially collapsed
   * @default false
   */
  defaultCollapsed?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Children (FormField or FormFieldGroup components)
   */
  children: React.ReactNode;
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  (
    {
      title,
      description,
      collapsible = false,
      defaultCollapsed = false,
      className,
      children,
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    
    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        {/* Section Header */}
        {(title || description) && (
          <div>
            {title && (
              <button
                type="button"
                onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
                className={cn(
                  'text-lg font-semibold text-foreground',
                  collapsible && 'cursor-pointer hover:text-primary transition-colors'
                )}
              >
                {title}
                {collapsible && (
                  <span className="ml-2 text-muted-foreground">
                    {isCollapsed ? '▼' : '▲'}
                  </span>
                )}
              </button>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        )}
        
        {/* Section Content */}
        {(!collapsible || !isCollapsed) && (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </div>
    );
  }
);

FormSection.displayName = "FormSection";

export { FormField, FormFieldGroup, FormSection };
