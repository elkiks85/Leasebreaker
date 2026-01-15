import Link from 'next/link';
import { Building2, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate, getDaysRemaining } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { ContractWithRelations } from '@/types';

interface ContractCardProps {
  contract: ContractWithRelations;
}

export function ContractCard({ contract }: ContractCardProps) {
  const daysRemaining = getDaysRemaining(contract.leaseEndDate);
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 30;
  const isExpired = daysRemaining <= 0;

  return (
    <Link href={`/dashboard/contracts/${contract.id}`}>
      <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg text-white">{contract.landlordName}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Building2 className="h-3 w-3" />
              {contract.propertyAddress}
            </p>
          </div>
          <StatusBadge status={contract.status} />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-muted-foreground">Depósito</p>
              <p className="text-lg font-semibold text-emerald-400">
                {formatCurrency(Number(contract.depositAmount), contract.currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Renta Mensual</p>
              <p className="text-lg font-semibold text-white">
                {formatCurrency(Number(contract.monthlyRent), contract.currency)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span
                className={cn(
                  'text-sm',
                  isExpired
                    ? 'text-red-400'
                    : isExpiringSoon
                    ? 'text-yellow-400'
                    : 'text-muted-foreground'
                )}
              >
                {isExpired
                  ? 'Contrato vencido'
                  : isExpiringSoon
                  ? `Vence en ${daysRemaining} días`
                  : `Vence ${formatDate(contract.leaseEndDate)}`}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">{contract._count?.actions || 0} acciones</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
