import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Habit, HabitSummary } from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  summary: HabitSummary;
  onPress: () => void;
  onRegister: () => void;
}

export function HabitCard({ habit, summary, onPress, onRegister }: HabitCardProps) {
  const progress = Math.min(summary.currentValue / Math.max(summary.goalValue, 1), 1);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.title}>{habit.icon} {habit.name}</Text>
          <Text style={styles.subtitle}>{habit.goalLabel}</Text>
        </View>
        <Text style={styles.streak}>🔥 {summary.streakDays} días</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <Text style={styles.value}>
        {summary.currentValue}/{summary.goalValue} {habit.unit}
      </Text>

      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          onRegister();
        }}
        style={({ pressed }) => [styles.registerButton, pressed && styles.pressed]}
      >
        <Text style={styles.registerText}>Registrar</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  streak: {
    color: colors.warning,
    fontWeight: '700',
    fontSize: 12,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 999,
  },
  value: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  registerText: {
    color: colors.success,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
