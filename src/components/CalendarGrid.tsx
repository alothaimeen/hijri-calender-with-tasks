
import React from 'react';
import { CalendarDay } from '@/types/calendar';
import CalendarDayCell from '@/components/CalendarDayCell';

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  onAddTask: (title: string, description: string, date?: Date) => void;
  onToggleTask: (id: string) => void;
}

const CalendarGrid = ({ calendarDays, onAddTask, onToggleTask }: CalendarGridProps) => {
  const dayHeaders = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <div className="grid grid-cols-7 gap-2 mb-6">
      {/* Day headers */}
      {dayHeaders.map((day, index) => (
        <div 
          key={day} 
          className={`p-4 text-center font-bold rounded-xl shadow-sm ${
            // تلوين الجمعة (index 5) والسبت (index 6)
            index === 5 || index === 6
              ? 'text-red-800 bg-gradient-to-b from-red-100 to-red-200'
              : 'text-emerald-800 bg-gradient-to-b from-emerald-100 to-emerald-200'
          }`}
        >
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {calendarDays.map((day, index) => (
        <CalendarDayCell
          key={index}
          day={day}
          onAddTask={(title) => onAddTask(title, '', day.hijriDate.gregorianDate)}
          onToggleTask={onToggleTask}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;
