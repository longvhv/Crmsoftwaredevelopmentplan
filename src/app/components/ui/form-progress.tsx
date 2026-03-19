import * as React from "react";
import { cn } from "./utils";
import { Check } from "lucide-react";

/* ============================================================
 * FORM PROGRESS PROPS
 * ============================================================
 * Standalone form progress indicator component
 * Shows completion percentage and individual field status
 */

export interface FormField {
  /**
   * Field unique ID
   */
  id: string;
  
  /**
   * Field label/name
   */
  label: string;
  
  /**
   * Whether field is completed
   */
  completed: boolean;
  
  /**
   * Whether field is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Field group (for grouping related fields)
   */
  group?: string;
}

export interface FormProgressProps {
  /**
   * Array of form fields
   */
  fields: FormField[];
  
  /**
   * Variant style
   * @default 'default'
   */
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  
  /**
   * Show percentage text
   * @default true
   */
  showPercentage?: boolean;
  
  /**
   * Show field list
   * @default false
   */
  showFieldList?: boolean;
  
  /**
   * Show only required fields
   * @default false
   */
  showOnlyRequired?: boolean;
  
  /**
   * Color scheme
   * @default 'primary'
   */
  colorScheme?: 'primary' | 'success' | 'warning' | 'info';
  
  /**
   * Progress bar height
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Callback when field is clicked
   */
  onFieldClick?: (fieldId: string) => void;
}

/* ============================================================
 * COLOR SCHEME STYLES
 * ============================================================ */

const colorSchemes = {
  primary: {
    bar: 'bg-primary',
    text: 'text-primary',
    bg: 'bg-primary/10',
    icon: 'bg-primary text-white',
  },
  success: {
    bar: 'bg-[var(--success)]',
    text: 'text-[var(--success)]',
    bg: 'bg-[var(--success)]/10',
    icon: 'bg-[var(--success)] text-white',
  },
  warning: {
    bar: 'bg-[var(--warning)]',
    text: 'text-[var(--warning)]',
    bg: 'bg-[var(--warning)]/10',
    icon: 'bg-[var(--warning)] text-white',
  },
  info: {
    bar: 'bg-[var(--info)]',
    text: 'text-[var(--info)]',
    bg: 'bg-[var(--info)]/10',
    icon: 'bg-[var(--info)] text-white',
  },
};

/* ============================================================
 * SIZE STYLES
 * ============================================================ */

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

/* ============================================================
 * PROGRESS BAR COMPONENT
 * ============================================================ */

interface ProgressBarProps {
  percentage: number;
  colorScheme: keyof typeof colorSchemes;
  size: keyof typeof sizeStyles;
  showPercentage: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  colorScheme,
  size,
  showPercentage,
}) => {
  const colors = colorSchemes[colorScheme];
  
  return (
    <div className="w-full">
      {/* Progress Info */}
      {showPercentage && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Form Progress
          </span>
          <span className={cn("text-sm font-semibold", colors.text)}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className={cn("w-full bg-[var(--muted)] rounded-full overflow-hidden", sizeStyles[size])}>
        <div
          className={cn(colors.bar, "h-full transition-all duration-500 ease-out rounded-full")}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

/* ============================================================
 * FIELD LIST COMPONENT
 * ============================================================ */

interface FieldListProps {
  fields: FormField[];
  colorScheme: keyof typeof colorSchemes;
  showOnlyRequired: boolean;
  onFieldClick?: (fieldId: string) => void;
}

const FieldList: React.FC<FieldListProps> = ({
  fields,
  colorScheme,
  showOnlyRequired,
  onFieldClick,
}) => {
  const colors = colorSchemes[colorScheme];
  
  // Filter fields
  const displayFields = showOnlyRequired
    ? fields.filter((f) => f.required)
    : fields;
  
  // Group fields if groups exist
  const hasGroups = displayFields.some((f) => f.group);
  const groupedFields = hasGroups
    ? displayFields.reduce((acc, field) => {
        const group = field.group || 'Other';
        if (!acc[group]) acc[group] = [];
        acc[group].push(field);
        return acc;
      }, {} as Record<string, FormField[]>)
    : { 'All Fields': displayFields };
  
  return (
    <div className="mt-4 space-y-4">
      {Object.entries(groupedFields).map(([group, groupFields]) => (
        <div key={group}>
          {hasGroups && (
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {group}
            </h4>
          )}
          <div className="space-y-2">
            {groupFields.map((field) => (
              <button
                key={field.id}
                type="button"
                onClick={() => onFieldClick?.(field.id)}
                className={cn(
                  'flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg transition-colors',
                  onFieldClick && 'hover:bg-[var(--muted)] cursor-pointer',
                  !onFieldClick && 'cursor-default'
                )}
              >
                {/* Checkbox/Check Icon */}
                <div
                  className={cn(
                    'flex items-center justify-center w-5 h-5 rounded transition-colors',
                    field.completed
                      ? cn(colors.icon, 'ring-2', colors.bg.replace('/10', '/20'))
                      : 'border-2 border-[var(--border)] bg-background'
                  )}
                >
                  {field.completed && <Check className="w-3 h-3" />}
                </div>
                
                {/* Field Label */}
                <span
                  className={cn(
                    'text-sm transition-colors',
                    field.completed
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  )}
                >
                  {field.label}
                  {field.required && (
                    <span className="text-[var(--error)] ml-1">*</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
 * FORM PROGRESS COMPONENT
 * ============================================================ */

const FormProgress: React.FC<FormProgressProps> = ({
  fields,
  variant = 'default',
  showPercentage = true,
  showFieldList = false,
  showOnlyRequired = false,
  colorScheme = 'primary',
  size = 'md',
  className,
  onFieldClick,
}) => {
  // Calculate completion percentage
  const relevantFields = showOnlyRequired
    ? fields.filter((f) => f.required)
    : fields;
  
  const completedCount = relevantFields.filter((f) => f.completed).length;
  const totalCount = relevantFields.length;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Variant-specific rendering
  if (variant === 'compact') {
    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        <div className="w-24 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
          <div
            className={cn(colorSchemes[colorScheme].bar, 'h-full transition-all duration-500 rounded-full')}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={cn('text-xs font-medium', colorSchemes[colorScheme].text)}>
          {completedCount}/{totalCount}
        </span>
      </div>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <span className="text-muted-foreground">Progress:</span>
        <span className={cn('font-semibold', colorSchemes[colorScheme].text)}>
          {Math.round(percentage)}%
        </span>
        <span className="text-muted-foreground">
          ({completedCount}/{totalCount} fields)
        </span>
      </div>
    );
  }
  
  if (variant === 'detailed') {
    return (
      <div className={cn('space-y-4', className)}>
        {/* Header Stats */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Form Completion</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedCount} of {totalCount} fields completed
            </p>
          </div>
          <div className={cn('text-2xl font-bold', colorSchemes[colorScheme].text)}>
            {Math.round(percentage)}%
          </div>
        </div>
        
        {/* Progress Bar */}
        <ProgressBar
          percentage={percentage}
          colorScheme={colorScheme}
          size={size}
          showPercentage={false}
        />
        
        {/* Field List */}
        {showFieldList && (
          <FieldList
            fields={fields}
            colorScheme={colorScheme}
            showOnlyRequired={showOnlyRequired}
            onFieldClick={onFieldClick}
          />
        )}
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={cn('space-y-3', className)}>
      {/* Progress Bar */}
      <ProgressBar
        percentage={percentage}
        colorScheme={colorScheme}
        size={size}
        showPercentage={showPercentage}
      />
      
      {/* Completion Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {completedCount} of {totalCount} fields completed
        </span>
        {showOnlyRequired && (
          <span className="text-[var(--error)]">* Required only</span>
        )}
      </div>
      
      {/* Field List */}
      {showFieldList && (
        <FieldList
          fields={fields}
          colorScheme={colorScheme}
          showOnlyRequired={showOnlyRequired}
          onFieldClick={onFieldClick}
        />
      )}
    </div>
  );
};

/* ============================================================
 * HOOK: useFormProgress
 * ============================================================
 * Custom hook to manage form progress state
 */

export interface UseFormProgressOptions {
  /**
   * Initial field completion state
   */
  initialFields?: Record<string, boolean>;
  
  /**
   * Callback when field completion changes
   */
  onChange?: (fieldId: string, completed: boolean, allFields: Record<string, boolean>) => void;
}

export function useFormProgress(
  fieldDefinitions: Array<{ id: string; label: string; required?: boolean; group?: string }>,
  options: UseFormProgressOptions = {}
) {
  const [completedFields, setCompletedFields] = React.useState<Record<string, boolean>>(
    options.initialFields || {}
  );
  
  const setFieldCompleted = React.useCallback(
    (fieldId: string, completed: boolean) => {
      setCompletedFields((prev) => {
        const newState = { ...prev, [fieldId]: completed };
        options.onChange?.(fieldId, completed, newState);
        return newState;
      });
    },
    [options]
  );
  
  const fields: FormField[] = fieldDefinitions.map((def) => ({
    id: def.id,
    label: def.label,
    completed: completedFields[def.id] || false,
    required: def.required,
    group: def.group,
  }));
  
  const completedCount = fields.filter((f) => f.completed).length;
  const totalCount = fields.length;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  return {
    fields,
    completedFields,
    setFieldCompleted,
    completedCount,
    totalCount,
    percentage,
    isComplete: completedCount === totalCount,
  };
}

export { FormProgress };
