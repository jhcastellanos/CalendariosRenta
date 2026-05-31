'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'cr-install-dismissed';

export function PWAManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const register = () => navigator.serviceWorker.register('/sw.js').catch(() => undefined);
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register);
    }
  }, []);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      if (typeof window !== 'undefined' && window.localStorage.getItem(DISMISS_KEY) === '1') return;
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setVisible(false);
    if (typeof window !== 'undefined') window.localStorage.setItem(DISMISS_KEY, '1');
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FF5A5F] to-[#1A73E8] text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" />
            <path d="m9.5 10.5 1.8 1.8 3.2-3.6" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">Instalar Calendarios Renta</p>
          <p className="truncate text-xs text-slate-500">Acceso rápido desde tu pantalla de inicio.</p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-full px-3 py-2 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
        >
          Ahora no
        </button>
        <button
          type="button"
          onClick={handleInstall}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          Instalar
        </button>
      </div>
    </div>
  );
}
