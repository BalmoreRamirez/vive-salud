import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import { HABITS } from '@/constants/habits';
import { useHabitsStore } from '@/store/useHabitsStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

function AnimatedFillBar({ ratio }: { ratio: number }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: ratio,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, ratio]);

  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return <Animated.View style={[styles.fill, { width }]} />;
}

function AnimatedWeeklyBar({ ratio, label }: { ratio: number; label: string }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: ratio,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, ratio]);

  const height = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 74],
  });

  return (
    <View style={styles.weeklyItem}>
      <View style={styles.weeklyTrack}>
        <Animated.View style={[styles.weeklyFill, { height }]} />
      </View>
      <Text style={styles.weeklyLabel}>{label}</Text>
    </View>
  );
}

export function ProgressScreen() {
  const {
    summary,
    currentStreak,
    historicalBestStreak,
    weeklyCompletedHabits,
    weeklyProgress,
    loadSummary,
  } = useHabitsStore();

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const compliance = useMemo(() => {
    if (!summary.length) return 0;

    const ratio = summary.reduce(
      (acc, item) => acc + item.currentValue / Math.max(item.goalValue, 1),
      0,
    );

    return Math.round((ratio / summary.length) * 100);
  }, [summary]);

  return (
    <FlatList
      data={HABITS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Progreso</Text>
          <Text style={styles.subtitle}>Tu consistencia semanal de hábitos</Text>

          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Racha actual</Text>
              <Text style={styles.kpiValue}>🔥 {currentStreak}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Completados semana</Text>
              <Text style={styles.kpiValue}>{weeklyCompletedHabits}/8</Text>
            </View>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>Racha histórica</Text>
            <Text style={styles.kpiValue}>🏆 {historicalBestStreak} días</Text>
          </View>

          <View style={styles.kpiCardHighlight}>
            <Text style={styles.kpiLabel}>Porcentaje de cumplimiento</Text>
            <Text style={styles.kpiValueHighlight}>{compliance}%</Text>
          </View>

          <View style={styles.weeklyCard}>
            <Text style={styles.weeklyTitle}>Gráfica semanal</Text>
            <View style={styles.weeklyRow}>
              {weeklyProgress.map((point) => (
                <AnimatedWeeklyBar
                  key={point.date}
                  label={point.label}
                  ratio={point.completedHabits / Math.max(point.totalHabits, 1)}
                />
              ))}
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen general de hábitos</Text>
            <View style={styles.summaryHeaderRow}>
              <Text style={[styles.summaryHeaderText, styles.colHabit]}>Hábito</Text>
              <Text style={[styles.summaryHeaderText, styles.colGoal]}>Meta</Text>
              <Text style={[styles.summaryHeaderText, styles.colUnit]}>Unidad</Text>
            </View>
            {HABITS.map((habit) => (
              <View key={habit.id} style={styles.summaryRow}>
                <Text style={[styles.summaryCell, styles.colHabit]}>{habit.name}</Text>
                <Text style={[styles.summaryCell, styles.colGoal]}>{habit.recommendedDailyGoal}</Text>
                <Text style={[styles.summaryCell, styles.colUnit]}>{habit.unit}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.listTitle}>Porcentaje por hábito</Text>
        </>
      }
      renderItem={({ item }) => {
        const summaryItem = summary.find((s) => s.habitId === item.id);
        if (!summaryItem) return null;

        const ratio = Math.min(summaryItem.currentValue / Math.max(summaryItem.goalValue, 1), 1);

        return (
          <View style={styles.rowCard}>
            <View style={styles.rowTop}>
              <Text style={styles.rowName}>{item.icon} {item.name}</Text>
              <Text style={styles.rowPercent}>{Math.round(ratio * 100)}%</Text>
            </View>
            <View style={styles.track}>
              <AnimatedFillBar ratio={ratio} />
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  kpiCardHighlight: {
    marginBottom: spacing.lg,
    borderRadius: 18,
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiLabel: {
    color: colors.textSecondary,
  },
  kpiValue: {
    marginTop: spacing.xs,
    color: colors.textPrimary,
    fontWeight: '800',
    fontSize: 18,
  },
  kpiValueHighlight: {
    marginTop: spacing.xs,
    color: colors.success,
    fontWeight: '800',
    fontSize: 26,
  },
  rowCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  rowName: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  rowPercent: {
    color: colors.success,
    fontWeight: '800',
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.success,
  },
  weeklyCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  weeklyTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  weeklyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  weeklyItem: {
    flex: 1,
    alignItems: 'center',
  },
  weeklyTrack: {
    width: '100%',
    maxWidth: 26,
    height: 76,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  weeklyFill: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: colors.success,
  },
  weeklyLabel: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  listTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  summaryCard: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs,
  },
  summaryHeaderText: {
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryCell: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
  colHabit: {
    flex: 1.6,
  },
  colGoal: {
    flex: 0.6,
    textAlign: 'center',
  },
  colUnit: {
    flex: 0.8,
    textAlign: 'right',
  },
});
