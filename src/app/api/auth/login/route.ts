import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createSession, SESSION_COOKIE, cleanExpiredSessions } from '@/lib/auth';
import { initDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Ensure tables exist
    await initDatabase();
    
    // Clean expired sessions
    await cleanExpiredSessions();

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const token = await createSession();

    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso',
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
