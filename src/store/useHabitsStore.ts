import { HABITS } from '@/constants/habits';
import {
  addHabitLog,
  getCurrentStreak,
  getDailySummary,
  getHabitsCatalog,
  getHistoricalBestStreak,
  getHabitLogs,
  getWeeklyCompletedHabits,
  getWeeklyProgress,
  WeeklyProgressPoint,
} from '@/services/habitsService';
import { Habit, HabitLog, HabitSummary } from '@/types/habit';
import { create } from 'zustand';

interface HabitsState {
  userId?: string;
  loading: boolean;
  currentStreak: number;
  historicalBestStreak: number;
  weeklyCompletedHabits: number;
  weeklyProgress: WeeklyProgressPoint[];
  habits: Habit[];
  summary: HabitSummary[];
  logsByHabit: Record<string, HabitLog[]>;
  setUserId: (userId?: string) => void;
  loadSummary: () => Promise<void>;
  loadHabitLogs: (habitId: string) => Promise<void>;
  registerHabitProgress: (habitId: string, value: number) => Promise<{ error?: string }>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  userId: undefined,
  loading: false,
  currentStreak: 0,
  historicalBestStreak: 0,
  weeklyCompletedHabits: 0,
  weeklyProgress: [],
  habits: HABITS,
  summary: HABITS.map((habit) => ({
    habitId: habit.id,
    currentValue: 0,
    goalValue: habit.recommendedDailyGoal,
    streakDays: 0,
  })),
  logsByHabit: {},
  setUserId: (userId) => set({ userId }),
  loadSummary: async () => {
    set({ loading: true });
    const [habits, result, streak, historicalBestStreak, weeklyCount, weeklyProgress] = await Promise.all([
      getHabitsCatalog(),
      getDailySummary(get().userId),
      getCurrentStreak(get().userId),
      getHistoricalBestStreak(get().userId),
      getWeeklyCompletedHabits(get().userId),
      getWeeklyProgress(get().userId),
    ]);

    set({
      habits,
      summary: result,
      currentStreak: streak,
      historicalBestStreak,
      weeklyCompletedHabits: weeklyCount,
      weeklyProgress,
      loading: false,
    });
  },
  loadHabitLogs: async (habitId) => {
    const logs = await getHabitLogs(habitId, get().userId);
    set((state) => ({
      logsByHabit: {
        ...state.logsByHabit,
        [habitId]: logs,
      },
    }));
  },
  registerHabitProgress: async (habitId, value) => {
    await addHabitLog({ habitId, value, userId: get().userId });
    await get().loadSummary();
    await get().loadHabitLogs(habitId);

    return {};
  },
}));
