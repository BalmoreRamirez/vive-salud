export type HabitKey =
  | 'agua'
  | 'aire_puro'
  | 'luz_solar'
  | 'ejercicio'
  | 'alimentacion_saludable'
  | 'descanso'
  | 'temperancia'
  | 'espiritualidad';

export interface Habit {
  id: HabitKey;
  name: string;
  icon: string;
  goalLabel: string;
  unit: string;
  recommendedDailyGoal: number;
}

export interface HabitLog {
  id: string;
  habitId: HabitKey;
  value: number;
  date: string;
}

export interface HabitSummary {
  habitId: HabitKey;
  currentValue: number;
  goalValue: number;
  streakDays: number;
}
