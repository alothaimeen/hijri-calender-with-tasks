
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types/task';
import { RecurringOptions } from '@/types/task';
import TaskInput from '@/components/TaskInput';
import CalendarView from '@/components/CalendarView';
import TaskStats from '@/components/TaskStats';
import TaskList from '@/components/TaskList';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar, Sparkles, Printer } from 'lucide-react';
import { getCurrentHijriDate } from '@/utils/hijriCalendar';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  // تحميل المهام من التخزين المحلي عند بدء التطبيق
  useEffect(() => {
    const savedTasks = localStorage.getItem('hijri-calendar-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('خطأ في تحميل المهام:', error);
      }
    }
  }, []);

  // حفظ المهام في التخزين المحلي عند تغييرها
  useEffect(() => {
    localStorage.setItem('hijri-calendar-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description: string, date?: Date, recurring?: RecurringOptions) => {
    const baseDate = date || new Date();
    const newTasks: Task[] = [];

    const baseTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: baseDate,
      recurring: recurring?.type || 'none',
      recurringCount: recurring?.count || 0,
    };

    // إضافة المهمة الأساسية
    newTasks.push(baseTask);

    // إنشاء المهام المتكررة
    if (recurring && recurring.type !== 'none' && recurring.count > 0) {
      for (let i = 1; i < recurring.count; i++) {
        const recurringDate = new Date(baseDate);
        
        switch (recurring.type) {
          case 'daily':
            recurringDate.setDate(baseDate.getDate() + i);
            break;
          case 'weekly':
            recurringDate.setDate(baseDate.getDate() + (i * 7));
            break;
          case 'monthly':
            recurringDate.setMonth(baseDate.getMonth() + i);
            break;
        }

        const recurringTask: Task = {
          id: `${baseTask.id}-${i}`,
          title,
          description,
          completed: false,
          createdAt: recurringDate,
          recurring: recurring.type,
          recurringCount: recurring.count,
          originalTaskId: baseTask.id,
        };

        newTasks.push(recurringTask);
      }
    }

    setTasks([...newTasks, ...tasks]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    // حذف المهمة الأساسية وجميع تكراراتها
    setTasks(tasks.filter(task => 
      task.id !== id && task.originalTaskId !== id && !task.id.startsWith(id + '-')
    ));
  };

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  const handleGoToPrintPage = () => {
    const currentHijriDate = getCurrentHijriDate();
    navigate('/print', {
      state: {
        tasks: tasks,
        hijriYear: currentHijriDate.year
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 print:hidden">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-10 h-10 text-emerald-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              التقويم الهجري
            </h1>
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-600 text-xl font-medium">
            تقويم أم القرى - نظم مهامك ومناسباتك الإسلامية
          </p>
          
          {/* زر الطباعة محسن ومرئي */}
          <div className="mt-6">
            <Button
              onClick={handleGoToPrintPage}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-xl px-8 py-4 text-xl rounded-xl transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <Printer className="w-6 h-6 ml-3" />
              طباعة التقويم السنوي
            </Button>
          </div>
        </div>

        {/* التقويم الهجري - العنصر الأساسي */}
        <CalendarView 
          tasks={tasks}
          onAddTask={addTask}
          onToggleTask={toggleTaskComplete}
          onDeleteTask={deleteTask}
        />

        <Separator className="my-8 bg-gradient-to-r from-emerald-200 to-blue-200 h-1 print:hidden" />

        {/* قسم المهام والإحصائيات */}
        <div className="space-y-6 print:hidden">
          {/* إحصائيات المهام */}
          <div>
            <TaskStats 
              totalTasks={taskCounts.all}
              completedTasks={taskCounts.completed}
              activeTasks={taskCounts.active}
            />
          </div>

          {/* إدخال المهام الجديدة */}
          <div>
            <TaskInput onAddTask={addTask} />
          </div>

          {/* قائمة المهام */}
          <div>
            <TaskList 
              tasks={tasks}
              onToggleTask={toggleTaskComplete}
              onDeleteTask={deleteTask}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200 print:hidden">
          <p className="text-gray-500 text-sm">
            تم إنشاؤه بـ ❤️ لخدمة المسلمين - التقويم الهجري أم القرى
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
