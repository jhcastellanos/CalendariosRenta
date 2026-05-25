'use client';

import Link from 'next/link';

export function PropertyCard({ property }: { property: any }) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-3xl bg-slate-100">
          {property.photoUrl ? (
            <img src={property.photoUrl} alt={property.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">Foto</div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-500">Propiedad</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{property.title}</h2>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
            <span>{property.sources?.length ?? 0} calendario(s)</span>
            <span>{property.reservations?.length ?? 0} reserva(s)</span>
            <span>{property.cleanings?.length ?? 0} limpieza(s)</span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href={`/properties/${property.id}`} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
          Ver calendario
        </Link>
      </div>
    </article>
  );
}
