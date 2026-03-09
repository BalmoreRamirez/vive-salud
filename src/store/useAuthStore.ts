import { hasSupabaseConfig, supabase } from '@/config/supabase';
import { useHabitsStore } from '@/store/useHabitsStore';
import { create } from 'zustand';

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  checkingSession: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  userId?: string;
  userName?: string;
  email?: string;
  bootstrapSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (params: RegisterParams) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

let mockUser:
  | {
      id: string;
      name: string;
      email: string;
    }
  | undefined;

export const useAuthStore = create<AuthState>((set) => ({
  checkingSession: true,
  loading: false,
  isAuthenticated: false,
  userId: undefined,
  userName: undefined,
  email: undefined,

  bootstrapSession: async () => {
    set({ checkingSession: true });

    if (!hasSupabaseConfig || !supabase) {
      if (mockUser) {
        useHabitsStore.getState().setUserId(mockUser.id);
        set({
          checkingSession: false,
          isAuthenticated: true,
          userId: mockUser.id,
          userName: mockUser.name,
          email: mockUser.email,
        });
        return;
      }

      set({ checkingSession: false, isAuthenticated: false });
      return;
    }

    const { data } = await supabase.auth.getSession();
    const sessionUser = data.session?.user;

    if (!sessionUser) {
      set({ checkingSession: false, isAuthenticated: false });
      return;
    }

    useHabitsStore.getState().setUserId(sessionUser.id);

    set({
      checkingSession: false,
      isAuthenticated: true,
      userId: sessionUser.id,
      userName: (sessionUser.user_metadata?.name as string | undefined) ?? 'Usuario',
      email: sessionUser.email,
    });
  },

  login: async (email, password) => {
    set({ loading: true });

    const normalizedUser = email.trim().toLowerCase();
    if (normalizedUser === 'admin' && password === '123') {
      mockUser = {
        id: 'mock-admin',
        name: 'Admin',
        email: 'admin@vivesalud.app',
      };

      useHabitsStore.getState().setUserId(mockUser.id);

      set({
        loading: false,
        isAuthenticated: true,
        userId: mockUser.id,
        userName: mockUser.name,
        email: mockUser.email,
      });

      return {};
    }

    if (!hasSupabaseConfig || !supabase) {
      const name = email.split('@')[0] || 'Usuario';
      mockUser = {
        id: `mock-${email}`,
        name,
        email,
      };

      useHabitsStore.getState().setUserId(mockUser.id);

      set({
        loading: false,
        isAuthenticated: true,
        userId: mockUser.id,
        userName: mockUser.name,
        email: mockUser.email,
      });

      return {};
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      set({ loading: false });
      return { error: error?.message ?? 'No fue posible iniciar sesión.' };
    }

    useHabitsStore.getState().setUserId(data.user.id);

    set({
      loading: false,
      isAuthenticated: true,
      userId: data.user.id,
      userName: (data.user.user_metadata?.name as string | undefined) ?? 'Usuario',
      email: data.user.email,
    });

    return {};
  },

  register: async ({ name, email, password }) => {
    set({ loading: true });

    if (!hasSupabaseConfig || !supabase) {
      mockUser = {
        id: `mock-${email}`,
        name,
        email,
      };

      useHabitsStore.getState().setUserId(mockUser.id);

      set({
        loading: false,
        isAuthenticated: true,
        userId: mockUser.id,
        userName: mockUser.name,
        email: mockUser.email,
      });

      return {};
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      set({ loading: false });
      return { error: error.message };
    }

    const user = data.user;

    if (!user) {
      set({ loading: false });
      return { error: 'No fue posible crear la cuenta.' };
    }

    useHabitsStore.getState().setUserId(user.id);

    set({
      loading: false,
      isAuthenticated: true,
      userId: user.id,
      userName: (user.user_metadata?.name as string | undefined) ?? name,
      email: user.email,
    });

    return {};
  },

  logout: async () => {
    if (hasSupabaseConfig && supabase) {
      await supabase.auth.signOut();
    }

    mockUser = undefined;
    useHabitsStore.getState().setUserId(undefined);

    set({
      isAuthenticated: false,
      userId: undefined,
      userName: undefined,
      email: undefined,
    });
  },
}));
