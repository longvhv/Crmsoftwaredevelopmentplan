/**
 * CalendarView Component
 * 
 * Simple calendar view for displaying events
 * 
 * Features:
 * - Month view calendar
 * - Event display on dates
 * - Date selection
 * - Navigation controls
 * 
 * @version 1.0.0
 * @since Phase 3-C (Step 175/400)
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';

export interface CalendarEvent {
  /** Event ID */
  id: string;
  /** Event title */
  title: string;
  /** Event date */
  date: Date;
  /** Event color */
  color?: string;
  /** Click handler */
  onClick?: () => void;
}

export interface CalendarViewProps {
  /** Calendar events */
  events?: CalendarEvent[];
  /** Selected date */
  selectedDate?: Date;
  /** Date selection handler */
  onSelectDate?: (date: Date) => void;
  /** Show card wrapper */
  showCard?: boolean;
  /** Card title */
  title?: string;
  /** Additional className */
  className?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events = [],
  selectedDate,
  onSelectDate,
  showCard = true,
  title = 'Calendar',
  className
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const calendar = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-muted p-2 text-center text-xs font-medium"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={index}
              className={cn(
                'bg-card min-h-[80px] p-2 cursor-pointer hover:bg-accent transition-colors',
                !isCurrentMonth && 'opacity-40'
              )}
              onClick={() => onSelectDate?.(day)}
            >
              <div className="flex flex-col h-full">
                <span
                  className={cn(
                    'text-sm font-medium mb-1 flex h-6 w-6 items-center justify-center rounded-full',
                    isTodayDate && 'bg-primary text-primary-foreground',
                    isSelected && !isTodayDate && 'bg-accent'
                  )}
                >
                  {format(day, 'd')}
                </span>
                <div className="space-y-1 flex-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'text-xs px-1 py-0.5 rounded truncate cursor-pointer',
                        event.color || 'bg-primary/10 text-primary'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        event.onClick?.();
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground px-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (!showCard) {
    return <div className={className}>{calendar}</div>;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{calendar}</CardContent>
    </Card>
  );
};

export default CalendarView;
