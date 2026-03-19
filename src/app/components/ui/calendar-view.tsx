import * as React from "react";
import { cn } from "./utils";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";

/* ============================================================
 * CALENDAR VIEW - Month/Week/Day views with events
 * ============================================================
 * Supports drag-and-drop, event creation, and custom rendering
 */

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  metadata?: Record<string, any>;
}

export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarViewProps {
  /**
   * Events to display
   */
  events?: CalendarEvent[];
  
  /**
   * Current date
   */
  date?: Date;
  
  /**
   * View mode
   * @default 'month'
   */
  view?: CalendarView;
  
  /**
   * Date change handler
   */
  onDateChange?: (date: Date) => void;
  
  /**
   * View change handler
   */
  onViewChange?: (view: CalendarView) => void;
  
  /**
   * Event click handler
   */
  onEventClick?: (event: CalendarEvent) => void;
  
  /**
   * Date click handler (for creating events)
   */
  onDateClick?: (date: Date) => void;
  
  /**
   * Event drag handler
   */
  onEventDrag?: (eventId: string, newStart: Date, newEnd: Date) => void;
  
  /**
   * Custom event render
   */
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
  
  /**
   * Show week numbers
   * @default false
   */
  showWeekNumbers?: boolean;
  
  /**
   * First day of week (0 = Sunday, 1 = Monday)
   * @default 0
   */
  firstDayOfWeek?: 0 | 1;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * UTILITIES
 * ============================================================ */

function getWeeksInMonth(date: Date, firstDayOfWeek: 0 | 1 = 0): Date[][] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  const startWeek = startOfWeek(start, { weekStartsOn: firstDayOfWeek });
  const endWeek = endOfWeek(end, { weekStartsOn: firstDayOfWeek });
  
  const days = eachDayOfInterval({ start: startWeek, end: endWeek });
  
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  
  return weeks;
}

function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    return (
      (isSameDay(eventStart, day) || isSameDay(eventEnd, day)) ||
      (eventStart < day && eventEnd > day)
    );
  });
}

/* ============================================================
 * EVENT BADGE COMPONENT
 * ============================================================ */

interface EventBadgeProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

const EventBadge: React.FC<EventBadgeProps> = ({ event, onClick, renderEvent }) => {
  if (renderEvent) {
    return <div onClick={() => onClick?.(event)}>{renderEvent(event)}</div>;
  }
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      className={cn(
        'text-xs px-2 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity',
        event.color ? '' : 'bg-primary text-white'
      )}
      style={event.color ? { backgroundColor: event.color, color: 'white' } : undefined}
      title={event.title}
    >
      {event.title}
    </div>
  );
};

/* ============================================================
 * MONTH VIEW
 * ============================================================ */

interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
  showWeekNumbers: boolean;
  firstDayOfWeek: 0 | 1;
}

const MonthView: React.FC<MonthViewProps> = ({
  date,
  events,
  onDateClick,
  onEventClick,
  renderEvent,
  showWeekNumbers,
  firstDayOfWeek,
}) => {
  const weeks = getWeeksInMonth(date, firstDayOfWeek);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (firstDayOfWeek === 1) {
    dayNames.push(dayNames.shift()!);
  }
  
  return (
    <div className="flex-1">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {showWeekNumbers && <div className="text-xs text-muted-foreground p-2">W</div>}
        {dayNames.map((day) => (
          <div key={day} className="text-xs font-medium text-muted-foreground p-2 text-center">
            {day}
          </div>
        ))}
      </div>
      
      {/* Weeks */}
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 border-b border-border">
          {showWeekNumbers && (
            <div className="text-xs text-muted-foreground p-2 border-r border-border">
              {format(week[0], 'w')}
            </div>
          )}
          {week.map((day) => {
            const dayEvents = getEventsForDay(events, day);
            const isCurrentMonth = isSameMonth(day, date);
            const isDayToday = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                onClick={() => onDateClick?.(day)}
                className={cn(
                  'min-h-[100px] p-2 border-r border-border cursor-pointer transition-colors',
                  !isCurrentMonth && 'bg-[var(--muted)]/20',
                  isCurrentMonth && 'hover:bg-[var(--muted)]/30'
                )}
              >
                <div
                  className={cn(
                    'text-sm mb-1',
                    !isCurrentMonth && 'text-muted-foreground',
                    isDayToday && 'w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-semibold'
                  )}
                >
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <EventBadge
                      key={event.id}
                      event={event}
                      onClick={onEventClick}
                      renderEvent={renderEvent}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ============================================================
 * WEEK VIEW
 * ============================================================ */

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
  firstDayOfWeek: 0 | 1;
}

const WeekView: React.FC<WeekViewProps> = ({
  date,
  events,
  onDateClick,
  onEventClick,
  renderEvent,
  firstDayOfWeek,
}) => {
  const weekStart = startOfWeek(date, { weekStartsOn: firstDayOfWeek });
  const weekEnd = endOfWeek(date, { weekStartsOn: firstDayOfWeek });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  return (
    <div className="flex-1">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {days.map((day) => {
          const isDayToday = isToday(day);
          
          return (
            <div key={day.toISOString()} className="p-2 text-center border-r border-border">
              <div className="text-xs text-muted-foreground">{format(day, 'EEE')}</div>
              <div
                className={cn(
                  'text-lg font-semibold mt-1',
                  isDayToday && 'w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto'
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Day Columns */}
      <div className="grid grid-cols-7 h-[600px]">
        {days.map((day) => {
          const dayEvents = getEventsForDay(events, day);
          
          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick?.(day)}
              className="border-r border-border p-2 overflow-y-auto hover:bg-[var(--muted)]/30 transition-colors cursor-pointer"
            >
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={cn(
                      'p-2 rounded text-sm cursor-pointer hover:opacity-80 transition-opacity',
                      event.color ? '' : 'bg-primary/10 border border-primary'
                    )}
                    style={
                      event.color
                        ? { backgroundColor: event.color, color: 'white' }
                        : undefined
                    }
                  >
                    {renderEvent ? (
                      renderEvent(event)
                    ) : (
                      <>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs opacity-80">
                          {format(new Date(event.start), 'HH:mm')} -{' '}
                          {format(new Date(event.end), 'HH:mm')}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
 * DAY VIEW
 * ============================================================ */

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  renderEvent?: (event: CalendarEvent) => React.ReactNode;
}

const DayView: React.FC<DayViewProps> = ({ date, events, onEventClick, renderEvent }) => {
  const dayEvents = getEventsForDay(events, date);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="flex border-b border-border h-16">
            <div className="w-20 text-xs text-muted-foreground p-2">
              {format(new Date().setHours(hour, 0, 0, 0), 'HH:00')}
            </div>
            <div className="flex-1 border-l border-border" />
          </div>
        ))}
        
        {/* Events positioned absolutely */}
        <div className="absolute top-0 left-20 right-0 bottom-0">
          {dayEvents.map((event) => {
            const start = new Date(event.start);
            const end = new Date(event.end);
            
            const startMinutes = start.getHours() * 60 + start.getMinutes();
            const endMinutes = end.getHours() * 60 + end.getMinutes();
            const duration = endMinutes - startMinutes;
            
            const top = (startMinutes / 60) * 64; // 64px per hour
            const height = (duration / 60) * 64;
            
            return (
              <div
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className={cn(
                  'absolute left-2 right-2 p-2 rounded text-sm cursor-pointer hover:opacity-80 transition-opacity overflow-hidden',
                  event.color ? '' : 'bg-primary text-white'
                )}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  ...(event.color && { backgroundColor: event.color, color: 'white' }),
                }}
              >
                {renderEvent ? (
                  renderEvent(event)
                ) : (
                  <>
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-xs opacity-80">
                      {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
 * CALENDAR VIEW COMPONENT
 * ============================================================ */

export function CalendarView({
  events = [],
  date: controlledDate,
  view = 'month',
  onDateChange,
  onViewChange,
  onEventClick,
  onDateClick,
  onEventDrag,
  renderEvent,
  showWeekNumbers = false,
  firstDayOfWeek = 0,
  className,
}: CalendarViewProps) {
  const [internalDate, setInternalDate] = React.useState(new Date());
  const [internalView, setInternalView] = React.useState<CalendarView>(view);
  
  const currentDate = controlledDate || internalDate;
  const currentView = view || internalView;
  
  const handleDateChange = (newDate: Date) => {
    if (!controlledDate) {
      setInternalDate(newDate);
    }
    onDateChange?.(newDate);
  };
  
  const handleViewChange = (newView: CalendarView) => {
    setInternalView(newView);
    onViewChange?.(newView);
  };
  
  const goToPrevious = () => {
    const newDate = currentView === 'month'
      ? subMonths(currentDate, 1)
      : currentView === 'week'
      ? subMonths(currentDate, 0) // TODO: implement week navigation
      : new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    
    handleDateChange(newDate);
  };
  
  const goToNext = () => {
    const newDate = currentView === 'month'
      ? addMonths(currentDate, 1)
      : currentView === 'week'
      ? addMonths(currentDate, 0) // TODO: implement week navigation
      : new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    
    handleDateChange(newDate);
  };
  
  const goToToday = () => {
    handleDateChange(new Date());
  };
  
  return (
    <div className={cn('flex flex-col bg-background border border-border rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrevious}
            className="p-2 hover:bg-[var(--muted)] rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            onClick={goToNext}
            className="p-2 hover:bg-[var(--muted)] rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1.5 text-sm border border-border rounded hover:bg-[var(--muted)] transition-colors"
          >
            Today
          </button>
          
          <h2 className="text-lg font-semibold ml-2">
            {currentView === 'month' && format(currentDate, 'MMMM yyyy')}
            {currentView === 'week' && `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`}
            {currentView === 'day' && format(currentDate, 'MMMM d, yyyy')}
          </h2>
        </div>
        
        {/* View Switcher */}
        <div className="flex gap-1 border border-border rounded">
          {(['month', 'week', 'day'] as CalendarView[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => handleViewChange(v)}
              className={cn(
                'px-3 py-1.5 text-sm capitalize transition-colors',
                currentView === v
                  ? 'bg-primary text-white'
                  : 'hover:bg-[var(--muted)]'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      
      {/* View Content */}
      {currentView === 'month' && (
        <MonthView
          date={currentDate}
          events={events}
          onDateClick={onDateClick}
          onEventClick={onEventClick}
          renderEvent={renderEvent}
          showWeekNumbers={showWeekNumbers}
          firstDayOfWeek={firstDayOfWeek}
        />
      )}
      
      {currentView === 'week' && (
        <WeekView
          date={currentDate}
          events={events}
          onDateClick={onDateClick}
          onEventClick={onEventClick}
          renderEvent={renderEvent}
          firstDayOfWeek={firstDayOfWeek}
        />
      )}
      
      {currentView === 'day' && (
        <DayView
          date={currentDate}
          events={events}
          onEventClick={onEventClick}
          renderEvent={renderEvent}
        />
      )}
    </div>
  );
}
