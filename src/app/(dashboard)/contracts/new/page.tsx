'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ContractForm } from '@/components/contracts/ContractForm';
import type { ContractInput } from '@/lib/validators';

export default function NewContractPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ContractInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        router.push(`/dashboard/contracts/${result.data.id}`);
      } else {
        alert(result.error || 'Error al crear contrato');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contracts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Nuevo Contrato</h1>
          <p className="text-muted-foreground">
            Registra los datos de tu contrato de arrendamiento
          </p>
        </div>
      </div>

      {/* Form */}
      <ContractForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
