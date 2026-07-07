import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

// GET /api/posts - List all posts (admin sees all, public sees published)
export async function GET(request: NextRequest) {
  try {
    // Check if admin
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const isAdmin = await verifySession(token);

    let rows;
    if (isAdmin) {
      rows = await query<RowDataPacket[]>(
        'SELECT id, slug, title, content, excerpt, author, category, status, image_mime, seo_title, seo_description, seo_keywords, og_image_mime, created_at, updated_at FROM blog_posts ORDER BY created_at DESC'
      );
    } else {
      rows = await query<RowDataPacket[]>(
        'SELECT id, slug, title, content, excerpt, author, category, status, image_mime, seo_title, seo_description, seo_keywords, og_image_mime, created_at, updated_at FROM blog_posts WHERE status = ? ORDER BY created_at DESC',
        ['published']
      );
    }

    const posts = (rows as RowDataPacket[]).map((row: RowDataPacket) => ({
      slug: row.slug,
      metadata: {
        title: row.title,
        date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : null,
        excerpt: row.excerpt,
        author: row.author,
        category: row.category,
        status: row.status,
        image: row.image_mime ? `/api/media/post-image/${row.slug}` : null,
        seoTitle: row.seo_title,
        seoDescription: row.seo_description,
        seoKeywords: row.seo_keywords,
        ogImage: row.og_image_mime ? `/api/media/post-og/${row.slug}` : null,
      },
      wordCount: row.content ? row.content.split(/\s+/).length : 0,
    }));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json(
      { error: 'Failed to read posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post (requires auth)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const isAdmin = await verifySession(token);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, metadata, imageBase64, imageMime, ogImageBase64, ogImageMime } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    let slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 60);

    // Check if slug exists and add suffix if needed
    const existing = await query<RowDataPacket[]>(
      'SELECT slug FROM blog_posts WHERE slug = ?',
      [slug]
    );
    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Convert base64 to Buffer if provided
    const imageBuffer = imageBase64 ? Buffer.from(imageBase64, 'base64') : null;
    const ogImageBuffer = ogImageBase64 ? Buffer.from(ogImageBase64, 'base64') : null;

    await query(
      `INSERT INTO blog_posts (slug, title, content, excerpt, author, category, status, image_data, image_mime, seo_title, seo_description, seo_keywords, og_image_data, og_image_mime, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title,
        content,
        metadata?.excerpt || '',
        metadata?.author || 'Jorge Reyes',
        metadata?.category || 'Artículo',
        metadata?.status || 'draft',
        imageBuffer,
        imageMime || null,
        metadata?.seoTitle || '',
        metadata?.seoDescription || '',
        metadata?.seoKeywords || '',
        ogImageBuffer,
        ogImageMime || null,
        metadata?.date ? new Date(metadata.date) : new Date(),
      ]
    );

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}