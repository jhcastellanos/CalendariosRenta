'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      const destination = data.role === 'admin' ? '/admin/dashboard' : '/cleaning/dashboard';
      window.location.href = destination;
      return;
    }

    const result = await response.json();
    setError(result.message || 'Credenciales incorrectas');
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
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Validando...' : 'Entrar'}
          </button>
        </form>
        {/* Debug output removed to avoid showing raw API messages before redirect */}
      </div>
    </main>
  );
}
