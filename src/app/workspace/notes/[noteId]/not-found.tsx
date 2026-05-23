import { FileX2 } from "lucide-react";
import { StatusPage, StatusPageLink } from "@/components/layout/status-page";

export default function NoteNotFound() {
  return (
    <StatusPage
      icon={FileX2}
      title="Note not found"
      description="This page doesn't exist, was deleted, or you don't have access to it anymore."
      className="min-h-screen"
    >
      <StatusPageLink href="/workspace">All notes</StatusPageLink>
      <StatusPageLink href="/workspace?archived=1" variant="secondary">
        View archive
      </StatusPageLink>
    </StatusPage>
  );
}
