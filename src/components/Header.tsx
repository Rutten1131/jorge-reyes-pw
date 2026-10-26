'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'INICIO', href: '/' },
  { name: 'SOBRE JORGE', href: '/sobre-jorge' },
  { name: 'PLAN 2026', href: '/plan-2026' },
  { name: 'VIVIENDA', href: '/plan-vivienda' },
  { name: 'BLOG', href: '/blog' },
];

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-[#dce7ea] py-3 shadow-md' 
          : 'bg-gradient-to-b from-[#0e2447]/90 to-transparent py-5 lg:py-6'
      } max-lg:bg-[#0e2447] max-lg:py-3`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-12 h-10 lg:w-14 lg:h-12 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/imagenes-formulario/JR_BL.png"
              alt="Jorge Reyes - MASS 115"
              fill
              sizes="(max-width: 1024px) 48px, 56px"
              className={`object-contain filter drop-shadow-md transition-all duration-300 ${
                isScrolled ? 'brightness-0 contrast-200 hue-rotate-180 invert lg:filter-none' : ''
              }`}
              priority
            />
          </div>
          <span className="sr-only">Jorge Reyes - MASS 115</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-heading text-sm font-semibold tracking-wider transition-colors relative group py-1 ${
                  isScrolled
                    ? isActive 
                      ? 'text-[#215196] font-bold' 
                      : 'text-[#16233a] hover:text-[#479ea9]'
                    : isActive
                      ? 'text-[#9ad6de] font-bold'
                      : 'text-white hover:text-[#9ad6de]'
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#479ea9] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Toggle */}
        <div className="flex items-center space-x-4">
          <Link
            href="https://wa.me/593997755478"
            target="_blank"
            className="font-heading text-sm font-bold tracking-wider px-5 py-2.5 rounded-sm transition-all duration-300 shadow-md bg-[#479ea9] text-white hover:bg-[#2a7580] hover:scale-105"
          >
            ÚNETE
          </Link>

          {/* Hamburger Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-1"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0e2447] border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-heading text-base font-semibold tracking-wider transition-colors py-2.5 border-b border-white/5 ${
                      isActive ? 'text-[#9ad6de] font-bold' : 'text-white hover:text-[#9ad6de]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
