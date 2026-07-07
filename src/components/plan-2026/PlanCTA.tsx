'use client';

import Link from 'next/link';

interface PlanCTAProps {
  pdfLink?: string;
}

export default function PlanCTA({ pdfLink }: PlanCTAProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-10">
      <Link 
        href={pdfLink || "/documentos/Plan-2026.pdf"}
        target="_blank"
        className="inline-flex items-center justify-center gap-2 border border-primario text-primario font-barlow font-bold tracking-widest text-[10px] sm:text-xs px-8 py-4 hover:bg-primario hover:text-white transition-all uppercase"
      >
        VER DETALLES TÉCNICOS →
      </Link>
      <Link
        href="https://wa.me/593997755478"
        className="inline-flex items-center justify-center gap-2 bg-acento text-primario font-barlow font-bold tracking-widest text-[10px] sm:text-xs px-8 py-4 hover:scale-105 transition-all shadow-lg hover:bg-white uppercase"
      >
        APOYO ESTA VISIÓN <span className="text-sm">✓</span>
      </Link>
    </div>
  );
}
