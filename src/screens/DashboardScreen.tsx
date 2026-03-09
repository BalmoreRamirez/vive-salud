import React, { useEffect, useMemo, useState } from 'react';
import { Animated, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HABITS } from '@/constants/habits';
import { HabitCard } from '@/components/HabitCard';
import { RegisterProgressModal } from '@/components/RegisterProgressModal';
import { RootStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useHabitsStore } from '@/store/useHabitsStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Habit } from '@/types/habit';

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userName } = useAuthStore();
  const {
    loading,
    summary,
    currentStreak,
    loadSummary,
    registerHabitProgress,
  } = useHabitsStore();

  const [selectedHabit, setSelectedHabit] = useState<Habit>();
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>();
  const [showAchievement, setShowAchievement] = useState(false);
  const feedbackOpacity = useState(new Animated.Value(0))[0];
  const achievementScale = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const completedToday = useMemo(
    () => summary.filter((item) => item.currentValue >= item.goalValue).length,
    [summary],
  );

  const dailyGoalTarget = 4;
  const dailyGoalMet = completedToday >= dailyGoalTarget;

  const triggerFeedback = (message: string) => {
    setFeedbackMessage(message);
    Animated.sequence([
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(feedbackOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setFeedbackMessage(undefined));
  };

  const triggerAchievement = () => {
    setShowAchievement(true);
    achievementScale.setValue(0.88);
    Animated.spring(achievementScale, {
      toValue: 1,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();

    setTimeout(() => setShowAchievement(false), 1800);
  };

  const openRegisterModal = (habit: Habit) => {
    setSelectedHabit(habit);
    setModalVisible(true);
  };

  const handleRegister = async (value: number) => {
    if (!selectedHabit) return;

    const beforeSummary = summary.find((item) => item.habitId === selectedHabit.id);
    const wasCompleted =
      beforeSummary ? beforeSummary.currentValue >= beforeSummary.goalValue : false;

    const { error } = await registerHabitProgress(selectedHabit.id, value);
    if (error) {
      triggerFeedback(error);
      return;
    }

    setModalVisible(false);
    triggerFeedback('✔ registrado');

    const afterSummary = useHabitsStore
      .getState()
      .summary.find((item) => item.habitId === selectedHabit.id);
    const nowCompleted = afterSummary ? afterSummary.currentValue >= afterSummary.goalValue : false;

    if (!wasCompleted && nowCompleted) {
      triggerAchievement();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={HABITS}
        keyExtractor={(habit) => habit.id}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadSummary} />}
        ListHeaderComponent={
          <>
            <Text style={styles.greeting}>Hola, {userName ?? 'Usuario'}</Text>
            <Text style={styles.subtitle}>Vamos por un día saludable</Text>

            <View style={styles.kpiRow}>
              <View style={styles.kpiCardPrimary}>
                <Text style={styles.kpiLabelLight}>Racha actual</Text>
                <Text style={styles.kpiValueLight}>🔥 {currentStreak} días</Text>
              </View>

              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Hábitos completados</Text>
                <Text style={styles.kpiValue}>{completedToday} / {HABITS.length}</Text>
              </View>
            </View>

            <View style={[styles.goalCard, dailyGoalMet && styles.goalCardDone]}>
              <Text style={styles.goalTitle}>🎯 Meta del día</Text>
              <Text style={styles.goalText}>Completa al menos {dailyGoalTarget} hábitos hoy.</Text>
              <Text style={styles.goalStatus}>{dailyGoalMet ? 'Lograda ✅' : `Llevas ${completedToday} / ${dailyGoalTarget}`}</Text>
            </View>

            {feedbackMessage ? (
              <Animated.View style={[styles.feedbackPill, { opacity: feedbackOpacity }]}>
                <Text style={styles.feedbackText}>{feedbackMessage}</Text>
              </Animated.View>
            ) : null}

            {showAchievement ? (
              <Animated.View style={[styles.achievementCard, { transform: [{ scale: achievementScale }] }]}>
                <Text style={styles.achievementTitle}>🏅 ¡Logro completado!</Text>
                <Text style={styles.achievementText}>Terminaste la meta de un hábito.</Text>
              </Animated.View>
            ) : null}

            <Text style={styles.sectionTitle}>Hábitos de hoy</Text>
          </>
        }
        renderItem={({ item }) => {
          const habitSummary = summary.find((summaryItem) => summaryItem.habitId === item.id);

          if (!habitSummary) return null;

          return (
            <HabitCard
              habit={item}
              summary={habitSummary}
              onPress={() => navigation.navigate('HabitDetail', { habitId: item.id })}
              onRegister={() => openRegisterModal(item)}
            />
          );
        }}
      />

      <RegisterProgressModal
        visible={modalVisible}
        habit={selectedHabit}
        onClose={() => setModalVisible(false)}
        onSelect={handleRegister}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  greeting: {
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
    marginBottom: spacing.lg,
  },
  kpiCardPrimary: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: 18,
    padding: spacing.md,
  },
  kpiLabelLight: {
    color: colors.surface,
    opacity: 0.95,
  },
  kpiValueLight: {
    marginTop: spacing.xs,
    color: colors.surface,
    fontWeight: '800',
    fontSize: 18,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  goalCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  goalCardDone: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  goalTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  goalText: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  goalStatus: {
    color: colors.success,
    fontWeight: '700',
  },
  feedbackPill: {
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: colors.success,
    borderRadius: 999,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  feedbackText: {
    color: colors.surface,
    fontWeight: '700',
  },
  achievementCard: {
    marginBottom: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: colors.successLight,
    padding: spacing.md,
  },
  achievementTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  achievementText: {
    color: colors.textSecondary,
  },
});
