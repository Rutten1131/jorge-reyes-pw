'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Counter from '@/components/Counter';
import HeroSlider from '@/components/HeroSlider';
import PlanSection from '@/components/PlanSection';
import ShortsSlider from '@/components/ShortsSlider';
import FAQSection from '@/components/shared/FAQSection';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-light">
      
      {/* SECCIÓN 1 — Hero "La Mirada del Arquitecto" */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Curtain Effect */}
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: '-100%' }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.5 }}
          className="absolute inset-0 z-30 bg-primario"
        />
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.5 }}
          className="absolute inset-0 z-30 bg-primario"
        />

        {/* Background Image (Parallax) */}
        <motion.div 
          style={{ y: parallaxY }}
          className="absolute inset-0 z-10"
        >
          <Image
            src="/images/jorge-hero.webp"
            alt="Jorge Reyes - Mirada al futuro"
            fill
            className="object-cover opacity-70 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primario via-transparent to-transparent opacity-80" />
        </motion.div>

        {/* Content */}
        <div className="container mx-auto px-4 z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <h1 className="font-barlow text-5xl sm:text-7xl md:text-9xl font-extrabold text-white tracking-tighter leading-none mb-6">
              LOJA <span className="text-acento">AUTOSUFICIENTE</span>
            </h1>
            <p className="font-dmsans text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              "Sé escuchar, sé cumplir. Transformaremos tu ahorro en energía y tu voto en futuro."
            </p>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 2.2,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 5
              }}
            >
              <Link
                href="/plan-2026"
                className="inline-block bg-acento text-primario font-barlow font-bold text-lg tracking-widest px-10 py-5 rounded-sm shadow-2xl transition-all hover:scale-105 hover:bg-white"
              >
                ACTIVA EL PLAN 2026
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 1.5 — Invitación al Plan 2026 */}
      <PlanSection />

      {/* SECCIÓN 2 — Portal Effect Slider "El Poder de los Números" */}
      <HeroSlider />

      {/* SECCIÓN 3 — Transformación "Energía que te Paga" */}
      <section className="bg-primario py-16 lg:py-32 text-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="text-acento font-barlow tracking-widest uppercase text-sm mb-4 block">TRANSFORMACIÓN REAL</span>
              <h2 className="font-barlow text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                TU CASA PAGARÁ TU INTERNET <br/> Y TU <span className="text-solar">ENERGÍA</span>
              </h2>
              <p className="text-white/60 text-lg mb-10 leading-relaxed font-light">
                Imagina luz que no te cuesta y conectividad sin factura. Loja deja de ser una ciudad estancada para convertirse en un motor tecnológico.
              </p>
              <Link
                href="https://wa.me/593997755478"
                className="inline-block bg-solar text-white font-barlow font-bold tracking-widest px-8 py-4 rounded-sm transition-transform hover:scale-105"
              >
                QUIERO MI CASA SOLAR
              </Link>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-white/5 p-8 border border-white/10 rounded-sm hover:bg-white/10 transition-colors">
                  <h4 className="text-acento font-barlow text-xl mb-4">INTERNET GRATIS</h4>
                  <p className="text-sm text-white/50">Conectividad total para que tus hijos estudien sin límites.</p>
               </div>
               <div className="bg-white/5 p-8 border border-white/10 rounded-sm hover:bg-white/10 transition-colors">
                  <h4 className="text-solar font-barlow text-xl mb-4">2,000 PANELES</h4>
                  <p className="text-sm text-white/50">Energía limpia subsidiada para los hogares lojanos.</p>
               </div>
               <div className="bg-white/5 p-8 border border-white/10 rounded-sm hover:bg-white/10 transition-colors sm:col-span-2">
                  <h4 className="text-white font-barlow text-xl mb-4">TREN ELEVADO 15KM</h4>
                  <p className="text-sm text-white/50">Movilidad moderna que conecta la ciudad en minutos.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3.5 — Videos "Lo que pasa en las calles" */}
      <ShortsSlider />

      {/* SECCIÓN 3.8 — Preguntas Frecuentes y Semantic SEO */}
      <FAQSection />

      {/* SECCIÓN 4 — Cierre "La Rebelión del Voto Limpio" */}
      <section className="py-16 lg:py-32 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
             <h2 className="font-barlow text-4xl sm:text-5xl lg:text-7xl font-bold text-primario mb-12">
               LA REBELIÓN DEL <span className="text-acento">VOTO LIMPIO</span>
             </h2>
             <div className="relative aspect-video mb-12 overflow-hidden rounded-sm group">
                <Image 
                  src="/images/jorge-hero.webp" 
                  alt="Jorge en las calles" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primario/20" />
             </div>
             <p className="font-lora italic text-3xl text-primario mb-12 px-4 shadow-sm">
               "No busco un trabajo, busco transformar a Loja con la experiencia de quien ya caminó sus calles."
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="https://wa.me/593997755478"
                  className="w-full sm:w-auto bg-acento text-primario font-barlow font-bold tracking-widest px-12 py-5 rounded-sm shadow-xl transition-all hover:scale-105"
                >
                  HABLA CON JORGE
                </Link>
                <Link
                  href="/donar"
                  className="w-full sm:w-auto bg-gold text-primario font-barlow font-bold tracking-widest px-12 py-5 rounded-sm shadow-xl transition-all hover:scale-105 border-2 border-gold"
                >
                  APOYA CON $5 PARA EL CAMBIO
                </Link>
             </div>
             <p className="mt-8 text-primario/40 font-barlow tracking-widest uppercase text-xs">
                Campaña independiente — Sin dueños — MASS 115
             </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
