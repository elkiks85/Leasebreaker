'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { PressureTactic, TacticFilters, ApiResponse } from '@/types';

export function useTactics(filters?: TacticFilters) {
  const { tactics, setTactics, setIsLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const fetchTactics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.impactLevel) params.append('impactLevel', filters.impactLevel);
      if (filters?.maxCost !== undefined) params.append('maxCost', filters.maxCost.toString());

      const response = await fetch(`/api/tactics?${params.toString()}`);
      const result: ApiResponse<PressureTactic[]> = await response.json();

      if (result.success && result.data) {
        setTactics(result.data);
      } else {
        setError(result.error || 'Error al cargar tácticas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [filters?.category, filters?.impactLevel, filters?.maxCost, setTactics, setIsLoading]);

  useEffect(() => {
    fetchTactics();
  }, [fetchTactics]);

  return {
    tactics,
    isLoading: useAppStore.getState().isLoading,
    error,
    refetch: fetchTactics,
  };
}

export function useTactic(slug: string) {
  const [tactic, setTactic] = useState<PressureTactic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTactic = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tactics/${slug}`);
      const result: ApiResponse<PressureTactic> = await response.json();

      if (result.success && result.data) {
        setTactic(result.data);
      } else {
        setError(result.error || 'Error al cargar táctica');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchTactic();
  }, [fetchTactic]);

  return {
    tactic,
    isLoading,
    error,
    refetch: fetchTactic,
  };
}
