export type ClientNotification = {
  id: string;
  type: 'new_cleaning' | 'canceled_cleaning';
  message: string;
};

const SHOWN_KEY = 'cr-notifications-shown';

function getShownIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = sessionStorage.getItem(SHOWN_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function markShown(ids: string[]) {
  const shown = getShownIds();
  ids.forEach((id) => shown.add(id));
  sessionStorage.setItem(SHOWN_KEY, JSON.stringify([...shown]));
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  return (await Notification.requestPermission()) === 'granted';
}

export async function setAppBadgeCount(count: number) {
  if (!('setAppBadge' in navigator)) return;
  try {
    if (count > 0) await navigator.setAppBadge(count);
    else if ('clearAppBadge' in navigator) await navigator.clearAppBadge();
  } catch {
    // Badge API may be unavailable depending on platform/browser.
  }
}

export async function showSystemNotifications(items: ClientNotification[]) {
  if (items.length === 0) return;
  if (!(await ensureNotificationPermission())) return;

  const registration = await navigator.serviceWorker?.ready;
  if (!registration) return;

  const shown = getShownIds();
  const pending = items.filter((item) => !shown.has(item.id));
  if (pending.length === 0) return;

  for (const item of pending) {
    await registration.showNotification('Calendarios Renta', {
      body: item.message,
      icon: '/icons/icon-192.png',
      badge: '/icons/favicon-32.png',
      tag: item.id,
      data: { url: '/cleaning/dashboard' },
    });
  }

  markShown(pending.map((item) => item.id));
}
