'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function PropertyEditor({ id, title: initialTitle, photoUrl: initialPhotoUrl }: { id: string; title: string; photoUrl?: string | null }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const response = await fetch(`/api/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, photoUrl }),
    });

    setSaving(false);

    if (!response.ok) {
      const result = await response.json();
      setError(result.message || 'No se pudo actualizar la propiedad');
      return;
    }

    setMessage('Propiedad actualizada correctamente.');
    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este anuncio? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(true);
    setError('');
    setMessage('');

    const response = await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
    });

    setDeleting(false);

    if (!response.ok) {
      const result = await response.json();
      setError(result.message || 'No se pudo eliminar la propiedad');
      return;
    }

    router.push('/properties');
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Editar anuncio</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Actualiza título y enlace de imagen</h2>
      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <label className="block text-sm text-slate-700">
          Título
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          />
        </label>
        <label className="block text-sm text-slate-700">
          Enlace de imagen
          <input
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            placeholder="https://..."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-green-600">{message}</p> : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Atrás
          </button>
          <button
            type="submit"
            disabled={saving || deleting}
            className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="inline-flex rounded-full border border-red-300 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? 'Eliminando...' : 'Eliminar anuncio'}
          </button>
        </div>
      </form>
    </div>
  );
}
