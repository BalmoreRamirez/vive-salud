import { Habit } from '@/types/habit';

export const HABITS: Habit[] = [
  {
    id: 'agua',
    name: 'Agua',
    icon: '💧',
    goalLabel: 'Vasos de agua',
    unit: 'vasos',
    recommendedDailyGoal: 8,
  },
  {
    id: 'aire_puro',
    name: 'Aire puro',
    icon: '🌬',
    goalLabel: 'Minutos al aire libre',
    unit: 'minutos',
    recommendedDailyGoal: 30,
  },
  {
    id: 'luz_solar',
    name: 'Luz solar',
    icon: '☀️',
    goalLabel: 'Minutos de luz solar',
    unit: 'minutos',
    recommendedDailyGoal: 20,
  },
  {
    id: 'ejercicio',
    name: 'Ejercicio',
    icon: '🏃',
    goalLabel: 'Minutos de actividad',
    unit: 'minutos',
    recommendedDailyGoal: 45,
  },
  {
    id: 'alimentacion_saludable',
    name: 'Alimentación saludable',
    icon: '🥗',
    goalLabel: 'Comidas saludables',
    unit: 'comidas',
    recommendedDailyGoal: 3,
  },
  {
    id: 'descanso',
    name: 'Descanso',
    icon: '😴',
    goalLabel: 'Horas de sueño',
    unit: 'horas',
    recommendedDailyGoal: 8,
  },
  {
    id: 'temperancia',
    name: 'Temperancia',
    icon: '⚖️',
    goalLabel: 'Evitar excesos durante el día',
    unit: 'check',
    recommendedDailyGoal: 1,
  },
  {
    id: 'espiritualidad',
    name: 'Espiritualidad',
    icon: '🙏',
    goalLabel: 'Minutos de actividad espiritual',
    unit: 'minutos',
    recommendedDailyGoal: 10,
  },
];

export const DAILY_TIPS: Record<string, string> = {
  agua: 'Empieza el día con un vaso de agua para activar tu metabolismo.',
  aire_puro: 'Camina 10 minutos al aire libre tras cada comida principal.',
  luz_solar: 'Busca exposición matutina para mejorar tu ritmo circadiano.',
  ejercicio: 'Acumula movimiento en bloques de 10-15 minutos.',
  alimentacion_saludable: 'Llena medio plato con verduras en cada comida.',
  descanso: 'Evita pantallas al menos 30 minutos antes de dormir.',
  temperancia: 'Prioriza la moderación en porciones y estímulos.',
  espiritualidad: 'Reserva un momento breve para gratitud y propósito.',
};
