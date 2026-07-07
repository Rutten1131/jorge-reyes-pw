'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Sobre Jorge', href: '/sobre-jorge' },
  { name: 'Plan 2026', href: '/plan-2026' },
  { name: 'Blog', href: '/blog' },
];

const authorityBadges = [
  { title: '2,000', subtitle: 'médicos formados' },
  { title: 'Mercado & Terminal', subtitle: 'obras reales' },
  { title: '27 MW', subtitle: 'de futuro energético' },
];

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-primario text-white py-16 lg:py-24 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Bloque 1 — Cierre emocional */}
          <div className="space-y-6">
            <p className="text-xl lg:text-2xl font-lora italic leading-relaxed text-light/80">
              "Sé escuchar, sé cumplir. Loja no necesita más promesas, necesita resultados que ya funcionan"
            </p>
            <div className="pt-4 flex items-center space-x-3">
              <span className="text-acento font-barlow text-2xl font-bold tracking-tighter">MASS 115</span>
              <div className="h-0.5 w-12 bg-acento" />
            </div>
          </div>

          {/* Bloque 2 — Acción directa */}
          <div className="space-y-6 flex flex-col">
            <h4 className="font-barlow text-lg tracking-widest text-acento">ACTÚA HOY</h4>
            <Link
              href="/donar"
              className="bg-gold text-primario font-barlow font-bold py-3 px-6 rounded-sm text-center transition-transform hover:scale-105"
            >
              FINANCIA LA REBELIÓN DE LOJA
            </Link>
            <Link
              href="https://wa.me/593997755478"
              target="_blank"
              className="bg-acento text-primario font-barlow font-bold py-3 px-6 rounded-sm text-center transition-transform hover:scale-105"
            >
              CONTÁCTANOS POR WHATSAPP
            </Link>
          </div>

          {/* Bloque 3 — Sellos de autoridad */}
          <div className="space-y-6">
            <h4 className="font-barlow text-lg tracking-widest text-acento">RESULTADOS</h4>
            <div className="space-y-4">
              {authorityBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3 }}
                  className="flex flex-col border-l-2 border-acento pl-4"
                >
                  <span className="font-barlow text-2xl font-extrabold">{badge.title}</span>
                  <span className="text-sm uppercase tracking-widest text-white/60">{badge.subtitle}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bloque 4 — Contacto y navegación */}
          <div className="space-y-6">
            <h4 className="font-barlow text-lg tracking-widest text-acento">INFORMACIÓN</h4>
            <div className="space-y-4 text-white/70 text-sm">
              <p>📍 Sucre y Rocafuerte Esq., Loja</p>
              <p>📞 099 775 5478</p>
              <div className="flex space-x-4 pt-2">
                <Link href="https://www.facebook.com/jorge.reyesjaramillo" target="_blank" className="hover:text-acento transition-colors">FB</Link>
                <Link href="https://www.instagram.com/reyesjaramillojorge/" target="_blank" className="hover:text-acento transition-colors">IG</Link>
                <Link href="https://www.tiktok.com/@jorge.reyes.jaramillo" target="_blank" className="hover:text-acento transition-colors">TK</Link>
              </div>
              <nav className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                {footerLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="hover:text-acento transition-colors font-barlow tracking-wider"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-white/30 text-xs">
          <div className="text-center md:text-left space-y-1">
            <p>© 2026 JORGE REYES - MOVIMIENTO ACCIÓN SOCIAL SOLIDARIA 115</p>
            <p>
              Diseñado por{' '}
              <a
                href="https://www.cesarreyesjaramillo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-acento transition-colors underline"
              >
                Cesar Reyes
              </a>{' '}
              | Jorge Reyes 2026
            </p>
          </div>
          <p className="mt-4 md:mt-0 font-barlow tracking-widest uppercase">SÉ ESCUCHAR, SÉ CUMPLIR</p>
        </div>
      </div>
    </footer>
  );
}
