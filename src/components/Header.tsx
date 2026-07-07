'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'INICIO', href: '/' },
  { name: 'SOBRE JORGE', href: '/sobre-jorge' },
  { name: 'PLAN 2026', href: '/plan-2026' },
  { name: 'BLOG', href: '/blog' },
];

const AguilaLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
    {/* Simple eagle-like icon placeholder */}
  </svg>
);

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
          ? 'bg-primario/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg' 
          : 'bg-transparent py-6 lg:bg-transparent lg:py-8'
      } ${
        // Always solid on mobile according to brief
        'max-lg:bg-primario max-lg:py-3'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <AguilaLogo className="w-8 h-8 lg:w-10 lg:h-10 text-acento transition-transform group-hover:scale-110" />
          <span className="sr-only">Jorge Reyes - MASS 115</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-barlow text-sm tracking-widest text-white hover:text-acento transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-acento transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Action Button & Toggle */}
        <div className="flex items-center space-x-4">
          <Link
            href="https://wa.me/593997755478"
            target="_blank"
            className="font-barlow text-sm tracking-wider border-2 border-acento text-white px-5 py-2 hover:bg-acento hover:text-primario transition-all duration-300 rounded-sm"
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
            className="lg:hidden bg-primario border-t border-white/5 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-barlow text-lg tracking-widest text-white hover:text-acento transition-colors py-2 border-b border-white/5"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
