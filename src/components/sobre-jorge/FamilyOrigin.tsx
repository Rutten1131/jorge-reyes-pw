'use client';

import { motion } from 'framer-motion';

const FAMILY_DATA = [
  { 
    name: "El Cura de los Pobres", 
    relation: "Tío abuelo — Presbítero Víctor Manuel Reyes", 
    desc: "Sacerdote identificado con las aspiraciones de los marginados de las parroquias rurales. Su legado de solidaridad es la base de nuestra vocación." 
  },
  { 
    name: "El Intelectual", 
    relation: "Tío — Dr. Eduardo Reyes Azanza", 
    desc: "Fundador y primer Decano de la Facultad de Medicina de la UNL. Primer concejal del MPD en Loja y referente de la lucha social universitaria." 
  },
  { 
    name: "El Legislador", 
    relation: "Padre — Dr. Jorge Luis Reyes Azanza", 
    desc: "Diputado por Loja y fundador del Frente del Pueblo. Dirigente estudiantil que llevó la voz de Loja a escenarios internacionales en la URSS y China." 
  },
];

export default function FamilyOrigin() {
  return (
    <section className="py-24 lg:py-40 bg-light relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-acento font-barlow tracking-widest uppercase text-sm mb-4 block font-bold">
                VERTIENTES FAMILIARES
              </span>
              <h2 className="font-barlow text-5xl lg:text-7xl font-bold text-primario mb-8 leading-tight tracking-tighter">
                HEREDERO DE UNA LOJA <span className="text-acento">REBELDE</span> Y SOLIDARIA
              </h2>
              <p className="font-lora italic text-2xl text-primario/80 mb-10 leading-relaxed">
                "Vengo de una familia que me enseñó que la política es para servir a los marginados, no para servirse de ellos."
              </p>
              <p className="font-dmsans text-lg text-primario/60 leading-relaxed mb-8">
                La historia de Jorge Reyes Jaramillo no comienza en una oficina pública, sino en el corazón de familias que forjaron la identidad democrática de Loja. Su raíz se nutre del pensamiento de Pío Jaramillo Alvarado y la acción de hombres que sacrificaron su comodidad por el bienestar común.
              </p>
            </motion.div>
          </div>

          <div className="lg:w-1/2 grid gap-6">
            {FAMILY_DATA.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-primario p-8 rounded-sm shadow-xl border-l-4 border-acento hover:translate-x-2 transition-transform cursor-default group"
              >
                <h4 className="text-acento font-barlow text-2xl font-bold mb-2 group-hover:text-white transition-colors uppercase tracking-tight">
                  {item.name}
                </h4>
                <p className="text-white/40 font-barlow text-xs mb-4 tracking-widest uppercase">
                  {item.relation}
                </p>
                <p className="text-white/70 font-dmsans text-base leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-acento/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primario/5 rounded-full -ml-32 -mb-32 blur-3xl" />
    </section>
  );
}
