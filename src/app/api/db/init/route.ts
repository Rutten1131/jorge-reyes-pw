import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDatabase();
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables created successfully (blog_posts, blog_media, blog_sessions)' 
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: String(error) },
      { status: 500 }
    );
  }
}
