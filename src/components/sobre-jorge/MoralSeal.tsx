'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const TRANSPARENCY_DATA = [
  { stat: "188", label: "Sesiones del Cabildo en 3 años" },
  { stat: "50", label: "Ordenanzas aprobadas" },
  { stat: "88", label: "Contratistas distintos — sin favoritismos" },
  { stat: "0", label: "Actos de corrupción cuestionados" },
];

export default function MoralSeal() {
  return (
    <section className="py-24 lg:py-40 bg-primario relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/contacto_directo.webp"
          alt="Jorge Reyes - Contacto Directo"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primario via-primario/40 to-primario transition-opacity duration-700" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-acento font-barlow tracking-widest uppercase text-sm mb-6 block font-bold">
            SOLVENCIA MORAL • EL PACTO DEL 10%
          </span>
          <h2 className="font-barlow text-5xl lg:text-7xl font-bold text-white mb-12 tracking-tighter leading-tight">
            MI LIBERTAD ME PERMITE <br/> <span className="text-acento">DECIRTE LA VERDAD</span>
          </h2>

          <div className="bg-white/5 border border-white/10 p-10 mb-16 rounded-sm text-left backdrop-blur-sm">
            <p className="font-lora italic text-2xl text-white/80 mb-8 leading-relaxed">
              "La administración de Jorge Reyes no fue cuestionada en ningún momento por actos de corrupción o deshonestidad. Se reconoció la transparencia en todos los actos, la participación de actores externos y la fiscalización comunitaria."
            </p>
            <p className="text-white/40 font-barlow tracking-widest uppercase text-xs">
              — Marco Romero, Cronista de la Gestión Municipal 1992-1996
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {TRANSPARENCY_DATA.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-acento font-barlow text-5xl font-black mb-2">
                  {item.stat}
                </div>
                <p className="font-barlow text-xs tracking-widest text-white/40 uppercase font-bold">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mb-16">
            <h3 className="font-lora italic text-3xl md:text-5xl text-white mb-12 shadow-sm leading-tight">
              "No acepto el 'diez por ciento de nadie .... por eso puedo mirarte a los ojos y cumplir lo que prometo."
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="https://wa.me/593997755478"
              className="w-full sm:w-auto bg-acento text-primario font-barlow font-bold tracking-widest px-12 py-5 rounded-sm shadow-xl transition-all hover:scale-105 hover:bg-white"
            >
              HABLA CON JORGE
            </Link>
            <Link
              href="#"
              className="w-full sm:w-auto bg-gold text-primario font-barlow font-bold tracking-widest px-12 py-5 rounded-sm shadow-xl transition-all hover:scale-105 border-2 border-gold"
            >
              APOYA LA CAMPAÑA
            </Link>
          </div>

          <p className="mt-12 text-white/20 font-barlow tracking-widest uppercase text-xs">
            Campaña independiente — Sin dueños — MASS 115
          </p>
        </motion.div>
      </div>

      {/* Background seal effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-acento/5 rounded-full blur-[160px] pointer-events-none" />
    </section>
  );
}
