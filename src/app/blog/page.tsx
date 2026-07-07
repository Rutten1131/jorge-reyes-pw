import Image from 'next/image';
import { getBlogPosts } from '@/lib/blog';
import BlogClient from '@/components/blog/BlogClient';

export const metadata = {
  title: 'Blog | Noticias y Propuestas para Loja 2026 — Jorge Reyes MASS 115',
  description: 'Explora la visión y propuestas de Jorge Reyes para Loja 2026. Defensa técnica, historia y conexión humana para el progreso lojano.',
  keywords: 'Cómo participar política Loja, Movimiento MASS 115 Loja qué es, verdad Mercado Mayorista Loja, propuestas Jorge Reyes',
  openGraph: {
    title: 'Blog | Noticias y Propuestas para Loja 2026 — Jorge Reyes MASS 115',
    description: 'Explora la visión y propuestas de Jorge Reyes para Loja 2026. Defensa técnica, historia y conexión humana para el progreso lojano.',
    url: 'https://www.jorgereyesjaramillo.com/blog',
    type: 'website',
    images: [
      {
        url: '/images/Jorge_blog.webp',
        width: 1200,
        height: 630,
        alt: 'Jorge Reyes - Blog Oficial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Noticias y Propuestas para Loja 2026 — Jorge Reyes MASS 115',
    description: 'Explora la visión y propuestas de Jorge Reyes para Loja 2026. Defensa técnica, historia y conexión humana para el progreso lojano.',
    images: ['/images/Jorge_blog.webp'],
  },
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  // Obtenemos los posts desde el lado del servidor
  const posts = await getBlogPosts();

  return (
    <div className="bg-light min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Header Visual - Institucional (Rediseñado de Búnker a Visión) */}
        <div className="relative w-full h-[40vh] sm:h-[60vh] min-h-[300px] mb-12 sm:mb-16 rounded-3xl overflow-hidden flex items-center justify-center -mt-8 shadow-2xl">
          <Image 
            src="/images/Jorge_blog.webp" 
            alt="Visión 2026 - Jorge Reyes" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primario via-primario/80 to-primario/30" />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <span className="text-acento font-barlow tracking-widest uppercase text-sm md:text-base mb-4 block font-bold">
              Diagnóstico • Hechos • Propuestas
            </span>
            <h1 className="font-barlow text-4xl sm:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]">
              EL CAMINO HACIA LA <br/>
              <span className="text-acento">VERDAD</span> <span className="text-white">Y EL</span> <span className="text-acento">FUTURO</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-lora max-w-2xl mx-auto leading-relaxed italic border-l-4 border-acento pl-4 text-left">
              "Si dicen que no hicimos nada, muéstrales los hechos. Si dicen que nuestro plan es imposible, enséñales la ciencia detrás de la propuesta."
            </p>
          </div>
        </div>

        {/* Cliente Interactivo: Buscador, Categorías y Grilla de Artículos */}
        <BlogClient posts={posts} />

      </div>
    </div>
  );
}
