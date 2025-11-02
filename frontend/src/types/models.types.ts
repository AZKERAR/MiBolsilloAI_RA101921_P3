// ===================================
// MODELOS DE DATOS (Basados en Backend)
// ===================================

// Enums
export type UserStatus = 'pending_email' | 'active' | 'locked' | 'disabled';
export type AccountType = 'cash' | 'bank' | 'credit_card' | 'wallet' | 'investment' | 'other';
export type TxnDirection = 'inflow' | 'outflow';
export type OtpPurpose = 'login' | 'register' | 'password_reset';

// Role
export interface Role {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// User
export interface User {
  id: string;
  email: string;
  status: UserStatus;
  roleId: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

// Account
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

// Category
export interface Category {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// Transaction
export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  direction: TxnDirection;
  amount: number;
  currency: string;
  occurredAt: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  account?: Account;
  category?: Category;
}

// EmailOtpToken (no se expone directamente al frontend)
export interface EmailOtpToken {
  id: string;
  userId: string;
  purpose: OtpPurpose;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
}

// Balance
export interface AccountBalance {
  accountId: string;
  asOf: string;
  inflow: number;
  outflow: number;
  balance: number;
}

// Summary
export interface ExpenseByCategory {
  categoryId: string | null;
  categoryName: string;
  total: number;
}

export interface FinancialSummary {
  totals: {
    inflow: number;
    outflow: number;
    net: number;
  };
  expensesByCategory: ExpenseByCategory[];
}

// IA - Tips
export interface TipsMeta {
  descripcion: string;
  monto_objetivo: number;
  plazo: string;
}

export interface TipsPlan {
  aporte_por_periodo: number;
  periodos: number;
  plan_semanal?: string[];
  plan_mensual?: string[];
}

export interface AITipsResponse {
  resumen: string;
  meta: TipsMeta;
  plan: TipsPlan;
  consejos: string[];
  riesgos: string[];
}

// IA - Categorización
export interface AICategorizeResponse {
  categoria: string;
  confianza: number;
}
