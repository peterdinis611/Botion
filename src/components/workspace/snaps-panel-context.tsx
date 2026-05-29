"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SnapsPanelContextValue = {
  addDialogOpen: boolean;
  customiseDialogOpen: boolean;
  prefillFile: File | null;
  setAddDialogOpen: (open: boolean) => void;
  setCustomiseDialogOpen: (open: boolean) => void;
  openAddSnap: () => void;
  openAddSnapWithFile: (file: File) => void;
  openCustomise: () => void;
  clearPrefillFile: () => void;
};

const SnapsPanelContext = createContext<SnapsPanelContextValue | null>(null);

export function SnapsPanelProvider({ children }: { children: React.ReactNode }) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [customiseDialogOpen, setCustomiseDialogOpen] = useState(false);
  const [prefillFile, setPrefillFile] = useState<File | null>(null);

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
      setAddDialogOpen,
      setCustomiseDialogOpen,
      openAddSnap,
      openAddSnapWithFile,
      openCustomise: () => setCustomiseDialogOpen(true),
      clearPrefillFile,
    }),
    [
      addDialogOpen,
      customiseDialogOpen,
      prefillFile,
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
