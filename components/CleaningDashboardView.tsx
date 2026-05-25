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
    border: 'border-red-500',
    label: 'bg-red-50 text-red-700',
    dot: 'bg-red-500',
  },
  vrbo: {
    border: 'border-blue-500',
    label: 'bg-blue-50 text-blue-700',
    dot: 'bg-blue-500',
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

  const title = activeTab === 'today' ? 'Limpiezas programadas' : 'Limpiezas futuras';
  const subtitle = activeTab === 'today'
    ? `${cleaningsToday.length} limpieza(s) de hoy`
    : `${upcomingCleanings.length} próximas limpieza(s)`;

  const cardRows = useMemo(
    () => displayedCleanings.map((cleaning, index) => ({
      ...cleaning,
      cleaningDate: new Date(cleaning.cleaningDate),
      checkOutDate: new Date(cleaning.reservation.checkOutDate),
      stackIndex: index,
    })),
    [displayedCleanings]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{activeTab === 'today' ? 'Hoy' : 'Próximas'}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Panel de limpieza</h1>
          <p className="mt-2 text-sm text-slate-600">Hola {userName}, selecciona Hoy o Próximas limpiezas.</p>
        </div>
        <div className="inline-flex rounded-full bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('today');
              setShowMoreToday(false);
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === 'today'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}>
            Today
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('upcoming');
              setShowMoreUpcoming(false);
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === 'upcoming'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}>
            Upcoming
          </button>
        </div>
      </div>

      <div className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{activeTab === 'today' ? 'Hoy' : 'Próximas'}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {cleanings.length} limpio(s)
          </div>
        </div>

        <div className="space-y-5">
          {cardRows.length === 0 ? (
            <p className="text-sm text-slate-600">No hay limpiezas para esta vista.</p>
          ) : (
            cardRows.map((cleaning, index) => {
              const type = cleaning.reservation.sourceType;
              const imageUrl = cleaning.property.photoUrl || '/default-house.jpg';
              const formattedCheckout = cleaning.checkOutDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

              return (
                <div
                  key={cleaning.id}
                  className={`relative overflow-hidden rounded-[32px] border border-slate-200 border-l-8 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${platformStyles[type].border}`}>
                  <div className="flex items-center gap-4">
                    <div className={`min-w-[92px] rounded-3xl px-4 py-3 text-center ${platformStyles[type].label}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em]">{type.toUpperCase()}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-500">Checkout</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{formattedCheckout}</p>
                      <p className="mt-2 text-sm text-slate-600">{cleaning.property.title}</p>
                    </div>
                    <div className="flex h-20 w-24 items-center justify-center overflow-hidden rounded-[24px] bg-slate-100">
                      <img
                        src={imageUrl}
                        alt={cleaning.property.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${platformStyles[type].dot}`} />
                      {type.toUpperCase()}
                    </span>
                    <span>{cleaning.reservation.guestName || 'Guest reservado'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {remainingCount > 0 && (
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'today') setShowMoreToday(true);
              else setShowMoreUpcoming(true);
            }}
            className="mx-auto block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Ver más ({remainingCount})
          </button>
        )}
      </div>
    </div>
  );
}
