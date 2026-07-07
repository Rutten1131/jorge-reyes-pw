'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function HeroJorge() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
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
          alt="Jorge Reyes - El hombre que formó médicos"
          fill
          className="object-cover opacity-80 scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <span className="text-acento font-barlow tracking-[0.3em] uppercase text-sm mb-6 block font-bold">
            EXPEDIENTE DE CERTEZA • MASS 115
          </span>
          <h1 className="font-barlow text-6xl md:text-8xl font-extrabold text-white tracking-tighter leading-none mb-8 max-w-5xl mx-auto">
            "EL HOMBRE QUE FORMÓ A QUIENES HOY CUIDAN DE <span className="text-acento">TU FAMILIA</span>."
          </h1>
          <p className="font-lora italic text-xl md:text-3xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            32 años con un cargo. 31 años formando médicos. <br/> Una obra que el tiempo no borró.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-px h-16 bg-gradient-to-b from-acento to-transparent animate-pulse" />
            <span className="font-barlow text-xs tracking-widest text-white/40 uppercase">Descubre su historia</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
