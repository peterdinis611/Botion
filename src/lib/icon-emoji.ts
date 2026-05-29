const LEADING_EMOJI_RE = /^(\p{Extended_Pictographic}\uFE0F?)\s+/u;

export function splitLeadingEmoji(value: string): { emoji: string | null; label: string } {
  const trimmed = value.trim();
  if (!trimmed) return { emoji: null, label: "" };
  const match = trimmed.match(LEADING_EMOJI_RE);
  if (match) {
    return { emoji: match[1], label: trimmed.slice(match[0].length).trim() };
  }
  return { emoji: null, label: trimmed };
}

export function joinWithLeadingEmoji(emoji: string | null | undefined, label: string): string {
  const base = label.trim() || "Untitled";
  if (!emoji) return base;
  const { label: withoutEmoji } = splitLeadingEmoji(base);
  const clean = withoutEmoji || base;
  return `${emoji} ${clean}`;
}

export function pickRandomEmoji(emojis: readonly string[]): string {
  return emojis[Math.floor(Math.random() * emojis.length)] ?? "✨";
}

export function displayStoredTitle(stored: string, fallback = "Untitled"): string {
  const { label } = splitLeadingEmoji(stored);
  if (label) return label;
  const bare = stored.trim();
  return bare || fallback;
}
