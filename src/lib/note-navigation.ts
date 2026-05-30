import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { buildWorkspacePath, type WorkspaceFilters } from "@/lib/workspace-url";

export type NoteActionResult = "trash" | "restore" | "permanent-delete";

export function navigateAfterNoteAction(
  router: AppRouterInstance,
  filters: WorkspaceFilters,
  action: NoteActionResult,
) {
  switch (action) {
    case "trash":
      router.push(
        buildWorkspacePath("/workspace", {
          ...filters,
          archived: true,
          pinned: false,
          tagId: undefined,
        }),
      );
      break;
    case "restore":
      router.push(
        buildWorkspacePath("/workspace", {
          ...filters,
          archived: false,
        }),
      );
      break;
    case "permanent-delete":
      router.push(
        buildWorkspacePath("/workspace", {
          ...filters,
          archived: true,
        }),
      );
      break;
  }
}
