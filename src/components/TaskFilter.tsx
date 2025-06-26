
import React from 'react';
import { Button } from '@/components/ui/button';
import { TaskFilter as TaskFilterType } from '@/types/task';

interface TaskFilterProps {
  currentFilter: TaskFilterType;
  onFilterChange: (filter: TaskFilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) => {
  const filters = [
    { key: 'all' as TaskFilterType, label: 'الكل', count: taskCounts.all },
    { key: 'active' as TaskFilterType, label: 'غير مكتملة', count: taskCounts.active },
    { key: 'completed' as TaskFilterType, label: 'مكتملة', count: taskCounts.completed },
  ];

  return (
    <div className="flex gap-2 justify-center mb-6">
      {filters.map(({ key, label, count }) => (
        <Button
          key={key}
          onClick={() => onFilterChange(key)}
          variant={currentFilter === key ? "default" : "outline"}
          className={`rounded-full px-6 py-2 transition-all duration-300 ${
            currentFilter === key
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl'
              : 'border-2 border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          {label} ({count})
        </Button>
      ))}
    </div>
  );
};

export default TaskFilter;
