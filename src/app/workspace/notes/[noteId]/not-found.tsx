import { FileX2 } from "lucide-react";
import { StatusPage, StatusPageLink } from "@/components/layout/status-page";

export default function NoteNotFound() {
  return (
    <StatusPage
      code={404}
      icon={FileX2}
      title="Page not found"
      description="This page doesn't exist, was deleted, or you no longer have access."
      hint="Check Trash if you recently removed it."
    >
      <StatusPageLink href="/workspace">All notes</StatusPageLink>
      <StatusPageLink href="/workspace?archived=1" variant="secondary">
        View trash
      </StatusPageLink>
    </StatusPage>
  );
}
