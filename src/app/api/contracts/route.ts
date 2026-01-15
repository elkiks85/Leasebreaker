import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { contractSchema } from '@/lib/validators';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = { userId: session.user.id };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { landlordName: { contains: search, mode: 'insensitive' } },
        { propertyAddress: { contains: search, mode: 'insensitive' } },
      ];
    }

    const contracts = await prisma.contract.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            actions: true,
            communications: true,
            documents: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: contracts });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener contratos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = contractSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.create({
      data: {
        ...validatedData.data,
        userId: session.user.id,
        leaseStartDate: new Date(validatedData.data.leaseStartDate),
        leaseEndDate: new Date(validatedData.data.leaseEndDate),
        gracePeriodStart: validatedData.data.gracePeriodStart
          ? new Date(validatedData.data.gracePeriodStart)
          : null,
        gracePeriodEnd: validatedData.data.gracePeriodEnd
          ? new Date(validatedData.data.gracePeriodEnd)
          : null,
        terminationDate: validatedData.data.terminationDate
          ? new Date(validatedData.data.terminationDate)
          : null,
      },
      include: {
        _count: {
          select: {
            actions: true,
            communications: true,
            documents: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: contract,
      message: 'Contrato creado exitosamente',
    });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear contrato' },
      { status: 500 }
    );
  }
}
