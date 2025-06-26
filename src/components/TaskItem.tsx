
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/task';
import { Trash2, Calendar } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskItem = ({ task, onToggleComplete, onDeleteTask }: TaskItemProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card className={`mb-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
      task.completed 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
        : 'bg-white border-gray-200 hover:border-blue-300'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
          
          <div className="flex-1 text-right">
            <h3 className={`text-lg font-semibold transition-all duration-300 ${
              task.completed 
                ? 'line-through text-gray-500' 
                : 'text-gray-800'
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`mt-2 text-sm transition-all duration-300 ${
                task.completed 
                  ? 'line-through text-gray-400' 
                  : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center justify-end gap-2 mt-3 text-xs text-gray-500">
              <span>{formatDate(task.createdAt)}</span>
              <Calendar className="w-3 h-3" />
            </div>
          </div>
          
          <Button
            onClick={() => onDeleteTask(task.id)}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
