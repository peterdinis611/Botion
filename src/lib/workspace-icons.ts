import { splitLeadingEmoji } from "@/lib/icon-emoji";

const NOTEBOOK_EMOJIS = ["🎯", "🏅", "🕐", "🎵", "❓", "💻", "📱", "📓", "✨", "🔮"];

const NAME_EMOJI: Record<string, string> = {
  "acme inc": "🎯",
  "acme inc.": "🎯",
  tasks: "😊",
  deadlines: "🕐",
  music: "🎵",
  questions: "❓",
  development: "💻",
  swift: "🐦",
};

export function notebookDisplayName(name: string): string {
  const { label } = splitLeadingEmoji(name);
  return label || name;
}

export function notebookEmoji(id: string, name?: string): string {
  if (name) {
    const { emoji } = splitLeadingEmoji(name);
    if (emoji) return emoji;
    const key = name.trim().toLowerCase();
    if (NAME_EMOJI[key]) return NAME_EMOJI[key];
  }
  const seed = name ?? id;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return NOTEBOOK_EMOJIS[Math.abs(hash) % NOTEBOOK_EMOJIS.length];
}

export function folderEmoji(id: string, name?: string): string {
  const seed = name ?? id;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const icons = ["📁", "🗂️", "📂"];
  return icons[Math.abs(hash) % icons.length];
}
