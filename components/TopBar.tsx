'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TopBar({ title }: { title: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleLogout() {
    setSaving(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{title}</p>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        {saving ? 'Cerrando…' : 'Cerrar sesión'}
      </button>
    </div>
  );
}
