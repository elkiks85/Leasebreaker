import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tactic = await prisma.pressureTactic.findUnique({
      where: { slug: params.slug },
    });

    if (!tactic) {
      return NextResponse.json(
        { success: false, error: 'Táctica no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: tactic });
  } catch (error) {
    console.error('Error fetching tactic:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener táctica' },
      { status: 500 }
    );
  }
}
