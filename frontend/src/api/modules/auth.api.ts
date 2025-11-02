import { apiClient } from '@/lib/axios-client';
import { endpoints } from '../endpoints';
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyRegisterRequest,
  VerifyRegisterResponse,
  SendOtpRequest,
  SendOtpResponse,
  LoginPasswordRequest,
  LoginPasswordResponse,
  LoginOtpRequest,
  LoginOtpResponse,
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@/types';

/**
 * Servicio de API para autenticación
 */
export const authApi = {
  /**
   * POST /auth/register
   * Registra un nuevo usuario
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      endpoints.auth.register,
      data
    );
    return response.data;
  },

  /**
   * POST /auth/verify-register
   * Verifica el código OTP de registro
   */
  verifyRegister: async (data: VerifyRegisterRequest): Promise<VerifyRegisterResponse> => {
    const response = await apiClient.post<VerifyRegisterResponse>(
      endpoints.auth.verifyRegister,
      data
    );
    return response.data;
  },

  /**
   * POST /auth/send-otp
   * Envía código OTP
   */
  sendOtp: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
    const response = await apiClient.post<SendOtpResponse>(
      endpoints.auth.sendOtp,
      data
    );
    return response.data;
  },

  /**
   * POST /auth/resend-otp
   * Reenvía código OTP
   */
  resendOtp: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
    const response = await apiClient.post<SendOtpResponse>(
      endpoints.auth.resendOtp,
      data
    );
    return response.data;
  },

  /**
   * POST /auth/login-password
   * Login con email y contraseña
   */
  loginPassword: async (data: LoginPasswordRequest): Promise<LoginPasswordResponse> => {
    const response = await apiClient.post<LoginPasswordResponse>(
      endpoints.auth.loginPassword,
      data
    );
    return response.data;
  },

  /**
   * POST /auth/login
   * Login con código OTP
   */
  loginOtp: async (data: LoginOtpRequest): Promise<LoginOtpResponse> => {
    const response = await apiClient.post<LoginOtpResponse>(
      endpoints.auth.loginOtp,
      data
    );
    return response.data;
  },

  /**
   * POST /auth/request-password-reset
   * Solicita reseteo de contraseña
   */
  requestPasswordReset: async (
    data: RequestPasswordResetRequest
  ): Promise<RequestPasswordResetResponse> => {
    const response = await apiClient.post<RequestPasswordResetResponse>(
      endpoints.auth.requestPasswordReset,
      data
    );
    return response.data;
  },

  /**
   * POST /auth/reset-password
   * Resetea contraseña con código OTP
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post<ResetPasswordResponse>(
      endpoints.auth.resetPassword,
      data
    );
    return response.data;
  },

  /**
   * POST /auth/change-password
   * Cambia contraseña (requiere autenticación)
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await apiClient.post<ChangePasswordResponse>(
      endpoints.auth.changePassword,
      data
    );
    return response.data;
  },
};
