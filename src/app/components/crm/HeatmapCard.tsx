/**
 * HeatmapCard Component
 * 
 * Simple heatmap visualization for activity or data density
 * 
 * Features:
 * - Grid-based heatmap
 * - Color intensity based on value
 * - Tooltip on hover
 * - Customizable dimensions
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 178/400)
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface HeatmapDataPoint {
  /** X-axis label */
  x: string;
  /** Y-axis label */
  y: string;
  /** Value (0-100) */
  value: number;
  /** Optional label */
  label?: string;
}

export interface HeatmapCardProps {
  /** Chart title */
  title: string;
  /** Optional description */
  description?: string;
  /** Heatmap data */
  data: HeatmapDataPoint[];
  /** X-axis labels */
  xLabels: string[];
  /** Y-axis labels */
  yLabels: string[];
  /** Low value color */
  colorLow?: string;
  /** High value color */
  colorHigh?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Additional className */
  className?: string;
}

export const HeatmapCard: React.FC<HeatmapCardProps> = ({
  title,
  description,
  data,
  xLabels,
  yLabels,
  colorLow = '#dbeafe',
  colorHigh = '#1e40af',
  isLoading = false,
  className
}) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapDataPoint | null>(null);

  const getColor = (value: number) => {
    // Simple linear interpolation between low and high colors
    const intensity = value / 100;
    
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : { r: 0, g: 0, b: 0 };
    };

    const low = hexToRgb(colorLow);
    const high = hexToRgb(colorHigh);

    const r = Math.round(low.r + (high.r - low.r) * intensity);
    const g = Math.round(low.g + (high.g - low.g) * intensity);
    const b = Math.round(low.b + (high.b - low.b) * intensity);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const getCellData = (x: string, y: string): HeatmapDataPoint | undefined => {
    return data.find((d) => d.x === x && d.y === y);
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <div className="relative">
            {/* Heatmap Grid */}
            <div className="flex gap-1">
              {/* Y-axis labels */}
              <div className="flex flex-col gap-1 justify-around pr-2">
                <div className="h-8" /> {/* Spacer for x-axis labels */}
                {yLabels.map((label) => (
                  <div
                    key={label}
                    className="h-8 flex items-center text-xs text-muted-foreground"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="flex-1">
                {/* X-axis labels */}
                <div className="flex gap-1 mb-1">
                  {xLabels.map((label) => (
                    <div
                      key={label}
                      className="flex-1 h-8 flex items-center justify-center text-xs text-muted-foreground"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Cells */}
                <div className="space-y-1">
                  {yLabels.map((yLabel) => (
                    <div key={yLabel} className="flex gap-1">
                      {xLabels.map((xLabel) => {
                        const cellData = getCellData(xLabel, yLabel);
                        const value = cellData?.value || 0;

                        return (
                          <div
                            key={`${xLabel}-${yLabel}`}
                            className="flex-1 h-8 rounded cursor-pointer transition-transform hover:scale-110 hover:z-10 relative"
                            style={{ backgroundColor: getColor(value) }}
                            onMouseEnter={() => setHoveredCell(cellData || { x: xLabel, y: yLabel, value: 0 })}
                            onMouseLeave={() => setHoveredCell(null)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tooltip */}
            {hoveredCell && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 bg-popover border border-border rounded-lg shadow-lg px-3 py-2 text-sm z-20">
                <div className="font-medium">
                  {hoveredCell.label || `${hoveredCell.x} - ${hoveredCell.y}`}
                </div>
                <div className="text-muted-foreground">Value: {hoveredCell.value}</div>
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
              <span>Low</span>
              <div className="flex gap-px h-4 w-32">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: getColor((i / 19) * 100) }}
                  />
                ))}
              </div>
              <span>High</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeatmapCard;
