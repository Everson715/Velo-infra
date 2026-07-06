import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export function ProfileScreen() {
  const { user, token, logout, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refreshUser();
    } finally {
      setRefreshing(false);
    }
  }

  if (!token) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>Faça login para ver seu perfil</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>GET /api/v1/me</Text>

      {user ? (
        <View style={styles.card}>
          <Field label="Nome" value={String(user.name ?? '—')} />
          <Field label="Email" value={String(user.email ?? '—')} />
          <Field label="ID" value={String(user.id ?? '—')} />
        </View>
      ) : (
        <ActivityIndicator color="#2563eb" style={styles.loader} />
      )}

      <Pressable
        style={styles.secondaryButton}
        onPress={handleRefresh}
        disabled={refreshing}
      >
        <Text style={styles.secondaryText}>
          {refreshing ? 'Atualizando...' : 'Atualizar perfil'}
        </Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  empty: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
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
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 16,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 16,
    color: '#1e293b',
  },
  loader: {
    marginTop: 40,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryText: {
    color: '#334155',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '600',
  },
});
