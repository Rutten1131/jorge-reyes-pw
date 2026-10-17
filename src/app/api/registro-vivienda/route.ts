import { NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombres,
      apellidos,
      cedula,
      telefono,
      email,
      direccion,
      barrio,
      parroquia,
      numHabitantes,
      ingresoFamiliar,
      tieneDiscapacidad,
      adultosMayores,
      observaciones,
    } = body;

    if (!nombres || !apellidos || !cedula || !telefono || !direccion || !barrio) {
      return NextResponse.json(
        { error: 'Por favor completa todos los campos requeridos (*).' },
        { status: 400 }
      );
    }

    await initDatabase();
    const db = getPool();

    const parsedHabitantes = parseInt(numHabitantes) || 1;
    const parsedIngreso = ingresoFamiliar ? parseFloat(ingresoFamiliar) : null;
    const discapacidadVal = tieneDiscapacidad ? 1 : 0;
    const adultosVal = adultosMayores ? 1 : 0;

    const [result]: any = await db.execute(
      `INSERT INTO vivienda_registros 
        (nombres, apellidos, cedula, telefono, email, direccion, barrio, parroquia, num_habitantes, ingreso_familiar, tiene_discapacidad, adultos_mayores, observaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombres.trim(),
        apellidos.trim(),
        cedula.trim(),
        telefono.trim(),
        email ? email.trim() : null,
        direccion.trim(),
        barrio.trim(),
        parroquia ? parroquia.trim() : null,
        parsedHabitantes,
        parsedIngreso,
        discapacidadVal,
        adultosVal,
        observaciones ? observaciones.trim() : null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Solicitud registrada exitosamente.',
      id: result.insertId,
    });
  } catch (error: any) {
    console.error('Error al registrar solicitud de vivienda:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.' },
      { status: 500 }
    );
  }
}
