'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PressureGauge } from '@/components/dashboard/PressureGauge';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getPressureLevel } from '@/lib/pressure-calculator';
import type { DashboardStats, RecentActivity as RecentActivityType } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivityType[]>([]);
  const [pressureScore, setPressureScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch stats
        const statsRes = await fetch('/api/dashboard/stats');
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }

        // Fetch actions for pressure score
        const actionsRes = await fetch('/api/actions');
        const actionsData = await actionsRes.json();
        if (actionsData.success && actionsData.data) {
          // Calculate simple score from action count and status
          const score = Math.min(actionsData.data.length * 15, 100);
          setPressureScore(score);

          // Generate recent activities from actions
          const recentActivities: RecentActivityType[] = actionsData.data
            .slice(0, 5)
            .map((action: any) => ({
              id: action.id,
              type: 'action' as const,
              title: action.tactic?.name || 'Acción',
              description: action.notes || 'Sin notas',
              date: action.dateCreated,
              status: action.status,
            }));
          setActivities(recentActivities);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const pressureLevel = getPressureLevel(pressureScore);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const defaultStats: DashboardStats = stats || {
    totalContracts: 0,
    activeContracts: 0,
    totalDeposit: 0,
    totalActions: 0,
    completedActions: 0,
    pendingActions: 0,
    totalPenaltyAtRisk: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido de vuelta. Aquí está el resumen de tu situación legal.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={defaultStats} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pressure Gauge */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Indicador de Presión</CardTitle>
            <CardDescription>Nivel actual de presión legal aplicada</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <PressureGauge score={pressureScore} level={pressureLevel} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
