import { FolderSearch } from "lucide-react";
import { StatusPage, StatusPageLink } from "@/components/layout/status-page";

export default function WorkspaceNotFound() {
  return (
    <StatusPage
      icon={FolderSearch}
      title="Workspace page not found"
      description="The view you're looking for doesn't exist. Pick a note from the sidebar or search with ⌘K."
      className="min-h-screen"
    >
      <StatusPageLink href="/workspace">All notes</StatusPageLink>
      <StatusPageLink href="/workspace?pinned=1" variant="secondary">
        Pinned notes
      </StatusPageLink>
    </StatusPage>
  );
}
