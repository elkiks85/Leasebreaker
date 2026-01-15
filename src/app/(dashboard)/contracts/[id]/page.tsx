'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  User,
  DollarSign,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  Target,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CopyButton } from '@/components/shared/CopyButton';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatCurrency, formatDate, formatRfc, getDaysRemaining } from '@/lib/formatters';
import type { ContractWithRelations } from '@/types';

export default function ContractDetailPage() {
  const { id } = useParams();
  const [contract, setContract] = useState<ContractWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContract() {
      try {
        const response = await fetch(`/api/contracts/${id}`);
        const data = await response.json();
        if (data.success) {
          setContract(data.data);
        }
      } catch (error) {
        console.error('Error fetching contract:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContract();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white">Contrato no encontrado</h2>
        <Link href="/dashboard/contracts">
          <Button className="mt-4">Volver a Contratos</Button>
        </Link>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(contract.leaseEndDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/contracts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{contract.landlordName}</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {contract.propertyAddress}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={contract.status} />
          <Link href={`/dashboard/contracts/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Link href="/dashboard/arsenal">
            <Button className="bg-orange-500 hover:bg-orange-600" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Desplegar Táctica
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800 gradient-emerald">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-sm text-muted-foreground">Depósito</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(Number(contract.depositAmount), contract.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Renta Mensual</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(Number(contract.monthlyRent), contract.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800 gradient-red">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Penalidad Potencial</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(
                    Number(contract.monthlyRent) * contract.penaltyMonths,
                    contract.currency
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Días Restantes</p>
                <p className="text-2xl font-bold text-white">
                  {daysRemaining > 0 ? daysRemaining : 'Vencido'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="landlord">Arrendador</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
          <TabsTrigger value="actions">Acciones ({contract._count?.actions || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Arrendatario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="text-white">{contract.tenantName}</p>
                </div>
                {contract.tenantRfc && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">RFC</p>
                      <p className="text-white font-mono">{formatRfc(contract.tenantRfc)}</p>
                    </div>
                    <CopyButton text={contract.tenantRfc} />
                  </div>
                )}
                {contract.tenantRepresentative && (
                  <div>
                    <p className="text-sm text-muted-foreground">Representante Legal</p>
                    <p className="text-white">{contract.tenantRepresentative}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Inmueble
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Dirección</p>
                    <p className="text-white">{contract.propertyAddress}</p>
                  </div>
                  <CopyButton text={contract.propertyAddress} />
                </div>
                {contract.propertySize && (
                  <div>
                    <p className="text-sm text-muted-foreground">Superficie</p>
                    <p className="text-white">{contract.propertySize} m²</p>
                  </div>
                )}
                {contract.parkingSpots && (
                  <div>
                    <p className="text-sm text-muted-foreground">Estacionamientos</p>
                    <p className="text-white">{contract.parkingSpots}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Vigencia
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                <p className="text-white">{formatDate(contract.leaseStartDate, 'd MMMM yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Fin</p>
                <p className="text-white">{formatDate(contract.leaseEndDate, 'd MMMM yyyy')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="landlord" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Información del Arrendador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre / Razón Social</p>
                  <p className="text-white text-lg">{contract.landlordName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">RFC</p>
                    <p className="text-white font-mono text-lg">
                      {formatRfc(contract.landlordRfc)}
                    </p>
                  </div>
                  <CopyButton text={contract.landlordRfc} label="Copiar RFC" />
                </div>
              </div>
              {contract.landlordRepresentative && (
                <div>
                  <p className="text-sm text-muted-foreground">Representante Legal</p>
                  <p className="text-white">{contract.landlordRepresentative}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Domicilio</p>
                    <p className="text-white">{contract.landlordAddress}</p>
                  </div>
                </div>
                <CopyButton text={contract.landlordAddress} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {contract.landlordPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="text-white">{contract.landlordPhone}</p>
                    </div>
                  </div>
                )}
                {contract.landlordEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-white">{contract.landlordEmail}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Información Financiera</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Renta Mensual</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(Number(contract.monthlyRent), contract.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Depósito en Garantía</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(Number(contract.depositAmount), contract.currency)}
                  </p>
                </div>
                {contract.maintenanceFee && (
                  <div>
                    <p className="text-sm text-muted-foreground">Mantenimiento</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(Number(contract.maintenanceFee), contract.currency)}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Meses de Penalidad</p>
                  <p className="text-white">{contract.penaltyMonths} meses</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Penalidad Total</p>
                  <p className="text-xl font-bold text-red-400">
                    {formatCurrency(
                      Number(contract.monthlyRent) * contract.penaltyMonths,
                      contract.currency
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {(contract.bankName || contract.bankClabe) && (
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Datos Bancarios del Arrendador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {contract.bankName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Banco</p>
                      <p className="text-white">{contract.bankName}</p>
                    </div>
                  )}
                  {contract.bankAccount && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Cuenta</p>
                        <p className="text-white font-mono">{contract.bankAccount}</p>
                      </div>
                      <CopyButton text={contract.bankAccount} />
                    </div>
                  )}
                  {contract.bankClabe && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">CLABE</p>
                        <p className="text-white font-mono">{contract.bankClabe}</p>
                      </div>
                      <CopyButton text={contract.bankClabe} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {contract._count?.actions === 0
                    ? 'No hay acciones registradas'
                    : `${contract._count?.actions} acciones registradas`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Despliega tácticas de presión desde el Arsenal
                </p>
                <Link href="/dashboard/arsenal">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Target className="h-4 w-4 mr-2" />
                    Ir al Arsenal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
