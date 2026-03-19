/* ============================================================
 * TagInput Component
 * Input field for managing tags/labels
 * ============================================================ */

import { useState, useCallback, useRef, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ============================================================
 * Types
 * ============================================================ */

export interface Tag {
  id: string;
  label: string;
  color?: string;
}

export interface TagInputProps {
  value?: Tag[];
  onChange?: (tags: Tag[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  suggestions?: Tag[];
  variant?: "default" | "compact";
  separator?: string | RegExp;
  onCreate?: (label: string) => Tag | Promise<Tag>;
}

/* ============================================================
 * Default Tag Creator
 * ============================================================ */

function createDefaultTag(label: string): Tag {
  return {
    id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    label: label.trim(),
  };
}

/* ============================================================
 * TagBadge Component
 * ============================================================ */

interface TagBadgeProps {
  tag: Tag;
  onRemove: () => void;
  disabled?: boolean;
  variant?: "default" | "compact";
}

function TagBadge({ tag, onRemove, disabled, variant = "default" }: TagBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1 pr-1",
        variant === "compact" && "text-xs py-0",
        tag.color && `bg-${tag.color}-100 dark:bg-${tag.color}-900 text-${tag.color}-900 dark:text-${tag.color}-100`
      )}
      style={
        tag.color
          ? {
              backgroundColor: tag.color,
              color: "#fff",
            }
          : undefined
      }
    >
      <span>{tag.label}</span>
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
        >
          <X className={cn("w-3 h-3", variant === "compact" && "w-2.5 h-2.5")} />
        </button>
      )}
    </Badge>
  );
}

/* ============================================================
 * TagInput Component
 * ============================================================ */

export function TagInput({
  value = [],
  onChange,
  placeholder = "Add tags...",
  disabled = false,
  error,
  className,
  maxTags,
  allowDuplicates = false,
  suggestions = [],
  variant = "default",
  separator = /[,;\n]/,
  onCreate = createDefaultTag,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ============================================================
   * Tag Management
   * ============================================================ */

  const addTag = useCallback(
    async (label: string) => {
      const trimmed = label.trim();
      if (!trimmed) return;

      // Check max tags
      if (maxTags && value.length >= maxTags) {
        return;
      }

      // Check duplicates
      if (!allowDuplicates && value.some((t) => t.label === trimmed)) {
        return;
      }

      // Create new tag
      const newTag = await onCreate(trimmed);
      onChange?.([...value, newTag]);
      setInputValue("");
    },
    [value, onChange, maxTags, allowDuplicates, onCreate]
  );

  const removeTag = useCallback(
    (id: string) => {
      onChange?.(value.filter((t) => t.id !== id));
    },
    [value, onChange]
  );

  const addSuggestion = useCallback(
    (tag: Tag) => {
      if (maxTags && value.length >= maxTags) return;
      if (!allowDuplicates && value.some((t) => t.id === tag.id)) return;

      onChange?.([...value, tag]);
      setInputValue("");
      setShowSuggestions(false);
    },
    [value, onChange, maxTags, allowDuplicates]
  );

  /* ============================================================
   * Event Handlers
   * ============================================================ */

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Check for separator
      if (separator) {
        const parts = newValue.split(separator);
        if (parts.length > 1) {
          // Add all parts except the last one
          for (let i = 0; i < parts.length - 1; i++) {
            if (parts[i].trim()) {
              addTag(parts[i]);
            }
          }
          setInputValue(parts[parts.length - 1]);
          return;
        }
      }

      setInputValue(newValue);
      setShowSuggestions(newValue.length > 0);
    },
    [separator, addTag]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          addTag(inputValue);
          break;

        case "Backspace":
          if (inputValue === "" && value.length > 0) {
            removeTag(value[value.length - 1].id);
          }
          break;

        case "Escape":
          setShowSuggestions(false);
          break;
      }
    },
    [inputValue, value, addTag, removeTag]
  );

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  /* ============================================================
   * Filtered Suggestions
   * ============================================================ */

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.some((v) => v.id === s.id)
  );

  /* ============================================================
   * Render
   * ============================================================ */

  const isMaxReached = maxTags ? value.length >= maxTags : false;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Tag Container */}
      <div
        className={cn(
          "border rounded-lg bg-white dark:bg-gray-950 min-h-[40px] p-2 cursor-text",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900"
        )}
        onClick={handleContainerClick}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {/* Tags */}
          {value.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onRemove={() => removeTag(tag.id)}
              disabled={disabled}
              variant={variant}
            />
          ))}

          {/* Input */}
          {!isMaxReached && (
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(inputValue.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={value.length === 0 ? placeholder : ""}
              disabled={disabled}
              className="border-0 shadow-none focus-visible:ring-0 flex-1 min-w-[120px] h-auto p-0"
            />
          )}

          {/* Max tags indicator */}
          {isMaxReached && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Max {maxTags} tags
            </span>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="border rounded-lg bg-white dark:bg-gray-950 shadow-lg max-h-[200px] overflow-y-auto">
          <div className="p-2 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
              Suggestions
            </p>
            {filteredSuggestions.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addSuggestion(tag)}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                <span className="text-sm">{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Helper Text */}
      {!error && separator && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Enter or use {separator.toString()} to add tags
        </p>
      )}
    </div>
  );
}

/* ============================================================
 * Simple String Array Variant
 * ============================================================ */

export interface SimpleTagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  suggestions?: string[];
}

export function SimpleTagInput({
  value = [],
  onChange,
  suggestions = [],
  ...props
}: SimpleTagInputProps) {
  const tags = value.map((label, idx) => ({
    id: `tag-${idx}`,
    label,
  }));

  const suggestionTags = suggestions.map((label, idx) => ({
    id: `suggestion-${idx}`,
    label,
  }));

  const handleChange = (newTags: Tag[]) => {
    onChange?.(newTags.map((t) => t.label));
  };

  return (
    <TagInput
      value={tags}
      onChange={handleChange}
      suggestions={suggestionTags}
      {...props}
    />
  );
}
