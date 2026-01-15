'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { ContractWithRelations, ContractFilters, ApiResponse } from '@/types';

export function useContracts(filters?: ContractFilters) {
  const { contracts, setContracts, setIsLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchContracts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/contracts?${params.toString()}`);
      const result: ApiResponse<ContractWithRelations[]> = await response.json();

      if (result.success && result.data) {
        setContracts(result.data);
      } else {
        setError(result.error || 'Error al cargar contratos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [filters?.status, filters?.search, setContracts, setIsLoading]);

  const refetch = useCallback(() => {
    setIsRefetching(true);
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    isLoading: useAppStore.getState().isLoading,
    isRefetching,
    error,
    refetch,
  };
}

export function useContract(id: string) {
  const { selectedContract, setSelectedContract, setIsLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const fetchContract = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/contracts/${id}`);
      const result: ApiResponse<ContractWithRelations> = await response.json();

      if (result.success && result.data) {
        setSelectedContract(result.data);
      } else {
        setError(result.error || 'Error al cargar contrato');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [id, setSelectedContract, setIsLoading]);

  useEffect(() => {
    fetchContract();
    return () => setSelectedContract(null);
  }, [fetchContract, setSelectedContract]);

  return {
    contract: selectedContract,
    isLoading: useAppStore.getState().isLoading,
    error,
    refetch: fetchContract,
  };
}

export function useCreateContract() {
  const { addContract, setIsLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const createContract = async (data: Partial<ContractWithRelations>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<ContractWithRelations> = await response.json();

      if (result.success && result.data) {
        addContract(result.data);
        return result.data;
      } else {
        setError(result.error || 'Error al crear contrato');
        return null;
      }
    } catch (err) {
      setError('Error de conexión');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createContract, isLoading: useAppStore.getState().isLoading, error };
}

export function useUpdateContract() {
  const { updateContract: updateContractStore, setIsLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const updateContract = async (id: string, data: Partial<ContractWithRelations>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/contracts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<ContractWithRelations> = await response.json();

      if (result.success && result.data) {
        updateContractStore(id, result.data);
        return result.data;
      } else {
        setError(result.error || 'Error al actualizar contrato');
        return null;
      }
    } catch (err) {
      setError('Error de conexión');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateContract, isLoading: useAppStore.getState().isLoading, error };
}

export function useDeleteContract() {
  const { removeContract, setIsLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const deleteContract = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/contracts/${id}`, {
        method: 'DELETE',
      });
      const result: ApiResponse<void> = await response.json();

      if (result.success) {
        removeContract(id);
        return true;
      } else {
        setError(result.error || 'Error al eliminar contrato');
        return false;
      }
    } catch (err) {
      setError('Error de conexión');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteContract, isLoading: useAppStore.getState().isLoading, error };
}
