/**
 * PieChartCard Component
 * 
 * Reusable pie/donut chart component using Recharts
 * 
 * Features:
 * - Responsive pie chart
 * - Donut chart variant
 * - Customizable colors
 * - Label and legend support
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 169/400)
 */

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';
import { ChartCard } from './ChartCard';

export interface PieChartDataItem {
  /** Segment name */
  name: string;
  /** Segment value */
  value: number;
  /** Optional custom color */
  color?: string;
}

export interface PieChartCardProps {
  /** Chart title */
  title: string;
  /** Optional description */
  description?: string;
  /** Chart data */
  data: PieChartDataItem[];
  /** Loading state */
  isLoading?: boolean;
  /** Additional actions in header */
  actions?: React.ReactNode;
  /** Chart height */
  height?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Show labels on segments */
  showLabels?: boolean;
  /** Donut chart variant */
  donut?: boolean;
  /** Center label for donut chart */
  centerLabel?: string;
  /** Additional className */
  className?: string;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#14b8a6', // teal
];

export const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  description,
  data,
  isLoading = false,
  actions,
  height = 300,
  showLegend = true,
  showLabels = true,
  donut = false,
  centerLabel,
  className
}) => {
  const isEmpty = !data || data.length === 0;

  const renderLabel = (entry: PieChartDataItem) => {
    return `${entry.name}: ${entry.value}`;
  };

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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabels}
            label={showLabels ? renderLabel : false}
            outerRadius={donut ? 100 : 120}
            innerRadius={donut ? 60 : 0}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
            {donut && centerLabel && (
              <Label
                value={centerLabel}
                position="center"
                className="text-lg font-semibold"
              />
            )}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              color: 'hsl(var(--popover-foreground))'
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default PieChartCard;
