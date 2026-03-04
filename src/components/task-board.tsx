"use client";

import { useState, useEffect, useCallback } from 'react';
import { api, Task } from '@/lib/api';
import { Column } from './column';
import { TaskDialog } from './task-dialog';
import { ConnectionStatus } from './connection-status';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50 dark:bg-blue-950' },
  { id: 'done', title: 'Done', color: 'bg-green-50 dark:bg-green-950' },
] as const;

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.listTasks();
      setTasks(res.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (task: { title: string; description?: string; status?: string }) => {
    await api.createTask(task);
    fetchTasks();
    setDialogOpen(false);
  };

  const handleUpdate = async (id: number, updates: { title?: string; description?: string; status?: string }) => {
    await api.updateTask(id, updates as Partial<Pick<Task, 'title' | 'description' | 'status'>>);
    fetchTasks();
    setEditingTask(null);
  };

  const handleDelete = async (id: number) => {
    await api.deleteTask(id);
    fetchTasks();
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    await api.updateTask(id, { status: newStatus as Task['status'] });
    fetchTasks();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Staxa Demo
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Task Board</p>
          </div>
          <div className="flex items-center gap-4">
            <ConnectionStatus />
            <button
              onClick={handleNewTask}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + New Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
            <p className="text-sm text-gray-500">
              Make sure the API is running at{' '}
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
              </code>
            </p>
            <button
              onClick={fetchTasks}
              className="mt-4 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                title={col.title}
                color={col.color}
                tasks={tasks.filter((t) => t.status === col.id)}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-gray-400">
          <span>Deployed on Staxa</span>
          <span>
            API: {process.env.NEXT_PUBLIC_API_URL || 'localhost:3000'}
          </span>
        </div>
      </footer>

      <TaskDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingTask(null); }}
        onSubmit={editingTask
          ? (data) => handleUpdate(editingTask.id, data)
          : handleCreate
        }
        task={editingTask}
      />
    </div>
  );
}
