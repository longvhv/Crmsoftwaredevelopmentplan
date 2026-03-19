import * as React from "react";
import { cn } from "./utils";
import { PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

/* ============================================================
 * DATA WIDGET - Mini data visualizations
 * ============================================================
 * Gauges, heatmaps, mini charts, and metric displays
 */

/* ============================================================
 * GAUGE CHART
 * ============================================================ */

export interface GaugeChartProps {
  /**
   * Current value
   */
  value: number;
  
  /**
   * Min value
   * @default 0
   */
  min?: number;
  
  /**
   * Max value
   * @default 100
   */
  max?: number;
  
  /**
   * Show label
   * @default true
   */
  showLabel?: boolean;
  
  /**
   * Label formatter
   */
  formatLabel?: (value: number) => string;
  
  /**
   * Color segments
   */
  segments?: Array<{ threshold: number; color: string }>;
  
  /**
   * Size
   * @default 200
   */
  size?: number;
  
  /**
   * Custom className
   */
  className?: string;
}

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  showLabel = true,
  formatLabel = (v) => `${v}`,
  segments = [
    { threshold: 30, color: '#ef4444' },
    { threshold: 70, color: '#f59e0b' },
    { threshold: 100, color: '#10b981' },
  ],
  size = 200,
  className,
}: GaugeChartProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const currentColor = segments.find((s) => percentage <= s.threshold)?.color || segments[segments.length - 1].color;
  
  const data = [
    { name: 'value', value: percentage, fill: currentColor },
    { name: 'remaining', value: 100 - percentage, fill: '#e5e7eb' },
  ];
  
  return (
    <div className={cn('relative', className)} style={{ width: size, height: size / 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {showLabel && (
        <div className="absolute bottom-0 left-0 right-0 text-center pb-2">
          <div className="text-2xl font-bold">{formatLabel(value)}</div>
          <div className="text-xs text-muted-foreground">
            {min} - {max}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * RADIAL PROGRESS
 * ============================================================ */

export interface RadialProgressProps {
  value: number;
  label?: string;
  color?: string;
  size?: number;
  className?: string;
}

export function RadialProgress({
  value,
  label,
  color = '#3b82f6',
  size = 150,
  className,
}: RadialProgressProps) {
  const data = [{ name: 'value', value, fill: color }];
  
  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold">{value}%</div>
        {label && <div className="text-sm text-muted-foreground mt-1">{label}</div>}
      </div>
    </div>
  );
}

/* ============================================================
 * HEATMAP
 * ============================================================ */

export interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  label?: string;
}

export interface HeatmapProps {
  data: HeatmapCell[];
  xLabels?: string[];
  yLabels?: string[];
  colorScale?: (value: number) => string;
  cellSize?: number;
  showValues?: boolean;
  onCellClick?: (cell: HeatmapCell) => void;
  className?: string;
}

const defaultColorScale = (value: number): string => {
  if (value === 0) return '#e5e7eb';
  if (value < 25) return '#bfdbfe';
  if (value < 50) return '#60a5fa';
  if (value < 75) return '#3b82f6';
  return '#1e40af';
};

export function Heatmap({
  data,
  xLabels = [],
  yLabels = [],
  colorScale = defaultColorScale,
  cellSize = 40,
  showValues = false,
  onCellClick,
  className,
}: HeatmapProps) {
  const maxX = Math.max(...data.map((d) => d.x));
  const maxY = Math.max(...data.map((d) => d.y));
  
  const getCellData = (x: number, y: number): HeatmapCell | undefined => {
    return data.find((d) => d.x === x && d.y === y);
  };
  
  return (
    <div className={cn('inline-block', className)}>
      <div className="flex gap-2">
        {/* Y Labels */}
        {yLabels.length > 0 && (
          <div className="flex flex-col justify-around text-xs text-muted-foreground">
            {yLabels.map((label, i) => (
              <div key={i} className="flex items-center" style={{ height: cellSize }}>
                {label}
              </div>
            ))}
          </div>
        )}
        
        {/* Grid */}
        <div>
          {/* X Labels */}
          {xLabels.length > 0 && (
            <div className="flex gap-1 mb-2">
              {xLabels.map((label, i) => (
                <div
                  key={i}
                  className="text-xs text-muted-foreground text-center"
                  style={{ width: cellSize }}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
          
          {/* Cells */}
          <div className="space-y-1">
            {Array.from({ length: maxY + 1 }, (_, y) => (
              <div key={y} className="flex gap-1">
                {Array.from({ length: maxX + 1 }, (_, x) => {
                  const cell = getCellData(x, y);
                  const value = cell?.value || 0;
                  
                  return (
                    <div
                      key={`${x}-${y}`}
                      onClick={() => cell && onCellClick?.(cell)}
                      className={cn(
                        'rounded flex items-center justify-center text-xs font-medium transition-all',
                        onCellClick && 'cursor-pointer hover:ring-2 ring-primary/50'
                      )}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: colorScale(value),
                        color: value > 50 ? 'white' : 'inherit',
                      }}
                      title={cell?.label || `${value}`}
                    >
                      {showValues && value > 0 && value}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * METRIC CARD
 * ============================================================ */

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const METRIC_VARIANTS = {
  default: 'border-border',
  success: 'border-green-500/20 bg-green-50/50',
  warning: 'border-amber-500/20 bg-amber-50/50',
  error: 'border-red-500/20 bg-red-50/50',
};

export function MetricCard({
  label,
  value,
  unit,
  change,
  changeLabel,
  icon,
  trend = 'neutral',
  variant = 'default',
  size = 'md',
  className,
}: MetricCardProps) {
  const sizes = {
    sm: { value: 'text-xl', label: 'text-xs' },
    md: { value: 'text-3xl', label: 'text-sm' },
    lg: { value: 'text-4xl', label: 'text-base' },
  };
  
  return (
    <div className={cn('border rounded-lg p-4', METRIC_VARIANTS[variant], className)}>
      <div className="flex items-start justify-between mb-2">
        <div className={cn('text-muted-foreground', sizes[size].label)}>{label}</div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      
      <div className={cn('font-bold mb-1', sizes[size].value)}>
        {value}
        {unit && <span className="text-muted-foreground text-base ml-1">{unit}</span>}
      </div>
      
      {change !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          <span
            className={cn(
              'font-medium',
              trend === 'up' && 'text-green-600',
              trend === 'down' && 'text-red-600',
              trend === 'neutral' && 'text-gray-600'
            )}
          >
            {change > 0 && '+'}
            {change}%
          </span>
          {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * MINI DONUT CHART
 * ============================================================ */

export interface DonutSegment {
  label: string;
  value: number;
  color?: string;
}

export interface MiniDonutProps {
  data: DonutSegment[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
  showLegend?: boolean;
  className?: string;
}

export function MiniDonut({
  data,
  size = 150,
  centerLabel,
  centerValue,
  showLegend = true,
  className,
}: MiniDonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const chartData = data.map((item, index) => ({
    ...item,
    fill: item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }));
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <div className="text-2xl font-bold">{centerValue}</div>}
            {centerLabel && <div className="text-xs text-muted-foreground">{centerLabel}</div>}
          </div>
        )}
      </div>
      
      {showLegend && (
        <div className="space-y-2">
          {chartData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
                <span className="font-medium">
                  {item.value} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * SPARK NUMBER
 * ============================================================ */

export interface SparkNumberProps {
  value: number;
  previousValue?: number;
  formatValue?: (value: number) => string;
  label?: string;
  showChange?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SparkNumber({
  value,
  previousValue,
  formatValue = (v) => String(v),
  label,
  showChange = true,
  size = 'md',
  className,
}: SparkNumberProps) {
  const change = previousValue !== undefined ? ((value - previousValue) / previousValue) * 100 : 0;
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };
  
  return (
    <div className={cn('text-center', className)}>
      {label && <div className="text-sm text-muted-foreground mb-2">{label}</div>}
      <div className={cn('font-bold', sizes[size])}>{formatValue(value)}</div>
      
      {showChange && previousValue !== undefined && (
        <div className="mt-2 text-sm">
          <span
            className={cn(
              'font-medium',
              trend === 'up' && 'text-green-600',
              trend === 'down' && 'text-red-600',
              trend === 'neutral' && 'text-gray-600'
            )}
          >
            {change > 0 && '↑'}
            {change < 0 && '↓'}
            {change === 0 && '→'}
            {' '}
            {Math.abs(change).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * ACTIVITY GRID (GitHub-style)
 * ============================================================ */

export interface ActivityDay {
  date: Date;
  value: number;
}

export interface ActivityGridProps {
  data: ActivityDay[];
  colorScale?: (value: number) => string;
  cellSize?: number;
  cellGap?: number;
  showMonthLabels?: boolean;
  onDayClick?: (day: ActivityDay) => void;
  className?: string;
}

export function ActivityGrid({
  data,
  colorScale = (value: number) => {
    if (value === 0) return '#ebedf0';
    if (value < 3) return '#c6e48b';
    if (value < 6) return '#7bc96f';
    if (value < 9) return '#239a3b';
    return '#196127';
  },
  cellSize = 12,
  cellGap = 3,
  showMonthLabels = true,
  onDayClick,
  className,
}: ActivityGridProps) {
  // Group data by week
  const weeks: ActivityDay[][] = [];
  let currentWeek: ActivityDay[] = [];
  
  data.forEach((day, index) => {
    currentWeek.push(day);
    if (day.date.getDay() === 6 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  return (
    <div className={cn('inline-block', className)}>
      {showMonthLabels && (
        <div className="text-xs text-muted-foreground mb-2">
          Activity over the past year
        </div>
      )}
      
      <div className="flex" style={{ gap: cellGap }}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col" style={{ gap: cellGap }}>
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                onClick={() => onDayClick?.(day)}
                className={cn(
                  'rounded-sm transition-all',
                  onDayClick && 'cursor-pointer hover:ring-2 ring-primary/50'
                )}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: colorScale(day.value),
                }}
                title={`${day.date.toDateString()}: ${day.value} activities`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
