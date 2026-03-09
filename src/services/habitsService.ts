import { HABITS } from '@/constants/habits';
import { hasSupabaseConfig, supabase } from '@/config/supabase';
import { HabitKey, HabitLog, HabitSummary } from '@/types/habit';

export interface WeeklyProgressPoint {
  date: string;
  label: string;
  completedHabits: number;
  totalHabits: number;
}

const ONE_DAY_MS = 86400000;
const DAILY_STREAK_TARGET = 4;

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDateOffset(daysAgo: number): string {
  return toDateString(new Date(Date.now() - ONE_DAY_MS * daysAgo));
}

function getGoalByHabitId(habitId: HabitKey): number {
  return HABITS.find((habit) => habit.id === habitId)?.recommendedDailyGoal ?? 1;
}

function groupTotalsByDateAndHabit(logs: HabitLog[]): Record<string, Record<HabitKey, number>> {
  return logs.reduce((accumulator, log) => {
    if (!accumulator[log.date]) {
      accumulator[log.date] = {} as Record<HabitKey, number>;
    }

    const current = accumulator[log.date][log.habitId] ?? 0;
    accumulator[log.date][log.habitId] = current + log.value;

    return accumulator;
  }, {} as Record<string, Record<HabitKey, number>>);
}

function getCompletedHabitsCount(date: string, totalsByDate: Record<string, Record<HabitKey, number>>): number {
  return HABITS.filter((habit) => {
    const value = totalsByDate[date]?.[habit.id] ?? 0;
    return value >= habit.recommendedDailyGoal;
  }).length;
}

function getHabitStreakDays(habitId: HabitKey, totalsByDate: Record<string, Record<HabitKey, number>>): number {
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const date = toDateString(cursor);
    const value = totalsByDate[date]?.[habitId] ?? 0;
    const goal = getGoalByHabitId(habitId);

    if (value < goal) {
      break;
    }

    streak += 1;
    cursor = new Date(cursor.getTime() - ONE_DAY_MS);
  }

  return streak;
}

function buildDailySummaryFromLogs(logs: HabitLog[]): HabitSummary[] {
  const today = toDateString(new Date());
  const totalsByDate = groupTotalsByDateAndHabit(logs);

  return HABITS.map((habit) => ({
    habitId: habit.id,
    currentValue: Number((totalsByDate[today]?.[habit.id] ?? 0).toFixed(2)),
    goalValue: habit.recommendedDailyGoal,
    streakDays: getHabitStreakDays(habit.id, totalsByDate),
  }));
}

function getCurrentStreakFromLogs(logs: HabitLog[]): number {
  const totalsByDate = groupTotalsByDateAndHabit(logs);
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const date = toDateString(cursor);
    const completedHabits = getCompletedHabitsCount(date, totalsByDate);

    if (completedHabits < DAILY_STREAK_TARGET) {
      break;
    }

    streak += 1;
    cursor = new Date(cursor.getTime() - ONE_DAY_MS);
  }

  return streak;
}

function getHistoricalBestStreakFromLogs(logs: HabitLog[]): number {
  const totalsByDate = groupTotalsByDateAndHabit(logs);
  const dates = Object.keys(totalsByDate).sort((a, b) => a.localeCompare(b));

  if (!dates.length) return 0;

  let best = 0;
  let current = 0;
  let previousDate: string | undefined;

  dates.forEach((date) => {
    const completedHabits = getCompletedHabitsCount(date, totalsByDate);
    if (completedHabits < DAILY_STREAK_TARGET) {
      current = 0;
      previousDate = date;
      return;
    }

    if (!previousDate) {
      current = 1;
      best = Math.max(best, current);
      previousDate = date;
      return;
    }

    const prevTime = new Date(`${previousDate}T00:00:00Z`).getTime();
    const currentTime = new Date(`${date}T00:00:00Z`).getTime();
    const diffDays = Math.round((currentTime - prevTime) / ONE_DAY_MS);

    if (diffDays === 1) {
      current += 1;
    } else {
      current = 1;
    }

    best = Math.max(best, current);
    previousDate = date;
  });

  return best;
}

function getWeeklyDateRange(): string[] {
  return Array.from({ length: 7 }).map((_, offset) => getDateOffset(6 - offset));
}

function seedMockLogs(): HabitLog[] {
  const logs: HabitLog[] = [];

  const pushLog = (dayOffset: number, habitId: HabitKey, value: number, suffix: string) => {
    logs.push({
      id: `mock-${habitId}-${dayOffset}-${suffix}`,
      habitId,
      value,
      date: getDateOffset(dayOffset),
    });
  };

  [0, 1, 2, 3, 4, 5, 6].forEach((dayOffset) => {
    pushLog(dayOffset, 'agua', 6 + (dayOffset % 3), 'a');
    pushLog(dayOffset, 'aire_puro', 10 + (dayOffset % 2) * 5, 'b');
    pushLog(dayOffset, 'luz_solar', 5 + (dayOffset % 2) * 5, 'c');
    pushLog(dayOffset, 'ejercicio', 15 + (dayOffset % 3) * 5, 'd');
    pushLog(dayOffset, 'alimentacion_saludable', 1 + (dayOffset % 2), 'e');
    pushLog(dayOffset, 'descanso', 6.5 + (dayOffset % 2), 'f');
    pushLog(dayOffset, 'temperancia', dayOffset % 3 === 0 ? 0 : 1, 'g');
    pushLog(dayOffset, 'espiritualidad', dayOffset % 2 === 0 ? 10 : 5, 'h');
  });

  return logs;
}

let mockLogsData: HabitLog[] = seedMockLogs();

async function getLogsFromSupabase(userId: string, fromDate: string): Promise<HabitLog[] | undefined> {
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from('habit_logs')
    .select('id, habit_id, value, date')
    .eq('user_id', userId)
    .gte('date', fromDate)
    .order('date', { ascending: false });

  if (error || !data) {
    return undefined;
  }

  return data.map((row) => ({
    id: row.id,
    habitId: row.habit_id,
    value: row.value,
    date: row.date,
  }));
}

export async function getDailySummary(userId?: string): Promise<HabitSummary[]> {
  if (!hasSupabaseConfig || !supabase || !userId) {
    return buildDailySummaryFromLogs(mockLogsData);
  }

  const fromDate = getDateOffset(45);
  const logs = await getLogsFromSupabase(userId, fromDate);

  if (!logs) {
    return buildDailySummaryFromLogs(mockLogsData);
  }

  return buildDailySummaryFromLogs(logs);
}

export async function getHabitLogs(habitId: string, userId?: string): Promise<HabitLog[]> {
  if (!hasSupabaseConfig || !supabase || !userId) {
    return mockLogsData
      .filter((log) => log.habitId === habitId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);
  }

  const { data, error } = await supabase
    .from('habit_logs')
    .select('id, habit_id, value, date')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(10);

  if (error || !data) {
    return mockLogsData
      .filter((log) => log.habitId === habitId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);
  }

  return data.map((row) => ({
    id: row.id,
    habitId: row.habit_id,
    value: row.value,
    date: row.date,
  }));
}

export async function addHabitLog(params: {
  habitId: string;
  value: number;
  userId?: string;
}): Promise<void> {
  const today = toDateString(new Date());

  if (!hasSupabaseConfig || !supabase || !params.userId) {
    mockLogsData = [
      {
        id: `mock-${params.habitId}-${Date.now()}`,
        habitId: params.habitId as HabitKey,
        value: params.value,
        date: today,
      },
      ...mockLogsData,
    ];
    return;
  }

  await supabase.from('habit_logs').insert({
    habit_id: params.habitId,
    value: params.value,
    user_id: params.userId,
    date: today,
  });
}

export async function getCurrentStreak(userId?: string): Promise<number> {
  if (!hasSupabaseConfig || !supabase || !userId) {
    return getCurrentStreakFromLogs(mockLogsData);
  }

  const fromDate = getDateOffset(90);
  const logs = await getLogsFromSupabase(userId, fromDate);

  if (!logs) {
    return getCurrentStreakFromLogs(mockLogsData);
  }

  return getCurrentStreakFromLogs(logs);
}

export async function getWeeklyCompletedHabits(userId?: string): Promise<number> {
  const weeklyDates = getWeeklyDateRange();
  const fromDate = weeklyDates[0];

  const logs = (!hasSupabaseConfig || !supabase || !userId)
    ? mockLogsData.filter((log) => log.date >= fromDate)
    : (await getLogsFromSupabase(userId, fromDate)) ?? mockLogsData.filter((log) => log.date >= fromDate);

  const totalsByDate = groupTotalsByDateAndHabit(logs);

  return HABITS.filter((habit) => weeklyDates.some((date) => {
    const value = totalsByDate[date]?.[habit.id] ?? 0;
    return value >= habit.recommendedDailyGoal;
  })).length;
}

export async function getHistoricalBestStreak(userId?: string): Promise<number> {
  if (!hasSupabaseConfig || !supabase || !userId) {
    return getHistoricalBestStreakFromLogs(mockLogsData);
  }

  const fromDate = getDateOffset(180);
  const logs = await getLogsFromSupabase(userId, fromDate);

  if (!logs) {
    return getHistoricalBestStreakFromLogs(mockLogsData);
  }

  return getHistoricalBestStreakFromLogs(logs);
}

export async function getWeeklyProgress(userId?: string): Promise<WeeklyProgressPoint[]> {
  const weeklyDates = getWeeklyDateRange();
  const fromDate = weeklyDates[0];
  const dayLabels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const logs = (!hasSupabaseConfig || !supabase || !userId)
    ? mockLogsData.filter((log) => log.date >= fromDate)
    : (await getLogsFromSupabase(userId, fromDate)) ?? mockLogsData.filter((log) => log.date >= fromDate);

  const totalsByDate = groupTotalsByDateAndHabit(logs);

  return weeklyDates.map((date) => {
    const day = new Date(`${date}T00:00:00`).getDay();

    return {
      date,
      label: dayLabels[day],
      completedHabits: getCompletedHabitsCount(date, totalsByDate),
      totalHabits: HABITS.length,
    };
  });
}
