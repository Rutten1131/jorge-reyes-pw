import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Params {
  params: Promise<{ slug: string }>;
}

// GET /api/posts/[slug] - Get single post
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const rows = await query<RowDataPacket[]>(
      'SELECT id, slug, title, content, excerpt, author, category, status, image_mime, seo_title, seo_description, seo_keywords, og_image_mime, created_at, updated_at FROM blog_posts WHERE slug = ?',
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const row = rows[0];

    return NextResponse.json({
      slug: row.slug,
      metadata: {
        title: row.title,
        date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : null,
        excerpt: row.excerpt,
        author: row.author,
        category: row.category,
        status: row.status,
        image: row.image_mime ? `/api/media/post-image/${row.slug}` : '',
        seoTitle: row.seo_title,
        seoDescription: row.seo_description,
        seoKeywords: row.seo_keywords,
        ogImage: row.og_image_mime ? `/api/media/post-og/${row.slug}` : '',
      },
      content: row.content || '',
    });
  } catch (error) {
    console.error('Error reading post:', error);
    return NextResponse.json({ error: 'Failed to read post' }, { status: 500 });
  }
}

// PUT /api/posts/[slug] - Update post
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const isAdmin = await verifySession(token);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { title, content, metadata, imageBase64, imageMime, ogImageBase64, ogImageMime } = body;

    // Check post exists
    const existing = await query<RowDataPacket[]>(
      'SELECT id FROM blog_posts WHERE slug = ?',
      [slug]
    );
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Build dynamic update
    const updates: string[] = [];
    const values: unknown[] = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (content !== undefined) { updates.push('content = ?'); values.push(content); }
    if (metadata?.excerpt !== undefined) { updates.push('excerpt = ?'); values.push(metadata.excerpt); }
    if (metadata?.author !== undefined) { updates.push('author = ?'); values.push(metadata.author); }
    if (metadata?.category !== undefined) { updates.push('category = ?'); values.push(metadata.category); }
    if (metadata?.status !== undefined) { updates.push('status = ?'); values.push(metadata.status); }
    if (metadata?.seoTitle !== undefined) { updates.push('seo_title = ?'); values.push(metadata.seoTitle); }
    if (metadata?.seoDescription !== undefined) { updates.push('seo_description = ?'); values.push(metadata.seoDescription); }
    if (metadata?.seoKeywords !== undefined) { updates.push('seo_keywords = ?'); values.push(metadata.seoKeywords); }
    if (metadata?.date !== undefined) { updates.push('created_at = ?'); values.push(new Date(metadata.date)); }

    // Handle image update
    if (imageBase64) {
      updates.push('image_data = ?');
      values.push(Buffer.from(imageBase64, 'base64'));
      updates.push('image_mime = ?');
      values.push(imageMime || 'image/webp');
    } else if (body.featuredMediaId) {
      // Set featured image from blog_media ID
      const mediaRows = await query<RowDataPacket[]>(
        'SELECT data, mime_type FROM blog_media WHERE id = ?',
        [body.featuredMediaId]
      );
      if (mediaRows.length > 0) {
        updates.push('image_data = ?');
        values.push(mediaRows[0].data);
        updates.push('image_mime = ?');
        values.push(mediaRows[0].mime_type);
      }
    }

    // Handle OG image update
    if (ogImageBase64) {
      updates.push('og_image_data = ?');
      values.push(Buffer.from(ogImageBase64, 'base64'));
      updates.push('og_image_mime = ?');
      values.push(ogImageMime || 'image/webp');
    } else if (body.ogMediaId) {
      // Set OG image from blog_media ID
      const mediaRows = await query<RowDataPacket[]>(
        'SELECT data, mime_type FROM blog_media WHERE id = ?',
        [body.ogMediaId]
      );
      if (mediaRows.length > 0) {
        updates.push('og_image_data = ?');
        values.push(mediaRows[0].data);
        updates.push('og_image_mime = ?');
        values.push(mediaRows[0].mime_type);
      }
    }

    if (updates.length > 0) {
      values.push(slug);
      await query(
        `UPDATE blog_posts SET ${updates.join(', ')} WHERE slug = ?`,
        values
      );
    }

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post updated successfully',
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/posts/[slug] - Delete post
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const isAdmin = await verifySession(token);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    // Get post ID first (for cascade delete of media)
    const existing = await query<RowDataPacket[]>(
      'SELECT id FROM blog_posts WHERE slug = ?',
      [slug]
    );
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete post (media will cascade delete due to FK)
    await query('DELETE FROM blog_posts WHERE slug = ?', [slug]);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}