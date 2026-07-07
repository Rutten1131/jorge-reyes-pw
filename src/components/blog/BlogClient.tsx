'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Types derived from markdown structure
type BlogPost = {
  slug: string;
  metadata: {
    title?: string;
    date?: string;
    excerpt?: string;
    category?: string;
    image?: string;
    [key: string]: unknown;
  };
};

// Use a stable default date to avoid impure function call
const FALLBACK_DATE = '2026-01-01';

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  // Extract unique categories safely
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach(p => {
      if (p.metadata.category) cats.add(p.metadata.category);
    });
    return ['Todas', ...Array.from(cats)];
  }, [posts]);

  // Derived filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchCategory = activeCategory === 'Todas' || post.metadata.category === activeCategory;
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        (post.metadata.title?.toLowerCase().includes(term) ?? false) ||
        (post.metadata.excerpt?.toLowerCase().includes(term) ?? false) ||
        (post.metadata.category?.toLowerCase().includes(term) ?? false);

      return matchCategory && matchSearch;
    });
  }, [posts, activeCategory, searchTerm]);

  // Helper to fallback image if post doesn't have one
  const getPostImage = (post: BlogPost, index: number) => {
    if (post.metadata.image) return post.metadata.image;
    // Fallback rotation from existing high quality images
    const fallbacks = [
      '/images/jorge-hero.webp',
      '/images/jorge-plan.webp',
      '/images/stats-smartcity.webp',
      '/images/stats-smartcity.webp'
    ];
    return fallbacks[index % fallbacks.length];
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 bg-white/50 backdrop-blur-md p-4 rounded-xl border border-primario/10 shadow-sm">
        
        {/* Pills de Categorías */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-barlow text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-primario text-white shadow-md scale-105'
                  : 'bg-white text-primario/60 border border-primario/10 hover:bg-primario/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-primario/10 rounded-full py-3 px-6 pl-12 text-primario font-dmsans focus:outline-none focus:ring-2 focus:ring-acento focus:border-transparent transition-all shadow-sm"
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-primario/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grid de Resultados */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-barlow text-2xl text-primario/50 mb-4">No encontramos propuestas para "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} className="text-acento font-bold hover:underline">Limpiar búsqueda</button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-8">
          <AnimatePresence>
            {filteredPosts.map((post, i) => (
              <motion.article 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={post.slug}
                className="group relative h-[240px] sm:h-[450px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <Link href={`/blog/${post.slug}`} className="absolute inset-0 block">
                  
                  {/* Background Image */}
                  <Image 
                    src={getPostImage(post, i)}
                    alt={post.metadata.title || 'Articulo de Jorge Reyes'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay for Text Legibility (Premium look) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primario via-primario/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-primario/10 group-hover:bg-transparent transition-colors duration-300" />

                  {/* Content (Bottom Anchored) */}
                  <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-end">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      {/* Categoria Pill */}
                      <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-barlow text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-sm">
                        {post.metadata.category || 'REPORTE'}
                      </span>
                      {/* Fecha / Extra meta */}
                      <span className="text-white/70 font-dmsans text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(post.metadata.date || FALLBACK_DATE).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <h2 className="font-barlow text-lg sm:text-4xl font-extrabold text-white mb-1 sm:mb-3 leading-[1.1] uppercase tracking-tight group-hover:text-acento transition-colors line-clamp-3 sm:line-clamp-none">
                      {post.metadata.title || 'Sin Título'}
                    </h2>
                    
                    <p className="text-white/80 font-dmsans text-xs sm:text-base line-clamp-2 md:pr-12 hidden sm:block">
                      {post.metadata.excerpt || 'Sin descripción disponible.'}
                    </p>

                    {/* Arrow Button */}
                    <div className="absolute bottom-8 right-8 w-12 h-12 bg-white text-primario rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
