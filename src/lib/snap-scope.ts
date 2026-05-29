export type SnapScope = "ALL" | "NOTEBOOK" | "NOTE";

export function getSnapQueryVariables(notebookId?: string, noteId?: string) {
  const scope: SnapScope = noteId ? "NOTE" : notebookId ? "NOTEBOOK" : "ALL";
  return {
    scope,
    notebookId: notebookId ?? undefined,
    noteId: noteId ?? undefined,
  };
}
