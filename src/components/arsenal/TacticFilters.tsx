'use client';

import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { TacticCategory, ImpactLevel } from '@/types';

interface TacticFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: TacticCategory | 'ALL';
  onCategoryChange: (value: TacticCategory | 'ALL') => void;
  impactLevel: ImpactLevel | 'ALL';
  onImpactLevelChange: (value: ImpactLevel | 'ALL') => void;
  freeOnly: boolean;
  onFreeOnlyChange: (value: boolean) => void;
}

export function TacticFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  impactLevel,
  onImpactLevelChange,
  freeOnly,
  onFreeOnlyChange,
}: TacticFiltersProps) {
  const hasFilters = category !== 'ALL' || impactLevel !== 'ALL' || freeOnly || search;

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('ALL');
    onImpactLevelChange('ALL');
    onFreeOnlyChange(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tácticas..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={category} onValueChange={(value) => onCategoryChange(value as TacticCategory | 'ALL')}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las categorías</SelectItem>
            <SelectItem value="TAX">Fiscal</SelectItem>
            <SelectItem value="ADMINISTRATIVE">Administrativo</SelectItem>
            <SelectItem value="LEGAL">Legal</SelectItem>
            <SelectItem value="COMMUNICATION">Comunicación</SelectItem>
          </SelectContent>
        </Select>

        {/* Impact Level Filter */}
        <Select value={impactLevel} onValueChange={(value) => onImpactLevelChange(value as ImpactLevel | 'ALL')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Impacto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los niveles</SelectItem>
            <SelectItem value="MAXIMUM">Máximo</SelectItem>
            <SelectItem value="VERY_HIGH">Muy Alto</SelectItem>
            <SelectItem value="HIGH">Alto</SelectItem>
            <SelectItem value="MEDIUM">Medio</SelectItem>
            <SelectItem value="LOW">Bajo</SelectItem>
          </SelectContent>
        </Select>

        {/* Free Only Toggle */}
        <Button
          variant={freeOnly ? 'default' : 'outline'}
          onClick={() => onFreeOnlyChange(!freeOnly)}
          className={freeOnly ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
        >
          Solo gratis
        </Button>

        {/* Clear Filters */}
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {category !== 'ALL' && (
            <Badge variant="secondary" className="gap-1">
              Categoría: {category}
              <button onClick={() => onCategoryChange('ALL')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {impactLevel !== 'ALL' && (
            <Badge variant="secondary" className="gap-1">
              Impacto: {impactLevel}
              <button onClick={() => onImpactLevelChange('ALL')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {freeOnly && (
            <Badge variant="secondary" className="gap-1">
              Solo gratis
              <button onClick={() => onFreeOnlyChange(false)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
