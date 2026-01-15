'use client';

import { useState } from 'react';
import { Clock, DollarSign, ExternalLink, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImpactBadge } from '@/components/shared/ImpactBadge';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { PressureTactic, TacticCategory } from '@/types';

interface TacticCardProps {
  tactic: PressureTactic;
  onDeploy?: (tactic: PressureTactic) => void;
}

const categoryColors: Record<TacticCategory, string> = {
  TAX: 'bg-red-500/20 text-red-400 border-red-500/30',
  ADMINISTRATIVE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  LEGAL: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  COMMUNICATION: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const categoryLabels: Record<TacticCategory, string> = {
  TAX: 'Fiscal',
  ADMINISTRATIVE: 'Administrativo',
  LEGAL: 'Legal',
  COMMUNICATION: 'Comunicación',
};

export function TacticCard({ tactic, onDeploy }: TacticCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFree = Number(tactic.estimatedCost) === 0;

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg text-white">{tactic.name}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={categoryColors[tactic.category]} variant="outline">
                {categoryLabels[tactic.category]}
              </Badge>
              <ImpactBadge level={tactic.impactLevel} />
              {isFree && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30" variant="outline">
                  Gratis
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{tactic.description}</p>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className={isFree ? 'text-emerald-400' : 'text-white'}>
              {isFree ? 'Gratis' : formatCurrency(Number(tactic.estimatedCost))}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-white">{tactic.timeToFile}</span>
          </div>
        </div>

        {/* Expandable Details */}
        <Button
          variant="ghost"
          className="w-full justify-between text-muted-foreground hover:text-white"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Ver detalles</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {isExpanded && (
          <div className="space-y-4 pt-2 border-t border-slate-800">
            {/* Agency Info */}
            <div>
              <p className="text-sm font-medium text-white mb-2">Organismo</p>
              <div className="space-y-1">
                <p className="text-sm text-white">{tactic.agencyName}</p>
                {tactic.agencyUrl && (
                  <a
                    href={tactic.agencyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-400 hover:underline flex items-center gap-1"
                  >
                    Sitio web <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {tactic.agencyPhone && (
                  <p className="text-sm text-muted-foreground">Tel: {tactic.agencyPhone}</p>
                )}
                {tactic.agencyEmail && (
                  <p className="text-sm text-muted-foreground">Email: {tactic.agencyEmail}</p>
                )}
              </div>
            </div>

            {/* Potential Fine */}
            {tactic.potentialFine && (
              <div>
                <p className="text-sm font-medium text-white mb-1">Consecuencia Potencial</p>
                <p className="text-sm text-orange-400">{tactic.potentialFine}</p>
              </div>
            )}

            {/* Required Documents */}
            {tactic.requiredDocs && tactic.requiredDocs.length > 0 && (
              <div>
                <p className="text-sm font-medium text-white mb-2">Documentos Requeridos</p>
                <ul className="space-y-1">
                  {tactic.requiredDocs.map((doc, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legal Basis */}
            {tactic.legalBasis && (
              <div>
                <p className="text-sm font-medium text-white mb-1">Fundamento Legal</p>
                <p className="text-sm text-muted-foreground">{tactic.legalBasis}</p>
              </div>
            )}
          </div>
        )}

        {/* Deploy Button */}
        {onDeploy && (
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={() => onDeploy(tactic)}
          >
            Desplegar Táctica
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
