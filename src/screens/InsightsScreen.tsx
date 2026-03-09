import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HABITS } from '@/constants/habits';
import { SectionHeader } from '@/components/SectionHeader';
import { useHabitsStore } from '@/store/useHabitsStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export function InsightsScreen() {
  const { summary } = useHabitsStore();

  const average = useMemo(() => {
    if (!summary.length) return 0;

    const totalRatio = summary.reduce((acc, item) => acc + item.currentValue / Math.max(item.goalValue, 1), 0);
    return Math.round((totalRatio / summary.length) * 100);
  }, [summary]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionHeader
        title="Progreso"
        subtitle="Visualiza tu consistencia diaria"
      />

      <View style={styles.kpiCard}>
        <Text style={styles.kpiTitle}>Cumplimiento promedio</Text>
        <Text style={styles.kpiValue}>{average}%</Text>
      </View>

      {HABITS.map((habit) => {
        const item = summary.find((summaryItem) => summaryItem.habitId === habit.id);
        if (!item) return null;

        const ratio = Math.min((item.currentValue / Math.max(item.goalValue, 1)) * 100, 100);

        return (
          <View key={habit.id} style={styles.rowCard}>
            <Text style={styles.rowName}>{habit.icon} {habit.name}</Text>
            <Text style={styles.rowValue}>{Math.round(ratio)}%</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  kpiCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  kpiTitle: {
    color: colors.textSecondary,
  },
  kpiValue: {
    marginTop: spacing.sm,
    color: colors.primary,
    fontSize: 34,
    fontWeight: '800',
  },
  rowCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: spacing.sm,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowName: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  rowValue: {
    color: colors.success,
    fontWeight: '800',
  },
});
