import { NextResponse } from 'next/server';

export function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', 'calendarios_renta_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  return response;
}
