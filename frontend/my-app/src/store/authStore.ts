import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../service/authService";
import { create } from "zustand";

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  authChecked: boolean;
  register: (username: string, email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  authChecked: false,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await authService.register(username, email, password);

      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.token,
        isLoading: false,
        authChecked: true,
      });

      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(email, password);

      if (response.user && response.token) {
        await AsyncStorage.setItem("token", response.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.user));

        set({
          user: response.user,
          token: response.token,
          isLoading: false,
          authChecked: true,
        });
      } else {
        set({ isLoading: false });
      }

      return response;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");

      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          authChecked: true,
        });
      } else {
        set({ authChecked: true });
      }
    } catch {
      set({ authChecked: true });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ user: null, token: null, authChecked: true });
  },
}));
