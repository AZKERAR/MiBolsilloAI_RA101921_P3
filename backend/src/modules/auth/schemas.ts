// src/modules/auth/schemas.ts
import { z } from 'zod';

export const Email = z.string().email({ message: 'email inválido' }).trim();
export const Password = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres');
export const OtpCode = z.string().regex(/^\d{6}$/, 'El código debe tener 6 dígitos');
export const OtpPurpose = z.enum(['login', 'register', 'password_reset']);

export const RegisterSchema = z.object({
  email: Email,
  password: Password
});

export const VerifyRegisterSchema = z.object({
  email: Email,
  code: OtpCode
});

export const SendOtpSchema = z.object({
  email: Email,
  purpose: OtpPurpose.default('login')
});

export const LoginPasswordSchema = z.object({
  email: Email,
  password: z.string().min(1, 'password requerido')
});

export const LoginOtpSchema = z.object({
  email: Email,
  code: OtpCode,
  purpose: OtpPurpose.default('login')
});

export const RequestResetSchema = z.object({
  email: Email
});

export const ResetPasswordSchema = z.object({
  email: Email,
  code: OtpCode,
  newPassword: Password
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: Password
});

export const SetPasswordSchema = z.object({
  newPassword: Password
});

// Tipos inferidos (opcionales)
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type VerifyRegisterInput = z.infer<typeof VerifyRegisterSchema>;
export type SendOtpInput = z.infer<typeof SendOtpSchema>;
export type LoginPasswordInput = z.infer<typeof LoginPasswordSchema>;
export type LoginOtpInput = z.infer<typeof LoginOtpSchema>;
export type RequestResetInput = z.infer<typeof RequestResetSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type SetPasswordInput = z.infer<typeof SetPasswordSchema>;