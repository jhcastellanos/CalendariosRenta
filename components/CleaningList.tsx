'use client';

import { useMemo, useState } from 'react';

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-900',
  completed: 'bg-emerald-100 text-emerald-900',
  canceled: 'bg-red-100 text-red-900',
};

export function CleaningList({ cleanings }: { cleanings: any[] }) {
  const [currentStatus, setCurrentStatus] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusMessage, setStatusMessage] = useState('');

  const filtered = cleanings.filter((cleaning) => {
    const statusMatch = currentStatus === 'all' || cleaning.status === currentStatus;
    const propertyMatch = propertyFilter === 'all' || cleaning.property.title === propertyFilter;
    const sourceMatch = sourceFilter === 'all' || cleaning.reservation.calendarSource.sourceType === sourceFilter;
    return statusMatch && propertyMatch && sourceMatch;
  });

  const propertyOptions = useMemo(() => Array.from(new Set(cleanings.map((item) => item.property.title))), [cleanings]);
  const sourceOptions = useMemo(() => Array.from(new Set(cleanings.map((item) => item.reservation.calendarSource.sourceType))), [cleanings]);

  const grouped = filtered.reduce((acc: Record<string, any[]>, item) => {
    const key = new Date(item.cleaningDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <section className="space-y-6">
      {statusMessage ? <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-800">{statusMessage}</div> : null}
      <div className="space-y-4 rounded-3xl bg-white p-5 shadow-soft sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Panel de limpiezas</p>
          <h2 className="text-2xl font-semibold text-slate-900">Limpiezas del mes</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${currentStatus === 'all' ? 'bg-accent text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setCurrentStatus('all')}
          >
            Todas
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${currentStatus === 'pending' ? 'bg-accent text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setCurrentStatus('pending')}
          >
            Pendientes
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${currentStatus === 'completed' ? 'bg-accent text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setCurrentStatus('completed')}
          >
            Completadas
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${currentStatus === 'canceled' ? 'bg-accent text-white' : 'bg-slate-100 text-slate-700'}`}
            onClick={() => setCurrentStatus('canceled')}
          >
            Canceladas
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={propertyFilter} onChange={(event) => setPropertyFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <option value="all">Todas las propiedades</option>
            {propertyOptions.map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
          <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <option value="all">Todas las fuentes</option>
            {sourceOptions.map((source) => (
              <option key={source} value={source}>{source.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-8">
        {Object.keys(grouped).length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center text-slate-600 shadow-soft">No hay limpiezas para las fechas seleccionadas.</div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-slate-900">{date}</h3>
              <ul className="mt-5 space-y-4">
                {items.map((cleaning) => (
                  <li key={cleaning.id} className="grid gap-4 rounded-3xl border border-slate-200 p-4 sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{cleaning.property.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{cleaning.reservation.calendarSource.sourceType.toUpperCase()} — {cleaning.reservation.guestName ?? 'Huésped anónimo'}</p>
                      <p className="mt-2 text-sm text-slate-500">Hora estimada: {cleaning.reservation.checkOutDate ? new Date(cleaning.reservation.checkOutDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'No disponible'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold ${statusStyles[cleaning.status]}`}>
                        {cleaning.status}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            const response = await fetch('/api/cleanings', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ cleaningId: cleaning.id, status: 'completed' }),
                            });
                            if (response.ok) {
                              setStatusMessage('Limpieza marcada como completada.');
                              setTimeout(() => setStatusMessage(''), 3000);
                              window.location.reload();
                            }
                          }}
                          className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-200"
                        >
                          Completada
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const response = await fetch('/api/cleanings', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ cleaningId: cleaning.id, status: 'canceled' }),
                            });
                            if (response.ok) {
                              setStatusMessage('Limpieza cancelada.');
                              setTimeout(() => setStatusMessage(''), 3000);
                              window.location.reload();
                            }
                          }}
                          className="rounded-full bg-red-100 px-3 py-2 text-xs font-semibold text-red-900 hover:bg-red-200"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
