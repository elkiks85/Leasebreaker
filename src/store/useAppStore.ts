import { create } from 'zustand';
import type {
  ContractWithRelations,
  ActionWithTactic,
  PressureTactic,
  MessageTemplate,
} from '@/types';

interface AppState {
  // Contracts
  contracts: ContractWithRelations[];
  selectedContract: ContractWithRelations | null;
  setContracts: (contracts: ContractWithRelations[]) => void;
  setSelectedContract: (contract: ContractWithRelations | null) => void;
  addContract: (contract: ContractWithRelations) => void;
  updateContract: (id: string, contract: Partial<ContractWithRelations>) => void;
  removeContract: (id: string) => void;

  // Actions
  actions: ActionWithTactic[];
  setActions: (actions: ActionWithTactic[]) => void;
  addAction: (action: ActionWithTactic) => void;
  updateAction: (id: string, action: Partial<ActionWithTactic>) => void;
  removeAction: (id: string) => void;

  // Tactics
  tactics: PressureTactic[];
  setTactics: (tactics: PressureTactic[]) => void;

  // Templates
  templates: MessageTemplate[];
  setTemplates: (templates: MessageTemplate[]) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export const useAppStore = create<AppState>((set) => ({
  // Contracts
  contracts: [],
  selectedContract: null,
  setContracts: (contracts) => set({ contracts }),
  setSelectedContract: (contract) => set({ selectedContract: contract }),
  addContract: (contract) =>
    set((state) => ({ contracts: [...state.contracts, contract] })),
  updateContract: (id, updates) =>
    set((state) => ({
      contracts: state.contracts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
      selectedContract:
        state.selectedContract?.id === id
          ? { ...state.selectedContract, ...updates }
          : state.selectedContract,
    })),
  removeContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
      selectedContract:
        state.selectedContract?.id === id ? null : state.selectedContract,
    })),

  // Actions
  actions: [],
  setActions: (actions) => set({ actions }),
  addAction: (action) =>
    set((state) => ({ actions: [...state.actions, action] })),
  updateAction: (id, updates) =>
    set((state) => ({
      actions: state.actions.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  removeAction: (id) =>
    set((state) => ({
      actions: state.actions.filter((a) => a.id !== id),
    })),

  // Tactics
  tactics: [],
  setTactics: (tactics) => set({ tactics }),

  // Templates
  templates: [],
  setTemplates: (templates) => set({ templates }),

  // UI State
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Notifications
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
