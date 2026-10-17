'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ViviendaPopupModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    telefono: '',
    email: '',
    direccion: '',
    barrio: '',
    parroquia: '',
    numHabitantes: '1',
    ingresoFamiliar: '',
    tieneDiscapacidad: false,
    adultosMayores: false,
    observaciones: '',
  });

  // Open automatically ONLY on HOME ("/") and ONLY the first time per session
  useEffect(() => {
    // If not on home or in admin, don't open automatically
    if (pathname !== '/') {
      setHasInteracted(true);
      return;
    }

    try {
      const alreadyOpened = sessionStorage.getItem('vivienda_popup_seen');
      if (!alreadyOpened) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          setHasInteracted(true);
          sessionStorage.setItem('vivienda_popup_seen', 'true');
        }, 800);
        return () => clearTimeout(timer);
      } else {
        setHasInteracted(true);
      }
    } catch {
      setHasInteracted(true);
    }
  }, [pathname]);

  // If in admin page, don't show popup or button
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/registro-vivienda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el registro');
      }

      setSuccessMsg('¡Tu solicitud ha sido registrada con éxito!');
      setFormData({
        nombres: '',
        apellidos: '',
        cedula: '',
        telefono: '',
        email: '',
        direccion: '',
        barrio: '',
        parroquia: '',
        numHabitantes: '1',
        ingresoFamiliar: '',
        tieneDiscapacidad: false,
        adultosMayores: false,
        observaciones: '',
      });

      setTimeout(() => {
        setSuccessMsg('');
        setIsOpen(false);
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button at bottom-left with attractive pulse/glow animation */}
      <AnimatePresence>
        {!isOpen && hasInteracted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, x: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.7, x: -30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-40"
          >
            {/* Glowing / radar ring effect */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#4EC8C8] via-[#E8C547] to-[#0ea5a8] opacity-75 blur-md animate-pulse" />
            
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#0d8285] to-[#0ea5a8] hover:from-[#0b6d70] hover:to-[#0c8c8f] text-white px-3.5 py-2 sm:px-5 sm:py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group border-2 border-white/60"
              aria-label="Abrir formulario de registro"
            >
              {/* Ping notification dot */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C547] opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-[#E8C547] border border-white text-[8px] sm:text-[9px] font-black text-black items-center justify-center">
                  !
                </span>
              </span>

              {/* Logos container with white background circle for maximum contrast */}
              <div className="relative w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded-full p-1 shadow-md flex-shrink-0">
                <Image
                  src="/imagenes-formulario/logo-mass.png"
                  alt="JR"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>

              <div className="text-left font-sans pr-0.5 sm:pr-1">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="block text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-[#E8C547]">
                    Plan de Vivienda
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                </div>
                <span className="block text-xs sm:text-sm font-extrabold leading-tight text-white drop-shadow">
                  ¡Regístrate Aquí!
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Modal View */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#0ea5a8] flex flex-col justify-between overflow-y-auto lg:overflow-hidden"
          >
            {/* Background graphic */}
            <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
              <Image
                src="/imagenes-formulario/hero-bBBg.jpg"
                alt="Fondo"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Top Bar with Brand & Close Button */}
            <header className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-3.5 border-b border-white/15 bg-black/15 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11">
                  <Image
                    src="/imagenes-formulario/JR_BL.png"
                    alt="Jorge Reyes"
                    fill
                    sizes="44px"
                    className="object-contain filter drop-shadow"
                  />
                </div>

                <div>
                  <h1 className="text-white font-barlow font-bold text-lg sm:text-2xl tracking-wider uppercase leading-none">
                    Juntos Renacemos
                  </h1>
                  <span className="text-xs sm:text-sm text-teal-100 font-medium tracking-wide">
                    Registro Plan de Vivienda — Loja
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-xs sm:text-sm font-semibold tracking-wide transition shadow-sm backdrop-blur-sm"
                aria-label="Cerrar formulario"
              >
                <span>Cerrar</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </header>

            {/* Central Form Box */}
            <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-6 w-full">
              <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl p-4 sm:p-7 lg:p-8 text-[#1A1A2E] flex flex-col my-auto border border-white/60">
                {/* Form header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-gray-100 gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0ea5a8] leading-tight font-barlow tracking-wide uppercase">
                      Formulario de Registro
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      Complete los datos del solicitante. Los campos con (*) son obligatorios.
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 font-bold self-start sm:self-center">
                    Plan de Vivienda 2026
                  </div>
                </div>

                {successMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                    {/* Left Column: Datos del Solicitante (7 cols) */}
                    <fieldset className="lg:col-span-7 border border-gray-200 rounded-xl p-3 sm:p-5 pt-3">
                      <legend className="text-xs sm:text-sm font-bold text-[#0ea5a8] px-2 uppercase tracking-wider">
                        Datos del Solicitante
                      </legend>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Nombres *
                          </label>
                          <input
                            type="text"
                            name="nombres"
                            required
                            value={formData.nombres}
                            onChange={handleChange}
                            placeholder="Ej: Juan Carlos"
                            className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Apellidos *
                          </label>
                          <input
                            type="text"
                            name="apellidos"
                            required
                            value={formData.apellidos}
                            onChange={handleChange}
                            placeholder="Ej: Pérez Gómez"
                            className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Cédula *
                          </label>
                          <input
                            type="text"
                            name="cedula"
                            required
                            value={formData.cedula}
                            onChange={handleChange}
                            placeholder="Ej: 1101234567"
                            className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Teléfono *
                          </label>
                          <input
                            type="tel"
                            name="telefono"
                            required
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Ej: 0991234567"
                            className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Correo Electrónico
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Ej: correo@ejemplo.com"
                            className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Dirección *
                          </label>
                          <input
                            type="text"
                            name="direccion"
                            required
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder="Ej: Av. Universitaria y Sucre"
                            className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Barrio / Sector *
                          </label>
                          <input
                            type="text"
                            name="barrio"
                            required
                            value={formData.barrio}
                            onChange={handleChange}
                            placeholder="Ej: San Sebastián"
                            className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Parroquia
                          </label>
                          <input
                            type="text"
                            name="parroquia"
                            value={formData.parroquia}
                            onChange={handleChange}
                            placeholder="Ej: El Sagrario"
                            className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition"
                          />
                        </div>
                      </div>
                    </fieldset>

                    {/* Right Column: Información del Hogar (5 cols) */}
                    <fieldset className="lg:col-span-5 border border-gray-200 rounded-xl p-3 sm:p-5 pt-3 flex flex-col justify-between">
                      <div>
                        <legend className="text-xs sm:text-sm font-bold text-[#0ea5a8] px-2 uppercase tracking-wider">
                          Información del Hogar
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 mt-2">
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                              Número de Habitantes *
                            </label>
                            <input
                              type="number"
                              min="1"
                              name="numHabitantes"
                              required
                              value={formData.numHabitantes}
                              onChange={handleChange}
                              className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                              Ingreso Mensual Familiar (USD)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              name="ingresoFamiliar"
                              value={formData.ingresoFamiliar}
                              onChange={handleChange}
                              placeholder="Ej: 450.00"
                              className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition"
                            />
                          </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="mt-3 sm:mt-4 space-y-2">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              name="tieneDiscapacidad"
                              checked={formData.tieneDiscapacidad}
                              onChange={handleChange}
                              className="w-4 h-4 text-[#0ea5a8] rounded border-gray-300 focus:ring-[#0ea5a8]"
                            />
                            <span className="text-xs sm:text-sm text-gray-700">
                              ¿Algún miembro del hogar tiene discapacidad?
                            </span>
                          </label>

                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              name="adultosMayores"
                              checked={formData.adultosMayores}
                              onChange={handleChange}
                              className="w-4 h-4 text-[#0ea5a8] rounded border-gray-300 focus:ring-[#0ea5a8]"
                            />
                            <span className="text-xs sm:text-sm text-gray-700">
                              ¿Hay adultos mayores en el hogar?
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Observaciones */}
                      <div className="mt-3 sm:mt-4">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                          Observaciones Adicionales
                        </label>
                        <textarea
                          name="observaciones"
                          rows={2}
                          value={formData.observaciones}
                          onChange={handleChange}
                          placeholder="Información adicional relevante..."
                          className="w-full px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5a8]/30 focus:border-[#0ea5a8] outline-none transition resize-none"
                        />
                      </div>
                    </fieldset>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 sm:py-3 bg-[#0ea5a8] hover:bg-[#0c8c8f] text-white font-bold text-xs sm:text-sm rounded-lg shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Registrando...</span>
                          </>
                        ) : (
                          'Registrar Solicitud'
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-5 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg transition text-center"
                      >
                        ← Volver al inicio
                      </button>
                    </div>

                    <span className="text-[11px] text-gray-400 text-center sm:text-right">
                      Tus datos están protegidos y son confidenciales.
                    </span>
                  </div>
                </form>
              </div>
            </main>

            {/* Bottom Footer Bar */}
            <footer className="relative z-20 text-center py-2.5 text-teal-100 text-xs bg-black/15 border-t border-white/10 flex-shrink-0">
              © 2026 Movimiento Juntos Renacemos — Loja. Todos los derechos reservados.
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
