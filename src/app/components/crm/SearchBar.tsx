/* ============================================================
 * SearchBar Component
 * Advanced search với filters và shortcuts
 * ============================================================ */

import React from "react";
import { Search, X, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* ============================================================
 * Types
 * ============================================================ */

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isSearching?: boolean;
  resultCount?: number;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  filtersActive?: boolean;
  className?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

/* ============================================================
 * SearchBar Component
 * ============================================================ */

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Tìm kiếm...",
  isSearching = false,
  resultCount,
  showFilters = false,
  onToggleFilters,
  filtersActive = false,
  className = "",
  autoFocus = false,
  onFocus,
  onBlur,
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  /* ============================================================
   * Keyboard Shortcuts
   * ============================================================ */

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Escape to clear search
      if (e.key === "Escape" && value) {
        e.preventDefault();
        onClear?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [value, onClear]);

  /* ============================================================
   * Handlers
   * ============================================================ */

  const handleClear = () => {
    onChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  /* ============================================================
   * Render
   * ============================================================ */

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

        {/* Input */}
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-20"
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        {/* Right Side Icons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Loading Indicator */}
          {isSearching && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          )}

          {/* Result Count */}
          {!isSearching && resultCount !== undefined && value && (
            <span className="text-xs text-gray-500 mr-1">
              {resultCount} kết quả
            </span>
          )}

          {/* Clear Button */}
          {value && !isSearching && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
              <span className="sr-only">Xóa tìm kiếm</span>
            </Button>
          )}

          {/* Keyboard Shortcut Hint */}
          {!value && !isSearching && (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono text-gray-500 bg-gray-100 border border-gray-200 rounded">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Filter Toggle */}
      {showFilters && onToggleFilters && (
        <Button
          type="button"
          variant={filtersActive ? "default" : "outline"}
          size="sm"
          onClick={onToggleFilters}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Bộ lọc</span>
          {filtersActive && (
            <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded">1</span>
          )}
        </Button>
      )}
    </div>
  );
}

/* ============================================================
 * Advanced Search Bar
 * ============================================================ */

export interface AdvancedSearchBarProps extends SearchBarProps {
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  recentSearches?: string[];
  onClearRecentSearches?: () => void;
}

export function AdvancedSearchBar({
  suggestions = [],
  onSuggestionClick,
  recentSearches = [],
  onClearRecentSearches,
  ...props
}: AdvancedSearchBarProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick?.(suggestion);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <SearchBar
        {...props}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />

      {/* Dropdown */}
      {showDropdown && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-2 border-b">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-medium text-gray-500">
                  Tìm kiếm gần đây
                </span>
                {onClearRecentSearches && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClearRecentSearches}
                    className="h-6 text-xs"
                  >
                    Xóa
                  </Button>
                )}
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-medium text-gray-500">
                Gợi ý
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Search With Scope
 * ============================================================ */

export interface SearchScope {
  value: string;
  label: string;
}

export interface SearchBarWithScopeProps extends SearchBarProps {
  scopes: SearchScope[];
  currentScope: string;
  onScopeChange: (scope: string) => void;
}

export function SearchBarWithScope({
  scopes,
  currentScope,
  onScopeChange,
  ...props
}: SearchBarWithScopeProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Scope Selector */}
      <select
        value={currentScope}
        onChange={(e) => onScopeChange(e.target.value)}
        className="h-10 px-3 border border-gray-200 rounded-md text-sm bg-white"
      >
        {scopes.map((scope) => (
          <option key={scope.value} value={scope.value}>
            {scope.label}
          </option>
        ))}
      </select>

      {/* Search Bar */}
      <SearchBar {...props} />
    </div>
  );
}