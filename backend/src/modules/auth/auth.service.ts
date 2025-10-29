// src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.ts';
import { signJwt } from '../../lib/jwt.ts';
import { sendOtpEmail } from '../../email.service.ts';

const MIN_PASS = 8;

// Helpers
function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}
function normEmail(email: string) {
  return email.trim().toLowerCase();
}

async function ensureDefaultRole() {
  let role = await prisma.role.findUnique({ where: { code: 'user' } });
  if (!role) role = await prisma.role.create({ data: { code: 'user', name: 'User' } });
  return role;
}

// ===== OTP =====
export async function issueOtp(_email: string, purpose: 'login' | 'register' | 'password_reset' = 'login') {
  const email = normEmail(_email);

  // crea user pending_email si no existe
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const role = await ensureDefaultRole();
    user = await prisma.user.create({
      data: { email, status: 'pending_email', roleId: role.id },
    });
  }

  // cooldown 60s
  const recent = await prisma.emailOtpToken.findFirst({
    where: { userId: user.id, purpose },
    orderBy: { createdAt: 'desc' },
  });
  if (recent && Date.now() - recent.createdAt.getTime() < 60_000) {
    const wait = 60 - Math.ceil((Date.now() - recent.createdAt.getTime()) / 1000);
    return { ok: false as const, reason: `Espera ${wait}s para solicitar otro código.` };
  }

  // invalida previos sin usar
  await prisma.emailOtpToken.deleteMany({
    where: { userId: user.id, purpose, usedAt: null },
  });

  // crea nuevo OTP (5 min)
  const code = genCode();
  const otpHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.emailOtpToken.create({
    data: { userId: user.id, purpose, otpHash, expiresAt },
  });

  await sendOtpEmail(email, code);
  return { ok: true as const };
}

export async function consumeValidOtp(userId: string, code: string, purpose: 'login' | 'register' | 'password_reset') {
  const token = await prisma.emailOtpToken.findFirst({
    where: { userId, purpose, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
  if (!token) return { ok: false as const, reason: 'OTP inválido o expirado' };

  const ok = await bcrypt.compare(code, token.otpHash);
  if (!ok) return { ok: false as const, reason: 'OTP incorrecto' };

  await prisma.emailOtpToken.update({
    where: { id: token.id },
    data: { usedAt: new Date() },
  });
  return { ok: true as const };
}

// ===== Registro (email+password + OTP) =====
export async function registerWithPassword(_email: string, password: string) {
  const email = normEmail(_email);

  if (password.length < MIN_PASS) {
    return { ok: false as const, status: 400, message: `La contraseña debe tener al menos ${MIN_PASS} caracteres` };
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { ok: false as const, status: 409, message: 'El correo ya está registrado' };

  const role = await ensureDefaultRole();
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, passwordHash, status: 'pending_email', roleId: role.id },
  });

  const send = await issueOtp(email, 'register');
  if (!send.ok) return { ok: false as const, status: 429, message: send.reason };

  return { ok: true as const, message: 'Usuario creado. Revisa tu correo para validar con el OTP.' };
}

export async function verifyRegisterOtp(_email: string, code: string) {
  const email = normEmail(_email);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false as const, status: 404, message: 'usuario no existe' };

  const r = await consumeValidOtp(user.id, code, 'register');
  if (!r.ok) return { ok: false as const, status: 400, message: r.reason };

  if (user.status === 'pending_email') {
    await prisma.user.update({ where: { id: user.id }, data: { status: 'active' } });
  }
  return { ok: true as const, message: 'Correo verificado. Ya puedes iniciar sesión.' };
}

// ===== Login =====
export async function loginWithPassword(_email: string, password: string) {
  const email = normEmail(_email);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false as const, status: 404, message: 'usuario no existe' };
  if (user.status !== 'active') return { ok: false as const, status: 403, message: 'Debes validar tu correo primero' };
  if (!user.passwordHash) return { ok: false as const, status: 400, message: 'Este usuario no tiene contraseña' };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { ok: false as const, status: 400, message: 'Credenciales inválidas' };

  const token = signJwt({ sub: user.id, email: user.email });
  return { ok: true as const, token, user: { id: user.id, email: user.email, status: user.status } };
}

export async function loginWithOtp(_email: string, code: string, purpose: 'login' | 'password_reset' | 'register' = 'login') {
  const email = normEmail(_email);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false as const, status: 404, message: 'usuario no existe' };

  const result = await consumeValidOtp(user.id, code, purpose);
  if (!result.ok) return { ok: false as const, status: 400, message: result.reason };

  if (user.status === 'pending_email') {
    await prisma.user.update({ where: { id: user.id }, data: { status: 'active' } });
  }

  const token = signJwt({ sub: user.id, email: user.email });
  return { ok: true as const, token, user: { id: user.id, email: user.email, status: 'active' } };
}

// ===== Reset/Cambio de contraseña =====
export async function requestPasswordReset(_email: string) {
  const email = normEmail(_email);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: true as const }; // anti-enumeración
  const r = await issueOtp(email, 'password_reset');
  if (!r.ok) return { ok: false as const, message: r.reason };
  return { ok: true as const };
}

export async function resetPassword(_email: string, code: string, newPassword: string) {
  const email = normEmail(_email);

  if (newPassword.length < MIN_PASS) {
    return { ok: false as const, status: 400, message: `La contraseña debe tener al menos ${MIN_PASS} caracteres` };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false as const, status: 404, message: 'usuario no existe' };

  const ok = await consumeValidOtp(user.id, code, 'password_reset');
  if (!ok.ok) return { ok: false as const, status: 400, message: ok.reason };

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, status: user.status === 'pending_email' ? 'active' : user.status },
  });

  return { ok: true as const };
}

export async function changePassword(userId: string, currentPassword: string | undefined, newPassword: string) {
  if (newPassword.length < MIN_PASS) {
    return { ok: false as const, status: 400, message: `La contraseña debe tener al menos ${MIN_PASS} caracteres` };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false as const, status: 404, message: 'usuario no existe' };

  if (user.passwordHash) {
    if (!currentPassword) return { ok: false as const, status: 400, message: 'currentPassword requerido' };
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return { ok: false as const, status: 400, message: 'Contraseña actual incorrecta' };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { ok: true as const };
}

export async function setPassword(userId: string, newPassword: string) {
  if (newPassword.length < MIN_PASS) {
    return { ok: false as const, status: 400, message: `La contraseña debe tener al menos ${MIN_PASS} caracteres` };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { ok: true as const };
}