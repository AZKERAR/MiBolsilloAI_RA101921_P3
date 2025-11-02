import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Paleta de colores - Opción A: Moderna y Profesional (Verde/Azul)
export const colors = {
  // Primarios
  primary: '#10B981',      // Verde esmeralda
  secondary: '#3B82F6',    // Azul
  
  // Estados
  success: '#22C55E',      // Verde brillante
  error: '#EF4444',        // Rojo
  warning: '#F59E0B',      // Ámbar
  info: '#06B6D4',         // Cyan
  
  // Neutrales
  background: '#FFFFFF',   // Blanco
  surface: '#F3F4F6',      // Gris muy claro
  surfaceVariant: '#E5E7EB', // Gris claro
  text: '#111827',         // Negro suave
  textSecondary: '#6B7280', // Gris
  textDisabled: '#9CA3AF', // Gris claro
  
  // Bordes
  border: '#D1D5DB',       // Gris medio
  divider: '#E5E7EB',      // Gris claro
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
  
  // Dark mode (opcional para futuro)
  dark: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
  },
} as const;

// Configuración de React Native Paper (Light Theme)
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    onSurface: colors.text,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.border,
  },
  roundness: 12,
};

// Configuración de React Native Paper (Dark Theme - opcional)
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    background: colors.dark.background,
    surface: colors.dark.surface,
    onSurface: colors.dark.text,
    onSurfaceVariant: colors.dark.textSecondary,
  },
  roundness: 12,
};

// Tipografía
export const typography = {
  // Headers (Poppins)
  h1: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  h2: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
  },
  h3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  h4: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  h5: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  h6: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  
  // Body (Roboto)
  body1: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  body2: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  caption: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  
  // Especiales
  button: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500' as const,
    textTransform: 'none' as const,
  },
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
} as const;

// Spacing (basado en 8px grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Shadows
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

// Border radius
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  lightTheme,
  darkTheme,
} as const;

export type Theme = typeof theme;
