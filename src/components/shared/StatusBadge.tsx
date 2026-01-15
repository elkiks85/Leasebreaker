import { Badge } from '@/components/ui/badge';
import type { ActionStatus, ContractStatus, Priority } from '@/types';

const statusColors: Record<ActionStatus | ContractStatus, string> = {
  // Action statuses
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  WAITING_RESPONSE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
  // Contract statuses
  ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  NEGOTIATING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  TERMINATED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  LITIGATION: 'bg-red-500/20 text-red-400 border-red-500/30',
  RESOLVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const statusLabels: Record<ActionStatus | ContractStatus, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En Progreso',
  WAITING_RESPONSE: 'Esperando Respuesta',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  FAILED: 'Fallido',
  ACTIVE: 'Activo',
  NEGOTIATING: 'Negociando',
  TERMINATED: 'Terminado',
  LITIGATION: 'Litigio',
  RESOLVED: 'Resuelto',
};

interface StatusBadgeProps {
  status: ActionStatus | ContractStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={statusColors[status]} variant="outline">
      {statusLabels[status]}
    </Badge>
  );
}

const priorityColors: Record<Priority, string> = {
  LOW: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  MEDIUM: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  URGENT: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const priorityLabels: Record<Priority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge className={priorityColors[priority]} variant="outline">
      {priorityLabels[priority]}
    </Badge>
  );
}
