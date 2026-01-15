import { z } from 'zod';

// User schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Contract schemas
export const contractSchema = z.object({
  // Tenant Info
  tenantName: z.string().min(1, 'Nombre del arrendatario requerido'),
  tenantRfc: z.string().optional(),
  tenantRepresentative: z.string().optional(),
  tenantAddress: z.string().optional(),

  // Landlord Info
  landlordName: z.string().min(1, 'Nombre del arrendador requerido'),
  landlordRfc: z.string().min(12, 'RFC debe tener 12-13 caracteres').max(13),
  landlordRepresentative: z.string().optional(),
  landlordAddress: z.string().min(1, 'Dirección del arrendador requerida'),
  landlordPhone: z.string().optional(),
  landlordEmail: z.string().email('Email inválido').optional().or(z.literal('')),

  // Property Info
  propertyAddress: z.string().min(1, 'Dirección del inmueble requerida'),
  propertySize: z.string().optional(),
  parkingSpots: z.coerce.number().int().min(0).optional(),

  // Financial Info
  monthlyRent: z.coerce.number().positive('La renta debe ser mayor a 0'),
  maintenanceFee: z.coerce.number().min(0).optional(),
  depositAmount: z.coerce.number().positive('El depósito debe ser mayor a 0'),
  penaltyMonths: z.coerce.number().int().min(0).default(4),
  moratoryInterestRate: z.coerce.number().min(0).max(100).optional(),
  currency: z.string().default('MXN'),

  // Bank Info
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankClabe: z.string().length(18, 'CLABE debe tener 18 dígitos').optional().or(z.literal('')),

  // Dates
  leaseStartDate: z.coerce.date(),
  leaseEndDate: z.coerce.date(),
  gracePeriodStart: z.coerce.date().optional(),
  gracePeriodEnd: z.coerce.date().optional(),

  // Status
  status: z.enum(['ACTIVE', 'NEGOTIATING', 'TERMINATED', 'LITIGATION', 'RESOLVED']).default('ACTIVE'),
  terminationDate: z.coerce.date().optional(),
  depositRecovered: z.coerce.number().min(0).optional(),

  // Notes
  notes: z.string().optional(),
}).refine((data) => data.leaseEndDate > data.leaseStartDate, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['leaseEndDate'],
});

// Action schemas
export const actionSchema = z.object({
  contractId: z.string().min(1, 'Contrato requerido'),
  tacticId: z.string().min(1, 'Táctica requerida'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'WAITING_RESPONSE', 'COMPLETED', 'CANCELLED', 'FAILED']).default('PENDING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dateDue: z.coerce.date().optional(),
  notes: z.string().optional(),
  result: z.string().optional(),
  referenceNumber: z.string().optional(),
  followUpDate: z.coerce.date().optional(),
  followUpNotes: z.string().optional(),
});

export const updateActionSchema = actionSchema.partial().extend({
  dateCompleted: z.coerce.date().optional(),
});

// Communication schemas
export const communicationSchema = z.object({
  contractId: z.string().min(1, 'Contrato requerido'),
  type: z.enum(['EMAIL', 'LETTER', 'CERTIFIED_MAIL', 'PHONE_CALL', 'IN_PERSON', 'LEGAL_NOTICE', 'COMPLAINT']),
  direction: z.enum(['OUTBOUND', 'INBOUND']),
  recipient: z.string().optional(),
  sender: z.string().optional(),
  subject: z.string().min(1, 'Asunto requerido'),
  content: z.string().min(1, 'Contenido requerido'),
  sentAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional(),
  deliveryMethod: z.string().optional(),
  trackingNumber: z.string().optional(),
  responseReceived: z.boolean().default(false),
  responseDate: z.coerce.date().optional(),
  responseContent: z.string().optional(),
});

// Document schemas
export const documentSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  category: z.enum(['CONTRACT', 'PAYMENT_RECEIPT', 'INVOICE', 'COMPLAINT_FILING', 'LEGAL_DOCUMENT', 'CORRESPONDENCE', 'EVIDENCE', 'OTHER']),
  contractId: z.string().optional(),
  actionId: z.string().optional(),
  communicationId: z.string().optional(),
});

// Clause schema
export const clauseSchema = z.object({
  clauseNumber: z.string().min(1, 'Número de cláusula requerido'),
  title: z.string().min(1, 'Título requerido'),
  summary: z.string().min(1, 'Resumen requerido'),
  fullText: z.string().optional(),
  isLeverage: z.boolean().default(false),
  legalBasis: z.string().optional(),
});

// Template render schema
export const templateRenderSchema = z.object({
  templateId: z.string().min(1, 'Template requerido'),
  contractId: z.string().min(1, 'Contrato requerido'),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContractInput = z.infer<typeof contractSchema>;
export type ActionInput = z.infer<typeof actionSchema>;
export type UpdateActionInput = z.infer<typeof updateActionSchema>;
export type CommunicationInput = z.infer<typeof communicationSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type ClauseInput = z.infer<typeof clauseSchema>;
