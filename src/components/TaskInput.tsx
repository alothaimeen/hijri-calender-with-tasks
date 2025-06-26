
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (title: string, description: string) => void;
}

const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    }
  };

  return (
    <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="أضف مهمة جديدة..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-lg border-2 border-blue-200 focus:border-blue-400 rounded-xl text-right"
              dir="rtl"
              onFocus={() => setIsExpanded(true)}
            />
            <Button 
              type="submit" 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl px-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          {isExpanded && (
            <div className="animate-fade-in">
              <Textarea
                placeholder="أضف وصفاً للمهمة (اختياري)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-right border-2 border-blue-200 focus:border-blue-400 rounded-xl resize-none"
                dir="rtl"
                rows={3}
              />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskInput;
