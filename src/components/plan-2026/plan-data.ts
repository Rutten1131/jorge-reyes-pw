export interface PlanBlockData {
  id: string;
  tag: string;
  icon: string;
  h2: string;
  h2Accent: string;
  description: string;
  howItems: string[];
  savingsStat: string;
  savingsLabel: string;
  certeza: string;
  accentColor: 'acento' | 'solar' | 'gold';
  reverse: boolean;
  image: string | null;
  objectPosition?: string;
}

export const PLAN_BLOCKS: PlanBlockData[] = [
  {
    id: "agua",
    tag: "INFRAESTRUCTURA HÍDRICA",
    icon: "🌊",
    h2: "Agua para siempre:",
    h2Accent: "Sin cortes y con presión en toda la ciudad",
    description: "Los cortes de agua no son un problema técnico sin solución. Son el resultado de décadas de gestión postergada. Esto termina en 2026.",
    howItems: [
      "Nuevo proyecto de captación y reservorios estratégicos en las cuencas del cantón",
      "Renovación total de la red de distribución — no más parches de décadas",
      "Sistema de monitoreo digital para detectar fugas en tiempo real",
      "Garantía de 18 horas de servicio continuo en todos los barrios",
    ],
    savingsStat: "9×",
    savingsLabel: "más cara es el agua de tanquero. Tu familia dejará de pagar ese sobrecosto.",
    certeza: "Ya incrementé el caudal en un 50% en mi primera alcaldía. Sé dónde están los tubos y cómo hacer que el agua llegue a tu casa.",
    accentColor: "acento",
    reverse: false,
    image: null,
  },
  {
    id: "energia",
    tag: "VIVIENDA Y ENERGÍA SOLAR",
    icon: "💡",
    h2: "Tu casa pagará",
    h2Accent: "tu internet y tu luz",
    description: "Mientras Ecuador sigue dependiendo de la energía cara, Loja tiene el sol más generoso de la sierra sur. Es hora de usarlo.",
    howItems: [
      "2,000 casas ecológicas de 96 m² con paneles solares integrados",
      "Generación de 27 megavatios de energía propia para la ciudad",
      "Programa de subsidio para que los hogares de bajos ingresos accedan primero",
      "El ahorro en tu factura de luz financiará tu internet gratis",
    ],
    savingsStat: "$65",
    savingsLabel: "de ahorro mensual estimado por familia. El sol de Loja trabajará para ti.",
    certeza: "El sol de Loja no es un recurso natural desperdiciado. Es un activo económico. Lo convertiremos en dinero para tu bolsillo.",
    accentColor: "solar",
    reverse: true,
    image: "/images/stats-solar.webp",
    objectPosition: "object-top",
  },
  {
    id: "movilidad",
    tag: "MOVILIDAD INTELIGENTE",
    icon: "🚌",
    h2: "Cruza Loja en minutos:",
    h2Accent: "Transporte eléctrico y moderno",
    description: "Loja merece moverse como una capital del siglo XXI, no atascarse en las mismas calles del siglo pasado.",
    howItems: [
      "Bus Eléctrico Articulado con carril exclusivo de 9 km (Argelia → Sauces)",
      "Capacidad para 150 pasajeros — frecuencias cada 8 minutos",
      "Modernización de la Terminal Terrestre Internacional",
      "Hotel para choferes + Centro comercial integrado en la Terminal",
    ],
    savingsStat: "243h",
    savingsLabel: "de tu tiempo de vuelta cada año. 40 minutos menos de espera por día.",
    certeza: "Yo construí la Terminal que hoy usas. Ahora la llevaré al nivel internacional que mereces.",
    accentColor: "acento",
    reverse: false,
    image: "/images/stats-train.webp",
  },
  {
    id: "tecnologia",
    tag: "ECONOMÍA DIGITAL",
    icon: "💻",
    h2: "Valle de Tecnología:",
    h2Accent: "Empleo digital sin salir de tu ciudad",
    description: "El mayor problema de Loja no es la falta de talento. Es la falta de razones para quedarse. Vamos a cambiar eso.",
    howItems: [
      "Ecosistema de innovación para atraer inversiones digitales al cantón",
      "Espacios de coworking y laboratorios de tecnología emergente",
      "Capacitación gratuita en IA, programación y habilidades digitales",
      "Convenios con empresas tech para generación de empleo local",
    ],
    savingsStat: "$1.2K",
    savingsLabel: "por mes en empleo digital local. Sin emigrar, sin contaminar, sin gastar en pasajes.",
    certeza: "Loja será el referente tecnológico del Ecuador. Generaremos empleo real en el sector digital.",
    accentColor: "acento",
    reverse: true,
    image: "/images/stats-smartcity.webp",
  },
  {
    id: "comercio",
    tag: "COMERCIO Y ECOLOGÍA",
    icon: "🌿",
    h2: "Mercados modernos",
    h2Accent: "y una ciudad sin basura",
    description: "El desorden del comercio informal no es un problema moral. Es un problema de infraestructura que tiene solución.",
    howItems: [
      "Regeneración de mercados: Divino Niño, Obra Pía, Puerto Seco",
      "600 empleos directos generados por la regeneración comercial",
      "Planta procesadora de basura para convertir residuos en recursos",
      "20 vehículos recolectores nuevos + cierre ordenado del relleno sanitario",
    ],
    savingsStat: "600",
    savingsLabel: "empleos directos creados. Una ciudad limpia atrae turismo. Turismo = ingresos para tus negocios.",
    certeza: "Loja fue la ciudad más limpia del país bajo mi gestión. Recuperaremos ese título.",
    accentColor: "solar",
    reverse: false,
    image: "/images/jorge_niños.webp",
    objectPosition: "object-top",
  },
];
