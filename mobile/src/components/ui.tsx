import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, shared } from '../styles/theme';

export function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View>
      <Text style={shared.title}>{title}</Text>
      {subtitle ? <Text style={shared.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'email-address';
}) {
  return (
    <View>
      <Text style={shared.label}>{label}</Text>
      <TextInput
        style={shared.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        keyboardType={keyboardType}
      />
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={[shared.button, (loading || disabled) && shared.buttonDisabled]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      <Text style={shared.buttonText}>{loading ? 'Aguarde...' : label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={shared.secondaryButton} onPress={onPress}>
      <Text style={shared.secondaryText}>{label}</Text>
    </Pressable>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function AuthGate({ token, children }: { token: string | null; children: ReactNode }) {
  if (!token) {
    return (
      <View style={shared.centered}>
        <Text style={shared.empty}>Faça login na aba Conta para usar este recurso</Text>
      </View>
    );
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
