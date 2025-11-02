import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isRegistering } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    register({ email, password });
    
    // Navegar a verificación OTP
    setTimeout(() => {
      router.push({ pathname: '/(auth)/verify-otp', params: { email } });
    }, 1000);
  };

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Comienza a gestionar tus finanzas"
    >
      <View style={styles.form}>
        <Input
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email"
        />
        
        <Input
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Contraseña (min. 8 caracteres)"
        />

        <Input
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirmar contraseña"
        />

        <Button
          title="Registrarse"
          onPress={handleRegister}
          loading={isRegistering}
          disabled={isRegistering}
          fullWidth
          style={styles.button}
        />

        <View style={styles.links}>
          <Link href="/(auth)/login" asChild>
            <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
          </Link>
        </View>
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
});
