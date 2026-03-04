import { Task } from '@/lib/api';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: number, status: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  todo: ['in_progress'],
  in_progress: ['todo', 'done'],
  done: ['in_progress'],
};

const STATUS_LABELS: Record<string, string> = {
  todo: 'Start',
  in_progress: 'In Progress',
  done: 'Complete',
};

export function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const transitions = STATUS_TRANSITIONS[task.status] || [];
  const timeAgo = getTimeAgo(task.created_at);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-medium text-sm text-gray-900 dark:text-white">{task.title}</h3>
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span className="text-[11px] text-gray-400">{timeAgo}</span>
        <div className="flex items-center gap-1">
          {transitions.map((targetStatus) => (
            <button
              key={targetStatus}
              onClick={() => onStatusChange(task.id, targetStatus)}
              className="text-[11px] px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={`Move to ${STATUS_LABELS[targetStatus]}`}
            >
              {targetStatus === 'done' ? '✓' : targetStatus === 'todo' ? '←' : '→'}
            </button>
          ))}
          <button
            onClick={() => onEdit(task)}
            className="text-[11px] px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this task?')) onDelete(task.id);
            }}
            className="text-[11px] px-2 py-0.5 rounded border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
