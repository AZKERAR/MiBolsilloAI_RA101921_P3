import { DEFAULT_CURRENCY, DECIMAL_PLACES } from '@/config/constants';

/**
 * Formatea un número como moneda
 * @param amount - Monto a formatear
 * @param currency - Código de moneda (ISO 4217)
 * @param locale - Locale para el formato (default: 'es-SV')
 */
export const formatCurrency = (
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale: string = 'es-SV'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: DECIMAL_PLACES,
    maximumFractionDigits: DECIMAL_PLACES,
  }).format(amount);
};

/**
 * Formatea una fecha en formato legible
 * @param date - Fecha a formatear (Date o string ISO)
 * @param format - Formato deseado ('short' | 'medium' | 'long')
 */
export const formatDate = (
  date: Date | string,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: 'short', year: 'numeric' },
    long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  };
  
  return new Intl.DateTimeFormat('es-SV', optionsMap[format]).format(dateObj);
};

/**
 * Formatea una fecha y hora
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-SV', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('es-SV', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Parsea un string a número decimal (para inputs de monto)
 * @param value - String a parsear
 * @returns Número o null si es inválido
 */
export const parseDecimal = (value: string): number | null => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed)) return null;
  
  return Math.round(parsed * 100) / 100; // Redondea a 2 decimales
};

/**
 * Valida y formatea input de monto en tiempo real
 * @param value - Valor del input
 * @returns Valor formateado o string vacío
 */
export const formatAmountInput = (value: string): string => {
  // Permitir solo dígitos y un punto decimal
  let cleaned = value.replace(/[^0-9.]/g, '');
  
  // Evitar múltiples puntos
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limitar a 2 decimales
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  return cleaned;
};

/**
 * Convierte una fecha a formato ISO string (para enviar al backend)
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Obtiene el inicio del día
 */
export const startOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Obtiene el fin del día
 */
export const endOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Formatea tiempo relativo ("hace 2 horas", "ayer", etc.)
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'hace un momento';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHour < 24) return `hace ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
  if (diffDay < 7) return `hace ${diffDay} día${diffDay > 1 ? 's' : ''}`;
  
  return formatDate(dateObj, 'short');
};
