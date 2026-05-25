import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const SESSION_COOKIE = 'calendarios_renta_session';

const jwtSecret = process.env.JWT_SECRET || 'default-secret';
const cookieSecret = process.env.COOKIE_SECRET || 'default-secret';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cleaning';
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: object) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '8h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, jwtSecret) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload as SessionUser | null;
}

export function getSessionCookie(token: string) {
  const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=28800`;
}

export function getLogoutCookie() {
  const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=0`;
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
