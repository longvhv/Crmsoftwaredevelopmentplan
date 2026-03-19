import { useState, useMemo, useCallback, useEffect } from "react";
import type { PlanFilters, PlanStats, PlanStep, GroupByOption } from "../types/plan";
import { PHASE_NAMES } from "../constants/planConfig";
import {
  fetchAllSteps,
  fetchFilteredSteps,
  fetchPlanStats,
  fetchCategories,
  fetchResponsibleList,
  groupStepsByKey,
} from "../api/planApi";

const INITIAL_FILTERS: PlanFilters = {
  searchQuery: "",
  phase: null,
  category: null,
  status: null,
  aiInvolvement: null,
  responsible: null,
};

const DEFAULT_EXPANDED = new Set([PHASE_NAMES[0], PHASE_NAMES[1]]);

export function usePlanData() {
  /* State */
  const [allSteps, setAllSteps] = useState<PlanStep[]>([]);
  const [filteredSteps, setFilteredSteps] = useState<PlanStep[]>([]);
  const [stats, setStats] = useState<PlanStats>({
    total: 0, done: 0, inProgress: 0, pending: 0, blocked: 0, aiDriven: 0, critical: 0,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [responsibleList, setResponsibleList] = useState<string[]>([]);
  const [filters, setFilters] = useState<PlanFilters>(INITIAL_FILTERS);
  const [groupBy, setGroupBy] = useState<GroupByOption>("phase");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(DEFAULT_EXPANDED);
  const [selectedStep, setSelectedStep] = useState<PlanStep | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Load dữ liệu ban đầu */
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [stepsData, statsData, categoriesData, responsibleData] = await Promise.all([
          fetchAllSteps(),
          fetchPlanStats(),
          fetchCategories(),
          fetchResponsibleList(),
        ]);
        setAllSteps(stepsData);
        setFilteredSteps(stepsData);
        setStats(statsData);
        setCategories(categoriesData);
        setResponsibleList(responsibleData);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  /* Filter dữ liệu khi filters thay đổi */
  useEffect(() => {
    async function applyFilters() {
      const result = await fetchFilteredSteps(filters);
      setFilteredSteps(result);
    }
    applyFilters();
  }, [filters]);

  /* Grouped data */
  const groupedSteps = useMemo(
    () => groupStepsByKey(filteredSteps, groupBy),
    [filteredSteps, groupBy],
  );

  /* Kiểm tra có filter nào đang active */
  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery !== "" ||
      filters.phase !== null ||
      filters.category !== null ||
      filters.status !== null ||
      filters.aiInvolvement !== null ||
      filters.responsible !== null
    );
  }, [filters]);

  /* Actions */
  const updateFilter = useCallback(
    <K extends keyof PlanFilters>(key: K, value: PlanFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const expandAllGroups = useCallback(() => {
    setExpandedGroups(new Set(groupedSteps.keys()));
  }, [groupedSteps]);

  const collapseAllGroups = useCallback(() => {
    setExpandedGroups(new Set());
  }, []);

  const toggleSelectedStep = useCallback((step: PlanStep) => {
    setSelectedStep((prev) => (prev?.id === step.id ? null : step));
  }, []);

  const closeSelectedStep = useCallback(() => {
    setSelectedStep(null);
  }, []);

  /** Thêm danh mục mới (giả lập) */
  const addCategory = useCallback((newCategory: string) => {
    setCategories((prev) =>
      prev.includes(newCategory) ? prev : [...prev, newCategory],
    );
  }, []);

  /** Thêm người phụ trách mới (giả lập) */
  const addResponsible = useCallback((newPerson: string) => {
    setResponsibleList((prev) =>
      prev.includes(newPerson) ? prev : [...prev, newPerson].sort(),
    );
  }, []);

  return {
    /* Dữ liệu */
    allSteps,
    filteredSteps,
    groupedSteps,
    stats,
    categories,
    responsibleList,
    selectedStep,
    isLoading,

    /* Bộ lọc */
    filters,
    hasActiveFilters,
    updateFilter,
    clearFilters,

    /* Nhóm */
    groupBy,
    setGroupBy,
    expandedGroups,
    toggleGroup,
    expandAllGroups,
    collapseAllGroups,

    /* Chọn bước */
    toggleSelectedStep,
    closeSelectedStep,

    /* Quản lý danh mục */
    addCategory,
    addResponsible,
  };
}
