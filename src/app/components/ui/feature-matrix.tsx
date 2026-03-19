import * as React from "react";
import { cn } from "./utils";
import { Check, X, Minus, Info, Star } from "lucide-react";

/* ============================================================
 * FEATURE MATRIX - Feature comparison across products
 * ============================================================
 * Compare features, plans, or products in a detailed matrix
 */

export type FeatureValue = boolean | string | number | 'partial' | null;

export interface Feature {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  badge?: string;
  highlighted?: boolean;
  mostPopular?: boolean;
}

export interface FeatureMatrixData {
  features: Feature[];
  products: Product[];
  values: Record<string, Record<string, FeatureValue>>;
}

export interface FeatureMatrixProps {
  /**
   * Matrix data
   */
  data: FeatureMatrixData;
  
  /**
   * Group by category
   * @default true
   */
  groupByCategory?: boolean;
  
  /**
   * Show category headers
   * @default true
   */
  showCategoryHeaders?: boolean;
  
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
   * Custom value renderer
   */
  renderValue?: (value: FeatureValue, feature: Feature, product: Product) => React.ReactNode;
  
  /**
   * Feature info click handler
   */
  onFeatureInfoClick?: (feature: Feature) => void;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * VALUE RENDERER
 * ============================================================ */

function DefaultValueRenderer({ value }: { value: FeatureValue }) {
  if (value === null || value === undefined) {
    return <Minus className="w-5 h-5 text-muted-foreground mx-auto" />;
  }
  
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-green-600 mx-auto" />
    ) : (
      <X className="w-5 h-5 text-red-400 mx-auto" />
    );
  }
  
  if (value === 'partial') {
    return <Minus className="w-5 h-5 text-amber-500 mx-auto" />;
  }
  
  return <span className="text-sm font-medium">{String(value)}</span>;
}

/* ============================================================
 * FEATURE MATRIX COMPONENT
 * ============================================================ */

export function FeatureMatrix({
  data,
  groupByCategory = true,
  showCategoryHeaders = true,
  stickyHeader = false,
  compact = false,
  renderValue,
  onFeatureInfoClick,
  className,
}: FeatureMatrixProps) {
  // Group features by category
  const groupedFeatures = React.useMemo(() => {
    if (!groupByCategory) {
      return { '': data.features };
    }
    
    const groups: Record<string, Feature[]> = {};
    
    for (const feature of data.features) {
      const category = feature.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(feature);
    }
    
    return groups;
  }, [data.features, groupByCategory]);
  
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        {/* Header */}
        <thead
          className={cn(
            'bg-[var(--muted)]/30 border-b-2 border-border',
            stickyHeader && 'sticky top-0 z-10'
          )}
        >
          <tr>
            <th
              className={cn(
                'text-left font-semibold border-r border-border bg-background',
                compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'
              )}
            >
              Features
            </th>
            
            {data.products.map((product) => (
              <th
                key={product.id}
                className={cn(
                  'text-center font-semibold border-r border-border last:border-r-0',
                  compact ? 'px-3 py-2' : 'px-4 py-3',
                  product.highlighted && 'bg-primary/5 border-primary/20'
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  {product.mostPopular && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      Popular
                    </span>
                  )}
                  {product.badge && !product.mostPopular && (
                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full font-semibold">
                      {product.badge}
                    </span>
                  )}
                  <span className={compact ? 'text-sm' : ''}>{product.name}</span>
                  {product.subtitle && (
                    <span className="text-xs text-muted-foreground font-normal">
                      {product.subtitle}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Body */}
        <tbody>
          {Object.entries(groupedFeatures).map(([category, features]) => (
            <React.Fragment key={category}>
              {/* Category Header */}
              {showCategoryHeaders && category && (
                <tr className="bg-[var(--muted)]/50">
                  <td
                    colSpan={data.products.length + 1}
                    className={cn(
                      'font-semibold text-primary border-t-2 border-border',
                      compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'
                    )}
                  >
                    {category}
                  </td>
                </tr>
              )}
              
              {/* Feature Rows */}
              {features.map((feature) => (
                <tr
                  key={feature.id}
                  className="border-b border-border hover:bg-[var(--muted)]/20 transition-colors"
                >
                  {/* Feature Name */}
                  <td
                    className={cn(
                      'border-r border-border bg-[var(--muted)]/10',
                      compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{feature.name}</span>
                      {feature.description && (
                        <button
                          type="button"
                          onClick={() => onFeatureInfoClick?.(feature)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title={feature.description}
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  
                  {/* Values */}
                  {data.products.map((product) => {
                    const value = data.values[feature.id]?.[product.id];
                    
                    return (
                      <td
                        key={product.id}
                        className={cn(
                          'text-center border-r border-border last:border-r-0',
                          compact ? 'px-3 py-2' : 'px-4 py-3',
                          product.highlighted && 'bg-primary/5'
                        )}
                      >
                        {renderValue ? (
                          renderValue(value, feature, product)
                        ) : (
                          <DefaultValueRenderer value={value} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
 * SIMPLE FEATURE MATRIX
 * ============================================================ */

export interface SimpleFeature {
  name: string;
  values: (boolean | string)[];
}

export interface SimpleFeatureMatrixProps {
  columns: string[];
  features: SimpleFeature[];
  highlightColumn?: number;
  className?: string;
}

export function SimpleFeatureMatrix({
  columns,
  features,
  highlightColumn,
  className,
}: SimpleFeatureMatrixProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead className="bg-[var(--muted)]/30 border-b-2 border-border">
          <tr>
            <th className="text-left px-4 py-3 font-semibold border-r border-border">
              Feature
            </th>
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  'text-center px-4 py-3 font-semibold border-r border-border last:border-r-0',
                  highlightColumn === index && 'bg-primary/5'
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {features.map((feature, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border hover:bg-[var(--muted)]/20 transition-colors"
            >
              <td className="px-4 py-3 font-medium border-r border-border bg-[var(--muted)]/10">
                {feature.name}
              </td>
              
              {feature.values.map((value, colIndex) => (
                <td
                  key={colIndex}
                  className={cn(
                    'text-center px-4 py-3 border-r border-border last:border-r-0',
                    highlightColumn === colIndex && 'bg-primary/5'
                  )}
                >
                  {typeof value === 'boolean' ? (
                    value ? (
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-sm font-medium">{value}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
 * FEATURE CHECKLIST
 * ============================================================ */

export interface ChecklistItem {
  label: string;
  checked: boolean;
  description?: string;
}

export interface FeatureChecklistProps {
  title?: string;
  items: ChecklistItem[];
  variant?: 'default' | 'compact' | 'detailed';
  showProgress?: boolean;
  className?: string;
}

export function FeatureChecklist({
  title,
  items,
  variant = 'default',
  showProgress = false,
  className,
}: FeatureChecklistProps) {
  const checkedCount = items.filter((item) => item.checked).length;
  const progress = (checkedCount / items.length) * 100;
  
  return (
    <div className={cn('border rounded-lg p-6', className)}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {showProgress && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {checkedCount} / {items.length}
                </span>
              </div>
              <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      <ul className={cn('space-y-2', variant === 'compact' && 'space-y-1')}>
        {items.map((item, index) => (
          <li
            key={index}
            className={cn(
              'flex items-start gap-3',
              variant === 'detailed' && 'p-3 border border-border rounded-lg hover:bg-[var(--muted)]/30 transition-colors'
            )}
          >
            {item.checked ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            )}
            
            <div className="flex-1">
              <div
                className={cn(
                  variant === 'compact' ? 'text-sm' : '',
                  !item.checked && 'text-muted-foreground'
                )}
              >
                {item.label}
              </div>
              
              {variant === 'detailed' && item.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
 * FEATURE BADGE GRID
 * ============================================================ */

export interface FeatureBadge {
  label: string;
  icon?: React.ReactNode;
  available: boolean;
}

export interface FeatureBadgeGridProps {
  features: FeatureBadge[];
  columns?: number;
  className?: string;
}

export function FeatureBadgeGrid({
  features,
  columns = 3,
  className,
}: FeatureBadgeGridProps) {
  return (
    <div
      className={cn(
        'grid gap-3',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-3',
        columns === 4 && 'grid-cols-4',
        className
      )}
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors',
            feature.available
              ? 'border-green-200 bg-green-50/50 text-green-900'
              : 'border-gray-200 bg-gray-50 text-gray-400'
          )}
        >
          {feature.icon || (
            feature.available ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 flex-shrink-0" />
            )
          )}
          <span className="text-sm font-medium">{feature.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * FEATURE TIMELINE
 * ============================================================ */

export interface FeaturePhase {
  name: string;
  date: string;
  features: string[];
  status: 'completed' | 'current' | 'upcoming';
}

export interface FeatureTimelineProps {
  phases: FeaturePhase[];
  className?: string;
}

export function FeatureTimeline({ phases, className }: FeatureTimelineProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {phases.map((phase, index) => (
        <div key={index} className="flex gap-4">
          {/* Status Indicator */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
                phase.status === 'completed' && 'bg-green-500 text-white',
                phase.status === 'current' && 'bg-primary text-white ring-4 ring-primary/20',
                phase.status === 'upcoming' && 'bg-gray-200 text-gray-600'
              )}
            >
              {phase.status === 'completed' ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            
            {index < phases.length - 1 && (
              <div
                className={cn(
                  'w-0.5 h-full min-h-[40px] mt-2',
                  phase.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                )}
              />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 pb-6">
            <div className="flex items-baseline gap-3 mb-2">
              <h3 className="font-bold text-lg">{phase.name}</h3>
              <span className="text-sm text-muted-foreground">{phase.date}</span>
            </div>
            
            <ul className="space-y-1 text-sm">
              {phase.features.map((feature, fIndex) => (
                <li key={fIndex} className="flex items-start gap-2">
                  <Check
                    className={cn(
                      'w-4 h-4 flex-shrink-0 mt-0.5',
                      phase.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                    )}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
