'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SyncButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSync = async () => {
    setStatus('loading');
    setMessage('');
    console.log('[SyncButton] Triggering sync...');
    try {
      const res = await fetch('/api/instagram/sync', { method: 'POST' });
      const data = await res.json();
      console.log('[SyncButton] Sync response:', data);
      if (res.ok) {
        setStatus('done');
        setMessage('Sync complete! Refreshing...');
        // Refresh server component data
        router.refresh();
      } else {
        setStatus('error');
        setMessage(data.error || 'Sync failed. Check logs.');
      }
    } catch (err) {
      console.error('[SyncButton] Error:', err);
      setStatus('error');
      setMessage('Network error during sync.');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={status === 'loading'}
        className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded-xl font-medium transition-colors shadow-sm gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
        {status === 'loading' ? 'Syncing...' : 'Sync Now'}
      </button>
      {message && (
        <span className={`text-sm font-medium ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </span>
      )}
    </div>
  );
}
