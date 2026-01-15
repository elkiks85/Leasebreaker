'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImpactBadge } from '@/components/shared/ImpactBadge';
import type { PressureTactic, ContractWithRelations } from '@/types';

const deploySchema = z.object({
  contractId: z.string().min(1, 'Selecciona un contrato'),
  notes: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

type DeployFormData = z.infer<typeof deploySchema>;

interface DeployTacticModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tactic: PressureTactic | null;
  contracts: ContractWithRelations[];
  onDeploy: (data: DeployFormData & { tacticId: string }) => Promise<void>;
}

export function DeployTacticModal({
  open,
  onOpenChange,
  tactic,
  contracts,
  onDeploy,
}: DeployTacticModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DeployFormData>({
    resolver: zodResolver(deploySchema),
    defaultValues: {
      priority: 'MEDIUM',
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: DeployFormData) => {
    if (!tactic) return;

    setIsLoading(true);
    try {
      await onDeploy({
        ...data,
        tacticId: tactic.id,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error deploying tactic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tactic) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Desplegar: {tactic.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <ImpactBadge level={tactic.impactLevel} />
            <span>{tactic.agencyName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Contract Selection */}
          <div className="space-y-2">
            <Label>Contrato</Label>
            <Select onValueChange={(value) => setValue('contractId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar contrato" />
              </SelectTrigger>
              <SelectContent>
                {contracts.map((contract) => (
                  <SelectItem key={contract.id} value={contract.id}>
                    {contract.landlordName} - {contract.propertyAddress}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contractId && (
              <p className="text-sm text-red-400">{errors.contractId.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Prioridad</Label>
            <Select
              defaultValue="MEDIUM"
              onValueChange={(value) => setValue('priority', value as DeployFormData['priority'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Baja</SelectItem>
                <SelectItem value="MEDIUM">Media</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
                <SelectItem value="URGENT">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notas (opcional)</Label>
            <Textarea
              {...register('notes')}
              placeholder="Notas adicionales sobre esta acción..."
              className="min-h-[100px]"
            />
          </div>

          {/* Required Documents Reminder */}
          {tactic.requiredDocs && tactic.requiredDocs.length > 0 && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm font-medium text-yellow-400 mb-2">Documentos requeridos:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {tactic.requiredDocs.map((doc, i) => (
                  <li key={i}>• {doc}</li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? 'Desplegando...' : 'Desplegar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
