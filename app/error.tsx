"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-24 text-center">
      <div className="w-full rounded-3xl bg-white p-12 shadow-soft">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Error de la aplicación</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">Algo salió mal</h1>
        <p className="mt-4 text-slate-600">Por favor recarga la página o vuelve a intentarlo más tarde.</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
