'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PlanSection() {
  return (
    <section className="bg-light relative overflow-hidden flex flex-col lg:flex-row items-center border-b border-primario/10 lg:min-h-[85vh]">
      {/* Texto - Ocupa la mitad izquierda en desktop */}
      <div className="w-full lg:w-1/2 p-8 lg:p-20 z-10 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-acento font-barlow font-bold tracking-[0.25em] text-sm uppercase block mb-4">
            El mapa de ruta
          </span>
          <h2 className="font-barlow text-5xl lg:text-7xl font-extrabold text-primario tracking-tighter mb-6 leading-tight">
            CONOCE NUESTRO <br />
            <span className="text-solar">PLAN 2026</span>
          </h2>
          <p className="font-dmsans text-lg lg:text-xl text-primario/70 mb-10 leading-relaxed max-w-lg">
            No nacimos de promesas vacías, nacimos de la planificación. Descubre el documento oficial con las estrategias de energía limpia, movilidad inteligente y desarrollo económico para Loja.
          </p>
          <Link
            href="/documentos/Plan-2026-Jorge-Reyes.pdf"
            target="_blank"
            className="inline-flex items-center justify-center bg-primario text-white font-barlow font-bold tracking-widest text-sm px-8 py-5 transition-all hover:bg-acento hover:text-primario hover:scale-105 group"
          >
            DESCARGAR PROPUESTA
            <svg className="w-5 h-5 ml-3 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Imagen - Ocupa la mitad derecha completa en desktop */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full lg:absolute lg:inset-y-0 lg:right-0 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full h-full relative"
        >
          <Image 
            src="/images/jorge_niños.webp" 
            alt="Jorge Reyes interactuando con el futuro de Loja" 
            fill 
            className="object-cover object-top"
            priority
          />
          {/* Gradiente sutil para transición suave con el texto en desktop */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-light to-transparent" />
        </motion.div>
      </div>
      
      {/* Background decor (visible en el lado del texto) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-solar/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
