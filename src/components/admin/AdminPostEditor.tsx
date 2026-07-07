'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type PostData = {
  slug?: string;
  metadata: {
    title?: string;
    date?: string;
    excerpt?: string;
    author?: string;
    category?: string;
    image?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    ogImage?: string;
  };
  content: string;
};

type MediaItem = {
  id: number;
  url: string;
  mimeType: string;
  filename: string;
  sortOrder: number;
  isVideo: boolean;
  isImage: boolean;
  videoUrl?: string | null;
  // For new uploads not yet saved
  localPreview?: string;
  localBase64?: string;
  localMime?: string;
  localName?: string;
  localVideoUrl?: string;
};

type Props = {
  slug: string | null;
  onSave: () => void;
  onCancel: () => void;
};

const CATEGORIES = [
  'Artículo', 'Agua', 'Internet', 'Salud', 'Movilidad',
  'Mercado', 'Educación', 'Liderazgo', 'Gobierno', 'Transparencia'
];

export default function AdminPostEditor({ slug, onSave, onCancel }: Props) {
  const [loading, setLoading] = useState(!!slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [form, setForm] = useState<PostData['metadata']>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    author: 'Jorge Reyes',
    category: 'Artículo',
    image: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogImage: '',
  });

  const [content, setContent] = useState<string>('');

  // Featured and OG media selections
  const [featuredMediaId, setFeaturedMediaId] = useState<number | null>(null);
  const [ogMediaId, setOgMediaId] = useState<number | null>(null);
  const [featuredLocalId, setFeaturedLocalId] = useState<number | null>(null);
  const [ogLocalId, setOgLocalId] = useState<number | null>(null);

  // Gallery media
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [pendingMedia, setPendingMedia] = useState<MediaItem[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Video URL input
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Load existing post if editing
  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${slug}`);
      if (!res.ok) throw new Error('Post not found');
      const data = await res.json();
      setForm(data.metadata);
      setContent(data.content);
      
      // Fetch gallery items to map existing featured / OG selections
      const mediaRes = await fetch(`/api/media/post-gallery/${slug}`);
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        const items = mediaData.media || [];
        setMediaItems(items);

        // Find which media item matches the current featured image url
        if (data.metadata.image) {
          const matchedFeatured = items.find((item: any) => data.metadata.image.includes(item.id.toString()));
          if (matchedFeatured) {
            setFeaturedMediaId(matchedFeatured.id);
          }
        }
        if (data.metadata.ogImage) {
          const matchedOg = items.find((item: any) => data.metadata.ogImage.includes(item.id.toString()));
          if (matchedOg) {
            setOgMediaId(matchedOg.id);
          }
        }
      }
    } catch {
      setError('Error cargando el artículo');
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPending: MediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > 20 * 1024 * 1024) {
        setError(`"${file.name}" es demasiado grande (max 20MB). Se omitió.`);
        continue;
      }

      const base64 = await fileToBase64(file);
      const preview = URL.createObjectURL(file);
      const tempId = -(Date.now() + i);

      newPending.push({
        id: tempId,
        url: preview,
        mimeType: file.type,
        filename: file.name,
        sortOrder: mediaItems.length + pendingMedia.length + i,
        isVideo: file.type.startsWith('video/'),
        isImage: file.type.startsWith('image/'),
        localPreview: preview,
        localBase64: base64,
        localMime: file.type,
        localName: file.name,
      });

      // Automatically set the first uploaded image as featured/og if none is selected
      if (file.type.startsWith('image/')) {
        if (!featuredMediaId && !featuredLocalId) {
          setFeaturedLocalId(tempId);
        }
        if (!ogMediaId && !ogLocalId) {
          setOgLocalId(tempId);
        }
      }
    }

    setPendingMedia(prev => [...prev, ...newPending]);

    if (mediaInputRef.current) {
      mediaInputRef.current.value = '';
    }
  };

  // Add video by URL (YouTube, Vimeo, etc.)
  const handleAddVideoUrl = () => {
    const url = videoUrlInput.trim();
    if (!url) return;

    const tempId = -(Date.now());
    const newItem: MediaItem = {
      id: tempId,
      url: '',
      mimeType: 'video/external',
      filename: url,
      sortOrder: mediaItems.length + pendingMedia.length,
      isVideo: true,
      isImage: false,
      localVideoUrl: url,
      videoUrl: url,
    };

    setPendingMedia(prev => [...prev, newItem]);
    setVideoUrlInput('');
    setShowVideoUrlInput(false);
  };

  const removePendingMedia = (id: number) => {
    setPendingMedia(prev => prev.filter(m => m.id !== id));
    if (featuredLocalId === id) setFeaturedLocalId(null);
    if (ogLocalId === id) setOgLocalId(null);
  };

  const removeExistingMedia = async (id: number) => {
    if (!confirm('¿Eliminar este archivo?')) return;
    try {
      await fetch(`/api/media/${id}`, { method: 'DELETE' });
      setMediaItems(prev => prev.filter(m => m.id !== id));
      if (featuredMediaId === id) setFeaturedMediaId(null);
      if (ogMediaId === id) setOgMediaId(null);
    } catch {
      setError('Error eliminando archivo');
    }
  };

  // ──── Rich text toolbar helpers ────
  const insertMarkdown = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const selected = text.substring(start, end);
    const replacement = selected || placeholder;
    
    const newContent = text.substring(0, start) + before + replacement + after + text.substring(end);
    setContent(newContent);
    
    // Restore cursor position after React re-render
    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + before.length + replacement.length + after.length;
      textarea.setSelectionRange(
        selected ? cursorPos : start + before.length,
        selected ? cursorPos : start + before.length + replacement.length
      );
    });
  }, [content]);

  const toolbarActions = [
    { icon: 'B', label: 'Negrita', action: () => insertMarkdown('**', '**', 'texto en negrita') },
    { icon: 'I', label: 'Cursiva', action: () => insertMarkdown('*', '*', 'texto en cursiva') },
    { icon: 'H1', label: 'Título', action: () => insertMarkdown('\n# ', '\n', 'Título principal') },
    { icon: 'H2', label: 'Subtítulo', action: () => insertMarkdown('\n## ', '\n', 'Subtítulo') },
    { icon: 'H3', label: 'Encabezado', action: () => insertMarkdown('\n### ', '\n', 'Encabezado') },
    { icon: '•', label: 'Lista', action: () => insertMarkdown('\n- ', '\n', 'elemento de lista') },
    { icon: '1.', label: 'Lista numerada', action: () => insertMarkdown('\n1. ', '\n', 'elemento numerado') },
    { icon: '❝', label: 'Cita', action: () => insertMarkdown('\n> ', '\n', 'texto de la cita') },
    { icon: '🔗', label: 'Enlace', action: () => insertMarkdown('[', '](https://)', 'texto del enlace') },
    { icon: '—', label: 'Línea separadora', action: () => insertMarkdown('\n\n---\n\n', '', '') },
  ];

  const handleSave = async (publish = false) => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const statusToSave = publish ? 'published' : form.status;

    try {
      // First save the main post record metadata
      const payload: Record<string, any> = {
        title: form.title,
        content,
        metadata: { ...form, status: statusToSave },
      };

      // If a pre-existing media is marked as featured / OG, we send the ID to copy it on backend
      if (featuredMediaId && featuredMediaId > 0) {
        payload.featuredMediaId = featuredMediaId;
      }
      if (ogMediaId && ogMediaId > 0) {
        payload.ogMediaId = ogMediaId;
      }

      // If a pending media is marked as featured, convert it to base64 payload
      if (featuredLocalId) {
        const featItem = pendingMedia.find(m => m.id === featuredLocalId);
        if (featItem) {
          payload.imageBase64 = featItem.localBase64;
          payload.imageMime = featItem.localMime;
        }
      }
      if (ogLocalId) {
        const ogItem = pendingMedia.find(m => m.id === ogLocalId);
        if (ogItem) {
          payload.ogImageBase64 = ogItem.localBase64;
          payload.ogImageMime = ogItem.localMime;
        }
      }

      const url = slug ? `/api/posts/${slug}` : '/api/posts';
      const method = slug ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error saving post');
      }

      const result = await res.json();
      const savedSlug = result.slug || slug;

      // Upload gallery items sequentially
      if (pendingMedia.length > 0 && savedSlug) {
        setUploadingMedia(true);
        for (const media of pendingMedia) {
          if (media.localVideoUrl) {
            // Video URL entry — no blob data
            const mediaRes = await fetch('/api/media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                slug: savedSlug,
                videoUrl: media.localVideoUrl,
                filename: media.filename,
                sortOrder: media.sortOrder,
              }),
            });
            if (mediaRes.ok) {
              const uploadedMedia = await mediaRes.json();
              if (featuredLocalId === media.id) {
                await fetch(`/api/posts/${savedSlug}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ featuredMediaId: uploadedMedia.id }),
                });
              }
              if (ogLocalId === media.id) {
                await fetch(`/api/posts/${savedSlug}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ogMediaId: uploadedMedia.id }),
                });
              }
            }
          } else if (media.localBase64) {
            const mediaRes = await fetch('/api/media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                slug: savedSlug,
                postId: 0,
                dataBase64: media.localBase64,
                mimeType: media.localMime,
                filename: media.localName,
                sortOrder: media.sortOrder,
              }),
            });

            // If this uploaded item was marked as featured/og, let the backend know on second PUT call
            if (mediaRes.ok) {
              const uploadedMedia = await mediaRes.json();
              if (featuredLocalId === media.id) {
                await fetch(`/api/posts/${savedSlug}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ featuredMediaId: uploadedMedia.id }),
                });
              }
              if (ogLocalId === media.id) {
                await fetch(`/api/posts/${savedSlug}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ogMediaId: uploadedMedia.id }),
                });
              }
            }
          }
        }
        setUploadingMedia(false);
      }

      setSuccessMsg(publish ? '¡Artículo publicado!' : 'Borrador guardado');
      setTimeout(() => onSave(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando el artículo.');
    } finally {
      setSaving(false);
    }
  };

  const updateMeta = (key: keyof PostData['metadata'], value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1B3A4B] border-t-transparent" />
      </div>
    );
  }

  const allMedia = [...mediaItems, ...pendingMedia];

  // Helper to get YouTube thumbnail
  const getVideoThumbnail = (url: string): string | null => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
    return null;
  };

  // Helper to detect platform from URL
  const getVideoPlatform = (url: string): string => {
    if (url.match(/youtu\.?be/)) return 'YouTube';
    if (url.match(/vimeo\.com/)) return 'Vimeo';
    if (url.match(/instagram\.com/)) return 'Instagram';
    if (url.match(/facebook\.com|fb\.watch/)) return 'Facebook';
    if (url.match(/tiktok\.com|vm\.tiktok/)) return 'TikTok';
    return 'Video';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-barlow text-3xl font-bold text-[#1B3A4B]">
            {slug ? 'EDITAR ARTÍCULO' : 'NUEVO ARTÍCULO'}
          </h2>
          <p className="text-gray-500 font-dmsans">
            {slug ? `Editando: ${slug}` : 'Crea un nuevo artículo'}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 font-dmsans hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-6 py-2 bg-yellow-500 text-white font-barlow font-bold rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar borrador'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-6 py-2 bg-green-500 text-white font-barlow font-bold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-dmsans">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-dmsans flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMsg}
        </div>
      )}

      <div className="grid gap-6 grid-cols-1">
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-barlow text-lg font-bold text-[#1B3A4B] border-b pb-2">INFORMACIÓN BÁSICA</h3>

          <div>
            <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              value={form.title || ''}
              onChange={(e) => updateMeta('title', e.target.value)}
              placeholder="Título del artículo"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-[#4EC8C8] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={form.date || ''}
                onChange={(e) => updateMeta('date', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-[#4EC8C8] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={form.category || 'Artículo'}
                onChange={(e) => updateMeta('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-[#4EC8C8] focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">Autor</label>
            <input
              type="text"
              value={form.author || ''}
              onChange={(e) => updateMeta('author', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-[#4EC8C8] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">Excerpt / Descripción corta</label>
            <textarea
              value={form.excerpt || ''}
              onChange={(e) => updateMeta('excerpt', e.target.value)}
              rows={2}
              placeholder="Breve descripción del artículo..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-[#4EC8C8] focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Media Gallery */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="font-barlow text-lg font-bold text-[#1B3A4B]">GALERÍA DE IMÁGENES Y VIDEOS</h3>
              <p className="text-xs text-gray-500 font-dmsans">Sube tus fotos/videos y marca cuál será la Imagen Destacada o la imagen para Redes Sociales (OG)</p>
            </div>
            <span className="text-xs text-gray-400 font-dmsans">{allMedia.length} archivo(s)</span>
          </div>

          {/* Upload Area */}
          <div className="flex gap-3">
            <div
              className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#4EC8C8] transition-colors cursor-pointer"
              onClick={() => mediaInputRef.current?.click()}
            >
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaUpload}
                className="hidden"
              />
              <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-500 font-dmsans text-sm mb-1">Subir imágenes o videos</p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP, GIF, MP4, WebM — Max 20MB</p>
            </div>

            {/* Add video URL button */}
            <button
              type="button"
              onClick={() => setShowVideoUrlInput(!showVideoUrlInput)}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl px-6 hover:border-purple-400 transition-colors group"
            >
              <svg className="w-8 h-8 text-gray-300 group-hover:text-purple-400 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-400 group-hover:text-purple-500 font-dmsans font-medium transition-colors">Video URL</span>
            </button>
          </div>

          {/* Video URL input panel */}
          {showVideoUrlInput && (
            <div className="flex gap-3 items-end bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="flex-1">
                <label className="block text-sm font-dmsans font-medium text-purple-800 mb-1">
                  URL del video (YouTube, Vimeo, etc.)
                </label>
                <input
                  type="url"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border border-purple-300 rounded-lg px-4 py-2 font-dmsans text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVideoUrl())}
                />
              </div>
              <button
                type="button"
                onClick={handleAddVideoUrl}
                className="px-5 py-2 bg-purple-500 text-white font-barlow font-bold rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                Agregar
              </button>
              <button
                type="button"
                onClick={() => { setShowVideoUrlInput(false); setVideoUrlInput(''); }}
                className="px-3 py-2 text-purple-400 hover:text-purple-600 transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* Media Grid */}
          {allMedia.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allMedia.map((media) => {
                const isItemFeatured = media.id > 0 ? featuredMediaId === media.id : featuredLocalId === media.id;
                const isItemOg = media.id > 0 ? ogMediaId === media.id : ogLocalId === media.id;
                const hasVideoUrl = !!media.videoUrl || !!media.localVideoUrl;
                const videoThumbnail = hasVideoUrl ? getVideoThumbnail(media.videoUrl || media.localVideoUrl || '') : null;

                return (
                  <div key={media.id} className="relative group rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex flex-col shadow-sm">
                    {/* Media render wrapper */}
                    <div className="relative aspect-video w-full bg-gray-100 flex-shrink-0">
                      {hasVideoUrl ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
                          {videoThumbnail ? (
                            <img src={videoThumbnail} alt="Video" className="w-full h-full object-cover opacity-70" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-purple-700" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-purple-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : media.isVideo ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                          <video
                            src={media.localPreview || media.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={media.localPreview || media.url}
                          alt={media.filename}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Delete button top right */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (media.id < 0) {
                            removePendingMedia(media.id);
                          } else {
                            removeExistingMedia(media.id);
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-md transition-colors opacity-90 hover:opacity-100"
                        title="Eliminar archivo"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      {/* Badge */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {media.id < 0 && (
                          <span className="bg-yellow-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">NUEVO</span>
                        )}
                        {hasVideoUrl ? (
                          <span className="bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                            {getVideoPlatform(media.videoUrl || media.localVideoUrl || '')}
                          </span>
                        ) : media.isVideo ? (
                          <span className="bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">VIDEO</span>
                        ) : null}
                      </div>
                    </div>

                    {/* Toggle Controls bottom area */}
                    <div className="p-3 bg-white flex-grow flex flex-col justify-between border-t border-gray-100">
                      <p className="text-gray-700 text-xs font-medium truncate mb-2.5" title={media.filename}>
                        {media.filename}
                      </p>

                      {media.isImage ? (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (media.id > 0) {
                                setFeaturedMediaId(isItemFeatured ? null : media.id);
                                setFeaturedLocalId(null);
                              } else {
                                setFeaturedLocalId(isItemFeatured ? null : media.id);
                                setFeaturedMediaId(null);
                              }
                            }}
                            className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                              isItemFeatured
                                ? 'bg-green-500 text-white border-green-500 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {isItemFeatured ? '★ Imagen Destacada' : 'Marcar Destacada'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (media.id > 0) {
                                setOgMediaId(isItemOg ? null : media.id);
                                setOgLocalId(null);
                              } else {
                                setOgLocalId(isItemOg ? null : media.id);
                                setOgMediaId(null);
                              }
                            }}
                            className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                              isItemOg
                                ? 'bg-[#4EC8C8] text-white border-[#4EC8C8] shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            {isItemOg ? '✔ Imagen OG / Redes' : 'Marcar para OG'}
                          </button>
                        </div>
                      ) : (
                        <div className="h-[60px] flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                          <span className="text-[10px] text-gray-400">Los videos no aplican a portadas</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-barlow text-lg font-bold text-[#1B3A4B] border-b pb-2">SEO</h3>

          <div>
            <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">
              Meta Title <span className="text-gray-400">(60 caracteres max)</span>
            </label>
            <input
              type="text"
              value={form.seoTitle || ''}
              onChange={(e) => updateMeta('seoTitle', e.target.value)}
              maxLength={60}
              placeholder="Título para SEO"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-[#4EC8C8] focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">{form.seoTitle?.length || 0}/60</p>
          </div>

          <div>
            <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">
              Meta Description <span className="text-gray-400">(160 caracteres max)</span>
            </label>
            <textarea
              value={form.seoDescription || ''}
              onChange={(e) => updateMeta('seoDescription', e.target.value)}
              maxLength={160}
              rows={3}
              placeholder="Descripción para buscadores..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-[#4EC8C8] focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{form.seoDescription?.length || 0}/160</p>
          </div>

          <div>
            <label className="block text-sm font-dmsans font-medium text-gray-700 mb-1">
              Palabras clave SEO <span className="text-gray-400">(separadas por coma)</span>
            </label>
            <input
              type="text"
              value={form.seoKeywords || ''}
              onChange={(e) => updateMeta('seoKeywords', e.target.value)}
              placeholder="loja 2026, elecciones, propuesta, ..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-dmsans focus:ring-2 focus:ring-[#4EC8C8] focus:border-transparent"
            />
          </div>
        </div>

        {/* Content Editor with Toolbar */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-barlow text-lg font-bold text-[#1B3A4B] border-b pb-2">CONTENIDO</h3>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-dmsans font-medium text-gray-700">Contenido del artículo</label>
              <span className="text-xs text-gray-400 font-dmsans">Escribe normalmente o usa la barra de herramientas para formatear</span>
            </div>

            {/* Rich text toolbar */}
            <div className="flex flex-wrap items-center gap-1 bg-gray-50 border border-gray-200 rounded-t-lg p-2 border-b-0">
              {toolbarActions.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={action.action}
                  title={action.label}
                  className="px-2.5 py-1.5 text-sm font-bold text-gray-600 hover:bg-[#4EC8C8]/10 hover:text-[#1B3A4B] rounded transition-colors font-dmsans border border-transparent hover:border-gray-200"
                >
                  {action.icon}
                </button>
              ))}
            </div>

            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              placeholder="Escribe tu contenido aquí... Puedes usar la barra de herramientas para dar formato."
              className="w-full border border-gray-300 rounded-b-lg px-4 py-3 font-dmsans text-sm focus:ring-2 focus:ring-[#4EC8C8] focus:border-transparent resize-y leading-relaxed"
            />
            <p className="mt-2 text-xs text-gray-400 font-dmsans">
              💡 Escribe texto normal. Usa los botones de arriba para agregar formato (títulos, negrita, listas, etc.)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}