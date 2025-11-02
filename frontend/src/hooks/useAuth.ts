import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api';
import { useAuthStore } from '@/store';
import { useAppStore } from '@/store';
import { handleApiError } from '@/utils/error-handler';
import type {
  RegisterRequest,
  VerifyRegisterRequest,
  SendOtpRequest,
  LoginPasswordRequest,
  LoginOtpRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '@/types';

/**
 * Hook para autenticación
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setAuth, logout: logoutStore } = useAuthStore();
  const { showSnackbar } = useAppStore();

  // Registro
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => {
      console.log('🔧 [useAuth] Registrando usuario:', data.email);
      return authApi.register(data);
    },
    onSuccess: (response) => {
      console.log('✅ [useAuth] Registro exitoso:', response);
      showSnackbar(response.message, 'success');
    },
    onError: (error) => {
      console.error('❌ [useAuth] Error en registro:', error);
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Verificar registro
  const verifyRegisterMutation = useMutation({
    mutationFn: (data: VerifyRegisterRequest) => {
      console.log('🔧 [useAuth] Verificando código:', data);
      return authApi.verifyRegister(data);
    },
    onSuccess: (response) => {
      console.log('✅ [useAuth] Verificación exitosa:', response);
      showSnackbar(response.message, 'success');
    },
    onError: (error) => {
      console.error('❌ [useAuth] Error en verificación:', error);
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Enviar OTP
  const sendOtpMutation = useMutation({
    mutationFn: (data: SendOtpRequest) => authApi.sendOtp(data),
    onSuccess: (response) => {
      showSnackbar(response.message, 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Reenviar OTP
  const resendOtpMutation = useMutation({
    mutationFn: (data: SendOtpRequest) => authApi.resendOtp(data),
    onSuccess: (response) => {
      showSnackbar(response.message, 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Login con contraseña
  const loginPasswordMutation = useMutation({
    mutationFn: (data: LoginPasswordRequest) => {
      console.log('🔧 [useAuth] Login con password:', data.email);
      return authApi.loginPassword(data);
    },
    onSuccess: async (response) => {
      console.log('✅ [useAuth] Login exitoso:', { user: response.user, hasToken: !!response.token });
      await setAuth(response.token, response.user);
      showSnackbar('Bienvenido a MiBolsillo', 'success');
    },
    onError: (error) => {
      console.error('❌ [useAuth] Error en login:', error);
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Login con OTP
  const loginOtpMutation = useMutation({
    mutationFn: (data: LoginOtpRequest) => authApi.loginOtp(data),
    onSuccess: async (response) => {
      await setAuth(response.token, response.user);
      showSnackbar('Bienvenido a MiBolsillo', 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Solicitar reset de contraseña
  const requestPasswordResetMutation = useMutation({
    mutationFn: (data: RequestPasswordResetRequest) =>
      authApi.requestPasswordReset(data),
    onSuccess: (response) => {
      showSnackbar(response.message, 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Resetear contraseña
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: (response) => {
      showSnackbar(response.message, 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Cambiar contraseña
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: (response) => {
      showSnackbar(response.message, 'success');
    },
    onError: (error) => {
      const message = handleApiError(error);
      showSnackbar(message, 'error');
    },
  });

  // Logout
  const logout = async () => {
    await logoutStore();
    queryClient.clear(); // Limpiar cache
    showSnackbar('Sesión cerrada', 'info');
  };

  return {
    // Mutations
    register: registerMutation.mutate,
    verifyRegister: verifyRegisterMutation.mutate,
    sendOtp: sendOtpMutation.mutate,
    resendOtp: resendOtpMutation.mutate,
    loginPassword: loginPasswordMutation.mutate,
    loginOtp: loginOtpMutation.mutate,
    requestPasswordReset: requestPasswordResetMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    logout,

    // Loading states
    isRegistering: registerMutation.isPending,
    isVerifying: verifyRegisterMutation.isPending,
    isSendingOtp: sendOtpMutation.isPending,
    isLoggingIn: loginPasswordMutation.isPending || loginOtpMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
