import type {
  User,
  Account,
  Transaction,
  Category,
  AccountBalance,
  FinancialSummary,
  AITipsResponse,
  AICategorizeResponse,
  OtpPurpose,
} from './models.types';

// ===================================
// RESPUESTAS DE API (DTOs)
// ===================================

// Respuesta genérica de éxito
export interface SuccessResponse<T = any> {
  ok?: boolean;
  message?: string;
  data?: T;
}

// Respuesta genérica de error
export interface ErrorResponse {
  ok: false;
  message: string;
  issues?: Array<{
    path: string;
    message: string;
    received?: string;
  }>;
  hint?: string;
  stack?: string;
}

// ===================================
// AUTH ENDPOINTS
// ===================================

// POST /auth/register
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

// POST /auth/verify-register
export interface VerifyRegisterRequest {
  email: string;
  code: string;
}

export interface VerifyRegisterResponse {
  message: string;
}

// POST /auth/send-otp
export interface SendOtpRequest {
  email: string;
  purpose: OtpPurpose;
}

export interface SendOtpResponse {
  message: string;
}

// POST /auth/login-password
export interface LoginPasswordRequest {
  email: string;
  password: string;
}

export interface LoginPasswordResponse {
  token: string;
  user: User;
}

// POST /auth/login (with OTP)
export interface LoginOtpRequest {
  email: string;
  code: string;
  purpose: OtpPurpose;
}

export interface LoginOtpResponse {
  token: string;
  user: User;
}

// POST /auth/request-password-reset
export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestPasswordResetResponse {
  message: string;
}

// POST /auth/reset-password
export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// POST /auth/change-password
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// ===================================
// ACCOUNTS ENDPOINTS
// ===================================

// GET /finance/accounts
export type ListAccountsResponse = Account[];

// POST /finance/accounts/initialize
export interface InitializeAccountRequest {
  name: string;
  type: string;
  initialAmount: number;
  currency: string;
}

export interface InitializeAccountResponse {
  account: Account;
  transaction: Transaction;
  balance: number;
}

// POST /finance/accounts
export interface CreateAccountRequest {
  name: string;
  type: string;
  currency?: string;
}

export type CreateAccountResponse = Account;

// PUT /finance/accounts/:id
export interface UpdateAccountRequest {
  name?: string;
  type?: string;
  currency?: string;
}

export type UpdateAccountResponse = Account;

// GET /finance/accounts/:id/balance
export interface GetAccountBalanceQuery {
  asOf?: string;
}

export type GetAccountBalanceResponse = AccountBalance;

// ===================================
// CATEGORIES ENDPOINTS
// ===================================

// GET /finance/categories
export type ListCategoriesResponse = Category[];

// POST /finance/categories
export interface CreateCategoryRequest {
  name: string;
  icon?: string;
  color?: string;
}

export type CreateCategoryResponse = Category;

// PUT /finance/categories/:id
export interface UpdateCategoryRequest {
  name?: string;
  icon?: string;
  color?: string;
}

export type UpdateCategoryResponse = Category;

// ===================================
// TRANSACTIONS ENDPOINTS
// ===================================

// GET /finance/transactions
export interface ListTransactionsQuery {
  from?: string;
  to?: string;
  accountId?: string;
  categoryId?: string;
  direction?: 'inflow' | 'outflow';
  page?: number;
  pageSize?: number;
}

export interface ListTransactionsResponse {
  page: number;
  pageSize: number;
  total: number;
  items: Transaction[];
}

// POST /finance/transactions
export interface CreateTransactionRequest {
  accountId: string;
  categoryId?: string;
  direction: 'inflow' | 'outflow';
  amount: number;
  currency: string;
  occurredAt: string;
  note?: string;
}

export type CreateTransactionResponse = Transaction;

// PATCH /finance/transactions/:id
export interface UpdateTransactionRequest {
  accountId?: string;
  categoryId?: string;
  direction?: 'inflow' | 'outflow';
  amount?: number;
  currency?: string;
  occurredAt?: string;
  note?: string;
}

export type UpdateTransactionResponse = Transaction;

// ===================================
// SUMMARY ENDPOINT
// ===================================

// GET /finance/summary
export interface GetSummaryQuery {
  from?: string;
  to?: string;
}

export type GetSummaryResponse = FinancialSummary;

// ===================================
// AI ENDPOINTS
// ===================================

// POST /ai/tips
export interface AITipsRequestRigid {
  goal: string;
  targetAmount: number;
  timeframe: {
    unit: 'weeks' | 'months';
    value: number;
  };
  context?: {
    currency?: string;
    monthlyIncome?: number;
    fixedCosts?: number;
    currentBalance?: number;
  };
}

export interface AITipsRequestNL {
  prompt: string;
}

export type AITipsRequest = AITipsRequestRigid | AITipsRequestNL;

export interface AITipsResponseWrapper {
  data: AITipsResponse;
  source: 'openai' | 'fallback';
  error?: string;
}

// POST /ai/categorize
export interface AICategorizeRequest {
  text: string;
  amount: number;
  categories: string[];
}

export interface AICategorizeResponseWrapper {
  data: AICategorizeResponse;
  source: 'openai' | 'fallback';
  error?: string;
}
