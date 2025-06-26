
import React, { useState } from 'react';
import { Task, TaskFilter as TaskFilterType } from '@/types/task';
import TaskItem from '@/components/TaskItem';
import TaskFilter from '@/components/TaskFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList = ({ tasks, onToggleTask, onDeleteTask }: TaskListProps) => {
  const [filter, setFilter] = useState<TaskFilterType>('all');

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
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

  if (tasks.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <CheckSquare className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">لا توجد مهام بعد. أضف مهمة جديدة للبدء!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-center text-blue-800 flex items-center justify-center gap-2">
          <CheckSquare className="w-6 h-6" />
          قائمة المهام ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* فلتر المهام */}
        <TaskFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
        />

        {/* قائمة المهام المفلترة */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">لا توجد مهام في هذا القسم</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleTask}
                onDeleteTask={onDeleteTask}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;
