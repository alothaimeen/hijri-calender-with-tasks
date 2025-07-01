
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { CalendarDay } from '@/types/calendar';
import { RecurringOptions } from '@/types/task';
import RecurringModal from '@/components/RecurringModal';
import moment from 'moment-hijri';

interface CalendarDayCellProps {
  day: CalendarDay;
  onAddTask: (title: string, description: string, date: Date, recurring?: RecurringOptions) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const CalendarDayCell = ({ day, onAddTask, onToggleTask, onDeleteTask }: CalendarDayCellProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showRecurringModal, setShowRecurringModal] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      setShowAddForm(false);
      setShowRecurringModal(true);
    }
  };

  const handleRecurringSubmit = (options: RecurringOptions) => {
    onAddTask(newTaskTitle.trim(), '', day.hijriDate.gregorianDate, options);
    setNewTaskTitle('');
    setShowRecurringModal(false);
  };

  // تحديد يوم الجمعة (5) والسبت (6) بناءً على getDay()
  const isWeekend = day.hijriDate.gregorianDate.getDay() === 5 || day.hijriDate.gregorianDate.getDay() === 6;

  // التحويل من الهجري إلى الميلادي باستخدام moment-hijri
  const gregorianDate = moment()
    .iYear(day.hijriDate.hijriYear)
    .iMonth(day.hijriDate.hijriMonth)
    .iDate(day.hijriDate.hijriDay)
    .toDate();

  return (
    <>
      <Card className={`min-h-[140px] transition-all duration-300 hover:shadow-lg ${
        !day.isCurrentMonth ? 'opacity-50 bg-gray-50' : 
        day.isToday ? 'ring-3 ring-emerald-400 bg-emerald-50 shadow-lg' : 
        isWeekend ? 'bg-red-50 hover:bg-red-100 border-red-200' : 
        'bg-white hover:shadow-md'
      }`}>
        <CardContent className="p-3">
          {/* Day header */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-right">
              <div className={`text-lg font-bold ${
                day.isToday ? 'text-emerald-600' : 
                isWeekend ? 'text-red-600' : 
                'text-gray-800'
              }`}>
                {day.hijriDate.hijriDay}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {gregorianDate.getDate()}/{gregorianDate.getMonth() + 1}
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

          {/* Events and tasks */}
          <div className="space-y-1">
            {day.events.slice(0, 3).map(event => (
              <div
                key={event.id}
                className={`text-xs p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  event.type === 'occasion' 
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 hover:from-amber-200 hover:to-orange-200 font-semibold'
                    : event.completed
                      ? 'bg-gray-100 text-gray-600 line-through hover:bg-gray-200'
                      : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 hover:from-blue-200 hover:to-indigo-200'
                }`}
              >
                <span
                  className="flex-1"
                  onClick={() => event.type === 'task' && onToggleTask(event.id)}
                >
                  {event.title}
                </span>
                {event.type === 'task' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(event.id);
                    }}
                    className="w-4 h-4 p-0 hover:bg-red-100 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
            {day.events.length > 3 && (
              <div className="text-xs text-gray-500 text-center py-1">
                +{day.events.length - 3} المزيد
              </div>
            )}
          </div>

          {/* Add task form */}
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

      <RecurringModal
        isOpen={showRecurringModal}
        onClose={() => {
          setShowRecurringModal(false);
          setNewTaskTitle('');
        }}
        onSubmit={handleRecurringSubmit}
        taskTitle={newTaskTitle}
      />
    </>
  );
};

export default CalendarDayCell;
