import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, HelperText, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { AmountInput } from '@/components/ui/AmountInput';
import { useAccounts } from '@/hooks/useAccounts';
import { ACCOUNT_TYPES } from '@/config/constants';
import { theme } from '@/theme';

/**
 * Onboarding Screen
 * Primera pantalla después del registro exitoso
 * Permite crear la cuenta inicial del usuario (obligatorio por backend)
 */
export default function OnboardingScreen() {
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<string>('bank');
  const [initialBalance, setInitialBalance] = useState('0.00');
  const [currency, setCurrency] = useState('USD');

  const { initializeAccount, accounts, isLoadingAccounts, isInitializing } = useAccounts();

  // Si el usuario ya tiene cuentas, permitir saltar
  const handleSkip = () => {
    router.replace('/(app)/(home)');
  };

  const handleContinue = () => {
    if (!accountName.trim()) {
      return;
    }

    initializeAccount({
      name: accountName.trim(),
      type: accountType,
      initialAmount: parseFloat(initialBalance),
      currency,
    });

    // Redirigir al dashboard después de crear la cuenta
    router.replace('/(app)/(home)');
  };

  const isValid = accountName.trim().length > 0 && parseFloat(initialBalance) >= 0;
  const hasAccounts = accounts && accounts.length > 0;

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.emoji}>
            💰
          </Text>
          <Text variant="headlineMedium" style={styles.title}>
            ¡Bienvenido a MiBolsillo!
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Configura tu primera cuenta para comenzar
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nombre de la cuenta"
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Ej: Cuenta principal"
            autoCapitalize="words"
          />

          <View style={styles.field}>
            <Text variant="labelLarge" style={styles.label}>
              Tipo de cuenta
            </Text>
            <SegmentedButtons
              value={accountType}
              onValueChange={setAccountType}
              buttons={[
                {
                  value: 'bank',
                  label: 'Débito',
                  icon: 'credit-card',
                },
                {
                  value: 'credit_card',
                  label: 'Crédito',
                  icon: 'credit-card-outline',
                },
                {
                  value: 'cash',
                  label: 'Efectivo',
                  icon: 'cash',
                },
              ]}
            />
          </View>

          <AmountInput
            label="Saldo inicial"
            value={initialBalance}
            onChangeText={setInitialBalance}
          />

          <Input
            label="Moneda"
            value={currency}
            onChangeText={setCurrency}
            placeholder="MXN, USD, EUR..."
            autoCapitalize="characters"
            maxLength={3}
          />

          <HelperText type="info" visible={true}>
            Puedes agregar más cuentas después desde Configuración
          </HelperText>
        </View>

        <View style={styles.footer}>
          {hasAccounts && (
            <Button
              title="Saltar"
              onPress={handleSkip}
              mode="outlined"
              fullWidth
              style={{ marginBottom: 12 }}
            />
          )}
          <Button
            title="Continuar"
            onPress={handleContinue}
            disabled={!isValid || isInitializing}
            loading={isInitializing}
            fullWidth
          />
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    opacity: 0.7,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 24,
  },
});
