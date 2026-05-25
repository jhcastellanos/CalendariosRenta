'use client';

export function DashboardSummary({ counts }: { counts: { upcomingReservations: number; upcomingCleanings: number; properties: number } }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-sm text-slate-500">Próximas reservas</p>
        <p className="mt-4 text-4xl font-semibold text-slate-900">{counts.upcomingReservations}</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-sm text-slate-500">Próximas limpiezas</p>
        <p className="mt-4 text-4xl font-semibold text-slate-900">{counts.upcomingCleanings}</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="text-sm text-slate-500">Propiedades</p>
        <p className="mt-4 text-4xl font-semibold text-slate-900">{counts.properties}</p>
      </div>
    </div>
  );
}
