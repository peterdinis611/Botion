import { FolderSearch } from "lucide-react";
import { StatusPage, StatusPageLink } from "@/components/layout/status-page";

export default function WorkspaceNotFound() {
  return (
    <StatusPage
      code={404}
      icon={FolderSearch}
      title="Workspace view not found"
      description="The view you're looking for doesn't exist or was removed."
      hint="Use ⌘K to search notes, or pick one from the sidebar."
    >
      <StatusPageLink href="/workspace">All notes</StatusPageLink>
      <StatusPageLink href="/workspace?pinned=1" variant="secondary">
        Pinned notes
      </StatusPageLink>
    </StatusPage>
  );
}
