import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Portal, Modal, IconButton } from 'react-native-paper';
import { theme } from '@/theme';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'error' | 'warning' | 'success';
  component: string;
  message: string;
  data?: any;
}

const MAX_LOGS = 50;
const logs: LogEntry[] = [];

// Interceptar console.log
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

export const captureLog = (level: LogEntry['level'], component: string, message: string, data?: any) => {
  const entry: LogEntry = {
    id: Date.now().toString() + Math.random().toString(),
    timestamp: new Date(),
    level,
    component,
    message,
    data,
  };

  logs.unshift(entry);
  
  // Mantener solo los últimos MAX_LOGS
  if (logs.length > MAX_LOGS) {
    logs.pop();
  }

  // También mostrar en consola original
  if (level === 'error') {
    originalError(`[${component}] ${message}`, data);
  } else if (level === 'warning') {
    originalWarn(`[${component}] ${message}`, data);
  } else {
    originalLog(`[${component}] ${message}`, data);
  }
};

export const DebugPanel: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (visible) {
      // Actualizar logs cuando se abre el panel
      setLogEntries([...logs]);
      
      // Actualizar cada segundo mientras está abierto
      const interval = setInterval(() => {
        setLogEntries([...logs]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [visible]);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.info;
    }
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <>
      {/* Floating Button */}
      <View style={styles.floatingButton}>
        <IconButton
          icon="bug"
          size={24}
          mode="contained"
          onPress={() => setVisible(true)}
          style={styles.button}
        />
      </View>

      {/* Debug Modal */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Debug Logs ({logEntries.length})</Text>
            <IconButton
              icon="close"
              size={20}
              onPress={() => setVisible(false)}
            />
          </View>

          <ScrollView style={styles.logContainer}>
            {logEntries.length === 0 ? (
              <Text style={styles.emptyText}>No hay logs todavía</Text>
            ) : (
              logEntries.map((log) => (
                <View key={log.id} style={styles.logEntry}>
                  <View style={styles.logHeader}>
                    <Text style={[styles.logLevel, { color: getLevelColor(log.level) }]}>
                      {getLevelIcon(log.level)} {log.level.toUpperCase()}
                    </Text>
                    <Text style={styles.logTime}>
                      {log.timestamp.toLocaleTimeString()}
                    </Text>
                  </View>
                  
                  <Text style={styles.logComponent}>[{log.component}]</Text>
                  <Text style={styles.logMessage}>{log.message}</Text>
                  
                  {log.data && (
                    <Text style={styles.logData}>
                      {typeof log.data === 'string' 
                        ? log.data 
                        : JSON.stringify(log.data, null, 2)}
                    </Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              logs.length = 0;
              setLogEntries([]);
            }}
          >
            <Text style={styles.clearButtonText}>Limpiar Logs</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    zIndex: 1000,
  },
  button: {
    backgroundColor: theme.colors.primary,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  logContainer: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 20,
  },
  logEntry: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logLevel: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  logTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  logComponent: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  logMessage: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  logData: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#4B5563',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  clearButton: {
    backgroundColor: theme.colors.error,
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
