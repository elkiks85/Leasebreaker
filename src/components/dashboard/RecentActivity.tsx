import { Zap, MessageSquare, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'action' | 'communication' | 'contract';
  title: string;
  description: string;
  date: Date | string;
  status?: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'action':
        return Zap;
      case 'communication':
        return MessageSquare;
      case 'contract':
        return FileText;
      default:
        return Clock;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'action':
        return 'bg-orange-500/20 text-orange-500';
      case 'communication':
        return 'bg-blue-500/20 text-blue-500';
      case 'contract':
        return 'bg-emerald-500/20 text-emerald-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (activities.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Actividad Reciente</CardTitle>
          <CardDescription>Tus últimas acciones y eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No hay actividad reciente</p>
            <p className="text-sm text-muted-foreground">
              Comienza creando un contrato o desplegando una táctica
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Actividad Reciente</CardTitle>
        <CardDescription>Tus últimas acciones y eventos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    getIconColor(activity.type)
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeTime(activity.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
