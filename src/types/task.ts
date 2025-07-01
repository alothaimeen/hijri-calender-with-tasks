
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  recurringCount?: number;
  originalTaskId?: string; // للمهام المكررة
}

export type TaskFilter = 'all' | 'active' | 'completed';

export interface RecurringOptions {
  type: 'none' | 'daily' | 'weekly' | 'monthly';
  count: number;
}
