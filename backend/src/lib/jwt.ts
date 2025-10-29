import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

// Evalúa una vez y tipa como Secret (no string | undefined)
const JWT_SECRET: Secret = (() => {
  const v = process.env.JWT_SECRET;
  if (!v || v.length < 32) {
    throw new Error('Falta JWT_SECRET o es muy corto. Pon uno de al menos 32 caracteres en .env');
  }
  return v;
})();

export function signJwt(payload: object, expiresIn: SignOptions['expiresIn'] = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
