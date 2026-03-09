import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoWrap}>
          <Text style={styles.logo}>🥬</Text>
        </View>

        <Text style={styles.brand}>Vive Salud</Text>
        <Text style={styles.tagline}>Cooking Happiness Daily</Text>

        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Log in with your data to start tracking your 8 daily habits.</Text>

        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.primaryButtonText}>Sign up</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryButtonText}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: 'center',
  },
  logoWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 36,
  },
  brand: {
    marginTop: spacing.md,
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  tagline: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  title: {
    width: '100%',
    textAlign: 'left',
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    width: '100%',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.success,
    borderRadius: 999,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
