const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  created_at: string;
  updated_at: string;
}

interface TaskListResponse {
  data: Task[];
  meta: { total: number; limit: number; offset: number };
}

interface TaskResponse {
  data: Task;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

export const api = {
  listTasks: (status?: string) => {
    const params = status ? `?status=${status}&limit=100` : '?limit=100';
    return request<TaskListResponse>(`/api/tasks${params}`);
  },

  getTask: (id: number) => request<TaskResponse>(`/api/tasks/${id}`),

  createTask: (task: { title: string; description?: string; status?: string }) =>
    request<TaskResponse>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  updateTask: (id: number, updates: Partial<Pick<Task, 'title' | 'description' | 'status'>>) =>
    request<TaskResponse>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  deleteTask: (id: number) =>
    request<void>(`/api/tasks/${id}`, { method: 'DELETE' }),

  bulkUpdateStatus: (ids: number[], status: string) =>
    request<{ data: Task[] }>('/api/tasks/bulk/status', {
      method: 'PATCH',
      body: JSON.stringify({ ids, status }),
    }),

  checkHealth: () => request<{ status: string }>('/health'),
};
