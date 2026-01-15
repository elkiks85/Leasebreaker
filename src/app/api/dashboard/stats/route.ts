import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get contracts
    const contracts = await prisma.contract.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        depositAmount: true,
        monthlyRent: true,
        penaltyMonths: true,
      },
    });

    // Get actions
    const actions = await prisma.action.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
      },
    });

    // Calculate stats
    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(
      (c) => c.status === 'ACTIVE' || c.status === 'NEGOTIATING'
    ).length;

    const totalDeposit = contracts.reduce(
      (sum, c) => sum + Number(c.depositAmount),
      0
    );

    const totalPenaltyAtRisk = contracts
      .filter((c) => c.status === 'ACTIVE' || c.status === 'NEGOTIATING')
      .reduce((sum, c) => sum + Number(c.monthlyRent) * c.penaltyMonths, 0);

    const totalActions = actions.length;
    const completedActions = actions.filter(
      (a) => a.status === 'COMPLETED'
    ).length;
    const pendingActions = actions.filter(
      (a) =>
        a.status === 'PENDING' ||
        a.status === 'IN_PROGRESS' ||
        a.status === 'WAITING_RESPONSE'
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        totalContracts,
        activeContracts,
        totalDeposit,
        totalActions,
        completedActions,
        pendingActions,
        totalPenaltyAtRisk,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
