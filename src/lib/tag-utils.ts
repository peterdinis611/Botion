/** Display name with optional # prefix for UI chips. */
export function formatTagLabel(name: string, withHash = true): string {
  const n = name.trim().replace(/^#+/, "");
  return withHash ? `#${n}` : n;
}

export function normalizeTagInput(name: string): string {
  return name.trim().replace(/^#+/, "").toLowerCase();
}
