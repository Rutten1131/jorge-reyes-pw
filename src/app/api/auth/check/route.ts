import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const isValid = await verifySession(token);

    return NextResponse.json({ authenticated: isValid });
  } catch (error) {
    console.error('Error checking auth:', error);
    return NextResponse.json({ authenticated: false });
  }
}
