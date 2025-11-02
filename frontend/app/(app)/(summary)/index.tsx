import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card as PaperCard, Divider, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useSummary } from '@/hooks/useSummary';
import { formatCurrency } from '@/utils/formatters';
import { theme } from '@/theme';

/**
 * Summary Screen
 * Muestra resumen financiero detallado por período
 */
export default function SummaryScreen() {
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const [refreshing, setRefreshing] = useState(false);

  // Calcular rango de fechas según período
  const dateRange = React.useMemo(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), period === 'month' ? now.getMonth() : 0, 1);
    const endDate = new Date(now.getFullYear(), period === 'month' ? now.getMonth() + 1 : 12, 0);

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }, [period]);

  const { summary, isLoadingSummary, refetchSummary } = useSummary({
    from: dateRange.startDate,
    to: dateRange.endDate,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchSummary();
    setRefreshing(false);
  };

  if (isLoadingSummary) {
    return <LoadingSpinner fullScreen />;
  }

  if (!summary) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="chart-bar"
          size={64}
          color={theme.colors.surfaceVariant}
        />
        <Text variant="titleMedium" style={styles.emptyText}>
          No hay datos disponibles
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Selector de período */}
      <View style={styles.periodSelector}>
        <SegmentedButtons
          value={period}
          onValueChange={(value) => setPeriod(value as 'month' | 'year')}
          buttons={[
            { value: 'month', label: 'Este Mes', icon: 'calendar-month' },
            { value: 'year', label: 'Este Año', icon: 'calendar' },
          ]}
        />
      </View>

      {/* Balance Neto */}
      <Card>
        <PaperCard.Content>
          <Text variant="labelLarge" style={styles.label}>
            Balance Neto
          </Text>
          <Text
            variant="displayMedium"
            style={[
              styles.netBalance,
              {
                color:
                  summary.totals.net >= 0 ? theme.colors.success : theme.colors.error,
              },
            ]}
          >
            {formatCurrency(summary.totals.net)}
          </Text>
        </PaperCard.Content>
      </Card>

      {/* Ingresos vs Gastos */}
      <Card>
        <PaperCard.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Resumen
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons
                name="arrow-down-circle"
                size={32}
                color={theme.colors.success}
              />
              <Text variant="labelMedium" style={styles.summaryLabel}>
                Ingresos
              </Text>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: theme.colors.success }]}>
                {formatCurrency(summary.totals.inflow)}
              </Text>
            </View>

            <Divider style={styles.verticalDivider} />

            <View style={styles.summaryItem}>
              <MaterialCommunityIcons
                name="arrow-up-circle"
                size={32}
                color={theme.colors.error}
              />
              <Text variant="labelMedium" style={styles.summaryLabel}>
                Gastos
              </Text>
              <Text variant="headlineSmall" style={[styles.summaryValue, { color: theme.colors.error }]}>
                {formatCurrency(summary.totals.outflow)}
              </Text>
            </View>
          </View>
        </PaperCard.Content>
      </Card>

      {/* Gastos por Categoría */}
      {summary.expensesByCategory && summary.expensesByCategory.length > 0 && (
        <Card>
          <PaperCard.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Gastos por Categoría
            </Text>

            <View style={styles.categoriesList}>
              {summary.expensesByCategory.map((item, index) => {
                const percentage = summary.totals.outflow > 0
                  ? (item.total / summary.totals.outflow) * 100
                  : 0;

                return (
                  <View key={index}>
                    <View style={styles.categoryRow}>
                      <View style={styles.categoryInfo}>
                        <Text variant="titleSmall">{item.categoryName}</Text>
                        <Text variant="bodySmall" style={styles.percentage}>
                          {percentage.toFixed(1)}%
                        </Text>
                      </View>
                      <Text variant="titleMedium" style={styles.categoryAmount}>
                        {formatCurrency(item.total)}
                      </Text>
                    </View>

                    {/* Barra de progreso */}
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${percentage}%`,
                            backgroundColor: theme.colors.primary,
                          },
                        ]}
                      />
                    </View>

                    {index < summary.expensesByCategory.length - 1 && (
                      <Divider style={styles.divider} />
                    )}
                  </View>
                );
              })}
            </View>
          </PaperCard.Content>
        </Card>
      )}

      {/* Ingresos por Categoría */}
      {summary.incomeByCategory && summary.incomeByCategory.length > 0 && (
        <Card>
          <PaperCard.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Ingresos por Categoría
            </Text>

            <View style={styles.categoriesList}>
              {summary.incomeByCategory.map((item, index) => {
                const percentage = summary.totalIncome > 0
                  ? (item.total / summary.totalIncome) * 100
                  : 0;

                return (
                  <View key={index}>
                    <View style={styles.categoryRow}>
                      <View style={styles.categoryInfo}>
                        <Text variant="titleSmall">{item.categoryName}</Text>
                        <Text variant="bodySmall" style={styles.percentage}>
                          {percentage.toFixed(1)}%
                        </Text>
                      </View>
                      <Text variant="titleMedium" style={[styles.categoryAmount, { color: theme.colors.success }]}>
                        {formatCurrency(item.total)}
                      </Text>
                    </View>

                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${percentage}%`,
                            backgroundColor: theme.colors.success,
                          },
                        ]}
                      />
                    </View>

                    {index < summary.incomeByCategory.length - 1 && (
                      <Divider style={styles.divider} />
                    )}
                  </View>
                );
              })}
            </View>
          </PaperCard.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  periodSelector: {
    marginBottom: 16,
  },
  label: {
    color: theme.colors.surfaceVariant,
    marginBottom: 8,
  },
  netBalance: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    color: theme.colors.surfaceVariant,
    marginTop: 8,
  },
  summaryValue: {
    fontWeight: '600',
    marginTop: 4,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
  },
  categoriesList: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flex: 1,
  },
  percentage: {
    color: theme.colors.surfaceVariant,
    marginTop: 2,
  },
  categoryAmount: {
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  divider: {
    marginVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  emptyText: {
    marginTop: 16,
    color: theme.colors.surfaceVariant,
  },
});
