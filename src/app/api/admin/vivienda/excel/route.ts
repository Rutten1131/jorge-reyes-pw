import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { getPool, initDatabase } from '@/lib/db';
import * as XLSX from 'xlsx';
import type { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const isAuth = await getSessionFromCookies();
    if (!isAuth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await initDatabase();
    const db = getPool();

    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 
        id,
        nombres,
        apellidos,
        cedula,
        telefono,
        email,
        direccion,
        barrio,
        parroquia,
        num_habitantes,
        ingreso_familiar,
        tiene_discapacidad,
        adultos_mayores,
        observaciones,
        created_at
       FROM vivienda_registros 
       ORDER BY created_at DESC`
    );

    // Format rows into human-friendly representation
    const formattedData = rows.map((r, index) => {
      const fecha = r.created_at ? new Date(r.created_at).toLocaleString('es-EC', { timeZone: 'America/Guayaquil' }) : '';
      return {
        'N°': index + 1,
        'Fecha de Registro': fecha,
        'Nombres': r.nombres || '',
        'Apellidos': r.apellidos || '',
        'Cédula / Identificación': r.cedula || '',
        'Teléfono': r.telefono || '',
        'Correo Electrónico': r.email || 'No especificado',
        'Dirección': r.direccion || '',
        'Barrio / Sector': r.barrio || '',
        'Parroquia': r.parroquia || 'No especificada',
        'N° Habitantes': Number(r.num_habitantes) || 1,
        'Ingreso Familiar (USD)': r.ingreso_familiar ? `$${Number(r.ingreso_familiar).toFixed(2)}` : 'No registrado',
        '¿Tiene Discapacidad?': r.tiene_discapacidad === 1 ? 'SÍ' : 'NO',
        '¿Adultos Mayores?': r.adultos_mayores === 1 ? 'SÍ' : 'NO',
        'Observaciones': r.observaciones || 'Ninguna',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Set human-friendly column widths
    worksheet['!cols'] = [
      { wch: 6 },  // N°
      { wch: 22 }, // Fecha
      { wch: 24 }, // Nombres
      { wch: 24 }, // Apellidos
      { wch: 16 }, // Cedula
      { wch: 16 }, // Telefono
      { wch: 28 }, // Email
      { wch: 35 }, // Direccion
      { wch: 22 }, // Barrio
      { wch: 20 }, // Parroquia
      { wch: 14 }, // N° Habitantes
      { wch: 24 }, // Ingreso Familiar
      { wch: 22 }, // Discapacidad
      { wch: 22 }, // Adultos mayores
      { wch: 45 }, // Observaciones
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plan de Vivienda');

    // Generate buffer
    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const now = new Date().toISOString().slice(0, 10);
    const filename = `Registros_Plan_Vivienda_Loja_${now}.xlsx`;

    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error al exportar registros a Excel:', error);
    return NextResponse.json(
      { error: 'Error al generar el archivo Excel' },
      { status: 500 }
    );
  }
}
