import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HABITS } from '@/constants/habits';
import { HabitCard } from '@/components/HabitCard';
import { SectionHeader } from '@/components/SectionHeader';
import { RootStackParamList } from '@/navigation/types';
import { useHabitsStore } from '@/store/useHabitsStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { loading, summary, loadSummary } = useHabitsStore();

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const completedToday = useMemo(
    () => summary.filter((item) => item.currentValue >= item.goalValue).length,
    [summary],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadSummary} />}
    >
      <SectionHeader
        title="Vive Salud"
        subtitle="Mejora cada día con tus 8 hábitos esenciales"
      />

      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Resumen de hoy</Text>
        <Text style={styles.overviewValue}>{completedToday} / {HABITS.length} hábitos completados</Text>
      </View>

      {loading && summary.every((item) => item.currentValue === 0) ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        HABITS.map((habit) => {
          const habitSummary = summary.find((item) => item.habitId === habit.id);
          if (!habitSummary) {
            return null;
          }

          return (
            <HabitCard
              key={habit.id}
              habit={habit}
              summary={habitSummary}
              onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
              onRegister={() => undefined}
            />
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  overviewCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  overviewTitle: {
    color: colors.surface,
    opacity: 0.95,
  },
  overviewValue: {
    marginTop: spacing.sm,
    color: colors.surface,
    fontSize: 20,
    fontWeight: '800',
  },
});
