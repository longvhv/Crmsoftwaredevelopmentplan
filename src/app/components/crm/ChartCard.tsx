/**
 * ChartCard Component
 * 
 * Reusable card wrapper for charts with consistent styling and features
 * 
 * Features:
 * - Consistent card layout
 * - Title with optional actions
 * - Loading and empty states
 * - Responsive design
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 166/400)
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { cn } from '../../lib/utils';

export interface ChartCardProps {
  /** Chart title */
  title: string;
  /** Optional description */
  description?: string;
  /** Chart content */
  children: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state */
  isEmpty?: boolean;
  /** Additional actions in header */
  actions?: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Empty state message */
  emptyMessage?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  children,
  isLoading = false,
  isEmpty = false,
  actions,
  className,
  emptyMessage = 'No data available'
}) => {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm">{description}</CardDescription>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <LoadingState size="md" />
          </div>
        ) : isEmpty ? (
          <div className="h-[300px] flex items-center justify-center">
            <EmptyState
              icon="BarChart3"
              title="No Data"
              description={emptyMessage}
              compact
            />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
