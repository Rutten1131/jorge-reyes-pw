'use client';

import HeroJorge from '@/components/sobre-jorge/HeroJorge';
import FamilyOrigin from '@/components/sobre-jorge/FamilyOrigin';
import InteractiveTimeline from '@/components/sobre-jorge/InteractiveTimeline';
import ObrasSection from '@/components/sobre-jorge/ObrasSection';
import AcademicSection from '@/components/sobre-jorge/AcademicSection';
import MoralSeal from '@/components/sobre-jorge/MoralSeal';
import FloatingSideNav from '@/components/shared/FloatingSideNav';
import { motion, useScroll, useSpring } from 'framer-motion';

const SOBRE_JORGE_NAV = [
  { id: 'origen', icon: '🌱', label: 'Origen' },
  { id: 'timeline', icon: '📅', label: 'Historia' },
  { id: 'obras', icon: '🏗️', label: 'Obras' },
  { id: 'academia', icon: '🎓', label: 'Academia' },
  { id: 'moral', icon: '⚖️', label: 'Integridad' },
];

export default function SobreJorgePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative bg-light min-h-screen">
      {/* Top scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-acento z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Floating left side navigation */}
      <FloatingSideNav items={SOBRE_JORGE_NAV} />

      <HeroJorge />
      <div id="origen"><FamilyOrigin /></div>
      <div id="timeline"><InteractiveTimeline /></div>
      <div id="obras"><ObrasSection /></div>
      <div id="academia"><AcademicSection /></div>
      <div id="moral"><MoralSeal /></div>
    </main>
  );
}
