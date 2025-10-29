# MiBolsilloAI 💰

**MiBolsilloAI** es una aplicación financiera personal inteligente que te ayuda a gestionar tus finanzas de manera eficiente. Incluye un asistente de IA para análisis financiero y recomendaciones personalizadas.

## 📋 Descripción del Proyecto

MiBolsilloAI es una aplicación fullstack que permite a los usuarios:
- 📊 Gestionar cuentas bancarias y financieras
- 💸 Registrar transacciones (ingresos y gastos)
- 📁 Categorizar movimientos financieros
- 📈 Visualizar resúmenes y estadísticas
- 🤖 Obtener análisis financiero con IA (OpenAI)
- 🔐 Sistema de autenticación seguro con OTP por email

## 🏗️ Estructura del Proyecto

```
MiBolsilloAI/
├── backend/                    # API REST con Node.js + Express
│   ├── src/
│   │   ├── modules/           # Módulos de la aplicación
│   │   │   ├── auth/          # Autenticación y registro
│   │   │   ├── finance/       # Gestión financiera
│   │   │   │   ├── accounts/  # Cuentas bancarias
│   │   │   │   ├── categories/# Categorías
│   │   │   │   ├── summary/   # Resúmenes
│   │   │   │   └── transactions/ # Transacciones
│   │   │   └── ia/            # Integración con OpenAI
│   │   ├── middlewares/       # Middlewares (auth, validación)
│   │   ├── lib/               # Utilidades (JWT, Prisma, OpenAI)
│   │   └── server.ts          # Punto de entrada del servidor
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de base de datos
│   │   ├── migrations/        # Migraciones de Prisma
│   │   └── seed.ts            # Datos iniciales
│   └── package.json
│
└── frontend/
    └── MiBolsilloAI/          # App móvil con React Native + Expo
        ├── app/               # Rutas de la aplicación (Expo Router)
        │   ├── (auth)/        # Pantallas de autenticación
        │   ├── (app)/         # Pantallas principales
        │   │   ├── (home)/    # Dashboard
        │   │   ├── (settings)/# Configuración
        │   │   ├── (summary)/ # Resúmenes
        │   │   └── (transactions)/ # Transacciones
        │   └── onboarding.tsx # Pantalla de bienvenida
        ├── src/
        │   ├── api/           # Configuración de API
        │   ├── components/    # Componentes reutilizables
        │   ├── hooks/         # Custom hooks
        │   ├── store/         # Estado global (Zustand)
        │   ├── types/         # Tipos TypeScript
        │   └── utils/         # Utilidades
        └── package.json
```

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** + **Express** - Framework web
- **TypeScript** - Lenguaje tipado
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** (Neon) - Base de datos
- **JWT** - Autenticación
- **Brevo** - Envío de emails (OTP)
- **OpenAI API** - Asistente de IA

### Frontend
- **React Native** + **Expo** - Framework móvil
- **TypeScript** - Lenguaje tipado
- **Expo Router** - Navegación basada en archivos
- **Zustand** - Gestión de estado
- **React Query** - Gestión de datos del servidor
- **Axios** - Cliente HTTP

## ⚙️ Configuración del Proyecto

### Prerrequisitos
- Node.js 18+ instalado
- pnpm (gestor de paquetes)
- PostgreSQL (o cuenta en Neon.tech)
- Cuenta de OpenAI con API Key
- Cuenta de Brevo para envío de emails

### 1️⃣ Instalación del Backend

```bash
cd backend
pnpm install
```

### 2️⃣ Configuración de Variables de Entorno - Backend

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
# Database Configuration
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

# Server Configuration
PORT=3000

# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key_here
EMAIL_FROM="Your App Name <youremail@example.com>"

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# JWT Secret (genera uno seguro)
JWT_SECRET=your_very_secure_random_secret_key_here
```

**Descripción de las variables:**

- `DATABASE_URL`: URL de conexión a PostgreSQL (puedes usar [Neon.tech](https://neon.tech) gratis)
- `PORT`: Puerto donde correrá el servidor (por defecto 3000)
- `BREVO_API_KEY`: API Key de [Brevo](https://www.brevo.com/) para enviar emails de OTP
- `EMAIL_FROM`: Dirección de correo desde donde se enviarán los OTPs
- `OPENAI_API_KEY`: API Key de [OpenAI](https://platform.openai.com/) para el asistente de IA
- `JWT_SECRET`: String secreto para firmar los tokens JWT (genera uno aleatorio y seguro)

### 3️⃣ Configurar la Base de Datos

```bash
# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Cargar datos iniciales
npx prisma db seed
```

### 4️⃣ Iniciar el Backend

```bash
pnpm dev
```

El servidor estará corriendo en `http://localhost:3000`

---

### 5️⃣ Instalación del Frontend

```bash
cd frontend/MiBolsilloAI
pnpm install
```

### 6️⃣ Configuración de Variables de Entorno - Frontend

Crea un archivo `.env` en la carpeta `frontend/MiBolsilloAI/` con las siguientes variables:

```env
# API Configuration
API_URL=http://YOUR_LOCAL_IP:3000
API_TIMEOUT=30000

# Environment
NODE_ENV=development
```

**Descripción de las variables:**

- `API_URL`: URL del backend. 
  - **Para desarrollo local en dispositivo físico**: usa tu IP local (ej: `http://192.168.1.100:3000`)
  - **Para emulador Android**: usa `http://10.0.2.2:3000`
  - **Para simulador iOS**: usa `http://localhost:3000`
- `API_TIMEOUT`: Tiempo de espera para las peticiones HTTP (en milisegundos)
- `NODE_ENV`: Entorno de ejecución (`development` o `production`)

### 7️⃣ Iniciar el Frontend

```bash
# Iniciar Expo
pnpm start

# O directamente en un dispositivo/emulador
pnpm android  # Para Android
pnpm ios      # Para iOS (solo en macOS)
```

## 📱 Uso de la Aplicación

1. **Registro**: Crea una cuenta con tu email
2. **Verificación**: Ingresa el código OTP enviado a tu correo
3. **Crear Cuentas**: Añade tus cuentas bancarias o de efectivo
4. **Registrar Transacciones**: Añade ingresos y gastos
5. **Categorizar**: Organiza tus movimientos por categorías
6. **Analizar**: Consulta resúmenes y estadísticas
7. **Asistente IA**: Obtén recomendaciones financieras personalizadas

## 🔐 Seguridad

- Las contraseñas se almacenan hasheadas
- Autenticación mediante JWT
- Validación de OTP por email
- Variables de entorno para datos sensibles
- Validación de datos en backend y frontend

## 📄 Licencia

Este proyecto es privado y de uso personal.

## 👨‍💻 Desarrollador

Desarrollado por **AZKER**

---

**Nota**: Recuerda **NUNCA** compartir tus archivos `.env` ni subirlos a repositorios públicos. Mantén tus API Keys y secretos seguros.
