
import React, { useState, useEffect } from 'react';
import { Task, TaskFilter } from '@/types/task';
import TaskInput from '@/components/TaskInput';
import TaskItem from '@/components/TaskItem';
import TaskFilter from '@/components/TaskFilter';
import TaskStats from '@/components/TaskStats';
import { Separator } from '@/components/ui/separator';
import { CheckSquare, Sparkles } from 'lucide-react';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');

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

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
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

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              مدير المهام الشخصية
            </h1>
            <CheckSquare className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-gray-600 text-lg">
            نظم مهامك اليومية وحقق أهدافك بكفاءة
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

        {/* Task Filter */}
        <TaskFilter 
          currentFilter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
        />

        <Separator className="my-6" />

        {/* Tasks List */}
        <div className="space-y-0">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {filter === 'completed' && 'لا توجد مهام مكتملة بعد'}
                {filter === 'active' && 'لا توجد مهام نشطة'}
                {filter === 'all' && 'لا توجد مهام بعد'}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' && 'ابدأ بإضافة مهمة جديدة أعلاه'}
                {filter === 'active' && 'جميع مهامك مكتملة! أحسنت'}
                {filter === 'completed' && 'أكمل بعض المهام لترها هنا'}
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                  onDeleteTask={deleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            تم إنشاؤه بـ ❤️ لمساعدتك على تنظيم حياتك
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
