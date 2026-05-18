import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { type AppUser } from "@/interfaces/user";

interface UsersAuthState {
  user: AppUser | null;
  token: string | null;
  isRefreshing: boolean;
  isHydrated: boolean;
  setUser: (token: string) => void;
  refreshUser?: () => Promise<void>;
  logOut: () => void;
}

interface DecodedToken {
  data: AppUser;
  iat: number;
  exp: number;
}

export const useUsersAuthStore = create<UsersAuthState>((set) => {
  const getUserFromToken = (token: string | null): AppUser | null => {
    if (!token) return null;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.data;
    } catch {
      return null;
    }
  };
  const initialToken = localStorage.getItem("token");

  return {
    token: localStorage.getItem("token"),
    user: getUserFromToken(initialToken),
    isRefreshing: false,
    isHydrated: true,

    setUser: (token: string) => {
      if (token) {
        localStorage.setItem("token", token);
        const userPayload = getUserFromToken(token);
        set({ user: userPayload, token });
      } else {
        set({ user: null, token: null });
      }
    },

    logOut: () => {
      localStorage.removeItem("token");
      set({ user: null, token: null });
    },
  };
});