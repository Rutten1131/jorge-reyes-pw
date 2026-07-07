'use client';

import { useState, useEffect } from 'react';
import LoginPage from '@/components/admin/LoginPage';
import AdminPostEditor from '@/components/admin/AdminPostEditor';
import AdminPostList from '@/components/admin/AdminPostList';

type View = 'list' | 'editor' | 'new';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [view, setView] = useState<View>('list');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      setAuthenticated(data.authenticated);
    } catch {
      setAuthenticated(false);
    }
  };

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    setAuthenticated(false);
  };

  const handleEdit = (slug: string) => {
    setEditingSlug(slug);
    setView('editor');
  };

  const handleNew = () => {
    setEditingSlug(null);
    setView('new');
  };

  const handleSave = () => {
    setView('list');
    setEditingSlug(null);
    setRefreshKey((k) => k + 1);
  };

  const handleCancel = () => {
    setView('list');
    setEditingSlug(null);
  };

  // Loading state
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1B3A4B] to-[#0f2530] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4EC8C8] border-t-transparent" />
      </div>
    );
  }

  // Not authenticated → show login
  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Authenticated → show admin
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-[#1B3A4B] text-white px-6 py-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-barlow text-2xl font-bold tracking-tight">CMS ADMIN</h1>
            <p className="text-white/60 text-sm font-dmsans">Gestión de contenidos — Jorge Reyes 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-white/80 hover:text-white text-sm font-dmsans flex items-center gap-2 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 px-4 py-2 rounded-lg text-sm font-dmsans transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {view === 'list' && (
          <AdminPostList
            key={refreshKey}
            onEdit={handleEdit}
            onNew={handleNew}
          />
        )}

        {(view === 'editor' || view === 'new') && (
          <AdminPostEditor
            slug={editingSlug}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}