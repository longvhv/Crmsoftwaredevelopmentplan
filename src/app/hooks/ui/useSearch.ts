/* ============================================================
 * Search Hook
 * Full-text search with debounce and highlighting
 * ============================================================ */

import { useCallback, useState, useMemo, useEffect } from "react";
import type { SearchScope, SearchOptions, SearchState } from "@/types/ui-state";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseSearchOptions {
  searchFields?: string[];
  debounceMs?: number;
  caseSensitive?: boolean;
  scope?: SearchScope;
  onSearchChange?: (query: string) => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export interface UseSearchReturn {
  search: SearchState;
  query: string;
  debouncedQuery: string;
  isSearching: boolean;

  // Actions
  setQuery: (query: string) => void;
  clearSearch: () => void;
  setSearchFields: (fields: string[]) => void;
  setScope: (scope: SearchScope) => void;
  setCaseSensitive: (caseSensitive: boolean) => void;
  toggleCaseSensitive: () => void;

  // Helpers
  hasQuery: boolean;
}

/* ============================================================
 * Search Hook
 * ============================================================ */

export function useSearch({
  searchFields = [],
  debounceMs = 300,
  caseSensitive = false,
  scope = "all",
  onSearchChange,
}: UseSearchOptions = {}): UseSearchReturn {
  const [query, setQueryState] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [options, setOptions] = useState<SearchOptions>({
    scope,
    caseSensitive,
    useRegex: false,
    searchFields,
  });

  /* ============================================================
   * Debounce Query
   * ============================================================ */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      onSearchChange?.(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearchChange]);

  /* ============================================================
   * Actions
   * ============================================================ */

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQueryState("");
    setDebouncedQuery("");
  }, []);

  const setSearchFields = useCallback((fields: string[]) => {
    setOptions((prev) => ({ ...prev, searchFields: fields }));
  }, []);

  const setScope = useCallback((newScope: SearchScope) => {
    setOptions((prev) => ({ ...prev, scope: newScope }));
  }, []);

  const setCaseSensitive = useCallback((sensitive: boolean) => {
    setOptions((prev) => ({ ...prev, caseSensitive: sensitive }));
  }, []);

  const toggleCaseSensitive = useCallback(() => {
    setOptions((prev) => ({ ...prev, caseSensitive: !prev.caseSensitive }));
  }, []);

  /* ============================================================
   * Computed Values
   * ============================================================ */

  const hasQuery = query.length > 0;
  const isSearching = query !== debouncedQuery;

  const search: SearchState = useMemo(
    () => ({
      query: debouncedQuery,
      options,
      isActive: debouncedQuery.length > 0,
      resultCount: 0, // Will be updated by consumer
    }),
    [debouncedQuery, options]
  );

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    search,
    query,
    debouncedQuery,
    isSearching,

    // Actions
    setQuery,
    clearSearch,
    setSearchFields,
    setScope,
    setCaseSensitive,
    toggleCaseSensitive,

    // Helpers
    hasQuery,
  };
}

/* ============================================================
 * Search Utilities
 * ============================================================ */

/** Apply search to data array */
export function applySearch<T extends Record<string, unknown>>(
  data: T[],
  search: SearchState
): T[] {
  if (!search.isActive || !search.query) return data;

  const { query, options } = search;
  const searchQuery = options.caseSensitive ? query : query.toLowerCase();

  return data.filter((item) => {
    // If search fields specified, only search those fields
    if (options.searchFields.length > 0) {
      return options.searchFields.some((field) => {
        const value = item[field];
        return matchesSearch(value, searchQuery, options.caseSensitive);
      });
    }

    // Otherwise search all string fields
    return Object.values(item).some((value) => {
      return matchesSearch(value, searchQuery, options.caseSensitive);
    });
  });
}

/** Check if value matches search query */
function matchesSearch(
  value: unknown,
  query: string,
  caseSensitive: boolean
): boolean {
  if (value === null || value === undefined) return false;

  const str = String(value);
  const searchStr = caseSensitive ? str : str.toLowerCase();

  return searchStr.includes(query);
}

/** Highlight search matches in text */
export function highlightMatches(
  text: string,
  query: string,
  caseSensitive = false
): Array<{ text: string; isMatch: boolean }> {
  if (!query) return [{ text, isMatch: false }];

  const searchQuery = caseSensitive ? query : query.toLowerCase();
  const searchText = caseSensitive ? text : text.toLowerCase();

  const parts: Array<{ text: string; isMatch: boolean }> = [];
  let lastIndex = 0;
  let index = searchText.indexOf(searchQuery);

  while (index !== -1) {
    // Add non-matching part before match
    if (index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, index),
        isMatch: false,
      });
    }

    // Add matching part
    parts.push({
      text: text.substring(index, index + query.length),
      isMatch: true,
    });

    lastIndex = index + query.length;
    index = searchText.indexOf(searchQuery, lastIndex);
  }

  // Add remaining non-matching part
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      isMatch: false,
    });
  }

  return parts;
}

/** Get search result summary */
export function getSearchSummary(
  totalCount: number,
  resultCount: number,
  query: string
): string {
  if (!query) return `${totalCount} items`;

  if (resultCount === 0) {
    return `No results for "${query}"`;
  }

  if (resultCount === 1) {
    return `1 result for "${query}"`;
  }

  return `${resultCount} results for "${query}"`;
}
