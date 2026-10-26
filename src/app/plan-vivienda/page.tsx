import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Plan de Vivienda Padre Víctor Manuel Reyes Azanza | Jorge Reyes Loja 2026',
  description: 'Conoce el proyecto habitacional de interés social impulsado por el Dr. Jorge Reyes Jaramillo. Cuotas accesibles de hasta $200 mensuales, gestión internacional y escrituras públicas para las familias de Loja.',
  keywords: 'Plan de vivienda Loja, vivienda propia Loja, Jorge Reyes vivienda, asociacion padre victor manuel reyes azanza, casas lojanas 2026',
  openGraph: {
    title: 'Plan de Vivienda Padre Víctor Manuel Reyes Azanza — Jorge Reyes 2026',
    description: 'Dejar de pagar arriendo para tener casa propia en Loja. Conoce la misión, visión y objetivos del proyecto habitacional.',
    images: ['/images/Jorge_ayuda_social.webp'],
  },
};

const FINES_LIST = [
  {
    num: '01',
    title: 'Gestión Institucional de Vivienda',
    desc: 'Gestionar ante ministerios, municipios e instituciones competentes la ejecución de programas integrales de vivienda, urbanización y mejoramiento barrial.',
  },
  {
    num: '02',
    title: 'Infraestructura y Saneamiento',
    desc: 'Coordinar obras comunitarias de agua potable, alcantarillado, pavimentación, alumbrado público, canalización y equipamiento urbano digno.',
  },
  {
    num: '03',
    title: 'Educación Ambiental y Sostenibilidad',
    desc: 'Promover el desarrollo sostenible en el territorio, incorporando criterios de eficiencia energética, áreas verdes y respeto por el entorno lojano.',
  },
  {
    num: '04',
    title: 'Trabajo Comunitario y Mingas',
    desc: 'Articular con autoridades municipales mediante contrapartidas ciudadanas (mingas y aportes voluntarios) para acceder a servicios públicos de calidad.',
  },
  {
    num: '05',
    title: 'Alianzas Internacionales',
    desc: 'Suscribir convenios y contratos con consorcios, fundaciones y organismos nacionales e internacionales para reducir al mínimo el costo de construcción.',
  },
  {
    num: '06',
    title: 'Seguridad Jurídica y Escrituración',
    desc: 'Garantizar el orden, defensa de las obras y la entrega formal y suscripción de escrituras individuales a cada socio ante la autoridad competente.',
  },
];

const OBJETIVOS_LIST = [
  {
    title: 'Organización Comunitaria',
    desc: 'Impulsar el hábitat sostenible y el desarrollo urbano integral con participación activa de las familias.',
  },
  {
    title: 'Mejoramiento Barrial Integral',
    desc: 'Fomentar la inclusión en programas de ordenamiento territorial con pleno acceso a servicios básicos.',
  },
  {
    title: 'Gestión Responsable del Suelo',
    desc: 'Articular con el sector público y privado para consolidar asentamientos humanos seguros y planificados.',
  },
  {
    title: 'Alcanzar el Buen Vivir',
    desc: 'Diseñar planes y proyectos técnicos que eleven la habitabilidad y el bienestar económico de los hogares.',
  },
];

export default function PlanViviendaPage() {
  return (
    <div className="bg-[#f4f9fa] text-[#16233a] min-h-screen">
      {/* 1. HERO INSTITUCIONAL CON TÉCNICA FOCAL POINT & ART DIRECTION (SKILL: responsive-image-focal) */}
      <section className="relative overflow-hidden bg-[#0e2447] text-white pt-28 pb-16 lg:pt-36 lg:pb-24 min-h-[60vh] lg:min-h-[68vh] flex items-center">
        {/* Imagen de fondo con Focal Point protegido (móvil: center 25%, desktop: center 30%) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/imagen-1.webp"
            alt="Dr. Jorge Reyes en territorio con las familias de Loja"
            fill
            priority
            className="object-cover object-[center_28%] lg:object-[center_32%] filter brightness-105"
            sizes="100vw"
          />
          {/* Overlay suave y traslúcido: permite ver la foto sin oscurecer en exceso */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e2447]/80 via-[#0e2447]/60 to-[#215196]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e2447]/85 via-transparent to-[#0e2447]/45" />
        </div>

        {/* Brillo sutil de acento */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#9ad6de]/20 rounded-full blur-3xl pointer-events-none z-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block py-1 px-3.5 mb-4 rounded-full bg-[#0e2447]/60 border border-[#9ad6de]/40 text-[#9ad6de] font-heading font-bold text-[11px] sm:text-xs tracking-widest uppercase backdrop-blur-md shadow-sm">
              Iniciativa Social y Jurídica · Loja 2026
            </span>
            
            {/* Título más equilibrado y compacto */}
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-snug mb-4 drop-shadow-md">
              ASOCIACIÓN DE VIVIENDA <br />
              <span className="text-[#9ad6de]">"PADRE VÍCTOR MANUEL REYES AZANZA"</span>
            </h1>

            {/* Franja de lema más concisa y legible */}
            <p className="font-slogan italic text-sm sm:text-base lg:text-lg text-white/95 leading-relaxed mb-8 max-w-2xl mx-auto drop-shadow-sm">
              "Una convocatoria interdisciplinaria de Arquitectos y Abogados convocados por el Dr. Jorge Reyes Jaramillo para transformar el arriendo en patrimonio propio y digno."
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="https://wa.me/593997755478?text=Hola%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20Plan%20de%20Vivienda%20Padre%20Victor%20Manuel%20Reyes"
                target="_blank"
                className="w-full sm:w-auto bg-[#479ea9] hover:bg-[#2a7580] text-white font-heading font-bold text-xs sm:text-sm px-6 py-3.5 rounded-sm shadow-xl transition-all hover:scale-105"
              >
                SOLICITAR INFORMACIÓN POR WHATSAPP
              </Link>
              <Link
                href="/documentos/Plan-2026-Jorge-Reyes.pdf"
                target="_blank"
                className="w-full sm:w-auto border-2 border-white/60 hover:border-white text-white font-heading font-bold text-xs sm:text-sm px-6 py-3.5 rounded-sm transition-all hover:bg-white hover:text-[#0e2447] backdrop-blur-sm"
              >
                DESCARGAR PLAN MAESTRO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EL DIAGNÓSTICO SOCIAL & VISIÓN (LA REALIDAD DE LOJA) */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#dce7ea]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Tarjeta de impacto estadístico */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0e2447] to-[#215196] text-white p-8 sm:p-10 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#9ad6de]/10 rounded-full blur-2xl" />
              <span className="text-[#9ad6de] font-heading font-bold text-xs uppercase tracking-widest block mb-2">
                Realidad Estadística
              </span>
              <div className="font-display text-6xl sm:text-7xl font-extrabold text-[#9ad6de] mb-4">
                65%
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold mb-4 leading-snug">
                De las familias en Loja viven arrendando
              </h3>
              <p className="text-white/80 font-body text-sm leading-relaxed mb-6">
                Frente a la falta de fuentes productivas y el costo de vida en el cantón, pagar un arriendo mes tras mes sin opción a compra agota la economía familiar.
              </p>
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <span className="font-display text-3xl font-bold text-white">≤ $200</span>
                <span className="text-xs text-[#9ad6de] font-heading uppercase tracking-wider font-semibold">
                  Cuota mensual máxima propuesta
                </span>
              </div>
            </div>

            {/* Texto de Visión y Primera Foto en Territorio */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[#2a7580] font-heading font-bold text-sm tracking-[0.2em] uppercase block mb-3">
                  Nuestra Visión
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-black text-[#215196] mb-6 tracking-tight leading-tight">
                  DEL PAGO DE ARRIENDO <br />
                  <span className="text-[#479ea9]">A LA PROPIEDAD DEFINITIVA</span>
                </h2>
                <div className="space-y-4 text-[#56657a] font-body text-base sm:text-lg leading-relaxed">
                  <p>
                    La <strong>Asociación de Vivienda "Padre Víctor Manuel Reyes Azanza"</strong> nace para dar una respuesta real y estructurada a la crisis habitacional de nuestra ciudad.
                  </p>
                  <p>
                    Bajo la conducción del <strong>Dr. Jorge Reyes Jaramillo</strong>, se ha planteado un esquema donde el ciudadano no destine su esfuerzo a un alquiler a fondo perdido, sino a cuotas suficientes que <strong>no superen los $200 mensuales</strong>.
                  </p>
                  <p>
                    Con este aporte programado se cubre el costo de la vivienda construida hasta amortizar la deuda en su totalidad, garantizando que el inmueble se convierta en <strong>propiedad privada con escrituras inscritas</strong>.
                  </p>
                </div>
              </div>

              {/* Fotografía de recorrido en territorio */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#dce7ea] group">
                <div className="relative h-64 sm:h-72 w-full">
                  <Image
                    src="/images/imagen-1.webp"
                    alt="Dr. Jorge Reyes dialogando en territorio con familias lojanas sobre el Plan de Vivienda"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e2447]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-heading font-semibold">
                    📍 Diálogo directo en territorio conociendo las condiciones habitacionales en los barrios de Loja.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ASESORÍA TÉCNICA, JURÍDICA Y MISIÓN INTERNACIONAL */}
      <section className="py-16 lg:py-24 bg-[#f4f9fa]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Foto de Mesa de Trabajo con Arquitectos y Abogados */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <div className="relative h-[380px] sm:h-[450px] w-full">
                  <Image
                    src="/images/imagen-2.webp"
                    alt="Mesa de trabajo técnico y legal de la Asociación con el Dr. Jorge Reyes"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e2447]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[#9ad6de] font-heading font-bold text-xs uppercase tracking-widest block mb-1">
                      Equipo Técnico & Jurídico
                    </span>
                    <p className="text-sm font-body text-white/90">
                      Convocatoria a profesionales en Arquitectura y Derecho para elaborar planos, presupuestos y estatutos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Misión y alianzas */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#dce7ea] p-8 sm:p-10 shadow-md">
              <span className="text-[#2a7580] font-heading font-bold text-xs uppercase tracking-widest block mb-2">
                Nuestra Misión
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-bold text-[#215196] mb-6">
                Filosofía Solidaria, de Servicio y Apoyo Internacional
              </h3>
              <p className="text-[#56657a] font-body text-base sm:text-lg leading-relaxed mb-4">
                La Asociación de Vivienda y el Dr. Jorge Reyes Jaramillo lideran las gestiones y peticiones ante <strong>instituciones internacionales, consorcios y fundaciones cooperantes</strong> para conseguir subsidios y abaratar los costos constructivos.
              </p>
              <p className="text-[#56657a] font-body text-base sm:text-lg leading-relaxed mb-6">
                El compromiso central es que las familias de medianos y bajos recursos económicos accedan a una casa digna a un costo estrictamente mínimo, priorizando el bienestar humano y la justicia social sobre la especulación inmobiliaria.
              </p>

              {/* Dúo de fotos testimoniales de cercanía y respaldo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#dce7ea]">
                <div className="relative h-44 rounded-xl overflow-hidden shadow group">
                  <Image
                    src="/images/imagen-3.webp"
                    alt="Cercanía y abrazo sincero con los ciudadanos de Loja"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="250px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e2447]/80 to-transparent" />
                  <span className="absolute bottom-2 left-3 right-3 text-white text-xs font-heading font-bold">
                    Cercanía y compromiso social
                  </span>
                </div>

                <div className="relative h-44 rounded-xl overflow-hidden shadow group">
                  <Image
                    src="/images/imagen-4.webp"
                    alt="Apretón de manos con los trabajadores y comerciantes lojanos"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="250px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e2447]/80 to-transparent" />
                  <span className="absolute bottom-2 left-3 right-3 text-white text-xs font-heading font-bold">
                    Palabra y cumplimiento con la gente
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. FINES DE LA ORGANIZACIÓN (CARDS INTERACTIVAS) */}
      <section className="py-16 lg:py-24 bg-white border-t border-[#dce7ea]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#2a7580] font-heading font-bold text-xs uppercase tracking-[0.2em] block mb-3">
              Estructura Jurídica y Social
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-[#215196] tracking-tight uppercase">
              Fines de la <span className="text-[#479ea9]">Asociación</span>
            </h2>
            <p className="text-[#56657a] font-body text-base sm:text-lg mt-4">
              Cada paso del Plan de Vivienda se fundamenta en estatutos formales y coordinación institucional para garantizar plena seguridad técnica y jurídica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FINES_LIST.map((fin) => (
              <div
                key={fin.num}
                className="bg-[#f4f9fa] rounded-xl p-8 border border-[#dce7ea] hover:border-[#479ea9] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="font-display text-3xl font-extrabold text-[#479ea9] mb-4 group-hover:scale-105 transition-transform">
                    {fin.num}
                  </div>
                  <h4 className="font-heading text-lg font-bold text-[#215196] mb-3">
                    {fin.title}
                  </h4>
                  <p className="text-sm text-[#56657a] font-body leading-relaxed">
                    {fin.desc}
                  </p>
                </div>
                <div className="w-8 h-1 bg-[#479ea9]/30 rounded-full mt-6 group-hover:w-full group-hover:bg-[#479ea9] transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OBJETIVOS ESTRATÉGICOS */}
      <section className="py-16 lg:py-20 bg-[#0e2447] text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-[#9ad6de] font-heading font-bold text-xs uppercase tracking-[0.2em] block mb-3">
              Compromisos con el Socio
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase">
              Objetivos <span className="text-[#9ad6de]">Estratégicos</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OBJETIVOS_LIST.map((obj, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#9ad6de]/20 text-[#9ad6de] flex items-center justify-center font-bold text-sm mb-4">
                  ✓
                </div>
                <h4 className="font-heading text-lg font-bold text-[#9ad6de] mb-2">
                  {obj.title}
                </h4>
                <p className="text-xs sm:text-sm text-white/75 font-body leading-relaxed">
                  {obj.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LLAMADO A LA ACCIÓN FINAL */}
      <section className="py-16 lg:py-24 bg-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-3xl sm:text-5xl font-black text-[#215196] uppercase mb-6 tracking-tight">
            ¿Deseas formar parte del <span className="text-[#479ea9]">Plan de Vivienda</span>?
          </h2>
          <p className="font-body text-[#56657a] text-lg mb-8 leading-relaxed">
            Regístrate para recibir información técnica, asesoría jurídica y el calendario de asambleas convocadas por la directiva de la asociación.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://wa.me/593997755478?text=Hola%20Dr.%20Jorge%20Reyes,%20deseo%20inscribirme%20y%20conocer%20los%20requisitos%20para%20la%20Asociaci%C3%B3n%20de%20Vivienda"
              target="_blank"
              className="w-full sm:w-auto bg-[#479ea9] hover:bg-[#2a7580] text-white font-heading font-bold text-base px-10 py-5 rounded-sm shadow-xl transition-all hover:scale-105"
            >
              CONTACTAR DIRECTAMENTE POR WHATSAPP
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto border-2 border-[#215196] text-[#215196] hover:bg-[#215196] hover:text-white font-heading font-bold text-base px-8 py-5 rounded-sm transition-all"
            >
              VOLVER AL INICIO
            </Link>
          </div>
          <p className="text-xs text-[#56657a] font-heading uppercase tracking-wider mt-6">
            Asociación de Vivienda "Padre Víctor Manuel Reyes Azanza" · Respaldo Técnico y Jurídico
          </p>
        </div>
      </section>
    </div>
  );
}
