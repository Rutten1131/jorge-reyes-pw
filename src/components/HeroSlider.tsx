'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const slides = [
  {
    id: 0,
    image: '/images/stats-doctors.webp',
    tag: 'AUTORIDAD COMPROBADA',
    stat: '2,000+',
    unit: 'MÉDICOS FORMADOS',
    quote: 'Si pude formar a los profesionales que hoy cuidan de tu familia, tengo la disciplina para cuidar de tu ciudad.',
    cta: { label: 'MIRA MI TRAYECTORIA', href: '/sobre-jorge' },
  },
  {
    id: 1,
    image: '/images/stats-students.webp',
    tag: 'EDUCACIÓN COMO INVERSIÓN',
    stat: '500+',
    unit: 'ESPECIALISTAS GRADUADOS',
    quote: 'La educación no es un gasto, es la infraestructura que no se cae con el próximo temblor político.',
    cta: { label: 'EL PLAN EDUCATIVO', href: '/plan-2026' },
  },
  {
    id: 2,
    image: '/images/stats-solar.webp',
    tag: 'ENERGÍA SOBERANA',
    stat: '27 MW',
    unit: 'DE FUTURO ENERGÉTICO',
    quote: 'Loja dejará de pagar facturas por energía ajena. La autosuficiencia no es un sueño, es ingeniería.',
    cta: { label: 'QUIERO MI CASA SOLAR', href: '/plan-2026#energia' },
  },
  {
    id: 3,
    image: '/images/stats-train.webp',
    tag: 'MOVILIDAD REAL',
    stat: '15 KM',
    unit: 'DE TREN ELEVADO',
    quote: 'El tiempo que pierdes en el tráfico no vuelve. El transporte moderno es respeto a tu vida.',
    cta: { label: 'VER EL PLAN DE MOVILIDAD', href: '/plan-2026#movilidad' },
  },
  {
    id: 4,
    image: '/images/stats-smartcity.webp',
    tag: 'CONECTIVIDAD TOTAL',
    stat: '100%',
    unit: 'INTERNET GRATUITO',
    quote: 'Ningún niño lojano debería dejar de estudiar por no poder pagar el internet. Eso termina en 2026.',
    cta: { label: 'ACTIVA EL PLAN 2026', href: '/plan-2026' },
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const portalVariants: Variants = {
    enter: {
      scale: 1.12,
      opacity: 0,
    },
    center: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] },
    },
    exit: {
      scale: 0.88,
      opacity: 0,
      transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] },
    },
  };

  const textVariants: Variants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0e2447] h-[70vh] lg:h-[80vh]">

      {/* SLIDES */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          variants={portalVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 z-10"
        >
          <Image
            src={slide.image}
            alt={slide.unit}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay con el gradiente oficial */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e2447]/95 via-[#0e2447]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e2447]/90 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* TEXT CONTENT */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-2xl"
            >
              <span className="text-[#9ad6de] font-heading font-bold tracking-[0.25em] text-sm uppercase block mb-6">
                {slide.tag}
              </span>
              <h2 className="font-display font-extrabold text-white leading-none tracking-tight mb-4"
                style={{ fontSize: 'clamp(3rem, 15vw, 8rem)', lineHeight: 0.9 }}
              >
                {slide.stat}
              </h2>
              <p className="font-heading font-bold text-[#9ad6de] text-xl lg:text-2xl tracking-wider uppercase mb-8">
                {slide.unit}
              </p>
              <p className="font-slogan italic text-white/90 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
                "{slide.quote}"
              </p>
              <Link
                href={slide.cta.href}
                className="inline-block bg-[#9ad6de] text-[#0e2447] font-heading font-bold tracking-widest text-sm px-8 py-4 rounded-sm shadow-xl transition-all hover:scale-105 hover:bg-[#6bbcc7]"
              >
                {slide.cta.label}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* NAVIGATION ARROWS */}
      <div className="absolute z-30 bottom-24 right-6 lg:inset-y-0 lg:right-10 flex flex-row lg:flex-col items-center justify-center gap-4">
        <button
          onClick={prev}
          aria-label="Slide anterior"
          className="group w-12 h-12 border border-white/20 flex items-center justify-center text-white/70 hover:border-[#9ad6de] hover:text-[#9ad6de] transition-all duration-300"
        >
          <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Siguiente slide"
          className="group w-12 h-12 border border-white/20 flex items-center justify-center text-white/70 hover:border-[#9ad6de] hover:text-[#9ad6de] transition-all duration-300"
        >
          <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* PROGRESS DOTS */}
      <div className="absolute z-30 bottom-8 left-0 right-0 flex justify-center items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className="relative overflow-hidden h-0.5 bg-white/20 transition-all duration-300"
            style={{ width: current === i ? '48px' : '16px' }}
          >
            {current === i && (
              <motion.span
                className="absolute inset-0 bg-[#9ad6de] origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* SLIDE COUNTER */}
      <div className="absolute z-30 bottom-8 right-6 lg:right-10 text-white/60 font-heading text-sm tracking-widest">
        <span className="text-[#9ad6de] font-bold">{String(current + 1).padStart(2, '0')}</span>
        <span className="mx-1">/</span>
        {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}
