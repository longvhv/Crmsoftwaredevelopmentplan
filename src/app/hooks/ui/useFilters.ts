/* ============================================================
 * Filters Hook
 * Advanced filtering with multiple conditions and groups
 * ============================================================ */

import { useCallback, useState, useMemo } from "react";
import type {
  FilterCondition,
  FilterGroup,
  FilterLogic,
  FiltersState,
} from "@/types/ui-state";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseFiltersOptions {
  initialFilters?: FiltersState;
  onFiltersChange?: (filters: FiltersState) => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export interface UseFiltersReturn {
  filters: FiltersState;
  activeFilters: FilterCondition[];
  filterCount: number;
  hasFilters: boolean;

  // Group actions
  addGroup: (group: FilterGroup) => void;
  removeGroup: (index: number) => void;
  updateGroup: (index: number, group: FilterGroup) => void;
  clearGroups: () => void;

  // Condition actions
  addCondition: (groupIndex: number, condition: FilterCondition) => void;
  removeCondition: (groupIndex: number, conditionIndex: number) => void;
  updateCondition: (
    groupIndex: number,
    conditionIndex: number,
    condition: FilterCondition
  ) => void;

  // Quick filter actions
  setQuickFilter: (key: string, value: unknown) => void;
  removeQuickFilter: (key: string) => void;
  clearQuickFilters: () => void;

  // Utility
  clearAll: () => void;
  applyPreset: (conditions: FilterCondition[]) => void;
}

/* ============================================================
 * Filters Hook
 * ============================================================ */

export function useFilters({
  initialFilters = { groups: [], quickFilters: {} },
  onFiltersChange,
}: UseFiltersOptions = {}): UseFiltersReturn {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  /* ============================================================
   * Update Handler
   * ============================================================ */

  const updateFilters = useCallback(
    (updater: (prev: FiltersState) => FiltersState) => {
      setFilters((prev) => {
        const next = updater(prev);
        onFiltersChange?.(next);
        return next;
      });
    },
    [onFiltersChange]
  );

  /* ============================================================
   * Group Actions
   * ============================================================ */

  const addGroup = useCallback(
    (group: FilterGroup) => {
      updateFilters((prev) => ({
        ...prev,
        groups: [...prev.groups, group],
      }));
    },
    [updateFilters]
  );

  const removeGroup = useCallback(
    (index: number) => {
      updateFilters((prev) => ({
        ...prev,
        groups: prev.groups.filter((_, i) => i !== index),
      }));
    },
    [updateFilters]
  );

  const updateGroup = useCallback(
    (index: number, group: FilterGroup) => {
      updateFilters((prev) => ({
        ...prev,
        groups: prev.groups.map((g, i) => (i === index ? group : g)),
      }));
    },
    [updateFilters]
  );

  const clearGroups = useCallback(() => {
    updateFilters((prev) => ({
      ...prev,
      groups: [],
    }));
  }, [updateFilters]);

  /* ============================================================
   * Condition Actions
   * ============================================================ */

  const addCondition = useCallback(
    (groupIndex: number, condition: FilterCondition) => {
      updateFilters((prev) => ({
        ...prev,
        groups: prev.groups.map((group, i) => {
          if (i === groupIndex) {
            return {
              ...group,
              conditions: [...group.conditions, condition],
            };
          }
          return group;
        }),
      }));
    },
    [updateFilters]
  );

  const removeCondition = useCallback(
    (groupIndex: number, conditionIndex: number) => {
      updateFilters((prev) => ({
        ...prev,
        groups: prev.groups.map((group, i) => {
          if (i === groupIndex) {
            return {
              ...group,
              conditions: group.conditions.filter((_, j) => j !== conditionIndex),
            };
          }
          return group;
        }),
      }));
    },
    [updateFilters]
  );

  const updateCondition = useCallback(
    (groupIndex: number, conditionIndex: number, condition: FilterCondition) => {
      updateFilters((prev) => ({
        ...prev,
        groups: prev.groups.map((group, i) => {
          if (i === groupIndex) {
            return {
              ...group,
              conditions: group.conditions.map((c, j) =>
                j === conditionIndex ? condition : c
              ),
            };
          }
          return group;
        }),
      }));
    },
    [updateFilters]
  );

  /* ============================================================
   * Quick Filter Actions
   * ============================================================ */

  const setQuickFilter = useCallback(
    (key: string, value: unknown) => {
      updateFilters((prev) => ({
        ...prev,
        quickFilters: {
          ...prev.quickFilters,
          [key]: value,
        },
      }));
    },
    [updateFilters]
  );

  const removeQuickFilter = useCallback(
    (key: string) => {
      updateFilters((prev) => {
        const { [key]: _, ...rest } = prev.quickFilters;
        return {
          ...prev,
          quickFilters: rest,
        };
      });
    },
    [updateFilters]
  );

  const clearQuickFilters = useCallback(() => {
    updateFilters((prev) => ({
      ...prev,
      quickFilters: {},
    }));
  }, [updateFilters]);

  /* ============================================================
   * Utility Actions
   * ============================================================ */

  const clearAll = useCallback(() => {
    updateFilters(() => ({
      groups: [],
      quickFilters: {},
    }));
  }, [updateFilters]);

  const applyPreset = useCallback(
    (conditions: FilterCondition[]) => {
      updateFilters(() => ({
        groups: [
          {
            logic: "AND" as FilterLogic,
            conditions,
          },
        ],
        quickFilters: {},
      }));
    },
    [updateFilters]
  );

  /* ============================================================
   * Computed Values
   * ============================================================ */

  const activeFilters = useMemo(() => {
    return filters.groups.flatMap((group) => group.conditions);
  }, [filters.groups]);

  const filterCount =
    activeFilters.length + Object.keys(filters.quickFilters).length;

  const hasFilters = filterCount > 0;

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    filters,
    activeFilters,
    filterCount,
    hasFilters,

    // Group actions
    addGroup,
    removeGroup,
    updateGroup,
    clearGroups,

    // Condition actions
    addCondition,
    removeCondition,
    updateCondition,

    // Quick filter actions
    setQuickFilter,
    removeQuickFilter,
    clearQuickFilters,

    // Utility
    clearAll,
    applyPreset,
  };
}

/* ============================================================
 * Filter Utilities
 * ============================================================ */

/** Apply filters to data array */
export function applyFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: FiltersState
): T[] {
  let filtered = [...data];

  // Apply quick filters first
  if (Object.keys(filters.quickFilters).length > 0) {
    filtered = filtered.filter((item) => {
      return Object.entries(filters.quickFilters).every(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }
        return item[key] === value;
      });
    });
  }

  // Apply filter groups
  if (filters.groups.length > 0) {
    filtered = filtered.filter((item) => {
      return filters.groups.some((group) => {
        return evaluateGroup(item, group);
      });
    });
  }

  return filtered;
}

/** Evaluate filter group */
function evaluateGroup<T extends Record<string, unknown>>(
  item: T,
  group: FilterGroup
): boolean {
  if (group.conditions.length === 0) return true;

  if (group.logic === "AND") {
    return group.conditions.every((condition) =>
      evaluateCondition(item, condition)
    );
  } else {
    return group.conditions.some((condition) =>
      evaluateCondition(item, condition)
    );
  }
}

/** Evaluate single filter condition */
function evaluateCondition<T extends Record<string, unknown>>(
  item: T,
  condition: FilterCondition
): boolean {
  const value = item[condition.field];
  const filterValue = condition.value;

  switch (condition.operator) {
    case "equals":
      return value === filterValue;

    case "not_equals":
      return value !== filterValue;

    case "contains":
      return String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());

    case "not_contains":
      return !String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());

    case "starts_with":
      return String(value)
        .toLowerCase()
        .startsWith(String(filterValue).toLowerCase());

    case "ends_with":
      return String(value)
        .toLowerCase()
        .endsWith(String(filterValue).toLowerCase());

    case "greater_than":
      return Number(value) > Number(filterValue);

    case "greater_than_or_equal":
      return Number(value) >= Number(filterValue);

    case "less_than":
      return Number(value) < Number(filterValue);

    case "less_than_or_equal":
      return Number(value) <= Number(filterValue);

    case "in":
      return Array.isArray(filterValue) && filterValue.includes(value);

    case "not_in":
      return Array.isArray(filterValue) && !filterValue.includes(value);

    case "is_empty":
      return (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      );

    case "is_not_empty":
      return !(
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      );

    case "between":
      if (Array.isArray(filterValue) && filterValue.length === 2) {
        return (
          Number(value) >= Number(filterValue[0]) &&
          Number(value) <= Number(filterValue[1])
        );
      }
      return false;

    case "not_between":
      if (Array.isArray(filterValue) && filterValue.length === 2) {
        return !(
          Number(value) >= Number(filterValue[0]) &&
          Number(value) <= Number(filterValue[1])
        );
      }
      return true;

    default:
      return true;
  }
}
