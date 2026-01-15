'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge, PriorityBadge } from '@/components/shared/StatusBadge';
import { ImpactBadge } from '@/components/shared/ImpactBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatRelativeTime, formatDate } from '@/lib/formatters';
import type { ActionWithTactic, ActionStatus, Priority } from '@/types';

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionWithTactic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ActionStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');

  useEffect(() => {
    async function fetchActions() {
      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'ALL') params.append('status', statusFilter);
        if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);

        const response = await fetch(`/api/actions?${params.toString()}`);
        const data = await response.json();
        if (data.success) {
          setActions(data.data);
        }
      } catch (error) {
        console.error('Error fetching actions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActions();
  }, [statusFilter, priorityFilter]);

  // Group actions by status
  const pendingActions = actions.filter((a) => a.status === 'PENDING');
  const inProgressActions = actions.filter((a) => a.status === 'IN_PROGRESS');
  const waitingActions = actions.filter((a) => a.status === 'WAITING_RESPONSE');
  const completedActions = actions.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'CANCELLED' || a.status === 'FAILED'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Zap className="h-8 w-8 text-orange-500" />
            Acciones
          </h1>
          <p className="text-muted-foreground">
            Rastrea el progreso de tus acciones legales
          </p>
        </div>
        <Link href="/dashboard/arsenal">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Zap className="h-4 w-4 mr-2" />
            Nueva Acción
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800 gradient-orange">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-white">{pendingActions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 gradient-blue">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold text-white">{inProgressActions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Esperando</p>
                <p className="text-2xl font-bold text-white">{waitingActions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 gradient-emerald">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold text-white">{completedActions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as ActionStatus | 'ALL')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
            <SelectItem value="WAITING_RESPONSE">Esperando</SelectItem>
            <SelectItem value="COMPLETED">Completado</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
            <SelectItem value="FAILED">Fallido</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(value) => setPriorityFilter(value as Priority | 'ALL')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las prioridades</SelectItem>
            <SelectItem value="LOW">Baja</SelectItem>
            <SelectItem value="MEDIUM">Media</SelectItem>
            <SelectItem value="HIGH">Alta</SelectItem>
            <SelectItem value="URGENT">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions List */}
      {actions.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No hay acciones"
          description="Despliega tu primera táctica desde el Arsenal"
          actionLabel="Ir al Arsenal"
          onAction={() => (window.location.href = '/dashboard/arsenal')}
        />
      ) : (
        <div className="space-y-4">
          {actions.map((action) => (
            <Link key={action.id} href={`/dashboard/actions/${action.id}`}>
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {action.tactic?.name || 'Táctica'}
                        </h3>
                        <ImpactBadge level={action.tactic?.impactLevel || 'MEDIUM'} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {action.contract?.landlordName} - {action.contract?.propertyAddress}
                      </p>
                      {action.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {action.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={action.status} />
                      <PriorityBadge priority={action.priority} />
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(action.dateCreated)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
