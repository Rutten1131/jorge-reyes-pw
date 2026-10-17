import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { getPool, initDatabase } from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

// GET all submissions for Admin view
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

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error al obtener registros de vivienda:', error);
    return NextResponse.json(
      { error: 'Error al consultar los registros' },
      { status: 500 }
    );
  }
}
