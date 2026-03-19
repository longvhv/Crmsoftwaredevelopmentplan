/**
 * BarChartCard Component
 * 
 * Reusable bar chart component using Recharts
 * 
 * Features:
 * - Responsive bar chart
 * - Customizable colors and layout
 * - Tooltip and legend support
 * - Loading and empty states
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 167/400)
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartCard } from './ChartCard';

export interface BarChartDataItem {
  /** X-axis label */
  name: string;
  /** Data values (key-value pairs) */
  [key: string]: string | number;
}

export interface BarChartCardProps {
  /** Chart title */
  title: string;
  /** Optional description */
  description?: string;
  /** Chart data */
  data: BarChartDataItem[];
  /** Data keys to display */
  dataKeys: { key: string; color?: string; name?: string }[];
  /** Loading state */
  isLoading?: boolean;
  /** Additional actions in header */
  actions?: React.ReactNode;
  /** Chart height */
  height?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Show grid */
  showGrid?: boolean;
  /** Stack bars */
  stacked?: boolean;
  /** Additional className */
  className?: string;
  /** X-axis label */
  xAxisLabel?: string;
  /** Y-axis label */
  yAxisLabel?: string;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  description,
  data,
  dataKeys,
  isLoading = false,
  actions,
  height = 300,
  showLegend = true,
  showGrid = true,
  stacked = false,
  className,
  xAxisLabel,
  yAxisLabel
}) => {
  const isEmpty = !data || data.length === 0;

  return (
    <ChartCard
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={isEmpty}
      actions={actions}
      className={className}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
          <XAxis
            dataKey="name"
            className="text-xs"
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis
            className="text-xs"
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              color: 'hsl(var(--popover-foreground))'
            }}
          />
          {showLegend && <Legend />}
          {dataKeys.map((item, index) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              fill={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              name={item.name || item.key}
              stackId={stacked ? 'stack' : undefined}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default BarChartCard;
