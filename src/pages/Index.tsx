
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import TaskInput from '@/components/TaskInput';
import CalendarView from '@/components/CalendarView';
import TaskStats from '@/components/TaskStats';
import TaskList from '@/components/TaskList';
import { Separator } from '@/components/ui/separator';
import { Calendar, Sparkles } from 'lucide-react';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // تحميل المهام من التخزين المحلي عند بدء التطبيق
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // حفظ المهام في التخزين المحلي عند تغييرها
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description: string, date?: Date) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: date || new Date(),
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 print:hidden" dir="rtl">
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
        </div>

        {/* التقويم الهجري - العنصر الأساسي */}
        <CalendarView 
          tasks={tasks}
          onAddTask={addTask}
          onToggleTask={toggleTaskComplete}
        />

        <Separator className="my-8 bg-gradient-to-r from-emerald-200 to-blue-200 h-1 print:hidden" />

        {/* قسم المهام والإحصائيات */}
        <div className="space-y-6 print:hidden task-section">
          {/* إحصائيات المهام */}
          <div className="stats-section">
            <TaskStats 
              totalTasks={taskCounts.all}
              completedTasks={taskCounts.completed}
              activeTasks={taskCounts.active}
            />
          </div>

          {/* إدخال المهام الجديدة */}
          <div className="input-section">
            <TaskInput onAddTask={addTask} />
          </div>

          {/* قائمة المهام */}
          <div className="list-section">
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
