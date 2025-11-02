import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { queryClient, asyncStoragePersister } from '@/lib/query-client';
import { lightTheme } from '@/theme';
import { useAuthStore } from '@/store';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  // Inicializar auth store
  useEffect(() => {
    console.log('🔧 [RootLayout] Inicializando auth store...');
    initialize();
  }, []);

  // Manejar redirecciones basadas en auth
  useEffect(() => {
    console.log('🔧 [RootLayout] Auth state:', {
      isAuthenticated,
      isLoading,
      segments: segments.join('/'),
    });

    if (isLoading) {
      console.log('⏳ [RootLayout] Auth loading, esperando...');
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    console.log('🔧 [RootLayout] Grupos:', { inAuthGroup, inAppGroup });

    if (!isAuthenticated && !inAuthGroup) {
      // No autenticado → redirigir a login
      console.log('➡️ [RootLayout] No autenticado, redirigiendo a login');
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Autenticado en auth → redirigir a onboarding
      // El usuario podrá saltar al app si ya tiene cuentas
      console.log('➡️ [RootLayout] Autenticado, redirigiendo a onboarding');
      router.replace('/onboarding');
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    // Puedes mostrar un splash screen aquí
    console.log('⏳ [RootLayout] Renderizando null (loading)');
    return null;
  }

  console.log('✅ [RootLayout] Renderizando app');

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={lightTheme}>
          <StatusBar style="auto" />
          <Slot />
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
