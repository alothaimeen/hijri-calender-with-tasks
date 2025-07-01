
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  recurring?: 'weekly' | 'monthly' | 'none';
}

export type TaskFilter = 'all' | 'active' | 'completed';
