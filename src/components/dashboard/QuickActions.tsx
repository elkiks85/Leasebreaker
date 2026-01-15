'use client';

import Link from 'next/link';
import { Plus, Target, FileText, MessageSquare, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  const actions = [
    {
      title: 'Nuevo Contrato',
      description: 'Registrar un nuevo contrato de arrendamiento',
      icon: Plus,
      href: '/dashboard/contracts/new',
      color: 'text-emerald-500',
    },
    {
      title: 'Desplegar Táctica',
      description: 'Iniciar una nueva acción de presión',
      icon: Target,
      href: '/dashboard/arsenal',
      color: 'text-orange-500',
    },
    {
      title: 'Ver Templates',
      description: 'Usar una plantilla de comunicación',
      icon: FileText,
      href: '/dashboard/templates',
      color: 'text-blue-500',
    },
    {
      title: 'Subir Documento',
      description: 'Agregar evidencia o documentación',
      icon: Upload,
      href: '/dashboard/documents',
      color: 'text-purple-500',
    },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Acciones Rápidas</CardTitle>
        <CardDescription>Atajos para tareas comunes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-auto py-3 hover:bg-slate-800"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 ${action.color}`}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
