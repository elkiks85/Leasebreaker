import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { actionSchema } from '@/lib/validators';

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
    const priority = searchParams.get('priority');
    const contractId = searchParams.get('contractId');

    const where: any = { userId: session.user.id };

    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (priority && priority !== 'ALL') {
      where.priority = priority;
    }
    if (contractId) {
      where.contractId = contractId;
    }

    const actions = await prisma.action.findMany({
      where,
      orderBy: { dateCreated: 'desc' },
      include: {
        tactic: true,
        contract: {
          select: {
            id: true,
            landlordName: true,
            propertyAddress: true,
          },
        },
        documents: true,
        reminders: true,
      },
    });

    return NextResponse.json({ success: true, data: actions });
  } catch (error) {
    console.error('Error fetching actions:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener acciones' },
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
    const validatedData = actionSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    // Verify contract ownership
    const contract = await prisma.contract.findFirst({
      where: {
        id: validatedData.data.contractId,
        userId: session.user.id,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Contrato no encontrado' },
        { status: 404 }
      );
    }

    // Verify tactic exists
    const tactic = await prisma.pressureTactic.findUnique({
      where: { id: validatedData.data.tacticId },
    });

    if (!tactic) {
      return NextResponse.json(
        { success: false, error: 'Táctica no encontrada' },
        { status: 404 }
      );
    }

    const action = await prisma.action.create({
      data: {
        ...validatedData.data,
        userId: session.user.id,
        dateDue: validatedData.data.dateDue
          ? new Date(validatedData.data.dateDue)
          : null,
        followUpDate: validatedData.data.followUpDate
          ? new Date(validatedData.data.followUpDate)
          : null,
      },
      include: {
        tactic: true,
        contract: {
          select: {
            id: true,
            landlordName: true,
            propertyAddress: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: action,
      message: 'Acción creada exitosamente',
    });
  } catch (error) {
    console.error('Error creating action:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear acción' },
      { status: 500 }
    );
  }
}
