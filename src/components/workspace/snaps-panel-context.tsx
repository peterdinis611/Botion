"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SnapsPanelContextValue = {
  addDialogOpen: boolean;
  customiseDialogOpen: boolean;
  prefillFile: File | null;
  snapsOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  setCustomiseDialogOpen: (open: boolean) => void;
  setSnapsOpen: (open: boolean) => void;
  toggleSnaps: () => void;
  openAddSnap: () => void;
  openAddSnapWithFile: (file: File) => void;
  openCustomise: () => void;
  clearPrefillFile: () => void;
};

const SNAPS_OPEN_KEY = "botion-snaps-open";

function readSnapsOpen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SNAPS_OPEN_KEY) === "1";
  } catch {
    return false;
  }
}

const SnapsPanelContext = createContext<SnapsPanelContextValue | null>(null);

export function SnapsPanelProvider({ children }: { children: React.ReactNode }) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [customiseDialogOpen, setCustomiseDialogOpen] = useState(false);
  const [prefillFile, setPrefillFile] = useState<File | null>(null);
  const [snapsOpen, setSnapsOpenState] = useState(false);

  const setSnapsOpen = useCallback((open: boolean) => {
    setSnapsOpenState(open);
    try {
      localStorage.setItem(SNAPS_OPEN_KEY, open ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSnaps = useCallback(() => {
    setSnapsOpenState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SNAPS_OPEN_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    setSnapsOpenState(readSnapsOpen());
  }, []);

  const openAddSnap = useCallback(() => {
    setAddDialogOpen(true);
  }, []);

  const openAddSnapWithFile = useCallback((file: File) => {
    setPrefillFile(file);
    setAddDialogOpen(true);
  }, []);

  const clearPrefillFile = useCallback(() => setPrefillFile(null), []);

  const value = useMemo(
    () => ({
      addDialogOpen,
      customiseDialogOpen,
      prefillFile,
      snapsOpen,
      setAddDialogOpen,
      setCustomiseDialogOpen,
      setSnapsOpen,
      toggleSnaps,
      openAddSnap,
      openAddSnapWithFile,
      openCustomise: () => setCustomiseDialogOpen(true),
      clearPrefillFile,
    }),
    [
      addDialogOpen,
      customiseDialogOpen,
      prefillFile,
      snapsOpen,
      setSnapsOpen,
      toggleSnaps,
      openAddSnap,
      openAddSnapWithFile,
      clearPrefillFile,
    ],
  );

  return (
    <SnapsPanelContext.Provider value={value}>{children}</SnapsPanelContext.Provider>
  );
}

export function useSnapsPanel() {
  const ctx = useContext(SnapsPanelContext);
  if (!ctx) {
    throw new Error("useSnapsPanel must be used within SnapsPanelProvider");
  }
  return ctx;
}

export function useSnapsPanelOptional() {
  return useContext(SnapsPanelContext);
}
