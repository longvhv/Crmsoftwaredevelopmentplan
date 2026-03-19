/**
 * AreaChartCard Component
 * 
 * Reusable area chart component using Recharts
 * 
 * Features:
 * - Responsive area chart
 * - Multiple area series support
 * - Stacked or separated areas
 * - Gradient fill support
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 170/400)
 */

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartCard } from './ChartCard';

export interface AreaChartDataItem {
  /** X-axis label */
  name: string;
  /** Data values (key-value pairs) */
  [key: string]: string | number;
}

export interface AreaChartCardProps {
  /** Chart title */
  title: string;
  /** Optional description */
  description?: string;
  /** Chart data */
  data: AreaChartDataItem[];
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
  /** Stack areas */
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
];

export const AreaChartCard: React.FC<AreaChartCardProps> = ({
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
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {dataKeys.map((item, index) => {
              const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
              return (
                <linearGradient key={item.key} id={`gradient-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              );
            })}
          </defs>
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
            <Area
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              fill={`url(#gradient-${item.key})`}
              name={item.name || item.key}
              stackId={stacked ? 'stack' : undefined}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default AreaChartCard;
