/**
 * Timeline Component
 * 
 * Display chronological events in a timeline format
 * 
 * Features:
 * - Vertical timeline layout
 * - Customizable items
 * - Loading and empty states
 * - Responsive design
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 173/400)
 */

import React from 'react';
import { TimelineItem, TimelineItemProps } from './TimelineItem';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { cn } from '../../lib/utils';

export interface TimelineProps {
  /** Timeline items */
  items: TimelineItemProps[];
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional className */
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  isLoading = false,
  emptyMessage = 'No timeline events',
  className
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingState size="md" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon="Clock"
        title="No Events"
        description={emptyMessage}
        compact
      />
    );
  }

  return (
    <div className={cn('space-y-0', className)}>
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          {...item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};

export default Timeline;
