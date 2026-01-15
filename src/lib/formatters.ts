import { format, formatDistanceToNow, isAfter, isBefore, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatCurrency(amount: number | string, currency: string = 'MXN'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

export function formatDateLong(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "dd/MM/yyyy 'a las' HH:mm", { locale: es });
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
}

export function getDaysRemaining(endDate: Date | string): number {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return differenceInDays(end, new Date());
}

export function isOverdue(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isBefore(dateObj, new Date());
}

export function isDueSoon(date: Date | string, daysThreshold: number = 7): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + daysThreshold);

  return isAfter(dateObj, now) && isBefore(dateObj, threshold);
}

export function formatRfc(rfc: string): string {
  // Format RFC with proper spacing for readability
  if (rfc.length === 12) {
    // Persona moral
    return `${rfc.slice(0, 3)}-${rfc.slice(3, 9)}-${rfc.slice(9)}`;
  } else if (rfc.length === 13) {
    // Persona física
    return `${rfc.slice(0, 4)}-${rfc.slice(4, 10)}-${rfc.slice(10)}`;
  }
  return rfc;
}

export function formatClabe(clabe: string): string {
  // Format CLABE in groups of 4 for readability
  return clabe.replace(/(.{4})/g, '$1 ').trim();
}

export function formatPhone(phone: string): string {
  // Format Mexican phone number
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
