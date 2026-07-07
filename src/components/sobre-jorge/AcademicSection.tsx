'use client';

import { motion } from 'framer-motion';
import Counter from '@/components/Counter';
import Link from 'next/link';

const ACADEMIC_DATA = {
  stats: [
    { value: 2000, label: "MÉDICOS FORMADOS", suffix: "+" },
    { value: 31, label: "AÑOS DE CÁTEDRA", suffix: "" },
    { value: 6, label: "LIBROS Y PUBLICACIONES", suffix: "+" },
    { value: 3, label: "MAESTRÍAS Y POSTGRADOS", suffix: "" },
  ],
  books: [
    { title: "Desnutrición infantil y psicomotricidad", year: 1987 },
    { title: "En la antesala de la morbilidad y la muerte", year: 1987 },
    { title: "Bioestadística descriptiva — Aplicada a la Demografía y Epidemiología", year: 2016 },
  ],
  articles: [
    "Evolución y tendencias poblacionales en la Región Sur del Ecuador, 1950–2010 (2015)",
    "Alteraciones psicoafectivas en los adolescentes y su relación con la funcionalidad familiar (2016)",
    "Factores familiares relacionados con el bullying en adolescentes (2016)",
    "Funcionalidad familiar e intento autolítico en Zamora Chinchipe (2017)",
  ],
};

export default function AcademicSection() {
  return (
    <section className="py-24 lg:py-40 bg-light">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col lg:flex-row gap-20">
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-acento font-barlow tracking-widest uppercase text-sm mb-4 block font-bold">
                PREPARADO CON CIENCIA, NO CON DISCURSOS
              </span>
              <h2 className="font-barlow text-5xl lg:text-7xl font-bold text-primario mb-8 leading-tight tracking-tighter">
                31 AÑOS DE CÁTEDRA: EL PLAN NO ES <span className="text-acento">UN SUEÑO</span>, ES UN CÁLCULO
              </h2>
              <p className="font-lora italic text-2xl text-primario/80 mb-10 leading-relaxed">
                "He dedicado mi vida al estudio. Por eso mi plan de energía solar y Smart City no es un sueño, es un cálculo matemático."
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                {ACADEMIC_DATA.stats.map((stat, index) => (
                  <div key={stat.label}>
                    <div className="text-acento font-barlow text-5xl font-black mb-2 flex items-baseline">
                      <Counter value={stat.value} duration={2} suffix={stat.suffix} />
                    </div>
                    <p className="font-barlow text-xs tracking-widest text-primario/40 uppercase font-bold">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="#"
                className="inline-block bg-primario text-white font-barlow font-bold tracking-widest px-10 py-5 rounded-sm transition-all hover:bg-acento hover:text-primario hover:scale-105"
              >
                DESCARGAR PUBLICACIONES (PDF)
              </Link>
            </motion.div>
          </div>

          <div className="lg:w-1/2">
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h4 className="font-barlow text-xl font-bold text-primario mb-6 uppercase tracking-widest border-b border-primario/10 pb-2">
                  LIBROS DESTACADOS
                </h4>
                <div className="space-y-4">
                  {ACADEMIC_DATA.books.map((book) => (
                    <div key={book.title} className="flex gap-4 items-start">
                      <span className="text-acento font-barlow font-bold">{book.year}</span>
                      <p className="text-primario/70 font-dmsans text-lg">{book.title}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="font-barlow text-xl font-bold text-primario mb-6 uppercase tracking-widest border-b border-primario/10 pb-2">
                  PRODUCCIÓN CIENTÍFICA RECIENTE
                </h4>
                <ul className="space-y-4">
                  {ACADEMIC_DATA.articles.map((article) => (
                    <li key={article} className="text-primario/60 font-dmsans flex gap-3">
                      <span className="text-acento mt-1">→</span>
                      {article}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
