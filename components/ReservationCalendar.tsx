'use client';

import { useMemo } from 'react';

export function ReservationCalendar({ reservations }: { reservations: any[] }) {
  const groupedBySource = useMemo(() => {
    return reservations.reduce((acc: Record<string, any[]>, reservation: any) => {
      if (!acc[reservation.sourceType]) acc[reservation.sourceType] = [];
      acc[reservation.sourceType].push(reservation);
      return acc;
    }, {});
  }, [reservations]);

  const getSourceColor = (sourceType: string) => {
    return sourceType === 'airbnb'
      ? { badge: 'bg-airbnb text-white', card: 'border-l-4 border-l-airbnb' }
      : { badge: 'bg-vrbo text-white', card: 'border-l-4 border-l-vrbo' };
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reservas por plataforma</p>
          <h2 className="text-2xl font-semibold text-slate-900">Próximas reservas</h2>
          <p className="mt-1 text-sm text-slate-600">{reservations.length} reserva(s) activa(s)</p>
        </div>
      </div>

      <div className="space-y-8">
        {reservations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No hay reservas programadas.</div>
        ) : (
          Object.entries(groupedBySource).map(([sourceType, sourceReservations]) => (
            <div key={sourceType} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${getSourceColor(sourceType).badge}`}>
                  {sourceType === 'airbnb' ? 'Airbnb' : 'VRBO'}
                </span>
                <p className="text-sm text-slate-600">{sourceReservations.length} reserva(s)</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sourceReservations.map((reservation: any) => (
                  <div key={reservation.id} className={`rounded-3xl border border-slate-200 p-5 shadow-sm ${getSourceColor(sourceType).card}`}>
                    <h3 className="text-lg font-semibold text-slate-900">{reservation.property.title}</h3>
                    <p className="mt-3 text-sm text-slate-600">Check-in: {new Date(reservation.checkInDate).toLocaleDateString('es-ES')}</p>
                    <p className="text-sm text-slate-600">Check-out: {new Date(reservation.checkOutDate).toLocaleDateString('es-ES')}</p>
                    <p className="mt-3 text-sm text-slate-500">Huésped: {reservation.guestName || 'No disponible'}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${sourceType === 'airbnb' ? 'bg-airbnb' : 'bg-vrbo'}`} />
                      <span className="text-xs text-slate-600">{sourceType.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
