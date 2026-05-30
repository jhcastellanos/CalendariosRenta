'use client';

import { useMemo, useState } from 'react';

interface CleaningViewProps {
  cleaningsToday: Array<{
    id: string;
    cleaningDate: string;
    property: { title: string; photoUrl: string | null };
    reservation: {
      checkOutDate: string;
      guestName: string | null;
      sourceType: 'airbnb' | 'vrbo';
    };
  }>;
  upcomingCleanings: Array<{
    id: string;
    cleaningDate: string;
    property: { title: string; photoUrl: string | null };
    reservation: {
      checkOutDate: string;
      guestName: string | null;
      sourceType: 'airbnb' | 'vrbo';
    };
  }>;
  userName: string;
}

const platformStyles = {
  airbnb: {
    name: 'Airbnb',
    badge: 'bg-gradient-to-r from-[#FF5A5F] to-[#E61E4D]',
    accentText: 'text-[#E61E4D]',
    avatar: 'bg-gradient-to-br from-[#FF5A5F] to-[#E61E4D]',
    glow: 'group-hover:ring-[#FF5A5F]/40',
  },
  vrbo: {
    name: 'Vrbo',
    badge: 'bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8]',
    accentText: 'text-[#1D4ED8]',
    avatar: 'bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8]',
    glow: 'group-hover:ring-[#3B82F6]/40',
  },
};

export function CleaningDashboardView({ cleaningsToday, upcomingCleanings, userName }: CleaningViewProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');
  const [showMoreToday, setShowMoreToday] = useState(false);
  const [showMoreUpcoming, setShowMoreUpcoming] = useState(false);

  const cleanings = activeTab === 'today' ? cleaningsToday : upcomingCleanings;
  const displayCount = activeTab === 'today'
    ? showMoreToday ? cleaningsToday.length : Math.min(5, cleaningsToday.length)
    : showMoreUpcoming ? upcomingCleanings.length : Math.min(5, upcomingCleanings.length);
  const displayedCleanings = cleanings.slice(0, displayCount);
  const remainingCount = cleanings.length - displayedCleanings.length;

  const cardRows = useMemo(
    () => displayedCleanings.map((cleaning, index) => ({
      ...cleaning,
      cleaningDate: new Date(cleaning.cleaningDate),
      checkOutDate: new Date(cleaning.reservation.checkOutDate),
      stackIndex: index,
    })),
    [displayedCleanings]
  );

  const headlineCount = cleanings.length;
  const headline = activeTab === 'today'
    ? `Tienes ${headlineCount} limpieza${headlineCount === 1 ? '' : 's'} hoy`
    : `Tienes ${headlineCount} limpieza${headlineCount === 1 ? '' : 's'} próximas`;

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center gap-7">
        <p className="text-sm font-medium text-slate-500">Hola {userName}</p>

        <div className="inline-flex rounded-full bg-slate-100 p-1.5 shadow-inner">
          <button
            type="button"
            aria-pressed={activeTab === 'today'}
            onClick={() => {
              setActiveTab('today');
              setShowMoreToday(false);
            }}
            className={`rounded-full px-10 py-3 text-base font-semibold transition ${
              activeTab === 'today'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}>
            Hoy
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'upcoming'}
            onClick={() => {
              setActiveTab('upcoming');
              setShowMoreUpcoming(false);
            }}
            className={`rounded-full px-10 py-3 text-base font-semibold transition ${
              activeTab === 'upcoming'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}>
            Próximas
          </button>
        </div>

        <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {headline}
        </h1>
      </div>

      {cardRows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
          <p className="text-base font-medium text-slate-500">No hay limpiezas para esta vista.</p>
        </div>
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          {cardRows.map((cleaning) => {
            const type = cleaning.reservation.sourceType;
            const style = platformStyles[type];
            const imageUrl = cleaning.property.photoUrl || '/default-house.jpg';
            const formattedCheckout = cleaning.checkOutDate.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const guestName = cleaning.reservation.guestName || 'Reserva sin nombre';
            const initial = guestName.trim().charAt(0).toUpperCase() || 'R';

            return (
              <div
                key={cleaning.id}
                className={`group overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${style.glow}`}>
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={cleaning.property.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
                  <span
                    className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg ${style.badge}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                    {style.name}
                  </span>
                </div>

                <div className="p-6">
                  <p className={`text-xs font-bold uppercase tracking-[0.22em] ${style.accentText}`}>Checkout</p>
                  <p className="mt-1.5 text-3xl font-bold leading-tight text-slate-900">{formattedCheckout}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-700">{cleaning.property.title}</p>

                  <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${style.avatar}`}>
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{guestName}</p>
                      <p className="text-xs text-slate-400">Reservado</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {remainingCount > 0 && (
        <button
          type="button"
          onClick={() => {
            if (activeTab === 'today') setShowMoreToday(true);
            else setShowMoreUpcoming(true);
          }}
          className="mx-auto block rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Ver más ({remainingCount})
        </button>
      )}
    </div>
  );
}
