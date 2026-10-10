'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  setAppBadgeCount,
  showSystemNotifications,
  type ClientNotification,
} from '@/lib/client-notifications';

type AppNotification = ClientNotification & {
  createdAt: string;
};

export function NotificationManager() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [visible, setVisible] = useState(false);

  const refreshNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications', { credentials: 'include' });
      if (!response.ok) return;

      const data = await response.json();
      const items = (data.notifications || []) as AppNotification[];
      setNotifications(items);
      await setAppBadgeCount(data.unreadCount || 0);
      setVisible(items.length > 0);

      if (items.length > 0) {
        await showSystemNotifications(
          items.map((item) => ({ id: item.id, type: item.type, message: item.message }))
        );
      }
    } catch {
      // Ignore network errors for background refresh.
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
    const interval = window.setInterval(refreshNotifications, 60_000);
    const onSyncComplete = () => refreshNotifications();
    window.addEventListener('calendar-sync-complete', onSyncComplete);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('calendar-sync-complete', onSyncComplete);
    };
  }, [refreshNotifications]);

  async function dismissAll() {
    await fetch('/api/notifications', { method: 'POST', credentials: 'include' });
    setNotifications([]);
    setVisible(false);
    await setAppBadgeCount(0);
  }

  if (!visible || notifications.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Actualización de calendario</p>
            <p className="mt-1 text-xs text-slate-500">
              {notifications.length} cambio{notifications.length === 1 ? '' : 's'} desde la última sincronización
            </p>
          </div>
          <button
            type="button"
            onClick={dismissAll}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            Entendido
          </button>
        </div>

        <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
          {notifications.map((item) => (
            <li
              key={item.id}
              className={`rounded-xl px-3 py-2 text-sm ${
                item.type === 'new_cleaning'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {item.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function markNotificationsRead() {
  try {
    await fetch('/api/notifications', { method: 'POST', credentials: 'include' });
    await setAppBadgeCount(0);
  } catch {
    // Best effort when dashboards mount.
  }
}
