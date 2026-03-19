/**
 * ActivityFeed Component
 * 
 * Display recent activities with avatars and metadata
 * 
 * Features:
 * - Activity stream display
 * - Avatar/icon support
 * - Timestamp and metadata
 * - Clickable items
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 174/400)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export interface ActivityItem {
  /** Activity ID */
  id: string;
  /** User who performed the activity */
  user: {
    name: string;
    avatar?: string;
  };
  /** Activity type */
  type: string;
  /** Activity description */
  description: string;
  /** Activity timestamp */
  timestamp: Date;
  /** Optional badge */
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  /** Click handler */
  onClick?: () => void;
}

export interface ActivityFeedProps {
  /** Activity items */
  items: ActivityItem[];
  /** Loading state */
  isLoading?: boolean;
  /** Card title */
  title?: string;
  /** Max items to display */
  maxItems?: number;
  /** Show card wrapper */
  showCard?: boolean;
  /** Additional className */
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  isLoading = false,
  title = 'Recent Activity',
  maxItems = 10,
  showCard = true,
  className
}) => {
  const displayItems = items.slice(0, maxItems);

  const content = (
    <>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingState size="md" />
        </div>
      ) : displayItems.length === 0 ? (
        <EmptyState
          icon="Activity"
          title="No Activity"
          description="No recent activities to display"
          compact
        />
      ) : (
        <div className="space-y-4">
          {displayItems.map((item) => {
            const initials = item.user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-start gap-3',
                  item.onClick && 'cursor-pointer hover:bg-accent rounded-lg p-2 -m-2 transition-colors'
                )}
                onClick={item.onClick}
              >
                <Avatar className="h-8 w-8">
                  {item.user.avatar && <AvatarImage src={item.user.avatar} alt={item.user.name} />}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{item.user.name}</span>{' '}
                        <span className="text-muted-foreground">{item.description}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    {item.badge && (
                      <Badge variant={item.badge.variant || 'secondary'} className="shrink-0">
                        {item.badge.label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  if (!showCard) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

export default ActivityFeed;
