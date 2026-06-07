export const PAGE_COLORS = [
  "#ffffff",
  "#f7f7f5",
  "#f3f4f6",
  "#e5e7eb",
  "#fef9c3",
  "#fef3c7",
  "#ffedd5",
  "#fee2e2",
  "#fce7f3",
  "#fbcfe8",
  "#f3e8ff",
  "#ede9fe",
  "#dcfce7",
  "#d1fae5",
  "#ccfbf1",
  "#e0f2fe",
  "#dbeafe",
  "#e8ecff",
  "#e7e5e4",
  "#fde68a",
] as const;

export const COLOR_LABELS: Record<(typeof PAGE_COLORS)[number], string> = {
  "#ffffff": "White",
  "#f7f7f5": "Default gray",
  "#f3f4f6": "Light gray",
  "#e5e7eb": "Gray",
  "#fef9c3": "Soft yellow",
  "#fef3c7": "Yellow",
  "#ffedd5": "Peach",
  "#fee2e2": "Rose",
  "#fce7f3": "Pink",
  "#fbcfe8": "Blush",
  "#f3e8ff": "Lilac",
  "#ede9fe": "Lavender",
  "#dcfce7": "Green",
  "#d1fae5": "Mint green",
  "#ccfbf1": "Teal",
  "#e0f2fe": "Sky blue",
  "#dbeafe": "Blue",
  "#e8ecff": "Indigo",
  "#e7e5e4": "Stone",
  "#fde68a": "Amber",
};

export const DEFAULT_CUSTOM_COLOR = "#6366f1";

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return `#${trimmed.toLowerCase()}`;
  }
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const hex = trimmed.slice(1);
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toLowerCase();
  }
  return null;
}

export function isPresetColor(value: string): boolean {
  const normalized = normalizeHex(value);
  if (!normalized) return false;
  return PAGE_COLORS.some((preset) => preset === normalized);
}

export function resolveCustomColor(value: string): string {
  return normalizeHex(value) ?? DEFAULT_CUSTOM_COLOR;
}
