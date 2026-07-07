'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  id: string;
  icon: string;
  label: string;
}

interface FloatingSideNavProps {
  items: NavItem[];
  offset?: number; // px from top before showing
}

export default function FloatingSideNav({ items, offset = 80 }: FloatingSideNavProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > offset);

      // Scroll spy
      const sections = items.map(item => document.getElementById(item.id)).filter(Boolean);
      const current = sections.reduce((prev, section) => {
        const top = section!.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.4) return section;
        return prev;
      }, null as Element | null);

      if (current) setActiveId(current.id);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items, offset]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="fixed left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-1"
          aria-label="Navegación de secciones"
        >
          <div className="bg-primario/80 backdrop-blur-md border border-white/10 rounded-full p-2 flex flex-col gap-1 shadow-2xl">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  title={item.label}
                  className={`group relative flex items-center gap-2 px-2 py-2 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-acento/20' : 'hover:bg-white/5'
                  }`}
                >
                  <span className={`text-xl transition-transform duration-300 group-hover:scale-125 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>

                  {/* Tooltip label on hover */}
                  <span className="absolute left-full ml-3 px-3 py-1 bg-primario border border-white/10 text-white font-barlow text-[10px] tracking-widest uppercase whitespace-nowrap rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg">
                    {item.label}
                  </span>

                  {/* Active dot */}
                  {isActive && (
                    <motion.span
                      layoutId="active-dot"
                      className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-1 bg-acento rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
