import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Chrome, Facebook, Twitter } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('123');
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Completa email y password.');
      return;
    }

    const { error } = await login(email.trim(), password);

    if (error) {
      setErrorMessage(error);
      return;
    }

    navigation.replace('MainTabs');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Sign in and get started</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            style={styles.input}
          />

          <View style={styles.demoBadge}>
            <Text style={styles.hint}>Demo: admin / 123</Text>
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.error}>{errorMessage}</Text>
            </View>
          ) : null}

          <PrimaryButton label={loading ? 'Ingresando...' : 'Sign in'} onPress={handleLogin} />

          <Pressable style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forget Password</Text>
          </Pressable>

          <View style={styles.socialRow}>
            <View style={styles.socialIconWrap}>
              <Twitter size={16} color={colors.primary} />
            </View>
            <View style={styles.socialIconWrap}>
              <Chrome size={16} color={colors.warning} />
            </View>
            <View style={styles.socialIconWrap}>
              <Facebook size={16} color={colors.primary} />
            </View>
          </View>

          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.secondaryButtonText}>Create account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  demoBadge: {
    marginTop: spacing.xs,
  },
  hint: {
    color: colors.success,
    fontWeight: '600',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  forgotText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  socialIconWrap: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
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
  errorBox: {
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  error: {
    color: colors.warning,
    fontWeight: '600',
  },
});
