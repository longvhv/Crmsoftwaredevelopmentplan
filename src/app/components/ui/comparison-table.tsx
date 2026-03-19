import * as React from "react";
import { cn } from "./utils";
import { Check, X, Minus, Info } from "lucide-react";

/* ============================================================
 * COMPARISON TABLE - Side-by-side data comparison
 * ============================================================
 * Compare multiple items with visual indicators
 */

export type ComparisonValue = string | number | boolean | null | undefined;

export interface ComparisonRow {
  id: string;
  label: string;
  values: ComparisonValue[];
  description?: string;
  highlight?: boolean;
}

export interface ComparisonColumn {
  id: string;
  label: string;
  highlighted?: boolean;
  badge?: string;
}

export interface ComparisonTableProps {
  /**
   * Column definitions
   */
  columns: ComparisonColumn[];
  
  /**
   * Row data
   */
  rows: ComparisonRow[];
  
  /**
   * Render custom cell content
   */
  renderCell?: (value: ComparisonValue, row: ComparisonRow, column: ComparisonColumn) => React.ReactNode;
  
  /**
   * Show header
   * @default true
   */
  showHeader?: boolean;
  
  /**
   * Sticky header
   * @default false
   */
  stickyHeader?: boolean;
  
  /**
   * Compact mode
   * @default false
   */
  compact?: boolean;
  
  /**
   * Show row hover
   * @default true
   */
  showRowHover?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * DEFAULT CELL RENDERER
 * ============================================================ */

function DefaultCellContent({ value }: { value: ComparisonValue }) {
  if (value === null || value === undefined) {
    return <Minus className="w-5 h-5 text-muted-foreground" />;
  }
  
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-green-600" />
    ) : (
      <X className="w-5 h-5 text-red-600" />
    );
  }
  
  return <span>{String(value)}</span>;
}

/* ============================================================
 * COMPARISON TABLE COMPONENT
 * ============================================================ */

export function ComparisonTable({
  columns,
  rows,
  renderCell,
  showHeader = true,
  stickyHeader = false,
  compact = false,
  showRowHover = true,
  className,
}: ComparisonTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        {/* Header */}
        {showHeader && (
          <thead
            className={cn(
              'bg-[var(--muted)]/30 border-b-2 border-border',
              stickyHeader && 'sticky top-0 z-10'
            )}
          >
            <tr>
              <th
                className={cn(
                  'text-left font-semibold text-sm border-r border-border bg-background',
                  compact ? 'px-3 py-2' : 'px-4 py-3'
                )}
              >
                Features
              </th>
              
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'text-center font-semibold border-r border-border last:border-r-0',
                    compact ? 'px-3 py-2' : 'px-4 py-3',
                    column.highlighted && 'bg-primary/5 border-primary/20'
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{column.label}</span>
                    {column.badge && (
                      <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                        {column.badge}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        )}
        
        {/* Body */}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={cn(
                'border-b border-border',
                showRowHover && 'hover:bg-[var(--muted)]/20 transition-colors',
                row.highlight && 'bg-amber-50/50'
              )}
            >
              {/* Row Label */}
              <td
                className={cn(
                  'border-r border-border bg-[var(--muted)]/10 font-medium',
                  compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{row.label}</span>
                  {row.description && (
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title={row.description}
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
              
              {/* Values */}
              {row.values.map((value, colIndex) => {
                const column = columns[colIndex];
                
                return (
                  <td
                    key={`${row.id}-${column.id}`}
                    className={cn(
                      'text-center border-r border-border last:border-r-0',
                      compact ? 'px-3 py-2' : 'px-4 py-3',
                      column.highlighted && 'bg-primary/5'
                    )}
                  >
                    {renderCell ? (
                      renderCell(value, row, column)
                    ) : (
                      <DefaultCellContent value={value} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
 * SIDE-BY-SIDE COMPARISON
 * ============================================================ */

export interface ComparisonItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  highlighted?: boolean;
  specs: Record<string, ComparisonValue>;
}

export interface SideBySideComparisonProps {
  items: ComparisonItem[];
  specLabels: Record<string, string>;
  renderSpec?: (key: string, value: ComparisonValue) => React.ReactNode;
  onSelect?: (itemId: string) => void;
  className?: string;
}

export function SideBySideComparison({
  items,
  specLabels,
  renderSpec,
  onSelect,
  className,
}: SideBySideComparisonProps) {
  const allSpecs = Object.keys(specLabels);
  
  return (
    <div className={cn('grid gap-4', `grid-cols-${Math.min(items.length, 3)}`, className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'border rounded-lg overflow-hidden transition-all',
            item.highlighted && 'ring-2 ring-primary border-primary',
            onSelect && 'hover:shadow-lg cursor-pointer'
          )}
          onClick={() => onSelect?.(item.id)}
        >
          {/* Header */}
          <div className={cn('p-4 border-b', item.highlighted ? 'bg-primary/5' : 'bg-[var(--muted)]/30')}>
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            
            <div className="text-center">
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              )}
              {item.badge && (
                <span className="inline-block mt-2 px-3 py-1 text-xs bg-primary text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          </div>
          
          {/* Specs */}
          <div className="divide-y">
            {allSpecs.map((specKey) => {
              const value = item.specs[specKey];
              
              return (
                <div key={specKey} className="px-4 py-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {specLabels[specKey]}
                  </div>
                  <div className="font-medium">
                    {renderSpec ? (
                      renderSpec(specKey, value)
                    ) : (
                      <DefaultCellContent value={value} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * DIFF VIEWER
 * ============================================================ */

export interface DiffItem {
  label: string;
  before: ComparisonValue;
  after: ComparisonValue;
  changed?: boolean;
}

export interface DiffViewerProps {
  items: DiffItem[];
  beforeLabel?: string;
  afterLabel?: string;
  showUnchanged?: boolean;
  highlightChanges?: boolean;
  className?: string;
}

export function DiffViewer({
  items,
  beforeLabel = 'Before',
  afterLabel = 'After',
  showUnchanged = true,
  highlightChanges = true,
  className,
}: DiffViewerProps) {
  const displayItems = showUnchanged ? items : items.filter((item) => item.changed);
  
  return (
    <div className={cn('border border-border rounded-lg overflow-hidden', className)}>
      <table className="w-full">
        <thead className="bg-[var(--muted)]/30 border-b border-border">
          <tr>
            <th className="text-left px-4 py-3 font-semibold">Field</th>
            <th className="text-left px-4 py-3 font-semibold border-l border-border w-1/3">
              {beforeLabel}
            </th>
            <th className="text-left px-4 py-3 font-semibold border-l border-border w-1/3">
              {afterLabel}
            </th>
          </tr>
        </thead>
        
        <tbody>
          {displayItems.map((item, index) => (
            <tr
              key={index}
              className={cn(
                'border-b border-border hover:bg-[var(--muted)]/20 transition-colors',
                highlightChanges && item.changed && 'bg-amber-50/30'
              )}
            >
              <td className="px-4 py-3 font-medium">
                {item.label}
                {item.changed && highlightChanges && (
                  <span className="ml-2 text-xs text-amber-600">(changed)</span>
                )}
              </td>
              
              <td
                className={cn(
                  'px-4 py-3 border-l border-border',
                  item.changed && 'line-through text-red-600'
                )}
              >
                <DefaultCellContent value={item.before} />
              </td>
              
              <td
                className={cn(
                  'px-4 py-3 border-l border-border',
                  item.changed && 'font-medium text-green-600'
                )}
              >
                <DefaultCellContent value={item.after} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
 * METRIC COMPARISON
 * ============================================================ */

export interface MetricComparison {
  label: string;
  values: number[];
  unit?: string;
  format?: (value: number) => string;
}

export interface MetricComparisonTableProps {
  metrics: MetricComparison[];
  columnLabels: string[];
  highlightBest?: boolean;
  highlightWorst?: boolean;
  className?: string;
}

export function MetricComparisonTable({
  metrics,
  columnLabels,
  highlightBest = false,
  highlightWorst = false,
  className,
}: MetricComparisonTableProps) {
  const getBestIndex = (values: number[]): number => {
    return values.indexOf(Math.max(...values));
  };
  
  const getWorstIndex = (values: number[]): number => {
    return values.indexOf(Math.min(...values));
  };
  
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead className="bg-[var(--muted)]/30 border-b-2 border-border">
          <tr>
            <th className="text-left px-4 py-3 font-semibold border-r border-border">
              Metric
            </th>
            {columnLabels.map((label, index) => (
              <th
                key={index}
                className="text-center px-4 py-3 font-semibold border-r border-border last:border-r-0"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {metrics.map((metric, rowIndex) => {
            const bestIndex = getBestIndex(metric.values);
            const worstIndex = getWorstIndex(metric.values);
            
            return (
              <tr key={rowIndex} className="border-b border-border hover:bg-[var(--muted)]/20">
                <td className="px-4 py-3 font-medium border-r border-border bg-[var(--muted)]/10">
                  {metric.label}
                </td>
                
                {metric.values.map((value, colIndex) => {
                  const isBest = highlightBest && colIndex === bestIndex;
                  const isWorst = highlightWorst && colIndex === worstIndex;
                  const formatted = metric.format ? metric.format(value) : String(value);
                  
                  return (
                    <td
                      key={colIndex}
                      className={cn(
                        'text-center px-4 py-3 border-r border-border last:border-r-0 font-medium',
                        isBest && 'bg-green-50 text-green-700',
                        isWorst && 'bg-red-50 text-red-700'
                      )}
                    >
                      {formatted}
                      {metric.unit && <span className="text-muted-foreground ml-1">{metric.unit}</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
