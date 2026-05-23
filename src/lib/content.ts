import type { PartialBlock } from "@blocknote/core";

export const BLOCK_CONTENT_PREFIX = "__BOTION_BLOCKS:v1__";

/** Strip tags / blocks for previews and search. */
export function stripHtml(html: string): string {
  if (!html) return "";

  const blocks = parseBlockContent(html);
  if (blocks) {
    return blocks
      .map((block) => extractTextFromBlock(block))
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (!html.trim().startsWith("<")) return html.trim();
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTextFromBlock(block: PartialBlock): string {
  const content = block.content;
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          return String((item as { text: string }).text);
        }
        return "";
      })
      .join("");
  }
  return "";
}

export function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

export function isBlockContent(content: string): boolean {
  return content.startsWith(BLOCK_CONTENT_PREFIX) || isBlockJsonArray(content);
}

function isBlockJsonArray(content: string): boolean {
  if (!content.trim().startsWith("[")) return false;
  try {
    const parsed = JSON.parse(content) as unknown;
    return (
      Array.isArray(parsed) &&
      (parsed.length === 0 ||
        (typeof parsed[0] === "object" &&
          parsed[0] !== null &&
          "type" in (parsed[0] as object)))
    );
  } catch {
    return false;
  }
}

export function parseBlockContent(content: string): PartialBlock[] | null {
  if (!content) return null;

  try {
    if (content.startsWith(BLOCK_CONTENT_PREFIX)) {
      return JSON.parse(content.slice(BLOCK_CONTENT_PREFIX.length)) as PartialBlock[];
    }
    if (isBlockJsonArray(content)) {
      return JSON.parse(content) as PartialBlock[];
    }
  } catch {
    return null;
  }
  return null;
}

export function serializeBlockContent(blocks: PartialBlock[]): string {
  return BLOCK_CONTENT_PREFIX + JSON.stringify(blocks);
}

export function excerpt(content: string, max = 80): string {
  const text = stripHtml(content);
  if (!text) return "Empty";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
