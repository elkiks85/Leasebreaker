import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const impactLevel = searchParams.get('impactLevel');
    const maxCost = searchParams.get('maxCost');

    const where: any = { isActive: true };

    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (impactLevel && impactLevel !== 'ALL') {
      where.impactLevel = impactLevel;
    }
    if (maxCost !== null) {
      where.estimatedCost = { lte: parseFloat(maxCost) };
    }

    const tactics = await prisma.pressureTactic.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { impactLevel: 'desc' }],
    });

    return NextResponse.json({ success: true, data: tactics });
  } catch (error) {
    console.error('Error fetching tactics:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener tácticas' },
      { status: 500 }
    );
  }
}
