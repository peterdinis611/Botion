import type { WorkspaceCollaborator } from "@/graphql/types";

const AVATAR_COLORS = [
  "bg-[#c45c5c]",
  "bg-[#5c8fc4]",
  "bg-[#c4a55c]",
  "bg-[#8c5cc4]",
  "bg-[#5cc48f]",
  "bg-[#c45c9a]",
];

export function collaboratorInitials(collaborator: WorkspaceCollaborator) {
  const name = collaborator.name?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  const local = collaborator.email.split("@")[0] ?? "";
  return (local.slice(0, 2) || "??").toUpperCase();
}

export function collaboratorColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % 997;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function collaboratorLabel(collaborator: WorkspaceCollaborator) {
  if (collaborator.name?.trim()) return collaborator.name.trim();
  return collaborator.email;
}

export function collaboratorRoleLabel(
  status: WorkspaceCollaborator["status"],
  permission?: string | null,
) {
  switch (status) {
    case "PENDING_INVITE":
      return "Invite pending";
    case "NOTE_COLLABORATOR":
      return permission === "WRITE" ? "Can edit this page" : "Page access";
    case "MEMBER":
      return "Workspace · shared pages";
    case "SELF":
      return "You";
    default:
      return "Member";
  }
}
