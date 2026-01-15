import type { Contract, MessageTemplate } from '@prisma/client';
import { formatCurrency, formatDateLong } from './formatters';

type ContractData = Contract & {
  [key: string]: unknown;
};

export function renderTemplate(
  template: MessageTemplate,
  contract: ContractData
): { subject: string | null; content: string } {
  const placeholderValues = buildPlaceholderValues(contract);

  let renderedContent = template.content;
  let renderedSubject = template.subject;

  // Replace all placeholders in content
  for (const [key, value] of Object.entries(placeholderValues)) {
    const placeholder = `{{${key}}}`;
    renderedContent = renderedContent.replace(new RegExp(placeholder, 'g'), value);
  }

  // Replace all placeholders in subject
  if (renderedSubject) {
    for (const [key, value] of Object.entries(placeholderValues)) {
      const placeholder = `{{${key}}}`;
      renderedSubject = renderedSubject.replace(new RegExp(placeholder, 'g'), value);
    }
  }

  return {
    subject: renderedSubject,
    content: renderedContent,
  };
}

function buildPlaceholderValues(contract: ContractData): Record<string, string> {
  return {
    // Tenant Info
    tenantName: contract.tenantName || '',
    tenantRfc: contract.tenantRfc || '',
    tenantRepresentative: contract.tenantRepresentative || contract.tenantName || '',
    tenantAddress: contract.tenantAddress || '',

    // Landlord Info
    landlordName: contract.landlordName || '',
    landlordRfc: contract.landlordRfc || '',
    landlordRepresentative: contract.landlordRepresentative || contract.landlordName || '',
    landlordAddress: contract.landlordAddress || '',
    landlordPhone: contract.landlordPhone || '',
    landlordEmail: contract.landlordEmail || '',

    // Property Info
    propertyAddress: contract.propertyAddress || '',
    propertySize: contract.propertySize || '',
    parkingSpots: contract.parkingSpots?.toString() || '0',

    // Financial Info
    monthlyRent: formatCurrency(Number(contract.monthlyRent), contract.currency),
    maintenanceFee: contract.maintenanceFee
      ? formatCurrency(Number(contract.maintenanceFee), contract.currency)
      : '$0.00',
    depositAmount: formatCurrency(Number(contract.depositAmount), contract.currency),
    penaltyMonths: contract.penaltyMonths?.toString() || '4',
    penaltyAmount: formatCurrency(
      Number(contract.monthlyRent) * (contract.penaltyMonths || 4),
      contract.currency
    ),
    currency: contract.currency || 'MXN',

    // Bank Info
    bankName: contract.bankName || '',
    bankAccount: contract.bankAccount || '',
    bankClabe: contract.bankClabe || '',

    // Dates
    leaseStartDate: formatDateLong(contract.leaseStartDate),
    leaseEndDate: formatDateLong(contract.leaseEndDate),
    gracePeriodStart: contract.gracePeriodStart
      ? formatDateLong(contract.gracePeriodStart)
      : '',
    gracePeriodEnd: contract.gracePeriodEnd
      ? formatDateLong(contract.gracePeriodEnd)
      : '',

    // Current date
    currentDate: formatDateLong(new Date()),
  };
}

export function getPlaceholdersList(template: MessageTemplate): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = template.content.matchAll(regex);
  const placeholders = new Set<string>();

  for (const match of matches) {
    placeholders.add(match[1]);
  }

  if (template.subject) {
    const subjectMatches = template.subject.matchAll(regex);
    for (const match of subjectMatches) {
      placeholders.add(match[1]);
    }
  }

  return Array.from(placeholders);
}

export function validateTemplate(
  template: MessageTemplate,
  contract: ContractData
): { isValid: boolean; missingFields: string[] } {
  const placeholders = getPlaceholdersList(template);
  const values = buildPlaceholderValues(contract);
  const missingFields: string[] = [];

  for (const placeholder of placeholders) {
    if (!values[placeholder] || values[placeholder].trim() === '') {
      missingFields.push(placeholder);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
