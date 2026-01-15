import type {
  Contract,
  Action,
  PressureTactic,
  Communication,
  Document,
  MessageTemplate,
  ContractClause,
  Reminder,
  ContractStatus,
  ActionStatus,
  Priority,
  TacticCategory,
  ImpactLevel,
  CommunicationType,
  Direction,
  DocumentCategory,
  TemplateCategory,
} from '@prisma/client';

// Re-export Prisma types
export type {
  Contract,
  Action,
  PressureTactic,
  Communication,
  Document,
  MessageTemplate,
  ContractClause,
  Reminder,
  ContractStatus,
  ActionStatus,
  Priority,
  TacticCategory,
  ImpactLevel,
  CommunicationType,
  Direction,
  DocumentCategory,
  TemplateCategory,
};

// Extended types with relations
export type ContractWithRelations = Contract & {
  actions?: ActionWithTactic[];
  communications?: Communication[];
  documents?: Document[];
  clauses?: ContractClause[];
  _count?: {
    actions: number;
    communications: number;
    documents: number;
  };
};

export type ActionWithTactic = Action & {
  tactic: PressureTactic;
  documents?: Document[];
  reminders?: Reminder[];
  contract?: Contract;
};

export type CommunicationWithDocuments = Communication & {
  documents?: Document[];
  contract?: Contract;
};

// Dashboard types
export type DashboardStats = {
  totalContracts: number;
  activeContracts: number;
  totalDeposit: number;
  totalActions: number;
  completedActions: number;
  pendingActions: number;
  totalPenaltyAtRisk: number;
};

export type RecentActivity = {
  id: string;
  type: 'action' | 'communication' | 'contract';
  title: string;
  description: string;
  date: Date;
  status?: string;
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Form types
export type ContractFormData = Omit<Contract, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type ActionFormData = Omit<Action, 'id' | 'userId' | 'dateCreated' | 'updatedAt'>;
export type CommunicationFormData = Omit<Communication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

// Filter types
export type ContractFilters = {
  status?: ContractStatus;
  search?: string;
};

export type ActionFilters = {
  status?: ActionStatus;
  priority?: Priority;
  contractId?: string;
};

export type TacticFilters = {
  category?: TacticCategory;
  impactLevel?: ImpactLevel;
  maxCost?: number;
};

// Status display helpers
export const ContractStatusLabels: Record<ContractStatus, string> = {
  ACTIVE: 'Activo',
  NEGOTIATING: 'Negociando',
  TERMINATED: 'Terminado',
  LITIGATION: 'Litigio',
  RESOLVED: 'Resuelto',
};

export const ActionStatusLabels: Record<ActionStatus, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En Progreso',
  WAITING_RESPONSE: 'Esperando Respuesta',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  FAILED: 'Fallido',
};

export const PriorityLabels: Record<Priority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

export const TacticCategoryLabels: Record<TacticCategory, string> = {
  TAX: 'Fiscal',
  ADMINISTRATIVE: 'Administrativo',
  LEGAL: 'Legal',
  COMMUNICATION: 'Comunicación',
};

export const ImpactLevelLabels: Record<ImpactLevel, string> = {
  LOW: 'Bajo',
  MEDIUM: 'Medio',
  HIGH: 'Alto',
  VERY_HIGH: 'Muy Alto',
  MAXIMUM: 'Máximo',
};

export const CommunicationTypeLabels: Record<CommunicationType, string> = {
  EMAIL: 'Email',
  LETTER: 'Carta',
  CERTIFIED_MAIL: 'Correo Certificado',
  PHONE_CALL: 'Llamada',
  IN_PERSON: 'En Persona',
  LEGAL_NOTICE: 'Notificación Legal',
  COMPLAINT: 'Queja',
};

export const DirectionLabels: Record<Direction, string> = {
  OUTBOUND: 'Enviado',
  INBOUND: 'Recibido',
};

export const DocumentCategoryLabels: Record<DocumentCategory, string> = {
  CONTRACT: 'Contrato',
  PAYMENT_RECEIPT: 'Recibo de Pago',
  INVOICE: 'Factura',
  COMPLAINT_FILING: 'Queja Presentada',
  LEGAL_DOCUMENT: 'Documento Legal',
  CORRESPONDENCE: 'Correspondencia',
  EVIDENCE: 'Evidencia',
  OTHER: 'Otro',
};

// NextAuth type extensions
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
