import * as React from "react";
import { cn } from "./utils";
import { Check, ChevronDown, X } from "lucide-react";

/* ============================================================
 * MULTI-SELECT PROPS
 * ============================================================
 * Multi-select dropdown with chips display
 */

export interface MultiSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface MultiSelectProps {
  /**
   * Selected values
   */
  value?: string[];
  
  /**
   * Default values (uncontrolled)
   */
  defaultValue?: string[];
  
  /**
   * Available options
   */
  options: MultiSelectOption[];
  
  /**
   * Placeholder text
   * @default 'Select options...'
   */
  placeholder?: string;
  
  /**
   * Search placeholder
   * @default 'Search...'
   */
  searchPlaceholder?: string;
  
  /**
   * Enable search/filter
   * @default true
   */
  searchable?: boolean;
  
  /**
   * Maximum number of selections
   */
  maxSelections?: number;
  
  /**
   * Display mode for selected items
   * @default 'chips'
   */
  displayMode?: 'chips' | 'count' | 'comma';
  
  /**
   * Maximum chips to display before showing count
   * @default 3
   */
  maxChipsDisplay?: number;
  
  /**
   * Chip variant
   * @default 'default'
   */
  chipVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  
  /**
   * Allow clearing all selections
   * @default true
   */
  clearable?: boolean;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Change callback
   */
  onChange?: (values: string[]) => void;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
}

/* ============================================================
 * SIZE STYLES
 * ============================================================ */

const sizeStyles = {
  sm: {
    container: 'min-h-[32px] text-sm',
    chip: 'px-2 py-0.5 text-xs',
    dropdown: 'text-sm',
  },
  md: {
    container: 'min-h-[40px] text-base',
    chip: 'px-2.5 py-1 text-sm',
    dropdown: 'text-base',
  },
  lg: {
    container: 'min-h-[48px] text-lg',
    chip: 'px-3 py-1.5 text-base',
    dropdown: 'text-lg',
  },
};

/* ============================================================
 * CHIP VARIANT STYLES
 * ============================================================ */

const chipVariantStyles = {
  default: 'bg-[var(--muted)] text-foreground hover:bg-[var(--muted)]/80',
  primary: 'bg-primary/10 text-primary hover:bg-primary/20',
  success: 'bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20',
  warning: 'bg-[var(--warning)]/10 text-[var(--warning)] hover:bg-[var(--warning)]/20',
  error: 'bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20',
};

/* ============================================================
 * CHIP COMPONENT
 * ============================================================ */

interface ChipProps {
  label: string;
  onRemove: () => void;
  variant: MultiSelectProps['chipVariant'];
  size: MultiSelectProps['size'];
  disabled?: boolean;
}

const Chip: React.FC<ChipProps> = ({ label, onRemove, variant = 'default', size = 'md', disabled }) => {
  const styles = sizeStyles[size!];
  const variantStyle = chipVariantStyles[variant!];
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full transition-colors',
        styles.chip,
        variantStyle,
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span className="truncate max-w-[150px]">{label}</span>
      {!disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

/* ============================================================
 * MULTI-SELECT COMPONENT
 * ============================================================ */

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      value: valueProp,
      defaultValue = [],
      options,
      placeholder = 'Select options...',
      searchPlaceholder = 'Search...',
      searchable = true,
      maxSelections,
      displayMode = 'chips',
      maxChipsDisplay = 3,
      chipVariant = 'default',
      clearable = true,
      disabled = false,
      size = 'md',
      onChange,
      className,
      error,
      helperText,
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(valueProp || defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);
    
    const isControlled = valueProp !== undefined;
    const currentValues = isControlled ? valueProp : selectedValues;
    
    // Filter options based on search
    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      
      const query = searchQuery.toLowerCase();
      return options.filter((option) =>
        option.label.toLowerCase().includes(query) ||
        option.description?.toLowerCase().includes(query)
      );
    }, [options, searchQuery]);
    
    // Get selected options
    const selectedOptions = React.useMemo(() => {
      return options.filter((option) => currentValues.includes(option.value));
    }, [options, currentValues]);
    
    // Update values
    const updateValues = (newValues: string[]) => {
      if (disabled) return;
      
      if (!isControlled) {
        setSelectedValues(newValues);
      }
      
      onChange?.(newValues);
    };
    
    // Toggle option
    const toggleOption = (value: string) => {
      if (disabled) return;
      
      const isSelected = currentValues.includes(value);
      
      if (isSelected) {
        // Remove
        updateValues(currentValues.filter((v) => v !== value));
      } else {
        // Add (check max selections)
        if (maxSelections && currentValues.length >= maxSelections) {
          return;
        }
        updateValues([...currentValues, value]);
      }
    };
    
    // Remove option
    const removeOption = (value: string) => {
      updateValues(currentValues.filter((v) => v !== value));
    };
    
    // Clear all
    const clearAll = () => {
      updateValues([]);
    };
    
    // Handle dropdown open
    const handleOpen = () => {
      if (disabled) return;
      setIsOpen(true);
      setSearchQuery('');
      
      // Focus search input
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
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
    
    // Render display value
    const renderDisplayValue = () => {
      if (currentValues.length === 0) {
        return <span className="text-muted-foreground">{placeholder}</span>;
      }
      
      if (displayMode === 'count') {
        return (
          <span>
            {currentValues.length} selected
          </span>
        );
      }
      
      if (displayMode === 'comma') {
        const labels = selectedOptions.map((opt) => opt.label).join(', ');
        return <span className="truncate">{labels}</span>;
      }
      
      // Chips mode
      const visibleChips = selectedOptions.slice(0, maxChipsDisplay);
      const remainingCount = selectedOptions.length - maxChipsDisplay;
      
      return (
        <div className="flex items-center gap-1 flex-wrap">
          {visibleChips.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              onRemove={() => removeOption(option.value)}
              variant={chipVariant}
              size={size}
              disabled={disabled}
            />
          ))}
          {remainingCount > 0 && (
            <span className="text-sm text-muted-foreground">
              +{remainingCount} more
            </span>
          )}
        </div>
      );
    };
    
    const styles = sizeStyles[size];
    
    return (
      <div ref={ref} className={cn('relative w-full', className)}>
        {/* Trigger */}
        <div
          ref={containerRef}
          onClick={handleOpen}
          className={cn(
            'w-full px-3 py-2 rounded-lg border transition-all cursor-pointer',
            'focus-within:outline-none focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-[var(--error)]' : 'border-border',
            'bg-background',
            styles.container
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              {renderDisplayValue()}
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {clearable && currentValues.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  className="p-1 hover:bg-[var(--muted)] rounded transition-colors"
                  aria-label="Clear all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <ChevronDown className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                isOpen && 'rotate-180'
              )} />
            </div>
          </div>
        </div>
        
        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-xl max-h-[300px] overflow-hidden flex flex-col">
            {/* Search */}
            {searchable && (
              <div className="p-2 border-b border-border">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg border border-border',
                    'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
                    'bg-background',
                    styles.dropdown
                  )}
                />
              </div>
            )}
            
            {/* Options List */}
            <div className="overflow-y-auto flex-1">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = currentValues.includes(option.value);
                  const isMaxReached = maxSelections && currentValues.length >= maxSelections && !isSelected;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleOption(option.value)}
                      disabled={option.disabled || isMaxReached}
                      className={cn(
                        'w-full px-3 py-2 text-left transition-colors flex items-center gap-3',
                        'hover:bg-[var(--muted)] focus:outline-none focus:bg-[var(--muted)]',
                        isSelected && 'bg-primary/5',
                        (option.disabled || isMaxReached) && 'opacity-50 cursor-not-allowed',
                        styles.dropdown
                      )}
                    >
                      {/* Checkbox indicator */}
                      <div className={cn(
                        'w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0',
                        isSelected ? 'bg-primary border-primary' : 'border-border'
                      )}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      
                      {/* Icon */}
                      {option.icon && (
                        <span className="flex-shrink-0">{option.icon}</span>
                      )}
                      
                      {/* Label & Description */}
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            
            {/* Footer */}
            {maxSelections && (
              <div className="p-2 border-t border-border text-xs text-muted-foreground text-center">
                {currentValues.length} / {maxSelections} selected
              </div>
            )}
          </div>
        )}
        
        {/* Helper / Error */}
        {(error || helperText) && (
          <p className={cn(
            'text-xs mt-1',
            error ? 'text-[var(--error)]' : 'text-muted-foreground'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
