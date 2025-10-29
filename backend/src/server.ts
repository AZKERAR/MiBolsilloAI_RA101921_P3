// src/server.ts
import 'dotenv/config';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';

import { prisma } from './lib/prisma.ts';
import { requireAuth } from './middlewares/auth.ts';

// Módulos
import { authRouter } from './modules/auth/auth.routes.ts';
import { aiRoutes } from './modules/ia/routes.ts';
import accountsRoutes from './modules/finance/accounts/routes.ts';
import categoriesRoutes from './modules/finance/categories/routes.ts';
import transactionsRoutes from './modules/finance/transactions/routes.ts';
import summaryRoutes from './modules/finance/summary/routes.ts';

const app = express();

/**
 * --- CORS ---
 * Necesitas permitir:
 *  - Expo Web: http://localhost:8081
 *  - Devtools / herramientas: 19006, 5173, 4200
 *  - Orígenes en LAN (por ej. http://192.168.x.x:19006) cuando Expo usa LAN
 *
 * NOTA: Para apps nativas (emulador/Expo Go) CORS NO aplica, esto es solo para Web.
 */
const allowList = new Set<string>([
  'http://localhost:8081', // Expo Web
  'http://localhost:19006', // DevTools Expo
  'http://localhost:5173',  // Vite (si lo usaras)
  'http://localhost:4200',  // Angular (si lo usaras)
]);

// Permite definir orígenes extra por ENV (separados por coma)
if (process.env.CORS_ORIGINS) {
  process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean).forEach(o => allowList.add(o));
}

// Patrones de LAN comunes (192.168.x.x / 10.x.x.x) — útiles cuando DevTools corre por IP local
const lanRegexes: RegExp[] = [
  /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/,
  /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/,
  /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/, // 172.16.0.0 – 172.31.255.255
];

const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, cb) {
    // Requests sin "origin" (por ejemplo, curl o apps nativas) → permitir
    if (!origin) return cb(null, true);

    if (allowList.has(origin) || lanRegexes.some(rx => rx.test(origin))) {
      return cb(null, true);
    }
    return cb(new Error(`CORS: Origin bloqueado -> ${origin}`));
  },
};

// --- Middlewares base ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(
  helmet({
    // Si usas imágenes remotas / inline styles, podrías ajustar CSP aquí más adelante
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  })
);

// --- Healthcheck ---
app.get('/', (_req, res) => res.send('OK: API up'));
app.get('/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

// --- Rutas / módulos ---
app.use('/auth', authRouter);
app.use('/ai', aiRoutes);

app.use('/finance/accounts', accountsRoutes);
app.use('/finance/categories', categoriesRoutes);
app.use('/finance/transactions', transactionsRoutes);
app.use('/finance/summary', summaryRoutes);

// --- Ejemplo protegido ---
app.get('/me', requireAuth, async (req, res) => {
  // @ts-ignore inyectado por requireAuth
  const userId = req.userId as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json({ id: user?.id, email: user?.email, status: user?.status });
});

// --- Middleware de manejo de errores ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(status).json({
    ok: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// --- Arranque / Shutdown ordenado ---
const PORT = Number(process.env.PORT || 3000);
const server = app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);