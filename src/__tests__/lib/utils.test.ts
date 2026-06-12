import { describe, expect, it } from "vitest";
import { KEYBOARD_SHORTCUTS, shortcutsByScope } from "@/lib/keyboard-shortcuts";
import { cn } from "@/lib/utils";
import {
  buildWorkspaceHref,
  hasListFilters,
  parseWorkspaceFilters,
} from "@/lib/workspace-url";

describe("cn", () => {
  it("merges tailwind classes and resolves conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});

describe("shortcutsByScope", () => {
  it("returns only global shortcuts for global scope", () => {
    const shortcuts = shortcutsByScope("global");
    expect(shortcuts.every((item) => item.scope === "global")).toBe(true);
    expect(shortcuts.some((item) => item.id === "command-palette")).toBe(true);
  });

  it("keeps unique shortcut ids", () => {
    const ids = KEYBOARD_SHORTCUTS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("workspace url helpers", () => {
  it("parses workspace filters from search params", () => {
    const filters = parseWorkspaceFilters(
      new URLSearchParams("notebook=nb1&pinned=1&archived=1&tag=tag1"),
    );

    expect(filters).toEqual({
      notebookId: "nb1",
      folderId: undefined,
      pinned: true,
      archived: true,
      tagId: "tag1",
    });
  });

  it("detects active list filters", () => {
    expect(hasListFilters({ archived: true })).toBe(true);
    expect(hasListFilters({})).toBe(false);
  });

  it("builds href with cleared filters", () => {
    const href = buildWorkspaceHref(new URLSearchParams("tag=tag1&pinned=1"), {
      archived: true,
      clearTag: true,
      clearPinned: true,
    });

    expect(href).toBe("/workspace?archived=1");
  });
});
