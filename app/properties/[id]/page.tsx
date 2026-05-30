import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TopBar } from '@/components/TopBar';
import { CalendarSourceManager } from '@/components/CalendarSourceManager';
import { PropertyEditor } from '@/components/PropertyEditor';
import { PageShell } from '@/components/PageShell';

export default async function PropertyDetails({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'admin') {
    redirect('/cleaning/dashboard');
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      sources: true,
      reservations: { include: { calendarSource: true }, orderBy: { checkInDate: 'asc' } },
      cleanings: { orderBy: { cleaningDate: 'asc' } },
    },
  });

  if (!property) {
    redirect('/properties');
  }

  return (
    <PageShell widthClass="max-w-6xl">
      <div className="space-y-8">
        <TopBar title={`Propiedad: ${property.title}`} />
        <section className="mt-8 space-y-6">
        <PropertyEditor id={property.id} title={property.title} photoUrl={property.photoUrl} />
        
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Detalle de propiedad</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">{property.title}</h1>
              <p className="mt-3 text-slate-600">Conecta calendarios de Airbnb y VRBO para actualizar reservas y limpiezas automáticamente.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Foto</p>
              {property.photoUrl ? <img src={property.photoUrl} alt={property.title} className="mt-4 h-56 w-full rounded-3xl object-cover" /> : <div className="mt-4 h-56 rounded-3xl bg-slate-100 text-center leading-[14rem] text-slate-400">Sin foto</div>}
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Conexiones de calendario</p>
                <div className="mt-4 space-y-3">
                  {property.sources.length === 0 ? (
                    <p className="text-sm text-slate-600">No hay calendarios conectados.</p>
                  ) : (
                    property.sources.map((source) => (
                      <div key={source.id} className="flex items-center justify-between rounded-3xl border border-slate-200 p-4">
                        <div>
                          <p className="font-semibold text-slate-900">{source.sourceType.toUpperCase()}</p>
                          <p className="text-sm text-slate-500">{source.icalUrl}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{source.active ? 'Activo' : 'Inactivo'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Próximas limpiezas</p>
                <div className="mt-4 space-y-3">
                  {property.cleanings.slice(0, 4).map((cleaning) => (
                    <div key={cleaning.id} className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">{new Date(cleaning.cleaningDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</p>
                      <p className="text-sm text-slate-500">{cleaning.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
            <CalendarSourceManager property={property} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reservas activas</p>
            <ul className="mt-5 space-y-4">
              {property.reservations.length === 0 ? (
                <li className="rounded-3xl border border-dashed border-slate-300 p-6 text-slate-600">No hay reservas sincronizadas aún.</li>
              ) : (
                property.reservations.map((reservation) => {
                  const sourceColor = reservation.sourceType === 'airbnb' ? 'border-l-4 border-l-airbnb' : 'border-l-4 border-l-vrbo';
                  const sourceBadge = reservation.sourceType === 'airbnb' ? 'bg-airbnb text-white' : 'bg-vrbo text-white';
                  return (
                    <li key={reservation.id} className={`rounded-3xl border border-slate-200 p-4 ${sourceColor}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${sourceBadge}`}>
                            {reservation.sourceType.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-slate-500">{reservation.status}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">Estadía: {new Date(reservation.checkInDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })} - {new Date(reservation.checkOutDate).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</p>
                      <p className="mt-1 text-sm text-slate-500">Huésped: {reservation.guestName || 'No disponible'}</p>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Resumen por plataforma</p>
            <div className="mt-5 space-y-3">
              {property.sources.length === 0 ? (
                <p className="text-sm text-slate-600">No hay fuentes de calendario conectadas.</p>
              ) : (
                property.sources.map((source) => {
                  const count = property.reservations.filter((reservation) => reservation.sourceType === source.sourceType).length;
                  const badgeColor = source.sourceType === 'airbnb' ? 'bg-airbnb text-white' : 'bg-vrbo text-white';
                  return (
                    <div key={source.id} className="rounded-3xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${badgeColor}`}>
                            {source.sourceType.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{count} reserva(s)</p>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">Estado: {source.active ? 'Activo' : 'Inactivo'}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
      </div>
    </PageShell>
  );
}
