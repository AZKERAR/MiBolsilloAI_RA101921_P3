// Constantes de la aplicación

export const APP_NAME = 'MiBolsillo';

// Autenticación
export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_data';

// OTP
export const OTP_LENGTH = 6;
export const OTP_RESEND_COOLDOWN = 60; // segundos

// Transacciones
export const DEFAULT_CURRENCY = 'USD';
export const DECIMAL_PLACES = 2;

// Paginación
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Query Keys para TanStack Query
export const QUERY_KEYS = {
  auth: ['auth'] as const,
  user: ['user'] as const,
  accounts: ['accounts'] as const,
  account: (id: string) => ['account', id] as const,
  accountBalance: (id: string) => ['account-balance', id] as const,
  transactions: ['transactions'] as const,
  transaction: (id: string) => ['transaction', id] as const,
  categories: ['categories'] as const,
  category: (id: string) => ['category', id] as const,
  summary: ['summary'] as const,
  aiTips: ['ai-tips'] as const,
  aiCategorize: ['ai-categorize'] as const,
} as const;

// Tipos de cuenta
export const ACCOUNT_TYPES = [
  { value: 'cash', label: 'Efectivo', icon: 'cash' },
  { value: 'bank', label: 'Banco', icon: 'bank' },
  { value: 'credit_card', label: 'Tarjeta de Crédito', icon: 'credit-card' },
  { value: 'wallet', label: 'Billetera Digital', icon: 'wallet' },
  { value: 'investment', label: 'Inversión', icon: 'trending-up' },
  { value: 'other', label: 'Otro', icon: 'dots-horizontal' },
] as const;

// Direcciones de transacción
export const TRANSACTION_DIRECTIONS = [
  { value: 'inflow', label: 'Ingreso', icon: 'arrow-down', color: '#10B981' },
  { value: 'outflow', label: 'Gasto', icon: 'arrow-up', color: '#EF4444' },
] as const;

// Estados de usuario
export const USER_STATUSES = {
  pending_email: 'Pendiente de verificación',
  active: 'Activo',
  locked: 'Bloqueado',
  disabled: 'Deshabilitado',
} as const;
