// src/modules/auth/auth.controller.ts
import type { Request, Response, RequestHandler, NextFunction } from 'express';
import {
  issueOtp,
  registerWithPassword,
  verifyRegisterOtp,
  loginWithPassword,
  loginWithOtp,
  requestPasswordReset,
  resetPassword,
  changePassword, // Añadido para cambio de contraseña
  setPassword,
} from './auth.service.ts'; 

// ------------------ helpers ------------------
type OtpPurpose = 'login' | 'register' | 'password_reset';
const isPurpose = (v: unknown): v is OtpPurpose =>
  v === 'login' || v === 'register' || v === 'password_reset';

// Envuelve un handler async como RequestHandler (retorna void)
function wrap(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch((e) => {
      console.error('Auth controller error:', e);
      if (!res.headersSent) res.status(500).json({ message: 'Error interno' });
    });
  };
}

// ------------------ Registro + Verificación ------------------
export const register: RequestHandler = wrap(async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ message: 'Email y password son requeridos' });
    return;
  }
  const r = await registerWithPassword(email, password);
  if (!r.ok) {
    res.status(r.status ?? 400).json({ message: r.message });
    return;
  }
  res.json({ message: r.message });
});

export const verifyRegister: RequestHandler = wrap(async (req, res) => {
  const { email, code } = req.body as { email?: string; code?: string };
  if (!email || !code) {
    res.status(400).json({ message: 'Email y code son requeridos' });
    return;
  }
  const r = await verifyRegisterOtp(email, code);
  if (!r.ok) {
    res.status(r.status ?? 400).json({ message: r.message });
    return;
  }
  res.json({ message: r.message });
});

// ------------------ OTP utilitarios ------------------
export const sendOtp: RequestHandler = wrap(async (req, res) => {
  const { email, purpose } = req.body as { email?: string; purpose?: unknown };
  if (!email || !isPurpose(purpose)) {
    res
      .status(400)
      .json({ message: "Campos inválidos. purpose debe ser 'login' | 'register' | 'password_reset'." });
    return;
  }
  const r = await issueOtp(email, purpose);
  if (!r.ok) {
    res.status(429).json({ message: r.reason });
    return;
  }
  res.json({ message: 'OTP enviado' });
});

export const resendOtp: RequestHandler = wrap(async (req, res) => {
  const { email, purpose } = req.body as { email?: string; purpose?: unknown };
  if (!email || !isPurpose(purpose)) {
    res
      .status(400)
      .json({ message: "Campos inválidos. purpose debe ser 'login' | 'register' | 'password_reset'." });
    return;
  }
  const r = await issueOtp(email, purpose);
  if (!r.ok) {
    res.status(429).json({ message: r.reason });
    return;
  }
  res.json({ message: 'Nuevo OTP reenviado' });
});

// ------------------ Login ------------------
// Login con correo y contraseña
export const loginPassword: RequestHandler = wrap(async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ message: 'Email y password son requeridos' });
    return;
  }
  const r = await loginWithPassword(email, password);
  if (!r.ok) {
    res.status(r.status ?? 400).json({ message: r.message });
    return;
  }
  res.json({ token: r.token, user: r.user });
});

// Login con OTP (esto es opcional, puede ser cuando el usuario haya validado OTP)
export const loginOtp: RequestHandler = wrap(async (req, res) => {
  const { email, code, purpose } = req.body as { email?: string; code?: string; purpose?: unknown };
  if (!email || !code || !isPurpose(purpose)) {
    res
      .status(400)
      .json({ message: "Campos inválidos. purpose debe ser 'login' | 'register' | 'password_reset'." });
    return;
  }
  const r = await loginWithOtp(email, code, purpose);
  if (!r.ok) {
    res.status(r.status ?? 400).json({ message: r.message });
    return;
  }
  res.json({ token: r.token, user: r.user });
});

// ------------------ Reset / Cambio de contraseña ------------------
// Solicitar cambio de contraseña
export const requestReset: RequestHandler = wrap(async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    res.status(400).json({ message: 'Email es requerido' });
    return;
  }
  const r = await requestPasswordReset(email);
  if (!r.ok) {
    res.status(429).json({ message: r.message });
    return;
  }
  // Mensaje neutro (no revela si el email existe o no)
  res.json({ message: 'Si el email existe, se envió un código.' });
});

// Reenviar OTP de contraseña
export const resendResetOtp: RequestHandler = wrap(async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    res.status(400).json({ message: 'Email es requerido' });
    return;
  }
  const r = await requestPasswordReset(email);
  if (!r.ok) {
    res.status(429).json({ message: r.message });
    return;
  }
  res.json({ message: 'Si el email existe, reenviamos un código.' });
});

// Resetear la contraseña
export const resetPass: RequestHandler = wrap(async (req, res) => {
  const { email, code, newPassword } = req.body as { email?: string; code?: string; newPassword?: string };
  if (!email || !code || !newPassword) {
    res.status(400).json({ message: 'Email, code y newPassword son requeridos' });
    return;
  }
  const r = await resetPassword(email, code, newPassword);
  if (!r.ok) {
    res.status(r.status ?? 400).json({ message: r.message });
    return;
  }
  res.json({ message: 'Contraseña actualizada correctamente' });
});

// Cambiar la contraseña
export const changePass: RequestHandler = wrap(async (req, res) => {
  // @ts-ignore - inyectado por requireAuth
  const userId = req.userId as string | undefined;
  const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };
  if (!userId || !newPassword) {
    res.status(400).json({ message: 'newPassword es requerido' });
    return;
  }
  const r = await changePassword(userId, currentPassword, newPassword);
  if (!r.ok) {
    res.status(r.status ?? 400).json({ message: r.message });
    return;
  }
  res.json({ message: 'Contraseña cambiada correctamente' });
});

// Establecer una nueva contraseña
export const setPass: RequestHandler = wrap(async (req, res) => {
  // @ts-ignore - inyectado por requireAuth
  const userId = req.userId as string | undefined;
  const { newPassword } = req.body as { newPassword?: string };
  if (!userId || !newPassword) {
    res.status(400).json({ message: 'newPassword es requerido' });
    return;
  }
  const r = await setPassword(userId, newPassword);
  if (!r.ok) {
    res.status(r.status ?? 400).json({ message: r.message });
    return;
  }
  res.json({ message: 'Contraseña establecida correctamente' });
});