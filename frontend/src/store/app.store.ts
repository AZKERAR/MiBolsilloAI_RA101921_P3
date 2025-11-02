import { create } from 'zustand';
import type { Account } from '@/types';

interface AppState {
  // UI State
  isSnackbarVisible: boolean;
  snackbarMessage: string;
  snackbarType: 'success' | 'error' | 'info';
  
  // Selected Account
  selectedAccountId: string | null;
  
  // Actions
  showSnackbar: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideSnackbar: () => void;
  setSelectedAccount: (accountId: string | null) => void;
}

/**
 * Store de estado global de la app
 */
export const useAppStore = create<AppState>((set) => ({
  // Estado inicial
  isSnackbarVisible: false,
  snackbarMessage: '',
  snackbarType: 'info',
  selectedAccountId: null,
  
  // Mostrar snackbar
  showSnackbar: (message, type = 'info') => {
    set({
      isSnackbarVisible: true,
      snackbarMessage: message,
      snackbarType: type,
    });
  },
  
  // Ocultar snackbar
  hideSnackbar: () => {
    set({ isSnackbarVisible: false });
  },
  
  // Establecer cuenta seleccionada
  setSelectedAccount: (accountId) => {
    set({ selectedAccountId: accountId });
  },
}));
