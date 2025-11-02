import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types';
import { storage as secureStorage } from '@/lib/storage';

interface AuthState {
  // Estado
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Acciones
  setAuth: (token: string, user: User) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

/**
 * Store de autenticación con Zustand
 * Persiste el user en AsyncStorage y el token en SecureStore
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      // Establecer auth (login exitoso)
      setAuth: async (token: string, user: User) => {
        console.log('🔧 [AuthStore] setAuth llamado:', { user: user.email, hasToken: !!token });
        await secureStorage.saveToken(token);
        await secureStorage.saveUser(user);
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        console.log('✅ [AuthStore] Auth establecido exitosamente');
      },
      
      // Actualizar solo el user
      setUser: async (user: User) => {
        console.log('🔧 [AuthStore] setUser llamado:', user.email);
        await secureStorage.saveUser(user);
        set({ user });
      },
      
      // Cerrar sesión
      logout: async () => {
        console.log('🔧 [AuthStore] logout llamado');
        await secureStorage.clearAllData();
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        console.log('✅ [AuthStore] Sesión cerrada');
      },
      
      // Inicializar (cargar token y user desde storage)
      initialize: async () => {
        try {
          console.log('🔧 [AuthStore] Inicializando...');
          const token = await secureStorage.getToken();
          const user = await secureStorage.getUser();
          
          console.log('🔧 [AuthStore] Datos cargados:', {
            hasToken: !!token,
            hasUser: !!user,
            userEmail: user?.email,
          });
          
          if (token && user) {
            set({
              token,
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            console.log('✅ [AuthStore] Usuario autenticado desde storage');
          } else {
            set({ isLoading: false });
            console.log('ℹ️ [AuthStore] No hay sesión guardada');
          }
        } catch (error) {
          console.error('❌ [AuthStore] Error initializing auth:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir user (token va a SecureStore)
      partialize: (state) => ({ user: state.user }),
    }
  )
);
