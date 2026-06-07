"use client";

import {
  KEYBOARD_SHORTCUTS,
  SHORTCUT_SCOPES,
  type ShortcutScope,
} from "@/lib/keyboard-shortcuts";
import { ShortcutKey } from "@/components/ui/shortcut-key";

const SCOPE_ORDER: ShortcutScope[] = ["global", "graph-editor", "editor"];

export function ShortcutsView() {
  return (
    <div className="space-y-6 pr-3">
      {SCOPE_ORDER.map((scope) => {
        const shortcuts = KEYBOARD_SHORTCUTS.filter((item) => item.scope === scope);
        if (shortcuts.length === 0) return null;

        const meta = SHORTCUT_SCOPES[scope];

        return (
          <section key={scope}>
            <div className="mb-2">
              <h2 className="text-sm font-semibold">{meta.title}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{meta.description}</p>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <ul className="divide-y divide-border">
                {shortcuts.map((shortcut) => (
                  <li
                    key={shortcut.id}
                    className="flex items-start justify-between gap-4 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{shortcut.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {shortcut.description}
                      </p>
                    </div>
                    <ShortcutKey keys={shortcut.keys} className="shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
