import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PropertyCard } from '@/components/PropertyCard';
import { TopBar } from '@/components/TopBar';
import { PageShell } from '@/components/PageShell';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'admin') {
    redirect('/cleaning/dashboard');
  }

  const now = new Date();
  const upcomingReservations = await prisma.reservation.findMany({
    where: { status: 'active', checkOutDate: { gte: now } },
    include: { property: true, calendarSource: true },
    orderBy: { checkOutDate: 'asc' },
  });



  const properties = await prisma.property.findMany({
    include: { sources: true, reservations: true, cleanings: true },
    orderBy: { updatedAt: 'desc' },
  });

  const lastSync = await prisma.syncLog.findFirst({ orderBy: { syncedAt: 'desc' } });

  return (
    <PageShell>
      <div className="space-y-8">
        <TopBar title={`Bienvenido, ${session.name}`} />
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Sincronización</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Última sincronización</h2>
              <p className="mt-4 text-slate-600">{lastSync ? new Date(lastSync.syncedAt).toLocaleString('es-ES') : 'Aún no hay sincronizaciones'}</p>
              <p className="mt-3 text-slate-500">Fuente afectada: {lastSync?.calendarSourceId ?? 'N/A'}</p>
            </section>
          </div>
        </div>

        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Próximas salidas</p>
            <h2 className="text-2xl font-semibold text-slate-900">Todas las reservas por checkout</h2>
            <p className="mt-1 text-sm text-slate-600">{upcomingReservations.length} reserva(s) activa(s)</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingReservations.length === 0 ? (
            <p className="col-span-full text-sm text-slate-600">No hay reservas próximas.</p>
          ) : (
            upcomingReservations.map((reservation) => {
              const borderColor = reservation.sourceType === 'airbnb' ? 'border-l-4 border-l-airbnb' : 'border-l-4 border-l-vrbo';
              const badgeColor = reservation.sourceType === 'airbnb' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700';
              const dotColor = reservation.sourceType === 'airbnb' ? 'bg-airbnb' : 'bg-vrbo';
              return (
                <div key={reservation.id} className={`rounded-3xl border border-slate-200 p-5 shadow-sm ${borderColor}`}>
                  <h3 className="text-lg font-semibold text-slate-900">{reservation.property.title}</h3>
                  <div className="mt-3 space-y-2">
                    <p className="text-4xl font-bold text-slate-900">{new Date(reservation.checkOutDate).toLocaleDateString('es-ES')}</p>
                    <p className="text-xs text-slate-500">Checkout: {new Date(reservation.checkOutDate).toLocaleDateString('es-ES', { weekday: 'short' })}</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">Check-in: {new Date(reservation.checkInDate).toLocaleDateString('es-ES')}</p>
                  <p className="mt-3 text-sm text-slate-500">Huésped: {reservation.guestName || 'No disponible'}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${dotColor}`} />
                      <span className="text-xs text-slate-600">{reservation.sourceType.toUpperCase()}</span>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
                      {reservation.sourceType.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Propiedades</p>
                  <h2 className="text-2xl font-semibold text-slate-900">Todas las propiedades</h2>
                </div>
                <a href="/properties" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
                  Administrar propiedades
                </a>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </section>
          </div>
    </PageShell>
  );
}
