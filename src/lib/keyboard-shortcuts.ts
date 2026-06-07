export type ShortcutScope = "global" | "graph-editor" | "editor";

export type KeyboardShortcut = {
  id: string;
  keys: string;
  label: string;
  description: string;
  scope: ShortcutScope;
};

export const SHORTCUT_SCOPES: Record<ShortcutScope, { title: string; description: string }> = {
  global: {
    title: "Global",
    description: "Available anywhere in the workspace.",
  },
  "graph-editor": {
    title: "Graph editor",
    description: "Active while editing a graph canvas.",
  },
  editor: {
    title: "Page editor",
    description: "Built-in BlockNote shortcuts while editing page content.",
  },
};

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    id: "command-palette",
    keys: "Mod+K",
    label: "Quick find",
    description: "Open the command palette to search pages, notebooks, and actions.",
    scope: "global",
  },
  {
    id: "shortcuts-dialog",
    keys: "Mod+/",
    label: "Keyboard shortcuts",
    description: "Open the keyboard shortcuts reference dialog.",
    scope: "global",
  },
  {
    id: "graph-save",
    keys: "Mod+S",
    label: "Save graph",
    description: "Save the current graph layout and node changes.",
    scope: "graph-editor",
  },
  {
    id: "graph-duplicate",
    keys: "Mod+D",
    label: "Duplicate selection",
    description: "Duplicate the selected nodes or edges on the canvas.",
    scope: "graph-editor",
  },
  {
    id: "graph-delete",
    keys: "Delete",
    label: "Delete selection",
    description: "Remove selected nodes or edges from the canvas.",
    scope: "graph-editor",
  },
  {
    id: "graph-multi-select",
    keys: "Shift",
    label: "Multi-select",
    description: "Hold while dragging to select multiple items on the canvas.",
    scope: "graph-editor",
  },
  {
    id: "editor-bold",
    keys: "Mod+B",
    label: "Bold",
    description: "Toggle bold formatting on selected text.",
    scope: "editor",
  },
  {
    id: "editor-italic",
    keys: "Mod+I",
    label: "Italic",
    description: "Toggle italic formatting on selected text.",
    scope: "editor",
  },
  {
    id: "editor-underline",
    keys: "Mod+U",
    label: "Underline",
    description: "Toggle underline formatting on selected text.",
    scope: "editor",
  },
  {
    id: "editor-link",
    keys: "Mod+K",
    label: "Link",
    description: "Add or edit a link on selected text (inside the editor).",
    scope: "editor",
  },
];

export function shortcutsByScope(scope: ShortcutScope): KeyboardShortcut[] {
  return KEYBOARD_SHORTCUTS.filter((shortcut) => shortcut.scope === scope);
}
