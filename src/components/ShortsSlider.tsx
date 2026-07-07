'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mockup data for shorts. The user will populate these with actual local files later.
const SHORTS_DATA = [
  { id: 0, title: "Rebelión en las calles", videoSrc: "https://player.mediadelivery.net/play/640632/7d40b31b-3574-41f2-b5d8-b2c8711e3a53", poster: "/images/jorge-hero.webp" },
  { id: 1, title: "¿Por qué el MASS 115?", videoSrc: "https://player.mediadelivery.net/play/640632/a912319f-c351-4610-a465-69e6d15c56da", poster: "/images/stats-doctors.webp" },
  { id: 2, title: "La verdad del tren elevado", videoSrc: "https://player.mediadelivery.net/play/640632/6ed9d65f-3740-44f6-a045-5ea3a68c23df", poster: "/images/stats-train.webp" },
  { id: 3, title: "Mensaje a los jóvenes", videoSrc: "https://player.mediadelivery.net/play/640632/dd722bfe-e020-4025-8456-a14f75a12d13", poster: "/images/stats-students.webp" },
  { id: 4, title: "El plan solar explicado", videoSrc: "https://player.mediadelivery.net/play/640632/02dfb1b9-f462-4f87-9cd8-d182eefb880c", poster: "/images/stats-solar.webp" },
  { id: 5, title: "Loja Inteligente", videoSrc: "https://player.mediadelivery.net/play/640632/1474767a-532d-4f38-89f9-eca3b8d1c782", poster: "/images/stats-smartcity.webp" },
  { id: 6, title: "El futuro de nuestros niños", videoSrc: "https://player.mediadelivery.net/play/640632/faf14afd-1301-4580-9545-89a21039bd09", poster: "/images/jorge_niños.webp" },
];

export default function ShortsSlider() {
  const [currentIndex, setCurrentIndex] = useState(2); // Start in the middle
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SHORTS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SHORTS_DATA.length) % SHORTS_DATA.length);
  };

  const handleNextVideo = () => {
    setPlayingIndex((prev) => prev !== null ? (prev + 1) % SHORTS_DATA.length : null);
  };

  const handlePrevVideo = () => {
    setPlayingIndex((prev) => prev !== null ? (prev - 1 + SHORTS_DATA.length) % SHORTS_DATA.length : null);
  };

  const getPositionClass = (index: number) => {
    const diff = index - currentIndex;
    const absDiff = Math.abs(diff);

    // Handles wrap around visually
    let adjustedDiff = diff;
    if (diff > 2) adjustedDiff = diff - SHORTS_DATA.length;
    if (diff < -2) adjustedDiff = diff + SHORTS_DATA.length;

    if (adjustedDiff === 0) return 'z-30 scale-110 opacity-100'; // Center
    if (adjustedDiff === 1) return 'z-20 scale-90 translate-x-[40%] opacity-50 cursor-pointer'; // Right 1
    if (adjustedDiff === -1) return 'z-20 scale-90 -translate-x-[40%] opacity-50 cursor-pointer'; // Left 1
    if (adjustedDiff === 2) return 'z-10 scale-75 translate-x-[80%] opacity-20 cursor-pointer hidden md:block'; // Right 2
    if (adjustedDiff === -2) return 'z-10 scale-75 -translate-x-[80%] opacity-20 cursor-pointer hidden md:block'; // Left 2
    
    return 'hidden';
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = offset.x;
    if (swipe < -50) {
      handleNext();
    } else if (swipe > 50) {
      handlePrev();
    }
  };

  return (
    <section className="bg-neutro py-24 lg:py-32 overflow-hidden relative">
      <div className="container mx-auto px-4 text-center mb-16">
        <span className="text-acento font-barlow tracking-widest uppercase text-sm mb-4 block">
          LO QUE PASA EN LAS CALLES
        </span>
        <h2 className="font-barlow text-4xl sm:text-5xl lg:text-7xl font-bold text-primario tracking-tighter">
          CERCANÍA CON EL <span className="text-acento">PUEBLO</span>
        </h2>
      </div>

      <div className="relative h-[400px] md:h-[450px] max-w-6xl mx-auto flex items-center justify-center">
        
        {SHORTS_DATA.map((short, i) => {
          const isCenter = i === currentIndex;

          return (
            <motion.div
              key={short.id}
              className={`absolute top-0 bottom-0 w-[200px] sm:w-[250px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${getPositionClass(i)}`}
              onClick={() => !isCenter && setCurrentIndex(i)}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={isCenter ? handleDragEnd : undefined}
            >
              <div 
                className={`relative group w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 ${isCenter ? 'border-acento/50' : 'border-transparent'}`}
                onClick={() => isCenter && setPlayingIndex(i)}
              >
                {/* Preview Image for the card */}
                <img
                  src={short.poster}
                  alt={short.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primario/40 group-hover:bg-primario/20 transition-colors pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primario to-transparent pointer-events-none">
                  <h4 className="text-white font-barlow text-xl font-bold tracking-wide">{short.title}</h4>
                </div>

                {isCenter && (
                  <button className="absolute inset-0 m-auto w-16 h-16 bg-acento text-primario rounded-full flex items-center justify-center pl-1 shadow-lg hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Controles móviles */}
        <div className="absolute bottom-0 inset-x-0 w-full flex justify-center gap-6 mt-10 md:hidden pb-4">
          <button onClick={handlePrev} className="bg-white/20 p-3 rounded-full text-primario backdrop-blur-sm border border-primario/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNext} className="bg-white/20 p-3 rounded-full text-primario backdrop-blur-sm border border-primario/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Video Modal Popup */}
      <AnimatePresence mode="wait">
        {playingIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-primario/95 backdrop-blur-sm p-4"
          >
            {/* Navegación Anterior */}
            <button 
              onClick={handlePrevVideo}
              className="absolute left-4 md:left-10 text-white/50 hover:text-acento transition-colors z-50"
            >
              <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Cerrar Modal */}
            <button 
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 z-50 transition-colors"
              onClick={() => setPlayingIndex(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Video Container con Título */}
            <div className="flex flex-col items-center gap-4 w-full max-w-[400px]">
              <motion.div 
                key={playingIndex}
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10"
              >
                <iframe 
                  src={`${SHORTS_DATA[playingIndex].videoSrc}?autoplay=1`}
                  loading="lazy" 
                  style={{ border: "none", position: "absolute", top: 0, height: "100%", width: "100%" }} 
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" 
                  allowFullScreen={true}
                ></iframe>
              </motion.div>
              <motion.h4 
                key={`title-${playingIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white font-barlow text-xl sm:text-2xl font-bold tracking-tight text-center"
              >
                {SHORTS_DATA[playingIndex].title}
              </motion.h4>
            </div>

            {/* Navegación Siguiente */}
            <button 
              onClick={handleNextVideo}
              className="absolute right-4 md:right-10 text-white/50 hover:text-acento transition-colors z-50"
            >
              <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
