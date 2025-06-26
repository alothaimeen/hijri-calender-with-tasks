
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CalendarDay } from '@/types/calendar';

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
        {/* Day header */}
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

        {/* Events and tasks */}
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
  );
};

export default CalendarDayCell;
