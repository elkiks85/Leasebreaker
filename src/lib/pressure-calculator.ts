import type { Action, PressureTactic, ImpactLevel, ActionStatus } from '@prisma/client';

type ActionWithTactic = Action & {
  tactic: PressureTactic;
};

const impactPoints: Record<ImpactLevel, number> = {
  MAXIMUM: 30,
  VERY_HIGH: 20,
  HIGH: 15,
  MEDIUM: 10,
  LOW: 5,
};

const statusMultiplier: Record<ActionStatus, number> = {
  COMPLETED: 1.0,
  IN_PROGRESS: 0.7,
  WAITING_RESPONSE: 0.8,
  PENDING: 0.5,
  CANCELLED: 0,
  FAILED: 0.2,
};

export function calculatePressureScore(actions: ActionWithTactic[]): number {
  if (actions.length === 0) return 0;

  let score = 0;

  for (const action of actions) {
    const basePoints = impactPoints[action.tactic.impactLevel];
    const multiplier = statusMultiplier[action.status];
    score += basePoints * multiplier;
  }

  // Cap at 100
  return Math.min(Math.round(score), 100);
}

export function getPressureLevel(score: number): {
  level: string;
  color: string;
  description: string;
} {
  if (score >= 80) {
    return {
      level: 'MÁXIMO',
      color: 'red',
      description: 'Presión legal intensa. El arrendador enfrenta múltiples procedimientos.',
    };
  } else if (score >= 60) {
    return {
      level: 'ALTO',
      color: 'orange',
      description: 'Presión significativa. Varias acciones legales en curso.',
    };
  } else if (score >= 40) {
    return {
      level: 'MODERADO',
      color: 'yellow',
      description: 'Presión moderada. Algunas acciones iniciadas.',
    };
  } else if (score >= 20) {
    return {
      level: 'BAJO',
      color: 'blue',
      description: 'Presión inicial. Comenzando a aplicar tácticas.',
    };
  } else {
    return {
      level: 'MÍNIMO',
      color: 'gray',
      description: 'Sin presión significativa. Considera desplegar tácticas.',
    };
  }
}

export function getRecommendedTactics(
  currentActions: ActionWithTactic[],
  allTactics: PressureTactic[]
): PressureTactic[] {
  const deployedTacticIds = new Set(currentActions.map((a) => a.tacticId));

  // Filter out already deployed tactics and sort by impact
  const available = allTactics
    .filter((t) => !deployedTacticIds.has(t.id) && t.isActive)
    .sort((a, b) => {
      const impactOrder = ['MAXIMUM', 'VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW'];
      return impactOrder.indexOf(a.impactLevel) - impactOrder.indexOf(b.impactLevel);
    });

  // Recommend free tactics first, then paid ones
  const freeTactics = available.filter((t) => Number(t.estimatedCost) === 0);
  const paidTactics = available.filter((t) => Number(t.estimatedCost) > 0);

  return [...freeTactics.slice(0, 3), ...paidTactics.slice(0, 2)];
}

export function calculatePotentialScore(
  currentActions: ActionWithTactic[],
  newTactic: PressureTactic
): number {
  const currentScore = calculatePressureScore(currentActions);
  const potentialPoints = impactPoints[newTactic.impactLevel] * statusMultiplier.IN_PROGRESS;

  return Math.min(Math.round(currentScore + potentialPoints), 100);
}
