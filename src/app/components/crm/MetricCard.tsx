/**
 * MetricCard Component
 * 
 * Display key metrics with comparison and sparkline
 * 
 * Features:
 * - Large metric display
 * - Comparison with previous period
 * - Optional mini chart
 * - Color-coded trends
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 176/400)
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export interface MetricCardProps {
  /** Metric title */
  title: string;
  /** Current value */
  value: string | number;
  /** Previous period value for comparison */
  previousValue?: number;
  /** Optional description */
  description?: string;
  /** Icon */
  icon?: LucideIcon;
  /** Format as currency */
  isCurrency?: boolean;
  /** Format as percentage */
  isPercentage?: boolean;
  /** Sparkline data */
  chartData?: { value: number }[];
  /** Chart color */
  chartColor?: string;
  /** Additional className */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  previousValue,
  description,
  icon: Icon,
  isCurrency = false,
  isPercentage = false,
  chartData,
  chartColor = '#3b82f6',
  className,
  isLoading = false
}) => {
  const calculateChange = () => {
    if (previousValue === undefined || previousValue === 0) return null;
    
    const currentNum = typeof value === 'string' ? parseFloat(value) : value;
    const change = ((currentNum - previousValue) / previousValue) * 100;
    
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      isNeutral: change === 0
    };
  };

  const change = calculateChange();

  const formatValue = (val: string | number) => {
    if (isCurrency) {
      return typeof val === 'number' ? `$${val.toLocaleString()}` : val;
    }
    if (isPercentage) {
      return `${val}%`;
    }
    return val;
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-12 bg-muted rounded animate-pulse" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{formatValue(value)}</div>
              {change && !change.isNeutral && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    change.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {change.isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{change.value}%</span>
                </div>
              )}
            </div>

            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}

            {chartData && chartData.length > 0 && (
              <div className="mt-4 h-[60px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={chartColor}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {previousValue !== undefined && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <span>Previous: {formatValue(previousValue)}</span>
                <ArrowRight className="h-3 w-3" />
                <span>Current: {formatValue(value)}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
