/**
 * Trang Kế hoạch Chi tiết — Hiển thị tất cả bước xây dựng AI-CRM.
 *
 * Sử dụng:
 *  - usePlanData hook  → quản lý state, filter, grouping
 *  - PlanStatsBar      → thống kê tổng quan
 *  - PlanProgressBar   → thanh tiến độ
 *  - PlanFilterPanel   → tìm kiếm, bộ lọc, nhóm
 *  - PlanGroupedList   → danh sách bước theo nhóm
 *  - StepDetailModal   → chi tiết một bước (popup)
 */

import { usePlanData } from "../hooks/usePlanData";
import { PlanStatsBar } from "../components/plan/PlanStatsBar";
import { PlanProgressBar } from "../components/plan/PlanProgressBar";
import { PlanFilterPanel } from "../components/plan/PlanFilterPanel";
import { PlanGroupedList } from "../components/plan/PlanGroupedList";
import { StepDetailModal } from "../components/plan/StepDetailModal";

export function DetailedPlanPage() {
  const {
    allSteps,
    filteredSteps,
    groupedSteps,
    stats,
    categories,
    responsibleList,
    selectedStep,
    isLoading,
    filters,
    hasActiveFilters,
    updateFilter,
    clearFilters,
    groupBy,
    setGroupBy,
    expandedGroups,
    toggleGroup,
    expandAllGroups,
    collapseAllGroups,
    toggleSelectedStep,
    closeSelectedStep,
    addCategory,
    addResponsible,
  } = usePlanData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 text-sm">Đang tải kế hoạch...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Tiêu đề */}
      <header>
        <h1 className="text-gray-900">Kế hoạch chi tiết xây dựng AI-CRM</h1>
        <p className="text-gray-500 mt-1">
          {stats.total} bước chi tiết · 6 phases · Quy trình phát triển AI-first
        </p>
      </header>

      {/* Thống kê */}
      <PlanStatsBar stats={stats} />

      {/* Tiến độ */}
      <PlanProgressBar stats={stats} />

      {/* Bộ lọc & Tìm kiếm */}
      <PlanFilterPanel
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        categories={categories}
        responsibleList={responsibleList}
        groupBy={groupBy}
        filteredCount={filteredSteps.length}
        totalCount={stats.total}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
        onGroupByChange={setGroupBy}
        onExpandAll={expandAllGroups}
        onCollapseAll={collapseAllGroups}
        onAddCategory={addCategory}
        onAddResponsible={addResponsible}
      />

      {/* Danh sách bước theo nhóm */}
      <PlanGroupedList
        groupedSteps={groupedSteps}
        expandedGroups={expandedGroups}
        selectedStepId={selectedStep?.id ?? null}
        onToggleGroup={toggleGroup}
        onSelectStep={toggleSelectedStep}
      />

      {/* Chi tiết bước (modal) */}
      {selectedStep && (
        <StepDetailModal
          step={selectedStep}
          allSteps={allSteps}
          onClose={closeSelectedStep}
        />
      )}
    </div>
  );
}
