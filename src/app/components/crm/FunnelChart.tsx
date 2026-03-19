/**
 * FunnelChart Component
 * 
 * Funnel visualization for conversion tracking
 * 
 * Features:
 * - Visual funnel representation
 * - Conversion rates between stages
 * - Color-coded stages
 * - Clickable stages
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 179/400)
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';
import { ChevronRight } from 'lucide-react';

export interface FunnelStage {
  /** Stage name */
  name: string;
  /** Stage value */
  value: number;
  /** Optional color */
  color?: string;
  /** Click handler */
  onClick?: () => void;
}

export interface FunnelChartProps {
  /** Chart title */
  title: string;
  /** Optional description */
  description?: string;
  /** Funnel stages */
  stages: FunnelStage[];
  /** Show conversion rates */
  showConversion?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Additional className */
  className?: string;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
];

export const FunnelChart: React.FC<FunnelChartProps> = ({
  title,
  description,
  stages,
  showConversion = true,
  isLoading = false,
  className
}) => {
  const maxValue = stages.length > 0 ? stages[0].value : 0;

  const getConversionRate = (index: number): number => {
    if (index === 0 || stages[index - 1].value === 0) return 100;
    return (stages[index].value / stages[index - 1].value) * 100;
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {stages.map((stage, index) => {
              const widthPercent = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
              const conversionRate = getConversionRate(index);
              const color = stage.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

              return (
                <div key={index} className="space-y-1">
                  <div
                    className={cn(
                      'relative rounded-lg transition-all duration-200',
                      stage.onClick && 'cursor-pointer hover:opacity-90'
                    )}
                    style={{
                      width: `${widthPercent}%`,
                      minWidth: '30%',
                      backgroundColor: color
                    }}
                    onClick={stage.onClick}
                  >
                    <div className="flex items-center justify-between px-4 py-3 text-white">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stage.name}</span>
                        {index < stages.length - 1 && (
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {showConversion && index > 0 && (
                          <span className="text-sm opacity-90">
                            {conversionRate.toFixed(1)}%
                          </span>
                        )}
                        <span className="font-semibold">
                          {stage.value.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Drop-off indicator */}
                  {index < stages.length - 1 && stages[index + 1].value < stage.value && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pl-4">
                      <span>
                        ↓ {(stage.value - stages[index + 1].value).toLocaleString()} lost
                      </span>
                      <span className="text-red-600">
                        (-{(((stage.value - stages[index + 1].value) / stage.value) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Summary */}
            {stages.length > 1 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall Conversion</span>
                  <span className="font-semibold">
                    {((stages[stages.length - 1].value / stages[0].value) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FunnelChart;
