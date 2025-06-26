
import React, { useState, useEffect } from 'react';
import { Task, TaskFilter as TaskFilterType } from '@/types/task';
import TaskInput from '@/components/TaskInput';
import CalendarView from '@/components/CalendarView';
import TaskStats from '@/components/TaskStats';
import { Separator } from '@/components/ui/separator';
import { CheckSquare, Sparkles, Calendar } from 'lucide-react';

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

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              التقويم الهجري - مدير المهام
            </h1>
            <Calendar className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-gray-600 text-lg">
            نظم مهامك ومناسباتك وفقاً للتقويم الهجري - أم القرى
          </p>
        </div>

        {/* Stats */}
        <TaskStats 
          totalTasks={taskCounts.all}
          completedTasks={taskCounts.completed}
          activeTasks={taskCounts.active}
        />

        {/* Task Input */}
        <TaskInput onAddTask={addTask} />

        <Separator className="my-6" />

        {/* Calendar View */}
        <CalendarView 
          tasks={tasks}
          onAddTask={addTask}
          onToggleTask={toggleTaskComplete}
        />

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            تم إنشاؤه بـ ❤️ لمساعدتك على تنظيم حياتك وفقاً للتقويم الهجري
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
