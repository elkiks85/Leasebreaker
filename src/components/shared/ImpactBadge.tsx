import { Badge } from '@/components/ui/badge';
import { Flame, Zap, AlertTriangle, TrendingUp, Circle } from 'lucide-react';
import type { ImpactLevel } from '@/types';

const impactConfig: Record<
  ImpactLevel,
  { color: string; label: string; icon: React.ElementType }
> = {
  MAXIMUM: {
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    label: 'Máximo',
    icon: Flame,
  },
  VERY_HIGH: {
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    label: 'Muy Alto',
    icon: Zap,
  },
  HIGH: {
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    label: 'Alto',
    icon: AlertTriangle,
  },
  MEDIUM: {
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    label: 'Medio',
    icon: TrendingUp,
  },
  LOW: {
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    label: 'Bajo',
    icon: Circle,
  },
};

interface ImpactBadgeProps {
  level: ImpactLevel;
  showIcon?: boolean;
}

export function ImpactBadge({ level, showIcon = true }: ImpactBadgeProps) {
  const config = impactConfig[level];
  const Icon = config.icon;

  return (
    <Badge className={config.color} variant="outline">
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
