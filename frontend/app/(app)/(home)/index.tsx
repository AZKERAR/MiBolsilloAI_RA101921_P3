import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card as PaperCard, Divider, FAB } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import { useSummary } from '@/hooks/useSummary';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { theme } from '@/theme';

/**
 * Home/Dashboard Screen
 * Muestra resumen de cuentas, balance total y últimas transacciones
 */
export default function HomeScreen() {
  console.log('🏠 [HomeScreen] Renderizando...');
  
  const { accounts, isLoadingAccounts, refetchAccounts } = useAccounts();
  const { transactions, isLoadingTransactions, refetchTransactions } = useTransactions({
    pageSize: 5,
  });
  const { summary, isLoadingSummary, refetchSummary } = useSummary({});

  const [refreshing, setRefreshing] = React.useState(false);

  console.log('🏠 [HomeScreen] Loading states:', { 
    loadingAccounts: isLoadingAccounts, 
    loadingTransactions: isLoadingTransactions, 
    loadingSummary: isLoadingSummary 
  });

  // Log transactions when they change
  React.useEffect(() => {
    if (transactions && transactions.length > 0) {
      console.log('🏠 [HomeScreen] Transactions loaded:', transactions.length);
      transactions.forEach((tx, index) => {
        console.log(`🏠 Transaction ${index + 1}:`, {
          note: tx.note,
          amount: tx.amount,
          categoryId: tx.categoryId,
          categoryName: tx.category?.name || '❌ NO CATEGORY',
          hasCategoryObject: !!tx.category
        });
      });
    }
  }, [transactions]);

  // Calcular balance total desde el summary (totals.net)
  const totalBalance = useMemo(() => {
    if (!summary) return 0;
    return summary.totals.net;
  }, [summary]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchAccounts(),
      refetchTransactions(),
      refetchSummary(),
    ]);
    setRefreshing(false);
  };

  if (isLoadingAccounts || isLoadingTransactions || isLoadingSummary) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Balance Total */}
        <Card>
          <PaperCard.Content>
            <Text variant="labelLarge" style={styles.balanceLabel}>
              Balance Total
            </Text>
            <Text variant="displaySmall" style={styles.balanceAmount}>
              {formatCurrency(totalBalance)}
            </Text>
          </PaperCard.Content>
        </Card>

        {/* Resumen del Mes */}
        {summary && (
          <Card>
            <PaperCard.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Resumen del Mes
              </Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons
                    name="arrow-down"
                    size={24}
                    color={theme.colors.success}
                  />
                  <Text variant="labelMedium" style={styles.summaryLabel}>
                    Ingresos
                  </Text>
                  <Text variant="titleMedium" style={[styles.summaryValue, { color: theme.colors.success }]}>
                    {formatCurrency(summary.totals.inflow)}
                  </Text>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons
                    name="arrow-up"
                    size={24}
                    color={theme.colors.error}
                  />
                  <Text variant="labelMedium" style={styles.summaryLabel}>
                    Gastos
                  </Text>
                  <Text variant="titleMedium" style={[styles.summaryValue, { color: theme.colors.error }]}>
                    {formatCurrency(summary.totals.outflow)}
                  </Text>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons
                    name="wallet"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text variant="labelMedium" style={styles.summaryLabel}>
                    Neto
                  </Text>
                  <Text variant="titleMedium" style={[styles.summaryValue, { color: theme.colors.primary }]}>
                    {formatCurrency(summary.totals.net)}
                  </Text>
                </View>
              </View>
            </PaperCard.Content>
          </Card>
        )}

        {/* Cuentas */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Mis Cuentas
          </Text>
          {accounts?.map((account) => (
            <Card key={account.id}>
              <PaperCard.Content>
                <View style={styles.accountRow}>
                  <View style={styles.accountInfo}>
                    <Text variant="titleMedium">{account.name}</Text>
                    <Text variant="bodySmall" style={styles.accountType}>
                      {account.type === 'cash' ? 'Efectivo' : account.type === 'bank' ? 'Banco' : account.type === 'credit_card' ? 'Tarjeta' : account.type}
                    </Text>
                  </View>
                  <Text variant="titleLarge" style={styles.accountBalance}>
                    {formatCurrency(0)}
                  </Text>
                </View>
              </PaperCard.Content>
            </Card>
          ))}
        </View>

        {/* Últimas Transacciones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Últimas Transacciones
            </Text>
            <Text
              variant="labelLarge"
              style={styles.seeAll}
              onPress={() => router.push('/(app)/(transactions)')}
            >
              Ver todas
            </Text>
          </View>

          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <Card key={transaction.id}>
                <PaperCard.Content>
                  <View style={styles.transactionRow}>
                    <View style={styles.transactionInfo}>
                      <Text variant="titleSmall">{transaction.category?.name || 'Sin categoría'}</Text>
                      <Text variant="bodySmall" style={styles.transactionDate}>
                        {formatDate(new Date(transaction.occurredAt))}
                      </Text>
                      {transaction.note && (
                        <Text variant="bodySmall" style={styles.transactionDescription}>
                          {transaction.note}
                        </Text>
                      )}
                    </View>
                    <Text
                      variant="titleMedium"
                      style={[
                        styles.transactionAmount,
                        {
                          color:
                            transaction.direction === 'inflow'
                              ? theme.colors.success
                              : theme.colors.error,
                        },
                      ]}
                    >
                      {transaction.direction === 'inflow' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                </PaperCard.Content>
              </Card>
            ))
          ) : (
            <Card>
              <PaperCard.Content>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No hay transacciones recientes
                </Text>
              </PaperCard.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* FAB para crear transacción */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(app)/(transactions)/create')}
        label="Nueva"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  balanceLabel: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  balanceAmount: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  seeAll: {
    color: theme.colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  summaryValue: {
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '100%',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountType: {
    color: theme.colors.onSurfaceVariant,
    textTransform: 'capitalize',
  },
  accountBalance: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 8,
  },
  transactionDate: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  transactionDescription: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
    fontStyle: 'italic',
  },
  transactionAmount: {
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
