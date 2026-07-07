'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import SealBadge from './SealBadge';
import PlanCTA from './PlanCTA';

interface PlanBlockProps {
  id: string;
  tag: string;
  h2: string;
  h2Accent: string;
  description: string;
  howItems: string[];
  savingsStat: string;
  savingsLabel: string;
  certeza: string;
  image?: string | null;
  reverse?: boolean;
  accentColor: 'acento' | 'solar' | 'gold';
  pdfLink?: string;
  objectPosition?: string;
}

export default function PlanBlock({
  id,
  tag,
  h2,
  h2Accent,
  description,
  howItems,
  savingsStat,
  savingsLabel,
  certeza,
  image,
  reverse = false,
  accentColor,
  pdfLink,
  objectPosition = "object-cover"
}: PlanBlockProps) {
  const accentClasses = {
    acento: 'text-acento',
    solar: 'text-solar',
    gold: 'text-gold',
  };

  const bgAccentClasses = {
    acento: 'bg-acento/10',
    solar: 'bg-solar/10',
    gold: 'bg-gold/10',
  };

  return (
    <section id={id} className="py-24 lg:py-40 bg-light border-b border-primario/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: reverse ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <SealBadge />
              
              <span className={`font-barlow tracking-widest uppercase text-sm mb-4 block font-bold ${accentClasses[accentColor]}`}>
                {tag}
              </span>
              
              <h2 className="font-barlow text-4xl lg:text-6xl font-extrabold text-primario mb-8 leading-tight tracking-tighter">
                {h2} <br />
                <span className={accentClasses[accentColor]}>{h2Accent}</span>
              </h2>
              
              <p className="font-dmsans text-lg text-primario/70 mb-10 leading-relaxed max-w-xl">
                {description}
              </p>
              
              <div className="space-y-4 mb-12">
                <h4 className="font-barlow text-sm font-bold tracking-widest text-primario uppercase opacity-40 mb-4">
                  EL CÓMO:
                </h4>
                {howItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <span className={`mt-1 font-bold ${accentClasses[accentColor]}`}>✓</span>
                    <p className="font-dmsans text-primario/80 group-hover:text-primario transition-colors">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`p-8 rounded-sm ${bgAccentClasses[accentColor]} border-l-4 border-${accentColor} mb-10`}>
                <p className="font-lora italic text-xl text-primario/90 leading-relaxed">
                  "{certeza}"
                </p>
              </div>

              <PlanCTA pdfLink={pdfLink} />
            </motion.div>
          </div>

          {/* Visual Content / Stats */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="relative aspect-square lg:aspect-video flex items-center justify-center"
            >
              {image ? (
                <div className="relative w-full h-full overflow-hidden rounded-sm group shadow-2xl">
                  <Image
                    src={image}
                    alt={tag}
                    fill
                    className={`object-cover transition-transform duration-1000 group-hover:scale-110 ${objectPosition}`}
                  />
                  <div className="absolute inset-0 bg-primario/20 mix-blend-multiply transition-opacity group-hover:opacity-0" />
                  
                  {/* Floating Stat Overlay */}
                  <div className="absolute -bottom-10 -right-10 lg:bottom-12 lg:right-12 bg-white p-8 lg:p-12 shadow-2xl skew-x-[-12deg] z-10 border-b-8 border-acento">
                    <div className="skew-x-[12deg] text-center">
                      <div className={`font-barlow text-6xl lg:text-8xl font-black mb-2 ${accentClasses[accentColor]}`}>
                        {savingsStat}
                      </div>
                      <p className="font-barlow text-[10px] tracking-widest text-primario/40 uppercase font-black max-w-[120px] mx-auto leading-tight">
                        {savingsLabel}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`w-full h-full rounded-sm ${bgAccentClasses[accentColor]} flex items-center justify-center p-12 relative overflow-hidden group`}>
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    {/* Animated water or abstract grid */}
                    <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-1 animate-pulse">
                      {[...Array(144)].map((_, i) => (
                        <div key={i} className="bg-primario/20 rounded-full scale-50" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center z-10">
                    <div className={`font-barlow text-[120px] lg:text-[180px] font-black leading-none mb-4 ${accentClasses[accentColor]}`}>
                      {savingsStat}
                    </div>
                    <p className="font-barlow text-xs lg:text-sm tracking-[0.3em] text-primario/60 uppercase font-black max-w-sm mx-auto leading-relaxed">
                      {savingsLabel}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
