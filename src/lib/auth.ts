import { cookies } from 'next/headers';
import { query } from './db';
import type { RowDataPacket } from 'mysql2';

const ADMIN_USER = 'JorgeReyes';
const ADMIN_PASS = 'Contraseña123.';
const SESSION_COOKIE = 'blog_session';
const SESSION_DURATION_HOURS = 24;

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function createSession(): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

  await query(
    'INSERT INTO blog_sessions (token, expires_at) VALUES (?, ?)',
    [token, expiresAt]
  );

  return token;
}

export async function verifySession(token?: string): Promise<boolean> {
  if (!token) return false;

  try {
    const rows = await query<RowDataPacket[]>(
      'SELECT id FROM blog_sessions WHERE token = ? AND expires_at > NOW()',
      [token]
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function getSessionFromCookies(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);
    if (!sessionCookie?.value) return false;
    return verifySession(sessionCookie.value);
  } catch {
    return false;
  }
}

export async function destroySession(token: string): Promise<void> {
  await query('DELETE FROM blog_sessions WHERE token = ?', [token]);
}

// Clean up expired sessions
export async function cleanExpiredSessions(): Promise<void> {
  await query('DELETE FROM blog_sessions WHERE expires_at < NOW()');
}

export { SESSION_COOKIE };
