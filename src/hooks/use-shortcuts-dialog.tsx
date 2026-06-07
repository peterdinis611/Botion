"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ShortcutsDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  openShortcuts: () => void;
};

const ShortcutsDialogContext = createContext<ShortcutsDialogContextValue | null>(null);

export function ShortcutsDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const openShortcuts = useCallback(() => setOpen(true), []);

  useHotkey("Mod+/", toggle);

  const value = useMemo(
    () => ({ open, setOpen, toggle, openShortcuts }),
    [open, toggle, openShortcuts],
  );

  return (
    <ShortcutsDialogContext.Provider value={value}>
      {children}
    </ShortcutsDialogContext.Provider>
  );
}

export function useShortcutsDialog() {
  const ctx = useContext(ShortcutsDialogContext);
  if (!ctx) {
    throw new Error("useShortcutsDialog must be used within ShortcutsDialogProvider");
  }
  return ctx;
}
