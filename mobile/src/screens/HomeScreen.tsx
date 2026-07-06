import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { API_URL } from '../config';
import { GATEWAY_SERVICES, probeAllServices } from '../api/services';
import type { ServiceProbe } from '../api/types';

export function HomeScreen() {
  const [services, setServices] = useState<ServiceProbe[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setServices(
      GATEWAY_SERVICES.map((s) => ({
        name: s.name,
        path: s.path,
        status: 'checking' as const,
      })),
    );
    const result = await probeAllServices();
    setServices(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Velo Gateway</Text>
      <Text style={styles.subtitle}>API: {API_URL}</Text>

      <Pressable style={styles.button} onPress={refresh} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Verificando...' : 'Atualizar status'}
        </Text>
      </Pressable>

      {loading && services.length === 0 ? (
        <ActivityIndicator color="#2563eb" style={styles.loader} />
      ) : (
        <View style={styles.list}>
          {services.map((service) => (
            <View key={service.path} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{service.name}</Text>
                <StatusDot status={service.status} />
              </View>
              <Text style={styles.path}>{service.path}</Text>
              {service.detail ? (
                <Text style={styles.detail}>{service.detail}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function StatusDot({ status }: { status: ServiceProbe['status'] }) {
  const color =
    status === 'online'
      ? '#16a34a'
      : status === 'checking'
        ? '#ca8a04'
        : '#dc2626';
  const label =
    status === 'online' ? 'Online' : status === 'checking' ? '...' : 'Offline';

  return (
    <View style={styles.statusRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.statusLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  loader: {
    marginTop: 40,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  path: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  detail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
