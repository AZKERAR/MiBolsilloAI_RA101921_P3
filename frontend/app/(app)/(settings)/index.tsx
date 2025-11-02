import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, Divider, Dialog, Portal } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { useAppStore } from '@/store/app.store';
import { isValidPassword } from '@/utils/validators';
import { theme } from '@/theme';

/**
 * Settings Screen
 * Configuración de la app y gestión de cuenta
 */
export default function SettingsScreen() {
  const user = useAuthStore((state) => state.user);
  const showSnackbar = useAppStore((state) => state.showSnackbar);

  const { logout, changePassword, isChangingPassword } = useAuth();

  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Log para verificar que el componente se renderiza
  React.useEffect(() => {
    console.log('🎨 [SettingsScreen] Mounted - User:', user?.email);
    console.log('🎨 [SettingsScreen] Should show AI menu items');
  }, [user]);

  console.log('🔧 [SettingsScreen] Renderizando...', { user: user?.email });

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // El RootLayout se encargará de redirigir al login automáticamente
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    if (!isValidPassword(currentPassword)) {
      showSnackbar('Contraseña actual inválida', 'error');
      return;
    }

    if (!isValidPassword(newPassword)) {
      showSnackbar('La nueva contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showSnackbar('Las contraseñas no coinciden', 'error');
      return;
    }

    changePassword({
      currentPassword,
      newPassword,
    });

    // Limpiar formulario (el snackbar de éxito se muestra desde el hook)
    setChangePasswordVisible(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Perfil */}
      <Card>
        <View style={styles.profile}>
          <MaterialCommunityIcons name="account-circle" size={64} color={theme.colors.primary} />
          <Text variant="titleLarge" style={styles.userName}>
            {user?.email}
          </Text>
        </View>
      </Card>

      {/* Cuenta */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Cuenta
        </Text>
        <Card>
          <List.Item
            title="Cuentas"
            description="Gestionar mis cuentas"
            left={(props) => <List.Icon {...props} icon="credit-card" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              console.log('🔧 [Settings] Navegando a cuentas...');
              // TODO: Navegar a pantalla de cuentas
              showSnackbar('Funcionalidad en desarrollo', 'info');
            }}
          />
          <Divider />
          <List.Item
            title="Categorías"
            description="Gestionar categorías"
            left={(props) => <List.Icon {...props} icon="tag" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              console.log('🔧 [Settings] Navegando a categorías...');
              router.push('/(app)/(settings)/categories');
            }}
          />
        </Card>
      </View>

      {/* Seguridad */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Seguridad
        </Text>
        <Card>
          <List.Item
            title="Cambiar Contraseña"
            description="Actualizar tu contraseña"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setChangePasswordVisible(true)}
          />
        </Card>
      </View>

      {/* Inteligencia Artificial */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Inteligencia Artificial
        </Text>
        <Card>
          <List.Item
            title="Asistente de Ahorro"
            description="Pide consejos a la IA"
            left={(props) => <List.Icon {...props} icon="robot" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              console.log('🤖 [Settings] Navegando a AI Tips...');
              console.log('🤖 [Settings] Route: /(app)/(settings)/ai-tips');
              router.push('/(app)/(settings)/ai-tips');
            }}
          />
        </Card>
      </View>

      {/* Acerca de */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Acerca de
        </Text>
        <Card>
          <List.Item
            title="MiBolsillo"
            description="Versión 1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
        </Card>
      </View>

      {/* Cerrar Sesión */}
      <View style={styles.logoutContainer}>
        <Button
          title="Cerrar Sesión"
          onPress={handleLogout}
          variant="outlined"
          fullWidth
          style={styles.logoutButton}
        />
      </View>

      {/* Dialog Cambiar Contraseña */}
      <Portal>
        <Dialog visible={changePasswordVisible} onDismiss={() => setChangePasswordVisible(false)}>
          <Dialog.Title>Cambiar Contraseña</Dialog.Title>
          <Dialog.Content>
            <Input
              label="Contraseña Actual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
            <Input
              label="Nueva Contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <Input
              label="Confirmar Contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              title="Cancelar"
              onPress={() => setChangePasswordVisible(false)}
              variant="text"
            />
            <Button
              title="Actualizar"
              onPress={handleChangePassword}
              loading={isChangingPassword}
              disabled={isChangingPassword}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  profile: {
    alignItems: 'center',
    padding: 24,
  },
  userName: {
    marginTop: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  logoutContainer: {
    marginTop: 32,
    marginBottom: 16,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
});
