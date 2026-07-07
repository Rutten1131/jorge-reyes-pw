'use client';

export default function SealBadge({ text = "CÁLCULO TÉCNICO VERIFICADO" }) {
  return (
    <div className="inline-flex items-center gap-2 bg-solar/10 border border-solar/30 px-4 py-2 rounded-full mb-6">
      <span className="text-solar text-xs font-bold">✓</span>
      <span className="font-barlow text-[10px] tracking-widest uppercase text-solar font-bold">
        {text}
      </span>
    </div>
  );
}
