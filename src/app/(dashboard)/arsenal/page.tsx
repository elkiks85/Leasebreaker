'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Flame } from 'lucide-react';
import { TacticCard } from '@/components/arsenal/TacticCard';
import { TacticFilters } from '@/components/arsenal/TacticFilters';
import { DeployTacticModal } from '@/components/actions/DeployTacticModal';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { PressureTactic, ContractWithRelations, TacticCategory, ImpactLevel } from '@/types';

export default function ArsenalPage() {
  const router = useRouter();
  const [tactics, setTactics] = useState<PressureTactic[]>([]);
  const [contracts, setContracts] = useState<ContractWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<TacticCategory | 'ALL'>('ALL');
  const [impactLevel, setImpactLevel] = useState<ImpactLevel | 'ALL'>('ALL');
  const [freeOnly, setFreeOnly] = useState(false);

  // Deploy Modal
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [selectedTactic, setSelectedTactic] = useState<PressureTactic | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tacticsRes, contractsRes] = await Promise.all([
          fetch('/api/tactics'),
          fetch('/api/contracts'),
        ]);

        const tacticsData = await tacticsRes.json();
        const contractsData = await contractsRes.json();

        if (tacticsData.success) {
          setTactics(tacticsData.data);
        }
        if (contractsData.success) {
          setContracts(contractsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDeploy = (tactic: PressureTactic) => {
    if (contracts.length === 0) {
      alert('Primero debes crear un contrato para desplegar tácticas.');
      router.push('/dashboard/contracts/new');
      return;
    }
    setSelectedTactic(tactic);
    setDeployModalOpen(true);
  };

  const handleDeploySubmit = async (data: {
    contractId: string;
    tacticId: string;
    notes?: string;
    priority: string;
  }) => {
    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        router.push(`/dashboard/actions/${result.data.id}`);
      } else {
        alert(result.error || 'Error al desplegar táctica');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  // Filter tactics
  const filteredTactics = tactics.filter((tactic) => {
    if (search && !tactic.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (category !== 'ALL' && tactic.category !== category) {
      return false;
    }
    if (impactLevel !== 'ALL' && tactic.impactLevel !== impactLevel) {
      return false;
    }
    if (freeOnly && Number(tactic.estimatedCost) > 0) {
      return false;
    }
    return true;
  });

  // Group tactics by category
  const tacticsByCategory = filteredTactics.reduce((acc, tactic) => {
    const cat = tactic.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tactic);
    return acc;
  }, {} as Record<TacticCategory, PressureTactic[]>);

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
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Target className="h-8 w-8 text-orange-500" />
          Arsenal de Presión
        </h1>
        <p className="text-muted-foreground">
          Tácticas legales para aplicar presión sobre arrendadores incumplidos
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-white font-medium">{tactics.length} tácticas disponibles</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-lg">
          <span className="text-emerald-400 font-medium">
            {tactics.filter((t) => Number(t.estimatedCost) === 0).length} tácticas gratuitas
          </span>
        </div>
      </div>

      {/* Filters */}
      <TacticFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        impactLevel={impactLevel}
        onImpactLevelChange={setImpactLevel}
        freeOnly={freeOnly}
        onFreeOnlyChange={setFreeOnly}
      />

      {/* Tactics Grid */}
      {filteredTactics.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No se encontraron tácticas"
          description="Intenta ajustar los filtros de búsqueda"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTactics.map((tactic) => (
            <TacticCard key={tactic.id} tactic={tactic} onDeploy={handleDeploy} />
          ))}
        </div>
      )}

      {/* Deploy Modal */}
      <DeployTacticModal
        open={deployModalOpen}
        onOpenChange={setDeployModalOpen}
        tactic={selectedTactic}
        contracts={contracts}
        onDeploy={handleDeploySubmit}
      />
    </div>
  );
}
