/**
 * Endpoints centralizados de la API
 * Basados en: http://192.168.1.40:3000
 */

export const endpoints = {
  // ===================================
  // AUTH
  // ===================================
  auth: {
    register: '/auth/register',
    verifyRegister: '/auth/verify-register',
    sendOtp: '/auth/send-otp',
    resendOtp: '/auth/resend-otp',
    loginPassword: '/auth/login-password',
    loginOtp: '/auth/login',
    requestPasswordReset: '/auth/request-password-reset',
    resendPasswordReset: '/auth/resend-password-reset',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    setPassword: '/auth/set-password',
  },
  
  // ===================================
  // ACCOUNTS
  // ===================================
  accounts: {
    list: '/finance/accounts',
    initialize: '/finance/accounts/initialize',
    create: '/finance/accounts',
    update: (id: string) => `/finance/accounts/${id}`,
    delete: (id: string) => `/finance/accounts/${id}`,
    balance: (id: string) => `/finance/accounts/${id}/balance`,
  },
  
  // ===================================
  // CATEGORIES
  // ===================================
  categories: {
    list: '/finance/categories',
    create: '/finance/categories',
    update: (id: string) => `/finance/categories/${id}`,
    delete: (id: string) => `/finance/categories/${id}`,
  },
  
  // ===================================
  // TRANSACTIONS
  // ===================================
  transactions: {
    list: '/finance/transactions',
    create: '/finance/transactions',
    update: (id: string) => `/finance/transactions/${id}`,
    delete: (id: string) => `/finance/transactions/${id}`,
  },
  
  // ===================================
  // SUMMARY
  // ===================================
  summary: {
    get: '/finance/summary',
  },
  
  // ===================================
  // AI
  // ===================================
  ai: {
    tips: '/ai/tips',
    categorize: '/ai/categorize',
  },
  
  // ===================================
  // OTHER
  // ===================================
  health: '/health',
  me: '/me',
} as const;
