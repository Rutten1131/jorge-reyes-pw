'use client';

import React, { useState, useEffect } from 'react';

interface ViviendaRegistro {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  email: string | null;
  direccion: string;
  barrio: string;
  parroquia: string | null;
  num_habitantes: number;
  ingreso_familiar: string | null;
  tiene_discapacidad: number;
  adultos_mayores: number;
  observaciones: string | null;
  created_at: string;
}

export default function AdminViviendaList() {
  const [registros, setRegistros] = useState<ViviendaRegistro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchRegistros();
  }, []);

  const fetchRegistros = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vivienda');
      const data = await res.json();
      if (data.success) {
        setRegistros(data.data || []);
      }
    } catch (err) {
      console.error('Error al cargar solicitudes de vivienda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/admin/vivienda/excel');
      if (!res.ok) throw new Error('Error al descargar');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Registros_Plan_Vivienda_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Hubo un error al descargar el archivo Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredRegistros = registros.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.nombres.toLowerCase().includes(q) ||
      r.apellidos.toLowerCase().includes(q) ||
      r.cedula.toLowerCase().includes(q) ||
      r.telefono.toLowerCase().includes(q) ||
      r.barrio.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      {/* Header with Title & Excel Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-barlow text-[#1B3A4B] uppercase tracking-wide">
              Registros Plan de Vivienda
            </h2>
            <span className="bg-[#4EC8C8]/20 text-[#1B3A4B] font-bold text-xs px-3 py-1 rounded-full border border-[#4EC8C8]/40">
              {registros.length} Solicitudes
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 font-dmsans">
            Listado completo de personas registradas a través del formulario emergente.
          </p>
        </div>

        {/* Excel Button */}
        <button
          onClick={handleDownloadExcel}
          disabled={isExporting || registros.length === 0}
          className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm px-5 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
          </svg>
          <span>{isExporting ? 'Generando Excel...' : 'Descargar en Excel'}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, cédula, teléfono o barrio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4EC8C8] focus:border-transparent outline-none transition"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-3 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={fetchRegistros}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#4EC8C8] border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500 font-medium">Cargando solicitudes...</p>
        </div>
      ) : filteredRegistros.length === 0 ? (
        <div className="py-16 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-base font-semibold">No se encontraron registros de vivienda</p>
          <p className="text-xs text-gray-500 mt-1">Los registros que las personas completen aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 mt-2">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs font-dmsans">
            <thead className="bg-[#1B3A4B] text-white">
              <tr>
                <th className="py-3 px-3.5 font-semibold">#</th>
                <th className="py-3 px-3.5 font-semibold">Fecha</th>
                <th className="py-3 px-3.5 font-semibold">Solicitante</th>
                <th className="py-3 px-3.5 font-semibold">Cédula</th>
                <th className="py-3 px-3.5 font-semibold">Contacto</th>
                <th className="py-3 px-3.5 font-semibold">Ubicación</th>
                <th className="py-3 px-3.5 font-semibold">Habitantes</th>
                <th className="py-3 px-3.5 font-semibold">Ingreso</th>
                <th className="py-3 px-3.5 font-semibold text-center">Discapacidad</th>
                <th className="py-3 px-3.5 font-semibold text-center">3ra Edad</th>
                <th className="py-3 px-3.5 font-semibold">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredRegistros.map((item, idx) => (
                <tr key={item.id} className="hover:bg-teal-50/50 transition">
                  <td className="py-3 px-3.5 font-bold text-gray-600">{idx + 1}</td>
                  <td className="py-3 px-3.5 text-gray-500 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString('es-EC')}
                  </td>
                  <td className="py-3 px-3.5 font-semibold text-gray-900 whitespace-nowrap">
                    {item.nombres} {item.apellidos}
                  </td>
                  <td className="py-3 px-3.5 font-mono text-gray-700 whitespace-nowrap">
                    {item.cedula}
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="font-semibold text-gray-800">{item.telefono}</div>
                    {item.email && <div className="text-[11px] text-gray-500">{item.email}</div>}
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="font-semibold text-gray-800">{item.barrio}</div>
                    <div className="text-[11px] text-gray-500">{item.direccion}</div>
                    {item.parroquia && <div className="text-[10px] text-teal-700">P. {item.parroquia}</div>}
                  </td>
                  <td className="py-3 px-3.5 text-center font-bold text-gray-700">
                    {item.num_habitantes}
                  </td>
                  <td className="py-3 px-3.5 font-semibold text-gray-800 whitespace-nowrap">
                    {item.ingreso_familiar ? `$${Number(item.ingreso_familiar).toFixed(2)}` : '-'}
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    {item.tiene_discapacidad === 1 ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                        SÍ
                      </span>
                    ) : (
                      <span className="text-gray-400 font-medium">No</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    {item.adultos_mayores === 1 ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                        SÍ
                      </span>
                    ) : (
                      <span className="text-gray-400 font-medium">No</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-gray-600 max-w-xs truncate" title={item.observaciones || ''}>
                    {item.observaciones || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
