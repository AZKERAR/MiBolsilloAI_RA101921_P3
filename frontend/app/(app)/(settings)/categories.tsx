import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, FAB, IconButton, Dialog, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCategories } from '@/hooks/useCategories';
import { useAppStore } from '@/store/app.store';
import { theme } from '@/theme';
import type { Category } from '@/types/models.types';

/**
 * Categories Screen
 * CRUD de categorías
 */
export default function CategoriesScreen() {
  const showSnackbar = useAppStore((state) => state.showSnackbar);

  const { categories, isLoadingCategories, createCategory, updateCategory, deleteCategory, isCreating, isUpdating, isDeleting } =
    useCategories();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');

  console.log('🔧 [CategoriesScreen] Renderizando...', { 
    categoriesCount: categories?.length, 
    isLoadingCategories,
    dialogVisible,
    isCreating,
    isUpdating
  });

  const handleCreate = () => {
    console.log('🔧 [CategoriesScreen] Abriendo diálogo para crear categoría');
    setEditingCategory(null);
    setCategoryName('');
    setDialogVisible(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setDialogVisible(true);
  };

  const handleDelete = (category: Category) => {
    Alert.alert(
      'Eliminar Categoría',
      `¿Estás seguro de que deseas eliminar "${category.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteCategory(category.id);
          },
        },
      ]
    );
  };

  const handleSave = () => {
    console.log('🔧 [CategoriesScreen] Guardando categoría...', { 
      categoryName, 
      isEditing: !!editingCategory 
    });

    if (!categoryName.trim()) {
      showSnackbar('Ingresa un nombre para la categoría', 'error');
      return;
    }

    if (editingCategory) {
      console.log('🔧 [CategoriesScreen] Actualizando categoría:', editingCategory.id);
      updateCategory({
        id: editingCategory.id,
        data: { name: categoryName.trim() },
      });
    } else {
      console.log('🔧 [CategoriesScreen] Creando nueva categoría');
      createCategory({
        name: categoryName.trim(),
      });
    }

    setDialogVisible(false);
    setCategoryName('');
    setEditingCategory(null);
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <Card>
      <View style={styles.categoryCard}>
        <View style={styles.categoryInfo}>
          <MaterialCommunityIcons name="tag" size={24} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.categoryName}>
            {item.name}
          </Text>
        </View>

        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEdit(item)}
            iconColor={theme.colors.primary}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDelete(item)}
            iconColor={theme.colors.error}
          />
        </View>
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="tag-off" size={64} color={theme.colors.surfaceVariant} />
      <Text variant="titleMedium" style={styles.emptyText}>
        No hay categorías
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtext}>
        Crea tu primera categoría
      </Text>
    </View>
  );

  if (isLoadingCategories) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Categorías
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Gestiona las categorías de tus transacciones
        </Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreate}
        label="Nueva Categoría"
      />

      {/* Dialog Crear/Editar */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </Dialog.Title>
          <Dialog.Content>
            <Input
              label="Nombre"
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Ej: Alimentación"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              title="Cancelar"
              onPress={() => setDialogVisible(false)}
              variant="text"
            />
            <Button
              title={editingCategory ? 'Actualizar' : 'Crear'}
              onPress={handleSave}
              loading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  title: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  subtitle: {
    color: theme.colors.surfaceVariant,
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    marginLeft: 12,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    color: theme.colors.surfaceVariant,
  },
  emptySubtext: {
    marginTop: 8,
    color: theme.colors.surfaceVariant,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
