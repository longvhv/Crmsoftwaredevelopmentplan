/**
 * TimelineItem Component
 * 
 * Individual item for Timeline display
 * 
 * Features:
 * - Flexible timeline item layout
 * - Icon/avatar support
 * - Timestamp display
 * - Custom content
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 172/400)
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TimelineItemProps {
  /** Item title */
  title: string;
  /** Item description */
  description?: string;
  /** Timestamp */
  timestamp: string;
  /** Optional icon */
  icon?: LucideIcon;
  /** Icon color */
  iconColor?: string;
  /** Is last item (affects line display) */
  isLast?: boolean;
  /** Additional content */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  description,
  timestamp,
  icon: Icon,
  iconColor = 'bg-primary text-primary-foreground',
  isLast = false,
  children,
  className
}) => {
  return (
    <div className={cn('relative flex gap-4 pb-8', isLast && 'pb-0', className)}>
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
      )}
      
      {/* Icon */}
      <div className={cn('relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', iconColor)}>
        {Icon && <Icon className="h-4 w-4" />}
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-2 pt-0.5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium leading-none">{title}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <time className="text-xs text-muted-foreground whitespace-nowrap">{timestamp}</time>
        </div>
        {children && <div className="text-sm">{children}</div>}
      </div>
    </div>
  );
};

export default TimelineItem;
