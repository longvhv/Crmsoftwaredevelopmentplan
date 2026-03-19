import * as React from "react";
import { cn } from "./utils";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";

/* ============================================================
 * AUTOCOMPLETE PROPS
 * ============================================================
 * Typeahead/Autocomplete input with async search support
 */

export interface AutocompleteOption {
  /**
   * Option value (unique)
   */
  value: string;
  
  /**
   * Option label (display text)
   */
  label: string;
  
  /**
   * Optional description
   */
  description?: string;
  
  /**
   * Optional icon
   */
  icon?: React.ReactNode;
  
  /**
   * Option disabled
   */
  disabled?: boolean;
  
  /**
   * Custom data
   */
  data?: any;
}

export interface AutocompleteProps {
  /**
   * Options array
   */
  options: AutocompleteOption[];
  
  /**
   * Selected value
   */
  value?: string;
  
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;
  
  /**
   * Placeholder text
   * @default 'Search...'
   */
  placeholder?: string;
  
  /**
   * Input variant
   * @default 'default'
   */
  variant?: 'default' | 'filled' | 'outlined' | 'ghost';
  
  /**
   * Input size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Allow clearing selection
   * @default true
   */
  clearable?: boolean;
  
  /**
   * Show search icon
   * @default true
   */
  showSearchIcon?: boolean;
  
  /**
   * Minimum characters to trigger search
   * @default 0
   */
  minSearchLength?: number;
  
  /**
   * Search debounce delay (ms)
   * @default 300
   */
  debounceDelay?: number;
  
  /**
   * Empty state message
   * @default 'No results found'
   */
  emptyMessage?: string;
  
  /**
   * Maximum dropdown height
   * @default '300px'
   */
  maxDropdownHeight?: string;
  
  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Custom filter function
   * If not provided, uses default case-insensitive substring match
   */
  filterFn?: (option: AutocompleteOption, searchQuery: string) => boolean;
  
  /**
   * Async search function
   * Overrides local filtering
   */
  onSearch?: (query: string) => Promise<AutocompleteOption[]>;
  
  /**
   * Change callback
   */
  onChange?: (value: string | null, option: AutocompleteOption | null) => void;
  
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
 * AUTOCOMPLETE COMPONENT
 * ============================================================ */

const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options: optionsProp,
      value: valueProp,
      defaultValue,
      placeholder = 'Search...',
      variant = 'default',
      size = 'md',
      loading: loadingProp = false,
      disabled = false,
      clearable = true,
      showSearchIcon = true,
      minSearchLength = 0,
      debounceDelay = 300,
      emptyMessage = 'No results found',
      maxDropdownHeight = '300px',
      fullWidth = false,
      filterFn,
      onSearch,
      onChange,
      className,
      helperText,
      error,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedValue, setSelectedValue] = React.useState(valueProp || defaultValue || '');
    const [filteredOptions, setFilteredOptions] = React.useState<AutocompleteOption[]>(optionsProp);
    const [isSearching, setIsSearching] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const dropdownRef = React.useRef<HTMLDivElement | null>(null);
    const debounceTimerRef = React.useRef<NodeJS.Timeout>();
    
    const isControlled = valueProp !== undefined;
    const currentValue = isControlled ? valueProp : selectedValue;
    const loading = loadingProp || isSearching;
    
    // Get selected option
    const selectedOption = optionsProp.find((opt) => opt.value === currentValue);
    
    // Default filter function
    const defaultFilter = React.useCallback(
      (option: AutocompleteOption, query: string) => {
        const searchLower = query.toLowerCase();
        return (
          option.label.toLowerCase().includes(searchLower) ||
          option.description?.toLowerCase().includes(searchLower) ||
          option.value.toLowerCase().includes(searchLower)
        );
      },
      []
    );
    
    const filterFunction = filterFn || defaultFilter;
    
    // Handle search
    const performSearch = React.useCallback(
      async (query: string) => {
        if (query.length < minSearchLength) {
          setFilteredOptions(optionsProp);
          return;
        }
        
        if (onSearch) {
          // Async search
          setIsSearching(true);
          try {
            const results = await onSearch(query);
            setFilteredOptions(results);
          } catch (error) {
            console.error('Autocomplete search error:', error);
            setFilteredOptions([]);
          } finally {
            setIsSearching(false);
          }
        } else {
          // Local filtering
          const filtered = optionsProp.filter((opt) => filterFunction(opt, query));
          setFilteredOptions(filtered);
        }
      },
      [optionsProp, onSearch, minSearchLength, filterFunction]
    );
    
    // Debounced search
    React.useEffect(() => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, debounceDelay);
      
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, [searchQuery, performSearch, debounceDelay]);
    
    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      setIsOpen(true);
      setHighlightedIndex(0);
      
      // Clear selection if user types
      if (currentValue && !isControlled) {
        setSelectedValue('');
        onChange?.(null, null);
      }
    };
    
    // Handle option select
    const handleSelectOption = (option: AutocompleteOption) => {
      if (option.disabled) return;
      
      if (!isControlled) {
        setSelectedValue(option.value);
      }
      
      setSearchQuery('');
      setIsOpen(false);
      onChange?.(option.value, option);
      inputRef.current?.blur();
    };
    
    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (!isControlled) {
        setSelectedValue('');
      }
      
      setSearchQuery('');
      setIsOpen(false);
      onChange?.(null, null);
      inputRef.current?.focus();
    };
    
    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          setIsOpen(true);
          e.preventDefault();
        }
        return;
      }
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredOptions[highlightedIndex]) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };
    
    // Click outside to close
    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Scroll highlighted item into view
    React.useEffect(() => {
      if (isOpen && dropdownRef.current) {
        const highlightedElement = dropdownRef.current.querySelector(
          `[data-index="${highlightedIndex}"]`
        );
        highlightedElement?.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightedIndex, isOpen]);
    
    // Determine display value
    const displayValue = isOpen ? searchQuery : selectedOption?.label || searchQuery;
    
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
      sizeStyles[size],
      
      // State
      error && 'border-2 border-[var(--error)] focus:ring-2 focus:ring-[var(--error)]/20',
      !error && 'focus:border-primary focus:ring-2 focus:ring-primary/20',
      
      // With icons
      showSearchIcon && 'pl-9',
      (clearable && currentValue) || loading ? 'pr-9' : 'pr-9',
      
      // Custom classes
      className
    );
    
    const wrapperClasses = cn(
      'relative',
      fullWidth ? 'w-full' : 'w-auto'
    );
    
    return (
      <div className={wrapperClasses}>
        <div className="relative">
          {/* Search Icon */}
          {showSearchIcon && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
            value={displayValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            autoComplete="off"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls="autocomplete-dropdown"
            aria-activedescendant={isOpen ? `option-${highlightedIndex}` : undefined}
          />
          
          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            {!loading && clearable && currentValue && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 hover:bg-[var(--muted)] rounded transition-colors"
                tabIndex={-1}
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            <ChevronDown
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </div>
        </div>
        
        {/* Dropdown */}
        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            id="autocomplete-dropdown"
            className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
            style={{ maxHeight: maxDropdownHeight }}
            role="listbox"
          >
            <div className="overflow-y-auto" style={{ maxHeight: maxDropdownHeight }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    data-index={index}
                    id={`option-${index}`}
                    role="option"
                    aria-selected={option.value === currentValue}
                    onClick={() => handleSelectOption(option)}
                    disabled={option.disabled}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                      'hover:bg-[var(--muted)]',
                      index === highlightedIndex && 'bg-[var(--muted)]',
                      option.value === currentValue && 'bg-primary/10',
                      option.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {/* Icon */}
                    {option.icon && (
                      <span className="flex-shrink-0 text-muted-foreground">
                        {option.icon}
                      </span>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Selected Check */}
                    {option.value === currentValue && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Helper Text / Error */}
        {(error || helperText) && (
          <p
            className={cn(
              'text-xs mt-1.5',
              error ? 'text-[var(--error)]' : 'text-muted-foreground'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Autocomplete.displayName = "Autocomplete";

export { Autocomplete };
