import * as React from "react";
import { cn } from "./utils";
import { X, Plus } from "lucide-react";

/* ============================================================
 * TAGS INPUT PROPS
 * ============================================================
 * Multi-tag input component with autocomplete support
 */

export interface Tag {
  /**
   * Tag value (unique)
   */
  value: string;
  
  /**
   * Tag label (display text)
   */
  label: string;
  
  /**
   * Tag color/variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export interface TagsInputProps {
  /**
   * Selected tags
   */
  value?: Tag[];
  
  /**
   * Default tags (uncontrolled)
   */
  defaultValue?: Tag[];
  
  /**
   * Available tag suggestions
   */
  suggestions?: Tag[];
  
  /**
   * Placeholder text
   * @default 'Add tags...'
   */
  placeholder?: string;
  
  /**
   * Input variant
   * @default 'default'
   */
  variant?: 'default' | 'filled' | 'outlined';
  
  /**
   * Input size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Maximum tags allowed
   */
  maxTags?: number;
  
  /**
   * Allow creating new tags
   * @default true
   */
  allowCreate?: boolean;
  
  /**
   * Allow duplicates
   * @default false
   */
  allowDuplicates?: boolean;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Separator characters (Enter, comma, etc.)
   * @default [',', 'Enter']
   */
  separators?: string[];
  
  /**
   * Validate tag before adding
   */
  validateTag?: (tag: string) => boolean | string;
  
  /**
   * Change callback
   */
  onChange?: (tags: Tag[]) => void;
  
  /**
   * Tag add callback
   */
  onTagAdd?: (tag: Tag) => void;
  
  /**
   * Tag remove callback
   */
  onTagRemove?: (tag: Tag) => void;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Error message
   */
  error?: string;
}

/* ============================================================
 * TAG VARIANT STYLES
 * ============================================================ */

const tagVariants = {
  default: 'bg-[var(--muted)] text-foreground hover:bg-[var(--neutral-200)] dark:hover:bg-[var(--neutral-700)]',
  primary: 'bg-primary/10 text-primary hover:bg-primary/20',
  success: 'bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20',
  warning: 'bg-[var(--warning)]/10 text-[var(--warning)] hover:bg-[var(--warning)]/20',
  error: 'bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20',
  info: 'bg-[var(--info)]/10 text-[var(--info)] hover:bg-[var(--info)]/20',
};

/* ============================================================
 * CONTAINER VARIANT STYLES
 * ============================================================ */

const containerVariants = {
  default: 'border border-border bg-background',
  filled: 'border-0 bg-[var(--muted)]',
  outlined: 'border-2 border-border bg-transparent',
};

/* ============================================================
 * SIZE STYLES
 * ============================================================ */

const sizeStyles = {
  sm: {
    container: 'min-h-8 px-2 py-1 text-sm rounded-md gap-1',
    tag: 'h-5 px-1.5 text-xs rounded',
    input: 'h-5 text-sm',
  },
  md: {
    container: 'min-h-10 px-2.5 py-1.5 text-base rounded-lg gap-1.5',
    tag: 'h-6 px-2 text-xs rounded-md',
    input: 'h-6 text-base',
  },
  lg: {
    container: 'min-h-12 px-3 py-2 text-lg rounded-lg gap-2',
    tag: 'h-7 px-2.5 text-sm rounded-md',
    input: 'h-7 text-lg',
  },
};

/* ============================================================
 * TAG COMPONENT
 * ============================================================ */

interface TagChipProps {
  tag: Tag;
  size: keyof typeof sizeStyles;
  onRemove: () => void;
  disabled?: boolean;
}

const TagChip: React.FC<TagChipProps> = ({ tag, size, onRemove, disabled }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium transition-colors',
        sizeStyles[size].tag,
        tagVariants[tag.variant || 'default'],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span className="truncate max-w-[150px]">{tag.label}</span>
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label={`Remove ${tag.label}`}
        >
          <X className={cn(size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
        </button>
      )}
    </span>
  );
};

/* ============================================================
 * TAGS INPUT COMPONENT
 * ============================================================ */

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  (
    {
      value: valueProp,
      defaultValue = [],
      suggestions = [],
      placeholder = 'Add tags...',
      variant = 'default',
      size = 'md',
      maxTags,
      allowCreate = true,
      allowDuplicates = false,
      disabled = false,
      fullWidth = false,
      separators = [',', 'Enter'],
      validateTag,
      onChange,
      onTagAdd,
      onTagRemove,
      className,
      helperText,
      error,
    },
    ref
  ) => {
    const [tags, setTags] = React.useState<Tag[]>(valueProp || defaultValue);
    const [inputValue, setInputValue] = React.useState('');
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [validationError, setValidationError] = React.useState<string | null>(null);
    
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    
    const isControlled = valueProp !== undefined;
    const currentTags = isControlled ? valueProp : tags;
    
    // Filter suggestions
    const filteredSuggestions = React.useMemo(() => {
      if (!inputValue) return [];
      
      const existingValues = currentTags.map((t) => t.value);
      const query = inputValue.toLowerCase();
      
      return suggestions.filter(
        (s) =>
          s.label.toLowerCase().includes(query) &&
          (allowDuplicates || !existingValues.includes(s.value))
      );
    }, [inputValue, suggestions, currentTags, allowDuplicates]);
    
    // Add tag
    const addTag = React.useCallback(
      (tag: Tag | string) => {
        // Create tag object if string
        const newTag: Tag = typeof tag === 'string'
          ? { value: tag, label: tag, variant: 'default' }
          : tag;
        
        // Validate
        if (validateTag) {
          const validation = validateTag(newTag.value);
          if (validation !== true) {
            setValidationError(typeof validation === 'string' ? validation : 'Invalid tag');
            return;
          }
        }
        
        // Check max tags
        if (maxTags && currentTags.length >= maxTags) {
          setValidationError(`Maximum ${maxTags} tags allowed`);
          return;
        }
        
        // Check duplicates
        if (!allowDuplicates && currentTags.some((t) => t.value === newTag.value)) {
          setValidationError('Tag already exists');
          return;
        }
        
        // Add tag
        const updatedTags = [...currentTags, newTag];
        
        if (!isControlled) {
          setTags(updatedTags);
        }
        
        onChange?.(updatedTags);
        onTagAdd?.(newTag);
        
        // Reset input
        setInputValue('');
        setValidationError(null);
        setShowSuggestions(false);
      },
      [currentTags, maxTags, allowDuplicates, validateTag, isControlled, onChange, onTagAdd]
    );
    
    // Remove tag
    const removeTag = React.useCallback(
      (tagToRemove: Tag) => {
        const updatedTags = currentTags.filter((t) => t.value !== tagToRemove.value);
        
        if (!isControlled) {
          setTags(updatedTags);
        }
        
        onChange?.(updatedTags);
        onTagRemove?.(tagToRemove);
      },
      [currentTags, isControlled, onChange, onTagRemove]
    );
    
    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // Check for separator in value
      const hasSeparator = separators.some((sep) => sep !== 'Enter' && value.includes(sep));
      
      if (hasSeparator) {
        // Extract tag before separator
        const separator = separators.find((sep) => sep !== 'Enter' && value.includes(sep));
        const parts = value.split(separator!);
        const tagValue = parts[0].trim();
        
        if (tagValue && allowCreate) {
          addTag(tagValue);
        }
        
        // Keep remaining text
        setInputValue(parts.slice(1).join(separator!));
      } else {
        setInputValue(value);
        setShowSuggestions(value.length > 0);
        setValidationError(null);
      }
    };
    
    // Handle key down
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && separators.includes('Enter')) {
        e.preventDefault();
        
        if (inputValue.trim()) {
          if (filteredSuggestions.length > 0) {
            // Select first suggestion
            addTag(filteredSuggestions[0]);
          } else if (allowCreate) {
            // Create new tag
            addTag(inputValue.trim());
          }
        }
      } else if (e.key === 'Backspace' && !inputValue && currentTags.length > 0) {
        // Remove last tag
        removeTag(currentTags[currentTags.length - 1]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setValidationError(null);
      }
    };
    
    // Handle suggestion click
    const handleSuggestionClick = (suggestion: Tag) => {
      addTag(suggestion);
      inputRef.current?.focus();
    };
    
    // Click outside to close suggestions
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setShowSuggestions(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Focus container
    const handleContainerClick = () => {
      inputRef.current?.focus();
    };
    
    // Build container classes
    const containerClasses = cn(
      'flex flex-wrap items-center cursor-text transition-colors duration-200',
      containerVariants[variant],
      sizeStyles[size].container,
      !disabled && 'hover:border-[var(--neutral-400)]',
      !disabled && 'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
      error && 'border-2 border-[var(--error)] focus-within:ring-[var(--error)]/20',
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      fullWidth ? 'w-full' : 'w-auto',
      className
    );
    
    return (
      <div className={fullWidth ? 'w-full' : 'w-auto'} ref={containerRef}>
        {/* Tags Container */}
        <div className={containerClasses} onClick={handleContainerClick}>
          {/* Render Tags */}
          {currentTags.map((tag) => (
            <TagChip
              key={tag.value}
              tag={tag}
              size={size}
              onRemove={() => removeTag(tag)}
              disabled={disabled}
            />
          ))}
          
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
            className={cn(
              'flex-1 min-w-[120px] bg-transparent outline-none',
              'text-foreground placeholder:text-muted-foreground',
              sizeStyles[size].input
            )}
            value={inputValue}
            placeholder={currentTags.length === 0 ? placeholder : undefined}
            disabled={disabled}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
          />
          
          {/* Add Icon (when maxTags not reached) */}
          {!maxTags || currentTags.length < maxTags ? (
            <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          ) : null}
        </div>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
          <div className="relative">
            <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion.value}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--muted)] transition-colors"
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      suggestion.variant === 'primary' && 'bg-primary',
                      suggestion.variant === 'success' && 'bg-[var(--success)]',
                      suggestion.variant === 'warning' && 'bg-[var(--warning)]',
                      suggestion.variant === 'error' && 'bg-[var(--error)]',
                      suggestion.variant === 'info' && 'bg-[var(--info)]',
                      (!suggestion.variant || suggestion.variant === 'default') && 'bg-[var(--muted-foreground)]'
                    )}
                  />
                  <span className="text-sm text-foreground">{suggestion.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Helper Text / Error / Validation Error */}
        {(error || validationError || helperText) && (
          <p
            className={cn(
              'text-xs mt-1.5',
              (error || validationError) ? 'text-[var(--error)]' : 'text-muted-foreground'
            )}
          >
            {error || validationError || helperText}
          </p>
        )}
      </div>
    );
  }
);

TagsInput.displayName = "TagsInput";

export { TagsInput };
