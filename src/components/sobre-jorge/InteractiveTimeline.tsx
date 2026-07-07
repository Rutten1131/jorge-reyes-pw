'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const TIMELINE_DATA = [
  { year: 1959, title: "Nace en Loja", desc: "3 de octubre. Primer hijo del Dr. Jorge Luis Reyes Azanza.", highlight: false },
  { year: 1975, title: "Dirigente estudiantil", desc: "Presidente del Consejo 28 de marzo, Colegio Bernardo Valdivieso.", highlight: false },
  { year: 1976, title: "Presidente FESE Provincial", desc: "Lideró marchas contra la dictadura militar.", highlight: false },
  { year: 1983, title: "Liderazgo en la FEUE", desc: "Presidente FEUE Filial Loja y Vicepresidente Nacional.", highlight: false },
  { year: 1985, title: "Graduación Médica", desc: "Se gradúa de Médico y Cirujano en la UNL el 16 de agosto.", highlight: true },
  { year: 1986, title: "Presidente ANAMER Nacional", desc: "Primer médico de la UNL en presidir la federación nacional de médicos rurales.", highlight: false },
  { year: 1989, title: "Catedrático Principal UNL", desc: "Ganó concurso de méritos. Inicia 31 años de docencia académica.", highlight: false },
  { year: 1990, title: "Elegido Concejal de Loja", desc: "Su primer cargo de elección popular por voluntad del pueblo.", highlight: false },
  { year: 1992, title: "ALCALDE DE LOJA", desc: "A los 32 años se convierte en el alcalde más joven de la historia de Loja.", highlight: true, isGold: true },
  { year: 1994, title: "Terminal Reina del Cisne", desc: "Inaugura la segunda terminal terrestre más moderna del país.", highlight: true },
  { year: 1995, title: "Loja Ecologista", desc: "Inicia el primer sistema integral de residuos sólidos en Ecuador.", highlight: false },
  { year: 1996, title: "Bloqueo Político", desc: "Su reelección fue bloqueada ilegalmente por el Tribunal Electoral.", highlight: false },
  { year: 2001, title: "Director de Salud", desc: "Director Provincial de Salud de Loja (2001-2003).", highlight: false },
  { year: 2006, title: "Máster en Salud Pública", desc: "Especialización en Gestión de Sistemas de Salud, UNL.", highlight: false },
  { year: 2012, title: "Doctorado en Filosofía", desc: "Filosofía en un Mundo Global por la Universidad del País Vasco.", highlight: false },
  { year: 2020, title: "Jubilación Docente", desc: "Cierra 31 años de cátedra formando a más de 2,000 médicos.", highlight: true, isGold: true },
  { year: 2021, title: "Fundación del MASS", desc: "Crea el Movimiento Acción Social Solidaria el 15 de noviembre.", highlight: true },
  { year: 2024, title: "Registro Oficial MASS 115", desc: "El CNE aprueba el partido con el número 115.", highlight: false },
  { year: 2026, title: "CANDIDATO ALCALDÍA", desc: "Regresa para recuperar el futuro de Loja.", highlight: true, isGold: true },
];

function TimelineItem({ item, index }: { item: typeof TIMELINE_DATA[0], index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`mb-12 flex justify-between items-center w-full ${isEven ? 'flex-row-reverse' : ''}`}>
      <div className="hidden md:block w-5/12" />
      
      <div className="z-20">
        <motion.div 
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          className={`flex items-center justify-center w-12 h-12 rounded-full border-4 ${item.isGold ? 'bg-gold border-white' : 'bg-acento border-primario'}`}
        >
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: isEven ? -100 : 100 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`w-full md:w-5/12 p-6 rounded-sm shadow-xl border-t-2 ${item.isGold ? 'bg-primario text-white border-gold' : 'bg-white border-acento'}`}
      >
        <span className={`font-barlow text-4xl font-black mb-2 block ${item.isGold ? 'text-gold' : 'text-acento'}`}>
          {item.year}
        </span>
        <h3 className={`font-barlow text-xl font-bold mb-3 uppercase tracking-tight ${item.isGold ? 'text-white' : 'text-primario'}`}>
          {item.title}
        </h3>
        <p className={`font-dmsans text-sm leading-relaxed ${item.isGold ? 'text-white/70' : 'text-primario/60'}`}>
          {item.desc}
        </p>
      </motion.div>
    </div>
  );
}

export default function InteractiveTimeline() {
  return (
    <section className="py-24 bg-light relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="text-acento font-barlow tracking-widest uppercase text-sm mb-4 block font-bold">
            CRONOLOGÍA DEL SERVICIO
          </span>
          <h2 className="font-barlow text-5xl lg:text-7xl font-bold text-primario tracking-tighter">
            LÍNEA DE VIDA <span className="text-acento">INTERACTIVA</span>
          </h2>
        </div>

        <div className="relative wrap overflow-hidden p-4 md:p-10 h-full">
          {/* Vertical Line */}
          <div className="absolute border-opacity-20 border-acento h-full border left-1/2 hidden md:block" />
          <div className="absolute border-opacity-20 border-acento h-full border left-8 md:hidden" />

          {TIMELINE_DATA.map((item, index) => (
            <TimelineItem key={`${item.year}-${index}`} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
