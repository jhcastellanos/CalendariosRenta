'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function PropertyManager({ properties }: { properties: any[] }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function createProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, photoUrl }),
    });

    setSaving(false);

    if (!response.ok) {
      const result = await response.json();
      setError(result.message || 'No se pudo crear la propiedad');
      return;
    }

    setTitle('');
    setPhotoUrl('');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createProperty} className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Crear nueva propiedad</h2>
          <p className="mt-2 text-sm text-slate-600">Agrega un título y una foto para comenzar a conectar calendarios.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Título
            <input value={title} onChange={(event) => setTitle(event.target.value)} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Foto (URL)
            <input value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
          </label>
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={saving} className="mt-5 inline-flex items-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60">
          {saving ? 'Guardando...' : 'Crear propiedad'}
        </button>
      </form>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <article key={property.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 h-36 overflow-hidden rounded-3xl bg-slate-100">
              {property.photoUrl ? <img src={property.photoUrl} alt={property.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400">Sin foto</div>}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{property.title}</h3>
            <p className="mt-3 text-sm text-slate-600">Calendarios: {property.sources.length}</p>
            <a href={`/properties/${property.id}`} className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
              Ver propiedad
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
