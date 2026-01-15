import { FileText, Zap, CheckCircle, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats: {
    totalContracts: number;
    activeContracts: number;
    totalDeposit: number;
    totalActions: number;
    completedActions: number;
    pendingActions: number;
    totalPenaltyAtRisk: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Depósito Total',
      value: formatCurrency(stats.totalDeposit),
      description: 'A recuperar',
      icon: DollarSign,
      gradient: 'gradient-emerald',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Contratos Activos',
      value: stats.activeContracts.toString(),
      description: `de ${stats.totalContracts} totales`,
      icon: FileText,
      gradient: 'gradient-blue',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Acciones Completadas',
      value: stats.completedActions.toString(),
      description: `de ${stats.totalActions} totales`,
      icon: CheckCircle,
      gradient: 'gradient-emerald',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Acciones Pendientes',
      value: stats.pendingActions.toString(),
      description: 'Requieren atención',
      icon: Clock,
      gradient: 'gradient-orange',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Penalidad en Riesgo',
      value: formatCurrency(stats.totalPenaltyAtRisk),
      description: 'Si no actúas',
      icon: AlertTriangle,
      gradient: 'gradient-red',
      iconColor: 'text-red-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={cn('bg-slate-900 border-slate-800', card.gradient)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={cn('h-4 w-4', card.iconColor)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
