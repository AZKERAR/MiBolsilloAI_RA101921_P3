import { OTP_LENGTH } from '@/config/constants';

/**
 * Valida formato de email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida longitud de contraseña (mínimo 8 caracteres)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Valida código OTP (6 dígitos)
 */
export const isValidOTP = (code: string): boolean => {
  const otpRegex = new RegExp(`^\\d{${OTP_LENGTH}}$`);
  return otpRegex.test(code);
};

/**
 * Valida monto (positivo con máximo 2 decimales)
 */
export const isValidAmount = (amount: string | number): boolean => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num) || num <= 0) return false;
  
  // Verificar máximo 2 decimales
  const decimals = amount.toString().split('.')[1];
  return !decimals || decimals.length <= 2;
};

/**
 * Valida código de moneda (3 letras mayúsculas)
 */
export const isValidCurrency = (currency: string): boolean => {
  const currencyRegex = /^[A-Z]{3}$/;
  return currencyRegex.test(currency);
};

/**
 * Valida UUID v4
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Valida fecha en formato ISO 8601
 */
export const isValidISODate = (date: string): boolean => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

/**
 * Obtiene mensaje de error de validación
 */
export const getValidationError = (field: string, value: any): string | null => {
  switch (field) {
    case 'email':
      return !isValidEmail(value) ? 'Email inválido' : null;
    case 'password':
      return !isValidPassword(value) ? 'La contraseña debe tener al menos 8 caracteres' : null;
    case 'otp':
      return !isValidOTP(value) ? `El código debe tener ${OTP_LENGTH} dígitos` : null;
    case 'amount':
      return !isValidAmount(value) ? 'Monto inválido (debe ser positivo con máximo 2 decimales)' : null;
    default:
      return null;
  }
};
