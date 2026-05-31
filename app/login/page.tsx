'use client';

import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    let response;
    try {
      response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        mode: 'same-origin',
        body: JSON.stringify({ username, password }),
      });
    } catch (error) {
      setError('Error de red. Por favor inténtalo de nuevo.');
      setLoading(false);
      return;
    }

    if (!response.ok) {
      const result = await response.json();
      setError(result.message || 'Credenciales incorrectas');
      setLoading(false);
      return;
    }

    const data = await response.json();
    const destination = data.role === 'admin' ? '/admin/dashboard' : '/cleaning/dashboard';

    // Mostramos la pantalla de sincronización mientras el servidor decide si
    // debe sincronizar (solo si pasó más de 1 hora desde la última vez).
    setSyncing(true);
    try {
      await fetch('/api/sync-on-login', {
        method: 'POST',
        credentials: 'include',
        mode: 'same-origin',
      });
    } catch (error) {
      // Si la sincronización falla, igual permitimos el acceso.
    }

    window.location.href = destination;
  }

  if (syncing) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
        <div className="w-full rounded-3xl bg-white p-10 text-center shadow-soft">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-accent" />
          <h1 className="mt-8 text-2xl font-semibold text-slate-900">Sincronizando calendarios…</h1>
          <p className="mt-3 text-slate-600">
            Estamos actualizando tus reservas y limpiezas antes de entrar al panel.
          </p>
          <p className="mt-2 text-sm text-slate-500">Esto puede tardar unos segundos.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
      <div className="w-full rounded-3xl bg-white p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Iniciar sesión</h1>
        <p className="mt-2 text-slate-600">Accede al panel privado de calendarios y limpiezas.</p>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              placeholder=""
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-slate-700"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Validando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
