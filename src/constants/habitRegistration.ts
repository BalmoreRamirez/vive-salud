import { Habit, HabitKey } from '@/types/habit';

export interface HabitRegisterOption {
  label: string;
  value: number;
  variant?: 'solid' | 'outline';
}

export function requiresCustomInput(habitId: HabitKey): boolean {
  return habitId === 'descanso';
}

export function getHabitRegisterOptions(habit: Habit): HabitRegisterOption[] {
  switch (habit.id) {
    case 'agua':
      return [
        { label: '+1 vaso', value: 1 },
        { label: '+2 vasos', value: 2, variant: 'outline' },
      ];
    case 'aire_puro':
      return [
        { label: '+5 min', value: 5 },
        { label: '+10 min', value: 10, variant: 'outline' },
        { label: '+15 min', value: 15, variant: 'outline' },
      ];
    case 'luz_solar':
      return [
        { label: '+5 min', value: 5 },
        { label: '+10 min', value: 10, variant: 'outline' },
      ];
    case 'ejercicio':
      return [
        { label: '+10 min', value: 10 },
        { label: '+20 min', value: 20, variant: 'outline' },
        { label: '+30 min', value: 30, variant: 'outline' },
      ];
    case 'alimentacion_saludable':
      return [
        { label: 'Desayuno saludable', value: 1 },
        { label: 'Almuerzo saludable', value: 1, variant: 'outline' },
        { label: 'Cena saludable', value: 1, variant: 'outline' },
      ];
    case 'temperancia':
      return [
        { label: 'Sí', value: 1 },
        { label: 'No', value: 0, variant: 'outline' },
      ];
    case 'espiritualidad':
      return [
        { label: '+5 min', value: 5 },
        { label: '+10 min', value: 10, variant: 'outline' },
      ];
    default:
      return [{ label: '+1', value: 1 }];
  }
}
