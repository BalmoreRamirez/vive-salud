import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Animated, FlatList, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { HABITS, DAILY_TIPS } from '@/constants/habits';
import { getHabitRegisterOptions, requiresCustomInput } from '@/constants/habitRegistration';
import { getSpiritualVerseOfDay } from '@/constants/spiritualVerses';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RootStackParamList } from '@/navigation/types';
import { useHabitsStore } from '@/store/useHabitsStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export function HabitDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'HabitDetail'>>();
  const { habitId } = route.params;
  const {
    summary,
    logsByHabit,
    loadHabitLogs,
    registerHabitProgress,
  } = useHabitsStore();
  const [feedbackMessage, setFeedbackMessage] = useState<string>();
  const feedbackOpacity = useState(new Animated.Value(0))[0];
  const [sharing, setSharing] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [sharedToday, setSharedToday] = useState(false);

  const habit = useMemo(() => HABITS.find((item) => item.id === habitId), [habitId]);
  const habitSummary = summary.find((item) => item.habitId === habitId);

  useEffect(() => {
    loadHabitLogs(habitId);
  }, [habitId, loadHabitLogs]);

  if (!habit || !habitSummary) {
    return null;
  }

  const progressPercentage = Math.round((habitSummary.currentValue / habitSummary.goalValue) * 100);
  const recentLogs = logsByHabit[habit.id] ?? [];
  const isSpiritualHabit = habit.id === 'espiritualidad';
  const isCustomHabit = requiresCustomInput(habit.id);
  const registerOptions = getHabitRegisterOptions(habit);
  const verse = getSpiritualVerseOfDay();

  const weeklyHistory = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(Date.now() - index * 86400000);
    const dateKey = date.toISOString().split('T')[0];
    const total = recentLogs
      .filter((log) => log.date === dateKey)
      .reduce((acc, log) => acc + log.value, 0);

    return {
      date: dateKey,
      label: date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
      }),
      value: total,
    };
  });

  const handleQuickRegister = async (value: number) => {
    const { error } = await registerHabitProgress(habit.id, value);
    if (error) {
      Alert.alert('Acción requerida', error);
      return;
    }

    setFeedbackMessage('✔ registrado');

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

  const handleShareToWhatsApp = async () => {
    const shareMessage = `📖 Versículo del día\n\n${verse.text}\n— ${verse.reference}\n\nCompartido desde Vive Salud`;
    const encodedMessage = encodeURIComponent(shareMessage);
    const appUrl = `whatsapp://send?text=${encodedMessage}`;
    const webUrl = `https://wa.me/?text=${encodedMessage}`;

    try {
      setSharing(true);
      const canOpenAppUrl = await Linking.canOpenURL(appUrl);
      await Linking.openURL(canOpenAppUrl ? appUrl : webUrl);
      setSharedToday(true);
    } catch {
      Alert.alert('WhatsApp no disponible', 'No fue posible abrir WhatsApp para compartir.');
    } finally {
      setSharing(false);
    }
  };

  const handleCustomRegister = () => {
    const value = Number(customValue.replace(',', '.'));
    if (!value || value <= 0) {
      Alert.alert('Dato inválido', 'Ingresa las horas dormidas en formato numérico, por ejemplo 7.5');
      return;
    }

    handleQuickRegister(value);
    setCustomValue('');
  };

  return (
    <FlatList
      data={weeklyHistory}
      keyExtractor={(item) => item.date}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>{habit.icon} {habit.name}</Text>
            <Text style={styles.heroSubtitle}>Meta diaria: {habitSummary.goalValue} {habit.unit}</Text>
            <Text style={styles.heroProgress}>
              Hoy: {habitSummary.currentValue} de {habitSummary.goalValue} {habit.unit}
            </Text>
            <Text style={styles.heroProgress}>{progressPercentage}% completado hoy</Text>
          </View>

          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Registrar progreso</Text>

            {isSpiritualHabit ? (
              <View style={styles.verseCard}>
                <Text style={styles.verseTitle}>Versículo del día</Text>
                <Text style={styles.verseText}>{verse.text}</Text>
                <Text style={styles.verseReference}>{verse.reference}</Text>

                <Pressable
                  onPress={handleShareToWhatsApp}
                  style={({ pressed }) => [
                    styles.shareButton,
                    pressed && styles.pressed,
                    sharing && styles.shareButtonDisabled,
                  ]}
                  disabled={sharing}
                >
                  <Text style={styles.shareButtonText}>
                    {sharedToday ? 'Compartido ✅' : sharing ? 'Abriendo WhatsApp…' : 'Compartir por WhatsApp'}
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {feedbackMessage ? (
              <Animated.View style={[styles.feedbackPill, { opacity: feedbackOpacity }]}>
                <Text style={styles.feedbackText}>{feedbackMessage}</Text>
              </Animated.View>
            ) : null}

            <View style={styles.buttonRow}>
              {isCustomHabit ? (
                <View style={styles.customInputWrap}>
                  <Text style={styles.customInputLabel}>Horas dormidas</Text>
                  <TextInput
                    value={customValue}
                    onChangeText={setCustomValue}
                    placeholder="Ejemplo: 7.5"
                    keyboardType="decimal-pad"
                    style={styles.customInput}
                  />
                  <PrimaryButton label="Registrar horas" onPress={handleCustomRegister} />
                </View>
              ) : (
                <View style={styles.optionsWrap}>
                  {registerOptions.map((option) => (
                    <PrimaryButton
                      key={option.label}
                      label={option.label}
                      onPress={() => handleQuickRegister(option.value)}
                      variant={option.variant ?? 'solid'}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.sectionTitle}>Tip del día</Text>
            <Text style={styles.tipText}>{DAILY_TIPS[habit.id]}</Text>
          </View>

          <View style={styles.historyCard}>
            <Text style={styles.sectionTitle}>Historial de la semana</Text>
          </View>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.logRow}>
          <Text style={styles.logDate}>{item.label}</Text>
          <Text style={styles.logValue}>{item.value} {habit.unit}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  heroProgress: {
    marginTop: spacing.md,
    color: colors.success,
    fontWeight: '700',
  },
  actionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  buttonRow: {
    width: '100%',
  },
  optionsWrap: {
    gap: spacing.sm,
  },
  customInputWrap: {
    gap: spacing.sm,
    width: '100%',
  },
  customInputLabel: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  customInput: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
  },
  verseCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.successLight,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  verseTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  verseText: {
    color: colors.textPrimary,
    lineHeight: 20,
  },
  verseReference: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  shareButton: {
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 999,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  shareButtonDisabled: {
    opacity: 0.6,
  },
  shareButtonText: {
    color: colors.success,
    fontWeight: '700',
    textAlign: 'center',
  },
  feedbackPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.success,
    borderRadius: 999,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  feedbackText: {
    color: colors.surface,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  tipCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: spacing.lg,
  },
  tipText: {
    color: colors.textPrimary,
    lineHeight: 20,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  logRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  logDate: {
    color: colors.textSecondary,
  },
  logValue: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
