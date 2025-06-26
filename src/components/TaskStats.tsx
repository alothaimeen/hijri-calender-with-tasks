
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle, TrendingUp } from 'lucide-react';

interface TaskStatsProps {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
}

const TaskStats = ({ totalTasks, completedTasks, activeTasks }: TaskStatsProps) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Circle className="w-6 h-6 ml-2" />
            <span className="text-2xl font-bold">{totalTasks}</span>
          </div>
          <p className="text-blue-100">إجمالي المهام</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6 ml-2" />
            <span className="text-2xl font-bold">{completedTasks}</span>
          </div>
          <p className="text-green-100">مهام مكتملة</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 ml-2" />
            <span className="text-2xl font-bold">{completionRate}%</span>
          </div>
          <p className="text-purple-100">معدل الإنجاز</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStats;
