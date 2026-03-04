"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function ConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    const check = async () => {
      try {
        await api.checkHealth();
        setStatus('connected');
      } catch {
        setStatus('error');
      }
    };

    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <div
        className={`h-2 w-2 rounded-full ${
          status === 'connected'
            ? 'bg-green-500'
            : status === 'error'
            ? 'bg-red-500'
            : 'bg-yellow-500 animate-pulse'
        }`}
      />
      <span className="text-gray-500 dark:text-gray-400">
        {status === 'connected' ? 'API Connected' : status === 'error' ? 'API Offline' : 'Checking...'}
      </span>
    </div>
  );
}
