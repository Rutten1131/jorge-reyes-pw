'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "¿Quién es Jorge Reyes?",
    answer: "Jorge Reyes Jaramillo es un médico lojano, exalcalde de Loja (1992-1996) y candidato a la Alcaldía de Loja 2026 por el Movimiento Acción Social Solidaria (MASS 115). Durante su amplia trayectoria académica, ha formado a más de 2,000 médicos en la Universidad Nacional de Loja.",
    articleLink: "/blog/2000-medicos-formados",
    articlePrefix: "Conoce su trayectoria académica"
  },
  {
    question: "¿Qué propone Jorge Reyes para Loja 2026?",
    answer: "Su Plan de Gobierno 2026 busca convertir a Loja en una Smart City autosuficiente. Las estrategias clave son: solucionar la escasez de agua potable con nuevos reservorios, subsidiar paneles solares para hogares, proveer internet gratis mediante fibra óptica municipal, y modernizar la movilidad con un tren elevado.",
    articleLink: "/blog/primer-paso",
    articlePrefix: "Leer primer paso de la propuesta"
  },
  {
    question: "¿Qué obras hizo Jorge Reyes como alcalde en los 90?",
    answer: "Bajo su alcaldía, se construyeron infraestructuras clave que siguen vigentes: el Mercado Mayorista (hoy Gran Colombia), la Terminal Terrestre Reina del Cisne y el Centro Sanitario. Además, optimizó las redes hídricas incrementando el caudal de agua en un 50%.",
    articleLink: "/blog/verdad-mercado-mayorista",
    articlePrefix: "La verdad sobre sus obras"
  },
  {
    question: "¿Qué es el Movimiento MASS 115?",
    answer: "El Movimiento Acción Social Solidaria (MASS), Lista 115, es una organización política independiente formada por ciudadanos lojanos. Nace desde las bases populares, sin ataduras a partidos tradicionales, para proponer un modelo de gestión técnica y sin corrupción."
  },
  {
    question: "¿Habrá internet gratis y paneles solares subsidiados en Loja?",
    answer: "Totalmente. El núcleo del Plan 2026 incluye un modelo de 'Energía que te paga'. Se equipará a miles de hogares con paneles solares, permitiendo a la ciudad generar fondos de ahorro que financiarán el acceso a internet público y gratuito para las casas conectadas.",
    articleLink: "/blog/internet-gratis-intercambio",
    articlePrefix: "Cómo funciona el intercambio"
  },
  {
    question: "¿Es transparente la gestión de Jorge Reyes?",
    answer: "Durante su administración (1992-1996), realizó 188 sesiones públicas de cabildo y contrató con 88 empresas distintas, sin un solo señalamiento de sobreprecios o corrupción. Su principio es la eficiencia comprobada: el dinero alcanza cuando no hay intermediarios corruptos.",
    articleLink: "/blog/verdad-mercado-mayorista",
    articlePrefix: "Ver auditoría de gestión"
  }
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Generación del Schema JSON-LD dinámico para FAQ Page (clave para SEO y LLMs)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="bg-light py-20 lg:py-32 border-t border-primario/5">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-acento font-barlow tracking-widest uppercase text-sm mb-4 block font-bold">
            Respuestas Directas
          </span>
          <h2 className="font-barlow text-4xl lg:text-5xl font-black text-primario tracking-tighter uppercase mb-6">
            PREGUNTAS FRECUENTES <span className="text-acento">SOBRE LOJA 2026</span>
          </h2>
          <p className="text-primario/60 font-dmsans max-w-2xl mx-auto">
            La transparencia empieza respondiendo de frente. Esto es lo que necesitas saber sobre Jorge Reyes, sus obras, su historial y su visión para el futuro de nuestra ciudad.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-sm overflow-hidden transition-colors ${
                activeIndex === index ? 'border-acento bg-white shadow-md' : 'border-primario/10 bg-white/50'
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <h3 className="font-barlow text-xl lg:text-2xl font-bold text-primario pr-8">
                  {faq.question}
                </h3>
                <span className={`transform transition-transform duration-300 flex-shrink-0 ${activeIndex === index ? 'rotate-180 text-acento' : 'text-primario/30'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-primario/70 font-dmsans leading-relaxed border-t border-primario/5 mt-2">
                      <p className="pt-4">{faq.answer}</p>
                      
                      {faq.articleLink && (
                        <div className="mt-6 border-l-2 border-acento pl-4 py-1">
                          <p className="text-xs font-bold uppercase tracking-widest text-primario/40 mb-1">
                            {faq.articlePrefix || 'Profundizar'}
                          </p>
                          <a 
                            href={faq.articleLink} 
                            className="text-acento font-bold hover:underline inline-flex items-center group"
                          >
                            Ir a la propuesta detallada
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
