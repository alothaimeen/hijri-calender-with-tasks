
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { CalendarDay, CalendarEvent } from '@/types/calendar';
import { Task } from '@/types/task';
import { generateHijriCalendarMonth, convertTasksToCalendarEvents, getIslamicOccasions, getCurrentHijriDate } from '@/utils/hijriCalendar';

interface CalendarViewProps {
  tasks: Task[];
  onAddTask: (title: string, description: string, date?: Date) => void;
  onToggleTask: (id: string) => void;
}

const CalendarView = ({ tasks, onAddTask, onToggleTask }: CalendarViewProps) => {
  const [currentHijriDate, setCurrentHijriDate] = useState(() => getCurrentHijriDate());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    const days = generateHijriCalendarMonth(currentHijriDate.year, currentHijriDate.month);
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

  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const dayHeaders = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <div className="w-full">
      {/* رأس التقويم الهجري */}
      <Card className="mb-6 shadow-xl border-0 bg-gradient-to-r from-emerald-50 via-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateHijriMonth('next')}
              className="hover:bg-emerald-100 text-emerald-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold text-emerald-800 mb-1">
                {hijriMonths[currentHijriDate.month]} {currentHijriDate.year} هـ
              </h2>
              <p className="text-sm text-emerald-600 flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                التقويم الهجري - أم القرى
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateHijriMonth('prev')}
              className="hover:bg-emerald-100 text-emerald-700"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* شبكة التقويم */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {/* رؤوس الأيام */}
        {dayHeaders.map(day => (
          <div key={day} className="p-4 text-center font-bold text-emerald-800 bg-gradient-to-b from-emerald-100 to-emerald-200 rounded-xl shadow-sm">
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
    <Card className={`min-h-[140px] transition-all duration-300 hover:shadow-lg ${
      !day.isCurrentMonth ? 'opacity-50 bg-gray-50' : 
      day.isToday ? 'ring-3 ring-emerald-400 bg-emerald-50 shadow-lg' : 'bg-white hover:shadow-md'
    }`}>
      <CardContent className="p-3">
        {/* رأس اليوم */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-right">
            <div className={`text-lg font-bold ${day.isToday ? 'text-emerald-600' : 'text-gray-800'}`}>
              {day.hijriDate.hijriDay}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {day.hijriDate.gregorianDate.getDate()}/{day.hijriDate.gregorianDate.getMonth() + 1}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="w-7 h-7 p-0 hover:bg-emerald-100 text-emerald-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* الأحداث والمهام */}
        <div className="space-y-1">
          {day.events.slice(0, 3).map(event => (
            <div
              key={event.id}
              className={`text-xs p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                event.type === 'occasion' 
                  ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 font-semibold'
                  : event.completed
                    ? 'bg-gray-100 text-gray-600 line-through hover:bg-gray-200'
                    : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 hover:from-blue-200 hover:to-indigo-200'
              }`}
              onClick={() => event.type === 'task' && onToggleTask(event.id)}
            >
              {event.title}
            </div>
          ))}
          {day.events.length > 3 && (
            <div className="text-xs text-gray-500 text-center py-1">
              +{day.events.length - 3} المزيد
            </div>
          )}
        </div>

        {/* نموذج إضافة مهمة */}
        {showAddForm && (
          <form onSubmit={handleAddTask} className="mt-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="مهمة جديدة..."
              className="w-full text-xs p-2 border border-emerald-300 rounded-lg text-right focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              dir="rtl"
              autoFocus
              onBlur={() => {
                setTimeout(() => setShowAddForm(false), 200);
              }}
            />
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarView;
