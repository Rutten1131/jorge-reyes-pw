import HeroPlan from '@/components/plan-2026/HeroPlan';
import PlanBlock from '@/components/plan-2026/PlanBlock';
import PlanFinalCTA from '@/components/plan-2026/PlanFinalCTA';
import FloatingSideNav from '@/components/shared/FloatingSideNav';
import { PLAN_BLOCKS } from '@/components/plan-2026/plan-data';

export const metadata = {
  title: 'Plan de Gobierno 2026 | Agua, Energía Solar y Smart City — Jorge Reyes Loja',
  description: 'Descubre el proyecto de Smart City para Loja Ecuador: Solución al agua potable 2026, internet gratis, y transporte eléctrico.',
  keywords: 'Smart city Loja Ecuador, Internet gratis Loja proyecto, Solución agua potable Loja 2026, Transporte eléctrico Loja proyecto',
  openGraph: {
    title: 'Plan 2026 — Loja deja de pedir permiso para progresar',
    description: 'Smart city Loja Ecuador, Internet gratis Loja proyecto, Solución agua potable Loja 2026, Transporte eléctrico Loja proyecto.',
    images: ['/images/stats-smartcity.webp'],
  },
};

const PLAN_NAV = [
  { id: 'agua', icon: '🌊', label: 'Agua' },
  { id: 'energia', icon: '💡', label: 'Energía' },
  { id: 'movilidad', icon: '🚌', label: 'Movilidad' },
  { id: 'tecnologia', icon: '💻', label: 'Tecnología' },
  { id: 'comercio', icon: '🌿', label: 'Ecología' },
];

export default function Plan2026Page() {
  return (
    <main className="bg-light">
      {/* Floating left nav — Only shows after scrolling past hero */}
      <FloatingSideNav items={PLAN_NAV} offset={600} />

      <HeroPlan />
      
      {PLAN_BLOCKS.map((block) => (
        <PlanBlock key={block.id} {...block} />
      ))}
      
      <PlanFinalCTA />
    </main>
  );
}
