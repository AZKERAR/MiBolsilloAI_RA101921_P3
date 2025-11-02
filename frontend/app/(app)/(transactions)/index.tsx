import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Searchbar, Chip, FAB, Menu, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { theme } from '@/theme';
import type { Transaction } from '@/types/models.types';

/**
 * Transactions List Screen
 * Muestra lista de transacciones con filtros y búsqueda
 */
export default function TransactionsScreen() {
  const [search, setSearch] = useState('');
  const [filterDirection, setFilterDirection] = useState<'inflow' | 'outflow' | undefined>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    transactions,
    isLoadingTransactions,
    refetchTransactions,
  } = useTransactions({
    direction: filterDirection,
    pageSize: 20,
  });

  // compute filtered transactions (keep this hook unconditionally at top-level
  // so hooks order doesn't change between renders when we early-return)
  const filteredTransactions = React.useMemo(() => {
    if (!transactions) return [];
    if (!search) return transactions;

    return transactions.filter(
      (t) =>
        t.note?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchTransactions();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    // Pagination can be added here if needed
  };

  const clearFilters = () => {
    setFilterDirection(undefined);
    setSearch('');
  };

  if (isLoadingTransactions) {
    return <LoadingSpinner fullScreen />;
  }

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Card>
      <View style={styles.transactionCard}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={item.direction === 'inflow' ? 'arrow-down' : 'arrow-up'}
            size={24}
            color={item.direction === 'inflow' ? theme.colors.success : theme.colors.error}
          />
        </View>

        <View style={styles.transactionInfo}>
          <Text variant="titleMedium">{item.category?.name || 'Sin categoría'}</Text>
          {item.note && (
            <Text variant="bodySmall" style={styles.description}>
              {item.note}
            </Text>
          )}
          <Text variant="bodySmall" style={styles.date}>
            {formatDate(new Date(item.occurredAt))}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text
            variant="titleLarge"
            style={[
              styles.amount,
              {
                color:
                  item.direction === 'inflow' ? theme.colors.success : theme.colors.error,
              },
            ]}
          >
            {item.direction === 'inflow' ? '+' : '-'}
            {formatCurrency(item.amount)}
          </Text>
        </View>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="swap-horizontal"
        size={64}
        color={theme.colors.onSurfaceVariant}
      />
      <Text variant="titleMedium" style={styles.emptyText}>
        No hay transacciones
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtext}>
        Comienza registrando tu primera transacción
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Búsqueda */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar transacciones..."
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />

        {/* Filtros */}
        <View style={styles.filters}>
          <Chip
            selected={filterDirection === 'inflow'}
            onPress={() =>
              setFilterDirection(filterDirection === 'inflow' ? undefined : 'inflow')
            }
            icon="arrow-down"
            style={styles.chip}
          >
            Ingresos
          </Chip>
          <Chip
            selected={filterDirection === 'outflow'}
            onPress={() =>
              setFilterDirection(filterDirection === 'outflow' ? undefined : 'outflow')
            }
            icon="arrow-up"
            style={styles.chip}
          >
            Gastos
          </Chip>

          {(filterDirection || search) && (
            <IconButton
              icon="close-circle"
              size={20}
              onPress={clearFilters}
              iconColor={theme.colors.error}
            />
          )}
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={null}
      />

      {/* FAB */}
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
  header: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  searchbar: {
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  description: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  date: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  amountContainer: {
    marginLeft: 8,
  },
  amount: {
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    color: theme.colors.onSurfaceVariant,
  },
  emptySubtext: {
    marginTop: 8,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
