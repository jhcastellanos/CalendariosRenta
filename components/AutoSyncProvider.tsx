'use client';

import { useEffect } from 'react';

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function AutoSyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const performSync = async () => {
      try {
        console.log('[AUTO-SYNC] Triggering calendar sync...');
        const response = await fetch('/api/sync-calendars');
        const data = await response.json();
        console.log('[AUTO-SYNC] Sync response:', data);
      } catch (error) {
        console.error('[AUTO-SYNC] Error during sync:', error);
      }
    };

    // Perform initial sync
    performSync();

    // Set up interval for subsequent syncs
    const interval = setInterval(performSync, SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
