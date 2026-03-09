import React, { useMemo, useState } from 'react';
import { Alert, Linking, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { getHabitRegisterOptions, requiresCustomInput } from '@/constants/habitRegistration';
import { getSpiritualVerseOfDay } from '@/constants/spiritualVerses';
import { Habit } from '@/types/habit';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface RegisterProgressModalProps {
  visible: boolean;
  habit?: Habit;
  onClose: () => void;
  onSelect: (value: number) => void | Promise<void>;
}

export function RegisterProgressModal({
  visible,
  habit,
  onClose,
  onSelect,
}: RegisterProgressModalProps) {
  const [sharing, setSharing] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [sharedToday, setSharedToday] = useState(false);
  const verse = getSpiritualVerseOfDay();
  const isSpiritualHabit = habit?.id === 'espiritualidad';
  const isCustomHabit = habit ? requiresCustomInput(habit.id) : false;
  const options = useMemo(() => (habit ? getHabitRegisterOptions(habit) : []), [habit]);

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

    onSelect(value);
    setCustomValue('');
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Registrar progreso</Text>
          <Text style={styles.subtitle}>{habit ? `${habit.icon} ${habit.name}` : ''}</Text>

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
                  sharing && styles.disabledButton,
                ]}
                disabled={sharing}
              >
                <Text style={styles.shareButtonText}>
                  {sharedToday ? 'Compartido ✅' : sharing ? 'Abriendo WhatsApp…' : 'Compartir por WhatsApp'}
                </Text>
              </Pressable>
            </View>
          ) : null}

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
              <Pressable
                style={({ pressed }) => [styles.optionButton, pressed && styles.pressed]}
                onPress={handleCustomRegister}
              >
                <Text style={styles.optionText}>Registrar horas</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <Pressable
                  key={option.label}
                  style={({ pressed }) => [styles.optionButton, option.variant === 'outline' && styles.optionOutline, pressed && styles.pressed]}
                  onPress={() => onSelect(option.value)}
                >
                  <Text style={[styles.optionText, option.variant === 'outline' && styles.optionTextOutline]}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.45)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  verseCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.successLight,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  verseTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  verseText: {
    color: colors.textPrimary,
    lineHeight: 20,
  },
  verseReference: {
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  shareButton: {
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  shareButtonText: {
    color: colors.success,
    fontWeight: '700',
    textAlign: 'center',
  },
  blockInfo: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  customInputWrap: {
    gap: spacing.sm,
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
  optionButton: {
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 999,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.success,
  },
  optionText: {
    color: colors.surface,
    fontWeight: '700',
    textAlign: 'center',
  },
  optionOutline: {
    backgroundColor: colors.surface,
  },
  optionTextOutline: {
    color: colors.success,
  },
  cancelButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  cancelText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  disabledButton: {
    opacity: 0.55,
  },
});
