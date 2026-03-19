import * as React from "react";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import { cn } from "./utils";
import { Badge } from "./badge";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface ComboboxProps {
  // Value
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
  
  // Options
  options: ComboboxOption[];
  
  // Display
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  optional?: boolean;
  
  // Features
  multiple?: boolean;
  searchable?: boolean;
  creatable?: boolean;
  onCreate?: (value: string) => void;
  clearable?: boolean;
  
  // Async
  loading?: boolean;
  onSearch?: (query: string) => void;
  
  // States
  error?: string;
  success?: string;
  disabled?: boolean;
  
  // Styling
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      value,
      onChange,
      defaultValue,
      options,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      emptyText = "No results found",
      label,
      helperText,
      required,
      optional,
      multiple = false,
      searchable = true,
      creatable = false,
      onCreate,
      clearable = true,
      loading = false,
      onSearch,
      error,
      success,
      disabled = false,
      fullWidth = false,
      size = "md",
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue || (multiple ? [] : "")
    );
    
    const selectedValue = value !== undefined ? value : internalValue;
    const selectedArray = Array.isArray(selectedValue) ? selectedValue : [selectedValue].filter(Boolean);
    
    const displayMessage = error || success || helperText;
    const state = error ? 'error' : success ? 'success' : 'default';

    // Debounced search
    React.useEffect(() => {
      if (onSearch && search) {
        const timer = setTimeout(() => {
          onSearch(search);
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [search, onSearch]);

    // Filter options
    const filteredOptions = React.useMemo(() => {
      if (!searchable || !search) return options;
      
      return options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      );
    }, [options, search, searchable]);

    // Group options
    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, ComboboxOption[]> = {};
      
      filteredOptions.forEach((option) => {
        const group = option.group || "default";
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(option);
      });
      
      return groups;
    }, [filteredOptions]);

    // Handle selection
    const handleSelect = (optionValue: string) => {
      let newValue: string | string[];
      
      if (multiple) {
        const current = Array.isArray(selectedValue) ? selectedValue : [];
        if (current.includes(optionValue)) {
          newValue = current.filter((v) => v !== optionValue);
        } else {
          newValue = [...current, optionValue];
        }
      } else {
        newValue = optionValue;
        setOpen(false);
      }
      
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newValue = multiple ? [] : "";
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const handleRemoveChip = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (Array.isArray(selectedValue)) {
        const newValue = selectedValue.filter((v) => v !== optionValue);
        setInternalValue(newValue);
        onChange?.(newValue);
      }
    };

    const handleCreate = () => {
      if (creatable && search && onCreate) {
        onCreate(search);
        setSearch("");
        setOpen(false);
      }
    };

    // Get selected labels
    const getSelectedLabels = () => {
      return selectedArray
        .map((val) => options.find((opt) => opt.value === val)?.label)
        .filter(Boolean);
    };

    const sizeStyles = {
      sm: "h-8 text-sm",
      md: "h-10 text-base",
      lg: "h-12 text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}
      >
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-0.5 text-[var(--error)]">*</span>}
            {optional && (
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                (optional)
              </span>
            )}
          </label>
        )}

        {/* Trigger Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setOpen(!open)}
            disabled={disabled}
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              "flex w-full items-center justify-between gap-2",
              "rounded-md border border-border bg-background px-3 py-2",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "hover:bg-accent/50",
              "focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              sizeStyles[size],
              error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20",
              success && "border-[var(--success)] focus:border-[var(--success)] focus:ring-[var(--success)]/20"
            )}
          >
            <div className="flex items-center gap-1.5 flex-1 overflow-hidden">
              {multiple && selectedArray.length > 0 ? (
                <div className="flex items-center gap-1 flex-wrap">
                  {getSelectedLabels().map((label, idx) => (
                    <Badge
                      key={selectedArray[idx]}
                      size="sm"
                      variant="default"
                      className="max-w-[120px]"
                    >
                      <span className="truncate">{label}</span>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveChip(selectedArray[idx], e)}
                        className="ml-1 shrink-0 hover:opacity-70"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : selectedArray.length > 0 && !multiple ? (
                <span>{getSelectedLabels()[0]}</span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              {clearable && selectedArray.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-0.5 hover:bg-accent rounded transition-colors"
                  aria-label="Clear selection"
                >
                  <X className="size-4 text-muted-foreground" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  "size-4 text-muted-foreground transition-transform",
                  open && "rotate-180"
                )}
              />
            </div>
          </button>

          {/* Dropdown */}
          {open && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
              />

              {/* Dropdown Content */}
              <div
                className={cn(
                  "absolute top-full left-0 z-50 mt-2 w-full",
                  "rounded-lg border border-border bg-background shadow-lg",
                  "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
                  "max-h-[300px] overflow-hidden flex flex-col"
                )}
              >
                {/* Search */}
                {searchable && (
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className={cn(
                          "w-full h-8 pl-8 pr-3 text-sm",
                          "rounded-md border border-border bg-background",
                          "focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20",
                          "transition-all duration-200"
                        )}
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {/* Options List */}
                <div className="overflow-y-auto p-1">
                  {loading ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : filteredOptions.length === 0 ? (
                    <div className="px-3 py-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">{emptyText}</p>
                      {creatable && search && (
                        <button
                          type="button"
                          onClick={handleCreate}
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 text-sm",
                            "rounded-md bg-[var(--brand-primary)] text-white",
                            "hover:bg-[var(--brand-primary)]/90",
                            "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20",
                            "transition-colors"
                          )}
                        >
                          <Plus className="size-4" />
                          Create "{search}"
                        </button>
                      )}
                    </div>
                  ) : (
                    Object.entries(groupedOptions).map(([group, groupOptions]) => (
                      <div key={group}>
                        {group !== "default" && (
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            {group}
                          </div>
                        )}
                        {groupOptions.map((option) => {
                          const isSelected = selectedArray.includes(option.value);
                          
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => !option.disabled && handleSelect(option.value)}
                              disabled={option.disabled}
                              role="option"
                              aria-selected={isSelected}
                              className={cn(
                                "flex w-full items-center justify-between gap-2 px-2 py-1.5",
                                "rounded-md text-sm text-left",
                                "hover:bg-accent transition-colors",
                                "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                isSelected && "bg-accent font-medium"
                              )}
                            >
                              <span className="truncate">{option.label}</span>
                              {isSelected && (
                                <Check className="size-4 shrink-0 text-[var(--brand-primary)]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Create Option */}
                {creatable && search && filteredOptions.length > 0 && (
                  <div className="p-2 border-t border-border">
                    <button
                      type="button"
                      onClick={handleCreate}
                      className={cn(
                        "flex w-full items-center gap-2 px-2 py-1.5",
                        "rounded-md text-sm text-left",
                        "hover:bg-accent transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                      )}
                    >
                      <Plus className="size-4 text-muted-foreground" />
                      <span>Create "{search}"</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Helper Text */}
        {displayMessage && (
          <p
            className={cn(
              "text-xs",
              state === "error" && "text-[var(--error)]",
              state === "success" && "text-[var(--success)]",
              state === "default" && "text-muted-foreground"
            )}
          >
            {displayMessage}
          </p>
        )}
      </div>
    );
  }
);

Combobox.displayName = "Combobox";
