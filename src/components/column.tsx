import { Task } from '@/lib/api';
import { TaskCard } from './task-card';

interface ColumnProps {
  title: string;
  color: string;
  tasks: Task[];
  onStatusChange: (id: number, status: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function Column({ title, color, tasks, onStatusChange, onEdit, onDelete }: ColumnProps) {
  return (
    <div className={`rounded-xl p-4 ${color} min-h-[400px]`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h2>
        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            No tasks
          </p>
        )}
      </div>
    </div>
  );
}
