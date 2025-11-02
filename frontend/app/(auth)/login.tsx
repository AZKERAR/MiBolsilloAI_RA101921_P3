import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail, isValidPassword } from '@/utils/validators';

export default function LoginScreen() {
  const router = useRouter();
  const { loginPassword, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!isValidEmail(email)) {
      newErrors.email = 'Email inválido';
    }
    if (!isValidPassword(password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    console.log('🔧 [Login] Intentando login...', { email, passwordLength: password.length });
    
    if (!validate()) {
      console.warn('⚠️ [Login] Validación fallida');
      return;
    }
    
    console.log('✅ [Login] Validación exitosa, llamando loginPassword...');
    loginPassword({ email, password });
  };

  return (
    <AuthLayout
      title="Iniciar Sesión"
      subtitle="Bienvenido de vuelta a MiBolsillo"
    >
      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        
        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />

        <Button
          title="Iniciar Sesión"
          onPress={handleLogin}
          loading={isLoggingIn}
          disabled={isLoggingIn}
          fullWidth
          style={styles.button}
        />

        <View style={styles.links}>
          <Link href="/(auth)/register" asChild>
            <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
          </Link>
        </View>

        <Divider style={styles.divider} />

        <Text style={styles.footerText}>
          Al iniciar sesión, aceptas nuestros{'\n'}
          Términos y Condiciones
        </Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  button: {
    marginTop: 8,
  },
  links: {
    alignItems: 'center',
    marginTop: 8,
  },
  link: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6B7280',
  },
});
