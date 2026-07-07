'use client';

import { useState, useEffect } from 'react';

type Post = {
  slug: string;
  metadata: {
    title?: string;
    date?: string;
    excerpt?: string;
    category?: string;
    status?: string;
    author?: string;
    seoTitle?: string;
    seoDescription?: string;
    [key: string]: unknown;
  };
  content?: string;
  wordCount?: number;
};

type Props = {
  onEdit: (slug: string) => void;
  onNew: () => void;
};

export default function AdminPostList({ onEdit, onNew }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm(`¿Eliminar "${slug}"? Esta acción no se puede deshacer.`)) return;

    setDeleting(slug);
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    if (status === 'published') {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">PUBLICADO</span>;
    }
    return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">BORRADOR</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primario border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-barlow text-3xl font-bold text-primario">Artículos</h2>
          <p className="text-gray-500 font-dmsans mt-1">{posts.length} artículos en total</p>
        </div>
        <button
          onClick={onNew}
          className="bg-acento text-white font-barlow font-bold px-6 py-3 rounded-lg hover:bg-acento/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          NUEVO ARTÍCULO
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="font-barlow text-xl font-bold text-gray-700 mb-2">No hay artículos aún</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primer artículo</p>
          <button onClick={onNew} className="bg-primario text-white px-6 py-3 rounded-lg font-barlow font-bold hover:bg-primario/90">
            Crear primer artículo
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 font-barlow font-bold text-primario text-sm tracking-wider">TÍTULO</th>
                <th className="text-left px-6 py-4 font-barlow font-bold text-primario text-sm tracking-wider">CATEGORÍA</th>
                <th className="text-left px-6 py-4 font-barlow font-bold text-primario text-sm tracking-wider">ESTADO</th>
                <th className="text-left px-6 py-4 font-barlow font-bold text-primario text-sm tracking-wider">FECHA</th>
                <th className="text-left px-6 py-4 font-barlow font-bold text-primario text-sm tracking-wider">PALABRAS</th>
                <th className="text-right px-6 py-4 font-barlow font-bold text-primario text-sm tracking-wider">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-dmsans font-medium text-gray-900 line-clamp-1">
                        {post.metadata.title || 'Sin título'}
                      </p>
                      <p className="text-gray-500 text-sm font-dmsans truncate">{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-primario/10 text-primario px-3 py-1 rounded-full text-xs font-bold font-barlow">
                      {post.metadata.category || 'Artículo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(post.metadata.status)}</td>
                  <td className="px-6 py-4 font-dmsans text-gray-600 text-sm">
                    {post.metadata.date ? new Date(post.metadata.date).toLocaleDateString('es-EC') : '-'}
                  </td>
                  <td className="px-6 py-4 font-dmsans text-gray-600 text-sm">{post.wordCount || 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        className="p-2 text-gray-500 hover:text-primario transition-colors"
                        title="Ver"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit(post.slug)}
                        className="p-2 text-gray-500 hover:text-acento transition-colors"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        disabled={deleting === post.slug}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}