'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const PLAN_ICONS = [
  { icon: '🌊', label: 'Agua', href: '#agua' },
  { icon: '💡', label: 'Energía', href: '#energia' },
  { icon: '🚌', label: 'Movilidad', href: '#movilidad' },
  { icon: '💻', label: 'Tecnología', href: '#tecnologia' },
  { icon: '🌿', label: 'Ecología', href: '#comercio' },
];

export default function HeroPlan() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Curtain */}
      <motion.div initial={{ x: 0 }} animate={{ x: '-100%' }} transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.5 }} className="absolute inset-0 z-30 bg-primario" />
      <motion.div initial={{ x: 0 }} animate={{ x: '100%' }} transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.5 }} className="absolute inset-0 z-30 bg-primario" />

      {/* Background */}
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 z-10">
        <Image src="/images/stats-smartcity.webp" alt="Loja ciudad del futuro" fill className="object-cover opacity-75" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 z-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }}>
          <span className="text-acento font-barlow tracking-[0.3em] uppercase text-sm mb-6 block font-bold">
            MASS 115 • PLAN DE GOBIERNO 2026-2030
          </span>
          <h1 className="font-barlow text-5xl md:text-8xl font-extrabold text-white tracking-tighter leading-none mb-8 max-w-5xl mx-auto">
            LOJA 2026: LA CIUDAD QUE DEJA DE PEDIR PERMISO PARA <span className="text-acento">PROGRESAR</span>
          </h1>
          <p className="font-lora italic text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
            "Un plan diseñado con precisión técnica para que Loja sea autosuficiente. Agua, energía y empleo digital para recuperar tu orgullo."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/documentos/Plan-2026.pdf" target="_blank"
              className="bg-acento text-primario font-barlow font-bold tracking-widest px-10 py-4 rounded-sm shadow-2xl transition-all hover:scale-105 hover:bg-white"
            >
              DESCARGAR EL PLAN COMPLETO →
            </Link>
            <Link href="/sobre-jorge"
              className="border border-white/30 text-white font-barlow font-bold tracking-widest px-10 py-4 rounded-sm transition-all hover:border-acento hover:text-acento"
            >
              CONOCE A JORGE
            </Link>
          </div>

          {/* Nav icons */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {PLAN_ICONS.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + i * 0.1 }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <span className="text-3xl group-hover:scale-125 transition-transform">{item.icon}</span>
                <span className="font-barlow text-xs tracking-widest text-white/40 uppercase group-hover:text-acento transition-colors">{item.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-gradient-to-b from-acento to-transparent" />
      </motion.div>
    </section>
  );
}
