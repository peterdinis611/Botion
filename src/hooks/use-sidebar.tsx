"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ME_QUERY, UPDATE_MY_PREFERENCES_MUTATION } from "@/graphql/operations";
import type { MeQueryResult, UpdateMyPreferencesResult } from "@/graphql/types";
import {
  DEFAULT_PREFERENCES,
  readSidebarCollapsedFromStorage,
  writeSidebarCollapsedToStorage,
} from "@/lib/preferences";

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;
  ready: boolean;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: meData } = useQuery<MeQueryResult>(ME_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [updatePreferences] = useMutation<UpdateMyPreferencesResult>(
    UPDATE_MY_PREFERENCES_MUTATION,
  );

  useEffect(() => {
    if (hydrated.current) return;

    const stored = readSidebarCollapsedFromStorage();
    if (stored !== null) {
      setCollapsedState(stored);
      hydrated.current = true;
      setReady(true);
      return;
    }

    const server = meData?.me?.preferences?.sidebarCollapsed;
    if (server !== undefined) {
      setCollapsedState(server);
      writeSidebarCollapsedToStorage(server);
      hydrated.current = true;
      setReady(true);
    }
  }, [meData?.me?.preferences?.sidebarCollapsed]);

  const persistCollapsed = useCallback(
    (next: boolean) => {
      writeSidebarCollapsedToStorage(next);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void updatePreferences({
          variables: { input: { sidebarCollapsed: next } },
        });
      }, 400);
    },
    [updatePreferences],
  );

  const setCollapsed = useCallback(
    (value: boolean) => {
      setCollapsedState(value);
      persistCollapsed(value);
    },
    [persistCollapsed],
  );

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      persistCollapsed(next);
      return next;
    });
  }, [persistCollapsed]);

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed,
      ready,
    }),
    [collapsed, setCollapsed, toggleCollapsed, ready],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    return {
      collapsed: DEFAULT_PREFERENCES.sidebarCollapsed,
      setCollapsed: () => {},
      toggleCollapsed: () => {},
      ready: true,
    };
  }
  return ctx;
}
