import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Card as PaperCard, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenLayout from '@/components/layouts/ScreenLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useAI } from '@/hooks/useAI';
import { useAppStore } from '@/store/app.store';
import { theme } from '@/theme';

/**
 * AI Tips Screen
 * Pantalla para obtener consejos de ahorro con IA
 */
export default function AITipsScreen() {
  const showSnackbar = useAppStore((state) => state.showSnackbar);
  const { getTips, tipsData, isLoadingTips } = useAI();

  const [prompt, setPrompt] = useState('');

  const handleGetTips = () => {
    if (!prompt.trim()) {
      showSnackbar('Escribe tu objetivo de ahorro', 'error');
      return;
    }

    console.log('🔧 [AITips] Solicitando tips...', { prompt });
    getTips({ prompt: prompt.trim() });
  };

  const handleClear = () => {
    setPrompt('');
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons name="robot" size={48} color={theme.colors.primary} />
            <Text variant="headlineMedium" style={styles.title}>
              Asistente de Ahorro IA
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Cuéntame tu meta y te ayudaré a crear un plan
            </Text>
          </View>

          {/* Input */}
          <Card>
            <PaperCard.Content>
              <Input
                label="Tu objetivo"
                value={prompt}
                onChangeText={setPrompt}
                placeholder="Ej: Quiero ahorrar 200 dólares en 4 semanas para comprar audífonos"
                multiline
                numberOfLines={4}
                style={styles.input}
              />

              <View style={styles.actions}>
                <Button
                  title="Limpiar"
                  onPress={handleClear}
                  variant="outlined"
                  style={styles.actionButton}
                />
                <Button
                  title="Obtener Plan"
                  onPress={handleGetTips}
                  loading={isLoadingTips}
                  disabled={isLoadingTips || !prompt.trim()}
                  style={styles.actionButton}
                />
              </View>
            </PaperCard.Content>
          </Card>

          {/* Resultados */}
          {tipsData && (
            <View style={styles.results}>
              {/* Resumen */}
              <Card>
                <PaperCard.Content>
                  <View style={styles.resultHeader}>
                    <MaterialCommunityIcons name="lightbulb" size={24} color={theme.colors.warning} />
                    <Text variant="titleLarge" style={styles.resultTitle}>
                      Resumen
                    </Text>
                  </View>
                  <Text variant="bodyLarge" style={styles.resultText}>
                    {tipsData.data.resumen}
                  </Text>
                </PaperCard.Content>
              </Card>

              {/* Meta */}
              <Card>
                <PaperCard.Content>
                  <View style={styles.resultHeader}>
                    <MaterialCommunityIcons name="target" size={24} color={theme.colors.primary} />
                    <Text variant="titleLarge" style={styles.resultTitle}>
                      Tu Meta
                    </Text>
                  </View>
                  <Text variant="bodyMedium" style={styles.metaText}>
                    {tipsData.data.meta.descripcion}
                  </Text>
                  <View style={styles.metaAmount}>
                    <Text variant="headlineMedium" style={styles.amount}>
                      ${tipsData.data.meta.monto_objetivo.toFixed(2)}
                    </Text>
                    <Text variant="bodyMedium" style={styles.metaPeriod}>
                      en {tipsData.data.meta.plazo.valor} {tipsData.data.meta.plazo.unidad === 'weeks' ? 'semanas' : 'meses'}
                    </Text>
                  </View>
                </PaperCard.Content>
              </Card>

              {/* Plan de Ahorro */}
              <Card>
                <PaperCard.Content>
                  <View style={styles.resultHeader}>
                    <MaterialCommunityIcons name="calendar-check" size={24} color={theme.colors.success} />
                    <Text variant="titleLarge" style={styles.resultTitle}>
                      Plan de Ahorro
                    </Text>
                  </View>
                  <View style={styles.planRow}>
                    <Text variant="bodyLarge">Ahorrar por periodo:</Text>
                    <Text variant="titleLarge" style={styles.planAmount}>
                      ${tipsData.data.plan.aporte_por_periodo.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.planRow}>
                    <Text variant="bodyLarge">Número de periodos:</Text>
                    <Text variant="titleLarge" style={styles.planAmount}>
                      {tipsData.data.plan.periodos}
                    </Text>
                  </View>
                </PaperCard.Content>
              </Card>

              {/* Consejos */}
              <Card>
                <PaperCard.Content>
                  <View style={styles.resultHeader}>
                    <MaterialCommunityIcons name="hand-coin" size={24} color={theme.colors.info} />
                    <Text variant="titleLarge" style={styles.resultTitle}>
                      Consejos para Ahorrar
                    </Text>
                  </View>
                  {tipsData.data.consejos.map((consejo, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text variant="bodyMedium">• {consejo}</Text>
                    </View>
                  ))}
                </PaperCard.Content>
              </Card>

              {/* Riesgos */}
              <Card>
                <PaperCard.Content>
                  <View style={styles.resultHeader}>
                    <MaterialCommunityIcons name="alert-circle" size={24} color={theme.colors.error} />
                    <Text variant="titleLarge" style={styles.resultTitle}>
                      Riesgos a Considerar
                    </Text>
                  </View>
                  {tipsData.data.riesgos.map((riesgo, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text variant="bodyMedium">• {riesgo}</Text>
                    </View>
                  ))}
                </PaperCard.Content>
              </Card>

              {/* Source */}
              <View style={styles.source}>
                <Text variant="bodySmall" style={styles.sourceText}>
                  Generado por: {tipsData.source === 'openai' ? 'OpenAI GPT' : 'Sistema Local'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginTop: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  results: {
    marginTop: 24,
    gap: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    marginLeft: 8,
    fontWeight: '600',
  },
  resultText: {
    lineHeight: 24,
  },
  metaText: {
    marginBottom: 12,
    opacity: 0.8,
  },
  metaAmount: {
    alignItems: 'center',
    marginTop: 8,
  },
  amount: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  metaPeriod: {
    marginTop: 4,
    opacity: 0.7,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planAmount: {
    fontWeight: 'bold',
    color: theme.colors.success,
  },
  listItem: {
    marginBottom: 8,
  },
  source: {
    alignItems: 'center',
    marginTop: 8,
  },
  sourceText: {
    opacity: 0.5,
    fontStyle: 'italic',
  },
});
