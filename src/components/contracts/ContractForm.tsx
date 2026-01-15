'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { contractSchema, type ContractInput } from '@/lib/validators';
import type { Contract } from '@/types';

interface ContractFormProps {
  contract?: Contract;
  onSubmit: (data: ContractInput) => Promise<void>;
  isLoading?: boolean;
}

export function ContractForm({ contract, onSubmit, isLoading }: ContractFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContractInput>({
    resolver: zodResolver(contractSchema),
    defaultValues: contract
      ? {
          ...contract,
          monthlyRent: Number(contract.monthlyRent),
          depositAmount: Number(contract.depositAmount),
          maintenanceFee: contract.maintenanceFee ? Number(contract.maintenanceFee) : undefined,
          moratoryInterestRate: contract.moratoryInterestRate
            ? Number(contract.moratoryInterestRate)
            : undefined,
          leaseStartDate: new Date(contract.leaseStartDate),
          leaseEndDate: new Date(contract.leaseEndDate),
        }
      : {
          currency: 'MXN',
          penaltyMonths: 4,
          status: 'ACTIVE',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tenant Information */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Información del Arrendatario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenantName">Nombre / Razón Social *</Label>
              <Input id="tenantName" {...register('tenantName')} />
              {errors.tenantName && (
                <p className="text-sm text-red-400">{errors.tenantName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenantRfc">RFC</Label>
              <Input id="tenantRfc" {...register('tenantRfc')} placeholder="XXXX000000XXX" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenantRepresentative">Representante Legal</Label>
              <Input id="tenantRepresentative" {...register('tenantRepresentative')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenantAddress">Domicilio Fiscal</Label>
              <Input id="tenantAddress" {...register('tenantAddress')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Landlord Information */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Información del Arrendador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landlordName">Nombre / Razón Social *</Label>
              <Input id="landlordName" {...register('landlordName')} />
              {errors.landlordName && (
                <p className="text-sm text-red-400">{errors.landlordName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="landlordRfc">RFC *</Label>
              <Input id="landlordRfc" {...register('landlordRfc')} placeholder="XXXX000000XXX" />
              {errors.landlordRfc && (
                <p className="text-sm text-red-400">{errors.landlordRfc.message}</p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landlordRepresentative">Representante Legal</Label>
              <Input id="landlordRepresentative" {...register('landlordRepresentative')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landlordAddress">Domicilio *</Label>
              <Input id="landlordAddress" {...register('landlordAddress')} />
              {errors.landlordAddress && (
                <p className="text-sm text-red-400">{errors.landlordAddress.message}</p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landlordPhone">Teléfono</Label>
              <Input id="landlordPhone" {...register('landlordPhone')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landlordEmail">Email</Label>
              <Input id="landlordEmail" type="email" {...register('landlordEmail')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Información del Inmueble</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyAddress">Dirección del Inmueble *</Label>
            <Input id="propertyAddress" {...register('propertyAddress')} />
            {errors.propertyAddress && (
              <p className="text-sm text-red-400">{errors.propertyAddress.message}</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertySize">Superficie (m²)</Label>
              <Input id="propertySize" {...register('propertySize')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parkingSpots">Cajones de Estacionamiento</Label>
              <Input
                id="parkingSpots"
                type="number"
                min="0"
                {...register('parkingSpots')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Información Financiera</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Renta Mensual *</Label>
              <Input
                id="monthlyRent"
                type="number"
                step="0.01"
                min="0"
                {...register('monthlyRent')}
              />
              {errors.monthlyRent && (
                <p className="text-sm text-red-400">{errors.monthlyRent.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Depósito en Garantía *</Label>
              <Input
                id="depositAmount"
                type="number"
                step="0.01"
                min="0"
                {...register('depositAmount')}
              />
              {errors.depositAmount && (
                <p className="text-sm text-red-400">{errors.depositAmount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceFee">Cuota de Mantenimiento</Label>
              <Input
                id="maintenanceFee"
                type="number"
                step="0.01"
                min="0"
                {...register('maintenanceFee')}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="penaltyMonths">Meses de Penalidad</Label>
              <Input
                id="penaltyMonths"
                type="number"
                min="0"
                {...register('penaltyMonths')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moratoryInterestRate">Interés Moratorio (%)</Label>
              <Input
                id="moratoryInterestRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register('moratoryInterestRate')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                defaultValue={watch('currency') || 'MXN'}
                onValueChange={(value) => setValue('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Information */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Información Bancaria (del Arrendador)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Banco</Label>
              <Input id="bankName" {...register('bankName')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccount">Número de Cuenta</Label>
              <Input id="bankAccount" {...register('bankAccount')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankClabe">CLABE Interbancaria</Label>
              <Input
                id="bankClabe"
                {...register('bankClabe')}
                placeholder="18 dígitos"
                maxLength={18}
              />
              {errors.bankClabe && (
                <p className="text-sm text-red-400">{errors.bankClabe.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Vigencia del Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leaseStartDate">Fecha de Inicio *</Label>
              <Input id="leaseStartDate" type="date" {...register('leaseStartDate')} />
              {errors.leaseStartDate && (
                <p className="text-sm text-red-400">{errors.leaseStartDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="leaseEndDate">Fecha de Fin *</Label>
              <Input id="leaseEndDate" type="date" {...register('leaseEndDate')} />
              {errors.leaseEndDate && (
                <p className="text-sm text-red-400">{errors.leaseEndDate.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Notas Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Cualquier información adicional relevante..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
          {isLoading ? 'Guardando...' : contract ? 'Actualizar Contrato' : 'Crear Contrato'}
        </Button>
      </div>
    </form>
  );
}
