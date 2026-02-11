import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../service/authService";
import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email: string;
  profileImage: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  register: (username: string, email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
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
        set({
          user: response.user,
          token: response.token,
          isLoading: false,
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

  logout: () => {
    set({ user: null, token: null });
  },
}));
