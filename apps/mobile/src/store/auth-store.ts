import { create } from "zustand";

import { User, UserRole } from "@food-delivery/types";

import { api } from "@/lib/axios";
import { deleteToken, getToken, saveToken } from "@/lib/auth";

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

  login: (email: string, password: string) => Promise<void>;

  register: (data: RegisterData) => Promise<void>;

  logout: () => Promise<void>;

  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isLoading: true,

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
}));
