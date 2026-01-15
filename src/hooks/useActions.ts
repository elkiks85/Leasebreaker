'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { ActionWithTactic, ActionFilters, ApiResponse } from '@/types';

export function useActions(filters?: ActionFilters) {
  const { actions, setActions, setIsLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchActions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.contractId) params.append('contractId', filters.contractId);

      const response = await fetch(`/api/actions?${params.toString()}`);
      const result: ApiResponse<ActionWithTactic[]> = await response.json();

      if (result.success && result.data) {
        setActions(result.data);
      } else {
        setError(result.error || 'Error al cargar acciones');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [filters?.status, filters?.priority, filters?.contractId, setActions, setIsLoading]);

  const refetch = useCallback(() => {
    setIsRefetching(true);
    fetchActions();
  }, [fetchActions]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  return {
    actions,
    isLoading: useAppStore.getState().isLoading,
    isRefetching,
    error,
    refetch,
  };
}

export function useAction(id: string) {
  const [action, setAction] = useState<ActionWithTactic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAction = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/actions/${id}`);
      const result: ApiResponse<ActionWithTactic> = await response.json();

      if (result.success && result.data) {
        setAction(result.data);
      } else {
        setError(result.error || 'Error al cargar acción');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAction();
  }, [fetchAction]);

  return {
    action,
    isLoading,
    error,
    refetch: fetchAction,
  };
}

export function useCreateAction() {
  const { addAction, setIsLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const createAction = async (data: {
    contractId: string;
    tacticId: string;
    notes?: string;
    priority?: string;
    dateDue?: Date;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<ActionWithTactic> = await response.json();

      if (result.success && result.data) {
        addAction(result.data);
        return result.data;
      } else {
        setError(result.error || 'Error al crear acción');
        return null;
      }
    } catch (err) {
      setError('Error de conexión');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createAction, isLoading: useAppStore.getState().isLoading, error };
}

export function useUpdateAction() {
  const { updateAction: updateActionStore, setIsLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const updateAction = async (id: string, data: Partial<ActionWithTactic>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/actions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result: ApiResponse<ActionWithTactic> = await response.json();

      if (result.success && result.data) {
        updateActionStore(id, result.data);
        return result.data;
      } else {
        setError(result.error || 'Error al actualizar acción');
        return null;
      }
    } catch (err) {
      setError('Error de conexión');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateAction, isLoading: useAppStore.getState().isLoading, error };
}

export function useDeleteAction() {
  const { removeAction, setIsLoading } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const deleteAction = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/actions/${id}`, {
        method: 'DELETE',
      });
      const result: ApiResponse<void> = await response.json();

      if (result.success) {
        removeAction(id);
        return true;
      } else {
        setError(result.error || 'Error al eliminar acción');
        return false;
      }
    } catch (err) {
      setError('Error de conexión');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteAction, isLoading: useAppStore.getState().isLoading, error };
}
