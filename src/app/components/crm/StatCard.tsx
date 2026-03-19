/**
 * StatCard Component
 * 
 * Display statistical information with optional trend indicator
 * 
 * Features:
 * - Clean stat display
 * - Trend indicator (up/down/neutral)
 * - Icon support
 * - Loading state
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 171/400)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  /** Stat title */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Optional description */
  description?: string;
  /** Trend indicator */
  trend?: {
    /** Trend value (e.g., "+12%") */
    value: string;
    /** Trend direction */
    direction: 'up' | 'down' | 'neutral';
  };
  /** Optional icon */
  icon?: LucideIcon;
  /** Loading state */
  isLoading?: boolean;
  /** Additional className */
  className?: string;
  /** Icon background color */
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  trend,
  icon: Icon,
  isLoading = false,
  className,
  iconColor = 'bg-primary/10 text-primary'
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return '';
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div className={cn('p-2 rounded-lg', iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {(description || trend) && (
              <div className="flex items-center gap-2 mt-1">
                {trend && (
                  <div className={cn('flex items-center gap-1 text-xs font-medium', getTrendColor())}>
                    {getTrendIcon()}
                    <span>{trend.value}</span>
                  </div>
                )}
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
