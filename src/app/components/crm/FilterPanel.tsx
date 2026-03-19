/* ============================================================
 * FilterPanel Component
 * Advanced filter panel với groups và conditions
 * ============================================================ */

import React from "react";
import {
  X,
  Plus,
  Filter,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  FilterCondition,
  FilterGroup,
  FilterOperator,
  QuickFilterPreset,
} from "@/types/ui-state";

/* ============================================================
 * Types
 * ============================================================ */

export interface FilterPanelProps {
  groups: FilterGroup[];
  onAddGroup: () => void;
  onRemoveGroup: (index: number) => void;
  onUpdateGroup: (index: number, group: FilterGroup) => void;
  onAddCondition: (groupIndex: number) => void;
  onRemoveCondition: (groupIndex: number, conditionIndex: number) => void;
  onUpdateCondition: (
    groupIndex: number,
    conditionIndex: number,
    condition: FilterCondition
  ) => void;
  onClear: () => void;
  presets?: QuickFilterPreset[];
  onApplyPreset?: (preset: QuickFilterPreset) => void;
  fields: Array<{ value: string; label: string; type?: string }>;
  className?: string;
}

/* ============================================================
 * Filter Operators
 * ============================================================ */

const OPERATORS: Array<{ value: FilterOperator; label: string }> = [
  { value: "equals", label: "Bằng" },
  { value: "not_equals", label: "Không bằng" },
  { value: "contains", label: "Chứa" },
  { value: "not_contains", label: "Không chứa" },
  { value: "starts_with", label: "Bắt đầu với" },
  { value: "ends_with", label: "Kết thúc với" },
  { value: "greater_than", label: "Lớn hơn" },
  { value: "greater_than_or_equal", label: "Lớn hơn hoặc bằng" },
  { value: "less_than", label: "Nhỏ hơn" },
  { value: "less_than_or_equal", label: "Nhỏ hơn hoặc bằng" },
  { value: "in", label: "Trong danh sách" },
  { value: "not_in", label: "Không trong danh sách" },
  { value: "is_empty", label: "Trống" },
  { value: "is_not_empty", label: "Không trống" },
  { value: "between", label: "Trong khoảng" },
  { value: "not_between", label: "Ngoài khoảng" },
];

/* ============================================================
 * FilterPanel Component
 * ============================================================ */

export function FilterPanel({
  groups,
  onAddGroup,
  onRemoveGroup,
  onUpdateGroup,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
  onClear,
  presets = [],
  onApplyPreset,
  fields,
  className = "",
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const hasFilters = groups.length > 0 || groups.some((g) => g.conditions.length > 0);

  return (
    <div className={`border rounded-lg bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Filter className="w-4 h-4" />
          <span>Bộ lọc nâng cao</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs"
          >
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Presets */}
          {presets.length > 0 && onApplyPreset && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">
                Bộ lọc nhanh
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onApplyPreset(preset)}
                    className="gap-2"
                  >
                    {preset.icon}
                    <span>{preset.label}</span>
                    {preset.badge !== undefined && (
                      <span className="bg-gray-100 text-xs px-1.5 py-0.5 rounded">
                        {preset.badge}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Groups */}
          {groups.map((group, groupIndex) => (
            <FilterGroupComponent
              key={groupIndex}
              group={group}
              groupIndex={groupIndex}
              fields={fields}
              onUpdateGroup={onUpdateGroup}
              onRemoveGroup={onRemoveGroup}
              onAddCondition={onAddCondition}
              onRemoveCondition={onRemoveCondition}
              onUpdateCondition={onUpdateCondition}
            />
          ))}

          {/* Add Group Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddGroup}
            className="w-full gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm nhóm lọc
          </Button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Filter Group Component
 * ============================================================ */

interface FilterGroupComponentProps {
  group: FilterGroup;
  groupIndex: number;
  fields: Array<{ value: string; label: string; type?: string }>;
  onUpdateGroup: (index: number, group: FilterGroup) => void;
  onRemoveGroup: (index: number) => void;
  onAddCondition: (groupIndex: number) => void;
  onRemoveCondition: (groupIndex: number, conditionIndex: number) => void;
  onUpdateCondition: (
    groupIndex: number,
    conditionIndex: number,
    condition: FilterCondition
  ) => void;
}

function FilterGroupComponent({
  group,
  groupIndex,
  fields,
  onUpdateGroup,
  onRemoveGroup,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
}: FilterGroupComponentProps) {
  const handleLogicChange = (logic: "AND" | "OR") => {
    onUpdateGroup(groupIndex, { ...group, logic });
  };

  return (
    <div className="border rounded-lg p-3 space-y-3 bg-gray-50">
      {/* Group Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700">
            Nhóm {groupIndex + 1}
          </span>
          <select
            value={group.logic}
            onChange={(e) => handleLogicChange(e.target.value as "AND" | "OR")}
            className="h-7 px-2 border border-gray-200 rounded text-xs bg-white"
          >
            <option value="AND">VÀ (AND)</option>
            <option value="OR">HOẶC (OR)</option>
          </select>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemoveGroup(groupIndex)}
          className="h-7 w-7 p-0 text-gray-500 hover:text-red-600"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Conditions */}
      <div className="space-y-2">
        {group.conditions.map((condition, conditionIndex) => (
          <FilterConditionComponent
            key={conditionIndex}
            condition={condition}
            groupIndex={groupIndex}
            conditionIndex={conditionIndex}
            fields={fields}
            onUpdateCondition={onUpdateCondition}
            onRemoveCondition={onRemoveCondition}
          />
        ))}
      </div>

      {/* Add Condition Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAddCondition(groupIndex)}
        className="w-full gap-2 h-8 text-xs"
      >
        <Plus className="w-3 h-3" />
        Thêm điều kiện
      </Button>
    </div>
  );
}

/* ============================================================
 * Filter Condition Component
 * ============================================================ */

interface FilterConditionComponentProps {
  condition: FilterCondition;
  groupIndex: number;
  conditionIndex: number;
  fields: Array<{ value: string; label: string; type?: string }>;
  onUpdateCondition: (
    groupIndex: number,
    conditionIndex: number,
    condition: FilterCondition
  ) => void;
  onRemoveCondition: (groupIndex: number, conditionIndex: number) => void;
}

function FilterConditionComponent({
  condition,
  groupIndex,
  conditionIndex,
  fields,
  onUpdateCondition,
  onRemoveCondition,
}: FilterConditionComponentProps) {
  const handleFieldChange = (field: string) => {
    const fieldDef = fields.find((f) => f.value === field);
    onUpdateCondition(groupIndex, conditionIndex, {
      ...condition,
      field,
      label: fieldDef?.label,
    });
  };

  const handleOperatorChange = (operator: FilterOperator) => {
    onUpdateCondition(groupIndex, conditionIndex, {
      ...condition,
      operator,
    });
  };

  const handleValueChange = (value: unknown) => {
    onUpdateCondition(groupIndex, conditionIndex, {
      ...condition,
      value,
    });
  };

  const needsValue =
    condition.operator !== "is_empty" &&
    condition.operator !== "is_not_empty";

  return (
    <div className="flex items-start gap-2 bg-white p-2 rounded border">
      {/* Field */}
      <select
        value={condition.field}
        onChange={(e) => handleFieldChange(e.target.value)}
        className="flex-1 h-8 px-2 border border-gray-200 rounded text-xs bg-white"
      >
        <option value="">Chọn trường</option>
        {fields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>

      {/* Operator */}
      <select
        value={condition.operator}
        onChange={(e) => handleOperatorChange(e.target.value as FilterOperator)}
        className="flex-1 h-8 px-2 border border-gray-200 rounded text-xs bg-white"
      >
        {OPERATORS.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {/* Value */}
      {needsValue && (
        <Input
          type="text"
          value={String(condition.value || "")}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="Giá trị"
          className="flex-1 h-8 text-xs"
        />
      )}

      {/* Remove Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemoveCondition(groupIndex, conditionIndex)}
        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 flex-shrink-0"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}

/* ============================================================
 * Simple Filter Bar
 * ============================================================ */

export interface SimpleFilterBarProps {
  filters: Record<string, unknown>;
  onFilterChange: (key: string, value: unknown) => void;
  onClear: () => void;
  fields: Array<{
    key: string;
    label: string;
    type: "text" | "select" | "date";
    options?: Array<{ value: string; label: string }>;
  }>;
  className?: string;
}

export function SimpleFilterBar({
  filters,
  onFilterChange,
  onClear,
  fields,
  className = "",
}: SimpleFilterBarProps) {
  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== "");

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {fields.map((field) => {
        if (field.type === "select" && field.options) {
          return (
            <select
              key={field.key}
              value={String(filters[field.key] || "")}
              onChange={(e) => onFilterChange(field.key, e.target.value || undefined)}
              className="h-9 px-3 border border-gray-200 rounded-md text-sm bg-white"
            >
              <option value="">{field.label}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }

        return (
          <Input
            key={field.key}
            type={field.type}
            value={String(filters[field.key] || "")}
            onChange={(e) => onFilterChange(field.key, e.target.value || undefined)}
            placeholder={field.label}
            className="w-48 h-9"
          />
        );
      })}

      {hasFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <X className="w-4 h-4 mr-1" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
