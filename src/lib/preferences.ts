export const SIDEBAR_COLLAPSED_STORAGE_KEY = "botion.sidebarCollapsed";

export type UserPreferences = {
  sidebarCollapsed: boolean;
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  sidebarCollapsed: false,
};

export function readSidebarCollapsedFromStorage(): boolean | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return null;
}

export function writeSidebarCollapsedToStorage(collapsed: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(collapsed));
}
