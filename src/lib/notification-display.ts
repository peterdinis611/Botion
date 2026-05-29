import type { Notification } from "@/graphql/types";

export type ParsedNotificationMetadata = {
  role?: string;
  inviteId?: string;
  email?: string;
  ownerUserId?: string;
  ownerName?: string;
  noteId?: string;
  noteTitle?: string;
  memberUserId?: string;
};

export function parseNotificationMetadata(
  raw?: string | null,
): ParsedNotificationMetadata | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;
    const out: ParsedNotificationMetadata = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string") {
        (out as Record<string, string>)[key] = value;
      }
    }
    return out;
  } catch {
    return null;
  }
}

export function notificationTitle(notification: Notification) {
  switch (notification.type) {
    case "WORKSPACE_INVITE":
      return "Workspace invitation";
    case "NOTE_SHARED":
      return "Document shared with you";
    default:
      return notification.type.replace(/_/g, " ").toLowerCase();
  }
}

export function canAcceptWorkspaceInvite(
  notification: Notification,
  metadata: ParsedNotificationMetadata | null,
) {
  return (
    notification.type === "WORKSPACE_INVITE" &&
    metadata?.role === "received" &&
    Boolean(metadata.inviteId)
  );
}

export function canOpenSharedNote(
  notification: Notification,
  metadata: ParsedNotificationMetadata | null,
) {
  return notification.type === "NOTE_SHARED" && Boolean(metadata?.noteId);
}

export function notificationNotePath(metadata: ParsedNotificationMetadata | null) {
  if (!metadata?.noteId) return null;
  return `/workspace/notes/${metadata.noteId}`;
}
