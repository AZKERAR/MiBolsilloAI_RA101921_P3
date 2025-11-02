import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/components/ui/OTPInput';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyRegister, resendOtp, isVerifying } = useAuth();
  const [code, setCode] = useState('');

  console.log('🔧 [VerifyOTP] Screen montada, email:', email);

  const handleVerify = () => {
    console.log('🔧 [VerifyOTP] Verificando código:', { email, code, codeLength: code.length });
    
    if (code.length === 6) {
      verifyRegister({ email: email || '', code });
      
      // Navegar a login después de verificar
      setTimeout(() => {
        console.log('➡️ [VerifyOTP] Navegando a login...');
        router.replace('/(auth)/login');
      }, 2000);
    } else {
      console.warn('⚠️ [VerifyOTP] Código incompleto:', code.length);
    }
  };

  const handleResend = () => {
    console.log('🔧 [VerifyOTP] Reenviando código a:', email);
    resendOtp({ email: email || '', purpose: 'register' });
  };

  return (
    <AuthLayout
      title="Verificar Email"
      subtitle={`Ingresa el código enviado a\n${email}`}
    >
      <View style={styles.container}>
        <OTPInput
          value={code}
          onChangeText={setCode}
        />

        <Button
          title="Verificar"
          onPress={handleVerify}
          loading={isVerifying}
          disabled={isVerifying || code.length < 6}
          fullWidth
          style={styles.button}
        />

        <Button
          title="Reenviar código"
          onPress={handleResend}
          variant="text"
          fullWidth
          style={styles.resendButton}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  button: {
    marginTop: 8,
  },
  resendButton: {
    marginTop: 8,
  },
});
