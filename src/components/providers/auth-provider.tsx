"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApolloClient } from "@apollo/client/react";
import {
  clearAuth,
  getStoredUser,
  getToken,
  type StoredUser,
  setAuth,
} from "@/lib/auth";
import { resetSessionExpiredHandling } from "@/lib/session-expired";
import { markJustLoggedIn } from "@/lib/session-flash";

type AuthContextValue = {
  user: StoredUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: StoredUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setIsReady(true);
  }, []);

  const login = useCallback((token: string, nextUser: StoredUser) => {
    resetSessionExpiredHandling();
    markJustLoggedIn();
    setAuth(token, nextUser);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    void apolloClient.clearStore().finally(() => {
      router.replace("/login");
    });
  }, [router, apolloClient]);

  const value = useMemo(
    () => ({
      user,
      isReady,
      isAuthenticated: Boolean(getToken()),
      login,
      logout,
    }),
    [user, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
