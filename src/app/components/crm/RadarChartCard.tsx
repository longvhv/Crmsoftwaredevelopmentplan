/**
 * RadarChartCard Component
 * 
 * Radar/spider chart for multi-dimensional data comparison
 * 
 * Features:
 * - Multi-axis visualization
 * - Multiple series support
 * - Customizable colors
 * - Responsive design
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 180/400)
 */

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ChartCard } from './ChartCard';

export interface RadarChartDataItem {
  /** Category name */
  category: string;
  /** Data values (key-value pairs) */
  [key: string]: string | number;
}

export interface RadarChartCardProps {
  /** Chart title */
  title: string;
  /** Optional description */
  description?: string;
  /** Chart data */
  data: RadarChartDataItem[];
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

export const RadarChartCard: React.FC<RadarChartCardProps> = ({
  title,
  description,
  data,
  dataKeys,
  isLoading = false,
  actions,
  height = 400,
  showLegend = true,
  className
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
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="category" className="text-xs" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
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
            <Radar
              key={item.key}
              name={item.name || item.key}
              dataKey={item.key}
              stroke={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              fill={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default RadarChartCard;
