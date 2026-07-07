import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 10000,
    });
  }
  return pool;
}

export async function query<T = unknown>(sql: string, params?: any[]): Promise<T> {
  const db = getPool();
  const [rows] = await db.execute(sql, params);
  return rows as T;
}

export async function initDatabase(): Promise<void> {
  const db = getPool();

  // Table: blog_posts
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      title VARCHAR(500) NOT NULL,
      content LONGTEXT,
      excerpt TEXT,
      author VARCHAR(255) DEFAULT 'Jorge Reyes',
      category VARCHAR(100) DEFAULT 'Artículo',
      status ENUM('draft', 'published') DEFAULT 'draft',
      image_data LONGBLOB,
      image_mime VARCHAR(100),
      seo_title VARCHAR(255),
      seo_description TEXT,
      seo_keywords TEXT,
      og_image_data LONGBLOB,
      og_image_mime VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_slug (slug),
      INDEX idx_status (status),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Table: blog_media (multiple images/videos per post)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blog_media (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      data LONGBLOB,
      mime_type VARCHAR(100),
      filename VARCHAR(500),
      video_url VARCHAR(1000),
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_post (post_id),
      FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Migration: add video_url column if it doesn't exist yet (for existing tables)
  try {
    await db.execute(`ALTER TABLE blog_media ADD COLUMN video_url VARCHAR(1000) AFTER filename`);
  } catch {
    // Column already exists, ignore
  }

  // Migration: make data nullable (for video-url-only entries)
  try {
    await db.execute(`ALTER TABLE blog_media MODIFY COLUMN data LONGBLOB`);
    await db.execute(`ALTER TABLE blog_media MODIFY COLUMN mime_type VARCHAR(100)`);
  } catch {
    // Already nullable, ignore
  }

  // Table: blog_sessions
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blog_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      token VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      INDEX idx_token (token),
      INDEX idx_expires (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
