
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { CalendarDay, CalendarEvent } from '@/types/calendar';
import { Task } from '@/types/task';
import { generateCalendarMonth, convertTasksToCalendarEvents, getIslamicOccasions } from '@/utils/hijriCalendar';

interface CalendarViewProps {
  tasks: Task[];
  onAddTask: (title: string, description: string, date?: Date) => void;
  onToggleTask: (id: string) => void;
}

const CalendarView = ({ tasks, onAddTask, onToggleTask }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    const days = generateCalendarMonth(currentDate.getFullYear(), currentDate.getMonth());
    const calendarEvents = convertTasksToCalendarEvents(tasks);
    
    // ربط المهام بالأيام
    days.forEach(day => {
      day.events = calendarEvents.filter(event => 
        event.date.toDateString() === day.hijriDate.gregorianDate.toDateString()
      );
      
      // إضافة المناسبات الإسلامية
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
  }, [currentDate, tasks]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const dayHeaders = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <div className="w-full">
      {/* رأس التقويم */}
      <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-blue-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <p className="text-sm text-blue-600 mt-1">
                <CalendarIcon className="w-4 h-4 inline ml-1" />
                التقويم الهجري - أم القرى
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-blue-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* شبكة التقويم */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* رؤوس الأيام */}
        {dayHeaders.map(day => (
          <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-gray-100 rounded-lg">
            {day}
          </div>
        ))}
        
        {/* أيام التقويم */}
        {calendarDays.map((day, index) => (
          <CalendarDayCell
            key={index}
            day={day}
            onAddTask={(title) => onAddTask(title, '', day.hijriDate.gregorianDate)}
            onToggleTask={onToggleTask}
          />
        ))}
      </div>
    </div>
  );
};

interface CalendarDayCellProps {
  day: CalendarDay;
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
}

const CalendarDayCell = ({ day, onAddTask, onToggleTask }: CalendarDayCellProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
      setShowAddForm(false);
    }
  };

  return (
    <Card className={`min-h-[120px] transition-all duration-200 hover:shadow-md ${
      !day.isCurrentMonth ? 'opacity-50 bg-gray-50' : 
      day.isToday ? 'ring-2 ring-blue-400 bg-blue-50' : 'bg-white'
    }`}>
      <CardContent className="p-2">
        {/* رأس اليوم */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-right">
            <div className={`text-sm font-semibold ${day.isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day.hijriDate.hijriDay}
            </div>
            <div className="text-xs text-gray-500">
              {day.hijriDate.gregorianDate.getDate()}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="w-6 h-6 p-0 hover:bg-blue-100"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* الأحداث والمهام */}
        <div className="space-y-1">
          {day.events.map(event => (
            <div
              key={event.id}
              className={`text-xs p-1 rounded cursor-pointer transition-colors ${
                event.type === 'occasion' 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : event.completed
                    ? 'bg-gray-100 text-gray-600 line-through hover:bg-gray-200'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
              onClick={() => event.type === 'task' && onToggleTask(event.id)}
            >
              {event.title}
            </div>
          ))}
        </div>

        {/* نموذج إضافة مهمة */}
        {showAddForm && (
          <form onSubmit={handleAddTask} className="mt-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="مهمة جديدة..."
              className="w-full text-xs p-1 border rounded text-right"
              dir="rtl"
              autoFocus
              onBlur={() => setShowAddForm(false)}
            />
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarView;
