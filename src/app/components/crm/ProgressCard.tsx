/**
 * ProgressCard Component
 * 
 * Display progress towards a goal with visual indicators
 * 
 * Features:
 * - Progress bar with percentage
 * - Goal tracking
 * - Color-coded status
 * - Milestone display
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 177/400)
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { Target, TrendingUp } from 'lucide-react';

export interface ProgressCardProps {
  /** Progress title */
  title: string;
  /** Current value */
  current: number;
  /** Goal/target value */
  goal: number;
  /** Optional description */
  description?: string;
  /** Unit label (e.g., "deals", "revenue") */
  unit?: string;
  /** Show as currency */
  isCurrency?: boolean;
  /** Progress bar color */
  progressColor?: string;
  /** Show percentage badge */
  showPercentage?: boolean;
  /** Additional className */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  current,
  goal,
  description,
  unit = '',
  isCurrency = false,
  progressColor,
  showPercentage = true,
  className,
  isLoading = false
}) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - current, 0);

  const formatValue = (val: number) => {
    if (isCurrency) {
      return `$${val.toLocaleString()}`;
    }
    return val.toLocaleString();
  };

  const getStatusColor = () => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusLabel = () => {
    if (percentage >= 100) return 'Completed';
    if (percentage >= 75) return 'On Track';
    if (percentage >= 50) return 'In Progress';
    return 'Needs Attention';
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          {showPercentage && (
            <Badge variant={percentage >= 75 ? 'default' : 'secondary'} className={cn(getStatusColor())}>
              {percentage.toFixed(0)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-2 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <Progress value={percentage} className="h-2" />

            {/* Metrics */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {formatValue(current)} {unit}
                </span>
                <span className="text-muted-foreground">of</span>
                <span className="font-medium">
                  {formatValue(goal)} {unit}
                </span>
              </div>
            </div>

            {/* Status and Remaining */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {remaining > 0 ? `${formatValue(remaining)} ${unit} remaining` : 'Goal achieved!'}
                </span>
              </div>
              <Badge variant="outline" className={cn('text-xs', getStatusColor())}>
                {getStatusLabel()}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
