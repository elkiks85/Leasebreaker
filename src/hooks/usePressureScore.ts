'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ActionWithTactic, ApiResponse } from '@/types';
import { calculatePressureScore, getPressureLevel } from '@/lib/pressure-calculator';

export function usePressureScore(contractId: string) {
  const [actions, setActions] = useState<ActionWithTactic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActions = useCallback(async () => {
    if (!contractId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/actions?contractId=${contractId}`);
      const result: ApiResponse<ActionWithTactic[]> = await response.json();

      if (result.success && result.data) {
        setActions(result.data);
      } else {
        setError(result.error || 'Error al calcular presión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const score = useMemo(() => calculatePressureScore(actions), [actions]);
  const level = useMemo(() => getPressureLevel(score), [score]);

  return {
    score,
    level,
    actions,
    isLoading,
    error,
    refetch: fetchActions,
  };
}

export function useGlobalPressureScore() {
  const [actions, setActions] = useState<ActionWithTactic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllActions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/actions');
      const result: ApiResponse<ActionWithTactic[]> = await response.json();

      if (result.success && result.data) {
        setActions(result.data);
      } else {
        setError(result.error || 'Error al calcular presión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllActions();
  }, [fetchAllActions]);

  const score = useMemo(() => calculatePressureScore(actions), [actions]);
  const level = useMemo(() => getPressureLevel(score), [score]);

  return {
    score,
    level,
    totalActions: actions.length,
    isLoading,
    error,
    refetch: fetchAllActions,
  };
}
