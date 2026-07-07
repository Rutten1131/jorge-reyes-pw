'use client';

import { motion } from 'framer-motion';

const OBRAS_DATA = [
  { 
    title: "Terminal Terrestre 'Reina del Cisne'", 
    year: "1994", 
    status: "Opera hasta hoy", 
    stat: "2ª", 
    desc: "Segunda terminal moderna del Ecuador. Vida útil calculada hasta 2021. Sigue funcionando plenamente en 2026." 
  },
  { 
    title: "Agua Potable para Todos", 
    year: "1992–1996", 
    status: "Infraestructura base actual", 
    stat: "+50%", 
    desc: "Caudal incrementado al 50% en 4 años. Abastecimiento garantizado para una ciudad de 230,000 habitantes." 
  },
  { 
    title: "Mercado Gran Colombia", 
    year: "1992–1996", 
    status: "30+ años de servicio continuo", 
    stat: "680", 
    desc: "680 puestos de comercio + 174 almacenes en las Bahías. Solución histórica a las ventas ambulantes." 
  },
  { 
    title: "Loja: Ciudad Limpia del Ecuador", 
    year: "1993–1996", 
    status: "Estándar ecológico establecido", 
    stat: "#1", 
    desc: "Relleno sanitario, reciclaje microempresarial y reforestación de cuencas hidrográficas (Jipiro)." 
  },
];

export default function ObrasSection() {
  return (
    <section className="py-24 lg:py-40 bg-primario text-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-acento font-barlow tracking-widest uppercase text-sm mb-4 block font-bold">
              OBRAS QUE SIGUEN DE PIE
            </span>
            <h2 className="font-barlow text-5xl lg:text-7xl font-bold mb-8 leading-tight tracking-tighter">
              LA INFRAESTRUCTURA QUE EL <br/> <span className="text-acento">TIEMPO NO BORRÓ</span>
            </h2>
            <p className="font-lora italic text-2xl text-white/70 max-w-2xl">
              "Rosalía Arteaga dijo que mi mercado parecía un supermercado. No fue suerte, fue planificación."
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OBRAS_DATA.map((obra, index) => (
            <motion.div
              key={obra.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white/5 border border-white/10 p-8 rounded-sm hover:bg-white/10 transition-all duration-500 hover:border-acento/50"
            >
              <div className="flex justify-between items-start mb-8">
                <span className="text-acento font-barlow text-8xl font-black opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                  {obra.stat}
                </span>
                <span className="bg-white/10 px-4 py-1 rounded-full text-xs font-barlow tracking-widest uppercase text-white/60">
                  {obra.year}
                </span>
              </div>
              <h4 className="text-2xl font-barlow font-bold mb-4 uppercase tracking-tight text-white group-hover:text-acento transition-colors">
                {obra.title}
              </h4>
              <p className="text-white/50 text-sm mb-6 font-barlow tracking-widest uppercase">
                Estado: <span className="text-solar">{obra.status}</span>
              </p>
              <p className="text-white/60 text-lg leading-relaxed font-light">
                {obra.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-acento/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-solar/20 rounded-full blur-[120px]" />
      </div>
    </section>
  );
}
