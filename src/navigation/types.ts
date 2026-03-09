import { HabitKey } from '@/types/habit';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  HabitDetail: { habitId: HabitKey };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Progreso: undefined;
  Perfil: undefined;
};
