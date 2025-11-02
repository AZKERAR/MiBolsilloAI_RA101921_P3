import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, SegmentedButtons, Menu, Button as PaperButton } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { AmountInput } from '@/components/ui/AmountInput';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { useAI } from '@/hooks/useAI';
import { theme } from '@/theme';
import { useAppStore } from '@/store/app.store';

/**
 * Create Transaction Screen
 * Formulario para crear nueva transacción
 */
export default function CreateTransactionScreen() {
  const showSnackbar = useAppStore((state) => state.showSnackbar);

  const [direction, setDirection] = useState<'inflow' | 'outflow'>('outflow');
  const [amount, setAmount] = useState('0.00');
  const [description, setDescription] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().split('T')[0]);

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const { createTransaction, isCreating } = useTransactions({});
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { categorize, isLoadingCategorize } = useAI();

  const selectedAccount = accounts?.find((a) => a.id === selectedAccountId);
  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);

  // Sugerir categoría con IA
  const handleSuggestCategory = () => {
    if (!description.trim()) {
      showSnackbar('Escribe una descripción primero', 'info');
      return;
    }

    if (!categories || categories.length === 0) {
      showSnackbar('Crea categorías primero en Configuración', 'info');
      return;
    }

    const amountValue = parseFloat(amount) || 0;

    console.log('🤖 [CreateTransaction] Starting AI categorization...');
    console.log('📝 Description:', description.trim());
    console.log('💰 Amount:', amountValue);
    console.log('📚 Available categories:', categories.map(c => c.name));

    categorize({
      text: description.trim(),
      amount: amountValue,
      categories: categories.map(c => c.name),
    });
  };

  const handleCreate = () => {
    console.log('➕ [CreateTransaction] Creating transaction...');
    
    if (!selectedAccountId) {
      console.log('❌ [CreateTransaction] No account selected');
      showSnackbar('Selecciona una cuenta', 'error');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      console.log('❌ [CreateTransaction] Invalid amount:', amount);
      showSnackbar('Ingresa un monto válido', 'error');
      return;
    }

    const transactionData = {
      accountId: selectedAccountId,
      categoryId: selectedCategoryId || undefined,
      amount: amountValue,
      direction,
      note: description.trim() || undefined,
      occurredAt,
      currency: selectedAccount?.currency || 'USD',
    };

    console.log('📤 [CreateTransaction] Transaction data:', JSON.stringify(transactionData, null, 2));

    createTransaction(transactionData);

    router.back();
  };

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Nueva Transacción
          </Text>
        </View>

        {/* Tipo de transacción */}
        <View style={styles.field}>
          <Text variant="labelLarge" style={styles.label}>
            Tipo
          </Text>
          <SegmentedButtons
            value={direction}
            onValueChange={(value) => setDirection(value as 'inflow' | 'outflow')}
            buttons={[
              {
                value: 'inflow',
                label: 'Ingreso',
                icon: 'arrow-down',
              },
              {
                value: 'outflow',
                label: 'Gasto',
                icon: 'arrow-up',
              },
            ]}
          />
        </View>

        {/* Monto */}
        <AmountInput label="Monto" value={amount} onChangeText={setAmount} />

        {/* Descripción */}
        <Input
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          placeholder="Ej: Compra en supermercado"
          multiline
          numberOfLines={2}
        />

        {/* Botón sugerir categoría con IA */}
        {description.trim().length > 0 && categories && categories.length > 0 && (
          <PaperButton
            mode="outlined"
            icon="auto-fix"
            onPress={handleSuggestCategory}
            loading={isLoadingCategorize}
            disabled={isLoadingCategorize}
            style={styles.aiButton}
          >
            Sugerir categoría con IA
          </PaperButton>
        )}

        {/* Cuenta */}
        <View style={styles.field}>
          <Text variant="labelLarge" style={styles.label}>
            Cuenta
          </Text>
          <Menu
            visible={accountMenuVisible}
            onDismiss={() => setAccountMenuVisible(false)}
            anchor={
              <PaperButton
                mode="outlined"
                onPress={() => setAccountMenuVisible(true)}
                icon="credit-card"
                contentStyle={styles.menuButton}
              >
                {selectedAccount?.name || 'Seleccionar cuenta'}
              </PaperButton>
            }
          >
            {accounts?.map((account) => (
              <Menu.Item
                key={account.id}
                onPress={() => {
                  setSelectedAccountId(account.id);
                  setAccountMenuVisible(false);
                }}
                title={account.name}
                leadingIcon="credit-card"
              />
            ))}
          </Menu>
        </View>

        {/* Categoría */}
        <View style={styles.field}>
          <Text variant="labelLarge" style={styles.label}>
            Categoría
          </Text>
          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <PaperButton
                mode="outlined"
                onPress={() => setCategoryMenuVisible(true)}
                icon="tag"
                contentStyle={styles.menuButton}
              >
                {selectedCategory?.name || 'Seleccionar categoría'}
              </PaperButton>
            }
          >
            {categories?.map((category) => (
              <Menu.Item
                key={category.id}
                onPress={() => {
                  setSelectedCategoryId(category.id);
                  setCategoryMenuVisible(false);
                }}
                title={category.name}
                leadingIcon="tag"
              />
            ))}
          </Menu>
        </View>

        {/* Fecha */}
        <Input
          label="Fecha"
          value={occurredAt}
          onChangeText={setOccurredAt}
          placeholder="YYYY-MM-DD"
        />

        {/* Botones */}
        <View style={styles.actions}>
          <Button
            title="Cancelar"
            onPress={() => router.back()}
            variant="outlined"
            fullWidth
            style={styles.button}
          />
          <Button
            title="Crear"
            onPress={handleCreate}
            loading={isCreating}
            disabled={isCreating || !selectedAccountId}
            fullWidth
            style={styles.button}
          />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: theme.colors.text,
  },
  menuButton: {
    justifyContent: 'flex-start',
  },
  aiButton: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
});
