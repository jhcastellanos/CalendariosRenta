import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="rounded-3xl bg-white p-12 shadow-soft">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Calendarios Renta</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">Gestiona propiedades, reservas y limpiezas</h1>
        <p className="mt-4 text-slate-600">Sistema privado para sincronizar calendarios de Airbnb y VRBO con un panel dedicado para limpieza.</p>
        <div className="mt-10 flex justify-center">
          <Link href="/login" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-blue-600">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </main>
  );
}
