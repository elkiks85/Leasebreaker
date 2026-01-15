import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { updateActionSchema } from '@/lib/validators';

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

    const action = await prisma.action.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        tactic: true,
        contract: true,
        documents: true,
        reminders: true,
      },
    });

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Acción no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: action });
  } catch (error) {
    console.error('Error fetching action:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener acción' },
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
    const existingAction = await prisma.action.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingAction) {
      return NextResponse.json(
        { success: false, error: 'Acción no encontrada' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateActionSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, error: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const updateData: any = { ...validatedData.data };

    // Convert date strings to Date objects
    if (updateData.dateDue) {
      updateData.dateDue = new Date(updateData.dateDue);
    }
    if (updateData.dateCompleted) {
      updateData.dateCompleted = new Date(updateData.dateCompleted);
    }
    if (updateData.followUpDate) {
      updateData.followUpDate = new Date(updateData.followUpDate);
    }

    // If status is changed to COMPLETED, set dateCompleted
    if (updateData.status === 'COMPLETED' && !updateData.dateCompleted) {
      updateData.dateCompleted = new Date();
    }

    const action = await prisma.action.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      data: action,
      message: 'Acción actualizada exitosamente',
    });
  } catch (error) {
    console.error('Error updating action:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar acción' },
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
    const existingAction = await prisma.action.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingAction) {
      return NextResponse.json(
        { success: false, error: 'Acción no encontrada' },
        { status: 404 }
      );
    }

    await prisma.action.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Acción eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error deleting action:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar acción' },
      { status: 500 }
    );
  }
}
