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
        className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
