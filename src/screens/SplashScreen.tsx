import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/useAuthStore';
import { colors } from '@/theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const { bootstrapSession } = useAuthStore();

  useEffect(() => {
    async function initialize() {
      await bootstrapSession();
      const authenticated = useAuthStore.getState().isAuthenticated;
      navigation.replace(authenticated ? 'MainTabs' : 'Welcome');
    }

    initialize();
  }, [bootstrapSession, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Text style={styles.logo}>🥬</Text>
      </View>
      <Text style={styles.subtitle}>Vive Salud</Text>
      <Text style={styles.tagline}>8 Hábitos</Text>
      <ActivityIndicator color={colors.success} size="large" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logoWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 38,
  },
  subtitle: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tagline: {
    marginTop: 4,
    fontSize: 16,
    color: colors.textSecondary,
  },
  loader: {
    marginTop: 24,
  },
});
