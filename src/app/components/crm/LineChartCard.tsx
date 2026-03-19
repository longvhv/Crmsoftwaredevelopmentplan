/**
 * LineChartCard Component
 * 
 * Reusable line chart component using Recharts
 * 
 * Features:
 * - Responsive line chart
 * - Multiple line series support
 * - Customizable colors and styles
 * - Tooltip and legend support
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 168/400)
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartCard } from './ChartCard';

export interface LineChartDataItem {
  /** X-axis label */
  name: string;
  /** Data values (key-value pairs) */
  [key: string]: string | number;
}

export interface LineChartCardProps {
  /** Chart title */
  title: string;
  /** Optional description */
  description?: string;
  /** Chart data */
  data: LineChartDataItem[];
  /** Data keys to display */
  dataKeys: { key: string; color?: string; name?: string; strokeWidth?: number }[];
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
  /** Show dots on lines */
  showDots?: boolean;
  /** Line type */
  lineType?: 'monotone' | 'linear' | 'step';
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

export const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  description,
  data,
  dataKeys,
  isLoading = false,
  actions,
  height = 300,
  showLegend = true,
  showGrid = true,
  showDots = true,
  lineType = 'monotone',
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
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            <Line
              key={item.key}
              type={lineType}
              dataKey={item.key}
              stroke={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              name={item.name || item.key}
              strokeWidth={item.strokeWidth || 2}
              dot={showDots}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default LineChartCard;
