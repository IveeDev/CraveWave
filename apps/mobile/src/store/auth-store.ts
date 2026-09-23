import { create } from "zustand";

import { User, UserRole } from "@food-delivery/types";

import { api } from "@/lib/axios";
import { deleteToken, getToken, saveToken } from "@/lib/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "has_seen_onboarding";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  profileImageUrl?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean | null; // null = not checked yet

  login: (email: string, password: string) => Promise<void>;

  register: (data: RegisterData) => Promise<void>;

  logout: () => Promise<void>;

  restoreSession: () => Promise<void>;
  checkOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  hasCompletedOnboarding: null,

  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { user, token } = response.data;

    await saveToken(token);

    set({
      user,
    });
  },

  register: async (data) => {
    const response = await api.post("/auth/register", data);

    const { user, token } = response.data;

    await saveToken(token);

    set({
      user,
    });
  },

  logout: async () => {
    await deleteToken();

    set({
      user: null,
    });
  },

  restoreSession: async () => {
    try {
      const token = await getToken();

      if (!token) {
        set({
          user: null,
          isLoading: false,
        });

        return;
      }

      const response = await api.get("/auth/me");

      set({
        user: response.data,
        isLoading: false,
      });
    } catch (error) {
      await deleteToken();

      set({
        user: null,
        isLoading: false,
      });
    }
  },

  checkOnboarding: async () => {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    set({ hasCompletedOnboarding: value === "true" });
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    set({ hasCompletedOnboarding: true });
  },
}));
