'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const sourceTypes = [
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'vrbo', label: 'VRBO' },
];

export function CalendarSourceManager({ property }: { property: any }) {
  const router = useRouter();
  const [sourceType, setSourceType] = useState('airbnb');
  const [icalUrl, setIcalUrl] = useState('');
  const [color, setColor] = useState('#f15a5a');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const sources = useMemo(() => property.sources || [], [property.sources]);

  const addSource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    const response = await fetch('/api/calendar-sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: property.id, sourceType, icalUrl, color, active }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(result.message || 'No se pudo agregar la fuente');
      return;
    }

    setIcalUrl('');
    setMessage('Calendario agregado correctamente.');
    router.refresh();
  };

  const syncSource = async (sourceId: string) => {
    setSaving(true);
    setMessage('Sincronizando calendario...');

    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId }),
    });

    const result = await response.json();
    setSaving(false);
    setMessage(result.message || 'Sincronización completada');
    if (response.ok) router.refresh();
  };

  const syncAllSources = async () => {
    setSaving(true);
    setMessage('Sincronizando todos los calendarios...');

    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: property.id }),
    });

    const result = await response.json();
    setSaving(false);
    setMessage(result.message || 'Sincronización completada para todos los calendarios');
    if (response.ok) router.refresh();
  };

  const deleteSource = async (sourceId: string) => {
    setSaving(true);
    setMessage('Eliminando fuente...');

    const response = await fetch(`/api/calendar-sources/${sourceId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    setSaving(false);
    if (response.ok) {
      setMessage('Fuente eliminada correctamente.');
      router.refresh();
    } else {
      setMessage('No se pudo eliminar la fuente.');
    }
  };

  const groupedByType = useMemo(() => {
    return sources.reduce((acc: Record<string, any[]>, source: any) => {
      if (!acc[source.sourceType]) acc[source.sourceType] = [];
      acc[source.sourceType].push(source);
      return acc;
    }, {});
  }, [sources]);

  const getSourceBadgeColor = (sourceType: string) => {
    return sourceType === 'airbnb' ? 'bg-airbnb text-white' : 'bg-vrbo text-white';
  };

  const getSourceBadgeLabel = (sourceType: string) => {
    return sourceType === 'airbnb' ? 'Airbnb' : 'VRBO';
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Calendarios conectados</p>
            <h2 className="text-2xl font-semibold text-slate-900">Gestiona fuentes iCal</h2>
            <p className="mt-1 text-sm text-slate-600">{sources.length} calendario(s) conectado(s)</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={syncAllSources}
              disabled={saving || !sources.length}
              className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
            >
              Sincronizar todos
            </button>
          </div>
        </div>

        {message ? <p className="mt-4 rounded-3xl bg-blue-50 p-3 text-sm text-blue-800">{message}</p> : null}

        <div className="mt-6 space-y-8">
          {sources.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-slate-600">No hay calendarios conectados para esta propiedad.</div>
          ) : (
            Object.entries(groupedByType).map(([sourceType, typeSources]) => {
              const sourceList = typeSources as any[];
              return (
              <div key={sourceType} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${getSourceBadgeColor(sourceType)}`}>
                    {getSourceBadgeLabel(sourceType)}
                  </span>
                  <p className="text-sm text-slate-600">{sourceList.length} calendario(s)</p>
                </div>
                <div className="space-y-3">
                  {sourceList.map((source: any) => (
                    <div key={source.id} className="rounded-3xl border border-slate-200 p-4 sm:flex sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-slate-900">Calendario iCal</p>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${source.active ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'}`}>
                            {source.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <p className="mt-2 break-all text-sm text-slate-500">{source.icalUrl}</p>
                        <p className="mt-1 text-xs text-slate-400">Conectado el {new Date(source.createdAt).toLocaleDateString('es-ES')}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:flex-nowrap">
                        <button
                          type="button"
                          onClick={() => syncSource(source.id)}
                          disabled={saving}
                          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
                        >
                          Sincronizar
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSource(source.id)}
                          disabled={saving}
                          className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-60"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
            })
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Agregar nuevo calendario</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Conecta una fuente iCal</h2>
          <p className="mt-2 text-sm text-slate-600">Puedes agregar múltiples calendarios de Airbnb y VRBO a la misma propiedad.</p>
        </div>

        <form onSubmit={addSource} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Plataforma
              <select
                value={sourceType}
                onChange={(event) => {
                  setSourceType(event.target.value);
                  setColor(event.target.value === 'airbnb' ? '#f15a5a' : '#3b82f6');
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              >
                {sourceTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              URL del calendario iCal
              <input
                value={icalUrl}
                onChange={(event) => setIcalUrl(event.target.value)}
                placeholder="https://calendar.airbnb.com/ical/... o https://www.vrbo.com/..."
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Color de identificación
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-12 w-12 rounded-2xl border border-slate-200"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  placeholder="#f15a5a"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
              </div>
            </label>
            <label className="flex items-center gap-3 space-y-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={active}
                onChange={(event) => setActive(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-accent"
              />
              <span>Activar sincronización inmediata</span>
            </label>
          </div>

          {message && !message.includes('Sincronizando') ? (
            <p className={`rounded-3xl p-3 text-sm ${message.includes('correctamente') ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
          >
            {saving ? 'Guardando...' : '+ Agregar calendario'}
          </button>
        </form>
      </section>
    </div>
  );
}
