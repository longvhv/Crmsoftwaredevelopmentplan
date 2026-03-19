import * as React from "react";
import { cn } from "./utils";
import { Plus, X, Filter, Save, Trash2, ChevronDown } from "lucide-react";

/* ============================================================
 * ADVANCED FILTER - Multi-condition filtering with operators
 * ============================================================
 * Supports AND/OR logic, multiple operators, saved filters
 */

export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'in'
  | 'notIn'
  | 'isEmpty'
  | 'isNotEmpty';

export type FilterLogic = 'AND' | 'OR';

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  value2?: any; // For "between" operator
}

export interface FilterGroup {
  id: string;
  logic: FilterLogic;
  conditions: FilterCondition[];
}

export interface SavedFilter {
  id: string;
  name: string;
  group: FilterGroup;
  createdAt: Date;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  operators?: FilterOperator[];
  options?: { value: any; label: string }[];
}

export interface AdvancedFilterProps {
  /**
   * Available fields to filter on
   */
  fields: FilterField[];
  
  /**
   * Current filter group
   */
  value?: FilterGroup;
  
  /**
   * Filter change handler
   */
  onChange?: (group: FilterGroup) => void;
  
  /**
   * Saved filters
   */
  savedFilters?: SavedFilter[];
  
  /**
   * Save filter handler
   */
  onSaveFilter?: (name: string, group: FilterGroup) => void;
  
  /**
   * Delete saved filter handler
   */
  onDeleteFilter?: (id: string) => void;
  
  /**
   * Load saved filter handler
   */
  onLoadFilter?: (filter: SavedFilter) => void;
  
  /**
   * Show saved filters section
   * @default true
   */
  showSavedFilters?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * OPERATOR LABELS
 * ============================================================ */

const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'equals',
  notEquals: 'not equals',
  contains: 'contains',
  notContains: 'does not contain',
  startsWith: 'starts with',
  endsWith: 'ends with',
  greaterThan: 'greater than',
  lessThan: 'less than',
  greaterThanOrEqual: 'greater than or equal',
  lessThanOrEqual: 'less than or equal',
  between: 'between',
  in: 'in',
  notIn: 'not in',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
};

/* ============================================================
 * DEFAULT OPERATORS BY TYPE
 * ============================================================ */

const DEFAULT_OPERATORS: Record<FilterField['type'], FilterOperator[]> = {
  text: ['equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
  number: ['equals', 'notEquals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual', 'between', 'isEmpty', 'isNotEmpty'],
  date: ['equals', 'notEquals', 'greaterThan', 'lessThan', 'between', 'isEmpty', 'isNotEmpty'],
  select: ['equals', 'notEquals', 'in', 'notIn', 'isEmpty', 'isNotEmpty'],
  boolean: ['equals', 'notEquals'],
};

/* ============================================================
 * UTILITIES
 * ============================================================ */

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createEmptyCondition(field: FilterField): FilterCondition {
  const operators = field.operators || DEFAULT_OPERATORS[field.type];
  return {
    id: generateId(),
    field: field.key,
    operator: operators[0],
    value: '',
  };
}

function createEmptyGroup(): FilterGroup {
  return {
    id: generateId(),
    logic: 'AND',
    conditions: [],
  };
}

/* ============================================================
 * FILTER CONDITION COMPONENT
 * ============================================================ */

interface FilterConditionRowProps {
  condition: FilterCondition;
  fields: FilterField[];
  onUpdate: (condition: FilterCondition) => void;
  onRemove: () => void;
  showRemove: boolean;
}

const FilterConditionRow: React.FC<FilterConditionRowProps> = ({
  condition,
  fields,
  onUpdate,
  onRemove,
  showRemove,
}) => {
  const field = fields.find((f) => f.key === condition.field) || fields[0];
  const operators = field.operators || DEFAULT_OPERATORS[field.type];
  
  const handleFieldChange = (fieldKey: string) => {
    const newField = fields.find((f) => f.key === fieldKey);
    if (newField) {
      const newOperators = newField.operators || DEFAULT_OPERATORS[newField.type];
      onUpdate({
        ...condition,
        field: fieldKey,
        operator: newOperators[0],
        value: '',
        value2: undefined,
      });
    }
  };
  
  const handleOperatorChange = (operator: FilterOperator) => {
    onUpdate({
      ...condition,
      operator,
      value: '',
      value2: undefined,
    });
  };
  
  const handleValueChange = (value: any) => {
    onUpdate({ ...condition, value });
  };
  
  const handleValue2Change = (value2: any) => {
    onUpdate({ ...condition, value2 });
  };
  
  const needsValue = !['isEmpty', 'isNotEmpty'].includes(condition.operator);
  const needsValue2 = condition.operator === 'between';
  
  return (
    <div className="flex items-center gap-2">
      {/* Field Select */}
      <select
        value={condition.field}
        onChange={(e) => handleFieldChange(e.target.value)}
        className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {fields.map((f) => (
          <option key={f.key} value={f.key}>
            {f.label}
          </option>
        ))}
      </select>
      
      {/* Operator Select */}
      <select
        value={condition.operator}
        onChange={(e) => handleOperatorChange(e.target.value as FilterOperator)}
        className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {operators.map((op) => (
          <option key={op} value={op}>
            {OPERATOR_LABELS[op]}
          </option>
        ))}
      </select>
      
      {/* Value Input */}
      {needsValue && (
        <div className="flex-1">
          {field.type === 'select' && field.options ? (
            condition.operator === 'in' || condition.operator === 'notIn' ? (
              <input
                type="text"
                value={condition.value}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder="value1, value2, ..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <select
                value={condition.value}
                onChange={(e) => handleValueChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select...</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )
          ) : field.type === 'boolean' ? (
            <select
              value={condition.value}
              onChange={(e) => handleValueChange(e.target.value === 'true')}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select...</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : (
            <input
              type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
              value={condition.value}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="Value"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          )}
        </div>
      )}
      
      {/* Value2 Input (for "between") */}
      {needsValue2 && (
        <>
          <span className="text-sm text-muted-foreground">and</span>
          <input
            type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
            value={condition.value2 || ''}
            onChange={(e) => handleValue2Change(e.target.value)}
            placeholder="Value"
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </>
      )}
      
      {/* Remove Button */}
      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          aria-label="Remove condition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

/* ============================================================
 * ADVANCED FILTER COMPONENT
 * ============================================================ */

export function AdvancedFilter({
  fields,
  value,
  onChange,
  savedFilters = [],
  onSaveFilter,
  onDeleteFilter,
  onLoadFilter,
  showSavedFilters = true,
  className,
}: AdvancedFilterProps) {
  const [group, setGroup] = React.useState<FilterGroup>(
    value || createEmptyGroup()
  );
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [filterName, setFilterName] = React.useState('');
  const [savedFiltersOpen, setSavedFiltersOpen] = React.useState(false);
  
  React.useEffect(() => {
    if (value) {
      setGroup(value);
    }
  }, [value]);
  
  const handleGroupChange = (newGroup: FilterGroup) => {
    setGroup(newGroup);
    onChange?.(newGroup);
  };
  
  const addCondition = () => {
    handleGroupChange({
      ...group,
      conditions: [...group.conditions, createEmptyCondition(fields[0])],
    });
  };
  
  const updateCondition = (index: number, condition: FilterCondition) => {
    const newConditions = [...group.conditions];
    newConditions[index] = condition;
    handleGroupChange({ ...group, conditions: newConditions });
  };
  
  const removeCondition = (index: number) => {
    handleGroupChange({
      ...group,
      conditions: group.conditions.filter((_, i) => i !== index),
    });
  };
  
  const toggleLogic = () => {
    handleGroupChange({
      ...group,
      logic: group.logic === 'AND' ? 'OR' : 'AND',
    });
  };
  
  const handleSave = () => {
    if (filterName.trim() && onSaveFilter) {
      onSaveFilter(filterName, group);
      setFilterName('');
      setSaveDialogOpen(false);
    }
  };
  
  const handleLoad = (filter: SavedFilter) => {
    handleGroupChange(filter.group);
    onLoadFilter?.(filter);
    setSavedFiltersOpen(false);
  };
  
  const clear = () => {
    handleGroupChange(createEmptyGroup());
  };
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Advanced Filters</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {showSavedFilters && savedFilters.length > 0 && (
            <button
              type="button"
              onClick={() => setSavedFiltersOpen(!savedFiltersOpen)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-[var(--muted)] transition-colors flex items-center gap-1"
            >
              <span>Saved Filters</span>
              <ChevronDown className={cn('w-4 h-4 transition-transform', savedFiltersOpen && 'rotate-180')} />
            </button>
          )}
          
          {onSaveFilter && group.conditions.length > 0 && (
            <button
              type="button"
              onClick={() => setSaveDialogOpen(true)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-[var(--muted)] transition-colors flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          )}
          
          {group.conditions.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      {/* Saved Filters Dropdown */}
      {savedFiltersOpen && (
        <div className="border border-border rounded-lg p-4 bg-[var(--muted)]/30 space-y-2">
          <h4 className="text-sm font-medium mb-2">Saved Filters</h4>
          {savedFilters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between p-2 hover:bg-background rounded transition-colors"
            >
              <button
                type="button"
                onClick={() => handleLoad(filter)}
                className="flex-1 text-left text-sm"
              >
                {filter.name}
              </button>
              {onDeleteFilter && (
                <button
                  type="button"
                  onClick={() => onDeleteFilter(filter.id)}
                  className="p-1 text-muted-foreground hover:text-red-600 transition-colors"
                  aria-label="Delete filter"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Filter Conditions */}
      <div className="border border-border rounded-lg p-4 space-y-3">
        {group.conditions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No filters applied. Click "Add Condition" to start filtering.
          </div>
        ) : (
          <>
            {group.conditions.map((condition, index) => (
              <div key={condition.id}>
                {index > 0 && (
                  <div className="flex items-center justify-center my-2">
                    <button
                      type="button"
                      onClick={toggleLogic}
                      className="px-3 py-1 text-xs font-medium border border-border rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      {group.logic}
                    </button>
                  </div>
                )}
                <FilterConditionRow
                  condition={condition}
                  fields={fields}
                  onUpdate={(c) => updateCondition(index, c)}
                  onRemove={() => removeCondition(index)}
                  showRemove={group.conditions.length > 1}
                />
              </div>
            ))}
          </>
        )}
        
        {/* Add Condition Button */}
        <button
          type="button"
          onClick={addCondition}
          className="w-full py-2 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Condition</span>
        </button>
      </div>
      
      {/* Save Dialog */}
      {saveDialogOpen && (
        <div className="border border-border rounded-lg p-4 bg-[var(--muted)]/30 space-y-3">
          <h4 className="text-sm font-medium">Save Filter</h4>
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Filter name"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setSaveDialogOpen(false)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-[var(--muted)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!filterName.trim()}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * FILTER HOOK
 * ============================================================ */

export interface UseAdvancedFilterOptions {
  fields: FilterField[];
  storageKey?: string;
}

export interface UseAdvancedFilterReturn {
  group: FilterGroup;
  setGroup: (group: FilterGroup) => void;
  savedFilters: SavedFilter[];
  saveFilter: (name: string, group: FilterGroup) => void;
  deleteFilter: (id: string) => void;
  loadFilter: (filter: SavedFilter) => void;
  clearFilters: () => void;
  applyFilters: <T>(data: T[]) => T[];
}

export function useAdvancedFilter({
  fields,
  storageKey,
}: UseAdvancedFilterOptions): UseAdvancedFilterReturn {
  const [group, setGroup] = React.useState<FilterGroup>(createEmptyGroup());
  const [savedFilters, setSavedFilters] = React.useState<SavedFilter[]>(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`${storageKey}-saved-filters`);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  
  const saveSavedFilters = React.useCallback(
    (filters: SavedFilter[]) => {
      if (storageKey) {
        try {
          localStorage.setItem(`${storageKey}-saved-filters`, JSON.stringify(filters));
        } catch (err) {
          console.error('Failed to save filters:', err);
        }
      }
      setSavedFilters(filters);
    },
    [storageKey]
  );
  
  const saveFilter = React.useCallback(
    (name: string, filterGroup: FilterGroup) => {
      const newFilter: SavedFilter = {
        id: generateId(),
        name,
        group: filterGroup,
        createdAt: new Date(),
      };
      saveSavedFilters([...savedFilters, newFilter]);
    },
    [savedFilters, saveSavedFilters]
  );
  
  const deleteFilter = React.useCallback(
    (id: string) => {
      saveSavedFilters(savedFilters.filter((f) => f.id !== id));
    },
    [savedFilters, saveSavedFilters]
  );
  
  const loadFilter = React.useCallback((filter: SavedFilter) => {
    setGroup(filter.group);
  }, []);
  
  const clearFilters = React.useCallback(() => {
    setGroup(createEmptyGroup());
  }, []);
  
  const applyFilters = React.useCallback(
    <T,>(data: T[]): T[] => {
      if (group.conditions.length === 0) return data;
      
      return data.filter((item) => {
        const results = group.conditions.map((condition) => {
          const value = (item as any)[condition.field];
          const conditionValue = condition.value;
          
          switch (condition.operator) {
            case 'equals':
              return value === conditionValue;
            case 'notEquals':
              return value !== conditionValue;
            case 'contains':
              return String(value).toLowerCase().includes(String(conditionValue).toLowerCase());
            case 'notContains':
              return !String(value).toLowerCase().includes(String(conditionValue).toLowerCase());
            case 'startsWith':
              return String(value).toLowerCase().startsWith(String(conditionValue).toLowerCase());
            case 'endsWith':
              return String(value).toLowerCase().endsWith(String(conditionValue).toLowerCase());
            case 'greaterThan':
              return Number(value) > Number(conditionValue);
            case 'lessThan':
              return Number(value) < Number(conditionValue);
            case 'greaterThanOrEqual':
              return Number(value) >= Number(conditionValue);
            case 'lessThanOrEqual':
              return Number(value) <= Number(conditionValue);
            case 'between':
              return Number(value) >= Number(conditionValue) && Number(value) <= Number(condition.value2);
            case 'in':
              return String(conditionValue).split(',').map((v) => v.trim()).includes(String(value));
            case 'notIn':
              return !String(conditionValue).split(',').map((v) => v.trim()).includes(String(value));
            case 'isEmpty':
              return value === null || value === undefined || value === '';
            case 'isNotEmpty':
              return value !== null && value !== undefined && value !== '';
            default:
              return true;
          }
        });
        
        return group.logic === 'AND' ? results.every(Boolean) : results.some(Boolean);
      });
    },
    [group]
  );
  
  return {
    group,
    setGroup,
    savedFilters,
    saveFilter,
    deleteFilter,
    loadFilter,
    clearFilters,
    applyFilters,
  };
}
