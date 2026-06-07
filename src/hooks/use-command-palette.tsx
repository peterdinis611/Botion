"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  openPalette: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const openPalette = useCallback(() => setOpen(true), []);

  useHotkey("Mod+K", toggle);

  const value = useMemo(
    () => ({ open, setOpen, toggle, openPalette }),
    [open, toggle, openPalette],
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }
  return ctx;
}
