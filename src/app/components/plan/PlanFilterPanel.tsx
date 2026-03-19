import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import type { PlanFilters, GroupByOption } from "../../types/plan";
import {
  PHASE_NAMES,
  STATUS_OPTIONS,
  STATUS_CONFIG,
  AI_LEVEL_OPTIONS,
  GROUP_BY_OPTIONS,
} from "../../constants/planConfig";
import { ComboboxSelect } from "../ComboboxSelect";

interface PlanFilterPanelProps {
  filters: PlanFilters;
  hasActiveFilters: boolean;
  categories: string[];
  responsibleList: string[];
  groupBy: GroupByOption;
  filteredCount: number;
  totalCount: number;
  onUpdateFilter: <K extends keyof PlanFilters>(key: K, value: PlanFilters[K]) => void;
  onClearFilters: () => void;
  onGroupByChange: (value: GroupByOption) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onAddCategory: (category: string) => void;
  onAddResponsible: (person: string) => void;
}

export function PlanFilterPanel({
  filters,
  hasActiveFilters,
  categories,
  responsibleList,
  groupBy,
  filteredCount,
  totalCount,
  onUpdateFilter,
  onClearFilters,
  onGroupByChange,
  onExpandAll,
  onCollapseAll,
  onAddCategory,
  onAddResponsible,
}: PlanFilterPanelProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      {/* Thanh tìm kiếm & điều khiển */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bước, mô tả, nhân sự, AI tool..."
              value={filters.searchQuery}
              onChange={(e) => onUpdateFilter("searchQuery", e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {/* Nút bộ lọc */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
              showFilters
                ? "bg-violet-50 border-violet-200 text-violet-700"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Bộ lọc</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-violet-500" />}
          </button>

          {/* Xoá bộ lọc */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xoá lọc</span>
            </button>
          )}

          {/* Nhóm theo */}
          <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg overflow-x-auto">
            {GROUP_BY_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => onGroupByChange(option.key)}
                className={`px-2 py-1.5 rounded-md text-xs whitespace-nowrap transition-all ${
                  groupBy === option.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel bộ lọc chi tiết */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-gray-100">
            {/* Phase */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phase</label>
              <select
                value={filters.phase ?? ""}
                onChange={(e) => onUpdateFilter("phase", e.target.value ? Number(e.target.value) : null)}
                className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">Tất cả</option>
                {Object.entries(PHASE_NAMES).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>

            {/* Category (Combobox) */}
            <ComboboxSelect
              label="Danh mục"
              options={categories}
              value={filters.category}
              onChange={(val) => onUpdateFilter("category", val)}
              placeholder="Tất cả"
              allowCreate
              onCreateNew={onAddCategory}
            />

            {/* Status */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
              <select
                value={filters.status ?? ""}
                onChange={(e) => onUpdateFilter("status", (e.target.value || null) as PlanFilters["status"])}
                className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">Tất cả</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </div>

            {/* AI Level */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mức độ AI</label>
              <select
                value={filters.aiInvolvement ?? ""}
                onChange={(e) => onUpdateFilter("aiInvolvement", (e.target.value || null) as PlanFilters["aiInvolvement"])}
                className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">Tất cả</option>
                {AI_LEVEL_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Responsible (Combobox) */}
            <ComboboxSelect
              label="Nhân sự phụ trách"
              options={responsibleList}
              value={filters.responsible}
              onChange={(val) => onUpdateFilter("responsible", val)}
              placeholder="Tất cả"
              allowCreate
              onCreateNew={onAddResponsible}
            />
          </div>
        )}
      </div>

      {/* Thông tin kết quả */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Hiển thị <span className="text-gray-900">{filteredCount}</span> / {totalCount} bước
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={onExpandAll} className="text-xs text-violet-600 hover:text-violet-700">
            Mở tất cả
          </button>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={onCollapseAll} className="text-xs text-violet-600 hover:text-violet-700">
            Thu tất cả
          </button>
        </div>
      </div>
    </>
  );
}
