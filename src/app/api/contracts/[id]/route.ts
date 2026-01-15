import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { contractSchema } from '@/lib/validators';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const contract = await prisma.contract.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        actions: {
          include: {
            tactic: true,
          },
          orderBy: { dateCreated: 'desc' },
        },
        communications: {
          orderBy: { createdAt: 'desc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        clauses: true,
        _count: {
          select: {
            actions: true,
            communications: true,
            documents: true,
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'Contrato no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contract });
  } catch (error) {
    console.error('Error fetching contract:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener contrato' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Check ownership
    const existingContract = await prisma.contract.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingContract) {
      return NextResponse.json(
        { success: false, error: 'Contrato no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = contractSchema.partial().safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const updateData: any = { ...validatedData.data };

    // Convert date strings to Date objects
    if (updateData.leaseStartDate) {
      updateData.leaseStartDate = new Date(updateData.leaseStartDate);
    }
    if (updateData.leaseEndDate) {
      updateData.leaseEndDate = new Date(updateData.leaseEndDate);
    }
    if (updateData.gracePeriodStart) {
      updateData.gracePeriodStart = new Date(updateData.gracePeriodStart);
    }
    if (updateData.gracePeriodEnd) {
      updateData.gracePeriodEnd = new Date(updateData.gracePeriodEnd);
    }
    if (updateData.terminationDate) {
      updateData.terminationDate = new Date(updateData.terminationDate);
    }

    const contract = await prisma.contract.update({
      where: { id: params.id },
      data: updateData,
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
      message: 'Contrato actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar contrato' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Check ownership
    const existingContract = await prisma.contract.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingContract) {
      return NextResponse.json(
        { success: false, error: 'Contrato no encontrado' },
        { status: 404 }
      );
    }

    await prisma.contract.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Contrato eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar contrato' },
      { status: 500 }
    );
  }
}
