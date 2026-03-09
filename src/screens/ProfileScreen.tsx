import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Mail, ShieldCheck, UserRound } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RootStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userName, email, loading, logout } = useAuthStore();
  const [signingOut, setSigningOut] = useState(false);
  const displayName = userName ?? 'Usuario';
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    setSigningOut(true);
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
    setSigningOut(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Perfil</Text>
      <Text style={styles.pageSubtitle}>Tu cuenta y sesión</Text>

      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.heroTextWrap}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email ?? 'No disponible'}</Text>
        </View>

        <View style={styles.statusBadge}>
          <ShieldCheck size={14} color={colors.success} />
          <Text style={styles.statusText}>Cuenta activa</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Información personal</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <UserRound size={16} color={colors.success} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>{displayName}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <Mail size={16} color={colors.success} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.label}>Correo</Text>
            <Text style={styles.value}>{email ?? 'No disponible'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sessionCard}>
        <Text style={styles.sessionTitle}>Sesión</Text>
        <Text style={styles.sessionText}>Puedes cerrar tu sesión de forma segura en este dispositivo.</Text>

        <PrimaryButton
          label={signingOut || loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
          onPress={handleLogout}
        />

        {signingOut ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.success} />
            <Text style={styles.loadingText}>Saliendo de tu cuenta…</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  pageSubtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.success,
    fontSize: 22,
    fontWeight: '800',
  },
  heroTextWrap: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  name: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  email: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.successLight,
    borderRadius: 999,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  statusText: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrap: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: 2,
    fontSize: 12,
  },
  value: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sessionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sessionTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  sessionText: {
    color: colors.textSecondary,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
