// src/modules/auth/auth.routes.ts
import { Router } from 'express'; // Importamos Router de express para crear las rutas.
import { requireAuth } from '../../middlewares/auth.ts'; // Middleware para validar la autenticación del usuario.
import { validate } from '../../middlewares/validate.ts'; // Middleware para validar el cuerpo de la solicitud según los esquemas.

// Importamos los esquemas de validación (schemas.ts) para validar los datos de entrada.
import {
  RegisterSchema,
  VerifyRegisterSchema,
  SendOtpSchema,
  LoginPasswordSchema,
  LoginOtpSchema,
  RequestResetSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  SetPasswordSchema,
} from './schemas.ts';

// Importamos las funciones del controlador (auth.controller.ts) que gestionan las rutas.
import {
  register,
  verifyRegister,
  sendOtp,
  resendOtp,
  loginPassword,
  loginOtp,
  requestReset,
  resendResetOtp,
  resetPass,
  changePass, // Asegúrate de que esta función esté exportada en el controlador
  setPass,
} from './auth.controller.ts';

// Creamos una nueva instancia del router.
export const authRouter = Router();

// Ruta de registro: Cuando un usuario se registra con correo y contraseña.
// Utiliza el esquema de validación RegisterSchema y llama a la función register del controlador.
authRouter.post('/register', validate(RegisterSchema), register);

// Ruta de verificación del registro: Después de que el usuario recibe el OTP, lo verifica aquí.
// Utiliza el esquema de validación VerifyRegisterSchema y llama a la función verifyRegister del controlador.
authRouter.post('/verify-register', validate(VerifyRegisterSchema), verifyRegister);

// Ruta alternativa para verificar el registro con OTP.
// Esta ruta es solo un alias para evitar posibles 404 si el usuario usa '/verify-register-otp'.
authRouter.post('/verify-register-otp', validate(VerifyRegisterSchema), verifyRegister);

// Ruta para enviar OTP al correo del usuario, ya sea para login, registro o reset de contraseña.
// Utiliza el esquema de validación SendOtpSchema y llama a la función sendOtp del controlador.
authRouter.post('/send-otp', validate(SendOtpSchema), sendOtp);

// Ruta para reenviar el OTP si el usuario lo necesita, por ejemplo, si el código anterior expiró.
// Utiliza el esquema de validación SendOtpSchema y llama a la función resendOtp del controlador.
authRouter.post('/resend-otp', validate(SendOtpSchema), resendOtp);

// Ruta de login con correo y contraseña.
// Utiliza el esquema de validación LoginPasswordSchema y llama a la función loginPassword del controlador.
authRouter.post('/login-password', validate(LoginPasswordSchema), loginPassword);

// Ruta de login con OTP (cuando el usuario se ha registrado o restablecido la contraseña con OTP).
// Utiliza el esquema de validación LoginOtpSchema y llama a la función loginOtp del controlador.
authRouter.post('/login', validate(LoginOtpSchema), loginOtp);

// Ruta para solicitar un cambio de contraseña (envía un OTP para verificar la identidad del usuario).
// Utiliza el esquema de validación RequestResetSchema y llama a la función requestReset del controlador.
authRouter.post('/request-password-reset', validate(RequestResetSchema), requestReset);

// Ruta para reenviar el OTP de cambio de contraseña si el usuario no recibió el primer código o este expiró.
// Utiliza el esquema de validación RequestResetSchema y llama a la función resendResetOtp del controlador.
authRouter.post('/resend-password-reset', validate(RequestResetSchema), resendResetOtp);

// Ruta para resetear la contraseña, el usuario debe pasar el OTP válido y la nueva contraseña.
// Utiliza el esquema de validación ResetPasswordSchema y llama a la función resetPass del controlador.
authRouter.post('/reset-password', validate(ResetPasswordSchema), resetPass);

// Ruta para cambiar la contraseña, se requiere estar autenticado (JWT) y enviar la contraseña actual junto con la nueva.
// Utiliza el esquema de validación ChangePasswordSchema y llama a la función changePass del controlador.
authRouter.post('/change-password', requireAuth, validate(ChangePasswordSchema), changePass);

// Ruta para establecer una nueva contraseña sin necesidad de la actual (en caso de crear un nuevo password para el usuario).
// Utiliza el esquema de validación SetPasswordSchema y llama a la función setPass del controlador.
authRouter.post('/set-password', requireAuth, validate(SetPasswordSchema), setPass);