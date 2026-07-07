'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function PlanFinalCTA() {
  return (
    <section className="relative py-32 lg:py-48 overflow-hidden bg-primario">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000">
        <Image
          src="/images/jorge_reyes_energia.webp"
          alt="Jorge Reyes Plan 2026"
          fill
          className="object-cover object-top opacity-50 contrast-110 grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primario via-primario/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-acento font-barlow tracking-widest uppercase text-sm mb-8 block font-bold">
            CONCLUSIÓN DEL PLAN
          </span>
          <h2 className="font-barlow text-5xl lg:text-8xl font-black text-white mb-12 tracking-tighter leading-tight">
            EL PLAN NO ES UN SUEÑO. <br />
            <span className="text-acento">ES UN CÁLCULO.</span>
          </h2>

          <div className="bg-white/5 border border-white/10 p-12 mb-16 rounded-sm backdrop-blur-sm">
            <p className="font-lora italic text-2xl md:text-4xl text-white/90 leading-relaxed mb-8">
              "He dedicado 31 años al estudio técnico. Cada número de este plan ha sido verificado. No hablo de lo que quiero hacer, hablo de lo que ya sé cómo hacer."
            </p>
            <div className="flex flex-col items-center gap-2">
              <p className="text-acento font-barlow tracking-widest uppercase text-sm font-black">
                Jorge Reyes Jaramillo
              </p>
              <p className="text-white/40 font-barlow tracking-widest uppercase text-[10px] font-bold">
                Doctor en Medicina • Magíster en Gestión • Ex-Alcalde de Loja
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/documentos/Plan-2026.pdf"
              target="_blank"
              className="w-full sm:w-auto bg-white text-primario font-barlow font-bold tracking-widest px-12 py-5 rounded-sm shadow-xl transition-all hover:scale-105 hover:bg-acento hover:text-white"
            >
              DESCARGAR PLAN COMPLETO (PDF)
            </Link>
            <Link
              href="https://wa.me/593997755478"
              className="w-full sm:w-auto bg-acento text-primario font-barlow font-bold tracking-widest px-12 py-5 rounded-sm shadow-xl transition-all hover:scale-105 hover:bg-white"
            >
              CHATEA CON JORGE
            </Link>
          </div>

          <p className="mt-16 text-white/20 font-barlow tracking-widest uppercase text-xs font-bold">
            Loja deja de pedir permiso — MASS 115
          </p>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-acento/5 rounded-full blur-[160px] pointer-events-none" />
    </section>
  );
}
