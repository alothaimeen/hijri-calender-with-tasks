
import React, { useState, useEffect } from 'react';
import { CalendarDay, CalendarEvent } from '@/types/calendar';
import { Task } from '@/types/task';
import { generateHijriCalendarMonth, convertTasksToCalendarEvents, getIslamicOccasions, getCurrentHijriDate } from '@/utils/hijriCalendar';
import CalendarHeader from '@/components/CalendarHeader';
import CalendarGrid from '@/components/CalendarGrid';
import PrintableCalendar from '@/components/PrintableCalendar';

interface CalendarViewProps {
  tasks: Task[];
  onAddTask: (title: string, description: string, date?: Date) => void;
  onToggleTask: (id: string) => void;
}

const CalendarView = ({ tasks, onAddTask, onToggleTask }: CalendarViewProps) => {
  const [currentHijriDate, setCurrentHijriDate] = useState(() => getCurrentHijriDate());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [showPrintView, setShowPrintView] = useState(false);

  useEffect(() => {
    const days = generateHijriCalendarMonth(currentHijriDate.year, currentHijriDate.month);
    const calendarEvents = convertTasksToCalendarEvents(tasks);
    
    // Link tasks to days
    days.forEach(day => {
      day.events = calendarEvents.filter(event => 
        event.date.toDateString() === day.hijriDate.gregorianDate.toDateString()
      );
      
      // Add Islamic occasions
      const occasions = getIslamicOccasions(day.hijriDate.hijriMonth, day.hijriDate.hijriDay);
      occasions.forEach(occasion => {
        day.events.push({
          id: `occasion-${day.hijriDate.gregorianDate.toISOString()}`,
          title: occasion,
          type: 'occasion',
          date: day.hijriDate.gregorianDate
        });
      });
    });
    
    setCalendarDays(days);
  }, [currentHijriDate, tasks]);

  const navigateHijriMonth = (direction: 'prev' | 'next') => {
    setCurrentHijriDate(prev => {
      if (direction === 'prev') {
        if (prev.month === 0) {
          return { year: prev.year - 1, month: 11 };
        } else {
          return { year: prev.year, month: prev.month - 1 };
        }
      } else {
        if (prev.month === 11) {
          return { year: prev.year + 1, month: 0 };
        } else {
          return { year: prev.year, month: prev.month + 1 };
        }
      }
    });
  };

  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 100);
  };

  return (
    <div className="w-full">
      <CalendarHeader 
        currentHijriDate={currentHijriDate}
        onNavigateMonth={navigateHijriMonth}
        onPrint={handlePrint}
      />
      
      <div className="print:hidden">
        <CalendarGrid 
          calendarDays={calendarDays}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
        />
      </div>

      {showPrintView && (
        <PrintableCalendar 
          tasks={tasks}
          startYear={currentHijriDate.year}
          startMonth={currentHijriDate.month}
        />
      )}
    </div>
  );
};

export default CalendarView;
