export const WORKSPACE_EMOJI_DEFAULTS = [
  "🎯",
  "🏠",
  "💼",
  "📓",
  "✨",
  "🚀",
  "💡",
  "🎨",
  "📱",
  "🔮",
] as const;

export const EMOJI_PICKER_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Work",
    emojis: ["🎯", "💼", "📊", "📈", "🗂️", "📁", "✅", "📌", "🔗", "💻"],
  },
  {
    label: "Life",
    emojis: ["🏠", "❤️", "🎉", "☕", "🌿", "✈️", "🎵", "📷", "🍳", "🏃"],
  },
  {
    label: "Creative",
    emojis: ["✨", "🎨", "💡", "🔮", "📝", "📓", "🖊️", "🎬", "🎭", "🌈"],
  },
  {
    label: "Tech",
    emojis: ["🚀", "📱", "⚙️", "🤖", "🧪", "🔧", "🌐", "🔒", "📡", "💾"],
  },
  {
    label: "Nature",
    emojis: ["🌸", "🌙", "☀️", "🌊", "🍀", "🦋", "🌵", "🔥", "❄️", "⭐"],
  },
];

export const ALL_PICKER_EMOJIS = [...new Set(EMOJI_PICKER_GROUPS.flatMap((g) => g.emojis))];

/** English + Slovak keywords for emoji search */
const EMOJI_KEYWORDS: Record<string, string[]> = {
  "🎯": ["target", "goal", "work", "ciel", "praca", "práca"],
  "💼": ["briefcase", "business", "office", "kancelaria", "kancelária"],
  "📊": ["chart", "stats", "data", "graf", "statistiky"],
  "📈": ["growth", "trend", "chart", "rast"],
  "🗂️": ["files", "organize", "cards", "subory", "súbory"],
  "📁": ["folder", "files", "priecinok", "priečinok"],
  "✅": ["check", "done", "task", "hotovo", "uloha", "úloha"],
  "📌": ["pin", "bookmark", "pinned", "pripnut"],
  "🔗": ["link", "url", "odkaz"],
  "💻": ["computer", "code", "dev", "laptop", "pocitac", "počítač"],
  "🏠": ["home", "house", "domov", "dom"],
  "❤️": ["heart", "love", "srdce", "laska", "láska"],
  "🎉": ["party", "celebrate", "party", "oslav"],
  "☕": ["coffee", "cafe", "kava", "káva"],
  "🌿": ["plant", "nature", "green", "rastlina"],
  "✈️": ["travel", "flight", "plane", "cestovanie", "let"],
  "🎵": ["music", "song", "hudba"],
  "📷": ["photo", "camera", "foto", "fotka"],
  "🍳": ["cook", "food", "kitchen", "varit", "jedlo"],
  "🏃": ["run", "sport", "fitness", "beh", "beh"],
  "✨": ["sparkle", "magic", "star", "hviezda", "iskra"],
  "🎨": ["art", "design", "paint", "umenie", "dizajn"],
  "💡": ["idea", "lightbulb", "bulb", "napad", "nápad"],
  "🔮": ["crystal", "future", "magic", "kristal", "kryštál"],
  "📝": ["note", "write", "memo", "poznamka", "poznámka"],
  "📓": ["notebook", "journal", "notes", "zošit", "zosít"],
  "🖊️": ["pen", "write", "pero"],
  "🎬": ["movie", "film", "video", "film"],
  "🎭": ["theater", "drama", "divadlo"],
  "🌈": ["rainbow", "color", "dúha", "duha"],
  "🚀": ["rocket", "launch", "startup", "raketa"],
  "📱": ["phone", "mobile", "app", "telefon", "telefón"],
  "⚙️": ["settings", "gear", "config", "nastavenia"],
  "🤖": ["robot", "ai", "bot"],
  "🧪": ["lab", "science", "experiment", "veda"],
  "🔧": ["tool", "fix", "wrench", "nastroj", "nástroj"],
  "🌐": ["web", "internet", "global", "siet", "sieť"],
  "🔒": ["lock", "secure", "private", "zamok", "zámok"],
  "📡": ["signal", "broadcast", "antenna"],
  "💾": ["save", "disk", "storage", "ulozit", "uložiť"],
  "🌸": ["flower", "spring", "kvet"],
  "🌙": ["moon", "night", "mesiac", "noc", "noc"],
  "☀️": ["sun", "day", "slnko", "den", "deň"],
  "🌊": ["wave", "ocean", "water", "more", "môre"],
  "🍀": ["clover", "luck", "stastie", "šťastie"],
  "🦋": ["butterfly", "motyl", "motýľ"],
  "🌵": ["cactus", "desert", "kaktus"],
  "🔥": ["fire", "hot", "trending", "ohen", "oheň"],
  "❄️": ["snow", "cold", "winter", "sneh", "zima"],
  "⭐": ["star", "favorite", "favourite", "hviezda", "obľúbené"],
};

const GROUP_LABEL_KEYWORDS: Record<string, string[]> = {
  Work: ["work", "office", "business", "praca", "práca", "práca"],
  Life: ["life", "home", "personal", "zivot", "život", "osobne", "osobné"],
  Creative: ["creative", "art", "design", "tvorive", "tvorivé"],
  Tech: ["tech", "code", "dev", "software", "technologia", "technológia"],
  Nature: ["nature", "plant", "outdoor", "priroda", "príroda"],
};

const EMOJI_REGEX = /^\p{Extended_Pictographic}(\uFE0F?)$/u;

export function searchPickerEmojis(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  if (EMOJI_REGEX.test(query.trim())) {
    return [query.trim()];
  }

  const found = new Set<string>();

  for (const emoji of ALL_PICKER_EMOJIS) {
    const keywords = EMOJI_KEYWORDS[emoji] ?? [];
    if (keywords.some((k) => k.includes(q)) || emoji.includes(q)) {
      found.add(emoji);
    }
  }

  for (const group of EMOJI_PICKER_GROUPS) {
    const labelKeys = GROUP_LABEL_KEYWORDS[group.label] ?? [group.label.toLowerCase()];
    if (labelKeys.some((k) => k.includes(q)) || group.label.toLowerCase().includes(q)) {
      group.emojis.forEach((e) => found.add(e));
    }
  }

  return [...found];
}
