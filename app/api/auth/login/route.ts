import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getUserByEmail, getLogoutCookie, getSessionCookie, signToken, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const identifier = String(body.username || body.email || '').trim().toLowerCase();
  const { password } = body;

  if (!identifier || !password) {
    return NextResponse.json({ message: 'Usuario y contraseña son obligatorios' }, { status: 400 });
  }

  const user = await getUserByEmail(identifier);
  if (process.env.NODE_ENV !== 'production') {
    console.log('LOGIN REQUEST', { identifier, user: user ? { id: user.id, email: user.email, role: user.role } : null });
  }
  if (!user) {
    return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
  }

  const isValid = await verifyPassword(String(password), user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
  }

  const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });

  // Note: calendar syncing is handled by AutoSyncProvider (on page load and
  // every few minutes), so we intentionally do NOT block login on a full sync.
  const response = NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  response.headers.set('Set-Cookie', getSessionCookie(token));
  return response;
}
